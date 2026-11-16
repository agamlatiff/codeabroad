package leaderboard

import (
	"context"
	"errors"
	"fmt"
	"regexp"

	"codeabroad/backend/infrastructure/postgres"
	"codeabroad/backend/internal/app/user"
	"codeabroad/backend/internal/shared/apperror"
	"github.com/jackc/pgx/v5"
)

var uuidRegex = regexp.MustCompile(`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`)

func validateUserUUID(userID string) error {
	if !uuidRegex.MatchString(userID) {
		return apperror.ErrUnauthorized
	}
	return nil
}

// PostgresRepository implements leaderboard.Repository using PostgreSQL
type PostgresRepository struct {
	db *postgres.PostgresDB
}

// NewRepository creates a new PostgreSQL leaderboard repository instance
func NewRepository(db *postgres.PostgresDB) Repository {
	return &PostgresRepository{db: db}
}

func scanLeaderboardEntry(scanner interface{ Scan(dest ...any) error }) (LeaderboardEntry, error) {
	var e LeaderboardEntry
	err := scanner.Scan(
		&e.UserID,
		&e.Name,
		&e.Username,
		&e.AvatarURL,
		&e.TotalXP,
		&e.CurrentLevel,
		&e.Streak,
		&e.WeeklyXP,
	)
	return e, err
}

// GetDivisionStandings queries active users within an XP boundary ordered by weekly performance
func (r *PostgresRepository) GetDivisionStandings(ctx context.Context, minXP int, maxXP int, limit int) ([]LeaderboardEntry, error) {
	query := `
		SELECT u.id, up.name, up.username, up.avatar_url, ug.xp, ug.current_level, ug.streak,
		       COALESCE(weekly.week_xp, 0) AS week_xp
		FROM users u
		JOIN user_profiles up ON u.id = up.user_id
		JOIN user_gamification ug ON u.id = ug.user_id
		LEFT JOIN (
			SELECT user_id, COALESCE(SUM(xp_earned), 0) AS week_xp
			FROM user_activity_logs
			WHERE created_at >= NOW() - INTERVAL '7 days'
			GROUP BY user_id
		) weekly ON weekly.user_id = u.id
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
		e, err := scanLeaderboardEntry(rows)
		if err != nil {
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
	if err := validateUserUUID(userID); err != nil {
		return nil, err
	}

	query := `
		SELECT u.id, up.name, up.username, up.avatar_url, ug.xp, ug.current_level, ug.streak,
		       COALESCE((
		           SELECT SUM(xp_earned)
		           FROM user_activity_logs
		           WHERE user_id = u.id AND created_at >= NOW() - INTERVAL '7 days'
		       ), 0) AS week_xp
		FROM users u
		JOIN user_profiles up ON u.id = up.user_id
		JOIN user_gamification ug ON u.id = ug.user_id
		WHERE u.id = $1
	`
	e, err := scanLeaderboardEntry(r.db.Pool.QueryRow(ctx, query, userID))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, user.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to query user standing: %w", err)
	}
	return &e, nil
}

