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

func (m *mockUserRepository) UpdateOnboarding(ctx context.Context, userID string, countryID string, careerPathID string, primaryStack string, bonusXP int) error {
	return nil
}

func (m *mockUserRepository) GetProfileWithDetails(ctx context.Context, userID string) (*domain.OnboardingProfileResponse, error) {
	return nil, nil
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
	if req.PrimaryStack != nil {
		user.PrimaryStack = req.PrimaryStack
	}
	if req.PreferredRoadmapView != nil {
		user.PreferredRoadmapView = *req.PreferredRoadmapView
	}
	return user, nil
}

func (m *mockUserRepository) LogActivity(ctx context.Context, userID string, activityType string, xpEarned int, metadata map[string]interface{}) error {
	return nil
}

func (m *mockUserRepository) HasActivityInRange(ctx context.Context, userID string, startTime time.Time, endTime time.Time) (bool, error) {
	return true, nil
}

func (m *mockUserRepository) GetDailyActivityStatsSince(ctx context.Context, userID string, since time.Time) (map[string]domain.DailyActivityStat, error) {
	return map[string]domain.DailyActivityStat{}, nil
}

func (m *mockUserRepository) ClaimDailyReward(ctx context.Context, userID string, rewardType string, xpAwarded int) (*domain.DailyRewardClaimResponse, error) {
	user := m.usersByID[userID]
	if user == nil {
		return nil, domain.ErrUserNotFound
	}
	user.XP += xpAwarded
	user.CurrentLevel = ((user.XP / 100) + 1)
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
		Date:               "2026-10-14",
		VocabQuestClaimed:  false,
		GoldenChestClaimed: false,
	}, nil
}

func (m *mockUserRepository) AddGems(ctx context.Context, userID string, gems int) (int, error) {
	return 0, nil
}

func TestGetProfile_Success(t *testing.T) {
	repo := newMockUserRepository()
	uc := userUsecasePkg.New(repo)
	ctx := context.Background()

	user := &domain.User{
		UserAccount: domain.UserAccount{
			ID:    "usr_profile_1",
			Email: "profile@example.com",
		},
		UserProfile: domain.UserProfile{
			Name:     "Profile User",
			Username: "profileuser",
		},
	}
	_ = repo.Create(ctx, user)

	profile, err := uc.GetProfile(ctx, "usr_profile_1")
	if err != nil {
		t.Fatalf("expected profile, got error: %v", err)
	}
	if profile.ID != user.ID || profile.Email != user.Email {
		t.Fatalf("profile data mismatch: %+v", profile)
	}
}

func TestGetProfile_NotFound(t *testing.T) {
	repo := newMockUserRepository()
	uc := userUsecasePkg.New(repo)
	ctx := context.Background()

	_, err := uc.GetProfile(ctx, "non_existent_id")
	if err != domain.ErrUserNotFound {
		t.Fatalf("expected domain.ErrUserNotFound, got: %v", err)
	}
}

func TestUpdateProfile_InvalidRoadmapView(t *testing.T) {
	repo := newMockUserRepository()
	uc := userUsecasePkg.New(repo)
	ctx := context.Background()

	invalidView := "invalid_view"
	_, err := uc.UpdateProfile(ctx, "usr_1", &domain.UpdateProfileRequest{
		PreferredRoadmapView: &invalidView,
	})
	if err == nil {
		t.Fatal("expected validation error for invalid roadmap view, got nil")
	}
}

func TestClaimDailyReward_VocabQuest(t *testing.T) {
	repo := newMockUserRepository()
	uc := userUsecasePkg.New(repo)
	ctx := context.Background()

	_ = repo.Create(ctx, &domain.User{
		UserAccount:           domain.UserAccount{ID: "usr_1"},
		UserGamificationStats: domain.UserGamificationStats{XP: 80, CurrentLevel: 1},
	})

	res, err := uc.ClaimDailyReward(ctx, "usr_1", "vocab_quest")
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	if res.XPAwarded != 30 || res.CurrentXP != 110 || res.CurrentLevel != 2 {
		t.Fatalf("unexpected reward calculation: %+v", res)
	}
}

