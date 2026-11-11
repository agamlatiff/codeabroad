package domain

import (
	"context"
	"time"
)

// Specific User Domain Errors
var (
	ErrUserNotFound              = NewNotFoundError("USER_NOT_FOUND", "user not found")
	ErrDailyRewardAlreadyClaimed = NewConflictError("DAILY_REWARD_CLAIMED", "hadiah hari ini sudah diklaim sebelumnya")
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

// UserProfile represents Pillar 2: Profile & Learning Goals (user_profiles table)
type UserProfile struct {
	Name                 string  `json:"name"`
	Username             string  `json:"username"`
	Bio                  *string `json:"bio"`
	DailyGoalMinutes     int     `json:"daily_goal_minutes"`
	IsOnboarded          bool    `json:"is_onboarded"`
	HasSeenRoadmapTour   bool    `json:"has_seen_roadmap_tour"`
	PreferredRoadmapView string  `json:"preferred_roadmap_view"`
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

// --- 1. User Profile DTOs ---

// UpdateProfileRequest defines the input payload for updating user preferences and profile
type UpdateProfileRequest struct {
	Name                 *string `json:"name"`
	Bio                  *string `json:"bio"`
	DailyGoalMinutes     *int    `json:"daily_goal_minutes" binding:"omitempty,oneof=5 15 30 45"`
	HasSeenRoadmapTour   *bool   `json:"has_seen_roadmap_tour"`
	PreferredRoadmapView *string `json:"preferred_roadmap_view" binding:"omitempty,oneof=map syllabus"`
}

// --- 2. Activity & Consistency DTOs (7-Day Tracking) ---

// DailyActivityStat holds raw aggregated daily XP and completed lesson counts from persistence
type DailyActivityStat struct {
	XPEarned     int
	LessonsCount int
}

// UserActivityLogItem represents a single daily learning activity entry
type UserActivityLogItem struct {
	Date         string `json:"date"`         // "2026-10-14"
	DayIndex     int    `json:"day_index"`    // 0=Sen, 1=Sel, 2=Rab, 3=Kam, 4=Jum, 5=Sab, 6=Min
	DayLabel     string `json:"day_label"`    // "Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"
	IsActive     bool   `json:"is_active"`    // true if user was active on this day
	IsToday      bool   `json:"is_today"`
	XPEarned     int    `json:"xp_earned"`
	LessonsCount int    `json:"lessons_count"`
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
	RewardType string `json:"reward_type" binding:"required,oneof=lesson_milestone golden_chest"`
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
	Date                   string `json:"date"`
	LessonMilestoneClaimed bool   `json:"lesson_milestone_claimed"`
	GoldenChestClaimed     bool   `json:"golden_chest_claimed"`
}

// ============================================================================
// USER REPOSITORY & USECASE CONTRACTS
// ============================================================================

// UserAccountRepository specifies persistence for user account and profile (Pillar 1 & 2)
type UserAccountRepository interface {
	Create(ctx context.Context, user *User) error
	GetByEmail(ctx context.Context, email string) (*User, error)
	GetByUsername(ctx context.Context, username string) (*User, error)
	GetByID(ctx context.Context, id string) (*User, error)
	UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error)
	SetOnboarded(ctx context.Context, userID string, dailyGoalMinutes int) error
}

// UserGamificationRepository specifies persistence for high-concurrency game loop progression (Pillar 3)
type UserGamificationRepository interface {
	UpdateGamification(ctx context.Context, userID string, xp int, currentLevel int, streak int, lastActiveAt *time.Time) error
	AddGems(ctx context.Context, userID string, gems int) (int, error)
}

// UserActivityRepository specifies persistence for activity logging and daily habit claims
type UserActivityRepository interface {
	LogActivity(ctx context.Context, log *UserActivityLog) error
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

// UserUsecase specifies business operations for profile, activity history, and daily habit claims
type UserUsecase interface {
	GetProfile(ctx context.Context, userID string) (*User, error)
	UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error)
	GetActivityLogs(ctx context.Context, userID string) (*UserActivitySummaryResponse, error)
	ClaimDailyReward(ctx context.Context, userID string, rewardType string) (*DailyRewardClaimResponse, error)
	GetDailyRewardsStatus(ctx context.Context, userID string) (*DailyRewardsStatusResponse, error)
}
