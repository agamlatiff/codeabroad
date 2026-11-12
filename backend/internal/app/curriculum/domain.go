package curriculum

import (
	"context"
	"time"

	"codeabroad/backend/internal/app/exercise"
	"codeabroad/backend/internal/app/gamification"
	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/app/user"
)

// Specific Curriculum Domain Errors
var (
	ErrGrammarPointNotFound = apperror.NewNotFoundError("GRAMMAR_POINT_NOT_FOUND", "grammar point not found")
	ErrUnitNotFound         = apperror.NewNotFoundError("UNIT_NOT_FOUND", "curriculum unit not found")
	ErrLessonNotFound       = apperror.NewNotFoundError("LESSON_NOT_FOUND", "lesson node not found")
	ErrLessonLocked         = apperror.NewForbiddenError("LESSON_LOCKED", "previous lesson nodes must be completed first", nil)
)

// GrammarPoint represents a normalized syntax rule / tenses / particles (grammar_points table)
type GrammarPoint struct {
	ID          string    `json:"id"`
	LevelID     string    `json:"level_id"`
	Code        string    `json:"code"`
	Category    string    `json:"category"` // tense | conjugation | particle | honorific | sentence_pattern
	Title       string    `json:"title"`
	Formula     string    `json:"formula"`
	Explanation string    `json:"explanation"`
	OrderIndex  int       `json:"order_index"`
	CreatedAt   time.Time `json:"created_at"`
}

// Unit represents a curriculum chapter or diagnostic mock module (units table)
type Unit struct {
	ID               string    `json:"id"`
	LevelID          string    `json:"level_id"`
	Title            string    `json:"title"`
	Description      *string   `json:"description,omitempty"`
	UnitType         string    `json:"unit_type"` // curriculum | diagnostic_exam
	OrderIndex       int       `json:"order_index"`
	TotalLessons     int       `json:"total_lessons"`
	CompletedLessons int       `json:"completed_lessons"`
	IsUnlocked       bool      `json:"is_unlocked"`
	Lessons          []Lesson  `json:"lessons,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
}

// Lesson represents a daily learning session node on the roadmap (lessons table)
type Lesson struct {
	ID          string              `json:"id"`
	UnitID      string              `json:"unit_id"`
	Title       string              `json:"title"`
	XPReward    int                 `json:"xp_reward"`
	OrderIndex  int                 `json:"order_index"`
	IsCompleted bool                `json:"is_completed"`
	Score       int                 `json:"score"`
	IsSkipped   bool                `json:"is_skipped"`
	CompletedAt *time.Time          `json:"completed_at,omitempty"`
	Exercises   []exercise.Exercise `json:"exercises,omitempty"`
	CreatedAt   time.Time           `json:"created_at"`
}

// UserLessonProgress represents node completion status in the user's roadmap (user_lesson_progress table)
type UserLessonProgress struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	LessonID    string    `json:"lesson_id"`
	IsCompleted bool      `json:"is_completed"`
	Score       int       `json:"score"`
	IsSkipped   bool      `json:"is_skipped"`
	CompletedAt time.Time `json:"completed_at"`
}

// RoadmapResponse encapsulates the full active language curriculum tree
type RoadmapResponse struct {
	Language language.Language         `json:"language"`
	Level    language.ProficiencyLevel `json:"level"`
	Units    []Unit                    `json:"units"`
}

// CompleteLessonRequest defines the payload when a learner completes all exercises in a lesson
type CompleteLessonRequest struct {
	LessonID string `json:"lesson_id" binding:"required,uuid"`
	Score    int    `json:"score" binding:"required,min=0,max=100"`
}

// CompleteLessonResponse returns the updated progression and rewards
type CompleteLessonResponse struct {
	Progress             UserLessonProgress             `json:"progress"`
	Gamification         user.UserGamificationStats     `json:"gamification"`
	UnlockedNextLessonID *string                        `json:"unlocked_next_lesson_id,omitempty"`
	AwardedBadges        []gamification.BadgeDefinition `json:"awarded_badges,omitempty"`
}

// Repository specifies data access operations for curriculum structures
type Repository interface {
	GetGrammarPointsByLevelID(ctx context.Context, levelID string) ([]GrammarPoint, error)
	GetGrammarPointByID(ctx context.Context, id string) (*GrammarPoint, error)
	GetUnitsByLevelID(ctx context.Context, levelID string, userID string) ([]Unit, error)
	GetUnitByID(ctx context.Context, id string) (*Unit, error)
	GetLessonsByUnitID(ctx context.Context, unitID string, userID string) ([]Lesson, error)
	GetLessonByID(ctx context.Context, id string, userID string) (*Lesson, error)
	GetUserLessonProgress(ctx context.Context, userID string, lessonID string) (*UserLessonProgress, error)
	UpsertLessonProgress(ctx context.Context, progress *UserLessonProgress) error
	SkipPrecedingLessons(ctx context.Context, userID string, upToLevelOrder int, languageID string) error
}

// Usecase specifies business operations for roadmap and lesson navigation
type Usecase interface {
	GetRoadmap(ctx context.Context, userID string, languageID string) (*RoadmapResponse, error)
	GetLessonDetail(ctx context.Context, userID string, lessonID string) (*Lesson, error)
	CompleteLesson(ctx context.Context, userID string, req *CompleteLessonRequest) (*CompleteLessonResponse, error)
}

