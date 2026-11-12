package exercise

import (
	"math"
	"strings"
	"time"
)

// Helper encapsulates cognitive algorithms including SuperMemo SM-2 and answer grading
type Helper struct{}

// NewHelper creates a new exercise Helper instance
func NewHelper() *Helper {
	return &Helper{}
}

// SM2Result holds the computed memory state after a spaced retrieval review
type SM2Result struct {
	Repetitions  int
	IntervalDays int
	EaseFactor   float64
	DueDate      time.Time
}

// CalculateSM2 computes interval, ease factor, and due date following the SuperMemo SM-2 algorithm
// Quality scale:
// 5: perfect response
// 4: correct response after hesitation
// 3: correct response recalled with serious difficulty
// 2: incorrect response; where the correct one seemed easy to recall
// 1: incorrect response; the correct one remembered
// 0: complete blackout
func (h *Helper) CalculateSM2(
	quality int,
	prevRepetitions int,
	prevIntervalDays int,
	prevEaseFactor float64,
	now time.Time,
) SM2Result {
	if prevEaseFactor < 1.3 {
		prevEaseFactor = 2.5 // Default initial ease factor
	}

	var repetitions int
	var intervalDays int
	var easeFactor float64

	if quality >= 3 {
		// Successful recall
		if prevRepetitions == 0 {
			intervalDays = 1
		} else if prevRepetitions == 1 {
			intervalDays = 6
		} else {
			intervalDays = int(math.Round(float64(prevIntervalDays) * prevEaseFactor))
			if intervalDays <= prevIntervalDays {
				intervalDays = prevIntervalDays + 1
			}
		}
		repetitions = prevRepetitions + 1

		// EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
		qDiff := 5.0 - float64(quality)
		easeFactor = prevEaseFactor + (0.1 - qDiff*(0.08+qDiff*0.02))
		if easeFactor < 1.3 {
			easeFactor = 1.3
		}
	} else {
		// Failed recall: reset repetitions and interval
		repetitions = 0
		intervalDays = 1
		easeFactor = prevEaseFactor
	}

	dueDate := now.AddDate(0, 0, intervalDays)

	return SM2Result{
		Repetitions:  repetitions,
		IntervalDays: intervalDays,
		EaseFactor:   math.Round(easeFactor*100) / 100,
		DueDate:      dueDate,
	}
}

// EvaluateAnswer checks user answer string against correct answer with case-insensitive whitespace trim
func (h *Helper) EvaluateAnswer(correctAnswer string, userAnswer string) bool {
	normCorrect := strings.ToLower(strings.TrimSpace(correctAnswer))
	normUser := strings.ToLower(strings.TrimSpace(userAnswer))
	return normCorrect == normUser
}

