package exercise

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"codeabroad/backend/infrastructure/postgres"
	"codeabroad/backend/internal/app/language"
	"github.com/jackc/pgx/v5"
)

// PostgresRepository implements Repository, SRSRepository, and ReadinessExamRepository
type PostgresRepository struct {
	db *postgres.PostgresDB
}

// NewRepository creates a new PostgreSQL exercise repository instance
func NewRepository(db *postgres.PostgresDB) Repository {
	return &PostgresRepository{db: db}
}

// NewSRSRepository creates a new PostgreSQL spaced repetition repository instance
func NewSRSRepository(db *postgres.PostgresDB) SRSRepository {
	return &PostgresRepository{db: db}
}

// NewReadinessExamRepository creates a new PostgreSQL readiness exam repository instance
func NewReadinessExamRepository(db *postgres.PostgresDB) ReadinessExamRepository {
	return &PostgresRepository{db: db}
}

func scanExerciseRow(scanner interface{ Scan(dest ...any) error }) (*Exercise, error) {
	var ex Exercise
	var contentJSON, correctJSON, acceptableJSON, diagnosticJSON []byte

	if err := scanner.Scan(
		&ex.ID, &ex.LessonID, &ex.GrammarPointID, &ex.SkillPillar, &ex.ExerciseType, &ex.Prompt,
		&contentJSON, &correctJSON, &acceptableJSON, &diagnosticJSON, &ex.Explanation, &ex.OrderIndex, &ex.CreatedAt,
	); err != nil {
		return nil, err
	}

	ex.Type = ex.ExerciseType
	ex.QuestionText = ex.Prompt
	ex.XPReward = 10

	if len(contentJSON) > 0 {
		_ = json.Unmarshal(contentJSON, &ex.Content)
		if rawOpts, ok := ex.Content["options"].([]any); ok {
			for _, o := range rawOpts {
				if s, ok := o.(string); ok {
					ex.Options = append(ex.Options, s)
				}
			}
		}
		if rawHint, ok := ex.Content["hint"].(string); ok && rawHint != "" {
			ex.Hint = &rawHint
		}
		if rawMedia, ok := ex.Content["audio_url"].(string); ok && rawMedia != "" {
			ex.MediaURL = &rawMedia
		} else if rawMedia, ok := ex.Content["media_url"].(string); ok && rawMedia != "" {
			ex.MediaURL = &rawMedia
		}
		if xpVal, ok := ex.Content["xp_reward"].(float64); ok && xpVal > 0 {
			ex.XPReward = int(xpVal)
		}
	}
	if ex.Options == nil {
		ex.Options = []string{}
	}

	if len(correctJSON) > 0 {
		var strAnswer string
		if err := json.Unmarshal(correctJSON, &strAnswer); err == nil && strAnswer != "" {
			ex.CorrectAnswer = strAnswer
		} else {
			var mapAnswer map[string]any
			if err := json.Unmarshal(correctJSON, &mapAnswer); err == nil {
				if sel, ok := mapAnswer["selected"].(string); ok {
					ex.CorrectAnswer = sel
				} else if ans, ok := mapAnswer["answer"].(string); ok {
					ex.CorrectAnswer = ans
				} else if correct, ok := mapAnswer["correct"].(string); ok {
					ex.CorrectAnswer = correct
				} else {
					ex.CorrectAnswer = string(correctJSON)
				}
			} else {
				ex.CorrectAnswer = string(correctJSON)
			}
		}
	}

	if len(acceptableJSON) > 0 {
		_ = json.Unmarshal(acceptableJSON, &ex.AcceptableAnswers)
	}
	if ex.AcceptableAnswers == nil {
		ex.AcceptableAnswers = []string{}
	}

	if len(diagnosticJSON) > 0 {
		_ = json.Unmarshal(diagnosticJSON, &ex.DiagnosticRubric)
	}
	if ex.DiagnosticRubric == nil {
		ex.DiagnosticRubric = make(map[string]any)
	}

	return &ex, nil
}

