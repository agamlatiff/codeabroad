package language_test

import (
	"context"
	"testing"

	"codeabroad/backend/internal/domain"
	langUsecasePkg "codeabroad/backend/internal/usecase/language"
)

type mockLanguageRepository struct {
	languages   []domain.Language
	levels      map[string][]domain.ProficiencyLevel
	enrollments map[string][]domain.UserLanguageEnrollment
}

func newMockLanguageRepository() *mockLanguageRepository {
	return &mockLanguageRepository{
		languages: []domain.Language{
			{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true},
			{ID: "lang-de", Code: "de", Name: "German", IsActive: true},
			{ID: "lang-fr", Code: "fr", Name: "French", IsActive: false},
		},
		levels: map[string][]domain.ProficiencyLevel{
			"lang-ja": {
				{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", Name: "JLPT N5", OrderIndex: 1},
				{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", Name: "JLPT N4", OrderIndex: 2},
			},
		},
		enrollments: make(map[string][]domain.UserLanguageEnrollment),
	}
}

func (m *mockLanguageRepository) GetAllLanguages(ctx context.Context, onlyActive bool) ([]domain.Language, error) {
	if !onlyActive {
		return m.languages, nil
	}
	var active []domain.Language
	for _, l := range m.languages {
		if l.IsActive {
			active = append(active, l)
		}
	}
	return active, nil
}

func (m *mockLanguageRepository) GetLanguageByID(ctx context.Context, id string) (*domain.Language, error) {
	for _, l := range m.languages {
		if l.ID == id {
			return &l, nil
		}
	}
	return nil, domain.ErrLanguageNotFound
}

func (m *mockLanguageRepository) GetLanguageByCode(ctx context.Context, code string) (*domain.Language, error) {
	for _, l := range m.languages {
		if l.Code == code {
			return &l, nil
		}
	}
	return nil, domain.ErrLanguageNotFound
}

func (m *mockLanguageRepository) GetLevelsByLanguageID(ctx context.Context, languageID string) ([]domain.ProficiencyLevel, error) {
	return m.levels[languageID], nil
}

func (m *mockLanguageRepository) GetLevelByID(ctx context.Context, id string) (*domain.ProficiencyLevel, error) {
	for _, lvls := range m.levels {
		for _, l := range lvls {
			if l.ID == id {
				return &l, nil
			}
		}
	}
	return nil, domain.ErrProficiencyLevelNotFound
}

func (m *mockLanguageRepository) GetEnrollmentsByUserID(ctx context.Context, userID string) ([]domain.UserLanguageEnrollment, error) {
	return m.enrollments[userID], nil
}

func (m *mockLanguageRepository) GetActiveEnrollment(ctx context.Context, userID string, languageID string) (*domain.UserLanguageEnrollment, error) {
	for _, e := range m.enrollments[userID] {
		if e.IsActive && (languageID == "" || e.LanguageID == languageID) {
			return &e, nil
		}
	}
	return nil, domain.ErrEnrollmentNotFound
}

func (m *mockLanguageRepository) CreateEnrollment(ctx context.Context, enrollment *domain.UserLanguageEnrollment) error {
	m.enrollments[enrollment.UserID] = append(m.enrollments[enrollment.UserID], *enrollment)
	return nil
}

func (m *mockLanguageRepository) UpdateEnrollmentLevel(ctx context.Context, enrollmentID string, levelID string) error {
	return nil
}

func (m *mockLanguageRepository) SetActiveLanguage(ctx context.Context, userID string, languageID string) error {
	for i := range m.enrollments[userID] {
		m.enrollments[userID][i].IsActive = (m.enrollments[userID][i].LanguageID == languageID)
	}
	return nil
}

func TestListLanguages(t *testing.T) {
	repo := newMockLanguageRepository()
	uc := langUsecasePkg.New(repo)

	langs, err := uc.ListLanguages(context.Background())
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(langs) != 3 {
		t.Errorf("expected 3 languages, got %d", len(langs))
	}
}

func TestGetLanguageDetails_Success(t *testing.T) {
	repo := newMockLanguageRepository()
	uc := langUsecasePkg.New(repo)

	lang, levels, err := uc.GetLanguageDetails(context.Background(), "lang-ja")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if lang.Code != "ja" {
		t.Errorf("expected code 'ja', got '%s'", lang.Code)
	}
	if len(levels) != 2 {
		t.Errorf("expected 2 levels, got %d", len(levels))
	}
}

func TestSwitchActiveLanguage_NotActive(t *testing.T) {
	repo := newMockLanguageRepository()
	uc := langUsecasePkg.New(repo)

	_, err := uc.SwitchActiveLanguage(context.Background(), "user-1", "lang-fr")
	if err != domain.ErrLanguageNotActive {
		t.Errorf("expected ErrLanguageNotActive, got %v", err)
	}
}

