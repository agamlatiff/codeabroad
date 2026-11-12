package curriculum

// Helper encapsulates business logic for roadmap unlocks and lesson completion evaluation
type Helper struct{}

// NewHelper creates a new curriculum Helper instance
func NewHelper() *Helper {
	return &Helper{}
}

// CalculateRoadmapUnlocks computes unlock statuses, overall progression metrics, and locates current active lesson
func (h *Helper) CalculateRoadmapUnlocks(units []UnitNodeResponse) ([]UnitNodeResponse, int, int, int, *string) {
	allPreviousUnitsCompleted := true
	totalLessons := 0
	completedLessons := 0
	var currentLessonID *string

	for i := range units {
		units[i].IsUnlocked = allPreviousUnitsCompleted
		unitActiveTraversed := false

		for j := range units[i].Lessons {
			totalLessons++
			lesson := &units[i].Lessons[j]

			if lesson.IsCompleted {
				completedLessons++
				lesson.IsUnlocked = true
			} else {
				if allPreviousUnitsCompleted && !unitActiveTraversed {
					lesson.IsUnlocked = true
					unitActiveTraversed = true
					if currentLessonID == nil {
						id := lesson.ID
						currentLessonID = &id
					}
				} else {
					lesson.IsUnlocked = false
				}
			}
		}

		if units[i].TotalLessons > 0 && units[i].CompletedLessons < units[i].TotalLessons {
			allPreviousUnitsCompleted = false
		}
	}

	progressPercent := 0
	if totalLessons > 0 {
		progressPercent = (completedLessons * 100) / totalLessons
	}

	return units, totalLessons, completedLessons, progressPercent, currentLessonID
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

