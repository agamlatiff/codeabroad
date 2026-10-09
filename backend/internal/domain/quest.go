package domain

import (
	"context"
	"time"
)

// Business Error Codes for Quests
const (
	ErrCodeQuestNotFound        = "QUEST_NOT_FOUND"
	ErrCodeQuestLocked          = "QUEST_LOCKED"
	ErrCodeTestExecutionFailed  = "TEST_EXECUTION_FAILED"
	ErrCodeInvalidSubmission    = "INVALID_SUBMISSION"
	ErrCodeQuestAlreadyComplete = "QUEST_ALREADY_COMPLETED"
)

// Specific Quest Domain Errors
var (
	ErrQuestNotFound        = NewNotFoundError(ErrCodeQuestNotFound, "quest not found")
	ErrQuestLocked          = NewForbiddenError(ErrCodeQuestLocked, "quest is locked, complete prerequisites first", nil)
	ErrTestExecutionFailed  = NewBadRequestError(ErrCodeTestExecutionFailed, "unit tests did not pass", nil)
	ErrInvalidSubmission    = NewBadRequestError(ErrCodeInvalidSubmission, "submission payload is invalid", nil)
	ErrQuestAlreadyComplete = NewConflictError(ErrCodeQuestAlreadyComplete, "quest has already been completed")
)

// NihongoNote represents Japanese technical vocabulary contextual notes
type NihongoNote struct {
	Term    string `json:"term"`
	Reading string `json:"reading"`
	Meaning string `json:"meaning"`
	Example string `json:"example,omitempty"`
}

// AcceptanceCriterion represents individual grading criteria for an interactive quest
type AcceptanceCriterion struct {
	ID          string `json:"id"`
	Description string `json:"description"`
	Passed      bool   `json:"passed"`
}

// StarterCode holds the initial editor file and code skeleton
type StarterCode struct {
	Filename string `json:"filename"`
	Language string `json:"language"`
	Content  string `json:"content"`
}

// TestCase represents an individual assertion unit test
type TestCase struct {
	Name     string `json:"name"`
	Expected string `json:"expected"`
}

// TestSuite represents the automated unit test runner configuration
type TestSuite struct {
	Runner    string     `json:"runner"`
	TestCases []TestCase `json:"test_cases,omitempty"`
}

// QuestSummary represents a compact preview of a quest for lists and accordion items
type QuestSummary struct {
	ID               string  `json:"id"`
	ChapterID        *string `json:"chapter_id,omitempty"`
	StationNumber    int     `json:"station_number,omitempty"`
	ChapterNumber    int     `json:"chapter_number,omitempty"`
	Title            string  `json:"title"`
	ChipLabel        string  `json:"chip_label"`
	Type             string  `json:"type"` // main, side, daily
	Difficulty       string  `json:"difficulty"`
	XPReward         int     `json:"xp_reward"`
	EstimatedMinutes int     `json:"estimated_minutes"`
	OrderIndex       int     `json:"order_index"`
	Status           string  `json:"status"` // locked, available, completed
}

// Quest represents the complete entity for interactive coding challenges
type Quest struct {
	ID                 string                `json:"id"`
	Title              string                `json:"title"`
	Description        *string               `json:"description,omitempty"`
	Type               string                `json:"type"` // main, side, daily
	CareerPathID       *string               `json:"career_path_id,omitempty"`
	CountryID          *string               `json:"country_id,omitempty"`
	Difficulty         string                `json:"difficulty"`
	XPReward           int                   `json:"xp_reward"`
	EstimatedMinutes   int                   `json:"estimated_minutes"`
	ResourceURL        *string               `json:"resource_url,omitempty"`
	OrderIndex         int                   `json:"order_index"`
	Prerequisites      []string              `json:"prerequisites,omitempty"`
	IsActive           bool                  `json:"is_active"`
	ChapterID          *string               `json:"chapter_id,omitempty"`
	ChipLabel          string                `json:"chip_label"`
	StoryContext       *string               `json:"story_context,omitempty"`
	NihongoNotes       *NihongoNote          `json:"nihongo_notes,omitempty"`
	AcceptanceCriteria []AcceptanceCriterion `json:"acceptance_criteria,omitempty"`
	StarterCode        *StarterCode          `json:"starter_code,omitempty"`
	TestSuite          *TestSuite            `json:"test_suite,omitempty"`
	UserStatus         string                `json:"user_status"` // locked, available, completed
	UserTestsPassed    int                   `json:"user_tests_passed"`
	UserTotalTests     int                   `json:"user_total_tests"`
	UserCodeSubmission *string               `json:"user_code_submission,omitempty"`
	CreatedAt          time.Time             `json:"created_at"`
	UpdatedAt          time.Time             `json:"updated_at"`
}

