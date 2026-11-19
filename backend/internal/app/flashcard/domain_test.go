package flashcard

import (
	"testing"
	"time"
)

func TestCalculateSM2_NewCardDistinctIntervals(t *testing.T) {
	now := time.Date(2026, 11, 19, 10, 0, 0, 0, time.UTC)

	again := CalculateSM2(1, 0, 0, 2.5, now)
	if again.Repetitions != 0 || again.NextReviewAt.Sub(now) != 1*time.Minute {
		t.Fatalf("Again on new card unexpected: %+v", again)
	}
	if again.EaseFactor != 2.3 {
		t.Fatalf("Again ease expected 2.3, got %v", again.EaseFactor)
	}

	hard := CalculateSM2(3, 0, 0, 2.5, now)
	if hard.Repetitions != 1 || hard.NextReviewAt.Sub(now) != 10*time.Minute {
		t.Fatalf("Hard on new card unexpected: %+v", hard)
	}
	if hard.EaseFactor != 2.35 {
		t.Fatalf("Hard ease expected 2.35, got %v", hard.EaseFactor)
	}

	good := CalculateSM2(4, 0, 0, 2.5, now)
	if good.Repetitions != 1 || good.IntervalDays != 1 || good.NextReviewAt.Sub(now) != 24*time.Hour {
		t.Fatalf("Good on new card unexpected: %+v", good)
	}
	if good.EaseFactor != 2.5 {
		t.Fatalf("Good ease expected 2.5, got %v", good.EaseFactor)
	}

	easy := CalculateSM2(5, 0, 0, 2.5, now)
	if easy.Repetitions != 1 || easy.IntervalDays != 4 || easy.NextReviewAt.Sub(now) != 96*time.Hour {
		t.Fatalf("Easy on new card unexpected: %+v", easy)
	}
	if easy.EaseFactor != 2.65 {
		t.Fatalf("Easy ease expected 2.65, got %v", easy.EaseFactor)
	}
}

func TestCalculateSM2_ReviewedCardProgression(t *testing.T) {
	now := time.Date(2026, 11, 19, 10, 0, 0, 0, time.UTC)

	goodSecond := CalculateSM2(4, 1, 1, 2.5, now)
	if goodSecond.Repetitions != 2 || goodSecond.IntervalDays != 3 {
		t.Fatalf("Good 2nd rep expected reps=2, interval=3, got %+v", goodSecond)
	}

	hardReview := CalculateSM2(3, 2, 10, 2.5, now)
	if hardReview.IntervalDays != 12 || hardReview.EaseFactor != 2.35 {
		t.Fatalf("Hard review expected interval=12, ease=2.35, got %+v", hardReview)
	}

	easyReview := CalculateSM2(5, 2, 10, 2.5, now)
	if easyReview.IntervalDays != 33 || easyReview.EaseFactor != 2.65 {
		t.Fatalf("Easy review expected interval=33, ease=2.65, got %+v", easyReview)
	}
}
