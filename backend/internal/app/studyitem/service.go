package studyitem

import (
	"context"
	"fmt"
	"regexp"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"merantalk/backend/internal/app/exercise"
)

const maxStudyItemsPerLesson = 8

var (
	checkpointSlugRegex       = regexp.MustCompile(`(?i)checkpoint|spiral-test|musim-dan-suasana-kota|simulasi-akhir|tes-akhir`)
	trailingParensRegex       = regexp.MustCompile(`\(([^()]+)\)\s*$`)
	trailingPromptParensRegex = regexp.MustCompile(`\(([^()]+)\)\s*[:：.!?]*\s*$`)
	quotedSentenceRegex       = regexp.MustCompile(`"([^"]+)"`)
	parenQuotedSpoilerRegex   = regexp.MustCompile(`\s*\("([^"]+)"\)`)
	dashQuotedSpoilerRegex    = regexp.MustCompile(`\s*[—–-]\s*"([^"]+)"(\s*[.!?]?)\s*$`)
	explanationMeaningRegex   = regexp.MustCompile(`(?i)(?:bermakna|berarti)\s+"([^"]+)"`)
	anyParensRegex            = regexp.MustCompile(`\s*\([^)]*\)`)
	multiSpaceRegex           = regexp.MustCompile(`\s{2,}`)
	spaceBeforePunctRegex     = regexp.MustCompile(`\s+([.,!?])`)
)

// Item represents a sanitized, distractor-free preview card built server-side for the lesson study flow.
type Item struct {
	Symbol             string
	Reading            string
	Meaning            string
	Mnemonic           string
	SpeakText          string
	FirstExerciseIndex int
}

// GrammarExample holds a Japanese example sentence with romaji reading and Indonesian meaning.
type GrammarExample struct {
	JP      string
	Reading string
	ID      string
}

// GrammarContext carries lightweight grammar metadata needed for study cards and contextual quiz hints.
type GrammarContext struct {
	Title    string
	Formula  string
	Examples []GrammarExample
}

// Service synthesizes distractor-free lesson study cards and populates spoiler-free hints & furigana.
type Service interface {
	BuildLessonStudyItemsAndHints(
		ctx context.Context,
		slug string,
		rawExercises []exercise.Exercise,
		sanitizedExercises []exercise.Exercise,
		grammarPoints []GrammarContext,
	) []Item
}

type service struct {
	kanaCache *kanaCatalogCache
}

// NewService creates a StudyItemService backed by the given KanaLoader with a 30-minute in-memory cache.
// When kanaLoader is nil, the service falls back to the lightweight embedded Gojuon map.
func NewService(kanaLoader KanaLoader) Service {
	return newServiceWithCache(kanaLoader, defaultKanaCacheTTL, time.Now)
}

func newServiceWithCache(kanaLoader KanaLoader, ttl time.Duration, nowFn func() time.Time) *service {
	return &service{
		kanaCache: newKanaCatalogCache(kanaLoader, ttl, nowFn),
	}
}

// IsCheckpointLessonSlug reports whether a lesson slug represents a checkpoint or final exam
// where study preview cards and contextual quiz hints must be withheld.
func IsCheckpointLessonSlug(slug string) bool {
	return strings.TrimSpace(slug) != "" && checkpointSlugRegex.MatchString(slug)
}

func contentString(content map[string]any, key string) string {
	if content == nil {
		return ""
	}
	v, ok := content[key]
	if !ok || v == nil {
		return ""
	}
	if s, isStr := v.(string); isStr {
		return strings.TrimSpace(s)
	}
	return ""
}

func contentStringSlice(content map[string]any, key string) []string {
	if content == nil {
		return nil
	}
	raw, ok := content[key]
	if !ok || raw == nil {
		return nil
	}
	switch typed := raw.(type) {
	case []string:
		out := make([]string, 0, len(typed))
		for _, item := range typed {
			if t := strings.TrimSpace(item); t != "" {
				out = append(out, t)
			}
		}
		return out
	case []any:
		out := make([]string, 0, len(typed))
		for _, item := range typed {
			if s, isStr := item.(string); isStr {
				if t := strings.TrimSpace(s); t != "" {
					out = append(out, t)
				}
			}
		}
		return out
	default:
		return nil
	}
}