// GetExercisesByLessonID retrieves all exercises belonging to a specific lesson node
func (r *PostgresRepository) GetExercisesByLessonID(ctx context.Context, lessonID string) ([]Exercise, error) {
	query := `
		SELECT 
			id, lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
			content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index, created_at
		FROM exercises
		WHERE lesson_id = $1
		ORDER BY order_index ASC, id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, lessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to query exercises by lesson id: %w", err)
	}
	defer rows.Close()

	exercises := make([]Exercise, 0, 10)
	for rows.Next() {
		ex, err := scanExerciseRow(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan exercise row: %w", err)
		}
		exercises = append(exercises, *ex)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in exercises: %w", err)
	}
	return exercises, nil
}

// GetExerciseByID retrieves a single exercise by UUID
func (r *PostgresRepository) GetExerciseByID(ctx context.Context, id string) (*Exercise, error) {
	query := `
		SELECT 
			id, lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
			content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index, created_at
		FROM exercises
		WHERE id = $1
	`
	ex, err := scanExerciseRow(r.db.Pool.QueryRow(ctx, query, id))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrExerciseNotFound
		}
		return nil, fmt.Errorf("failed to query exercise by id: %w", err)
	}
	return ex, nil
}

// GetPlacementExercises retrieves diagnostic placement test exercises for a destination language
func (r *PostgresRepository) GetPlacementExercises(ctx context.Context, languageID string, limit int) ([]Exercise, error) {
	query := `
		SELECT 
			e.id, e.lesson_id, e.grammar_point_id, e.skill_pillar, e.exercise_type, e.prompt,
			e.content, e.correct_answer, e.acceptable_answers, e.diagnostic_rubric, e.explanation, e.order_index, e.created_at
		FROM exercises e
		JOIN lessons l ON e.lesson_id = l.id
		JOIN units u ON l.unit_id = u.id
		JOIN proficiency_levels pl ON u.level_id = pl.id
		WHERE pl.language_id = $1::uuid
		ORDER BY pl.order_index ASC, u.order_index ASC, l.order_index ASC, e.order_index ASC, e.id ASC
		LIMIT $2
	`
	rows, err := r.db.Pool.Query(ctx, query, languageID, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query placement exercises: %w", err)
	}
	defer rows.Close()

	exercises := make([]Exercise, 0, limit)
	for rows.Next() {
		ex, err := scanExerciseRow(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan placement exercise row: %w", err)
		}
		exercises = append(exercises, *ex)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in placement exercises: %w", err)
	}
	return exercises, nil
}

// GetReadinessExamExercises retrieves all sectional questions for an official mock exam
func (r *PostgresRepository) GetReadinessExamExercises(ctx context.Context, levelID string) ([]Exercise, error) {
	query := `
		SELECT 
			e.id, e.lesson_id, e.grammar_point_id, e.skill_pillar, e.exercise_type, e.prompt,
			e.content, e.correct_answer, e.acceptable_answers, e.diagnostic_rubric, e.explanation, e.order_index, e.created_at
		FROM exercises e
		JOIN lessons l ON e.lesson_id = l.id
		JOIN units u ON l.unit_id = u.id
		WHERE u.level_id = $1::uuid
		  AND u.unit_type = 'diagnostic_exam'
		ORDER BY e.skill_pillar ASC, e.order_index ASC, e.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, levelID)
	if err != nil {
		return nil, fmt.Errorf("failed to query readiness exam exercises: %w", err)
	}
	defer rows.Close()

	exercises := make([]Exercise, 0, 20)
	for rows.Next() {
		ex, err := scanExerciseRow(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan readiness exam exercise row: %w", err)
		}
		exercises = append(exercises, *ex)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in readiness exam exercises: %w", err)
	}
	return exercises, nil
}
// CreateAttempt logs telemetry data for an answered exercise
func (r *PostgresRepository) CreateAttempt(ctx context.Context, attempt *UserExerciseAttempt) error {
	selectedPayload := attempt.SelectedAnswer
	if len(selectedPayload) == 0 {
		selectedPayload = map[string]any{"user_answer": attempt.UserAnswer}
	}
	selectedJSON, err := json.Marshal(selectedPayload)
	if err != nil {
		selectedJSON = []byte("{}")
	}

	query := `
		INSERT INTO user_exercise_attempts (user_id, exercise_id, is_correct, selected_answer, time_spent_seconds, created_at)
		VALUES ($1, $2, $3, $4, $5, NOW())
		RETURNING id, created_at
	`
	err = r.db.Pool.QueryRow(
		ctx, query,
		attempt.UserID, attempt.ExerciseID, attempt.IsCorrect, selectedJSON, attempt.TimeSpentSeconds,
	).Scan(&attempt.ID, &attempt.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to insert exercise attempt: %w", err)
	}
	attempt.SelectedAnswer = selectedPayload
	return nil
}

