package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
)

// CountryRepository implements domain.CountryRepository using PostgreSQL v2.2 schema
type CountryRepository struct {
	db *postgres.PostgresDB
}

// NewCountryRepository creates a new PostgreSQL country repository instance
func NewCountryRepository(db *postgres.PostgresDB) domain.CountryRepository {
	return &CountryRepository{db: db}
}

// Helper to get flag emoji based on country code
func flagEmojiForCountry(code string) string {
	switch code {
	case "JP":
		return "🇯🇵"
	case "DE":
		return "🇩🇪"
	case "SG":
		return "🇸🇬"
	default:
		return "🌐"
	}
}

// GetAll retrieves all countries ordered by active status and name
func (r *CountryRepository) GetAll(ctx context.Context) ([]domain.Country, error) {
	query := `
		SELECT id, code, name, is_active, created_at, updated_at
		FROM countries
		ORDER BY is_active DESC, name ASC
	`
	rows, err := r.db.Pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query countries: %w", err)
	}
	defer rows.Close()

	var countries []domain.Country
	for rows.Next() {
		var c domain.Country
		err := rows.Scan(
			&c.ID,
			&c.Code,
			&c.Name,
			&c.IsActive,
			&c.CreatedAt,
			&c.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan country: %w", err)
		}
		c.FlagEmoji = flagEmojiForCountry(c.Code)
		countries = append(countries, c)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating country rows: %w", err)
	}

	return countries, nil
}

// GetByID retrieves a single country by its UUID
func (r *CountryRepository) GetByID(ctx context.Context, id string) (*domain.Country, error) {
	query := `
		SELECT id, code, name, is_active, created_at, updated_at
		FROM countries
		WHERE id = $1
	`
	var c domain.Country
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&c.ID,
		&c.Code,
		&c.Name,
		&c.IsActive,
		&c.CreatedAt,
		&c.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrCountryNotFound
		}
		return nil, fmt.Errorf("failed to get country by id: %w", err)
	}
	c.FlagEmoji = flagEmojiForCountry(c.Code)
	return &c, nil
}

// GetByCode retrieves a single country by its country code (e.g., "JP")
func (r *CountryRepository) GetByCode(ctx context.Context, code string) (*domain.Country, error) {
	query := `
		SELECT id, code, name, is_active, created_at, updated_at
		FROM countries
		WHERE code = $1
	`
	var c domain.Country
	err := r.db.Pool.QueryRow(ctx, query, code).Scan(
		&c.ID,
		&c.Code,
		&c.Name,
		&c.IsActive,
		&c.CreatedAt,
		&c.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrCountryNotFound
		}
		return nil, fmt.Errorf("failed to get country by code: %w", err)
	}
	c.FlagEmoji = flagEmojiForCountry(c.Code)
	return &c, nil
}
