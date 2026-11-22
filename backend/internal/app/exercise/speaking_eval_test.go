package exercise

import (
	"context"
	"strings"
	"testing"
	"time"
)

func TestEvaluateExerciseAnswer_SpeakingRepeat(t *testing.T) {
	h := NewHelper()

	kaoEx := &Exercise{
		ExerciseType:  ExerciseTypeSpeakingRepeat,
		CorrectAnswer: "かお",
		Content: map[string]any{
			"display_text": "かお",
			"audio_text":   "かお",
			"romaji":       "kao (wajah)",
		},
	}

	for _, accepted := range []string{"かお", "カオ", "顔", "kao", "KAO"} {
		if !h.EvaluateExerciseAnswer(kaoEx, accepted) {
			t.Errorf("expected speaking_repeat kaoEx to accept %q", accepted)
		}
	}
	for _, rejected := range []string{"ねこ", "aoi", ""} {
		if h.EvaluateExerciseAnswer(kaoEx, rejected) {
			t.Errorf("expected speaking_repeat kaoEx to reject %q", rejected)
		}
	}

	vowelsEx := &Exercise{
		ExerciseType:  ExerciseTypeSpeakingRepeat,
		CorrectAnswer: "あいうえお",
		Content: map[string]any{
			"display_text":       "あいうえお",
			"romaji":             "a-i-u-e-o",
			"phonetic_breakdown": []any{"a", "i", "u", "e", "o"},
		},
	}
	for _, accepted := range []string{"あいうえお", "a i u e o", "aiueo", "a-i-u-e-o"} {
		if !h.EvaluateExerciseAnswer(vowelsEx, accepted) {
			t.Errorf("expected vowelsEx to accept %q", accepted)
		}
	}

	// Content using phrase (legacy exact_match/phrase schema fallback) + Kanji sentences
	phraseEx := &Exercise{
		ExerciseType:  ExerciseTypeSpeakingRepeat,
		CorrectAnswer: "これは辞書ですか。",
		Content: map[string]any{
			"phrase": "これは辞書ですか。",
			"romaji": "Kore wa jisho desu ka.",
		},
	}
	for _, accepted := range []string{
		"これは辞書ですか",
		"これはじしょですか",
		"コレハジショデスカ",
		"kore wa jisho desu ka",
	} {
		if !h.EvaluateExerciseAnswer(phraseEx, accepted) {
			t.Errorf("expected phraseEx to accept %q", accepted)
		}
	}
	if h.EvaluateExerciseAnswer(phraseEx, "これはねこですか") {
		t.Errorf("expected phraseEx to reject wrong noun sentence")
	}

	directionEx := &Exercise{
		ExerciseType:  ExerciseTypeSpeakingRepeat,
		CorrectAnswer: "信号 を 左 へ 曲がって ください",
		Content: map[string]any{
			"display_text": "信号 を 左 へ 曲がって ください",
			"audio_text":   "信号 を 左 へ 曲がって ください",
			"romaji":       "shingou o hidari e magatte kudasai",
		},
	}
	for _, accepted := range []string{
		"しんごうをひだりへまがってください",
		"信号 を 左 へ 曲がって ください",
		"shingo o hidari e magatte kudasai",
	} {
		if !h.EvaluateExerciseAnswer(directionEx, accepted) {
			t.Errorf("expected directionEx to accept %q", accepted)
		}
	}
	if h.EvaluateExerciseAnswer(directionEx, "パスポートをわすれないでください") {
		t.Errorf("expected directionEx to reject unrelated passport sentence")
	}

	passportEx := &Exercise{
		ExerciseType:  ExerciseTypeSpeakingRepeat,
		CorrectAnswer: "パスポート を 忘れないで ください",
		Content: map[string]any{
			"display_text": "パスポート を 忘れないで ください",
			"audio_text":   "パスポート を 忘れないで ください",
			"romaji":       "pasupooto o wasurenaide kudasai",
		},
	}
	for _, accepted := range []string{
		"パスポートを忘れないでください",
		"ぱすぽーとをわすれないでください",
		"pasupoto o wasurenaide kudasai",
	} {
		if !h.EvaluateExerciseAnswer(passportEx, accepted) {
			t.Errorf("expected passportEx to accept %q", accepted)
		}
	}

	// Readiness Exam #8: Chrome STT writes Kanji 日本/働 even when expected is Hiragana
	examSpeakingEx := &Exercise{
		ExerciseType:  ExerciseTypeSpeakingRepeat,
		CorrectAnswer: "にほんではたらきたいです",
		Content: map[string]any{
			"display_text": "にほんではたらきたいです",
			"romaji":       "Nihon de hatarakitai desu.",
		},
	}
	for _, accepted := range []string{
		"日本で働きたいです",
		"にほんではたらきたいです",
		"nihon de hatarakitai desu",
	} {
		if !h.EvaluateExerciseAnswer(examSpeakingEx, accepted) {
			t.Errorf("expected examSpeakingEx to accept %q", accepted)
		}
	}

	// Unspaced Chrome STT particle は/へ sentences
	tanakaEx := &Exercise{
		ExerciseType:  ExerciseTypeSpeakingRepeat,
		CorrectAnswer: "田中さん は 親切で やさしい です",
		Content: map[string]any{
			"display_text": "田中さん は 親切で やさしい です",
			"romaji":       "Tanaka-san wa shinsetsu de yasashii desu",
		},
	}
	if !h.EvaluateExerciseAnswer(tanakaEx, "たなかさんはしんせつでやさしいです") {
		t.Errorf("expected unspaced Hiragana transcript with particle ha to match Tanaka sentence")
	}

	noboruEx := &Exercise{
		ExerciseType:  ExerciseTypeSpeakingRepeat,
		CorrectAnswer: "日本 へ 行った ことが あります",
		Content: map[string]any{
			"display_text": "日本 へ 行った ことが あります",
			"romaji":       "Nihon e itta koto ga arimasu",
		},
	}
	if !h.EvaluateExerciseAnswer(noboruEx, "にほんへいったことがあります") {
		t.Errorf("expected unspaced Hiragana transcript with particle he to match Japan sentence")
	}

	// Hepburn mb/mp/mm normalization: gambarimasu vs がんばります
	ganbaruEx := &Exercise{
		ExerciseType:  ExerciseTypeSpeakingRepeat,
		CorrectAnswer: "一生懸命 頑張ります ので、よろしく お願いします",
		Content: map[string]any{
			"display_text": "一生懸命 頑張ります ので、よろしく お願いします",
			"romaji":       "isshoukenmei gambarimasu node, yoroshiku onegaishimasu",
		},
	}
	if !h.EvaluateExerciseAnswer(ganbaruEx, "いっしょうけんめいがんばりますのでよろしくおねがいします") {
		t.Errorf("expected unspaced gambarimasu transcript to match")
	}
	if !h.EvaluateExerciseAnswer(ganbaruEx, "isshoukenmei gambarimasu node yoroshiku onegaishimasu") {
		t.Errorf("expected romaji gambarimasu input to match")
	}

	// Guard against false positives on short words (< 6 phonetic chars) like はな vs わな
	hanaEx := &Exercise{
		ExerciseType:  ExerciseTypeSpeakingRepeat,
		CorrectAnswer: "はな",
		Content: map[string]any{
			"display_text": "はな",
			"romaji":       "hana",
		},
	}
	if h.EvaluateExerciseAnswer(hanaEx, "わな") {
		t.Errorf("expected short vocab はな to reject わな")
	}
}

