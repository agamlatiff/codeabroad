package user

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"merantalk/backend/infrastructure/postgres"
	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/progression"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
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
	up.avatar_url,
	up.daily_goal_minutes,
	up.is_onboarded,
	up.has_seen_roadmap_tour,
	ug.xp, 
	ug.current_level, 
	ug.streak, 
	ug.gems, 
	ug.last_active_at,
	ug.xp_booster_expires_at,
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
		&u.AvatarURL,
		&u.DailyGoalMinutes,
		&u.IsOnboarded,
		&u.HasSeenRoadmapTour,
		&u.XP,
		&u.CurrentLevel,
		&u.Streak,
		&u.Gems,
		&u.LastActiveAt,
		&u.XPBoosterExpiresAt,
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
			INSERT INTO user_profiles (user_id, name, username, avatar_url, is_onboarded, daily_goal_minutes)
			SELECT id, $3, $4, $5, $6, $7 FROM new_user
		),
		new_gamification AS (
			INSERT INTO user_gamification (user_id, xp, current_level, streak, gems)
			SELECT id, $8, $9, $10, $11 FROM new_user
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
		u.AvatarURL,
		u.IsOnboarded,
		u.DailyGoalMinutes,
		u.XP,
		u.CurrentLevel,
		u.Streak,
		u.Gems,
	).Scan(&u.ID, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			switch pgErr.ConstraintName {
			case "users_email_key":
				return ErrEmailAlreadyExists
			case "user_profiles_username_key":
				return ErrUsernameTaken
			}
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
	if err := apperror.ValidateUserUUID(id); err != nil {
		return nil, err
	}
	query := `SELECT ` + userSelectColumns + userFromClause + ` WHERE u.id = $1::uuid`
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

// UpdateProfile updates user profile preferences and returns the updated aggregate in a single CTE round-trip.
func (r *PostgresRepository) UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, err
	}
	query := `
		WITH updated_profile AS (
			UPDATE user_profiles
			SET name = COALESCE($2, name),
			    bio = COALESCE($3, bio),
			    avatar_url = CASE
			        WHEN $4::text IS NULL THEN avatar_url
			        WHEN $4::text = '' THEN NULL
			        ELSE $4::text
			    END,
			    daily_goal_minutes = COALESCE($5, daily_goal_minutes),
			    has_seen_roadmap_tour = COALESCE($6, has_seen_roadmap_tour),
			    updated_at = NOW()
			WHERE user_id = $1::uuid
			RETURNING user_id, name, username, bio, avatar_url, daily_goal_minutes, is_onboarded, has_seen_roadmap_tour
		)
		SELECT
			u.id,
			up.name,
			up.username,
			u.email,
			u.password_hash,
			up.bio,
			up.avatar_url,
			up.daily_goal_minutes,
			up.is_onboarded,
			up.has_seen_roadmap_tour,
			ug.xp,
			ug.current_level,
			ug.streak,
			ug.gems,
			ug.last_active_at,
			ug.xp_booster_expires_at,
			u.created_at,
			u.updated_at
		FROM updated_profile up
		JOIN users u ON u.id = up.user_id
		JOIN user_gamification ug ON ug.user_id = up.user_id
	`
	var u User
	err := scanUser(
		r.db.Pool.QueryRow(
			ctx,
			query,
			userID,
			req.Name,
			req.Bio,
			req.AvatarURL,
			req.DailyGoalMinutes,
			req.HasSeenRoadmapTour,
		),
		&u,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to update user profile: %w", err)
	}
	return &u, nil
}

