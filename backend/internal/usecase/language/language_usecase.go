package language

import (
	"codeabroad/backend/internal/domain"
	"context"
	"fmt"
)

type usecase struct {
	langRepo domain.LanguageRepository
	helper   *Helper
}

// New creates a new Language Usecase instance conforming to domain.LanguageUsecase
func New(langRepo domain.LanguageRepository) domain.LanguageUsecase {
	return &usecase{
		langRepo: langRepo,
		helper:   NewHelper(),
	}
}

// ListLanguages returns all destination languages available for learning
func (u *usecase) ListLanguages(ctx context.Context) ([]domain.Language, error) {
	return u.langRepo.GetAllLanguages(ctx, false)
}

// GetLanguageDetails returns the language entity along with its progressive proficiency levels
func (u *usecase) GetLanguageDetails(ctx context.Context, languageID string) (*domain.Language, []domain.ProficiencyLevel, error) {
	if languageID == "" {
		return nil, nil, domain.ErrBadRequest
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
func (u *usecase) GetUserEnrollments(ctx context.Context, userID string) ([]domain.UserLanguageEnrollment, error) {
	if userID == "" {
		return nil, domain.ErrUnauthorized
	}
	return u.langRepo.GetEnrollmentsByUserID(ctx, userID)
}

// SwitchActiveLanguage switches the user's active learning language track
func (u *usecase) SwitchActiveLanguage(ctx context.Context, userID string, languageID string) (*domain.UserLanguageEnrollment, error) {
	if userID == "" {
		return nil, domain.ErrUnauthorized
	}
	if languageID == "" {
		return nil, domain.ErrBadRequest
	}

	// Verify target language exists and is active
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