func extractTrailingParen(s string) (cleanBase string, inside string) {
	trimmed := strings.TrimSpace(s)
	matches := trailingParensRegex.FindStringSubmatchIndex(trimmed)
	if len(matches) < 4 {
		return trimmed, ""
	}
	base := strings.TrimSpace(trimmed[:matches[0]])
	inner := strings.TrimSpace(trimmed[matches[2]:matches[3]])
	if idx := strings.Index(inner, "="); idx >= 0 {
		lhs := strings.TrimSpace(inner[:idx])
		rhs := strings.TrimSpace(inner[idx+1:])
		// Prefer romaji side when "(kolam = ike)" or "(musim = haru)"
		if rhs != "" && !containsJapaneseRune(rhs) && strings.Count(rhs, " ") <= 2 {
			return base, rhs
		}
		if lhs != "" && !containsJapaneseRune(lhs) && strings.Count(lhs, " ") <= 2 {
			return base, lhs
		}
	}
	if containsJapaneseRune(inner) {
		return base, ""
	}
	return base, inner
}

func containsJapaneseRune(s string) bool {
	for _, r := range s {
		if unicode.In(r, unicode.Hiragana, unicode.Katakana, unicode.Han) {
			return true
		}
	}
	return false
}

func isSingleRuneSlice(tokens []string) bool {
	if len(tokens) == 0 {
		return false
	}
	for _, tok := range tokens {
		if len([]rune(strings.TrimSpace(tok))) > 1 {
			return false
		}
	}
	return true
}

func collapseSpacesBetweenJapanese(s string) string {
	runes := []rune(strings.TrimSpace(s))
	if len(runes) == 0 {
		return ""
	}
	var b strings.Builder
	b.Grow(len(s))
	for i := 0; i < len(runes); i++ {
		if unicode.IsSpace(runes[i]) && i > 0 && i+1 < len(runes) {
			prevJP := unicode.In(runes[i-1], unicode.Hiragana, unicode.Katakana, unicode.Han)
			nextJP := unicode.In(runes[i+1], unicode.Hiragana, unicode.Katakana, unicode.Han)
			if prevJP && nextJP {
				continue
			}
		}
		b.WriteRune(runes[i])
	}
	return strings.TrimSpace(b.String())
}

func normalizeStudyKey(symbol string) string {
	var b strings.Builder
	for _, r := range strings.TrimSpace(symbol) {
		if unicode.IsSpace(r) || r == '。' || r == '、' || r == '.' || r == '!' || r == '?' || r == '・' {
			continue
		}
		b.WriteRune(r)
	}
	return b.String()
}

func resolveMatchedChoiceText(content map[string]any, rawOptions []string, correctAnswer string) string {
	target := strings.TrimSpace(correctAnswer)
	if target == "" {
		return ""
	}
	if content != nil {
		if opts, ok := content["options"].([]any); ok {
			for _, rawOpt := range opts {
				switch typed := rawOpt.(type) {
				case map[string]any:
					optID, _ := typed["id"].(string)
					optText, _ := typed["text"].(string)
					if strings.EqualFold(strings.TrimSpace(optID), target) || strings.EqualFold(strings.TrimSpace(optText), target) {
						return strings.TrimSpace(optText)
					}
				case string:
					if strings.EqualFold(strings.TrimSpace(typed), target) {
						return strings.TrimSpace(typed)
					}
				}
			}
		}
	}
	for _, opt := range rawOptions {
		if strings.EqualFold(strings.TrimSpace(opt), target) {
			return strings.TrimSpace(opt)
		}
	}
	return ""
}

func isWeakReading(r string) bool {
	lower := strings.ToLower(strings.TrimSpace(r))
	return lower == "" ||
		lower == "dengarkan audio" ||
		lower == "pelafalan audio" ||
		lower == "kosakata kunci" ||
		lower == "susunan kalimat utuh" ||
		lower == "latihan pelafalan"
}

