package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
)

// CareerPathRepository implements domain.CareerPathRepository using PostgreSQL
type CareerPathRepository struct {
	db *postgres.PostgresDB
}

// NewCareerPathRepository creates a new PostgreSQL career path repository instance
func NewCareerPathRepository(db *postgres.PostgresDB) domain.CareerPathRepository {
	return &CareerPathRepository{db: db}
}

// GetAll retrieves all career paths ordered by creation time
func (r *CareerPathRepository) GetAll(ctx context.Context) ([]domain.CareerPath, error) {
	query := `
		SELECT id, slug, label, description, stacks, created_at, updated_at
		FROM career_paths
		ORDER BY created_at ASC
	`
	rows, err := r.db.Pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query career paths: %w", err)
	}
	defer rows.Close()

	var paths []domain.CareerPath
	for rows.Next() {
		var cp domain.CareerPath
		var rawStacks []byte
		err := rows.Scan(
			&cp.ID,
			&cp.Slug,
			&cp.Label,
			&cp.Description,
			&rawStacks,
			&cp.CreatedAt,
			&cp.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan career path: %w", err)
		}

		if len(rawStacks) > 0 {
			if err := json.Unmarshal(rawStacks, &cp.Stacks); err != nil {
				return nil, fmt.Errorf("failed to unmarshal career path stacks: %w", err)
			}
		} else {
			cp.Stacks = []domain.TechStack{}
		}

		paths = append(paths, cp)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating career path rows: %w", err)
	}

	return paths, nil
}

// GetByID retrieves a single career path by its UUID
func (r *CareerPathRepository) GetByID(ctx context.Context, id string) (*domain.CareerPath, error) {
	query := `
		SELECT id, slug, label, description, stacks, created_at, updated_at
		FROM career_paths
		WHERE id = $1
	`
	var cp domain.CareerPath
	var rawStacks []byte
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&cp.ID,
		&cp.Slug,
		&cp.Label,
		&cp.Description,
		&rawStacks,
		&cp.CreatedAt,
		&cp.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrCareerPathNotFound
		}
		return nil, fmt.Errorf("failed to get career path by id: %w", err)
	}

	if len(rawStacks) > 0 {
		if err := json.Unmarshal(rawStacks, &cp.Stacks); err != nil {
			return nil, fmt.Errorf("failed to unmarshal career path stacks: %w", err)
		}
	} else {
		cp.Stacks = []domain.TechStack{}
	}

	return &cp, nil
}

// GetBySlug retrieves a single career path by its slug (e.g., "backend", "devops", "frontend")
func (r *CareerPathRepository) GetBySlug(ctx context.Context, slug string) (*domain.CareerPath, error) {
	query := `
		SELECT id, slug, label, description, stacks, created_at, updated_at
		FROM career_paths
		WHERE slug = $1
		LIMIT 1
	`
	var cp domain.CareerPath
	var rawStacks []byte
	err := r.db.Pool.QueryRow(ctx, query, slug).Scan(
		&cp.ID,
		&cp.Slug,
		&cp.Label,
		&cp.Description,
		&rawStacks,
		&cp.CreatedAt,
		&cp.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrCareerPathNotFound
		}
		return nil, fmt.Errorf("failed to get career path by slug: %w", err)
	}

	if len(rawStacks) > 0 {
		if err := json.Unmarshal(rawStacks, &cp.Stacks); err != nil {
			return nil, fmt.Errorf("failed to unmarshal career path stacks: %w", err)
		}
	} else {
		cp.Stacks = []domain.TechStack{}
	}

	return &cp, nil
}