func TestParseCorrectAnswerJSON_ExactMatch(t *testing.T) {
	got := ParseCorrectAnswerJSON([]byte(`{"exact_match": "これは辞書ですか。"}`))
	if got != "これは辞書ですか。" {
		t.Fatalf("ParseCorrectAnswerJSON = %q, want %q", got, "これは辞書ですか。")
	}
}

func TestSanitizeExercises_StripsFillBlankTranslationSpoilers(t *testing.T) {
	input := []Exercise{
		{
			ID:            "fb-exact-option",
			ExerciseType:  ExerciseTypeFillBlank,
			CorrectAnswer: "laki-laki",
			Content: map[string]any{
				"translation": "Laki-laki",
				"options":     []any{"laki-laki", "perempuan"},
			},
		},
		{
			ID:            "fb-romaji-desu",
			ExerciseType:  ExerciseTypeFillBlank,
			CorrectAnswer: "です",
			Content: map[string]any{
				"translation": "Desu",
				"options":     []any{"です", "ます"},
			},
		},
		{
			ID:            "fb-romaji-yokatta",
			ExerciseType:  ExerciseTypeFillBlank,
			CorrectAnswer: "よかったです",
			Content: map[string]any{
				"translation": "Yokatta",
				"options":     []any{"よかったです", "よくないです"},
			},
		},
		{
			ID:            "fb-huruf-prefix",
			ExerciseType:  ExerciseTypeFillBlank,
			CorrectAnswer: "る",
			Content: map[string]any{
				"translation": "Huruf RU",
				"options":     []any{"る", "ろ"},
			},
		},
		{
			ID:            "fb-partikel-de",
			ExerciseType:  ExerciseTypeFillBlank,
			CorrectAnswer: "で",
			Content: map[string]any{
				"translation": "Partikel DE",
				"options":     []any{"で", "に"},
			},
		},
		{
			ID:            "fb-partikel-wa",
			ExerciseType:  ExerciseTypeFillBlank,
			CorrectAnswer: "は",
			Content: map[string]any{
				"translation": "Partikel WA",
				"options":     []any{"は", "わ"},
			},
		},
		{
			ID:            "fb-kanji-spoiler",
			ExerciseType:  ExerciseTypeFillBlank,
			CorrectAnswer: "語",
			Content: map[string]any{
				"translation": "Kanji 語",
				"options":     []any{"語", "人"},
			},
		},
		{
			ID:            "fb-valid-kanji-nama",
			ExerciseType:  ExerciseTypeFillBlank,
			CorrectAnswer: "名",
			Content: map[string]any{
				"translation": "Kanji nama",
				"options":     []any{"名", "本"},
			},
		},
		{
			ID:            "fb-valid-single-indonesian",
			ExerciseType:  ExerciseTypeFillBlank,
			CorrectAnswer: "えき",
			Content: map[string]any{
				"translation": "Stasiun",
				"options":     []any{"えき", "いけ"},
			},
		},
		{
			ID:            "fb-valid-sentence",
			ExerciseType:  ExerciseTypeFillBlank,
			CorrectAnswer: "で",
			Content: map[string]any{
				"translation": "Membaca buku di perpustakaan",
				"options":     []any{"で", "に"},
			},
		},
	}

	got := SanitizeExercises(input)
	for i := 0; i < 7; i++ {
		if _, hasTrans := got[i].Content["translation"]; hasTrans {
			t.Errorf("expected spoiler translation to be stripped for %s, still got %v", got[i].ID, got[i].Content["translation"])
		}
	}
	if got[7].Content["translation"] != "Kanji nama" {
		t.Errorf("expected non-spoiler translation 'Kanji nama' to be preserved, got %v", got[7].Content["translation"])
	}
	if got[8].Content["translation"] != "Stasiun" {
		t.Errorf("expected valid Indonesian cue 'Stasiun' to be preserved, got %v", got[8].Content["translation"])
	}
	if got[9].Content["translation"] != "Membaca buku di perpustakaan" {
		t.Errorf("expected valid sentence translation to be preserved, got %v", got[9].Content["translation"])
	}
}

