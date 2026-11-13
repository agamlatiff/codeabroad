package curriculum

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"codeabroad/backend/infrastructure/postgres"
	"codeabroad/backend/internal/app/user"
	"github.com/jackc/pgx/v5"
)

// PostgresRepository implements curriculum.Repository using PostgreSQL
type PostgresRepository struct {
	db *postgres.PostgresDB
}

// NewRepository creates a new PostgreSQL curriculum repository instance
func NewRepository(db *postgres.PostgresDB) Repository {
	return &PostgresRepository{db: db}
}

// GetGrammarPointsByLevelID retrieves all normalized grammar points for a proficiency level
func (r *PostgresRepository) GetGrammarPointsByLevelID(ctx context.Context, levelID string) ([]GrammarPoint, error) {
	query := `
		SELECT id, level_id, code, category, title, formula, explanation, order_index, created_at
		FROM grammar_points
		WHERE level_id = $1::uuid
		ORDER BY order_index ASC, id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, levelID)
	if err != nil {
		return nil, fmt.Errorf("failed to query grammar points: %w", err)
	}
	defer rows.Close()

	points := make([]GrammarPoint, 0, 16)
	for rows.Next() {
		var gp GrammarPoint
		if err := rows.Scan(
			&gp.ID, &gp.LevelID, &gp.Code, &gp.Category, &gp.Title,
			&gp.Formula, &gp.Explanation, &gp.OrderIndex, &gp.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan grammar point: %w", err)
		}
		points = append(points, gp)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in grammar points: %w", err)
	}
	return points, nil
}

// GetGrammarPointByID retrieves a single grammar point by UUID
func (r *PostgresRepository) GetGrammarPointByID(ctx context.Context, id string) (*GrammarPoint, error) {
	query := `
		SELECT id, level_id, code, category, title, formula, explanation, order_index, created_at
		FROM grammar_points
		WHERE id = $1::uuid
	`
	var gp GrammarPoint
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&gp.ID, &gp.LevelID, &gp.Code, &gp.Category, &gp.Title,
		&gp.Formula, &gp.Explanation, &gp.OrderIndex, &gp.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrGrammarPointNotFound
		}
		return nil, fmt.Errorf("failed to query grammar point by id: %w", err)
	}
	return &gp, nil
}

// GetGrammarPointsByLessonID retrieves distinct grammar points referenced by exercises within a lesson node
func (r *PostgresRepository) GetGrammarPointsByLessonID(ctx context.Context, lessonID string) ([]GrammarPoint, error) {
	query := `
		SELECT DISTINCT gp.id, gp.level_id, gp.code, gp.category, gp.title, gp.formula, gp.explanation, gp.order_index, gp.created_at
		FROM grammar_points gp
		JOIN exercises e ON gp.id = e.grammar_point_id
		WHERE e.lesson_id = $1::uuid
		ORDER BY gp.order_index ASC, gp.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, lessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to query grammar points for lesson: %w", err)
	}
	defer rows.Close()

	points := make([]GrammarPoint, 0, 8)
	for rows.Next() {
		var gp GrammarPoint
		if err := rows.Scan(
			&gp.ID, &gp.LevelID, &gp.Code, &gp.Category, &gp.Title,
			&gp.Formula, &gp.Explanation, &gp.OrderIndex, &gp.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan lesson grammar point: %w", err)
		}
		points = append(points, gp)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in lesson grammar points: %w", err)
	}
	return points, nil
}

