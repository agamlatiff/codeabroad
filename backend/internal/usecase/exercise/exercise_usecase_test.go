package exercise_test

import (
	"context"
	"testing"
	"time"

	"codeabroad/backend/internal/domain"
	exerciseUsecasePkg "codeabroad/backend/internal/usecase/exercise"
)

type mockExerciseRepo struct {
	exercises map[string]*domain.Exercise
	attempts  []domain.UserExerciseAttempt
}

func newMockExerciseRepo() *mockExerciseRepo {
	return &mockExerciseRepo{
		exercises: map[string]*domain.Exercise{
			"ex-1": {
				ID:            "ex-1",
				QuestionText:  "What is 'Konnichiwa'?",
				CorrectAnswer: "Hello",
				XPReward:      10,
			},
		},
	}
}

func (m *mockExerciseRepo) GetExercisesByLessonID(ctx context.Context, lessonID string) ([]domain.Exercise, error) {
	return []domain.Exercise{*m.exercises["ex-1"]}, nil
}
func (m *mockExerciseRepo) GetExerciseByID(ctx context.Context, id string) (*domain.Exercise, error) {
	if ex, ok := m.exercises[id]; ok {
		return ex, nil
	}
	return nil, domain.ErrExerciseNotFound
}
func (m *mockExerciseRepo) GetPlacementExercises(ctx context.Context, languageID string, limit int) ([]domain.Exercise, error) {
	return nil, nil
}
func (m *mockExerciseRepo) GetReadinessExamExercises(ctx context.Context, levelID string) ([]domain.Exercise, error) {
	return []domain.Exercise{*m.exercises["ex-1"]}, nil
}
func (m *mockExerciseRepo) CreateAttempt(ctx context.Context, attempt *domain.UserExerciseAttempt) error {
	m.attempts = append(m.attempts, *attempt)
	return nil
}
func (m *mockExerciseRepo) GetAttemptsByUserID(ctx context.Context, userID string, limit int) ([]domain.UserExerciseAttempt, error) {
	return m.attempts, nil
}

type mockSRSRepo struct {
	cards map[string]*domain.UserSRSReview
}

func newMockSRSRepo() *mockSRSRepo {
	return &mockSRSRepo{
		cards: make(map[string]*domain.UserSRSReview),
	}
}

func (m *mockSRSRepo) GetDueReviews(ctx context.Context, userID string, now time.Time, limit int) ([]domain.UserSRSReview, error) {
	var list []domain.UserSRSReview
	for _, c := range m.cards {
		list = append(list, *c)
	}
	return list, nil
}
func (m *mockSRSRepo) GetReview(ctx context.Context, userID string, exerciseID string) (*domain.UserSRSReview, error) {
	return m.cards[exerciseID], nil
}
func (m *mockSRSRepo) UpsertReview(ctx context.Context, review *domain.UserSRSReview) error {
	m.cards[review.ExerciseID] = review
	return nil
}
func (m *mockSRSRepo) GetDueCount(ctx context.Context, userID string, now time.Time) (int, error) {
	return len(m.cards), nil
}

type mockExamRepo struct {
	attempts []domain.ReadinessExamAttempt
}

func (m *mockExamRepo) CreateExamAttempt(ctx context.Context, attempt *domain.ReadinessExamAttempt) error {
	m.attempts = append(m.attempts, *attempt)
	return nil
}
func (m *mockExamRepo) GetExamAttemptsByUserID(ctx context.Context, userID string, levelID string) ([]domain.ReadinessExamAttempt, error) {
	return m.attempts, nil
}
func (m *mockExamRepo) GetLatestPassedAttempt(ctx context.Context, userID string, levelID string) (*domain.ReadinessExamAttempt, error) {
	return nil, nil
}

type mockLangRepoForExercise struct{}

func (m *mockLangRepoForExercise) GetAllLanguages(ctx context.Context, onlyActive bool) ([]domain.Language, error) {
	return nil, nil
}
func (m *mockLangRepoForExercise) GetLanguageByID(ctx context.Context, id string) (*domain.Language, error) {
	return nil, nil
}
func (m *mockLangRepoForExercise) GetLanguageByCode(ctx context.Context, code string) (*domain.Language, error) {
	return nil, nil
}
func (m *mockLangRepoForExercise) GetLevelsByLanguageID(ctx context.Context, languageID string) ([]domain.ProficiencyLevel, error) {
	return nil, nil
}
func (m *mockLangRepoForExercise) GetLevelByID(ctx context.Context, id string) (*domain.ProficiencyLevel, error) {
	return &domain.ProficiencyLevel{
		ID:                  id,
		Code:                "N5",
		OfficialExamName:    "JLPT N5 Readiness",
		PassingScorePercent: 60,
	}, nil
}
func (m *mockLangRepoForExercise) GetEnrollmentsByUserID(ctx context.Context, userID string) ([]domain.UserLanguageEnrollment, error) {
	return nil, nil
}
func (m *mockLangRepoForExercise) GetActiveEnrollment(ctx context.Context, userID string, languageID string) (*domain.UserLanguageEnrollment, error) {
	return nil, nil
}
func (m *mockLangRepoForExercise) CreateEnrollment(ctx context.Context, enrollment *domain.UserLanguageEnrollment) error {
	return nil
}
func (m *mockLangRepoForExercise) UpdateEnrollmentLevel(ctx context.Context, enrollmentID string, levelID string) error {
	return nil
}
func (m *mockLangRepoForExercise) SetActiveLanguage(ctx context.Context, userID string, languageID string) error {
	return nil
}

func TestSubmitAnswer_Correct(t *testing.T) {
	eRepo := newMockExerciseRepo()
	sRepo := newMockSRSRepo()
	uc := exerciseUsecasePkg.New(eRepo, sRepo, &mockExamRepo{}, &mockLangRepoForExercise{}, nil)

	res, err := uc.SubmitAnswer(context.Background(), "user-1", &domain.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-1",
		UserAnswer: "Hello",
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if !res.IsCorrect {
		t.Errorf("expected is_correct true")
	}
	if res.XPEarned != 10 {
		t.Errorf("expected 10 XP, got %d", res.XPEarned)
	}
}

func TestSubmitAnswer_Wrong_InjectsSRS(t *testing.T) {
	eRepo := newMockExerciseRepo()
	sRepo := newMockSRSRepo()
	uc := exerciseUsecasePkg.New(eRepo, sRepo, &mockExamRepo{}, &mockLangRepoForExercise{}, nil)

	res, err := uc.SubmitAnswer(context.Background(), "user-1", &domain.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-1",
		UserAnswer: "Good morning", // wrong
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.IsCorrect {
		t.Errorf("expected is_correct false")
	}
	if res.NextReviewDue == nil {
		t.Errorf("expected next review due scheduled in SRS")
	}
	if _, ok := sRepo.cards["ex-1"]; !ok {
		t.Errorf("expected card to be upserted in SRS repo")
	}
}

func TestProcessReview_SM2(t *testing.T) {
	eRepo := newMockExerciseRepo()
	sRepo := newMockSRSRepo()
	uc := exerciseUsecasePkg.New(eRepo, sRepo, &mockExamRepo{}, &mockLangRepoForExercise{}, nil)

	review, err := uc.ProcessReview(context.Background(), "user-1", &domain.SubmitSRSReviewRequest{
		ExerciseID: "ex-1",
		Quality:    4,
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if review.Repetitions != 1 {
		t.Errorf("expected repetitions 1, got %d", review.Repetitions)
	}
	if review.IntervalDays != 1 {
		t.Errorf("expected interval 1, got %d", review.IntervalDays)
	}
}

