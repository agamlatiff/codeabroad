package curriculum

// Helper encapsulates business logic for roadmap unlocks and lesson completion evaluation
type Helper struct{}

// NewHelper creates a new curriculum Helper instance
func NewHelper() *Helper {
	return &Helper{}
}

// CalculateUnitUnlocks determines pedagogical unlock status for a sequence of units
func (h *Helper) CalculateUnitUnlocks(units []Unit) []Unit {
	allPreviousCompleted := true

	for i := range units {
		units[i].IsUnlocked = allPreviousCompleted
		if units[i].TotalLessons > 0 && units[i].CompletedLessons < units[i].TotalLessons {
			allPreviousCompleted = false
		}
	}
	return units
}

// CanAccessLesson verifies whether a lesson node can be accessed by the user
func (h *Helper) CanAccessLesson(isUnitUnlocked bool, prevLessonCompleted bool, isFirstLessonInUnit bool) bool {
	if !isUnitUnlocked {
		return false
	}
	if isFirstLessonInUnit {
		return true
	}
	return prevLessonCompleted
}

