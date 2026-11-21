package user

import (
	"context"
	"fmt"
	"sync"
	"time"

	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/progression"
)

// MockRepository implements Repository for unit testing
type MockRepository struct {
	mu                      sync.Mutex
	Users                   map[string]*User
	ActivityLogs            []UserActivityLog
	DailyRewardsStatus      map[string]*DailyRewardsStatusResponse
	FlashcardsReviewedToday map[string]int
	CreateError             error
	GetByIDError            error
	GetByEmailError         error
	GetByUsernameError      error
	UpdateProfileError      error
	SetOnboardedError       error
	UpdateGamificationErr   error
	AddGemsError            error
	LogActivityError        error
	ClaimRewardError        error
}

// NewMockRepository creates an in-memory mock user Repository
func NewMockRepository() *MockRepository {
	return &MockRepository{
		Users:                   make(map[string]*User),
		DailyRewardsStatus:      make(map[string]*DailyRewardsStatusResponse),
		FlashcardsReviewedToday: make(map[string]int),
	}
}

var _ Repository = (*MockRepository)(nil)

func (m *MockRepository) Create(ctx context.Context, u *User) error {
	m.mu.Lock()
	defer m.mu.Unlock()
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
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.GetByEmailError != nil {
		return nil, m.GetByEmailError
	}
	for _, u := range m.Users {
		if u.Email == email {
			cp := *u
			return &cp, nil
		}
	}
	return nil, nil
}

func (m *MockRepository) GetByUsername(ctx context.Context, username string) (*User, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.GetByUsernameError != nil {
		return nil, m.GetByUsernameError
	}
	for _, u := range m.Users {
		if u.Username == username {
			cp := *u
			return &cp, nil
		}
	}
	return nil, nil
}

func (m *MockRepository) GetByID(ctx context.Context, id string) (*User, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.GetByIDError != nil {
		return nil, m.GetByIDError
	}
	u, ok := m.Users[id]
	if !ok {
		return nil, nil
	}
	cp := *u
	return &cp, nil
}

func (m *MockRepository) UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
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
	if req.AvatarURL != nil {
		if *req.AvatarURL == "" {
			u.AvatarURL = nil
		} else {
			v := *req.AvatarURL
			u.AvatarURL = &v
		}
	}
	if req.DailyGoalMinutes != nil {
		u.DailyGoalMinutes = *req.DailyGoalMinutes
	}
	if req.HasSeenRoadmapTour != nil {
		u.HasSeenRoadmapTour = *req.HasSeenRoadmapTour
	}
	cp := *u
	return &cp, nil
}

func (m *MockRepository) SetOnboarded(ctx context.Context, userID string, dailyGoalMinutes int) error {
	m.mu.Lock()
	defer m.mu.Unlock()
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
	m.mu.Lock()
	defer m.mu.Unlock()
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
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.AddGemsError != nil {
		return 0, m.AddGemsError
	}
	u, ok := m.Users[userID]
	if !ok {
		return 0, apperror.ErrNotFound
	}
	u.Gems += gems
	if u.Gems < 0 {
		u.Gems = 0
	}
	return u.Gems, nil
}

func (m *MockRepository) LogActivity(ctx context.Context, log *UserActivityLog) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.LogActivityError != nil {
		return m.LogActivityError
	}
	now := log.CreatedAt
	if now.IsZero() {
		now = time.Now().UTC()
	}
	cp := *log
	cp.CreatedAt = now
	m.ActivityLogs = append(m.ActivityLogs, cp)
	if u, ok := m.Users[log.UserID]; ok {
		if newStreak, changed := progression.EvaluateDailyStreak(u.LastActiveAt, u.Streak, now); changed {
			u.Streak = newStreak
		}
		u.LastActiveAt = &now
	}
	return nil
}

func (m *MockRepository) HasActivityInRange(ctx context.Context, userID string, startTime time.Time, endTime time.Time) (bool, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.hasActivityInRangeLocked(userID, startTime, endTime), nil
}

func (m *MockRepository) hasActivityInRangeLocked(userID string, startTime time.Time, endTime time.Time) bool {
	for _, l := range m.ActivityLogs {
		if l.UserID == userID && !l.CreatedAt.Before(startTime) && l.CreatedAt.Before(endTime) {
			return true
		}
	}
	return false
}

func (m *MockRepository) EnsureDailyLogin(ctx context.Context, userID string, dateStr string, startTime time.Time, endTime time.Time) (bool, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.hasActivityInRangeLocked(userID, startTime, endTime) {
		return false, nil
	}
	if m.LogActivityError != nil {
		return false, m.LogActivityError
	}
	now := time.Now().UTC()
	m.ActivityLogs = append(m.ActivityLogs, UserActivityLog{
		UserID:       userID,
		ActivityType: "daily_login",
		XPEarned:     0,
		Metadata:     map[string]any{"date": dateStr},
		CreatedAt:    now,
	})
	if u, ok := m.Users[userID]; ok {
		if newStreak, changed := progression.EvaluateDailyStreak(u.LastActiveAt, u.Streak, now); changed {
			u.Streak = newStreak
		}
		u.LastActiveAt = &now
	}
	return true, nil
}

