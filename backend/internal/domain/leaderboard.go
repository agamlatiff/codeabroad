package domain

import (
	"context"
)

// TokyoDivision defines the gamified competitive division tier
type TokyoDivision string

const (
	DivisionShinjuku  TokyoDivision = "shinjuku"  // Bronze tier (0 - 300 XP)
	DivisionShibuya   TokyoDivision = "shibuya"   // Silver tier (301 - 800 XP)
	DivisionAkihabara TokyoDivision = "akihabara" // Gold tier (801 - 1500 XP)
	DivisionRoppongi  TokyoDivision = "roppongi"  // Diamond Master tier (1500+ XP)
)

// LeaderboardEntry represents a ranked competitor in the weekly league
type LeaderboardEntry struct {
	Rank          int           `json:"rank"`
	UserID        string        `json:"user_id"`
	Username      string        `json:"username"`
	Name          string        `json:"name"`
	AvatarURL     *string       `json:"avatar_url"`
	WeeklyXP      int           `json:"weekly_xp"`
	Streak        int           `json:"streak"`
	CurrentLevel  int           `json:"current_level"`
	Division      TokyoDivision `json:"division"`
	IsCurrentUser bool          `json:"is_current_user"`
	Zone          string        `json:"zone"` // "promotion", "safe", "demotion"
}

// WeeklyLeaderboardResponse encapsulates the full league division standings
type WeeklyLeaderboardResponse struct {
	Division         TokyoDivision      `json:"division"`
	DivisionName     string             `json:"division_name"`
	DivisionTier     string             `json:"division_tier"`
	SeasonWeek       int                `json:"season_week"`
	DaysRemaining    int                `json:"days_remaining"`
	UserRank         *LeaderboardEntry  `json:"user_rank,omitempty"`
	Entries          []LeaderboardEntry `json:"entries"`
	TotalCompetitors int                `json:"total_competitors"`
}

// LeaderboardRepository defines data operations for ranking
type LeaderboardRepository interface {
	GetWeeklyLeaderboard(ctx context.Context, userID string, division TokyoDivision) (*WeeklyLeaderboardResponse, error)
}

// LeaderboardUsecase defines business rules for Tokyo League rankings
type LeaderboardUsecase interface {
	GetWeeklyLeaderboard(ctx context.Context, userID string, requestedDivision TokyoDivision) (*WeeklyLeaderboardResponse, error)
}
