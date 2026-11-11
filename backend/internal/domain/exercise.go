package domain

import (
	"context"
	"time"
)

// Specific Exercise, SRS & Exam Domain Errors
var (
	ErrExerciseNotFound     = NewNotFoundError("EXERCISE_NOT_FOUND", "exercise not found")
	ErrReviewNotFound       = NewNotFoundError("SRS_REVIEW_NOT_FOUND", "srs review item not found")
	ErrExamAlreadyPassed    = NewConflictError("EXAM_ALREADY_PASSED", "readiness exam already passed for this level")
	ErrInvalidQualityRating = NewBadRequestError("INVALID_QUALITY_RATING", "quality rating must be between 0 and 5", nil)
)

// ExerciseType enumeration constants
const (
	ExerciseTypeMultipleChoice       = "multiple_choice"
	ExerciseTypeSentenceBuilder      = "sentence_builder"
	ExerciseTypeListeningCloze       = "listening_cloze"
	ExerciseTypePitchAccent          = "pitch_accent"
	ExerciseTypeKanjiTracing         = "kanji_tracing"
	ExerciseTypePlacementTest        = "placement_test"
	ExerciseTypeReadingComprehension = "reading_comprehension"
)

// ----------------------------------------------------------------------------
// DOMAIN ENTITIES
// ----------------------------------------------------------------------------

// Exercise represents an interactive pedagogical question (exercises table)
type Exercise struct {
	ID            string    `json:"id"`
	LessonID      *string   `json:"lesson_id,omitempty"`
	Type          string    `json:"type"` // multiple_choice | sentence_builder | listening_cloze | pitch_accent | kanji_tracing | placement_test
	QuestionText  string    `json:"question_text"`
	Options       []string  `json:"options"` // deserialized from JSONB array
	CorrectAnswer string    `json:"correct_answer,omitempty"`
	Hint          *string   `json:"hint,omitempty"`
	Explanation   *string   `json:"explanation,omitempty"`
	MediaURL      *string   `json:"media_url,omitempty"`
	XPReward      int       `json:"xp_reward"`
	OrderIndex    int       `json:"order_index"`
	CreatedAt     time.Time `json:"created_at"`
}

// UserExerciseAttempt logs single-attempt telemetry for learning analytics (user_exercise_attempts table)
type UserExerciseAttempt struct {
	ID               string    `json:"id"`
	UserID           string    `json:"user_id"`
	ExerciseID       string    `json:"exercise_id"`
	IsCorrect        bool      `json:"is_correct"`
	UserAnswer       string    `json:"user_answer"`
	TimeSpentSeconds int       `json:"time_spent_seconds"`
	CreatedAt        time.Time `json:"created_at"`
}

// UserSRSReview represents the spaced repetition memory state (SM-2) for an exercise (user_srs_reviews table)
type UserSRSReview struct {
	ID             string     `json:"id"`
	UserID         string     `json:"user_id"`
	ExerciseID     string     `json:"exercise_id"`
	Repetitions    int        `json:"repetitions"`
	IntervalDays   int        `json:"interval_days"`
	EaseFactor     float64    `json:"ease_factor"`
	DueDate        time.Time  `json:"due_date"`
	LastReviewedAt *time.Time `json:"last_reviewed_at,omitempty"`
	Exercise       *Exercise  `json:"exercise,omitempty"`
}

// ReadinessExamAttempt records full mock certification exam submissions (readiness_exam_attempts table)
type ReadinessExamAttempt struct {
	ID             string            `json:"id"`
	UserID         string            `json:"user_id"`
	LevelID        string            `json:"level_id"`
	TotalScore     int               `json:"total_score"`
	MaxScore       int               `json:"max_score"`
	ScorePercent   int               `json:"score_percent"`
	IsPassed       bool              `json:"is_passed"`
	AnswersPayload map[string]any    `json:"answers_payload,omitempty"`
	CompletedAt    time.Time         `json:"completed_at"`
	Level          *ProficiencyLevel `json:"level,omitempty"`
}

// ----------------------------------------------------------------------------
// DTOs (REQUESTS & RESPONSES)
// ----------------------------------------------------------------------------

// SubmitExerciseAnswerRequest defines the payload when answering an in-lesson exercise
type SubmitExerciseAnswerRequest struct {
	ExerciseID       string `json:"exercise_id" binding:"required,uuid"`
	UserAnswer       string `json:"user_answer" binding:"required"`
	TimeSpentSeconds int    `json:"time_spent_seconds" binding:"min=0"`
}

// SubmitExerciseAnswerResponse returns validation, correction, and reward feedback
type SubmitExerciseAnswerResponse struct {
	IsCorrect     bool       `json:"is_correct"`
	CorrectAnswer string     `json:"correct_answer"`
	Explanation   *string    `json:"explanation,omitempty"`
	XPEarned      int        `json:"xp_earned"`
	StreakBonus   int        `json:"streak_bonus"`
	NextReviewDue *time.Time `json:"next_review_due,omitempty"`
}

// SubmitSRSReviewRequest defines the SM-2 quality grade (0-5) after reviewing a card
type SubmitSRSReviewRequest struct {
	ExerciseID string `json:"exercise_id" binding:"required,uuid"`
	Quality    int    `json:"quality" binding:"required,min=0,max=5"`
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
	Attempt       ReadinessExamAttempt `json:"attempt"`
	Certificate   *ExamCertificate     `json:"certificate,omitempty"`
	AwardedBadges []BadgeDefinition    `json:"awarded_badges,omitempty"`
}

// ----------------------------------------------------------------------------
// CONTRACTS (INTERFACES)
// ----------------------------------------------------------------------------

// ExerciseRepository specifies persistence operations for exercises and telemetry
type ExerciseRepository interface {
	GetExercisesByLessonID(ctx context.Context, lessonID string) ([]Exercise, error)
	GetExerciseByID(ctx context.Context, id string) (*Exercise, error)
	GetPlacementExercises(ctx context.Context, languageID string, limit int) ([]Exercise, error)
	GetReadinessExamExercises(ctx context.Context, levelID string) ([]Exercise, error)
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
	CreateAttempt(ctx context.Context, attempt *ReadinessExamAttempt) error
	GetAttemptsByUserID(ctx context.Context, userID string, levelID string) ([]ReadinessExamAttempt, error)
	GetLatestPassedAttempt(ctx context.Context, userID string, levelID string) (*ReadinessExamAttempt, error)
}

// ExerciseUsecase specifies business operations for answering exercises and logging telemetry
type ExerciseUsecase interface {
	GetExercisesByLesson(ctx context.Context, lessonID string) ([]Exercise, error)
	SubmitAnswer(ctx context.Context, userID string, req *SubmitExerciseAnswerRequest) (*SubmitExerciseAnswerResponse, error)
}

// SRSUsecase specifies spaced repetition review workflows
type SRSUsecase interface {
	GetDueReviews(ctx context.Context, userID string, limit int) (*SRSQueueResponse, error)
	ProcessReview(ctx context.Context, userID string, req *SubmitSRSReviewRequest) (*UserSRSReview, error)
}

// ReadinessExamUsecase specifies official diagnostic and readiness certification workflows
type ReadinessExamUsecase interface {
	GetExamQuestions(ctx context.Context, levelID string) ([]Exercise, error)
	SubmitExam(ctx context.Context, userID string, req *SubmitReadinessExamRequest) (*ReadinessExamResponse, error)
}

