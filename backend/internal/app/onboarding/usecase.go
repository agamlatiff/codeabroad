package onboarding

import (
	"context"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	"codeabroad/backend/internal/app/curriculum"
	"codeabroad/backend/internal/app/exercise"
	"codeabroad/backend/internal/app/gamification"
	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/app/user"
)

type usecase struct {
	userRepo         user.Repository
	langRepo         language.Repository
	curriculumRepo   curriculum.Repository
	exerciseRepo     exercise.Repository
	gamificationRepo gamification.Repository
	cacheRepo        curriculum.CurriculumCacheRepository
	store            Store
	helper           *Helper
}

// NewUsecase creates a new Onboarding Usecase instance
func NewUsecase(
	userRepo user.Repository,
	langRepo language.Repository,
	curriculumRepo curriculum.Repository,
	exerciseRepo exercise.Repository,
	gamificationRepo gamification.Repository,
) Usecase {
	return NewUsecaseWithStore(userRepo, langRepo, curriculumRepo, exerciseRepo, gamificationRepo, nil, nil)
}

// NewUsecaseWithCache creates an Onboarding Usecase instance with curriculum cache invalidation support
func NewUsecaseWithCache(
	userRepo user.Repository,
	langRepo language.Repository,
	curriculumRepo curriculum.Repository,
	exerciseRepo exercise.Repository,
	gamificationRepo gamification.Repository,
	cacheRepo curriculum.CurriculumCacheRepository,
) Usecase {
	return NewUsecaseWithStore(userRepo, langRepo, curriculumRepo, exerciseRepo, gamificationRepo, cacheRepo, nil)
}

// NewUsecaseWithStore creates an Onboarding Usecase backed by an optional atomic Store and curriculum cache invalidation.
func NewUsecaseWithStore(
	userRepo user.Repository,
	langRepo language.Repository,
	curriculumRepo curriculum.Repository,
	exerciseRepo exercise.Repository,
	gamificationRepo gamification.Repository,
	cacheRepo curriculum.CurriculumCacheRepository,
	store Store,
) Usecase {
	return &usecase{
		userRepo:         userRepo,
		langRepo:         langRepo,
		curriculumRepo:   curriculumRepo,
		exerciseRepo:     exerciseRepo,
		gamificationRepo: gamificationRepo,
		cacheRepo:        cacheRepo,
		store:            store,
		helper:           NewHelper(),
	}
}

// GetAvailableLanguages returns active destination tracks for Step 1 selection
func (u *usecase) GetAvailableLanguages(ctx context.Context) ([]language.Language, error) {
	return u.langRepo.GetAllLanguages(ctx, true)
}

// GetPlacementQuestions retrieves diagnostic exercises for Step 3 placement testing
func (u *usecase) GetPlacementQuestions(ctx context.Context, languageID string) (*PlacementTestQuestionResponse, error) {
	if languageID == "" {
		return nil, apperror.ErrBadRequest
	}

	var (
		wg        sync.WaitGroup
		lang      *language.Language
		langErr   error
		questions []exercise.Exercise
		qErr      error
	)
	wg.Add(2)

	go func() {
		defer wg.Done()
		lang, langErr = u.langRepo.GetLanguageByID(ctx, languageID)
	}()

	go func() {
		defer wg.Done()
		questions, qErr = u.exerciseRepo.GetPlacementExercises(ctx, languageID, 15)
	}()

	wg.Wait()

	if langErr != nil {
		return nil, langErr
	}
	if lang == nil {
		return nil, language.ErrLanguageNotFound
	}
	if qErr != nil {
		return nil, fmt.Errorf("failed to query placement questions: %w", qErr)
	}
	questions = exercise.SanitizeExercises(questions)

	genericQuestions := make([]any, len(questions))
	for i, q := range questions {
		genericQuestions[i] = q
	}

	return &PlacementTestQuestionResponse{
		Language:  *lang,
		Questions: genericQuestions,
	}, nil
}