func capitalizeFirstASCII(s string) string {
	trimmed := strings.TrimSpace(s)
	if trimmed == "" {
		return ""
	}
	if trimmed[0] >= 'a' && trimmed[0] <= 'z' {
		return strings.ToUpper(trimmed[:1]) + trimmed[1:]
	}
	return trimmed
}

func extractSpeakingMeaningFromPrompt(prompt string, explanation *string, reading string) string {
	trimmedPrompt := strings.TrimSpace(prompt)
	normReading := strings.ToLower(strings.TrimSpace(reading))

	if matches := trailingPromptParensRegex.FindStringSubmatch(trimmedPrompt); len(matches) >= 2 {
		inner := strings.TrimSpace(matches[1])
		if inner != "" && !containsJapaneseRune(inner) {
			if idx := strings.Index(inner, "="); idx >= 0 {
				lhs := strings.TrimSpace(inner[:idx])
				rhs := strings.TrimSpace(inner[idx+1:])
				if rhs != "" && (strings.EqualFold(lhs, normReading) || !strings.EqualFold(rhs, normReading)) {
					return capitalizeFirstASCII(rhs)
				}
				if lhs != "" && !strings.EqualFold(lhs, normReading) {
					return capitalizeFirstASCII(lhs)
				}
			} else if !strings.EqualFold(inner, normReading) {
				return capitalizeFirstASCII(inner)
			}
		}
	}

	for _, qm := range quotedSentenceRegex.FindAllStringSubmatch(trimmedPrompt, -1) {
		if len(qm) >= 2 {
			candidate := strings.TrimSpace(qm[1])
			if candidate != "" && !containsJapaneseRune(candidate) && !strings.EqualFold(candidate, normReading) {
				return capitalizeFirstASCII(candidate)
			}
		}
	}

	if explanation != nil {
		if em := explanationMeaningRegex.FindStringSubmatch(*explanation); len(em) >= 2 {
			candidate := strings.TrimSpace(em[1])
			if candidate != "" && !containsJapaneseRune(candidate) {
				return capitalizeFirstASCII(candidate)
			}
		}
	}

	return trimmedPrompt
}

func extractRomajiTokens(romaji string) []string {
	trimmed := strings.TrimSpace(romaji)
	if trimmed == "" {
		return nil
	}
	// Kanji entries store "reading • meaning" in romaji; keep only the reading side.
	if idx := strings.Index(trimmed, "•"); idx >= 0 {
		trimmed = trimmed[:idx]
	}
	parts := strings.FieldsFunc(strings.ToLower(trimmed), func(r rune) bool {
		return r < 'a' || r > 'z'
	})
	seen := make(map[string]struct{}, len(parts))
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		if p == "" {
			continue
		}
		if _, dup := seen[p]; dup {
			continue
		}
		seen[p] = struct{}{}
		out = append(out, p)
	}
	return out
}

func isQuotedRomajiSpoiler(quotedInner string, romajiTokens []string) bool {
	if len(romajiTokens) == 0 {
		return false
	}
	trimmed := strings.Trim(strings.TrimSpace(quotedInner), "!?.,;:")
	if trimmed == "" {
		return false
	}
	lower := strings.ToLower(trimmed)

	for _, tok := range romajiTokens {
		if lower == tok {
			return true
		}
		// Repeated single-vowel mnemonic like ("ii") for "i"
		if len(tok) == 1 && len(lower) >= 2 && strings.Trim(lower, tok) == "" {
			return true
		}
		// Hyphenated mnemonic cues like "TSU-nami", "fi-SHI-ng hook", "MO-nitor", "HA-ha"
		for _, word := range strings.Fields(trimmed) {
			if !strings.Contains(word, "-") {
				continue
			}
			for _, seg := range strings.Split(word, "-") {
				cleanSeg := strings.Trim(seg, "!?.,;:")
				if strings.EqualFold(cleanSeg, tok) {
					return true
				}
			}
		}
		// Uppercase prefix cue like "KEG" for "ke" or "MUU" for "mu"
		if len(tok) >= 2 && strings.HasPrefix(trimmed, strings.ToUpper(tok)) {
			return true
		}
	}
	return false
}

