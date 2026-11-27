package curriculum

import (
	"fmt"
	"regexp"
	"strings"
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
	explanationMeaningRegex   = regexp.MustCompile(`(?i)(?:bermakna|berarti)\s+"([^"]+)"`)
	anyParensRegex            = regexp.MustCompile(`\s*\([^)]*\)`)
)

type kanaMnemonicInfo struct {
	Romaji   string
	Mnemonic string
}

var kanaMnemonicMap = map[string]kanaMnemonicInfo{
	// Hiragana
	"あ": {Romaji: "a", Mnemonic: `Bentuk lengkungnya memutar bertangkai silang dari atas ke kanan bawah.`},
	"い": {Romaji: "i", Mnemonic: `Dua garis tegak sedikit melengkung berdiri berdampingan mirip angka 11.`},
	"う": {Romaji: "u", Mnemonic: `Satu lengkungan membulat menyamping dengan topi miring kecil di bagian atas.`},
	"え": {Romaji: "e", Mnemonic: `Garis zig-zag menyerupai angka 2 dengan satu garis miring kecil di atas.`},
	"お": {Romaji: "o", Mnemonic: `Garis silang memutar ke kanan bawah disertai satu titik terpisah di kanan atas.`},
	"か": {Romaji: "ka", Mnemonic: `Garis melengkung mirip bilah pedang pendek ditambah satu titik percikan di kanan.`},
	"き": {Romaji: "ki", Mnemonic: `Dua garis palang datar disilang batang miring menyerupai gigi anak kunci.`},
	"く": {Romaji: "ku", Mnemonic: `Satu sudut tunggal menyiku ke kiri seperti paruh burung yang terbuka.`},
	"け": {Romaji: "ke", Mnemonic: `Satu tiang tegak di kiri diikuti garis silang pendek dan kaki kanan melengkung.`},
	"こ": {Romaji: "ko", Mnemonic: `Dua garis datar pendek sejajar atas-bawah membentuk rongga terbuka ke kiri.`},
	"さ": {Romaji: "sa", Mnemonic: `Satu garis datar disilang batang miring lalu melengkung ke bawah seperti senyum.`},
	"し": {Romaji: "shi", Mnemonic: `Satu goresan tegak lurus lalu melengkung halus ke kanan seperti mata pancing.`},
	"す": {Romaji: "su", Mnemonic: `Palang datar dengan simpul kecil menggantung di tengah mirip gulungan tali.`},
	"せ": {Romaji: "se", Mnemonic: `Tiga garis bersilang membentuk lekukan seperti sandaran kursi santai.`},
	"そ": {Romaji: "so", Mnemonic: `Satu goresan zig-zag mengalir ke bawah lalu berbelok melengkung di bagian kaki.`},
	"た": {Romaji: "ta", Mnemonic: `Dua garis silang pendek di sisi kiri diikuti dua garis datar bertumpuk di sisi kanan.`},
	"ち": {Romaji: "chi", Mnemonic: `Garis datar pendek ditembus tiang miring yang membulat ke bawah mirip angka 5.`},
	"つ": {Romaji: "tsu", Mnemonic: `Satu lengkungan lebar menyapu ke bawah seperti ombak laut yang menggulung.`},
	"て": {Romaji: "te", Mnemonic: `Garis atas datar yang berbelok halus ke kanan membentuk lengkungan terbuka.`},
	"と": {Romaji: "to", Mnemonic: `Garis miring pendek di atas yang menancap pada lengkungan bulat seperti duri.`},
	"な": {Romaji: "na", Mnemonic: `Palang silang di kiri dengan satu titik atas dan simpul kecil di kanan bawah.`},
	"に": {Romaji: "ni", Mnemonic: `Tiang vertikal di kiri dengan dua garis datar pendek bertumpuk di sebelah kanan.`},
	"ぬ": {Romaji: "nu", Mnemonic: `Dua garis melingkar saling bertaut berakhir pada satu simpul kecil di kanan bawah.`},
	"ね": {Romaji: "ne", Mnemonic: `Tiang lurus di kiri berliku naik di sisi kanan dan ditutup satu simpul bawah.`},
	"の": {Romaji: "no", Mnemonic: `Satu tarikan melingkar penuh dari dalam keluar seperti gulungan obat nyamuk.`},
	"は": {Romaji: "ha", Mnemonic: `Tiang kiri tegak dengan satu palang datar kanan yang berakhir bersimpul di bawah.`},
	"ひ": {Romaji: "hi", Mnemonic: `Satu lengkungan dalam menyerupai mangkuk senyum terbuka dengan ekor naik ke atas.`},
	"ふ": {Romaji: "fu", Mnemonic: `Goresan tengah berombak diapit dua titik kecil di kanan kiri seperti puncak gunung.`},
	"へ": {Romaji: "he", Mnemonic: `Satu tarikan menanjak pendek lalu turun panjang menyerupai puncak atap miring.`},
	"ほ": {Romaji: "ho", Mnemonic: `Tiang kiri tegak dengan dua palang datar sejajar di kanan dan simpul di kaki.`},
	"ま": {Romaji: "ma", Mnemonic: `Dua garis palang datar sejajar ditembus satu tiang tengah yang bersimpul di bawah.`},
	"み": {Romaji: "mi", Mnemonic: `Goresan berputar membentuk simpul kiri lalu disilang lengkungan naik mirip angka 21.`},
	"む": {Romaji: "mu", Mnemonic: `Palang datar disilang lingkaran simpul melenting disertai satu titik terpisah di kanan atas.`},
	"め": {Romaji: "me", Mnemonic: `Dua garis menyilang membentuk lingkaran membulat polos tanpa simpul penutup.`},
	"も": {Romaji: "mo", Mnemonic: `Satu kail lengkung tegak ditembus dua garis datar sejajar di bagian badan.`},
	"や": {Romaji: "ya", Mnemonic: `Lengkungan lebar di kanan ditembus satu titik terpisah dan tiang miring ke kiri bawah.`},
	"ゆ": {Romaji: "yu", Mnemonic: `Tiang kiri pendek menyambung lingkaran besar memutar yang disilang batang tegak.`},
	"よ": {Romaji: "yo", Mnemonic: `Tiang tegak berpalang pendek ke kanan lalu membentuk satu simpul membulat di bawah.`},
	"ら": {Romaji: "ra", Mnemonic: `Titik miring di atas yang terpisah dari lengkungan besar membulat ke kanan bawah.`},
	"り": {Romaji: "ri", Mnemonic: `Dua batang vertikal sejajar, dengan batang kanan lebih panjang melengkung halus.`},
	"る": {Romaji: "ru", Mnemonic: `Satu tarikan mirip angka 3 dengan satu lingkaran simpul kecil di ujung ekornya.`},
	"れ": {Romaji: "re", Mnemonic: `Tiang lurus kiri disilang lengkungan tajam yang melenting ke luar arah kanan.`},
	"ろ": {Romaji: "ro", Mnemonic: `Satu tarikan mirip angka 3 polos yang terbuka bersih tanpa simpul di bagian ekor.`},
	"わ": {Romaji: "wa", Mnemonic: `Tiang lurus kiri disilang garis naik lalu melengkung lebar ke arah kanan bawah.`},
	"を": {Romaji: "o / wo", Mnemonic: `Palang atas miring bertemu tiang tengah lalu melangkahi lengkungan bawah.`},
	"ん": {Romaji: "n", Mnemonic: `Satu tarikan tunggal berkaki satu yang melengkung naik lalu turun di kanan.`},
	// Katakana
	"ア": {Romaji: "a", Mnemonic: `Sudut tajam terbuka di atas yang bertumpu pada satu goresan miring ke kiri bawah.`},
	"イ": {Romaji: "i", Mnemonic: `Satu sapuan miring pendek di atas dengan batang tegak lurus menurun di bawahnya.`},
	"ウ": {Romaji: "u", Mnemonic: `Satu titik tegak di atap garis datar yang membelok turun ke kiri bawah.`},
	"エ": {Romaji: "e", Mnemonic: `Dua garis datar sejajar atas-bawah yang dihubungkan satu tiang tegak di tengah.`},
	"オ": {Romaji: "o", Mnemonic: `Palang datar disilang batang tegak berkait kiri dengan satu garis miring di sudut kiri bawah.`},
	"カ": {Romaji: "ka", Mnemonic: `Satu palang berbelok siku tajam ke bawah disilang satu garis miring ke kiri.`},
	"キ": {Romaji: "ki", Mnemonic: `Dua palang datar bersudut tajam yang disilang satu batang miring di tengah.`},
	"ク": {Romaji: "ku", Mnemonic: `Satu sapuan pendek kiri atas menyambung atap pendek lalu melengkung miring ke kiri.`},
	"ケ": {Romaji: "ke", Mnemonic: `Satu garis miring pendek kiri diikuti atap datar dengan tiang melengkung ke kiri bawah.`},
	"コ": {Romaji: "ko", Mnemonic: `Dua sudut siku tajam terbuka menghadap ke kiri seperti kurung kotak terbuka.`},
	"サ": {Romaji: "sa", Mnemonic: `Palang datar disilang dua batang tegak, dengan batang kanan turun melengkung ke kiri.`},
	"シ": {Romaji: "shi", Mnemonic: `Dua titik vertikal berbaris di kiri + sapuan panjang naik dari bawah ke kanan atas.`},
	"ス": {Romaji: "su", Mnemonic: `Atap berbelok miring ke kiri bawah disertai satu kaki penyangga pendek ke kanan bawah.`},
	"セ": {Romaji: "se", Mnemonic: `Garis atas menyiku tajam yang ditopang satu garis lengkung dari bawah.`},
	"ソ": {Romaji: "so", Mnemonic: `Satu titik miring di kiri atas + satu sapuan panjang turun dari kanan atas ke kiri.`},
	"タ": {Romaji: "ta", Mnemonic: `Sudut miring ke kiri atas dengan palang pendek menyilang di bagian tengah badan.`},
	"チ": {Romaji: "chi", Mnemonic: `Atap miring pendek di atas palang datar yang ditembus batang melengkung ke kiri.`},
	"ツ": {Romaji: "tsu", Mnemonic: `Dua titik sejajar horizontal di atas + sapuan panjang turun dari kanan atas ke kiri.`},
	"テ": {Romaji: "te", Mnemonic: `Dua garis datar bertumpuk di atas dengan satu tiang tengah melengkung ke kiri bawah.`},
	"ト": {Romaji: "to", Mnemonic: `Satu batang tegak lurus dengan satu cabang pendek menonjol miring ke kanan.`},
	"ナ": {Romaji: "na", Mnemonic: `Palang horizontal lurus yang disilang satu sapuan melengkung ke kiri bawah.`},
	"ニ": {Romaji: "ni", Mnemonic: `Dua garis datar bersih sejajar atas-bawah tanpa batang penghubung.`},
	"ヌ": {Romaji: "nu", Mnemonic: `Garis menyudut turun ke kiri yang disilang satu titik goresan pendek di kanan bawah.`},
	"ネ": {Romaji: "ne", Mnemonic: `Titik kecil di puncak atap miring bertiang tegak dengan cabang pendek di kanan bawah.`},
	"ノ": {Romaji: "no", Mnemonic: `Satu goresan miring diagonal tajam dari kanan atas ke kiri bawah.`},
	"ハ": {Romaji: "ha", Mnemonic: `Dua goresan pendek terbuka ke kiri dan kanan seperti atap miring terpisah.`},
	"ヒ": {Romaji: "hi", Mnemonic: `Batang tegak berbelok sudut ke kanan bawah dengan satu garis pendek melintang ke atas.`},
	"フ": {Romaji: "fu", Mnemonic: `Satu goresan datar berbelok turun ke kiri bawah tanpa sudut tambahan.`},
	"ヘ": {Romaji: "he", Mnemonic: `Bentuk atap bersudut tajam menanjak pendek lalu menurun memanjang ke kanan.`},
	"ホ": {Romaji: "ho", Mnemonic: `Bentuk salib bertiang diapit dua titik cabang pendek di sisi kiri dan kanan.`},
	"マ": {Romaji: "ma", Mnemonic: `Garis datar membelok menyiku ke kiri diikuti satu goresan pendek di bagian ujung.`},
	"ミ": {Romaji: "mi", Mnemonic: `Tiga goresan pendek miring sejajar bertumpuk rapi seperti tiga cakaran diagonal.`},
	"ム": {Romaji: "mu", Mnemonic: `Garis sudut tajam turun ke kiri bawah yang ditutup satu goresan pendek di sudut kanan.`},
	"メ": {Romaji: "me", Mnemonic: `Satu sapuan miring kiri disilang sapuan pendek membentuk tanda silang tajam.`},
	"モ": {Romaji: "mo", Mnemonic: `Dua garis datar bertiang siku rata mendatar tanpa kait berlebih.`},
	"ヤ": {Romaji: "ya", Mnemonic: `Goresan menyiku ke kanan ditembus satu tiang panjang miring tanpa titik terpisah.`},
	"ユ": {Romaji: "yu", Mnemonic: `Garis siku atas berbelok turun bertumpu di atas satu garis alas horizontal panjang.`},
	"ヨ": {Romaji: "yo", Mnemonic: `Tiga garis mendatar terbuka ke kiri yang disatukan batang tegak di sebelah kanan.`},
	"ラ": {Romaji: "ra", Mnemonic: `Satu garis datar pendek di atas diikuti lengkungan siku menurun ke kiri bawah.`},
	"リ": {Romaji: "ri", Mnemonic: `Dua batang tegak bersisian, garis kanan turun memanjang melengkung ke kiri.`},
	"ル": {Romaji: "ru", Mnemonic: `Satu garis miring turun ke kiri diikuti batang tegak berbelok tajam ke kanan atas.`},
	"レ": {Romaji: "re", Mnemonic: `Satu tarikan vertikal yang melenting tajam ke kanan atas.`},
	"ロ": {Romaji: "ro", Mnemonic: `Bentuk kotak segi empat siku utuh tertutup rapat.`},
	"ワ": {Romaji: "wa", Mnemonic: `Tiang pendek kiri atas terhubung garis atas lalu melengkung turun membelok ke kiri.`},
	"ヲ": {Romaji: "o / wo", Mnemonic: `Dua garis datar atas dihubungkan kurva turun tajam di sisi kanan.`},
	"ン": {Romaji: "n", Mnemonic: `Satu titik di kiri atas + sapuan panjang naik dari kiri bawah ke kanan atas.`},
}

