package curriculum

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"codeabroad/backend/infrastructure/postgres"
	"codeabroad/backend/internal/app/user"
	"codeabroad/backend/internal/shared/apperror"
	"github.com/jackc/pgx/v5"
	"strings"
)

// PostgresRepository implements curriculum.Repository using PostgreSQL
type PostgresRepository struct {
	db *postgres.PostgresDB
}

// NewRepository creates a new PostgreSQL curriculum repository instance
func NewRepository(db *postgres.PostgresDB) Repository {
	return &PostgresRepository{db: db}
}

func scanGrammarPointsRows(rows pgx.Rows) ([]GrammarPoint, error) {
	points := make([]GrammarPoint, 0, 16)
	for rows.Next() {
		var gp GrammarPoint
		var examplesRaw []byte
		if err := rows.Scan(
			&gp.ID, &gp.LevelID, &gp.LevelCode, &gp.Code, &gp.Category, &gp.Title,
			&gp.Formula, &gp.FormulaReading, &gp.Explanation, &examplesRaw, &gp.OrderIndex, &gp.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan grammar point: %w", err)
		}
		gp.Examples = []GrammarExample{}
		if len(examplesRaw) > 0 {
			_ = json.Unmarshal(examplesRaw, &gp.Examples)
		}
		points = append(points, gp)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in grammar points: %w", err)
	}
	return points, nil
}

// GetGrammarPointsByLevelID retrieves all normalized grammar points for a proficiency level
func (r *PostgresRepository) GetGrammarPointsByLevelID(ctx context.Context, levelID string) ([]GrammarPoint, error) {
	if err := apperror.ValidateEntityUUID(levelID); err != nil {
		return nil, err
	}
	query := `
		SELECT gp.id, gp.level_id, pl.code, gp.code, gp.category, gp.title, gp.formula, gp.formula_reading, gp.explanation, gp.examples, gp.order_index, gp.created_at
		FROM grammar_points gp
		JOIN proficiency_levels pl ON pl.id = gp.level_id
		WHERE gp.level_id = $1::uuid
		ORDER BY gp.order_index ASC, gp.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, levelID)
	if err != nil {
		return nil, fmt.Errorf("failed to query grammar points: %w", err)
	}
	defer rows.Close()
	return scanGrammarPointsRows(rows)
}

// GetGrammarPointsByLanguageCode retrieves grammar points across all levels (N5..N1) or a specific level code.
func (r *PostgresRepository) GetGrammarPointsByLanguageCode(ctx context.Context, languageCode string, levelCode string) ([]GrammarPoint, error) {
	lang := strings.ToLower(strings.TrimSpace(languageCode))
	if lang == "" {
		lang = "ja"
	}
	lvl := strings.ToUpper(strings.TrimSpace(levelCode))
	if lvl == "ALL" || lvl == "SEMUA" {
		lvl = ""
	}
	query := `
		SELECT gp.id, gp.level_id, pl.code, gp.code, gp.category, gp.title, gp.formula, gp.formula_reading, gp.explanation, gp.examples, gp.order_index, gp.created_at
		FROM grammar_points gp
		JOIN proficiency_levels pl ON pl.id = gp.level_id
		JOIN languages l ON l.id = pl.language_id
		WHERE l.code = $1
		  AND ($2 = '' OR UPPER(pl.code) = $2)
		ORDER BY pl.order_index ASC, gp.order_index ASC, gp.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, lang, lvl)
	if err != nil {
		return nil, fmt.Errorf("failed to query grammar points by level code: %w", err)
	}
	defer rows.Close()
	return scanGrammarPointsRows(rows)
}

