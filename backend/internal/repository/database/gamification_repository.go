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

// NewGamificationRepository creates a new PostgreSQL gamification repository instance
func NewGamificationRepository(db *postgres.PostgresDB) domain.GamificationRepository {
	return &GamificationRepository{db: db}
}

// GetStatus retrieves the unified SSOT gamification state for a user
func (r *GamificationRepository) GetStatus(ctx context.Context, userID string) (*domain.GamificationStatus, error) {
	status := &domain.GamificationStatus{
		Inventory:      make(map[string]int),
		InventoryItems: make([]domain.UserInventoryItem, 0),
		ClaimedChests:  make([]int, 0),
		Badges:         make([]domain.UserBadge, 0),
	}

	// 1. Fetch user core gamification stats
	err := r.db.Pool.QueryRow(
		ctx,
		`SELECT xp, current_level, streak, gems FROM user_gamification WHERE user_id = $1`,
		userID,
	).Scan(&status.XP, &status.CurrentLevel, &status.Streak, &status.Gems)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to query user gamification stats: %w", err)
	}

	// 2. Fetch inventory items with catalog metadata
	invRows, err := r.db.Pool.Query(
		ctx,
		`SELECT ui.id, ui.user_id, ui.item_id, ui.quantity, ui.created_at, ui.updated_at,
		        si.id, si.name, si.description, si.category, si.price_gems, si.icon, si.is_available, si.created_at
		 FROM user_inventories ui
		 JOIN shop_items si ON ui.item_id = si.id
		 WHERE ui.user_id = $1
		 ORDER BY si.price_gems ASC`,
		userID,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to query user inventory: %w", err)
	}
	defer invRows.Close()

	for invRows.Next() {
		var inv domain.UserInventoryItem
		var si domain.ShopItem
		if err := invRows.Scan(
			&inv.ID, &inv.UserID, &inv.ItemID, &inv.Quantity, &inv.CreatedAt, &inv.UpdatedAt,
			&si.ID, &si.Name, &si.Description, &si.Category, &si.PriceGems, &si.Icon, &si.IsAvailable, &si.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan user inventory: %w", err)
		}
		inv.Item = &si
		status.Inventory[inv.ItemID] = inv.Quantity
		status.InventoryItems = append(status.InventoryItems, inv)
	}

	// 3. Fetch today's claimed chest tiers
	chestRows, err := r.db.Pool.Query(
		ctx,
		`SELECT tier FROM daily_chest_claims WHERE user_id = $1 AND claim_date = CURRENT_DATE ORDER BY tier ASC`,
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

	// 4. Fetch unlocked user badges
	badgeRows, err := r.db.Pool.Query(
		ctx,
		`SELECT ub.id, ub.user_id, ub.badge_key, ub.awarded_at,
		        bd.id, bd.title, bd.description, bd.icon, bd.category, bd.xp_bonus, bd.created_at
		 FROM user_badges ub
		 JOIN badge_definitions bd ON ub.badge_key = bd.id
		 WHERE ub.user_id = $1
		 ORDER BY ub.awarded_at DESC`,
		userID,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to query user badges: %w", err)
	}
	defer badgeRows.Close()

	for badgeRows.Next() {
		var ub domain.UserBadge
		var bd domain.BadgeDefinition
		if err := badgeRows.Scan(
			&ub.ID, &ub.UserID, &ub.BadgeKey, &ub.AwardedAt,
			&bd.ID, &bd.Title, &bd.Description, &bd.Icon, &bd.Category, &bd.XPBonus, &bd.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan user badge: %w", err)
		}
		ub.Badge = &bd
		status.Badges = append(status.Badges, ub)
	}

	return status, nil
}

// GetGamificationStats retrieves lightweight stats for high-concurrency game checks
func (r *GamificationRepository) GetGamificationStats(ctx context.Context, userID string) (*domain.UserGamificationStats, error) {
	query := `
		SELECT xp, current_level, streak, gems, last_active_at
		FROM user_gamification
		WHERE user_id = $1
	`
	var stats domain.UserGamificationStats
	err := r.db.Pool.QueryRow(ctx, query, userID).Scan(
		&stats.XP, &stats.CurrentLevel, &stats.Streak, &stats.Gems, &stats.LastActiveAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to get gamification stats: %w", err)
	}
	return &stats, nil
}

