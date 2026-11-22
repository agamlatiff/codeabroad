package curriculum

import (
	"strings"
	"testing"

	"merantalk/backend/internal/app/exercise"
)

func TestBuildLessonStudyItemsAndHints_N5Unit1KosakataDasar(t *testing.T) {
	rawExercises := []exercise.Exercise{
		{
			ID:           "ex-1",
			ExerciseType: exercise.ExerciseTypeFillBlank,
			Prompt:       "Lengkapi kata 'rumah' (ie):",
			Content: map[string]any{
				"options":           []any{"え", "あ", "お", "う"},
				"translation":       "Rumah (ie)",
				"sentence_template": "い [blank] (rumah = ie)",
			},
			CorrectAnswer: "え",
		},
		{
			ID:           "ex-2",
			ExerciseType: exercise.ExerciseTypeListeningChoice,
			Prompt:       "Dengarkan kata berikut:",
			Content: map[string]any{
				"audio_text": "かお",
				"options": []any{
					map[string]any{"id": "opt_1", "text": "Wajah (kao)"},
					map[string]any{"id": "opt_2", "text": "Biru (aoi)"},
				},
			},
			CorrectAnswer: "opt_1",
		},
		{
			ID:           "ex-3",
			ExerciseType: exercise.ExerciseTypeSentenceBuilder,
			Prompt:       "Susun kata 'biru':",
			Content: map[string]any{
				"romaji":             "Aoi",
				"tokens":             []any{"あ", "お", "い", "か"},
				"target_translation": "Biru (aoi)",
			},
			CorrectAnswer: "あ お い",
		},
		{
			ID:           "ex-4",
			ExerciseType: exercise.ExerciseTypeFillBlank,
			Prompt:       "Lengkapi kata kesemek:",
			Content: map[string]any{
				"options":           []any{"き", "く", "け", "こ"},
				"translation":       "Kesemek (kaki)",
				"sentence_template": "か [blank] (buah kesemek = kaki)",
			},
			CorrectAnswer: "き",
		},
		{
			ID:           "ex-5",
			ExerciseType: exercise.ExerciseTypeListeningChoice,
			Prompt:       "Dengarkan kata berikut:",
			Content: map[string]any{
				"audio_text": "こえ",
				"options": []any{
					map[string]any{"id": "opt_2", "text": "Kolam (ike)"},
					map[string]any{"id": "opt_1", "text": "Suara (koe)"},
				},
			},
			CorrectAnswer: "opt_1",
		},
		{
			ID:           "ex-6",
			ExerciseType: exercise.ExerciseTypeSentenceBuilder,
			Prompt:       "Susun kata 'suara':",
			Content: map[string]any{
				"romaji":             "Koe",
				"tokens":             []any{"こ", "え", "か", "い"},
				"target_translation": "Suara (koe)",
			},
			CorrectAnswer: "こ え",
		},
		{
			ID:           "ex-7",
			ExerciseType: exercise.ExerciseTypeSpeakingRepeat,
			Prompt:       "Ucapkan kata wajah:",
			Content: map[string]any{
				"romaji":       "kao (wajah)",
				"audio_text":   "かお",
				"display_text": "かお",
			},
			CorrectAnswer: "かお",
		},
		{
			ID:           "ex-8",
			ExerciseType: exercise.ExerciseTypeFillBlank,
			Prompt:       "Lengkapi kata kue:",
			Content: map[string]any{
				"options":           []any{"か", "き", "く", "け"},
				"translation":       "Kue (okashi)",
				"sentence_template": "お [blank] し (kue)",
			},
			CorrectAnswer: "か",
		},
	}

	sanitized := exercise.SanitizeExercises(rawExercises)
	items := buildLessonStudyItemsAndHints("n5-unit1-kosakata-dasar", rawExercises, sanitized, nil)

	expectedSymbols := []string{"いえ", "かお", "あおい", "かき", "こえ", "おかし"}
	if len(items) != len(expectedSymbols) {
		t.Fatalf("expected %d unique study items, got %d: %+v", len(expectedSymbols), len(items), items)
	}

	for i, wantSym := range expectedSymbols {
		if items[i].Symbol != wantSym {
			t.Errorf("item[%d].Symbol = %q, want %q", i, items[i].Symbol, wantSym)
		}
		if strings.EqualFold(items[i].Reading, "Dengarkan audio") || strings.TrimSpace(items[i].Reading) == "" {
			t.Errorf("item[%d] (%q) has weak/empty reading: %q", i, items[i].Symbol, items[i].Reading)
		}
		if strings.Contains(items[i].Symbol, "あおいか") || strings.Contains(items[i].Symbol, "こえかい") {
			t.Errorf("item[%d] leaked distractors: %q", i, items[i].Symbol)
		}
	}

	// Verify listening_choice resolved correct option even when options are reordered (opt_2 before opt_1)
	if items[4].Meaning != "Suara" || items[4].Reading != "koe" {
		t.Errorf("expected cleaned meaning 'Suara' and reading 'koe' for こえ, got meaning=%q reading=%q", items[4].Meaning, items[4].Reading)
	}

	// Verify contextual hints populated without leaking raw answers
	for i, ex := range sanitized {
		if ex.Hint == nil || strings.TrimSpace(*ex.Hint) == "" {
			t.Fatalf("expected non-empty contextual hint on exercise[%d]", i)
		}
	}
	if strings.Contains(*sanitized[0].Hint, "え") {
		t.Errorf("fill_blank hint for ex-1 leaked answer glyph: %q", *sanitized[0].Hint)
	}
}