// GetGrammarPointsByLessonID retrieves distinct grammar points referenced by exercises within a lesson node
func (r *PostgresRepository) GetGrammarPointsByLessonID(ctx context.Context, lessonID string) ([]GrammarPoint, error) {
	if err := apperror.ValidateEntityUUID(lessonID); err != nil {
		return nil, err
	}
	query := `
		SELECT DISTINCT gp.id, gp.level_id, pl.code, gp.code, gp.category, gp.title, gp.formula, gp.formula_reading, gp.explanation, gp.examples, gp.order_index, gp.created_at
		FROM grammar_points gp
		JOIN proficiency_levels pl ON pl.id = gp.level_id
		JOIN exercises e ON gp.id = e.grammar_point_id
		WHERE e.lesson_id = $1::uuid
		ORDER BY gp.order_index ASC, gp.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, lessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to query grammar points for lesson: %w", err)
	}
	defer rows.Close()
	return scanGrammarPointsRows(rows)
}

// GetUnitsByLevelID retrieves all curriculum chapters for a proficiency level
func (r *PostgresRepository) GetUnitsByLevelID(ctx context.Context, levelID string, _ string) ([]UnitNodeResponse, error) {
	if err := apperror.ValidateEntityUUID(levelID); err != nil {
		return nil, err
	}
	query := `
		SELECT 
			u.id, u.level_id, u.title, u.description, u.unit_type, u.order_index, u.created_at
		FROM units u
		WHERE u.level_id = $1::uuid AND u.unit_type = 'curriculum'
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
	if err := apperror.ValidateEntityUUID(id); err != nil {
		return nil, err
	}
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
	if err := apperror.ValidateEntityUUID(levelID); err != nil {
		return nil, err
	}
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, err
	}
	query := `
		SELECT 
			l.id, l.unit_id, l.slug, l.title, COALESCE(l.icon_name, 'book-open') AS icon_name, l.xp_reward, l.order_index,
			COALESCE(ulp.is_completed, false) AS is_completed,
			COALESCE(ulp.score, 0) AS score,
			COALESCE(ulp.is_skipped, false) AS is_skipped,
			ulp.completed_at
		FROM lessons l
		JOIN units u ON l.unit_id = u.id
		LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = $2::uuid
		WHERE u.level_id = $1::uuid AND u.unit_type = 'curriculum'
		ORDER BY u.order_index ASC, u.id ASC, l.order_index ASC, l.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, levelID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to batch query lessons by level: %w", err)
	}
	defer rows.Close()

	lessons := make([]LessonNodeResponse, 0, 48)
	for rows.Next() {
		var l LessonNodeResponse
		if err := rows.Scan(
			&l.ID, &l.UnitID, &l.Slug, &l.Title, &l.IconName, &l.XPReward, &l.OrderIndex,
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

// ResolveLessonID resolves either a lesson UUID or ASCII slug into its canonical UUID.
func (r *PostgresRepository) ResolveLessonID(ctx context.Context, idOrSlug string) (string, error) {
	trimmed := strings.TrimSpace(idOrSlug)
	if trimmed == "" {
		return "", apperror.ErrBadRequest
	}
	if apperror.ValidateEntityUUID(trimmed) == nil {
		return trimmed, nil
	}
	var lessonID string
	err := r.db.Pool.QueryRow(ctx, `SELECT id::text FROM lessons WHERE slug = $1`, trimmed).Scan(&lessonID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", ErrLessonNotFound
		}
		return "", fmt.Errorf("failed to resolve lesson slug: %w", err)
	}
	return lessonID, nil
}

// GetLessonSlugByID returns the ASCII slug of a lesson by UUID.
func (r *PostgresRepository) GetLessonSlugByID(ctx context.Context, lessonID string) (*string, error) {
	if err := apperror.ValidateEntityUUID(lessonID); err != nil {
		return nil, err
	}
	var slug string
	err := r.db.Pool.QueryRow(ctx, `SELECT slug FROM lessons WHERE id = $1::uuid`, lessonID).Scan(&slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to query lesson slug: %w", err)
	}
	return &slug, nil
}

// GetLessonByID retrieves a single lesson with user progress and sequential unlock status
func (r *PostgresRepository) GetLessonByID(ctx context.Context, id string, userID string) (*LessonDetailResponse, error) {
	if err := apperror.ValidateEntityUUID(id); err != nil {
		return nil, err
	}
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, err
	}
	lessonQuery := targetCurriculumLessonCTESQL + `
		SELECT 
			l.id, l.unit_id, l.slug, u.level_id, u.unit_type, l.title, COALESCE(l.icon_name, 'book-open') AS icon_name, l.xp_reward, l.order_index, l.created_at,
			COALESCE(ulp.is_completed, false) AS is_completed,
			COALESCE(ulp.score, 0) AS score,
			COALESCE(ulp.is_skipped, false) AS is_skipped,
			ulp.completed_at,
			` + curriculumUnlockPredicateSQL + ` AS is_unlocked
		FROM target_lesson tl
		JOIN lessons l ON l.id = tl.id
		JOIN units u ON u.id = tl.unit_id
		LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = $2::uuid
	`
	var l LessonDetailResponse
	err := r.db.Pool.QueryRow(ctx, lessonQuery, id, userID).Scan(
		&l.ID, &l.UnitID, &l.Slug, &l.LevelID, &l.UnitType, &l.Title, &l.IconName, &l.XPReward, &l.OrderIndex, &l.CreatedAt,
		&l.IsCompleted, &l.Score, &l.IsSkipped, &l.CompletedAt, &l.IsUnlocked,
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
	if err := apperror.ValidateEntityUUID(currentLessonID); err != nil {
		return nil, err
	}
	query := `
		WITH current_target AS (
			SELECT l.id, u.id AS unit_id, u.level_id, u.order_index AS unit_order, l.order_index AS lesson_order
			FROM lessons l
			JOIN units u ON l.unit_id = u.id
			WHERE l.id = $1::uuid AND u.unit_type = 'curriculum'
		)
		SELECT next_l.id
		FROM current_target ct
		JOIN units next_u ON next_u.level_id = ct.level_id AND next_u.unit_type = 'curriculum'
		JOIN lessons next_l ON next_l.unit_id = next_u.id
		WHERE (
			(next_u.order_index = ct.unit_order AND next_u.id = ct.unit_id AND (
				next_l.order_index > ct.lesson_order
				OR (next_l.order_index = ct.lesson_order AND next_l.id > ct.id)
			))
			OR (next_u.order_index = ct.unit_order AND next_u.id > ct.unit_id)
			OR (next_u.order_index > ct.unit_order)
		)
		ORDER BY next_u.order_index ASC, next_u.id ASC, next_l.order_index ASC, next_l.id ASC
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

