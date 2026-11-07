package database

import (
	"codeabroad/backend/internal/domain"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
)

// LogActivity inserts a user activity event and updates last_active_at in a single atomic Writeable CTE (1 DB round-trip)
func (r *UserRepository) LogActivity(
	ctx context.Context,
	userID string,
	activityType string,
	xpEarned int,
	metadata map[string]interface{},
) error {
	var metaJSON []byte
	if metadata != nil {
		var err error
		metaJSON, err = json.Marshal(metadata)
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
	if _, err := r.db.Pool.Exec(ctx, query, userID, activityType, xpEarned, metaJSON); err != nil {
		return fmt.Errorf("failed to log user activity: %w", err)
	}
	return nil
}

// HasActivityInRange checks if the user has any logged activity within [startTime, endTime) using SARGable index scan
func (r *UserRepository) HasActivityInRange(
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

// GetDailyActivityStatsSince executes a single consolidated UNION ALL query returning raw daily XP and completed quest counts
func (r *UserRepository) GetDailyActivityStatsSince(
	ctx context.Context,
	userID string,
	since time.Time,
) (map[string]domain.DailyActivityStat, error) {
	query := `
		SELECT act_date, SUM(xp_earned) AS total_xp, SUM(quests_count) AS total_quests
		FROM (
			SELECT TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS act_date,
			       xp_earned,
			       0 AS quests_count
			FROM user_activity_logs
			WHERE user_id = $1 AND created_at >= $2
			UNION ALL
			SELECT TO_CHAR(completed_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS act_date,
			       0 AS xp_earned,
			       1 AS quests_count
			FROM user_quests
			WHERE user_id = $1 AND status = 'completed' AND completed_at >= $2
		) combined
		GROUP BY act_date
	`
	rows, err := r.db.Pool.Query(ctx, query, userID, since)
	if err != nil {
		return nil, fmt.Errorf("failed to query daily activity stats: %w", err)
	}
	defer rows.Close()

	dailyStats := make(map[string]domain.DailyActivityStat)
	for rows.Next() {
		var dateStr string
		var stat domain.DailyActivityStat
		if err := rows.Scan(&dateStr, &stat.XPEarned, &stat.QuestsCount); err != nil {
			return nil, fmt.Errorf("failed to scan daily activity stat: %w", err)
		}
		dailyStats[dateStr] = stat
	}
	return dailyStats, rows.Err()
}

// ClaimDailyReward atomically locks the user row, verifies no duplicate claim today, updates XP/level, and logs the claim
func (r *UserRepository) ClaimDailyReward(
	ctx context.Context,
	userID string,
	rewardType string,
	xpAwarded int,
) (*domain.DailyRewardClaimResponse, error) {
	activityType := "daily_" + rewardType + "_claim"
	now := time.Now().UTC()
	today := now.Format("2006-01-02")
	startOfToday := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)

	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin daily reward transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// 1. Pessimistic lock on user_gamification to serialize concurrent claims for the same user
	var currentXP, streak int
	lockQuery := `
		SELECT xp, streak
		FROM user_gamification
		WHERE user_id = $1
		FOR UPDATE
	`
	if err := tx.QueryRow(ctx, lockQuery, userID).Scan(&currentXP, &streak); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to lock user gamification for daily reward: %w", err)
	}

	// 2. SARGable check if already claimed today
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
		return nil, domain.ErrDailyRewardAlreadyClaimed
	}

	// 3. Atomic CTE updating XP/level and inserting activity log in 1 round-trip
	metaJSON, _ := json.Marshal(map[string]interface{}{
		"reward_type": rewardType,
		"date":        today,
	})
	updateAndLogQuery := `
		WITH updated_gam AS (
			UPDATE user_gamification
			SET xp = xp + $2,
			    current_level = ((xp + $2) / 100) + 1,
			    last_active_at = NOW(),
			    updated_at = NOW()
			WHERE user_id = $1
			RETURNING xp, current_level
		),
		inserted_log AS (
			INSERT INTO user_activity_logs (user_id, activity_type, xp_earned, metadata, created_at)
			VALUES ($1, $3, $2, $4, NOW())
		)
		SELECT xp, current_level FROM updated_gam
	`
	var newXP, newLevel int
	if err := tx.QueryRow(ctx, updateAndLogQuery, userID, xpAwarded, activityType, metaJSON).Scan(&newXP, &newLevel); err != nil {
		return nil, fmt.Errorf("failed to update xp and log daily reward claim: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit daily reward claim: %w", err)
	}

	return &domain.DailyRewardClaimResponse{
		RewardType:   rewardType,
		XPAwarded:    xpAwarded,
		CurrentXP:    newXP,
		CurrentLevel: newLevel,
		Streak:       streak,
		ClaimedAt:    now.Format(time.RFC3339),
	}, nil
}

// GetDailyRewardsStatus checks both daily rewards in a single SARGable table scan using BOOL_OR
func (r *UserRepository) GetDailyRewardsStatus(ctx context.Context, userID string) (*domain.DailyRewardsStatusResponse, error) {
	now := time.Now().UTC()
	today := now.Format("2006-01-02")
	startOfToday := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)

	query := `
		SELECT 
			COALESCE(BOOL_OR(activity_type = 'daily_vocab_quest_claim'), FALSE) AS vocab_claimed,
			COALESCE(BOOL_OR(activity_type = 'daily_golden_chest_claim'), FALSE) AS chest_claimed
		FROM user_activity_logs
		WHERE user_id = $1
		  AND activity_type IN ('daily_vocab_quest_claim', 'daily_golden_chest_claim')
		  AND created_at >= $2
	`
	var vocabClaimed, chestClaimed bool
	if err := r.db.Pool.QueryRow(ctx, query, userID, startOfToday).Scan(&vocabClaimed, &chestClaimed); err != nil {
		return &domain.DailyRewardsStatusResponse{
			Date:               today,
			VocabQuestClaimed:  false,
			GoldenChestClaimed: false,
		}, nil
	}

	return &domain.DailyRewardsStatusResponse{
		Date:               today,
		VocabQuestClaimed:  vocabClaimed,
		GoldenChestClaimed: chestClaimed,
	}, nil
}
