package user_test

import (
	"context"
	"testing"
	"time"

	"codeabroad/backend/internal/domain"
	userUsecasePkg "codeabroad/backend/internal/usecase/user"
)

type mockUserRepository struct {
	usersByID map[string]*domain.User
}

func newMockUserRepository() *mockUserRepository {
	return &mockUserRepository{
		usersByID: make(map[string]*domain.User),
	}
}

func (m *mockUserRepository) Create(ctx context.Context, user *domain.User) error {
	m.usersByID[user.ID] = user
	return nil
}

func (m *mockUserRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	return nil, nil
}

func (m *mockUserRepository) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
	return nil, nil
}

func (m *mockUserRepository) GetByID(ctx context.Context, id string) (*domain.User, error) {
	return m.usersByID[id], nil
}

func (m *mockUserRepository) SetOnboarded(ctx context.Context, userID string, dailyGoalMinutes int) error {
	if u, ok := m.usersByID[userID]; ok {
		u.IsOnboarded = true
		u.DailyGoalMinutes = dailyGoalMinutes
	}
	return nil
}

func (m *mockUserRepository) UpdateGamification(ctx context.Context, userID string, xp int, currentLevel int, streak int, lastActiveAt *time.Time) error {
	return nil
}

func (m *mockUserRepository) UpdateProfile(ctx context.Context, userID string, req *domain.UpdateProfileRequest) (*domain.User, error) {
	user := m.usersByID[userID]
	if user == nil {
		return nil, domain.ErrUserNotFound
	}
	if req.Name != nil {
		user.Name = *req.Name
	}
	if req.DailyGoalMinutes != nil {
		user.DailyGoalMinutes = *req.DailyGoalMinutes
	}
	if req.PreferredRoadmapView != nil {
		user.PreferredRoadmapView = *req.PreferredRoadmapView
	}
	return user, nil
}

func (m *mockUserRepository) LogActivity(ctx context.Context, log *domain.UserActivityLog) error {
	return nil
}

func (m *mockUserRepository) HasActivityInRange(ctx context.Context, userID string, startTime time.Time, endTime time.Time) (bool, error) {
	return true, nil
}

func (m *mockUserRepository) GetDailyActivityStatsSince(ctx context.Context, userID string, since time.Time) (map[string]domain.DailyActivityStat, error) {
	return map[string]domain.DailyActivityStat{}, nil
}

func (m *mockUserRepository) ClaimDailyReward(ctx context.Context, userID string, rewardType string, xpAwarded int, newLevel int) (*domain.DailyRewardClaimResponse, error) {
	user := m.usersByID[userID]
	if user == nil {
		return nil, domain.ErrUserNotFound
	}
	user.XP += xpAwarded
	user.CurrentLevel = newLevel
	return &domain.DailyRewardClaimResponse{
		RewardType:   rewardType,
		XPAwarded:    xpAwarded,
		CurrentXP:    user.XP,
		CurrentLevel: user.CurrentLevel,
		Streak:       user.Streak,
		ClaimedAt:    "2026-10-14T10:00:00Z",
	}, nil
}

func (m *mockUserRepository) GetDailyRewardsStatus(ctx context.Context, userID string) (*domain.DailyRewardsStatusResponse, error) {
	return &domain.DailyRewardsStatusResponse{
		Date:                   "2026-10-14",
		LessonMilestoneClaimed: false,
		GoldenChestClaimed:     false,
	}, nil
}

func (m *mockUserRepository) AddGems(ctx context.Context, userID string, gems int) (int, error) {
	return 0, nil
}

func TestGetProfile_Success(t *testing.T) {
	repo := newMockUserRepository()
	repo.usersByID["user-123"] = &domain.User{
		UserAccount: domain.UserAccount{
			ID:    "user-123",
			Email: "learner@codeabroad.io",
		},
		UserProfile: domain.UserProfile{
			Name:             "CodeAbroad Learner",
			Username:         "learner123",
			DailyGoalMinutes: 15,
		},
	}

	uc := userUsecasePkg.New(repo)
	res, err := uc.GetProfile(context.Background(), "user-123")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.Name != "CodeAbroad Learner" {
		t.Errorf("expected name 'CodeAbroad Learner', got '%s'", res.Name)
	}
	if res.DailyGoalMinutes != 15 {
		t.Errorf("expected daily goal 15, got %d", res.DailyGoalMinutes)
	}
}

func TestClaimDailyReward_Success(t *testing.T) {
	repo := newMockUserRepository()
	repo.usersByID["user-123"] = &domain.User{
		UserAccount: domain.UserAccount{
			ID: "user-123",
		},
		UserGamificationStats: domain.UserGamificationStats{
			XP:           50,
			CurrentLevel: 1,
			Streak:       3,
		},
	}

	uc := userUsecasePkg.New(repo)
	res, err := uc.ClaimDailyReward(context.Background(), "user-123", "lesson_milestone")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.XPAwarded != 30 {
		t.Errorf("expected 30 XP, got %d", res.XPAwarded)
	}
	if res.CurrentXP != 80 {
		t.Errorf("expected 80 XP, got %d", res.CurrentXP)
	}
}
