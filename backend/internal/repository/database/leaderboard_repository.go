package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
)

// LeaderboardRepository implements domain.LeaderboardRepository using PostgreSQL
type LeaderboardRepository struct {
	db *postgres.PostgresDB
}

// NewLeaderboardRepository creates a new PostgreSQL leaderboard repository instance
func NewLeaderboardRepository(db *postgres.PostgresDB) domain.LeaderboardRepository {
	return &LeaderboardRepository{db: db}
}

// GetDivisionStandings queries active users within an XP boundary ordered by weekly performance (uses B-Tree index on ug.xp)
func (r *LeaderboardRepository) GetDivisionStandings(ctx context.Context, minXP int, maxXP int, limit int) ([]domain.LeaderboardEntry, error) {
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
		ORDER BY week_xp DESC, ug.streak DESC, ug.xp DESC
		LIMIT $3
	`

	rows, err := r.db.Pool.Query(ctx, query, minXP, maxXP, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query division standings: %w", err)
	}
	defer rows.Close()

	var entries []domain.LeaderboardEntry
	for rows.Next() {
		var e domain.LeaderboardEntry
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
func (r *LeaderboardRepository) GetUserStanding(ctx context.Context, userID string) (*domain.LeaderboardEntry, error) {
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
	var e domain.LeaderboardEntry
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
			return nil, domain.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to query user standing: %w", err)
	}
	return &e, nil
}
