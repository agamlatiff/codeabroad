package exercise

import (
	"strings"
	"testing"
)

func TestEvaluateExerciseAnswer_WritingTrace(t *testing.T) {
	h := NewHelper()

	hiraganaEx := &Exercise{
		ID:                "wt-hiragana-a",
		ExerciseType:      ExerciseTypeWritingTrace,
		CorrectAnswer:     "あ",
		AcceptableAnswers: []string{"あ"},
		Content: map[string]any{
			"target_character": "あ",
			"script":           "hiragana",
			"romaji":           "a",
			"meaning":          "Huruf a (contoh: あさ = pagi)",
			"mnemonic":         "Bentuk lengkung melingkar seperti huruf 'a'.",
			"audio_text":       "あ",
		},
	}

	for _, accepted := range []string{"あ", " あ ", "\tあ\n"} {
		if !h.EvaluateExerciseAnswer(hiraganaEx, accepted) {
			t.Errorf("expected writing_trace hiraganaEx to accept %q", accepted)
		}
	}

	for _, rejected := range []string{"", "   ", "い", "ア", "a", "あ。"} {
		if h.EvaluateExerciseAnswer(hiraganaEx, rejected) {
			t.Errorf("expected writing_trace hiraganaEx to reject %q", rejected)
		}
	}

	kanjiEx := &Exercise{
		ID:                "wt-kanji-yama",
		ExerciseType:      ExerciseTypeWritingTrace,
		CorrectAnswer:     "山",
		AcceptableAnswers: []string{"山", "やま"},
		Content: map[string]any{
			"target_character": "山",
			"script":           "kanji",
			"romaji":           "yama / san",
			"meaning":          "Gunung",
			"audio_text":       "山",
		},
	}

	if !h.EvaluateExerciseAnswer(kanjiEx, "山") {
		t.Errorf("expected writing_trace kanjiEx to accept exact kanji")
	}
	if !h.EvaluateExerciseAnswer(kanjiEx, " やま ") {
		t.Errorf("expected writing_trace kanjiEx to accept trimmed acceptable answer")
	}
	if h.EvaluateExerciseAnswer(kanjiEx, "川") {
		t.Errorf("expected writing_trace kanjiEx to reject wrong kanji 川")
	}
}

