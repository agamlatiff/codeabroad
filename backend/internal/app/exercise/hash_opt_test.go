package exercise

import (
	"testing"
)

func TestEnrichExerciseFurigana_HashTableCompoundsPrefixesSpoilersAndDedup(t *testing.T) {
	t.Run("o-prefixed words and non-o-prefixed compound after o", func(t *testing.T) {
		raw := Exercise{
			ID:            "ex-furigana-o-prefix",
			ExerciseType:  ExerciseTypeFillBlank,
			Prompt:        "Lengkapi kalimat berikut:",
			CorrectAnswer: "で",
			Content: map[string]any{
				"sentence_template": "お風呂 と お土産 を お願いします。お図書館 で お酒 を 買います。",
			},
		}
		sanitized := SanitizeExercises([]Exercise{raw})
		EnrichExerciseFurigana(raw, &sanitized[0])

		furi, ok := sanitized[0].Content["furigana"].([]map[string]string)
		if !ok {
			t.Fatalf("expected furigana slice, got %#v", sanitized[0].Content["furigana"])
		}

		got := make(map[string]string, len(furi))
		for _, item := range furi {
			got[item["kanji"]] = item["kana"]
		}

		want := map[string]string{
			"お風呂":   "おふろ",
			"お土産":   "おみやげ",
			"お願いします": "おねがいします",
			"図書館":   "としょかん",
			"お酒":    "おさけ",
			"買います":  "かいます",
		}
		for k, v := range want {
			if got[k] != v {
				t.Errorf("expected %q -> %q in furigana, got %q (all: %#v)", k, v, got[k], furi)
			}
		}
		// Constituent single Kanji from matched compounds must NOT be duplicated.
		for _, forbidden := range []string{"風", "呂", "土", "産", "願", "図", "書", "館", "酒", "買"} {
			if _, exists := got[forbidden]; exists {
				t.Errorf("did not expect constituent single Kanji %q in furigana: %#v", forbidden, furi)
			}
		}
	})

	t.Run("spoiler suppression prevents constituent kanji leak even on repeat", func(t *testing.T) {
		raw := Exercise{
			ID:            "ex-furigana-spoiler",
			ExerciseType:  ExerciseTypeFillBlank,
			Prompt:        "Lengkapi kalimat:",
			CorrectAnswer: "おふろ",
			Content: map[string]any{
				"sentence_template": "お風呂 に 入ります。もう一度 お風呂 と 図書館 に 行きます。",
			},
		}
		sanitized := SanitizeExercises([]Exercise{raw})
		EnrichExerciseFurigana(raw, &sanitized[0])

		furi, ok := sanitized[0].Content["furigana"].([]map[string]string)
		if !ok {
			t.Fatalf("expected furigana slice, got %#v", sanitized[0].Content["furigana"])
		}
		got := make(map[string]string, len(furi))
		for _, item := range furi {
			got[item["kanji"]] = item["kana"]
		}
		for _, forbidden := range []string{"お風呂", "風呂", "風", "呂"} {
			if _, exists := got[forbidden]; exists {
				t.Errorf("expected spoiler %q to be suppressed, got %#v", forbidden, furi)
			}
		}
		if got["図書館"] != "としょかん" {
			t.Errorf("expected non-spoiler 図書館 -> としょかん, got %#v", furi)
		}
	})

	t.Run("single kanji slash reading spoiler suppression", func(t *testing.T) {
		raw := Exercise{
			ID:            "ex-furigana-single-spoiler",
			ExerciseType:  ExerciseTypeFillBlank,
			Prompt:        "Pilih bacaan yang tepat:",
			CorrectAnswer: "にち",
			Content: map[string]any{
				"sentence_template": "日 と 山 を 見ます。",
			},
		}
		sanitized := SanitizeExercises([]Exercise{raw})
		EnrichExerciseFurigana(raw, &sanitized[0])

		furi, ok := sanitized[0].Content["furigana"].([]map[string]string)
		if !ok {
			t.Fatalf("expected furigana slice, got %#v", sanitized[0].Content["furigana"])
		}
		got := make(map[string]string, len(furi))
		for _, item := range furi {
			got[item["kanji"]] = item["kana"]
		}
		if _, exists := got["日"]; exists {
			t.Errorf("expected single kanji spoiler 日 to be suppressed, got %#v", furi)
		}
		if got["山"] != "やま" || got["見ます"] != "みます" {
			t.Errorf("expected 山 and 見ます to remain, got %#v", furi)
		}
	})

	t.Run("deduplication and 8-item cap", func(t *testing.T) {
		raw := Exercise{
			ID:            "ex-furigana-dedup-cap",
			ExerciseType:  ExerciseTypeFillBlank,
			Prompt:        "Baca kalimat:",
			CorrectAnswer: "は",
			Content: map[string]any{
				"sentence_template": "図書館 と 図書館 で 日本語 と 英語 と 映画 と 音楽 と 料理 と 写真 と 電話 と 電車 と 病院 を 勉強 します。",
			},
		}
		sanitized := SanitizeExercises([]Exercise{raw})
		EnrichExerciseFurigana(raw, &sanitized[0])

		furi, ok := sanitized[0].Content["furigana"].([]map[string]string)
		if !ok {
			t.Fatalf("expected furigana slice, got %#v", sanitized[0].Content["furigana"])
		}
		if len(furi) != 8 {
			t.Fatalf("expected cap of 8 furigana items, got %d (%#v)", len(furi), furi)
		}
		seen := make(map[string]int, len(furi))
		for _, item := range furi {
			seen[item["kanji"]]++
			if seen[item["kanji"]] > 1 {
				t.Errorf("duplicate furigana entry %q in %#v", item["kanji"], furi)
			}
		}
	})
}