// UserQuest tracks a user's progress and submissions on a quest
type UserQuest struct {
	ID             string     `json:"id"`
	UserID         string     `json:"user_id"`
	QuestID        string     `json:"quest_id"`
	Status         string     `json:"status"` // locked, available, completed
	CodeSubmission *string    `json:"code_submission,omitempty"`
	TestsPassed    int        `json:"tests_passed"`
	TotalTests     int        `json:"total_tests"`
	CompletedAt    *time.Time `json:"completed_at,omitempty"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

// QuestFilter contains search and category filter parameters
type QuestFilter struct {
	CareerPathID *string
	ChapterID    *string
	Type         *string
	Status       *string
}

// RunTestsRequest DTO for interactive code execution
type RunTestsRequest struct {
	Code     string `json:"code" binding:"required"`
	Filename string `json:"filename"`
}

// RunTestsResponse DTO returning grading output
type RunTestsResponse struct {
	Success         bool                  `json:"success"`
	TestsPassed     int                   `json:"tests_passed"`
	TotalTests      int                   `json:"total_tests"`
	Output          string                `json:"output"`
	DurationMs      int                   `json:"duration_ms"`
	CriteriaResults []AcceptanceCriterion `json:"criteria_results"`
}

// SubmitQuestRequest DTO for final quest submission
type SubmitQuestRequest struct {
	Code string `json:"code" binding:"required"`
}

// SubmitQuestResponse DTO returning gamified rewards and progression
type SubmitQuestResponse struct {
	QuestID               string        `json:"quest_id"`
	XPAwarded             int           `json:"xp_awarded"`
	GemsAwarded           int           `json:"gems_awarded"`
	CurrentXP             int           `json:"current_xp"`
	CurrentLevel          int           `json:"current_level"`
	Streak                int           `json:"streak"`
	StreakExtended        bool          `json:"streak_extended"`
	ReadinessIncrease     float64       `json:"readiness_increase"`
	CurrentReadinessScore float64       `json:"current_readiness_score"`
	UnlockedVocab         *NihongoNote  `json:"unlocked_vocab,omitempty"`
	NextQuest             *QuestSummary `json:"next_quest,omitempty"`
}

// QuestRepository defines data persistence operations for quests
type QuestRepository interface {
	GetByID(ctx context.Context, id string, userID string) (*Quest, error)
	GetByChapterID(ctx context.Context, chapterID string, userID string) ([]Quest, error)
	GetDailyQuests(ctx context.Context, userID string) ([]Quest, error)
	ListQuests(ctx context.Context, filter QuestFilter, userID string) ([]Quest, error)
	GetNextSequentialQuest(ctx context.Context, currentQuestID string, userID string) (*QuestSummary, error)
}

// UserQuestRepository defines data persistence operations for user quest progress
type UserQuestRepository interface {
	GetByUserAndQuest(ctx context.Context, userID, questID string) (*UserQuest, error)
	UpsertUserQuest(ctx context.Context, uq *UserQuest) error
	MarkCompleted(ctx context.Context, userID, questID, code string, passed, total int) error
	CountCompletedByCareerPath(ctx context.Context, userID, careerPathID string) (int, error)
	CountTotalByCareerPath(ctx context.Context, careerPathID string) (int, error)
}

// QuestUsecase defines business logic operations for quests and workspaces
type QuestUsecase interface {
	GetQuestDetails(ctx context.Context, questID string, userID string) (*Quest, error)
	GetDailyQuests(ctx context.Context, userID string) ([]Quest, error)
	ListQuests(ctx context.Context, filter QuestFilter, userID string) ([]Quest, error)
	RunUnitTests(ctx context.Context, questID string, req *RunTestsRequest) (*RunTestsResponse, error)
	SubmitQuest(ctx context.Context, questID string, userID string, req *SubmitQuestRequest) (*SubmitQuestResponse, error)
}

