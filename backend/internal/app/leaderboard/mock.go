package leaderboard

import (
	"context"
	"sort"
	"sync"
)

// MockRepository implements Repository for unit testing
type MockRepository struct {
	mu                      sync.RWMutex
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
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetDivisionStandingsErr != nil {
		return nil, m.GetDivisionStandingsErr
	}
	var res []LeaderboardEntry
	for _, s := range m.Standings {
		divXP := s.TotalXP
		if divXP == 0 && s.WeeklyXP > 0 {
			divXP = s.WeeklyXP
		}
		if divXP >= minXP && (maxXP == 0 || divXP < maxXP) {
			res = append(res, s)
		}
	}
	sort.Slice(res, func(i, j int) bool {
		if res[i].WeeklyXP != res[j].WeeklyXP {
			return res[i].WeeklyXP > res[j].WeeklyXP
		}
		if res[i].Streak != res[j].Streak {
			return res[i].Streak > res[j].Streak
		}
		if res[i].TotalXP != res[j].TotalXP {
			return res[i].TotalXP > res[j].TotalXP
		}
		return res[i].UserID < res[j].UserID
	})
	if limit > 0 && len(res) > limit {
		res = res[:limit]
	}
	return res, nil
}

func (m *MockRepository) GetUserStanding(ctx context.Context, userID string) (*LeaderboardEntry, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetUserStandingErr != nil {
		return nil, m.GetUserStandingErr
	}
	entry, ok := m.UserStandings[userID]
	if !ok || entry == nil {
		return nil, nil
	}
	cp := *entry
	return &cp, nil
}

