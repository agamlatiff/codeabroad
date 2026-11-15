package curriculum_test

import (
	"errors"
	"testing"

	"codeabroad/backend/internal/app/curriculum"
	"codeabroad/backend/internal/shared/apperror"
)

func TestHelper_CalculateReplayXP(t *testing.T) {
	helper := curriculum.NewHelper()

	cases := []struct {
		name     string
		score    int
		expected int
	}{
		{name: "zero score earns zero XP", score: 0, expected: 0},
		{name: "below passing threshold earns zero XP", score: 59, expected: 0},
		{name: "exact passing threshold earns replay XP", score: 60, expected: 5},
		{name: "perfect replay score earns replay XP", score: 100, expected: 5},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := helper.CalculateReplayXP(tc.score); got != tc.expected {
				t.Errorf("CalculateReplayXP(%d) = %d, want %d", tc.score, got, tc.expected)
			}
		})
	}
}

func TestHelper_ComputeVerifiedLessonScore(t *testing.T) {
	helper := curriculum.NewHelper()

	t.Run("initial attempt below minimum accuracy returns LESSON_SCORE_TOO_LOW", func(t *testing.T) {
		summary := &curriculum.LessonAttemptSummary{
			TotalExercises:     5,
			AttemptedExercises: 5,
			CorrectExercises:   2,
		}
		_, err := helper.ComputeVerifiedLessonScore(100, summary, false)
		var domErr *apperror.DomainError
		if !errors.As(err, &domErr) || domErr.Code != "LESSON_SCORE_TOO_LOW" {
			t.Fatalf("expected LESSON_SCORE_TOO_LOW, got %v", err)
		}
	})

	t.Run("replay below minimum accuracy returns verified score and yields zero replay XP", func(t *testing.T) {
		summary := &curriculum.LessonAttemptSummary{
			TotalExercises:          5,
			AttemptedExercises:      5,
			CorrectExercises:        5,
			FreshAttemptedExercises: 5,
			FreshCorrectExercises:   2,
		}
		score, err := helper.ComputeVerifiedLessonScore(100, summary, true)
		if err != nil {
			t.Fatalf("expected no error for failed replay score calculation, got %v", err)
		}
		if score != 40 {
			t.Errorf("expected verified score 40, got %d", score)
		}
		if xp := helper.CalculateReplayXP(score); xp != 0 {
			t.Errorf("expected 0 replay XP for score %d, got %d", score, xp)
		}
	})

	t.Run("replay requires fresh attempts for all exercises", func(t *testing.T) {
		summary := &curriculum.LessonAttemptSummary{
			TotalExercises:          5,
			AttemptedExercises:      5,
			CorrectExercises:        5,
			FreshAttemptedExercises: 3,
			FreshCorrectExercises:   3,
		}
		_, err := helper.ComputeVerifiedLessonScore(100, summary, true)
		var domErr *apperror.DomainError
		if !errors.As(err, &domErr) || domErr.Code != "EXERCISES_NOT_ATTEMPTED" {
			t.Fatalf("expected EXERCISES_NOT_ATTEMPTED, got %v", err)
		}
	})
}

