package helper

import (
	"codeabroad/backend/internal/domain"
)

// CurriculumHelper provides pure domain business rules for curriculum roadmap assembly
type CurriculumHelper struct{}

// NewCurriculumHelper creates a new CurriculumHelper instance
func NewCurriculumHelper() *CurriculumHelper {
	return &CurriculumHelper{}
}

// CalculateUnitUnlocks determines pedagogical unlock status for a sequence of units
// Rule: Unit 0/1 is always unlocked. Subsequent units unlock when ALL lessons of the previous unit are complete.
func (h *CurriculumHelper) CalculateUnitUnlocks(units []domain.Unit) []domain.Unit {
	allPreviousCompleted := true

	for i := range units {
		units[i].IsUnlocked = allPreviousCompleted
		if units[i].TotalLessons > 0 && units[i].CompletedLessons < units[i].TotalLessons {
			allPreviousCompleted = false
		}
	}
	return units
}

// CanAccessLesson verifies if a learner can start a lesson based on prerequisite completion
func (h *CurriculumHelper) CanAccessLesson(isUnitUnlocked bool, prevLessonCompleted bool, isFirstLessonInUnit bool) bool {
	if !isUnitUnlocked {
		return false
	}
	if isFirstLessonInUnit {
		return true
	}
	return prevLessonCompleted
}

