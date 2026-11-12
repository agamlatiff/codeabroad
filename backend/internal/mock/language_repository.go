package mock

import (
	"context"
	"fmt"
	"time"

	"codeabroad/backend/internal/domain"
)

// LanguageRepository implements domain.LanguageRepository for unit testing
type LanguageRepository struct {
	Languages            map[string]*domain.Language
	Levels               map[string]*domain.ProficiencyLevel
	Enrollments          map[string]*domain.UserLanguageEnrollment
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

// NewLanguageRepository creates an in-memory mock LanguageRepository
func NewLanguageRepository() *LanguageRepository {
	return &LanguageRepository{
		Languages:   make(map[string]*domain.Language),
		Levels:      make(map[string]*domain.ProficiencyLevel),
		Enrollments: make(map[string]*domain.UserLanguageEnrollment),
	}
}

// Ensure mock satisfies domain.LanguageRepository at compile time
var _ domain.LanguageRepository = (*LanguageRepository)(nil)

func (m *LanguageRepository) GetAllLanguages(ctx context.Context, onlyActive bool) ([]domain.Language, error) {
	if m.GetAllLanguagesErr != nil {
		return nil, m.GetAllLanguagesErr
	}
	var res []domain.Language
	for _, l := range m.Languages {
		if !onlyActive || l.IsActive {
			res = append(res, *l)
		}
	}
	return res, nil
}

func (m *LanguageRepository) GetLanguageByID(ctx context.Context, id string) (*domain.Language, error) {
	if m.GetLanguageByIDErr != nil {
		return nil, m.GetLanguageByIDErr
	}
	l, ok := m.Languages[id]
	if !ok {
		return nil, nil
	}
	return l, nil
}

func (m *LanguageRepository) GetLanguageByCode(ctx context.Context, code string) (*domain.Language, error) {
	if m.GetLanguageByCodeErr != nil {
		return nil, m.GetLanguageByCodeErr
	}
	for _, l := range m.Languages {
		if l.Code == code {
			return l, nil
		}
	}
	return nil, nil
}

func (m *LanguageRepository) GetLevelsByLanguageID(ctx context.Context, languageID string) ([]domain.ProficiencyLevel, error) {
	if m.GetLevelsErr != nil {
		return nil, m.GetLevelsErr
	}
	var res []domain.ProficiencyLevel
	for _, lvl := range m.Levels {
		if lvl.LanguageID == languageID {
			res = append(res, *lvl)
		}
	}
	return res, nil
}

func (m *LanguageRepository) GetLevelByID(ctx context.Context, id string) (*domain.ProficiencyLevel, error) {
	if m.GetLevelByIDErr != nil {
		return nil, m.GetLevelByIDErr
	}
	lvl, ok := m.Levels[id]
	if !ok {
		return nil, nil
	}
	return lvl, nil
}

func (m *LanguageRepository) GetEnrollmentsByUserID(ctx context.Context, userID string) ([]domain.UserLanguageEnrollment, error) {
	if m.GetEnrollmentsErr != nil {
		return nil, m.GetEnrollmentsErr
	}
	var res []domain.UserLanguageEnrollment
	for _, e := range m.Enrollments {
		if e.UserID == userID {
			res = append(res, *e)
		}
	}
	return res, nil
}

func (m *LanguageRepository) GetActiveEnrollment(ctx context.Context, userID string, languageID string) (*domain.UserLanguageEnrollment, error) {
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
	return nil, nil
}

func (m *LanguageRepository) CreateEnrollment(ctx context.Context, enrollment *domain.UserLanguageEnrollment) error {
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

func (m *LanguageRepository) UpdateEnrollmentLevel(ctx context.Context, enrollmentID string, levelID string) error {
	if m.UpdateEnrollLevelErr != nil {
		return m.UpdateEnrollLevelErr
	}
	e, ok := m.Enrollments[enrollmentID]
	if !ok {
		return domain.ErrNotFound
	}
	e.CurrentLevelID = &levelID
	return nil
}

func (m *LanguageRepository) SetActiveLanguage(ctx context.Context, userID string, languageID string) error {
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
