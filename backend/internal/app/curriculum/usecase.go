package curriculum

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	"codeabroad/backend/internal/app/exercise"
	"codeabroad/backend/internal/app/gamification"
	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/app/user"
)

type usecase struct {
	curriculumRepo   Repository
	langRepo         language.Repository
	exerciseRepo     exercise.Repository
	userRepo         user.Repository
	gamificationRepo gamification.Repository
	cacheRepo        RoadmapCacheRepository
	helper           *Helper
}

// NewUsecaseWithCache creates a new Curriculum Usecase instance with roadmap Redis caching support
func NewUsecaseWithCache(
	curriculumRepo Repository,
	langRepo language.Repository,
	exerciseRepo exercise.Repository,
	userRepo user.Repository,
	gamificationRepo gamification.Repository,
	cacheRepo RoadmapCacheRepository,
) Usecase {
	return &usecase{
		curriculumRepo:   curriculumRepo,
		langRepo:         langRepo,
		exerciseRepo:     exerciseRepo,
		userRepo:         userRepo,
		gamificationRepo: gamificationRepo,
		cacheRepo:        cacheRepo,
		helper:           NewHelper(),
	}
}

// NewUsecase creates a new Curriculum Usecase instance without caching
func NewUsecase(
	curriculumRepo Repository,
	langRepo language.Repository,
	exerciseRepo exercise.Repository,
	userRepo user.Repository,
	gamificationRepo gamification.Repository,
) Usecase {
	return NewUsecaseWithCache(curriculumRepo, langRepo, exerciseRepo, userRepo, gamificationRepo, nil)
}

func (u *usecase) resolveEnrollmentForRoadmap(ctx context.Context, userID string, languageID string) (*language.UserLanguageEnrollment, error) {
	enrollment, err := u.langRepo.GetActiveEnrollment(ctx, userID, languageID)
	if err == nil && enrollment != nil {
		return enrollment, nil
	}
	if languageID == "" || !errors.Is(err, language.ErrEnrollmentNotFound) {
		return nil, err
	}

	enrollments, listErr := u.langRepo.GetEnrollmentsByUserID(ctx, userID)
	if listErr != nil {
		return nil, listErr
	}
	for i := range enrollments {
		if enrollments[i].LanguageID == languageID {
			enr := enrollments[i]
			if enr.Language == nil {
				if lang, lErr := u.langRepo.GetLanguageByID(ctx, languageID); lErr == nil {
					enr.Language = lang
				}
			}
			if enr.CurrentLevel == nil && enr.CurrentLevelID != nil {
				if lvl, lvErr := u.langRepo.GetLevelByID(ctx, *enr.CurrentLevelID); lvErr == nil {
					enr.CurrentLevel = lvl
				}
			}
			return &enr, nil
		}
	}
	return nil, language.ErrEnrollmentNotFound
}

// GetRoadmap retrieves the full active language curriculum tree with calculated unit unlocks
func (u *usecase) GetRoadmap(ctx context.Context, userID string, req *GetRoadmapRequest) (*RoadmapResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}

	languageID := ""
	if req != nil {
		languageID = req.LanguageID
	}

	enrollment, err := u.resolveEnrollmentForRoadmap(ctx, userID, languageID)
	if err != nil {
		return nil, err
	}
	if enrollment == nil || enrollment.Language == nil || enrollment.CurrentLevel == nil {
		return nil, language.ErrEnrollmentNotFound
	}

	// Capture cache version epoch before DB queries so stale reads cannot overwrite subsequent invalidations
	cacheVer := "0"
	if u.cacheRepo != nil {
		if v, verErr := u.cacheRepo.GetRoadmapVersion(ctx, userID); verErr == nil && v != "" {
			cacheVer = v
		}
		if cached, err := u.cacheRepo.GetRoadmap(ctx, userID, enrollment.Language.ID); err == nil && cached != nil {
			return cached, nil
		}
	}

	units, err := u.curriculumRepo.GetUnitsByLevelID(ctx, enrollment.CurrentLevel.ID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query units for level: %w", err)
	}

	lessons, err := u.curriculumRepo.GetLessonsByLevelID(ctx, enrollment.CurrentLevel.ID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to batch query lessons for level: %w", err)
	}

	lessonsByUnit := make(map[string][]LessonNodeResponse, len(units))
	for _, lesson := range lessons {
		lessonsByUnit[lesson.UnitID] = append(lessonsByUnit[lesson.UnitID], lesson)
	}

	for i := range units {
		unitLessons := lessonsByUnit[units[i].ID]
		if unitLessons == nil {
			unitLessons = []LessonNodeResponse{}
		}
		units[i].Lessons = unitLessons
		units[i].TotalLessons = len(unitLessons)
		units[i].CompletedLessons = 0
		for _, l := range unitLessons {
			if l.IsCompleted {
				units[i].CompletedLessons++
			}
		}
	}

	unlockedUnits, totalLessons, completedLessons, progressPercent, currentLessonID := u.helper.CalculateRoadmapUnlocks(units)
	if unlockedUnits == nil {
		unlockedUnits = []UnitNodeResponse{}
	}

	res := &RoadmapResponse{
		Language:         *enrollment.Language,
		Level:            *enrollment.CurrentLevel,
		TotalLessons:     totalLessons,
		CompletedLessons: completedLessons,
		ProgressPercent:  progressPercent,
		CurrentLessonID:  currentLessonID,
		Units:            unlockedUnits,
	}

	// 2. Cache roadmap response only if version epoch has not advanced during DB read
	if u.cacheRepo != nil {
		if setErr := u.cacheRepo.SetRoadmapIfVersion(ctx, userID, enrollment.Language.ID, cacheVer, res, 15*time.Minute); setErr != nil {
			log.Printf("curriculum: failed to cache roadmap for user %s: %v", userID, setErr)
		}
	}

	return res, nil
}

