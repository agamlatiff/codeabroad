package leaderboard

import (
	"math"
	"time"
)

// Helper encapsulates business rules for Tokyo League division thresholds, reset timer, and zones
type Helper struct{}

// NewHelper creates a new leaderboard Helper instance
func NewHelper() *Helper {
	return &Helper{}
}

// DivisionConfig encapsulates division metadata and indexed XP ranges
type DivisionConfig struct {
	Division TokyoDivision
	MinXP    int
	MaxXP    int
	Name     string
	Tier     string
}

// GetDivisionConfig maps a Tokyo division to its indexed XP query range and localized tier label
func (h *Helper) GetDivisionConfig(division TokyoDivision) DivisionConfig {
	switch division {
	case DivisionShibuya:
		return DivisionConfig{
			Division: DivisionShibuya,
			MinXP:    300,
			MaxXP:    800,
			Name:     "Liga Perak",
			Tier:     "Silver League (300 – 799 XP)",
		}
	case DivisionAkihabara:
		return DivisionConfig{
			Division: DivisionAkihabara,
			MinXP:    800,
			MaxXP:    1500,
			Name:     "Liga Emas",
			Tier:     "Gold League (800 – 1.499 XP)",
		}
	case DivisionRoppongi:
		return DivisionConfig{
			Division: DivisionRoppongi,
			MinXP:    1500,
			MaxXP:    math.MaxInt32,
			Name:     "Liga Berlian",
			Tier:     "Diamond Master (1.500+ XP)",
		}
	default:
		return DivisionConfig{
			Division: DivisionShinjuku,
			MinXP:    0,
			MaxXP:    300,
			Name:     "Liga Perunggu",
			Tier:     "Bronze League (0 – 299 XP)",
		}
	}
}

// DetermineDivision evaluates which division a user belongs to based on their lifetime XP
func (h *Helper) DetermineDivision(xp int) TokyoDivision {
	if xp >= 1500 {
		return DivisionRoppongi
	}
	if xp >= 800 {
		return DivisionAkihabara
	}
	if xp >= 300 {
		return DivisionShibuya
	}
	return DivisionShinjuku
}

// CalculateZone determines promotion, safe, or demotion zone for a ranked participant
func (h *Helper) CalculateZone(rank int) string {
	if rank <= 3 {
		return "promotion"
	}
	if rank > 10 {
		return "demotion"
	}
	return "safe"
}

// CalculateDaysUntilSundayReset returns days remaining until the weekly league reset (Sunday midnight UTC)
func (h *Helper) CalculateDaysUntilSundayReset(now time.Time) int {
	daysUntilSunday := int(time.Sunday - now.Weekday())
	if daysUntilSunday <= 0 {
		daysUntilSunday += 7
	}
	return daysUntilSunday
}