func TestBuildLessonStudyItemsAndHints_CheckpointHasNoCardsOrHints(t *testing.T) {
	rawExercises := []exercise.Exercise{
		{
			ID:            "cp-1",
			ExerciseType:  exercise.ExerciseTypeFillBlank,
			Prompt:        "Pilih huruf ku:",
			Content:       map[string]any{"options": []any{"く", "け"}},
			CorrectAnswer: "く",
		},
	}
	sanitized := exercise.SanitizeExercises(rawExercises)
	items := buildLessonStudyItemsAndHints("n5-u1-checkpoint", rawExercises, sanitized, nil)

	if len(items) != 0 {
		t.Fatalf("expected 0 study items for checkpoint lesson, got %d", len(items))
	}
	if sanitized[0].Hint != nil {
		t.Fatalf("expected nil hint for checkpoint lesson, got %q", *sanitized[0].Hint)
	}
}

func TestBuildLessonStudyItemsAndHints_PhraseFallbackAndAutoFurigana(t *testing.T) {
	rawExercises := []exercise.Exercise{
		{
			ID:           "phrase-1",
			ExerciseType: exercise.ExerciseTypeSpeakingRepeat,
			Prompt:       "Ucapkan kalimat menanyakan kamus:",
			Content: map[string]any{
				"phrase": "これは辞書ですか。",
				"romaji": "Kore wa jisho desu ka.",
			},
			CorrectAnswer: "これは辞書ですか。",
		},
		{
			ID:           "kanji-ctx-1",
			ExerciseType: exercise.ExerciseTypeFillBlank,
			Prompt:       "Lengkapi kalimat membaca di perpustakaan:",
			Content: map[string]any{
				"sentence_template": "図書館 [blank] 本を 読みます。",
				"translation":       "Membaca buku di perpustakaan",
				"options":           []any{"で", "に", "を", "へ"},
			},
			CorrectAnswer: "で",
		},
		{
			ID:           "listen-secret-1",
			ExerciseType: exercise.ExerciseTypeListeningChoice,
			Prompt:       "Dengarkan audio dan pilih arti yang benar:",
			Content: map[string]any{
				"audio_text": "先生は親切です",
				"options": []any{
					map[string]any{"id": "opt_1", "text": "Guru ramah"},
					map[string]any{"id": "opt_2", "text": "Teman sibuk"},
				},
			},
			CorrectAnswer: "opt_1",
		},
		{
			ID:           "kanji-quiz-1",
			ExerciseType: exercise.ExerciseTypeFillBlank,
			Prompt:       "Pilih cara baca Hiragana yang benar untuk kanji 山:",
			Content: map[string]any{
				"options": []any{"やま", "かわ", "うみ", "そら"},
			},
			CorrectAnswer: "やま",
		},
	}

	sanitized := exercise.SanitizeExercises(rawExercises)
	items := buildLessonStudyItemsAndHints("n5-unit13-kalimat-de-vs-ni", rawExercises, sanitized, nil)

	if len(items) == 0 || items[0].Symbol != "これは辞書ですか。" {
		t.Fatalf("expected first study item extracted from content.phrase, got %+v", items)
	}

	// Speaking & visible fill_blank should receive auto furigana for visible Kanji
	furi0, ok0 := sanitized[0].Content["furigana"].([]map[string]string)
	if !ok0 || len(furi0) == 0 || furi0[0]["kanji"] != "辞書" || furi0[0]["kana"] != "じしょ" {
		t.Fatalf("expected furigana [{辞書 じしょ}] on sanitized[0], got %#v", sanitized[0].Content["furigana"])
	}

	furi1, ok1 := sanitized[1].Content["furigana"].([]map[string]string)
	if !ok1 || len(furi1) == 0 {
		t.Fatalf("expected furigana on sanitized[1], got %#v", sanitized[1].Content["furigana"])
	}

	// Listening choice must NOT extract furigana from hidden audio_text
	if _, hasFuri := sanitized[2].Content["furigana"]; hasFuri {
		t.Fatalf("listening_choice leaked audio_text furigana: %#v", sanitized[2].Content["furigana"])
	}

	// Kanji-reading quiz must NOT spoil the answer via auto furigana
	if _, hasFuri := sanitized[3].Content["furigana"]; hasFuri {
		t.Fatalf("kanji-reading question leaked answer via furigana: %#v", sanitized[3].Content["furigana"])
	}
}

