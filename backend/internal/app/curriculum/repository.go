package curriculum

import (
	"context"
	"errors"
	"fmt"
	"time"

	"codeabroad/backend/infrastructure/postgres"
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
		WHERE level_id = $1
		ORDER BY order_index ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, levelID)
	if err != nil {
		return nil, fmt.Errorf("failed to query grammar points: %w", err)
	}
	defer rows.Close()

	var points []GrammarPoint
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
		WHERE id = $1
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
		WHERE e.lesson_id = $1
		ORDER BY gp.order_index ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, lessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to query grammar points for lesson: %w", err)
	}
	defer rows.Close()

	var points []GrammarPoint
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
func (r *PostgresRepository) GetUnitsByLevelID(ctx context.Context, levelID string, userID string) ([]UnitNodeResponse, error) {
	query := `
		SELECT 
			u.id, u.level_id, u.title, u.description, u.unit_type, u.order_index, u.created_at
		FROM units u
		WHERE u.level_id = $1
		ORDER BY u.order_index ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, levelID)
	if err != nil {
		return nil, fmt.Errorf("failed to query units: %w", err)
	}
	defer rows.Close()

	var units []UnitNodeResponse
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
		WHERE id = $1
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
		LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = $2
		WHERE u.level_id = $1
		ORDER BY u.order_index ASC, l.order_index ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, levelID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to batch query lessons by level: %w", err)
	}
	defer rows.Close()

	var lessons []LessonNodeResponse
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
		LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = $2
		WHERE l.unit_id = $1
		ORDER BY l.order_index ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, unitID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query lessons by unit: %w", err)
	}
	defer rows.Close()

	var lessons []LessonNodeResponse
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
		LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = $2
		WHERE l.id = $1
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
		SELECT next_l.id
		FROM lessons cur_l
		JOIN units cur_u ON cur_l.unit_id = cur_u.id
		JOIN units next_u ON cur_u.level_id = next_u.level_id
		JOIN lessons next_l ON next_l.unit_id = next_u.id
		WHERE cur_l.id = $1
		  AND (
		    (next_u.order_index = cur_u.order_index AND next_l.order_index > cur_l.order_index)
		    OR (next_u.order_index > cur_u.order_index)
		  )
		ORDER BY next_u.order_index ASC, next_l.order_index ASC
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
func (r *PostgresRepository) IsLessonUnlocked(ctx context.Context, userID string, lessonID string) (bool, error) {
	query := `
		SELECT NOT EXISTS (
			SELECT 1
			FROM lessons prev_l
			JOIN units prev_u ON prev_l.unit_id = prev_u.id
			JOIN units cur_u ON cur_u.level_id = prev_u.level_id
			JOIN lessons cur_l ON cur_l.unit_id = cur_u.id
			LEFT JOIN user_lesson_progress ulp ON prev_l.id = ulp.lesson_id AND ulp.user_id = $2
			WHERE cur_l.id = $1
			  AND (
			    prev_u.order_index < cur_u.order_index
			    OR (prev_u.order_index = cur_u.order_index AND prev_l.order_index < cur_l.order_index)
			  )
			  AND (ulp.is_completed IS NULL OR ulp.is_completed = false)
		) AS is_unlocked
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
		WHERE user_id = $1 AND lesson_id = $2
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
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (user_id, lesson_id)
		DO UPDATE SET
			is_completed = EXCLUDED.is_completed,
			score = GREATEST(user_lesson_progress.score, EXCLUDED.score),
			is_skipped = EXCLUDED.is_skipped,
			completed_at = EXCLUDED.completed_at
		RETURNING id
	`
	if progress.CompletedAt.IsZero() {
		progress.CompletedAt = time.Now().UTC()
	}

	err := r.db.Pool.QueryRow(
		ctx, query,
		progress.UserID, progress.LessonID, progress.IsCompleted, progress.Score, progress.IsSkipped, progress.CompletedAt,
	).Scan(&progress.ID)
	if err != nil {
		return fmt.Errorf("failed to upsert user lesson progress: %w", err)
	}
	return nil
}

// SkipPrecedingLessons marks all prior lessons up to a target proficiency level as completed and skipped
func (r *PostgresRepository) SkipPrecedingLessons(ctx context.Context, userID string, upToLevelOrder int, languageID string) error {
	query := `
		INSERT INTO user_lesson_progress (user_id, lesson_id, is_completed, score, is_skipped, completed_at)
		SELECT $1, l.id, true, 100, true, NOW()
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

