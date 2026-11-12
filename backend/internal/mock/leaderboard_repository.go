package mock

import (
	"context"

	"codeabroad/backend/internal/domain"
)

// LeaderboardRepository implements domain.LeaderboardRepository for unit testing
type LeaderboardRepository struct {
	Standings               []domain.LeaderboardEntry
	UserStandings           map[string]*domain.LeaderboardEntry
	GetDivisionStandingsErr error
	GetUserStandingErr      error
}

// NewLeaderboardRepository creates an in-memory mock LeaderboardRepository
func NewLeaderboardRepository() *LeaderboardRepository {
	return &LeaderboardRepository{
		UserStandings: make(map[string]*domain.LeaderboardEntry),
	}
}

var _ domain.LeaderboardRepository = (*LeaderboardRepository)(nil)

func (m *LeaderboardRepository) GetDivisionStandings(ctx context.Context, minXP int, maxXP int, limit int) ([]domain.LeaderboardEntry, error) {
	if m.GetDivisionStandingsErr != nil {
		return nil, m.GetDivisionStandingsErr
	}
	var res []domain.LeaderboardEntry
	for _, s := range m.Standings {
		if s.WeeklyXP >= minXP && (maxXP == 0 || s.WeeklyXP <= maxXP) {
			res = append(res, s)
			if limit > 0 && len(res) >= limit {
				break
			}
		}
	}
	return res, nil
}

func (m *LeaderboardRepository) GetUserStanding(ctx context.Context, userID string) (*domain.LeaderboardEntry, error) {
	if m.GetUserStandingErr != nil {
		return nil, m.GetUserStandingErr
	}
	entry, ok := m.UserStandings[userID]
	if !ok {
		return nil, nil
	}
	return entry, nil
}

