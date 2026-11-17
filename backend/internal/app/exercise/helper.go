package exercise

import (
	"math"
	"sort"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"codeabroad/backend/internal/shared/progression"
)

func normalizeLimit(limit int, defaultLimit int, maxLimit int) int {
	if limit <= 0 {
		return defaultLimit
	}
	if limit > maxLimit {
		return maxLimit
	}
	return limit
}

var comparablePunctuationReplacer = strings.NewReplacer(
	"ß", "ss",
	"ẞ", "ss",
	"\u3000", " ",
	"。", " ",
	"、", " ",
	"？", " ",
	"！", " ",
	"「", " ",
	"」", " ",
	"・", " ",
	"«", " ",
	"»", " ",
	"„", " ",
	"“", " ",
	"”", " ",
	"’", "'",
	"‘", "'",
	".", " ",
	",", " ",
	"?", " ",
	"!", " ",
	"\"", " ",
)

func containsCJK(s string) bool {
	for _, r := range s {
		if unicode.In(r, unicode.Han, unicode.Hiragana, unicode.Katakana) {
			return true
		}
	}
	return false
}

func normalizeComparableAnswer(raw string) (withSpaces string, collapsed string) {
	cleaned := strings.ToLower(strings.TrimSpace(raw))
	cleaned = comparablePunctuationReplacer.Replace(cleaned)
	fields := strings.Fields(cleaned)
	withSpaces = strings.Join(fields, " ")
	if containsCJK(cleaned) {
		collapsed = strings.Join(fields, "")
	}
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
	if quality < 0 {
		quality = 0
	} else if quality > 5 {
		quality = 5
	}
	if prevEaseFactor <= 0 {
		prevEaseFactor = 2.5
	} else if prevEaseFactor < 1.3 {
		prevEaseFactor = 1.3
	}

	// SM-2 updates Ease Factor (EF') first so intervals >= 2 use the newly revised ease factor.
	qDiff := 5.0 - float64(quality)
	easeFactor := prevEaseFactor + (0.1 - qDiff*(0.08+qDiff*0.02))
	if easeFactor < 1.3 {
		easeFactor = 1.3
	}

	var repetitions int
	var intervalDays int

	if quality >= 3 {
		if prevRepetitions == 0 {
			intervalDays = 1
		} else if prevRepetitions == 1 {
			intervalDays = 6
		} else {
			intervalDays = int(math.Round(float64(prevIntervalDays) * easeFactor))
			if intervalDays <= prevIntervalDays {
				intervalDays = prevIntervalDays + 1
			}
		}
		repetitions = prevRepetitions + 1
	} else {
		repetitions = 0
		intervalDays = 1
	}

	loc := progression.WIBLocation
	wibTarget := now.In(loc).AddDate(0, 0, intervalDays)
	dueDate := time.Date(wibTarget.Year(), wibTarget.Month(), wibTarget.Day(), 0, 0, 0, 0, loc).UTC()

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

	cleanedUser := comparablePunctuationReplacer.Replace(lowerUser)
	userFields := strings.Fields(cleanedUser)
	for _, k := range keys {
		lowerKey := strings.ToLower(strings.TrimSpace(k))
		if lowerKey == "" {
			continue
		}
		matched := false
		for _, token := range userFields {
			trimmedToken := strings.TrimFunc(token, unicode.IsPunct)
			if token == lowerKey || (trimmedToken != "" && trimmedToken == lowerKey) {
				matched = true
				break
			}
		}
		if !matched && containsCJK(lowerKey) && utf8.RuneCountInString(lowerKey) >= 2 && strings.Contains(lowerUser, lowerKey) {
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

