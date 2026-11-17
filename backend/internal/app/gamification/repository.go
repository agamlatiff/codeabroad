package gamification

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"

	"codeabroad/backend/infrastructure/postgres"
	"codeabroad/backend/internal/app/user"
	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/shared/progression"
	"github.com/jackc/pgx/v5"
)

func validateUserUUID(userID string) error {
	return apperror.ValidateUserUUID(userID)
}

// PostgresRepository implements gamification.Repository using PostgreSQL
type PostgresRepository struct {
	db *postgres.PostgresDB
}

// NewRepository creates a new PostgreSQL gamification repository instance
func NewRepository(db *postgres.PostgresDB) Repository {
	return &PostgresRepository{db: db}
}

func normalizeShopItem(si *ShopItem) {
	if si == nil {
		return
	}
	si.Name = si.Title
	si.Description = si.Subtitle
	si.Icon = si.Badge
	si.IsAvailable = si.IsActive
}

func scanUserInventoryRows(rows pgx.Rows) ([]UserInventoryItem, map[string]int, error) {
	items := make([]UserInventoryItem, 0)
	invMap := make(map[string]int)
	for rows.Next() {
		var inv UserInventoryItem
		var si ShopItem
		if err := rows.Scan(
			&inv.ID, &inv.UserID, &inv.ItemID, &inv.Quantity, &inv.CreatedAt, &inv.UpdatedAt,
			&si.ID, &si.Title, &si.Subtitle, &si.Category, &si.PriceGems, &si.Badge, &si.IsActive, &si.CreatedAt,
		); err != nil {
			return nil, nil, fmt.Errorf("failed to scan user inventory row: %w", err)
		}
		normalizeShopItem(&si)
		inv.Item = &si
		invMap[inv.ItemID] = inv.Quantity
		items = append(items, inv)
	}
	if err := rows.Err(); err != nil {
		return nil, nil, fmt.Errorf("rows iteration error in user inventory: %w", err)
	}
	return items, invMap, nil
}

func scanUserBadgeRows(rows pgx.Rows) ([]UserBadge, error) {
	badges := make([]UserBadge, 0)
	for rows.Next() {
		var ub UserBadge
		var bd BadgeDefinition
		if err := rows.Scan(
			&ub.ID, &ub.UserID, &ub.BadgeKey, &ub.AwardedAt,
			&bd.ID, &bd.Title, &bd.Description, &bd.Category, &bd.Icon, &bd.XPReward, &bd.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan user badge: %w", err)
		}
		bd.XPBonus = bd.XPReward
		ub.Badge = &bd
		badges = append(badges, ub)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in user badges: %w", err)
	}
	return badges, nil
}