func TestEvaluateExerciseAnswer_HashSetPhoneticEdgeCases(t *testing.T) {
	h := NewHelper()

	singleVowelEx := &Exercise{
		ExerciseType:  ExerciseTypeSpeakingRepeat,
		CorrectAnswer: "あ",
		Content: map[string]any{
			"romaji": "a",
		},
	}
	if !h.EvaluateExerciseAnswer(singleVowelEx, "ア") {
		t.Error("expected single-rune katakana ア to match あ")
	}
	if !h.EvaluateExerciseAnswer(singleVowelEx, "a") {
		t.Error("expected single-rune romaji 'a' to match あ")
	}
	if h.EvaluateExerciseAnswer(singleVowelEx, "i") {
		t.Error("expected single-rune romaji 'i' NOT to match あ")
	}

	unspacedParticleEx := &Exercise{
		ExerciseType:  ExerciseTypeSpeakingRepeat,
		CorrectAnswer: "わたしはがくせいです",
		Content: map[string]any{
			"romaji": "watashi wa gakusei desu",
		},
	}
	if !h.EvaluateExerciseAnswer(unspacedParticleEx, "watashihagakuseidesu") {
		t.Error("expected >=6-rune unspaced ha->wa phonetic fallback to match")
	}
	if h.EvaluateExerciseAnswer(unspacedParticleEx, "watashiwasenseidesu") {
		t.Error("expected different word to be rejected")
	}
}

func TestExtractDiagnosticFeedback_TokenHashSetAndPriority(t *testing.T) {
	h := NewHelper()

	rubric := map[string]any{
		"wo":   "Feedback for wo",
		"ni":   "Feedback for ni",
		"食べます": "Feedback for tabemasu",
		"は":    "Feedback for wa particle",
	}

	// Punctuation-trimmed token match + deterministic sorted-key priority ("ni" < "wo")
	fb := h.ExtractDiagnosticFeedback(rubric, "watashi (wo) gakko (ni)!")
	if fb == nil || *fb != "Feedback for ni" {
		t.Fatalf("expected deterministic sorted-key match 'Feedback for ni', got %v", fb)
	}

	// Single-token punctuation-trimmed match
	fb = h.ExtractDiagnosticFeedback(rubric, "hon (wo) yomu")
	if fb == nil || *fb != "Feedback for wo" {
		t.Fatalf("expected 'Feedback for wo', got %v", fb)
	}

	// CJK >=2 rune substring fallback without spaces
	fb = h.ExtractDiagnosticFeedback(rubric, "まいあさパンを食べます")
	if fb == nil || *fb != "Feedback for tabemasu" {
		t.Fatalf("expected CJK substring fallback 'Feedback for tabemasu', got %v", fb)
	}

	// 1-rune CJK must NOT trigger substring fallback when embedded in another word
	if fb := h.ExtractDiagnosticFeedback(rubric, "おはよう"); fb != nil {
		t.Fatalf("expected nil for 1-rune embedded CJK, got %q", *fb)
	}
}

func TestSyncObjectOptionDiagnosticRubric_HashLookupAndMirroring(t *testing.T) {
	ex := &Exercise{
		Content: map[string]any{
			"options": []any{
				map[string]any{"id": "opt_a", "text": "Tokyo"},
				map[string]any{"id": "opt_b", "text": "Osaka"},
				map[string]any{"id": "opt_c", "text": "Kyoto"},
			},
		},
		DiagnosticRubric: map[string]any{
			" OPT_A ": "Hint A from padded uppercase id",
			"osaka":   "Hint B from lowercase text",
			"opt_c":   "Exact id hint C",
			"Kyoto":   "Exact text hint C",
		},
	}

	syncObjectOptionDiagnosticRubric(ex)

	if got := ex.DiagnosticRubric["Tokyo"]; got != "Hint A from padded uppercase id" {
		t.Errorf("expected mirrored text key 'Tokyo', got %#v", got)
	}
	if got := ex.DiagnosticRubric["opt_b"]; got != "Hint B from lowercase text" {
		t.Errorf("expected mirrored id key 'opt_b', got %#v", got)
	}
	if got := ex.DiagnosticRubric["opt_c"]; got != "Exact id hint C" {
		t.Errorf("expected existing exact id key 'opt_c' preserved, got %#v", got)
	}
	if got := ex.DiagnosticRubric["Kyoto"]; got != "Exact text hint C" {
		t.Errorf("expected existing exact text key 'Kyoto' preserved, got %#v", got)
	}
}

func BenchmarkEnrichExerciseFurigana(b *testing.B) {
	raw := Exercise{
		ID:            "bench-furi",
		ExerciseType:  ExerciseTypeFillBlank,
		Prompt:        "Lengkapi partikel untuk kalimat tentang perpustakaan dan Gunung Fuji:",
		CorrectAnswer: "で",
		Content: map[string]any{
			"sentence_template": "毎日 図書館 [blank] 日本語 の 本 を 読みます。週末 は 友達 と 富士山 に 登った 後 で お風呂 に 入ります。",
		},
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		sanitized := Exercise{
			ID:           raw.ID,
			ExerciseType: raw.ExerciseType,
			Prompt:       raw.Prompt,
			Content:      map[string]any{"sentence_template": raw.Content["sentence_template"]},
		}
		EnrichExerciseFurigana(raw, &sanitized)
	}
}