func TestHelper_CalculateCurriculumUnlocks_SequentialPrerequisiteParity(t *testing.T) {
	helper := curriculum.NewHelper()

	t.Run("locks out-of-order completed lesson when earlier lesson in unit is incomplete", func(t *testing.T) {
		units := []curriculum.UnitNodeResponse{
			{
				ID:       "unit-1",
				UnitType: "curriculum",
				Lessons: []curriculum.LessonNodeResponse{
					{ID: "l-1", IsCompleted: false},
					{ID: "l-2", IsCompleted: true},
					{ID: "l-3", IsCompleted: false},
				},
			},
		}

		out, total, completed, progress, currentID := helper.CalculateCurriculumUnlocks(units)
		if !out[0].IsUnlocked {
			t.Errorf("expected first unit to be unlocked")
		}
		if !out[0].Lessons[0].IsUnlocked {
			t.Errorf("expected l-1 to be unlocked")
		}
		if out[0].Lessons[1].IsUnlocked {
			t.Errorf("expected l-2 (completed out-of-order) to remain locked when l-1 is incomplete")
		}
		if out[0].Lessons[2].IsUnlocked {
			t.Errorf("expected l-3 to remain locked")
		}
		if total != 3 || completed != 1 || progress != 33 {
			t.Errorf("expected totals 3/1 (33%%), got %d/%d (%d%%)", total, completed, progress)
		}
		if currentID == nil || *currentID != "l-1" {
			t.Errorf("expected currentLessonID 'l-1', got %v", currentID)
		}
	})

	t.Run("locks out-of-order completed lesson across units when prior unit has incomplete lesson", func(t *testing.T) {
		units := []curriculum.UnitNodeResponse{
			{
				ID:       "unit-1",
				UnitType: "curriculum",
				Lessons: []curriculum.LessonNodeResponse{
					{ID: "l-1", IsCompleted: true},
					{ID: "l-2", IsCompleted: false},
				},
			},
			{
				ID:       "unit-2",
				UnitType: "curriculum",
				Lessons: []curriculum.LessonNodeResponse{
					{ID: "l-3", IsCompleted: true},
					{ID: "l-4", IsCompleted: false},
				},
			},
		}

		out, total, completed, progress, currentID := helper.CalculateCurriculumUnlocks(units)
		if !out[0].Lessons[0].IsUnlocked || !out[0].Lessons[1].IsUnlocked {
			t.Errorf("expected l-1 and l-2 to be unlocked")
		}
		if out[1].IsUnlocked {
			t.Errorf("expected unit-2 to remain locked while unit-1 has incomplete lesson")
		}
		if out[1].Lessons[0].IsUnlocked || out[1].Lessons[1].IsUnlocked {
			t.Errorf("expected unit-2 lessons (including out-of-order completed l-3) to remain locked")
		}
		if total != 4 || completed != 2 || progress != 50 {
			t.Errorf("expected totals 4/2 (50%%), got %d/%d (%d%%)", total, completed, progress)
		}
		if currentID == nil || *currentID != "l-2" {
			t.Errorf("expected currentLessonID 'l-2', got %v", currentID)
		}
	})

	t.Run("ignores non-curriculum units and unlocks next sequential lesson across completed unit", func(t *testing.T) {
		units := []curriculum.UnitNodeResponse{
			{
				ID:       "unit-exam",
				UnitType: "diagnostic_exam",
				Lessons: []curriculum.LessonNodeResponse{
					{ID: "l-exam", IsCompleted: false},
				},
			},
			{
				ID:       "unit-1",
				UnitType: "curriculum",
				Lessons: []curriculum.LessonNodeResponse{
					{ID: "l-1", IsCompleted: true},
				},
			},
			{
				ID:       "unit-2",
				UnitType: "curriculum",
				Lessons: []curriculum.LessonNodeResponse{
					{ID: "l-2", IsCompleted: false},
					{ID: "l-3", IsCompleted: false},
				},
			},
		}

		out, total, completed, _, currentID := helper.CalculateCurriculumUnlocks(units)
		if out[0].IsUnlocked || out[0].Lessons[0].IsUnlocked {
			t.Errorf("expected diagnostic_exam unit and lessons to be locked")
		}
		if !out[1].IsUnlocked || !out[1].Lessons[0].IsUnlocked {
			t.Errorf("expected unit-1 / l-1 to be unlocked")
		}
		if !out[2].IsUnlocked || !out[2].Lessons[0].IsUnlocked || out[2].Lessons[1].IsUnlocked {
			t.Errorf("expected unit-2 / l-2 unlocked and l-3 locked, got unit=%v l2=%v l3=%v",
				out[2].IsUnlocked, out[2].Lessons[0].IsUnlocked, out[2].Lessons[1].IsUnlocked)
		}
		if total != 3 || completed != 1 {
			t.Errorf("expected totals 3/1, got %d/%d", total, completed)
		}
		if currentID == nil || *currentID != "l-2" {
			t.Errorf("expected currentLessonID 'l-2', got %v", currentID)
		}
	})
}
