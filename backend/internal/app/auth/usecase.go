package auth

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	"merantalk/backend/config"
	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/progression"
)

type usecase struct {
	userRepo       user.Repository
	sessionRepo    SessionRepository
	helper         *Helper
	googleVerifier GoogleOAuthVerifier
}

// NewUsecase creates a new Auth Usecase instance
func NewUsecase(
	userRepo user.Repository,
	sessionRepo SessionRepository,
	cfg *config.Config,
) Usecase {
	var googleVerifier GoogleOAuthVerifier
	if cfg != nil {
		googleVerifier = NewGoogleOAuthVerifierWithOrigins(cfg.GoogleClientID, cfg.GoogleClientSecret, cfg.CORSAllowedOrigins)
	}
	return NewUsecaseWithGoogle(userRepo, sessionRepo, cfg, googleVerifier)
}

// NewUsecaseWithGoogle creates an Auth Usecase instance with an explicit Google OAuth verifier (useful for testing).
func NewUsecaseWithGoogle(
	userRepo user.Repository,
	sessionRepo SessionRepository,
	cfg *config.Config,
	googleVerifier GoogleOAuthVerifier,
) Usecase {
	return &usecase{
		userRepo:       userRepo,
		sessionRepo:    sessionRepo,
		helper:         NewHelper(cfg),
		googleVerifier: googleVerifier,
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

	var (
		wg               sync.WaitGroup
		existingEmail    *user.User
		existingUsername *user.User
		emailErr         error
		usernameErr      error
	)
	wg.Add(2)
	go func() {
		defer wg.Done()
		existingEmail, emailErr = u.userRepo.GetByEmail(ctx, req.Email)
	}()
	go func() {
		defer wg.Done()
		existingUsername, usernameErr = u.userRepo.GetByUsername(ctx, req.Username)
	}()
	wg.Wait()

	if emailErr != nil {
		return nil, fmt.Errorf("failed to check existing email: %w", emailErr)
	}
	if existingEmail != nil {
		return nil, user.ErrEmailAlreadyExists
	}
	if usernameErr != nil {
		return nil, fmt.Errorf("failed to check existing username: %w", usernameErr)
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
		// User creation has already committed; clear both tokens because AuthMiddlewareWithSessionCheck
		// fails closed without an active Redis session and would reject unstored access tokens with 401.
		log.Printf("[WARN] [auth.Register] failed to store session for user %s: %v", newUser.ID, err)
		accessToken = ""
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
	if req == nil {
		return nil, apperror.NewBadRequestError("INVALID_REQUEST", "login request cannot be nil", nil)
	}

	u.helper.NormalizeLoginInput(req)

	if req.Email == "" || len(req.Email) > 255 || strings.TrimSpace(req.Password) == "" || len([]byte(req.Password)) > 72 {
		return nil, ErrInvalidCredentials
	}

	usr, err := u.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to lookup user: %w", err)
	}
	if usr == nil {
		// Mitigate timing-based user enumeration attacks: execute dummy bcrypt check (~70ms)
		u.helper.PerformDummyPasswordCheck(req.Password)
		return nil, ErrInvalidCredentials
	}

	if strings.TrimSpace(usr.PasswordHash) == "" {
		// OAuth-only account has no local password; perform dummy bcrypt check to equalize timing.
		u.helper.PerformDummyPasswordCheck(req.Password)
		return nil, ErrInvalidCredentials
	}

	if err := u.helper.VerifyPassword(usr.PasswordHash, req.Password); err != nil {
		return nil, err
	}

	return u.issueSessionForUser(ctx, usr, req.RememberMe, true)
}

// GoogleAuth exchanges a Google authorization code, links or provisions the user account, and issues session tokens.
func (u *usecase) GoogleAuth(ctx context.Context, req *GoogleAuthRequest) (*AuthResponse, error) {
	if req == nil {
		return nil, apperror.NewBadRequestError("INVALID_REQUEST", "google authentication request cannot be nil", nil)
	}

	code := strings.TrimSpace(req.Code)
	if code == "" || len(code) > 2048 {
		return nil, ErrGoogleAuthFailed
	}

	if u.googleVerifier == nil {
		return nil, ErrGoogleOAuthNotConfigured
	}

	identity, err := u.googleVerifier.ExchangeAndVerify(ctx, code, req.RedirectURI)
	if err != nil {
		return nil, err
	}
	if identity == nil || strings.TrimSpace(identity.Subject) == "" || strings.TrimSpace(identity.Email) == "" {
		return nil, ErrGoogleAuthFailed
	}
	if !identity.EmailVerified {
		return nil, ErrGoogleEmailNotVerified
	}

	subject := strings.TrimSpace(identity.Subject)
	email := strings.ToLower(strings.TrimSpace(identity.Email))

	// 1. Existing OAuth link
	usr, err := u.userRepo.GetByOAuthProvider(ctx, OAuthProviderGoogle, subject)
	if err != nil {
		return nil, fmt.Errorf("failed to lookup google oauth account: %w", err)
	}
	if usr != nil {
		return u.issueSessionForUser(ctx, usr, req.RememberMe, true)
	}

	// 2. Existing user with matching email -> only auto-link verified local accounts to prevent pre-hijacking
	usr, err = u.userRepo.GetByEmail(ctx, email)
	if err != nil {
		return nil, fmt.Errorf("failed to lookup user by google email: %w", err)
	}
	if usr != nil {
		if !usr.EmailVerified {
			return nil, user.ErrLocalAccountUnverified
		}
		oauthAcc := &user.OAuthAccount{
			UserID:         usr.ID,
			Provider:       OAuthProviderGoogle,
			ProviderUserID: subject,
			Email:          email,
		}
		if linkErr := u.userRepo.LinkOAuthAccount(ctx, oauthAcc); linkErr != nil {
			if errors.Is(linkErr, user.ErrOAuthAccountConflict) {
				return nil, linkErr
			}
			return nil, fmt.Errorf("failed to link google oauth account: %w", linkErr)
		}
		return u.issueSessionForUser(ctx, usr, req.RememberMe, true)
	}

	// 3. New user provisioning with collision-safe username generation
	displayName := u.helper.SanitizeOAuthName(identity.Name, email)
	avatarURL := u.helper.SanitizeOAuthAvatarURL(identity.Picture)
	baseUsername := u.helper.BuildOAuthUsernameBase(email, displayName)

	for attempt := 0; attempt < 5; attempt++ {
		candidateUsername := baseUsername
		if attempt > 0 {
			candidateUsername = fmt.Sprintf("%s_%s", baseUsername, u.helper.GenerateOAuthUsernameSuffix())
		}

		newUser := u.helper.BuildNewOAuthUser(email, displayName, candidateUsername, avatarURL)
		oauthAcc := &user.OAuthAccount{
			Provider:       OAuthProviderGoogle,
			ProviderUserID: subject,
			Email:          email,
		}

		createErr := u.userRepo.CreateWithOAuth(ctx, newUser, oauthAcc)
		if createErr == nil {
			return u.issueSessionForUser(ctx, newUser, req.RememberMe, true)
		}
		if errors.Is(createErr, user.ErrUsernameTaken) {
			continue
		}
		if errors.Is(createErr, user.ErrEmailAlreadyExists) {
			existingUsr, lookupErr := u.userRepo.GetByEmail(ctx, email)
			if lookupErr != nil {
				return nil, fmt.Errorf("failed to reload existing user after conflict: %w", lookupErr)
			}
			if existingUsr != nil {
				if !existingUsr.EmailVerified {
					return nil, user.ErrLocalAccountUnverified
				}
				linkAcc := &user.OAuthAccount{
					UserID:         existingUsr.ID,
					Provider:       OAuthProviderGoogle,
					ProviderUserID: subject,
					Email:          email,
				}
				if linkErr := u.userRepo.LinkOAuthAccount(ctx, linkAcc); linkErr != nil {
					if errors.Is(linkErr, user.ErrOAuthAccountConflict) {
						return nil, linkErr
					}
					return nil, fmt.Errorf("failed to link concurrent google oauth account: %w", linkErr)
				}
				return u.issueSessionForUser(ctx, existingUsr, req.RememberMe, true)
			}
			return nil, createErr
		}
		if errors.Is(createErr, user.ErrOAuthAccountConflict) {
			existingOAuthUsr, lookupErr := u.userRepo.GetByOAuthProvider(ctx, OAuthProviderGoogle, subject)
			if lookupErr == nil && existingOAuthUsr != nil {
				return u.issueSessionForUser(ctx, existingOAuthUsr, req.RememberMe, true)
			}
			return nil, createErr
		}
		return nil, fmt.Errorf("failed to create google oauth user: %w", createErr)
	}

	return nil, user.ErrUsernameTaken
}

func (u *usecase) issueSessionForUser(ctx context.Context, usr *user.User, rememberMe bool, recordDailyLogin bool) (*AuthResponse, error) {
	sessionTTL := u.helper.ResolveSessionTTL(rememberMe)
	sessionID := u.helper.GenerateSessionID()
	accessToken, refreshToken, err := u.helper.GenerateTokenPair(usr, sessionID, sessionTTL, rememberMe)
	if err != nil {
		return nil, fmt.Errorf("failed to generate auth tokens: %w", err)
	}

	tokenHash := u.helper.HashToken(refreshToken)
	if err := u.sessionRepo.SetSession(ctx, usr.ID, sessionID, tokenHash, sessionTTL); err != nil {
		return nil, fmt.Errorf("failed to store session: %w", err)
	}

	if recordDailyLogin {
		now := time.Now().UTC()
		todayStr := progression.TodayWIBDateKey(now)
		startOfToday, startOfTomorrow := progression.WIBDayBounds(now)

		loggedNewDay, loginActErr := u.userRepo.EnsureDailyLogin(ctx, usr.ID, todayStr, startOfToday, startOfTomorrow)
		if loginActErr != nil {
			log.Printf("[WARN] [auth.issueSession] failed to record daily login activity for user %s: %v", usr.ID, loginActErr)
		}

		// EnsureDailyLogin already atomically updates streak (including Streak Freeze consumption) and last_active_at
		// in Postgres without touching XP/level; sync local response copy from authoritative DB state when available.
		syncedFromRepo := false
		if loginActErr == nil && (loggedNewDay || usr.LastActiveAt == nil) {
			if refreshed, refErr := u.userRepo.GetByID(ctx, usr.ID); refErr == nil && refreshed != nil {
				if refreshed.Streak > 0 || refreshed.LastActiveAt != nil {
					usr.Streak = refreshed.Streak
					if refreshed.LastActiveAt != nil {
						usr.LastActiveAt = refreshed.LastActiveAt
					} else {
						usr.LastActiveAt = &now
					}
					syncedFromRepo = true
				}
			}
		}
		if !syncedFromRepo {
			if loggedNewDay || usr.LastActiveAt == nil {
				newStreak, _ := u.helper.EvaluateLoginStreak(usr.Streak, usr.LastActiveAt, now)
				usr.Streak = newStreak
				usr.LastActiveAt = &now
			}
		}
	}

	return &AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         *usr,
	}, nil
}

// RefreshToken validates an existing refresh token and atomically rotates the session token pair in a single Redis operation
func (u *usecase) RefreshToken(ctx context.Context, refreshToken string) (*AuthResponse, error) {
	claims, err := u.helper.ParseRefreshToken(refreshToken)
	if err != nil {
		return nil, err
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

	expectedHash := u.helper.HashToken(refreshToken)
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