// stripSpoilerFromHint removes both the raw character glyph and quoted romaji spoilers
// (e.g., "a", "TSU-nami", "ZO", "KYO") from database-backed mnemonics before showing them as quiz hints.
func stripSpoilerFromHint(text string, answer string, romaji string) string {
	out := text
	if ans := strings.TrimSpace(answer); ans != "" {
		out = strings.ReplaceAll(out, ans, "huruf ini")
	}

	romajiTokens := extractRomajiTokens(romaji)
	if len(romajiTokens) == 0 {
		return strings.TrimSpace(out)
	}

	// 1. Remove parenthesized quoted romaji spoilers like ("MO-nitor") or ("ta").
	out = parenQuotedSpoilerRegex.ReplaceAllStringFunc(out, func(match string) string {
		sub := parenQuotedSpoilerRegex.FindStringSubmatch(match)
		if len(sub) >= 2 && isQuotedRomajiSpoiler(sub[1], romajiTokens) {
			return ""
		}
		return match
	})

	// 2. Remove trailing dash-prefixed quoted romaji spoilers like ` — "TSU-nami".`.
	out = dashQuotedSpoilerRegex.ReplaceAllStringFunc(out, func(match string) string {
		sub := dashQuotedSpoilerRegex.FindStringSubmatch(match)
		if len(sub) >= 3 && isQuotedRomajiSpoiler(sub[1], romajiTokens) {
			return strings.TrimSpace(sub[2])
		}
		return match
	})

	// 3. Replace remaining standalone quoted romaji spoilers like "ZO", "KYO", "a".
	out = quotedSentenceRegex.ReplaceAllStringFunc(out, func(match string) string {
		sub := quotedSentenceRegex.FindStringSubmatch(match)
		if len(sub) >= 2 && isQuotedRomajiSpoiler(sub[1], romajiTokens) {
			return "bunyi ini"
		}
		return match
	})

	out = multiSpaceRegex.ReplaceAllString(out, " ")
	out = spaceBeforePunctRegex.ReplaceAllString(out, "$1")
	return strings.TrimSpace(out)
}

func reconstructFillBlankWord(template string, selected string) string {
	replaced := strings.ReplaceAll(template, "[blank]", selected)
	replaced = anyParensRegex.ReplaceAllString(replaced, "")
	if idx := strings.Index(replaced, ":"); idx >= 0 {
		prefix := replaced[:idx]
		after := strings.TrimSpace(replaced[idx+1:])
		if !containsJapaneseRune(prefix) && after != "" {
			replaced = after
		}
	}
	return collapseSpacesBetweenJapanese(replaced)
}

