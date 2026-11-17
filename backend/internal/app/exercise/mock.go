package exercise

import (
	"context"
	"fmt"
	"sort"
	"sync"
	"time"
)

func sortExercisesByOrder(res []Exercise) {
	sort.Slice(res, func(i, j int) bool {
		if res[i].OrderIndex != res[j].OrderIndex {
			return res[i].OrderIndex < res[j].OrderIndex
		}
		return res[i].ID < res[j].ID
	})
}

// MockRepository implements Repository for unit testing
type MockRepository struct {
	mu                       sync.RWMutex
	Exercises                map[string]*Exercise
	PlacementExercises       map[string][]Exercise
	ReadinessExamExercises   map[string][]Exercise
	DailyVocabularies        []VocabularyItem
	Attempts                 []UserExerciseAttempt
	GetExercisesByLessonErr  error
	GetExerciseByIDErr       error
	GetPlacementExercisesErr error
	GetReadinessExamErr      error
	GetDailyVocabulariesErr  error
	CreateAttemptErr         error
}

// NewMockRepository creates an in-memory mock exercise Repository
func NewMockRepository() *MockRepository {
	return &MockRepository{
		Exercises:              make(map[string]*Exercise),
		PlacementExercises:     make(map[string][]Exercise),
		ReadinessExamExercises: make(map[string][]Exercise),
	}
}

var _ Repository = (*MockRepository)(nil)

func (m *MockRepository) GetExercisesByLessonID(ctx context.Context, lessonID string) ([]Exercise, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetExercisesByLessonErr != nil {
		return nil, m.GetExercisesByLessonErr
	}
	var res []Exercise
	for _, ex := range m.Exercises {
		if ex != nil && ex.LessonID != nil && *ex.LessonID == lessonID {
			res = append(res, *ex)
		}
	}
	sortExercisesByOrder(res)
	return res, nil
}

func (m *MockRepository) GetExerciseByID(ctx context.Context, id string) (*Exercise, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetExerciseByIDErr != nil {
		return nil, m.GetExerciseByIDErr
	}
	ex, ok := m.Exercises[id]
	if !ok || ex == nil {
		return nil, ErrExerciseNotFound
	}
	cp := *ex
	return &cp, nil
}

func (m *MockRepository) GetPlacementExercises(ctx context.Context, languageID string, limit int) ([]Exercise, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetPlacementExercisesErr != nil {
		return nil, m.GetPlacementExercisesErr
	}
	if list, ok := m.PlacementExercises[languageID]; ok {
		out := append([]Exercise(nil), list...)
		if limit > 0 && len(out) > limit {
			return out[:limit], nil
		}
		return out, nil
	}
	var res []Exercise
	for _, ex := range m.Exercises {
		if ex != nil {
			res = append(res, *ex)
		}
	}
	sortExercisesByOrder(res)
	if limit > 0 && len(res) > limit {
		res = res[:limit]
	}
	return res, nil
}

func (m *MockRepository) GetReadinessExamExercises(ctx context.Context, levelID string) ([]Exercise, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetReadinessExamErr != nil {
		return nil, m.GetReadinessExamErr
	}
	if list, ok := m.ReadinessExamExercises[levelID]; ok {
		return append([]Exercise(nil), list...), nil
	}
	return nil, nil
}

func (m *MockRepository) CreateAttempt(ctx context.Context, attempt *UserExerciseAttempt) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.CreateAttemptErr != nil {
		return m.CreateAttemptErr
	}
	if attempt.ID == "" {
		attempt.ID = fmt.Sprintf("att_%d", len(m.Attempts)+1)
	}
	if attempt.CreatedAt.IsZero() {
		attempt.CreatedAt = time.Now()
	}
	m.Attempts = append(m.Attempts, *attempt)
	return nil
}

func (m *MockRepository) GetDailyVocabularies(ctx context.Context, userID string, limit int) ([]VocabularyItem, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetDailyVocabulariesErr != nil {
		return nil, m.GetDailyVocabulariesErr
	}
	if limit > 0 && len(m.DailyVocabularies) > limit {
		return append([]VocabularyItem(nil), m.DailyVocabularies[:limit]...), nil
	}
	return append([]VocabularyItem(nil), m.DailyVocabularies...), nil
}