// GetUnitsByLevelID retrieves all curriculum chapters for a proficiency level
func (r *PostgresRepository) GetUnitsByLevelID(ctx context.Context, levelID string, _ string) ([]UnitNodeResponse, error) {
	query := `
		SELECT 
			u.id, u.level_id, u.title, u.description, u.unit_type, u.order_index, u.created_at
		FROM units u
		WHERE u.level_id = $1::uuid
		ORDER BY u.order_index ASC, u.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, levelID)
	if err != nil {
		return nil, fmt.Errorf("failed to query units: %w", err)
	}
	defer rows.Close()

	units := make([]UnitNodeResponse, 0, 8)
	for rows.Next() {
		var u UnitNodeResponse
		if err := rows.Scan(
			&u.ID, &u.LevelID, &u.Title, &u.Description, &u.UnitType,
			&u.OrderIndex, &u.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan unit row: %w", err)
		}
		units = append(units, u)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in units: %w", err)
	}
	return units, nil
}

// GetUnitByID retrieves a single unit by UUID
func (r *PostgresRepository) GetUnitByID(ctx context.Context, id string) (*Unit, error) {
	query := `
		SELECT id, level_id, title, description, unit_type, order_index, created_at
		FROM units
		WHERE id = $1::uuid
	`
	var u Unit
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&u.ID, &u.LevelID, &u.Title, &u.Description, &u.UnitType, &u.OrderIndex, &u.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUnitNotFound
		}
		return nil, fmt.Errorf("failed to query unit by id: %w", err)
	}
	return &u, nil
}

// GetLessonsByLevelID retrieves all lesson nodes across all units in a level with user progression status
func (r *PostgresRepository) GetLessonsByLevelID(ctx context.Context, levelID string, userID string) ([]LessonNodeResponse, error) {
	query := `
		SELECT 
			l.id, l.unit_id, l.title, l.xp_reward, l.order_index,
			COALESCE(ulp.is_completed, false) AS is_completed,
			COALESCE(ulp.score, 0) AS score,
			COALESCE(ulp.is_skipped, false) AS is_skipped,
			ulp.completed_at
		FROM lessons l
		JOIN units u ON l.unit_id = u.id
		LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = $2::uuid
		WHERE u.level_id = $1::uuid
		ORDER BY u.order_index ASC, l.order_index ASC, l.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, levelID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to batch query lessons by level: %w", err)
	}
	defer rows.Close()

	lessons := make([]LessonNodeResponse, 0, 32)
	for rows.Next() {
		var l LessonNodeResponse
		if err := rows.Scan(
			&l.ID, &l.UnitID, &l.Title, &l.XPReward, &l.OrderIndex,
			&l.IsCompleted, &l.Score, &l.IsSkipped, &l.CompletedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan lesson row: %w", err)
		}
		lessons = append(lessons, l)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in batch lessons: %w", err)
	}
	return lessons, nil
}