// CompleteOnboarding processes the 3-step enrollment wizard, assigns levels, and awards welcome bonus
func (u *usecase) CompleteOnboarding(ctx context.Context, userID string, req *OnboardingRequest) (*OnboardingResultResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if req == nil || req.LanguageID == "" {
		return nil, apperror.ErrBadRequest
	}

	if err := u.helper.ValidatePaceTarget(req.DailyGoalMinutes); err != nil {
		return nil, err
	}

	var (
		wg        sync.WaitGroup
		lang      *language.Language
		langErr   error
		levels    []language.ProficiencyLevel
		lvlErr    error
		questions []exercise.Exercise
		qErr      error
		usr       *user.User
		usrErr    error
	)

	wg.Add(3)
	go func() {
		defer wg.Done()
		lang, langErr = u.langRepo.GetLanguageByID(ctx, req.LanguageID)
	}()
	go func() {
		defer wg.Done()
		levels, lvlErr = u.langRepo.GetLevelsByLanguageID(ctx, req.LanguageID)
	}()
	go func() {
		defer wg.Done()
		if req.InitialPlacementType == "placement_test" && len(req.PlacementAnswers) > 0 {
			questions, qErr = u.exerciseRepo.GetPlacementExercises(ctx, req.LanguageID, 15)
		}
	}()
	if u.store == nil {
		wg.Add(1)
		go func() {
			defer wg.Done()
			usr, usrErr = u.userRepo.GetByID(ctx, userID)
		}()
	}
	wg.Wait()

	if langErr != nil {
		return nil, langErr
	}
	if lang == nil {
		return nil, language.ErrLanguageNotFound
	}
	if !lang.IsActive {
		return nil, language.ErrLanguageNotActive
	}
	if lvlErr != nil || len(levels) == 0 {
		return nil, language.ErrProficiencyLevelNotFound
	}

	var placementScore *int
	switch req.InitialPlacementType {
	case "manual_select":
		if req.ManualLevelID == nil || strings.TrimSpace(*req.ManualLevelID) == "" {
			return nil, ErrManualLevelRequired
		}
		trimmedLevelID := strings.TrimSpace(*req.ManualLevelID)
		req.ManualLevelID = &trimmedLevelID
	case "placement_test":
		score := 0
		if len(req.PlacementAnswers) > 0 {
			if qErr != nil {
				return nil, fmt.Errorf("failed to fetch placement exercises for grading: %w", qErr)
			}
			if len(questions) > 0 {
				score = u.helper.GradePlacementAnswers(questions, req.PlacementAnswers)
			}
		}
		placementScore = &score
	}

	assignedLevel := u.helper.ResolveTargetLevel(levels, req.InitialPlacementType, req.ManualLevelID, func() int {
		if placementScore != nil {
			return *placementScore
		}
		return 0
	}())
	if assignedLevel == nil {
		if req.InitialPlacementType == "manual_select" {
			return nil, language.ErrProficiencyLevelNotFound
		}
		assignedLevel = u.helper.ResolveTargetLevel(levels, "zero_beginner", nil, 0)
	}

	if u.store != nil {
		res, err := u.store.CompleteOnboardingTx(ctx, &CompleteOnboardingTxParams{
			UserID:                userID,
			Language:              lang,
			AssignedLevel:         assignedLevel,
			DailyGoalMinutes:      req.DailyGoalMinutes,
			InitialPlacementType:  req.InitialPlacementType,
			PlacementScorePercent: placementScore,
		})
		if err != nil {
			return nil, err
		}
		if u.cacheRepo != nil {
			if invErr := u.cacheRepo.InvalidateCurriculum(ctx, userID); invErr != nil {
				log.Printf("onboarding: failed to invalidate curriculum cache for user %s: %v", userID, invErr)
			}
		}
		return res, nil
	}

	if usrErr != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", usrErr)
	}
	if usr == nil {
		return nil, user.ErrUserNotFound
	}
	if usr.IsOnboarded {
		return nil, ErrAlreadyOnboarded
	}

	enrollment := &language.UserLanguageEnrollment{
		UserID:                userID,
		LanguageID:            req.LanguageID,
		CurrentLevelID:        &assignedLevel.ID,
		InitialPlacementType:  req.InitialPlacementType,
		PlacementScorePercent: placementScore,
		IsActive:              true,
		Language:              lang,
		CurrentLevel:          assignedLevel,
		EnrolledAt:            time.Now().UTC(),
	}
	if err := u.langRepo.CreateEnrollment(ctx, enrollment); err != nil {
		return nil, fmt.Errorf("failed to enroll in language track: %w", err)
	}

	if assignedLevel.OrderIndex > 1 {
		if err := u.curriculumRepo.SkipPrecedingLessons(ctx, userID, assignedLevel.OrderIndex, req.LanguageID); err != nil {
			return nil, fmt.Errorf("failed to skip preceding curriculum lessons: %w", err)
		}
		if u.cacheRepo != nil {
			if invErr := u.cacheRepo.InvalidateCurriculum(ctx, userID); invErr != nil {
				log.Printf("onboarding: failed to invalidate curriculum cache for user %s: %v", userID, invErr)
			}
		}
	}

	if err := u.userRepo.SetOnboarded(ctx, userID, req.DailyGoalMinutes); err != nil {
		return nil, fmt.Errorf("failed to update user onboarded status: %w", err)
	}

	const welcomeBonusXP = 50
	now := time.Now().UTC()
	newXP := usr.XP + welcomeBonusXP
	newLevel := user.CalculateLevel(newXP)
	streak := usr.Streak
	if streak < 1 {
		streak = 1
	}

	if err := u.userRepo.UpdateGamification(ctx, userID, newXP, newLevel, streak, &now); err != nil {
		log.Printf("[WARN] [onboarding.CompleteOnboarding] failed to update gamification for user %s: %v", userID, err)
	}
	if err := u.userRepo.LogActivity(ctx, &user.UserActivityLog{
		UserID:       userID,
		ActivityType: "onboarding_completed",
		XPEarned:     welcomeBonusXP,
		Metadata:     map[string]any{"language_id": req.LanguageID, "assigned_level": assignedLevel.Code},
		CreatedAt:    now,
	}); err != nil {
		log.Printf("[WARN] [onboarding.CompleteOnboarding] failed to log onboarding activity for user %s: %v", userID, err)
	}

	var awardedBadges []gamification.BadgeDefinition
	badge, err := u.gamificationRepo.AwardBadge(ctx, userID, "akihabara_novice", newLevel)
	if err != nil {
		log.Printf("[WARN] [onboarding.CompleteOnboarding] failed to award onboarding badge for user %s: %v", userID, err)
	} else if badge != nil && badge.Badge != nil && badge.NewlyAwarded {
		awardedBadges = append(awardedBadges, *badge.Badge)
		if badge.Badge.XPReward > 0 {
			newXP += badge.Badge.XPReward
			newLevel = user.CalculateLevel(newXP)
		}
	}

	preferredView := usr.PreferredRoadmapView
	if preferredView == "" {
		preferredView = "map"
	}

	return &OnboardingResultResponse{
		User: usr.UserAccount,
		Profile: user.UserProfile{
			Name:                 usr.Name,
			Username:             usr.Username,
			Bio:                  usr.Bio,
			AvatarURL:            usr.AvatarURL,
			DailyGoalMinutes:     req.DailyGoalMinutes,
			IsOnboarded:          true,
			HasSeenRoadmapTour:   usr.HasSeenRoadmapTour,
			PreferredRoadmapView: preferredView,
		},
		Enrollment:        *enrollment,
		AssignedLevel:     *assignedLevel,
		PlacementScore:    placementScore,
		GamificationStats: user.UserGamificationStats{XP: newXP, CurrentLevel: newLevel, Streak: streak, Gems: usr.Gems, LastActiveAt: &now},
		AwardedBadges:     awardedBadges,
	}, nil
}

