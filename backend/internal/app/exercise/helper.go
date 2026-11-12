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
func (h *Helper) CalculateSM2(
	quality int,
	prevRepetitions int,
	prevIntervalDays int,
	prevEaseFactor float64,
	now time.Time,
) SM2Result {
	if prevEaseFactor < 1.3 {
		prevEaseFactor = 2.5
	}

	var repetitions int
	var intervalDays int
	var easeFactor float64

	if quality >= 3 {
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

		qDiff := 5.0 - float64(quality)
		easeFactor = prevEaseFactor + (0.1 - qDiff*(0.08+qDiff*0.02))
		if easeFactor < 1.3 {
			easeFactor = 1.3
		}
	} else {
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

// EvaluateAnswer checks user answer string against correct answer and acceptable synonyms with case-insensitive whitespace trim
func (h *Helper) EvaluateAnswer(correctAnswer string, acceptableAnswers []string, userAnswer string) bool {
	normUser := strings.ToLower(strings.TrimSpace(userAnswer))
	if normUser == "" {
		return false
	}
	normCorrect := strings.ToLower(strings.TrimSpace(correctAnswer))
	if normCorrect == normUser {
		return true
	}
	for _, acc := range acceptableAnswers {
		if strings.ToLower(strings.TrimSpace(acc)) == normUser {
			return true
		}
	}
	return false
}

// ExtractDiagnosticFeedback looks up targeted feedback in the diagnostic rubric for a specific user choice
func (h *Helper) ExtractDiagnosticFeedback(rubric map[string]any, userAnswer string) *string {
	if len(rubric) == 0 {
		return nil
	}
	trimmed := strings.TrimSpace(userAnswer)
	if val, ok := rubric[trimmed]; ok {
		if str, ok := val.(string); ok && str != "" {
			return &str
		}
	}
	lowerUser := strings.ToLower(trimmed)
	for k, v := range rubric {
		if strings.ToLower(strings.TrimSpace(k)) == lowerUser {
			if str, ok := v.(string); ok && str != "" {
				return &str
			}
		}
	}
	return nil
}

