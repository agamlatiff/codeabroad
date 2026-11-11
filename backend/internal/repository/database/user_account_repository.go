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
	up.daily_goal_minutes,
	up.is_onboarded,
	up.has_seen_roadmap_tour,
	up.preferred_roadmap_view,
	ug.xp, 
	ug.current_level, 
	ug.streak, 
	ug.gems, 
	ug.last_active_at,
	u.created_at, 
	u.updated_at
`

const userFromClause = `
	FROM users u
	JOIN user_profiles up ON u.id = up.user_id
	JOIN user_gamification ug ON u.id = ug.user_id
`

func scanUser(row pgx.Row, user *domain.User) error {
	err := row.Scan(
		&user.ID,
		&user.Name,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.Bio,
		&user.DailyGoalMinutes,
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
	)
	return err
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
			INSERT INTO user_profiles (user_id, name, username, is_onboarded, daily_goal_minutes)
			SELECT id, $3, $4, $5, $6 FROM new_user
		),
		new_gamification AS (
			INSERT INTO user_gamification (user_id, xp, current_level, streak, gems)
			SELECT id, $7, $8, $9, $10 FROM new_user
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
		user.DailyGoalMinutes,
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

// UpdateProfile updates user profile preferences with parameterized values
func (r *UserRepository) UpdateProfile(ctx context.Context, userID string, req *domain.UpdateProfileRequest) (*domain.User, error) {
	query := `
		UPDATE user_profiles
		SET name = COALESCE($2, name),
		    bio = COALESCE($3, bio),
		    daily_goal_minutes = COALESCE($4, daily_goal_minutes),
		    has_seen_roadmap_tour = COALESCE($5, has_seen_roadmap_tour),
		    preferred_roadmap_view = COALESCE($6, preferred_roadmap_view),
		    updated_at = NOW()
		WHERE user_id = $1
	`
	tag, err := r.db.Pool.Exec(
		ctx,
		query,
		userID,
		req.Name,
		req.Bio,
		req.DailyGoalMinutes,
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

// SetOnboarded marks the user as having finished the 3-step onboarding flow and records their pace goal
func (r *UserRepository) SetOnboarded(ctx context.Context, userID string, dailyGoalMinutes int) error {
	query := `
		UPDATE user_profiles
		SET is_onboarded = true,
		    daily_goal_minutes = COALESCE(NULLIF($2, 0), daily_goal_minutes),
		    updated_at = NOW()
		WHERE user_id = $1
	`
	tag, err := r.db.Pool.Exec(ctx, query, userID, dailyGoalMinutes)
	if err != nil {
		return fmt.Errorf("failed to set user onboarded: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrUserNotFound
	}
	return nil
}
