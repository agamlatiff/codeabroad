package onboarding

import (
	"codeabroad/backend/internal/domain"
	"context"
	"fmt"
	"time"
)

type usecase struct {
	userRepo         domain.UserRepository
	langRepo         domain.LanguageRepository
	curriculumRepo   domain.CurriculumRepository
	exerciseRepo     domain.ExerciseRepository
	gamificationRepo domain.GamificationRepository
	helper           *Helper
}

// New creates a new Onboarding Usecase instance conforming to domain.OnboardingUsecase
func New(
	userRepo domain.UserRepository,
	langRepo domain.LanguageRepository,
	curriculumRepo domain.CurriculumRepository,
	exerciseRepo domain.ExerciseRepository,
	gamificationRepo domain.GamificationRepository,
) domain.OnboardingUsecase {
	return &usecase{
		userRepo:         userRepo,
		langRepo:         langRepo,
		curriculumRepo:   curriculumRepo,
		exerciseRepo:     exerciseRepo,
		gamificationRepo: gamificationRepo,
		helper:           NewHelper(),
	}
}

// GetAvailableLanguages returns active destination tracks for Step 1 selection
func (u *usecase) GetAvailableLanguages(ctx context.Context) ([]domain.Language, error) {
	return u.langRepo.GetAllLanguages(ctx, true)
}

// GetPlacementQuestions retrieves diagnostic exercises for Step 3 placement testing
func (u *usecase) GetPlacementQuestions(ctx context.Context, languageID string) (*domain.PlacementTestQuestionResponse, error) {
	if languageID == "" {
		return nil, domain.ErrBadRequest
	}

	lang, err := u.langRepo.GetLanguageByID(ctx, languageID)
	if err != nil {
		return nil, err
	}

	questions, err := u.exerciseRepo.GetPlacementExercises(ctx, languageID, 15)
	if err != nil {
		return nil, fmt.Errorf("failed to query placement questions: %w", err)
	}

	return &domain.PlacementTestQuestionResponse{
		Language:  *lang,
		Questions: questions,
	}, nil
}

// CompleteOnboarding processes the 3-step enrollment wizard, assigns levels, and awards welcome bonus
func (u *usecase) CompleteOnboarding(ctx context.Context, userID string, req *domain.OnboardingRequest) (*domain.OnboardingResultResponse, error) {
	if userID == "" {
		return nil, domain.ErrUnauthorized
	}
	if req == nil || req.LanguageID == "" {
		return nil, domain.ErrBadRequest
	}

	user, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}
	if user == nil {
		return nil, domain.ErrUserNotFound
	}
	if user.IsOnboarded {
		return nil, domain.ErrAlreadyOnboarded
	}

	// 1. Validate Pace Target
	if err := u.helper.ValidatePaceTarget(req.DailyGoalMinutes); err != nil {
		return nil, err
	}

	// 2. Validate Language
	lang, err := u.langRepo.GetLanguageByID(ctx, req.LanguageID)
	if err != nil {
		return nil, err
	}
	if !lang.IsActive {
		return nil, domain.ErrLanguageNotActive
	}

	// 3. Fetch Proficiency Levels for this track
	levels, err := u.langRepo.GetLevelsByLanguageID(ctx, req.LanguageID)
	if err != nil || len(levels) == 0 {
		return nil, domain.ErrProficiencyLevelNotFound
	}

	// 4. Evaluate Placement & Level Assignment
	var placementScore *int
	if req.InitialPlacementType == "placement_test" && len(req.PlacementAnswers) > 0 {
		questions, err := u.exerciseRepo.GetPlacementExercises(ctx, req.LanguageID, 15)
		if err == nil && len(questions) > 0 {
			score := u.helper.GradePlacementAnswers(questions, req.PlacementAnswers)
			placementScore = &score
		}
	}

	assignedLevel := u.helper.ResolveTargetLevel(levels, req.InitialPlacementType, req.ManualLevelID, func() int {
		if placementScore != nil {
			return *placementScore
		}
		return 0
	}())

	if assignedLevel == nil {
		assignedLevel = &levels[0]
	}

	// 5. If placed into Level > 1, skip prior curriculum lessons in batch
	if assignedLevel.OrderIndex > 1 {
		_ = u.curriculumRepo.SkipPrecedingLessons(ctx, userID, assignedLevel.OrderIndex, req.LanguageID)
	}

	// 6. Record Language Enrollment
	enrollment := &domain.UserLanguageEnrollment{
		UserID:                userID,
		LanguageID:            req.LanguageID,
		CurrentLevelID:        &assignedLevel.ID,
		InitialPlacementType:  req.InitialPlacementType,
		PlacementScorePercent: placementScore,
		IsActive:              true,
		EnrolledAt:            time.Now().UTC(),
	}
	if err := u.langRepo.CreateEnrollment(ctx, enrollment); err != nil {
		return nil, fmt.Errorf("failed to enroll in language track: %w", err)
	}

	// 7. Update User Profile Onboarded Status
	if err := u.userRepo.SetOnboarded(ctx, userID, req.DailyGoalMinutes); err != nil {
		return nil, fmt.Errorf("failed to update user onboarded status: %w", err)
	}

	// 8. Award Welcome XP Bonus (+50 XP) and Badge
	const welcomeBonusXP = 50
	now := time.Now().UTC()
	newXP := user.XP + welcomeBonusXP
	newLevel := (newXP / 100) + 1

	_ = u.userRepo.UpdateGamification(ctx, userID, newXP, newLevel, 1, &now)
	_ = u.userRepo.LogActivity(ctx, &domain.UserActivityLog{
		UserID:       userID,
		ActivityType: "onboarding_completed",
		XPEarned:     welcomeBonusXP,
		Metadata:     map[string]any{"language_id": req.LanguageID, "assigned_level": assignedLevel.Code},
		CreatedAt:    now,
	})

	var awardedBadges []domain.BadgeDefinition
	badge, err := u.gamificationRepo.AwardBadge(ctx, userID, "akihabara_novice", newLevel)
	if err == nil && badge != nil && badge.Badge != nil {
		awardedBadges = append(awardedBadges, *badge.Badge)
	}

	return &domain.OnboardingResultResponse{
		User: user.UserAccount,
		Profile: domain.UserProfile{
			Name:                 user.Name,
			Username:             user.Username,
			Bio:                  user.Bio,
			DailyGoalMinutes:     req.DailyGoalMinutes,
			IsOnboarded:          true,
			HasSeenRoadmapTour:   false,
			PreferredRoadmapView: "map",
		},
		Enrollment:        *enrollment,
		AssignedLevel:     *assignedLevel,
		PlacementScore:    placementScore,
		GamificationStats: domain.UserGamificationStats{XP: newXP, CurrentLevel: newLevel, Streak: 1, Gems: user.Gems, LastActiveAt: &now},
		AwardedBadges:     awardedBadges,
	}, nil
}

