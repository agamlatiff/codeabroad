package middleware

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"

	"codeabroad/backend/internal/app/auth"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// SessionChecker verifies that an access token's session still exists in backing store.
type SessionChecker interface {
	GetSession(ctx context.Context, userID string, sessionID string) (string, error)
}

var (
	errInvalidAuthHeaderFormat = errors.New("authorization header format must be Bearer {token}")
	errInvalidOrExpiredToken   = errors.New("invalid or expired token")
)

func parseBearerToken(authHeader string, jwtSecret string) (*auth.JWTClaims, error) {
	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || parts[0] != "Bearer" {
		return nil, errInvalidAuthHeaderFormat
	}
	tokenString := strings.TrimSpace(parts[1])
	if tokenString == "" {
		return nil, errInvalidAuthHeaderFormat
	}

	token, err := jwt.ParseWithClaims(tokenString, &auth.JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})
	if err != nil || !token.Valid {
		return nil, errInvalidOrExpiredToken
	}

	claims, ok := token.Claims.(*auth.JWTClaims)
	if !ok || claims.TokenType != auth.TokenTypeAccess {
		return nil, errInvalidOrExpiredToken
	}
	if strings.TrimSpace(claims.UserID) == "" {
		return nil, errInvalidOrExpiredToken
	}
	return claims, nil
}

func verifySessionActive(c *gin.Context, checker SessionChecker, claims *auth.JWTClaims) bool {
	if checker == nil || claims == nil {
		return true
	}
	if strings.TrimSpace(claims.SessionID) == "" {
		return false
	}
	if _, err := checker.GetSession(c.Request.Context(), claims.UserID, claims.SessionID); err != nil {
		if !errors.Is(err, auth.ErrTokenExpired) {
			log.Printf("auth_middleware: session verification failed for user %s: %v", claims.UserID, err)
		}
		return false
	}
	return true
}

func injectClaimsIntoContext(c *gin.Context, claims *auth.JWTClaims) {
	c.Set("userID", claims.UserID)
	c.Set("sessionID", claims.SessionID)
	c.Set("email", claims.Email)
	c.Set("username", claims.Username)
}

// AuthMiddleware validates JWT Bearer tokens and injects claims into Gin context.
func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return AuthMiddlewareWithSessionCheck(jwtSecret, nil)
}

// AuthMiddlewareWithSessionCheck validates JWT Bearer tokens and verifies active session state when checker is provided.
func AuthMiddlewareWithSessionCheck(jwtSecret string, checker SessionChecker) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   "authorization header is required",
				"code":    "UNAUTHORIZED",
			})
			return
		}

		claims, err := parseBearerToken(authHeader, jwtSecret)
		if err != nil || !verifySessionActive(c, checker, claims) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   "invalid or expired authorization token",
				"code":    "UNAUTHORIZED",
			})
			return
		}

		injectClaimsIntoContext(c, claims)
		c.Next()
	}
}

// OptionalAuthMiddleware attempts to parse JWT if present, but does not abort if missing.
func OptionalAuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return OptionalAuthMiddlewareWithSessionCheck(jwtSecret, nil)
}

// OptionalAuthMiddlewareWithSessionCheck parses Bearer JWT when present and verifies session activity if checker is given.
func OptionalAuthMiddlewareWithSessionCheck(jwtSecret string, checker SessionChecker) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			if claims, err := parseBearerToken(authHeader, jwtSecret); err == nil && verifySessionActive(c, checker, claims) {
				injectClaimsIntoContext(c, claims)
			}
		}
		c.Next()
	}
}
