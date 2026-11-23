package onboarding_test

import (
	"context"
	"testing"

	"merantalk/backend/internal/app/curriculum"
	"merantalk/backend/internal/app/exercise"
	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/app/language"
	"merantalk/backend/internal/app/onboarding"
	"merantalk/backend/internal/app/user"
)

func TestCompleteOnboarding_ZeroBeginner(t *testing.T) {
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-1"},
		UserProfile: user.UserProfile{IsOnboarded: false},
	}

	lRepo := language.NewMockRepository()
	lRepo.Languages["lang-ja"] = &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lRepo.Levels["lvl-n5"] = &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
	lRepo.Levels["lvl-n4"] = &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}

	cRepo := curriculum.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	gRepo := gamification.NewMockRepository()

	uc := onboarding.NewUsecase(uRepo, lRepo, cRepo, eRepo, gRepo)

	res, err := uc.CompleteOnboarding(context.Background(), "user-1", &onboarding.OnboardingRequest{
		LanguageID:           "lang-ja",
		DailyGoalMinutes:     15,
		InitialPlacementType: "zero_beginner",
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if !res.Profile.IsOnboarded {
		t.Errorf("expected is_onboarded to be true")
	}
	if res.AssignedLevel.Code != "N5" {
		t.Errorf("expected assigned level N5, got %s", res.AssignedLevel.Code)
	}
	if res.GamificationStats.XP != 50 {
		t.Errorf("expected welcome bonus 50 XP, got %d", res.GamificationStats.XP)
	}
}

func TestCompleteOnboarding_PlacementTest_PassToN4(t *testing.T) {
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-1"},
		UserProfile: user.UserProfile{IsOnboarded: false},
	}

	lRepo := language.NewMockRepository()
	lRepo.Languages["lang-ja"] = &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lRepo.Levels["lvl-n5"] = &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
	lRepo.Levels["lvl-n4"] = &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}

	cRepo := curriculum.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	eRepo.PlacementExercises["lang-ja"] = []exercise.Exercise{
		{ID: "q1", CorrectAnswer: "Tokyo"},
		{ID: "q2", CorrectAnswer: "Arigatou"},
	}
	gRepo := gamification.NewMockRepository()

	uc := onboarding.NewUsecase(uRepo, lRepo, cRepo, eRepo, gRepo)

	res, err := uc.CompleteOnboarding(context.Background(), "user-1", &onboarding.OnboardingRequest{
		LanguageID:           "lang-ja",
		DailyGoalMinutes:     30,
		InitialPlacementType: "placement_test",
		PlacementAnswers: []onboarding.PlacementAnswer{
			{ExerciseID: "q1", UserAnswer: "Tokyo"},
			{ExerciseID: "q2", UserAnswer: "Arigatou"},
		},
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if res.AssignedLevel.Code != "N4" {
		t.Errorf("expected assigned level N4, got %s", res.AssignedLevel.Code)
	}
	if res.PlacementScore == nil || *res.PlacementScore != 100 {
		t.Errorf("expected placement score 100%%")
	}
}

func TestCompleteOnboarding_PlacementTest_DeduplicatesRepeatedAnswersAndNormalizesPunctuation(t *testing.T) {
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-1"},
		UserProfile: user.UserProfile{IsOnboarded: false},
	}

	lRepo := language.NewMockRepository()
	lRepo.Languages["lang-ja"] = &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lRepo.Levels["lvl-n5"] = &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
	lRepo.Levels["lvl-n4"] = &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}

	cRepo := curriculum.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	eRepo.PlacementExercises["lang-ja"] = []exercise.Exercise{
		{ID: "q1", CorrectAnswer: "Tokyo", AcceptableAnswers: []string{"Tōkyō"}},
		{ID: "q2", CorrectAnswer: "ありがとうございます。"},
	}
	gRepo := gamification.NewMockRepository()

	uc := onboarding.NewUsecase(uRepo, lRepo, cRepo, eRepo, gRepo)

	// Repeat q1 twice to ensure duplicate submissions do not inflate score to 100%
	res, err := uc.CompleteOnboarding(context.Background(), "user-1", &onboarding.OnboardingRequest{
		LanguageID:           "lang-ja",
		DailyGoalMinutes:     30,
		InitialPlacementType: "placement_test",
		PlacementAnswers: []onboarding.PlacementAnswer{
			{ExerciseID: "q1", UserAnswer: "  Tōkyō! "},
			{ExerciseID: "q1", UserAnswer: "Tokyo"},
		},
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if res.PlacementScore == nil || *res.PlacementScore != 50 {
		t.Fatalf("expected deduplicated score 50%%, got %v", res.PlacementScore)
	}
	if res.AssignedLevel.Code != "N5" {
		t.Errorf("expected assigned level N5 when score is 50%%, got %s", res.AssignedLevel.Code)
	}
}

func TestCompleteOnboarding_ManualSelect_InvalidLevel_And_StreakPreservation(t *testing.T) {
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-1"},
		UserProfile: user.UserProfile{IsOnboarded: false},
		UserGamificationStats: user.UserGamificationStats{
			XP:           10,
			CurrentLevel: 1,
			Streak:       5,
		},
	}

	lRepo := language.NewMockRepository()
	lRepo.Languages["lang-ja"] = &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lRepo.Levels["lvl-n5"] = &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
	lRepo.Levels["lvl-n4"] = &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}

	uc := onboarding.NewUsecase(uRepo, lRepo, curriculum.NewMockRepository(), exercise.NewMockRepository(), gamification.NewMockRepository())

	// Missing manual_level_id must return error
	if _, err := uc.CompleteOnboarding(context.Background(), "user-1", &onboarding.OnboardingRequest{
		LanguageID:           "lang-ja",
		DailyGoalMinutes:     15,
		InitialPlacementType: "manual_select",
	}); err == nil {
		t.Fatal("expected error when manual_level_id is missing")
	}

	// Non-existent manual_level_id must return error instead of falling back to N5
	unknown := "lvl-unknown"
	if _, err := uc.CompleteOnboarding(context.Background(), "user-1", &onboarding.OnboardingRequest{
		LanguageID:           "lang-ja",
		DailyGoalMinutes:     15,
		InitialPlacementType: "manual_select",
		ManualLevelID:        &unknown,
	}); err == nil {
		t.Fatal("expected error when manual_level_id does not belong to language")
	}

	// Valid zero_beginner must preserve existing streak of 5
	res, err := uc.CompleteOnboarding(context.Background(), "user-1", &onboarding.OnboardingRequest{
		LanguageID:           "lang-ja",
		DailyGoalMinutes:     15,
		InitialPlacementType: "zero_beginner",
	})
	if err != nil {
		t.Fatalf("expected valid onboarding to succeed, got %v", err)
	}
	if res.GamificationStats.Streak != 5 {
		t.Errorf("expected existing streak 5 to be preserved, got %d", res.GamificationStats.Streak)
	}
}

