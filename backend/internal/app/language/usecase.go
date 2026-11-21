package language

import (
	"context"
	"fmt"
	"log"
	"sort"
	"sync"

	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/shared/apperror"
)

// CurriculumCacheInvalidator clears per-user cached curriculum state when active language changes.
type CurriculumCacheInvalidator interface {
	InvalidateCurriculum(ctx context.Context, userID string) error
}

// BadgeAwarder grants achievement badges when cross-track milestones are unlocked.
type BadgeAwarder interface {
	AwardBadge(ctx context.Context, userID string, badgeCode string, xpBonus int) (*gamification.UserBadge, error)
}

type usecase struct {
	langRepo         Repository
	helper           *Helper
	cacheInvalidator CurriculumCacheInvalidator
	badgeAwarder     BadgeAwarder
}

// NewUsecase creates a new Language Usecase instance
func NewUsecase(langRepo Repository) Usecase {
	return NewUsecaseFull(langRepo, nil, nil)
}

// NewUsecaseWithCache creates a Language Usecase wired with curriculum cache invalidation.
func NewUsecaseWithCache(langRepo Repository, cacheInvalidator CurriculumCacheInvalidator) Usecase {
	return NewUsecaseFull(langRepo, cacheInvalidator, nil)
}

// NewUsecaseFull creates a Language Usecase wired with curriculum cache invalidation and badge awarding.
func NewUsecaseFull(langRepo Repository, cacheInvalidator CurriculumCacheInvalidator, badgeAwarder BadgeAwarder) Usecase {
	return &usecase{
		langRepo:         langRepo,
		helper:           NewHelper(),
		cacheInvalidator: cacheInvalidator,
		badgeAwarder:     badgeAwarder,
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

	var (
		lang      *Language
		levels    []ProficiencyLevel
		langErr   error
		levelsErr error
		wg        sync.WaitGroup
	)

	wg.Add(2)
	go func() {
		defer wg.Done()
		lang, langErr = u.langRepo.GetLanguageByID(ctx, languageID)
	}()
	go func() {
		defer wg.Done()
		levels, levelsErr = u.langRepo.GetLevelsByLanguageID(ctx, languageID)
	}()
	wg.Wait()

	if langErr != nil {
		return nil, nil, langErr
	}
	if levelsErr != nil {
		return nil, nil, fmt.Errorf("failed to fetch levels for language %s: %w", languageID, levelsErr)
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

// EnrollLanguage enrolls an existing user into a new active destination language track and switches to it
func (u *usecase) EnrollLanguage(ctx context.Context, userID string, languageID string) (*UserLanguageEnrollment, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if languageID == "" {
		return nil, apperror.ErrBadRequest
	}

	var (
		lang       *Language
		levels     []ProficiencyLevel
		enrolled   []UserLanguageEnrollment
		langErr    error
		levelsErr  error
		enrollErr  error
		wg         sync.WaitGroup
	)

	wg.Add(3)
	go func() {
		defer wg.Done()
		lang, langErr = u.langRepo.GetLanguageByID(ctx, languageID)
	}()
	go func() {
		defer wg.Done()
		levels, levelsErr = u.langRepo.GetLevelsByLanguageID(ctx, languageID)
	}()
	go func() {
		defer wg.Done()
		enrolled, enrollErr = u.langRepo.GetEnrollmentsByUserID(ctx, userID)
	}()
	wg.Wait()

	if langErr != nil {
		return nil, langErr
	}
	if err := u.helper.ValidateLanguageActive(lang); err != nil {
		return nil, err
	}
	if levelsErr != nil {
		return nil, fmt.Errorf("failed to fetch levels for language %s: %w", languageID, levelsErr)
	}
	if enrollErr != nil {
		return nil, fmt.Errorf("failed to check existing enrollments: %w", enrollErr)
	}

	for _, e := range enrolled {
		if e.LanguageID == languageID {
			return nil, ErrAlreadyEnrolled
		}
	}

	var initialLevelID *string
	if len(levels) > 0 {
		sorted := append([]ProficiencyLevel(nil), levels...)
		sort.Slice(sorted, func(i, j int) bool {
			return sorted[i].OrderIndex < sorted[j].OrderIndex
		})
		lvlID := sorted[0].ID
		initialLevelID = &lvlID
	}

	newEnrollment := &UserLanguageEnrollment{
		UserID:               userID,
		LanguageID:           languageID,
		CurrentLevelID:       initialLevelID,
		InitialPlacementType: "zero_beginner",
		IsActive:             true,
	}
	if err := u.langRepo.CreateEnrollment(ctx, newEnrollment); err != nil {
		return nil, err
	}

	if u.cacheInvalidator != nil {
		if err := u.cacheInvalidator.InvalidateCurriculum(ctx, userID); err != nil {
			log.Printf("language: failed to invalidate curriculum cache for user %s: %v", userID, err)
		}
	}

	if u.badgeAwarder != nil && len(enrolled)+1 >= 2 {
		if _, err := u.badgeAwarder.AwardBadge(ctx, userID, "multilingual_explorer", 0); err != nil {
			log.Printf("language: failed to award multilingual_explorer badge for user %s: %v", userID, err)
		}
	}

	return u.langRepo.GetActiveEnrollment(ctx, userID, languageID)
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

	if u.cacheInvalidator != nil {
		if err := u.cacheInvalidator.InvalidateCurriculum(ctx, userID); err != nil {
			log.Printf("language: failed to invalidate curriculum cache for user %s: %v", userID, err)
		}
	}

	return u.langRepo.GetActiveEnrollment(ctx, userID, languageID)
}

