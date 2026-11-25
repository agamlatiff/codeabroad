package exercise

import (
	"fmt"
	"regexp"
	"strings"
	"unicode"
)

var (
	listeningParenRegex      = regexp.MustCompile(`\s*\([^)]*\)`)
	listeningParenAsciiRegex = regexp.MustCompile(`\([a-zA-Z][a-zA-Z\s'-]{0,24}\)`)
)

type furiganaDictEntry struct {
	kanji string
	kana  string
}

// Ordered longest-Kanji-first so multi-character compounds match before constituent single Kanji glyphs.
var n5FuriganaEntries = []furiganaDictEntry{
	// 4+ character compounds & phrases
	{"株式会社", "かぶしきがいしゃ"},
	{"一生懸命", "いっしょうけんめい"},
	{"頑張ります", "がんばります"},
	{"お願いします", "おねがいします"},
	{"忘れないで", "わすれないで"},
	{"寒くない", "さむくない"},
	{"働きたい", "はたらきたい"},
	{"働きます", "はたらきます"},
	{"お大事に", "おだいじに"},
	// 3 character compounds
	{"日本語", "にほんご"},
	{"図書館", "としょかん"},
	{"郵便局", "ゆうびんきょく"},
	{"会社員", "かいしゃいん"},
	{"一万円", "いちまんえん"},
	{"飛行機", "ひこうき"},
	{"新幹線", "しんかんせん"},
	{"喫茶店", "きっさてん"},
	{"誕生日", "たんじょうび"},
	{"日曜日", "にちようび"},
	{"月曜日", "げつようび"},
	{"火曜日", "かようび"},
	{"水曜日", "すいようび"},
	{"木曜日", "もくようび"},
	{"金曜日", "きんようび"},
	{"土曜日", "どようび"},
	{"富士山", "ふじさん"},
	{"動物園", "どうぶつえん"},
	{"お風呂", "おふろ"},
	{"お酒", "おさけ"},
	{"お土産", "おみやげ"},
	{"買い物", "かいもの"},
	{"読みます", "よみます"},
	{"買います", "かいます"},
	{"飲みます", "のみます"},
	{"食べます", "たべます"},
	{"行きます", "いきます"},
	{"来ます", "きます"},
	{"見ます", "みます"},
	{"書きます", "かきます"},
	{"聞きます", "ききます"},
	{"話します", "はなします"},
	{"休みます", "やすみます"},
	{"曲がって", "まがって"},
	{"手伝って", "てつだって"},
	{"送って", "おくって"},
	{"登った", "のぼった"},
	{"作った", "つくった"},
	{"疲れた", "つかれた"},
	{"歩いて", "あるいて"},
	{"止まる", "とまる"},
	{"起きる", "おきる"},
	{"遊ぶ", "あそぶ"},
	{"踊る", "おどる"},
	{"開ける", "あける"},
	{"終わる", "おわる"},
	{"慣れる", "なれる"},
	{"払う", "はらう"},
	{"取る", "とる"},
	{"知る", "しる"},
	{"住む", "すむ"},
	{"使う", "つかう"},
	{"歩く", "あるく"},
	{"寝る", "ねる"},
	{"明るい", "あかるい"},
	{"冷たい", "つめたい"},
	{"面白い", "おもしろい"},
	{"楽しい", "たのしい"},
	{"新しい", "あたらしい"},
	// 2 character compounds & adjectives
	{"友達", "ともだち"},
	{"先生", "せんせい"},
	{"学生", "がくせい"},
	{"時間", "じかん"},
	{"仕事", "しごと"},
	{"家族", "かぞく"},
	{"学校", "がっこう"},
	{"映画", "えいが"},
	{"写真", "しゃしん"},
	{"本屋", "ほんや"},
	{"部屋", "へや"},
	{"眼鏡", "めがね"},
	{"食後", "しょくご"},
	{"将来", "しょうらい"},
	{"医者", "いしゃ"},
	{"京都", "きょうと"},
	{"東京", "とうきょう"},
	{"大阪", "おおさか"},
	{"公園", "こうえん"},
	{"教室", "きょうしつ"},
	{"健康", "けんこう"},
	{"季節", "きせつ"},
	{"帽子", "ぼうし"},
	{"静か", "しずか"},
	{"毎朝", "まいあさ"},
	{"毎日", "まいにち"},
	{"今朝", "けさ"},
	{"先週", "せんしゅう"},
	{"今週", "こんしゅう"},
	{"来週", "らいしゅう"},
	{"来年", "らいねん"},
	{"今年", "ことし"},
	{"昨日", "きのう"},
	{"今日", "きょう"},
	{"明日", "あした"},
	{"午前", "ごぜん"},
	{"午後", "ごご"},
	{"名前", "なまえ"},
	{"天気", "てんき"},
	{"元気", "げんき"},
	{"電話", "でんわ"},
	{"電車", "でんしゃ"},
	{"病院", "びょういん"},
	{"銀行", "ぎんこう"},
	{"信号", "しんごう"},
	{"心配", "しんぱい"},
	{"料理", "りょうり"},
	{"掃除", "そうじ"},
	{"洗濯", "せんたく"},
	{"残業", "ざんぎょう"},
	{"上手", "じょうず"},
	{"親切", "しんせつ"},
	{"便利", "べんり"},
	{"有名", "ゆうめい"},
	{"田中", "たなか"},
	{"佐藤", "さとう"},
	{"一枚", "いちまい"},
	{"合格", "ごうかく"},
	{"禁煙", "きんえん"},
	{"荷物", "にもつ"},
	{"切符", "きっぷ"},
	{"趣味", "しゅみ"},
	{"生活", "せいかつ"},
	{"準備", "じゅんび"},
	{"能力", "のうりょく"},
	{"漢字", "かんじ"},
	{"風呂", "ふろ"},
	{"予定", "よてい"},
	{"安心", "あんしん"},
	{"結婚", "けっこん"},
	{"旅行", "りょこう"},
	{"散歩", "さんぽ"},
	{"勉強", "べんきょう"},
	{"練習", "れんしゅう"},
	{"質問", "しつもん"},
	{"問題", "もんだい"},
	{"試験", "しけん"},
	{"一番", "いちばん"},
	{"大好き", "だいすき"},
	{"一緒", "いっしょ"},
	{"一度", "いちど"},
	{"七時", "しちじ"},
	{"辞書", "じしょ"},
	{"音楽", "おんがく"},
	{"休み", "やすみ"},
	{"出口", "でぐち"},
	{"入口", "いりぐち"},
	{"空港", "くうこう"},
	{"大学", "だいがく"},
	{"外国", "がいこく"},
	{"中国", "ちゅうごく"},
	{"英語", "えいご"},
	{"日本", "にほん"},
	{"会社", "かいしゃ"},
	{"一人", "ひとり"},
	{"二人", "ふたり"},
	{"ご飯", "ごはん"},
	{"安い", "やすい"},
	{"高い", "たかい"},
	{"古い", "ふるい"},
	{"狭い", "せまい"},
	// Core 68 JLPT N5 single Kanji
	{"一", "いち"}, {"二", "に"}, {"三", "さん"}, {"四", "よん"}, {"五", "ご"},
	{"六", "ろく"}, {"七", "なな"}, {"八", "はち"}, {"九", "きゅう"}, {"十", "じゅう"},
	{"日", "ひ / にち"}, {"月", "つき / げつ"}, {"火", "ひ / か"}, {"水", "みず / すい"},
	{"木", "き / もく"}, {"金", "かね / きん"}, {"土", "つち / ど"},
	{"山", "やま"}, {"川", "かわ"}, {"田", "た"},
	{"人", "ひと / じん"}, {"子", "こ"}, {"女", "おんな"}, {"男", "おとこ"},
	{"母", "はは"}, {"父", "ちち"}, {"友", "とも"},
	{"上", "うえ"}, {"下", "した"}, {"中", "なか"}, {"大", "おお"}, {"小", "ちい"},
	{"学", "がく"}, {"生", "せい"}, {"先", "さき"}, {"年", "とし / ねん"},
	{"本", "ほん"}, {"国", "くに"}, {"外", "そと"}, {"駅", "えき"},
	{"店", "みせ"}, {"社", "しゃ"}, {"行", "いく"}, {"来", "くる"},
	{"食", "たべる"}, {"飲", "のむ"}, {"見", "みる"}, {"聞", "きく"},
	{"読", "よむ"}, {"書", "かく"}, {"話", "はなす"}, {"休", "やすむ"},
	{"百", "ひゃく"}, {"千", "せん"}, {"万", "まん"}, {"円", "えん"},
	{"時", "じ / とき"}, {"分", "ふん"}, {"名", "な"}, {"前", "まえ"},
	{"後", "うしろ / あと"}, {"右", "みぎ"}, {"左", "ひだり"}, {"校", "こう"},
	{"高", "たかい"}, {"安", "やすい"}, {"新", "あたらしい"}, {"古", "ふるい"},
	// Additional single N5 Kanji appearing in exercises & reading passages
	{"私", "わたし"}, {"車", "くるま"}, {"手", "て"}, {"雨", "あめ"},
	{"庭", "にわ"}, {"薬", "くすり"}, {"頭", "あたま"}, {"所", "ところ"},
	{"熱", "ねつ"}, {"今", "いま"}, {"何", "なに"}, {"犬", "いぬ"},
	{"猫", "ねこ"}, {"花", "はな"}, {"耳", "みみ"}, {"口", "くち"},
	{"足", "あし"}, {"体", "からだ"}, {"心", "こころ"}, {"海", "うみ"},
	{"空", "そら"}, {"冬", "ふゆ"}, {"夏", "なつ"}, {"秋", "あき"},
	{"春", "はる"}, {"朝", "あさ"}, {"夜", "よる"}, {"週", "しゅう"},
	{"服", "ふく"}, {"茶", "ちゃ"}, {"肉", "にく"}, {"魚", "さかな"},
	{"紙", "かみ"}, {"声", "こえ"}, {"顔", "かお"}, {"家", "いえ"},
	{"歌", "うた"}, {"絵", "え"}, {"色", "いろ"}, {"白", "しろ"},
	{"赤", "あか"}, {"青", "あお"}, {"黒", "くろ"}, {"好", "すき"},
	{"買", "かう"}, {"売", "うる"}, {"待", "まつ"}, {"持", "もつ"},
	{"立", "たつ"}, {"座", "すわる"}, {"入", "はいる"}, {"出", "でる"},
	{"帰", "かえる"}, {"泳", "およぐ"}, {"撮", "とる"}, {"教", "おしえる"},
	{"暗", "くらい"}, {"広", "ひろい"}, {"痛", "いたい"}, {"近", "ちかい"},
	{"遠", "とおい"}, {"早", "はやい"}, {"遅", "おそい"},
	{"働", "はたらく"}, {"町", "まち"}, {"桜", "さくら"}, {"暇", "ひま"},
	{"寝", "ねる"}, {"作", "つくる"}, {"登", "のぼる"}, {"降", "ふる"},
	{"送", "おくる"}, {"願", "ねがう"}, {"思", "おもう"}, {"楽", "たのしい"},
	{"枚", "まい"}, {"疲", "つかれる"}, {"靴", "くつ"}, {"緑", "みどり"},
	{"橋", "はし"}, {"歩", "あるく"}, {"止", "とまる"}, {"起", "おきる"},
	{"遊", "あそぶ"}, {"踊", "おどる"}, {"開", "あける"}, {"終", "おわる"},
	{"慣", "なれる"}, {"払", "はらう"}, {"取", "とる"}, {"知", "しる"},
	{"住", "すむ"}, {"使", "つかう"}, {"記", "き"}, {"音", "おと"},
	{"酒", "さけ"}, {"京", "きょう"}, {"事", "こと"}, {"仕", "し"},
	{"会", "かい"}, {"伝", "つたえる"}, {"佐", "さ"}, {"藤", "とう"},
	{"便", "べん"}, {"信", "しん"}, {"健", "けん"}, {"傘", "かさ"},
	{"備", "そなえる"}, {"元", "げん"}, {"写", "しゃ"}, {"冷", "つめたい"},
	{"切", "きる"}, {"利", "り"}, {"力", "ちから"}, {"勉", "べん"},
	{"医", "い"}, {"号", "ごう"}, {"合", "あう"}, {"吸", "すう"},
	{"呂", "ろ"}, {"味", "あじ"}, {"命", "いのち"}, {"回", "かい"},
	{"図", "ず"}, {"士", "し"}, {"天", "てん"}, {"字", "じ"},
	{"定", "てい"}, {"室", "しつ"}, {"富", "ふ"}, {"寒", "さむい"},
	{"将", "しょう"}, {"屋", "や"}, {"帽", "ぼう"}, {"度", "ど"},
	{"式", "しき"}, {"張", "はる"}, {"強", "つよい"}, {"弾", "ひく"},
	{"忘", "わすれる"}, {"懸", "けん"}, {"掃", "そう"}, {"散", "さん"},
	{"料", "りょう"}, {"族", "ぞく"}, {"明", "あかるい"}, {"映", "えい"},
	{"昨", "さく"}, {"曜", "よう"}, {"曲", "まがる"}, {"有", "ゆう"},
	{"株", "かぶ"}, {"格", "かく"}, {"業", "ぎょう"}, {"毎", "まい"},
	{"気", "き"}, {"洗", "あらう"}, {"活", "かつ"}, {"準", "じゅん"},
	{"漢", "かん"}, {"濯", "たく"}, {"煙", "けむり"}, {"物", "もの"},
	{"狭", "せまい"}, {"理", "り"}, {"産", "さん"}, {"画", "が"},
	{"番", "ばん"}, {"病", "びょう"}, {"目", "め"}, {"真", "しん"},
	{"眼", "め"}, {"着", "きる"}, {"禁", "きん"}, {"符", "ふ"},
	{"練", "れん"}, {"習", "しゅう"}, {"者", "もの"}, {"能", "のう"},
	{"英", "えい"}, {"荷", "に"}, {"菓", "か"}, {"親", "しん"},
	{"言", "いう"}, {"試", "し"}, {"語", "ご"}, {"趣", "しゅ"},
	{"辞", "じ"}, {"達", "たち"}, {"部", "ぶ"}, {"都", "と"},
	{"配", "ぱい"}, {"銀", "ぎん"}, {"鏡", "かがみ"}, {"間", "あいだ"},
	{"阪", "さか"}, {"院", "いん"}, {"除", "じょ"}, {"電", "でん"},
	{"静", "しずか"}, {"面", "おも"}, {"頑", "がん"}, {"風", "かぜ"},
	{"飯", "はん"}, {"館", "かん"}, {"験", "けん"},
}

