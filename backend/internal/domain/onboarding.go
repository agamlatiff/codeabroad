package domain

import (
	"context"
)

// Specific Onboarding Errors
var (
	ErrInvalidPaceTarget    = NewBadRequestError("INVALID_PACE_TARGET", "target harian harus 5, 15, 30, atau 45 menit", nil)
	ErrInvalidPlacementType = NewBadRequestError("INVALID_PLACEMENT_TYPE", "metode penempatan tidak valid (harus zero_beginner, placement_test, atau manual_select)", nil)
	ErrAlreadyOnboarded     = NewConflictError("ALREADY_ONBOARDED", "pengguna telah menyelesaikan onboarding")
)

// ----------------------------------------------------------------------------
// DTOs (REQUESTS & RESPONSES)
// ----------------------------------------------------------------------------

// PlacementAnswer defines a single question answer in diagnostic onboarding
type PlacementAnswer struct {
	ExerciseID string `json:"exercise_id" binding:"required,uuid"`
	UserAnswer string `json:"user_answer" binding:"required"`
}

// OnboardingRequest defines the 3-step payload for initializing a learner's destination
type OnboardingRequest struct {
	LanguageID           string            `json:"language_id" binding:"required,uuid"`
	DailyGoalMinutes     int               `json:"daily_goal_minutes" binding:"required,oneof=5 15 30 45"`
	InitialPlacementType string            `json:"initial_placement_type" binding:"required,oneof=zero_beginner placement_test manual_select"`
	ManualLevelID        *string           `json:"manual_level_id,omitempty"`
	PlacementAnswers     []PlacementAnswer `json:"placement_answers,omitempty"`
}

// PlacementTestQuestionResponse delivers diagnostic questions for Step 3 placement test
type PlacementTestQuestionResponse struct {
	Language  Language   `json:"language"`
	Questions []Exercise `json:"questions"`
}

// OnboardingResultResponse delivers the initialized learning profile and starting curriculum
type OnboardingResultResponse struct {
	User              UserAccount            `json:"user"`
	Profile           UserProfile            `json:"profile"`
	Enrollment        UserLanguageEnrollment `json:"enrollment"`
	AssignedLevel     ProficiencyLevel       `json:"assigned_level"`
	PlacementScore    *int                   `json:"placement_score_percent,omitempty"`
	GamificationStats UserGamificationStats  `json:"gamification_stats"`
	AwardedBadges     []BadgeDefinition      `json:"awarded_badges,omitempty"`
}

// ----------------------------------------------------------------------------
// CONTRACTS (INTERFACES)
// ----------------------------------------------------------------------------

// OnboardingUsecase specifies business operations for initializing learner tracks
type OnboardingUsecase interface {
	GetAvailableLanguages(ctx context.Context) ([]Language, error)
	GetPlacementQuestions(ctx context.Context, languageID string) (*PlacementTestQuestionResponse, error)
	CompleteOnboarding(ctx context.Context, userID string, req *OnboardingRequest) (*OnboardingResultResponse, error)
}