// MockSRSRepository implements SRSRepository for unit testing
type MockSRSRepository struct {
	mu               sync.RWMutex
	Reviews          map[string]*UserSRSReview
	GetDueReviewsErr error
	GetReviewErr     error
	UpsertReviewErr  error
	GetDueCountErr   error
	CountMasteredErr error
}

// NewMockSRSRepository creates an in-memory mock SRSRepository
func NewMockSRSRepository() *MockSRSRepository {
	return &MockSRSRepository{
		Reviews: make(map[string]*UserSRSReview),
	}
}

var (
	_ SRSRepository               = (*MockSRSRepository)(nil)
	_ SRSMasteryCounter           = (*MockSRSRepository)(nil)
	_ TransactionalSRSReviewer    = (*MockSRSRepository)(nil)
	_ TransactionalDueSRSReviewer = (*MockSRSRepository)(nil)
)

func (m *MockSRSRepository) GetDueReviews(ctx context.Context, userID string, now time.Time, limit int) ([]UserSRSReview, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetDueReviewsErr != nil {
		return nil, m.GetDueReviewsErr
	}
	var res []UserSRSReview
	for _, r := range m.Reviews {
		if r.UserID == userID && !r.NextReviewAt.After(now) {
			res = append(res, *r)
		}
	}
	sort.Slice(res, func(i, j int) bool {
		if !res[i].NextReviewAt.Equal(res[j].NextReviewAt) {
			return res[i].NextReviewAt.Before(res[j].NextReviewAt)
		}
		if res[i].RepetitionCount != res[j].RepetitionCount {
			return res[i].RepetitionCount < res[j].RepetitionCount
		}
		return res[i].ID < res[j].ID
	})
	if limit > 0 && len(res) > limit {
		res = res[:limit]
	}
	return res, nil
}

func (m *MockSRSRepository) GetReview(ctx context.Context, userID string, exerciseID string) (*UserSRSReview, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetReviewErr != nil {
		return nil, m.GetReviewErr
	}
	key := fmt.Sprintf("%s:%s", userID, exerciseID)
	r, ok := m.Reviews[key]
	if !ok {
		return nil, ErrReviewNotFound
	}
	cp := *r
	return &cp, nil
}

func (m *MockSRSRepository) UpsertReview(ctx context.Context, review *UserSRSReview) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.UpsertReviewErr != nil {
		return m.UpsertReviewErr
	}
	if review.ID == "" {
		review.ID = fmt.Sprintf("srs_%d", len(m.Reviews)+1)
	}
	key := fmt.Sprintf("%s:%s", review.UserID, review.ExerciseID)
	cp := *review
	m.Reviews[key] = &cp
	return nil
}

func (m *MockSRSRepository) ApplyReviewTx(ctx context.Context, userID, exerciseID string, compute func(prevReps, prevInterval int, prevEase float64) *UserSRSReview) (*UserSRSReview, error) {
	return m.applyReviewTx(userID, exerciseID, false, time.Time{}, compute)
}

func (m *MockSRSRepository) ApplyDueReviewTx(ctx context.Context, userID, exerciseID string, now time.Time, compute func(prevReps, prevInterval int, prevEase float64) *UserSRSReview) (*UserSRSReview, error) {
	return m.applyReviewTx(userID, exerciseID, true, now, compute)
}

