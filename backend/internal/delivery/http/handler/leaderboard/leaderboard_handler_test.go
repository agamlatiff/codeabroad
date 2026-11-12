package leaderboard_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	deliveryHttp "codeabroad/backend/internal/delivery/http"
	leaderboardHandlerPkg "codeabroad/backend/internal/delivery/http/handler/leaderboard"
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/mock"
	leaderboardUsecasePkg "codeabroad/backend/internal/usecase/leaderboard"
	"github.com/gin-gonic/gin"
)

func setupLeaderboardTestRouter() (*gin.Engine, *mock.LeaderboardRepository) {
	gin.SetMode(gin.TestMode)

	leaderboardRepo := mock.NewLeaderboardRepository()
	leaderboardRepo.Standings = []domain.LeaderboardEntry{
		{
			UserID:   "usr-1",
			Username: "alice",
			WeeklyXP: 100,
		},
		{
			UserID:   "usr-2",
			Username: "bob",
			WeeklyXP: 80,
		},
	}

	uc := leaderboardUsecasePkg.New(leaderboardRepo)
	h := leaderboardHandlerPkg.New(uc)

	r := deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		LeaderboardHandler: h,
	})

	return r, leaderboardRepo
}

func TestHTTP_GetWeeklyLeaderboard(t *testing.T) {
	r, _ := setupLeaderboardTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/leaderboard/weekly?division=shinjuku", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

