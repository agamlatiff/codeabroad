package exercise

import (
	"context"
	"fmt"
	"time"
)

// MockRepository implements Repository for unit testing
type MockRepository struct {
	Exercises                map[string]*Exercise
	PlacementExercises       map[string][]Exercise
	ReadinessExamExercises   map[string][]Exercise
	Attempts                 []UserExerciseAttempt
	GetExercisesByLessonErr  error
	GetExerciseByIDErr       error
	GetPlacementExercisesErr error
	GetReadinessExamErr      error
	CreateAttemptErr         error
	GetAttemptsByUserIDErr   error
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
	if m.GetExercisesByLessonErr != nil {
		return nil, m.GetExercisesByLessonErr
	}
	var res []Exercise
	for _, ex := range m.Exercises {
		if ex.LessonID != nil && *ex.LessonID == lessonID {
			res = append(res, *ex)
		}
	}
	return res, nil
}

func (m *MockRepository) GetExerciseByID(ctx context.Context, id string) (*Exercise, error) {
	if m.GetExerciseByIDErr != nil {
		return nil, m.GetExerciseByIDErr
	}
	ex, ok := m.Exercises[id]
	if !ok {
		return nil, nil
	}
	return ex, nil
}

func (m *MockRepository) GetPlacementExercises(ctx context.Context, languageID string, limit int) ([]Exercise, error) {
	if m.GetPlacementExercisesErr != nil {
		return nil, m.GetPlacementExercisesErr
	}
	if list, ok := m.PlacementExercises[languageID]; ok {
		if limit > 0 && len(list) > limit {
			return list[:limit], nil
		}
		return list, nil
	}
	var res []Exercise
	for _, ex := range m.Exercises {
		res = append(res, *ex)
		if limit > 0 && len(res) >= limit {
			break
		}
	}
	return res, nil
}

func (m *MockRepository) GetReadinessExamExercises(ctx context.Context, levelID string) ([]Exercise, error) {
	if m.GetReadinessExamErr != nil {
		return nil, m.GetReadinessExamErr
	}
	if list, ok := m.ReadinessExamExercises[levelID]; ok {
		return list, nil
	}
	var res []Exercise
	for _, ex := range m.Exercises {
		res = append(res, *ex)
	}
	return res, nil
}

func (m *MockRepository) CreateAttempt(ctx context.Context, attempt *UserExerciseAttempt) error {
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

func (m *MockRepository) GetAttemptsByUserID(ctx context.Context, userID string, limit int) ([]UserExerciseAttempt, error) {
	if m.GetAttemptsByUserIDErr != nil {
		return nil, m.GetAttemptsByUserIDErr
	}
	var res []UserExerciseAttempt
	for _, a := range m.Attempts {
		if a.UserID == userID {
			res = append(res, a)
			if limit > 0 && len(res) >= limit {
				break
			}
		}
	}
	return res, nil
}

// MockSRSRepository implements SRSRepository for unit testing
type MockSRSRepository struct {
	Reviews          map[string]*UserSRSReview
	GetDueReviewsErr error
	GetReviewErr     error
	UpsertReviewErr  error
	GetDueCountErr   error
}

// NewMockSRSRepository creates an in-memory mock SRSRepository
func NewMockSRSRepository() *MockSRSRepository {
	return &MockSRSRepository{
		Reviews: make(map[string]*UserSRSReview),
	}
}

var _ SRSRepository = (*MockSRSRepository)(nil)

func (m *MockSRSRepository) GetDueReviews(ctx context.Context, userID string, now time.Time, limit int) ([]UserSRSReview, error) {
	if m.GetDueReviewsErr != nil {
		return nil, m.GetDueReviewsErr
	}
	var res []UserSRSReview
	for _, r := range m.Reviews {
		if r.UserID == userID && !r.NextReviewAt.After(now) {
			res = append(res, *r)
			if limit > 0 && len(res) >= limit {
				break
			}
		}
	}
	return res, nil
}

func (m *MockSRSRepository) GetReview(ctx context.Context, userID string, exerciseID string) (*UserSRSReview, error) {
	if m.GetReviewErr != nil {
		return nil, m.GetReviewErr
	}
	key := fmt.Sprintf("%s:%s", userID, exerciseID)
	r, ok := m.Reviews[key]
	if !ok {
		return nil, ErrReviewNotFound
	}
	return r, nil
}

func (m *MockSRSRepository) UpsertReview(ctx context.Context, review *UserSRSReview) error {
	if m.UpsertReviewErr != nil {
		return m.UpsertReviewErr
	}
	if review.ID == "" {
		review.ID = fmt.Sprintf("srs_%d", len(m.Reviews)+1)
	}
	key := fmt.Sprintf("%s:%s", review.UserID, review.ExerciseID)
	m.Reviews[key] = review
	return nil
}

func (m *MockSRSRepository) GetDueCount(ctx context.Context, userID string, now time.Time) (int, error) {
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

// MockReadinessExamRepository implements ReadinessExamRepository for unit testing
type MockReadinessExamRepository struct {
	Attempts                  []ReadinessExamAttempt
	CreateExamAttemptErr      error
	GetExamAttemptsErr        error
	GetLatestPassedAttemptErr error
}

// NewMockReadinessExamRepository creates an in-memory mock ReadinessExamRepository
func NewMockReadinessExamRepository() *MockReadinessExamRepository {
	return &MockReadinessExamRepository{}
}

var _ ReadinessExamRepository = (*MockReadinessExamRepository)(nil)

func (m *MockReadinessExamRepository) CreateExamAttempt(ctx context.Context, attempt *ReadinessExamAttempt) error {
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

func (m *MockReadinessExamRepository) GetExamAttemptsByUserID(ctx context.Context, userID string, levelID string) ([]ReadinessExamAttempt, error) {
	if m.GetExamAttemptsErr != nil {
		return nil, m.GetExamAttemptsErr
	}
	var res []ReadinessExamAttempt
	for _, a := range m.Attempts {
		if a.UserID == userID && (levelID == "" || a.LevelID == levelID) {
			res = append(res, a)
		}
	}
	return res, nil
}

func (m *MockReadinessExamRepository) GetLatestPassedAttempt(ctx context.Context, userID string, levelID string) (*ReadinessExamAttempt, error) {
	if m.GetLatestPassedAttemptErr != nil {
		return nil, m.GetLatestPassedAttemptErr
	}
	for i := len(m.Attempts) - 1; i >= 0; i-- {
		a := m.Attempts[i]
		if a.UserID == userID && a.LevelID == levelID && a.IsPassed {
			return &a, nil
		}
	}
	return nil, nil
}

