package leaderboard_test

import (
	"context"
	"testing"
	"time"

	"merantalk/backend/internal/app/leaderboard"
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
	if res.Entries[0].UserID != "user-1" {
		t.Errorf("expected self entry UserID 'user-1', got %q", res.Entries[0].UserID)
	}
	if res.Entries[1].UserID != "" {
		t.Errorf("expected non-self entry UserID to be redacted, got %q", res.Entries[1].UserID)
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

func TestGetWeeklyLeaderboard_UniversalDivisionsAliasesPrivacyAndSundayReset(t *testing.T) {
	repo := leaderboard.NewMockRepository()
	repo.Standings = []leaderboard.LeaderboardEntry{
		{UserID: "user-1", Username: "mina", TotalXP: 450, WeeklyXP: 120},
	}
	repo.UserStandings["user-1"] = &leaderboard.LeaderboardEntry{
		UserID:   "user-1",
		Username: "mina",
		TotalXP:  450,
		WeeklyXP: 120,
	}

	uc := leaderboard.NewUsecase(repo)

	// Empty division auto-selects silver for user with 450 TotalXP
	autoRes, err := uc.GetWeeklyLeaderboard(context.Background(), "user-1", "")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if autoRes.Division != leaderboard.DivisionSilver || autoRes.DivisionName != "Liga Perak" {
		t.Fatalf("expected auto-selected silver division, got %q (%s)", autoRes.Division, autoRes.DivisionName)
	}

	// Legacy station alias maps cleanly and public callers do not receive raw UserIDs
	aliasRes, err := uc.GetWeeklyLeaderboard(context.Background(), "", leaderboard.LeagueDivision("shibuya"))
	if err != nil {
		t.Fatalf("expected no error for legacy alias, got %v", err)
	}
	if aliasRes.Division != leaderboard.DivisionSilver {
		t.Fatalf("expected shibuya alias to normalize to silver, got %q", aliasRes.Division)
	}
	if len(aliasRes.Entries) != 1 || aliasRes.Entries[0].UserID != "" {
		t.Fatalf("expected unauthenticated response to redact UserID, got %+v", aliasRes.Entries)
	}

	// Peeking at another division preserves UserDivision (Silver) while showing Gold standings
	peekRes, err := uc.GetWeeklyLeaderboard(context.Background(), "user-1", leaderboard.DivisionGold)
	if err != nil {
		t.Fatalf("expected no error when peeking at gold division, got %v", err)
	}
	if peekRes.Division != leaderboard.DivisionGold {
		t.Fatalf("expected viewed division gold, got %q", peekRes.Division)
	}
	if peekRes.UserDivision != leaderboard.DivisionSilver {
		t.Fatalf("expected UserDivision to remain silver when peeking at gold, got %q", peekRes.UserDivision)
	}

	helper := leaderboard.NewHelper()
	sunday := time.Date(2026, 11, 15, 10, 0, 0, 0, time.UTC)
	if days := helper.CalculateDaysUntilSundayReset(sunday); days != 0 {
		t.Errorf("expected 0 full days remaining on Sunday, got %d", days)
	}
}

func TestClaimWeeklyReward_LifecycleAndErrors(t *testing.T) {
	repo := leaderboard.NewMockRepository()
	repo.Standings = []leaderboard.LeaderboardEntry{
		{UserID: "user-1", Username: "mina", TotalXP: 900, WeeklyXP: 120},
	}
	repo.PendingRewards["user-1"] = &leaderboard.PendingWeeklyReward{
		Division:    leaderboard.DivisionGold,
		Rank:        2,
		WeeklyXP:    340,
		GemsAwarded: 50,
		Claimed:     false,
	}
	repo.UserGems["user-1"] = 100

	uc := leaderboard.NewUsecase(repo)

	board, err := uc.GetWeeklyLeaderboard(context.Background(), "user-1", leaderboard.DivisionGold)
	if err != nil {
		t.Fatalf("expected leaderboard success, got %v", err)
	}
	if board.LastWeekReward == nil || board.LastWeekReward.Claimed || board.LastWeekReward.GemsAwarded != 50 {
		t.Fatalf("expected unclaimed 50-gem reward on leaderboard, got %+v", board.LastWeekReward)
	}
	if board.LastWeekReward.DivisionName != "Liga Emas" {
		t.Fatalf("expected DivisionName 'Liga Emas', got %q", board.LastWeekReward.DivisionName)
	}

	claimRes, err := uc.ClaimWeeklyReward(context.Background(), "user-1")
	if err != nil {
		t.Fatalf("expected claim to succeed, got %v", err)
	}
	if claimRes.NewGems != 150 || !claimRes.Reward.Claimed || claimRes.Reward.GemsAwarded != 50 {
		t.Fatalf("unexpected claim response: %+v", claimRes)
	}

	// Second claim must be rejected as already claimed
	if _, err := uc.ClaimWeeklyReward(context.Background(), "user-1"); err != leaderboard.ErrWeeklyRewardAlreadyClaimed {
		t.Fatalf("expected ErrWeeklyRewardAlreadyClaimed, got %v", err)
	}

	// User without Top-3 reward receives ErrNoPendingWeeklyReward
	if _, err := uc.ClaimWeeklyReward(context.Background(), "user-no-reward"); err != leaderboard.ErrNoPendingWeeklyReward {
		t.Fatalf("expected ErrNoPendingWeeklyReward, got %v", err)
	}
}

