package gamification

import (
	"context"
	"time"

	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/app/user"
)

// Specific Gamification Domain Errors
var (
	ErrBadgeNotFound       = apperror.NewNotFoundError("BADGE_NOT_FOUND", "badge definition not found")
	ErrShopItemNotFound    = apperror.NewNotFoundError("SHOP_ITEM_NOT_FOUND", "shop item not found")
	ErrInsufficientGems    = apperror.NewBadRequestError("INSUFFICIENT_GEMS", "not enough gems to complete transaction", nil)
	ErrChestAlreadyClaimed = apperror.NewConflictError("CHEST_ALREADY_CLAIMED", "chest tier already claimed today")
	ErrItemUnavailable     = apperror.NewBadRequestError("ITEM_UNAVAILABLE", "item is currently not available for purchase", nil)
)

// UserGamification represents high-concurrency game loop progression (user_gamification table)
type UserGamification struct {
	ID           string     `json:"id"`
	UserID       string     `json:"user_id"`
	XP           int        `json:"xp"`
	CurrentLevel int        `json:"current_level"`
	Streak       int        `json:"streak"`
	Gems         int        `json:"gems"`
	LastActiveAt *time.Time `json:"last_active_at"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

// BadgeDefinition represents system-wide earnable achievements (badge_definitions table)
type BadgeDefinition struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Icon        string    `json:"icon"`
	Category    string    `json:"category"` // speed | consistency | mastery | streak | special
	XPBonus     int       `json:"xp_bonus"`
	CreatedAt   time.Time `json:"created_at"`
}

// UserBadge represents an unlocked achievement awarded to a user (user_badges table)
type UserBadge struct {
	ID        string           `json:"id"`
	UserID    string           `json:"user_id"`
	BadgeKey  string           `json:"badge_key"`
	Badge     *BadgeDefinition `json:"badge,omitempty"`
	AwardedAt time.Time        `json:"awarded_at"`
}

// ShopItem represents a purchasable consumable or cosmetic perk (shop_items table)
type ShopItem struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Category    string    `json:"category"` // boost | cosmetic | streak_freeze | companion | pass
	PriceGems   int       `json:"price_gems"`
	Icon        string    `json:"icon"`
	IsAvailable bool      `json:"is_available"`
	CreatedAt   time.Time `json:"created_at"`
}

// UserInventoryItem represents an item owned by a user in the arcade inventory (user_inventories table)
type UserInventoryItem struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	ItemID    string    `json:"item_id"`
	Quantity  int       `json:"quantity"`
	Item      *ShopItem `json:"item,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// DailyChestClaim represents a claimed 3-tier milestone chest (daily_chest_claims table)
type DailyChestClaim struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	ClaimDate   string    `json:"claim_date"`
	Tier        int       `json:"tier"`
	GemsAwarded int       `json:"gems_awarded"`
	XPAwarded   int       `json:"xp_awarded"`
	CreatedAt   time.Time `json:"created_at"`
}

// CoachingSubmission represents a CV review or VIP mock interview request (coaching_submissions table)
type CoachingSubmission struct {
	ID                string    `json:"id"`
	UserID            string    `json:"user_id"`
	Type              string    `json:"type"` // cv-review | mock-interview
	TargetRole        string    `json:"target_role,omitempty"`
	GitHubURL         string    `json:"github_url,omitempty"`
	ResumeURL         string    `json:"resume_url,omitempty"`
	DiscordHandle     string    `json:"discord_handle,omitempty"`
	InterviewLanguage string    `json:"interview_language,omitempty"`
	FocusTopic        string    `json:"focus_topic,omitempty"`
	PreferredTime     string    `json:"preferred_time,omitempty"`
	Notes             string    `json:"notes,omitempty"`
	Status            string    `json:"status"` // pending | in_review | confirmed_discord | completed
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// GamificationStatus represents the full single source of truth gamified state
type GamificationStatus struct {
	XP             int                 `json:"xp"`
	CurrentLevel   int                 `json:"current_level"`
	Streak         int                 `json:"streak"`
	Gems           int                 `json:"gems"`
	Inventory      map[string]int      `json:"inventory"`
	InventoryItems []UserInventoryItem `json:"inventory_items,omitempty"`
	ClaimedChests  []int               `json:"claimed_chests"`
	Badges         []UserBadge         `json:"badges,omitempty"`
}

// ClaimChestRequest defines the payload to claim a milestone chest
type ClaimChestRequest struct {
	Tier int `json:"tier" binding:"required,min=1,max=3"`
}

// ShopBuyRequest defines the payload to purchase an Akihabara arcade item
type ShopBuyRequest struct {
	ItemID string `json:"item_id" binding:"required"`
}

// CoachingSubmissionRequest defines the payload for mentorship or review requests
type CoachingSubmissionRequest struct {
	Type              string `json:"type" binding:"required,oneof=cv-review mock-interview"`
	TargetRole        string `json:"target_role"`
	GitHubURL         string `json:"github_url"`
	ResumeURL         string `json:"resume_url"`
	DiscordHandle     string `json:"discord_handle"`
	InterviewLanguage string `json:"interview_language"`
	FocusTopic        string `json:"focus_topic"`
	PreferredTime     string `json:"preferred_time"`
	Notes             string `json:"notes"`
}

// Repository specifies persistence operations for gamification elements
type Repository interface {
	GetStatus(ctx context.Context, userID string) (*GamificationStatus, error)
	GetGamificationStats(ctx context.Context, userID string) (*user.UserGamificationStats, error)
	UpdateStats(ctx context.Context, userID string, xp int, level int, streak int, gems int, lastActiveAt *time.Time) error
	AddXPAndGems(ctx context.Context, userID string, xp int, level int, gems int) (*user.UserGamificationStats, error)
	GetShopItems(ctx context.Context, onlyAvailable bool) ([]ShopItem, error)
	GetShopItemByID(ctx context.Context, itemID string) (*ShopItem, error)
	GetUserInventory(ctx context.Context, userID string) ([]UserInventoryItem, error)
	BuyShopItem(ctx context.Context, userID string, itemID string, priceGems int) (*UserInventoryItem, int, error)
	GetBadges(ctx context.Context) ([]BadgeDefinition, error)
	GetUserBadges(ctx context.Context, userID string) ([]UserBadge, error)
	AwardBadge(ctx context.Context, userID string, badgeKey string, newLevel int) (*UserBadge, error)
	GetDailyChestClaims(ctx context.Context, userID string, claimDate string) ([]DailyChestClaim, error)
	ClaimDailyChest(ctx context.Context, claim *DailyChestClaim, newLevel int) error
	CreateCoachingSubmission(ctx context.Context, sub *CoachingSubmission) error
}

// Usecase specifies business operations for shop, chests, and badges
type Usecase interface {
	GetStatus(ctx context.Context, userID string) (*GamificationStatus, error)
	ListShopItems(ctx context.Context) ([]ShopItem, error)
	BuyShopItem(ctx context.Context, userID string, itemID string) (*UserInventoryItem, *GamificationStatus, error)
	ListBadges(ctx context.Context, userID string) ([]BadgeDefinition, []UserBadge, error)
	ClaimDailyChest(ctx context.Context, userID string, tier int) (*DailyChestClaim, *GamificationStatus, error)
	SubmitCoaching(ctx context.Context, userID string, req *CoachingSubmissionRequest) (*CoachingSubmission, *GamificationStatus, error)
}

