package auth

import (
	"crypto/rand"
	"fmt"
	"regexp"
	"strings"
	"time"

	"codeabroad/backend/config"
	"codeabroad/backend/internal/app/user"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// dummyPasswordHash is a pre-computed valid bcrypt hash used to equalize execution timing (~70ms)
// when a queried user does not exist, mitigating timing-based user enumeration attacks.
var dummyPasswordHash, _ = bcrypt.GenerateFromPassword([]byte("codeabroad-dummy-bcrypt-salt-for-timing-attack-protection"), bcrypt.DefaultCost)

// defaultAppLocation defines the primary application timezone (WIB / Asia/Jakarta: UTC+7) for streak date calculations.
var defaultAppLocation = time.FixedZone("WIB", 7*3600)

// usernameRegex validates standard alphanumeric, underscore, and hyphen handles (3-30 chars)
var usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_-]{3,30}$`)

// Helper encapsulates cryptographic, token generation, and login streak rules (DDD)
type Helper struct {
	cfg *config.Config
}

// NewHelper creates a new Auth Helper instance
func NewHelper(cfg *config.Config) *Helper {
	return &Helper{cfg: cfg}
}

// NormalizeRegisterInput trims whitespace and normalizes email & username to lowercase
func (h *Helper) NormalizeRegisterInput(req *RegisterRequest) {
	req.Name = strings.TrimSpace(req.Name)
	req.Username = strings.ToLower(strings.TrimSpace(req.Username))
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
}

// ValidateUsername checks if username matches alphanumeric, underscore, and hyphen format (3-30 chars)
func (h *Helper) ValidateUsername(username string) error {
	if !usernameRegex.MatchString(username) {
		return ErrInvalidUsername
	}
	return nil
}

// NormalizeLoginInput trims whitespace and normalizes email to lowercase
func (h *Helper) NormalizeLoginInput(req *LoginRequest) {
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
		return ErrInvalidCredentials
	}
	return nil
}

// PerformDummyPasswordCheck executes a real bcrypt comparison against a dummy hash
// to equalize execution time (~70ms) when an email does not exist in the database, preventing timing attacks.
func (h *Helper) PerformDummyPasswordCheck(rawPassword string) {
	_ = bcrypt.CompareHashAndPassword(dummyPasswordHash, []byte(rawPassword))
}

// GenerateSessionID produces a cryptographically secure UUID v4 identifier for each client device session
func (h *Helper) GenerateSessionID() string {
	var b [16]byte
	_, _ = rand.Read(b[:])
	b[6] = (b[6] & 0x0f) | 0x40 // RFC 4122 version 4
	b[8] = (b[8] & 0x3f) | 0x80 // RFC 4122 variant
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
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

// DefaultLocation returns the primary application timezone (WIB / UTC+7)
func (h *Helper) DefaultLocation() *time.Location {
	return defaultAppLocation
}

// EvaluateLoginStreak calculates the updated daily streak upon login adjusted to the primary application timezone (WIB)
func (h *Helper) EvaluateLoginStreak(currentStreak int, lastActiveAt *time.Time, now time.Time) (newStreak int, changed bool) {
	loc := defaultAppLocation
	nowLocal := now.In(loc)
	todayStr := nowLocal.Format("2006-01-02")
	yesterdayStr := nowLocal.AddDate(0, 0, -1).Format("2006-01-02")

	newStreak = currentStreak
	if lastActiveAt == nil {
		newStreak = 1
	} else {
		lastDate := lastActiveAt.In(loc).Format("2006-01-02")
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
func (h *Helper) BuildNewUser(req *RegisterRequest, hashedPassword string) *user.User {
	return &user.User{
		UserAccount: user.UserAccount{
			Email:        req.Email,
			PasswordHash: hashedPassword,
		},
		UserProfile: user.UserProfile{
			Name:        req.Name,
			Username:    req.Username,
			IsOnboarded: false,
		},
		UserGamificationStats: user.UserGamificationStats{
			XP:           0,
			CurrentLevel: 1,
			Streak:       0,
		},
	}
}

// GenerateTokenPair produces a signed access token and dynamic duration refresh token bound to a sessionID
func (h *Helper) GenerateTokenPair(u *user.User, sessionID string, refreshDuration time.Duration) (string, string, error) {
	now := time.Now()

	accessClaims := &JWTClaims{
		UserID:    u.ID,
		SessionID: sessionID,
		Email:     u.Email,
		Username:  u.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(time.Duration(h.cfg.JWTAccessExpirationMinutes) * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Subject:   u.ID,
		},
	}

	accessTokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessToken, err := accessTokenObj.SignedString([]byte(h.cfg.JWTSecret))
	if err != nil {
		return "", "", fmt.Errorf("failed to sign access token: %w", err)
	}

	refreshClaims := &JWTClaims{
		UserID:    u.ID,
		SessionID: sessionID,
		Email:     u.Email,
		Username:  u.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(refreshDuration)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Subject:   u.ID,
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
func (h *Helper) ParseRefreshToken(refreshToken string) (*JWTClaims, error) {
	token, err := jwt.ParseWithClaims(refreshToken, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(h.cfg.JWTSecret), nil
	})

	if err != nil || !token.Valid {
		return nil, ErrTokenExpired
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok {
		return nil, ErrTokenExpired
	}
	return claims, nil
}
