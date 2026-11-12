package auth

import (
	"context"
	"time"

	"codeabroad/backend/internal/app/user"
	"codeabroad/backend/internal/shared/apperror"
	"github.com/golang-jwt/jwt/v5"
)

// Specific Authentication & Session Errors
var (
	ErrInvalidCredentials = apperror.NewUnauthorizedError("INVALID_CREDENTIALS", "invalid email or password")
	ErrTokenExpired       = apperror.NewUnauthorizedError("TOKEN_EXPIRED", "token has expired or revoked")
	ErrInvalidUsername    = apperror.NewBadRequestError("INVALID_USERNAME", "username can only contain letters, numbers, underscores, and hyphens (3-30 characters)", nil)
)

// JWTClaims defines the cryptographic token payload claims shared across Auth Usecase and Middleware
type JWTClaims struct {
	UserID    string `json:"user_id"`
	SessionID string `json:"session_id,omitempty"`
	Email     string `json:"email"`
	Username  string `json:"username"`
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

// AuthResponse defines the payload returned upon successful authentication
type AuthResponse struct {
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	User         user.User `json:"user"`
}

// SessionRepository specifies the caching contract for active user sessions (Redis)
type SessionRepository interface {
	SetSession(ctx context.Context, userID string, sessionID string, token string, ttl time.Duration) error
	GetSession(ctx context.Context, userID string, sessionID string) (string, error)
	DeleteSession(ctx context.Context, userID string, sessionID string) error
	DeleteAllSessions(ctx context.Context, userID string) error
}

// Usecase specifies the business logic contract for authentication and session lifecycle
type Usecase interface {
	Register(ctx context.Context, req *RegisterRequest) (*AuthResponse, error)
	Login(ctx context.Context, req *LoginRequest) (*AuthResponse, error)
	RefreshToken(ctx context.Context, refreshToken string) (*AuthResponse, error)
	Logout(ctx context.Context, userID string, sessionID string) error
	LogoutAll(ctx context.Context, userID string) error
}
