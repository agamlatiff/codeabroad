package auth

import (
	"context"
	"crypto/subtle"
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	"codeabroad/backend/config"
	"codeabroad/backend/internal/app/user"
	"codeabroad/backend/internal/shared/apperror"
)

type usecase struct {
	userRepo    user.Repository
	sessionRepo SessionRepository
	helper      *Helper
}

// NewUsecase creates a new Auth Usecase instance
func NewUsecase(
	userRepo user.Repository,
	sessionRepo SessionRepository,
	cfg *config.Config,
) Usecase {
	return &usecase{
		userRepo:    userRepo,
		sessionRepo: sessionRepo,
		helper:      NewHelper(cfg),
	}
}

// Register creates a new user account, hashes the password, and returns auth tokens
func (u *usecase) Register(ctx context.Context, req *RegisterRequest) (*AuthResponse, error) {
	if req == nil {
		return nil, apperror.NewBadRequestError("INVALID_REQUEST", "registration request cannot be nil", nil)
	}

	u.helper.NormalizeRegisterInput(req)

	if err := u.helper.ValidateRegisterInput(req); err != nil {
		return nil, err
	}

	existingEmail, err := u.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to check existing email: %w", err)
	}
	if existingEmail != nil {
		return nil, user.ErrEmailAlreadyExists
	}

	existingUsername, err := u.userRepo.GetByUsername(ctx, req.Username)
	if err != nil {
		return nil, fmt.Errorf("failed to check existing username: %w", err)
	}
	if existingUsername != nil {
		return nil, user.ErrUsernameTaken
	}

	hashedPassword, err := u.helper.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	newUser := u.helper.BuildNewUser(req, hashedPassword)
	if err := u.userRepo.Create(ctx, newUser); err != nil {
		if errors.Is(err, user.ErrEmailAlreadyExists) || errors.Is(err, user.ErrUsernameTaken) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to persist user: %w", err)
	}

	sessionTTL := u.helper.DefaultRefreshTTL()
	sessionID := u.helper.GenerateSessionID()
	accessToken, refreshToken, err := u.helper.GenerateTokenPair(newUser, sessionID, sessionTTL, true)
	if err != nil {
		return nil, fmt.Errorf("failed to generate auth tokens: %w", err)
	}

	tokenHash := u.helper.HashToken(refreshToken)
	if err := u.sessionRepo.SetSession(ctx, newUser.ID, sessionID, tokenHash, sessionTTL); err != nil {
		// User creation has already committed; degrade gracefully instead of returning an ambiguous 500 that causes 409 conflicts on retry.
		log.Printf("[WARN] [auth.Register] failed to store session for user %s: %v", newUser.ID, err)
		refreshToken = ""
	}

	return &AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         *newUser,
	}, nil
}

// Login authenticates credentials, records attendance streak, and returns new auth tokens bound to a new device session
func (u *usecase) Login(ctx context.Context, req *LoginRequest) (*AuthResponse, error) {
	u.helper.NormalizeLoginInput(req)

	usr, err := u.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to lookup user: %w", err)
	}
	if usr == nil {
		// Mitigate timing-based user enumeration attacks: execute dummy bcrypt check (~70ms)
		u.helper.PerformDummyPasswordCheck(req.Password)
		return nil, ErrInvalidCredentials
	}

	if err := u.helper.VerifyPassword(usr.PasswordHash, req.Password); err != nil {
		return nil, err
	}

	sessionTTL := u.helper.ResolveSessionTTL(req.RememberMe)
	sessionID := u.helper.GenerateSessionID()
	accessToken, refreshToken, err := u.helper.GenerateTokenPair(usr, sessionID, sessionTTL, req.RememberMe)
	if err != nil {
		return nil, fmt.Errorf("failed to generate auth tokens: %w", err)
	}

	tokenHash := u.helper.HashToken(refreshToken)
	if err := u.sessionRepo.SetSession(ctx, usr.ID, sessionID, tokenHash, sessionTTL); err != nil {
		return nil, fmt.Errorf("failed to store session: %w", err)
	}

	now := time.Now().UTC()
	todayStr := now.In(u.helper.DefaultLocation()).Format("2006-01-02")
	if err := u.userRepo.LogActivity(ctx, &user.UserActivityLog{
		UserID:       usr.ID,
		ActivityType: "daily_login",
		XPEarned:     0,
		Metadata:     map[string]interface{}{"source": "login", "date": todayStr},
	}); err != nil {
		log.Printf("[WARN] [auth.Login] failed to log daily login activity for user %s: %v", usr.ID, err)
	}

	if newStreak, changed := u.helper.EvaluateLoginStreak(usr.Streak, usr.LastActiveAt, now); changed {
		usr.Streak = newStreak
		if err := u.userRepo.UpdateGamification(ctx, usr.ID, usr.XP, usr.CurrentLevel, newStreak, &now); err != nil {
			log.Printf("[WARN] [auth.Login] failed to update streak gamification for user %s: %v", usr.ID, err)
		}
	}

	return &AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         *usr,
	}, nil
}

