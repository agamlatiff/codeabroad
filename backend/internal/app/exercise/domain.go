package exercise

import (
	"context"
	"time"

	"codeabroad/backend/internal/app/gamification"
	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/shared/apperror"
)

// Specific Exercise, SRS & Exam Domain Errors
var (
	ErrExerciseNotFound     = apperror.NewNotFoundError("EXERCISE_NOT_FOUND", "exercise not found")
	ErrExerciseLessonLocked = apperror.NewForbiddenError("LESSON_LOCKED", "previous lesson nodes must be completed first", nil)
	ErrReviewNotFound       = apperror.NewNotFoundError("SRS_REVIEW_NOT_FOUND", "srs review item not found")
	ErrExamAlreadyPassed    = apperror.NewConflictError("EXAM_ALREADY_PASSED", "readiness exam already passed for this level")
	ErrExamResultNotFound   = apperror.NewNotFoundError("EXAM_RESULT_NOT_FOUND", "no passed readiness exam result found for this level")
	ErrInvalidQualityRating = apperror.NewBadRequestError("INVALID_QUALITY_RATING", "quality rating must be between 0 and 5", nil)
)

// SanitizeExercises returns a copy of exercises with answer keys, rubrics, and explanations stripped
// so clients cannot inspect solutions before submitting answers.
func SanitizeExercises(exercises []Exercise) []Exercise {
	sanitized := make([]Exercise, len(exercises))
	for i, ex := range exercises {
		ex.CorrectAnswer = ""
		ex.AcceptableAnswers = nil
		ex.DiagnosticRubric = nil
		ex.Explanation = nil
		sanitized[i] = ex
	}
	return sanitized
}

// ExerciseType enumeration constants aligned with database CHECK constraint
const (
	ExerciseTypeSentenceBuilder  = "sentence_builder"
	ExerciseTypeFillBlank        = "fill_blank"
	ExerciseTypeListeningChoice  = "listening_choice"
	ExerciseTypeSpeakingRepeat   = "speaking_repeat"
	ExerciseTypeDialogueRoleplay = "dialogue_roleplay"
)

// Exercise represents an interactive pedagogical question (exercises table)
type Exercise struct {
	ID                string         `json:"id"`
	LessonID          *string        `json:"lesson_id,omitempty"`
	GrammarPointID    *string        `json:"grammar_point_id,omitempty"`
	SkillPillar       string         `json:"skill_pillar"`
	ExerciseType      string         `json:"exercise_type"`
	Prompt            string         `json:"prompt"`
	Content           map[string]any `json:"content,omitempty"`
	Options           []string       `json:"options,omitempty"` // Extracted from content.options for frontend
	CorrectAnswer     string         `json:"correct_answer,omitempty"`
	AcceptableAnswers []string       `json:"acceptable_answers,omitempty"`
	DiagnosticRubric  map[string]any `json:"diagnostic_rubric,omitempty"`
	Explanation       *string        `json:"explanation,omitempty"`
	Hint              *string        `json:"hint,omitempty"`
	MediaURL          *string        `json:"media_url,omitempty"`
	XPReward          int            `json:"xp_reward"`
	OrderIndex        int            `json:"order_index"`
	CreatedAt         time.Time      `json:"created_at"`
}

// UserExerciseAttempt logs single-attempt telemetry for learning analytics (user_exercise_attempts table)
type UserExerciseAttempt struct {
	ID               string         `json:"id"`
	UserID           string         `json:"user_id"`
	ExerciseID       string         `json:"exercise_id"`
	IsCorrect        bool           `json:"is_correct"`
	SelectedAnswer   map[string]any `json:"selected_answer,omitempty"`
	TimeSpentSeconds int            `json:"time_spent_seconds"`
	CreatedAt        time.Time      `json:"created_at"`
}