// GetAttemptsByUserID retrieves the most recent answer attempts for user analytics
func (r *PostgresRepository) GetAttemptsByUserID(ctx context.Context, userID string, limit int) ([]UserExerciseAttempt, error) {
	query := `
		SELECT id, user_id, exercise_id, is_correct, selected_answer, time_spent_seconds, created_at
		FROM user_exercise_attempts
		WHERE user_id = $1
		ORDER BY created_at DESC, id ASC
		LIMIT $2
	`
	rows, err := r.db.Pool.Query(ctx, query, userID, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query attempts by user: %w", err)
	}
	defer rows.Close()

	attempts := make([]UserExerciseAttempt, 0, limit)
	for rows.Next() {
		var a UserExerciseAttempt
		var selectedJSON []byte
		if err := rows.Scan(
			&a.ID, &a.UserID, &a.ExerciseID, &a.IsCorrect, &selectedJSON, &a.TimeSpentSeconds, &a.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan attempt row: %w", err)
		}
		if len(selectedJSON) > 0 {
			_ = json.Unmarshal(selectedJSON, &a.SelectedAnswer)
			if ans, ok := a.SelectedAnswer["user_answer"].(string); ok {
				a.UserAnswer = ans
			} else {
				a.UserAnswer = string(selectedJSON)
			}
		}
		attempts = append(attempts, a)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in user attempts: %w", err)
	}
	return attempts, nil
}

