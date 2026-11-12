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
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", Title: "Unit 1: Basics", TotalLessons: 2, CompletedLessons: 2, OrderIndex: 1}
	cRepo.Units["unit-2"] = &curriculum.UnitNodeResponse{ID: "unit-2", LevelID: "lvl-n5", Title: "Unit 2: Daily Life", TotalLessons: 2, CompletedLessons: 0, OrderIndex: 2}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1, IsCompleted: true}

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
	roadmap, err := uc.GetRoadmap(context.Background(), "user-1", &curriculum.GetRoadmapRequest{LanguageID: "lang-ja"})
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
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	nextID := "lesson-2"
	cRepo.NextLessonID = &nextID

	lRepo := language.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 20, CurrentLevel: 1, Streak: 1},
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
	if res.UnlockedNextLessonID == nil || *res.UnlockedNextLessonID != "lesson-2" {
		t.Errorf("expected next lesson id lesson-2, got %v", res.UnlockedNextLessonID)
	}
}

func TestGetLessonDetail_Locked_ReturnsErrLessonLocked(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", OrderIndex: 1, IsCompleted: false}
	cRepo.Lessons["lesson-2"] = &curriculum.LessonNodeResponse{ID: "lesson-2", UnitID: "unit-1", Title: "Lesson 2", OrderIndex: 2, IsCompleted: false}

	lRepo := language.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()

	uc := curriculum.NewUsecase(cRepo, lRepo, eRepo, uRepo, nil)

	// User tries to open lesson-2 directly without finishing lesson-1
	_, err := uc.GetLessonDetail(context.Background(), "user-1", "lesson-2")
	if err == nil {
		t.Fatalf("expected ErrLessonLocked, got nil")
	}
	if err != curriculum.ErrLessonLocked {
		t.Fatalf("expected ErrLessonLocked, got: %v", err)
	}
}

func TestGetLessonDetail_Unlocked_Success(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", OrderIndex: 1, IsCompleted: true}
	cRepo.Lessons["lesson-2"] = &curriculum.LessonNodeResponse{ID: "lesson-2", UnitID: "unit-1", Title: "Lesson 2", OrderIndex: 2, IsCompleted: false}
	cRepo.LessonProgress["user-1:lesson-1"] = &curriculum.UserLessonProgress{UserID: "user-1", LessonID: "lesson-1", IsCompleted: true}

	lRepo := language.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()

	uc := curriculum.NewUsecase(cRepo, lRepo, eRepo, uRepo, nil)

	// Since lesson-1 is completed, lesson-2 is unlocked
	detail, err := uc.GetLessonDetail(context.Background(), "user-1", "lesson-2")
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	if !detail.IsUnlocked {
		t.Errorf("expected lesson detail is_unlocked true")
	}
}

func TestCompleteLesson_Replay_AntiExploitPracticeXP(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	// Lesson was ALREADY completed previously
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1, IsCompleted: true}
	cRepo.LessonProgress["user-1:lesson-1"] = &curriculum.UserLessonProgress{UserID: "user-1", LessonID: "lesson-1", IsCompleted: true}

	lRepo := language.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 100, CurrentLevel: 2, Streak: 1},
	}

	uc := curriculum.NewUsecase(cRepo, lRepo, eRepo, uRepo, nil)

	// Replaying completed lesson should only award 5 practice XP, NOT full 15 XP
	res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    100,
	})
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	// 100 XP + 5 Practice XP = 105 XP
	if res.Gamification.XP != 105 {
		t.Errorf("expected 105 XP (5 practice XP awarded), got %d", res.Gamification.XP)
	}
}

func TestGetGrammarPoints(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.GrammarPoints["gp-1"] = &curriculum.GrammarPoint{ID: "gp-1", LevelID: "lvl-n5", Code: "GP-1", Title: "WA Particle"}
	lRepo := language.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()

	uc := curriculum.NewUsecase(cRepo, lRepo, eRepo, uRepo, nil)

	pts, err := uc.GetGrammarPoints(context.Background(), "lvl-n5")
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	if len(pts) != 1 {
		t.Errorf("expected 1 grammar point, got %d", len(pts))
	}
}

func TestCompleteLesson_ZeroScore_Allowed(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}

	lRepo := language.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 0, CurrentLevel: 1},
	}

	uc := curriculum.NewUsecase(cRepo, lRepo, eRepo, uRepo, nil)

	// Submitting a score of 0 should be fully valid
	res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    0,
	})
	if err != nil {
		t.Fatalf("expected 0 score to be accepted, got error: %v", err)
	}
	if res.Progress.Score != 0 {
		t.Errorf("expected progress score to be 0, got %d", res.Progress.Score)
	}
}

func TestCompleteLesson_ScoreGreatestPreserved(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1, IsCompleted: true}
	cRepo.LessonProgress["user-1:lesson-1"] = &curriculum.UserLessonProgress{
		UserID:      "user-1",
		LessonID:    "lesson-1",
		IsCompleted: true,
		Score:       95,
	}

	lRepo := language.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 100, CurrentLevel: 2},
	}

	uc := curriculum.NewUsecase(cRepo, lRepo, eRepo, uRepo, nil)

	// Replay with lower score of 60; GREATEST score (95) should be preserved
	res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    60,
	})
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	if res.Progress.Score != 95 {
		t.Errorf("expected preserved highest score 95, got %d", res.Progress.Score)
	}
}