// UpdateStats writes back updated progression values
func (r *GamificationRepository) UpdateStats(
	ctx context.Context,
	userID string,
	xp int,
	level int,
	streak int,
	gems int,
	lastActiveAt *time.Time,
) error {
	query := `
		UPDATE user_gamification
		SET xp = $2, current_level = $3, streak = $4, gems = $5, last_active_at = $6, updated_at = NOW()
		WHERE user_id = $1
	`
	tag, err := r.db.Pool.Exec(ctx, query, userID, xp, level, streak, gems, lastActiveAt)
	if err != nil {
		return fmt.Errorf("failed to update user gamification stats: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrUserNotFound
	}
	return nil
}

// AddXPAndGems atomically increments currency & XP, updating level progression
func (r *GamificationRepository) AddXPAndGems(ctx context.Context, userID string, xp int, level int, gems int) (*domain.UserGamificationStats, error) {
	query := `
		UPDATE user_gamification
		SET xp = xp + $2,
		    current_level = $3,
		    gems = GREATEST(0, gems + $4),
		    last_active_at = NOW(),
		    updated_at = NOW()
		WHERE user_id = $1
		RETURNING xp, current_level, streak, gems, last_active_at
	`
	var stats domain.UserGamificationStats
	err := r.db.Pool.QueryRow(ctx, query, userID, xp, level, gems).Scan(
		&stats.XP, &stats.CurrentLevel, &stats.Streak, &stats.Gems, &stats.LastActiveAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to add xp and gems: %w", err)
	}
	return &stats, nil
}

// GetShopItems retrieves items from the Akihabara arcade catalog (zero OR in WHERE)
func (r *GamificationRepository) GetShopItems(ctx context.Context, onlyAvailable bool) ([]domain.ShopItem, error) {
	var query string
	if onlyAvailable {
		query = `
			SELECT id, name, description, category, price_gems, icon, is_available, created_at
			FROM shop_items
			WHERE is_available = true
			ORDER BY price_gems ASC
		`
	} else {
		query = `
			SELECT id, name, description, category, price_gems, icon, is_available, created_at
			FROM shop_items
			ORDER BY price_gems ASC
		`
	}
	rows, err := r.db.Pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query shop items: %w", err)
	}
	defer rows.Close()

	var items []domain.ShopItem
	for rows.Next() {
		var item domain.ShopItem
		if err := rows.Scan(
			&item.ID, &item.Name, &item.Description, &item.Category,
			&item.PriceGems, &item.Icon, &item.IsAvailable, &item.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan shop item: %w", err)
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in shop items: %w", err)
	}
	return items, nil
}

// GetShopItemByID retrieves a single shop item by ID
func (r *GamificationRepository) GetShopItemByID(ctx context.Context, itemID string) (*domain.ShopItem, error) {
	query := `
		SELECT id, name, description, category, price_gems, icon, is_available, created_at
		FROM shop_items
		WHERE id = $1
	`
	var item domain.ShopItem
	err := r.db.Pool.QueryRow(ctx, query, itemID).Scan(
		&item.ID, &item.Name, &item.Description, &item.Category,
		&item.PriceGems, &item.Icon, &item.IsAvailable, &item.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrShopItemNotFound
		}
		return nil, fmt.Errorf("failed to query shop item: %w", err)
	}
	return &item, nil
}

