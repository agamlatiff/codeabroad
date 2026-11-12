package auth

import (
	"codeabroad/backend/internal/config"
	"codeabroad/backend/internal/domain"
	"context"
	"errors"
	"fmt"
	"time"
)

type usecase struct {
	userRepo    domain.UserRepository
	sessionRepo domain.SessionRepository
	helper      *Helper
}

// New creates a new Auth Usecase instance conforming to domain.AuthUsecase
func New(
	userRepo domain.UserRepository,
	sessionRepo domain.SessionRepository,
	cfg *config.Config,
) domain.AuthUsecase {
	return &usecase{
		userRepo:    userRepo,
		sessionRepo: sessionRepo,
		helper:      NewHelper(cfg),
	}
}

// Register creates a new user account, hashes the password, and returns auth tokens
func (u *usecase) Register(ctx context.Context, req *domain.RegisterRequest) (*domain.AuthResponse, error) {
	u.helper.NormalizeRegisterInput(req)

	existingEmail, err := u.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to check existing email: %w", err)
	}
	if existingEmail != nil {
		return nil, domain.ErrEmailAlreadyExists
	}

	existingUsername, err := u.userRepo.GetByUsername(ctx, req.Username)
	if err != nil {
		return nil, fmt.Errorf("failed to check existing username: %w", err)
	}
	if existingUsername != nil {
		return nil, domain.ErrUsernameTaken
	}

	hashedPassword, err := u.helper.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	newUser := u.helper.BuildNewUser(req, hashedPassword)
	if err := u.userRepo.Create(ctx, newUser); err != nil {
		if errors.Is(err, domain.ErrEmailAlreadyExists) || errors.Is(err, domain.ErrUsernameTaken) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to persist user: %w", err)
	}

	sessionTTL := u.helper.DefaultRefreshTTL()
	accessToken, refreshToken, err := u.helper.GenerateTokenPair(newUser, sessionTTL)
	if err != nil {
		return nil, fmt.Errorf("failed to generate auth tokens: %w", err)
	}

	if err := u.sessionRepo.SetSession(ctx, newUser.ID, refreshToken, sessionTTL); err != nil {
		return nil, fmt.Errorf("failed to store session: %w", err)
	}

	return &domain.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         *newUser,
	}, nil
}

// Login authenticates credentials, records attendance streak, and returns new auth tokens
func (u *usecase) Login(ctx context.Context, req *domain.LoginRequest) (*domain.AuthResponse, error) {
	u.helper.NormalizeLoginInput(req)

	user, err := u.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to lookup user: %w", err)
	}
	if user == nil {
		return nil, domain.ErrInvalidCredentials
	}

	if err := u.helper.VerifyPassword(user.PasswordHash, req.Password); err != nil {
		return nil, err
	}

	sessionTTL := u.helper.ResolveSessionTTL(req.RememberMe)
	accessToken, refreshToken, err := u.helper.GenerateTokenPair(user, sessionTTL)
	if err != nil {
		return nil, fmt.Errorf("failed to generate auth tokens: %w", err)
	}

	if err := u.sessionRepo.SetSession(ctx, user.ID, refreshToken, sessionTTL); err != nil {
		return nil, fmt.Errorf("failed to store session: %w", err)
	}

	now := time.Now().UTC()
	todayStr := now.Format("2006-01-02")
	_ = u.userRepo.LogActivity(ctx, &domain.UserActivityLog{
		UserID:       user.ID,
		ActivityType: "daily_login",
		XPEarned:     0,
		Metadata:     map[string]interface{}{"source": "login", "date": todayStr},
	})

	if newStreak, changed := u.helper.EvaluateLoginStreak(user.Streak, user.LastActiveAt, now); changed {
		user.Streak = newStreak
		_ = u.userRepo.UpdateGamification(ctx, user.ID, user.XP, user.CurrentLevel, newStreak, &now)
	}

	return &domain.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         *user,
	}, nil
}

// RefreshToken validates an existing refresh token and generates a new pair (token rotation)
func (u *usecase) RefreshToken(ctx context.Context, refreshToken string) (*domain.AuthResponse, error) {
	claims, err := u.helper.ParseRefreshToken(refreshToken)
	if err != nil {
		return nil, err
	}

	storedToken, err := u.sessionRepo.GetSession(ctx, claims.UserID)
	if err != nil || storedToken != refreshToken {
		return nil, domain.ErrTokenExpired
	}

	user, err := u.userRepo.GetByID(ctx, claims.UserID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}
	if user == nil {
		return nil, domain.ErrUserNotFound
	}

	sessionTTL := u.helper.DefaultRefreshTTL()
	newAccessToken, newRefreshToken, err := u.helper.GenerateTokenPair(user, sessionTTL)
	if err != nil {
		return nil, fmt.Errorf("failed to generate auth tokens: %w", err)
	}

	if err := u.sessionRepo.SetSession(ctx, user.ID, newRefreshToken, sessionTTL); err != nil {
		return nil, fmt.Errorf("failed to update session: %w", err)
	}

	return &domain.AuthResponse{
		AccessToken:  newAccessToken,
		RefreshToken: newRefreshToken,
		User:         *user,
	}, nil
}

// Logout invalidates the active user session in the cache
func (u *usecase) Logout(ctx context.Context, userID string) error {
	if userID == "" {
		return domain.ErrUnauthorized
	}
	return u.sessionRepo.DeleteSession(ctx, userID)
}
