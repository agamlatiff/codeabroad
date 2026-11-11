package domain

import (
	"context"
	"time"
)

// Specific Language & Enrollment Domain Errors
var (
	ErrLanguageNotFound        = NewNotFoundError("LANGUAGE_NOT_FOUND", "language track not found")
	ErrLanguageNotActive       = NewBadRequestError("LANGUAGE_NOT_ACTIVE", "selected language is coming soon and not yet active", nil)
	ErrProficiencyLevelNotFound = NewNotFoundError("LEVEL_NOT_FOUND", "proficiency level not found")
	ErrAlreadyEnrolled         = NewConflictError("ALREADY_ENROLLED", "user is already enrolled in this language track")
	ErrEnrollmentNotFound      = NewNotFoundError("ENROLLMENT_NOT_FOUND", "active language enrollment not found")
)

// ----------------------------------------------------------------------------
// DOMAIN ENTITIES
// ----------------------------------------------------------------------------

// Language represents a world destination language track (languages table)
type Language struct {
	ID               string    `json:"id"`
	Code             string    `json:"code"`
	Name             string    `json:"name"`
	SupportedScripts []string  `json:"supported_scripts"`
	IsActive         bool      `json:"is_active"`
	CreatedAt        time.Time `json:"created_at"`
}

// ProficiencyLevel represents international standard certification tiers (proficiency_levels table)
type ProficiencyLevel struct {
	ID                  string    `json:"id"`
	LanguageID          string    `json:"language_id"`
	Code                string    `json:"code"`
	Name                string    `json:"name"`
	Tier                string    `json:"tier"` // beginner | intermediate | advanced
	OfficialExamName    string    `json:"official_exam_name"`
	PassingScorePercent int       `json:"passing_score_percent"`
	OrderIndex          int       `json:"order_index"`
	CreatedAt           time.Time `json:"created_at"`
}

// UserLanguageEnrollment tracks a learner's active destination languages (user_language_enrollments table)
type UserLanguageEnrollment struct {
	ID                    string            `json:"id"`
	UserID                string            `json:"user_id"`
	LanguageID            string            `json:"language_id"`
	CurrentLevelID        *string           `json:"current_level_id"`
	InitialPlacementType  string            `json:"initial_placement_type"` // zero_beginner | placement_test | manual_select
	PlacementScorePercent *int              `json:"placement_score_percent"`
	IsActive              bool              `json:"is_active"`
	EnrolledAt            time.Time         `json:"enrolled_at"`
	Language              *Language         `json:"language,omitempty"`
	CurrentLevel          *ProficiencyLevel `json:"current_level,omitempty"`
}

// ----------------------------------------------------------------------------
// CONTRACTS (INTERFACES)
// ----------------------------------------------------------------------------

// LanguageRepository specifies persistence operations for languages and enrollments
type LanguageRepository interface {
	GetAllLanguages(ctx context.Context, onlyActive bool) ([]Language, error)
	GetLanguageByID(ctx context.Context, id string) (*Language, error)
	GetLanguageByCode(ctx context.Context, code string) (*Language, error)
	GetLevelsByLanguageID(ctx context.Context, languageID string) ([]ProficiencyLevel, error)
	GetLevelByID(ctx context.Context, id string) (*ProficiencyLevel, error)
	GetEnrollmentsByUserID(ctx context.Context, userID string) ([]UserLanguageEnrollment, error)
	GetActiveEnrollment(ctx context.Context, userID string, languageID string) (*UserLanguageEnrollment, error)
	CreateEnrollment(ctx context.Context, enrollment *UserLanguageEnrollment) error
	UpdateEnrollmentLevel(ctx context.Context, enrollmentID string, levelID string) error
	SetActiveLanguage(ctx context.Context, userID string, languageID string) error
}

// LanguageUsecase specifies business operations for languages and enrollments
type LanguageUsecase interface {
	ListLanguages(ctx context.Context) ([]Language, error)
	GetLanguageDetails(ctx context.Context, languageID string) (*Language, []ProficiencyLevel, error)
	GetUserEnrollments(ctx context.Context, userID string) ([]UserLanguageEnrollment, error)
	SwitchActiveLanguage(ctx context.Context, userID string, languageID string) (*UserLanguageEnrollment, error)
}

