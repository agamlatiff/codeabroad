package domain

import (
	"context"
	"encoding/json"
	"fmt"
	"time"
)

// Specific Onboarding Errors
var (
	ErrCountryNotFound    = fmt.Errorf("%w: country not found", ErrNotFound)
	ErrCountryNotActive   = fmt.Errorf("%w: country is coming soon and not yet active", ErrBadRequest)
	ErrCareerPathNotFound = fmt.Errorf("%w: career path not found", ErrNotFound)
	ErrStackNotActive     = fmt.Errorf("%w: selected tech stack is coming soon and not yet active", ErrBadRequest)
	ErrInvalidStack       = fmt.Errorf("%w: invalid tech stack for the selected career path", ErrBadRequest)
	ErrAlreadyOnboarded   = fmt.Errorf("%w: user has already completed onboarding", ErrConflict)
)

// Country represents a destination country entity
type Country struct {
	ID          string          `json:"id"`
	Code        string          `json:"code"`
	Name        string          `json:"name"`
	FlagEmoji   string          `json:"flag_emoji"`
	IsActive    bool            `json:"is_active"`
	Badge       *string         `json:"badge"`
	VisaInfo    json.RawMessage `json:"visa_info"`
	SalaryRange json.RawMessage `json:"salary_range"`
	WorkCulture *string         `json:"work_culture"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
}

// TechStack represents a specific programming language/technology stack within a career path
type TechStack struct {
	Slug     string `json:"slug"`
	Label    string `json:"label"`
	IsActive bool   `json:"is_active"`
	Badge    string `json:"badge"`
}

// CareerPath represents an engineering track entity
type CareerPath struct {
	ID          string      `json:"id"`
	Slug        string      `json:"slug"`
	Label       string      `json:"label"`
	Description *string     `json:"description"`
	Stacks      []TechStack `json:"stacks"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}

// OnboardingRequest defines the payload for submitting user onboarding preferences
type OnboardingRequest struct {
	CountryID    string `json:"country_id" binding:"required,uuid"`
	CareerPathID string `json:"career_path_id" binding:"required,uuid"`
	PrimaryStack string `json:"primary_stack" binding:"required"`
	Level        string `json:"level" binding:"required,oneof=beginner intermediate"`
}

// CountrySummary represents simplified country data embedded in user profile responses
type CountrySummary struct {
	ID        string `json:"id"`
	Code      string `json:"code"`
	Name      string `json:"name"`
	FlagEmoji string `json:"flag_emoji"`
}

// CareerPathSummary represents simplified career path data embedded in user profile responses
type CareerPathSummary struct {
	ID    string `json:"id"`
	Slug  string `json:"slug"`
	Label string `json:"label"`
}

// OnboardingProfileResponse represents the user profile payload with populated relations
type OnboardingProfileResponse struct {
	ID           string             `json:"id"`
	Name         string             `json:"name"`
	Username     string             `json:"username"`
	Email        string             `json:"email"`
	Level        string             `json:"level"`
	XP           int                `json:"xp"`
	CurrentLevel int                `json:"current_level"`
	Streak       int                `json:"streak"`
	IsOnboarded  bool               `json:"is_onboarded"`
	PrimaryStack *string            `json:"primary_stack"`
	Country      *CountrySummary    `json:"country"`
	CareerPath   *CareerPathSummary `json:"career_path"`
	CreatedAt    time.Time          `json:"created_at"`
}

// CountryRepository specifies the database contract for country queries
type CountryRepository interface {
	GetAll(ctx context.Context) ([]Country, error)
	GetByID(ctx context.Context, id string) (*Country, error)
}

// CareerPathRepository specifies the database contract for career path queries
type CareerPathRepository interface {
	GetAll(ctx context.Context) ([]CareerPath, error)
	GetByID(ctx context.Context, id string) (*CareerPath, error)
}

// OnboardingUsecase specifies the business logic contract for onboarding operations
type OnboardingUsecase interface {
	GetCountries(ctx context.Context) ([]Country, error)
	GetCareerPaths(ctx context.Context) ([]CareerPath, error)
	CompleteOnboarding(ctx context.Context, userID string, req *OnboardingRequest) (*OnboardingProfileResponse, error)
}
