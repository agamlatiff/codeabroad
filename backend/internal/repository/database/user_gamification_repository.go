package database

import (
	"codeabroad/backend/internal/domain"
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
)

// UpdateGamification updates a user's XP, level, streak counter, and last active timestamp (Pillar 3)
func (r *UserRepository) UpdateGamification(
	ctx context.Context,
	userID string,
	xp int,
	currentLevel int,
	streak int,
	lastActiveAt *time.Time,
) error {
	query := `
		UPDATE user_gamification
		SET xp = $2,
		    current_level = $3,
		    streak = $4,
		    last_active_at = $5,
		    updated_at = NOW()
		WHERE user_id = $1
	`
	tag, err := r.db.Pool.Exec(ctx, query, userID, xp, currentLevel, streak, lastActiveAt)
	if err != nil {
		return fmt.Errorf("failed to update user gamification: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrUserNotFound
	}
	return nil
}

// AddGems increments or decrements a user's gems balance atomically and returns the new total (Pillar 3)
func (r *UserRepository) AddGems(ctx context.Context, userID string, gems int) (int, error) {
	query := `
		UPDATE user_gamification
		SET gems = GREATEST(0, gems + $2),
		    updated_at = NOW()
		WHERE user_id = $1
		RETURNING gems
	`
	var newTotal int
	err := r.db.Pool.QueryRow(ctx, query, userID, gems).Scan(&newTotal)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return 0, domain.ErrUserNotFound
		}
		return 0, fmt.Errorf("failed to update user gems: %w", err)
	}
	return newTotal, nil
}
