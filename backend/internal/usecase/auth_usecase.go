package usecase

import (
	"codeabroad/backend/internal/config"
	"codeabroad/backend/internal/domain"

	"context"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"time"
)

// JWTClaims defines the token payload claims
type JWTClaims struct {
	UserID   string `json:"user_id"`
	Email    string `json:"email"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type authUsecase struct {
	userRepo    domain.UserRepository
	sessionRepo domain.SessionRepository
	cfg         *config.Config
}

// NewAuthUsecase creates a new authentication usecase instance
func NewAuthUsecase(
	userRepo domain.UserRepository,
	sessionRepo domain.SessionRepository,
	cfg *config.Config,
) domain.AuthUsecase {
	return &authUsecase{
		userRepo:    userRepo,
		sessionRepo: sessionRepo,
		cfg:         cfg,
	}
}

// Register creates a new user account, hashes the password, and returns auth tokens
func (u *authUsecase) Register(ctx context.Context, req *domain.RegisterRequest) (*domain.AuthResponse, error) {
	// 1. Check if email already exists
	existingEmail, err := u.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to check existing email: %w", err)
	}
	if existingEmail != nil {
		return nil, domain.ErrEmailAlreadyExists
	}

	// 2. Check if username already exists
	existingUsername, err := u.userRepo.GetByUsername(ctx, req.Username)
	if err != nil {
		return nil, fmt.Errorf("failed to check existing username: %w", err)
	}
	if existingUsername != nil {
		return nil, domain.ErrUsernameTaken
	}

	// 3. Hash the password using Bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// 4. Construct user entity
	newUser := &domain.User{
		Name:         req.Name,
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		Level:        "beginner",
		XP:           0,
		CurrentLevel: 1,
		Streak:       0,
		IsOnboarded:  false,
	}

	// 5. Persist user into database
	if err := u.userRepo.Create(ctx, newUser); err != nil {
		return nil, fmt.Errorf("failed to persist user: %w", err)
	}

	// 6. Generate JWT token pair
	sessionTTL := time.Duration(u.cfg.JWTRefreshExpirationDays) * 24 * time.Hour
	accessToken, refreshToken, err := u.generateTokenPair(newUser, sessionTTL)
	if err != nil {
		return nil, fmt.Errorf("failed to generate auth tokens: %w", err)
	}

	// 7. Store refresh token session via session repository
	if err := u.sessionRepo.SetSession(ctx, newUser.ID, refreshToken, sessionTTL); err != nil {
		return nil, fmt.Errorf("failed to store session: %w", err)
	}

	return &domain.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         *newUser,
	}, nil
}

// Login authenticates credentials and returns new auth tokens
func (u *authUsecase) Login(ctx context.Context, req *domain.LoginRequest) (*domain.AuthResponse, error) {
	// 1. Find user by email
	user, err := u.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to lookup user: %w", err)
	}
	if user == nil {
		return nil, domain.ErrInvalidCredentials
	}

	// 2. Verify password with Bcrypt hash
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, domain.ErrInvalidCredentials
	}

	// 3. Determine session TTL based on RememberMe flag
	var sessionTTL time.Duration
	if req.RememberMe {
		// Persistent session (configured days, default 30 days)
		sessionTTL = time.Duration(u.cfg.JWTRefreshExpirationDays) * 24 * time.Hour
	} else {
		// Temporary session (24 hours)
		sessionTTL = 24 * time.Hour
	}

	// 4. Generate new JWT token pair with dynamic TTL
	accessToken, refreshToken, err := u.generateTokenPair(user, sessionTTL)
	if err != nil {
		return nil, fmt.Errorf("failed to generate auth tokens: %w", err)
	}

	// 5. Update session in session repository with dynamic TTL
	if err := u.sessionRepo.SetSession(ctx, user.ID, refreshToken, sessionTTL); err != nil {
		return nil, fmt.Errorf("failed to store session: %w", err)
	}

	return &domain.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         *user,
	}, nil
}

// RefreshToken validates an existing refresh token and generates a new pair (token rotation)
func (u *authUsecase) RefreshToken(ctx context.Context, refreshToken string) (*domain.AuthResponse, error) {
	// 1. Parse and validate the token
	token, err := jwt.ParseWithClaims(refreshToken, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(u.cfg.JWTSecret), nil
	})

	if err != nil || !token.Valid {
		return nil, domain.ErrTokenExpired
	}
	claims, ok := token.Claims.(*JWTClaims)
	if !ok {
		return nil, domain.ErrTokenExpired
	}

	// 2. Verify if the refresh token matches the active session
	storedToken, err := u.sessionRepo.GetSession(ctx, claims.UserID)
	if err != nil || storedToken != refreshToken {
		return nil, domain.ErrTokenExpired
	}

	// 3. Retrieve user details
	user, err := u.userRepo.GetByID(ctx, claims.UserID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	if user == nil {
		return nil, domain.ErrUserNotFound
	}

	// 4. Generate new token pair (Token Rotation)
	sessionTTL := time.Duration(u.cfg.JWTRefreshExpirationDays) * 24 * time.Hour
	newAccessToken, newRefreshToken, err := u.generateTokenPair(user, sessionTTL)
	if err != nil {
		return nil, fmt.Errorf("failed to generate auth tokens: %w", err)
	}

	// 5. Update session in Redis with the new refresh token
	if err := u.sessionRepo.SetSession(ctx, user.ID, newRefreshToken, sessionTTL); err != nil {
		return nil, fmt.Errorf("failed to update session: %w", err)
	}
	return &domain.AuthResponse{
		AccessToken:  newAccessToken,
		RefreshToken: newRefreshToken,
		User:         *user,
	}, nil

}

// GetProfile retrieves the profile details for a given user ID
func (u *authUsecase) GetProfile(ctx context.Context, userID string) (*domain.User, error) {
	user, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user profile: %w", err)
	}
	if user == nil {
		return nil, domain.ErrUserNotFound
	}
	return user, nil
}

// Logout invalidates the active user session in the cache
func (u *authUsecase) Logout(ctx context.Context, userID string) error {
	if userID == "" {
		return domain.ErrUnauthorized
	}
	return u.sessionRepo.DeleteSession(ctx, userID)
}

// generateTokenPair produces a signed access token and dynamic duration refresh token
func (u *authUsecase) generateTokenPair(user *domain.User, refreshDuration time.Duration) (string, string, error) {
	now := time.Now()

	// 1. Create Access Token (short-lived)
	accessClaims := &JWTClaims{
		UserID:   user.ID,
		Email:    user.Email,
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(time.Duration(u.cfg.JWTAccessExpirationMinutes) * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Subject:   user.ID,
		},
	}

	accessTokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessToken, err := accessTokenObj.SignedString([]byte(u.cfg.JWTSecret))
	if err != nil {
		return "", "", fmt.Errorf("failed to sign access token: %w", err)
	}

	// 2. Create Refresh Token with dynamic duration
	refreshClaims := &JWTClaims{
		UserID:   user.ID,
		Email:    user.Email,
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(refreshDuration)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Subject:   user.ID,
		},
	}

	refreshTokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshToken, err := refreshTokenObj.SignedString([]byte(u.cfg.JWTSecret))
	if err != nil {
		return "", "", fmt.Errorf("failed to sign refresh token: %w", err)
	}

	return accessToken, refreshToken, nil
}