// RefreshToken validates an existing refresh token and atomically rotates the session token pair
func (u *usecase) RefreshToken(ctx context.Context, refreshToken string) (*AuthResponse, error) {
	claims, err := u.helper.ParseRefreshToken(refreshToken)
	if err != nil {
		return nil, err
	}

	expectedHash := u.helper.HashToken(refreshToken)
	storedHash, err := u.sessionRepo.GetSession(ctx, claims.UserID, claims.SessionID)
	if err != nil {
		if errors.Is(err, ErrTokenExpired) {
			return nil, ErrTokenExpired
		}
		return nil, fmt.Errorf("failed to retrieve session: %w", err)
	}
	if subtle.ConstantTimeCompare([]byte(storedHash), []byte(expectedHash)) != 1 {
		// Token reuse detected: revoke the active session for this device.
		if delErr := u.sessionRepo.DeleteSession(ctx, claims.UserID, claims.SessionID); delErr != nil {
			log.Printf("[WARN] [auth.RefreshToken] failed to revoke compromised session %s for user %s: %v", claims.SessionID, claims.UserID, delErr)
		}
		return nil, ErrTokenExpired
	}

	usr, err := u.userRepo.GetByID(ctx, claims.UserID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}
	if usr == nil {
		if delErr := u.sessionRepo.DeleteSession(ctx, claims.UserID, claims.SessionID); delErr != nil {
			log.Printf("[WARN] [auth.RefreshToken] failed to delete orphaned session %s for missing user %s: %v", claims.SessionID, claims.UserID, delErr)
		}
		return nil, ErrTokenExpired
	}

	sessionTTL := u.helper.ResolveSessionTTL(claims.RememberMe)
	newAccessToken, newRefreshToken, err := u.helper.GenerateTokenPair(usr, claims.SessionID, sessionTTL, claims.RememberMe)
	if err != nil {
		return nil, fmt.Errorf("failed to generate auth tokens: %w", err)
	}

	newHash := u.helper.HashToken(newRefreshToken)
	if err := u.sessionRepo.RotateSession(ctx, usr.ID, claims.SessionID, expectedHash, newHash, sessionTTL); err != nil {
		if errors.Is(err, ErrTokenExpired) {
			return nil, ErrTokenExpired
		}
		return nil, fmt.Errorf("failed to rotate session: %w", err)
	}

	return &AuthResponse{
		AccessToken:  newAccessToken,
		RefreshToken: newRefreshToken,
		User:         *usr,
	}, nil
}

// Logout invalidates the active device session in Redis
func (u *usecase) Logout(ctx context.Context, userID string, sessionID string) error {
	if strings.TrimSpace(userID) == "" || strings.TrimSpace(sessionID) == "" {
		return apperror.ErrUnauthorized
	}
	return u.sessionRepo.DeleteSession(ctx, userID, sessionID)
}

// LogoutAll invalidates all active device sessions for the given user in Redis
func (u *usecase) LogoutAll(ctx context.Context, userID string) error {
	if strings.TrimSpace(userID) == "" {
		return apperror.ErrUnauthorized
	}
	return u.sessionRepo.DeleteAllSessions(ctx, userID)
}
