package user

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"codeabroad/backend/infrastructure/postgres"
	"github.com/jackc/pgx/v5"
)

// PostgresRepository implements user.Repository across the 3 normalized pillars
type PostgresRepository struct {
	db *postgres.PostgresDB
}

// NewRepository creates a new PostgreSQL user repository instance
func NewRepository(db *postgres.PostgresDB) Repository {
	return &PostgresRepository{db: db}
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

func scanUser(row pgx.Row, u *User) error {
	return row.Scan(
		&u.ID,
		&u.Name,
		&u.Username,
		&u.Email,
		&u.PasswordHash,
		&u.Bio,
		&u.DailyGoalMinutes,
		&u.IsOnboarded,
		&u.HasSeenRoadmapTour,
		&u.PreferredRoadmapView,
		&u.XP,
		&u.CurrentLevel,
		&u.Streak,
		&u.Gems,
		&u.LastActiveAt,
		&u.CreatedAt,
		&u.UpdatedAt,
	)
}

// Create inserts a new user across all 3 normalized pillars in a single atomic Writeable CTE (1 DB round-trip)
func (r *PostgresRepository) Create(ctx context.Context, u *User) error {
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
		u.Email,
		u.PasswordHash,
		u.Name,
		u.Username,
		u.IsOnboarded,
		u.DailyGoalMinutes,
		u.XP,
		u.CurrentLevel,
		u.Streak,
		u.Gems,
	).Scan(&u.ID, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		if strings.Contains(err.Error(), "users_email_key") {
			return ErrEmailAlreadyExists
		}
		if strings.Contains(err.Error(), "user_profiles_username_key") {
			return ErrUsernameTaken
		}
		return fmt.Errorf("failed to create 3-pillar user account: %w", err)
	}
	return nil
}

// GetByEmail retrieves a user by their unique email address across all 3 pillars
func (r *PostgresRepository) GetByEmail(ctx context.Context, email string) (*User, error) {
	query := `SELECT ` + userSelectColumns + userFromClause + ` WHERE u.email = $1`
	var u User
	err := scanUser(r.db.Pool.QueryRow(ctx, query, email), &u)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}
	return &u, nil
}

// GetByUsername retrieves a user by their unique username handle across all 3 pillars
func (r *PostgresRepository) GetByUsername(ctx context.Context, username string) (*User, error) {
	query := `SELECT ` + userSelectColumns + userFromClause + ` WHERE up.username = $1`
	var u User
	err := scanUser(r.db.Pool.QueryRow(ctx, query, username), &u)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by username: %w", err)
	}
	return &u, nil
}

// GetByID retrieves a user by their unique UUID across all 3 pillars
func (r *PostgresRepository) GetByID(ctx context.Context, id string) (*User, error) {
	query := `SELECT ` + userSelectColumns + userFromClause + ` WHERE u.id = $1`
	var u User
	err := scanUser(r.db.Pool.QueryRow(ctx, query, id), &u)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by id: %w", err)
	}
	return &u, nil
}

// UpdateProfile updates user profile preferences with parameterized values
func (r *PostgresRepository) UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error) {
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
		return nil, ErrUserNotFound
	}
	return r.GetByID(ctx, userID)
}

// SetOnboarded marks the user as having finished the 3-step onboarding flow and records their pace goal
func (r *PostgresRepository) SetOnboarded(ctx context.Context, userID string, dailyGoalMinutes int) error {
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
		return ErrUserNotFound
	}
	return nil
}

// UpdateGamification updates a user's XP, level, streak counter, and last active timestamp (Pillar 3)
func (r *PostgresRepository) UpdateGamification(
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
		return ErrUserNotFound
	}
	return nil
}

// AddGems increments or decrements a user's gems balance atomically and returns the new total (Pillar 3)
func (r *PostgresRepository) AddGems(ctx context.Context, userID string, gems int) (int, error) {
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
			return 0, ErrUserNotFound
		}
		return 0, fmt.Errorf("failed to update user gems: %w", err)
	}
	return newTotal, nil
}

// LogActivity inserts a user activity event and updates last_active_at in a single atomic Writeable CTE (1 DB round-trip)
func (r *PostgresRepository) LogActivity(ctx context.Context, log *UserActivityLog) error {
	var metaJSON []byte
	if log.Metadata != nil {
		var err error
		metaJSON, err = json.Marshal(log.Metadata)
		if err != nil {
			return fmt.Errorf("failed to marshal activity metadata: %w", err)
		}
	}

	query := `
		WITH inserted_log AS (
			INSERT INTO user_activity_logs (user_id, activity_type, xp_earned, metadata, created_at)
			VALUES ($1, $2, $3, $4, NOW())
		)
		UPDATE user_gamification
		SET last_active_at = NOW(),
		    updated_at = NOW()
		WHERE user_id = $1
	`
	if _, err := r.db.Pool.Exec(ctx, query, log.UserID, log.ActivityType, log.XPEarned, metaJSON); err != nil {
		return fmt.Errorf("failed to log user activity: %w", err)
	}
	return nil
}

