package helper

import (
	"codeabroad/backend/internal/domain"
	"fmt"
)

// GamificationHelper encapsulates pure calculation rules for leveling, streak milestones, and chest rewards
type GamificationHelper struct{}

// NewGamificationHelper creates a new GamificationHelper instance
func NewGamificationHelper() *GamificationHelper {
	return &GamificationHelper{}
}

// CalculateLevel computes user level from total XP (100 XP per level, min level 1)
func (h *GamificationHelper) CalculateLevel(xp int) int {
	if xp < 0 {
		return 1
	}
	return (xp / 100) + 1
}

// CalculateProgression computes new XP and updated Level when XP is earned
func (h *GamificationHelper) CalculateProgression(currentXP int, gainedXP int) (newXP int, newLevel int) {
	newXP = currentXP + gainedXP
	if newXP < 0 {
		newXP = 0
	}
	newLevel = h.CalculateLevel(newXP)
	return newXP, newLevel
}

// ResolveChestReward returns the gem and XP payload for daily milestone chests
func (h *GamificationHelper) ResolveChestReward(tier int) (gems int, xp int, err error) {
	switch tier {
	case 1:
		return 5, 20, nil // Tier 1 (Bronze): 5 Gems, 20 XP
	case 2:
		return 15, 50, nil // Tier 2 (Silver): 15 Gems, 50 XP
	case 3:
		return 30, 100, nil // Tier 3 (Golden): 30 Gems, 100 XP
	default:
		return 0, 0, fmt.Errorf("%w: invalid chest tier %d (must be 1, 2, or 3)", domain.ErrBadRequest, tier)
	}
}

// ResolveDailyRewardXP returns the XP reward based on user consistency claim type
func (h *GamificationHelper) ResolveDailyRewardXP(rewardType string) (int, error) {
	switch rewardType {
	case "lesson_milestone":
		return 30, nil
	case "golden_chest":
		return 50, nil
	default:
		return 0, fmt.Errorf("%w: unsupported daily reward type %s", domain.ErrBadRequest, rewardType)
	}
}

