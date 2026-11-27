package curriculum

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"sort"
	"strings"
	"time"

	"merantalk/backend/infrastructure/postgres"
	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/progression"
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

func scanGrammarPointsRows(rows pgx.Rows) ([]GrammarPoint, error) {
	points := make([]GrammarPoint, 0, 16)
	for rows.Next() {
		var gp GrammarPoint
		var examplesRaw []byte
		var learningGuideRaw []byte
		if err := rows.Scan(
			&gp.ID, &gp.LevelID, &gp.LevelCode, &gp.Code, &gp.Category, &gp.Title,
			&gp.Formula, &gp.FormulaReading, &gp.Explanation, &examplesRaw, &learningGuideRaw,
			&gp.PracticeLessonSlug, &gp.PracticeLessonTitle, &gp.PracticeUnitOrder,
			&gp.OrderIndex, &gp.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan grammar point: %w", err)
		}
		gp.Examples = []GrammarExample{}
		if len(examplesRaw) > 0 {
			_ = json.Unmarshal(examplesRaw, &gp.Examples)
		}
		if len(learningGuideRaw) > 0 {
			var guide GrammarLearningGuide
			if err := json.Unmarshal(learningGuideRaw, &guide); err == nil &&
				(guide.Analogy != "" || len(guide.Breakdowns) > 0 || len(guide.Quiz) > 0) {
				gp.LearningGuide = &guide
			}
		}
		points = append(points, gp)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in grammar points: %w", err)
	}
	return points, nil
}

const grammarSelectCols = `
	gp.id, gp.level_id, pl.code, gp.code, gp.category, gp.title,
	gp.formula, gp.formula_reading, gp.explanation, gp.examples, gp.learning_guide,
	COALESCE(pln.slug, ''), COALESCE(pln.title, ''), COALESCE(pln.order_index, 0),
	gp.order_index, gp.created_at
`

const grammarPracticeLessonLateralJoin = `
	LEFT JOIN LATERAL (
		SELECT l.slug, l.title, u.order_index
		FROM exercises e
		JOIN lessons l ON l.id = e.lesson_id
		JOIN units u ON u.id = l.unit_id
		WHERE e.grammar_point_id = gp.id
		  AND u.unit_type = 'curriculum'
		ORDER BY u.order_index ASC, l.order_index ASC
		LIMIT 1
	) pln ON true
`

