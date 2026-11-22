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
}
