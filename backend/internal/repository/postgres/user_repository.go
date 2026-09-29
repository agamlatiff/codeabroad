package postgres

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/database"
	"context"
	"errors"
	"fmt"
	"github.com/jackc/pgx/v5"
)

// UserRepository implements domain.UserRepository using PostgreSQL
type UserRepository struct {
	db *database.PostgresDB
}

// NewUserRepository creates a new PostgreSQL user repository instance
func NewUserRepository(db *database.PostgresDB) domain.UserRepository {
	return &UserRepository{db: db}
}

// Create inserts a new user record into the database
func (r *UserRepository) Create(ctx context.Context, user *domain.User) error {
	query := `
		INSERT INTO users (
			name, username, email, password_hash, level, xp, current_level, streak, is_onboarded
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9
		)
		RETURNING id, created_at, updated_at
	`
	err := r.db.Pool.QueryRow(
		ctx,
		query,
		user.Name,
		user.Username,
		user.Email,
		user.PasswordHash,
		user.Level,
		user.XP,
		user.CurrentLevel,
		user.Streak,
		user.IsOnboarded,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}
	return nil
}

// GetByEmail retrieves a user by their unique email address
func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	query := `
		SELECT id, name, username, email, password_hash, avatar_url, bio, github_url, linkedin_url,
		       career_path_id, country_id, level, xp, current_level, streak, last_active_at, is_onboarded,
		       created_at, updated_at
		FROM users
		WHERE email = $1
	`

	var user domain.User
	err := r.db.Pool.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Name,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.AvatarURL,
		&user.Bio,
		&user.GithubURL,
		&user.LinkedinURL,
		&user.CareerPathID,
		&user.CountryID,
		&user.Level,
		&user.XP,
		&user.CurrentLevel,
		&user.Streak,
		&user.LastActiveAt,
		&user.IsOnboarded,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil // Return nil if user is not found
		}
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}

	return &user, nil
}

// GetByUsername retrieves a user by their unique username handle
func (r *UserRepository) GetByUsername(ctx context.Context, username string) (*domain.User, error) {

	query := `
		SELECT id, name, username, email, password_hash, avatar_url, bio, github_url, linkedin_url,
		       career_path_id, country_id, level, xp, current_level, streak, last_active_at, is_onboarded,
		       created_at, updated_at
		FROM users
		WHERE username = $1
	`

	var user domain.User

	err := r.db.Pool.QueryRow(ctx, query, username).Scan(
		&user.ID,
		&user.Name,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.AvatarURL,
		&user.Bio,
		&user.GithubURL,
		&user.LinkedinURL,
		&user.CareerPathID,
		&user.CountryID,
		&user.Level,
		&user.XP,
		&user.CurrentLevel,
		&user.Streak,
		&user.LastActiveAt,
		&user.IsOnboarded,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by username: %w", err)
	}
	return &user, nil
}

// GetByID retrieves a user by their unique UUID
func (r *UserRepository) GetByID(ctx context.Context, id string) (*domain.User, error) {
	query := `
		SELECT id, name, username, email, password_hash, avatar_url, bio, github_url, linkedin_url,
		       career_path_id, country_id, level, xp, current_level, streak, last_active_at, is_onboarded,
		       created_at, updated_at
		FROM users
		WHERE id = $1
	`

	var user domain.User
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.Name,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.AvatarURL,
		&user.Bio,
		&user.GithubURL,
		&user.LinkedinURL,
		&user.CareerPathID,
		&user.CountryID,
		&user.Level,
		&user.XP,
		&user.CurrentLevel,
		&user.Streak,
		&user.LastActiveAt,
		&user.IsOnboarded,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by id: %w", err)
	}
	return &user, nil
}