// GetGrammarPointsByLevelID retrieves all normalized grammar points for a proficiency level
func (r *PostgresRepository) GetGrammarPointsByLevelID(ctx context.Context, levelID string) ([]GrammarPoint, error) {
	if err := apperror.ValidateEntityUUID(levelID); err != nil {
		return nil, err
	}
	query := `
		SELECT ` + grammarSelectCols + `
		FROM grammar_points gp
		JOIN proficiency_levels pl ON pl.id = gp.level_id
		` + grammarPracticeLessonLateralJoin + `
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
		SELECT ` + grammarSelectCols + `
		FROM grammar_points gp
		JOIN proficiency_levels pl ON pl.id = gp.level_id
		JOIN languages l ON l.id = pl.language_id
		` + grammarPracticeLessonLateralJoin + `
		WHERE l.code = $1
		  AND l.is_active = true
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
		SELECT ` + grammarSelectCols + `
		FROM grammar_points gp
		JOIN proficiency_levels pl ON pl.id = gp.level_id
		` + grammarPracticeLessonLateralJoin + `
		WHERE EXISTS (
			SELECT 1 FROM exercises e
			WHERE e.grammar_point_id = gp.id
			  AND e.lesson_id = $1::uuid
		)
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
	if userID == "" {
		query := `
			SELECT 
				l.id, l.unit_id, l.slug, l.title,
				COALESCE(NULLIF(l.short_title, ''), l.title) AS short_title,
				COALESCE(l.icon_name, 'book-open') AS icon_name,
				l.xp_reward, l.order_index,
				false AS is_completed,
				0 AS score,
				false AS is_skipped,
				NULL::timestamptz AS completed_at,
				COALESCE(ex_stats.total_exercises, 0) AS total_exercises,
				0 AS completed_exercises
			FROM lessons l
			JOIN units u ON l.unit_id = u.id
			LEFT JOIN (
				SELECT lesson_id, COUNT(*)::int AS total_exercises
				FROM exercises
				GROUP BY lesson_id
			) ex_stats ON ex_stats.lesson_id = l.id
			WHERE u.level_id = $1::uuid AND u.unit_type = 'curriculum'
			ORDER BY u.order_index ASC, u.id ASC, l.order_index ASC, l.id ASC
		`
		rows, err := r.db.Pool.Query(ctx, query, levelID)
		if err != nil {
			return nil, fmt.Errorf("failed to batch query guest lessons by level: %w", err)
		}
		defer rows.Close()
		return scanLessonNodeRows(rows)
	}
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, err
	}
	query := `
		SELECT 
			l.id, l.unit_id, l.slug, l.title,
			COALESCE(NULLIF(l.short_title, ''), l.title) AS short_title,
			COALESCE(l.icon_name, 'book-open') AS icon_name,
			l.xp_reward, l.order_index,
			COALESCE(ulp.is_completed, false) AS is_completed,
			COALESCE(ulp.score, 0) AS score,
			COALESCE(ulp.is_skipped, false) AS is_skipped,
			ulp.completed_at,
			COALESCE(ex_stats.total_exercises, 0) AS total_exercises,
			CASE
				WHEN COALESCE(ulp.is_completed, false) THEN COALESCE(ex_stats.total_exercises, 0)
				ELSE LEAST(COALESCE(ex_stats.total_exercises, 0), COALESCE(att_stats.completed_exercises, 0))
			END AS completed_exercises
		FROM lessons l
		JOIN units u ON l.unit_id = u.id
		LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = $2::uuid
		LEFT JOIN (
			SELECT lesson_id, COUNT(*)::int AS total_exercises
			FROM exercises
			GROUP BY lesson_id
		) ex_stats ON ex_stats.lesson_id = l.id
		LEFT JOIN (
			SELECT e.lesson_id, COUNT(DISTINCT e.id)::int AS completed_exercises
			FROM user_exercise_attempts uea
			JOIN exercises e ON e.id = uea.exercise_id
			WHERE uea.user_id = $2::uuid
			  AND uea.is_correct = true
			  AND COALESCE((uea.selected_answer->>'is_srs_review')::boolean, false) = false
			GROUP BY e.lesson_id
		) att_stats ON att_stats.lesson_id = l.id
		WHERE u.level_id = $1::uuid AND u.unit_type = 'curriculum'
		ORDER BY u.order_index ASC, u.id ASC, l.order_index ASC, l.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, levelID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to batch query lessons by level: %w", err)
	}
	defer rows.Close()
	return scanLessonNodeRows(rows)
}

