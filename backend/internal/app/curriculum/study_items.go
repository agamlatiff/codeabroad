package curriculum

import (
	"fmt"
	"regexp"
	"strings"
	"unicode"

	"merantalk/backend/internal/app/exercise"
)

const maxStudyItemsPerLesson = 8

var (
	checkpointSlugRegex = regexp.MustCompile(`(?i)checkpoint|spiral-test|musim-dan-suasana-kota|simulasi-akhir`)
	trailingParensRegex = regexp.MustCompile(`\(([^()]+)\)\s*$`)
	anyParensRegex      = regexp.MustCompile(`\s*\([^)]*\)`)
)

type kanaMnemonicInfo struct {
	Romaji   string
	Mnemonic string
}

var kanaMnemonicMap = map[string]kanaMnemonicInfo{
	// Hiragana
	"あ": {Romaji: "a", Mnemonic: `Bentuk lengkungnya memutar menyerupai huruf "a" bertangkai silang tanpa titik kanan.`},
	"い": {Romaji: "i", Mnemonic: `Dua garis tegak berdiri berdampingan mirip angka 11 ("ii").`},
	"う": {Romaji: "u", Mnemonic: `Lengkungan huruf "U" menyamping dengan topi miring kecil di atas.`},
	"え": {Romaji: "e", Mnemonic: `Mirip angka 2 zig-zag dengan tanda miring di atas.`},
	"お": {Romaji: "o", Mnemonic: `Memutar ke kanan bawah dan memiliki satu titik kecil terpisah di kanan atas.`},
	"か": {Romaji: "ka", Mnemonic: `Garis melengkung mirip pisau katana + satu titik percikan di kanan.`},
	"き": {Romaji: "ki", Mnemonic: `Dua garis palang disilang batang miring seperti kunci pintu.`},
	"く": {Romaji: "ku", Mnemonic: `Satu sudut menyiku ke kiri seperti paruh burung kukuk.`},
	"け": {Romaji: "ke", Mnemonic: `Satu tiang kiri + palang kanan mirip gagang tong kayu ("keg").`},
	"こ": {Romaji: "ko", Mnemonic: `Dua garis horizontal atas-bawah sejajar seperti tanda "ko" kotak terbuka.`},
	"さ": {Romaji: "sa", Mnemonic: `Satu garis datar disilang batang miring lalu melengkung ke bawah seperti senyum.`},
	"し": {Romaji: "shi", Mnemonic: `Satu goresan tegak lurus lalu melengkung ke kanan seperti mata pancing.`},
	"す": {Romaji: "su", Mnemonic: `Palang datar dengan lingkaran kecil menggantung di tengah mirip gulungan sushi.`},
	"せ": {Romaji: "se", Mnemonic: `Tiga garis bersilang mirip kursi santai tempat duduk ("seat").`},
	"そ": {Romaji: "so", Mnemonic: `Satu goresan zig-zag mengalir ke bawah dari huruf Z lalu melengkung.`},
	"た": {Romaji: "ta", Mnemonic: `Sisi kiri mirip huruf "t", sisi kanan berbentuk sama dengan "こ".`},
	"ち": {Romaji: "chi", Mnemonic: `Mirip angka 5 yang ditarik miring dari kanan.`},
	"つ": {Romaji: "tsu", Mnemonic: `Satu lengkungan lebar seperti ombak tsunami yang menggulung.`},
	"て": {Romaji: "te", Mnemonic: `Garis atas datar berbelok halus membentuk huruf "T" / telapak tangan.`},
	"と": {Romaji: "to", Mnemonic: `Garis vertikal menyamping yang menancap pada lengkungan seperti duri ("thorn").`},
	"な": {Romaji: "na", Mnemonic: `Palang silang di kiri dengan simpul kecil menggantung di kanan bawah.`},
	"に": {Romaji: "ni", Mnemonic: `Tiang vertikal di kiri dengan dua garis pendek di kanan (lutut = "knee").`},
	"ぬ": {Romaji: "nu", Mnemonic: `Dua garis melingkar rumit seperti simpul mi ("noodle") berakhir berputar.`},
	"ね": {Romaji: "ne", Mnemonic: `Tiang lurus di kiri berliku membentuk simpul seperti ekor kucing ("neko").`},
	"の": {Romaji: "no", Mnemonic: `Satu lingkaran memutar seperti rambu "No" atau gulungan obat nyamuk.`},
	"は": {Romaji: "ha", Mnemonic: `Tiang kiri tegak + garis kanan bersimpul di bawah seperti tawa "ha-ha".`},
	"ひ": {Romaji: "hi", Mnemonic: `Satu lengkungan lebar terbuka di atas seperti senyum lebar ("hi!").`},
	"ふ": {Romaji: "fu", Mnemonic: `Garis tengah melengkung diapit dua titik di kanan kiri seperti Gunung Fuji.`},
	"へ": {Romaji: "he", Mnemonic: `Satu garis menanjak lalu turun tajam menyerupai atap puncak bukit.`},
	"ほ": {Romaji: "ho", Mnemonic: `Mirip は, namun memiliki dua palang datar di kanan ("ho-ho").`},
	"ま": {Romaji: "ma", Mnemonic: `Dua garis palang datar ditembus tiang bersimpul di bawah ("mama").`},
	"み": {Romaji: "mi", Mnemonic: `Garis miring melingkar berakhiran garis melintang seperti angka 21 ("mi").`},
	"む": {Romaji: "mu", Mnemonic: `Palang melengkung bersimpul dengan titik di kanan atas seperti moncong sapi ("moo").`},
	"め": {Romaji: "me", Mnemonic: `Dua garis menyilang membulat polos tanpa simpul ekor (mata = "me").`},
	"も": {Romaji: "mo", Mnemonic: `Kail panjang memancing cacing dengan dua garis umpan mendatar ("more").`},
	"や": {Romaji: "ya", Mnemonic: `Lengkungan lebar ditembus garis pendek dan tiang miring seperti tanduk yak.`},
	"ゆ": {Romaji: "yu", Mnemonic: `Lingkaran besar bertiang seperti ikan mas atau lambang pemandian air panas.`},
	"よ": {Romaji: "yo", Mnemonic: `Tiang tegak berpalang pendek kanan lalu membentuk lingkaran simpul di bawah.`},
	"ら": {Romaji: "ra", Mnemonic: `Titik atas terpisah dengan lengkungan membulat besar di bawahnya.`},
	"り": {Romaji: "ri", Mnemonic: `Dua batang vertikal sejajar, batang kanan lebih panjang melengkung halus.`},
	"る": {Romaji: "ru", Mnemonic: `Satu tarikan dari angka 3 yang berakhiran lingkaran simpul kecil di bawah.`},
	"れ": {Romaji: "re", Mnemonic: `Tiang lurus kiri disilang lengkungan yang melenting tajam ke kanan.`},
	"ろ": {Romaji: "ro", Mnemonic: `Mirip angka 3 polos terbuka tanpa simpul penutup di bagian ekor.`},
	"わ": {Romaji: "wa", Mnemonic: `Tiang lurus kiri disilang garis yang melengkung lebar memutar ke kanan bawah.`},
	"を": {Romaji: "o / wo", Mnemonic: `Bentuk seperti orang melompati rintangan huruf C.`},
	"ん": {Romaji: "n", Mnemonic: `Satu tarikan yang sangat menyerupai huruf latin kecil "n" atau "h".`},
	// Katakana
	"ア": {Romaji: "a", Mnemonic: `Sudut tajam atas yang bertumpu pada satu goresan miring ke kiri seperti kapak.`},
	"イ": {Romaji: "i", Mnemonic: `Dua goresan miring-tegak mirip kuda-kuda penyangga ("easel").`},
	"ウ": {Romaji: "u", Mnemonic: `Bentuk kotak tajam terbuka ke bawah dengan satu garis pendek tegak di atas.`},
	"エ": {Romaji: "e", Mnemonic: `Dua garis datar dihubungkan batang tengah tegak seperti huruf I kapital / eskalator.`},
	"オ": {Romaji: "o", Mnemonic: `Tanda tambah bersudut tajam dengan goresan miring ke kiri bawah.`},
	"カ": {Romaji: "ka", Mnemonic: `Dua goresan tajam siku kanan mirip versi tegas Hiragana か tanpa titik.`},
	"キ": {Romaji: "ki", Mnemonic: `Dua palang datar sejajar disilang satu garis miring tajam seperti kunci.`},
	"ク": {Romaji: "ku", Mnemonic: `Dua garis pendek menyudut ke kiri seperti paruh tajam ("kuku").`},
	"ケ": {Romaji: "ke", Mnemonic: `Menyerupai huruf K yang agak miring atau atap menyiku.`},
	"コ": {Romaji: "ko", Mnemonic: `Kurung siku kotak menghadap kiri ("korner").`},
	"サ": {Romaji: "sa", Mnemonic: `Palang datar disilang dua tiang, tiang kanan lebih panjang melengkung ke kiri.`},
	"シ": {Romaji: "shi", Mnemonic: `Dua titik vertikal berbaris + sapuan panjang naik dari bawah ke kanan atas.`},
	"ス": {Romaji: "su", Mnemonic: `Garis miring menyiku tajam dengan kaki penyangga ke kanan bawah.`},
	"セ": {Romaji: "se", Mnemonic: `Palang sudut tajam ditembus garis siku huruf L dari bawah.`},
	"ソ": {Romaji: "so", Mnemonic: `Satu titik kecil di kiri + garis miring turun tajam dari kanan atas.`},
	"タ": {Romaji: "ta", Mnemonic: `Lengkungan tajam bersudut disilang garis pendek melintang di tengahnya.`},
	"チ": {Romaji: "chi", Mnemonic: `Garis atas miring, palang tengah lebar, disilang batang yang melengkung ke kiri.`},
	"ツ": {Romaji: "tsu", Mnemonic: `Dua titik sejajar di atas + sapuan panjang turun dari kanan atas ke kiri bawah.`},
	"テ": {Romaji: "te", Mnemonic: `Dua garis datar atas (garis kedua lebih panjang) bertumpu di batang melengkung.`},
	"ト": {Romaji: "to", Mnemonic: `Tiang tegak lurus dengan satu cabang menonjol miring ke kanan ("totem").`},
	"ナ": {Romaji: "na", Mnemonic: `Palang horizontal disilang batang yang melengkung ke kiri bawah.`},
	"ニ": {Romaji: "ni", Mnemonic: `Dua garis datar sejajar atas-bawah (mirip angka 2 / kanji 二).`},
	"ヌ": {Romaji: "nu", Mnemonic: `Garis menyudut disilang sapuan miring ke kanan bawah.`},
	"ネ": {Romaji: "ne", Mnemonic: `Titik atas + sudut tajam dengan batang tegak dan cabang pendek ke kanan.`},
	"ノ": {Romaji: "no", Mnemonic: `Satu goresan miring diagonal tajam dari kanan atas ke kiri bawah.`},
	"ハ": {Romaji: "ha", Mnemonic: `Dua goresan miring menjauh ke kiri dan kanan seperti atap/kumis ("ha!").`},
	"ヒ": {Romaji: "hi", Mnemonic: `Batang tegak berbelok ke kanan dengan palang pendek melintang ke kanan atas.`},
	"フ": {Romaji: "fu", Mnemonic: `Satu goresan datar berbelok turun ke kiri bawah tanpa sudut tambahan.`},
	"ヘ": {Romaji: "he", Mnemonic: `Bentuknya identik dengan Hiragana へ, lebih tegas bersudut tajam.`},
	"ホ": {Romaji: "ho", Mnemonic: `Bentuk salib/tanda tambah bertiang diapit dua titik cabang di kanan dan kiri.`},
	"マ": {Romaji: "ma", Mnemonic: `Garis datar membelok ke kiri diikuti satu goresan pendek menyentuh di bawah.`},
	"ミ": {Romaji: "mi", Mnemonic: `Tiga goresan pendek sejajar miring seperti cakar tiga baris ("mi-au").`},
	"ム": {Romaji: "mu", Mnemonic: `Sudut segitiga miring ke kiri yang ditutup goresan pendek di kanan.`},
	"メ": {Romaji: "me", Mnemonic: `Satu sapuan miring kiri disilang sapuan pendek membentuk tanda silang.`},
	"モ": {Romaji: "mo", Mnemonic: `Dua garis datar bertiang siku rata mendatar tanpa kait berlebih.`},
	"ヤ": {Romaji: "ya", Mnemonic: `Versi tajam dari Hiragana や tanpa titik di sampingnya.`},
	"ユ": {Romaji: "yu", Mnemonic: `Kotak berbelok tajam dengan garis alas panjang seperti huruf U terbalik.`},
	"ヨ": {Romaji: "yo", Mnemonic: `Tiga garis mendatar bersambung oleh batang tegak di sebelah kanan (huruf E terbalik).`},
	"ラ": {Romaji: "ra", Mnemonic: `Garis pendek di atas + sudut membelok ke bawah seperti pelari.`},
	"リ": {Romaji: "ri", Mnemonic: `Dua batang tegak bersisian, garis kanan turun memanjang ke kiri.`},
	"ル": {Romaji: "ru", Mnemonic: `Satu garis miring turun ke kiri dan satu batang siku membelok ke kanan.`},
	"レ": {Romaji: "re", Mnemonic: `Satu tarikan vertikal yang melenting tajam ke kanan atas.`},
	"ロ": {Romaji: "ro", Mnemonic: `Bentuk kotak segi empat utuh tertutup ("room").`},
	"ワ": {Romaji: "wa", Mnemonic: `Tiang pendek kiri atas terhubung garis atas lalu melengkung turun membelok.`},
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
		lower == "susunan kalimat utuh"
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

func buildContextualHint(rawEx exercise.Exercise, romaji string, grammarPoints []GrammarPoint) string {
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
		if trans := contentString(content, "translation"); trans != "" {
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
			return fmt.Sprintf("Susun tepat %d potongan sesuai pola kalimat Jepang (topik/subjek di depan, predikat di akhir).", len(tokens))
		}
		return "Susun kata-kata inti sesuai urutan tata bahasa Jepang."

	case exercise.ExerciseTypeListeningChoice:
		return "Dengarkan suku kata awal dan panjang bunyi pada audio, lalu cocokkan dengan artinya (gunakan Intip Materi untuk suara 0.6x)."

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
		speakText := strings.Join(tokens, "")
		if isSingleRuneSlice(tokens) {
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
				meaning = strings.ToUpper(parenMeaning[:1]) + parenMeaning[1:]
			}
		}
		if resolvedReading == "" {
			resolvedReading = reading
		}
		if info, isKana := kanaMnemonicMap[symbol]; isKana && resolvedReading == "" {
			resolvedReading = info.Romaji
		}
		if resolvedReading == "" {
			resolvedReading = "Latihan pelafalan"
		}
		if meaning == "" {
			meaning = strings.TrimSpace(rawEx.Prompt)
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
// lesson exercises and populates spoiler-free contextual hints on sanitized exercises for non-checkpoint lessons.
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
			hint := buildContextualHint(rawEx, resolvedRomaji, grammarPoints)
			if hint != "" {
				hintCopy := hint
				sanitizedExercises[i].Hint = &hintCopy
			}
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
