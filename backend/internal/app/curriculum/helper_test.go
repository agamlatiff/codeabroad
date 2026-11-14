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
