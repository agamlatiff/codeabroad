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
	// Longer phrases / compounds first
	"有難うございます", "ありがとうございます",
	"お大事に", "おだいじに",
	"お土産", "おみやげ",
	"お入り", "おはいり",
	"買い物", "かいもの",
	"会社員", "かいしゃいん",
	"図書館", "としょかん",
	"郵便局", "ゆうびんきょく",
	"日本語", "にほんご",
	"一万円", "いちまんえん",
	"見せなければ", "みせなければ",
	"忘れないで", "わすれないで",
	"行きましょう", "いきましょう",
	"読みます", "よみます",
	"買います", "かいます",
	"飲みます", "のみます",
	"食べます", "たべます",
	"行きます", "いきます",
	"見ます", "みます",
	"曲がって", "まがって",
	"明るくて", "あかるくて",
	"寒くない", "さむくない",
	"有難う", "ありがとう",
	"済みません", "すみません",
	"大好き", "だいすき",
	"友だち", "ともだち",
	"友達", "ともだち",
	"先生", "せんせい",
	"学生", "がくせい",
	"時間", "じかん",
	"仕事", "しごと",
	"家族", "かぞく",
	"学校", "がっこう",
	"映画", "えいが",
	"写真", "しゃしん",
	"本屋", "ほんや",
	"部屋", "へや",
	"眼鏡", "めがね",
	"食後", "しょくご",
	"将来", "しょうらい",
	"医者", "いしゃ",
	"京都", "きょうと",
	"東京", "とうきょう",
	"毎朝", "まいあさ",
	"毎日", "まいにち",
	"先週", "せんしゅう",
	"今週", "こんしゅう",
	"来週", "らいしゅう",
	"来年", "らいねん",
	"今年", "ことし",
	"昨日", "きのう",
	"今日", "きょう",
	"明日", "あした",
	"名前", "なまえ",
	"天気", "てんき",
	"元気", "げんき",
	"電話", "でんわ",
	"電車", "でんしゃ",
	"病院", "びょういん",
	"銀行", "ぎんこう",
	"信号", "しんごう",
	"心配", "しんぱい",
	"料理", "りょうり",
	"結婚", "けっこん",
	"旅行", "りょこう",
	"散歩", "さんぽ",
	"勉強", "べんきょう",
	"練習", "れんしゅう",
	"質問", "しつもん",
	"問題", "もんだい",
	"試験", "しけん",
	"一番", "いちばん",
	"一緒", "いっしょ",
	"一度", "いちど",
	"七時", "しちじ",
	"辞書", "じしょ",
	"日本", "にほん",
	"ご飯", "ごはん",
	"お菓子", "おかし",
	"青い", "あおい",
	"赤い", "あかい",
	"寒い", "さむい",
	"明るい", "あかるい",
	"広い", "ひろい",
	"痛い", "いたい",
	"好き", "すき",
	"行って", "いって",
	"言って", "いって",
	"持って", "もって",
	"降って", "ふって",
	"吸って", "すって",
	"入って", "はいって",
	"忘れて", "わすれて",
	"飲んで", "のんで",
	"見せて", "みせて",
	"撮って", "とって",
	"泳ぐ", "およぐ",
	"弾く", "ひく",
	"私", "わたし",
	"父", "ちち",
	"母", "はは",
	"本", "ほん",
	"店", "みせ",
	"何", "なに",
	"左", "ひだり",
	"右", "みぎ",
	"車", "くるま",
	"手", "て",
	"雨", "あめ",
	"庭", "にわ",
	"薬", "くすり",
	"百", "ひゃく",
	"頭", "あたま",
	"所", "ところ",
	"熱", "ねつ",
	"七", "しち",
	"円", "えん",
	"今", "いま",
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

var hiraganaDigraphRomaji = map[string]string{
	"きゃ": "kya", "きゅ": "kyu", "きょ": "kyo",
	"しゃ": "sha", "しゅ": "shu", "しょ": "sho",
	"ちゃ": "cha", "ちゅ": "chu", "ちょ": "cho",
	"にゃ": "nya", "にゅ": "nyu", "にょ": "nyo",
	"ひゃ": "hya", "ひゅ": "hyu", "ひょ": "hyo",
	"みゃ": "mya", "みゅ": "myu", "みょ": "myo",
	"りゃ": "rya", "りゅ": "ryu", "りょ": "ryo",
	"ぎゃ": "gya", "ぎゅ": "gyu", "ぎょ": "gyo",
	"じゃ": "ja", "じゅ": "ju", "じょ": "jo",
	"ぢゃ": "ja", "ぢゅ": "ju", "ぢょ": "jo",
	"びゃ": "bya", "びゅ": "byu", "びょ": "byo",
	"ぴゃ": "pya", "ぴゅ": "pyu", "ぴょ": "pyo",
}

