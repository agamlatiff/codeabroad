package user

import (
	"context"
	"fmt"
	"time"

	"codeabroad/backend/internal/shared/apperror"
)

// MockRepository implements Repository for unit testing
type MockRepository struct {
	Users                 map[string]*User
	ActivityLogs          []UserActivityLog
	DailyRewardsStatus    map[string]*DailyRewardsStatusResponse
	CreateError           error
	GetByIDError          error
	GetByEmailError       error
	GetByUsernameError    error
	UpdateProfileError    error
	SetOnboardedError     error
	UpdateGamificationErr error
	AddGemsError          error
	LogActivityError      error
	ClaimRewardError      error
}

// NewMockRepository creates an in-memory mock user Repository
func NewMockRepository() *MockRepository {
	return &MockRepository{
		Users:              make(map[string]*User),
		DailyRewardsStatus: make(map[string]*DailyRewardsStatusResponse),
	}
}

var _ Repository = (*MockRepository)(nil)

func (m *MockRepository) Create(ctx context.Context, u *User) error {
	if m.CreateError != nil {
		return m.CreateError
	}
	if u.ID == "" {
		u.ID = fmt.Sprintf("usr_%d", len(m.Users)+1)
	}
	m.Users[u.ID] = u
	return nil
}

func (m *MockRepository) GetByEmail(ctx context.Context, email string) (*User, error) {
	if m.GetByEmailError != nil {
		return nil, m.GetByEmailError
	}
	for _, u := range m.Users {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, nil
}

func (m *MockRepository) GetByUsername(ctx context.Context, username string) (*User, error) {
	if m.GetByUsernameError != nil {
		return nil, m.GetByUsernameError
	}
	for _, u := range m.Users {
		if u.Username == username {
			return u, nil
		}
	}
	return nil, nil
}

func (m *MockRepository) GetByID(ctx context.Context, id string) (*User, error) {
	if m.GetByIDError != nil {
		return nil, m.GetByIDError
	}
	u, ok := m.Users[id]
	if !ok {
		return nil, nil
	}
	return u, nil
}

func (m *MockRepository) UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error) {
	if m.UpdateProfileError != nil {
		return nil, m.UpdateProfileError
	}
	u, ok := m.Users[userID]
	if !ok {
		return nil, apperror.ErrNotFound
	}
	if req.Name != nil {
		u.Name = *req.Name
	}
	if req.Bio != nil {
		u.Bio = req.Bio
	}
	if req.DailyGoalMinutes != nil {
		u.DailyGoalMinutes = *req.DailyGoalMinutes
	}
	if req.HasSeenRoadmapTour != nil {
		u.HasSeenRoadmapTour = *req.HasSeenRoadmapTour
	}
	if req.PreferredRoadmapView != nil {
		u.PreferredRoadmapView = *req.PreferredRoadmapView
	}
	return u, nil
}

func (m *MockRepository) SetOnboarded(ctx context.Context, userID string, dailyGoalMinutes int) error {
	if m.SetOnboardedError != nil {
		return m.SetOnboardedError
	}
	u, ok := m.Users[userID]
	if !ok {
		return apperror.ErrNotFound
	}
	u.IsOnboarded = true
	u.DailyGoalMinutes = dailyGoalMinutes
	return nil
}

func (m *MockRepository) UpdateGamification(ctx context.Context, userID string, xp int, currentLevel int, streak int, lastActiveAt *time.Time) error {
	if m.UpdateGamificationErr != nil {
		return m.UpdateGamificationErr
	}
	u, ok := m.Users[userID]
	if !ok {
		return apperror.ErrNotFound
	}
	u.XP = xp
	u.CurrentLevel = currentLevel
	u.Streak = streak
	u.LastActiveAt = lastActiveAt
	return nil
}

func (m *MockRepository) AddGems(ctx context.Context, userID string, gems int) (int, error) {
	if m.AddGemsError != nil {
		return 0, m.AddGemsError
	}
	u, ok := m.Users[userID]
	if !ok {
		return 0, apperror.ErrNotFound
	}
	u.Gems += gems
	return u.Gems, nil
}