// UserSRSReview represents the spaced repetition memory state (SM-2) for an exercise (user_srs_reviews table)
type UserSRSReview struct {
	ID              string     `json:"id"`
	UserID          string     `json:"user_id"`
	ExerciseID      string     `json:"exercise_id"`
	RepetitionCount int        `json:"repetition_count"`
	IntervalDays    int        `json:"interval_days"`
	EaseFactor      float64    `json:"ease_factor"`
	NextReviewAt    time.Time  `json:"next_review_at"`
	LastReviewedAt  *time.Time `json:"last_reviewed_at,omitempty"`
	Exercise        *Exercise  `json:"exercise,omitempty"`
}

// ReadinessExamAttempt records full mock certification exam submissions (readiness_exam_attempts table)
type ReadinessExamAttempt struct {
	ID             string                     `json:"id"`
	UserID         string                     `json:"user_id"`
	LevelID        string                     `json:"level_id"`
	ReadingScore   int                        `json:"reading_score"`
	ListeningScore int                        `json:"listening_score"`
	WritingScore   int                        `json:"writing_score"`
	SpeakingScore  int                        `json:"speaking_score"`
	OverallScore   int                        `json:"overall_score"`
	MaxScore       int                        `json:"max_score,omitempty"`
	ScorePercent   int                        `json:"score_percent"`
	IsPassed       bool                       `json:"is_passed"`
	AnalysisReport map[string]any             `json:"analysis_report,omitempty"`
	AttemptedAt    time.Time                  `json:"attempted_at"`
	Level          *language.ProficiencyLevel `json:"level,omitempty"`
}

// SubmitExerciseAnswerRequest defines the payload when answering an in-lesson exercise
type SubmitExerciseAnswerRequest struct {
	ExerciseID       string `json:"exercise_id" binding:"required,uuid"`
	UserAnswer       string `json:"user_answer" binding:"required"`
	TimeSpentSeconds int    `json:"time_spent_seconds" binding:"min=0"`
}

// SubmitExerciseAnswerResponse returns validation, correction, and reward feedback
type SubmitExerciseAnswerResponse struct {
	IsCorrect          bool       `json:"is_correct"`
	CorrectAnswer      string     `json:"correct_answer"`
	Explanation        *string    `json:"explanation,omitempty"`
	DiagnosticFeedback *string    `json:"diagnostic_feedback,omitempty"`
	XPEarned           int        `json:"xp_earned"`
	StreakBonus        int        `json:"streak_bonus"`
	NextReviewDue      *time.Time `json:"next_review_due,omitempty"`
}

// SubmitSRSReviewRequest defines the SM-2 quality grade (0-5) after reviewing a card
type SubmitSRSReviewRequest struct {
	ExerciseID string `json:"exercise_id" binding:"required,uuid"`
	Quality    *int   `json:"quality" binding:"required,min=0,max=5"`
}

// SRSQueueResponse provides the batch of due spaced repetition reviews
type SRSQueueResponse struct {
	TotalDue int             `json:"total_due"`
	Items    []UserSRSReview `json:"items"`
}

// SubmitReadinessExamRequest encapsulates all answers for a full mock exam
type SubmitReadinessExamRequest struct {
	LevelID string                        `json:"level_id" binding:"required,uuid"`
	Answers []SubmitExerciseAnswerRequest `json:"answers" binding:"required,min=1"`
}

// ExamCertificate provides official certification proof for passed readiness exams
type ExamCertificate struct {
	CertificateID string    `json:"certificate_id"`
	ExamName      string    `json:"exam_name"`
	LevelCode     string    `json:"level_code"`
	CandidateName string    `json:"candidate_name"`
	Score         int       `json:"score"`
	MaxScore      int       `json:"max_score"`
	Percentage    int       `json:"percentage"`
	IssuedAt      time.Time `json:"issued_at"`
}

// ReadinessExamResponse returns test evaluation, certification, and unlocked badges
type ReadinessExamResponse struct {
	Attempt       ReadinessExamAttempt           `json:"attempt"`
	Certificate   *ExamCertificate               `json:"certificate,omitempty"`
	AwardedBadges []gamification.BadgeDefinition `json:"awarded_badges,omitempty"`
}

