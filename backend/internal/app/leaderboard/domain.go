package leaderboard

import (
	"context"

	"merantalk/backend/internal/shared/apperror"
)

// Specific Leaderboard Domain Errors
var (
	ErrNoPendingWeeklyReward      = apperror.NewNotFoundError("NO_PENDING_WEEKLY_REWARD", "tidak ada hadiah podium minggu lalu untuk diklaim")
	ErrWeeklyRewardAlreadyClaimed = apperror.NewConflictError("WEEKLY_REWARD_ALREADY_CLAIMED", "hadiah podium minggu lalu sudah diklaim")
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

// PendingWeeklyReward describes the previous ISO week's Top-3 league prize status for the user.
type PendingWeeklyReward struct {
	SeasonYear   int            `json:"season_year"`
	SeasonWeek   int            `json:"season_week"`
	Division     LeagueDivision `json:"division"`
	DivisionName string         `json:"division_name"`
	Rank         int            `json:"rank"`
	WeeklyXP     int            `json:"weekly_xp"`
	GemsAwarded  int            `json:"gems_awarded"`
	Claimed      bool           `json:"claimed"`
}

// ClaimWeeklyRewardResponse summarizes a claimed weekly Top-3 podium prize and updated gem balance.
type ClaimWeeklyRewardResponse struct {
	Reward  PendingWeeklyReward `json:"reward"`
	NewGems int                 `json:"new_gems"`
}

// WeeklyLeaderboardResponse encapsulates the full league division standings
type WeeklyLeaderboardResponse struct {
	Division         LeagueDivision       `json:"division"`
	DivisionName     string               `json:"division_name"`
	DivisionTier     string               `json:"division_tier"`
	UserDivision     LeagueDivision       `json:"user_division,omitempty"`
	SeasonWeek       int                  `json:"season_week"`
	DaysRemaining    int                  `json:"days_remaining"`
	UserRank         *LeaderboardEntry    `json:"user_rank,omitempty"`
	LastWeekReward   *PendingWeeklyReward `json:"last_week_reward,omitempty"`
	Entries          []LeaderboardEntry   `json:"entries"`
	TotalCompetitors int                  `json:"total_competitors"`
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

// WeeklyRewardRepository persists and verifies weekly Top-3 podium gem claims.
type WeeklyRewardRepository interface {
	GetPreviousWeekRewardStatus(ctx context.Context, userID string, seasonYear int, seasonWeek int) (*PendingWeeklyReward, error)
	ClaimPreviousWeekRewardTx(ctx context.Context, userID string, seasonYear int, seasonWeek int) (*ClaimWeeklyRewardResponse, error)
}

// Usecase defines business rules for weekly League rankings
type Usecase interface {
	GetWeeklyLeaderboard(ctx context.Context, userID string, requestedDivision LeagueDivision) (*WeeklyLeaderboardResponse, error)
	ClaimWeeklyReward(ctx context.Context, userID string) (*ClaimWeeklyRewardResponse, error)
}

