package auth

import (
	"codeabroad/backend/internal/config"
	"codeabroad/backend/internal/domain"
	"fmt"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// Helper encapsulates cryptographic, token generation, and login streak rules (DDD)
type Helper struct {
	cfg *config.Config
}

// NewHelper creates a new Auth Helper instance
func NewHelper(cfg *config.Config) *Helper {
	return &Helper{cfg: cfg}
}

// NormalizeRegisterInput trims whitespace and normalizes email to lowercase
func (h *Helper) NormalizeRegisterInput(req *domain.RegisterRequest) {
	req.Name = strings.TrimSpace(req.Name)
	req.Username = strings.TrimSpace(req.Username)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
}

// NormalizeLoginInput trims whitespace and normalizes email to lowercase
func (h *Helper) NormalizeLoginInput(req *domain.LoginRequest) {
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
}

// HashPassword hashes a plaintext password using Bcrypt
func (h *Helper) HashPassword(rawPassword string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(rawPassword), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return string(hashed), nil
}

// VerifyPassword compares a Bcrypt hashed password with a plaintext candidate
func (h *Helper) VerifyPassword(hashedPassword, rawPassword string) error {
	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(rawPassword)); err != nil {
		return domain.ErrInvalidCredentials
	}
	return nil
}

// ResolveSessionTTL determines refresh session TTL based on RememberMe preference
func (h *Helper) ResolveSessionTTL(rememberMe bool) time.Duration {
	if rememberMe {
		return time.Duration(h.cfg.JWTRefreshExpirationDays) * 24 * time.Hour
	}
	return 24 * time.Hour
}

// DefaultRefreshTTL returns the configured default refresh token TTL
func (h *Helper) DefaultRefreshTTL() time.Duration {
	return time.Duration(h.cfg.JWTRefreshExpirationDays) * 24 * time.Hour
}

// EvaluateLoginStreak calculates the updated daily streak upon login
func (h *Helper) EvaluateLoginStreak(currentStreak int, lastActiveAt *time.Time, now time.Time) (newStreak int, changed bool) {
	todayStr := now.Format("2006-01-02")
	yesterdayStr := now.AddDate(0, 0, -1).Format("2006-01-02")

	newStreak = currentStreak
	if lastActiveAt == nil {
		newStreak = 1
	} else {
		lastDate := lastActiveAt.Format("2006-01-02")
		if lastDate == yesterdayStr {
			newStreak = currentStreak + 1
		} else if lastDate != todayStr {
			newStreak = 1
		} else if currentStreak == 0 {
			newStreak = 1
		}
	}

	return newStreak, newStreak != currentStreak
}

// BuildNewUser constructs a clean initial 3-Pillar User entity for registration
func (h *Helper) BuildNewUser(req *domain.RegisterRequest, hashedPassword string) *domain.User {
	return &domain.User{
		UserAccount: domain.UserAccount{
			Email:        req.Email,
			PasswordHash: hashedPassword,
		},
		UserProfile: domain.UserProfile{
			Name:        req.Name,
			Username:    req.Username,
			IsOnboarded: false,
		},
		UserGamificationStats: domain.UserGamificationStats{
			XP:           0,
			CurrentLevel: 1,
			Streak:       0,
		},
	}
}

// GenerateTokenPair produces a signed access token and dynamic duration refresh token
func (h *Helper) GenerateTokenPair(user *domain.User, refreshDuration time.Duration) (string, string, error) {
	now := time.Now()

	accessClaims := &domain.JWTClaims{
		UserID:   user.ID,
		Email:    user.Email,
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(time.Duration(h.cfg.JWTAccessExpirationMinutes) * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Subject:   user.ID,
		},
	}

	accessTokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessToken, err := accessTokenObj.SignedString([]byte(h.cfg.JWTSecret))
	if err != nil {
		return "", "", fmt.Errorf("failed to sign access token: %w", err)
	}

	refreshClaims := &domain.JWTClaims{
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
	refreshToken, err := refreshTokenObj.SignedString([]byte(h.cfg.JWTSecret))
	if err != nil {
		return "", "", fmt.Errorf("failed to sign refresh token: %w", err)
	}

	return accessToken, refreshToken, nil
}

// ParseRefreshToken parses and validates a JWT refresh token and returns its claims
func (h *Helper) ParseRefreshToken(refreshToken string) (*domain.JWTClaims, error) {
	token, err := jwt.ParseWithClaims(refreshToken, &domain.JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(h.cfg.JWTSecret), nil
	})

	if err != nil || !token.Valid {
		return nil, domain.ErrTokenExpired
	}

	claims, ok := token.Claims.(*domain.JWTClaims)
	if !ok {
		return nil, domain.ErrTokenExpired
	}
	return claims, nil
}
