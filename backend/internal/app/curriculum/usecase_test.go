package curriculum_test

import (
	"context"
	"testing"

	"codeabroad/backend/internal/app/curriculum"
	"codeabroad/backend/internal/app/exercise"
	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/app/user"
)

func TestGetRoadmap_Success(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.Unit{ID: "unit-1", LevelID: "lvl-n5", Title: "Unit 1: Basics", TotalLessons: 2, CompletedLessons: 2}
	cRepo.Units["unit-2"] = &curriculum.Unit{ID: "unit-2", LevelID: "lvl-n5", Title: "Unit 2: Daily Life", TotalLessons: 2, CompletedLessons: 0}
	cRepo.Lessons["lesson-1"] = &curriculum.Lesson{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15}

	lRepo := language.NewMockRepository()
	lRepo.Languages["lang-ja"] = &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese"}
	lRepo.Levels["lvl-n5"] = &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", Name: "JLPT N5"}
	lvlID := "lvl-n5"
	lRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlID,
		IsActive:       true,
		Language:       lRepo.Languages["lang-ja"],
		CurrentLevel:   lRepo.Levels["lvl-n5"],
	}

	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-1"},
	}

	uc := curriculum.NewUsecase(cRepo, lRepo, eRepo, uRepo, nil)
	roadmap, err := uc.GetRoadmap(context.Background(), "user-1", "lang-ja")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(roadmap.Units) != 2 {
		t.Fatalf("expected 2 units, got %d", len(roadmap.Units))
	}
	if !roadmap.Units[0].IsUnlocked || !roadmap.Units[1].IsUnlocked {
		t.Errorf("expected both units to be unlocked, got unit1=%v, unit2=%v", roadmap.Units[0].IsUnlocked, roadmap.Units[1].IsUnlocked)
	}
}

func TestCompleteLesson_Success(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Lessons["lesson-1"] = &curriculum.Lesson{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15}

	lRepo := language.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 20, CurrentLevel: 1},
	}

	uc := curriculum.NewUsecase(cRepo, lRepo, eRepo, uRepo, nil)
	res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    95,
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if !res.Progress.IsCompleted {
		t.Errorf("expected progress is_completed true")
	}
	if res.Gamification.XP != 35 { // 20 + 15
		t.Errorf("expected 35 XP, got %d", res.Gamification.XP)
	}
}