// GetStatus retrieves the unified SSOT gamification state for a user
func (r *PostgresRepository) GetStatus(ctx context.Context, userID string) (*GamificationStatus, error) {
	if err := validateUserUUID(userID); err != nil {
		return nil, err
	}
	status := &GamificationStatus{
		Inventory:      make(map[string]int),
		InventoryItems: make([]UserInventoryItem, 0),
		ClaimedChests:  make([]int, 0),
		Badges:         make([]UserBadge, 0),
	}

	err := r.db.Pool.QueryRow(
		ctx,
		`SELECT xp, current_level, streak, gems FROM user_gamification WHERE user_id = $1`,
		userID,
	).Scan(&status.XP, &status.CurrentLevel, &status.Streak, &status.Gems)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, user.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to query user gamification stats: %w", err)
	}

	var (
		wg               sync.WaitGroup
		invErr, chErr, bdErr error
		invItems         []UserInventoryItem
		invMap           map[string]int
		claimedChests    []int
		badges           []UserBadge
	)
	wg.Add(3)

	go func() {
		defer wg.Done()
		invRows, qErr := r.db.Pool.Query(
			ctx,
			`SELECT ui.id, ui.user_id, ui.item_id, ui.quantity, ui.created_at, ui.updated_at,
			        si.id, si.title, si.subtitle, si.category, si.price_gems, si.badge, si.is_active, si.created_at
			 FROM user_inventories ui
			 JOIN shop_items si ON ui.item_id = si.id
			 WHERE ui.user_id = $1
			 ORDER BY si.price_gems ASC, si.id ASC`,
			userID,
		)
		if qErr != nil {
			invErr = fmt.Errorf("failed to query user inventory: %w", qErr)
			return
		}
		defer invRows.Close()
		invItems, invMap, invErr = scanUserInventoryRows(invRows)
	}()

	go func() {
		defer wg.Done()
		chestRows, qErr := r.db.Pool.Query(
			ctx,
			`SELECT tier FROM user_daily_chest_claims WHERE user_id = $1 AND claim_date = (NOW() AT TIME ZONE 'Asia/Jakarta')::date ORDER BY tier ASC, id ASC`,
			userID,
		)
		if qErr != nil {
			chErr = fmt.Errorf("failed to query daily chest claims: %w", qErr)
			return
		}
		defer chestRows.Close()

		claimedChests = make([]int, 0)
		for chestRows.Next() {
			var tier int
			if scanErr := chestRows.Scan(&tier); scanErr != nil {
				chErr = fmt.Errorf("failed to scan daily chest claim: %w", scanErr)
				return
			}
			claimedChests = append(claimedChests, tier)
		}
		if iterErr := chestRows.Err(); iterErr != nil {
			chErr = fmt.Errorf("rows iteration error in daily chest claims: %w", iterErr)
		}
	}()

	go func() {
		defer wg.Done()
		badgeRows, qErr := r.db.Pool.Query(
			ctx,
			`SELECT ub.id, ub.user_id, ub.badge_key, ub.awarded_at,
			        bd.id, bd.title, bd.description, bd.category, bd.icon, bd.xp_reward, bd.created_at
			 FROM user_badges ub
			 JOIN badge_definitions bd ON ub.badge_key = bd.id
			 WHERE ub.user_id = $1
			 ORDER BY ub.awarded_at DESC, ub.id ASC`,
			userID,
		)
		if qErr != nil {
			bdErr = fmt.Errorf("failed to query user badges: %w", qErr)
			return
		}
		defer badgeRows.Close()
		badges, bdErr = scanUserBadgeRows(badgeRows)
	}()

	wg.Wait()

	if invErr != nil {
		return nil, invErr
	}
	if chErr != nil {
		return nil, chErr
	}
	if bdErr != nil {
		return nil, bdErr
	}

	status.InventoryItems = invItems
	status.Inventory = invMap
	status.ClaimedChests = claimedChests
	status.Badges = badges

	return status, nil
}

// GetGamificationStats retrieves lightweight stats for high-concurrency game checks
func (r *PostgresRepository) GetGamificationStats(ctx context.Context, userID string) (*user.UserGamificationStats, error) {
	if err := validateUserUUID(userID); err != nil {
		return nil, err
	}
	query := `
		SELECT xp, current_level, streak, gems, last_active_at
		FROM user_gamification
		WHERE user_id = $1
	`
	var stats user.UserGamificationStats
	err := r.db.Pool.QueryRow(ctx, query, userID).Scan(
		&stats.XP, &stats.CurrentLevel, &stats.Streak, &stats.Gems, &stats.LastActiveAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, user.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to get gamification stats: %w", err)
	}
	return &stats, nil
}

// UpdateStats writes back updated progression values
func (r *PostgresRepository) UpdateStats(
	ctx context.Context,
	userID string,
	xp int,
	level int,
	streak int,
	gems int,
	lastActiveAt *time.Time,
) error {
	if err := validateUserUUID(userID); err != nil {
		return err
	}
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
		return user.ErrUserNotFound
	}
	return nil
}

// AddXPAndGems atomically increments currency & XP, computing level progression atomically in SQL
func (r *PostgresRepository) AddXPAndGems(ctx context.Context, userID string, xp int, _ int, gems int) (*user.UserGamificationStats, error) {
	if err := validateUserUUID(userID); err != nil {
		return nil, err
	}
	query := `
		UPDATE user_gamification
		SET xp = GREATEST(0, xp + $2),
		    current_level = GREATEST(1, (GREATEST(0, xp + $2) / 100) + 1),
		    gems = GREATEST(0, gems + $3),
		    last_active_at = NOW(),
		    updated_at = NOW()
		WHERE user_id = $1
		RETURNING xp, current_level, streak, gems, last_active_at
	`
	var stats user.UserGamificationStats
	err := r.db.Pool.QueryRow(ctx, query, userID, xp, gems).Scan(
		&stats.XP, &stats.CurrentLevel, &stats.Streak, &stats.Gems, &stats.LastActiveAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, user.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to add xp and gems: %w", err)
	}
	return &stats, nil
}

