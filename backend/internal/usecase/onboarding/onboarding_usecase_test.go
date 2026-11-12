package onboarding_test

import (
	"context"
	"testing"
	"time"

	"codeabroad/backend/internal/domain"
	onboardingUsecasePkg "codeabroad/backend/internal/usecase/onboarding"
)

type mockUserRepoForOnboarding struct {
	user *domain.User
}

func (m *mockUserRepoForOnboarding) Create(ctx context.Context, user *domain.User) error { return nil }
func (m *mockUserRepoForOnboarding) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	return nil, nil
}
func (m *mockUserRepoForOnboarding) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
	return nil, nil
}
func (m *mockUserRepoForOnboarding) GetByID(ctx context.Context, id string) (*domain.User, error) {
	return m.user, nil
}
func (m *mockUserRepoForOnboarding) SetOnboarded(ctx context.Context, userID string, dailyGoalMinutes int) error {
	m.user.IsOnboarded = true
	m.user.DailyGoalMinutes = dailyGoalMinutes
	return nil
}
func (m *mockUserRepoForOnboarding) UpdateProfile(ctx context.Context, userID string, req *domain.UpdateProfileRequest) (*domain.User, error) {
	return nil, nil
}
func (m *mockUserRepoForOnboarding) UpdateGamification(ctx context.Context, userID string, xp int, currentLevel int, streak int, lastActiveAt *time.Time) error {
	m.user.XP = xp
	m.user.CurrentLevel = currentLevel
	return nil
}
func (m *mockUserRepoForOnboarding) AddGems(ctx context.Context, userID string, gems int) (int, error) {
	return 0, nil
}
func (m *mockUserRepoForOnboarding) LogActivity(ctx context.Context, log *domain.UserActivityLog) error {
	return nil
}
func (m *mockUserRepoForOnboarding) HasActivityInRange(ctx context.Context, userID string, startTime time.Time, endTime time.Time) (bool, error) {
	return true, nil
}
func (m *mockUserRepoForOnboarding) GetDailyActivityStatsSince(ctx context.Context, userID string, since time.Time) (map[string]domain.DailyActivityStat, error) {
	return nil, nil
}
func (m *mockUserRepoForOnboarding) ClaimDailyReward(ctx context.Context, userID string, rewardType string, xpAwarded int, newLevel int) (*domain.DailyRewardClaimResponse, error) {
	return nil, nil
}
func (m *mockUserRepoForOnboarding) GetDailyRewardsStatus(ctx context.Context, userID string) (*domain.DailyRewardsStatusResponse, error) {
	return nil, nil
}

type mockLangRepoForOnboarding struct {
	languages []domain.Language
	levels    []domain.ProficiencyLevel
}

func (m *mockLangRepoForOnboarding) GetAllLanguages(ctx context.Context, onlyActive bool) ([]domain.Language, error) {
	return m.languages, nil
}
func (m *mockLangRepoForOnboarding) GetLanguageByID(ctx context.Context, id string) (*domain.Language, error) {
	return &m.languages[0], nil
}
func (m *mockLangRepoForOnboarding) GetLanguageByCode(ctx context.Context, code string) (*domain.Language, error) {
	return nil, nil
}
func (m *mockLangRepoForOnboarding) GetLevelsByLanguageID(ctx context.Context, languageID string) ([]domain.ProficiencyLevel, error) {
	return m.levels, nil
}
func (m *mockLangRepoForOnboarding) GetLevelByID(ctx context.Context, id string) (*domain.ProficiencyLevel, error) {
	return nil, nil
}
func (m *mockLangRepoForOnboarding) GetEnrollmentsByUserID(ctx context.Context, userID string) ([]domain.UserLanguageEnrollment, error) {
	return nil, nil
}
func (m *mockLangRepoForOnboarding) GetActiveEnrollment(ctx context.Context, userID string, languageID string) (*domain.UserLanguageEnrollment, error) {
	return nil, nil
}
func (m *mockLangRepoForOnboarding) CreateEnrollment(ctx context.Context, enrollment *domain.UserLanguageEnrollment) error {
	return nil
}
func (m *mockLangRepoForOnboarding) UpdateEnrollmentLevel(ctx context.Context, enrollmentID string, levelID string) error {
	return nil
}
func (m *mockLangRepoForOnboarding) SetActiveLanguage(ctx context.Context, userID string, languageID string) error {
	return nil
}