var hiraganaMonographRomaji = map[rune]string{
	'あ': "a", 'い': "i", 'う': "u", 'え': "e", 'お': "o",
	'ぁ': "a", 'ぃ': "i", 'ぅ': "u", 'ぇ': "e", 'ぉ': "o",
	'か': "ka", 'き': "ki", 'く': "ku", 'け': "ke", 'こ': "ko",
	'さ': "sa", 'し': "shi", 'す': "su", 'せ': "se", 'そ': "so",
	'た': "ta", 'ち': "chi", 'つ': "tsu", 'て': "te", 'と': "to",
	'な': "na", 'に': "ni", 'ぬ': "nu", 'ね': "ne", 'の': "no",
	'は': "ha", 'ひ': "hi", 'ふ': "fu", 'へ': "he", 'ほ': "ho",
	'ま': "ma", 'み': "mi", 'む': "mu", 'め': "me", 'も': "mo",
	'や': "ya", 'ゆ': "yu", 'よ': "yo",
	'ゃ': "ya", 'ゅ': "yu", 'ょ': "yo",
	'ら': "ra", 'り': "ri", 'る': "ru", 'れ': "re", 'ろ': "ro",
	'わ': "wa", 'を': "o", 'ん': "n",
	'が': "ga", 'ぎ': "gi", 'ぐ': "gu", 'げ': "ge", 'ご': "go",
	'ざ': "za", 'じ': "ji", 'ず': "zu", 'ぜ': "ze", 'ぞ': "zo",
	'だ': "da", 'ぢ': "ji", 'づ': "zu", 'で': "de", 'ど': "do",
	'ば': "ba", 'び': "bi", 'ぶ': "bu", 'べ': "be", 'ぼ': "bo",
	'ぱ': "pa", 'ぴ': "pi", 'ぷ': "pu", 'ぺ': "pe", 'ぽ': "po",
	'ゔ': "vu",
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

func kanaToRomaji(raw string) string {
	folded := foldKatakanaAndKanjiSpeech(raw)
	runes := []rune(folded)
	var b strings.Builder
	b.Grow(len(runes) * 2)

	lastVowel := byte(0)
	updateLastVowel := func(seg string) {
		for k := len(seg) - 1; k >= 0; k-- {
			switch seg[k] {
			case 'a', 'i', 'u', 'e', 'o':
				lastVowel = seg[k]
				return
			}
		}
	}

	for i := 0; i < len(runes); {
		r := runes[i]
		if r == 'ー' {
			if lastVowel != 0 {
				b.WriteByte(lastVowel)
			}
			i++
			continue
		}
		if r == 'っ' {
			// Double initial consonant of following kana (use 't' before 'ch')
			var nextRomaji string
			if i+2 < len(runes) {
				if dg, ok := hiraganaDigraphRomaji[string(runes[i+1:i+3])]; ok {
					nextRomaji = dg
				}
			}
			if nextRomaji == "" && i+1 < len(runes) {
				nextRomaji = hiraganaMonographRomaji[runes[i+1]]
			}
			if len(nextRomaji) > 0 {
				first := nextRomaji[0]
				if first == 'c' {
					b.WriteByte('t')
				} else if first >= 'a' && first <= 'z' && first != 'a' && first != 'i' && first != 'u' && first != 'e' && first != 'o' {
					b.WriteByte(first)
				}
			}
			i++
			continue
		}
		if i+1 < len(runes) {
			if dg, ok := hiraganaDigraphRomaji[string(runes[i:i+2])]; ok {
				b.WriteString(dg)
				updateLastVowel(dg)
				i += 2
				continue
			}
		}
		if rom, ok := hiraganaMonographRomaji[r]; ok {
			b.WriteString(rom)
			updateLastVowel(rom)
			i++
			continue
		}
		b.WriteRune(r)
		if r == 'a' || r == 'i' || r == 'u' || r == 'e' || r == 'o' || r == 'A' || r == 'I' || r == 'U' || r == 'E' || r == 'O' {
			lastVowel = byte(unicode.ToLower(r))
		} else if unicode.IsSpace(r) {
			lastVowel = 0
		}
		i++
	}
	return b.String()
}

var romajiPhoneticReplacer = strings.NewReplacer(
	"ō", "o", "ū", "u", "ā", "a", "ī", "i", "ē", "e",
	"ou", "o", "oo", "o", "uu", "u", "aa", "a", "ee", "e",
	"si", "shi", "ti", "chi", "tu", "tsu", "hu", "fu",
	"zi", "ji", "di", "ji", "du", "zu",
	"wo", "o",
)

func normalizeRomajiPhonetics(raw string) string {
	cleaned := strings.TrimSpace(raw)
	if cleaned == "" {
		return ""
	}
	if parenIdx := strings.Index(cleaned, "("); parenIdx > 0 {
		noParen := strings.TrimSpace(cleaned[:parenIdx])
		if noParen != "" {
			cleaned = noParen
		}
	}
	cleaned = kanaToRomaji(cleaned)
	cleaned = strings.ToLower(cleaned)
	cleaned = comparablePunctuationReplacer.Replace(cleaned)
	cleaned = strings.ReplaceAll(cleaned, "-", " ")

	fields := strings.Fields(cleaned)
	for i, f := range fields {
		switch f {
		case "ha":
			fields[i] = "wa"
		case "he":
			fields[i] = "e"
		case "wo":
			fields[i] = "o"
		default:
			folded := romajiPhoneticReplacer.Replace(f)
			// Collapse any second pass long-vowel doubling inside the same word (e.g. "shingo" vs "shingoo")
			fields[i] = romajiPhoneticReplacer.Replace(folded)
		}
	}
	return strings.Join(fields, "")
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

	candidates := make([]string, 0, 14)
	candidates = append(candidates, normalizeSpeechCandidate(ex.CorrectAnswer)...)
	for _, acc := range ex.AcceptableAnswers {
		candidates = append(candidates, normalizeSpeechCandidate(acc)...)
	}
	if ex.Content != nil {
		for _, key := range []string{"display_text", "audio_text", "phrase", "romaji"} {
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

	userVariants := normalizeSpeechCandidate(userAnswer)
	for _, userVariant := range userVariants {
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

	// Phonetic romaji fallback comparing Kana/mapped-Kanji/Romaji across variants
	for _, userVariant := range userVariants {
		uPhonetic := normalizeRomajiPhonetics(userVariant)
		if uPhonetic == "" {
			continue
		}
		for _, cand := range candidates {
			cPhonetic := normalizeRomajiPhonetics(cand)
			if cPhonetic == "" {
				continue
			}
			if (utf8.RuneCountInString(uPhonetic) >= 2 && utf8.RuneCountInString(cPhonetic) >= 2 && uPhonetic == cPhonetic) ||
				(utf8.RuneCountInString(uPhonetic) == 1 && uPhonetic == cPhonetic) {
				return true
			}
		}
	}
	return false
}

func isFillBlankTranslationSpoiler(translation string, correctAnswer string, content map[string]any) bool {
	trimmedTrans := strings.TrimSpace(translation)
	if trimmedTrans == "" {
		return false
	}
	if correctAnswer != "" && strings.EqualFold(trimmedTrans, strings.TrimSpace(correctAnswer)) {
		return true
	}
	if content != nil {
		if rawOpts, ok := content["options"].([]any); ok {
			for _, rawOpt := range rawOpts {
				switch opt := rawOpt.(type) {
				case string:
					if strings.EqualFold(trimmedTrans, strings.TrimSpace(opt)) {
						return true
					}
				case map[string]any:
					if optText, ok := opt["text"].(string); ok && strings.EqualFold(trimmedTrans, strings.TrimSpace(optText)) {
						return true
					}
					if optID, ok := opt["id"].(string); ok && strings.EqualFold(trimmedTrans, strings.TrimSpace(optID)) {
						return true
					}
				}
			}
		} else if strOpts, ok := content["options"].([]string); ok {
			for _, opt := range strOpts {
				if strings.EqualFold(trimmedTrans, strings.TrimSpace(opt)) {
					return true
				}
			}
		}
	}
	if strings.HasPrefix(strings.ToLower(trimmedTrans), "huruf ") {
		return true
	}
	if !strings.Contains(trimmedTrans, " ") && correctAnswer != "" {
		transPhonetic := normalizeRomajiPhonetics(trimmedTrans)
		ansPhonetic := normalizeRomajiPhonetics(correctAnswer)
		if transPhonetic != "" && ansPhonetic != "" {
			if transPhonetic == ansPhonetic || (len(transPhonetic) >= 4 && strings.HasPrefix(ansPhonetic, transPhonetic)) {
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

