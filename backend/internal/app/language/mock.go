package language

import (
	"context"
	"fmt"
	"sort"
	"time"
)

// MockRepository implements Repository for unit testing
type MockRepository struct {
	Languages            map[string]*Language
	Levels               map[string]*ProficiencyLevel
	Enrollments          map[string]*UserLanguageEnrollment
	GetAllLanguagesErr   error
	GetLanguageByIDErr   error
	GetLanguageByCodeErr error
	GetLevelsErr         error
	GetLevelByIDErr      error
	GetEnrollmentsErr    error
	GetActiveEnrollErr   error
	CreateEnrollErr      error
	UpdateEnrollLevelErr error
	SetActiveLanguageErr error
}

// NewMockRepository creates an in-memory mock language Repository
func NewMockRepository() *MockRepository {
	return &MockRepository{
		Languages:   make(map[string]*Language),
		Levels:      make(map[string]*ProficiencyLevel),
		Enrollments: make(map[string]*UserLanguageEnrollment),
	}
}

var _ Repository = (*MockRepository)(nil)

func (m *MockRepository) GetAllLanguages(ctx context.Context, onlyActive bool) ([]Language, error) {
	if m.GetAllLanguagesErr != nil {
		return nil, m.GetAllLanguagesErr
	}
	var res []Language
	for _, l := range m.Languages {
		if !onlyActive || l.IsActive {
			res = append(res, *l)
		}
	}
	return res, nil
}

func (m *MockRepository) GetLanguageByID(ctx context.Context, id string) (*Language, error) {
	if m.GetLanguageByIDErr != nil {
		return nil, m.GetLanguageByIDErr
	}
	l, ok := m.Languages[id]
	if !ok {
		return nil, ErrLanguageNotFound
	}
	return l, nil
}

func (m *MockRepository) GetLanguageByCode(ctx context.Context, code string) (*Language, error) {
	if m.GetLanguageByCodeErr != nil {
		return nil, m.GetLanguageByCodeErr
	}
	for _, l := range m.Languages {
		if l.Code == code {
			return l, nil
		}
	}
	return nil, ErrLanguageNotFound
}

func (m *MockRepository) GetLevelsByLanguageID(ctx context.Context, languageID string) ([]ProficiencyLevel, error) {
	if m.GetLevelsErr != nil {
		return nil, m.GetLevelsErr
	}
	var res []ProficiencyLevel
	for _, lvl := range m.Levels {
		if lvl.LanguageID == languageID {
			res = append(res, *lvl)
		}
	}
	sort.Slice(res, func(i, j int) bool {
		return res[i].OrderIndex < res[j].OrderIndex
	})
	return res, nil
}

func (m *MockRepository) GetLevelByID(ctx context.Context, id string) (*ProficiencyLevel, error) {
	if m.GetLevelByIDErr != nil {
		return nil, m.GetLevelByIDErr
	}
	lvl, ok := m.Levels[id]
	if !ok {
		return nil, ErrProficiencyLevelNotFound
	}
	return lvl, nil
}

func (m *MockRepository) GetEnrollmentsByUserID(ctx context.Context, userID string) ([]UserLanguageEnrollment, error) {
	if m.GetEnrollmentsErr != nil {
		return nil, m.GetEnrollmentsErr
	}
	var res []UserLanguageEnrollment
	for _, e := range m.Enrollments {
		if e.UserID == userID {
			res = append(res, *e)
		}
	}
	return res, nil
}

func (m *MockRepository) GetActiveEnrollment(ctx context.Context, userID string, languageID string) (*UserLanguageEnrollment, error) {
	if m.GetActiveEnrollErr != nil {
		return nil, m.GetActiveEnrollErr
	}
	for _, e := range m.Enrollments {
		if e.UserID == userID && e.IsActive {
			if languageID == "" || e.LanguageID == languageID {
				return e, nil
			}
		}
	}
	return nil, ErrEnrollmentNotFound
}

func (m *MockRepository) CreateEnrollment(ctx context.Context, enrollment *UserLanguageEnrollment) error {
	if m.CreateEnrollErr != nil {
		return m.CreateEnrollErr
	}
	if enrollment.ID == "" {
		enrollment.ID = fmt.Sprintf("enr_%d", len(m.Enrollments)+1)
	}
	if enrollment.EnrolledAt.IsZero() {
		enrollment.EnrolledAt = time.Now()
	}
	m.Enrollments[enrollment.ID] = enrollment
	return nil
}

func (m *MockRepository) UpdateEnrollmentLevel(ctx context.Context, enrollmentID string, levelID string) error {
	if m.UpdateEnrollLevelErr != nil {
		return m.UpdateEnrollLevelErr
	}
	e, ok := m.Enrollments[enrollmentID]
	if !ok {
		return ErrEnrollmentNotFound
	}
	e.CurrentLevelID = &levelID
	return nil
}

func (m *MockRepository) UpdateEnrollmentLevelIfCurrent(ctx context.Context, enrollmentID string, expectedLevelID string, levelID string) error {
	if m.UpdateEnrollLevelErr != nil {
		return m.UpdateEnrollLevelErr
	}
	e, ok := m.Enrollments[enrollmentID]
	if !ok {
		return ErrEnrollmentNotFound
	}
	if e.CurrentLevelID == nil || *e.CurrentLevelID != expectedLevelID {
		return ErrEnrollmentLevelChanged
	}
	e.CurrentLevelID = &levelID
	return nil
}

func (m *MockRepository) SetActiveLanguage(ctx context.Context, userID string, languageID string) error {
	if m.SetActiveLanguageErr != nil {
		return m.SetActiveLanguageErr
	}
	for _, e := range m.Enrollments {
		if e.UserID == userID {
			e.IsActive = (e.LanguageID == languageID)
		}
	}
	return nil
}