func (m *MockRepository) LogActivity(ctx context.Context, log *UserActivityLog) error {
	if m.LogActivityError != nil {
		return m.LogActivityError
	}
	m.ActivityLogs = append(m.ActivityLogs, *log)
	return nil
}

func (m *MockRepository) HasActivityInRange(ctx context.Context, userID string, startTime time.Time, endTime time.Time) (bool, error) {
	for _, l := range m.ActivityLogs {
		if l.UserID == userID && !l.CreatedAt.Before(startTime) && !l.CreatedAt.After(endTime) {
			return true, nil
		}
	}
	return false, nil
}

func (m *MockRepository) EnsureDailyLogin(ctx context.Context, userID string, dateStr string, startTime time.Time, endTime time.Time) (bool, error) {
	exists, err := m.HasActivityInRange(ctx, userID, startTime, endTime)
	if err != nil || exists {
		return false, err
	}
	now := time.Now().UTC()
	if err := m.LogActivity(ctx, &UserActivityLog{
		UserID:       userID,
		ActivityType: "daily_login",
		XPEarned:     0,
		Metadata:     map[string]any{"date": dateStr},
		CreatedAt:    now,
	}); err != nil {
		return false, err
	}
	if u, ok := m.Users[userID]; ok {
		if newStreak, changed := NewHelper().EvaluateDailyStreak(u.Streak, u.LastActiveAt, now); changed {
			u.Streak = newStreak
		}
		u.LastActiveAt = &now
	}
	return true, nil
}

func (m *MockRepository) GetDailyActivityStatsSince(ctx context.Context, userID string, since time.Time) (map[string]DailyActivityStat, error) {
	stats := make(map[string]DailyActivityStat)
	for _, l := range m.ActivityLogs {
		if l.UserID == userID && !l.CreatedAt.Before(since) {
			dayKey := l.CreatedAt.Format("2006-01-02")
			stat := stats[dayKey]
			stat.XPEarned += l.XPEarned
			if l.ActivityType == "lesson_complete" {
				stat.LessonsCount++
			}
			stats[dayKey] = stat
		}
	}
	return stats, nil
}

func (m *MockRepository) ClaimDailyReward(ctx context.Context, userID string, rewardType string, xpAwarded int) (*DailyRewardClaimResponse, error) {
	if m.ClaimRewardError != nil {
		return nil, m.ClaimRewardError
	}
	u, ok := m.Users[userID]
	if !ok {
		return nil, apperror.ErrNotFound
	}

	st, ok := m.DailyRewardsStatus[userID]
	if !ok {
		st = &DailyRewardsStatusResponse{
			Date: time.Now().In(defaultAppLocation).Format("2006-01-02"),
		}
		m.DailyRewardsStatus[userID] = st
	}

	if rewardType == "vocab_quest" {
		if st.VocabQuestClaimed {
			return nil, ErrDailyRewardAlreadyClaimed
		}
		st.VocabQuestClaimed = true
	} else if rewardType == "golden_chest" {
		if st.GoldenChestClaimed {
			return nil, ErrDailyRewardAlreadyClaimed
		}
		st.GoldenChestClaimed = true
	}

	u.XP += xpAwarded
	u.CurrentLevel = CalculateLevel(u.XP)

	return &DailyRewardClaimResponse{
		RewardType:   rewardType,
		XPAwarded:    xpAwarded,
		CurrentXP:    u.XP,
		CurrentLevel: u.CurrentLevel,
		Streak:       u.Streak,
		ClaimedAt:    time.Now().UTC().Format(time.RFC3339),
	}, nil
}

func (m *MockRepository) GetDailyRewardsStatus(ctx context.Context, userID string) (*DailyRewardsStatusResponse, error) {
	st, ok := m.DailyRewardsStatus[userID]
	if !ok {
		return &DailyRewardsStatusResponse{
			Date:               time.Now().In(defaultAppLocation).Format("2006-01-02"),
			VocabQuestClaimed:  false,
			GoldenChestClaimed: false,
		}, nil
	}
	return st, nil
}

