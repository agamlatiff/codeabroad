package gamification

import (
	"fmt"

	"codeabroad/backend/internal/shared/apperror"
)

// Helper encapsulates calculation rules for progression, chests, and arcade shop
type Helper struct{}

// NewHelper creates a new gamification Helper instance
func NewHelper() *Helper {
	return &Helper{}
}

// CalculateLevel computes user level from total XP (100 XP per level, min 1)
func (h *Helper) CalculateLevel(xp int) int {
	if xp < 0 {
		return 1
	}
	return (xp / 100) + 1
}

// CalculateProgression computes new XP and updated Level
func (h *Helper) CalculateProgression(currentXP int, gainedXP int) (newXP int, newLevel int) {
	newXP = currentXP + gainedXP
	if newXP < 0 {
		newXP = 0
	}
	newLevel = h.CalculateLevel(newXP)
	return newXP, newLevel
}

// ResolveChestReward returns the gem and XP payout for daily milestone chests
func (h *Helper) ResolveChestReward(tier int) (gems int, xp int, err error) {
	switch tier {
	case 1:
		return 5, 20, nil
	case 2:
		return 15, 50, nil
	case 3:
		return 30, 100, nil
	default:
		return 0, 0, fmt.Errorf("%w: invalid chest tier %d (must be 1, 2, or 3)", apperror.ErrBadRequest, tier)
	}
}

