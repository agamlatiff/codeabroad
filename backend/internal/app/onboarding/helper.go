package onboarding

import (
	"sort"

	"codeabroad/backend/internal/app/exercise"
	"codeabroad/backend/internal/app/language"
)

// Helper encapsulates business logic for grading placement questions and resolving initial levels
type Helper struct {
	exerciseHelper *exercise.Helper
}

// NewHelper creates a new onboarding Helper instance
func NewHelper() *Helper {
	return &Helper{
		exerciseHelper: exercise.NewHelper(),
	}
}

// ValidatePaceTarget ensures the selected daily goal is one of the supported tiers (5, 15, 30, 45 minutes)
func (h *Helper) ValidatePaceTarget(minutes int) error {
	switch minutes {
	case 5, 15, 30, 45:
		return nil
	default:
		return ErrInvalidPaceTarget
	}
}

// GradePlacementAnswers compares student answers with diagnostic exercises and computes a score percentage
func (h *Helper) GradePlacementAnswers(questions []exercise.Exercise, answers []PlacementAnswer) (scorePercent int) {
	if len(questions) == 0 || len(answers) == 0 {
		return 0
	}

	var evalHelper *exercise.Helper
	if h != nil {
		evalHelper = h.exerciseHelper
	}
	if evalHelper == nil {
		evalHelper = exercise.NewHelper()
	}

	questionsMap := make(map[string]exercise.Exercise, len(questions))
	for _, q := range questions {
		questionsMap[q.ID] = q
	}

	seen := make(map[string]bool, len(answers))
	correctCount := 0
	for _, ans := range answers {
		if seen[ans.ExerciseID] {
			continue
		}
		q, exists := questionsMap[ans.ExerciseID]
		if !exists {
			continue
		}
		seen[ans.ExerciseID] = true
		if evalHelper.EvaluateAnswer(q.CorrectAnswer, q.AcceptableAnswers, ans.UserAnswer) {
			correctCount++
		}
	}

	return (correctCount * 100) / len(questions)
}

// ResolveTargetLevel determines the initial proficiency level based on placement method and score
func (h *Helper) ResolveTargetLevel(
	levels []language.ProficiencyLevel,
	placementType string,
	manualLevelID *string,
	scorePercent int,
) *language.ProficiencyLevel {
	if len(levels) == 0 {
		return nil
	}

	sortedLevels := make([]language.ProficiencyLevel, len(levels))
	copy(sortedLevels, levels)
	sort.Slice(sortedLevels, func(i, j int) bool {
		if sortedLevels[i].OrderIndex != sortedLevels[j].OrderIndex {
			return sortedLevels[i].OrderIndex < sortedLevels[j].OrderIndex
		}
		return sortedLevels[i].ID < sortedLevels[j].ID
	})

	switch placementType {
	case "manual_select":
		if manualLevelID == nil || *manualLevelID == "" {
			return nil
		}
		for _, lvl := range sortedLevels {
			if lvl.ID == *manualLevelID {
				return &lvl
			}
		}
		return nil

	case "placement_test":
		if scorePercent >= 80 && len(sortedLevels) > 1 {
			return &sortedLevels[1]
		}
		return &sortedLevels[0]

	default: // "zero_beginner"
		return &sortedLevels[0]
	}
}