func TestCompleteOnboarding_PlacementTest_FallsBackToBaseLevelWhenNextLevelHasNoUnits(t *testing.T) {
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-1"},
		UserProfile: user.UserProfile{IsOnboarded: false},
	}

	lRepo := language.NewMockRepository()
	lRepo.Languages["lang-ja"] = &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lRepo.Levels["lvl-n5"] = &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
	lRepo.Levels["lvl-n4"] = &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}

	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-n5-1"] = &curriculum.UnitNodeResponse{
		ID:         "unit-n5-1",
		LevelID:    "lvl-n5",
		Title:      "Hiragana Dasar",
		UnitType:   "curriculum",
		OrderIndex: 1,
	}

	eRepo := exercise.NewMockRepository()
	eRepo.PlacementExercises["lang-ja"] = []exercise.Exercise{
		{ID: "q1", CorrectAnswer: "Tokyo"},
		{ID: "q2", CorrectAnswer: "Arigatou"},
	}
	gRepo := gamification.NewMockRepository()

	uc := onboarding.NewUsecase(uRepo, lRepo, cRepo, eRepo, gRepo)

	res, err := uc.CompleteOnboarding(context.Background(), "user-1", &onboarding.OnboardingRequest{
		LanguageID:           "lang-ja",
		DailyGoalMinutes:     15,
		InitialPlacementType: "placement_test",
		PlacementAnswers: []onboarding.PlacementAnswer{
			{ExerciseID: "q1", UserAnswer: "Tokyo"},
			{ExerciseID: "q2", UserAnswer: "Arigatou"},
		},
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if res.PlacementScore == nil || *res.PlacementScore != 100 {
		t.Fatalf("expected placement score 100%%, got %v", res.PlacementScore)
	}
	if res.AssignedLevel.Code != "N5" {
		t.Errorf("expected fallback to populated base level N5 when N4 has 0 units, got %s", res.AssignedLevel.Code)
	}
}

func TestCompleteOnboarding_ManualSelect_FallsBackToBaseLevelWhenTargetLevelHasNoUnits(t *testing.T) {
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-1"},
		UserProfile: user.UserProfile{IsOnboarded: false},
	}

	lRepo := language.NewMockRepository()
	lRepo.Languages["lang-ja"] = &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lRepo.Levels["lvl-n5"] = &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
	lRepo.Levels["lvl-n4"] = &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}

	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-n5-1"] = &curriculum.UnitNodeResponse{
		ID:         "unit-n5-1",
		LevelID:    "lvl-n5",
		Title:      "Hiragana Dasar",
		UnitType:   "curriculum",
		OrderIndex: 1,
	}

	uc := onboarding.NewUsecase(uRepo, lRepo, cRepo, exercise.NewMockRepository(), gamification.NewMockRepository())

	manualN4 := "lvl-n4"
	res, err := uc.CompleteOnboarding(context.Background(), "user-1", &onboarding.OnboardingRequest{
		LanguageID:           "lang-ja",
		DailyGoalMinutes:     15,
		InitialPlacementType: "manual_select",
		ManualLevelID:        &manualN4,
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.AssignedLevel.Code != "N5" {
		t.Errorf("expected fallback to populated base level N5 when manual_select targets empty N4, got %s", res.AssignedLevel.Code)
	}
}

func TestPlacementExercises_HydratedGradingAndSanitizedClientQuestions(t *testing.T) {
	q1 := exercise.Exercise{ID: "p-fill", ExerciseType: exercise.ExerciseTypeFillBlank}
	exercise.HydrateExerciseJSONFields(
		&q1,
		[]byte(`{"options":["あ","い","う","お"]}`),
		[]byte(`{"selected":"あ"}`),
		nil,
		nil,
	)

	q2 := exercise.Exercise{ID: "p-listen", ExerciseType: exercise.ExerciseTypeListeningChoice}
	exercise.HydrateExerciseJSONFields(
		&q2,
		[]byte(`{"audio_text":"おはようございます","options":[{"id":"opt_1","text":"Selamat pagi"},{"id":"opt_2","text":"Selamat malam"}]}`),
		[]byte(`{"selected_id":"opt_1"}`),
		nil,
		nil,
	)

	q3 := exercise.Exercise{ID: "p-build", ExerciseType: exercise.ExerciseTypeSentenceBuilder}
	exercise.HydrateExerciseJSONFields(
		&q3,
		[]byte(`{"tokens":["わたし","は","がくせい","です"]}`),
		[]byte(`["わたし","は","がくせい","です"]`),
		nil,
		nil,
	)

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-1"},
		UserProfile: user.UserProfile{IsOnboarded: false},
	}

	lRepo := language.NewMockRepository()
	lRepo.Languages["lang-ja"] = &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lRepo.Levels["lvl-n5"] = &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
	lRepo.Levels["lvl-n4"] = &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}

	cRepo := curriculum.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	eRepo.PlacementExercises["lang-ja"] = []exercise.Exercise{q1, q2, q3}

	uc := onboarding.NewUsecase(uRepo, lRepo, cRepo, eRepo, gamification.NewMockRepository())

	// 1. Client-facing GetPlacementQuestions must still strip CorrectAnswer & AcceptableAnswers
	clientResp, err := uc.GetPlacementQuestions(context.Background(), "lang-ja")
	if err != nil {
		t.Fatalf("expected GetPlacementQuestions to succeed, got %v", err)
	}
	if len(clientResp.Questions) != 3 {
		t.Fatalf("expected 3 placement questions, got %d", len(clientResp.Questions))
	}
	for _, rawQ := range clientResp.Questions {
		sanitizedQ, ok := rawQ.(exercise.Exercise)
		if !ok {
			t.Fatalf("expected exercise.Exercise value, got %T", rawQ)
		}
		if sanitizedQ.CorrectAnswer != "" || sanitizedQ.AcceptableAnswers != nil {
			t.Fatalf("expected sanitized placement question without answer keys, got %+v", sanitizedQ)
		}
	}

	// 2. CompleteOnboarding grading uses hydrated CorrectAnswer/AcceptableAnswers (both "opt_1" and object text accepted)
	res, err := uc.CompleteOnboarding(context.Background(), "user-1", &onboarding.OnboardingRequest{
		LanguageID:           "lang-ja",
		DailyGoalMinutes:     15,
		InitialPlacementType: "placement_test",
		PlacementAnswers: []onboarding.PlacementAnswer{
			{ExerciseID: "p-fill", UserAnswer: "あ"},
			{ExerciseID: "p-listen", UserAnswer: "opt_1"},
			{ExerciseID: "p-build", UserAnswer: "わたし は がくせい です"},
		},
	})
	if err != nil {
		t.Fatalf("expected CompleteOnboarding placement_test to succeed, got %v", err)
	}
	if res.PlacementScore == nil || *res.PlacementScore != 100 {
		t.Fatalf("expected hydrated placement score 100%%, got %v", res.PlacementScore)
	}
	if res.AssignedLevel.Code != "N4" {
		t.Errorf("expected placement score 100%% to assign level N4, got %s", res.AssignedLevel.Code)
	}
}

