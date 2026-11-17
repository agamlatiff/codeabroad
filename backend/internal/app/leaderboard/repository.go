package leaderboard

import (
	"context"
	"errors"
	"fmt"

	"codeabroad/backend/infrastructure/postgres"
	"codeabroad/backend/internal/app/user"
	"codeabroad/backend/internal/shared/apperror"
	"github.com/jackc/pgx/v5"
)

func validateUserUUID(userID string) error {
	return apperror.ValidateUserUUID(userID)
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

const wibWeekStartExpr = `(date_trunc('week', NOW() AT TIME ZONE 'Asia/Jakarta') AT TIME ZONE 'Asia/Jakarta')`

// GetDivisionStandings queries active users within an XP boundary ordered by weekly performance
func (r *PostgresRepository) GetDivisionStandings(ctx context.Context, minXP int, maxXP int, limit int) ([]LeaderboardEntry, error) {
	entries, _, err := r.GetDivisionStandingsWithTotal(ctx, minXP, maxXP, limit)
	return entries, err
}

// GetDivisionStandingsWithTotal queries top division standings alongside total competitors in that division.
func (r *PostgresRepository) GetDivisionStandingsWithTotal(ctx context.Context, minXP int, maxXP int, limit int) ([]LeaderboardEntry, int, error) {
	query := `
		SELECT u.id, up.name, up.username, up.avatar_url, ug.xp, ug.current_level, ug.streak,
		       COALESCE(weekly.week_xp, 0) AS week_xp,
		       COUNT(*) OVER() AS total_competitors
		FROM users u
		JOIN user_profiles up ON u.id = up.user_id
		JOIN user_gamification ug ON u.id = ug.user_id
		LEFT JOIN (
			SELECT user_id, COALESCE(SUM(xp_earned), 0) AS week_xp
			FROM user_activity_logs
			WHERE created_at >= ` + wibWeekStartExpr + `
			GROUP BY user_id
		) weekly ON weekly.user_id = u.id
		WHERE ug.xp >= $1 AND ug.xp < $2
		ORDER BY week_xp DESC, ug.streak DESC, ug.xp DESC, u.id ASC
		LIMIT $3
	`

	rows, err := r.db.Pool.Query(ctx, query, minXP, maxXP, limit)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query division standings: %w", err)
	}
	defer rows.Close()

	capacity := limit
	if capacity <= 0 {
		capacity = 0
	}
	entries := make([]LeaderboardEntry, 0, capacity)
	totalCompetitors := 0
	for rows.Next() {
		var e LeaderboardEntry
		var rowTotal int
		if err := rows.Scan(
			&e.UserID,
			&e.Name,
			&e.Username,
			&e.AvatarURL,
			&e.TotalXP,
			&e.CurrentLevel,
			&e.Streak,
			&e.WeeklyXP,
			&rowTotal,
		); err != nil {
			return nil, 0, fmt.Errorf("failed to scan leaderboard entry: %w", err)
		}
		totalCompetitors = rowTotal
		entries = append(entries, e)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, fmt.Errorf("rows iteration error in leaderboard: %w", err)
	}
	return entries, totalCompetitors, nil
}

// GetUserStanding queries a single user's current ranking statistics and exact SQL division rank
func (r *PostgresRepository) GetUserStanding(ctx context.Context, userID string) (*LeaderboardEntry, error) {
	if err := validateUserUUID(userID); err != nil {
		return nil, err
	}

	query := `
		WITH target AS (
			SELECT u.id, up.name, up.username, up.avatar_url, ug.xp, ug.current_level, ug.streak,
			       COALESCE((
			           SELECT SUM(xp_earned)
			           FROM user_activity_logs
			           WHERE user_id = u.id AND created_at >= ` + wibWeekStartExpr + `
			       ), 0) AS week_xp
			FROM users u
			JOIN user_profiles up ON u.id = up.user_id
			JOIN user_gamification ug ON u.id = ug.user_id
			WHERE u.id = $1::uuid
		),
		div_bounds AS (
			SELECT CASE
				WHEN xp >= 1500 THEN 1500
				WHEN xp >= 800 THEN 800
				WHEN xp >= 300 THEN 300
				ELSE 0
			END AS min_xp,
			CASE
				WHEN xp >= 1500 THEN 2147483647
				WHEN xp >= 800 THEN 1500
				WHEN xp >= 300 THEN 800
				ELSE 300
			END AS max_xp
			FROM target
		),
		peers AS (
			SELECT u.id, ug.xp, ug.streak,
			       COALESCE(weekly.week_xp, 0) AS week_xp
			FROM users u
			JOIN user_gamification ug ON u.id = ug.user_id
			CROSS JOIN div_bounds db
			LEFT JOIN (
				SELECT user_id, COALESCE(SUM(xp_earned), 0) AS week_xp
				FROM user_activity_logs
				WHERE created_at >= ` + wibWeekStartExpr + `
				GROUP BY user_id
			) weekly ON weekly.user_id = u.id
			WHERE ug.xp >= db.min_xp AND ug.xp < db.max_xp
		)
		SELECT t.id, t.name, t.username, t.avatar_url, t.xp, t.current_level, t.streak, t.week_xp,
		       1 + (
		           SELECT COUNT(*)
		           FROM peers p
		           WHERE (p.week_xp, p.streak, p.xp) > (t.week_xp, t.streak, t.xp)
		              OR ((p.week_xp, p.streak, p.xp) = (t.week_xp, t.streak, t.xp) AND p.id < t.id)
		       ) AS division_rank
		FROM target t
	`
	var e LeaderboardEntry
	err := r.db.Pool.QueryRow(ctx, query, userID).Scan(
		&e.UserID,
		&e.Name,
		&e.Username,
		&e.AvatarURL,
		&e.TotalXP,
		&e.CurrentLevel,
		&e.Streak,
		&e.WeeklyXP,
		&e.Rank,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, user.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to query user standing: %w", err)
	}
	return &e, nil
}