// GetShopItems retrieves items from the Akihabara arcade catalog
func (r *PostgresRepository) GetShopItems(ctx context.Context, onlyAvailable bool) ([]ShopItem, error) {
	var query string
	if onlyAvailable {
		query = `
			SELECT id, title, subtitle, category, price_gems, badge, is_active, created_at
			FROM shop_items
			WHERE is_active = true
			ORDER BY price_gems ASC, id ASC
		`
	} else {
		query = `
			SELECT id, title, subtitle, category, price_gems, badge, is_active, created_at
			FROM shop_items
			ORDER BY price_gems ASC, id ASC
		`
	}
	rows, err := r.db.Pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query shop items: %w", err)
	}
	defer rows.Close()

	items := make([]ShopItem, 0)
	for rows.Next() {
		var item ShopItem
		if err := rows.Scan(
			&item.ID, &item.Title, &item.Subtitle, &item.Category,
			&item.PriceGems, &item.Badge, &item.IsActive, &item.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan shop item: %w", err)
		}
		normalizeShopItem(&item)
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in shop items: %w", err)
	}
	return items, nil
}

// GetShopItemByID retrieves a single shop item by ID
func (r *PostgresRepository) GetShopItemByID(ctx context.Context, itemID string) (*ShopItem, error) {
	query := `
		SELECT id, title, subtitle, category, price_gems, badge, is_active, created_at
		FROM shop_items
		WHERE id = $1
	`
	var item ShopItem
	err := r.db.Pool.QueryRow(ctx, query, itemID).Scan(
		&item.ID, &item.Title, &item.Subtitle, &item.Category,
		&item.PriceGems, &item.Badge, &item.IsActive, &item.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrShopItemNotFound
		}
		return nil, fmt.Errorf("failed to query shop item: %w", err)
	}
	normalizeShopItem(&item)
	return &item, nil
}

// GetUserInventory retrieves all inventory items owned by the user
func (r *PostgresRepository) GetUserInventory(ctx context.Context, userID string) ([]UserInventoryItem, error) {
	if err := validateUserUUID(userID); err != nil {
		return nil, err
	}
	query := `
		SELECT ui.id, ui.user_id, ui.item_id, ui.quantity, ui.created_at, ui.updated_at,
		       si.id, si.title, si.subtitle, si.category, si.price_gems, si.badge, si.is_active, si.created_at
		FROM user_inventories ui
		JOIN shop_items si ON ui.item_id = si.id
		WHERE ui.user_id = $1
		ORDER BY si.price_gems ASC, ui.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query user inventory: %w", err)
	}
	defer rows.Close()

	items, _, err := scanUserInventoryRows(rows)
	if err != nil {
		return nil, err
	}
	return items, nil
}

// BuyShopItem handles an atomic transaction verifying availability, locking user gems, deducting gems, and incrementing user inventory
func (r *PostgresRepository) BuyShopItem(ctx context.Context, userID string, itemID string, _ int) (*UserInventoryItem, int, error) {
	if err := validateUserUUID(userID); err != nil {
		return nil, 0, err
	}
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to begin shop transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	var priceGems int
	var isActive bool
	err = tx.QueryRow(
		ctx,
		`SELECT price_gems, is_active FROM shop_items WHERE id = $1 FOR SHARE`,
		itemID,
	).Scan(&priceGems, &isActive)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, 0, ErrShopItemNotFound
		}
		return nil, 0, fmt.Errorf("failed to verify shop item in tx: %w", err)
	}
	if !isActive || priceGems < 0 {
		return nil, 0, ErrItemUnavailable
	}

	var currentGems int
	err = tx.QueryRow(
		ctx,
		`SELECT gems FROM user_gamification WHERE user_id = $1 FOR UPDATE`,
		userID,
	).Scan(&currentGems)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, 0, user.ErrUserNotFound
		}
		return nil, 0, fmt.Errorf("failed to lock user gems: %w", err)
	}
	if currentGems < priceGems {
		return nil, 0, ErrInsufficientGems
	}

	var remainingGems int
	err = tx.QueryRow(
		ctx,
		`UPDATE user_gamification SET gems = gems - $2, updated_at = NOW() WHERE user_id = $1 RETURNING gems`,
		userID, priceGems,
	).Scan(&remainingGems)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to deduct gems: %w", err)
	}

	invQuery := `
		INSERT INTO user_inventories (user_id, item_id, quantity, created_at, updated_at)
		VALUES ($1, $2, 1, NOW(), NOW())
		ON CONFLICT (user_id, item_id)
		DO UPDATE SET quantity = user_inventories.quantity + 1, updated_at = NOW()
		RETURNING id, user_id, item_id, quantity, created_at, updated_at
	`
	var inv UserInventoryItem
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
func (r *PostgresRepository) GetBadges(ctx context.Context) ([]BadgeDefinition, error) {
	query := `
		SELECT id, title, description, category, icon, xp_reward, created_at
		FROM badge_definitions
		ORDER BY id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query badges: %w", err)
	}
	defer rows.Close()

	badges := make([]BadgeDefinition, 0)
	for rows.Next() {
		var b BadgeDefinition
		if err := rows.Scan(&b.ID, &b.Title, &b.Description, &b.Category, &b.Icon, &b.XPReward, &b.CreatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan badge: %w", err)
		}
		b.XPBonus = b.XPReward
		badges = append(badges, b)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in badges: %w", err)
	}
	return badges, nil
}

