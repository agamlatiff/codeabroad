package leaderboard_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"codeabroad/backend/internal/app/leaderboard"
	"github.com/gin-gonic/gin"
)

func setupLeaderboardTestRouter() (*gin.Engine, *leaderboard.MockRepository) {
	gin.SetMode(gin.TestMode)

	leaderboardRepo := leaderboard.NewMockRepository()
	leaderboardRepo.Standings = []leaderboard.LeaderboardEntry{
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

	uc := leaderboard.NewUsecase(leaderboardRepo)
	h := leaderboard.NewHandler(uc)

	r := gin.New()
	v1 := r.Group("/api/v1")
	h.RegisterRoutes(v1, nil)

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

