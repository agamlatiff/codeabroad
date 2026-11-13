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

// ============================================================================
// 1. PURE DOMAIN ENTITIES (1:1 with Master Database Schema / ERD)
// ============================================================================

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

// Unit represents a static curriculum chapter or diagnostic mock module (units table)
type Unit struct {
	ID          string    `json:"id"`
	LevelID     string    `json:"level_id"`
	Title       string    `json:"title"`
	Description *string   `json:"description,omitempty"`
	UnitType    string    `json:"unit_type"` // curriculum | diagnostic_exam
	OrderIndex  int       `json:"order_index"`
	CreatedAt   time.Time `json:"created_at"`
}

// Lesson represents a static learning session node catalog (lessons table)
type Lesson struct {
	ID         string    `json:"id"`
	UnitID     string    `json:"unit_id"`
	Title      string    `json:"title"`
	XPReward   int       `json:"xp_reward"`
	OrderIndex int       `json:"order_index"`
	CreatedAt  time.Time `json:"created_at"`
}

// UserLessonProgress represents a user's completion status on a lesson (user_lesson_progress table)
type UserLessonProgress struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	LessonID    string    `json:"lesson_id"`
	IsCompleted bool      `json:"is_completed"`
	Score       int       `json:"score"`
	IsSkipped   bool      `json:"is_skipped"`
	CompletedAt time.Time `json:"completed_at"`
}

// ============================================================================
// 2. DATA TRANSFER OBJECTS (Explicit Request & Response View Models)
// ============================================================================

