package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// JWTClaims defines the cryptographic token payload claims shared across Auth Usecase and Middleware
type JWTClaims struct {
	UserID    string `json:"user_id"`
	SessionID string `json:"session_id,omitempty"`
	Email     string `json:"email"`
	Username  string `json:"username"`
	jwt.RegisteredClaims
}

var (
	errInvalidAuthHeaderFormat = errors.New("authorization header format must be Bearer {token}")
	errInvalidOrExpiredToken   = errors.New("invalid or expired token")
)

func parseBearerToken(authHeader string, jwtSecret string) (*JWTClaims, error) {
	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || parts[0] != "Bearer" || strings.TrimSpace(parts[1]) == "" {
		return nil, errInvalidAuthHeaderFormat
	}

	tokenString := parts[1]
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})
	if err != nil || !token.Valid {
		return nil, errInvalidOrExpiredToken
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok {
		return nil, errInvalidOrExpiredToken
	}
	return claims, nil
}

func injectClaimsIntoContext(c *gin.Context, claims *JWTClaims) {
	c.Set("userID", claims.UserID)
	c.Set("sessionID", claims.SessionID)
	c.Set("email", claims.Email)
	c.Set("username", claims.Username)
}

// AuthMiddleware validates JWT Bearer tokens and injects claims into Gin context
func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
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
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   err.Error(),
				"code":    "UNAUTHORIZED",
			})
			return
		}

		injectClaimsIntoContext(c, claims)
		c.Next()
	}
}

// OptionalAuthMiddleware attempts to parse JWT if present, but does not abort if missing
func OptionalAuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			if claims, err := parseBearerToken(authHeader, jwtSecret); err == nil {
				injectClaimsIntoContext(c, claims)
			}
		}
		c.Next()
	}
}