const targetCurriculumLessonCTESQL = `
	WITH target_lesson AS (
		SELECT
			l.id,
			l.xp_reward,
			u.id AS unit_id,
			u.level_id,
			u.order_index AS unit_order,
			l.order_index AS lesson_order,
			pl.language_id,
			pl.order_index AS level_order
		FROM lessons l
		JOIN units u ON l.unit_id = u.id
		JOIN proficiency_levels pl ON u.level_id = pl.id
		WHERE l.id = $1::uuid AND u.unit_type = 'curriculum'
	)
`

const curriculumUnlockPredicateSQL = `
	EXISTS (
		SELECT 1
		FROM user_language_enrollments ule
		JOIN proficiency_levels user_pl ON ule.current_level_id = user_pl.id
		WHERE ule.user_id = $2::uuid
		  AND ule.language_id = tl.language_id
		  AND ule.is_active = true
		  AND tl.level_order <= user_pl.order_index
		  AND NOT EXISTS (
			SELECT 1
			FROM lessons prev_l
			JOIN units prev_u ON prev_l.unit_id = prev_u.id
			LEFT JOIN user_lesson_progress prev_ulp
			  ON prev_l.id = prev_ulp.lesson_id AND prev_ulp.user_id = $2::uuid
			WHERE prev_u.level_id = tl.level_id
			  AND prev_u.unit_type = 'curriculum'
			  AND COALESCE(prev_ulp.is_completed, false) = false
			  AND (
				(prev_u.order_index, prev_u.id) < (tl.unit_order, tl.unit_id)
				OR (
					prev_u.id = tl.unit_id
					AND (prev_l.order_index, prev_l.id) < (tl.lesson_order, tl.id)
				)
			  )
		  )
	)
`

// IsLessonUnlocked verifies whether a learner has sequentially unlocked a target lesson node
// and enforces that the lesson belongs to a proficiency level <= the user's enrolled level in that language.
func (r *PostgresRepository) IsLessonUnlocked(ctx context.Context, userID string, lessonID string) (bool, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return false, err
	}
	if err := apperror.ValidateEntityUUID(lessonID); err != nil {
		return false, err
	}
	query := targetCurriculumLessonCTESQL + `
		SELECT COALESCE((SELECT ` + curriculumUnlockPredicateSQL + ` FROM target_lesson tl), false) AS is_unlocked
	`
	var isUnlocked bool
	err := r.db.Pool.QueryRow(ctx, query, lessonID, userID).Scan(&isUnlocked)
	if err != nil {
		return false, fmt.Errorf("failed to verify lesson unlock invariant: %w", err)
	}
	return isUnlocked, nil
}

