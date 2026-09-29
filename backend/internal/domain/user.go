package domain

import (
	"context"
	"time"
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
	Level        string     `json:"level"`
	XP           int        `json:"xp"`
	CurrentLevel int        `json:"current_level"`
	Streak       int        `json:"streak"`
	LastActiveAt *time.Time `json:"last_active_at"`
	IsOnboarded  bool       `json:"is_onboarded"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

// RegisterRequest defines the input payload for registering a new user
type RegisterRequest struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginRequest defines the input payload for authenticating a user
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthResponse defines the payload returned upon successful authentication
type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	User         User   `json:"user"`
}

// UserRepository specifies the database contract for user persistence
type UserRepository interface {
	Create(ctx context.Context, user *User) error
	GetByEmail(ctx context.Context, email string) (*User, error)
	GetByUsername(ctx context.Context, username string) (*User, error)
	GetByID(ctx context.Context, id string) (*User, error)
}


// AuthUsecase specifies the business logic contract for authentication
type AuthUsecase interface {
	Register(ctx context.Context, req *RegisterRequest) (*AuthResponse, error)
	Login(ctx context.Context, req *LoginRequest) (*AuthResponse, error)
	RefreshToken(ctx context.Context, refreshToken string) (*AuthResponse, error)
	GetProfile(ctx context.Context, userID string) (*User, error)
}