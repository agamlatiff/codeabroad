package leaderboard_test

import (
	"context"
	"testing"

	"codeabroad/backend/internal/app/leaderboard"
)

func TestGetWeeklyLeaderboard_Success(t *testing.T) {
	repo := leaderboard.NewMockRepository()
	repo.Standings = []leaderboard.LeaderboardEntry{
		{UserID: "user-1", Name: "Kenji", WeeklyXP: 250},
		{UserID: "user-2", Name: "Yuki", WeeklyXP: 180},
	}

	uc := leaderboard.NewUsecase(repo)
	res, err := uc.GetWeeklyLeaderboard(context.Background(), "user-1", leaderboard.DivisionShinjuku)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if res.DivisionName != "Liga Perunggu" {
		t.Errorf("expected 'Liga Perunggu', got '%s'", res.DivisionName)
	}
	if len(res.Entries) != 2 {
		t.Fatalf("expected 2 entries, got %d", len(res.Entries))
	}
	if res.Entries[0].Zone != "promotion" {
		t.Errorf("expected rank 1 zone to be 'promotion', got '%s'", res.Entries[0].Zone)
	}
	if res.UserRank == nil || res.UserRank.UserID != "user-1" {
		t.Errorf("expected user rank to match user-1")
	}
}