// GetUserInventory retrieves all inventory items owned by the user
func (r *GamificationRepository) GetUserInventory(ctx context.Context, userID string) ([]domain.UserInventoryItem, error) {
	query := `
		SELECT ui.id, ui.user_id, ui.item_id, ui.quantity, ui.created_at, ui.updated_at,
		       si.id, si.name, si.description, si.category, si.price_gems, si.icon, si.is_available, si.created_at
		FROM user_inventories ui
		JOIN shop_items si ON ui.item_id = si.id
		WHERE ui.user_id = $1
		ORDER BY si.price_gems ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query user inventory: %w", err)
	}
	defer rows.Close()

	var items []domain.UserInventoryItem
	for rows.Next() {
		var inv domain.UserInventoryItem
		var si domain.ShopItem
		if err := rows.Scan(
			&inv.ID, &inv.UserID, &inv.ItemID, &inv.Quantity, &inv.CreatedAt, &inv.UpdatedAt,
			&si.ID, &si.Name, &si.Description, &si.Category, &si.PriceGems, &si.Icon, &si.IsAvailable, &si.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan user inventory row: %w", err)
		}
		inv.Item = &si
		items = append(items, inv)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in user inventory: %w", err)
	}
	return items, nil
}

// BuyShopItem handles an atomic transaction deducting gems and incrementing user inventory
func (r *GamificationRepository) BuyShopItem(ctx context.Context, userID string, itemID string, priceGems int) (*domain.UserInventoryItem, int, error) {
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to begin shop transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// 1. Deduct gems atomically if balance is sufficient
	deductQuery := `
		UPDATE user_gamification
		SET gems = gems - $2, updated_at = NOW()
		WHERE user_id = $1 AND gems >= $2
		RETURNING gems
	`
	var remainingGems int
	err = tx.QueryRow(ctx, deductQuery, userID, priceGems).Scan(&remainingGems)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, 0, domain.ErrInsufficientGems
		}
		return nil, 0, fmt.Errorf("failed to deduct gems: %w", err)
	}

	// 2. Upsert user inventory quantity
	invQuery := `
		INSERT INTO user_inventories (user_id, item_id, quantity, created_at, updated_at)
		VALUES ($1, $2, 1, NOW(), NOW())
		ON CONFLICT (user_id, item_id)
		DO UPDATE SET quantity = user_inventories.quantity + 1, updated_at = NOW()
		RETURNING id, user_id, item_id, quantity, created_at, updated_at
	`
	var inv domain.UserInventoryItem
	err = tx.QueryRow(ctx, invQuery, userID, itemID).Scan(
		&inv.ID, &inv.UserID, &inv.ItemID, &inv.Quantity, &inv.CreatedAt, &inv.UpdatedAt,
	)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to increment user inventory: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, 0, fmt.Errorf("failed to commit shop purchase tx: %w", err)
	}

	return &inv, remainingGems, nil
}

// GetBadges retrieves all registered achievement badges
func (r *GamificationRepository) GetBadges(ctx context.Context) ([]domain.BadgeDefinition, error) {
	query := `
		SELECT id, title, description, icon, category, xp_bonus, created_at
		FROM badge_definitions
		ORDER BY id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query badges: %w", err)
	}
	defer rows.Close()

	var badges []domain.BadgeDefinition
	for rows.Next() {
		var b domain.BadgeDefinition
		if err := rows.Scan(&b.ID, &b.Title, &b.Description, &b.Icon, &b.Category, &b.XPBonus, &b.CreatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan badge: %w", err)
		}
		badges = append(badges, b)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in badges: %w", err)
	}
	return badges, nil
}

// GetUserBadges retrieves all achievements awarded to the user
func (r *GamificationRepository) GetUserBadges(ctx context.Context, userID string) ([]domain.UserBadge, error) {
	query := `
		SELECT ub.id, ub.user_id, ub.badge_key, ub.awarded_at,
		       bd.id, bd.title, bd.description, bd.icon, bd.category, bd.xp_bonus, bd.created_at
		FROM user_badges ub
		JOIN badge_definitions bd ON ub.badge_key = bd.id
		WHERE ub.user_id = $1
		ORDER BY ub.awarded_at DESC
	`
	rows, err := r.db.Pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query user badges: %w", err)
	}
	defer rows.Close()

	var badges []domain.UserBadge
	for rows.Next() {
		var ub domain.UserBadge
		var bd domain.BadgeDefinition
		if err := rows.Scan(
			&ub.ID, &ub.UserID, &ub.BadgeKey, &ub.AwardedAt,
			&bd.ID, &bd.Title, &bd.Description, &bd.Icon, &bd.Category, &bd.XPBonus, &bd.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan user badge: %w", err)
		}
		ub.Badge = &bd
		badges = append(badges, ub)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in user badges: %w", err)
	}
	return badges, nil
}

