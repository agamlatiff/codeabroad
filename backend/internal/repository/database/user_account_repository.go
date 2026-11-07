package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5"
)

// UserRepository implements domain.UserRepository across the 3 normalized pillars
type UserRepository struct {
	db *postgres.PostgresDB
}

// NewUserRepository creates a new PostgreSQL user repository instance
func NewUserRepository(db *postgres.PostgresDB) domain.UserRepository {
	return &UserRepository{db: db}
}

const userSelectColumns = `
	u.id, 
	up.name, 
	up.username, 
	u.email, 
	u.password_hash, 
	up.bio, 
	up.career_path_id, 
	up.country_id, 
	up.tech_stack_id, 
	up.is_onboarded,
	up.has_seen_roadmap_tour,
	up.preferred_roadmap_view,
	ug.xp, 
	ug.current_level, 
	ug.streak, 
	ug.gems, 
	ug.last_active_at,
	u.created_at, 
	u.updated_at,
	c.id, c.code, c.name,
	cp.id, cp.slug, cp.label,
	ts.slug
`

const userFromClause = `
	FROM users u
	JOIN user_profiles up ON u.id = up.user_id
	JOIN user_gamification ug ON u.id = ug.user_id
	LEFT JOIN countries c ON up.country_id = c.id
	LEFT JOIN career_paths cp ON up.career_path_id = cp.id
	LEFT JOIN tech_stacks ts ON up.tech_stack_id = ts.id
`

func scanUser(row pgx.Row, user *domain.User) error {
	var cID, cCode, cName *string
	var cpID, cpSlug, cpLabel *string
	var tsSlug *string

	err := row.Scan(
		&user.ID,
		&user.Name,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.Bio,
		&user.CareerPathID,
		&user.CountryID,
		&user.TechStackID,
		&user.IsOnboarded,
		&user.HasSeenRoadmapTour,
		&user.PreferredRoadmapView,
		&user.XP,
		&user.CurrentLevel,
		&user.Streak,
		&user.Gems,
		&user.LastActiveAt,
		&user.CreatedAt,
		&user.UpdatedAt,
		&cID,
		&cCode,
		&cName,
		&cpID,
		&cpSlug,
		&cpLabel,
		&tsSlug,
	)
	if err != nil {
		return err
	}
	if tsSlug != nil && *tsSlug != "" {
		user.PrimaryStack = tsSlug
	}
	if cID != nil && cCode != nil && cName != nil {
		user.Country = &domain.CountrySummary{
			ID:        *cID,
			Code:      *cCode,
			Name:      *cName,
			FlagEmoji: flagEmojiForCountry(*cCode),
		}
	}
	if cpID != nil && cpSlug != nil && cpLabel != nil {
		user.CareerPath = &domain.CareerPathSummary{
			ID:    *cpID,
			Slug:  *cpSlug,
			Label: *cpLabel,
		}
	}
	return nil
}

// Create inserts a new user across all 3 normalized pillars in a single atomic Writeable CTE (1 DB round-trip)
func (r *UserRepository) Create(ctx context.Context, user *domain.User) error {
	query := `
		WITH new_user AS (
			INSERT INTO users (email, password_hash)
			VALUES ($1, $2)
			RETURNING id, created_at, updated_at
		),
		new_profile AS (
			INSERT INTO user_profiles (user_id, name, username, is_onboarded)
			SELECT id, $3, $4, $5 FROM new_user
		),
		new_gamification AS (
			INSERT INTO user_gamification (user_id, xp, current_level, streak, gems)
			SELECT id, $6, $7, $8, $9 FROM new_user
		)
		SELECT id, created_at, updated_at FROM new_user
	`
	err := r.db.Pool.QueryRow(
		ctx,
		query,
		user.Email,
		user.PasswordHash,
		user.Name,
		user.Username,
		user.IsOnboarded,
		user.XP,
		user.CurrentLevel,
		user.Streak,
		user.Gems,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		if strings.Contains(err.Error(), "users_email_key") {
			return domain.ErrEmailAlreadyExists
		}
		if strings.Contains(err.Error(), "user_profiles_username_key") {
			return domain.ErrUsernameTaken
		}
		return fmt.Errorf("failed to create 3-pillar user account: %w", err)
	}
	return nil
}

// GetByEmail retrieves a user by their unique email address across all 3 pillars
func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	query := `SELECT ` + userSelectColumns + userFromClause + ` WHERE u.email = $1`
	var user domain.User
	err := scanUser(r.db.Pool.QueryRow(ctx, query, email), &user)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}
	return &user, nil
}