func buildContextualHint(
	rawEx exercise.Exercise,
	sanitizedEx exercise.Exercise,
	romaji string,
	grammarPoints []GrammarContext,
	kanaCatalog map[string]KanaInfo,
) string {
	if rawEx.Hint != nil && strings.TrimSpace(*rawEx.Hint) != "" {
		return strings.TrimSpace(*rawEx.Hint)
	}
	content := rawEx.Content
	if jsonHint := contentString(content, "hint"); jsonHint != "" {
		return jsonHint
	}

	switch rawEx.ExerciseType {
	case exercise.ExerciseTypeFillBlank:
		selected := strings.TrimSpace(rawEx.CorrectAnswer)
		if info, ok := kanaCatalog[selected]; ok && strings.TrimSpace(info.Mnemonic) != "" {
			return fmt.Sprintf("Ingat bentuk hurufnya: %s", stripSpoilerFromHint(info.Mnemonic, selected, info.Romaji))
		}
		if trans := contentString(sanitizedEx.Content, "translation"); trans != "" && !exercise.IsFillBlankTranslationSpoiler(trans, rawEx.CorrectAnswer, content) {
			if len(grammarPoints) > 0 && strings.TrimSpace(grammarPoints[0].Formula) != "" {
				return fmt.Sprintf("Lengkapi bagian kosong untuk arti %q dengan pola: %s.", trans, grammarPoints[0].Formula)
			}
			return fmt.Sprintf("Cari huruf atau kata yang melengkapi arti: %q.", trans)
		}
		if len(grammarPoints) > 0 && strings.TrimSpace(grammarPoints[0].Title) != "" {
			return fmt.Sprintf("Perhatikan peran partikel atau pola %s di sekitar bagian kosong.", grammarPoints[0].Title)
		}
		return "Perhatikan kata sebelum dan sesudah bagian kosong, atau klik Intip Materi jika lupa."

	case exercise.ExerciseTypeSentenceBuilder:
		tokens := strings.Fields(rawEx.CorrectAnswer)
		if isSingleRuneSlice(tokens) && len(tokens) > 0 {
			if romaji != "" {
				return fmt.Sprintf("Susun tepat %d huruf sesuai pelafalan %q (abaikan huruf pengecoh).", len(tokens), romaji)
			}
			return fmt.Sprintf("Susun tepat %d huruf yang membentuk kata sesuai arti soal (abaikan huruf pengecoh).", len(tokens))
		}
		if len(tokens) > 0 {
			if containsJapaneseRune(rawEx.CorrectAnswer) {
				return fmt.Sprintf("Susun tepat %d potongan sesuai pola kalimat Jepang (topik/subjek di depan, predikat di akhir).", len(tokens))
			}
			return fmt.Sprintf("Susun tepat %d potongan kata sesuai urutan kalimat yang alami.", len(tokens))
		}
		if containsJapaneseRune(rawEx.CorrectAnswer) {
			return "Susun kata-kata inti sesuai urutan tata bahasa Jepang."
		}
		return "Susun kata-kata inti menjadi kalimat utuh yang tepat."

	case exercise.ExerciseTypeListeningChoice:
		audioText := contentString(content, "audio_text")
		kanaMnemonic := ""
		if info, ok := kanaCatalog[audioText]; ok && strings.TrimSpace(info.Mnemonic) != "" {
			kanaMnemonic = stripSpoilerFromHint(info.Mnemonic, audioText, info.Romaji)
		}
		grammarTitle := ""
		grammarFormula := ""
		if len(grammarPoints) > 0 {
			grammarTitle = strings.TrimSpace(grammarPoints[0].Title)
			grammarFormula = strings.TrimSpace(grammarPoints[0].Formula)
		}
		return exercise.BuildListeningContextualHint(rawEx, romaji, kanaMnemonic, grammarTitle, grammarFormula)

	case exercise.ExerciseTypeSpeakingRepeat:
		breakdown := contentStringSlice(content, "phonetic_breakdown")
		if len(breakdown) > 0 {
			return fmt.Sprintf("Ucapkan perlahan per suku kata: %s.", strings.Join(breakdown, " · "))
		}
		if romaji != "" {
			return fmt.Sprintf("Ikuti irama pelafalan: %s.", romaji)
		}
		return "Putar audio Normal satu kali, lalu tirukan pelafalannya dengan suara jelas."

	default:
		return "Gunakan tombol Intip Materi jika perlu mengingat kembali bacaan atau artinya."
	}
}