// AwardBadge grants an achievement badge to a user and deposits its bonus XP atomically
func (r *GamificationRepository) AwardBadge(ctx context.Context, userID string, badgeKey string, newLevel int) (*domain.UserBadge, error) {
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin award badge tx: %w", err)
	}
	defer tx.Rollback(ctx)

	// 1. Fetch badge definition
	var bd domain.BadgeDefinition
	err = tx.QueryRow(
		ctx,
		`SELECT id, title, description, icon, category, xp_bonus, created_at FROM badge_definitions WHERE id = $1`,
		badgeKey,
	).Scan(&bd.ID, &bd.Title, &bd.Description, &bd.Icon, &bd.Category, &bd.XPBonus, &bd.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrBadgeNotFound
		}
		return nil, fmt.Errorf("failed to fetch badge definition: %w", err)
	}

	// 2. Insert user_badge safely (idempotent ON CONFLICT)
	var ub domain.UserBadge
	insertQuery := `
		INSERT INTO user_badges (user_id, badge_key, awarded_at)
		VALUES ($1, $2, NOW())
		ON CONFLICT (user_id, badge_key) DO UPDATE SET awarded_at = user_badges.awarded_at
		RETURNING id, user_id, badge_key, awarded_at
	`
	err = tx.QueryRow(ctx, insertQuery, userID, badgeKey).Scan(&ub.ID, &ub.UserID, &ub.BadgeKey, &ub.AwardedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to record user badge: %w", err)
	}
	ub.Badge = &bd

	// 3. Deposit bonus XP if applicable
	if bd.XPBonus > 0 {
		_, err = tx.Exec(
			ctx,
			`UPDATE user_gamification SET xp = xp + $2, current_level = $3, updated_at = NOW() WHERE user_id = $1`,
			userID, bd.XPBonus, newLevel,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to award badge bonus xp: %w", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit award badge tx: %w", err)
	}

	return &ub, nil
}

// GetDailyChestClaims retrieves milestone chest claims for the specified date
func (r *GamificationRepository) GetDailyChestClaims(ctx context.Context, userID string, claimDate string) ([]domain.DailyChestClaim, error) {
	query := `
		SELECT id, user_id, claim_date, tier, gems_awarded, xp_awarded, created_at
		FROM daily_chest_claims
		WHERE user_id = $1 AND claim_date = $2::date
		ORDER BY tier ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, userID, claimDate)
	if err != nil {
		return nil, fmt.Errorf("failed to query daily chest claims: %w", err)
	}
	defer rows.Close()

	var claims []domain.DailyChestClaim
	for rows.Next() {
		var c domain.DailyChestClaim
		if err := rows.Scan(&c.ID, &c.UserID, &c.ClaimDate, &c.Tier, &c.GemsAwarded, &c.XPAwarded, &c.CreatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan chest claim: %w", err)
		}
		claims = append(claims, c)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in chest claims: %w", err)
	}
	return claims, nil
}

// ClaimDailyChest records a milestone chest reward and awards XP/gems in an atomic transaction
func (r *GamificationRepository) ClaimDailyChest(ctx context.Context, claim *domain.DailyChestClaim, newLevel int) error {
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin daily chest tx: %w", err)
	}
	defer tx.Rollback(ctx)

	insertQuery := `
		INSERT INTO daily_chest_claims (user_id, claim_date, tier, gems_awarded, xp_awarded, created_at)
		VALUES ($1, $2::date, $3, $4, $5, NOW())
		RETURNING id, created_at
	`
	err = tx.QueryRow(
		ctx, insertQuery,
		claim.UserID, claim.ClaimDate, claim.Tier, claim.GemsAwarded, claim.XPAwarded,
	).Scan(&claim.ID, &claim.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) || errors.Is(err, pgx.ErrTooManyRows) {
			return domain.ErrChestAlreadyClaimed
		}
		return fmt.Errorf("failed to record daily chest claim: %w", err)
	}

	// Update user stats with pre-calculated level
	updateQuery := `
		UPDATE user_gamification
		SET xp = xp + $2,
		    current_level = $3,
		    gems = gems + $4,
		    last_active_at = NOW(),
		    updated_at = NOW()
		WHERE user_id = $1
	`
	if _, err := tx.Exec(ctx, updateQuery, claim.UserID, claim.XPAwarded, newLevel, claim.GemsAwarded); err != nil {
		return fmt.Errorf("failed to update gamification stats for chest: %w", err)
	}

	return tx.Commit(ctx)
}

// CreateCoachingSubmission records a mentorship or CV review request
func (r *GamificationRepository) CreateCoachingSubmission(ctx context.Context, sub *domain.CoachingSubmission) error {
	query := `
		INSERT INTO coaching_submissions (
			user_id, type, target_role, github_url, resume_url, discord_handle, interview_language, focus_topic, preferred_time, notes, status, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`
	if sub.Status == "" {
		sub.Status = "pending"
	}

	err := r.db.Pool.QueryRow(
		ctx, query,
		sub.UserID, sub.Type, sub.TargetRole, sub.GitHubURL, sub.ResumeURL,
		sub.DiscordHandle, sub.InterviewLanguage, sub.FocusTopic, sub.PreferredTime, sub.Notes, sub.Status,
	).Scan(&sub.ID, &sub.CreatedAt, &sub.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to create coaching submission: %w", err)
	}
	return nil
}
