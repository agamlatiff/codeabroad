package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
)

// LanguageRepository implements domain.LanguageRepository using PostgreSQL
type LanguageRepository struct {
	db *postgres.PostgresDB
}

// NewLanguageRepository creates a new PostgreSQL language repository instance
func NewLanguageRepository(db *postgres.PostgresDB) domain.LanguageRepository {
	return &LanguageRepository{db: db}
}

// GetAllLanguages retrieves all language tracks with SARGable queries (zero OR condition in WHERE)
func (r *LanguageRepository) GetAllLanguages(ctx context.Context, onlyActive bool) ([]domain.Language, error) {
	var query string
	if onlyActive {
		query = `
			SELECT id, code, name, supported_scripts, is_active, created_at
			FROM languages
			WHERE is_active = true
			ORDER BY name ASC
		`
	} else {
		query = `
			SELECT id, code, name, supported_scripts, is_active, created_at
			FROM languages
			ORDER BY name ASC
		`
	}

	rows, err := r.db.Pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query languages: %w", err)
	}
	defer rows.Close()

	var languages []domain.Language
	for rows.Next() {
		var l domain.Language
		if err := rows.Scan(&l.ID, &l.Code, &l.Name, &l.SupportedScripts, &l.IsActive, &l.CreatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan language: %w", err)
		}
		languages = append(languages, l)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in languages: %w", err)
	}
	return languages, nil
}

// GetLanguageByID retrieves a single language track by its UUID
func (r *LanguageRepository) GetLanguageByID(ctx context.Context, id string) (*domain.Language, error) {
	query := `
		SELECT id, code, name, supported_scripts, is_active, created_at
		FROM languages
		WHERE id = $1
	`
	var l domain.Language
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&l.ID, &l.Code, &l.Name, &l.SupportedScripts, &l.IsActive, &l.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrLanguageNotFound
		}
		return nil, fmt.Errorf("failed to query language by id: %w", err)
	}
	return &l, nil
}

// GetLanguageByCode retrieves a single language track by its ISO code (e.g. "ja", "de")
func (r *LanguageRepository) GetLanguageByCode(ctx context.Context, code string) (*domain.Language, error) {
	query := `
		SELECT id, code, name, supported_scripts, is_active, created_at
		FROM languages
		WHERE code = $1
	`
	var l domain.Language
	err := r.db.Pool.QueryRow(ctx, query, code).Scan(
		&l.ID, &l.Code, &l.Name, &l.SupportedScripts, &l.IsActive, &l.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrLanguageNotFound
		}
		return nil, fmt.Errorf("failed to query language by code: %w", err)
	}
	return &l, nil
}