func extractStudyItemForExercise(
	idx int,
	rawEx exercise.Exercise,
	grammarPoints []GrammarContext,
	kanaCatalog map[string]KanaInfo,
) (Item, string, bool) {
	content := rawEx.Content
	romaji := contentString(content, "romaji")
	reading := contentString(content, "reading")

	switch rawEx.ExerciseType {
	case exercise.ExerciseTypeSentenceBuilder:
		tokens := strings.Fields(rawEx.CorrectAnswer)
		if len(tokens) == 0 {
			return Item{}, romaji, false
		}
		symbol := strings.Join(tokens, " ")
		speakText := symbol
		if containsJapaneseRune(symbol) {
			speakText = strings.Join(tokens, "")
		}
		if isSingleRuneSlice(tokens) && containsJapaneseRune(symbol) {
			symbol = speakText
		}
		meaning := contentString(content, "target_translation")
		if meaning == "" {
			meaning = strings.TrimSpace(rawEx.Prompt)
		}
		baseMeaning, parenReading := extractTrailingParen(meaning)
		if baseMeaning != "" && parenReading != "" {
			meaning = baseMeaning
		}
		resolvedReading := romaji
		if resolvedReading == "" {
			resolvedReading = reading
		}
		if resolvedReading == "" {
			resolvedReading = parenReading
		}
		if resolvedReading == "" {
			resolvedReading = exercise.KanaToRomaji(symbol)
		}
		if resolvedReading == "" {
			resolvedReading = "Susunan kata utuh"
		}

		mnemonic := ""
		if isSingleRuneSlice(tokens) {
			mnemonic = fmt.Sprintf("Tersusun dari %s — dengarkan bunyinya lalu susun huruf secara berurutan.", strings.Join(tokens, " + "))
		} else if len(grammarPoints) > 0 && strings.TrimSpace(grammarPoints[0].Formula) != "" {
			mnemonic = fmt.Sprintf("Mengikuti pola %s.", grammarPoints[0].Formula)
		} else {
			mnemonic = fmt.Sprintf("Rangkaian kalimat terdiri dari %d potongan kata utama.", len(tokens))
		}

		return Item{
			Symbol:             symbol,
			Reading:            resolvedReading,
			Meaning:            meaning,
			Mnemonic:           mnemonic,
			SpeakText:          speakText,
			FirstExerciseIndex: idx,
		}, resolvedReading, true

	case exercise.ExerciseTypeListeningChoice:
		audioText := contentString(content, "audio_text")
		if audioText == "" {
			return Item{}, romaji, false
		}
		meaning := resolveMatchedChoiceText(content, rawEx.Options, rawEx.CorrectAnswer)
		if meaning == "" {
			meaning = contentString(content, "translation")
		}
		if meaning == "" {
			meaning = strings.TrimSpace(rawEx.Prompt)
		}

		baseMeaning, parenReading := extractTrailingParen(meaning)
		if baseMeaning != "" && parenReading != "" {
			meaning = baseMeaning
		}
		resolvedReading := romaji
		if resolvedReading == "" {
			resolvedReading = reading
		}
		if resolvedReading == "" {
			resolvedReading = parenReading
		}
		mnemonic := ""
		if info, isKana := kanaCatalog[audioText]; isKana {
			if resolvedReading == "" {
				resolvedReading = info.Romaji
			}
			mnemonic = info.Mnemonic
		}
		if resolvedReading == "" {
			resolvedReading = exercise.KanaToRomaji(audioText)
		}
		if resolvedReading == "" {
			resolvedReading = "Pelafalan audio"
		}
		if mnemonic == "" {
			mnemonic = "Dengarkan audio Normal & 0.6x untuk membedakan suku kata awal dan panjang vokal."
		}

		return Item{
			Symbol:             audioText,
			Reading:            resolvedReading,
			Meaning:            meaning,
			Mnemonic:           mnemonic,
			SpeakText:          audioText,
			FirstExerciseIndex: idx,
		}, resolvedReading, true

	case exercise.ExerciseTypeFillBlank:
		selected := strings.TrimSpace(rawEx.CorrectAnswer)
		template := contentString(content, "sentence_template")
		translation := contentString(content, "translation")
		info, isKana := kanaCatalog[selected]

		lowerPrompt := strings.ToLower(rawEx.Prompt)
		lowerTemplate := strings.ToLower(template)
		isSingleKanaPrompt := isKana && (template == "" ||
			!containsJapaneseRune(strings.ReplaceAll(template, "[blank]", "")) ||
			strings.Contains(lowerPrompt, "huruf hiragana") ||
			strings.Contains(lowerPrompt, "huruf katakana") ||
			strings.Contains(lowerTemplate, "urutan") ||
			strings.Contains(template, "Pilihan huruf"))

		if isSingleKanaPrompt {
			resolvedReading := romaji
			if resolvedReading == "" {
				resolvedReading = reading
			}
			if resolvedReading == "" {
				resolvedReading = info.Romaji
			}
			meaning := translation
			if meaning == "" {
				meaning = fmt.Sprintf("Huruf \"%s\"", resolvedReading)
			}
			return Item{
				Symbol:             selected,
				Reading:            resolvedReading,
				Meaning:            meaning,
				Mnemonic:           info.Mnemonic,
				SpeakText:          selected,
				FirstExerciseIndex: idx,
			}, resolvedReading, true
		}

		symbol := selected
		if strings.Contains(template, "[blank]") && selected != "" {
			symbol = reconstructFillBlankWord(template, selected)
		}
		if symbol == "" || !containsJapaneseRune(symbol) {
			return Item{}, romaji, false
		}

		baseTranslation, parenTranslationReading := extractTrailingParen(translation)
		resolvedReading := romaji
		if resolvedReading == "" {
			resolvedReading = reading
		}
		if resolvedReading == "" {
			resolvedReading = parenTranslationReading
		}
		if resolvedReading == "" {
			_, paren := extractTrailingParen(template)
			resolvedReading = paren
		}
		if resolvedReading == "" {
			resolvedReading = exercise.KanaToRomaji(symbol)
		}
		if resolvedReading == "" {
			resolvedReading = "Kosakata kunci"
		}

		meaning := translation
		if baseTranslation != "" && parenTranslationReading != "" {
			meaning = baseTranslation
		}
		if meaning == "" {
			meaning = strings.TrimSpace(rawEx.Prompt)
		}
		mnemonic := ""
		if isKana && selected != "" {
			mnemonic = fmt.Sprintf("Huruf pelengkap \"%s\" (%s) membentuk kata utuh ini.", selected, info.Romaji)
		} else {
			mnemonic = "Perhatikan bentuk tulisan utuh dan cara bacanya sebelum melengkapi bagian kosong."
		}

		return Item{
			Symbol:             symbol,
			Reading:            resolvedReading,
			Meaning:            meaning,
			Mnemonic:           mnemonic,
			SpeakText:          symbol,
			FirstExerciseIndex: idx,
		}, resolvedReading, true

	case exercise.ExerciseTypeSpeakingRepeat:
		symbol := contentString(content, "display_text")
		if symbol == "" {
			symbol = contentString(content, "audio_text")
		}
		if symbol == "" {
			symbol = contentString(content, "phrase")
		}
		if symbol == "" {
			symbol = strings.TrimSpace(rawEx.CorrectAnswer)
		}
		if symbol == "" {
			return Item{}, romaji, false
		}
		resolvedReading := romaji
		meaning := contentString(content, "translation")
		if resolvedReading != "" {
			baseReading, parenMeaning := extractTrailingParen(resolvedReading)
			if baseReading != "" && parenMeaning != "" && meaning == "" {
				resolvedReading = baseReading
				if r, size := utf8.DecodeRuneInString(parenMeaning); r != utf8.RuneError && size > 0 {
					meaning = string(unicode.ToUpper(r)) + parenMeaning[size:]
				} else {
					meaning = parenMeaning
				}
			}
		}
		if resolvedReading == "" {
			resolvedReading = reading
		}
		if info, isKana := kanaCatalog[symbol]; isKana && resolvedReading == "" {
			resolvedReading = info.Romaji
		}
		if resolvedReading == "" {
			resolvedReading = exercise.KanaToRomaji(symbol)
		}
		if resolvedReading == "" {
			resolvedReading = "Latihan pelafalan"
		}
		if meaning == "" {
			meaning = extractSpeakingMeaningFromPrompt(rawEx.Prompt, rawEx.Explanation, resolvedReading)
		}

		breakdown := contentStringSlice(content, "phonetic_breakdown")
		mnemonic := "Tirukan pengucapan mengikuti audio Normal dan 0.6x hingga intonasinya tepat."
		if len(breakdown) > 0 {
			mnemonic = fmt.Sprintf("Pecah pengucapan menjadi: %s.", strings.Join(breakdown, " · "))
		}

		return Item{
			Symbol:             symbol,
			Reading:            resolvedReading,
			Meaning:            meaning,
			Mnemonic:           mnemonic,
			SpeakText:          symbol,
			FirstExerciseIndex: idx,
		}, resolvedReading, true

	default:
		word := contentString(content, "word")
		if word == "" {
			word = contentString(content, "japanese")
		}
		if word == "" {
			return Item{}, romaji, false
		}
		resolvedReading := reading
		if resolvedReading == "" {
			resolvedReading = romaji
		}
		if resolvedReading == "" {
			resolvedReading = exercise.KanaToRomaji(word)
		}
		if resolvedReading == "" {
			resolvedReading = "Kosakata kunci"
		}
		meaning := contentString(content, "translation")
		if meaning == "" {
			meaning = strings.TrimSpace(rawEx.Prompt)
		}
		return Item{
			Symbol:             word,
			Reading:            resolvedReading,
			Meaning:            meaning,
			Mnemonic:           "Pahami bentuk tulisan, bacaan, dan artinya sebelum mengerjakan soal.",
			SpeakText:          word,
			FirstExerciseIndex: idx,
		}, resolvedReading, true
	}
}

