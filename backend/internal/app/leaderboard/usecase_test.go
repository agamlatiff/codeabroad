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

func TestGetWeeklyLeaderboard_NormalizesInvalidDivisionAndOutOfTopZone(t *testing.T) {
	repo := leaderboard.NewMockRepository()
	for i := 0; i < 12; i++ {
		repo.Standings = append(repo.Standings, leaderboard.LeaderboardEntry{
			UserID:   "other",
			Name:     "Competitor",
			WeeklyXP: 100,
		})
	}
	repo.UserStandings["user-99"] = &leaderboard.LeaderboardEntry{
		UserID:   "user-99",
		Name:     "Hana",
		WeeklyXP: 50,
	}

	uc := leaderboard.NewUsecase(repo)
	res, err := uc.GetWeeklyLeaderboard(context.Background(), "user-99", leaderboard.TokyoDivision(""))
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.Division != leaderboard.DivisionShinjuku {
		t.Errorf("expected normalized division %q, got %q", leaderboard.DivisionShinjuku, res.Division)
	}
	if res.UserRank == nil {
		t.Fatal("expected user rank to be populated")
	}
	if res.UserRank.Zone != "demotion" {
		t.Errorf("expected rank 13 zone to be 'demotion', got %q", res.UserRank.Zone)
	}
}

