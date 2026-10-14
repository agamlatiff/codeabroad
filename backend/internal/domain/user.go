package domain

import (
	"context"
	"fmt"
	"time"
)

// Specific User & Auth Errors
var (
	ErrEmailAlreadyExists = fmt.Errorf("%w: email is already registered", ErrConflict)
	ErrUsernameTaken      = fmt.Errorf("%w: username is already taken", ErrConflict)
	ErrInvalidCredentials = fmt.Errorf("%w: invalid email or password", ErrUnauthorized)
	ErrUserNotFound       = fmt.Errorf("%w: user not found", ErrNotFound)
	ErrTokenExpired       = fmt.Errorf("%w: token has expired or revoked", ErrUnauthorized)
)

// User represents the core account and gamification profile entity
type User struct {
	ID           string     `json:"id"`
	Name         string     `json:"name"`
	Username     string     `json:"username"`
	Email        string     `json:"email"`
	PasswordHash string     `json:"-"`
	AvatarURL    *string    `json:"avatar_url"`
	Bio          *string    `json:"bio"`
	GithubURL    *string    `json:"github_url"`
	LinkedinURL  *string    `json:"linkedin_url"`
	CareerPathID *string    `json:"career_path_id"`
	CountryID    *string    `json:"country_id"`
	PrimaryStack   *string    `json:"primary_stack"`
	Level          string     `json:"level"`
	TargetTimeline *string    `json:"target_timeline"`
	LanguageLevel  *string    `json:"language_level"`
	XP             int        `json:"xp"`
	CurrentLevel int        `json:"current_level"`
	Streak       int        `json:"streak"`
	LastActiveAt *time.Time `json:"last_active_at"`
	IsOnboarded  bool       `json:"is_onboarded"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

// RegisterRequest defines the input payload for registering a new user
type RegisterRequest struct {
	Name     string `json:"name" binding:"required,min=2,max=100"`
	Username string `json:"username" binding:"required,min=3,max=30"`
	Email    string `json:"email" binding:"required,email,max=255"`
	Password string `json:"password" binding:"required,min=8,max=72"`
}

// LoginRequest defines the input payload for authenticating a user
type LoginRequest struct {
	Email      string `json:"email" binding:"required,email,max=255"`
	Password   string `json:"password" binding:"required,min=8,max=72"`
	RememberMe bool   `json:"remember_me"`
}

// RefreshTokenRequest defines the input payload for refreshing tokens
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// UpdateProfileRequest defines the input payload for updating user preferences and profile
type UpdateProfileRequest struct {
	Name         *string `json:"name"`
	PrimaryStack *string `json:"primary_stack"`
	CareerPathID *string `json:"career_path_id"`
	Bio          *string `json:"bio"`
	GithubURL    *string `json:"github_url"`
	LinkedinURL  *string `json:"linkedin_url"`
}

// AuthResponse defines the payload returned upon successful authentication
type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	User         User   `json:"user"`
}

// UserActivityLog represents a daily learning activity entry
type UserActivityLog struct {
	Date        string `json:"date"`         // "2026-10-14"
	DayIndex    int    `json:"day_index"`    // 0=Sen, 1=Sel, 2=Rab, 3=Kam, 4=Jum, 5=Sab, 6=Min
	DayLabel    string `json:"day_label"`    // "Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"
	IsActive    bool   `json:"is_active"`    // true if user was active on this day
	IsToday     bool   `json:"is_today"`
	XPEarned    int    `json:"xp_earned"`
	QuestsCount int    `json:"quests_count"`
}

// UserActivitySummary provides weekly activity context and streak status
type UserActivitySummary struct {
	CurrentStreak   int               `json:"current_streak"`
	TotalActiveDays int               `json:"total_active_days"`
	LastActiveAt    *time.Time        `json:"last_active_at"`
	WeeklyLogs      []UserActivityLog `json:"weekly_logs"` // 7 days of current week (Mon-Sun)
}

// UserRepository specifies the database contract for user persistence
type UserRepository interface {
	Create(ctx context.Context, user *User) error
	GetByEmail(ctx context.Context, email string) (*User, error)
	GetByUsername(ctx context.Context, username string) (*User, error)
	GetByID(ctx context.Context, id string) (*User, error)
	UpdateOnboarding(ctx context.Context, userID string, countryID string, careerPathID string, primaryStack string, level string, targetTimeline string, languageLevel string, bonusXP int) error
	GetProfileWithDetails(ctx context.Context, userID string) (*OnboardingProfileResponse, error)
	UpdateGamification(ctx context.Context, userID string, xp int, currentLevel int, streak int, lastActiveAt *time.Time) error
	UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error)
	LogActivity(ctx context.Context, userID string, activityType string, xpEarned int, metadata map[string]interface{}) error
	GetWeeklyActivityLogs(ctx context.Context, userID string) (*UserActivitySummary, error)
}

// AuthUsecase specifies the business logic contract for authentication
type AuthUsecase interface {
	Register(ctx context.Context, req *RegisterRequest) (*AuthResponse, error)
	Login(ctx context.Context, req *LoginRequest) (*AuthResponse, error)
	RefreshToken(ctx context.Context, refreshToken string) (*AuthResponse, error)
	GetProfile(ctx context.Context, userID string) (*User, error)
	UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error)
	GetActivityLogs(ctx context.Context, userID string) (*UserActivitySummary, error)
	Logout(ctx context.Context, userID string) error
}

// SessionRepository specifies the caching contract for active user sessions
type SessionRepository interface {
	SetSession(ctx context.Context, userID string, token string, ttl time.Duration) error
	GetSession(ctx context.Context, userID string) (string, error)
	DeleteSession(ctx context.Context, userID string) error
}
