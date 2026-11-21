package user_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"merantalk/backend/internal/app/auth"
	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/middleware"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const testJWTSecret = "test-secret-at-least-32-chars-long-key-12345"

func generateTestToken(userID, email string) string {
	claims := auth.JWTClaims{
		UserID:    userID,
		Email:     email,
		TokenType: auth.TokenTypeAccess,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, _ := token.SignedString([]byte(testJWTSecret))
	return signed
}

func setupUserTestRouter(repo *user.MockRepository) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	v1 := r.Group("/api/v1")

	userUc := user.NewUsecase(repo)
	h := user.NewHandler(userUc)
	h.RegisterRoutes(v1, middleware.AuthMiddleware(testJWTSecret))
	return r
}

func TestHTTP_ProtectedProfile_WithoutToken(t *testing.T) {
	repo := user.NewMockRepository()
	router := setupUserTestRouter(repo)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/users/me", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 Unauthorized for route without Bearer token, got: %d", w.Code)
	}
}

func TestHTTP_GetActivityLogs_Success(t *testing.T) {
	repo := user.NewMockRepository()
	repo.Users["usr-1"] = &user.User{
		UserAccount: user.UserAccount{
			ID:    "usr-1",
			Email: "activity@example.com",
		},
		UserProfile: user.UserProfile{
			Name:     "Activity User",
			Username: "activityuser",
		},
	}
	router := setupUserTestRouter(repo)
	token := generateTestToken("usr-1", "activity@example.com")

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/users/me/activity-logs", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for activity-logs, got: %d, body: %s", w.Code, w.Body.String())
	}

	var res struct {
		Success bool                             `json:"success"`
		Data    user.UserActivitySummaryResponse `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to decode activity logs response: %v", err)
	}

	if len(res.Data.WeeklyLogs) != 7 {
		t.Errorf("expected 7 weekly logs, got %d", len(res.Data.WeeklyLogs))
	}
}

func TestHTTP_ClaimDailyReward_Success(t *testing.T) {
	repo := user.NewMockRepository()
	repo.Users["usr-1"] = &user.User{
		UserAccount: user.UserAccount{
			ID:    "usr-1",
			Email: "reward@merantalk.id",
		},
		UserProfile: user.UserProfile{
			Name:     "Reward Tester",
			Username: "rewardtester",
		},
		UserGamificationStats: user.UserGamificationStats{
			XP:           50,
			CurrentLevel: 1,
			Streak:       2,
		},
	}
	router := setupUserTestRouter(repo)
	token := generateTestToken("usr-1", "reward@merantalk.id")

	claimBody, _ := json.Marshal(map[string]string{
		"reward_type": "vocab_quest",
	})

	// Before reviewing 3 flashcards today, claim must fail with 400 Bad Request
	wLocked := httptest.NewRecorder()
	reqLocked, _ := http.NewRequest(http.MethodPost, "/api/v1/users/me/daily-rewards/claim", bytes.NewBuffer(claimBody))
	reqLocked.Header.Set("Content-Type", "application/json")
	reqLocked.Header.Set("Authorization", "Bearer "+token)
	router.ServeHTTP(wLocked, reqLocked)
	if wLocked.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request before reviewing 3 flashcards, got: %d, body: %s", wLocked.Code, wLocked.Body.String())
	}

	repo.FlashcardsReviewedToday["usr-1"] = 3

	wClaim := httptest.NewRecorder()
	reqClaim, _ := http.NewRequest(http.MethodPost, "/api/v1/users/me/daily-rewards/claim", bytes.NewBuffer(claimBody))
	reqClaim.Header.Set("Content-Type", "application/json")
	reqClaim.Header.Set("Authorization", "Bearer "+token)
	router.ServeHTTP(wClaim, reqClaim)

	if wClaim.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for reward claim, got: %d, body: %s", wClaim.Code, wClaim.Body.String())
	}

	var claimRes struct {
		Success bool                          `json:"success"`
		Data    user.DailyRewardClaimResponse `json:"data"`
	}
	if err := json.Unmarshal(wClaim.Body.Bytes(), &claimRes); err != nil {
		t.Fatalf("failed to decode claim response: %v", err)
	}
	if claimRes.Data.XPAwarded != 30 {
		t.Errorf("expected 30 XP awarded, got %d", claimRes.Data.XPAwarded)
	}

	// Second claim on same day should return 409 Conflict
	wDup := httptest.NewRecorder()
	reqDup, _ := http.NewRequest(http.MethodPost, "/api/v1/users/me/daily-rewards/claim", bytes.NewBuffer(claimBody))
	reqDup.Header.Set("Content-Type", "application/json")
	reqDup.Header.Set("Authorization", "Bearer "+token)
	router.ServeHTTP(wDup, reqDup)
	if wDup.Code != http.StatusConflict {
		t.Fatalf("expected 409 Conflict on duplicate daily reward claim, got: %d", wDup.Code)
	}
}

func TestHTTP_ClaimDailyReward_InvalidRewardType(t *testing.T) {
	repo := user.NewMockRepository()
	repo.Users["usr-1"] = &user.User{
		UserAccount: user.UserAccount{ID: "usr-1", Email: "reward@merantalk.id"},
	}
	router := setupUserTestRouter(repo)
	token := generateTestToken("usr-1", "reward@merantalk.id")

	claimBody, _ := json.Marshal(map[string]string{
		"reward_type": "lesson_milestone",
	})
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/users/me/daily-rewards/claim", bytes.NewBuffer(claimBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request for invalid reward_type, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_UpdateProfile_BlankNameReturnsBadRequest(t *testing.T) {
	repo := user.NewMockRepository()
	repo.Users["usr-1"] = &user.User{
		UserAccount: user.UserAccount{ID: "usr-1", Email: "user@merantalk.id"},
		UserProfile: user.UserProfile{Name: "Original Name", Username: "orig"},
	}
	router := setupUserTestRouter(repo)
	token := generateTestToken("usr-1", "user@merantalk.id")

	body, _ := json.Marshal(map[string]any{"name": "   "})
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPatch, "/api/v1/users/me", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request for blank name, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_DailyRewardRateLimiterTriggered(t *testing.T) {
	repo := user.NewMockRepository()
	repo.Users["usr-1"] = &user.User{
		UserAccount: user.UserAccount{ID: "usr-1", Email: "rl@merantalk.id"},
	}

	gin.SetMode(gin.TestMode)
	r := gin.New()
	v1 := r.Group("/api/v1")
	h := user.NewHandlerWithRateLimiters(
		user.NewUsecase(repo),
		nil,
		func(c *gin.Context) {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{"success": false, "message": "rate limited"})
		},
	)
	h.RegisterRoutes(v1, middleware.AuthMiddleware(testJWTSecret))

	token := generateTestToken("usr-1", "rl@merantalk.id")
	body, _ := json.Marshal(map[string]string{"reward_type": "vocab_quest"})
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/users/me/daily-rewards/claim", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 429 Too Many Requests when limiter blocks, got: %d", w.Code)
	}
}

