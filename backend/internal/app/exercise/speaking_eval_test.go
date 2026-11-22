package exercise

import "testing"

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
}

func TestParseCorrectAnswerJSON_ExactMatch(t *testing.T) {
	got := ParseCorrectAnswerJSON([]byte(`{"exact_match": "これは辞書ですか。"}`))
	if got != "これは辞書ですか。" {
		t.Fatalf("ParseCorrectAnswerJSON = %q, want %q", got, "これは辞書ですか。")
	}
}