// GetDueReviews retrieves spaced repetition cards due for review as of the specified time
func (r *PostgresRepository) GetDueReviews(ctx context.Context, userID string, now time.Time, limit int) ([]UserSRSReview, error) {
	query := `
		SELECT 
			r.id, r.user_id, r.exercise_id, r.repetition_count, r.interval_days, r.ease_factor, r.next_review_at, r.last_reviewed_at,
			e.id, e.lesson_id, e.grammar_point_id, e.skill_pillar, e.exercise_type, e.prompt,
			e.content, e.correct_answer, e.acceptable_answers, e.diagnostic_rubric, e.explanation, e.order_index, e.created_at
		FROM user_srs_reviews r
		JOIN exercises e ON r.exercise_id = e.id
		WHERE r.user_id = $1 AND r.next_review_at <= $2
		ORDER BY r.next_review_at ASC, r.repetition_count ASC, r.id ASC
		LIMIT $3
	`
	rows, err := r.db.Pool.Query(ctx, query, userID, now, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query due srs reviews: %w", err)
	}
	defer rows.Close()

	reviews := make([]UserSRSReview, 0, limit)
	for rows.Next() {
		var rev UserSRSReview
		var ex Exercise
		var contentJSON, correctJSON, acceptableJSON, diagnosticJSON []byte

		if err := rows.Scan(
			&rev.ID, &rev.UserID, &rev.ExerciseID, &rev.RepetitionCount, &rev.IntervalDays, &rev.EaseFactor, &rev.NextReviewAt, &rev.LastReviewedAt,
			&ex.ID, &ex.LessonID, &ex.GrammarPointID, &ex.SkillPillar, &ex.ExerciseType, &ex.Prompt,
			&contentJSON, &correctJSON, &acceptableJSON, &diagnosticJSON, &ex.Explanation, &ex.OrderIndex, &ex.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan srs review row: %w", err)
		}
		ex.Type = ex.ExerciseType
		ex.QuestionText = ex.Prompt
		ex.XPReward = 10

		if len(contentJSON) > 0 {
			_ = json.Unmarshal(contentJSON, &ex.Content)
			if rawOpts, ok := ex.Content["options"].([]any); ok {
				for _, o := range rawOpts {
					if s, ok := o.(string); ok {
						ex.Options = append(ex.Options, s)
					}
				}
			}
		}
		if ex.Options == nil {
			ex.Options = []string{}
		}
		if len(correctJSON) > 0 {
			var strAnswer string
			if err := json.Unmarshal(correctJSON, &strAnswer); err == nil && strAnswer != "" {
				ex.CorrectAnswer = strAnswer
			} else {
				var mapAnswer map[string]any
				if err := json.Unmarshal(correctJSON, &mapAnswer); err == nil {
					if sel, ok := mapAnswer["selected"].(string); ok {
						ex.CorrectAnswer = sel
					} else {
						ex.CorrectAnswer = string(correctJSON)
					}
				} else {
					ex.CorrectAnswer = string(correctJSON)
				}
			}
		}
		if len(acceptableJSON) > 0 {
			_ = json.Unmarshal(acceptableJSON, &ex.AcceptableAnswers)
		}
		if ex.AcceptableAnswers == nil {
			ex.AcceptableAnswers = []string{}
		}
		if len(diagnosticJSON) > 0 {
			_ = json.Unmarshal(diagnosticJSON, &ex.DiagnosticRubric)
		}
		if ex.DiagnosticRubric == nil {
			ex.DiagnosticRubric = make(map[string]any)
		}

		rev.Repetitions = rev.RepetitionCount
		rev.DueDate = rev.NextReviewAt
		rev.Exercise = &ex
		reviews = append(reviews, rev)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in due srs reviews: %w", err)
	}
	return reviews, nil
}

// GetReview retrieves a single SRS card for a user and exercise
func (r *PostgresRepository) GetReview(ctx context.Context, userID string, exerciseID string) (*UserSRSReview, error) {
	query := `
		SELECT id, user_id, exercise_id, repetition_count, interval_days, ease_factor, next_review_at, last_reviewed_at
		FROM user_srs_reviews
		WHERE user_id = $1 AND exercise_id = $2
	`
	var rev UserSRSReview
	err := r.db.Pool.QueryRow(ctx, query, userID, exerciseID).Scan(
		&rev.ID, &rev.UserID, &rev.ExerciseID, &rev.RepetitionCount, &rev.IntervalDays, &rev.EaseFactor, &rev.NextReviewAt, &rev.LastReviewedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrReviewNotFound
		}
		return nil, fmt.Errorf("failed to query srs review: %w", err)
	}
	rev.Repetitions = rev.RepetitionCount
	rev.DueDate = rev.NextReviewAt
	return &rev, nil
}

// UpsertReview records or updates an SM-2 scheduling record atomically
func (r *PostgresRepository) UpsertReview(ctx context.Context, review *UserSRSReview) error {
	reps := review.RepetitionCount
	if reps == 0 && review.Repetitions > 0 {
		reps = review.Repetitions
	}
	nextReview := review.NextReviewAt
	if nextReview.IsZero() && !review.DueDate.IsZero() {
		nextReview = review.DueDate
	}
	if nextReview.IsZero() {
		nextReview = time.Now().UTC().AddDate(0, 0, 1)
	}
	if review.IntervalDays < 1 {
		review.IntervalDays = 1
	}
	if review.EaseFactor < 1.30 {
		review.EaseFactor = 2.50
	}

	query := `
		INSERT INTO user_srs_reviews (
			user_id, exercise_id, repetition_count, interval_days, ease_factor, next_review_at, last_reviewed_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (user_id, exercise_id)
		DO UPDATE SET
			repetition_count = EXCLUDED.repetition_count,
			interval_days = EXCLUDED.interval_days,
			ease_factor = EXCLUDED.ease_factor,
			next_review_at = EXCLUDED.next_review_at,
			last_reviewed_at = EXCLUDED.last_reviewed_at
		RETURNING id, repetition_count, next_review_at
	`
	err := r.db.Pool.QueryRow(
		ctx, query,
		review.UserID, review.ExerciseID, reps, review.IntervalDays, review.EaseFactor, nextReview, review.LastReviewedAt,
	).Scan(&review.ID, &review.RepetitionCount, &review.NextReviewAt)
	if err != nil {
		return fmt.Errorf("failed to upsert srs review: %w", err)
	}
	review.Repetitions = review.RepetitionCount
	review.DueDate = review.NextReviewAt
	return nil
}

