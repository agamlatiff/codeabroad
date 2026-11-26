package leaderboard

import (
	"context"
	"errors"
	"fmt"

	"merantalk/backend/infrastructure/postgres"
	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/progression"
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

const wibWeekStartExpr = `(date_trunc('week', NOW() AT TIME ZONE 'Asia/Jakarta') AT TIME ZONE 'Asia/Jakarta')`
const wibPrevWeekStartExpr = `((date_trunc('week', NOW() AT TIME ZONE 'Asia/Jakarta') - INTERVAL '7 days') AT TIME ZONE 'Asia/Jakarta')`

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

const previousWeekStandingQuery = `
	WITH target AS (
		SELECT u.id, ug.xp, ug.streak,
		       COALESCE((
		           SELECT SUM(xp_earned)
		           FROM user_activity_logs
		           WHERE user_id = u.id
		             AND created_at >= ` + wibPrevWeekStartExpr + `
		             AND created_at < ` + wibWeekStartExpr + `
		       ), 0)::int AS week_xp
		FROM users u
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
		END AS max_xp,
		CASE
			WHEN xp >= 1500 THEN 'diamond'
			WHEN xp >= 800 THEN 'gold'
			WHEN xp >= 300 THEN 'silver'
			ELSE 'bronze'
		END AS division
		FROM target
	),
	peers AS (
		SELECT u.id, ug.xp, ug.streak,
		       COALESCE(weekly.week_xp, 0)::int AS week_xp
		FROM users u
		JOIN user_gamification ug ON u.id = ug.user_id
		CROSS JOIN div_bounds db
		LEFT JOIN (
			SELECT user_id, COALESCE(SUM(xp_earned), 0) AS week_xp
			FROM user_activity_logs
			WHERE created_at >= ` + wibPrevWeekStartExpr + `
			  AND created_at < ` + wibWeekStartExpr + `
			GROUP BY user_id
		) weekly ON weekly.user_id = u.id
		WHERE ug.xp >= db.min_xp AND ug.xp < db.max_xp
	)
	SELECT db.division, t.week_xp,
	       1 + (
	           SELECT COUNT(*)
	           FROM peers p
	           WHERE (p.week_xp, p.streak, p.xp) > (t.week_xp, t.streak, t.xp)
	              OR ((p.week_xp, p.streak, p.xp) = (t.week_xp, t.streak, t.xp) AND p.id < t.id)
	       )::int AS division_rank
	FROM target t
	CROSS JOIN div_bounds db
`

// GetPreviousWeekRewardStatus checks whether the user already claimed or is eligible for last week's Top-3 Gems prize.
func (r *PostgresRepository) GetPreviousWeekRewardStatus(
	ctx context.Context,
	userID string,
	seasonYear int,
	seasonWeek int,
) (*PendingWeeklyReward, error) {
	if err := validateUserUUID(userID); err != nil {
		return nil, err
	}

	var claimed PendingWeeklyReward
	var divStr string
	err := r.db.Pool.QueryRow(
		ctx,
		`SELECT division, rank, weekly_xp, gems_awarded
		 FROM leaderboard_weekly_rewards
		 WHERE user_id = $1::uuid AND season_year = $2 AND season_week = $3
		 LIMIT 1`,
		userID, seasonYear, seasonWeek,
	).Scan(&divStr, &claimed.Rank, &claimed.WeeklyXP, &claimed.GemsAwarded)
	if err == nil {
		claimed.SeasonYear = seasonYear
		claimed.SeasonWeek = seasonWeek
		claimed.Division = LeagueDivision(divStr)
		claimed.Claimed = true
		return &claimed, nil
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, fmt.Errorf("failed to query claimed weekly reward: %w", err)
	}

	var prevDiv string
	var prevWeekXP, prevRank int
	if err := r.db.Pool.QueryRow(ctx, previousWeekStandingQuery, userID).Scan(&prevDiv, &prevWeekXP, &prevRank); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to compute previous week standing: %w", err)
	}
	gemsAwarded := NewHelper().WeeklyPrizeGems(prevRank)
	if prevWeekXP <= 0 || gemsAwarded <= 0 {
		return nil, nil
	}

	return &PendingWeeklyReward{
		SeasonYear:  seasonYear,
		SeasonWeek:  seasonWeek,
		Division:    ParseDivision(prevDiv),
		Rank:        prevRank,
		WeeklyXP:    prevWeekXP,
		GemsAwarded: gemsAwarded,
		Claimed:     false,
	}, nil
}

