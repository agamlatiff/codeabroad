package handler_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	deliveryHttp "codeabroad/backend/internal/delivery/http"
	"codeabroad/backend/internal/delivery/http/handler"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

type mockLeaderboardUsecase struct {
	response *domain.WeeklyLeaderboardResponse
	err      error
}

func (m *mockLeaderboardUsecase) GetWeeklyLeaderboard(ctx context.Context, userID string, requestedDivision domain.TokyoDivision) (*domain.WeeklyLeaderboardResponse, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.response, nil
}

func setupLeaderboardTestRouter(mockUc *mockLeaderboardUsecase) *gin.Engine {
	gin.SetMode(gin.TestMode)
	lbHandler := handler.NewLeaderboardHandler(mockUc)

	return deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		LeaderboardHandler: lbHandler,
	})
}

func TestLeaderboardHandler_GetWeeklyLeaderboard(t *testing.T) {
	mockUc := &mockLeaderboardUsecase{
		response: &domain.WeeklyLeaderboardResponse{
			Division:     domain.DivisionShinjuku,
			DivisionName: "Divisi Shinjuku",
			DivisionTier: "Bronze League",
			SeasonWeek:   42,
			DaysRemaining: 4,
			Entries: []domain.LeaderboardEntry{
				{Rank: 1, UserID: "u1", Username: "kenji", Name: "Kenji Sato", WeeklyXP: 320, Streak: 7, Zone: "promotion"},
				{Rank: 2, UserID: "u2", Username: "maya", Name: "Maya Putri", WeeklyXP: 290, Streak: 5, Zone: "promotion"},
				{Rank: 3, UserID: "u3", Username: "anda", Name: "Anda (Kandidat)", WeeklyXP: 250, Streak: 4, Zone: "promotion", IsCurrentUser: true},
			},
			TotalCompetitors: 3,
		},
	}
	router := setupLeaderboardTestRouter(mockUc)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/leaderboard/weekly?division=shinjuku", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}

	var res map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to parse response JSON: %v", err)
	}

	if res["success"] != true {
		t.Fatalf("expected success: true, got %v", res["success"])
	}

	data, ok := res["data"].(map[string]interface{})
	if !ok {
		t.Fatalf("expected data map, got %v", res["data"])
	}

	if data["division"] != "shinjuku" {
		t.Errorf("expected division shinjuku, got %v", data["division"])
	}

	entries, ok := data["entries"].([]interface{})
	if !ok || len(entries) != 3 {
		t.Fatalf("expected 3 leaderboard entries, got %v", data["entries"])
	}
}
