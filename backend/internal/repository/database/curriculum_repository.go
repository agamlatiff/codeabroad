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

// CurriculumRepository implements domain.CurriculumRepository using PostgreSQL
type CurriculumRepository struct {
	db *postgres.PostgresDB
}

// NewCurriculumRepository creates a new PostgreSQL curriculum repository instance
func NewCurriculumRepository(db *postgres.PostgresDB) domain.CurriculumRepository {
	return &CurriculumRepository{db: db}
}

// GetGrammarPointsByLevelID retrieves all normalized grammar points for a proficiency level
func (r *CurriculumRepository) GetGrammarPointsByLevelID(ctx context.Context, levelID string) ([]domain.GrammarPoint, error) {
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

	var points []domain.GrammarPoint
	for rows.Next() {
		var gp domain.GrammarPoint
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
func (r *CurriculumRepository) GetGrammarPointByID(ctx context.Context, id string) (*domain.GrammarPoint, error) {
	query := `
		SELECT id, level_id, code, category, title, formula, explanation, order_index, created_at
		FROM grammar_points
		WHERE id = $1
	`
	var gp domain.GrammarPoint
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&gp.ID, &gp.LevelID, &gp.Code, &gp.Category, &gp.Title,
		&gp.Formula, &gp.Explanation, &gp.OrderIndex, &gp.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrGrammarPointNotFound
		}
		return nil, fmt.Errorf("failed to query grammar point by id: %w", err)
	}
	return &gp, nil
}

// GetUnitsByLevelID retrieves all curriculum chapters with aggregated lesson metrics and progressive unlocks
func (r *CurriculumRepository) GetUnitsByLevelID(ctx context.Context, levelID string, userID string) ([]domain.Unit, error) {
	query := `
		SELECT 
			u.id, u.level_id, u.title, u.description, u.unit_type, u.order_index, u.created_at,
			COUNT(l.id) AS total_lessons,
			COUNT(CASE WHEN ulp.is_completed = true THEN 1 END) AS completed_lessons
		FROM units u
		LEFT JOIN lessons l ON u.id = l.unit_id
		LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = $2
		WHERE u.level_id = $1
		GROUP BY u.id, u.level_id, u.title, u.description, u.unit_type, u.order_index, u.created_at
		ORDER BY u.order_index ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, levelID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query units with progress: %w", err)
	}
	defer rows.Close()

	var units []domain.Unit
	allPreviousCompleted := true

	for rows.Next() {
		var u domain.Unit
		if err := rows.Scan(
			&u.ID, &u.LevelID, &u.Title, &u.Description, &u.UnitType,
			&u.OrderIndex, &u.CreatedAt, &u.TotalLessons, &u.CompletedLessons,
		); err != nil {
			return nil, fmt.Errorf("failed to scan unit row: %w", err)
		}

		// Pedagogical unlock logic: First unit is always unlocked; subsequent units unlock when previous unit is complete
		u.IsUnlocked = allPreviousCompleted
		if u.TotalLessons > 0 && u.CompletedLessons < u.TotalLessons {
			allPreviousCompleted = false
		}

		units = append(units, u)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in units: %w", err)
	}
	return units, nil
}

// GetUnitByID retrieves a single unit by UUID
func (r *CurriculumRepository) GetUnitByID(ctx context.Context, id string) (*domain.Unit, error) {
	query := `
		SELECT id, level_id, title, description, unit_type, order_index, created_at
		FROM units
		WHERE id = $1
	`
	var u domain.Unit
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&u.ID, &u.LevelID, &u.Title, &u.Description, &u.UnitType, &u.OrderIndex, &u.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrUnitNotFound
		}
		return nil, fmt.Errorf("failed to query unit by id: %w", err)
	}
	return &u, nil
}

// GetLessonsByUnitID retrieves all lesson nodes for a unit with user progression status
func (r *CurriculumRepository) GetLessonsByUnitID(ctx context.Context, unitID string, userID string) ([]domain.Lesson, error) {
	query := `
		SELECT 
			l.id, l.unit_id, l.title, l.xp_reward, l.order_index, l.created_at,
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

	var lessons []domain.Lesson
	for rows.Next() {
		var l domain.Lesson
		if err := rows.Scan(
			&l.ID, &l.UnitID, &l.Title, &l.XPReward, &l.OrderIndex, &l.CreatedAt,
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
func (r *CurriculumRepository) GetLessonByID(ctx context.Context, id string, userID string) (*domain.Lesson, error) {
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
	var l domain.Lesson
	err := r.db.Pool.QueryRow(ctx, lessonQuery, id, userID).Scan(
		&l.ID, &l.UnitID, &l.Title, &l.XPReward, &l.OrderIndex, &l.CreatedAt,
		&l.IsCompleted, &l.Score, &l.IsSkipped, &l.CompletedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrLessonNotFound
		}
		return nil, fmt.Errorf("failed to query lesson by id: %w", err)
	}

	// Fetch exercises belonging to this lesson
	exerciseQuery := `
		SELECT id, lesson_id, type, question_text, options, correct_answer, hint, explanation, media_url, xp_reward, order_index, created_at
		FROM exercises
		WHERE lesson_id = $1
		ORDER BY order_index ASC
	`
	rows, err := r.db.Pool.Query(ctx, exerciseQuery, id)
	if err != nil {
		return nil, fmt.Errorf("failed to query exercises for lesson: %w", err)
	}
	defer rows.Close()

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
		l.Exercises = append(l.Exercises, ex)
	}

	return &l, nil
}

// GetUserLessonProgress retrieves a user's completion status on a lesson
func (r *CurriculumRepository) GetUserLessonProgress(ctx context.Context, userID string, lessonID string) (*domain.UserLessonProgress, error) {
	query := `
		SELECT id, user_id, lesson_id, is_completed, score, is_skipped, completed_at
		FROM user_lesson_progress
		WHERE user_id = $1 AND lesson_id = $2
	`
	var p domain.UserLessonProgress
	err := r.db.Pool.QueryRow(ctx, query, userID, lessonID).Scan(
		&p.ID, &p.UserID, &p.LessonID, &p.IsCompleted, &p.Score, &p.IsSkipped, &p.CompletedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil // Return nil when not started yet
		}
		return nil, fmt.Errorf("failed to query user lesson progress: %w", err)
	}
	return &p, nil
}

// UpsertLessonProgress records or updates lesson completion atomically
func (r *CurriculumRepository) UpsertLessonProgress(ctx context.Context, progress *domain.UserLessonProgress) error {
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

// SkipPrecedingLessons marks all prior lessons up to a target proficiency level as completed and skipped in 1 DB round-trip
func (r *CurriculumRepository) SkipPrecedingLessons(ctx context.Context, userID string, upToLevelOrder int, languageID string) error {
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

