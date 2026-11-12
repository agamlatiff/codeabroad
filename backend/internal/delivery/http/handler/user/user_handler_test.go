package user_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"codeabroad/backend/internal/config"
	deliveryHttp "codeabroad/backend/internal/delivery/http"
	authHandlerPkg "codeabroad/backend/internal/delivery/http/handler/auth"
	userHandlerPkg "codeabroad/backend/internal/delivery/http/handler/user"
	"codeabroad/backend/internal/delivery/http/middleware"
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/mock"
	authUsecasePkg "codeabroad/backend/internal/usecase/auth"
	userUsecasePkg "codeabroad/backend/internal/usecase/user"
	"github.com/gin-gonic/gin"
)

func setupUserTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)

	cfg := &config.Config{
		JWTSecret:                  "test-secret-at-least-32-chars-long-key-12345",
		JWTAccessExpirationMinutes: 15,
		JWTRefreshExpirationDays:   30,
	}

	userRepo := mock.NewUserRepository()
	sessionRepo := mock.NewSessionRepository()

	authUc := authUsecasePkg.New(userRepo, sessionRepo, cfg)
	userUc := userUsecasePkg.New(userRepo)

	return deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		AuthHandler:    authHandlerPkg.New(authUc),
		UserHandler:    userHandlerPkg.New(userUc),
		AuthMiddleware: middleware.AuthMiddleware(cfg.JWTSecret),
	})
}

func TestHTTP_ProtectedProfile_WithoutToken(t *testing.T) {
	router := setupUserTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/users/me", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 Unauthorized for route without Bearer token, got: %d", w.Code)
	}
}

func TestHTTP_GetActivityLogs_Success(t *testing.T) {
	router := setupUserTestRouter()

	payload := domain.RegisterRequest{
		Name:     "Activity User",
		Username: "activityuser",
		Email:    "activity@example.com",
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

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/users/me/activity-logs", nil)
	req.Header.Set("Authorization", "Bearer "+regRes.Data.AccessToken)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for activity-logs, got: %d, body: %s", w.Code, w.Body.String())
	}

	var res struct {
		Success bool                               `json:"success"`
		Data    domain.UserActivitySummaryResponse `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to decode activity logs response: %v", err)
	}

	if len(res.Data.WeeklyLogs) != 7 {
		t.Errorf("expected 7 weekly logs, got %d", len(res.Data.WeeklyLogs))
	}
}

func TestHTTP_ClaimDailyReward_Success(t *testing.T) {
	router := setupUserTestRouter()

	regBody, _ := json.Marshal(map[string]string{
		"name":     "Reward Tester",
		"username": "rewardtester",
		"email":    "reward@codeabroad.dev",
		"password": "StrongPassword123!",
	})
	wReg := httptest.NewRecorder()
	reqReg, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/register", bytes.NewBuffer(regBody))
	reqReg.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(wReg, reqReg)

	var regRes struct {
		Data struct {
			AccessToken string `json:"access_token"`
		} `json:"data"`
	}
	_ = json.Unmarshal(wReg.Body.Bytes(), &regRes)

	claimBody, _ := json.Marshal(map[string]string{
		"reward_type": "lesson_milestone",
	})
	wClaim := httptest.NewRecorder()
	reqClaim, _ := http.NewRequest(http.MethodPost, "/api/v1/users/me/daily-rewards/claim", bytes.NewBuffer(claimBody))
	reqClaim.Header.Set("Content-Type", "application/json")
	reqClaim.Header.Set("Authorization", "Bearer "+regRes.Data.AccessToken)
	router.ServeHTTP(wClaim, reqClaim)

	if wClaim.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for reward claim, got: %d, body: %s", wClaim.Code, wClaim.Body.String())
	}
}