type mockCurriculumRepoForOnboarding struct{}

func (m *mockCurriculumRepoForOnboarding) GetGrammarPointsByLevelID(ctx context.Context, levelID string) ([]domain.GrammarPoint, error) {
	return nil, nil
}
func (m *mockCurriculumRepoForOnboarding) GetGrammarPointByID(ctx context.Context, id string) (*domain.GrammarPoint, error) {
	return nil, nil
}
func (m *mockCurriculumRepoForOnboarding) GetUnitsByLevelID(ctx context.Context, levelID string, userID string) ([]domain.Unit, error) {
	return nil, nil
}
func (m *mockCurriculumRepoForOnboarding) GetUnitByID(ctx context.Context, id string) (*domain.Unit, error) {
	return nil, nil
}
func (m *mockCurriculumRepoForOnboarding) GetLessonsByUnitID(ctx context.Context, unitID string, userID string) ([]domain.Lesson, error) {
	return nil, nil
}
func (m *mockCurriculumRepoForOnboarding) GetLessonByID(ctx context.Context, id string, userID string) (*domain.Lesson, error) {
	return nil, nil
}
func (m *mockCurriculumRepoForOnboarding) GetUserLessonProgress(ctx context.Context, userID string, lessonID string) (*domain.UserLessonProgress, error) {
	return nil, nil
}
func (m *mockCurriculumRepoForOnboarding) UpsertLessonProgress(ctx context.Context, progress *domain.UserLessonProgress) error {
	return nil
}
func (m *mockCurriculumRepoForOnboarding) SkipPrecedingLessons(ctx context.Context, userID string, upToLevelOrder int, languageID string) error {
	return nil
}

type mockExerciseRepoForOnboarding struct{}

func (m *mockExerciseRepoForOnboarding) GetExercisesByLessonID(ctx context.Context, lessonID string) ([]domain.Exercise, error) {
	return nil, nil
}
func (m *mockExerciseRepoForOnboarding) GetExerciseByID(ctx context.Context, id string) (*domain.Exercise, error) {
	return nil, nil
}
func (m *mockExerciseRepoForOnboarding) GetPlacementExercises(ctx context.Context, languageID string, limit int) ([]domain.Exercise, error) {
	return []domain.Exercise{
		{ID: "q1", CorrectAnswer: "Tokyo"},
		{ID: "q2", CorrectAnswer: "Arigatou"},
	}, nil
}
func (m *mockExerciseRepoForOnboarding) GetReadinessExamExercises(ctx context.Context, levelID string) ([]domain.Exercise, error) {
	return nil, nil
}
func (m *mockExerciseRepoForOnboarding) CreateAttempt(ctx context.Context, attempt *domain.UserExerciseAttempt) error {
	return nil
}
func (m *mockExerciseRepoForOnboarding) GetAttemptsByUserID(ctx context.Context, userID string, limit int) ([]domain.UserExerciseAttempt, error) {
	return nil, nil
}

type mockGamificationRepoForOnboarding struct{}

