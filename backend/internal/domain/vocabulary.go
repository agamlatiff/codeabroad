package domain

import (
	"context"
	"time"
)

// Vocabulary represents an authentic Japanese IT vocabulary item for Tokyo workplaces
type Vocabulary struct {
	ID              string    `json:"id"`
	CareerPathID    *string   `json:"career_path_id,omitempty"`
	Term            string    `json:"term"`
	Reading         string    `json:"reading"`
	Meaning         string    `json:"meaning"`
	Category        string    `json:"category"`
	ExampleJA       string    `json:"example_ja"`
	ExampleID       string    `json:"example_id"`
	DifficultyLevel string    `json:"difficulty_level"`
	OrderIndex      int       `json:"order_index"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// VocabularyRepository defines the persistence contract for vocabulary data
type VocabularyRepository interface {
	GetDailyVocabularies(ctx context.Context, limit int) ([]Vocabulary, error)
	ListVocabularies(ctx context.Context, category string, limit, offset int) ([]Vocabulary, int, error)
}

// VocabularyUsecase defines the business logic contract for vocabulary data
type VocabularyUsecase interface {
	GetDailyVocabularies(ctx context.Context) ([]Vocabulary, error)
	ListVocabularies(ctx context.Context, category string, page, limit int) ([]Vocabulary, int, error)
}