// GetDueCount counts all pending spaced repetition cards due on or before now
func (r *PostgresRepository) GetDueCount(ctx context.Context, userID string, now time.Time) (int, error) {
	query := `
		SELECT COUNT(*)
		FROM user_srs_reviews
		WHERE user_id = $1 AND next_review_at <= $2
	`
	var count int
	err := r.db.Pool.QueryRow(ctx, query, userID, now).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("failed to query srs due count: %w", err)
	}
	return count, nil
}

// CreateExamAttempt records a completed diagnostic mock exam submission
func (r *PostgresRepository) CreateExamAttempt(ctx context.Context, attempt *ReadinessExamAttempt) error {
	report := attempt.AnalysisReport
	if len(report) == 0 && len(attempt.AnswersPayload) > 0 {
		report = attempt.AnswersPayload
	}
	if report == nil {
		report = make(map[string]any)
	}
	reportJSON, err := json.Marshal(report)
	if err != nil {
		reportJSON = []byte("{}")
	}

	overall := attempt.OverallScore
	if overall == 0 && attempt.ScorePercent > 0 {
		overall = attempt.ScorePercent
	}
	if attempt.AttemptedAt.IsZero() {
		if !attempt.CompletedAt.IsZero() {
			attempt.AttemptedAt = attempt.CompletedAt
		} else {
			attempt.AttemptedAt = time.Now().UTC()
		}
	}

	query := `
		INSERT INTO readiness_exam_attempts (
			user_id, level_id, reading_score, listening_score, writing_score, speaking_score, overall_score, is_passed, analysis_report, attempted_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id
	`
	err = r.db.Pool.QueryRow(
		ctx, query,
		attempt.UserID, attempt.LevelID,
		attempt.ReadingScore, attempt.ListeningScore, attempt.WritingScore, attempt.SpeakingScore,
		overall, attempt.IsPassed, reportJSON, attempt.AttemptedAt,
	).Scan(&attempt.ID)
	if err != nil {
		return fmt.Errorf("failed to insert readiness exam attempt: %w", err)
	}
	attempt.OverallScore = overall
	attempt.TotalScore = overall
	attempt.ScorePercent = overall
	attempt.CompletedAt = attempt.AttemptedAt
	attempt.AnalysisReport = report
	return nil
}

