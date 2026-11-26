package curriculum

import (
	"context"
	"time"

	"merantalk/backend/internal/app/exercise"
	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/app/language"
	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/app/user"
)

// Specific Curriculum Domain Errors
var (
	ErrUnitNotFound   = apperror.NewNotFoundError("UNIT_NOT_FOUND", "curriculum unit not found")
	ErrLessonNotFound = apperror.NewNotFoundError("LESSON_NOT_FOUND", "lesson node not found")
	ErrLessonLocked   = apperror.NewForbiddenError("LESSON_LOCKED", "previous lesson nodes must be completed first", nil)
)

// ============================================================================
// 1. PURE DOMAIN ENTITIES (1:1 with Master Database Schema / ERD)
// ============================================================================

// GrammarExample holds a real Japanese example sentence with romaji reading and Indonesian meaning.
type GrammarExample struct {
	JP      string `json:"jp"`
	Reading string `json:"reading"`
	ID      string `json:"id"`
}

// GrammarFormulaPart represents a single color-coded block inside a beginner-friendly grammar formula.
type GrammarFormulaPart struct {
	Text  string `json:"text"`
	Label string `json:"label"`
	Role  string `json:"role"`
}

// GrammarBreakdownToken represents one word/chunk inside an interactive sentence breakdown.
type GrammarBreakdownToken struct {
	JP      string `json:"jp"`
	Reading string `json:"reading"`
	Meaning string `json:"meaning"`
	Role    string `json:"role"`
}

// GrammarExampleBreakdown shows a Japanese sentence decomposed token-by-token with full translation.
type GrammarExampleBreakdown struct {
	Tokens      []GrammarBreakdownToken `json:"tokens"`
	Translation string                  `json:"translation"`
}

// GrammarFormVariation represents one conjugation/polarity form (Positif, Negatif, Tanya, etc.).
type GrammarFormVariation struct {
	Label   string `json:"label"`
	JP      string `json:"jp"`
	Reading string `json:"reading"`
	ID      string `json:"id"`
}

// GrammarCommonMistake highlights a frequent beginner pitfall alongside its corrected form and reason.
type GrammarCommonMistake struct {
	Wrong string `json:"wrong"`
	Right string `json:"right"`
	Why   string `json:"why"`
}

// GrammarMiniQuizItem defines an embedded comprehension check question on the grammar detail page.
type GrammarMiniQuizItem struct {
	Question string   `json:"question"`
	Options  []string `json:"options"`
	Answer   int      `json:"answer"`
	Why      string   `json:"why"`
}

// GrammarLearningGuide holds beginner-friendly structured teaching content stored in grammar_points.learning_guide.
type GrammarLearningGuide struct {
	Analogy      string                    `json:"analogy"`
	WhenToUse    []string                  `json:"when_to_use"`
	FormulaParts []GrammarFormulaPart      `json:"formula_parts"`
	Steps        []string                  `json:"steps"`
	Breakdowns   []GrammarExampleBreakdown `json:"breakdowns"`
	Forms        []GrammarFormVariation    `json:"forms"`
	Mistakes     []GrammarCommonMistake    `json:"mistakes"`
	Quiz         []GrammarMiniQuizItem     `json:"quiz"`
}

// UserGrammarProgress captures per-user comprehension quiz mastery & next spaced-repetition review timestamp.
type UserGrammarProgress struct {
	ID              string     `json:"id"`
	UserID          string     `json:"user_id"`
	GrammarPointID  string     `json:"grammar_point_id"`
	QuizScore       int        `json:"quiz_score"`
	CorrectCount    int        `json:"correct_count"`
	TotalQuestions  int        `json:"total_questions"`
	AttemptsCount   int        `json:"attempts_count"`
	IsUnderstood    bool       `json:"is_understood"`
	UnderstoodAt    *time.Time `json:"understood_at,omitempty"`
	NextReviewAt    *time.Time `json:"next_review_at,omitempty"`
	LastAttemptedAt time.Time  `json:"last_attempted_at"`
}

