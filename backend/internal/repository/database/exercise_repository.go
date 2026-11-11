package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
)

// ExerciseRepository implements domain.ExerciseRepository, domain.SRSRepository, and domain.ReadinessExamRepository
type ExerciseRepository struct {
	db *postgres.PostgresDB
}

// NewExerciseRepository creates a new PostgreSQL exercise repository instance
func NewExerciseRepository(db *postgres.PostgresDB) domain.ExerciseRepository {
	return &ExerciseRepository{db: db}
}

// NewSRSRepository creates a new PostgreSQL spaced repetition repository instance
func NewSRSRepository(db *postgres.PostgresDB) domain.SRSRepository {
	return &ExerciseRepository{db: db}
}

// NewReadinessExamRepository creates a new PostgreSQL readiness exam repository instance
func NewReadinessExamRepository(db *postgres.PostgresDB) domain.ReadinessExamRepository {
	return &ExerciseRepository{db: db}
}

// ----------------------------------------------------------------------------
// EXERCISE REPOSITORY METHODS
// ----------------------------------------------------------------------------

// GetExercisesByLessonID retrieves all exercises belonging to a specific lesson node
func (r *ExerciseRepository) GetExercisesByLessonID(ctx context.Context, lessonID string) ([]domain.Exercise, error) {
	query := `
		SELECT id, lesson_id, type, question_text, options, correct_answer, hint, explanation, media_url, xp_reward, order_index, created_at
		FROM exercises
		WHERE lesson_id = $1
		ORDER BY order_index ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, lessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to query exercises by lesson id: %w", err)
	}
	defer rows.Close()

	var exercises []domain.Exercise
	for rows.Next() {
		var ex domain.Exercise
		var optionsJSON []byte
		if err := rows.Scan(
			&ex.ID, &ex.LessonID, &ex.Type, &ex.QuestionText, &optionsJSON,
			&ex.CorrectAnswer, &ex.Hint, &ex.Explanation, &ex.MediaURL,
			&ex.XPReward, &ex.OrderIndex, &ex.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan exercise row: %w", err)
		}
		if len(optionsJSON) > 0 {
			_ = json.Unmarshal(optionsJSON, &ex.Options)
		}
		exercises = append(exercises, ex)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in exercises: %w", err)
	}
	return exercises, nil
}

// GetExerciseByID retrieves a single exercise by UUID
func (r *ExerciseRepository) GetExerciseByID(ctx context.Context, id string) (*domain.Exercise, error) {
	query := `
		SELECT id, lesson_id, type, question_text, options, correct_answer, hint, explanation, media_url, xp_reward, order_index, created_at
		FROM exercises
		WHERE id = $1
	`
	var ex domain.Exercise
	var optionsJSON []byte
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&ex.ID, &ex.LessonID, &ex.Type, &ex.QuestionText, &optionsJSON,
		&ex.CorrectAnswer, &ex.Hint, &ex.Explanation, &ex.MediaURL,
		&ex.XPReward, &ex.OrderIndex, &ex.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrExerciseNotFound
		}
		return nil, fmt.Errorf("failed to query exercise by id: %w", err)
	}
	if len(optionsJSON) > 0 {
		_ = json.Unmarshal(optionsJSON, &ex.Options)
	}
	return &ex, nil
}

// GetPlacementExercises retrieves diagnostic placement test exercises for a destination language
func (r *ExerciseRepository) GetPlacementExercises(ctx context.Context, languageID string, limit int) ([]domain.Exercise, error) {
	query := `
		SELECT e.id, e.lesson_id, e.type, e.question_text, e.options, e.correct_answer, e.hint, e.explanation, e.media_url, e.xp_reward, e.order_index, e.created_at
		FROM exercises e
		JOIN lessons l ON e.lesson_id = l.id
		JOIN units u ON l.unit_id = u.id
		JOIN proficiency_levels pl ON u.level_id = pl.id
		WHERE pl.language_id = $1::uuid AND (e.type = 'placement_test' OR u.unit_type = 'diagnostic_exam')
		ORDER BY e.order_index ASC
		LIMIT $2
	`
	rows, err := r.db.Pool.Query(ctx, query, languageID, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query placement exercises: %w", err)
	}
	defer rows.Close()

	var exercises []domain.Exercise
	for rows.Next() {
		var ex domain.Exercise
		var optionsJSON []byte
		if err := rows.Scan(
			&ex.ID, &ex.LessonID, &ex.Type, &ex.QuestionText, &optionsJSON,
			&ex.CorrectAnswer, &ex.Hint, &ex.Explanation, &ex.MediaURL,
			&ex.XPReward, &ex.OrderIndex, &ex.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan placement exercise row: %w", err)
		}
		if len(optionsJSON) > 0 {
			_ = json.Unmarshal(optionsJSON, &ex.Options)
		}
		exercises = append(exercises, ex)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in placement exercises: %w", err)
	}
	return exercises, nil
}

// GetReadinessExamExercises retrieves all sectional questions for an official mock exam
func (r *ExerciseRepository) GetReadinessExamExercises(ctx context.Context, levelID string) ([]domain.Exercise, error) {
	query := `
		SELECT e.id, e.lesson_id, e.type, e.question_text, e.options, e.correct_answer, e.hint, e.explanation, e.media_url, e.xp_reward, e.order_index, e.created_at
		FROM exercises e
		JOIN lessons l ON e.lesson_id = l.id
		JOIN units u ON l.unit_id = u.id
		WHERE u.level_id = $1::uuid AND u.unit_type = 'diagnostic_exam'
		ORDER BY e.order_index ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, levelID)
	if err != nil {
		return nil, fmt.Errorf("failed to query readiness exam exercises: %w", err)
	}
	defer rows.Close()

	var exercises []domain.Exercise
	for rows.Next() {
		var ex domain.Exercise
		var optionsJSON []byte
		if err := rows.Scan(
			&ex.ID, &ex.LessonID, &ex.Type, &ex.QuestionText, &optionsJSON,
			&ex.CorrectAnswer, &ex.Hint, &ex.Explanation, &ex.MediaURL,
			&ex.XPReward, &ex.OrderIndex, &ex.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan readiness exam exercise row: %w", err)
		}
		if len(optionsJSON) > 0 {
			_ = json.Unmarshal(optionsJSON, &ex.Options)
		}
		exercises = append(exercises, ex)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in readiness exam exercises: %w", err)
	}
	return exercises, nil
}

