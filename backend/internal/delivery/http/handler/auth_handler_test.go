package handler_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"codeabroad/backend/internal/config"
	deliveryHttp "codeabroad/backend/internal/delivery/http"
	"codeabroad/backend/internal/delivery/http/handler"
	"codeabroad/backend/internal/delivery/http/middleware"
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

// in-memory mocks for HTTP testing
type testUserRepo struct {
	users map[string]*domain.User
}

func (r *testUserRepo) Create(ctx context.Context, u *domain.User) error {
	r.users[u.Email] = u
	r.users[u.ID] = u
	return nil
}

func (r *testUserRepo) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	return r.users[email], nil
}

func (r *testUserRepo) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
	return nil, nil
}

func (r *testUserRepo) GetByID(ctx context.Context, id string) (*domain.User, error) {
	return r.users[id], nil
}

type testSessionRepo struct {
	sessions map[string]string
}

func (s *testSessionRepo) SetSession(ctx context.Context, userID, token string, ttl time.Duration) error {
	s.sessions[userID] = token
	return nil
}

func (s *testSessionRepo) GetSession(ctx context.Context, userID string) (string, error) {
	return s.sessions[userID], nil
}

func (s *testSessionRepo) DeleteSession(ctx context.Context, userID string) error {
	delete(s.sessions, userID)
	return nil
}

func setupTestRouter() (*gin.Engine, domain.AuthUsecase, *config.Config) {
	gin.SetMode(gin.TestMode)

	cfg := &config.Config{
		JWTSecret:                  "test-secret-at-least-32-chars-long-key-12345",
		JWTAccessExpirationMinutes: 15,
		JWTRefreshExpirationDays:   7,
	}

	userRepo := &testUserRepo{users: make(map[string]*domain.User)}
	sessionRepo := &testSessionRepo{sessions: make(map[string]string)}
	authUc := usecase.NewAuthUsecase(userRepo, sessionRepo, cfg)

	authHandler := handler.NewAuthHandler(authUc)
	authMiddleware := middleware.AuthMiddleware(cfg.JWTSecret)

	router := deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		AuthHandler:    authHandler,
		AuthMiddleware: authMiddleware,
		HealthHandler:  &handler.HealthHandler{},
	})

	return router, authUc, cfg
}

func TestHTTP_Register_ValidationError(t *testing.T) {
	router, _, _ := setupTestRouter()

	// Missing password and email
	body := []byte(`{"name":"Incomplete"}`)
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected status 400 Bad Request, got: %d", w.Code)
	}

	var res map[string]any
	_ = json.Unmarshal(w.Body.Bytes(), &res)
	if res["code"] != "BAD_REQUEST" {
		t.Fatalf("expected error code BAD_REQUEST, got: %v", res["code"])
	}
}

func TestHTTP_Register_Success(t *testing.T) {
	router, _, _ := setupTestRouter()

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

	var res map[string]any
	_ = json.Unmarshal(w.Body.Bytes(), &res)
	if res["success"] != true {
		t.Fatalf("expected success true, got: %v", res["success"])
	}
}

func TestHTTP_ProtectedProfile_WithoutToken(t *testing.T) {
	router, _, _ := setupTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/users/me", nil)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 Unauthorized for route without Bearer token, got: %d", w.Code)
	}
}