// SubmitGrammarCheckRequest defines the payload when a user finishes the mini understanding quiz.
type SubmitGrammarCheckRequest struct {
	CorrectCount   int `json:"correct_count" binding:"min=0"`
	TotalQuestions int `json:"total_questions" binding:"required,min=1,max=20"`
}

// SubmitGrammarCheckResponse returns updated mastery state and total understood count for the learner.
type SubmitGrammarCheckResponse struct {
	Progress        UserGrammarProgress `json:"progress"`
	UnderstoodTotal int                 `json:"understood_total"`
}

// GrammarPoint represents a normalized syntax rule / tenses / particles (grammar_points table)
type GrammarPoint struct {
	ID                  string                `json:"id"`
	LevelID             string                `json:"level_id"`
	LevelCode           string                `json:"level_code,omitempty"`
	Code                string                `json:"code"`
	Category            string                `json:"category"` // tense | conjugation | particle | honorific | sentence_pattern
	Title               string                `json:"title"`
	Formula             string                `json:"formula"`
	FormulaReading      string                `json:"formula_reading"`
	Explanation         string                `json:"explanation"`
	Examples            []GrammarExample      `json:"examples"`
	LearningGuide       *GrammarLearningGuide `json:"learning_guide,omitempty"`
	PracticeLessonSlug  string                `json:"practice_lesson_slug,omitempty"`
	PracticeLessonTitle string                `json:"practice_lesson_title,omitempty"`
	PracticeUnitOrder   int                   `json:"practice_unit_order,omitempty"`
	IsUnderstood        bool                  `json:"is_understood"`
	QuizScore           int                   `json:"quiz_score"`
	AttemptsCount       int                   `json:"attempts_count"`
	NextReviewAt        *time.Time            `json:"next_review_at,omitempty"`
	OrderIndex          int                   `json:"order_index"`
	CreatedAt           time.Time             `json:"created_at"`
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
	Slug       string    `json:"slug"`
	Title      string    `json:"title"`
	ShortTitle string    `json:"short_title"`
	IconName   string    `json:"icon_name"`
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
	ID                 string     `json:"id"`
	UnitID             string     `json:"unit_id"`
	Slug               string     `json:"slug"`
	Title              string     `json:"title"`
	ShortTitle         string     `json:"short_title"`
	IconName           string     `json:"icon_name"`
	XPReward           int        `json:"xp_reward"`
	OrderIndex         int        `json:"order_index"`
	TotalExercises     int        `json:"total_exercises"`
	CompletedExercises int        `json:"completed_exercises"`
	IsUnlocked         bool       `json:"is_unlocked"`
	IsCompleted        bool       `json:"is_completed"`
	Score              int        `json:"score"`
	IsSkipped          bool       `json:"is_skipped"`
	CompletedAt        *time.Time `json:"completed_at,omitempty"`
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
	LevelCode  string `form:"level_code" binding:"omitempty,max=16"`
}

// CurriculumResponse encapsulates the full active language curriculum tree with level metrics
type CurriculumResponse struct {
	Language         language.Language           `json:"language"`
	Level            language.ProficiencyLevel   `json:"level"`
	AvailableLevels  []language.ProficiencyLevel `json:"available_levels,omitempty"`
	TotalLessons     int                         `json:"total_lessons"`
	CompletedLessons int                         `json:"completed_lessons"`
	ProgressPercent  int                         `json:"progress_percent"`
	CurrentLessonID  *string                     `json:"current_lesson_id,omitempty"`
	Units            []UnitNodeResponse          `json:"units"`
}

// LessonStudyItem represents a sanitized, distractor-free preview card built server-side for the lesson study flow.
type LessonStudyItem struct {
	Symbol             string `json:"symbol"`
	Reading            string `json:"reading"`
	Meaning            string `json:"meaning"`
	Mnemonic           string `json:"mnemonic"`
	SpeakText          string `json:"speak_text"`
	FirstExerciseIndex int    `json:"first_exercise_index"`
}