func TestEnrichExerciseFurigana_CoversExtendedN5Kanji(t *testing.T) {
	raw := Exercise{
		ID:            "ex-extended-kanji",
		ExerciseType:  ExerciseTypeFillBlank,
		Prompt:        "Lengkapi partikel untuk kalimat tentang Gunung Fuji:",
		CorrectAnswer: "に",
		Content: map[string]any{
			"sentence_template": "富士山 [blank] 登った ことが あります。",
			"options":           []any{"に", "を", "で", "へ"},
		},
	}
	sanitized := SanitizeExercises([]Exercise{raw})
	EnrichExerciseFurigana(raw, &sanitized[0])

	furi, ok := sanitized[0].Content["furigana"].([]map[string]string)
	if !ok || len(furi) == 0 {
		t.Fatalf("expected furigana entries on sanitized exercise, got %#v", sanitized[0].Content["furigana"])
	}
	hasFuji := false
	hasNobotta := false
	for _, entry := range furi {
		if entry["kanji"] == "富士山" && entry["kana"] == "ふじさん" {
			hasFuji = true
		}
		if entry["kanji"] == "登った" && entry["kana"] == "のぼった" {
			hasNobotta = true
		}
	}
	if !hasFuji || !hasNobotta {
		t.Fatalf("expected 富士山->ふじさん and 登った->のぼった in furigana, got %#v", furi)
	}
}