// CreateAttempt logs telemetry data for an answered exercise
func (r *ExerciseRepository) CreateAttempt(ctx context.Context, attempt *domain.UserExerciseAttempt) error {
	query := `
		INSERT INTO user_exercise_attempts (user_id, exercise_id, is_correct, user_answer, time_spent_seconds, created_at)
		VALUES ($1, $2, $3, $4, $5, NOW())
		RETURNING id, created_at
	`
	err := r.db.Pool.QueryRow(
		ctx, query,
		attempt.UserID, attempt.ExerciseID, attempt.IsCorrect, attempt.UserAnswer, attempt.TimeSpentSeconds,
	).Scan(&attempt.ID, &attempt.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to insert exercise attempt: %w", err)
	}
	return nil
}

// GetAttemptsByUserID retrieves the most recent answer attempts for user analytics
func (r *ExerciseRepository) GetAttemptsByUserID(ctx context.Context, userID string, limit int) ([]domain.UserExerciseAttempt, error) {
	query := `
		SELECT id, user_id, exercise_id, is_correct, user_answer, time_spent_seconds, created_at
		FROM user_exercise_attempts
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT $2
	`
	rows, err := r.db.Pool.Query(ctx, query, userID, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query attempts by user: %w", err)
	}
	defer rows.Close()

	var attempts []domain.UserExerciseAttempt
	for rows.Next() {
		var a domain.UserExerciseAttempt
		if err := rows.Scan(
			&a.ID, &a.UserID, &a.ExerciseID, &a.IsCorrect, &a.UserAnswer, &a.TimeSpentSeconds, &a.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan attempt row: %w", err)
		}
		attempts = append(attempts, a)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in user attempts: %w", err)
	}
	return attempts, nil
}

// ----------------------------------------------------------------------------
// SRS REPOSITORY METHODS (SM-2 ENGINE)
// ----------------------------------------------------------------------------