// ClaimPreviousWeekRewardTx atomically verifies last week's Top-3 standing and credits Gems exactly once per ISO week.
func (r *PostgresRepository) ClaimPreviousWeekRewardTx(
	ctx context.Context,
	userID string,
	seasonYear int,
	seasonWeek int,
) (*ClaimWeeklyRewardResponse, error) {
	if err := validateUserUUID(userID); err != nil {
		return nil, err
	}

	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin weekly reward claim tx: %w", err)
	}
	defer progression.RollbackTx(ctx, tx, "leaderboard.ClaimPreviousWeekRewardTx")

	var currentGems int
	if err := tx.QueryRow(
		ctx,
		`SELECT gems FROM user_gamification WHERE user_id = $1::uuid FOR UPDATE`,
		userID,
	).Scan(&currentGems); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, user.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to lock user gamification for reward claim: %w", err)
	}

	var existingID string
	checkErr := tx.QueryRow(
		ctx,
		`SELECT id::text FROM leaderboard_weekly_rewards WHERE user_id = $1::uuid AND season_year = $2 AND season_week = $3 LIMIT 1`,
		userID, seasonYear, seasonWeek,
	).Scan(&existingID)
	if checkErr == nil {
		return nil, ErrWeeklyRewardAlreadyClaimed
	}
	if !errors.Is(checkErr, pgx.ErrNoRows) {
		return nil, fmt.Errorf("failed to verify weekly reward claim uniqueness: %w", checkErr)
	}

	var prevDiv string
	var prevWeekXP, prevRank int
	if err := tx.QueryRow(ctx, previousWeekStandingQuery, userID).Scan(&prevDiv, &prevWeekXP, &prevRank); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNoPendingWeeklyReward
		}
		return nil, fmt.Errorf("failed to evaluate previous week podium standing: %w", err)
	}

	division := ParseDivision(prevDiv)
	gemsAwarded := NewHelper().WeeklyPrizeGems(prevRank)
	if prevWeekXP <= 0 || gemsAwarded <= 0 {
		return nil, ErrNoPendingWeeklyReward
	}

	var insertedID string
	if err := tx.QueryRow(
		ctx,
		`INSERT INTO leaderboard_weekly_rewards (user_id, season_year, season_week, division, rank, weekly_xp, gems_awarded)
		 VALUES ($1::uuid, $2, $3, $4, $5, $6, $7)
		 ON CONFLICT (user_id, season_year, season_week) DO NOTHING
		 RETURNING id::text`,
		userID, seasonYear, seasonWeek, string(division), prevRank, prevWeekXP, gemsAwarded,
	).Scan(&insertedID); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrWeeklyRewardAlreadyClaimed
		}
		return nil, fmt.Errorf("failed to record weekly reward claim: %w", err)
	}

	var newGems int
	if err := tx.QueryRow(
		ctx,
		`UPDATE user_gamification SET gems = gems + $2, updated_at = NOW() WHERE user_id = $1::uuid RETURNING gems`,
		userID, gemsAwarded,
	).Scan(&newGems); err != nil {
		return nil, fmt.Errorf("failed to credit weekly reward gems: %w", err)
	}

	if _, err := tx.Exec(
		ctx,
		`INSERT INTO user_activity_logs (user_id, activity_type, xp_earned, metadata, created_at)
		 VALUES ($1::uuid, 'leaderboard_reward_claimed', 0, jsonb_build_object(
			'season_year', $2::int,
			'season_week', $3::int,
			'division', $4::text,
			'rank', $5::int,
			'weekly_xp', $6::int,
			'gems_awarded', $7::int
		 ), NOW())`,
		userID, seasonYear, seasonWeek, string(division), prevRank, prevWeekXP, gemsAwarded,
	); err != nil {
		return nil, fmt.Errorf("failed to log leaderboard reward claim: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit weekly reward claim tx: %w", err)
	}

	return &ClaimWeeklyRewardResponse{
		Reward: PendingWeeklyReward{
			SeasonYear:  seasonYear,
			SeasonWeek:  seasonWeek,
			Division:    division,
			Rank:        prevRank,
			WeeklyXP:    prevWeekXP,
			GemsAwarded: gemsAwarded,
			Claimed:     true,
		},
		NewGems: newGems,
	}, nil
}