// GetLevelsByLanguageID retrieves all proficiency certification tiers ordered by pedagogical progression
func (r *LanguageRepository) GetLevelsByLanguageID(ctx context.Context, languageID string) ([]domain.ProficiencyLevel, error) {
	query := `
		SELECT id, language_id, code, name, tier, official_exam_name, passing_score_percent, order_index, created_at
		FROM proficiency_levels
		WHERE language_id = $1
		ORDER BY order_index ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, languageID)
	if err != nil {
		return nil, fmt.Errorf("failed to query proficiency levels: %w", err)
	}
	defer rows.Close()

	var levels []domain.ProficiencyLevel
	for rows.Next() {
		var pl domain.ProficiencyLevel
		if err := rows.Scan(
			&pl.ID, &pl.LanguageID, &pl.Code, &pl.Name, &pl.Tier,
			&pl.OfficialExamName, &pl.PassingScorePercent, &pl.OrderIndex, &pl.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan proficiency level: %w", err)
		}
		levels = append(levels, pl)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in proficiency levels: %w", err)
	}
	return levels, nil
}

// GetLevelByID retrieves a single proficiency level by UUID
func (r *LanguageRepository) GetLevelByID(ctx context.Context, id string) (*domain.ProficiencyLevel, error) {
	query := `
		SELECT id, language_id, code, name, tier, official_exam_name, passing_score_percent, order_index, created_at
		FROM proficiency_levels
		WHERE id = $1
	`
	var pl domain.ProficiencyLevel
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&pl.ID, &pl.LanguageID, &pl.Code, &pl.Name, &pl.Tier,
		&pl.OfficialExamName, &pl.PassingScorePercent, &pl.OrderIndex, &pl.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrProficiencyLevelNotFound
		}
		return nil, fmt.Errorf("failed to query proficiency level by id: %w", err)
	}
	return &pl, nil
}

// GetEnrollmentsByUserID retrieves all language enrollments for a user with joined language & level details
func (r *LanguageRepository) GetEnrollmentsByUserID(ctx context.Context, userID string) ([]domain.UserLanguageEnrollment, error) {
	query := `
		SELECT 
			e.id, e.user_id, e.language_id, e.current_level_id, e.initial_placement_type, 
			e.placement_score_percent, e.is_active, e.enrolled_at,
			l.id, l.code, l.name, l.supported_scripts, l.is_active, l.created_at,
			pl.id, pl.language_id, pl.code, pl.name, pl.tier, pl.official_exam_name, pl.passing_score_percent, pl.order_index, pl.created_at
		FROM user_language_enrollments e
		JOIN languages l ON e.language_id = l.id
		LEFT JOIN proficiency_levels pl ON e.current_level_id = pl.id
		WHERE e.user_id = $1
		ORDER BY e.is_active DESC, e.enrolled_at DESC
	`
	rows, err := r.db.Pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query enrollments by user: %w", err)
	}
	defer rows.Close()

	var enrollments []domain.UserLanguageEnrollment
	for rows.Next() {
		var e domain.UserLanguageEnrollment
		var l domain.Language
		var pl domain.ProficiencyLevel
		var plID *string

		if err := rows.Scan(
			&e.ID, &e.UserID, &e.LanguageID, &e.CurrentLevelID, &e.InitialPlacementType,
			&e.PlacementScorePercent, &e.IsActive, &e.EnrolledAt,
			&l.ID, &l.Code, &l.Name, &l.SupportedScripts, &l.IsActive, &l.CreatedAt,
			&plID, &pl.LanguageID, &pl.Code, &pl.Name, &pl.Tier, &pl.OfficialExamName, &pl.PassingScorePercent, &pl.OrderIndex, &pl.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan enrollment row: %w", err)
		}
		e.Language = &l
		if plID != nil {
			pl.ID = *plID
			e.CurrentLevel = &pl
		}
		enrollments = append(enrollments, e)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in enrollments: %w", err)
	}
	return enrollments, nil
}

// GetActiveEnrollment retrieves the currently active destination language track for a user
func (r *LanguageRepository) GetActiveEnrollment(ctx context.Context, userID string, languageID string) (*domain.UserLanguageEnrollment, error) {
	var query string
	var row pgx.Row

	if languageID != "" {
		query = `
			SELECT 
				e.id, e.user_id, e.language_id, e.current_level_id, e.initial_placement_type, 
				e.placement_score_percent, e.is_active, e.enrolled_at,
				l.id, l.code, l.name, l.supported_scripts, l.is_active, l.created_at,
				pl.id, pl.language_id, pl.code, pl.name, pl.tier, pl.official_exam_name, pl.passing_score_percent, pl.order_index, pl.created_at
			FROM user_language_enrollments e
			JOIN languages l ON e.language_id = l.id
			LEFT JOIN proficiency_levels pl ON e.current_level_id = pl.id
			WHERE e.user_id = $1 AND e.language_id = $2::uuid AND e.is_active = true
			LIMIT 1
		`
		row = r.db.Pool.QueryRow(ctx, query, userID, languageID)
	} else {
		query = `
			SELECT 
				e.id, e.user_id, e.language_id, e.current_level_id, e.initial_placement_type, 
				e.placement_score_percent, e.is_active, e.enrolled_at,
				l.id, l.code, l.name, l.supported_scripts, l.is_active, l.created_at,
				pl.id, pl.language_id, pl.code, pl.name, pl.tier, pl.official_exam_name, pl.passing_score_percent, pl.order_index, pl.created_at
			FROM user_language_enrollments e
			JOIN languages l ON e.language_id = l.id
			LEFT JOIN proficiency_levels pl ON e.current_level_id = pl.id
			WHERE e.user_id = $1 AND e.is_active = true
			LIMIT 1
		`
		row = r.db.Pool.QueryRow(ctx, query, userID)
	}

	var e domain.UserLanguageEnrollment
	var l domain.Language
	var pl domain.ProficiencyLevel
	var plID *string

	err := row.Scan(
		&e.ID, &e.UserID, &e.LanguageID, &e.CurrentLevelID, &e.InitialPlacementType,
		&e.PlacementScorePercent, &e.IsActive, &e.EnrolledAt,
		&l.ID, &l.Code, &l.Name, &l.SupportedScripts, &l.IsActive, &l.CreatedAt,
		&plID, &pl.LanguageID, &pl.Code, &pl.Name, &pl.Tier, &pl.OfficialExamName, &pl.PassingScorePercent, &pl.OrderIndex, &pl.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrEnrollmentNotFound
		}
		return nil, fmt.Errorf("failed to query active enrollment: %w", err)
	}
	e.Language = &l
	if plID != nil {
		pl.ID = *plID
		e.CurrentLevel = &pl
	}
	return &e, nil
}

// CreateEnrollment registers a user into a language track and sets it active
func (r *LanguageRepository) CreateEnrollment(ctx context.Context, enrollment *domain.UserLanguageEnrollment) error {
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin enrollment tx: %w", err)
	}
	defer tx.Rollback(ctx)

	// Deactivate any existing active enrollments for this user
	if enrollment.IsActive {
		deactivateQuery := `UPDATE user_language_enrollments SET is_active = false WHERE user_id = $1`
		if _, err := tx.Exec(ctx, deactivateQuery, enrollment.UserID); err != nil {
			return fmt.Errorf("failed to deactivate previous enrollments: %w", err)
		}
	}

	insertQuery := `
		INSERT INTO user_language_enrollments (
			user_id, language_id, current_level_id, initial_placement_type, placement_score_percent, is_active, enrolled_at
		) VALUES ($1, $2, $3, $4, $5, $6, NOW())
		RETURNING id, enrolled_at
	`
	err = tx.QueryRow(
		ctx, insertQuery,
		enrollment.UserID, enrollment.LanguageID, enrollment.CurrentLevelID,
		enrollment.InitialPlacementType, enrollment.PlacementScorePercent, enrollment.IsActive,
	).Scan(&enrollment.ID, &enrollment.EnrolledAt)
	if err != nil {
		return fmt.Errorf("failed to insert language enrollment: %w", err)
	}

	return tx.Commit(ctx)
}

// UpdateEnrollmentLevel updates the learner's current proficiency level in an enrolled track
func (r *LanguageRepository) UpdateEnrollmentLevel(ctx context.Context, enrollmentID string, levelID string) error {
	query := `
		UPDATE user_language_enrollments
		SET current_level_id = $2
		WHERE id = $1
	`
	tag, err := r.db.Pool.Exec(ctx, query, enrollmentID, levelID)
	if err != nil {
		return fmt.Errorf("failed to update enrollment level: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrEnrollmentNotFound
	}
	return nil
}

// SetActiveLanguage switches the user's active learning track atomically via a single CTE
func (r *LanguageRepository) SetActiveLanguage(ctx context.Context, userID string, languageID string) error {
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin switch language tx: %w", err)
	}
	defer tx.Rollback(ctx)

	// 1. Deactivate all tracks for this user
	if _, err := tx.Exec(ctx, `UPDATE user_language_enrollments SET is_active = false WHERE user_id = $1`, userID); err != nil {
		return fmt.Errorf("failed to deactivate tracks: %w", err)
	}

	// 2. Activate target track
	tag, err := tx.Exec(ctx, `
		UPDATE user_language_enrollments 
		SET is_active = true 
		WHERE user_id = $1 AND language_id = $2
	`, userID, languageID)
	if err != nil {
		return fmt.Errorf("failed to activate target language track: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrEnrollmentNotFound
	}

	return tx.Commit(ctx)
}