type stubTotalDueSRSRepo struct {
	reviews []UserSRSReview
}

func (s *stubTotalDueSRSRepo) GetDueReviews(ctx context.Context, userID string, now time.Time, limit int) ([]UserSRSReview, error) {
	return s.reviews, nil
}
func (s *stubTotalDueSRSRepo) GetDueReviewsWithTotal(ctx context.Context, userID string, now time.Time, limit int) ([]UserSRSReview, int, error) {
	return s.reviews, len(s.reviews), nil
}
func (s *stubTotalDueSRSRepo) GetReview(ctx context.Context, userID string, exerciseID string) (*UserSRSReview, error) {
	return nil, ErrReviewNotFound
}
func (s *stubTotalDueSRSRepo) UpsertReview(ctx context.Context, review *UserSRSReview) error {
	return nil
}
func (s *stubTotalDueSRSRepo) GetDueCount(ctx context.Context, userID string, now time.Time) (int, error) {
	return len(s.reviews), nil
}

func TestGetDueReviews_EnrichesFuriganaAndStripsSecrets(t *testing.T) {
	expl := "Saya belajar bahasa Jepang di perpustakaan."
	srsRepo := &stubTotalDueSRSRepo{
		reviews: []UserSRSReview{
			{
				ID:         "rev-1",
				UserID:     "user-1",
				ExerciseID: "ex-1",
				Exercise: &Exercise{
					ID:            "ex-1",
					ExerciseType:  ExerciseTypeFillBlank,
					Prompt:        "Lengkapi partikel untuk kalimat membaca di perpustakaan:",
					CorrectAnswer: "で",
					Explanation:   &expl,
					Content: map[string]any{
						"sentence_template": "図書館 [blank] 本を 読みます。",
						"translation":       "Partikel DE",
						"options":           []any{"で", "に", "を", "へ"},
					},
				},
			},
		},
	}

	uc := NewUsecase(nil, srsRepo, nil, nil, nil)
	res, err := uc.GetDueReviews(context.Background(), "user-1", 20)
	if err != nil {
		t.Fatalf("GetDueReviews failed: %v", err)
	}
	if len(res.Items) != 1 || res.Items[0].Exercise == nil {
		t.Fatalf("expected 1 review item with exercise, got %+v", res.Items)
	}

	ex := res.Items[0].Exercise
	if ex.CorrectAnswer != "" || ex.Explanation != nil {
		t.Fatalf("expected secrets stripped on SRS exercise, got correct=%q expl=%v", ex.CorrectAnswer, ex.Explanation)
	}
	if _, hasSpoilerTrans := ex.Content["translation"]; hasSpoilerTrans {
		t.Fatalf("expected spoiler translation stripped on SRS exercise, got %v", ex.Content["translation"])
	}
	furi, ok := ex.Content["furigana"].([]map[string]string)
	if !ok || len(furi) == 0 {
		t.Fatalf("expected dynamic furigana injected on SRS exercise, got %#v", ex.Content["furigana"])
	}
	if ex.Hint == nil || strings.TrimSpace(*ex.Hint) == "" {
		t.Fatalf("expected contextual fallback hint attached on SRS exercise")
	}
}

