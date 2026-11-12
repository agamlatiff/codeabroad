package curriculum_test

import (
	"context"
	"testing"
	"time"

	"codeabroad/backend/internal/domain"
	curriculumUsecasePkg "codeabroad/backend/internal/usecase/curriculum"
)

type mockCurriculumRepository struct {
	units    []domain.Unit
	lessons  map[string][]domain.Lesson
	progress map[string]*domain.UserLessonProgress
}

func newMockCurriculumRepository() *mockCurriculumRepository {
	return &mockCurriculumRepository{
		units: []domain.Unit{
			{ID: "unit-1", Title: "Unit 1: Basics", TotalLessons: 2, CompletedLessons: 2},
			{ID: "unit-2", Title: "Unit 2: Daily Life", TotalLessons: 2, CompletedLessons: 0},
		},
		lessons: map[string][]domain.Lesson{
			"unit-1": {
				{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15},
				{ID: "lesson-2", UnitID: "unit-1", Title: "Lesson 2", XPReward: 15},
			},
			"unit-2": {
				{ID: "lesson-3", UnitID: "unit-2", Title: "Lesson 3", XPReward: 15},
			},
		},
		progress: make(map[string]*domain.UserLessonProgress),
	}
}

func (m *mockCurriculumRepository) GetGrammarPointsByLevelID(ctx context.Context, levelID string) ([]domain.GrammarPoint, error) {
	return nil, nil
}
func (m *mockCurriculumRepository) GetGrammarPointByID(ctx context.Context, id string) (*domain.GrammarPoint, error) {
	return nil, nil
}
func (m *mockCurriculumRepository) GetUnitsByLevelID(ctx context.Context, levelID string, userID string) ([]domain.Unit, error) {
	return m.units, nil
}
func (m *mockCurriculumRepository) GetUnitByID(ctx context.Context, id string) (*domain.Unit, error) {
	return nil, nil
}
func (m *mockCurriculumRepository) GetLessonsByUnitID(ctx context.Context, unitID string, userID string) ([]domain.Lesson, error) {
	return m.lessons[unitID], nil
}
func (m *mockCurriculumRepository) GetLessonByID(ctx context.Context, id string, userID string) (*domain.Lesson, error) {
	for _, lList := range m.lessons {
		for _, l := range lList {
			if l.ID == id {
				return &l, nil
			}
		}
	}
	return nil, domain.ErrLessonNotFound
}
func (m *mockCurriculumRepository) GetUserLessonProgress(ctx context.Context, userID string, lessonID string) (*domain.UserLessonProgress, error) {
	return m.progress[lessonID], nil
}
func (m *mockCurriculumRepository) UpsertLessonProgress(ctx context.Context, progress *domain.UserLessonProgress) error {
	m.progress[progress.LessonID] = progress
	return nil
}
func (m *mockCurriculumRepository) SkipPrecedingLessons(ctx context.Context, userID string, upToLevelOrder int, languageID string) error {
	return nil
}

type mockLangRepoForCurriculum struct{}

func (m *mockLangRepoForCurriculum) GetAllLanguages(ctx context.Context, onlyActive bool) ([]domain.Language, error) {
	return nil, nil
}
func (m *mockLangRepoForCurriculum) GetLanguageByID(ctx context.Context, id string) (*domain.Language, error) {
	return nil, nil
}
func (m *mockLangRepoForCurriculum) GetLanguageByCode(ctx context.Context, code string) (*domain.Language, error) {
	return nil, nil
}
func (m *mockLangRepoForCurriculum) GetLevelsByLanguageID(ctx context.Context, languageID string) ([]domain.ProficiencyLevel, error) {
	return nil, nil
}
func (m *mockLangRepoForCurriculum) GetLevelByID(ctx context.Context, id string) (*domain.ProficiencyLevel, error) {
	return nil, nil
}
func (m *mockLangRepoForCurriculum) GetEnrollmentsByUserID(ctx context.Context, userID string) ([]domain.UserLanguageEnrollment, error) {
	return nil, nil
}
func (m *mockLangRepoForCurriculum) GetActiveEnrollment(ctx context.Context, userID string, languageID string) (*domain.UserLanguageEnrollment, error) {
	return &domain.UserLanguageEnrollment{
		ID:         "enr-1",
		UserID:     userID,
		LanguageID: "lang-ja",
		Language:   &domain.Language{ID: "lang-ja", Code: "ja", Name: "Japanese"},
		CurrentLevel: &domain.ProficiencyLevel{
			ID:         "lvl-n5",
			LanguageID: "lang-ja",
			Code:       "N5",
			Name:       "JLPT N5",
		},
		IsActive: true,
	}, nil
}
func (m *mockLangRepoForCurriculum) CreateEnrollment(ctx context.Context, enrollment *domain.UserLanguageEnrollment) error {
	return nil
}
func (m *mockLangRepoForCurriculum) UpdateEnrollmentLevel(ctx context.Context, enrollmentID string, levelID string) error {
	return nil
}
func (m *mockLangRepoForCurriculum) SetActiveLanguage(ctx context.Context, userID string, languageID string) error {
	return nil
}

type mockExerciseRepoForCurriculum struct{}

