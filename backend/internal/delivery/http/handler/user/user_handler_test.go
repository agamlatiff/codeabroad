package user_test

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
	authHandlerPkg "codeabroad/backend/internal/delivery/http/handler/auth"
	userHandlerPkg "codeabroad/backend/internal/delivery/http/handler/user"
	"codeabroad/backend/internal/delivery/http/middleware"
	"codeabroad/backend/internal/domain"
	authUsecasePkg "codeabroad/backend/internal/usecase/auth"
	userUsecasePkg "codeabroad/backend/internal/usecase/user"
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
	u := r.users[userID]
	if u == nil {
		return nil, domain.ErrUserNotFound
	}
	if req.PrimaryStack != nil {
		u.PrimaryStack = req.PrimaryStack
	}
	return u, nil
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
	return &domain.DailyRewardClaimResponse{
		RewardType:   rewardType,
		XPAwarded:    xpAwarded,
		CurrentXP:    100,
		CurrentLevel: 2,
		Streak:       1,
		ClaimedAt:    "2026-10-14T10:00:00Z",
	}, nil
}

func (r *testUserRepo) GetDailyRewardsStatus(ctx context.Context, userID string) (*domain.DailyRewardsStatusResponse, error) {
	return &domain.DailyRewardsStatusResponse{
		Date:               "2026-10-14",
		VocabQuestClaimed:  false,
		GoldenChestClaimed: false,
	}, nil
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

func setupUserTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)

	cfg := &config.Config{
		JWTSecret:                  "test-secret-at-least-32-chars-long-key-12345",
		JWTAccessExpirationMinutes: 15,
		JWTRefreshExpirationDays:   30,
	}

	userRepo := &testUserRepo{users: make(map[string]*domain.User)}
	sessionRepo := &testSessionRepo{sessions: make(map[string]string)}

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
		"reward_type": "vocab_quest",
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