// GetUserBadges retrieves all achievements awarded to the user
func (r *PostgresRepository) GetUserBadges(ctx context.Context, userID string) ([]UserBadge, error) {
	if err := validateUserUUID(userID); err != nil {
		return nil, err
	}
	query := `
		SELECT ub.id, ub.user_id, ub.badge_key, ub.awarded_at,
		       bd.id, bd.title, bd.description, bd.category, bd.icon, bd.xp_reward, bd.created_at
		FROM user_badges ub
		JOIN badge_definitions bd ON ub.badge_key = bd.id
		WHERE ub.user_id = $1
		ORDER BY ub.awarded_at DESC, ub.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query user badges: %w", err)
	}
	defer rows.Close()

	return scanUserBadgeRows(rows)
}

// AwardBadge grants an achievement badge to a user idempotently and deposits its bonus XP atomically
// under a row lock so concurrent callers cannot double-credit XP or overwrite current_level with stale values.
func (r *PostgresRepository) AwardBadge(ctx context.Context, userID string, badgeKey string, _ int) (*UserBadge, error) {
	if err := validateUserUUID(userID); err != nil {
		return nil, err
	}
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin award badge tx: %w", err)
	}
	defer tx.Rollback(ctx)

	var lockedXP int
	err = tx.QueryRow(ctx, `SELECT xp FROM user_gamification WHERE user_id = $1::uuid FOR UPDATE`, userID).Scan(&lockedXP)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return nil, fmt.Errorf("failed to lock user gamification for badge award: %w", err)
	}
	hasGamificationRow := (err == nil)

	var bd BadgeDefinition
	err = tx.QueryRow(
		ctx,
		`SELECT id, title, description, category, icon, xp_reward, created_at FROM badge_definitions WHERE id = $1`,
		badgeKey,
	).Scan(&bd.ID, &bd.Title, &bd.Description, &bd.Category, &bd.Icon, &bd.XPReward, &bd.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrBadgeNotFound
		}
		return nil, fmt.Errorf("failed to fetch badge definition: %w", err)
	}
	bd.XPBonus = bd.XPReward

	var ub UserBadge
	insertQuery := `
		INSERT INTO user_badges (user_id, badge_key, awarded_at)
		VALUES ($1, $2, NOW())
		ON CONFLICT (user_id, badge_key) DO NOTHING
		RETURNING id, user_id, badge_key, awarded_at
	`
	err = tx.QueryRow(ctx, insertQuery, userID, badgeKey).Scan(&ub.ID, &ub.UserID, &ub.BadgeKey, &ub.AwardedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			fetchExisting := `SELECT id, user_id, badge_key, awarded_at FROM user_badges WHERE user_id = $1 AND badge_key = $2`
			if scanErr := tx.QueryRow(ctx, fetchExisting, userID, badgeKey).Scan(&ub.ID, &ub.UserID, &ub.BadgeKey, &ub.AwardedAt); scanErr != nil {
				return nil, fmt.Errorf("failed to fetch existing user badge: %w", scanErr)
			}
			if commitErr := tx.Commit(ctx); commitErr != nil {
				return nil, fmt.Errorf("failed to commit idempotent badge check: %w", commitErr)
			}
			ub.Badge = &bd
			ub.NewlyAwarded = false
			return &ub, nil
		}
		return nil, fmt.Errorf("failed to record user badge: %w", err)
	}
	ub.Badge = &bd
	ub.NewlyAwarded = true

	if hasGamificationRow && bd.XPReward > 0 {
		newXP := lockedXP + bd.XPReward
		computedLevel := (newXP / 100) + 1
		if computedLevel < 1 {
			computedLevel = 1
		}
		_, err = tx.Exec(
			ctx,
			`UPDATE user_gamification SET xp = $2, current_level = $3, updated_at = NOW() WHERE user_id = $1::uuid`,
			userID, newXP, computedLevel,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to award badge bonus xp: %w", err)
		}
	}

	if _, logErr := tx.Exec(
		ctx,
		`INSERT INTO user_activity_logs (user_id, activity_type, xp_earned, metadata, created_at) VALUES ($1::uuid, 'badge_unlocked', $2, jsonb_build_object('badge_key', $3::text), NOW())`,
		userID, bd.XPReward, bd.ID,
	); logErr != nil {
		return nil, fmt.Errorf("failed to log badge unlock activity: %w", logErr)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit award badge tx: %w", err)
	}

	return &ub, nil
}

// GetDailyChestClaims retrieves milestone chest claims for the specified date
func (r *PostgresRepository) GetDailyChestClaims(ctx context.Context, userID string, claimDate string) ([]DailyChestClaim, error) {
	if err := validateUserUUID(userID); err != nil {
		return nil, err
	}
	query := `
		SELECT id, user_id, claim_date::text, tier, gems_awarded, xp_awarded, created_at
		FROM user_daily_chest_claims
		WHERE user_id = $1 AND claim_date = $2::date
		ORDER BY tier ASC, id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, userID, claimDate)
	if err != nil {
		return nil, fmt.Errorf("failed to query daily chest claims: %w", err)
	}
	defer rows.Close()

	claims := make([]DailyChestClaim, 0)
	for rows.Next() {
		var c DailyChestClaim
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

// ClaimDailyChest records a milestone chest reward and awards XP/gems atomically using Asia/Jakarta date
// and ON CONFLICT DO NOTHING so duplicate daily claims cleanly return ErrChestAlreadyClaimed.
func (r *PostgresRepository) ClaimDailyChest(ctx context.Context, claim *DailyChestClaim, _ int) error {
	if err := validateUserUUID(claim.UserID); err != nil {
		return err
	}
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin daily chest tx: %w", err)
	}
	defer progression.RollbackTx(ctx, tx, "gamification.ClaimDailyChest")

	// Serialize concurrent chest claims for this user and verify daily quest completion tier in WIB.
	var qualifiedQuests int
	prereqQuery := `
		WITH wib_bounds AS (
			SELECT ((NOW() AT TIME ZONE 'Asia/Jakarta')::date AT TIME ZONE 'Asia/Jakarta') AS start_ts
		),
		locked_user AS (
			SELECT xp FROM user_gamification WHERE user_id = $1::uuid FOR UPDATE
		)
		SELECT (
			CASE WHEN EXISTS (
				SELECT 1 FROM user_lesson_progress ulp, wib_bounds wb
				WHERE ulp.user_id = $1::uuid AND ulp.is_completed = true AND ulp.is_skipped = false AND ulp.completed_at >= wb.start_ts
			) THEN 1 ELSE 0 END
			+
			CASE WHEN EXISTS (
				SELECT 1 FROM user_activity_logs ual, wib_bounds wb
				WHERE ual.user_id = $1::uuid AND ual.activity_type IN ('srs_review_completed', 'daily_vocab_quest_claim') AND ual.created_at >= wb.start_ts
			) THEN 1 ELSE 0 END
			+
			CASE WHEN COALESCE((
				SELECT SUM(ual.xp_earned) FROM user_activity_logs ual, wib_bounds wb
				WHERE ual.user_id = $1::uuid AND ual.created_at >= wb.start_ts AND ual.activity_type <> 'daily_golden_chest_claim'
			), 0) >= 50 THEN 1 ELSE 0 END
		)
		FROM locked_user
	`
	if err := tx.QueryRow(ctx, prereqQuery, claim.UserID).Scan(&qualifiedQuests); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return user.ErrUserNotFound
		}
		return fmt.Errorf("failed to verify daily chest prerequisites: %w", err)
	}
	if qualifiedQuests < claim.Tier {
		return ErrChestNotUnlocked
	}

	insertQuery := `
		INSERT INTO user_daily_chest_claims (user_id, claim_date, tier, gems_awarded, xp_awarded, created_at)
		VALUES ($1, (NOW() AT TIME ZONE 'Asia/Jakarta')::date, $2, $3, $4, NOW())
		ON CONFLICT (user_id, claim_date, tier) DO NOTHING
		RETURNING id, claim_date::text, created_at
	`
	err = tx.QueryRow(
		ctx, insertQuery,
		claim.UserID, claim.Tier, claim.GemsAwarded, claim.XPAwarded,
	).Scan(&claim.ID, &claim.ClaimDate, &claim.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrChestAlreadyClaimed
		}
		return fmt.Errorf("failed to record daily chest claim: %w", err)
	}

	updateQuery := `
		UPDATE user_gamification
		SET xp = GREATEST(0, xp + $2),
		    current_level = GREATEST(1, (GREATEST(0, xp + $2) / 100) + 1),
		    gems = GREATEST(0, gems + $3),
		    last_active_at = NOW(),
		    updated_at = NOW()
		WHERE user_id = $1
	`
	tag, err := tx.Exec(ctx, updateQuery, claim.UserID, claim.XPAwarded, claim.GemsAwarded)
	if err != nil {
		return fmt.Errorf("failed to update gamification stats for chest: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return user.ErrUserNotFound
	}

	return tx.Commit(ctx)
}

