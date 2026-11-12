package curriculum

import (
	"context"
	"fmt"
	"time"
)

// MockRepository implements Repository for unit testing
type MockRepository struct {
	GrammarPoints        map[string]*GrammarPoint
	Units                map[string]*Unit
	Lessons              map[string]*Lesson
	LessonProgress       map[string]*UserLessonProgress
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

// NewMockRepository creates an in-memory mock curriculum Repository
func NewMockRepository() *MockRepository {
	return &MockRepository{
		GrammarPoints:  make(map[string]*GrammarPoint),
		Units:          make(map[string]*Unit),
		Lessons:        make(map[string]*Lesson),
		LessonProgress: make(map[string]*UserLessonProgress),
	}
}

var _ Repository = (*MockRepository)(nil)

func (m *MockRepository) GetGrammarPointsByLevelID(ctx context.Context, levelID string) ([]GrammarPoint, error) {
	if m.GetGrammarPointsErr != nil {
		return nil, m.GetGrammarPointsErr
	}
	var res []GrammarPoint
	for _, gp := range m.GrammarPoints {
		if gp.LevelID == levelID {
			res = append(res, *gp)
		}
	}
	return res, nil
}

func (m *MockRepository) GetGrammarPointByID(ctx context.Context, id string) (*GrammarPoint, error) {
	if m.GetGrammarPointErr != nil {
		return nil, m.GetGrammarPointErr
	}
	gp, ok := m.GrammarPoints[id]
	if !ok {
		return nil, nil
	}
	return gp, nil
}

func (m *MockRepository) GetUnitsByLevelID(ctx context.Context, levelID string, userID string) ([]Unit, error) {
	if m.GetUnitsErr != nil {
		return nil, m.GetUnitsErr
	}
	var res []Unit
	for _, u := range m.Units {
		if u.LevelID == levelID {
			res = append(res, *u)
		}
	}
	return res, nil
}

func (m *MockRepository) GetUnitByID(ctx context.Context, id string) (*Unit, error) {
	if m.GetUnitByIDErr != nil {
		return nil, m.GetUnitByIDErr
	}
	u, ok := m.Units[id]
	if !ok {
		return nil, nil
	}
	return u, nil
}

func (m *MockRepository) GetLessonsByUnitID(ctx context.Context, unitID string, userID string) ([]Lesson, error) {
	if m.GetLessonsErr != nil {
		return nil, m.GetLessonsErr
	}
	var res []Lesson
	for _, l := range m.Lessons {
		if l.UnitID == unitID {
			res = append(res, *l)
		}
	}
	return res, nil
}

func (m *MockRepository) GetLessonByID(ctx context.Context, id string, userID string) (*Lesson, error) {
	if m.GetLessonByIDErr != nil {
		return nil, m.GetLessonByIDErr
	}
	l, ok := m.Lessons[id]
	if !ok {
		return nil, nil
	}
	return l, nil
}

func (m *MockRepository) GetUserLessonProgress(ctx context.Context, userID string, lessonID string) (*UserLessonProgress, error) {
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

func (m *MockRepository) UpsertLessonProgress(ctx context.Context, progress *UserLessonProgress) error {
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

func (m *MockRepository) SkipPrecedingLessons(ctx context.Context, userID string, upToLevelOrder int, languageID string) error {
	if m.SkipPrecedingErr != nil {
		return m.SkipPrecedingErr
	}
	for _, l := range m.Lessons {
		key := fmt.Sprintf("%s:%s", userID, l.ID)
		m.LessonProgress[key] = &UserLessonProgress{
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

