package domain

import (
	"context"
	"fmt"
	"time"
)

// Specific User Domain Errors
var (
	ErrUserNotFound              = fmt.Errorf("%w: user not found", ErrNotFound)
	ErrDailyRewardAlreadyClaimed = fmt.Errorf("%w: hadiah hari ini sudah diklaim sebelumnya", ErrConflict)
)

// ----------------------------------------------------------------------------
// 3-PILLAR NORMALIZED DOMAIN ENTITIES
// ----------------------------------------------------------------------------

// UserAccount represents Pillar 1: Auth Core (users table)
type UserAccount struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// UserProfile represents Pillar 2: Profile & Career Goals (user_profiles table)
type UserProfile struct {
	Name                 string             `json:"name"`
	Username             string             `json:"username"`
	Bio                  *string            `json:"bio"`
	CareerPathID         *string            `json:"career_path_id"`
	CountryID            *string            `json:"country_id"`
	TechStackID          *string            `json:"tech_stack_id,omitempty"`
	PrimaryStack         *string            `json:"primary_stack"`
	IsOnboarded          bool               `json:"is_onboarded"`
	HasSeenRoadmapTour   bool               `json:"has_seen_roadmap_tour"`
	PreferredRoadmapView string             `json:"preferred_roadmap_view"`
	Country              *CountrySummary    `json:"country,omitempty"`
	CareerPath           *CareerPathSummary `json:"career_path,omitempty"`
}

// UserGamificationStats represents Pillar 3: High-Concurrency Game Loop Stats (user_gamification table)
type UserGamificationStats struct {
	XP           int        `json:"xp"`
	CurrentLevel int        `json:"current_level"`
	Streak       int        `json:"streak"`
	Gems         int        `json:"gems"`
	LastActiveAt *time.Time `json:"last_active_at"`
}

// User represents the unified 3-Pillar Aggregate for API responses and system usecases
type User struct {
	UserAccount
	UserProfile
	UserGamificationStats
}

// ============================================================================
// USER DATA TRANSFER OBJECTS (DTOs: REQUESTS & RESPONSES)
// ============================================================================

// --- 1. User Profile DTOs (Profile Management) ---

// UpdateProfileRequest defines the input payload for updating user preferences and profile
type UpdateProfileRequest struct {
	Name                 *string `json:"name"`
	Bio                  *string `json:"bio"`
	CountryID            *string `json:"country_id"`
	CareerPathID         *string `json:"career_path_id"`
	TechStackID          *string `json:"tech_stack_id"`
	PrimaryStack         *string `json:"primary_stack"`
	HasSeenRoadmapTour   *bool   `json:"has_seen_roadmap_tour"`
	PreferredRoadmapView *string `json:"preferred_roadmap_view" binding:"omitempty,oneof=map syllabus"`
}

// --- 2. Activity & Consistency DTOs (7-Day Tracking) ---

// DailyActivityStat holds raw aggregated daily XP and completed quest counts from persistence
type DailyActivityStat struct {
	XPEarned    int
	QuestsCount int
}

// UserActivityLogItem represents a single daily learning activity entry
type UserActivityLogItem struct {
	Date        string `json:"date"`         // "2026-10-14"
	DayIndex    int    `json:"day_index"`    // 0=Sen, 1=Sel, 2=Rab, 3=Kam, 4=Jum, 5=Sab, 6=Min
	DayLabel    string `json:"day_label"`    // "Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"
	IsActive    bool   `json:"is_active"`    // true if user was active on this day
	IsToday     bool   `json:"is_today"`
	XPEarned    int    `json:"xp_earned"`
	QuestsCount int    `json:"quests_count"`
}

// UserActivitySummaryResponse provides weekly activity context and streak status
type UserActivitySummaryResponse struct {
	CurrentStreak   int                   `json:"current_streak"`
	TotalActiveDays int                   `json:"total_active_days"`
	LastActiveAt    *time.Time            `json:"last_active_at"`
	WeeklyLogs      []UserActivityLogItem `json:"weekly_logs"`  // 7 days of current week (Mon-Sun)
	ActiveDates     []string              `json:"active_dates"` // Active dates for monthly calendar (YYYY-MM-DD)
}

// --- 3. Daily Rewards DTOs (Habit Milestones) ---

// DailyRewardClaimRequest defines the payload for claiming a daily habit reward
type DailyRewardClaimRequest struct {
	RewardType string `json:"reward_type" binding:"required"` // "vocab_quest" or "golden_chest"
}

// DailyRewardClaimResponse defines the payload returned after claiming a daily reward
type DailyRewardClaimResponse struct {
	RewardType   string `json:"reward_type"`
	XPAwarded    int    `json:"xp_awarded"`
	CurrentXP    int    `json:"current_xp"`
	CurrentLevel int    `json:"current_level"`
	Streak       int    `json:"streak"`
	ClaimedAt    string `json:"claimed_at"`
}

// DailyRewardsStatusResponse reports which daily rewards have been claimed today
type DailyRewardsStatusResponse struct {
	Date               string `json:"date"`
	VocabQuestClaimed  bool   `json:"vocab_quest_claimed"`
	GoldenChestClaimed bool   `json:"golden_chest_claimed"`
}

// ============================================================================
// USER REPOSITORY & USECASE CONTRACTS
// ============================================================================

// UserAccountRepository specifies the persistence contract for user account and profile (Pillar 1 & 2)
type UserAccountRepository interface {
	Create(ctx context.Context, user *User) error
	GetByEmail(ctx context.Context, email string) (*User, error)
	GetByUsername(ctx context.Context, username string) (*User, error)
	GetByID(ctx context.Context, id string) (*User, error)
	UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error)
	UpdateOnboarding(ctx context.Context, userID string, countryID string, careerPathID string, primaryStack string, bonusXP int) error
	GetProfileWithDetails(ctx context.Context, userID string) (*OnboardingProfileResponse, error)
}

// UserGamificationRepository specifies the contract for high-concurrency game loop progression (Pillar 3)
type UserGamificationRepository interface {
	UpdateGamification(ctx context.Context, userID string, xp int, currentLevel int, streak int, lastActiveAt *time.Time) error
	AddGems(ctx context.Context, userID string, gems int) (int, error)
}

// UserActivityRepository specifies the contract for pure SQL activity persistence and daily claims
type UserActivityRepository interface {
	LogActivity(ctx context.Context, userID string, activityType string, xpEarned int, metadata map[string]interface{}) error
	HasActivityInRange(ctx context.Context, userID string, startTime time.Time, endTime time.Time) (bool, error)
	GetDailyActivityStatsSince(ctx context.Context, userID string, since time.Time) (map[string]DailyActivityStat, error)
	ClaimDailyReward(ctx context.Context, userID string, rewardType string, xpAwarded int) (*DailyRewardClaimResponse, error)
	GetDailyRewardsStatus(ctx context.Context, userID string) (*DailyRewardsStatusResponse, error)
}

// UserRepository composes all user persistence contracts into a unified interface (ISP via Composition)
type UserRepository interface {
	UserAccountRepository
	UserGamificationRepository
	UserActivityRepository
}

// UserUsecase specifies the business logic contract for user profile, preferences, and daily consistency
type UserUsecase interface {
	GetProfile(ctx context.Context, userID string) (*User, error)
	UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error)
	GetActivityLogs(ctx context.Context, userID string) (*UserActivitySummaryResponse, error)
	ClaimDailyReward(ctx context.Context, userID string, rewardType string) (*DailyRewardClaimResponse, error)
	GetDailyRewardsStatus(ctx context.Context, userID string) (*DailyRewardsStatusResponse, error)
}
