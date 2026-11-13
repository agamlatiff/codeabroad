package exercise

import (
	"math"
	"sort"
	"strings"
	"time"
)

func normalizeComparableAnswer(raw string) (withSpaces string, collapsed string) {
	cleaned := strings.ToLower(strings.TrimSpace(raw))
	cleaned = strings.TrimRight(cleaned, "。？！.?!")
	fields := strings.Fields(cleaned)
	withSpaces = strings.Join(fields, " ")
	collapsed = strings.Join(fields, "")
	return withSpaces, collapsed
}

func answersMatch(candidate string, userWithSpaces string, userCollapsed string) bool {
	if userWithSpaces == "" {
		return false
	}
	candWithSpaces, candCollapsed := normalizeComparableAnswer(candidate)
	if candWithSpaces == "" {
		return false
	}
	if candWithSpaces == userWithSpaces {
		return true
	}
	return candCollapsed != "" && candCollapsed == userCollapsed
}

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

// EvaluateAnswer checks user answer string against correct answer and acceptable synonyms with whitespace/punctuation normalization
func (h *Helper) EvaluateAnswer(correctAnswer string, acceptableAnswers []string, userAnswer string) bool {
	userWithSpaces, userCollapsed := normalizeComparableAnswer(userAnswer)
	if userWithSpaces == "" {
		return false
	}
	if answersMatch(correctAnswer, userWithSpaces, userCollapsed) {
		return true
	}
	for _, acc := range acceptableAnswers {
		if answersMatch(acc, userWithSpaces, userCollapsed) {
			return true
		}
	}
	return false
}

// ExtractDiagnosticFeedback looks up targeted feedback in the diagnostic rubric for exact answers or distractor tokens
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
	keys := make([]string, 0, len(rubric))
	for k := range rubric {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	for _, k := range keys {
		lowerKey := strings.ToLower(strings.TrimSpace(k))
		if lowerKey == "" {
			continue
		}
		if lowerKey == lowerUser {
			if str, ok := rubric[k].(string); ok && str != "" {
				return &str
			}
		}
	}

	userFields := strings.Fields(lowerUser)
	for _, k := range keys {
		lowerKey := strings.ToLower(strings.TrimSpace(k))
		if lowerKey == "" {
			continue
		}
		matched := false
		for _, token := range userFields {
			if token == lowerKey {
				matched = true
				break
			}
		}
		if !matched && strings.Contains(lowerUser, lowerKey) {
			matched = true
		}
		if matched {
			if str, ok := rubric[k].(string); ok && str != "" {
				return &str
			}
		}
	}
	return nil
}