func (m *MockSRSRepository) applyReviewTx(userID, exerciseID string, requireDue bool, now time.Time, compute func(prevReps, prevInterval int, prevEase float64) *UserSRSReview) (*UserSRSReview, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	key := fmt.Sprintf("%s:%s", userID, exerciseID)
	existing, exists := m.Reviews[key]
	if !exists || existing == nil {
		if m.GetReviewErr != nil {
			return nil, m.GetReviewErr
		}
		if requireDue {
			return nil, ErrReviewNotFound
		}
	}
	prevReps, prevInterval, prevEase := 0, 1, 2.5
	if exists && existing != nil {
		if requireDue && !existing.NextReviewAt.IsZero() && existing.NextReviewAt.After(now) {
			return nil, ErrReviewNotDue
		}
		prevReps = existing.RepetitionCount
		prevInterval = existing.IntervalDays
		prevEase = existing.EaseFactor
	}
	if m.UpsertReviewErr != nil {
		return nil, m.UpsertReviewErr
	}
	updated := compute(prevReps, prevInterval, prevEase)
	if updated.ID == "" {
		if exists && existing != nil && existing.ID != "" {
			updated.ID = existing.ID
		} else {
			updated.ID = fmt.Sprintf("srs_%d", len(m.Reviews)+1)
		}
	}
	cp := *updated
	m.Reviews[key] = &cp
	return updated, nil
}

func (m *MockSRSRepository) GetDueCount(ctx context.Context, userID string, now time.Time) (int, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetDueCountErr != nil {
		return 0, m.GetDueCountErr
	}
	count := 0
	for _, r := range m.Reviews {
		if r.UserID == userID && !r.NextReviewAt.After(now) {
			count++
		}
	}
	return count, nil
}

func (m *MockSRSRepository) CountMasteredReviews(ctx context.Context, userID string) (int, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.CountMasteredErr != nil {
		return 0, m.CountMasteredErr
	}
	count := 0
	for _, r := range m.Reviews {
		if r.UserID == userID && r.RepetitionCount >= 3 {
			count++
		}
	}
	return count, nil
}

// MockReadinessExamRepository implements ReadinessExamRepository for unit testing
type MockReadinessExamRepository struct {
	mu                        sync.RWMutex
	Attempts                  []ReadinessExamAttempt
	CreateExamAttemptErr      error
	GetLatestPassedAttemptErr error
}

// NewMockReadinessExamRepository creates an in-memory mock ReadinessExamRepository
func NewMockReadinessExamRepository() *MockReadinessExamRepository {
	return &MockReadinessExamRepository{}
}

var _ ReadinessExamRepository = (*MockReadinessExamRepository)(nil)

func (m *MockReadinessExamRepository) CreateExamAttempt(ctx context.Context, attempt *ReadinessExamAttempt) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.CreateExamAttemptErr != nil {
		return m.CreateExamAttemptErr
	}
	if attempt.ID == "" {
		attempt.ID = fmt.Sprintf("exam_%d", len(m.Attempts)+1)
	}
	if attempt.AttemptedAt.IsZero() {
		attempt.AttemptedAt = time.Now().UTC()
	}
	m.Attempts = append(m.Attempts, *attempt)
	return nil
}

func (m *MockReadinessExamRepository) GetLatestPassedAttempt(ctx context.Context, userID string, levelID string) (*ReadinessExamAttempt, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetLatestPassedAttemptErr != nil {
		return nil, m.GetLatestPassedAttemptErr
	}
	for i := len(m.Attempts) - 1; i >= 0; i-- {
		a := m.Attempts[i]
		if a.UserID == userID && a.LevelID == levelID && a.IsPassed {
			cp := a
			return &cp, nil
		}
	}
	return nil, nil
}

// MockLessonAccessChecker implements LessonAccessChecker for unit and handler tests
type MockLessonAccessChecker struct {
	mu              sync.RWMutex
	DefaultUnlocked bool
	UnlockedLessons map[string]bool
	Err             error
}

// NewMockLessonAccessChecker creates a configurable mock LessonAccessChecker
func NewMockLessonAccessChecker(defaultUnlocked bool) *MockLessonAccessChecker {
	return &MockLessonAccessChecker{
		DefaultUnlocked: defaultUnlocked,
		UnlockedLessons: make(map[string]bool),
	}
}

var _ LessonAccessChecker = (*MockLessonAccessChecker)(nil)

func (m *MockLessonAccessChecker) IsLessonUnlocked(ctx context.Context, userID string, lessonID string) (bool, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.Err != nil {
		return false, m.Err
	}
	if unlocked, ok := m.UnlockedLessons[lessonID]; ok {
		return unlocked, nil
	}
	return m.DefaultUnlocked, nil
}


