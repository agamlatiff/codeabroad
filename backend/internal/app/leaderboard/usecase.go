package leaderboard

import (
	"context"
	"fmt"
	"time"
)

type usecase struct {
	leaderboardRepo Repository
	helper          *Helper
}

// NewUsecase creates a new Leaderboard Usecase instance
func NewUsecase(leaderboardRepo Repository) Usecase {
	return &usecase{
		leaderboardRepo: leaderboardRepo,
		helper:          NewHelper(),
	}
}

// GetWeeklyLeaderboard orchestrates the weekly division standings and user rank
func (u *usecase) GetWeeklyLeaderboard(
	ctx context.Context,
	userID string,
	requestedDivision TokyoDivision,
) (*WeeklyLeaderboardResponse, error) {
	now := time.Now().UTC()
	_, seasonWeek := now.ISOWeek()
	daysRemaining := u.helper.CalculateDaysUntilSundayReset(now)
	cfg := u.helper.GetDivisionConfig(requestedDivision)

	entries, err := u.leaderboardRepo.GetDivisionStandings(ctx, cfg.MinXP, cfg.MaxXP, 50)
	if err != nil {
		return nil, fmt.Errorf("failed to query division standings: %w", err)
	}

	var userRankItem *LeaderboardEntry

	for i := range entries {
		rank := i + 1
		entries[i].Rank = rank
		entries[i].Division = requestedDivision
		entries[i].Zone = u.helper.CalculateZone(rank)
		entries[i].IsCurrentUser = (userID != "" && entries[i].UserID == userID)

		if entries[i].IsCurrentUser {
			copied := entries[i]
			userRankItem = &copied
		}
	}

	// If current user is authenticated but not in the requested division list, fetch their status
	if userID != "" && userRankItem == nil {
		standing, err := u.leaderboardRepo.GetUserStanding(ctx, userID)
		if err == nil && standing != nil {
			userDiv := u.helper.DetermineDivision(standing.WeeklyXP)
			if userDiv == requestedDivision {
				standing.Rank = len(entries) + 1
				standing.Division = requestedDivision
				standing.IsCurrentUser = true
				standing.Zone = "safe"
				userRankItem = standing
			}
		}
	}

	return &WeeklyLeaderboardResponse{
		Division:         requestedDivision,
		DivisionName:     cfg.Name,
		DivisionTier:     cfg.Tier,
		SeasonWeek:       seasonWeek,
		DaysRemaining:    daysRemaining,
		UserRank:         userRankItem,
		Entries:          entries,
		TotalCompetitors: len(entries),
	}, nil
}

