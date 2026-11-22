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
