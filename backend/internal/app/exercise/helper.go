package exercise

import (
	"math"
	"sort"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"merantalk/backend/internal/shared/progression"
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

var kanjiToHiraganaSpeechReplacer = strings.NewReplacer(
	"有難うございます", "ありがとうございます",
	"有難う", "ありがとう",
	"済みません", "すみません",
	"食べます", "たべます",
	"飲みます", "のみます",
	"行きます", "いきます",
	"見ます", "みます",
	"毎朝", "まいあさ",
	"ご飯", "ごはん",
	"今日", "きょう",
	"明日", "あした",
	"日本", "にほん",
	"先生", "せんせい",
	"学生", "がくせい",
	"お菓子", "おかし",
	"青い", "あおい",
	"赤い", "あかい",
	"私", "わたし",
	"顔", "かお",
	"家", "いえ",
	"声", "こえ",
	"秋", "あき",
	"青", "あお",
	"赤", "あか",
	"池", "いけ",
	"駅", "えき",
	"上", "うえ",
	"愛", "あい",
	"柿", "かき",
	"魚", "さかな",
	"傘", "かさ",
	"寿司", "すし",
	"水", "みず",
	"山", "やま",
	"花", "はな",
	"耳", "みみ",
	"猫", "ねこ",
	"犬", "いぬ",
	"朝", "あさ",
	"夜", "よる",
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

func foldKatakanaAndKanjiSpeech(raw string) string {
	replaced := kanjiToHiraganaSpeechReplacer.Replace(strings.TrimSpace(raw))
	var b strings.Builder
	b.Grow(len(replaced))
	for _, r := range replaced {
		if r >= 0x30A1 && r <= 0x30F6 {
			b.WriteRune(r - 0x60)
		} else {
			b.WriteRune(r)
		}
	}
	return b.String()
}

func normalizeSpeechCandidate(raw string) []string {
	trimmed := strings.TrimSpace(raw)
	if trimmed == "" {
		return nil
	}
	folded := foldKatakanaAndKanjiSpeech(trimmed)
	variants := []string{
		trimmed,
		folded,
		strings.ReplaceAll(trimmed, "-", " "),
		strings.ReplaceAll(trimmed, "-", ""),
		strings.ReplaceAll(folded, "-", ""),
	}
	if parenIdx := strings.Index(trimmed, "("); parenIdx > 0 {
		noParen := strings.TrimSpace(trimmed[:parenIdx])
		if noParen != "" {
			variants = append(variants, noParen, strings.ReplaceAll(noParen, "-", ""))
		}
	}
	return variants
}

// EvaluateExerciseAnswer evaluates a user answer using standard grading plus speech-friendly
// romaji, hyphen, Katakana->Hiragana, and Chrome STT Kanji normalization for speaking_repeat exercises.
func (h *Helper) EvaluateExerciseAnswer(ex *Exercise, userAnswer string) bool {
	if ex == nil {
		return false
	}
	if h.EvaluateAnswer(ex.CorrectAnswer, ex.AcceptableAnswers, userAnswer) {
		return true
	}
	if ex.ExerciseType != ExerciseTypeSpeakingRepeat {
		return false
	}

	candidates := make([]string, 0, 12)
	candidates = append(candidates, normalizeSpeechCandidate(ex.CorrectAnswer)...)
	for _, acc := range ex.AcceptableAnswers {
		candidates = append(candidates, normalizeSpeechCandidate(acc)...)
	}
	if ex.Content != nil {
		for _, key := range []string{"display_text", "audio_text", "romaji"} {
			if s, ok := ex.Content[key].(string); ok {
				candidates = append(candidates, normalizeSpeechCandidate(s)...)
			}
		}
		if rawBreakdown, ok := ex.Content["phonetic_breakdown"].([]any); ok {
			parts := make([]string, 0, len(rawBreakdown))
			for _, item := range rawBreakdown {
				if s, isStr := item.(string); isStr && strings.TrimSpace(s) != "" {
					parts = append(parts, strings.TrimSpace(s))
				}
			}
			if len(parts) > 0 {
				joined := strings.Join(parts, " ")
				candidates = append(candidates, joined, strings.ReplaceAll(joined, "-", ""))
				candidates = append(candidates, strings.ReplaceAll(strings.Join(parts, ""), "-", ""))
			}
		} else if breakdownSlice, ok := ex.Content["phonetic_breakdown"].([]string); ok && len(breakdownSlice) > 0 {
			joined := strings.Join(breakdownSlice, " ")
			candidates = append(candidates, joined, strings.ReplaceAll(joined, "-", ""))
			candidates = append(candidates, strings.ReplaceAll(strings.Join(breakdownSlice, ""), "-", ""))
		}
	}

	for _, userVariant := range normalizeSpeechCandidate(userAnswer) {
		uSpaces, uCollapsed := normalizeComparableAnswer(userVariant)
		if uSpaces == "" {
			continue
		}
		for _, cand := range candidates {
			if answersMatch(cand, uSpaces, uCollapsed) {
				return true
			}
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