// VocabularyItem represents a daily contextual vocabulary/expression card derived from active curriculum exercises
type VocabularyItem struct {
	ID              string `json:"id"`
	Term            string `json:"term"`
	Reading         string `json:"reading"`
	Meaning         string `json:"meaning"`
	Category        string `json:"category"`
	ExampleJA       string `json:"example_ja"`
	ExampleID       string `json:"example_id"`
	DifficultyLevel string `json:"difficulty_level"`
}

// Repository specifies persistence operations for exercises and telemetry
type Repository interface {
	GetExercisesByLessonID(ctx context.Context, lessonID string) ([]Exercise, error)
	GetExerciseByID(ctx context.Context, id string) (*Exercise, error)
	GetPlacementExercises(ctx context.Context, languageID string, limit int) ([]Exercise, error)
	GetReadinessExamExercises(ctx context.Context, levelID string) ([]Exercise, error)
	GetDailyVocabularies(ctx context.Context, userID string, limit int) ([]VocabularyItem, error)
	CreateAttempt(ctx context.Context, attempt *UserExerciseAttempt) error
	GetAttemptsByUserID(ctx context.Context, userID string, limit int) ([]UserExerciseAttempt, error)
}

// SRSRepository specifies persistence operations for spaced repetition scheduling
type SRSRepository interface {
	GetDueReviews(ctx context.Context, userID string, now time.Time, limit int) ([]UserSRSReview, error)
	GetReview(ctx context.Context, userID string, exerciseID string) (*UserSRSReview, error)
	UpsertReview(ctx context.Context, review *UserSRSReview) error
	GetDueCount(ctx context.Context, userID string, now time.Time) (int, error)
}

// ReadinessExamRepository specifies persistence operations for diagnostic mock exams
type ReadinessExamRepository interface {
	CreateExamAttempt(ctx context.Context, attempt *ReadinessExamAttempt) error
	GetExamAttemptsByUserID(ctx context.Context, userID string, levelID string) ([]ReadinessExamAttempt, error)
	GetLatestPassedAttempt(ctx context.Context, userID string, levelID string) (*ReadinessExamAttempt, error)
}

// TransactionalExamRecorder atomically checks duplicate passes, stores an exam attempt, and advances enrollment level
type TransactionalExamRecorder interface {
	RecordExamSubmissionTx(ctx context.Context, attempt *ReadinessExamAttempt, enrollmentID string, expectedLevelID string, nextLevelID string) (bool, error)
}

// LessonAccessChecker verifies whether a learner has unlocked a target curriculum lesson node
type LessonAccessChecker interface {
	IsLessonUnlocked(ctx context.Context, userID string, lessonID string) (bool, error)
}

// CurriculumCacheInvalidator invalidates cached curricula when level progression advances
type CurriculumCacheInvalidator interface {
	InvalidateCurriculum(ctx context.Context, userID string) error
}

// Usecase specifies business operations for answering exercises and logging telemetry
type Usecase interface {
	GetExercisesByLesson(ctx context.Context, userID string, lessonID string) ([]Exercise, error)
	SubmitAnswer(ctx context.Context, userID string, req *SubmitExerciseAnswerRequest) (*SubmitExerciseAnswerResponse, error)
	GetDailyVocabularies(ctx context.Context, userID string, limit int) ([]VocabularyItem, error)
}

// SRSUsecase specifies spaced repetition review workflows
type SRSUsecase interface {
	GetDueReviews(ctx context.Context, userID string, limit int) (*SRSQueueResponse, error)
	ProcessReview(ctx context.Context, userID string, req *SubmitSRSReviewRequest) (*UserSRSReview, error)
}

// ReadinessExamUsecase specifies official diagnostic and readiness certification workflows
type ReadinessExamUsecase interface {
	GetExamQuestions(ctx context.Context, userID string, levelID string) ([]Exercise, error)
	GetExamResult(ctx context.Context, userID string, levelID string) (*ReadinessExamResponse, error)
	SubmitExam(ctx context.Context, userID string, req *SubmitReadinessExamRequest) (*ReadinessExamResponse, error)
}

