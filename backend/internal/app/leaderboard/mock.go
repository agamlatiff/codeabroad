package leaderboard

import (
	"context"
)

// MockRepository implements Repository for unit testing
type MockRepository struct {
	Standings               []LeaderboardEntry
	UserStandings           map[string]*LeaderboardEntry
	GetDivisionStandingsErr error
	GetUserStandingErr      error
}

// NewMockRepository creates an in-memory mock leaderboard Repository
func NewMockRepository() *MockRepository {
	return &MockRepository{
		UserStandings: make(map[string]*LeaderboardEntry),
	}
}

var _ Repository = (*MockRepository)(nil)

func (m *MockRepository) GetDivisionStandings(ctx context.Context, minXP int, maxXP int, limit int) ([]LeaderboardEntry, error) {
	if m.GetDivisionStandingsErr != nil {
		return nil, m.GetDivisionStandingsErr
	}
	var res []LeaderboardEntry
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

func (m *MockRepository) GetUserStanding(ctx context.Context, userID string) (*LeaderboardEntry, error) {
	if m.GetUserStandingErr != nil {
		return nil, m.GetUserStandingErr
	}
	entry, ok := m.UserStandings[userID]
	if !ok {
		return nil, nil
	}
	return entry, nil
}

