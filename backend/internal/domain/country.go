package domain

import (
	"context"
	"time"
)

// Country represents a destination country entity
type Country struct {
	ID        string    `json:"id"`
	Code      string    `json:"code"`
	Name      string    `json:"name"`
	FlagEmoji string    `json:"flag_emoji,omitempty"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// CountryRepository specifies the database contract for country queries
type CountryRepository interface {
	GetAll(ctx context.Context) ([]Country, error)
	GetByID(ctx context.Context, id string) (*Country, error)
	GetByCode(ctx context.Context, code string) (*Country, error)
}