// LessonDetailResponse encapsulates full lesson node details and its child interactive exercises
type LessonDetailResponse struct {
	ID            string              `json:"id"`
	UnitID        string              `json:"unit_id"`
	Slug          string              `json:"slug"`
	LevelID       string              `json:"-"`
	UnitType      string              `json:"-"`
	Title         string              `json:"title"`
	ShortTitle    string              `json:"short_title"`
	IconName      string              `json:"icon_name"`
	XPReward      int                 `json:"xp_reward"`
	OrderIndex    int                 `json:"order_index"`
	IsUnlocked    bool                `json:"is_unlocked"`
	IsCompleted   bool                `json:"is_completed"`
	Score         int                 `json:"score"`
	IsSkipped     bool                `json:"is_skipped"`
	CompletedAt   *time.Time          `json:"completed_at,omitempty"`
	GrammarPoints []GrammarPoint      `json:"grammar_points"`
	Exercises     []exercise.Exercise `json:"exercises"`
	StudyItems    []LessonStudyItem   `json:"study_items,omitempty"`
	CreatedAt     time.Time           `json:"created_at"`
}

// KanaCharacterItem represents a Japanese Gojuon character combined with the learner's mastery state.
type KanaCharacterItem struct {
	ID             string `json:"id"`
	Character      string `json:"character"`
	Script         string `json:"script"`
	Romaji         string `json:"romaji"`
	RowGroup       string `json:"row_group"`
	RowOrder       int    `json:"row_order"`
	ColOrder       int    `json:"col_order"`
	Mnemonic       string `json:"mnemonic"`
	ExampleWord    string `json:"example_word"`
	ExampleReading string `json:"example_reading"`
	ExampleMeaning string `json:"example_meaning"`
	PracticeCount  int    `json:"practice_count"`
	CorrectCount   int    `json:"correct_count"`
	MasteryScore   int    `json:"mastery_score"`
	IsMastered     bool   `json:"is_mastered"`
}

// KanaChartResponse wraps the full Hiragana or Katakana Gojuon matrix with progress counts.
type KanaChartResponse struct {
	Script        string              `json:"script"`
	Total         int                 `json:"total"`
	MasteredCount int                 `json:"mastered_count"`
	Characters    []KanaCharacterItem `json:"characters"`
}

// KanaPracticeItem records a single character practice or row quiz answer.
type KanaPracticeItem struct {
	Character string `json:"character" binding:"required"`
	IsCorrect bool   `json:"is_correct"`
}

// KanaPracticeRequest submits one or more practiced Kana characters atomically.
type KanaPracticeRequest struct {
	Results []KanaPracticeItem `json:"results" binding:"required,min=1,max=50,dive"`
}

// KanaPracticeResponse summarizes the updated user Kana mastery counts.
type KanaPracticeResponse struct {
	UpdatedCount  int `json:"updated_count"`
	MasteredTotal int `json:"mastered_total"`
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
	SessionScore   int                 `json:"-"`
	XPEarned       int                 `json:"xp_earned"`
	NewXP          int                 `json:"new_xp"`
	NewLevel       int                 `json:"new_level"`
	NewStreak      int                 `json:"new_streak"`
	NewGems        int                 `json:"new_gems"`
	PreviousStreak int                 `json:"-"`
	WasCompleted   bool                `json:"-"`
	UnitID         string              `json:"-"`
	LevelID        string              `json:"-"`
	UnitType       string              `json:"-"`
	LastActiveAt   time.Time           `json:"last_active_at"`
	ActivityType   string              `json:"activity_type"`
	Metadata       map[string]any      `json:"metadata,omitempty"`
}

// CompleteLessonResponse returns updated progression, gamification rewards, and the next unlocked node
type CompleteLessonResponse struct {
	Progress             UserLessonProgress             `json:"progress"`
	SessionScore         *int                           `json:"session_score,omitempty"`
	XPEarned             int                            `json:"xp_earned"`
	Gamification         user.UserGamificationStats     `json:"gamification"`
	UnlockedNextLessonID   *string                        `json:"unlocked_next_lesson_id,omitempty"`
	UnlockedNextLessonSlug *string                        `json:"unlocked_next_lesson_slug,omitempty"`
	AwardedBadges          []gamification.BadgeDefinition `json:"awarded_badges,omitempty"`
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
	GetCurriculumWithVersion(ctx context.Context, userID string, languageID string) (*CurriculumResponse, string, error)
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