func (m *MockRepository) GetDailyActivityStatsSince(ctx context.Context, userID string, since time.Time) (map[string]DailyActivityStat, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	stats := make(map[string]DailyActivityStat)
	for _, l := range m.ActivityLogs {
		if l.UserID == userID && !l.CreatedAt.Before(since) {
			dayKey := progression.TodayWIBDateKey(l.CreatedAt)
			stat := stats[dayKey]
			stat.XPEarned += l.XPEarned
			if l.ActivityType == "lesson_completed" {
				stat.LessonsCount++
			}
			stats[dayKey] = stat
		}
	}
	return stats, nil
}

func (m *MockRepository) ClaimDailyReward(ctx context.Context, userID string, rewardType string, xpAwarded int, gemsAwarded int) (*DailyRewardClaimResponse, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.ClaimRewardError != nil {
		return nil, m.ClaimRewardError
	}
	u, ok := m.Users[userID]
	if !ok {
		return nil, ErrUserNotFound
	}

	now := time.Now().UTC()
	today := progression.TodayWIBDateKey(now)
	startOfToday, _ := progression.WIBDayBounds(now)

	st, ok := m.DailyRewardsStatus[userID]
	if !ok || st.Date != today {
		st = &DailyRewardsStatusResponse{Date: today}
		m.DailyRewardsStatus[userID] = st
	}

	if rewardType == "vocab_quest" {
		if st.VocabQuestClaimed {
			return nil, ErrDailyRewardAlreadyClaimed
		}
		if m.FlashcardsReviewedToday[userID] < VocabQuestDailyFlashcardThreshold {
			return nil, ErrDailyRewardNotUnlocked
		}
		st.VocabQuestClaimed = true
	} else if rewardType == "golden_chest" {
		if st.GoldenChestClaimed {
			return nil, ErrDailyRewardAlreadyClaimed
		}
		todayXP := 0
		for _, l := range m.ActivityLogs {
			if l.UserID == userID && !l.CreatedAt.Before(startOfToday) && l.ActivityType != "daily_golden_chest_claim" {
				todayXP += l.XPEarned
			}
		}
		if todayXP < GoldenChestDailyXPThreshold {
			return nil, ErrDailyRewardNotUnlocked
		}
		st.GoldenChestClaimed = true
	}

	u.XP += xpAwarded
	u.CurrentLevel = CalculateLevel(u.XP)
	u.Gems += gemsAwarded
	if u.Gems < 0 {
		u.Gems = 0
	}
	if newStreak, changed := progression.EvaluateDailyStreak(u.LastActiveAt, u.Streak, now); changed {
		u.Streak = newStreak
	}
	u.LastActiveAt = &now

	m.ActivityLogs = append(m.ActivityLogs, UserActivityLog{
		UserID:       userID,
		ActivityType: "daily_" + rewardType + "_claim",
		XPEarned:     xpAwarded,
		Metadata:     map[string]any{"reward_type": rewardType, "date": today, "xp_awarded": xpAwarded, "gems_awarded": gemsAwarded},
		CreatedAt:    now,
	})

	return &DailyRewardClaimResponse{
		RewardType:   rewardType,
		XPAwarded:    xpAwarded,
		GemsAwarded:  gemsAwarded,
		CurrentXP:    u.XP,
		CurrentLevel: u.CurrentLevel,
		CurrentGems:  u.Gems,
		Streak:       u.Streak,
		ClaimedAt:    now.Format(time.RFC3339),
	}, nil
}

func (m *MockRepository) GetDailyRewardsStatus(ctx context.Context, userID string) (*DailyRewardsStatusResponse, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	today := progression.TodayWIBDateKey(time.Now())
	reviewedToday := m.FlashcardsReviewedToday[userID]
	st, ok := m.DailyRewardsStatus[userID]
	if !ok || st.Date != today {
		return &DailyRewardsStatusResponse{
			Date:                    today,
			VocabQuestClaimed:       false,
			GoldenChestClaimed:      false,
			TodayFlashcardsReviewed: reviewedToday,
			VocabQuestTarget:        VocabQuestDailyFlashcardThreshold,
			VocabQuestUnlocked:      reviewedToday >= VocabQuestDailyFlashcardThreshold,
		}, nil
	}
	cp := *st
	cp.TodayFlashcardsReviewed = reviewedToday
	cp.VocabQuestTarget = VocabQuestDailyFlashcardThreshold
	cp.VocabQuestUnlocked = reviewedToday >= VocabQuestDailyFlashcardThreshold
	return &cp, nil
}

