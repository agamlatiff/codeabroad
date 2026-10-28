package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
)

// GamificationRepository implements domain.GamificationRepository using PostgreSQL
type GamificationRepository struct {
	db *postgres.PostgresDB
}

// NewGamificationRepository creates a new PostgreSQL gamification repository
func NewGamificationRepository(db *postgres.PostgresDB) domain.GamificationRepository {
	return &GamificationRepository{db: db}
}

// GetStatus retrieves the unified SSOT gamification profile for a user
func (r *GamificationRepository) GetStatus(ctx context.Context, userID string) (*domain.GamificationStatus, error) {
	status := &domain.GamificationStatus{
		Inventory: map[string]int{
			"streak-freeze":  0,	
			"xp-booster":     0,
			"cv-review":      0,
			"mock-interview": 0,
		},
		ClaimedChests: make([]int, 0),
	}

	// 1. Fetch user gems
	err := r.db.Pool.QueryRow(ctx, `SELECT gems FROM users WHERE id = $1`, userID).Scan(&status.Gems)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to query user gems: %w", err)
	}

	// 2. Fetch inventory items
	rows, err := r.db.Pool.Query(ctx, `SELECT item_id, quantity FROM user_inventories WHERE user_id = $1`, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query user inventory: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var itemID string
		var qty int
		if err := rows.Scan(&itemID, &qty); err == nil {
			status.Inventory[itemID] = qty
		}
	}

	// 3. Fetch today's claimed chests
	chestRows, err := r.db.Pool.Query(
		ctx,
		`SELECT tier FROM user_daily_chest_claims WHERE user_id = $1 AND claim_date = CURRENT_DATE ORDER BY tier ASC`,
		userID,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to query daily chest claims: %w", err)
	}
	defer chestRows.Close()

	for chestRows.Next() {
		var tier int
		if err := chestRows.Scan(&tier); err == nil {
			status.ClaimedChests = append(status.ClaimedChests, tier)
		}
	}

	// 4. Fetch monthly challenge badge status
	now := time.Now()
	status.MonthlyBadgeKey = fmt.Sprintf("codeabroad_monthly_badge_%d_%d", now.Year(), int(now.Month()))
	err = r.db.Pool.QueryRow(
		ctx,
		`SELECT EXISTS(SELECT 1 FROM user_badges WHERE user_id = $1 AND badge_key = $2)`,
		userID,
		status.MonthlyBadgeKey,
	).Scan(&status.MonthlyBadgeClaimed)
	if err != nil {
		status.MonthlyBadgeClaimed = false
	}

	return status, nil
}

// ClaimDailyChest stores chest claim and credits gems atomically
func (r *GamificationRepository) ClaimDailyChest(ctx context.Context, userID string, tier int, gemsAwarded int, xpAwarded int) error {
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	// Insert chest claim for today
	tag, err := tx.Exec(
		ctx,
		`INSERT INTO user_daily_chest_claims (user_id, claim_date, tier, gems_awarded, xp_awarded)
		 VALUES ($1, CURRENT_DATE, $2, $3, $4)
		 ON CONFLICT (user_id, claim_date, tier) DO NOTHING`,
		userID, tier, gemsAwarded, xpAwarded,
	)
	if err != nil {
		return fmt.Errorf("failed to insert chest claim: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.NewConflictError("CHEST_ALREADY_CLAIMED", fmt.Sprintf("peti tier %d sudah diklaim hari ini", tier))
	}

	// Credit gems
	if gemsAwarded > 0 {
		_, err = tx.Exec(ctx, `UPDATE users SET gems = gems + $2 WHERE id = $1`, userID, gemsAwarded)
		if err != nil {
			return fmt.Errorf("failed to credit gems for chest: %w", err)
		}
	}

	return tx.Commit(ctx)
}

// BuyShopItem deducts gems and increments user inventory quantity
func (r *GamificationRepository) BuyShopItem(ctx context.Context, userID string, itemID string, price int) (int, map[string]int, error) {
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return 0, nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	// Lock and check current gems
	var currentGems int
	err = tx.QueryRow(ctx, `SELECT gems FROM users WHERE id = $1 FOR UPDATE`, userID).Scan(&currentGems)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return 0, nil, domain.ErrUserNotFound
		}
		return 0, nil, fmt.Errorf("failed to query user gems: %w", err)
	}

	if currentGems < price {
		return 0, nil, domain.NewBadRequestError("INSUFFICIENT_GEMS", fmt.Sprintf("Gems tidak cukup (butuh %d 💎, Anda memiliki %d 💎)", price, currentGems), nil)
	}

	// Deduct gems
	var newGems int
	err = tx.QueryRow(ctx, `UPDATE users SET gems = gems - $2 WHERE id = $1 RETURNING gems`, userID, price).Scan(&newGems)
	if err != nil {
		return 0, nil, fmt.Errorf("failed to deduct gems: %w", err)
	}

	// Increment inventory quantity
	_, err = tx.Exec(
		ctx,
		`INSERT INTO user_inventories (user_id, item_id, quantity)
		 VALUES ($1, $2, 1)
		 ON CONFLICT (user_id, item_id)
		 DO UPDATE SET quantity = user_inventories.quantity + 1, updated_at = CURRENT_TIMESTAMP`,
		userID, itemID,
	)
	if err != nil {
		return 0, nil, fmt.Errorf("failed to increment inventory: %w", err)
	}

	// Query updated inventory
	rows, err := tx.Query(ctx, `SELECT item_id, quantity FROM user_inventories WHERE user_id = $1`, userID)
	if err != nil {
		return 0, nil, fmt.Errorf("failed to read updated inventory: %w", err)
	}
	defer rows.Close()

	inventory := map[string]int{
		"streak-freeze":  0,
		"xp-booster":     0,
		"cv-review":      0,
		"mock-interview": 0,
	}
	for rows.Next() {
		var item string
		var qty int
		if err := rows.Scan(&item, &qty); err == nil {
			inventory[item] = qty
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return 0, nil, fmt.Errorf("failed to commit purchase: %w", err)
	}

	return newGems, inventory, nil
}