// SetOnboarded marks the user as having finished the 3-step onboarding flow and records their pace goal
func (r *PostgresRepository) SetOnboarded(ctx context.Context, userID string, dailyGoalMinutes int) error {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return err
	}
	query := `
		UPDATE user_profiles
		SET is_onboarded = true,
		    daily_goal_minutes = COALESCE(NULLIF($2, 0), daily_goal_minutes),
		    updated_at = NOW()
		WHERE user_id = NULLIF($1, '')::uuid
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
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return err
	}
	query := `
		UPDATE user_gamification
		SET xp = $2,
		    current_level = $3,
		    streak = $4,
		    last_active_at = $5,
		    updated_at = NOW()
		WHERE user_id = NULLIF($1, '')::uuid
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
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return 0, err
	}
	query := `
		UPDATE user_gamification
		SET gems = GREATEST(0, gems + $2),
		    updated_at = NOW()
		WHERE user_id = NULLIF($1, '')::uuid
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

// consumeStreakFreezeAndComputeTx computes the next streak inside an open transaction
// (where user_gamification is already locked FOR UPDATE) and deducts consumed streak-freeze items.
func consumeStreakFreezeAndComputeTx(
	ctx context.Context,
	tx pgx.Tx,
	userID string,
	currentStreak int,
	lastActiveAt *time.Time,
	now time.Time,
) (int, error) {
	var availableFreezes int
	err := tx.QueryRow(
		ctx,
		`SELECT quantity FROM user_inventories WHERE user_id = $1::uuid AND item_id = 'streak-freeze' FOR UPDATE`,
		userID,
	).Scan(&availableFreezes)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			availableFreezes = 0
		} else {
			return 0, fmt.Errorf("failed to inspect streak-freeze inventory: %w", err)
		}
	}

	newStreak, _, freezesUsed := progression.EvaluateDailyStreakWithFreeze(lastActiveAt, currentStreak, availableFreezes, now)
	if freezesUsed > 0 {
		if _, err := tx.Exec(
			ctx,
			`UPDATE user_inventories SET quantity = quantity - $2, updated_at = NOW() WHERE user_id = $1::uuid AND item_id = 'streak-freeze' AND quantity >= $2`,
			userID, freezesUsed,
		); err != nil {
			return 0, fmt.Errorf("failed to consume streak-freeze: %w", err)
		}
		if _, err := tx.Exec(
			ctx,
			`INSERT INTO user_activity_logs (user_id, activity_type, xp_earned, metadata, created_at)
			 VALUES ($1::uuid, 'streak_freeze_consumed', 0, jsonb_build_object('freezes_used', $2::int), NOW())`,
			userID, freezesUsed,
		); err != nil {
			return 0, fmt.Errorf("failed to log streak freeze consumption: %w", err)
		}
	}
	return newStreak, nil
}

// LogActivity inserts a user activity event and atomically updates streak & last_active_at (WIB),
// consuming streak-freeze inventory when bridging missed days.
func (r *PostgresRepository) LogActivity(ctx context.Context, log *UserActivityLog) error {
	if log == nil {
		return apperror.ErrBadRequest
	}
	if err := apperror.ValidateUserUUID(log.UserID); err != nil {
		return err
	}
	var metaJSON []byte
	if log.Metadata != nil {
		var err error
		metaJSON, err = json.Marshal(log.Metadata)
		if err != nil {
			return fmt.Errorf("failed to marshal activity metadata: %w", err)
		}
	}

	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin log activity transaction: %w", err)
	}
	defer progression.RollbackTx(ctx, tx, "user.LogActivity")

	var currentStreak int
	var lastActiveAt *time.Time
	var dbNow time.Time
	err = tx.QueryRow(
		ctx,
		`SELECT streak, last_active_at, NOW() FROM user_gamification WHERE user_id = $1::uuid FOR UPDATE`,
		log.UserID,
	).Scan(&currentStreak, &lastActiveAt, &dbNow)
	hasGamificationRow := (err == nil)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return fmt.Errorf("failed to lock user gamification for activity log: %w", err)
	}

	if hasGamificationRow {
		newStreak, err := consumeStreakFreezeAndComputeTx(ctx, tx, log.UserID, currentStreak, lastActiveAt, dbNow)
		if err != nil {
			return err
		}
		if _, err := tx.Exec(
			ctx,
			`UPDATE user_gamification SET streak = $2, last_active_at = NOW(), updated_at = NOW() WHERE user_id = $1::uuid`,
			log.UserID, newStreak,
		); err != nil {
			return fmt.Errorf("failed to update streak on activity log: %w", err)
		}
	}

	if _, err := tx.Exec(
		ctx,
		`INSERT INTO user_activity_logs (user_id, activity_type, xp_earned, metadata, created_at)
		 VALUES ($1::uuid, $2, $3, $4, NOW())`,
		log.UserID, log.ActivityType, log.XPEarned, metaJSON,
	); err != nil {
		return fmt.Errorf("failed to log user activity: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit log activity transaction: %w", err)
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
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return false, err
	}
	query := `
		SELECT EXISTS (
			SELECT 1 FROM user_activity_logs
			WHERE user_id = NULLIF($1, '')::uuid
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

// EnsureDailyLogin atomically logs a daily_login activity if no activity exists in [startTime, endTime)
func (r *PostgresRepository) EnsureDailyLogin(
	ctx context.Context,
	userID string,
	dateStr string,
	startTime time.Time,
	endTime time.Time,
) (bool, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return false, err
	}
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to begin daily login transaction: %w", err)
	}
	defer progression.RollbackTx(ctx, tx, "user.EnsureDailyLogin")

	if _, err := tx.Exec(ctx, `SELECT pg_advisory_xact_lock(hashtextextended('daily_login:' || $1 || ':' || $2, 0))`, userID, dateStr); err != nil {
		return false, fmt.Errorf("failed to acquire daily login lock: %w", err)
	}

	var exists bool
	checkQuery := `
		SELECT EXISTS (
			SELECT 1 FROM user_activity_logs
			WHERE user_id = $1::uuid
			  AND created_at >= $2
			  AND created_at < $3
		)
	`
	if err := tx.QueryRow(ctx, checkQuery, userID, startTime, endTime).Scan(&exists); err != nil {
		return false, fmt.Errorf("failed to check daily activity in transaction: %w", err)
	}
	if exists {
		return false, nil
	}

	metaJSON, err := json.Marshal(map[string]interface{}{"date": dateStr})
	if err != nil {
		return false, fmt.Errorf("failed to marshal daily login metadata: %w", err)
	}

	var currentStreak int
	var lastActiveAt *time.Time
	var dbNow time.Time
	err = tx.QueryRow(
		ctx,
		`SELECT streak, last_active_at, NOW() FROM user_gamification WHERE user_id = $1::uuid FOR UPDATE`,
		userID,
	).Scan(&currentStreak, &lastActiveAt, &dbNow)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return false, fmt.Errorf("failed to lock user gamification for daily login: %w", err)
	}
	if err == nil {
		newStreak, err := consumeStreakFreezeAndComputeTx(ctx, tx, userID, currentStreak, lastActiveAt, dbNow)
		if err != nil {
			return false, err
		}
		if _, err := tx.Exec(
			ctx,
			`UPDATE user_gamification SET streak = $2, last_active_at = NOW(), updated_at = NOW() WHERE user_id = $1::uuid`,
			userID, newStreak,
		); err != nil {
			return false, fmt.Errorf("failed to update streak on daily login: %w", err)
		}
	}

	if _, err := tx.Exec(
		ctx,
		`INSERT INTO user_activity_logs (user_id, activity_type, xp_earned, metadata, created_at)
		 VALUES ($1::uuid, 'daily_login', 0, $2, NOW())`,
		userID, metaJSON,
	); err != nil {
		return false, fmt.Errorf("failed to insert daily login activity: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return false, fmt.Errorf("failed to commit daily login transaction: %w", err)
	}
	return true, nil
}

