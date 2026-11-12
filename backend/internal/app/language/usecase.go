package language

import (
	"context"
	"fmt"

	"codeabroad/backend/internal/shared/apperror"
)

type usecase struct {
	langRepo Repository
	helper   *Helper
}

// NewUsecase creates a new Language Usecase instance
func NewUsecase(langRepo Repository) Usecase {
	return &usecase{
		langRepo: langRepo,
		helper:   NewHelper(),
	}
}

// ListLanguages returns all destination languages available for learning
func (u *usecase) ListLanguages(ctx context.Context) ([]Language, error) {
	return u.langRepo.GetAllLanguages(ctx, false)
}

// GetLanguageDetails returns the language entity along with its progressive proficiency levels
func (u *usecase) GetLanguageDetails(ctx context.Context, languageID string) (*Language, []ProficiencyLevel, error) {
	if languageID == "" {
		return nil, nil, apperror.ErrBadRequest
	}

	lang, err := u.langRepo.GetLanguageByID(ctx, languageID)
	if err != nil {
		return nil, nil, err
	}

	levels, err := u.langRepo.GetLevelsByLanguageID(ctx, languageID)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to fetch levels for language %s: %w", languageID, err)
	}

	return lang, levels, nil
}

// GetUserEnrollments retrieves all destination language enrollments for a user
func (u *usecase) GetUserEnrollments(ctx context.Context, userID string) ([]UserLanguageEnrollment, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	return u.langRepo.GetEnrollmentsByUserID(ctx, userID)
}

// SwitchActiveLanguage switches the user's active learning language track
func (u *usecase) SwitchActiveLanguage(ctx context.Context, userID string, languageID string) (*UserLanguageEnrollment, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if languageID == "" {
		return nil, apperror.ErrBadRequest
	}

	lang, err := u.langRepo.GetLanguageByID(ctx, languageID)
	if err != nil {
		return nil, err
	}
	if err := u.helper.ValidateLanguageActive(lang); err != nil {
		return nil, err
	}

	if err := u.langRepo.SetActiveLanguage(ctx, userID, languageID); err != nil {
		return nil, err
	}

	return u.langRepo.GetActiveEnrollment(ctx, userID, languageID)
}

