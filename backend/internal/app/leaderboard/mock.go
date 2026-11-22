package leaderboard

import (
	"context"
	"fmt"
	"sort"
	"sync"
)

// MockRepository implements Repository and WeeklyRewardRepository for unit testing
type MockRepository struct {
	mu                      sync.RWMutex
	Standings               []LeaderboardEntry
	UserStandings           map[string]*LeaderboardEntry
	PendingRewards          map[string]*PendingWeeklyReward
	ClaimedRewards          map[string]bool
	UserGems                map[string]int
	GetDivisionStandingsErr error
	GetUserStandingErr      error
	ClaimWeeklyRewardErr    error
}

// NewMockRepository creates an in-memory mock leaderboard Repository
func NewMockRepository() *MockRepository {
	return &MockRepository{
		UserStandings:  make(map[string]*LeaderboardEntry),
		PendingRewards: make(map[string]*PendingWeeklyReward),
		ClaimedRewards: make(map[string]bool),
		UserGems:       make(map[string]int),
	}
}

var _ Repository = (*MockRepository)(nil)
var _ WeeklyRewardRepository = (*MockRepository)(nil)

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

func rewardSeasonKey(userID string, seasonYear int, seasonWeek int) string {
	return fmt.Sprintf("%s:%d:%d", userID, seasonYear, seasonWeek)
}

func (m *MockRepository) GetPreviousWeekRewardStatus(
	ctx context.Context,
	userID string,
	seasonYear int,
	seasonWeek int,
) (*PendingWeeklyReward, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	reward, ok := m.PendingRewards[userID]
	if !ok || reward == nil {
		return nil, nil
	}
	cp := *reward
	if cp.SeasonYear == 0 {
		cp.SeasonYear = seasonYear
	}
	if cp.SeasonWeek == 0 {
		cp.SeasonWeek = seasonWeek
	}
	if m.ClaimedRewards[rewardSeasonKey(userID, cp.SeasonYear, cp.SeasonWeek)] {
		cp.Claimed = true
	}
	return &cp, nil
}

func (m *MockRepository) ClaimPreviousWeekRewardTx(
	ctx context.Context,
	userID string,
	seasonYear int,
	seasonWeek int,
) (*ClaimWeeklyRewardResponse, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.ClaimWeeklyRewardErr != nil {
		return nil, m.ClaimWeeklyRewardErr
	}

	reward, ok := m.PendingRewards[userID]
	if !ok || reward == nil || reward.WeeklyXP <= 0 || reward.Rank < 1 || reward.Rank > 3 {
		return nil, ErrNoPendingWeeklyReward
	}

	yr := reward.SeasonYear
	if yr == 0 {
		yr = seasonYear
	}
	wk := reward.SeasonWeek
	if wk == 0 {
		wk = seasonWeek
	}
	key := rewardSeasonKey(userID, yr, wk)
	if reward.Claimed || m.ClaimedRewards[key] {
		return nil, ErrWeeklyRewardAlreadyClaimed
	}

	gemsAwarded := reward.GemsAwarded
	if gemsAwarded <= 0 {
		gemsAwarded = NewHelper().WeeklyPrizeGems(reward.Rank)
	}
	if gemsAwarded <= 0 {
		return nil, ErrNoPendingWeeklyReward
	}

	m.ClaimedRewards[key] = true
	cp := *reward
	cp.SeasonYear = yr
	cp.SeasonWeek = wk
	cp.GemsAwarded = gemsAwarded
	cp.Claimed = true
	m.PendingRewards[userID] = &cp
	m.UserGems[userID] += gemsAwarded

	return &ClaimWeeklyRewardResponse{
		Reward:  cp,
		NewGems: m.UserGems[userID],
	}, nil
}

