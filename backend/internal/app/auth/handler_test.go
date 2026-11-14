package auth_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"codeabroad/backend/config"
	"codeabroad/backend/internal/app/auth"
	"codeabroad/backend/internal/app/user"
	"codeabroad/backend/internal/shared/middleware"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func setupAuthTestRouter() (*gin.Engine, *user.MockRepository, *auth.MockSessionRepository) {
	gin.SetMode(gin.TestMode)

	cfg := &config.Config{
		JWTSecret:                  "test-secret-at-least-32-chars-long-key-12345",
		JWTAccessExpirationMinutes: 15,
		JWTRefreshExpirationDays:   30,
	}

	userRepo := user.NewMockRepository()
	sessionRepo := auth.NewMockSessionRepository()
	authUc := auth.NewUsecase(userRepo, sessionRepo, cfg)

	authHandler := auth.NewHandlerWithRateLimiter(authUc, nil) // no rate limiter in tests
	authMiddleware := middleware.AuthMiddleware(cfg.JWTSecret)

	r := gin.New()
	v1 := r.Group("/api/v1")
	authHandler.RegisterRoutes(v1, authMiddleware)

	return r, userRepo, sessionRepo
}

func TestHTTP_Register_ValidationError(t *testing.T) {
	router, _, _ := setupAuthTestRouter()

	body := []byte(`{"name":"Incomplete"}`)
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected status 400 Bad Request, got: %d", w.Code)
	}
}

func TestHTTP_Register_Success(t *testing.T) {
	router, _, _ := setupAuthTestRouter()

	payload := auth.RegisterRequest{
		Name:     "Budi Pratama",
		Username: "budipratama",
		Email:    "budi@example.com",
		Password: "Password123!",
	}
	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("expected status 201 Created, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_Login_Success(t *testing.T) {
	router, _, _ := setupAuthTestRouter()

	regPayload := auth.RegisterRequest{
		Name:     "Budi Pratama",
		Username: "budipratama",
		Email:    "budi@example.com",
		Password: "Password123!",
	}
	regBody, _ := json.Marshal(regPayload)
	regReq, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/register", bytes.NewBuffer(regBody))
	regReq.Header.Set("Content-Type", "application/json")
	regW := httptest.NewRecorder()
	router.ServeHTTP(regW, regReq)

	loginPayload := auth.LoginRequest{
		Email:    "budi@example.com",
		Password: "Password123!",
	}
	loginBody, _ := json.Marshal(loginPayload)
	loginReq, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/login", bytes.NewBuffer(loginBody))
	loginReq.Header.Set("Content-Type", "application/json")
	loginW := httptest.NewRecorder()
	router.ServeHTTP(loginW, loginReq)

	if loginW.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK, got: %d, body: %s", loginW.Code, loginW.Body.String())
	}
}

func TestHTTP_Logout_WithoutToken(t *testing.T) {
	router, _, _ := setupAuthTestRouter()

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/logout", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected status 401 Unauthorized, got: %d", w.Code)
	}
}

func TestHTTP_Auth_SanitizedBadRequestErrors(t *testing.T) {
	router, _, _ := setupAuthTestRouter()

	forbiddenSubstrings := []string{
		"RegisterRequest",
		"LoginRequest",
		"RefreshTokenRequest",
		"Key:",
		"Field validation",
		"Go struct",
		"tag",
	}

	testCases := []struct {
		name string
		path string
		body string
	}{
		{name: "Register_MissingRequiredFields", path: "/api/v1/auth/register", body: `{"name":"Incomplete"}`},
		{name: "Register_InvalidEmailFormat", path: "/api/v1/auth/register", body: `{"name":"Budi","username":"budi123","email":"not-an-email","password":"Password123!"}`},
		{name: "Register_TypeMismatch", path: "/api/v1/auth/register", body: `{"name":123,"username":"budi123","email":"budi@example.com","password":"Password123!"}`},
		{name: "Register_MalformedJSON", path: "/api/v1/auth/register", body: `{"name":`},
		{name: "Login_MissingPassword", path: "/api/v1/auth/login", body: `{"email":"budi@example.com"}`},
		{name: "Login_MalformedJSON", path: "/api/v1/auth/login", body: `{`},
		{name: "Refresh_MissingToken", path: "/api/v1/auth/refresh", body: `{}`},
		{name: "Refresh_EmptyBody", path: "/api/v1/auth/refresh", body: ``},
		{name: "Refresh_TypeMismatch", path: "/api/v1/auth/refresh", body: `{"refresh_token":12345}`},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			req, _ := http.NewRequest(http.MethodPost, tc.path, strings.NewReader(tc.body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			if w.Code != http.StatusBadRequest {
				t.Fatalf("expected 400 Bad Request, got: %d, body: %s", w.Code, w.Body.String())
			}

			var errResp struct {
				Success bool   `json:"success"`
				Error   string `json:"error"`
				Code    string `json:"code"`
			}
			if err := json.Unmarshal(w.Body.Bytes(), &errResp); err != nil {
				t.Fatalf("failed to parse error response JSON: %v", err)
			}
			if errResp.Code != "BAD_REQUEST" || errResp.Error == "" {
				t.Fatalf("expected BAD_REQUEST with non-empty sanitized message, got: %+v", errResp)
			}
			for _, forbidden := range forbiddenSubstrings {
				if strings.Contains(errResp.Error, forbidden) {
					t.Fatalf("sanitized error leaked %q in message %q", forbidden, errResp.Error)
				}
			}
		})
	}
}

