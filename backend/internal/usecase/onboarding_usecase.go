package usecase

import (
	"codeabroad/backend/internal/domain"
	"context"
	"fmt"
)

const (
	// OnboardingBonusXP awards the user their first XP upon successfully completing their onboarding journey
	OnboardingBonusXP = 50
)

type onboardingUsecase struct {
	countryRepo    domain.CountryRepository
	careerPathRepo domain.CareerPathRepository
	userRepo       domain.UserRepository
}

// NewOnboardingUsecase creates a new onboarding usecase instance
func NewOnboardingUsecase(
	countryRepo domain.CountryRepository,
	careerPathRepo domain.CareerPathRepository,
	userRepo domain.UserRepository,
) domain.OnboardingUsecase {
	return &onboardingUsecase{
		countryRepo:    countryRepo,
		careerPathRepo: careerPathRepo,
		userRepo:       userRepo,
	}
}

// GetCountries retrieves all destination countries with their active status and details
func (u *onboardingUsecase) GetCountries(ctx context.Context) ([]domain.Country, error) {
	countries, err := u.countryRepo.GetAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get countries: %w", err)
	}
	return countries, nil
}

// GetCareerPaths retrieves all career tracks and their available tech stacks
func (u *onboardingUsecase) GetCareerPaths(ctx context.Context) ([]domain.CareerPath, error) {
	paths, err := u.careerPathRepo.GetAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get career paths: %w", err)
	}
	return paths, nil
}

// CompleteOnboarding validates selections, applies user onboarding preferences, and awards starting XP
func (u *onboardingUsecase) CompleteOnboarding(
	ctx context.Context,
	userID string,
	req *domain.OnboardingRequest,
) (*domain.OnboardingProfileResponse, error) {
	// 1. Verify user exists and has not yet onboarded
	user, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to verify user: %w", err)
	}
	if user == nil {
		return nil, domain.ErrUserNotFound
	}
	if user.IsOnboarded {
		return nil, domain.ErrAlreadyOnboarded
	}

	// 2. Verify selected country exists and is currently active
	country, err := u.countryRepo.GetByID(ctx, req.CountryID)
	if err != nil {
		return nil, err
	}
	
	if !country.IsActive {
		return nil, domain.NewBadRequestError(
			domain.ErrCodeCountryComingSoon,
			fmt.Sprintf("country %s (%s) is coming soon and not yet active", country.Name, country.Code),
			map[string]any{
				"country_code": country.Code,
				"country_name": country.Name,
				"active_track": "JP",
			},
		)
	}

	// 3. Verify selected career path exists
	careerPath, err := u.careerPathRepo.GetByID(ctx, req.CareerPathID)
	if err != nil {
		return nil, err
	}

	// 4. Verify selected stack belongs to the career path and is active
	var foundStack *domain.TechStack
	for _, stack := range careerPath.Stacks {
		if stack.Slug == req.PrimaryStack {
			foundStack = &stack
			break
		}
	}

	if foundStack == nil {
		return nil, domain.NewBadRequestError(
			domain.ErrCodeInvalidStack,
			"invalid tech stack for the selected career path",
			map[string]any{
				"career_path": careerPath.Slug,
				"stack":       req.PrimaryStack,
			},
		)
	}
	if !foundStack.IsActive {
		return nil, domain.NewBadRequestError(
			domain.ErrCodeStackComingSoon,
			fmt.Sprintf("tech stack %s is coming soon and not yet active", foundStack.Label),
			map[string]any{
				"stack":       foundStack.Slug,
				"career_path": careerPath.Slug,
			},
		)
	}

	// 5. Update user onboarding record and grant first XP bonus
	err = u.userRepo.UpdateOnboarding(
		ctx,
		userID,
		req.CountryID,
		req.CareerPathID,
		req.PrimaryStack,
		req.Level,
		OnboardingBonusXP,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to record onboarding completion: %w", err)
	}

	// 6. Return populated profile response
	profile, err := u.userRepo.GetProfileWithDetails(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve updated profile: %w", err)
	}

	return profile, nil
}