// GetLessonDetail retrieves a lesson node and its child exercises for the learn workspace
func (u *usecase) GetLessonDetail(ctx context.Context, userID string, lessonID string) (*LessonDetailResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if lessonID == "" {
		return nil, apperror.ErrBadRequest
	}

	lesson, err := u.curriculumRepo.GetLessonByID(ctx, lessonID, userID)
	if err != nil {
		return nil, err
	}
	if lesson == nil {
		return nil, ErrLessonNotFound
	}

	unlocked, err := u.curriculumRepo.IsLessonUnlocked(ctx, userID, lessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to verify lesson unlock status: %w", err)
	}
	if !unlocked {
		return nil, ErrLessonLocked
	}
	lesson.IsUnlocked = true

	exercises, err := u.exerciseRepo.GetExercisesByLessonID(ctx, lessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to query exercises for lesson: %w", err)
	}
	lesson.Exercises = exercise.SanitizeExercises(exercises)

	gps, err := u.curriculumRepo.GetGrammarPointsByLessonID(ctx, lessonID)
	if err == nil && len(gps) > 0 {
		lesson.GrammarPoints = gps
	} else {
		lesson.GrammarPoints = []GrammarPoint{}
	}

	return lesson, nil
}

func (u *usecase) evaluateLessonBadges(ctx context.Context, userID string, payload *LessonCompletionPayload) ([]gamification.BadgeDefinition, int) {
	if u.gamificationRepo == nil || payload == nil {
		return nil, 0
	}

	var candidates []string
	if !payload.WasCompleted {
		candidates = append(candidates, "first_step")
	}
	if payload.PreviousStreak < 7 && payload.NewStreak >= 7 {
		candidates = append(candidates, "streak_7")
	}
	if payload.PreviousStreak < 30 && payload.NewStreak >= 30 {
		candidates = append(candidates, "streak_30")
	}
	if len(candidates) == 0 {
		return nil, 0
	}

	existingBadges, err := u.gamificationRepo.GetUserBadges(ctx, userID)
	if err != nil {
		return nil, 0
	}
	owned := make(map[string]bool, len(existingBadges))
	for _, ub := range existingBadges {
		owned[ub.BadgeKey] = true
	}

	badgeDefByID := make(map[string]gamification.BadgeDefinition)
	if defs, defErr := u.gamificationRepo.GetBadges(ctx); defErr == nil {
		for _, def := range defs {
			badgeDefByID[def.ID] = def
		}
	}

	var awarded []gamification.BadgeDefinition
	extraXP := 0
	for _, key := range candidates {
		if owned[key] {
			continue
		}
		def := badgeDefByID[key]
		projectedLevel := u.helper.CalculateLevel(payload.NewXP + extraXP + def.XPReward)
		ub, awardErr := u.gamificationRepo.AwardBadge(ctx, userID, key, projectedLevel)
		if awardErr != nil {
			continue
		}
		owned[key] = true
		if ub != nil && ub.Badge != nil {
			awarded = append(awarded, *ub.Badge)
			extraXP += ub.Badge.XPReward
		} else if def.ID != "" {
			awarded = append(awarded, def)
			extraXP += def.XPReward
		}
	}
	return awarded, extraXP
}

