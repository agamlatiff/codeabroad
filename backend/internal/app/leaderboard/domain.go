package leaderboard

import (
	"context"
)

// LeagueDivision defines the gamified competitive division tier across all language tracks.
type LeagueDivision string

// TokyoDivision is a transitional type alias kept for backward compatibility during multi-language migration.
type TokyoDivision = LeagueDivision

const (
	DivisionBronze  LeagueDivision = "bronze"  // Bronze tier (0 - 299 XP)
	DivisionSilver  LeagueDivision = "silver"  // Silver tier (300 - 799 XP)
	DivisionGold    LeagueDivision = "gold"    // Gold tier (800 - 1.499 XP)
	DivisionDiamond LeagueDivision = "diamond" // Diamond Master tier (1.500+ XP)

	// Legacy Japanese station division constants preserved as canonical aliases.
	DivisionShinjuku  = DivisionBronze
	DivisionShibuya   = DivisionSilver
	DivisionAkihabara = DivisionGold
	DivisionRoppongi  = DivisionDiamond
)

// LeaderboardEntry represents a ranked competitor in the weekly league
type LeaderboardEntry struct {
	Rank          int            `json:"rank"`
	UserID        string         `json:"user_id,omitempty"`
	Username      string         `json:"username"`
	Name          string         `json:"name"`
	AvatarURL     *string        `json:"avatar_url"`
	WeeklyXP      int            `json:"weekly_xp"`
	TotalXP       int            `json:"-"`
	Streak        int            `json:"streak"`
	CurrentLevel  int            `json:"current_level"`
	Division      LeagueDivision `json:"division"`
	IsCurrentUser bool           `json:"is_current_user"`
	Zone          string         `json:"zone"` // "promotion", "safe", "demotion"
}

// WeeklyLeaderboardResponse encapsulates the full league division standings
type WeeklyLeaderboardResponse struct {
	Division         LeagueDivision     `json:"division"`
	DivisionName     string             `json:"division_name"`
	DivisionTier     string             `json:"division_tier"`
	UserDivision     LeagueDivision     `json:"user_division,omitempty"`
	SeasonWeek       int                `json:"season_week"`
	DaysRemaining    int                `json:"days_remaining"`
	UserRank         *LeaderboardEntry  `json:"user_rank,omitempty"`
	Entries          []LeaderboardEntry `json:"entries"`
	TotalCompetitors int                `json:"total_competitors"`
}

// Repository defines data operations for ranking
type Repository interface {
	GetDivisionStandings(ctx context.Context, minXP int, maxXP int, limit int) ([]LeaderboardEntry, error)
	GetUserStanding(ctx context.Context, userID string) (*LeaderboardEntry, error)
}

// DivisionMetaReader provides exact division standings alongside total competitor count.
type DivisionMetaReader interface {
	GetDivisionStandingsWithTotal(ctx context.Context, minXP int, maxXP int, limit int) ([]LeaderboardEntry, int, error)
}

// Usecase defines business rules for weekly League rankings
type Usecase interface {
	GetWeeklyLeaderboard(ctx context.Context, userID string, requestedDivision LeagueDivision) (*WeeklyLeaderboardResponse, error)
}

