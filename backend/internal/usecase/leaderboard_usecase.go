package usecase

import (
	"codeabroad/backend/internal/domain"
	"context"
)

// LeaderboardUsecase implements domain.LeaderboardUsecase
type LeaderboardUsecase struct {
	leaderboardRepo domain.LeaderboardRepository
	userRepo        domain.UserRepository
}

// NewLeaderboardUsecase creates a new LeaderboardUsecase instance
func NewLeaderboardUsecase(leaderboardRepo domain.LeaderboardRepository, userRepo domain.UserRepository) domain.LeaderboardUsecase {
	return &LeaderboardUsecase{
		leaderboardRepo: leaderboardRepo,
		userRepo:        userRepo,
	}
}

// GetWeeklyLeaderboard orchestrates the calculation of the weekly leaderboard for the user's division
func (u *LeaderboardUsecase) GetWeeklyLeaderboard(ctx context.Context, userID string, requestedDivision domain.TokyoDivision) (*domain.WeeklyLeaderboardResponse, error) {
	targetDivision := requestedDivision

	// If no specific division requested, determine based on user's current status
	if targetDivision == "" {
		targetDivision = domain.DivisionShinjuku
		if userID != "" && u.userRepo != nil {
			user, err := u.userRepo.GetByID(ctx, userID)
			if err == nil && user != nil {
				if user.XP >= 1500 {
					targetDivision = domain.DivisionRoppongi
				} else if user.XP >= 800 {
					targetDivision = domain.DivisionAkihabara
				} else if user.XP >= 300 {
					targetDivision = domain.DivisionShibuya
				} else {
					targetDivision = domain.DivisionShinjuku
				}
			}
		}
	}

	return u.leaderboardRepo.GetWeeklyLeaderboard(ctx, userID, targetDivision)
}