func TestEvaluateExerciseAnswer_SpeakingRepeatArabicNumbersAndKanjiSTT(t *testing.T) {
	h := NewHelper()

	cases := []struct {
		name     string
		expected string
		romaji   string
		sttInput string
	}{
		{"ichiman-en", "一万円です。", "Ichiman-en desu.", "1万円です"},
		{"hyaku-metoru", "百メートル泳ぐことができます。", "Hyaku meetoru oyogu koto ga dekimasu.", "100メートル泳ぐことができます"},
		{"shichiji-han", "いま しちじはん です", "ima shichiji-han desu", "今7時半です"},
		{"ichimai", "東京 まで 一枚 おねがいします", "Toukyou made ichimai onegaishimasu", "東京まで1枚お願いします"},
		{"ichido", "もう一度 言って ください", "mou ichido itte kudasai", "もう1度言ってください"},
		{"ichiban", "日本 の 料理 で すし が 一番 好き です", "Nihon no ryouri de sushi ga ichiban suki desu", "日本の料理で寿司が1番好きです"},
		{"digits-1-5", "いち、に、さん、よん、ご", "ichi, ni, san, yon, go", "12345"},
		{"digits-6-10", "ろく、なな、はち、きゅう、じゅう", "roku, nana, hachi, kyuu, juu", "678910"},
		{"digits-0812", "ぜろ はち いち に", "zero hachi ichi ni", "0812"},
		{"eki-chikaku", "えきのちかくにコンビニがありますか", "Eki no chikaku ni konbini ga arimasu ka.", "駅の近くにコンビニがありますか"},
		{"kinou-shiken", "きのうのしけんはすこしむずかしかったです", "Kinou no shiken wa sukoshi muzukashikatta desu.", "昨日の試験は少し難しかったです"},
		{"doyou-nichiyou", "どようびとにちようびはやすみです", "Doyoubi to nichiyoubi wa yasumi desu.", "土曜日と日曜日は休みです"},
		{"oshiete", "おしえてください", "Oshiete kudasai.", "教えてください"},
		{"enpitsu", "ノートとえんぴつをかいます", "Nooto to enpitsu o kaimasu.", "ノートと鉛筆を買います"},
		{"nan-desu-ka", "これ は なん ですか", "kore wa nan desu ka", "これは何ですか"},
		{"jlpt-n5", "わたし は JLPT N5 に 合格しました！ ありがとう ございました！", "watashi wa JLPT N5 ni goukakushimashita! arigatou gozaimashita!", "わたしはJLPT N5に合格しましたありがとうございました"},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			ex := &Exercise{
				ExerciseType:  ExerciseTypeSpeakingRepeat,
				CorrectAnswer: tc.expected,
				Content: map[string]any{
					"display_text": tc.expected,
					"audio_text":   tc.expected,
					"romaji":       tc.romaji,
				},
			}
			if !h.EvaluateExerciseAnswer(ex, tc.sttInput) {
				t.Errorf("expected speaking_repeat %q to accept Chrome STT transcript %q", tc.expected, tc.sttInput)
			}
		})
	}
}

func TestSanitizeExercises_StripsFillBlankSentenceTemplateSpoilers(t *testing.T) {
	input := []Exercise{
		{
			ID:            "tpl-spoiler-only",
			ExerciseType:  ExerciseTypeFillBlank,
			CorrectAnswer: "いそがしい",
			Content: map[string]any{
				"sentence_template": "[blank] (sibuk = isogashii)",
				"options":           []any{"いそがしい", "ひまな"},
			},
		},
		{
			ID:            "tpl-spoiler-with-context",
			ExerciseType:  ExerciseTypeFillBlank,
			CorrectAnswer: "こう",
			Content: map[string]any{
				"sentence_template": "くう [blank] (bandara = kuukou)",
				"options":           []any{"こう", "きょう"},
			},
		},
		{
			ID:            "tpl-safe-parenthetical",
			ExerciseType:  ExerciseTypeFillBlank,
			CorrectAnswer: "dilarang masuk",
			Content: map[string]any{
				"sentence_template": "Tanda: 立入禁止 (Tachiiri kinshi) = [blank]",
				"options":           []any{"dilarang masuk", "dilarang parkir"},
			},
		},
	}

	got := SanitizeExercises(input)
	if _, exists := got[0].Content["sentence_template"]; exists {
		t.Errorf("expected blank-only spoiler template to be removed, got %v", got[0].Content["sentence_template"])
	}
	if tpl, _ := got[1].Content["sentence_template"].(string); tpl != "くう [blank]" {
		t.Errorf("expected contextual template cleaned to 'くう [blank]', got %q", tpl)
	}
	if tpl, _ := got[2].Content["sentence_template"].(string); tpl != "Tanda: 立入禁止 (Tachiiri kinshi) = [blank]" {
		t.Errorf("expected non-spoiler parenthetical template preserved, got %q", tpl)
	}
}
