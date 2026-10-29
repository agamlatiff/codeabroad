package domain

import (
	"context"
	"time"
)

// Business Error Codes for Roadmap & Curriculum
const (
	ErrCodeRoadmapNotFound = "ROADMAP_NOT_FOUND"
	ErrCodeModuleNotFound  = "MODULE_NOT_FOUND"
	ErrCodeChapterNotFound = "CHAPTER_NOT_FOUND"
)

// Unified Domain Error instances
var (
	ErrRoadmapNotFound = NewNotFoundError(ErrCodeRoadmapNotFound, "roadmap not found")
	ErrModuleNotFound  = NewNotFoundError(ErrCodeModuleNotFound, "module not found")
	ErrChapterNotFound = NewNotFoundError(ErrCodeChapterNotFound, "chapter not found")
)

// Module represents a curriculum module database entity (7 columns matching PostgreSQL modules table)
type Module struct {
	ID           string    `json:"id"`
	TechStackID  string    `json:"tech_stack_id"`
	ModuleNumber int       `json:"module_number"`
	Title        string    `json:"title"`
	Description  *string   `json:"description,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Chapter represents a chapter database entity (7 columns matching PostgreSQL chapters table)
type Chapter struct {
	ID            string    `json:"id"`
	ModuleID      string    `json:"module_id"`
	ChapterNumber int       `json:"chapter_number"`
	Title         string    `json:"title"`
	Description   *string   `json:"description,omitempty"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// ChapterResponse represents the API response DTO for a chapter, including runtime unlocked/completion status and child quests
type ChapterResponse struct {
	ID            string                 `json:"id"`
	ModuleID      string                 `json:"module_id"`
	ChapterNumber int                    `json:"chapter_number"`
	Title         string                 `json:"title"`
	Description   *string                `json:"description,omitempty"`
	IsUnlocked    bool                   `json:"is_unlocked"`
	IsCompleted   bool                   `json:"is_completed"`
	Quests        []QuestSummaryResponse `json:"quests,omitempty"`
	CreatedAt     time.Time              `json:"created_at"`
	UpdatedAt     time.Time              `json:"updated_at"`
}

// ModuleResponse represents the API response DTO for a curriculum module, including progress rate and child chapters
type ModuleResponse struct {
	ID           string            `json:"id"`
	TechStackID  string            `json:"tech_stack_id"`
	ModuleNumber int               `json:"module_number"`
	Title        string            `json:"title"`
	Description  *string           `json:"description,omitempty"`
	IsUnlocked   bool              `json:"is_unlocked"`
	IsCompleted  bool              `json:"is_completed"`
	ProgressRate float64           `json:"progress_rate"` // 0.0 to 100.0%
	Chapters     []ChapterResponse `json:"chapters,omitempty"`
	CreatedAt    time.Time         `json:"created_at"`
	UpdatedAt    time.Time         `json:"updated_at"`
}

// RoadmapResponse represents the API response DTO for the composite curriculum syllabus
type RoadmapResponse struct {
	ID           string           `json:"id"`
	CareerPathID *string          `json:"career_path_id,omitempty"`
	Slug         string           `json:"slug"`
	Title        string           `json:"title"`
	Badge        *string          `json:"badge,omitempty"`
	IsActive     bool             `json:"is_active"`
	Modules      []ModuleResponse `json:"modules,omitempty"`
	CreatedAt    time.Time        `json:"created_at"`
	UpdatedAt    time.Time        `json:"updated_at"`
}

// Roadmap is an alias for RoadmapResponse for backward compatibility across usecases and repositories
type Roadmap = RoadmapResponse

// RoadmapRepository defines data persistence operations for roadmaps and syllabus tree
type RoadmapRepository interface {
	GetByTechStackID(ctx context.Context, techStackID string) (*RoadmapResponse, error)
	GetByCareerPathSlug(ctx context.Context, slug string) (*RoadmapResponse, error)
	GetFullSyllabus(ctx context.Context, roadmapID string, userID string) (*RoadmapResponse, error)
}

// RoadmapUsecase defines business logic for fetching syllabus and learner progression
type RoadmapUsecase interface {
	GetTrackRoadmap(ctx context.Context, slug string, userID string) (*RoadmapResponse, error)
	GetActiveUserRoadmap(ctx context.Context, userID string) (*RoadmapResponse, error)
}