// BuildLessonStudyItemsAndHints builds distractor-free Item cards from unsanitized lesson exercises
// and populates spoiler-free contextual hints + furigana on sanitized exercises for non-checkpoint lessons.
func (s *service) BuildLessonStudyItemsAndHints(
	ctx context.Context,
	slug string,
	rawExercises []exercise.Exercise,
	sanitizedExercises []exercise.Exercise,
	grammarPoints []GrammarContext,
) []Item {
	if IsCheckpointLessonSlug(slug) {
		return []Item{}
	}

	kanaCatalog := s.kanaCache.getCatalog(ctx)
	items := make([]Item, 0, maxStudyItemsPerLesson)
	indexByKey := make(map[string]int, maxStudyItemsPerLesson)

	for i, rawEx := range rawExercises {
		item, resolvedRomaji, ok := extractStudyItemForExercise(i, rawEx, grammarPoints, kanaCatalog)

		if i < len(sanitizedExercises) {
			hint := buildContextualHint(rawEx, sanitizedExercises[i], resolvedRomaji, grammarPoints, kanaCatalog)
			if hint != "" {
				hintCopy := hint
				sanitizedExercises[i].Hint = &hintCopy
			}
			exercise.EnrichExerciseFurigana(rawEx, &sanitizedExercises[i])
		}

		if !ok {
			continue
		}

		key := normalizeStudyKey(item.Symbol)
		if key == "" {
			continue
		}

		if existingIdx, exists := indexByKey[key]; exists {
			if isWeakReading(items[existingIdx].Reading) && !isWeakReading(item.Reading) {
				items[existingIdx].Reading = item.Reading
			}
			if strings.HasPrefix(items[existingIdx].Mnemonic, "Dengarkan audio") && !strings.HasPrefix(item.Mnemonic, "Dengarkan audio") {
				items[existingIdx].Mnemonic = item.Mnemonic
			}
			continue
		}

		if len(items) >= maxStudyItemsPerLesson {
			continue
		}
		indexByKey[key] = len(items)
		items = append(items, item)
	}

	if len(items) == 0 && len(grammarPoints) > 0 {
		gp := grammarPoints[0]
		for _, ex := range gp.Examples {
			key := normalizeStudyKey(ex.JP)
			if key == "" {
				continue
			}
			if _, exists := indexByKey[key]; exists {
				continue
			}
			indexByKey[key] = len(items)
			items = append(items, Item{
				Symbol:             ex.JP,
				Reading:            ex.Reading,
				Meaning:            ex.ID,
				Mnemonic:           fmt.Sprintf("Contoh pola %s (%s).", gp.Title, gp.Formula),
				SpeakText:          ex.JP,
				FirstExerciseIndex: 0,
			})
			if len(items) >= 4 {
				break
			}
		}
	}

	return items
}
