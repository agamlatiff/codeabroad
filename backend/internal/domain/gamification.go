package domain

import (
	"context"
	"time"
)

// UserInventoryItem represents an item owned by a user
type UserInventoryItem struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	ItemID    string    `json:"item_id"`
	Quantity  int       `json:"quantity"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// UserBadge represents a badge awarded to a user
type UserBadge struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	BadgeKey    string    `json:"badge_key"`
	Title       string    `json:"title"`
	Description string    `json:"description,omitempty"`
	Icon        string    `json:"icon,omitempty"`
	AwardedAt   time.Time `json:"awarded_at"`
}

// DailyChestClaim represents a claimed 3-tier milestone chest
type DailyChestClaim struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	ClaimDate   string    `json:"claim_date"`
	Tier        int       `json:"tier"`
	GemsAwarded int       `json:"gems_awarded"`
	XPAwarded   int       `json:"xp_awarded"`
	CreatedAt   time.Time `json:"created_at"`
}

// CoachingSubmission represents a CV review or VIP mock interview submission
type CoachingSubmission struct {
	ID                string    `json:"id"`
	UserID            string    `json:"user_id"`
	Type              string    `json:"type"` // "cv-review" | "mock-interview"
	TargetRole        string    `json:"target_role,omitempty"`
	GitHubURL         string    `json:"github_url,omitempty"`
	ResumeURL         string    `json:"resume_url,omitempty"`
	DiscordHandle     string    `json:"discord_handle,omitempty"`
	InterviewLanguage string    `json:"interview_language,omitempty"`
	FocusTopic        string    `json:"focus_topic,omitempty"`
	PreferredTime     string    `json:"preferred_time,omitempty"`
	Notes             string    `json:"notes,omitempty"`
	Status            string    `json:"status"` // "in_review", "confirmed_discord", "completed"
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// GamificationStatus represents the full SSOT gamification state for a user
type GamificationStatus struct {
	Gems                int            `json:"gems"`
	Inventory           map[string]int `json:"inventory"`
	ClaimedChests       []int          `json:"claimed_chests"` // e.g. [1, 2]
	MonthlyBadgeClaimed bool           `json:"monthly_badge_claimed"`
	MonthlyBadgeKey     string         `json:"monthly_badge_key"`
}

// ClaimChestRequest is the payload to claim a milestone chest
type ClaimChestRequest struct {
	Tier int `json:"tier" binding:"required,min=1,max=3"`
}

// ShopBuyRequest is the payload to purchase an Akihabara arcade item
type ShopBuyRequest struct {
	ItemID string `json:"item_id" binding:"required"`
}

// CoachingSubmissionRequest is the payload for CV review or mock interview
type CoachingSubmissionRequest struct {
	Type              string `json:"type" binding:"required"`
	TargetRole        string `json:"target_role"`
	GitHubURL         string `json:"github_url"`
	ResumeURL         string `json:"resume_url"`
	DiscordHandle     string `json:"discord_handle"`
	InterviewLanguage string `json:"interview_language"`
	FocusTopic        string `json:"focus_topic"`
	PreferredTime     string `json:"preferred_time"`
	Notes             string `json:"notes"`
}

// GamificationRepository interface defines persistence contracts for gamification
type GamificationRepository interface {
	GetStatus(ctx context.Context, userID string) (*GamificationStatus, error)
	ClaimDailyChest(ctx context.Context, userID string, tier int, gemsAwarded int, xpAwarded int) error
	BuyShopItem(ctx context.Context, userID string, itemID string, price int) (int, map[string]int, error)
	ClaimMonthlyBadge(ctx context.Context, userID string, badgeKey string, title string, description string, icon string, gemReward int) error
	CreateCoachingSubmission(ctx context.Context, userID string, sub *CoachingSubmission) error
}

// GamificationUsecase interface defines business logic contracts for gamification
type GamificationUsecase interface {
	GetStatus(ctx context.Context, userID string) (*GamificationStatus, error)
	ClaimDailyChest(ctx context.Context, userID string, tier int) (*GamificationStatus, int, int, error)
	BuyShopItem(ctx context.Context, userID string, itemID string) (*GamificationStatus, error)
	ClaimMonthlyBadge(ctx context.Context, userID string) (*GamificationStatus, error)
	SubmitCoaching(ctx context.Context, userID string, req *CoachingSubmissionRequest) (*CoachingSubmission, *GamificationStatus, error)
}
