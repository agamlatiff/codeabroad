package mock

import (
	"context"
	"fmt"
	"time"

	"codeabroad/backend/internal/domain"
)

// UserRepository implements domain.UserRepository for unit testing
type UserRepository struct {
	Users                map[string]*domain.User
	ActivityLogs         []domain.UserActivityLog
	DailyRewardsStatus   map[string]*domain.DailyRewardsStatusResponse
	CreateError          error
	GetByIDError         error
	GetByEmailError      error
	GetByUsernameError   error
	UpdateProfileError   error
	SetOnboardedError    error
	UpdateGamificationErr error
	AddGemsError         error
	LogActivityError     error
	ClaimRewardError     error
}

// NewUserRepository creates an in-memory mock UserRepository
func NewUserRepository() *UserRepository {
	return &UserRepository{
		Users:              make(map[string]*domain.User),
		DailyRewardsStatus: make(map[string]*domain.DailyRewardsStatusResponse),
	}
}

// Ensure mock satisfies domain.UserRepository at compile time
var _ domain.UserRepository = (*UserRepository)(nil)

func (m *UserRepository) Create(ctx context.Context, user *domain.User) error {
	if m.CreateError != nil {
		return m.CreateError
	}
	if user.ID == "" {
		user.ID = fmt.Sprintf("usr_%d", len(m.Users)+1)
	}
	m.Users[user.ID] = user
	return nil
}

func (m *UserRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
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

func (m *UserRepository) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
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

func (m *UserRepository) GetByID(ctx context.Context, id string) (*domain.User, error) {
	if m.GetByIDError != nil {
		return nil, m.GetByIDError
	}
	u, ok := m.Users[id]
	if !ok {
		return nil, nil
	}
	return u, nil
}

func (m *UserRepository) UpdateProfile(ctx context.Context, userID string, req *domain.UpdateProfileRequest) (*domain.User, error) {
	if m.UpdateProfileError != nil {
		return nil, m.UpdateProfileError
	}
	u, ok := m.Users[userID]
	if !ok {
		return nil, domain.ErrNotFound
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

func (m *UserRepository) SetOnboarded(ctx context.Context, userID string, dailyGoalMinutes int) error {
	if m.SetOnboardedError != nil {
		return m.SetOnboardedError
	}
	u, ok := m.Users[userID]
	if !ok {
		return domain.ErrNotFound
	}
	u.IsOnboarded = true
	u.DailyGoalMinutes = dailyGoalMinutes
	return nil
}

func (m *UserRepository) UpdateGamification(ctx context.Context, userID string, xp int, currentLevel int, streak int, lastActiveAt *time.Time) error {
	if m.UpdateGamificationErr != nil {
		return m.UpdateGamificationErr
	}
	u, ok := m.Users[userID]
	if !ok {
		return domain.ErrNotFound
	}
	u.XP = xp
	u.CurrentLevel = currentLevel
	u.Streak = streak
	u.LastActiveAt = lastActiveAt
	return nil
}

func (m *UserRepository) AddGems(ctx context.Context, userID string, gems int) (int, error) {
	if m.AddGemsError != nil {
		return 0, m.AddGemsError
	}
	u, ok := m.Users[userID]
	if !ok {
		return 0, domain.ErrNotFound
	}
	u.Gems += gems
	return u.Gems, nil
}

func (m *UserRepository) LogActivity(ctx context.Context, log *domain.UserActivityLog) error {
	if m.LogActivityError != nil {
		return m.LogActivityError
	}
	m.ActivityLogs = append(m.ActivityLogs, *log)
	return nil
}

func (m *UserRepository) HasActivityInRange(ctx context.Context, userID string, startTime time.Time, endTime time.Time) (bool, error) {
	for _, l := range m.ActivityLogs {
		if l.UserID == userID && !l.CreatedAt.Before(startTime) && !l.CreatedAt.After(endTime) {
			return true, nil
		}
	}
	return false, nil
}

func (m *UserRepository) GetDailyActivityStatsSince(ctx context.Context, userID string, since time.Time) (map[string]domain.DailyActivityStat, error) {
	stats := make(map[string]domain.DailyActivityStat)
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

func (m *UserRepository) ClaimDailyReward(ctx context.Context, userID string, rewardType string, xpAwarded int, newLevel int) (*domain.DailyRewardClaimResponse, error) {
	if m.ClaimRewardError != nil {
		return nil, m.ClaimRewardError
	}
	u, ok := m.Users[userID]
	if !ok {
		return nil, domain.ErrNotFound
	}
	u.XP += xpAwarded
	u.CurrentLevel = newLevel

	st, ok := m.DailyRewardsStatus[userID]
	if !ok {
		st = &domain.DailyRewardsStatusResponse{
			Date: time.Now().Format("2006-01-02"),
		}
		m.DailyRewardsStatus[userID] = st
	}
	if rewardType == "milestone" {
		st.LessonMilestoneClaimed = true
	} else if rewardType == "golden_chest" {
		st.GoldenChestClaimed = true
	}

	return &domain.DailyRewardClaimResponse{
		RewardType:   rewardType,
		XPAwarded:    xpAwarded,
		CurrentXP:    u.XP,
		CurrentLevel: u.CurrentLevel,
		Streak:       u.Streak,
		ClaimedAt:    time.Now().Format(time.RFC3339),
	}, nil
}

func (m *UserRepository) GetDailyRewardsStatus(ctx context.Context, userID string) (*domain.DailyRewardsStatusResponse, error) {
	st, ok := m.DailyRewardsStatus[userID]
	if !ok {
		return &domain.DailyRewardsStatusResponse{
			Date:                   time.Now().Format("2006-01-02"),
			LessonMilestoneClaimed: false,
			GoldenChestClaimed:     false,
		}, nil
	}
	return st, nil
}
