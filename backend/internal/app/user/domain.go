package user

import (
	"context"
	"time"

	"merantalk/backend/internal/shared/apperror"
)

// Specific User Domain Errors
var (
	ErrUserNotFound              = apperror.NewNotFoundError("USER_NOT_FOUND", "user not found")
	ErrDailyRewardAlreadyClaimed = apperror.NewConflictError("DAILY_REWARD_CLAIMED", "hadiah hari ini sudah diklaim sebelumnya")
	ErrDailyRewardNotUnlocked    = apperror.NewBadRequestError("DAILY_REWARD_NOT_UNLOCKED", "syarat misi harian belum terpenuhi untuk mengklaim hadiah ini", nil)
	ErrEmailAlreadyExists        = apperror.NewConflictError("EMAIL_ALREADY_EXISTS", "email sudah terdaftar")
	ErrUsernameTaken             = apperror.NewConflictError("USERNAME_TAKEN", "username sudah digunakan")
	ErrOAuthAccountConflict      = apperror.NewConflictError("OAUTH_ACCOUNT_CONFLICT", "akun ini sudah terhubung dengan akun OAuth lain")
	ErrLocalAccountUnverified    = apperror.NewConflictError("LOCAL_ACCOUNT_UNVERIFIED", "email ini sudah terdaftar dengan akun kata sandi yang belum terverifikasi; masuk dengan kata sandi terlebih dahulu")
)

