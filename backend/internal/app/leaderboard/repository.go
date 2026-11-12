package leaderboard

import (
	"context"
	"errors"
	"fmt"

	"codeabroad/backend/infrastructure/postgres"
	"codeabroad/backend/internal/app/user"
	"github.com/jackc/pgx/v5"
)

// PostgresRepository implements leaderboard.Repository using PostgreSQL
type PostgresRepository struct {
	db *postgres.PostgresDB
}

// NewRepository creates a new PostgreSQL leaderboard repository instance
func NewRepository(db *postgres.PostgresDB) Repository {
	return &PostgresRepository{db: db}
}

// GetDivisionStandings queries active users within an XP boundary ordered by weekly performance
func (r *PostgresRepository) GetDivisionStandings(ctx context.Context, minXP int, maxXP int, limit int) ([]LeaderboardEntry, error) {
	query := `
		SELECT u.id, up.name, up.username, ug.xp, ug.current_level, ug.streak,
		       COALESCE((
		           SELECT SUM(xp_earned) 
		           FROM user_activity_logs 
		           WHERE user_id = u.id AND created_at >= NOW() - INTERVAL '7 days'
		       ), ug.xp) as week_xp
		FROM users u
		JOIN user_profiles up ON u.id = up.user_id
		JOIN user_gamification ug ON u.id = ug.user_id
		WHERE ug.xp >= $1 AND ug.xp < $2
		ORDER BY week_xp DESC, ug.streak DESC, ug.xp DESC, u.id ASC
		LIMIT $3
	`

	rows, err := r.db.Pool.Query(ctx, query, minXP, maxXP, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query division standings: %w", err)
	}
	defer rows.Close()

	capacity := limit
	if capacity <= 0 {
		capacity = 0
	}
	entries := make([]LeaderboardEntry, 0, capacity)
	for rows.Next() {
		var e LeaderboardEntry
		var totalXP int
		if err := rows.Scan(
			&e.UserID,
			&e.Name,
			&e.Username,
			&totalXP,
			&e.CurrentLevel,
			&e.Streak,
			&e.WeeklyXP,
		); err != nil {
			return nil, fmt.Errorf("failed to scan leaderboard entry: %w", err)
		}
		entries = append(entries, e)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in leaderboard: %w", err)
	}
	return entries, nil
}

// GetUserStanding queries a single user's current ranking statistics across the 3 normalized pillars
func (r *PostgresRepository) GetUserStanding(ctx context.Context, userID string) (*LeaderboardEntry, error) {
	query := `
		SELECT u.id, up.name, up.username, ug.xp, ug.current_level, ug.streak,
		       COALESCE((
		           SELECT SUM(xp_earned) 
		           FROM user_activity_logs 
		           WHERE user_id = u.id AND created_at >= NOW() - INTERVAL '7 days'
		       ), ug.xp) as week_xp
		FROM users u
		JOIN user_profiles up ON u.id = up.user_id
		JOIN user_gamification ug ON u.id = ug.user_id
		WHERE u.id = $1
	`
	var e LeaderboardEntry
	var totalXP int
	err := r.db.Pool.QueryRow(ctx, query, userID).Scan(
		&e.UserID,
		&e.Name,
		&e.Username,
		&totalXP,
		&e.CurrentLevel,
		&e.Streak,
		&e.WeeklyXP,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, user.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to query user standing: %w", err)
	}
	return &e, nil
}

