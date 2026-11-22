package leaderboard_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"merantalk/backend/internal/app/leaderboard"
	"github.com/gin-gonic/gin"
)

func setupLeaderboardTestRouter(authenticatedUserID string) (*gin.Engine, *leaderboard.MockRepository) {
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
	auth := func(c *gin.Context) {
		if authenticatedUserID != "" {
			c.Set("userID", authenticatedUserID)
		}
		c.Next()
	}
	h.RegisterRoutes(v1, auth, auth)

	return r, leaderboardRepo
}

func TestHTTP_GetWeeklyLeaderboard(t *testing.T) {
	r, _ := setupLeaderboardTestRouter("")

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/leaderboard/weekly?division=shinjuku", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_ClaimWeeklyReward(t *testing.T) {
	r, repo := setupLeaderboardTestRouter("usr-1")
	repo.PendingRewards["usr-1"] = &leaderboard.PendingWeeklyReward{
		Division:    leaderboard.DivisionBronze,
		Rank:        1,
		WeeklyXP:    220,
		GemsAwarded: 100,
		Claimed:     false,
	}
	repo.UserGems["usr-1"] = 40

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/leaderboard/weekly/claim", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK on first claim, got %d, body: %s", w.Code, w.Body.String())
	}

	var parsed struct {
		Success bool                                 `json:"success"`
		Data    leaderboard.ClaimWeeklyRewardResponse `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &parsed); err != nil {
		t.Fatalf("failed to decode claim response: %v", err)
	}
	if parsed.Data.NewGems != 140 || parsed.Data.Reward.GemsAwarded != 100 {
		t.Fatalf("unexpected claim payload: %+v", parsed.Data)
	}

	req2, _ := http.NewRequest(http.MethodPost, "/api/v1/leaderboard/weekly/claim", nil)
	w2 := httptest.NewRecorder()
	r.ServeHTTP(w2, req2)
	if w2.Code != http.StatusConflict {
		t.Fatalf("expected 409 Conflict on duplicate claim, got %d, body: %s", w2.Code, w2.Body.String())
	}

	unauthRouter, _ := setupLeaderboardTestRouter("")
	reqUnauth, _ := http.NewRequest(http.MethodPost, "/api/v1/leaderboard/weekly/claim", nil)
	wUnauth := httptest.NewRecorder()
	unauthRouter.ServeHTTP(wUnauth, reqUnauth)
	if wUnauth.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 Unauthorized without userID, got %d", wUnauth.Code)
	}
}