// OAuthAccount links an external identity provider (e.g., Google) to a Merantalk user account.
type OAuthAccount struct {
	ID             string    `json:"id"`
	UserID         string    `json:"user_id"`
	Provider       string    `json:"provider"`
	ProviderUserID string    `json:"provider_user_id"`
	Email          string    `json:"email"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// ----------------------------------------------------------------------------
// 3-PILLAR NORMALIZED DOMAIN ENTITIES
// ----------------------------------------------------------------------------

// UserAccount represents Pillar 1: Auth Core (users table)
type UserAccount struct {
	ID                    string     `json:"id"`
	Email                 string     `json:"email"`
	PasswordHash          string     `json:"-"`
	EmailVerified         bool       `json:"email_verified"`
	SubscriptionTier      string     `json:"subscription_tier"`
	SubscriptionExpiresAt *time.Time `json:"subscription_expires_at,omitempty"`
	CreatedAt             time.Time  `json:"created_at"`
	UpdatedAt             time.Time  `json:"updated_at"`
}

// IsPro reports whether the account currently has an active Pro subscription.
func (u UserAccount) IsPro() bool {
	if u.SubscriptionTier != "pro" {
		return false
	}
	if u.SubscriptionExpiresAt != nil && u.SubscriptionExpiresAt.Before(time.Now()) {
		return false
	}
	return true
}

// UserProfile represents Pillar 2: Profile & Learning Goals (user_profiles table)
type UserProfile struct {
	Name                 string  `json:"name"`
	Username             string  `json:"username"`
	Bio                  *string `json:"bio"`
	AvatarURL            *string `json:"avatar_url,omitempty"`
	DailyGoalMinutes     int     `json:"daily_goal_minutes"`
	IsOnboarded        bool `json:"is_onboarded"`
	HasSeenRoadmapTour bool `json:"has_seen_roadmap_tour"`
}

// UserGamificationStats represents Pillar 3: High-Concurrency Game Loop Stats (user_gamification table)
type UserGamificationStats struct {
	XP                 int        `json:"xp"`
	CurrentLevel       int        `json:"current_level"`
	Streak             int        `json:"streak"`
	Gems               int        `json:"gems"`
	LastActiveAt       *time.Time `json:"last_active_at"`
	XPBoosterExpiresAt *time.Time `json:"xp_booster_expires_at,omitempty"`
}

// User represents the unified 3-Pillar Aggregate for API responses and system usecases
type User struct {
	UserAccount
	UserProfile
	UserGamificationStats
}

// UserActivityLog records individual audit events of learning consistency (user_activity_logs table)
type UserActivityLog struct {
	ID           string         `json:"id"`
	UserID       string         `json:"user_id"`
	ActivityType string         `json:"activity_type"`
	XPEarned     int            `json:"xp_earned"`
	Metadata     map[string]any `json:"metadata,omitempty"`
	CreatedAt    time.Time      `json:"created_at"`
}

// ============================================================================
// USER DATA TRANSFER OBJECTS (DTOs: REQUESTS & RESPONSES)
// ============================================================================

// UpdateProfileRequest defines the input payload for updating user preferences and profile
type UpdateProfileRequest struct {
	Name                 *string `json:"name"`
	Bio                  *string `json:"bio"`
	AvatarURL            *string `json:"avatar_url"`
	DailyGoalMinutes   *int    `json:"daily_goal_minutes" binding:"omitempty,oneof=5 15 30 45"`
	HasSeenRoadmapTour *bool   `json:"has_seen_roadmap_tour"`
}

// DailyActivityStat holds raw aggregated daily XP and completed lesson counts from persistence
type DailyActivityStat struct {
	XPEarned     int
	LessonsCount int
}

// UserActivityLogItem represents a single daily learning activity entry
type UserActivityLogItem struct {
	Date         string `json:"date"`
	DayIndex     int    `json:"day_index"`
	DayLabel     string `json:"day_label"`
	IsActive     bool   `json:"is_active"`
	IsToday      bool   `json:"is_today"`
	XPEarned     int    `json:"xp_earned"`
	LessonsCount int    `json:"lessons_count"`
}

// UserActivitySummaryResponse provides weekly activity context and streak status
type UserActivitySummaryResponse struct {
	CurrentStreak   int                   `json:"current_streak"`
	TotalActiveDays int                   `json:"total_active_days"`
	LastActiveAt    *time.Time            `json:"last_active_at"`
	WeeklyLogs      []UserActivityLogItem `json:"weekly_logs"`
	ActiveDates     []string              `json:"active_dates"`
}

// DailyRewardClaimRequest defines the payload for claiming a daily habit reward
type DailyRewardClaimRequest struct {
	RewardType string `json:"reward_type" binding:"required,oneof=vocab_quest golden_chest"`
}

// DailyRewardClaimResponse defines the payload returned after claiming a daily reward
type DailyRewardClaimResponse struct {
	RewardType   string `json:"reward_type"`
	XPAwarded    int    `json:"xp_awarded"`
	GemsAwarded  int    `json:"gems_awarded"`
	CurrentXP    int    `json:"current_xp"`
	CurrentLevel int    `json:"current_level"`
	CurrentGems  int    `json:"current_gems"`
	Streak       int    `json:"streak"`
	ClaimedAt    string `json:"claimed_at"`
}

// DailyRewardsStatusResponse reports which daily rewards have been claimed today and vocab quest progress
type DailyRewardsStatusResponse struct {
	Date                    string `json:"date"`
	VocabQuestClaimed       bool   `json:"vocab_quest_claimed"`
	GoldenChestClaimed      bool   `json:"golden_chest_claimed"`
	TodayFlashcardsReviewed int    `json:"today_flashcards_reviewed"`
	VocabQuestTarget        int    `json:"vocab_quest_target"`
	VocabQuestUnlocked      bool   `json:"vocab_quest_unlocked"`
}

// ============================================================================
// USER REPOSITORY & USECASE CONTRACTS
// ============================================================================

// AccountRepository specifies persistence for user account and profile (Pillar 1 & 2)
type AccountRepository interface {
	Create(ctx context.Context, user *User) error
	GetByEmail(ctx context.Context, email string) (*User, error)
	GetByUsername(ctx context.Context, username string) (*User, error)
	GetByID(ctx context.Context, id string) (*User, error)
	GetByOAuthProvider(ctx context.Context, provider string, providerUserID string) (*User, error)
	CreateWithOAuth(ctx context.Context, user *User, oauth *OAuthAccount) error
	LinkOAuthAccount(ctx context.Context, oauth *OAuthAccount) error
	UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error)
	SetOnboarded(ctx context.Context, userID string, dailyGoalMinutes int) error
}

// GamificationRepository specifies persistence for high-concurrency game loop progression (Pillar 3)
type GamificationRepository interface {
	UpdateGamification(ctx context.Context, userID string, xp int, currentLevel int, streak int, lastActiveAt *time.Time) error
	AddGems(ctx context.Context, userID string, gems int) (int, error)
}

// ActivityRepository specifies persistence for activity logging and daily habit claims
type ActivityRepository interface {
	LogActivity(ctx context.Context, log *UserActivityLog) error
	HasActivityInRange(ctx context.Context, userID string, startTime time.Time, endTime time.Time) (bool, error)
	EnsureDailyLogin(ctx context.Context, userID string, dateStr string, startTime time.Time, endTime time.Time) (bool, error)
	GetDailyActivityStatsSince(ctx context.Context, userID string, since time.Time) (map[string]DailyActivityStat, error)
	ClaimDailyReward(ctx context.Context, userID string, rewardType string, xpAwarded int, gemsAwarded int) (*DailyRewardClaimResponse, error)
	GetDailyRewardsStatus(ctx context.Context, userID string) (*DailyRewardsStatusResponse, error)
}

// Repository composes all user persistence contracts into a unified interface (ISP via Composition)
type Repository interface {
	AccountRepository
	GamificationRepository
	ActivityRepository
}

// StreakBadgeAwarder awards streak milestone badges without introducing an import cycle with gamification.
type StreakBadgeAwarder interface {
	AwardStreakBadge(ctx context.Context, userID string, badgeKey string, currentLevel int) (bool, error)
}

// Usecase specifies business operations for profile, activity history, and daily habit claims
type Usecase interface {
	GetProfile(ctx context.Context, userID string) (*User, error)
	UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error)
	GetActivityLogs(ctx context.Context, userID string) (*UserActivitySummaryResponse, error)
	ClaimDailyReward(ctx context.Context, userID string, rewardType string) (*DailyRewardClaimResponse, error)
	GetDailyRewardsStatus(ctx context.Context, userID string) (*DailyRewardsStatusResponse, error)
}

