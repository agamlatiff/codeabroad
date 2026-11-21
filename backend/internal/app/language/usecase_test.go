package language_test

import (
	"context"
	"testing"

	"merantalk/backend/internal/app/language"
)

func setupMockLanguageRepo() *language.MockRepository {
	repo := language.NewMockRepository()
	repo.Languages["lang-ja"] = &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	repo.Languages["lang-de"] = &language.Language{ID: "lang-de", Code: "de", Name: "German", IsActive: true}
	repo.Languages["lang-fr"] = &language.Language{ID: "lang-fr", Code: "fr", Name: "French", IsActive: false}
	repo.Levels["lvl-n5"] = &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", Name: "JLPT N5", OrderIndex: 1}
	repo.Levels["lvl-n4"] = &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", Name: "JLPT N4", OrderIndex: 2}
	return repo
}

func TestListLanguages(t *testing.T) {
	repo := setupMockLanguageRepo()
	uc := language.NewUsecase(repo)

	langs, err := uc.ListLanguages(context.Background())
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(langs) != 3 {
		t.Errorf("expected 3 languages, got %d", len(langs))
	}
}

func TestGetLanguageDetails_Success(t *testing.T) {
	repo := setupMockLanguageRepo()
	uc := language.NewUsecase(repo)

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
	repo := setupMockLanguageRepo()
	uc := language.NewUsecase(repo)

	_, err := uc.SwitchActiveLanguage(context.Background(), "user-1", "lang-fr")
	if err != language.ErrLanguageNotActive {
		t.Errorf("expected ErrLanguageNotActive, got %v", err)
	}
}

func TestSwitchActiveLanguage_NotEnrolled(t *testing.T) {
	repo := setupMockLanguageRepo()
	uc := language.NewUsecase(repo)

	_, err := uc.SwitchActiveLanguage(context.Background(), "user-1", "lang-de")
	if err != language.ErrEnrollmentNotFound {
		t.Errorf("expected ErrEnrollmentNotFound, got %v", err)
	}
}

func TestEnrollLanguage_SuccessAndConflict(t *testing.T) {
	repo := setupMockLanguageRepo()
	repo.Levels["lvl-a1"] = &language.ProficiencyLevel{ID: "lvl-a1", LanguageID: "lang-de", Code: "A1", Name: "Goethe A1", OrderIndex: 1}
	uc := language.NewUsecase(repo)

	enr, err := uc.EnrollLanguage(context.Background(), "user-1", "lang-de")
	if err != nil {
		t.Fatalf("expected enroll success, got %v", err)
	}
	if enr == nil || !enr.IsActive || enr.LanguageID != "lang-de" {
		t.Fatalf("unexpected active enrollment returned: %+v", enr)
	}
	if enr.CurrentLevelID == nil || *enr.CurrentLevelID != "lvl-a1" {
		t.Fatalf("expected initial level lvl-a1, got %v", enr.CurrentLevelID)
	}

	if _, dupErr := uc.EnrollLanguage(context.Background(), "user-1", "lang-de"); dupErr != language.ErrAlreadyEnrolled {
		t.Errorf("expected ErrAlreadyEnrolled on duplicate enroll, got %v", dupErr)
	}

	if _, inactErr := uc.EnrollLanguage(context.Background(), "user-1", "lang-fr"); inactErr != language.ErrLanguageNotActive {
		t.Errorf("expected ErrLanguageNotActive for inactive track, got %v", inactErr)
	}
}