func scanLessonNodeRows(rows pgx.Rows) ([]LessonNodeResponse, error) {
	lessons := make([]LessonNodeResponse, 0, 48)
	for rows.Next() {
		var l LessonNodeResponse
		if err := rows.Scan(
			&l.ID, &l.UnitID, &l.Slug, &l.Title, &l.ShortTitle, &l.IconName, &l.XPReward, &l.OrderIndex,
			&l.IsCompleted, &l.Score, &l.IsSkipped, &l.CompletedAt,
			&l.TotalExercises, &l.CompletedExercises,
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
	var (
		lessonQuery string
		args        []any
	)
	if userID == "" {
		lessonQuery = targetCurriculumLessonCTESQL + `
			SELECT 
				l.id, l.unit_id, l.slug, u.level_id, u.unit_type, l.title,
				COALESCE(NULLIF(l.short_title, ''), l.title) AS short_title,
				COALESCE(l.icon_name, 'book-open') AS icon_name, l.xp_reward, l.order_index, l.created_at,
				false AS is_completed,
				0 AS score,
				false AS is_skipped,
				NULL::timestamptz AS completed_at,
				` + guestTrialLessonPredicateSQL + ` AS is_unlocked
			FROM target_lesson tl
			JOIN lessons l ON l.id = tl.id
			JOIN units u ON u.id = tl.unit_id
		`
		args = []any{id}
	} else {
		if err := apperror.ValidateUserUUID(userID); err != nil {
			return nil, err
		}
		lessonQuery = targetCurriculumLessonCTESQL + `
			SELECT 
				l.id, l.unit_id, l.slug, u.level_id, u.unit_type, l.title,
				COALESCE(NULLIF(l.short_title, ''), l.title) AS short_title,
				COALESCE(l.icon_name, 'book-open') AS icon_name, l.xp_reward, l.order_index, l.created_at,
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
		args = []any{id, userID}
	}

	var l LessonDetailResponse
	err := r.db.Pool.QueryRow(ctx, lessonQuery, args...).Scan(
		&l.ID, &l.UnitID, &l.Slug, &l.LevelID, &l.UnitType, &l.Title, &l.ShortTitle, &l.IconName, &l.XPReward, &l.OrderIndex, &l.CreatedAt,
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
		WHERE ule.user_id = $2::uuid
		  AND ule.language_id = tl.language_id
		  AND ule.is_active = true
		  AND (
			EXISTS (
				SELECT 1
				FROM users u_pro
				WHERE u_pro.id = $2::uuid
				  AND u_pro.subscription_tier = 'pro'
				  AND (u_pro.subscription_expires_at IS NULL OR u_pro.subscription_expires_at > NOW())
			)
			OR NOT EXISTS (
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
	)
`

const guestTrialLessonPredicateSQL = `
	EXISTS (
		SELECT 1
		FROM languages l
		WHERE l.id = tl.language_id
		  AND l.is_active = true
	)
	AND tl.level_order = (
		SELECT MIN(pl2.order_index)
		FROM proficiency_levels pl2
		WHERE pl2.language_id = tl.language_id
	)
	AND tl.unit_order = (
		SELECT MIN(u2.order_index)
		FROM units u2
		WHERE u2.level_id = tl.level_id
		  AND u2.unit_type = 'curriculum'
	)
`

// IsLessonUnlocked verifies whether a learner has sequentially unlocked a target lesson node
// and enforces that the lesson belongs to a proficiency level <= the user's enrolled level in that language.
// For unauthenticated guests (userID == ""), only Unit 1 of the lowest proficiency level in an active language is unlocked.
func (r *PostgresRepository) IsLessonUnlocked(ctx context.Context, userID string, lessonID string) (bool, error) {
	if err := apperror.ValidateEntityUUID(lessonID); err != nil {
		return false, err
	}
	var (
		query string
		args  []any
	)
	if userID == "" {
		query = targetCurriculumLessonCTESQL + `
			SELECT COALESCE((SELECT ` + guestTrialLessonPredicateSQL + ` FROM target_lesson tl), false) AS is_unlocked
		`
		args = []any{lessonID}
	} else {
		if err := apperror.ValidateUserUUID(userID); err != nil {
			return false, err
		}
		query = targetCurriculumLessonCTESQL + `
			SELECT COALESCE((SELECT ` + curriculumUnlockPredicateSQL + ` FROM target_lesson tl), false) AS is_unlocked
		`
		args = []any{lessonID, userID}
	}
	var isUnlocked bool
	err := r.db.Pool.QueryRow(ctx, query, args...).Scan(&isUnlocked)
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
	var lockedLastActiveAt, lockedBoosterExpiresAt *time.Time
	lockGamificationQuery := `
		SELECT xp, streak, last_active_at, gems, xp_booster_expires_at
		FROM user_gamification
		WHERE user_id = $1::uuid
		FOR UPDATE
	`
	err = tx.QueryRow(ctx, lockGamificationQuery, payload.Progress.UserID).Scan(
		&lockedXP, &lockedStreak, &lockedLastActiveAt, &lockedGems, &lockedBoosterExpiresAt,
	)
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

	// 2c. Apply 2x XP Booster when an active booster window covers this completion
	if payload.XPEarned > 0 && lockedBoosterExpiresAt != nil && lockedBoosterExpiresAt.After(dbNow) {
		payload.XPEarned *= 2
		payload.Metadata["xp_booster_applied"] = true
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

	// Recompute streak & level via shared domain helper from locked DB state, consuming streak-freeze if needed
	var availableFreezes int
	freezeErr := tx.QueryRow(
		ctx,
		`SELECT quantity FROM user_inventories WHERE user_id = $1::uuid AND item_id = 'streak-freeze' FOR UPDATE`,
		payload.Progress.UserID,
	).Scan(&availableFreezes)
	if freezeErr != nil {
		if errors.Is(freezeErr, pgx.ErrNoRows) {
			availableFreezes = 0
		} else {
			return fmt.Errorf("failed to inspect streak-freeze inventory in tx: %w", freezeErr)
		}
	}

	newStreak, _, freezesUsed := progression.EvaluateDailyStreakWithFreeze(
		lockedLastActiveAt, lockedStreak, availableFreezes, payload.LastActiveAt,
	)
	if freezesUsed > 0 {
		if _, err := tx.Exec(
			ctx,
			`UPDATE user_inventories SET quantity = quantity - $2, updated_at = NOW() WHERE user_id = $1::uuid AND item_id = 'streak-freeze' AND quantity >= $2`,
			payload.Progress.UserID, freezesUsed,
		); err != nil {
			return fmt.Errorf("failed to consume streak-freeze in tx: %w", err)
		}
		payload.Metadata["streak_freeze_used"] = freezesUsed
	}
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

// ListKanaWithProgress retrieves Hiragana and/or Katakana Gojuon characters merged with user mastery progress.
func (r *PostgresRepository) ListKanaWithProgress(ctx context.Context, userID string, script string) ([]KanaCharacterItem, error) {
	normalizedScript := strings.ToLower(strings.TrimSpace(script))
	var (
		query string
		args  []any
	)
	if userID == "" {
		query = `
			SELECT
				kc.id, kc.character, kc.script, kc.romaji, kc.row_group, kc.row_order, kc.col_order,
				kc.mnemonic, kc.example_word, kc.example_reading, kc.example_meaning,
				0 AS practice_count,
				0 AS correct_count,
				0 AS mastery_score,
				false AS is_mastered
			FROM kana_characters kc
			WHERE ($1 = '' OR kc.script = $1)
			ORDER BY kc.script ASC, kc.row_order ASC, kc.col_order ASC
		`
		args = []any{normalizedScript}
	} else {
		if err := apperror.ValidateUserUUID(userID); err != nil {
			return nil, err
		}
		query = `
			SELECT
				kc.id, kc.character, kc.script, kc.romaji, kc.row_group, kc.row_order, kc.col_order,
				kc.mnemonic, kc.example_word, kc.example_reading, kc.example_meaning,
				COALESCE(ukp.practice_count, 0) AS practice_count,
				COALESCE(ukp.correct_count, 0) AS correct_count,
				COALESCE(ukp.mastery_score, 0) AS mastery_score,
				COALESCE(ukp.is_mastered, false) AS is_mastered
			FROM kana_characters kc
			LEFT JOIN user_kana_progress ukp ON kc.character = ukp.character AND ukp.user_id = $1::uuid
			WHERE ($2 = '' OR kc.script = $2)
			ORDER BY kc.script ASC, kc.row_order ASC, kc.col_order ASC
		`
		args = []any{userID, normalizedScript}
	}
	rows, err := r.db.Pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query kana characters: %w", err)
	}
	defer rows.Close()

	items := make([]KanaCharacterItem, 0, 92)
	for rows.Next() {
		var item KanaCharacterItem
		if err := rows.Scan(
			&item.ID, &item.Character, &item.Script, &item.Romaji, &item.RowGroup, &item.RowOrder, &item.ColOrder,
			&item.Mnemonic, &item.ExampleWord, &item.ExampleReading, &item.ExampleMeaning,
			&item.PracticeCount, &item.CorrectCount, &item.MasteryScore, &item.IsMastered,
		); err != nil {
			return nil, fmt.Errorf("failed to scan kana character row: %w", err)
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in kana chart: %w", err)
	}
	return items, nil
}

// RecordKanaPractice atomically updates a user's mastery progress across one or more Kana characters.
func (r *PostgresRepository) RecordKanaPractice(ctx context.Context, userID string, results []KanaPracticeItem) (int, int, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return 0, 0, err
	}
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return 0, 0, fmt.Errorf("failed to begin kana practice transaction: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	// Serialize with flashcard bidirectional kana sync to prevent AB-BA row-lock deadlocks (40P01).
	if _, err := tx.Exec(ctx, `SELECT pg_advisory_xact_lock(hashtextextended('kana_fc_sync:' || $1, 0))`, userID); err != nil {
		return 0, 0, fmt.Errorf("failed to acquire kana sync lock: %w", err)
	}

	sortedResults := make([]KanaPracticeItem, len(results))
	copy(sortedResults, results)
	sort.SliceStable(sortedResults, func(i, j int) bool {
		return strings.TrimSpace(sortedResults[i].Character) < strings.TrimSpace(sortedResults[j].Character)
	})

	upsertSQL := `
		INSERT INTO user_kana_progress (user_id, character, practice_count, correct_count, mastery_score, is_mastered, last_practiced_at)
		SELECT $1::uuid, kc.character, 1, $3, $4, $5, NOW()
		FROM kana_characters kc
		WHERE kc.character = $2
		ON CONFLICT (user_id, character)
		DO UPDATE SET
			practice_count    = user_kana_progress.practice_count + 1,
			correct_count     = user_kana_progress.correct_count + EXCLUDED.correct_count,
			mastery_score     = LEAST(100, GREATEST(0, user_kana_progress.mastery_score + $6)),
			is_mastered       = (
				LEAST(100, GREATEST(0, user_kana_progress.mastery_score + $6)) >= 70
				OR (user_kana_progress.correct_count + EXCLUDED.correct_count) >= 2
			),
			last_practiced_at = NOW()
	`

	flashcardSyncSQL := `
		INSERT INTO user_flashcard_progress (
			user_id, card_id, ease_factor, interval_days, repetitions, next_review_at, last_reviewed_at, updated_at
		)
		SELECT
			$1::uuid, fc.id, 2.5,
			CASE WHEN $3 THEN 1 ELSE 0 END,
			CASE WHEN $3 THEN 1 ELSE 0 END,
			CASE WHEN $3 THEN NOW() + INTERVAL '1 day' ELSE NOW() + INTERVAL '1 minute' END,
			NOW(), NOW()
		FROM flashcard_cards fc
		JOIN flashcard_decks fd ON fd.id = fc.deck_id
		WHERE fc.front_text = $2
		  AND fd.category IN ('hiragana', 'katakana', 'kanji')
		ON CONFLICT (user_id, card_id)
		DO UPDATE SET
			repetitions = CASE WHEN $3 THEN user_flashcard_progress.repetitions + 1 ELSE 0 END,
			interval_days = CASE
				WHEN $3 AND user_flashcard_progress.repetitions = 0 THEN 1
				WHEN $3 AND user_flashcard_progress.repetitions = 1 THEN 3
				WHEN $3 THEN GREATEST(4, ROUND(user_flashcard_progress.interval_days * user_flashcard_progress.ease_factor)::int)
				ELSE 1
			END,
			next_review_at = CASE
				WHEN $3 AND user_flashcard_progress.repetitions = 0 THEN NOW() + INTERVAL '1 day'
				WHEN $3 AND user_flashcard_progress.repetitions = 1 THEN NOW() + INTERVAL '3 days'
				WHEN $3 THEN NOW() + (GREATEST(4, ROUND(user_flashcard_progress.interval_days * user_flashcard_progress.ease_factor)::int) || ' days')::interval
				ELSE NOW() + INTERVAL '1 minute'
			END,
			last_reviewed_at = NOW(),
			updated_at = NOW()
	`

	type normalizedKanaPractice struct {
		character string
		isCorrect bool
	}

	validItems := make([]normalizedKanaPractice, 0, len(sortedResults))
	upsertBatch := &pgx.Batch{}
	for _, res := range sortedResults {
		ch := strings.TrimSpace(res.Character)
		if ch == "" {
			continue
		}
		incCorrect := 0
		initScore := 10
		scoreDelta := -10
		if res.IsCorrect {
			incCorrect = 1
			initScore = 50
			scoreDelta = 35
		}
		validItems = append(validItems, normalizedKanaPractice{
			character: ch,
			isCorrect: res.IsCorrect,
		})
		upsertBatch.Queue(upsertSQL, userID, ch, incCorrect, initScore, false, scoreDelta)
	}

	updatedCount := 0
	var updatedItems []normalizedKanaPractice
	if len(validItems) > 0 {
		updatedItems = make([]normalizedKanaPractice, 0, len(validItems))
		upsertResults := tx.SendBatch(ctx, upsertBatch)
		for _, item := range validItems {
			tag, execErr := upsertResults.Exec()
			if execErr != nil {
				_ = upsertResults.Close()
				return 0, 0, fmt.Errorf("failed to upsert kana progress for %q: %w", item.character, execErr)
			}
			if tag.RowsAffected() > 0 {
				updatedCount++
				updatedItems = append(updatedItems, item)
			}
		}
		if closeErr := upsertResults.Close(); closeErr != nil {
			return 0, 0, fmt.Errorf("failed to close kana upsert batch: %w", closeErr)
		}
	}

	if len(updatedItems) > 0 {
		syncBatch := &pgx.Batch{}
		for _, item := range updatedItems {
			syncBatch.Queue(flashcardSyncSQL, userID, item.character, item.isCorrect)
		}
		syncResults := tx.SendBatch(ctx, syncBatch)
		for _, item := range updatedItems {
			if _, syncErr := syncResults.Exec(); syncErr != nil {
				_ = syncResults.Close()
				return 0, 0, fmt.Errorf("failed to sync flashcard progress for %q: %w", item.character, syncErr)
			}
		}
		if closeErr := syncResults.Close(); closeErr != nil {
			return 0, 0, fmt.Errorf("failed to close flashcard sync batch: %w", closeErr)
		}
	}

	var masteredTotal int
	if err := tx.QueryRow(ctx, `SELECT COUNT(*)::int FROM user_kana_progress WHERE user_id = $1::uuid AND is_mastered = true`, userID).Scan(&masteredTotal); err != nil {
		return 0, 0, fmt.Errorf("failed to count mastered kana: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return 0, 0, fmt.Errorf("failed to commit kana practice tx: %w", err)
	}
	return updatedCount, masteredTotal, nil
}

// GetUserGrammarProgressMap retrieves all grammar understanding progress records keyed by grammar_point_id.
func (r *PostgresRepository) GetUserGrammarProgressMap(ctx context.Context, userID string) (map[string]UserGrammarProgress, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, err
	}
	query := `
		SELECT id, user_id, grammar_point_id, quiz_score, correct_count, total_questions,
		       attempts_count, is_understood, understood_at, next_review_at, last_attempted_at
		FROM user_grammar_progress
		WHERE user_id = $1::uuid
	`
	rows, err := r.db.Pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query user grammar progress: %w", err)
	}
	defer rows.Close()

	res := make(map[string]UserGrammarProgress)
	for rows.Next() {
		var p UserGrammarProgress
		if err := rows.Scan(
			&p.ID, &p.UserID, &p.GrammarPointID, &p.QuizScore, &p.CorrectCount,
			&p.TotalQuestions, &p.AttemptsCount, &p.IsUnderstood,
			&p.UnderstoodAt, &p.NextReviewAt, &p.LastAttemptedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan user grammar progress: %w", err)
		}
		res[p.GrammarPointID] = p
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in user grammar progress: %w", err)
	}
	return res, nil
}

// RecordGrammarCheck atomically persists a learner's mini comprehension quiz outcome and schedules adaptive follow-up review.
func (r *PostgresRepository) RecordGrammarCheck(
	ctx context.Context,
	userID string,
	grammarPointIDOrCode string,
	correctCount int,
	totalQuestions int,
) (*SubmitGrammarCheckResponse, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, err
	}
	trimmed := strings.TrimSpace(grammarPointIDOrCode)
	if trimmed == "" {
		return nil, apperror.ErrBadRequest
	}

	var gpID string
	var lookupErr error
	if apperror.ValidateEntityUUID(trimmed) == nil {
		lookupErr = r.db.Pool.QueryRow(ctx, `SELECT id FROM grammar_points WHERE id = $1::uuid`, trimmed).Scan(&gpID)
	} else {
		lookupErr = r.db.Pool.QueryRow(ctx, `SELECT id FROM grammar_points WHERE UPPER(code) = UPPER($1)`, trimmed).Scan(&gpID)
	}
	if lookupErr != nil {
		if errors.Is(lookupErr, pgx.ErrNoRows) {
			return nil, apperror.ErrNotFound
		}
		return nil, fmt.Errorf("failed to lookup grammar point: %w", lookupErr)
	}

	quizScore := int(math.Round(float64(correctCount) * 100.0 / float64(totalQuestions)))
	if quizScore < 0 {
		quizScore = 0
	} else if quizScore > 100 {
		quizScore = 100
	}
	passedNow := correctCount >= totalQuestions

	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin grammar check tx: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	upsertSQL := `
		INSERT INTO user_grammar_progress (
			user_id, grammar_point_id, quiz_score, correct_count, total_questions,
			attempts_count, is_understood, understood_at, next_review_at, last_attempted_at
		)
		VALUES (
			$1::uuid, $2::uuid, $3, $4, $5,
			1, $6,
			CASE WHEN $6 THEN NOW() ELSE NULL END,
			CASE WHEN $6 THEN NOW() + INTERVAL '3 days' ELSE NOW() + INTERVAL '1 day' END,
			NOW()
		)
		ON CONFLICT (user_id, grammar_point_id)
		DO UPDATE SET
			quiz_score        = GREATEST(user_grammar_progress.quiz_score, EXCLUDED.quiz_score),
			correct_count     = GREATEST(user_grammar_progress.correct_count, EXCLUDED.correct_count),
			total_questions   = EXCLUDED.total_questions,
			attempts_count    = user_grammar_progress.attempts_count + 1,
			is_understood     = user_grammar_progress.is_understood OR EXCLUDED.is_understood,
			understood_at     = COALESCE(user_grammar_progress.understood_at, EXCLUDED.understood_at),
			next_review_at    = CASE
				WHEN user_grammar_progress.is_understood AND $6 THEN NOW() + INTERVAL '7 days'
				WHEN $6 THEN NOW() + INTERVAL '3 days'
				ELSE NOW() + INTERVAL '1 day'
			END,
			last_attempted_at = NOW()
		RETURNING id, user_id, grammar_point_id, quiz_score, correct_count, total_questions,
		          attempts_count, is_understood, understood_at, next_review_at, last_attempted_at
	`
	var prog UserGrammarProgress
	if err := tx.QueryRow(ctx, upsertSQL, userID, gpID, quizScore, correctCount, totalQuestions, passedNow).Scan(
		&prog.ID, &prog.UserID, &prog.GrammarPointID, &prog.QuizScore, &prog.CorrectCount,
		&prog.TotalQuestions, &prog.AttemptsCount, &prog.IsUnderstood,
		&prog.UnderstoodAt, &prog.NextReviewAt, &prog.LastAttemptedAt,
	); err != nil {
		return nil, fmt.Errorf("failed to upsert user grammar progress: %w", err)
	}

	var understoodTotal int
	if err := tx.QueryRow(ctx, `SELECT COUNT(*)::int FROM user_grammar_progress WHERE user_id = $1::uuid AND is_understood = true`, userID).Scan(&understoodTotal); err != nil {
		return nil, fmt.Errorf("failed to count understood grammar points: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit grammar check tx: %w", err)
	}
	return &SubmitGrammarCheckResponse{
		Progress:        prog,
		UnderstoodTotal: understoodTotal,
	}, nil
}

