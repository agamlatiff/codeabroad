package helper

import (
	"codeabroad/backend/internal/domain"
	"math"
	"time"
)

// LeaderboardHelper encapsulates business rules for the Tokyo League divisions and ranking zones
type LeaderboardHelper struct{}

// NewLeaderboardHelper creates a new LeaderboardHelper instance
func NewLeaderboardHelper() *LeaderboardHelper {
	return &LeaderboardHelper{}
}

// DivisionConfig encapsulates metadata and XP boundaries for a Tokyo division
type DivisionConfig struct {
	Division domain.TokyoDivision
	MinXP    int
	MaxXP    int
	Name     string
	Tier     string
}

// GetDivisionConfig returns the XP boundaries and localization strings for a Tokyo division
func (h *LeaderboardHelper) GetDivisionConfig(division domain.TokyoDivision) DivisionConfig {
	switch division {
	case domain.DivisionShibuya:
		return DivisionConfig{
			Division: domain.DivisionShibuya,
			MinXP:    300,
			MaxXP:    800,
			Name:     "Liga Perak",
			Tier:     "Silver League (300 – 799 XP)",
		}
	case domain.DivisionAkihabara:
		return DivisionConfig{
			Division: domain.DivisionAkihabara,
			MinXP:    800,
			MaxXP:    1500,
			Name:     "Liga Emas",
			Tier:     "Gold League (800 – 1.499 XP)",
		}
	case domain.DivisionRoppongi:
		return DivisionConfig{
			Division: domain.DivisionRoppongi,
			MinXP:    1500,
			MaxXP:    math.MaxInt32,
			Name:     "Liga Berlian",
			Tier:     "Diamond Master (1.500+ XP)",
		}
	default:
		return DivisionConfig{
			Division: domain.DivisionShinjuku,
			MinXP:    0,
			MaxXP:    300,
			Name:     "Liga Perunggu",
			Tier:     "Bronze League (0 – 299 XP)",
		}
	}
}

// DetermineDivision calculates which division a user belongs to based on their lifetime XP
func (h *LeaderboardHelper) DetermineDivision(xp int) domain.TokyoDivision {
	if xp >= 1500 {
		return domain.DivisionRoppongi
	}
	if xp >= 800 {
		return domain.DivisionAkihabara
	}
	if xp >= 300 {
		return domain.DivisionShibuya
	}
	return domain.DivisionShinjuku
}

// CalculateZone determines if a rank position falls into promotion (top 3), safe (4-10), or demotion (11+)
func (h *LeaderboardHelper) CalculateZone(rank int) string {
	if rank <= 3 {
		return "promotion"
	}
	if rank > 10 {
		return "demotion"
	}
	return "safe"
}

// CalculateDaysUntilSundayReset computes remaining days until weekly league reset (Sunday 23:59:59 UTC)
func (h *LeaderboardHelper) CalculateDaysUntilSundayReset(now time.Time) int {
	daysUntilSunday := int(time.Sunday - now.Weekday())
	if daysUntilSunday <= 0 {
		daysUntilSunday += 7
	}
	return daysUntilSunday
}