func (m *mockExerciseRepoForCurriculum) GetExercisesByLessonID(ctx context.Context, lessonID string) ([]domain.Exercise, error) {
	return []domain.Exercise{
		{ID: "ex-1", QuestionText: "What is 'Konnichiwa'?"},
	}, nil
}
func (m *mockExerciseRepoForCurriculum) GetExerciseByID(ctx context.Context, id string) (*domain.Exercise, error) {
	return nil, nil
}
func (m *mockExerciseRepoForCurriculum) GetPlacementExercises(ctx context.Context, languageID string, limit int) ([]domain.Exercise, error) {
	return nil, nil
}
func (m *mockExerciseRepoForCurriculum) GetReadinessExamExercises(ctx context.Context, levelID string) ([]domain.Exercise, error) {
	return nil, nil
}
func (m *mockExerciseRepoForCurriculum) CreateAttempt(ctx context.Context, attempt *domain.UserExerciseAttempt) error {
	return nil
}
func (m *mockExerciseRepoForCurriculum) GetAttemptsByUserID(ctx context.Context, userID string, limit int) ([]domain.UserExerciseAttempt, error) {
	return nil, nil
}

type mockUserRepoForCurriculum struct {
	user *domain.User
}

func (m *mockUserRepoForCurriculum) Create(ctx context.Context, user *domain.User) error { return nil }
func (m *mockUserRepoForCurriculum) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	return nil, nil
}
func (m *mockUserRepoForCurriculum) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
	return nil, nil
}
func (m *mockUserRepoForCurriculum) GetByID(ctx context.Context, id string) (*domain.User, error) {
	return m.user, nil
}
func (m *mockUserRepoForCurriculum) SetOnboarded(ctx context.Context, userID string, dailyGoalMinutes int) error {
	return nil
}
func (m *mockUserRepoForCurriculum) UpdateProfile(ctx context.Context, userID string, req *domain.UpdateProfileRequest) (*domain.User, error) {
	return nil, nil
}
func (m *mockUserRepoForCurriculum) UpdateGamification(ctx context.Context, userID string, xp int, currentLevel int, streak int, lastActiveAt *time.Time) error {
	m.user.XP = xp
	m.user.CurrentLevel = currentLevel
	return nil
}
func (m *mockUserRepoForCurriculum) AddGems(ctx context.Context, userID string, gems int) (int, error) {
	return 0, nil
}
func (m *mockUserRepoForCurriculum) LogActivity(ctx context.Context, log *domain.UserActivityLog) error {
	return nil
}
func (m *mockUserRepoForCurriculum) HasActivityInRange(ctx context.Context, userID string, startTime time.Time, endTime time.Time) (bool, error) {
	return true, nil
}
func (m *mockUserRepoForCurriculum) GetDailyActivityStatsSince(ctx context.Context, userID string, since time.Time) (map[string]domain.DailyActivityStat, error) {
	return nil, nil
}
func (m *mockUserRepoForCurriculum) ClaimDailyReward(ctx context.Context, userID string, rewardType string, xpAwarded int, newLevel int) (*domain.DailyRewardClaimResponse, error) {
	return nil, nil
}
func (m *mockUserRepoForCurriculum) GetDailyRewardsStatus(ctx context.Context, userID string) (*domain.DailyRewardsStatusResponse, error) {
	return nil, nil
}

func TestGetRoadmap_Success(t *testing.T) {
	cRepo := newMockCurriculumRepository()
	lRepo := &mockLangRepoForCurriculum{}
	eRepo := &mockExerciseRepoForCurriculum{}
	uRepo := &mockUserRepoForCurriculum{
		user: &domain.User{
			UserAccount: domain.UserAccount{ID: "user-1"},
		},
	}

	uc := curriculumUsecasePkg.New(cRepo, lRepo, eRepo, uRepo, nil)
	roadmap, err := uc.GetRoadmap(context.Background(), "user-1", "lang-ja")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(roadmap.Units) != 2 {
		t.Fatalf("expected 2 units, got %d", len(roadmap.Units))
	}
	// Unit 1 completed -> Unit 2 is unlocked
	if !roadmap.Units[0].IsUnlocked || !roadmap.Units[1].IsUnlocked {
		t.Errorf("expected both units to be unlocked, got unit1=%v, unit2=%v", roadmap.Units[0].IsUnlocked, roadmap.Units[1].IsUnlocked)
	}
}

func TestCompleteLesson_Success(t *testing.T) {
	cRepo := newMockCurriculumRepository()
	lRepo := &mockLangRepoForCurriculum{}
	eRepo := &mockExerciseRepoForCurriculum{}
	uRepo := &mockUserRepoForCurriculum{
		user: &domain.User{
			UserAccount:           domain.UserAccount{ID: "user-1"},
			UserGamificationStats: domain.UserGamificationStats{XP: 20, CurrentLevel: 1},
		},
	}

	uc := curriculumUsecasePkg.New(cRepo, lRepo, eRepo, uRepo, nil)
	res, err := uc.CompleteLesson(context.Background(), "user-1", &domain.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    95,
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if !res.Progress.IsCompleted {
		t.Errorf("expected progress is_completed true")
	}
	if res.Gamification.XP != 35 { // 20 + 15
		t.Errorf("expected 35 XP, got %d", res.Gamification.XP)
	}
}

