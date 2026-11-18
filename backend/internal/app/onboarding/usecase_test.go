package onboarding_test

import (
	"context"
	"testing"

	"codeabroad/backend/internal/app/curriculum"
	"codeabroad/backend/internal/app/exercise"
	"codeabroad/backend/internal/app/gamification"
	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/app/onboarding"
	"codeabroad/backend/internal/app/user"
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

