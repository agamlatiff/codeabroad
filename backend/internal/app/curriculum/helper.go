package curriculum

import (
	"fmt"
	"time"

	"codeabroad/backend/internal/shared/apperror"
)

const xpPerLevel = 100

// Helper encapsulates business logic for curriculum unlocks and lesson completion evaluation
type Helper struct{}

// NewHelper creates a new curriculum Helper instance
func NewHelper() *Helper {
	return &Helper{}
}

// CalculateCurriculumUnlocks computes unlock statuses, overall progression metrics, and locates current active lesson
func (h *Helper) CalculateCurriculumUnlocks(units []UnitNodeResponse) ([]UnitNodeResponse, int, int, int, *string) {
	allPreviousUnitsCompleted := true
	totalLessons := 0
	completedLessons := 0
	var currentLessonID *string

	for i := range units {
		if units[i].UnitType != "" && units[i].UnitType != "curriculum" {
			units[i].IsUnlocked = false
			for j := range units[i].Lessons {
				units[i].Lessons[j].IsUnlocked = false
			}
			continue
		}

		units[i].IsUnlocked = allPreviousUnitsCompleted
		unitActiveTraversed := false
		unitTotal := len(units[i].Lessons)
		unitCompleted := 0

		for j := range units[i].Lessons {
			totalLessons++
			lesson := &units[i].Lessons[j]

			if lesson.IsCompleted {
				completedLessons++
				unitCompleted++
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

		if unitTotal > 0 {
			units[i].TotalLessons = unitTotal
			units[i].CompletedLessons = unitCompleted
		}

		effectiveTotal := unitTotal
		effectiveCompleted := unitCompleted
		if effectiveTotal == 0 {
			effectiveTotal = units[i].TotalLessons
			effectiveCompleted = units[i].CompletedLessons
		}
		if effectiveTotal > 0 && effectiveCompleted < effectiveTotal {
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

// EvaluateDailyStreak calculates the updated daily streak based on the last active timestamp adjusted to application timezone (WIB)
func (h *Helper) EvaluateDailyStreak(currentStreak int, lastActiveAt *time.Time, now time.Time) (newStreak int, changed bool) {
	loc, err := time.LoadLocation("Asia/Jakarta")
	if err != nil {
		loc = time.FixedZone("WIB", 7*3600)
	}

	nowInWIB := now.In(loc)
	today := time.Date(nowInWIB.Year(), nowInWIB.Month(), nowInWIB.Day(), 0, 0, 0, 0, loc)

	newStreak = currentStreak
	if lastActiveAt == nil {
		newStreak = 1
	} else {
		lastInWIB := lastActiveAt.In(loc)
		lastActiveDay := time.Date(lastInWIB.Year(), lastInWIB.Month(), lastInWIB.Day(), 0, 0, 0, 0, loc)
		daysDiff := int(today.Sub(lastActiveDay) / (24 * time.Hour))

		if daysDiff == 1 {
			newStreak = currentStreak + 1
		} else if daysDiff > 1 {
			newStreak = 1
		} else if currentStreak == 0 {
			newStreak = 1
		}
	}

	return newStreak, newStreak != currentStreak
}

// CalculateLevel computes user level from total XP (100 XP per level, minimum level 1).
func (h *Helper) CalculateLevel(xp int) int {
	if xp < 0 {
		return 1
	}
	return (xp / xpPerLevel) + 1
}

// ComputeVerifiedLessonScore validates exercise attempt completeness and calculates server-verified lesson accuracy.
const minLessonPassScore = 60

// ComputeVerifiedLessonScore derives a lesson's score strictly from verified exercise_attempts rows
func (h *Helper) ComputeVerifiedLessonScore(_ int, summary *LessonAttemptSummary, isReplay bool) (int, error) {
	if summary == nil || summary.TotalExercises <= 0 {
		return 0, apperror.NewBadRequestError(
			"LESSON_EXERCISES_REQUIRED",
			"Lesson must have configured exercises before completion",
			map[string]any{"total_exercises": 0},
		)
	}

	attempted := summary.AttemptedExercises
	correct := summary.CorrectExercises
	if isReplay {
		attempted = summary.FreshAttemptedExercises
		correct = summary.FreshCorrectExercises
	}

	if attempted < summary.TotalExercises {
		return 0, apperror.NewBadRequestError(
			"EXERCISES_NOT_ATTEMPTED",
			fmt.Sprintf("You must attempt all %d exercises before completing this lesson", summary.TotalExercises),
			map[string]any{
				"total_exercises":     summary.TotalExercises,
				"attempted_exercises": attempted,
				"is_replay":           isReplay,
			},
		)
	}

	if correct < 0 {
		correct = 0
	}
	if correct > summary.TotalExercises {
		correct = summary.TotalExercises
	}
	score := (correct * 100) / summary.TotalExercises
	if !isReplay && score < minLessonPassScore {
		return 0, apperror.NewBadRequestError(
			"LESSON_SCORE_TOO_LOW",
			fmt.Sprintf("You need at least %d%% accuracy to complete this lesson", minLessonPassScore),
			map[string]any{
				"score":          score,
				"required_score": minLessonPassScore,
			},
		)
	}
	return score, nil
}

