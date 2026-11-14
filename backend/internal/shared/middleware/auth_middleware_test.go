package middleware_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"codeabroad/backend/internal/app/auth"
	"codeabroad/backend/internal/shared/middleware"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func signTestToken(t *testing.T, secret string, claims auth.JWTClaims) string {
	t.Helper()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(secret))
	if err != nil {
		t.Fatalf("failed to sign test token: %v", err)
	}
	return signed
}

func TestAuthMiddleware_AcceptsValidAccessToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	secret := "test-secret-with-at-least-32-characters"

	r := gin.New()
	r.GET("/protected", middleware.AuthMiddleware(secret), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"user_id":    c.GetString("userID"),
			"session_id": c.GetString("sessionID"),
			"email":      c.GetString("email"),
			"username":   c.GetString("username"),
		})
	})

	tok := signTestToken(t, secret, auth.JWTClaims{
		UserID:    "usr-1",
		SessionID: "sess-1",
		Email:     "alice@example.com",
		Username:  "alice",
		TokenType: auth.TokenTypeAccess,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
		},
	})

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer "+tok)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for valid access token, got %d body=%s", w.Code, w.Body.String())
	}

	var body map[string]string
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("failed to decode JSON response: %v", err)
	}
	if body["user_id"] != "usr-1" || body["session_id"] != "sess-1" || body["email"] != "alice@example.com" || body["username"] != "alice" {
		t.Fatalf("unexpected injected claims: %+v", body)
	}
}

func TestAuthMiddleware_RejectsNonAccessTokens(t *testing.T) {
	gin.SetMode(gin.TestMode)
	secret := "test-secret-with-at-least-32-characters"

	r := gin.New()
	r.GET("/protected", middleware.AuthMiddleware(secret), func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	cases := []struct {
		name      string
		tokenType string
	}{
		{name: "refresh token rejected on protected routes", tokenType: auth.TokenTypeRefresh},
		{name: "legacy token without token_type rejected", tokenType: ""},
		{name: "arbitrary token type rejected", tokenType: "other"},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			tok := signTestToken(t, secret, auth.JWTClaims{
				UserID:    "usr-1",
				SessionID: "sess-1",
				TokenType: tc.tokenType,
				RegisteredClaims: jwt.RegisteredClaims{
					ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
				},
			})

			req := httptest.NewRequest(http.MethodGet, "/protected", nil)
			req.Header.Set("Authorization", "Bearer "+tok)
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			if w.Code != http.StatusUnauthorized {
				t.Fatalf("expected 401 Unauthorized, got %d body=%s", w.Code, w.Body.String())
			}
		})
	}
}

func TestAuthMiddleware_RejectsMissingAndMalformedHeaders(t *testing.T) {
	gin.SetMode(gin.TestMode)
	secret := "test-secret-with-at-least-32-characters"

	r := gin.New()
	r.GET("/protected", middleware.AuthMiddleware(secret), func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	wrongSecretTok := signTestToken(t, "different-secret-that-must-fail-signature", auth.JWTClaims{
		UserID:    "usr-1",
		TokenType: auth.TokenTypeAccess,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	})

	cases := []struct {
		name   string
		header string
	}{
		{name: "missing header", header: ""},
		{name: "wrong scheme", header: "Basic abc"},
		{name: "empty bearer token", header: "Bearer   "},
		{name: "wrong signature", header: "Bearer " + wrongSecretTok},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/protected", nil)
			if tc.header != "" {
				req.Header.Set("Authorization", tc.header)
			}
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			if w.Code != http.StatusUnauthorized {
				t.Fatalf("expected 401 Unauthorized, got %d body=%s", w.Code, w.Body.String())
			}
		})
	}
}

func TestOptionalAuthMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)
	secret := "test-secret-with-at-least-32-characters"

	r := gin.New()
	r.GET("/optional", middleware.OptionalAuthMiddleware(secret), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"user_id": c.GetString("userID")})
	})

	refreshTok := signTestToken(t, secret, auth.JWTClaims{
		UserID:    "usr-refresh",
		TokenType: auth.TokenTypeRefresh,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	})
	accessTok := signTestToken(t, secret, auth.JWTClaims{
		UserID:    "usr-access",
		TokenType: auth.TokenTypeAccess,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	})

	cases := []struct {
		name       string
		authHeader string
		wantUserID string
	}{
		{name: "anonymous request allowed", authHeader: "", wantUserID: ""},
		{name: "refresh token is not injected", authHeader: "Bearer " + refreshTok, wantUserID: ""},
		{name: "valid access token injects userID", authHeader: "Bearer " + accessTok, wantUserID: "usr-access"},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/optional", nil)
			if tc.authHeader != "" {
				req.Header.Set("Authorization", tc.authHeader)
			}
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			if w.Code != http.StatusOK {
				t.Fatalf("expected 200 OK, got %d", w.Code)
			}
			var body map[string]string
			if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
				t.Fatalf("failed to decode JSON response: %v", err)
			}
			if body["user_id"] != tc.wantUserID {
				t.Fatalf("expected user_id=%q, got %q", tc.wantUserID, body["user_id"])
			}
		})
	}
}