// GetDailyActivityStatsSince aggregates daily XP and completed lesson counts since a cutoff time
func (r *PostgresRepository) GetDailyActivityStatsSince(
	ctx context.Context,
	userID string,
	since time.Time,
) (map[string]DailyActivityStat, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, err
	}
	query := `
		SELECT act_date, SUM(xp_earned) AS total_xp, SUM(lessons_count) AS total_lessons
		FROM (
			SELECT TO_CHAR(created_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') AS act_date,
			       xp_earned,
			       0 AS lessons_count
			FROM user_activity_logs
			WHERE user_id = $1::uuid AND created_at >= $2
			UNION ALL
			SELECT TO_CHAR(completed_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') AS act_date,
			       0 AS xp_earned,
			       1 AS lessons_count
			FROM user_lesson_progress
			WHERE user_id = $1::uuid AND is_completed = true AND is_skipped = false AND completed_at >= $2
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

// ClaimDailyReward atomically locks user_gamification, verifies DB WIB eligibility & claim uniqueness, awards XP/gems/levels, and logs activity
func (r *PostgresRepository) ClaimDailyReward(
	ctx context.Context,
	userID string,
	rewardType string,
	xpAwarded int,
	gemsAwarded int,
) (*DailyRewardClaimResponse, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, err
	}
	activityType := "daily_" + rewardType + "_claim"

	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin daily reward transaction: %w", err)
	}
	defer progression.RollbackTx(ctx, tx, "user.ClaimDailyReward")

	var currentXP, streak int
	var lastActiveAt *time.Time
	var wibDate string
	var dbNow time.Time
	lockQuery := `
		SELECT xp, streak, last_active_at, TO_CHAR(NOW() AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD'), NOW()
		FROM user_gamification
		WHERE user_id = $1::uuid
		FOR UPDATE
	`
	if err := tx.QueryRow(ctx, lockQuery, userID).Scan(&currentXP, &streak, &lastActiveAt, &wibDate, &dbNow); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to lock user gamification for daily reward: %w", err)
	}

	var alreadyClaimed bool
	checkQuery := `
		SELECT EXISTS (
			SELECT 1 FROM user_activity_logs
			WHERE user_id = $1::uuid
			  AND activity_type = $2
			  AND created_at >= ((NOW() AT TIME ZONE 'Asia/Jakarta')::date AT TIME ZONE 'Asia/Jakarta')
		)
	`
	if err := tx.QueryRow(ctx, checkQuery, userID, activityType).Scan(&alreadyClaimed); err != nil {
		return nil, fmt.Errorf("failed to verify daily reward claim status: %w", err)
	}
	if alreadyClaimed {
		return nil, ErrDailyRewardAlreadyClaimed
	}

	if rewardType == "vocab_quest" {
		var todayFlashcards int
		fcQuery := `
			SELECT COUNT(*)::int
			FROM user_flashcard_progress
			WHERE user_id = $1::uuid
			  AND last_reviewed_at >= ((NOW() AT TIME ZONE 'Asia/Jakarta')::date AT TIME ZONE 'Asia/Jakarta')
		`
		if err := tx.QueryRow(ctx, fcQuery, userID).Scan(&todayFlashcards); err != nil {
			return nil, fmt.Errorf("failed to verify daily flashcard review prerequisite: %w", err)
		}
		if todayFlashcards < VocabQuestDailyFlashcardThreshold {
			return nil, ErrDailyRewardNotUnlocked
		}
	}

	if rewardType == "golden_chest" {
		var todayEarnedXP int
		xpQuery := `
			SELECT COALESCE(SUM(xp_earned), 0)
			FROM user_activity_logs
			WHERE user_id = $1::uuid
			  AND activity_type <> 'daily_golden_chest_claim'
			  AND created_at >= ((NOW() AT TIME ZONE 'Asia/Jakarta')::date AT TIME ZONE 'Asia/Jakarta')
		`
		if err := tx.QueryRow(ctx, xpQuery, userID).Scan(&todayEarnedXP); err != nil {
			return nil, fmt.Errorf("failed to verify daily xp prerequisite: %w", err)
		}
		if todayEarnedXP < GoldenChestDailyXPThreshold {
			return nil, ErrDailyRewardNotUnlocked
		}
	}

	newStreak, err := consumeStreakFreezeAndComputeTx(ctx, tx, userID, streak, lastActiveAt, dbNow)
	if err != nil {
		return nil, err
	}

	newLevel := CalculateLevel(currentXP + xpAwarded)

	metaJSON, err := json.Marshal(map[string]interface{}{
		"reward_type":  rewardType,
		"date":         wibDate,
		"xp_awarded":   xpAwarded,
		"gems_awarded": gemsAwarded,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to marshal daily reward metadata: %w", err)
	}

	updateQuery := `
		WITH updated_stats AS (
			UPDATE user_gamification
			SET xp = xp + $2,
			    current_level = $3,
			    gems = GREATEST(0, gems + $4),
			    streak = $7,
			    last_active_at = NOW(),
			    updated_at = NOW()
			WHERE user_id = $1::uuid
			RETURNING xp, current_level, gems, streak
		),
		inserted_log AS (
			INSERT INTO user_activity_logs (user_id, activity_type, xp_earned, metadata, created_at)
			SELECT $1::uuid, $5, $2, $6, NOW()
			FROM updated_stats
			RETURNING created_at
		)
		SELECT us.xp, us.current_level, us.gems, us.streak, il.created_at
		FROM updated_stats us
		CROSS JOIN inserted_log il
	`
	var updatedXP, updatedLevel, updatedGems, currentStreak int
	var claimedAt time.Time
	err = tx.QueryRow(ctx, updateQuery, userID, xpAwarded, newLevel, gemsAwarded, activityType, metaJSON, newStreak).
		Scan(&updatedXP, &updatedLevel, &updatedGems, &currentStreak, &claimedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to execute atomic daily reward claim: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit daily reward claim: %w", err)
	}

	return &DailyRewardClaimResponse{
		RewardType:   rewardType,
		XPAwarded:    xpAwarded,
		GemsAwarded:  gemsAwarded,
		CurrentXP:    updatedXP,
		CurrentLevel: updatedLevel,
		CurrentGems:  updatedGems,
		Streak:       currentStreak,
		ClaimedAt:    claimedAt.UTC().Format(time.RFC3339),
	}, nil
}

// GetDailyRewardsStatus reports whether vocab quests or golden chests have already been claimed today (WIB) and flashcard progress
func (r *PostgresRepository) GetDailyRewardsStatus(ctx context.Context, userID string) (*DailyRewardsStatusResponse, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, err
	}

	query := `
		WITH wib_start AS (
			SELECT ((NOW() AT TIME ZONE 'Asia/Jakarta')::date AT TIME ZONE 'Asia/Jakarta') AS start_ts,
			       TO_CHAR(NOW() AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') AS wib_date
		),
		claims AS (
			SELECT
				COALESCE(BOOL_OR(activity_type = 'daily_vocab_quest_claim'), false) AS vocab_quest_claimed,
				COALESCE(BOOL_OR(activity_type = 'daily_golden_chest_claim'), false) AS golden_chest_claimed
			FROM user_activity_logs, wib_start
			WHERE user_id = $1::uuid
			  AND activity_type IN ('daily_vocab_quest_claim', 'daily_golden_chest_claim')
			  AND created_at >= wib_start.start_ts
		),
		fc AS (
			SELECT COUNT(*)::int AS reviewed_today
			FROM user_flashcard_progress, wib_start
			WHERE user_id = $1::uuid
			  AND last_reviewed_at >= wib_start.start_ts
		)
		SELECT wib_start.wib_date, claims.vocab_quest_claimed, claims.golden_chest_claimed, fc.reviewed_today
		FROM wib_start, claims, fc
	`
	var status DailyRewardsStatusResponse
	err := r.db.Pool.QueryRow(ctx, query, userID).Scan(
		&status.Date,
		&status.VocabQuestClaimed,
		&status.GoldenChestClaimed,
		&status.TodayFlashcardsReviewed,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to query daily rewards status: %w", err)
	}
	status.VocabQuestTarget = VocabQuestDailyFlashcardThreshold
	status.VocabQuestUnlocked = status.TodayFlashcardsReviewed >= VocabQuestDailyFlashcardThreshold
	return &status, nil
}

