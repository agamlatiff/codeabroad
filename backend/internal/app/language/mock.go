package language

import (
	"context"
	"fmt"
	"sort"
	"sync"
	"time"
)

// MockRepository implements Repository for unit testing
type MockRepository struct {
	mu                   sync.RWMutex
	Languages            map[string]*Language
	Levels               map[string]*ProficiencyLevel
	Enrollments          map[string]*UserLanguageEnrollment
	GetAllLanguagesErr   error
	GetLanguageByIDErr   error
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
	m.mu.RLock()
	defer m.mu.RUnlock()
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
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetLanguageByIDErr != nil {
		return nil, m.GetLanguageByIDErr
	}
	l, ok := m.Languages[id]
	if !ok {
		return nil, ErrLanguageNotFound
	}
	cp := *l
	return &cp, nil
}

func (m *MockRepository) GetLevelsByLanguageID(ctx context.Context, languageID string) ([]ProficiencyLevel, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
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
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetLevelByIDErr != nil {
		return nil, m.GetLevelByIDErr
	}
	lvl, ok := m.Levels[id]
	if !ok {
		return nil, ErrProficiencyLevelNotFound
	}
	cp := *lvl
	return &cp, nil
}

func (m *MockRepository) GetEnrollmentsByUserID(ctx context.Context, userID string) ([]UserLanguageEnrollment, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetEnrollmentsErr != nil {
		return nil, m.GetEnrollmentsErr
	}
	var res []UserLanguageEnrollment
	for _, e := range m.Enrollments {
		if e.UserID == userID {
			cp := *e
			if l, ok := m.Languages[e.LanguageID]; ok {
				lcp := *l
				cp.Language = &lcp
			}
			if e.CurrentLevelID != nil {
				if lvl, ok := m.Levels[*e.CurrentLevelID]; ok {
					lvlcp := *lvl
					cp.CurrentLevel = &lvlcp
				}
			}
			res = append(res, cp)
		}
	}
	return res, nil
}

func (m *MockRepository) GetActiveEnrollment(ctx context.Context, userID string, languageID string) (*UserLanguageEnrollment, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.GetActiveEnrollErr != nil {
		return nil, m.GetActiveEnrollErr
	}
	for _, e := range m.Enrollments {
		if e.UserID == userID && e.IsActive {
			if languageID == "" || e.LanguageID == languageID {
				cp := *e
				if l, ok := m.Languages[e.LanguageID]; ok {
					lcp := *l
					cp.Language = &lcp
				}
				if e.CurrentLevelID != nil {
					if lvl, ok := m.Levels[*e.CurrentLevelID]; ok {
						lvlcp := *lvl
						cp.CurrentLevel = &lvlcp
					}
				}
				return &cp, nil
			}
		}
	}
	return nil, ErrEnrollmentNotFound
}

func (m *MockRepository) CreateEnrollment(ctx context.Context, enrollment *UserLanguageEnrollment) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.CreateEnrollErr != nil {
		return m.CreateEnrollErr
	}
	for _, existing := range m.Enrollments {
		if existing.UserID == enrollment.UserID && existing.LanguageID == enrollment.LanguageID {
			return ErrAlreadyEnrolled
		}
	}
	if enrollment.IsActive {
		for _, existing := range m.Enrollments {
			if existing.UserID == enrollment.UserID {
				existing.IsActive = false
			}
		}
	}
	if enrollment.ID == "" {
		enrollment.ID = fmt.Sprintf("enr_%d", len(m.Enrollments)+1)
	}
	if enrollment.EnrolledAt.IsZero() {
		enrollment.EnrolledAt = time.Now()
	}
	cp := *enrollment
	m.Enrollments[enrollment.ID] = &cp
	return nil
}

func (m *MockRepository) UpdateEnrollmentLevel(ctx context.Context, enrollmentID string, levelID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.UpdateEnrollLevelErr != nil {
		return m.UpdateEnrollLevelErr
	}
	e, ok := m.Enrollments[enrollmentID]
	if !ok {
		return ErrEnrollmentNotFound
	}
	lvlID := levelID
	e.CurrentLevelID = &lvlID
	return nil
}

func (m *MockRepository) UpdateEnrollmentLevelIfCurrent(ctx context.Context, enrollmentID string, expectedLevelID string, levelID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
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
	lvlID := levelID
	e.CurrentLevelID = &lvlID
	return nil
}

func (m *MockRepository) SetActiveLanguage(ctx context.Context, userID string, languageID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.SetActiveLanguageErr != nil {
		return m.SetActiveLanguageErr
	}
	found := false
	for _, e := range m.Enrollments {
		if e.UserID == userID && e.LanguageID == languageID {
			found = true
			break
		}
	}
	if !found {
		return ErrEnrollmentNotFound
	}
	for _, e := range m.Enrollments {
		if e.UserID == userID {
			e.IsActive = (e.LanguageID == languageID)
		}
	}
	return nil
}

