package auth_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"codeabroad/backend/internal/config"
	deliveryHttp "codeabroad/backend/internal/delivery/http"
	authHandlerPkg "codeabroad/backend/internal/delivery/http/handler/auth"
	"codeabroad/backend/internal/delivery/http/middleware"
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/mock"
	authUsecasePkg "codeabroad/backend/internal/usecase/auth"
	"github.com/gin-gonic/gin"
)

func setupAuthTestRouter() (*gin.Engine, *mock.UserRepository, *mock.SessionRepository) {
	gin.SetMode(gin.TestMode)

	cfg := &config.Config{
		JWTSecret:                  "test-secret-at-least-32-chars-long-key-12345",
		JWTAccessExpirationMinutes: 15,
		JWTRefreshExpirationDays:   30,
	}

	userRepo := mock.NewUserRepository()
	sessionRepo := mock.NewSessionRepository()
	authUc := authUsecasePkg.New(userRepo, sessionRepo, cfg)

	authHandler := authHandlerPkg.New(authUc)
	authMiddleware := middleware.AuthMiddleware(cfg.JWTSecret)

	router := deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		AuthHandler:    authHandler,
		AuthMiddleware: authMiddleware,
	})

	return router, userRepo, sessionRepo
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

	payload := domain.RegisterRequest{
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

	// 1. Register first
	regPayload := domain.RegisterRequest{
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

	// 2. Login
	loginPayload := domain.LoginRequest{
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
