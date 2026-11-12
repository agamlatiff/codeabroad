package onboarding

import (
	"codeabroad/backend/internal/domain"
	"strings"
)

// Helper encapsulates business logic for grading placement questions and resolving initial levels
type Helper struct{}

// NewHelper creates a new onboarding Helper instance
func NewHelper() *Helper {
	return &Helper{}
}

// ValidatePaceTarget ensures the selected daily goal is one of the supported tiers (5, 15, 30, 45 minutes)
func (h *Helper) ValidatePaceTarget(minutes int) error {
	switch minutes {
	case 5, 15, 30, 45:
		return nil
	default:
		return domain.ErrInvalidPaceTarget
	}
}

// GradePlacementAnswers compares student answers with diagnostic exercises and computes a score percentage
func (h *Helper) GradePlacementAnswers(questions []domain.Exercise, answers []domain.PlacementAnswer) (scorePercent int) {
	if len(questions) == 0 || len(answers) == 0 {
		return 0
	}

	questionsMap := make(map[string]domain.Exercise)
	for _, q := range questions {
		questionsMap[q.ID] = q
	}

	correctCount := 0
	for _, ans := range answers {
		q, exists := questionsMap[ans.ExerciseID]
		if !exists {
			continue
		}
		if strings.EqualFold(strings.TrimSpace(q.CorrectAnswer), strings.TrimSpace(ans.UserAnswer)) {
			correctCount++
		}
	}

	return (correctCount * 100) / len(questions)
}

// ResolveTargetLevel determines the initial proficiency level based on placement method and score
func (h *Helper) ResolveTargetLevel(
	levels []domain.ProficiencyLevel,
	placementType string,
	manualLevelID *string,
	scorePercent int,
) *domain.ProficiencyLevel {
	if len(levels) == 0 {
		return nil
	}

	switch placementType {
	case "manual_select":
		if manualLevelID != nil {
			for _, lvl := range levels {
				if lvl.ID == *manualLevelID {
					return &lvl
				}
			}
		}
		return &levels[0]

	case "placement_test":
		// Mastery rule: Score >= 80% on diagnostic exam unlocks next tier (Level 2)
		if scorePercent >= 80 && len(levels) > 1 {
			return &levels[1]
		}
		return &levels[0]

	default: // "zero_beginner"
		return &levels[0]
	}
}

