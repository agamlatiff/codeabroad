package auth

import (
	"context"
	"time"

	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/apperror"
	"github.com/golang-jwt/jwt/v5"
)

// Specific Authentication & Session Errors
var (
	ErrInvalidCredentials = apperror.NewUnauthorizedError("INVALID_CREDENTIALS", "invalid email or password")
	ErrTokenExpired       = apperror.NewUnauthorizedError("TOKEN_EXPIRED", "token has expired or revoked")
	ErrInvalidUsername    = apperror.NewBadRequestError("INVALID_USERNAME", "username can only contain letters, numbers, underscores, and hyphens (3-30 characters)", nil)
	ErrInvalidName        = apperror.NewBadRequestError("INVALID_NAME", "name must be at least 2 characters", nil)
	ErrInvalidEmail       = apperror.NewBadRequestError("INVALID_EMAIL", "email is required", nil)
	ErrInvalidPassword          = apperror.NewBadRequestError("INVALID_PASSWORD", "password cannot be empty or whitespace only", nil)
	ErrPasswordTooLong          = apperror.NewBadRequestError("PASSWORD_TOO_LONG", "password must not exceed 72 bytes", nil)
	ErrGoogleOAuthNotConfigured = apperror.NewBadRequestError("GOOGLE_OAUTH_NOT_CONFIGURED", "masuk dengan Google belum diaktifkan pada server", nil)
	ErrGoogleAuthFailed         = apperror.NewUnauthorizedError("GOOGLE_AUTH_FAILED", "gagal memverifikasi akun Google, silakan coba lagi")
	ErrGoogleEmailNotVerified   = apperror.NewUnauthorizedError("GOOGLE_EMAIL_NOT_VERIFIED", "email pada akun Google belum terverifikasi")
)

// Token type identifiers embedded in JWT claims to prevent cross-token misuse
const (
	TokenTypeAccess  = "access"
	TokenTypeRefresh = "refresh"
)

// JWTClaims defines the cryptographic token payload claims shared across Auth Usecase and Middleware
type JWTClaims struct {
	UserID    string `json:"user_id"`
	SessionID string `json:"session_id,omitempty"`
	Email     string `json:"email"`
	Username  string `json:"username"`
	TokenType  string `json:"token_type"`
	RememberMe bool   `json:"remember_me,omitempty"`
	jwt.RegisteredClaims
}

// RegisterRequest defines the input payload for registering a new user
type RegisterRequest struct {
	Name     string `json:"name" binding:"required,min=2,max=100"`
	Username string `json:"username" binding:"required,min=3,max=30"`
	Email    string `json:"email" binding:"required,email,max=255"`
	Password string `json:"password" binding:"required,min=8,max=72"`
}

// LoginRequest defines the input payload for authenticating a user
type LoginRequest struct {
	Email      string `json:"email" binding:"required,email,max=255"`
	Password   string `json:"password" binding:"required,max=72"`
	RememberMe bool   `json:"remember_me"`
}

// RefreshTokenRequest defines the input payload for refreshing session tokens
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// GoogleAuthRequest defines the input payload for Google OAuth 2.0 authorization-code exchange
type GoogleAuthRequest struct {
	Code        string `json:"code" binding:"required"`
	RedirectURI string `json:"redirect_uri,omitempty"`
	RememberMe  bool   `json:"remember_me"`
}

// AuthResponse defines the payload returned upon successful authentication
type AuthResponse struct {
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	User         user.User `json:"user"`
}

// SessionRepository specifies the caching contract for active user sessions (Redis)
type SessionRepository interface {
	SetSession(ctx context.Context, userID string, sessionID string, tokenHash string, ttl time.Duration) error
	GetSession(ctx context.Context, userID string, sessionID string) (string, error)
	RotateSession(ctx context.Context, userID string, sessionID string, expectedTokenHash string, newTokenHash string, ttl time.Duration) error
	DeleteSession(ctx context.Context, userID string, sessionID string) error
	DeleteAllSessions(ctx context.Context, userID string) error
}

// Usecase specifies the business logic contract for authentication and session lifecycle
type Usecase interface {
	Register(ctx context.Context, req *RegisterRequest) (*AuthResponse, error)
	Login(ctx context.Context, req *LoginRequest) (*AuthResponse, error)
	GoogleAuth(ctx context.Context, req *GoogleAuthRequest) (*AuthResponse, error)
	RefreshToken(ctx context.Context, refreshToken string) (*AuthResponse, error)
	Logout(ctx context.Context, userID string, sessionID string) error
	LogoutAll(ctx context.Context, userID string) error
}
