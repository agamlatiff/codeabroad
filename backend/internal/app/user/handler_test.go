package user_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"codeabroad/backend/internal/app/auth"
	"codeabroad/backend/internal/app/user"
	"codeabroad/backend/internal/shared/middleware"
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
			Email: "reward@codeabroad.dev",
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
	token := generateTestToken("usr-1", "reward@codeabroad.dev")

	claimBody, _ := json.Marshal(map[string]string{
		"reward_type": "lesson_milestone",
	})
	wClaim := httptest.NewRecorder()
	reqClaim, _ := http.NewRequest(http.MethodPost, "/api/v1/users/me/daily-rewards/claim", bytes.NewBuffer(claimBody))
	reqClaim.Header.Set("Content-Type", "application/json")
	reqClaim.Header.Set("Authorization", "Bearer "+token)
	router.ServeHTTP(wClaim, reqClaim)

	if wClaim.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for reward claim, got: %d, body: %s", wClaim.Code, wClaim.Body.String())
	}
}