// GetExamAttemptsByUserID retrieves previous mock exam results for a user
func (r *PostgresRepository) GetExamAttemptsByUserID(ctx context.Context, userID string, levelID string) ([]ReadinessExamAttempt, error) {
	var query string
	var rows pgx.Rows
	var err error

	if levelID != "" {
		query = `
			SELECT 
				a.id, a.user_id, a.level_id, a.reading_score, a.listening_score, a.writing_score, a.speaking_score, a.overall_score,
				a.is_passed, a.analysis_report, a.attempted_at,
				pl.id, pl.language_id, pl.code, pl.name, pl.tier, pl.official_exam_name, pl.passing_score_percent, pl.order_index, pl.created_at
			FROM readiness_exam_attempts a
			JOIN proficiency_levels pl ON a.level_id = pl.id
			WHERE a.user_id = $1 AND a.level_id = $2::uuid
			ORDER BY a.attempted_at DESC, a.id ASC
		`
		rows, err = r.db.Pool.Query(ctx, query, userID, levelID)
	} else {
		query = `
			SELECT 
				a.id, a.user_id, a.level_id, a.reading_score, a.listening_score, a.writing_score, a.speaking_score, a.overall_score,
				a.is_passed, a.analysis_report, a.attempted_at,
				pl.id, pl.language_id, pl.code, pl.name, pl.tier, pl.official_exam_name, pl.passing_score_percent, pl.order_index, pl.created_at
			FROM readiness_exam_attempts a
			JOIN proficiency_levels pl ON a.level_id = pl.id
			WHERE a.user_id = $1
			ORDER BY a.attempted_at DESC, a.id ASC
		`
		rows, err = r.db.Pool.Query(ctx, query, userID)
	}
	if err != nil {
		return nil, fmt.Errorf("failed to query readiness exam attempts: %w", err)
	}
	defer rows.Close()

	attempts := make([]ReadinessExamAttempt, 0, 8)
	for rows.Next() {
		var a ReadinessExamAttempt
		var pl language.ProficiencyLevel
		var reportJSON []byte

		if err := rows.Scan(
			&a.ID, &a.UserID, &a.LevelID,
			&a.ReadingScore, &a.ListeningScore, &a.WritingScore, &a.SpeakingScore, &a.OverallScore,
			&a.IsPassed, &reportJSON, &a.AttemptedAt,
			&pl.ID, &pl.LanguageID, &pl.Code, &pl.Name, &pl.Tier, &pl.OfficialExamName, &pl.PassingScorePercent, &pl.OrderIndex, &pl.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan readiness exam attempt row: %w", err)
		}
		if len(reportJSON) > 0 {
			_ = json.Unmarshal(reportJSON, &a.AnalysisReport)
		}
		a.TotalScore = a.OverallScore
		a.ScorePercent = a.OverallScore
		a.CompletedAt = a.AttemptedAt
		a.AnswersPayload = a.AnalysisReport
		a.Level = &pl
		attempts = append(attempts, a)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in readiness exam attempts: %w", err)
	}
	return attempts, nil
}

// GetLatestPassedAttempt retrieves the most recent passed exam for certificate rendering
func (r *PostgresRepository) GetLatestPassedAttempt(ctx context.Context, userID string, levelID string) (*ReadinessExamAttempt, error) {
	query := `
		SELECT 
			a.id, a.user_id, a.level_id, a.reading_score, a.listening_score, a.writing_score, a.speaking_score, a.overall_score,
			a.is_passed, a.analysis_report, a.attempted_at,
			pl.id, pl.language_id, pl.code, pl.name, pl.tier, pl.official_exam_name, pl.passing_score_percent, pl.order_index, pl.created_at
		FROM readiness_exam_attempts a
		JOIN proficiency_levels pl ON a.level_id = pl.id
		WHERE a.user_id = $1 AND a.level_id = $2::uuid AND a.is_passed = true
		ORDER BY a.attempted_at DESC, a.id ASC
		LIMIT 1
	`
	var a ReadinessExamAttempt
	var pl language.ProficiencyLevel
	var reportJSON []byte

	err := r.db.Pool.QueryRow(ctx, query, userID, levelID).Scan(
		&a.ID, &a.UserID, &a.LevelID,
		&a.ReadingScore, &a.ListeningScore, &a.WritingScore, &a.SpeakingScore, &a.OverallScore,
		&a.IsPassed, &reportJSON, &a.AttemptedAt,
		&pl.ID, &pl.LanguageID, &pl.Code, &pl.Name, &pl.Tier, &pl.OfficialExamName, &pl.PassingScorePercent, &pl.OrderIndex, &pl.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to query latest passed exam attempt: %w", err)
	}
	if len(reportJSON) > 0 {
		_ = json.Unmarshal(reportJSON, &a.AnalysisReport)
	}
	a.TotalScore = a.OverallScore
	a.ScorePercent = a.OverallScore
	a.CompletedAt = a.AttemptedAt
	a.AnswersPayload = a.AnalysisReport
	a.Level = &pl
	return &a, nil
}