// GetLessonsByUnitID retrieves all lesson nodes for a unit with user progression status
func (r *PostgresRepository) GetLessonsByUnitID(ctx context.Context, unitID string, userID string) ([]LessonNodeResponse, error) {
	query := `
		SELECT 
			l.id, l.unit_id, l.title, l.xp_reward, l.order_index,
			COALESCE(ulp.is_completed, false) AS is_completed,
			COALESCE(ulp.score, 0) AS score,
			COALESCE(ulp.is_skipped, false) AS is_skipped,
			ulp.completed_at
		FROM lessons l
		LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = $2::uuid
		WHERE l.unit_id = $1::uuid
		ORDER BY l.order_index ASC, l.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, unitID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query lessons by unit: %w", err)
	}
	defer rows.Close()

	lessons := make([]LessonNodeResponse, 0, 16)
	for rows.Next() {
		var l LessonNodeResponse
		if err := rows.Scan(
			&l.ID, &l.UnitID, &l.Title, &l.XPReward, &l.OrderIndex,
			&l.IsCompleted, &l.Score, &l.IsSkipped, &l.CompletedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan lesson row: %w", err)
		}
		lessons = append(lessons, l)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in lessons: %w", err)
	}
	return lessons, nil
}

// GetLessonByID retrieves a single lesson with user progress and child exercises
func (r *PostgresRepository) GetLessonByID(ctx context.Context, id string, userID string) (*LessonDetailResponse, error) {
	lessonQuery := `
		SELECT 
			l.id, l.unit_id, l.title, l.xp_reward, l.order_index, l.created_at,
			COALESCE(ulp.is_completed, false) AS is_completed,
			COALESCE(ulp.score, 0) AS score,
			COALESCE(ulp.is_skipped, false) AS is_skipped,
			ulp.completed_at
		FROM lessons l
		LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = $2::uuid
		WHERE l.id = $1::uuid
	`
	var l LessonDetailResponse
	err := r.db.Pool.QueryRow(ctx, lessonQuery, id, userID).Scan(
		&l.ID, &l.UnitID, &l.Title, &l.XPReward, &l.OrderIndex, &l.CreatedAt,
		&l.IsCompleted, &l.Score, &l.IsSkipped, &l.CompletedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrLessonNotFound
		}
		return nil, fmt.Errorf("failed to query lesson by id: %w", err)
	}

	return &l, nil
}

// GetNextLessonID finds the next sequential lesson ID in the current unit or next unit
func (r *PostgresRepository) GetNextLessonID(ctx context.Context, currentLessonID string) (*string, error) {
	query := `
		WITH current_target AS (
			SELECT u.level_id, u.order_index AS unit_order, l.order_index AS lesson_order
			FROM lessons l
			JOIN units u ON l.unit_id = u.id
			WHERE l.id = $1::uuid
		)
		SELECT next_l.id
		FROM current_target ct
		JOIN units next_u ON next_u.level_id = ct.level_id
		JOIN lessons next_l ON next_l.unit_id = next_u.id
		WHERE (
			(next_u.order_index = ct.unit_order AND next_l.order_index > ct.lesson_order)
			OR (next_u.order_index > ct.unit_order)
		)
		ORDER BY next_u.order_index ASC, next_l.order_index ASC, next_l.id ASC
		LIMIT 1
	`
	var nextID string
	err := r.db.Pool.QueryRow(ctx, query, currentLessonID).Scan(&nextID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to query next lesson id: %w", err)
	}
	return &nextID, nil
}

// IsLessonUnlocked verifies whether a learner has sequentially unlocked a target lesson node
// and enforces that the lesson belongs to a proficiency level <= the user's enrolled level in that language.
func (r *PostgresRepository) IsLessonUnlocked(ctx context.Context, userID string, lessonID string) (bool, error) {
	query := `
		WITH current_target AS (
			SELECT l.id, u.level_id, pl.language_id, pl.order_index AS level_order, u.order_index AS unit_order, l.order_index AS lesson_order
			FROM lessons l
			JOIN units u ON l.unit_id = u.id
			JOIN proficiency_levels pl ON u.level_id = pl.id
			WHERE l.id = $1::uuid
		)
		SELECT 
			CASE 
				WHEN NOT EXISTS (SELECT 1 FROM current_target) THEN false
				WHEN NOT EXISTS (
					SELECT 1
					FROM current_target ct
					JOIN user_language_enrollments ule ON ule.user_id = $2::uuid AND ule.language_id = ct.language_id AND ule.is_active = true
					JOIN proficiency_levels user_pl ON ule.current_level_id = user_pl.id
					WHERE ct.level_order <= user_pl.order_index
				) THEN false
				ELSE NOT EXISTS (
					SELECT 1
					FROM current_target ct
					JOIN units prev_u ON prev_u.level_id = ct.level_id
					JOIN lessons prev_l ON prev_l.unit_id = prev_u.id
					LEFT JOIN user_lesson_progress ulp ON prev_l.id = ulp.lesson_id AND ulp.user_id = $2::uuid
					WHERE (
						prev_u.order_index < ct.unit_order
						OR (prev_u.order_index = ct.unit_order AND prev_l.order_index < ct.lesson_order)
					)
					AND (ulp.is_completed IS NULL OR ulp.is_completed = false)
				)
			END AS is_unlocked
	`
	var isUnlocked bool
	err := r.db.Pool.QueryRow(ctx, query, lessonID, userID).Scan(&isUnlocked)
	if err != nil {
		return false, fmt.Errorf("failed to verify lesson unlock invariant: %w", err)
	}
	return isUnlocked, nil
}

// GetUserLessonProgress retrieves a user's completion status on a lesson
func (r *PostgresRepository) GetUserLessonProgress(ctx context.Context, userID string, lessonID string) (*UserLessonProgress, error) {
	query := `
		SELECT id, user_id, lesson_id, is_completed, score, is_skipped, completed_at
		FROM user_lesson_progress
		WHERE user_id = $1::uuid AND lesson_id = $2::uuid
	`
	var p UserLessonProgress
	err := r.db.Pool.QueryRow(ctx, query, userID, lessonID).Scan(
		&p.ID, &p.UserID, &p.LessonID, &p.IsCompleted, &p.Score, &p.IsSkipped, &p.CompletedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to query user lesson progress: %w", err)
	}
	return &p, nil
}

// UpsertLessonProgress records or updates lesson completion atomically
func (r *PostgresRepository) UpsertLessonProgress(ctx context.Context, progress *UserLessonProgress) error {
	query := `
		INSERT INTO user_lesson_progress (user_id, lesson_id, is_completed, score, is_skipped, completed_at)
		VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6)
		ON CONFLICT (user_id, lesson_id)
		DO UPDATE SET
			is_completed = EXCLUDED.is_completed,
			score = GREATEST(user_lesson_progress.score, EXCLUDED.score),
			is_skipped = EXCLUDED.is_skipped,
			completed_at = CASE
				WHEN user_lesson_progress.is_completed THEN user_lesson_progress.completed_at
				ELSE EXCLUDED.completed_at
			END
		RETURNING id, score, is_completed, is_skipped, completed_at
	`
	if progress.CompletedAt.IsZero() {
		progress.CompletedAt = time.Now().UTC()
	}

	err := r.db.Pool.QueryRow(
		ctx, query,
		progress.UserID, progress.LessonID, progress.IsCompleted, progress.Score, progress.IsSkipped, progress.CompletedAt,
	).Scan(&progress.ID, &progress.Score, &progress.IsCompleted, &progress.IsSkipped, &progress.CompletedAt)
	if err != nil {
		return fmt.Errorf("failed to upsert user lesson progress: %w", err)
	}
	return nil
}

// SkipPrecedingLessons marks all prior lessons up to a target proficiency level as completed and skipped
func (r *PostgresRepository) SkipPrecedingLessons(ctx context.Context, userID string, upToLevelOrder int, languageID string) error {
	query := `
		INSERT INTO user_lesson_progress (user_id, lesson_id, is_completed, score, is_skipped, completed_at)
		SELECT $1::uuid, l.id, true, 100, true, NOW()
		FROM lessons l
		JOIN units u ON l.unit_id = u.id
		JOIN proficiency_levels pl ON u.level_id = pl.id
		WHERE pl.language_id = $2::uuid AND pl.order_index < $3
		ON CONFLICT (user_id, lesson_id)
		DO UPDATE SET
			is_completed = true,
			is_skipped = true,
			score = GREATEST(user_lesson_progress.score, 100),
			completed_at = NOW()
	`
	_, err := r.db.Pool.Exec(ctx, query, userID, languageID, upToLevelOrder)
	if err != nil {
		return fmt.Errorf("failed to skip preceding lessons: %w", err)
	}
	return nil
}

const dailyReplayXPCap = 50

// RecordLessonCompletionTx executes an atomic database transaction recording lesson completion,
// serializing per-user updates via FOR UPDATE to prevent TOCTOU replay/XP inflation races,
// enforcing the daily practice XP cap, updating user progression/streak in user_gamification,
// and appending an activity telemetry record.
func (r *PostgresRepository) RecordLessonCompletionTx(ctx context.Context, payload *LessonCompletionPayload) error {
	if payload == nil || payload.Progress == nil {
		return errors.New("nil lesson completion payload")
	}

	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin lesson completion tx: %w", err)
	}
	defer tx.Rollback(ctx)

	if payload.LastActiveAt.IsZero() {
		payload.LastActiveAt = time.Now().UTC()
	}

	// 1. Acquire row-level FOR UPDATE lock on user_gamification first to serialize concurrent completions per user
	var lockedXP, lockedStreak, lockedGems int
	var lockedLastActiveAt *time.Time
	lockGamificationQuery := `
		SELECT xp, streak, last_active_at, gems
		FROM user_gamification
		WHERE user_id = $1::uuid
		FOR UPDATE
	`
	err = tx.QueryRow(ctx, lockGamificationQuery, payload.Progress.UserID).Scan(&lockedXP, &lockedStreak, &lockedLastActiveAt, &lockedGems)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return user.ErrUserNotFound
		}
		return fmt.Errorf("failed to lock user gamification in tx: %w", err)
	}
	payload.PreviousStreak = lockedStreak

	// 2. Check existing completion status inside the serialized transaction to prevent TOCTOU double-XP
	var wasCompleted bool
	lockProgressQuery := `
		SELECT is_completed
		FROM user_lesson_progress
		WHERE user_id = $1::uuid AND lesson_id = $2::uuid
		FOR UPDATE
	`
	err = tx.QueryRow(ctx, lockProgressQuery, payload.Progress.UserID, payload.Progress.LessonID).Scan(&wasCompleted)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return fmt.Errorf("failed to check lesson progress in tx: %w", err)
	}
	payload.WasCompleted = (err == nil && wasCompleted)

	if payload.WasCompleted {
		payload.XPEarned = 5
		if payload.Metadata == nil {
			payload.Metadata = make(map[string]any)
		}
		payload.Metadata["is_practice"] = true
		payload.Metadata["is_replay"] = true

		// Enforce daily replay XP cap per WIB day inside the serialized transaction
		loc, locErr := time.LoadLocation("Asia/Jakarta")
		if locErr != nil {
			loc = time.FixedZone("WIB", 7*3600)
		}
		nowWIB := payload.LastActiveAt.In(loc)
		dayStartUTC := time.Date(nowWIB.Year(), nowWIB.Month(), nowWIB.Day(), 0, 0, 0, 0, loc).UTC()

		var dailyReplayXP int
		capQuery := `
			SELECT COALESCE(SUM(xp_earned), 0)
			FROM user_activity_logs
			WHERE user_id = $1::uuid
			  AND activity_type = 'lesson_completed'
			  AND COALESCE((metadata->>'is_replay')::boolean, false) = true
			  AND created_at >= $2
		`
		if err := tx.QueryRow(ctx, capQuery, payload.Progress.UserID, dayStartUTC).Scan(&dailyReplayXP); err != nil {
			return fmt.Errorf("failed to verify daily replay xp cap in tx: %w", err)
		}
		if dailyReplayXP+payload.XPEarned > dailyReplayXPCap {
			remaining := dailyReplayXPCap - dailyReplayXP
			if remaining < 0 {
				remaining = 0
			}
			payload.XPEarned = remaining
		}
	}

	// 3. Atomic upsert of user_lesson_progress using monotonic DB clock NOW() for initial completion
	upsertQuery := `
		INSERT INTO user_lesson_progress (user_id, lesson_id, is_completed, score, is_skipped, completed_at)
		VALUES ($1::uuid, $2::uuid, $3, $4, $5, NOW())
		ON CONFLICT (user_id, lesson_id)
		DO UPDATE SET
			is_completed = EXCLUDED.is_completed,
			score = GREATEST(user_lesson_progress.score, EXCLUDED.score),
			is_skipped = EXCLUDED.is_skipped,
			completed_at = CASE
				WHEN user_lesson_progress.is_completed THEN user_lesson_progress.completed_at
				ELSE NOW()
			END
		RETURNING id, score, is_completed, is_skipped, completed_at
	`
	err = tx.QueryRow(
		ctx, upsertQuery,
		payload.Progress.UserID, payload.Progress.LessonID, payload.Progress.IsCompleted,
		payload.Progress.Score, payload.Progress.IsSkipped,
	).Scan(
		&payload.Progress.ID, &payload.Progress.Score, &payload.Progress.IsCompleted,
		&payload.Progress.IsSkipped, &payload.Progress.CompletedAt,
	)
	if err != nil {
		return fmt.Errorf("failed to upsert user lesson progress in tx: %w", err)
	}

	// 4. Recompute streak & level via shared domain helper from locked DB state
	helper := NewHelper()
	newStreak, _ := helper.EvaluateDailyStreak(lockedStreak, lockedLastActiveAt, payload.LastActiveAt)
	newLevel := helper.CalculateLevel(lockedXP + payload.XPEarned)

	updateGamificationQuery := `
		UPDATE user_gamification
		SET xp = xp + $2,
			current_level = $3,
			streak = $4,
			last_active_at = $5,
			updated_at = NOW()
		WHERE user_id = $1::uuid
		RETURNING xp, current_level, streak, gems
	`
	err = tx.QueryRow(
		ctx, updateGamificationQuery,
		payload.Progress.UserID, payload.XPEarned, newLevel, newStreak, payload.LastActiveAt,
	).Scan(&payload.NewXP, &payload.NewLevel, &payload.NewStreak, &payload.NewGems)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return user.ErrUserNotFound
		}
		return fmt.Errorf("failed to update gamification in tx: %w", err)
	}

	// 5. Telemetry activity log insertion reflecting the exact verified XPEarned & synced metadata
	activityQuery := `
		INSERT INTO user_activity_logs (user_id, activity_type, xp_earned, metadata, created_at)
		VALUES ($1::uuid, $2, $3, $4, NOW())
	`
	var metadataBytes []byte
	if payload.Metadata != nil {
		metadataBytes, _ = json.Marshal(payload.Metadata)
	} else {
		metadataBytes = []byte("{}")
	}

	_, err = tx.Exec(
		ctx, activityQuery,
		payload.Progress.UserID, payload.ActivityType, payload.XPEarned, metadataBytes,
	)
	if err != nil {
		return fmt.Errorf("failed to insert user activity log in tx: %w", err)
	}

	return tx.Commit(ctx)
}

// GetLessonAttemptSummary retrieves total exercises, attempted distinct exercises, correct counts,
// and fresh-attempt counts submitted after the user's most recent completion of that lesson.
func (r *PostgresRepository) GetLessonAttemptSummary(ctx context.Context, userID string, lessonID string) (*LessonAttemptSummary, error) {
	query := `
		WITH last_completion AS (
			SELECT GREATEST(
				COALESCE((SELECT completed_at FROM user_lesson_progress WHERE user_id = $1::uuid AND lesson_id = $2::uuid LIMIT 1), '-infinity'::timestamptz),
				COALESCE((SELECT MAX(created_at) FROM user_activity_logs WHERE user_id = $1::uuid AND activity_type = 'lesson_completed' AND metadata->>'lesson_id' = $2), '-infinity'::timestamptz)
			) AS cutoff_at
		),
		latest_overall AS (
			SELECT DISTINCT ON (uea.exercise_id) uea.exercise_id, uea.is_correct
			FROM user_exercise_attempts uea
			JOIN exercises e ON e.id = uea.exercise_id
			WHERE uea.user_id = $1::uuid AND e.lesson_id = $2::uuid
			ORDER BY uea.exercise_id, uea.created_at DESC, uea.id DESC
		),
		latest_fresh AS (
			SELECT DISTINCT ON (uea.exercise_id) uea.exercise_id, uea.is_correct
			FROM user_exercise_attempts uea
			JOIN exercises e ON e.id = uea.exercise_id
			CROSS JOIN last_completion lc
			WHERE uea.user_id = $1::uuid
			  AND e.lesson_id = $2::uuid
			  AND uea.created_at > lc.cutoff_at
			ORDER BY uea.exercise_id, uea.created_at DESC, uea.id DESC
		)
		SELECT
			COUNT(e.id) AS total_exercises,
			COUNT(lo.exercise_id) AS attempted_exercises,
			COUNT(lo.exercise_id) FILTER (WHERE lo.is_correct = true) AS correct_exercises,
			COUNT(lf.exercise_id) AS fresh_attempted_exercises,
			COUNT(lf.exercise_id) FILTER (WHERE lf.is_correct = true) AS fresh_correct_exercises
		FROM exercises e
		LEFT JOIN latest_overall lo ON lo.exercise_id = e.id
		LEFT JOIN latest_fresh lf ON lf.exercise_id = e.id
		WHERE e.lesson_id = $2::uuid
	`
	var summary LessonAttemptSummary
	if err := r.db.Pool.QueryRow(ctx, query, userID, lessonID).Scan(
		&summary.TotalExercises,
		&summary.AttemptedExercises,
		&summary.CorrectExercises,
		&summary.FreshAttemptedExercises,
		&summary.FreshCorrectExercises,
	); err != nil {
		return nil, fmt.Errorf("failed to get lesson attempt summary: %w", err)
	}
	return &summary, nil
}

