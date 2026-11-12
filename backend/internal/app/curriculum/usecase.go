package curriculum

import (
	"context"
	"fmt"
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

// GetRoadmap retrieves the full active language curriculum tree with calculated unit unlocks
func (u *usecase) GetRoadmap(ctx context.Context, userID string, req *GetRoadmapRequest) (*RoadmapResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}

	languageID := ""
	if req != nil {
		languageID = req.LanguageID
	}

	// 1. Check Redis cache first if cache repository is configured
	if u.cacheRepo != nil {
		if cached, err := u.cacheRepo.GetRoadmap(ctx, userID, languageID); err == nil && cached != nil {
			return cached, nil
		}
	}

	enrollment, err := u.langRepo.GetActiveEnrollment(ctx, userID, languageID)
	if err != nil {
		return nil, err
	}
	if enrollment == nil || enrollment.Language == nil || enrollment.CurrentLevel == nil {
		return nil, language.ErrEnrollmentNotFound
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

	// 2. Cache roadmap response for subsequent requests (15 min TTL)
	if u.cacheRepo != nil {
		_ = u.cacheRepo.SetRoadmap(ctx, userID, enrollment.Language.ID, res, 15*time.Minute)
		if languageID != "" && languageID != enrollment.Language.ID {
			_ = u.cacheRepo.SetRoadmap(ctx, userID, languageID, res, 15*time.Minute)
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

	if !lesson.IsCompleted {
		unlocked, err := u.curriculumRepo.IsLessonUnlocked(ctx, userID, lessonID)
		if err != nil {
			return nil, fmt.Errorf("failed to verify lesson unlock status: %w", err)
		}
		if !unlocked {
			return nil, ErrLessonLocked
		}
		lesson.IsUnlocked = true
	} else {
		lesson.IsUnlocked = true
	}

	exercises, err := u.exerciseRepo.GetExercisesByLessonID(ctx, lessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to query exercises for lesson: %w", err)
	}
	if exercises == nil {
		exercises = []exercise.Exercise{}
	}
	lesson.Exercises = exercises

	gps, err := u.curriculumRepo.GetGrammarPointsByLessonID(ctx, lessonID)
	if err == nil && len(gps) > 0 {
		lesson.GrammarPoints = gps
	} else {
		lesson.GrammarPoints = []GrammarPoint{}
	}

	return lesson, nil
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

	if !lesson.IsCompleted {
		unlocked, err := u.curriculumRepo.IsLessonUnlocked(ctx, userID, req.LessonID)
		if err != nil {
			return nil, fmt.Errorf("failed to verify lesson unlock status: %w", err)
		}
		if !unlocked {
			return nil, ErrLessonLocked
		}
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
		Score:       req.Score,
		IsSkipped:   false,
		CompletedAt: now,
	}

	newStreak, _ := u.helper.EvaluateDailyStreak(usr.Streak, usr.LastActiveAt, now)
	newXP := usr.XP + xpEarned
	newLevel := (newXP / 100) + 1

	// Atomic Unit-of-Work: update lesson progress, gamification stats, and activity log in a single DB transaction
	payload := &LessonCompletionPayload{
		Progress:     progress,
		XPEarned:     xpEarned,
		NewXP:        newXP,
		NewLevel:     newLevel,
		NewStreak:    newStreak,
		LastActiveAt: now,
		ActivityType: activityType,
		Metadata:     map[string]any{"lesson_id": req.LessonID, "score": req.Score, "is_practice": lesson.IsCompleted},
	}

	if err := u.curriculumRepo.RecordLessonCompletionTx(ctx, payload); err != nil {
		return nil, fmt.Errorf("failed to record lesson completion tx: %w", err)
	}

	// Invalidate user's cached roadmap to reflect freshly unlocked nodes
	if u.cacheRepo != nil {
		_ = u.cacheRepo.InvalidateRoadmap(ctx, userID)
	}

	var nextLessonID *string
	if nextID, err := u.curriculumRepo.GetNextLessonID(ctx, req.LessonID); err == nil && nextID != nil {
		nextLessonID = nextID
	}

	return &CompleteLessonResponse{
		Progress: *progress,
		Gamification: user.UserGamificationStats{
			XP:           newXP,
			CurrentLevel: newLevel,
			Streak:       newStreak,
			Gems:         usr.Gems,
			LastActiveAt: &now,
		},
		UnlockedNextLessonID: nextLessonID,
	}, nil
}

// GetGrammarPoints retrieves all grammar points belonging to a proficiency level
func (u *usecase) GetGrammarPoints(ctx context.Context, levelID string) ([]GrammarPoint, error) {
	if levelID == "" {
		return nil, apperror.ErrBadRequest
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

