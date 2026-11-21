package language

import (
	"context"
	"errors"
	"fmt"
	"time"

	"merantalk/backend/infrastructure/postgres"
	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/progression"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

func validateUserUUID(userID string) error {
	return apperror.ValidateUserUUID(userID)
}

func validateEntityUUID(id string) error {
	return apperror.ValidateEntityUUID(id)
}

func scanLanguageRow(scanner interface{ Scan(dest ...any) error }) (Language, error) {
	var l Language
	err := scanner.Scan(&l.ID, &l.Code, &l.Name, &l.SupportedScripts, &l.IsActive, &l.CreatedAt)
	return l, err
}

func scanEnrollmentRow(scanner interface{ Scan(dest ...any) error }) (UserLanguageEnrollment, error) {
	var e UserLanguageEnrollment
	var l Language
	var plID, plLangID, plCode, plName, plTier, plExam *string
	var plPassing, plOrder *int
	var plCreatedAt *time.Time

	err := scanner.Scan(
		&e.ID, &e.UserID, &e.LanguageID, &e.CurrentLevelID, &e.InitialPlacementType,
		&e.PlacementScorePercent, &e.IsActive, &e.EnrolledAt,
		&l.ID, &l.Code, &l.Name, &l.SupportedScripts, &l.IsActive, &l.CreatedAt,
		&plID, &plLangID, &plCode, &plName, &plTier, &plExam, &plPassing, &plOrder, &plCreatedAt,
	)
	if err != nil {
		return e, err
	}

	e.Language = &l
	if plID != nil {
		pl := ProficiencyLevel{ID: *plID}
		if plLangID != nil {
			pl.LanguageID = *plLangID
		}
		if plCode != nil {
			pl.Code = *plCode
		}
		if plName != nil {
			pl.Name = *plName
		}
		if plTier != nil {
			pl.Tier = *plTier
		}
		if plExam != nil {
			pl.OfficialExamName = *plExam
		}
		if plPassing != nil {
			pl.PassingScorePercent = *plPassing
		}
		if plOrder != nil {
			pl.OrderIndex = *plOrder
		}
		if plCreatedAt != nil {
			pl.CreatedAt = *plCreatedAt
		}
		e.CurrentLevel = &pl
	}
	return e, nil
}

// PostgresRepository implements language.Repository using PostgreSQL
type PostgresRepository struct {
	db *postgres.PostgresDB
}

// NewRepository creates a new PostgreSQL language repository instance
func NewRepository(db *postgres.PostgresDB) Repository {
	return &PostgresRepository{db: db}
}

// GetAllLanguages retrieves all language tracks with SARGable queries
func (r *PostgresRepository) GetAllLanguages(ctx context.Context, onlyActive bool) ([]Language, error) {
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

	languages := make([]Language, 0)
	for rows.Next() {
		l, err := scanLanguageRow(rows)
		if err != nil {
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
func (r *PostgresRepository) GetLanguageByID(ctx context.Context, id string) (*Language, error) {
	if err := validateEntityUUID(id); err != nil {
		return nil, err
	}
	query := `
		SELECT id, code, name, supported_scripts, is_active, created_at
		FROM languages
		WHERE id = $1
	`
	l, err := scanLanguageRow(r.db.Pool.QueryRow(ctx, query, id))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrLanguageNotFound
		}
		return nil, fmt.Errorf("failed to query language by id: %w", err)
	}
	return &l, nil
}

// GetLevelsByLanguageID retrieves all proficiency certification tiers ordered by pedagogical progression
func (r *PostgresRepository) GetLevelsByLanguageID(ctx context.Context, languageID string) ([]ProficiencyLevel, error) {
	if err := validateEntityUUID(languageID); err != nil {
		return nil, err
	}
	query := `
		SELECT id, language_id, code, name, tier, official_exam_name, passing_score_percent, order_index, created_at
		FROM proficiency_levels
		WHERE language_id = $1
		ORDER BY order_index ASC, id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, languageID)
	if err != nil {
		return nil, fmt.Errorf("failed to query proficiency levels: %w", err)
	}
	defer rows.Close()

	levels := make([]ProficiencyLevel, 0)
	for rows.Next() {
		var pl ProficiencyLevel
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
func (r *PostgresRepository) GetLevelByID(ctx context.Context, id string) (*ProficiencyLevel, error) {
	if err := validateEntityUUID(id); err != nil {
		return nil, err
	}
	query := `
		SELECT id, language_id, code, name, tier, official_exam_name, passing_score_percent, order_index, created_at
		FROM proficiency_levels
		WHERE id = $1
	`
	var pl ProficiencyLevel
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&pl.ID, &pl.LanguageID, &pl.Code, &pl.Name, &pl.Tier,
		&pl.OfficialExamName, &pl.PassingScorePercent, &pl.OrderIndex, &pl.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrProficiencyLevelNotFound
		}
		return nil, fmt.Errorf("failed to query proficiency level by id: %w", err)
	}
	return &pl, nil
}

// GetEnrollmentsByUserID retrieves all language enrollments for a user with joined language & level details
func (r *PostgresRepository) GetEnrollmentsByUserID(ctx context.Context, userID string) ([]UserLanguageEnrollment, error) {
	if err := validateUserUUID(userID); err != nil {
		return nil, err
	}
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
		ORDER BY e.is_active DESC, e.enrolled_at DESC, e.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query enrollments by user: %w", err)
	}
	defer rows.Close()

	enrollments := make([]UserLanguageEnrollment, 0)
	for rows.Next() {
		e, err := scanEnrollmentRow(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan enrollment row: %w", err)
		}
		enrollments = append(enrollments, e)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in enrollments: %w", err)
	}
	return enrollments, nil
}

// GetActiveEnrollment retrieves the currently active destination language track for a user
func (r *PostgresRepository) GetActiveEnrollment(ctx context.Context, userID string, languageID string) (*UserLanguageEnrollment, error) {
	if err := validateUserUUID(userID); err != nil {
		return nil, err
	}
	if languageID != "" {
		if err := validateEntityUUID(languageID); err != nil {
			return nil, err
		}
	}

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

	e, err := scanEnrollmentRow(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrEnrollmentNotFound
		}
		return nil, fmt.Errorf("failed to query active enrollment: %w", err)
	}
	return &e, nil
}

// CreateEnrollment registers a user into a language track and sets it active
func (r *PostgresRepository) CreateEnrollment(ctx context.Context, enrollment *UserLanguageEnrollment) error {
	if err := validateUserUUID(enrollment.UserID); err != nil {
		return err
	}
	if err := validateEntityUUID(enrollment.LanguageID); err != nil {
		return err
	}
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin enrollment tx: %w", err)
	}
	defer progression.RollbackTx(ctx, tx, "language.CreateEnrollment")

	if _, err := tx.Exec(ctx, `SELECT pg_advisory_xact_lock(hashtextextended('lang_enroll:' || $1, 0))`, enrollment.UserID); err != nil {
		return fmt.Errorf("failed to lock user enrollments: %w", err)
	}

	if enrollment.IsActive {
		deactivateQuery := `UPDATE user_language_enrollments SET is_active = false WHERE user_id = $1::uuid`
		if _, err := tx.Exec(ctx, deactivateQuery, enrollment.UserID); err != nil {
			return fmt.Errorf("failed to deactivate previous enrollments: %w", err)
		}
	}

	insertQuery := `
		INSERT INTO user_language_enrollments (
			user_id, language_id, current_level_id, initial_placement_type, placement_score_percent, is_active, enrolled_at
		) VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, NOW())
		RETURNING id, enrolled_at
	`
	err = tx.QueryRow(
		ctx, insertQuery,
		enrollment.UserID, enrollment.LanguageID, enrollment.CurrentLevelID,
		enrollment.InitialPlacementType, enrollment.PlacementScorePercent, enrollment.IsActive,
	).Scan(&enrollment.ID, &enrollment.EnrolledAt)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return ErrAlreadyEnrolled
		}
		return fmt.Errorf("failed to insert language enrollment: %w", err)
	}

	return tx.Commit(ctx)
}

// UpdateEnrollmentLevel updates the learner's current proficiency level in an enrolled track
func (r *PostgresRepository) UpdateEnrollmentLevel(ctx context.Context, enrollmentID string, levelID string) error {
	if err := validateEntityUUID(enrollmentID); err != nil {
		return err
	}
	if err := validateEntityUUID(levelID); err != nil {
		return err
	}
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
		return ErrEnrollmentNotFound
	}
	return nil
}

// UpdateEnrollmentLevelIfCurrent updates the learner's proficiency level only if it still matches expectedLevelID
func (r *PostgresRepository) UpdateEnrollmentLevelIfCurrent(ctx context.Context, enrollmentID string, expectedLevelID string, levelID string) error {
	if err := validateEntityUUID(enrollmentID); err != nil {
		return err
	}
	if err := validateEntityUUID(expectedLevelID); err != nil {
		return err
	}
	if err := validateEntityUUID(levelID); err != nil {
		return err
	}
	query := `
		UPDATE user_language_enrollments
		SET current_level_id = $2
		WHERE id = $1 AND current_level_id = $3
	`
	tag, err := r.db.Pool.Exec(ctx, query, enrollmentID, levelID, expectedLevelID)
	if err != nil {
		return fmt.Errorf("failed to conditionally update enrollment level: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrEnrollmentLevelChanged
	}
	return nil
}

// SetActiveLanguage switches the user's active learning track atomically
func (r *PostgresRepository) SetActiveLanguage(ctx context.Context, userID string, languageID string) error {
	if err := validateUserUUID(userID); err != nil {
		return err
	}
	if err := validateEntityUUID(languageID); err != nil {
		return err
	}
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin switch language tx: %w", err)
	}
	defer progression.RollbackTx(ctx, tx, "language.SetActiveLanguage")

	if _, err := tx.Exec(ctx, `SELECT pg_advisory_xact_lock(hashtextextended('lang_enroll:' || $1, 0))`, userID); err != nil {
		return fmt.Errorf("failed to lock user enrollments: %w", err)
	}

	if _, err := tx.Exec(ctx, `UPDATE user_language_enrollments SET is_active = false WHERE user_id = $1::uuid`, userID); err != nil {
		return fmt.Errorf("failed to deactivate tracks: %w", err)
	}

	tag, err := tx.Exec(ctx, `
		UPDATE user_language_enrollments 
		SET is_active = true 
		WHERE user_id = $1::uuid AND language_id = $2::uuid
	`, userID, languageID)
	if err != nil {
		return fmt.Errorf("failed to activate target language track: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrEnrollmentNotFound
	}

	return tx.Commit(ctx)
}