// GetDueReviews retrieves spaced repetition cards due for review as of the specified time (zero N+1 via joined exercise)
func (r *ExerciseRepository) GetDueReviews(ctx context.Context, userID string, now time.Time, limit int) ([]domain.UserSRSReview, error) {
	query := `
		SELECT 
			r.id, r.user_id, r.exercise_id, r.repetitions, r.interval_days, r.ease_factor, r.due_date, r.last_reviewed_at,
			e.id, e.lesson_id, e.type, e.question_text, e.options, e.correct_answer, e.hint, e.explanation, e.media_url, e.xp_reward, e.order_index, e.created_at
		FROM user_srs_reviews r
		JOIN exercises e ON r.exercise_id = e.id
		WHERE r.user_id = $1 AND r.due_date <= $2::date
		ORDER BY r.due_date ASC, r.repetitions ASC
		LIMIT $3
	`
	rows, err := r.db.Pool.Query(ctx, query, userID, now, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query due srs reviews: %w", err)
	}
	defer rows.Close()

	var reviews []domain.UserSRSReview
	for rows.Next() {
		var rev domain.UserSRSReview
		var ex domain.Exercise
		var optionsJSON []byte

		if err := rows.Scan(
			&rev.ID, &rev.UserID, &rev.ExerciseID, &rev.Repetitions, &rev.IntervalDays, &rev.EaseFactor, &rev.DueDate, &rev.LastReviewedAt,
			&ex.ID, &ex.LessonID, &ex.Type, &ex.QuestionText, &optionsJSON, &ex.CorrectAnswer, &ex.Hint, &ex.Explanation, &ex.MediaURL, &ex.XPReward, &ex.OrderIndex, &ex.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan srs review row: %w", err)
		}
		if len(optionsJSON) > 0 {
			_ = json.Unmarshal(optionsJSON, &ex.Options)
		}
		rev.Exercise = &ex
		reviews = append(reviews, rev)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in due srs reviews: %w", err)
	}
	return reviews, nil
}

// GetReview retrieves a single SRS card for a user and exercise
func (r *ExerciseRepository) GetReview(ctx context.Context, userID string, exerciseID string) (*domain.UserSRSReview, error) {
	query := `
		SELECT id, user_id, exercise_id, repetitions, interval_days, ease_factor, due_date, last_reviewed_at
		FROM user_srs_reviews
		WHERE user_id = $1 AND exercise_id = $2
	`
	var rev domain.UserSRSReview
	err := r.db.Pool.QueryRow(ctx, query, userID, exerciseID).Scan(
		&rev.ID, &rev.UserID, &rev.ExerciseID, &rev.Repetitions, &rev.IntervalDays, &rev.EaseFactor, &rev.DueDate, &rev.LastReviewedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrReviewNotFound
		}
		return nil, fmt.Errorf("failed to query srs review: %w", err)
	}
	return &rev, nil
}

// UpsertReview records or updates an SM-2 scheduling record atomically
func (r *ExerciseRepository) UpsertReview(ctx context.Context, review *domain.UserSRSReview) error {
	query := `
		INSERT INTO user_srs_reviews (
			user_id, exercise_id, repetitions, interval_days, ease_factor, due_date, last_reviewed_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (user_id, exercise_id)
		DO UPDATE SET
			repetitions = EXCLUDED.repetitions,
			interval_days = EXCLUDED.interval_days,
			ease_factor = EXCLUDED.ease_factor,
			due_date = EXCLUDED.due_date,
			last_reviewed_at = EXCLUDED.last_reviewed_at
		RETURNING id
	`
	err := r.db.Pool.QueryRow(
		ctx, query,
		review.UserID, review.ExerciseID, review.Repetitions, review.IntervalDays, review.EaseFactor, review.DueDate, review.LastReviewedAt,
	).Scan(&review.ID)
	if err != nil {
		return fmt.Errorf("failed to upsert srs review: %w", err)
	}
	return nil
}

// GetDueCount counts all pending spaced repetition cards due on or before now
func (r *ExerciseRepository) GetDueCount(ctx context.Context, userID string, now time.Time) (int, error) {
	query := `
		SELECT COUNT(*)
		FROM user_srs_reviews
		WHERE user_id = $1 AND due_date <= $2::date
	`
	var count int
	err := r.db.Pool.QueryRow(ctx, query, userID, now).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("failed to query srs due count: %w", err)
	}
	return count, nil
}

// ----------------------------------------------------------------------------
// READINESS EXAM REPOSITORY METHODS
// ----------------------------------------------------------------------------

