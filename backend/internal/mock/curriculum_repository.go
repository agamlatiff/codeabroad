package mock

import (
	"context"
	"fmt"
	"time"

	"codeabroad/backend/internal/domain"
)

// CurriculumRepository implements domain.CurriculumRepository for unit testing
type CurriculumRepository struct {
	GrammarPoints        map[string]*domain.GrammarPoint
	Units                map[string]*domain.Unit
	Lessons              map[string]*domain.Lesson
	LessonProgress       map[string]*domain.UserLessonProgress // key: userID + ":" + lessonID
	GetGrammarPointsErr  error
	GetGrammarPointErr   error
	GetUnitsErr          error
	GetUnitByIDErr       error
	GetLessonsErr        error
	GetLessonByIDErr     error
	GetLessonProgressErr error
	UpsertProgressErr    error
	SkipPrecedingErr     error
}

// NewCurriculumRepository creates an in-memory mock CurriculumRepository
func NewCurriculumRepository() *CurriculumRepository {
	return &CurriculumRepository{
		GrammarPoints:  make(map[string]*domain.GrammarPoint),
		Units:          make(map[string]*domain.Unit),
		Lessons:        make(map[string]*domain.Lesson),
		LessonProgress: make(map[string]*domain.UserLessonProgress),
	}
}

// Ensure mock satisfies domain.CurriculumRepository at compile time
var _ domain.CurriculumRepository = (*CurriculumRepository)(nil)

func (m *CurriculumRepository) GetGrammarPointsByLevelID(ctx context.Context, levelID string) ([]domain.GrammarPoint, error) {
	if m.GetGrammarPointsErr != nil {
		return nil, m.GetGrammarPointsErr
	}
	var res []domain.GrammarPoint
	for _, gp := range m.GrammarPoints {
		if gp.LevelID == levelID {
			res = append(res, *gp)
		}
	}
	return res, nil
}

func (m *CurriculumRepository) GetGrammarPointByID(ctx context.Context, id string) (*domain.GrammarPoint, error) {
	if m.GetGrammarPointErr != nil {
		return nil, m.GetGrammarPointErr
	}
	gp, ok := m.GrammarPoints[id]
	if !ok {
		return nil, nil
	}
	return gp, nil
}

func (m *CurriculumRepository) GetUnitsByLevelID(ctx context.Context, levelID string, userID string) ([]domain.Unit, error) {
	if m.GetUnitsErr != nil {
		return nil, m.GetUnitsErr
	}
	var res []domain.Unit
	for _, u := range m.Units {
		if u.LevelID == levelID {
			res = append(res, *u)
		}
	}
	return res, nil
}

func (m *CurriculumRepository) GetUnitByID(ctx context.Context, id string) (*domain.Unit, error) {
	if m.GetUnitByIDErr != nil {
		return nil, m.GetUnitByIDErr
	}
	u, ok := m.Units[id]
	if !ok {
		return nil, nil
	}
	return u, nil
}

func (m *CurriculumRepository) GetLessonsByUnitID(ctx context.Context, unitID string, userID string) ([]domain.Lesson, error) {
	if m.GetLessonsErr != nil {
		return nil, m.GetLessonsErr
	}
	var res []domain.Lesson
	for _, l := range m.Lessons {
		if l.UnitID == unitID {
			res = append(res, *l)
		}
	}
	return res, nil
}

func (m *CurriculumRepository) GetLessonByID(ctx context.Context, id string, userID string) (*domain.Lesson, error) {
	if m.GetLessonByIDErr != nil {
		return nil, m.GetLessonByIDErr
	}
	l, ok := m.Lessons[id]
	if !ok {
		return nil, nil
	}
	return l, nil
}

func (m *CurriculumRepository) GetUserLessonProgress(ctx context.Context, userID string, lessonID string) (*domain.UserLessonProgress, error) {
	if m.GetLessonProgressErr != nil {
		return nil, m.GetLessonProgressErr
	}
	key := fmt.Sprintf("%s:%s", userID, lessonID)
	p, ok := m.LessonProgress[key]
	if !ok {
		return nil, nil
	}
	return p, nil
}

func (m *CurriculumRepository) UpsertLessonProgress(ctx context.Context, progress *domain.UserLessonProgress) error {
	if m.UpsertProgressErr != nil {
		return m.UpsertProgressErr
	}
	if progress.ID == "" {
		progress.ID = fmt.Sprintf("prog_%d", len(m.LessonProgress)+1)
	}
	if progress.CompletedAt.IsZero() {
		progress.CompletedAt = time.Now()
	}
	key := fmt.Sprintf("%s:%s", progress.UserID, progress.LessonID)
	m.LessonProgress[key] = progress
	return nil
}

func (m *CurriculumRepository) SkipPrecedingLessons(ctx context.Context, userID string, upToLevelOrder int, languageID string) error {
	if m.SkipPrecedingErr != nil {
		return m.SkipPrecedingErr
	}
	for _, l := range m.Lessons {
		key := fmt.Sprintf("%s:%s", userID, l.ID)
		m.LessonProgress[key] = &domain.UserLessonProgress{
			ID:          fmt.Sprintf("skip_%s", l.ID),
			UserID:      userID,
			LessonID:    l.ID,
			IsCompleted: true,
			IsSkipped:   true,
			Score:       100,
			CompletedAt: time.Now(),
		}
	}
	return nil
}
