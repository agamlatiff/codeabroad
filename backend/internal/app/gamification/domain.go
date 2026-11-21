package gamification

import (
	"context"
	"time"

	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/app/user"
)

// Specific Gamification Domain Errors
var (
	ErrBadgeNotFound          = apperror.NewNotFoundError("BADGE_NOT_FOUND", "badge definition not found")
	ErrShopItemNotFound       = apperror.NewNotFoundError("SHOP_ITEM_NOT_FOUND", "shop item not found")
	ErrInsufficientGems       = apperror.NewBadRequestError("INSUFFICIENT_GEMS", "not enough gems to complete transaction", nil)
	ErrChestAlreadyClaimed    = apperror.NewConflictError("CHEST_ALREADY_CLAIMED", "chest tier already claimed today")
	ErrChestNotUnlocked       = apperror.NewBadRequestError("CHEST_NOT_UNLOCKED", "selesaikan target misi harian terlebih dahulu untuk membuka peti ini", nil)
	ErrItemUnavailable        = apperror.NewBadRequestError("ITEM_UNAVAILABLE", "item is currently not available for purchase", nil)
	ErrInvalidCoachingPayload = apperror.NewBadRequestError("INVALID_COACHING_PAYLOAD", "coaching submission fields are invalid", nil)
	ErrInsufficientCoupons    = apperror.NewBadRequestError("INSUFFICIENT_COUPONS", "you do not own an active coupon for this coaching service", nil)
	ErrDailyQuestNotFound     = apperror.NewNotFoundError("DAILY_QUEST_NOT_FOUND", "misi harian tidak ditemukan")
	ErrDailyQuestNotCompleted = apperror.NewBadRequestError("DAILY_QUEST_NOT_COMPLETED", "target misi harian belum tercapai", nil)
	ErrDailyQuestAlreadyClaimed = apperror.NewConflictError("DAILY_QUEST_ALREADY_CLAIMED", "hadiah misi harian ini sudah diklaim hari ini")
)

const (
	DefaultGamificationMutationLimit   = 30
	DefaultGamificationMutationMessage = "terlalu banyak permintaan, silakan tunggu sebentar"
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
	XPReward    int       `json:"xp_reward"`
	XPBonus     int       `json:"xp_bonus,omitempty"` // alias for backwards compatibility
	CreatedAt   time.Time `json:"created_at"`
}

// UserBadge represents an unlocked achievement awarded to a user (user_badges table)
type UserBadge struct {
	ID           string           `json:"id"`
	UserID       string           `json:"user_id"`
	BadgeKey     string           `json:"badge_key"`
	Badge        *BadgeDefinition `json:"badge,omitempty"`
	AwardedAt    time.Time        `json:"awarded_at"`
	NewlyAwarded bool             `json:"newly_awarded,omitempty"`
}

// ShopItem represents a purchasable consumable or cosmetic perk (shop_items table)
type ShopItem struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Name        string    `json:"name,omitempty"` // alias for backwards compatibility
	Subtitle    string    `json:"subtitle"`
	Description string    `json:"description,omitempty"` // alias for backwards compatibility
	Category    string    `json:"category"`              // boost | cosmetic | streak_freeze | companion | pass
	PriceGems   int       `json:"price_gems"`
	Badge       string    `json:"badge"`
	Icon        string    `json:"icon,omitempty"` // alias for backwards compatibility
	IsActive    bool      `json:"is_active"`
	IsAvailable bool      `json:"is_available"` // alias for backwards compatibility
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
	ItemID string `json:"item_id" binding:"required,max=100"`
}

// CoachingSubmissionRequest defines the payload for mentorship or review requests
type CoachingSubmissionRequest struct {
	Type              string `json:"type" binding:"required,oneof=cv-review mock-interview"`
	TargetRole        string `json:"target_role" binding:"max=120"`
	GitHubURL         string `json:"github_url" binding:"max=500"`
	ResumeURL         string `json:"resume_url" binding:"max=500"`
	DiscordHandle     string `json:"discord_handle" binding:"max=100"`
	InterviewLanguage string `json:"interview_language" binding:"max=50"`
	FocusTopic        string `json:"focus_topic" binding:"max=120"`
	PreferredTime     string `json:"preferred_time" binding:"max=120"`
	Notes             string `json:"notes" binding:"max=2000"`
}

// DailyQuestItem represents a daily rotated mission resolved from backend PostgreSQL templates and live user progress.
type DailyQuestItem struct {
	ID              string `json:"id"`
	Code            string `json:"code"`
	SlotCategory    string `json:"slot_category"`
	Title           string `json:"title"`
	ChipLabel       string `json:"chip_label"`
	MetricType      string `json:"metric_type"`
	CurrentValue    int    `json:"current_value"`
	TargetValue     int    `json:"target_value"`
	ProgressPercent int    `json:"progress_percent"`
	ProgressText    string `json:"progress_text"`
	XPReward        int    `json:"xp_reward"`
	Route           string `json:"route"`
	IconName        string `json:"icon_name"`
	IsCompleted     bool   `json:"is_completed"`
	IsClaimed       bool   `json:"is_claimed"`
}

// ClaimDailyQuestResponse represents the atomic reward response after claiming a completed daily quest.
type ClaimDailyQuestResponse struct {
	QuestID      string `json:"quest_id"`
	XPAwarded    int    `json:"xp_awarded"`
	CurrentXP    int    `json:"current_xp"`
	CurrentLevel int    `json:"current_level"`
	Streak       int    `json:"streak"`
	ClaimedAt    string `json:"claimed_at"`
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
	GetDailyQuests(ctx context.Context, userID string) ([]DailyQuestItem, error)
	ClaimDailyQuest(ctx context.Context, userID string, questID string) (*ClaimDailyQuestResponse, error)
	CreateCoachingSubmission(ctx context.Context, sub *CoachingSubmission) error
}

// Usecase specifies business operations for shop, chests, badges, and daily quests
type Usecase interface {
	GetStatus(ctx context.Context, userID string) (*GamificationStatus, error)
	ListShopItems(ctx context.Context) ([]ShopItem, error)
	BuyShopItem(ctx context.Context, userID string, itemID string) (*UserInventoryItem, *GamificationStatus, error)
	ListBadges(ctx context.Context, userID string) ([]BadgeDefinition, []UserBadge, error)
	ClaimDailyChest(ctx context.Context, userID string, tier int) (*DailyChestClaim, *GamificationStatus, error)
	GetDailyQuests(ctx context.Context, userID string) ([]DailyQuestItem, error)
	ClaimDailyQuest(ctx context.Context, userID string, questID string) (*ClaimDailyQuestResponse, error)
	SubmitCoaching(ctx context.Context, userID string, req *CoachingSubmissionRequest) (*CoachingSubmission, *GamificationStatus, error)
}