// LessonNodeResponse represents a decorated lesson node on the learner's interactive curriculum
type LessonNodeResponse struct {
	ID          string     `json:"id"`
	UnitID      string     `json:"unit_id"`
	Title       string     `json:"title"`
	XPReward    int        `json:"xp_reward"`
	OrderIndex  int        `json:"order_index"`
	IsUnlocked  bool       `json:"is_unlocked"`
	IsCompleted bool       `json:"is_completed"`
	Score       int        `json:"score"`
	IsSkipped   bool       `json:"is_skipped"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
}

// UnitNodeResponse represents a decorated curriculum unit with aggregated progress metrics
type UnitNodeResponse struct {
	ID               string               `json:"id"`
	LevelID          string               `json:"level_id"`
	Title            string               `json:"title"`
	Description      *string              `json:"description,omitempty"`
	UnitType         string               `json:"unit_type"` // curriculum | diagnostic_exam
	OrderIndex       int                  `json:"order_index"`
	TotalLessons     int                  `json:"total_lessons"`
	CompletedLessons int                  `json:"completed_lessons"`
	IsUnlocked       bool                 `json:"is_unlocked"`
	Lessons          []LessonNodeResponse `json:"lessons,omitempty"`
	CreatedAt        time.Time            `json:"created_at"`
}

// GetCurriculumRequest defines query filters for retrieving the curriculum
type GetCurriculumRequest struct {
	LanguageID string `form:"language_id" binding:"omitempty,uuid"`
}

// CurriculumResponse encapsulates the full active language curriculum tree with level metrics
type CurriculumResponse struct {
	Language         language.Language         `json:"language"`
	Level            language.ProficiencyLevel `json:"level"`
	TotalLessons     int                       `json:"total_lessons"`
	CompletedLessons int                       `json:"completed_lessons"`
	ProgressPercent  int                       `json:"progress_percent"`
	CurrentLessonID  *string                   `json:"current_lesson_id,omitempty"`
	Units            []UnitNodeResponse        `json:"units"`
}

// LessonDetailResponse encapsulates full lesson node details and its child interactive exercises
type LessonDetailResponse struct {
	ID            string              `json:"id"`
	UnitID        string              `json:"unit_id"`
	LevelID       string              `json:"-"`
	UnitType      string              `json:"-"`
	Title         string              `json:"title"`
	XPReward      int                 `json:"xp_reward"`
	OrderIndex    int                 `json:"order_index"`
	IsUnlocked    bool                `json:"is_unlocked"`
	IsCompleted   bool                `json:"is_completed"`
	Score         int                 `json:"score"`
	IsSkipped     bool                `json:"is_skipped"`
	CompletedAt   *time.Time          `json:"completed_at,omitempty"`
	GrammarPoints []GrammarPoint      `json:"grammar_points"`
	Exercises     []exercise.Exercise `json:"exercises"`
	CreatedAt     time.Time           `json:"created_at"`
}

// CompleteLessonRequest defines the payload when a learner submits a finished lesson
type CompleteLessonRequest struct {
	LessonID string `json:"lesson_id,omitempty" binding:"omitempty,uuid"`
	Score    int    `json:"score" binding:"min=0,max=100"`
}

// LessonAttemptSummary aggregates server-side attempt counts and accuracy for a learner's lesson session
type LessonAttemptSummary struct {
	TotalExercises          int `json:"total_exercises"`
	AttemptedExercises      int `json:"attempted_exercises"`
	CorrectExercises        int `json:"correct_exercises"`
	FreshAttemptedExercises int `json:"fresh_attempted_exercises"`
	FreshCorrectExercises   int `json:"fresh_correct_exercises"`
}

// LessonCompletionPayload encapsulates data required to record lesson completion atomically in a single transaction
type LessonCompletionPayload struct {
	Progress       *UserLessonProgress `json:"progress"`
	XPEarned       int                 `json:"xp_earned"`
	NewXP          int                 `json:"new_xp"`
	NewLevel       int                 `json:"new_level"`
	NewStreak      int                 `json:"new_streak"`
	NewGems        int                 `json:"new_gems"`
	PreviousStreak int                 `json:"-"`
	WasCompleted   bool                `json:"-"`
	LastActiveAt   time.Time           `json:"last_active_at"`
	ActivityType   string              `json:"activity_type"`
	Metadata       map[string]any      `json:"metadata,omitempty"`
}

// CompleteLessonResponse returns updated progression, gamification rewards, and the next unlocked node
type CompleteLessonResponse struct {
	Progress             UserLessonProgress             `json:"progress"`
	Gamification         user.UserGamificationStats     `json:"gamification"`
	UnlockedNextLessonID *string                        `json:"unlocked_next_lesson_id,omitempty"`
	AwardedBadges        []gamification.BadgeDefinition `json:"awarded_badges,omitempty"`
}

// ============================================================================
// 3. PERSISTENCE & BUSINESS LOGIC CONTRACTS
// ============================================================================

// GrammarPointRepository specifies data access operations for syntax and grammar points
type GrammarPointRepository interface {
	GetGrammarPointsByLevelID(ctx context.Context, levelID string) ([]GrammarPoint, error)
	GetGrammarPointsByLessonID(ctx context.Context, lessonID string) ([]GrammarPoint, error)
}

// UnitRepository specifies data access operations for curriculum units and chapters
type UnitRepository interface {
	GetUnitsByLevelID(ctx context.Context, levelID string, userID string) ([]UnitNodeResponse, error)
	GetUnitByID(ctx context.Context, id string) (*Unit, error)
}

// LessonRepository specifies data access operations for lesson catalogs and node navigation
type LessonRepository interface {
	GetLessonsByLevelID(ctx context.Context, levelID string, userID string) ([]LessonNodeResponse, error)
	GetLessonByID(ctx context.Context, id string, userID string) (*LessonDetailResponse, error)
	GetNextLessonID(ctx context.Context, currentLessonID string) (*string, error)
	IsLessonUnlocked(ctx context.Context, userID string, lessonID string) (bool, error)
}

// LessonProgressRepository specifies data access operations for user lesson completion state
type LessonProgressRepository interface {
	RecordLessonCompletionTx(ctx context.Context, payload *LessonCompletionPayload) error
	SkipPrecedingLessons(ctx context.Context, userID string, upToLevelOrder int, languageID string) error
}

// CurriculumCacheRepository specifies the caching contract for active curricula (Redis)
type CurriculumCacheRepository interface {
	GetCurriculumVersion(ctx context.Context, userID string) (string, error)
	GetCurriculum(ctx context.Context, userID string, languageID string) (*CurriculumResponse, error)
	GetCurriculumWithVersion(ctx context.Context, userID string, languageID string) (*CurriculumResponse, string, error)
	SetCurriculum(ctx context.Context, userID string, languageID string, curriculum *CurriculumResponse, ttl time.Duration) error
	SetCurriculumIfVersion(ctx context.Context, userID string, languageID string, expectedVersion string, curriculum *CurriculumResponse, ttl time.Duration) error
	InvalidateCurriculum(ctx context.Context, userID string) error
}

// Repository combines segregated curriculum contracts into a unified composite interface
type Repository interface {
	GrammarPointRepository
	UnitRepository
	LessonRepository
	LessonProgressRepository
}

// Usecase specifies business operations for curriculum and lesson navigation
type Usecase interface {
	GetCurriculum(ctx context.Context, userID string, req *GetCurriculumRequest) (*CurriculumResponse, error)
	GetLessonDetail(ctx context.Context, userID string, lessonID string) (*LessonDetailResponse, error)
	CompleteLesson(ctx context.Context, userID string, req *CompleteLessonRequest) (*CompleteLessonResponse, error)
	GetGrammarPoints(ctx context.Context, userID string, levelID string) ([]GrammarPoint, error)
}

