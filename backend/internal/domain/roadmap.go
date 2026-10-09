package domain

import (
	"context"
	"time"
)

// Business Error Codes for Roadmap & Syllabus
const (
	ErrCodeRoadmapNotFound = "ROADMAP_NOT_FOUND"
	ErrCodeStationNotFound = "STATION_NOT_FOUND"
	ErrCodeChapterNotFound = "CHAPTER_NOT_FOUND"
)

// Unified Domain Error instances
var (
	ErrRoadmapNotFound = NewNotFoundError(ErrCodeRoadmapNotFound, "roadmap not found")
	ErrStationNotFound = NewNotFoundError(ErrCodeStationNotFound, "station not found")
	ErrChapterNotFound = NewNotFoundError(ErrCodeChapterNotFound, "chapter not found")
)

// Roadmap represents a structured curriculum path for a specific career track
type Roadmap struct {
	ID           string    `json:"id"`
	CareerPathID string    `json:"career_path_id"`
	Title        string    `json:"title"`
	Description  *string   `json:"description,omitempty"`
	IsActive     bool      `json:"is_active"`
	Stations     []Station `json:"stations,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Station represents a milestone station node on the syllabus tree (e.g., ST 01 // GO)
type Station struct {
	ID             string    `json:"id"`
	RoadmapID      string    `json:"roadmap_id"`
	StationNumber  int       `json:"station_number"`
	Title          string    `json:"title"`
	ChipLabel      string    `json:"chip_label"`
	Description    *string   `json:"description,omitempty"`
	OrderIndex     int       `json:"order_index"`
	IsUnlocked     bool      `json:"is_unlocked"`
	IsCompleted    bool      `json:"is_completed"`
	ProgressRate   float64   `json:"progress_rate"` // 0.0 to 100.0
	Chapters       []Chapter `json:"chapters,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// Chapter represents an accordion module within a station
type Chapter struct {
	ID            string         `json:"id"`
	StationID     string         `json:"station_id"`
	ChapterNumber int            `json:"chapter_number"`
	Title         string         `json:"title"`
	Description   *string        `json:"description,omitempty"`
	OrderIndex    int            `json:"order_index"`
	IsUnlocked    bool           `json:"is_unlocked"`
	IsCompleted   bool           `json:"is_completed"`
	Quests        []QuestSummary `json:"quests,omitempty"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
}

// RoadmapRepository defines data persistence operations for roadmaps and syllabus tree
type RoadmapRepository interface {
	GetByCareerPathID(ctx context.Context, careerPathID string) (*Roadmap, error)
	GetByCareerPathSlug(ctx context.Context, slug string) (*Roadmap, error)
	GetFullSyllabus(ctx context.Context, roadmapID string, userID string) (*Roadmap, error)
}

// RoadmapUsecase defines business logic for fetching syllabus and learner progression
type RoadmapUsecase interface {
	GetTrackRoadmap(ctx context.Context, slug string, userID string) (*Roadmap, error)
	GetActiveUserRoadmap(ctx context.Context, userID string) (*Roadmap, error)
}