func contentStringFromMap(content map[string]any, key string) string {
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

func contentStringSliceFromMap(content map[string]any, key string) []string {
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

func hasFuriganaArray(content map[string]any) bool {
	if content == nil {
		return false
	}
	raw, ok := content["furigana"]
	if !ok || raw == nil {
		return false
	}
	switch v := raw.(type) {
	case []any:
		return len(v) > 0
	case []map[string]any:
		return len(v) > 0
	case []map[string]string:
		return len(v) > 0
	default:
		return false
	}
}

func isKanjiReadingQuestion(prompt string) bool {
	lower := strings.ToLower(prompt)
	return strings.Contains(lower, "cara baca") ||
		strings.Contains(lower, "dibaca") ||
		strings.Contains(lower, "huruf kanji") ||
		strings.Contains(lower, "kanji yang berarti") ||
		strings.Contains(lower, "bacaan kanji")
}

func collectVisibleExerciseText(rawEx Exercise) string {
	content := rawEx.Content
	parts := []string{
		rawEx.Prompt,
		contentStringFromMap(content, "sentence_template"),
		contentStringFromMap(content, "passage"),
		contentStringFromMap(content, "display_text"),
		contentStringFromMap(content, "phrase"),
	}
	if rawEx.ExerciseType == ExerciseTypeSentenceBuilder {
		parts = append(parts, contentStringSliceFromMap(content, "tokens")...)
	}
	return strings.Join(parts, "\n")
}

// EnrichExerciseFurigana populates non-spoiler content["furigana"] readings for visible Kanji
// on student-safe lesson and SRS review exercises while skipping Kanji-reading quizzes and hidden listening audio_text.
func EnrichExerciseFurigana(rawEx Exercise, sanitized *Exercise) {
	if sanitized == nil || hasFuriganaArray(sanitized.Content) {
		return
	}
	if isKanjiReadingQuestion(rawEx.Prompt) {
		return
	}
	visibleText := collectVisibleExerciseText(rawEx)
	if strings.IndexFunc(visibleText, func(r rune) bool { return unicode.In(r, unicode.Han) }) < 0 {
		return
	}

	normalizedCorrect := strings.TrimSpace(rawEx.CorrectAnswer)
	remaining := visibleText
	seen := make(map[string]bool, 8)
	items := make([]map[string]string, 0, 8)

	for _, entry := range n5FuriganaEntries {
		if len(items) >= 8 {
			break
		}
		if seen[entry.kanji] || !strings.Contains(remaining, entry.kanji) {
			continue
		}
		if normalizedCorrect != "" && (strings.EqualFold(entry.kanji, normalizedCorrect) || strings.EqualFold(entry.kana, normalizedCorrect)) {
			remaining = strings.ReplaceAll(remaining, entry.kanji, " ")
			continue
		}
		seen[entry.kanji] = true
		items = append(items, map[string]string{
			"kanji": entry.kanji,
			"kana":  entry.kana,
		})
		// Blank out matched compound so its constituent single Kanji are not duplicated redundantly
		remaining = strings.ReplaceAll(remaining, entry.kanji, " ")
	}

	if len(items) == 0 {
		return
	}

	cloned := make(map[string]any, len(sanitized.Content)+1)
	for k, v := range sanitized.Content {
		cloned[k] = v
	}
	cloned["furigana"] = items
	sanitized.Content = cloned
}

func extractListeningOptionTexts(rawEx Exercise) []string {
	var out []string
	if rawEx.Content != nil {
		if rawOpts, ok := rawEx.Content["options"]; ok && rawOpts != nil {
			switch typed := rawOpts.(type) {
			case []string:
				for _, item := range typed {
					if t := strings.TrimSpace(item); t != "" {
						out = append(out, t)
					}
				}
			case []any:
				for _, item := range typed {
					switch val := item.(type) {
					case string:
						if t := strings.TrimSpace(val); t != "" {
							out = append(out, t)
						}
					case map[string]any:
						if t := contentStringFromMap(val, "text"); t != "" {
							out = append(out, t)
						} else if lbl := contentStringFromMap(val, "label"); lbl != "" {
							out = append(out, lbl)
						}
					case map[string]string:
						if t := strings.TrimSpace(val["text"]); t != "" {
							out = append(out, t)
						} else if lbl := strings.TrimSpace(val["label"]); lbl != "" {
							out = append(out, lbl)
						}
					}
				}
			}
		}
	}
	if len(out) == 0 && len(rawEx.Options) > 0 {
		for _, opt := range rawEx.Options {
			if t := strings.TrimSpace(opt); t != "" {
				out = append(out, t)
			}
		}
	}
	return out
}

func isJapaneseScriptRune(r rune) bool {
	return unicode.In(r, unicode.Hiragana, unicode.Katakana, unicode.Han) || r == 'ー'
}

func extractJapaneseScriptRunes(text string) []rune {
	cleaned := listeningParenRegex.ReplaceAllString(text, "")
	runes := make([]rune, 0, len(cleaned))
	for _, r := range cleaned {
		if isJapaneseScriptRune(r) {
			runes = append(runes, r)
		}
	}
	return runes
}

func optionsContainJapanese(optionTexts []string) bool {
	if len(optionTexts) == 0 {
		return false
	}
	jpCount := 0
	for _, opt := range optionTexts {
		if strings.IndexFunc(opt, func(r rune) bool {
			return unicode.In(r, unicode.Hiragana, unicode.Katakana, unicode.Han)
		}) >= 0 {
			jpCount++
		}
	}
	return jpCount*2 >= len(optionTexts)
}

func optionsContainSubstring(optionTexts []string, sub string) bool {
	needle := strings.ToLower(strings.TrimSpace(sub))
	if needle == "" {
		return false
	}
	for _, opt := range optionTexts {
		if strings.Contains(strings.ToLower(opt), needle) {
			return true
		}
	}
	return false
}

func optionsHaveParenRomaji(optionTexts []string) bool {
	for _, opt := range optionTexts {
		if listeningParenAsciiRegex.MatchString(opt) {
			return true
		}
	}
	return false
}

func resolveListeningComprehensionHint(promptLower string) string {
	switch {
	case strings.Contains(promptLower, "angka berapa") || strings.Contains(promptLower, "nomor berapa"):
		return "Fokus dengarkan penyebutan angka pada audio (gunakan 0.6x Pelan bila cepat), lalu cocokkan dengan bilangan di pilihan."
	case strings.Contains(promptLower, "siapakah") ||
		strings.Contains(promptLower, "siapa ") ||
		strings.Contains(promptLower, "nama pembicara") ||
		strings.Contains(promptLower, "nama orang"):
		return "Fokus dengarkan nama orang atau subjek pada audio (biasanya disebut sebelum partikel は atau です)."
	case strings.Contains(promptLower, "di mana") ||
		strings.Contains(promptLower, "dimana") ||
		strings.Contains(promptLower, "letak") ||
		strings.Contains(promptLower, "posisi"):
		return "Fokus dengarkan nama tempat dan kata penunjuk posisi (misalnya sebelah, dalam, atas, atau lantai) pada audio."
	case strings.Contains(promptLower, "kapan") ||
		strings.Contains(promptLower, "berapa lama") ||
		strings.Contains(promptLower, "jam berapa") ||
		strings.Contains(promptLower, "pukul berapa") ||
		strings.Contains(promptLower, "hari apa"):
		return "Fokus dengarkan keterangan waktu, hari, atau durasi bilangan (seperti jam, menit, atau besok) pada audio."
	case strings.Contains(promptLower, "mengapa") ||
		strings.Contains(promptLower, "kenapa") ||
		strings.Contains(promptLower, "alasan"):
		return "Fokus dengarkan bagian sebab-akibat yang sering ditandai kata penghubung alasan seperti から (karena) pada audio."
	case strings.Contains(promptLower, "ajakan") ||
		strings.Contains(promptLower, "diajak") ||
		strings.Contains(promptLower, "himbauan") ||
		strings.Contains(promptLower, "diminta") ||
		strings.Contains(promptLower, "permintaan"):
		return "Fokus dengarkan kata kerja utama dan akhiran ajakan/permintaan di akhir kalimat audio (mis. ～ませんか atau ～てください)."
	case strings.Contains(promptLower, "setelah") ||
		strings.Contains(promptLower, "urutan") ||
		strings.Contains(promptLower, "sedang dilakukan") ||
		strings.Contains(promptLower, "dilakukan"):
		return "Fokus dengarkan urutan kata kerja pada audio (bentuk ～て menandai kegiatan pertama diikuti aksi berikutnya)."
	case strings.Contains(promptLower, "pendapat") ||
		strings.Contains(promptLower, "penilaian") ||
		strings.Contains(promptLower, "perbandingan") ||
		strings.Contains(promptLower, "bagaimana"):
		return "Fokus dengarkan kata sifat utama atau dua hal yang dibandingkan pembicara pada audio."
	default:
		return ""
	}
}

// BuildListeningContextualHint generates a spoiler-free, context-aware hint tailored to
// listening question comprehension focus, script choices, or vocabulary meaning guesses.
func BuildListeningContextualHint(
	rawEx Exercise,
	_ string,
	kanaMnemonic string,
	grammarTitle string,
	grammarFormula string,
) string {
	promptLower := strings.ToLower(strings.TrimSpace(rawEx.Prompt))
	optionTexts := extractListeningOptionTexts(rawEx)
	audioText := contentStringFromMap(rawEx.Content, "audio_text")
	cleanJapaneseRunes := extractJapaneseScriptRunes(audioText)

	// Priority 1: Prompt-driven comprehension cues (siapa / di mana / kapan / alasan / urutan / pendapat / ajakan / angka)
	if cue := resolveListeningComprehensionHint(promptLower); cue != "" {
		if strings.TrimSpace(grammarFormula) != "" {
			return fmt.Sprintf("%s Perhatikan pola: %s.", cue, strings.TrimSpace(grammarFormula))
		}
		return cue
	}

	// Priority 2: Script/kana choice questions (options are written in Japanese script)
	if optionsContainJapanese(optionTexts) {
		if trimmedMnemonic := strings.TrimSpace(kanaMnemonic); trimmedMnemonic != "" {
			safeMnemonic := trimmedMnemonic
			if trimmedAudio := strings.TrimSpace(audioText); trimmedAudio != "" {
				safeMnemonic = strings.ReplaceAll(safeMnemonic, trimmedAudio, "huruf ini")
			}
			return fmt.Sprintf("Ingat ciri huruf yang terdengar di audio: %s", safeMnemonic)
		}
		if len(cleanJapaneseRunes) == 1 {
			return "Dengarkan bunyi huruf pada audio (putar 0.6x Pelan bila perlu), lalu cocokkan dengan aksara yang tepat."
		}
		if len(cleanJapaneseRunes) > 1 {
			return fmt.Sprintf("Dengarkan %d suku kata pada audio (putar 0.6x Pelan bila perlu), lalu cocokkan dengan aksara yang tepat.", len(cleanJapaneseRunes))
		}
		return "Dengarkan bunyi kata pada audio (putar 0.6x Pelan bila perlu), lalu cocokkan dengan penulisan aksaranya."
	}

	// Priority 3: Meaning / translation choices (options in Indonesian)
	if strings.TrimSpace(grammarTitle) != "" && strings.TrimSpace(grammarFormula) != "" {
		return fmt.Sprintf("Perhatikan pola %s (%s) yang terdengar pada kalimat audio, lalu cocokkan dengan artinya di pilihan.", strings.TrimSpace(grammarTitle), strings.TrimSpace(grammarFormula))
	}

	if len(cleanJapaneseRunes) >= 1 && len(cleanJapaneseRunes) <= 6 {
		firstChar := string(cleanJapaneseRunes[0])
		firstReading := KanaToRomaji(firstChar)
		if !optionsContainSubstring(optionTexts, firstChar) &&
			!optionsHaveParenRomaji(optionTexts) &&
			firstReading != "" &&
			!optionsContainSubstring(optionTexts, firstReading) {
			return fmt.Sprintf("Kata pada audio terdiri dari %d huruf diawali 「%s」 (bunyi awal %q) — hubungkan bunyi kata tersebut dengan artinya di Kartu Materi.", len(cleanJapaneseRunes), firstChar, firstReading)
		}
		if !optionsContainSubstring(optionTexts, firstChar) {
			return fmt.Sprintf("Kata pada audio terdiri dari %d huruf diawali 「%s」 — cocokkan kata yang terdengar dengan artinya yang sesuai di pilihan.", len(cleanJapaneseRunes), firstChar)
		}
		return fmt.Sprintf("Kata pada audio terdiri dari %d suku kata — putar 0.6x Pelan lalu cocokkan maknanya dengan Kartu Materi.", len(cleanJapaneseRunes))
	}

	if strings.Contains(promptLower, "salam") ||
		strings.Contains(promptLower, "sapaan") ||
		strings.Contains(promptLower, "terima kasih") ||
		strings.Contains(promptLower, "perkenalan") ||
		strings.Contains(promptLower, "ungkapan") ||
		strings.Contains(promptLower, "permisi") ||
		strings.Contains(promptLower, "maaf") {
		return "Kenali situasi sosial ungkapan pada audio (sapaan waktu, perkenalan, terima kasih, atau maaf), lalu pilih padanan artinya yang tepat."
	}

	return "Tangkap kata kunci utama (subjek, objek, atau kata kerja di akhir kalimat) pada audio untuk memilih makna yang paling sesuai."
}

// BuildFallbackSRSContextualHint generates a spoiler-free hint for exercises reviewed inside /review
// when no custom hint is stored on the row.
func BuildFallbackSRSContextualHint(rawEx Exercise) string {
	if rawEx.Hint != nil && strings.TrimSpace(*rawEx.Hint) != "" {
		return strings.TrimSpace(*rawEx.Hint)
	}
	content := rawEx.Content
	if jsonHint := contentStringFromMap(content, "hint"); jsonHint != "" {
		return jsonHint
	}

	switch rawEx.ExerciseType {
	case ExerciseTypeFillBlank:
		trans := contentStringFromMap(content, "translation")
		if trans != "" && !isFillBlankTranslationSpoiler(trans, rawEx.CorrectAnswer, content) {
			return fmt.Sprintf("Cari huruf atau kata yang melengkapi arti: %q.", trans)
		}
		return "Perhatikan konteks kata sebelum dan sesudah bagian kosong."

	case ExerciseTypeSentenceBuilder:
		tokens := strings.Fields(rawEx.CorrectAnswer)
		if isSingleRuneSlice(tokens) && len(tokens) > 0 {
			if romaji := contentStringFromMap(content, "romaji"); romaji != "" {
				return fmt.Sprintf("Susun tepat %d huruf sesuai pelafalan %q (abaikan huruf pengecoh).", len(tokens), romaji)
			}
			return fmt.Sprintf("Susun tepat %d huruf yang membentuk kata sesuai arti soal.", len(tokens))
		}
		if len(tokens) > 0 {
			return fmt.Sprintf("Susun tepat %d potongan sesuai pola kalimat Jepang (topik/subjek di depan, predikat di akhir).", len(tokens))
		}
		return "Susun kata-kata inti sesuai urutan tata bahasa Jepang."

	case ExerciseTypeListeningChoice:
		return BuildListeningContextualHint(rawEx, contentStringFromMap(content, "romaji"), "", "", "")

	case ExerciseTypeSpeakingRepeat:
		breakdown := contentStringSliceFromMap(content, "phonetic_breakdown")
		if len(breakdown) > 0 {
			return fmt.Sprintf("Ucapkan perlahan per suku kata: %s.", strings.Join(breakdown, " · "))
		}
		if romaji := contentStringFromMap(content, "romaji"); romaji != "" {
			return fmt.Sprintf("Ikuti irama pelafalan: %s.", romaji)
		}
		return "Putar audio Normal satu kali, lalu tirukan pelafalannya dengan suara jelas."

	default:
		return "Perhatikan pola kalimat dan kosakata kunci sebelum menjawab."
	}
}