func TestEvaluateExerciseAnswer_FreeTyping(t *testing.T) {
	h := NewHelper()

	// 1. Core N5/N4 phrase where Kanji, Hiragana, Katakana, and Romaji should all pass even without acceptable_answers
	tabemasuEx := &Exercise{
		ID:            "ft-tabemasu",
		ExerciseType:  ExerciseTypeFreeTyping,
		CorrectAnswer: "食べます",
		Content: map[string]any{
			"target_translation": "Makan (bentuk sopan)",
			"audio_text":         "食べます",
			"hint":               "Gunakan bentuk -masu dari kata kerja makan.",
		},
	}

	for _, accepted := range []string{
		"食べます",
		"食べます。",
		"たべます",
		"たべます!",
		"タベマス",
		"tabemasu",
		"TABEMASU",
		"tabemasu.",
		"  tabemasu  ",
	} {
		if !h.EvaluateExerciseAnswer(tabemasuEx, accepted) {
			t.Errorf("expected free_typing tabemasuEx to accept %q", accepted)
		}
	}

	for _, rejected := range []string{"", "   ", "のみます", "nomimasu", "Makan (bentuk sopan)", "tabemashita"} {
		if h.EvaluateExerciseAnswer(tabemasuEx, rejected) {
			t.Errorf("expected free_typing tabemasuEx to reject %q", rejected)
		}
	}

	// 2. Full sentence with particles, Kanji + acceptable Hiragana/Romaji variants, punctuation & particle tolerance
	sentenceEx := &Exercise{
		ID:            "ft-sentence-n4",
		ExerciseType:  ExerciseTypeFreeTyping,
		CorrectAnswer: "明日、図書館で日本語を勉強します。",
		AcceptableAnswers: []string{
			"あした、としょかんでにほんごをべんきょうします。",
			"ashita toshokan de nihongo o benkyou shimasu",
		},
		Content: map[string]any{
			"target_translation": "Besok saya belajar bahasa Jepang di perpustakaan.",
			"audio_text":         "明日、図書館で日本語を勉強します。",
		},
	}

	for _, accepted := range []string{
		"明日、図書館で日本語を勉強します。",
		"明日図書館で日本語を勉強します",
		"あしたとしょかんでにほんごをべんきょうします",
		"アシタトショカンデニホンゴヲベンキョウシマス",
		"ashita, toshokan de nihongo o benkyou shimasu.",
		"ashita toshokan de nihongo wo benkyo shimasu",
		"Ashita toshokan de nihongo o benkyoushimasu!",
	} {
		if !h.EvaluateExerciseAnswer(sentenceEx, accepted) {
			t.Errorf("expected free_typing sentenceEx to accept %q", accepted)
		}
	}

	for _, rejected := range []string{
		"きのう図書館で勉強しました",
		"ashita gakkou de eigo o benkyou shimasu",
		"Besok saya belajar bahasa Jepang di perpustakaan.",
	} {
		if h.EvaluateExerciseAnswer(sentenceEx, rejected) {
			t.Errorf("expected free_typing sentenceEx to reject %q", rejected)
		}
	}

	// 3. N3-N1 Kanji not in N5 replacer graded via AcceptableAnswers Hiragana/Romaji + apostrophe tolerance
	n2Ex := &Exercise{
		ID:            "ft-n2-kaigi",
		ExerciseType:  ExerciseTypeFreeTyping,
		CorrectAnswer: "会議の資料を確認してください。",
		AcceptableAnswers: []string{
			"かいぎのしりょうをかくにんしてください",
			"kaigi no shiryou o kakunin shite kudasai",
		},
		Content: map[string]any{
			"target_translation": "Tolong periksa dokumen rapat.",
			"audio_text":         "会議の資料を確認してください。",
		},
	}

	for _, accepted := range []string{
		"会議の資料を確認してください。",
		"会議の資料を確認してください",
		"かいぎのしりょうをかくにんしてください",
		"カイギノシリョウヲカクニンシテクダサイ",
		"kaigi no shiryo wo kakunin shite kudasai!",
	} {
		if !h.EvaluateExerciseAnswer(n2Ex, accepted) {
			t.Errorf("expected free_typing n2Ex to accept %q", accepted)
		}
	}

	if h.EvaluateExerciseAnswer(n2Ex, "かいぎのじかんをへんこうしてください") {
		t.Errorf("expected free_typing n2Ex to reject different sentence")
	}
}

func TestBuildFallbackSRSContextualHint_WritingTypes(t *testing.T) {
	traceEx := Exercise{
		ID:            "srs-wt",
		ExerciseType:  ExerciseTypeWritingTrace,
		CorrectAnswer: "あ",
		Content: map[string]any{
			"target_character": "あ",
		},
	}
	traceHint := BuildFallbackSRSContextualHint(traceEx)
	if !strings.Contains(traceHint, "goresan") {
		t.Errorf("expected writing_trace SRS hint to mention stroke order, got %q", traceHint)
	}

	typingEx := Exercise{
		ID:            "srs-ft",
		ExerciseType:  ExerciseTypeFreeTyping,
		CorrectAnswer: "食べます",
		Content: map[string]any{
			"target_translation": "Makan",
		},
	}
	typingHint := BuildFallbackSRSContextualHint(typingEx)
	if strings.Contains(typingHint, "食べます") || strings.Contains(typingHint, "tabemasu") {
		t.Errorf("expected free_typing SRS hint to be spoiler-free, got %q", typingHint)
	}
	if !strings.Contains(typingHint, "Makan") {
		t.Errorf("expected free_typing SRS hint to reference target translation, got %q", typingHint)
	}
}