// CompleteLesson records lesson mastery, deposits XP rewards, and checks unit milestones
func (u *usecase) CompleteLesson(ctx context.Context, userID string, req *CompleteLessonRequest) (*CompleteLessonResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if req == nil || req.LessonID == "" {
		return nil, apperror.ErrBadRequest
	}

	lesson, err := u.curriculumRepo.GetLessonByID(ctx, req.LessonID, userID)
	if err != nil {
		return nil, err
	}
	if lesson == nil {
		return nil, ErrLessonNotFound
	}

	unlocked, err := u.curriculumRepo.IsLessonUnlocked(ctx, userID, req.LessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to verify lesson unlock status: %w", err)
	}
	if !unlocked {
		return nil, ErrLessonLocked
	}

	// Verify attempt completeness (including fresh attempts on replay) and derive server-authoritative score
	attemptSummary, err := u.curriculumRepo.GetLessonAttemptSummary(ctx, userID, req.LessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to verify lesson exercise attempts: %w", err)
	}
	verifiedScore, err := u.helper.ComputeVerifiedLessonScore(req.Score, attemptSummary, lesson.IsCompleted)
	if err != nil {
		return nil, err
	}

	// Fail-fast: Validate user existence before modifying progress state
	usr, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}
	if usr == nil {
		return nil, user.ErrUserNotFound
	}

	xpEarned := lesson.XPReward
	if xpEarned <= 0 {
		xpEarned = 15
	}
	activityType := "lesson_completed"

	// Anti-exploit: Replaying an already mastered lesson awards practice XP instead of full reward
	if lesson.IsCompleted {
		xpEarned = 5
	}

	now := time.Now().UTC()
	progress := &UserLessonProgress{
		UserID:      userID,
		LessonID:    req.LessonID,
		IsCompleted: true,
		Score:       verifiedScore,
		IsSkipped:   false,
		CompletedAt: now,
	}

	newStreak, _ := u.helper.EvaluateDailyStreak(usr.Streak, usr.LastActiveAt, now)
	newXP := usr.XP + xpEarned
	newLevel := u.helper.CalculateLevel(newXP)

	// Atomic Unit-of-Work: update lesson progress, gamification stats, and activity log in a single DB transaction
	payload := &LessonCompletionPayload{
		Progress:     progress,
		XPEarned:     xpEarned,
		NewXP:        newXP,
		NewLevel:     newLevel,
		NewStreak:    newStreak,
		NewGems:      usr.Gems,
		LastActiveAt: now,
		ActivityType: activityType,
		Metadata:     map[string]any{"lesson_id": req.LessonID, "score": verifiedScore, "is_practice": lesson.IsCompleted},
	}

	if err := u.curriculumRepo.RecordLessonCompletionTx(ctx, payload); err != nil {
		return nil, fmt.Errorf("failed to record lesson completion tx: %w", err)
	}

	// Invalidate user's cached roadmap atomically via epoch increment
	if u.cacheRepo != nil {
		if invErr := u.cacheRepo.InvalidateRoadmap(ctx, userID); invErr != nil {
			log.Printf("curriculum: failed to invalidate roadmap cache for user %s: %v", userID, invErr)
		}
	}

	awardedBadges, extraBadgeXP := u.evaluateLessonBadges(ctx, userID, payload)
	finalXP := payload.NewXP + extraBadgeXP
	finalLevel := u.helper.CalculateLevel(finalXP)

	var nextLessonID *string
	if nextID, err := u.curriculumRepo.GetNextLessonID(ctx, req.LessonID); err == nil && nextID != nil {
		nextLessonID = nextID
	}

	return &CompleteLessonResponse{
		Progress: *progress,
		Gamification: user.UserGamificationStats{
			XP:           finalXP,
			CurrentLevel: finalLevel,
			Streak:       payload.NewStreak,
			Gems:         payload.NewGems,
			LastActiveAt: &now,
		},
		UnlockedNextLessonID: nextLessonID,
		AwardedBadges:        awardedBadges,
	}, nil
}

// GetGrammarPoints retrieves all grammar points belonging to an unlocked proficiency level
func (u *usecase) GetGrammarPoints(ctx context.Context, userID string, levelID string) ([]GrammarPoint, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if levelID == "" {
		return nil, apperror.ErrBadRequest
	}

	lvl, err := u.langRepo.GetLevelByID(ctx, levelID)
	if err != nil {
		return nil, err
	}
	if lvl == nil {
		return nil, language.ErrProficiencyLevelNotFound
	}

	enrollment, err := u.resolveEnrollmentForRoadmap(ctx, userID, lvl.LanguageID)
	if err != nil {
		if errors.Is(err, language.ErrEnrollmentNotFound) {
			return nil, apperror.ErrForbidden
		}
		return nil, err
	}
	if enrollment == nil || enrollment.CurrentLevel == nil || lvl.OrderIndex > enrollment.CurrentLevel.OrderIndex {
		return nil, apperror.ErrForbidden
	}

	points, err := u.curriculumRepo.GetGrammarPointsByLevelID(ctx, levelID)
	if err != nil {
		return nil, err
	}
	if points == nil {
		points = []GrammarPoint{}
	}
	return points, nil
}