// CreateExamAttempt records a completed diagnostic mock exam submission
func (r *ExerciseRepository) CreateExamAttempt(ctx context.Context, attempt *domain.ReadinessExamAttempt) error {
	answersJSON, err := json.Marshal(attempt.AnswersPayload)
	if err != nil {
		return fmt.Errorf("failed to marshal answers payload: %w", err)
	}

	query := `
		INSERT INTO readiness_exam_attempts (
			user_id, level_id, total_score, max_score, score_percent, is_passed, answers_payload, completed_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
	`
	if attempt.CompletedAt.IsZero() {
		attempt.CompletedAt = time.Now().UTC()
	}

	err = r.db.Pool.QueryRow(
		ctx, query,
		attempt.UserID, attempt.LevelID, attempt.TotalScore, attempt.MaxScore, attempt.ScorePercent, attempt.IsPassed, answersJSON, attempt.CompletedAt,
	).Scan(&attempt.ID)
	if err != nil {
		return fmt.Errorf("failed to insert readiness exam attempt: %w", err)
	}
	return nil
}

// GetExamAttemptsByUserID retrieves previous mock exam results for a user
func (r *ExerciseRepository) GetExamAttemptsByUserID(ctx context.Context, userID string, levelID string) ([]domain.ReadinessExamAttempt, error) {
	query := `
		SELECT 
			a.id, a.user_id, a.level_id, a.total_score, a.max_score, a.score_percent, a.is_passed, a.answers_payload, a.completed_at,
			pl.id, pl.language_id, pl.code, pl.name, pl.tier, pl.official_exam_name, pl.passing_score_percent, pl.order_index, pl.created_at
		FROM readiness_exam_attempts a
		JOIN proficiency_levels pl ON a.level_id = pl.id
		WHERE a.user_id = $1 AND ($2 = '' OR a.level_id = $2::uuid)
		ORDER BY a.completed_at DESC
	`
	rows, err := r.db.Pool.Query(ctx, query, userID, levelID)
	if err != nil {
		return nil, fmt.Errorf("failed to query readiness exam attempts: %w", err)
	}
	defer rows.Close()

	var attempts []domain.ReadinessExamAttempt
	for rows.Next() {
		var a domain.ReadinessExamAttempt
		var pl domain.ProficiencyLevel
		var answersJSON []byte

		if err := rows.Scan(
			&a.ID, &a.UserID, &a.LevelID, &a.TotalScore, &a.MaxScore, &a.ScorePercent, &a.IsPassed, &answersJSON, &a.CompletedAt,
			&pl.ID, &pl.LanguageID, &pl.Code, &pl.Name, &pl.Tier, &pl.OfficialExamName, &pl.PassingScorePercent, &pl.OrderIndex, &pl.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan readiness exam attempt row: %w", err)
		}
		if len(answersJSON) > 0 {
			_ = json.Unmarshal(answersJSON, &a.AnswersPayload)
		}
		a.Level = &pl
		attempts = append(attempts, a)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in readiness exam attempts: %w", err)
	}
	return attempts, nil
}

// GetLatestPassedAttempt retrieves the most recent passed exam for certificate rendering
func (r *ExerciseRepository) GetLatestPassedAttempt(ctx context.Context, userID string, levelID string) (*domain.ReadinessExamAttempt, error) {
	query := `
		SELECT 
			a.id, a.user_id, a.level_id, a.total_score, a.max_score, a.score_percent, a.is_passed, a.answers_payload, a.completed_at,
			pl.id, pl.language_id, pl.code, pl.name, pl.tier, pl.official_exam_name, pl.passing_score_percent, pl.order_index, pl.created_at
		FROM readiness_exam_attempts a
		JOIN proficiency_levels pl ON a.level_id = pl.id
		WHERE a.user_id = $1 AND a.level_id = $2::uuid AND a.is_passed = true
		ORDER BY a.completed_at DESC
		LIMIT 1
	`
	var a domain.ReadinessExamAttempt
	var pl domain.ProficiencyLevel
	var answersJSON []byte

	err := r.db.Pool.QueryRow(ctx, query, userID, levelID).Scan(
		&a.ID, &a.UserID, &a.LevelID, &a.TotalScore, &a.MaxScore, &a.ScorePercent, &a.IsPassed, &answersJSON, &a.CompletedAt,
		&pl.ID, &pl.LanguageID, &pl.Code, &pl.Name, &pl.Tier, &pl.OfficialExamName, &pl.PassingScorePercent, &pl.OrderIndex, &pl.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to query latest passed exam attempt: %w", err)
	}
	if len(answersJSON) > 0 {
		_ = json.Unmarshal(answersJSON, &a.AnswersPayload)
	}
	a.Level = &pl
	return &a, nil
}
