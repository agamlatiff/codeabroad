package mock

import (
	"codeabroad/backend/internal/domain"
	"context"
	"time"
)

// UserRepository implements domain.UserRepository for unit testing
type UserRepository struct {
	Users         map[string]*domain.User
	GetByIDError  error
	CreateError   error
	UpdateError   error
	UpdatedUserID string
}

// NewUserRepository creates an in-memory mock UserRepository
func NewUserRepository() *UserRepository {
	return &UserRepository{
		Users: make(map[string]*domain.User),
	}
}

func (m *UserRepository) Create(ctx context.Context, user *domain.User) error {
	if m.CreateError != nil {
		return m.CreateError
	}
	m.Users[user.ID] = user
	return nil
}

func (m *UserRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	for _, u := range m.Users {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, nil
}

func (m *UserRepository) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
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

func (m *UserRepository) UpdateOnboarding(ctx context.Context, userID string, countryID string, careerPathID string, primaryStack string, level string, targetTimeline string, languageLevel string, bonusXP int) error {
	m.UpdatedUserID = userID
	return m.UpdateError
}

func (m *UserRepository) GetProfileWithDetails(ctx context.Context, userID string) (*domain.OnboardingProfileResponse, error) {
	return nil, nil
}

func (m *UserRepository) UpdateGamification(ctx context.Context, userID string, xp int, currentLevel int, streak int, lastActiveAt *time.Time) error {
	return nil
}

func (m *UserRepository) UpdateProfile(ctx context.Context, userID string, req *domain.UpdateProfileRequest) (*domain.User, error) {
	return nil, nil
}

func (m *UserRepository) LogActivity(ctx context.Context, userID string, activityType string, xpEarned int, metadata map[string]interface{}) error {
	return nil
}

func (m *UserRepository) GetWeeklyActivityLogs(ctx context.Context, userID string) (*domain.UserActivitySummary, error) {
	return nil, nil
}

func (m *UserRepository) ClaimDailyReward(ctx context.Context, userID string, rewardType string, xpAwarded int) (*domain.DailyRewardClaimResponse, error) {
	return nil, nil
}

func (m *UserRepository) GetDailyRewardsStatus(ctx context.Context, userID string) (*domain.DailyRewardsStatusResponse, error) {
	return nil, nil
}

func (m *UserRepository) AddGems(ctx context.Context, userID string, gems int) (int, error) {
	return 0, nil
}