func (m *mockGamificationRepoForOnboarding) GetStatus(ctx context.Context, userID string) (*domain.GamificationStatus, error) {
	return nil, nil
}
func (m *mockGamificationRepoForOnboarding) GetGamificationStats(ctx context.Context, userID string) (*domain.UserGamificationStats, error) {
	return nil, nil
}
func (m *mockGamificationRepoForOnboarding) UpdateStats(ctx context.Context, userID string, xp int, level int, streak int, gems int, lastActiveAt *time.Time) error {
	return nil
}
func (m *mockGamificationRepoForOnboarding) AddXPAndGems(ctx context.Context, userID string, xp int, level int, gems int) (*domain.UserGamificationStats, error) {
	return nil, nil
}
func (m *mockGamificationRepoForOnboarding) GetShopItems(ctx context.Context, onlyAvailable bool) ([]domain.ShopItem, error) {
	return nil, nil
}
func (m *mockGamificationRepoForOnboarding) GetShopItemByID(ctx context.Context, itemID string) (*domain.ShopItem, error) {
	return nil, nil
}
func (m *mockGamificationRepoForOnboarding) GetUserInventory(ctx context.Context, userID string) ([]domain.UserInventoryItem, error) {
	return nil, nil
}
func (m *mockGamificationRepoForOnboarding) BuyShopItem(ctx context.Context, userID string, itemID string, priceGems int) (*domain.UserInventoryItem, int, error) {
	return nil, 0, nil
}
func (m *mockGamificationRepoForOnboarding) GetBadges(ctx context.Context) ([]domain.BadgeDefinition, error) {
	return nil, nil
}
func (m *mockGamificationRepoForOnboarding) GetUserBadges(ctx context.Context, userID string) ([]domain.UserBadge, error) {
	return nil, nil
}
func (m *mockGamificationRepoForOnboarding) AwardBadge(ctx context.Context, userID string, badgeKey string, newLevel int) (*domain.UserBadge, error) {
	return &domain.UserBadge{BadgeKey: badgeKey}, nil
}
func (m *mockGamificationRepoForOnboarding) GetDailyChestClaims(ctx context.Context, userID string, claimDate string) ([]domain.DailyChestClaim, error) {
	return nil, nil
}
func (m *mockGamificationRepoForOnboarding) ClaimDailyChest(ctx context.Context, claim *domain.DailyChestClaim, newLevel int) error {
	return nil
}
func (m *mockGamificationRepoForOnboarding) CreateCoachingSubmission(ctx context.Context, sub *domain.CoachingSubmission) error {
	return nil
}

func TestCompleteOnboarding_ZeroBeginner(t *testing.T) {
	uRepo := &mockUserRepoForOnboarding{
		user: &domain.User{
			UserAccount: domain.UserAccount{ID: "user-1"},
			UserProfile: domain.UserProfile{IsOnboarded: false},
		},
	}
	lRepo := &mockLangRepoForOnboarding{
		languages: []domain.Language{
			{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true},
		},
		levels: []domain.ProficiencyLevel{
			{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1},
			{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2},
		},
	}

	uc := onboardingUsecasePkg.New(uRepo, lRepo, &mockCurriculumRepoForOnboarding{}, &mockExerciseRepoForOnboarding{}, &mockGamificationRepoForOnboarding{})

	res, err := uc.CompleteOnboarding(context.Background(), "user-1", &domain.OnboardingRequest{
		LanguageID:           "lang-ja",
		DailyGoalMinutes:     15,
		InitialPlacementType: "zero_beginner",
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if !res.Profile.IsOnboarded {
		t.Errorf("expected is_onboarded to be true")
	}
	if res.AssignedLevel.Code != "N5" {
		t.Errorf("expected assigned level N5, got %s", res.AssignedLevel.Code)
	}
	if res.GamificationStats.XP != 50 {
		t.Errorf("expected welcome bonus 50 XP, got %d", res.GamificationStats.XP)
	}
}

func TestCompleteOnboarding_PlacementTest_PassToN4(t *testing.T) {
	uRepo := &mockUserRepoForOnboarding{
		user: &domain.User{
			UserAccount: domain.UserAccount{ID: "user-1"},
			UserProfile: domain.UserProfile{IsOnboarded: false},
		},
	}
	lRepo := &mockLangRepoForOnboarding{
		languages: []domain.Language{
			{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true},
		},
		levels: []domain.ProficiencyLevel{
			{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1},
			{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2},
		},
	}

	uc := onboardingUsecasePkg.New(uRepo, lRepo, &mockCurriculumRepoForOnboarding{}, &mockExerciseRepoForOnboarding{}, &mockGamificationRepoForOnboarding{})

	// 100% correct answers (Tokyo, Arigatou)
	res, err := uc.CompleteOnboarding(context.Background(), "user-1", &domain.OnboardingRequest{
		LanguageID:           "lang-ja",
		DailyGoalMinutes:     30,
		InitialPlacementType: "placement_test",
		PlacementAnswers: []domain.PlacementAnswer{
			{ExerciseID: "q1", UserAnswer: "Tokyo"},
			{ExerciseID: "q2", UserAnswer: "Arigatou"},
		},
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	// 100% >= 80% -> assigned to Level 2 (N4)
	if res.AssignedLevel.Code != "N4" {
		t.Errorf("expected assigned level N4, got %s", res.AssignedLevel.Code)
	}
	if res.PlacementScore == nil || *res.PlacementScore != 100 {
		t.Errorf("expected placement score 100%%")
	}
}