func TestHTTP_Refresh_EndToEnd_And_RejectsAccessTokenAndReuse(t *testing.T) {
	router, _, _ := setupAuthTestRouter()

	regPayload := auth.RegisterRequest{
		Name:     "Budi Pratama",
		Username: "budirefresh",
		Email:    "budirefresh@example.com",
		Password: "Password123!",
	}
	regBody, _ := json.Marshal(regPayload)
	regReq, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/register", bytes.NewBuffer(regBody))
	regReq.Header.Set("Content-Type", "application/json")
	regW := httptest.NewRecorder()
	router.ServeHTTP(regW, regReq)
	if regW.Code != http.StatusCreated {
		t.Fatalf("register failed: status=%d body=%s", regW.Code, regW.Body.String())
	}

	var regResp struct {
		Data struct {
			AccessToken  string `json:"access_token"`
			RefreshToken string `json:"refresh_token"`
		} `json:"data"`
	}
	if err := json.Unmarshal(regW.Body.Bytes(), &regResp); err != nil {
		t.Fatalf("failed to decode register response: %v", err)
	}

	// 1. Access token passed to /refresh must fail with 401
	badRefreshBody, _ := json.Marshal(auth.RefreshTokenRequest{RefreshToken: regResp.Data.AccessToken})
	badReq, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/refresh", bytes.NewBuffer(badRefreshBody))
	badReq.Header.Set("Content-Type", "application/json")
	badW := httptest.NewRecorder()
	router.ServeHTTP(badW, badReq)
	if badW.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 when using access token for refresh, got: %d, body: %s", badW.Code, badW.Body.String())
	}

	// 2. Valid refresh token succeeds and rotates
	okRefreshBody, _ := json.Marshal(auth.RefreshTokenRequest{RefreshToken: regResp.Data.RefreshToken})
	okReq, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/refresh", bytes.NewBuffer(okRefreshBody))
	okReq.Header.Set("Content-Type", "application/json")
	okW := httptest.NewRecorder()
	router.ServeHTTP(okW, okReq)
	if okW.Code != http.StatusOK {
		t.Fatalf("expected 200 OK on refresh, got: %d, body: %s", okW.Code, okW.Body.String())
	}

	var refreshResp struct {
		Data struct {
			RefreshToken string `json:"refresh_token"`
		} `json:"data"`
	}
	if err := json.Unmarshal(okW.Body.Bytes(), &refreshResp); err != nil {
		t.Fatalf("failed to decode refresh response: %v", err)
	}

	// 3. Reusing old refresh token fails with 401 and revokes session
	reuseReq, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/refresh", bytes.NewBuffer(okRefreshBody))
	reuseReq.Header.Set("Content-Type", "application/json")
	reuseW := httptest.NewRecorder()
	router.ServeHTTP(reuseW, reuseReq)
	if reuseW.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 on refresh token reuse, got: %d", reuseW.Code)
	}

	// 4. Subsequent attempt with rotated token also fails with 401 because session was revoked
	revokedBody, _ := json.Marshal(auth.RefreshTokenRequest{RefreshToken: refreshResp.Data.RefreshToken})
	revokedReq, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/refresh", bytes.NewBuffer(revokedBody))
	revokedReq.Header.Set("Content-Type", "application/json")
	revokedW := httptest.NewRecorder()
	router.ServeHTTP(revokedW, revokedReq)
	if revokedW.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 after session revocation, got: %d", revokedW.Code)
	}
}

func TestHTTP_Logout_EmptySessionID_Unauthorized(t *testing.T) {
	router, _, sessionRepo := setupAuthTestRouter()
	ctx := context.Background()
	_ = sessionRepo.SetSession(ctx, "usr_http_logout", "sess_active", "some_hash", 24*time.Hour)

	claims := &auth.JWTClaims{
		UserID:    "usr_http_logout",
		SessionID: "",
		Email:     "logout@example.com",
		Username:  "logoutuser",
		TokenType: auth.TokenTypeAccess,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
		},
	}
	tokenStr, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte("test-secret-at-least-32-chars-long-key-12345"))
	if err != nil {
		t.Fatalf("failed to sign test JWT: %v", err)
	}

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/logout", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 Unauthorized when session_id claim is empty, got: %d, body: %s", w.Code, w.Body.String())
	}
	if _, err := sessionRepo.GetSession(ctx, "usr_http_logout", "sess_active"); err != nil {
		t.Fatalf("expected existing session to remain active, got: %v", err)
	}
}


