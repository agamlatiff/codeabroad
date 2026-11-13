package curriculum

import (
	"context"
	"errors"
	"fmt"
	"log"
	"sort"
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

	// Capture cache version epoch and lookup cached roadmap in a single round-trip for active tracks only
	cacheVer := ""
	canCache := false
	if u.cacheRepo != nil && enrollment.IsActive {
		cached, ver, cacheErr := u.cacheRepo.GetRoadmapWithVersion(ctx, userID, enrollment.Language.ID)
		if cacheErr != nil {
			log.Printf("curriculum: failed to read roadmap cache for user %s: %v", userID, cacheErr)
		} else {
			cacheVer = ver
			canCache = true
			if cached != nil {
				return cached, nil
			}
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
	if !enrollment.IsActive {
		for i := range unlockedUnits {
			unlockedUnits[i].IsUnlocked = false
			for j := range unlockedUnits[i].Lessons {
				unlockedUnits[i].Lessons[j].IsUnlocked = false
			}
		}
		currentLessonID = nil
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

	// 2. Cache roadmap response only if version lookup succeeded and epoch has not advanced during DB read
	if u.cacheRepo != nil && canCache {
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

	canonicalLessonID := lesson.ID
	if canonicalLessonID == "" {
		canonicalLessonID = lessonID
	}

	unlocked, err := u.curriculumRepo.IsLessonUnlocked(ctx, userID, canonicalLessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to verify lesson unlock status: %w", err)
	}
	if !unlocked {
		return nil, ErrLessonLocked
	}
	lesson.IsUnlocked = true

	exercises, err := u.exerciseRepo.GetExercisesByLessonID(ctx, canonicalLessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to query exercises for lesson: %w", err)
	}
	lesson.Exercises = exercise.SanitizeExercises(exercises)

	gps, err := u.curriculumRepo.GetGrammarPointsByLessonID(ctx, canonicalLessonID)
	if err != nil {
		log.Printf("curriculum: failed to query grammar points for lesson %s: %v", canonicalLessonID, err)
		lesson.GrammarPoints = []GrammarPoint{}
	} else if len(gps) > 0 {
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

	// Always include first_step so transient post-commit failures self-heal on subsequent completions;
	// DB ON CONFLICT DO NOTHING guarantees first_step and streak badges cannot be double-awarded.
	candidates := []string{"first_step"}
	if payload.NewStreak >= 7 {
		candidates = append(candidates, "streak_7")
	}
	if payload.NewStreak >= 30 {
		candidates = append(candidates, "streak_30")
	}

	existingBadges, err := u.gamificationRepo.GetUserBadges(ctx, userID)
	if err != nil {
		log.Printf("curriculum: failed to query user badges for user %s: %v", userID, err)
		return nil, 0
	}
	owned := make(map[string]bool, len(existingBadges))
	for _, ub := range existingBadges {
		owned[ub.BadgeKey] = true
	}

	hasPendingCandidate := false
	for _, key := range candidates {
		if !owned[key] {
			hasPendingCandidate = true
			break
		}
	}
	if !hasPendingCandidate {
		return nil, 0
	}

	badgeDefByID := make(map[string]gamification.BadgeDefinition)
	if defs, defErr := u.gamificationRepo.GetBadges(ctx); defErr != nil {
		log.Printf("curriculum: failed to fetch badge definitions for user %s: %v", userID, defErr)
	} else {
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
			log.Printf("curriculum: failed to award badge %s to user %s: %v", key, userID, awardErr)
			continue
		}
		owned[key] = true
		if ub != nil && ub.Badge != nil {
			awarded = append(awarded, *ub.Badge)
			extraXP += ub.Badge.XPReward
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
	canonicalLessonID := lesson.ID
	if canonicalLessonID == "" {
		canonicalLessonID = req.LessonID
	}

	unlocked, err := u.curriculumRepo.IsLessonUnlocked(ctx, userID, canonicalLessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to verify lesson unlock status: %w", err)
	}
	if !unlocked {
		return nil, ErrLessonLocked
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
		LessonID:    canonicalLessonID,
		IsCompleted: true,
		Score:       req.Score,
		IsSkipped:   false,
		CompletedAt: now,
	}

	newStreak, _ := u.helper.EvaluateDailyStreak(usr.Streak, usr.LastActiveAt, now)
	newXP := usr.XP + xpEarned
	newLevel := u.helper.CalculateLevel(newXP)

	// Atomic Unit-of-Work: verify attempts, derive score, update progress, gamification stats, and activity log under TX lock
	payload := &LessonCompletionPayload{
		Progress:     progress,
		XPEarned:     xpEarned,
		NewXP:        newXP,
		NewLevel:     newLevel,
		NewStreak:    newStreak,
		NewGems:      usr.Gems,
		LastActiveAt: now,
		ActivityType: activityType,
		Metadata:     map[string]any{"lesson_id": canonicalLessonID, "score": req.Score, "is_practice": lesson.IsCompleted},
	}

	if err := u.curriculumRepo.RecordLessonCompletionTx(ctx, payload); err != nil {
		var domainErr *apperror.DomainError
		if errors.As(err, &domainErr) || errors.Is(err, user.ErrUserNotFound) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to record lesson completion tx: %w", err)
	}

	// Invalidate user's cached roadmap atomically via epoch increment
	if u.cacheRepo != nil {
		if invErr := u.cacheRepo.InvalidateRoadmap(ctx, userID); invErr != nil {
			log.Printf("curriculum: failed to invalidate roadmap cache for user %s: %v", userID, invErr)
		}
	}

	// Automatically advance current_level_id if every lesson in the user's current level is now complete
	u.maybeAdvanceEnrollmentLevel(ctx, userID, lesson.UnitID, lesson.LevelID, lesson.UnitType)

	awardedBadges, extraBadgeXP := u.evaluateLessonBadges(ctx, userID, payload)
	finalXP := payload.NewXP + extraBadgeXP
	finalLevel := u.helper.CalculateLevel(finalXP)
	if len(awardedBadges) > 0 && u.userRepo != nil {
		if refreshedUser, refErr := u.userRepo.GetByID(ctx, userID); refErr != nil {
			log.Printf("curriculum: failed to refresh user stats after awarding badges for user %s: %v", userID, refErr)
		} else if refreshedUser != nil && refreshedUser.XP > finalXP {
			finalXP = refreshedUser.XP
			finalLevel = u.helper.CalculateLevel(finalXP)
			if refreshedUser.CurrentLevel > finalLevel {
				finalLevel = refreshedUser.CurrentLevel
			}
		}
	}

	var nextLessonID *string
	if nextID, nextErr := u.curriculumRepo.GetNextLessonID(ctx, canonicalLessonID); nextErr != nil {
		log.Printf("curriculum: failed to resolve next lesson id after %s: %v", canonicalLessonID, nextErr)
	} else if nextID != nil {
		nextLessonID = nextID
	}

	lastActive := payload.LastActiveAt
	if lastActive.IsZero() {
		lastActive = now
	}

	return &CompleteLessonResponse{
		Progress: *progress,
		Gamification: user.UserGamificationStats{
			XP:           finalXP,
			CurrentLevel: finalLevel,
			Streak:       payload.NewStreak,
			Gems:         payload.NewGems,
			LastActiveAt: &lastActive,
		},
		UnlockedNextLessonID: nextLessonID,
		AwardedBadges:        awardedBadges,
	}, nil
}

func (u *usecase) maybeAdvanceEnrollmentLevel(ctx context.Context, userID string, unitID string, levelID string, unitType string) {
	if u.langRepo == nil || u.curriculumRepo == nil {
		return
	}

	if levelID == "" {
		if unitID == "" {
			return
		}
		unit, err := u.curriculumRepo.GetUnitByID(ctx, unitID)
		if err != nil || unit == nil || unit.LevelID == "" {
			return
		}
		levelID = unit.LevelID
		if unitType == "" {
			unitType = unit.UnitType
		}
	}
	if unitType != "" && unitType != "curriculum" {
		return
	}

	var targetEnrollment *language.UserLanguageEnrollment
	if activeEnr, actErr := u.langRepo.GetActiveEnrollment(ctx, userID, ""); actErr == nil && activeEnr != nil {
		if !activeEnr.IsActive || activeEnr.CurrentLevelID == nil || *activeEnr.CurrentLevelID != levelID {
			return
		}
		targetEnrollment = activeEnr
	} else {
		enrollments, err := u.langRepo.GetEnrollmentsByUserID(ctx, userID)
		if err != nil {
			return
		}
		for i := range enrollments {
			enr := &enrollments[i]
			if enr.IsActive && enr.CurrentLevelID != nil && *enr.CurrentLevelID == levelID {
				targetEnrollment = enr
				break
			}
		}
	}
	if targetEnrollment == nil {
		return
	}

	lessons, err := u.curriculumRepo.GetLessonsByLevelID(ctx, levelID, userID)
	if err != nil || len(lessons) == 0 {
		return
	}
	for _, l := range lessons {
		if !l.IsCompleted || l.Score < minLessonPassScore {
			return
		}
	}

	levels, err := u.langRepo.GetLevelsByLanguageID(ctx, targetEnrollment.LanguageID)
	if err != nil || len(levels) == 0 {
		return
	}
	sortedLevels := make([]language.ProficiencyLevel, len(levels))
	copy(sortedLevels, levels)
	sort.Slice(sortedLevels, func(i, j int) bool {
		return sortedLevels[i].OrderIndex < sortedLevels[j].OrderIndex
	})

	for i, lvl := range sortedLevels {
		if lvl.ID == levelID {
			if i+1 < len(sortedLevels) {
				nextLevel := sortedLevels[i+1]
				nextUnits, uErr := u.curriculumRepo.GetUnitsByLevelID(ctx, nextLevel.ID, userID)
				if uErr != nil || len(nextUnits) == 0 {
					return
				}
				nextLessons, lErr := u.curriculumRepo.GetLessonsByLevelID(ctx, nextLevel.ID, userID)
				if lErr != nil || len(nextLessons) == 0 {
					return
				}
				if err := u.langRepo.UpdateEnrollmentLevelIfCurrent(ctx, targetEnrollment.ID, levelID, nextLevel.ID); err != nil {
					if !errors.Is(err, language.ErrEnrollmentLevelChanged) {
						log.Printf("curriculum: failed to advance enrollment level for user %s: %v", userID, err)
					}
					return
				}
				if u.cacheRepo != nil {
					if invErr := u.cacheRepo.InvalidateRoadmap(ctx, userID); invErr != nil {
						log.Printf("curriculum: failed to invalidate roadmap cache after level advance for user %s: %v", userID, invErr)
					}
				}
			}
			return
		}
	}
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

