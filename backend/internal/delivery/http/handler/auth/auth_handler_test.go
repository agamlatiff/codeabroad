package auth_test

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
	authHandlerPkg "codeabroad/backend/internal/delivery/http/handler/auth"
	"codeabroad/backend/internal/delivery/http/middleware"
	"codeabroad/backend/internal/domain"
	authUsecasePkg "codeabroad/backend/internal/usecase/auth"
	"github.com/gin-gonic/gin"
)

type testUserRepo struct {
	users map[string]*domain.User
}

func (r *testUserRepo) Create(ctx context.Context, u *domain.User) error {
	if u.ID == "" {
		u.ID = "usr-test-123"
	}
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

func (r *testUserRepo) UpdateOnboarding(ctx context.Context, userID string, countryID string, careerPathID string, primaryStack string, bonusXP int) error {
	return nil
}

func (r *testUserRepo) GetProfileWithDetails(ctx context.Context, userID string) (*domain.OnboardingProfileResponse, error) {
	return nil, nil
}

func (r *testUserRepo) UpdateGamification(ctx context.Context, userID string, xp int, currentLevel int, streak int, lastActiveAt *time.Time) error {
	return nil
}

func (r *testUserRepo) AddGems(ctx context.Context, userID string, gems int) (int, error) {
	return 0, nil
}

func (r *testUserRepo) UpdateProfile(ctx context.Context, userID string, req *domain.UpdateProfileRequest) (*domain.User, error) {
	return r.users[userID], nil
}

func (r *testUserRepo) LogActivity(ctx context.Context, userID string, activityType string, xpEarned int, metadata map[string]interface{}) error {
	return nil
}

func (r *testUserRepo) HasActivityInRange(ctx context.Context, userID string, startTime time.Time, endTime time.Time) (bool, error) {
	return true, nil
}

func (r *testUserRepo) GetDailyActivityStatsSince(ctx context.Context, userID string, since time.Time) (map[string]domain.DailyActivityStat, error) {
	return map[string]domain.DailyActivityStat{}, nil
}

func (r *testUserRepo) ClaimDailyReward(ctx context.Context, userID string, rewardType string, xpAwarded int) (*domain.DailyRewardClaimResponse, error) {
	return nil, nil
}

func (r *testUserRepo) GetDailyRewardsStatus(ctx context.Context, userID string) (*domain.DailyRewardsStatusResponse, error) {
	return nil, nil
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

func setupAuthTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)

	cfg := &config.Config{
		JWTSecret:                  "test-secret-at-least-32-chars-long-key-12345",
		JWTAccessExpirationMinutes: 15,
		JWTRefreshExpirationDays:   30,
	}

	userRepo := &testUserRepo{users: make(map[string]*domain.User)}
	sessionRepo := &testSessionRepo{sessions: make(map[string]string)}
	authUc := authUsecasePkg.New(userRepo, sessionRepo, cfg)

	authHandler := authHandlerPkg.New(authUc)
	authMiddleware := middleware.AuthMiddleware(cfg.JWTSecret)

	return deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		AuthHandler:    authHandler,
		AuthMiddleware: authMiddleware,
		HealthHandler:  &handler.HealthHandler{},
	})
}

func TestHTTP_Register_ValidationError(t *testing.T) {
	router := setupAuthTestRouter()

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
	router := setupAuthTestRouter()

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

func TestHTTP_Logout_WithoutToken(t *testing.T) {
	router := setupAuthTestRouter()

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/logout", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 Unauthorized for logout without Bearer token, got: %d", w.Code)
	}
}

func TestHTTP_Logout_Success(t *testing.T) {
	router := setupAuthTestRouter()

	payload := domain.RegisterRequest{
		Name:     "Logout User",
		Username: "logoutuser",
		Email:    "logout@example.com",
		Password: "Password123!",
	}
	body, _ := json.Marshal(payload)
	regReq, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/register", bytes.NewBuffer(body))
	regReq.Header.Set("Content-Type", "application/json")

	wReg := httptest.NewRecorder()
	router.ServeHTTP(wReg, regReq)

	var regRes struct {
		Data struct {
			AccessToken string `json:"access_token"`
		} `json:"data"`
	}
	_ = json.Unmarshal(wReg.Body.Bytes(), &regRes)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/logout", nil)
	req.Header.Set("Authorization", "Bearer "+regRes.Data.AccessToken)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for logout, got: %d, body: %s", w.Code, w.Body.String())
	}
}


func TestHTTP_Login_RateLimitExceeded(t *testing.T) {
	gin.SetMode(gin.TestMode)
	cfg := &config.Config{
		JWTSecret:                  "test-secret-at-least-32-chars-long-key-12345",
		JWTAccessExpirationMinutes: 15,
		JWTRefreshExpirationDays:   30,
	}
	userRepo := &testUserRepo{users: make(map[string]*domain.User)}
	sessRepo := &testSessionRepo{sessions: make(map[string]string)}
	authUc := authUsecasePkg.New(userRepo, sessRepo, cfg)

	// Allow max 2 requests per minute per IP
	authH := authHandlerPkg.NewWithRateLimiter(authUc, middleware.RateLimitMiddleware(2, time.Minute))
	router := deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		AuthHandler:    authH,
		AuthMiddleware: middleware.AuthMiddleware(cfg.JWTSecret),
		HealthHandler:  &handler.HealthHandler{},
	})

	payload, _ := json.Marshal(domain.LoginRequest{
		Email:    "nobody@example.com",
		Password: "WrongPass123!",
	})

	for i := 1; i <= 2; i++ {
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/login", bytes.NewBuffer(payload))
		req.Header.Set("Content-Type", "application/json")
		req.RemoteAddr = "203.0.113.99:54321"
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Fatalf("attempt %d: expected 401 Unauthorized, got: %d", i, w.Code)
		}
	}

	// 3rd request from the same IP must be blocked with 429 Too Many Requests
	req3, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/login", bytes.NewBuffer(payload))
	req3.Header.Set("Content-Type", "application/json")
	req3.RemoteAddr = "203.0.113.99:54321"
	w3 := httptest.NewRecorder()
	router.ServeHTTP(w3, req3)

	if w3.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 429 Too Many Requests on 3rd attempt, got: %d, body: %s", w3.Code, w3.Body.String())
	}
	if w3.Header().Get("Retry-After") == "" {
		t.Fatalf("expected Retry-After header to be set on 429 response")
	}
}


func TestHTTP_SecurityHeaders_And_BodySizeLimit(t *testing.T) {
	router := setupAuthTestRouter()

	// 1. Verify SecurityHeadersMiddleware sets standard protection headers
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/health", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Fatalf("expected X-Content-Type-Options: nosniff, got: %s", w.Header().Get("X-Content-Type-Options"))
	}
	if w.Header().Get("X-Frame-Options") != "DENY" {
		t.Fatalf("expected X-Frame-Options: DENY, got: %s", w.Header().Get("X-Frame-Options"))
	}

	// 2. Verify BodySizeLimitMiddleware blocks payloads > 1MB with 413 Request Entity Too Large
	oversizedBody := bytes.Repeat([]byte("a"), int(middleware.DefaultMaxBodyBytes)+1024)
	postReq, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/login", bytes.NewReader(oversizedBody))
	postReq.Header.Set("Content-Type", "application/json")
	wPost := httptest.NewRecorder()
	router.ServeHTTP(wPost, postReq)

	if wPost.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("expected 413 Request Entity Too Large, got: %d", wPost.Code)
	}
}