// CreateCoachingSubmission atomically consumes the required coaching coupon from user_inventories
// and records a mentorship or CV review request.
func (r *PostgresRepository) CreateCoachingSubmission(ctx context.Context, sub *CoachingSubmission) error {
	if err := validateUserUUID(sub.UserID); err != nil {
		return err
	}
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin coaching submission tx: %w", err)
	}
	defer tx.Rollback(ctx)

	var remainingQty int
	err = tx.QueryRow(
		ctx,
		`UPDATE user_inventories
		 SET quantity = quantity - 1, updated_at = NOW()
		 WHERE user_id = $1 AND item_id = $2 AND quantity > 0
		 RETURNING quantity`,
		sub.UserID, sub.Type,
	).Scan(&remainingQty)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrInsufficientCoupons
		}
		return fmt.Errorf("failed to consume coaching coupon: %w", err)
	}

	query := `
		INSERT INTO coaching_submissions (
			user_id, type, target_role, github_url, resume_url, discord_handle, interview_language, focus_topic, preferred_time, notes, status, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`
	if sub.Status == "" {
		sub.Status = "pending"
	}

	err = tx.QueryRow(
		ctx, query,
		sub.UserID, sub.Type, sub.TargetRole, sub.GitHubURL, sub.ResumeURL,
		sub.DiscordHandle, sub.InterviewLanguage, sub.FocusTopic, sub.PreferredTime, sub.Notes, sub.Status,
	).Scan(&sub.ID, &sub.CreatedAt, &sub.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to create coaching submission: %w", err)
	}
	return tx.Commit(ctx)
}