// GetByUsername retrieves a user by their unique username handle across all 3 pillars
func (r *UserRepository) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
	query := `SELECT ` + userSelectColumns + userFromClause + ` WHERE up.username = $1`
	var user domain.User
	err := scanUser(r.db.Pool.QueryRow(ctx, query, username), &user)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by username: %w", err)
	}
	return &user, nil
}

// GetByID retrieves a user by their unique UUID across all 3 pillars
func (r *UserRepository) GetByID(ctx context.Context, id string) (*domain.User, error) {
	query := `SELECT ` + userSelectColumns + userFromClause + ` WHERE u.id = $1`
	var user domain.User
	err := scanUser(r.db.Pool.QueryRow(ctx, query, id), &user)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by id: %w", err)
	}
	return &user, nil
}

// UpdateProfile updates user profile fields including resolving primary_stack slug when provided
func (r *UserRepository) UpdateProfile(ctx context.Context, userID string, req *domain.UpdateProfileRequest) (*domain.User, error) {
	query := `
		UPDATE user_profiles
		SET name = COALESCE($2, name),
		    bio = COALESCE($3, bio),
		    country_id = COALESCE($4, country_id),
		    career_path_id = COALESCE($5, career_path_id),
		    tech_stack_id = COALESCE(
		        $6,
		        (SELECT id FROM tech_stacks WHERE slug = $7 LIMIT 1),
		        tech_stack_id
		    ),
		    has_seen_roadmap_tour = COALESCE($8, has_seen_roadmap_tour),
		    preferred_roadmap_view = COALESCE($9, preferred_roadmap_view),
		    updated_at = NOW()
		WHERE user_id = $1
	`
	tag, err := r.db.Pool.Exec(
		ctx,
		query,
		userID,
		req.Name,
		req.Bio,
		req.CountryID,
		req.CareerPathID,
		req.TechStackID,
		req.PrimaryStack,
		req.HasSeenRoadmapTour,
		req.PreferredRoadmapView,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update user profile: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return nil, domain.ErrUserNotFound
	}
	return r.GetByID(ctx, userID)
}

// UpdateOnboarding updates user_profiles and user_gamification atomically in a single Writeable CTE (1 DB round-trip)
func (r *UserRepository) UpdateOnboarding(
	ctx context.Context,
	userID string,
	countryID string,
	careerPathID string,
	primaryStack string,
	bonusXP int,
) error {
	query := `
		WITH updated_profile AS (
			UPDATE user_profiles
			SET country_id = $2,
			    career_path_id = $3,
			    tech_stack_id = (SELECT id FROM tech_stacks WHERE slug = $4 LIMIT 1),
			    is_onboarded = TRUE,
			    updated_at = NOW()
			WHERE user_id = $1
			RETURNING user_id
		)
		UPDATE user_gamification ug
		SET xp = ug.xp + $5,
		    current_level = ((ug.xp + $5) / 100) + 1,
		    streak = GREATEST(1, ug.streak),
		    last_active_at = NOW(),
		    updated_at = NOW()
		FROM updated_profile up
		WHERE ug.user_id = up.user_id
	`
	tag, err := r.db.Pool.Exec(ctx, query, userID, countryID, careerPathID, primaryStack, bonusXP)
	if err != nil {
		return fmt.Errorf("failed to update onboarding: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrUserNotFound
	}
	return nil
}

// GetProfileWithDetails reuses GetByID (which already joins countries, career_paths, and tech_stacks)
func (r *UserRepository) GetProfileWithDetails(ctx context.Context, userID string) (*domain.OnboardingProfileResponse, error) {
	user, err := r.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user profile with details: %w", err)
	}
	if user == nil {
		return nil, domain.ErrUserNotFound
	}

	return &domain.OnboardingProfileResponse{
		ID:                   user.ID,
		Name:                 user.Name,
		Username:             user.Username,
		Email:                user.Email,
		XP:                   user.XP,
		CurrentLevel:         user.CurrentLevel,
		Streak:               user.Streak,
		Gems:                 user.Gems,
		IsOnboarded:          user.IsOnboarded,
		HasSeenRoadmapTour:   user.HasSeenRoadmapTour,
		PreferredRoadmapView: user.PreferredRoadmapView,
		PrimaryStack:         user.PrimaryStack,
		Country:              user.Country,
		CareerPath:           user.CareerPath,
		CreatedAt:            user.CreatedAt,
	}, nil
}