func TestBuildLessonStudyItemsAndHints_AutoRomajiAndCleanSpeakingMeaning(t *testing.T) {
	explAisatsu := `Ungkapan ini adalah penutup wajib yang bermakna "Mohon kerja sama dan bimbingan baiknya".`
	rawExercises := []exercise.Exercise{
		{
			ID:           "lc-no-romaji",
			ExerciseType: exercise.ExerciseTypeListeningChoice,
			Prompt:       "Dengarkan audio ini:",
			Content: map[string]any{
				"audio_text": "あおい",
				"options": []any{
					map[string]any{"id": "opt_1", "text": "Biru"},
					map[string]any{"id": "opt_2", "text": "Merah"},
				},
			},
			CorrectAnswer: "opt_1",
		},
		{
			ID:           "fb-no-romaji",
			ExerciseType: exercise.ExerciseTypeFillBlank,
			Prompt:       "Lengkapi kata berikut:",
			Content: map[string]any{
				"sentence_template": "お [blank] し",
				"translation":       "Kue manis",
				"options":           []any{"か", "き", "く", "け"},
			},
			CorrectAnswer: "か",
		},
		{
			ID:           "sr-paren-meaning",
			ExerciseType: exercise.ExerciseTypeSpeakingRepeat,
			Prompt:       `Ucapkan dengan lantang kata "やま" (gunung):`,
			Content: map[string]any{
				"display_text": "やま",
				"romaji":       "yama",
			},
			CorrectAnswer: "やま",
		},
		{
			ID:           "sr-expl-meaning",
			ExerciseType: exercise.ExerciseTypeSpeakingRepeat,
			Prompt:       "Dengarkan dan tirukan ungkapan berikut dengan jelas.",
			Explanation:  &explAisatsu,
			Content: map[string]any{
				"display_text": "どうぞよろしくおねがいします",
				"romaji":       "Douzo yoroshiku onegaishimasu",
			},
			CorrectAnswer: "どうぞよろしくおねがいします",
		},
		{
			ID:           "sr-romaji-paren-guard",
			ExerciseType: exercise.ExerciseTypeSpeakingRepeat,
			Prompt:       "Ucapkan salam siang 'こんにちは' (konnichiwa):",
			Content: map[string]any{
				"display_text": "こんにちは",
				"romaji":       "konnichiwa",
			},
			CorrectAnswer: "こんにちは",
		},
	}

	sanitized := exercise.SanitizeExercises(rawExercises)
	items := buildLessonStudyItemsAndHints("n5-sample-auto-romaji", rawExercises, sanitized, nil)

	if len(items) != 5 {
		t.Fatalf("expected 5 study items, got %d: %+v", len(items), items)
	}
	if items[0].Reading != "aoi" {
		t.Errorf("expected auto-generated romaji 'aoi' for listening_choice, got %q", items[0].Reading)
	}
	if items[1].Reading != "okashi" {
		t.Errorf("expected auto-generated romaji 'okashi' for fill_blank, got %q", items[1].Reading)
	}
	if items[2].Meaning != "Gunung" {
		t.Errorf("expected extracted meaning 'Gunung' for やま, got %q", items[2].Meaning)
	}
	if items[3].Meaning != "Mohon kerja sama dan bimbingan baiknya" {
		t.Errorf("expected extracted meaning from explanation, got %q", items[3].Meaning)
	}
	if items[4].Meaning == "Konnichiwa" {
		t.Errorf("expected speaking meaning for こんにちは not to echo romaji 'Konnichiwa'")
	}
}