// ClaimMonthlyBadge awards the monthly challenge badge and bonus gems
func (r *GamificationRepository) ClaimMonthlyBadge(ctx context.Context, userID string, badgeKey string, title string, description string, icon string, gemReward int) error {
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	tag, err := tx.Exec(
		ctx,
		`INSERT INTO user_badges (user_id, badge_key, title, description, icon)
		 VALUES ($1, $2, $3, $4, $5)
		 ON CONFLICT (user_id, badge_key) DO NOTHING`,
		userID, badgeKey, title, description, icon,
	)
	if err != nil {
		return fmt.Errorf("failed to insert monthly badge: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.NewConflictError("BADGE_ALREADY_CLAIMED", "lencana tantangan bulan ini sudah diklaim")
	}

	if gemReward > 0 {
		_, err = tx.Exec(ctx, `UPDATE users SET gems = gems + $2 WHERE id = $1`, userID, gemReward)
		if err != nil {
			return fmt.Errorf("failed to credit gems for monthly badge: %w", err)
		}
	}

	return tx.Commit(ctx)
}

// CreateCoachingSubmission consumes a coupon and records the submission
func (r *GamificationRepository) CreateCoachingSubmission(ctx context.Context, userID string, sub *domain.CoachingSubmission) error {
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	// Check coupon inventory
	var qty int
	err = tx.QueryRow(ctx, `SELECT quantity FROM user_inventories WHERE user_id = $1 AND item_id = $2 FOR UPDATE`, userID, sub.Type).Scan(&qty)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) || qty <= 0 {
			return domain.NewBadRequestError("NO_COUPON_AVAILABLE", fmt.Sprintf("Anda tidak memiliki kupon '%s'", sub.Type), nil)
		}
		return fmt.Errorf("failed to query coupon inventory: %w", err)
	}
	if qty <= 0 {
		return domain.NewBadRequestError("NO_COUPON_AVAILABLE", fmt.Sprintf("Anda tidak memiliki kupon '%s'", sub.Type), nil)
	}

	// Deduct coupon
	_, err = tx.Exec(ctx, `UPDATE user_inventories SET quantity = quantity - 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND item_id = $2`, userID, sub.Type)
	if err != nil {
		return fmt.Errorf("failed to deduct coupon: %w", err)
	}

	// Insert submission
	err = tx.QueryRow(
		ctx,
		`INSERT INTO coaching_submissions (
			user_id, type, target_role, github_url, resume_url, discord_handle,
			interview_language, focus_topic, preferred_time, notes, status
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'in_review')
		RETURNING id, created_at, updated_at`,
		userID, sub.Type, sub.TargetRole, sub.GitHubURL, sub.ResumeURL, sub.DiscordHandle,
		sub.InterviewLanguage, sub.FocusTopic, sub.PreferredTime, sub.Notes,
	).Scan(&sub.ID, &sub.CreatedAt, &sub.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to insert coaching submission: %w", err)
	}

	return tx.Commit(ctx)
}