// IsLevelCurriculumCompleted reports whether every curriculum lesson in levelID has been completed by userID.
func (r *PostgresRepository) IsLevelCurriculumCompleted(ctx context.Context, userID string, levelID string) (bool, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return false, err
	}
	if err := apperror.ValidateEntityUUID(levelID); err != nil {
		return false, err
	}
	query := `
		SELECT NOT EXISTS (
			SELECT 1
			FROM lessons l
			JOIN units u ON l.unit_id = u.id
			LEFT JOIN user_lesson_progress ulp
			  ON l.id = ulp.lesson_id AND ulp.user_id = $1::uuid
			WHERE u.level_id = $2::uuid
			  AND u.unit_type = 'curriculum'
			  AND COALESCE(ulp.is_completed, false) = false
		)
	`
	var completed bool
	if err := r.db.Pool.QueryRow(ctx, query, userID, levelID).Scan(&completed); err != nil {
		return false, fmt.Errorf("failed to check level curriculum completion: %w", err)
	}
	return completed, nil
}

// SkipPrecedingLessons marks all prior curriculum lessons up to a target proficiency level as completed and skipped
func (r *PostgresRepository) SkipPrecedingLessons(ctx context.Context, userID string, upToLevelOrder int, languageID string) error {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return err
	}
	if err := apperror.ValidateEntityUUID(languageID); err != nil {
		return err
	}
	query := `
		INSERT INTO user_lesson_progress (user_id, lesson_id, is_completed, score, is_skipped, completed_at)
		SELECT $1::uuid, l.id, true, 100, true, NOW()
		FROM lessons l
		JOIN units u ON l.unit_id = u.id
		JOIN proficiency_levels pl ON u.level_id = pl.id
		WHERE pl.language_id = $2::uuid AND pl.order_index < $3 AND u.unit_type = 'curriculum'
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
	if err := apperror.ValidateUserUUID(payload.Progress.UserID); err != nil {
		return err
	}
	if err := apperror.ValidateEntityUUID(payload.Progress.LessonID); err != nil {
		return err
	}

	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin lesson completion tx: %w", err)
	}
	defer tx.Rollback(ctx)

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

	// 1b. Query PostgreSQL authoritative transaction clock and WIB midnight boundary
	var dbNow, dayStartUTC time.Time
	clockQuery := `SELECT NOW(), (NOW() AT TIME ZONE 'Asia/Jakarta')::date AT TIME ZONE 'Asia/Jakarta'`
	if err = tx.QueryRow(ctx, clockQuery).Scan(&dbNow, &dayStartUTC); err != nil {
		return fmt.Errorf("failed to query database clock in tx: %w", err)
	}
	dbNow = dbNow.UTC()
	payload.LastActiveAt = dbNow

	// 1c. Verify curriculum eligibility, active enrollment progression, and sequential prerequisite inside TX before mutating state
	var canonicalLessonID, lessonUnitID, lessonLevelID string
	var lessonXPReward int
	var isEligible bool
	eligibilityQuery := targetCurriculumLessonCTESQL + `
		SELECT
			tl.id::text,
			tl.unit_id::text,
			tl.level_id::text,
			tl.xp_reward,
			` + curriculumUnlockPredicateSQL + `
		FROM target_lesson tl
	`
	if err = tx.QueryRow(ctx, eligibilityQuery, payload.Progress.LessonID, payload.Progress.UserID).Scan(&canonicalLessonID, &lessonUnitID, &lessonLevelID, &lessonXPReward, &isEligible); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrLessonNotFound
		}
		return fmt.Errorf("failed to verify lesson eligibility in tx: %w", err)
	}
	if !isEligible {
		return ErrLessonLocked
	}
	payload.Progress.LessonID = canonicalLessonID
	payload.UnitID = lessonUnitID
	payload.LevelID = lessonLevelID
	payload.UnitType = "curriculum"
	if payload.ActivityType == "" {
		payload.ActivityType = "lesson_completed"
	}

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

	// 2b. Verify attempt completeness & compute server-authoritative score inside the serialized transaction
	// to prevent parallel-burst TOCTOU replay/first-completion XP farming.
	helper := NewHelper()
	attemptSummary, err := scanLessonAttemptSummary(ctx, tx, payload.Progress.UserID, payload.Progress.LessonID)
	if err != nil {
		return err
	}
	verifiedScore, err := helper.ComputeVerifiedLessonScore(payload.Progress.Score, attemptSummary, payload.WasCompleted)
	if err != nil {
		return err
	}
	payload.Progress.Score = verifiedScore
	payload.SessionScore = verifiedScore
	if payload.Metadata == nil {
		payload.Metadata = make(map[string]any)
	}
	payload.Metadata["lesson_id"] = canonicalLessonID
	payload.Metadata["score"] = verifiedScore
	payload.Metadata["is_practice"] = payload.WasCompleted

	failedReplay := payload.WasCompleted && verifiedScore < minLessonPassScore
	if payload.WasCompleted {
		payload.XPEarned = helper.CalculateReplayXP(verifiedScore)
		payload.Metadata["is_practice"] = true
		payload.Metadata["is_replay"] = true

		if payload.XPEarned > 0 {
			// Enforce daily replay XP cap per WIB day using the DB transaction clock
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
	} else {
		if lessonXPReward <= 0 {
			lessonXPReward = 15
		}
		payload.XPEarned = lessonXPReward
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

	// 4. Failed replays (<60%) do not extend streak, overwrite last_active_at, or write quest-eligible activity logs
	if failedReplay {
		payload.NewXP = lockedXP
		payload.NewLevel = helper.CalculateLevel(lockedXP)
		payload.NewStreak = lockedStreak
		payload.NewGems = lockedGems
		if lockedLastActiveAt != nil {
			payload.LastActiveAt = lockedLastActiveAt.UTC()
		}
		return tx.Commit(ctx)
	}

	// Recompute streak & level via shared domain helper from locked DB state
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
		metadataBytes, err = json.Marshal(payload.Metadata)
		if err != nil {
			return fmt.Errorf("failed to marshal xp metadata: %w", err)
		}
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

type rowQueryer interface {
	QueryRow(context.Context, string, ...any) pgx.Row
}

const lessonAttemptSummaryQuery = `
	WITH last_completion AS (
		SELECT GREATEST(
			COALESCE((SELECT completed_at FROM user_lesson_progress WHERE user_id = $1::uuid AND lesson_id = $2::uuid LIMIT 1), '-infinity'::timestamptz),
			COALESCE((SELECT MAX(created_at) FROM user_activity_logs WHERE user_id = $1::uuid AND activity_type = 'lesson_completed' AND metadata->>'lesson_id' = $2::uuid::text), '-infinity'::timestamptz)
		) AS cutoff_at
	),
	latest_overall AS (
		SELECT DISTINCT ON (uea.exercise_id) uea.exercise_id, uea.is_correct
		FROM user_exercise_attempts uea
		JOIN exercises e ON e.id = uea.exercise_id
		WHERE uea.user_id = $1::uuid
		  AND e.lesson_id = $2::uuid
		  AND COALESCE((uea.selected_answer->>'is_srs_review')::boolean, false) = false
		ORDER BY uea.exercise_id, uea.created_at DESC, uea.id DESC
	),
	latest_fresh AS (
		SELECT DISTINCT ON (uea.exercise_id) uea.exercise_id, uea.is_correct
		FROM user_exercise_attempts uea
		JOIN exercises e ON e.id = uea.exercise_id
		CROSS JOIN last_completion lc
		WHERE uea.user_id = $1::uuid
		  AND e.lesson_id = $2::uuid
		  AND COALESCE((uea.selected_answer->>'is_srs_review')::boolean, false) = false
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

func scanLessonAttemptSummary(ctx context.Context, q rowQueryer, userID string, lessonID string) (*LessonAttemptSummary, error) {
	var summary LessonAttemptSummary
	if err := q.QueryRow(ctx, lessonAttemptSummaryQuery, userID, lessonID).Scan(
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

