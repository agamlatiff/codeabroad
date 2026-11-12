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
	helper           *Helper
}

// NewUsecase creates a new Curriculum Usecase instance
func NewUsecase(
	curriculumRepo Repository,
	langRepo language.Repository,
	exerciseRepo exercise.Repository,
	userRepo user.Repository,
	gamificationRepo gamification.Repository,
) Usecase {
	return &usecase{
		curriculumRepo:   curriculumRepo,
		langRepo:         langRepo,
		exerciseRepo:     exerciseRepo,
		userRepo:         userRepo,
		gamificationRepo: gamificationRepo,
		helper:           NewHelper(),
	}
}

// GetRoadmap retrieves the full active language curriculum tree with calculated unit unlocks
func (u *usecase) GetRoadmap(ctx context.Context, userID string, languageID string) (*RoadmapResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
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

	for i := range units {
		lessons, err := u.curriculumRepo.GetLessonsByUnitID(ctx, units[i].ID, userID)
		if err != nil {
			return nil, fmt.Errorf("failed to query lessons for unit %s: %w", units[i].ID, err)
		}
		units[i].Lessons = lessons
	}

	unlockedUnits := u.helper.CalculateUnitUnlocks(units)

	return &RoadmapResponse{
		Language: *enrollment.Language,
		Level:    *enrollment.CurrentLevel,
		Units:    unlockedUnits,
	}, nil
}

// GetLessonDetail retrieves a lesson node and its child exercises for the learn workspace
func (u *usecase) GetLessonDetail(ctx context.Context, userID string, lessonID string) (*Lesson, error) {
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

	exercises, err := u.exerciseRepo.GetExercisesByLessonID(ctx, lessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to query exercises for lesson: %w", err)
	}
	lesson.Exercises = exercises

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

	now := time.Now().UTC()
	progress := &UserLessonProgress{
		UserID:      userID,
		LessonID:    req.LessonID,
		IsCompleted: true,
		Score:       req.Score,
		IsSkipped:   false,
		CompletedAt: now,
	}

	if err := u.curriculumRepo.UpsertLessonProgress(ctx, progress); err != nil {
		return nil, fmt.Errorf("failed to record lesson completion: %w", err)
	}

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

	newXP := usr.XP + xpEarned
	newLevel := (newXP / 100) + 1

	if err := u.userRepo.UpdateGamification(ctx, userID, newXP, newLevel, usr.Streak, &now); err != nil {
		return nil, fmt.Errorf("failed to update gamification stats: %w", err)
	}

	_ = u.userRepo.LogActivity(ctx, &user.UserActivityLog{
		UserID:       userID,
		ActivityType: "lesson_completed",
		XPEarned:     xpEarned,
		Metadata:     map[string]any{"lesson_id": req.LessonID, "score": req.Score},
		CreatedAt:    now,
	})

	return &CompleteLessonResponse{
		Progress: *progress,
		Gamification: user.UserGamificationStats{
			XP:           newXP,
			CurrentLevel: newLevel,
			Streak:       usr.Streak,
			Gems:         usr.Gems,
			LastActiveAt: &now,
		},
	}, nil
}