// HasActivityInRange checks if the user has any logged activity within [startTime, endTime) using SARGable index scan
func (r *PostgresRepository) HasActivityInRange(
	ctx context.Context,
	userID string,
	startTime time.Time,
	endTime time.Time,
) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT 1 FROM user_activity_logs
			WHERE user_id = $1
			  AND created_at >= $2
			  AND created_at < $3
		)
	`
	var exists bool
	if err := r.db.Pool.QueryRow(ctx, query, userID, startTime, endTime).Scan(&exists); err != nil {
		return false, fmt.Errorf("failed to check user activity in range: %w", err)
	}
	return exists, nil
}

// GetDailyActivityStatsSince aggregates daily XP and completed lesson counts since a cutoff time
func (r *PostgresRepository) GetDailyActivityStatsSince(
	ctx context.Context,
	userID string,
	since time.Time,
) (map[string]DailyActivityStat, error) {
	query := `
		SELECT act_date, SUM(xp_earned) AS total_xp, SUM(lessons_count) AS total_lessons
		FROM (
			SELECT TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS act_date,
			       xp_earned,
			       0 AS lessons_count
			FROM user_activity_logs
			WHERE user_id = $1 AND created_at >= $2
			UNION ALL
			SELECT TO_CHAR(completed_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS act_date,
			       0 AS xp_earned,
			       1 AS lessons_count
			FROM user_lesson_progress
			WHERE user_id = $1 AND is_completed = true AND completed_at >= $2
		) combined
		GROUP BY act_date
	`
	rows, err := r.db.Pool.Query(ctx, query, userID, since)
	if err != nil {
		return nil, fmt.Errorf("failed to query daily activity stats: %w", err)
	}
	defer rows.Close()

	dailyStats := make(map[string]DailyActivityStat)
	for rows.Next() {
		var dateStr string
		var stat DailyActivityStat
		if err := rows.Scan(&dateStr, &stat.XPEarned, &stat.LessonsCount); err != nil {
			return nil, fmt.Errorf("failed to scan daily activity stat: %w", err)
		}
		dailyStats[dateStr] = stat
	}
	return dailyStats, rows.Err()
}

// ClaimDailyReward atomically locks user_gamification, verifies claim status today, awards XP/levels, and logs activity
func (r *PostgresRepository) ClaimDailyReward(
	ctx context.Context,
	userID string,
	rewardType string,
	xpAwarded int,
	newLevel int,
) (*DailyRewardClaimResponse, error) {
	activityType := "daily_" + rewardType + "_claim"
	now := time.Now().UTC()
	today := now.Format("2006-01-02")
	startOfToday := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)

	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin daily reward transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	var currentXP, streak int
	lockQuery := `
		SELECT xp, streak
		FROM user_gamification
		WHERE user_id = $1
		FOR UPDATE
	`
	if err := tx.QueryRow(ctx, lockQuery, userID).Scan(&currentXP, &streak); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to lock user gamification for daily reward: %w", err)
	}

	checkQuery := `
		SELECT EXISTS (
			SELECT 1 FROM user_activity_logs
			WHERE user_id = $1
			  AND activity_type = $2
			  AND created_at >= $3
		)
	`
	var alreadyClaimed bool
	if err := tx.QueryRow(ctx, checkQuery, userID, activityType, startOfToday).Scan(&alreadyClaimed); err == nil && alreadyClaimed {
		return nil, ErrDailyRewardAlreadyClaimed
	}

	metaJSON, _ := json.Marshal(map[string]interface{}{
		"reward_type": rewardType,
		"date":        today,
		"xp_awarded":  xpAwarded,
	})

	updateQuery := `
		WITH updated_stats AS (
			UPDATE user_gamification
			SET xp = xp + $2,
			    current_level = $3,
			    last_active_at = NOW(),
			    updated_at = NOW()
			WHERE user_id = $1
			RETURNING xp, current_level, streak
		)
		INSERT INTO user_activity_logs (user_id, activity_type, xp_earned, metadata, created_at)
		SELECT $1, $4, $2, $5, NOW()
		FROM updated_stats
		RETURNING (SELECT xp FROM updated_stats), (SELECT current_level FROM updated_stats), (SELECT streak FROM updated_stats)
	`
	var updatedXP, updatedLevel, currentStreak int
	err = tx.QueryRow(ctx, updateQuery, userID, xpAwarded, newLevel, activityType, metaJSON).Scan(&updatedXP, &updatedLevel, &currentStreak)
	if err != nil {
		return nil, fmt.Errorf("failed to execute atomic daily reward claim: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit daily reward claim: %w", err)
	}

	return &DailyRewardClaimResponse{
		RewardType:   rewardType,
		XPAwarded:    xpAwarded,
		CurrentXP:    updatedXP,
		CurrentLevel: updatedLevel,
		Streak:       currentStreak,
		ClaimedAt:    now.Format(time.RFC3339),
	}, nil
}

// GetDailyRewardsStatus reports whether lesson milestones or golden chests have already been claimed today
func (r *PostgresRepository) GetDailyRewardsStatus(ctx context.Context, userID string) (*DailyRewardsStatusResponse, error) {
	now := time.Now().UTC()
	startOfToday := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)

	query := `
		SELECT 
			EXISTS (
				SELECT 1 FROM user_activity_logs
				WHERE user_id = $1 
				  AND activity_type = 'daily_lesson_milestone_claim'
				  AND created_at >= $2
			) AS lesson_milestone_claimed,
			EXISTS (
				SELECT 1 FROM user_activity_logs
				WHERE user_id = $1 
				  AND activity_type = 'daily_golden_chest_claim'
				  AND created_at >= $2
			) AS golden_chest_claimed
	`
	var status DailyRewardsStatusResponse
	status.Date = now.Format("2006-01-02")

	err := r.db.Pool.QueryRow(ctx, query, userID, startOfToday).Scan(
		&status.LessonMilestoneClaimed,
		&status.GoldenChestClaimed,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to query daily rewards status: %w", err)
	}
	return &status, nil
}

