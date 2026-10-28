package domain

import (
	"context"
	"time"
)

// TechStack represents a specific programming language/technology stack within a career path
type TechStack struct {
	ID           string    `json:"id,omitempty"`
	CareerPathID *string   `json:"career_path_id,omitempty"`
	Slug         string    `json:"slug"`
	Label        string    `json:"label"`
	Badge        *string   `json:"badge,omitempty"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    time.Time `json:"created_at,omitempty"`
	UpdatedAt    time.Time `json:"updated_at,omitempty"`
}

// CareerPath represents an engineering track entity
type CareerPath struct {
	ID          string      `json:"id"`
	Slug        string      `json:"slug"`
	Label       string      `json:"label"`
	Description *string     `json:"description,omitempty"`
	Stacks      []TechStack `json:"stacks"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}

// CareerPathRepository specifies the database contract for career path queries
type CareerPathRepository interface {
	GetAll(ctx context.Context) ([]CareerPath, error)
	GetByID(ctx context.Context, id string) (*CareerPath, error)
	GetBySlug(ctx context.Context, slug string) (*CareerPath, error)
}

// TechStackRepository specifies the database contract for tech stack queries
type TechStackRepository interface {
	GetAll(ctx context.Context) ([]TechStack, error)
	GetByID(ctx context.Context, id string) (*TechStack, error)
	GetBySlug(ctx context.Context, slug string) (*TechStack, error)
	GetByCareerPathID(ctx context.Context, careerPathID string) ([]TechStack, error)
}