func isCheckpointLessonSlug(slug string) bool {
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

func stripSpoilerFromHint(text string, answer string) string {
	ans := strings.TrimSpace(answer)
	if ans == "" {
		return text
	}
	return strings.ReplaceAll(text, ans, "huruf ini")
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

func buildContextualHint(rawEx exercise.Exercise, sanitizedEx exercise.Exercise, romaji string, grammarPoints []GrammarPoint) string {
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
		if info, ok := kanaMnemonicMap[selected]; ok {
			return fmt.Sprintf("Ingat bentuk hurufnya: %s", stripSpoilerFromHint(info.Mnemonic, selected))
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
		if info, ok := kanaMnemonicMap[audioText]; ok {
			kanaMnemonic = info.Mnemonic
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

func extractStudyItemForExercise(idx int, rawEx exercise.Exercise, grammarPoints []GrammarPoint) (LessonStudyItem, string, bool) {
	content := rawEx.Content
	romaji := contentString(content, "romaji")
	reading := contentString(content, "reading")

	switch rawEx.ExerciseType {
	case exercise.ExerciseTypeSentenceBuilder:
		tokens := strings.Fields(rawEx.CorrectAnswer)
		if len(tokens) == 0 {
			return LessonStudyItem{}, romaji, false
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

		return LessonStudyItem{
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
			return LessonStudyItem{}, romaji, false
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
		if info, isKana := kanaMnemonicMap[audioText]; isKana {
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

		return LessonStudyItem{
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
		info, isKana := kanaMnemonicMap[selected]

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
			return LessonStudyItem{
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
			return LessonStudyItem{}, romaji, false
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

		return LessonStudyItem{
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
			return LessonStudyItem{}, romaji, false
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
		if info, isKana := kanaMnemonicMap[symbol]; isKana && resolvedReading == "" {
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

		return LessonStudyItem{
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
			return LessonStudyItem{}, romaji, false
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
		return LessonStudyItem{
			Symbol:             word,
			Reading:            resolvedReading,
			Meaning:            meaning,
			Mnemonic:           "Pahami bentuk tulisan, bacaan, dan artinya sebelum mengerjakan soal.",
			SpeakText:          word,
			FirstExerciseIndex: idx,
		}, resolvedReading, true
	}
}

// buildLessonStudyItemsAndHints builds distractor-free LessonStudyItem cards from unsanitized
// lesson exercises and populates spoiler-free contextual hints + furigana on sanitized exercises for non-checkpoint lessons.
func buildLessonStudyItemsAndHints(
	slug string,
	rawExercises []exercise.Exercise,
	sanitizedExercises []exercise.Exercise,
	grammarPoints []GrammarPoint,
) []LessonStudyItem {
	if isCheckpointLessonSlug(slug) {
		return []LessonStudyItem{}
	}

	items := make([]LessonStudyItem, 0, maxStudyItemsPerLesson)
	indexByKey := make(map[string]int, maxStudyItemsPerLesson)

	for i, rawEx := range rawExercises {
		item, resolvedRomaji, ok := extractStudyItemForExercise(i, rawEx, grammarPoints)

		if i < len(sanitizedExercises) {
			hint := buildContextualHint(rawEx, sanitizedExercises[i], resolvedRomaji, grammarPoints)
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
			items = append(items, LessonStudyItem{
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
