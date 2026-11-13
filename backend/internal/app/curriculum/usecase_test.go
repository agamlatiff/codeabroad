package curriculum_test

import (
	"context"
	"errors"
	"sync"
	"testing"
	"time"

	"codeabroad/backend/internal/app/curriculum"
	"codeabroad/backend/internal/app/exercise"
	"codeabroad/backend/internal/app/gamification"
	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/app/user"
	"codeabroad/backend/internal/shared/apperror"
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
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     2,
		AttemptedExercises: 2,
		CorrectExercises:   2,
	}
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
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:          2,
		AttemptedExercises:      2,
		CorrectExercises:        2,
		FreshAttemptedExercises: 2,
		FreshCorrectExercises:   2,
	}

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
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", Name: "JLPT N5", OrderIndex: 1}
	lRepo.Levels["lvl-n5"] = lvlN5
	lRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()

	uc := curriculum.NewUsecase(cRepo, lRepo, eRepo, uRepo, nil)

	pts, err := uc.GetGrammarPoints(context.Background(), "user-1", "lvl-n5")
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	if len(pts) != 1 {
		t.Errorf("expected 1 grammar point, got %d", len(pts))
	}
}

func TestCompleteLesson_LowScoreBlocked_MinimumAccuracyRequired(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     2,
		AttemptedExercises: 2,
		CorrectExercises:   0, // 0%
	}

	lRepo := language.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 0, CurrentLevel: 1},
	}

	uc := curriculum.NewUsecase(cRepo, lRepo, eRepo, uRepo, nil)

	// 0% accuracy must be blocked on initial completion
	_, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    0,
	})
	var domainErr *apperror.DomainError
	if !errors.As(err, &domainErr) || domainErr.Code != "LESSON_SCORE_TOO_LOW" {
		t.Fatalf("expected LESSON_SCORE_TOO_LOW for 0%% accuracy, got %v", err)
	}
	if cRepo.UserXP["user-1"] != 0 {
		t.Errorf("expected 0 XP after rejected low score, got %d", cRepo.UserXP["user-1"])
	}

	// 50% (1/2) must also be blocked (< 60%)
	cRepo.AttemptSummaries["user-1:lesson-1"].CorrectExercises = 1
	_, err = uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    50,
	})
	if !errors.As(err, &domainErr) || domainErr.Code != "LESSON_SCORE_TOO_LOW" {
		t.Fatalf("expected LESSON_SCORE_TOO_LOW for 50%% accuracy, got %v", err)
	}

	// 60% (3/5) satisfies minimum passing threshold
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     5,
		AttemptedExercises: 5,
		CorrectExercises:   3,
	}
	res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    60,
	})
	if err != nil {
		t.Fatalf("expected 60%% accuracy to pass, got %v", err)
	}
	if res.Progress.Score != 60 {
		t.Errorf("expected verified score 60, got %d", res.Progress.Score)
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
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:          5,
		AttemptedExercises:      5,
		CorrectExercises:        3,
		FreshAttemptedExercises: 5,
		FreshCorrectExercises:   3,
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

func TestCompleteLesson_UserNotFound_FailFast(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}

	lRepo := language.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository() // empty users map, user "non-existent" not found

	uc := curriculum.NewUsecase(cRepo, lRepo, eRepo, uRepo, nil)

	_, err := uc.CompleteLesson(context.Background(), "non-existent", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    90,
	})
	if err == nil {
		t.Fatalf("expected error for non-existent user, got nil")
	}
	if err != user.ErrUserNotFound {
		t.Fatalf("expected ErrUserNotFound, got %v", err)
	}

	// Verify fail-fast: no lesson progress was upserted
	if len(cRepo.LessonProgress) != 0 {
		t.Fatalf("expected 0 lesson progress entries due to fail-fast, got %d", len(cRepo.LessonProgress))
	}
}

func TestGetRoadmap_RedisCacheHitAndMiss(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", Title: "Unit 1: Basics", TotalLessons: 1, CompletedLessons: 1, OrderIndex: 1}
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
	cacheRepo := curriculum.NewMockRoadmapCacheRepository()

	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, eRepo, uRepo, nil, cacheRepo)

	// First call: Cache miss -> queries DB and populates cache
	roadmap1, err := uc.GetRoadmap(context.Background(), "user-1", &curriculum.GetRoadmapRequest{LanguageID: "lang-ja"})
	if err != nil {
		t.Fatalf("first GetRoadmap failed: %v", err)
	}
	if roadmap1 == nil || len(roadmap1.Units) != 1 {
		t.Fatalf("expected 1 unit, got %v", roadmap1)
	}
	if cacheRepo.SetRoadmapCallCount == 0 {
		t.Errorf("expected SetRoadmap to be called on cache miss")
	}

	// Mutate DB repo to verify second call serves strictly from cache
	delete(cRepo.Units, "unit-1")

	roadmap2, err := uc.GetRoadmap(context.Background(), "user-1", &curriculum.GetRoadmapRequest{LanguageID: "lang-ja"})
	if err != nil {
		t.Fatalf("second GetRoadmap failed: %v", err)
	}
	if len(roadmap2.Units) != 1 {
		t.Errorf("expected cached roadmap to retain 1 unit, got %d", len(roadmap2.Units))
	}
	if cacheRepo.GetRoadmapCallCount < 2 {
		t.Errorf("expected GetRoadmap cache calls >= 2, got %d", cacheRepo.GetRoadmapCallCount)
	}
}

func TestCompleteLesson_InvalidatesRoadmapCache(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     2,
		AttemptedExercises: 2,
		CorrectExercises:   2,
	}

	lRepo := language.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 10, CurrentLevel: 1, Streak: 1},
	}
	cacheRepo := curriculum.NewMockRoadmapCacheRepository()

	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, eRepo, uRepo, nil, cacheRepo)

	_, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    90,
	})
	if err != nil {
		t.Fatalf("CompleteLesson failed: %v", err)
	}
	if cacheRepo.InvalidateCallCount != 1 {
		t.Errorf("expected InvalidateRoadmap to be called once, got %d", cacheRepo.InvalidateCallCount)
	}
}

func TestCompleteLesson_AtomicTransaction_FailRollback(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	cRepo.RecordCompletionErr = errors.New("db transaction failure")

	lRepo := language.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 10, CurrentLevel: 1, Streak: 1},
	}

	uc := curriculum.NewUsecase(cRepo, lRepo, eRepo, uRepo, nil)

	_, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    90,
	})
	if err == nil {
		t.Fatalf("expected transaction failure error, got nil")
	}
}

func TestGetLessonDetail_HigherLevelLocked(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.LevelOrders["lvl-n5"] = 1
	cRepo.LevelOrders["lvl-n4"] = 2
	cRepo.UserMaxLevelOrder["user-1"] = 1
	cRepo.Units["unit-n4"] = &curriculum.UnitNodeResponse{ID: "unit-n4", LevelID: "lvl-n4", OrderIndex: 1}
	cRepo.Lessons["lesson-n4"] = &curriculum.LessonNodeResponse{ID: "lesson-n4", UnitID: "unit-n4", Title: "N4 Lesson 1", OrderIndex: 1}

	uc := curriculum.NewUsecase(cRepo, language.NewMockRepository(), exercise.NewMockRepository(), user.NewMockRepository(), nil)

	_, err := uc.GetLessonDetail(context.Background(), "user-1", "lesson-n4")
	if !errors.Is(err, curriculum.ErrLessonLocked) {
		t.Fatalf("expected ErrLessonLocked for higher-level cross-level access, got %v", err)
	}
}

func TestGetLessonDetail_StripsAnswerKeys(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Hiragana", OrderIndex: 1}

	eRepo := exercise.NewMockRepository()
	lessonID := "lesson-1"
	explanation := "Hiragana vowel A"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:                "ex-1",
		LessonID:          &lessonID,
		Prompt:            "Select 'a'",
		Options:           []string{"あ", "い"},
		CorrectAnswer:     "あ",
		AcceptableAnswers: []string{"a", "あ"},
		DiagnosticRubric:  map[string]any{"skill": "reading"},
		Explanation:       &explanation,
	}

	uc := curriculum.NewUsecase(cRepo, language.NewMockRepository(), eRepo, user.NewMockRepository(), nil)

	res, err := uc.GetLessonDetail(context.Background(), "user-1", "lesson-1")
	if err != nil {
		t.Fatalf("GetLessonDetail failed: %v", err)
	}
	if len(res.Exercises) != 1 {
		t.Fatalf("expected 1 exercise, got %d", len(res.Exercises))
	}
	got := res.Exercises[0]
	if got.CorrectAnswer != "" || got.AcceptableAnswers != nil || got.DiagnosticRubric != nil || got.Explanation != nil {
		t.Fatalf("expected answer keys to be stripped, got CorrectAnswer=%q AcceptableAnswers=%v Rubric=%v Explanation=%v",
			got.CorrectAnswer, got.AcceptableAnswers, got.DiagnosticRubric, got.Explanation)
	}
	if got.Prompt != "Select 'a'" || len(got.Options) != 2 {
		t.Errorf("expected prompt and options preserved, got prompt=%q options=%v", got.Prompt, got.Options)
	}
	if eRepo.Exercises["ex-1"].CorrectAnswer != "あ" {
		t.Errorf("expected underlying repository exercise not mutated")
	}
}

func TestCompleteLesson_UnattemptedExercises_Blocked(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     3,
		AttemptedExercises: 0,
		CorrectExercises:   0,
	}

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 0, CurrentLevel: 1, Streak: 0},
	}

	uc := curriculum.NewUsecase(cRepo, language.NewMockRepository(), exercise.NewMockRepository(), uRepo, nil)

	_, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    100,
	})
	if err == nil {
		t.Fatalf("expected unattempted exercises to be blocked")
	}

	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     3,
		AttemptedExercises: 3,
		CorrectExercises:   3,
	}
	res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    100,
	})
	if err != nil {
		t.Fatalf("expected completion after attempting all exercises to succeed, got %v", err)
	}
	if res.Gamification.XP != 15 {
		t.Errorf("expected 15 XP, got %d", res.Gamification.XP)
	}
}

func TestCompleteLesson_ConcurrentBurst_AntiExploit(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:          2,
		AttemptedExercises:      2,
		CorrectExercises:        2,
		FreshAttemptedExercises: 2,
		FreshCorrectExercises:   2,
	}

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 0, CurrentLevel: 1, Streak: 0},
	}

	uc := curriculum.NewUsecase(cRepo, language.NewMockRepository(), exercise.NewMockRepository(), uRepo, nil)

	const workers = 5
	var wg sync.WaitGroup
	errCh := make(chan error, workers)
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			_, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
				LessonID: "lesson-1",
				Score:    100,
			})
			errCh <- err
		}()
	}
	wg.Wait()
	close(errCh)

	successCount := 0
	blockedCount := 0
	for err := range errCh {
		if err == nil {
			successCount++
			continue
		}
		var domErr *apperror.DomainError
		if errors.As(err, &domErr) && domErr.Code == "EXERCISES_NOT_ATTEMPTED" {
			blockedCount++
		} else {
			t.Fatalf("unexpected error during concurrent completion: %v", err)
		}
	}

	if successCount != 1 || blockedCount != workers-1 {
		t.Fatalf("expected exactly 1 winner and %d blocked concurrent bursts, got success=%d blocked=%d", workers-1, successCount, blockedCount)
	}
	// 1st serialized completion = 15 XP; 4 concurrent bursts rejected inside TX lock => 15 XP total
	if gotXP := cRepo.UserXP["user-1"]; gotXP != 15 {
		t.Errorf("expected 15 XP after serialized concurrent burst, got %d", gotXP)
	}
}

func TestGetRoadmap_LanguageSwitch_NoCacheCollision(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-ja"] = &curriculum.UnitNodeResponse{ID: "unit-ja", LevelID: "lvl-n5", Title: "JA Basics", OrderIndex: 1}
	cRepo.Units["unit-ko"] = &curriculum.UnitNodeResponse{ID: "unit-ko", LevelID: "lvl-topik1", Title: "KO Basics", OrderIndex: 1}

	lRepo := language.NewMockRepository()
	langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese"}
	langKO := &language.Language{ID: "lang-ko", Code: "ko", Name: "Korean"}
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", Name: "JLPT N5", OrderIndex: 1}
	lvlTopik := &language.ProficiencyLevel{ID: "lvl-topik1", LanguageID: "lang-ko", Code: "TOPIK1", Name: "TOPIK 1", OrderIndex: 1}

	lRepo.Enrollments["enr-ja"] = &language.UserLanguageEnrollment{
		ID:             "enr-ja",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		Language:       langJA,
		CurrentLevel:   lvlN5,
	}
	lRepo.Enrollments["enr-ko"] = &language.UserLanguageEnrollment{
		ID:             "enr-ko",
		UserID:         "user-1",
		LanguageID:     "lang-ko",
		CurrentLevelID: &lvlTopik.ID,
		IsActive:       false,
		Language:       langKO,
		CurrentLevel:   lvlTopik,
	}

	cacheRepo := curriculum.NewMockRoadmapCacheRepository()
	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil, cacheRepo)

	// 1. Default GetRoadmap (empty LanguageID) caches under canonical "lang-ja", NOT ""
	res1, err := uc.GetRoadmap(context.Background(), "user-1", &curriculum.GetRoadmapRequest{})
	if err != nil {
		t.Fatalf("first GetRoadmap failed: %v", err)
	}
	if res1.Language.ID != "lang-ja" {
		t.Fatalf("expected lang-ja, got %s", res1.Language.ID)
	}
	if _, leakedEmptyKey := cacheRepo.Cache["user-1:"]; leakedEmptyKey {
		t.Fatalf("expected no cache entry under empty language key user-1:")
	}

	// 2. Switch active language to Korean and call GetRoadmap with empty LanguageID again
	_ = lRepo.SetActiveLanguage(context.Background(), "user-1", "lang-ko")
	res2, err := uc.GetRoadmap(context.Background(), "user-1", &curriculum.GetRoadmapRequest{})
	if err != nil {
		t.Fatalf("second GetRoadmap after language switch failed: %v", err)
	}
	if res2.Language.ID != "lang-ko" {
		t.Errorf("expected Korean roadmap after language switch without cache collision, got %s", res2.Language.ID)
	}
}

func TestCompleteLesson_PartialAttemptsBlocked_AndServerComputesScore(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     3,
		AttemptedExercises: 1,
		CorrectExercises:   1,
	}

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 0, CurrentLevel: 1, Gems: 25},
	}

	uc := curriculum.NewUsecase(cRepo, language.NewMockRepository(), exercise.NewMockRepository(), uRepo, nil)

	// 1. Attempting only 1 of 3 exercises must be rejected
	_, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    100,
	})
	if err == nil {
		t.Fatalf("expected partial attempt (1/3) to be rejected")
	}

	// 2. Attempting all 3 exercises with 2 correct must override client's forged Score=100 -> server 66%
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     3,
		AttemptedExercises: 3,
		CorrectExercises:   2,
	}
	res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    100,
	})
	if err != nil {
		t.Fatalf("expected full attempt completion to succeed, got %v", err)
	}
	if res.Progress.Score != 66 {
		t.Errorf("expected server-computed score 66 (ignoring client forged 100), got %d", res.Progress.Score)
	}
	if res.Gamification.Gems != 25 {
		t.Errorf("expected Gems 25 preserved in completion response, got %d", res.Gamification.Gems)
	}
}

func TestCompleteLesson_ReplayRequiresFreshAttempts_AndDailyCap(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:          2,
		AttemptedExercises:      2,
		CorrectExercises:        2,
		FreshAttemptedExercises: 0,
		FreshCorrectExercises:   0,
	}

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 0, CurrentLevel: 1},
	}

	uc := curriculum.NewUsecase(cRepo, language.NewMockRepository(), exercise.NewMockRepository(), uRepo, nil)

	// Initial completion succeeds (15 XP)
	firstRes, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-1", Score: 100})
	if err != nil {
		t.Fatalf("initial completion failed: %v", err)
	}
	if firstRes.Gamification.XP != 15 {
		t.Fatalf("expected 15 XP on initial completion, got %d", firstRes.Gamification.XP)
	}

	// Replay with 0 fresh attempts after completion must be blocked
	_, err = uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-1", Score: 100})
	if err == nil {
		t.Fatalf("expected replay without fresh post-completion attempts to be blocked")
	}

	// Re-submit fresh attempts before each replay (12 times): daily replay XP cap is 50 (10 * 5 XP) -> max 65 total XP
	var lastRes *curriculum.CompleteLessonResponse
	for i := 0; i < 12; i++ {
		cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
			TotalExercises:          2,
			AttemptedExercises:      2,
			CorrectExercises:        2,
			FreshAttemptedExercises: 2,
			FreshCorrectExercises:   2,
		}
		res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-1", Score: 100})
		if err != nil {
			t.Fatalf("replay #%d failed unexpectedly: %v", i+1, err)
		}
		lastRes = res
	}
	if lastRes.Gamification.XP != 65 {
		t.Errorf("expected daily replay XP cap at 50 (15 initial + 50 replay = 65 total XP), got %d", lastRes.Gamification.XP)
	}
}

func TestCompleteLesson_InactiveTrackReplayBlocked(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	cRepo.LessonProgress["user-1:lesson-1"] = &curriculum.UserLessonProgress{
		ID:          "prog-1",
		UserID:      "user-1",
		LessonID:    "lesson-1",
		IsCompleted: true,
		Score:       100,
		CompletedAt: time.Now().Add(-time.Hour),
	}
	cRepo.UserInactiveLevels["user-1:lvl-n5"] = true
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:          2,
		AttemptedExercises:      2,
		CorrectExercises:        2,
		FreshAttemptedExercises: 2,
		FreshCorrectExercises:   2,
	}

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 50, CurrentLevel: 1},
	}

	uc := curriculum.NewUsecase(cRepo, language.NewMockRepository(), exercise.NewMockRepository(), uRepo, nil)

	_, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    100,
	})
	if !errors.Is(err, curriculum.ErrLessonLocked) {
		t.Fatalf("expected ErrLessonLocked when replaying a completed lesson on an inactive track, got %v", err)
	}
}

func TestCompleteLesson_AwardsBadgesIdempotently(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:          2,
		AttemptedExercises:      2,
		CorrectExercises:        2,
		FreshAttemptedExercises: 2,
		FreshCorrectExercises:   2,
	}

	gRepo := gamification.NewMockRepository()
	gRepo.Badges["first_step"] = &gamification.BadgeDefinition{ID: "first_step", XPReward: 50}
	gRepo.Stats["user-1"] = &user.UserGamificationStats{XP: 0, CurrentLevel: 1}

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 0, CurrentLevel: 1},
	}

	uc := curriculum.NewUsecase(cRepo, language.NewMockRepository(), exercise.NewMockRepository(), uRepo, gRepo)

	// 1. First completion awards "first_step" (+50 XP -> 65 XP total)
	res1, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-1", Score: 100})
	if err != nil {
		t.Fatalf("first completion failed: %v", err)
	}
	if len(res1.AwardedBadges) != 1 || res1.AwardedBadges[0].ID != "first_step" {
		t.Fatalf("expected first_step badge awarded once, got %+v", res1.AwardedBadges)
	}
	if res1.Gamification.XP != 65 {
		t.Errorf("expected 65 XP (15 lesson + 50 badge), got %d", res1.Gamification.XP)
	}

	// 2. Replay with fresh attempts must not re-award "first_step" or grant extra badge XP
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:          2,
		AttemptedExercises:      2,
		CorrectExercises:        2,
		FreshAttemptedExercises: 2,
		FreshCorrectExercises:   2,
	}
	res2, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-1", Score: 100})
	if err != nil {
		t.Fatalf("replay completion failed: %v", err)
	}
	if len(res2.AwardedBadges) != 0 {
		t.Errorf("expected no duplicate badges on replay, got %+v", res2.AwardedBadges)
	}
	if res2.Gamification.XP != 20 {
		t.Errorf("expected 20 XP from lesson repo on replay (15 initial + 5 replay, 0 extra badge XP), got %d", res2.Gamification.XP)
	}
	if gRepo.Stats["user-1"].XP != 50 {
		t.Errorf("expected badge XP in gamification repo to remain 50 (awarded once), got %d", gRepo.Stats["user-1"].XP)
	}
}

func TestGetRoadmap_StaleVersionDoesNotOverwriteInvalidatedCache(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-ko"] = &curriculum.UnitNodeResponse{ID: "unit-ko", LevelID: "lvl-topik1", Title: "KO Basics", OrderIndex: 1}

	lRepo := language.NewMockRepository()
	langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese"}
	langKO := &language.Language{ID: "lang-ko", Code: "ko", Name: "Korean"}
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", Name: "JLPT N5", OrderIndex: 1}
	lvlTopik := &language.ProficiencyLevel{ID: "lvl-topik1", LanguageID: "lang-ko", Code: "TOPIK1", Name: "TOPIK 1", OrderIndex: 1}
	lRepo.Enrollments["enr-ja"] = &language.UserLanguageEnrollment{
		ID: "enr-ja", UserID: "user-1", LanguageID: "lang-ja", CurrentLevelID: &lvlN5.ID, IsActive: true, Language: langJA, CurrentLevel: lvlN5,
	}
	lRepo.Enrollments["enr-ko"] = &language.UserLanguageEnrollment{
		ID: "enr-ko", UserID: "user-1", LanguageID: "lang-ko", CurrentLevelID: &lvlTopik.ID, IsActive: false, Language: langKO, CurrentLevel: lvlTopik,
	}

	cacheRepo := curriculum.NewMockRoadmapCacheRepository()
	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil, cacheRepo)

	// 1. Requesting an enrolled inactive language via explicit LanguageID succeeds
	koRoadmap, err := uc.GetRoadmap(context.Background(), "user-1", &curriculum.GetRoadmapRequest{LanguageID: "lang-ko"})
	if err != nil {
		t.Fatalf("expected enrolled inactive language roadmap via ?language_id to succeed, got %v", err)
	}
	if koRoadmap.Language.ID != "lang-ko" {
		t.Errorf("expected lang-ko roadmap, got %s", koRoadmap.Language.ID)
	}

	// 2. Simulating mid-flight invalidation prevents stale version write
	ver, _ := cacheRepo.GetRoadmapVersion(context.Background(), "user-1")
	_ = cacheRepo.InvalidateRoadmap(context.Background(), "user-1")
	_ = cacheRepo.SetRoadmapIfVersion(context.Background(), "user-1", "lang-ja", ver, koRoadmap, time.Minute)
	if _, exists := cacheRepo.Cache["user-1:lang-ja"]; exists {
		t.Errorf("expected stale SetRoadmapIfVersion write after invalidation to be discarded")
	}
}

func TestGetGrammarPoints_AuthorizationAnd404(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.GrammarPoints["gp-n4"] = &curriculum.GrammarPoint{ID: "gp-n4", LevelID: "lvl-n4", Code: "GP-N4", Title: "Passive"}

	lRepo := language.NewMockRepository()
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
	lvlN4 := &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}
	lRepo.Levels["lvl-n5"] = lvlN5
	lRepo.Levels["lvl-n4"] = lvlN4
	lRepo.Enrollments["enr-ja"] = &language.UserLanguageEnrollment{
		ID: "enr-ja", UserID: "user-1", LanguageID: "lang-ja", CurrentLevelID: &lvlN5.ID, IsActive: true, CurrentLevel: lvlN5,
	}

	uc := curriculum.NewUsecase(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil)

	// Missing level returns ErrProficiencyLevelNotFound (404)
	if _, err := uc.GetGrammarPoints(context.Background(), "user-1", "lvl-missing"); !errors.Is(err, language.ErrProficiencyLevelNotFound) {
		t.Errorf("expected ErrProficiencyLevelNotFound for missing level, got %v", err)
	}

	// Higher level beyond enrollment returns ErrForbidden (403)
	if _, err := uc.GetGrammarPoints(context.Background(), "user-1", "lvl-n4"); !errors.Is(err, apperror.ErrForbidden) {
		t.Errorf("expected ErrForbidden for locked level grammar points, got %v", err)
	}

	// Unenrolled user returns ErrForbidden (403)
	if _, err := uc.GetGrammarPoints(context.Background(), "stranger-user", "lvl-n5"); !errors.Is(err, apperror.ErrForbidden) {
		t.Errorf("expected ErrForbidden for unenrolled user, got %v", err)
	}
}

func TestCompleteLesson_EmptyLessonBlocked(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-empty"] = &curriculum.LessonNodeResponse{ID: "lesson-empty", UnitID: "unit-1", Title: "Empty", XPReward: 15, OrderIndex: 1}
	cRepo.AttemptSummaries["user-1:lesson-empty"] = &curriculum.LessonAttemptSummary{
		TotalExercises: 0,
	}

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 0, CurrentLevel: 1},
	}

	uc := curriculum.NewUsecase(cRepo, language.NewMockRepository(), exercise.NewMockRepository(), uRepo, nil)

	_, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-empty",
		Score:    100,
	})
	var domErr *apperror.DomainError
	if !errors.As(err, &domErr) || domErr.Code != "LESSON_EXERCISES_REQUIRED" {
		t.Fatalf("expected LESSON_EXERCISES_REQUIRED when TotalExercises == 0, got %v", err)
	}
	if gotXP := cRepo.UserXP["user-1"]; gotXP != 0 {
		t.Errorf("expected 0 XP after rejected empty-lesson completion, got %d", gotXP)
	}
}

func TestCompleteLesson_AdvancesLevelWhenAllLevelLessonsCompleted(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Units["unit-n4"] = &curriculum.UnitNodeResponse{ID: "unit-n4", LevelID: "lvl-n4", Title: "N4 Basics", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "L1", XPReward: 15, OrderIndex: 1}
	cRepo.Lessons["lesson-2"] = &curriculum.LessonNodeResponse{ID: "lesson-2", UnitID: "unit-1", Title: "L2", XPReward: 15, OrderIndex: 2}
	for _, lessonID := range []string{"lesson-1", "lesson-2"} {
		cRepo.AttemptSummaries["user-1:"+lessonID] = &curriculum.LessonAttemptSummary{
			TotalExercises:          2,
			AttemptedExercises:      2,
			CorrectExercises:        2,
			FreshAttemptedExercises: 2,
			FreshCorrectExercises:   2,
		}
	}

	lRepo := language.NewMockRepository()
	langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", Name: "JLPT N5", OrderIndex: 1}
	lvlN4 := &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", Name: "JLPT N4", OrderIndex: 2}
	lRepo.Languages["lang-ja"] = langJA
	lRepo.Levels["lvl-n5"] = lvlN5
	lRepo.Levels["lvl-n4"] = lvlN4
	lRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		Language:       langJA,
		CurrentLevel:   lvlN5,
	}

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 0, CurrentLevel: 1},
	}

	cacheRepo := curriculum.NewMockRoadmapCacheRepository()
	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), uRepo, nil, cacheRepo)

	// Completing lesson 1/2 should keep user on N5
	if _, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-1", Score: 100}); err != nil {
		t.Fatalf("lesson-1 completion failed: %v", err)
	}
	if got := *lRepo.Enrollments["enr-1"].CurrentLevelID; got != "lvl-n5" {
		t.Fatalf("expected enrollment to remain at lvl-n5 until all lessons complete, got %s", got)
	}
	if cacheRepo.InvalidateCallCount != 1 {
		t.Fatalf("expected 1 cache invalidation after lesson-1, got %d", cacheRepo.InvalidateCallCount)
	}

	// Completing lesson 2/2 completes the entire level and advances N5 -> N4 + invalidates cache again
	if _, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-2", Score: 100}); err != nil {
		t.Fatalf("lesson-2 completion failed: %v", err)
	}
	if got := *lRepo.Enrollments["enr-1"].CurrentLevelID; got != "lvl-n4" {
		t.Errorf("expected enrollment to advance to lvl-n4 after completing all N5 lessons, got %s", got)
	}
	if cacheRepo.InvalidateCallCount != 3 {
		t.Errorf("expected 3 cache invalidations (lesson-1, lesson-2, level advance), got %d", cacheRepo.InvalidateCallCount)
	}
}

func TestGetRoadmap_UsesSingleVersionLookupAndHandlesCacheError(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-ja"] = &curriculum.UnitNodeResponse{ID: "unit-ja", LevelID: "lvl-n5", Title: "JA Basics", OrderIndex: 1}

	lRepo := language.NewMockRepository()
	langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", Name: "JLPT N5", OrderIndex: 1}
	lRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		Language:       langJA,
		CurrentLevel:   lvlN5,
	}

	cacheRepo := curriculum.NewMockRoadmapCacheRepository()
	cacheRepo.GetRoadmapErr = errors.New("redis connection refused")
	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil, cacheRepo)

	// Redis read error falls back to DB cleanly without caching under bogus fallback version "0"
	res, err := uc.GetRoadmap(context.Background(), "user-1", &curriculum.GetRoadmapRequest{})
	if err != nil {
		t.Fatalf("expected DB fallback to succeed on Redis error, got %v", err)
	}
	if res.Language.ID != "lang-ja" {
		t.Errorf("expected lang-ja roadmap, got %s", res.Language.ID)
	}
	if cacheRepo.GetRoadmapCallCount != 1 {
		t.Errorf("expected 1 single GetRoadmapWithVersion call, got %d", cacheRepo.GetRoadmapCallCount)
	}
	if cacheRepo.SetRoadmapCallCount != 0 {
		t.Errorf("expected SetRoadmapIfVersion NOT to be called when version lookup errored, got %d calls", cacheRepo.SetRoadmapCallCount)
	}

	// Recover Redis: single GetRoadmapWithVersion miss -> SetRoadmapIfVersion, then hit
	cacheRepo.GetRoadmapErr = nil
	if _, err := uc.GetRoadmap(context.Background(), "user-1", &curriculum.GetRoadmapRequest{}); err != nil {
		t.Fatalf("expected healthy GetRoadmap to succeed, got %v", err)
	}
	if cacheRepo.SetRoadmapCallCount != 1 {
		t.Errorf("expected SetRoadmapIfVersion called once on healthy miss, got %d", cacheRepo.SetRoadmapCallCount)
	}
	if _, err := uc.GetRoadmap(context.Background(), "user-1", &curriculum.GetRoadmapRequest{}); err != nil {
		t.Fatalf("expected cached GetRoadmap hit to succeed, got %v", err)
	}
	if cacheRepo.SetRoadmapCallCount != 1 {
		t.Errorf("expected cache hit not to re-write Redis, got %d Set calls", cacheRepo.SetRoadmapCallCount)
	}
}

func TestCompleteLesson_DoesNotAdvanceIntoEmptyNextLevel(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "L1", XPReward: 15, OrderIndex: 1}
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     2,
		AttemptedExercises: 2,
		CorrectExercises:   2,
	}

	lRepo := language.NewMockRepository()
	langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", Name: "JLPT N5", OrderIndex: 1}
	lvlN4 := &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", Name: "JLPT N4", OrderIndex: 2}
	lRepo.Languages["lang-ja"] = langJA
	lRepo.Levels["lvl-n5"] = lvlN5
	lRepo.Levels["lvl-n4"] = lvlN4
	lRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		Language:       langJA,
		CurrentLevel:   lvlN5,
	}

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 0, CurrentLevel: 1},
	}

	uc := curriculum.NewUsecase(cRepo, lRepo, exercise.NewMockRepository(), uRepo, nil)
	if _, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-1", Score: 100}); err != nil {
		t.Fatalf("lesson completion failed: %v", err)
	}
	if got := *lRepo.Enrollments["enr-1"].CurrentLevelID; got != "lvl-n5" {
		t.Errorf("expected user to stay at lvl-n5 when lvl-n4 has no curriculum units, got %s", got)
	}
}

func TestDiagnosticExamUnitExcludedAndNonBlocking(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-placement"] = &curriculum.UnitNodeResponse{ID: "unit-placement", LevelID: "lvl-n5", Title: "Adaptive Placement", UnitType: "diagnostic_exam", OrderIndex: 0}
	cRepo.Lessons["lesson-placement"] = &curriculum.LessonNodeResponse{ID: "lesson-placement", UnitID: "unit-placement", Title: "Placement", XPReward: 50, OrderIndex: 1}
	cRepo.Units["unit-0"] = &curriculum.UnitNodeResponse{ID: "unit-0", LevelID: "lvl-n5", Title: "Unit 0", UnitType: "curriculum", OrderIndex: 0}
	cRepo.Lessons["lesson-0"] = &curriculum.LessonNodeResponse{ID: "lesson-0", UnitID: "unit-0", Title: "Hiragana", XPReward: 15, OrderIndex: 1}
	cRepo.Units["unit-2"] = &curriculum.UnitNodeResponse{ID: "unit-2", LevelID: "lvl-n5", Title: "Unit 2 Exam", UnitType: "diagnostic_exam", OrderIndex: 2}
	cRepo.Lessons["lesson-exam"] = &curriculum.LessonNodeResponse{ID: "lesson-exam", UnitID: "unit-2", Title: "Unit 2 Evaluation", XPReward: 30, OrderIndex: 1}
	cRepo.Units["unit-3"] = &curriculum.UnitNodeResponse{ID: "unit-3", LevelID: "lvl-n5", Title: "Unit 3", UnitType: "curriculum", OrderIndex: 3}
	cRepo.Lessons["lesson-3"] = &curriculum.LessonNodeResponse{ID: "lesson-3", UnitID: "unit-3", Title: "Numbers", XPReward: 20, OrderIndex: 1}
	cRepo.AttemptSummaries["user-1:lesson-0"] = &curriculum.LessonAttemptSummary{TotalExercises: 2, AttemptedExercises: 2, CorrectExercises: 2}
	cRepo.AttemptSummaries["user-1:lesson-exam"] = &curriculum.LessonAttemptSummary{TotalExercises: 2, AttemptedExercises: 2, CorrectExercises: 2}

	lRepo := language.NewMockRepository()
	langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", Name: "JLPT N5", OrderIndex: 1}
	lRepo.Languages["lang-ja"] = langJA
	lRepo.Levels["lvl-n5"] = lvlN5
	lRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		Language:       langJA,
		CurrentLevel:   lvlN5,
	}

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 0, CurrentLevel: 1},
	}

	uc := curriculum.NewUsecase(cRepo, lRepo, exercise.NewMockRepository(), uRepo, nil)

	// 1. Roadmap excludes both placement and unit-2 diagnostic_exam nodes
	roadmap, err := uc.GetRoadmap(context.Background(), "user-1", &curriculum.GetRoadmapRequest{})
	if err != nil {
		t.Fatalf("GetRoadmap failed: %v", err)
	}
	if len(roadmap.Units) != 2 || roadmap.Units[0].ID != "unit-0" || roadmap.Units[1].ID != "unit-3" {
		t.Fatalf("expected only curriculum units [unit-0, unit-3], got %+v", roadmap.Units)
	}
	if !roadmap.Units[0].IsUnlocked || !roadmap.Units[0].Lessons[0].IsUnlocked {
		t.Errorf("expected unit-0 / lesson-0 to be unlocked without waiting on placement exam")
	}

	// 2. Diagnostic exam lessons are rejected as non-curriculum lessons
	if _, err := uc.GetLessonDetail(context.Background(), "user-1", "lesson-exam"); !errors.Is(err, curriculum.ErrLessonNotFound) {
		t.Errorf("expected ErrLessonNotFound when fetching diagnostic_exam lesson, got %v", err)
	}
	if _, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-exam", Score: 100}); !errors.Is(err, curriculum.ErrLessonNotFound) {
		t.Errorf("expected ErrLessonNotFound when completing diagnostic_exam lesson, got %v", err)
	}

	// 3. Completing unit-0 unlocks unit-3 directly without unit-2 exam deadlocking progression
	if _, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-0", Score: 100}); err != nil {
		t.Fatalf("completing lesson-0 failed: %v", err)
	}
	if _, err := uc.GetLessonDetail(context.Background(), "user-1", "lesson-3"); err != nil {
		t.Fatalf("expected lesson-3 in Unit 3 to unlock immediately after Unit 0 completion, got %v", err)
	}
}

func TestGetRoadmap_InactiveTrackMarksNodesLocked(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-ja"] = &curriculum.UnitNodeResponse{ID: "unit-ja", LevelID: "lvl-n5", Title: "JA Basics", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Lessons["lesson-ja-1"] = &curriculum.LessonNodeResponse{ID: "lesson-ja-1", UnitID: "unit-ja", Title: "L1", OrderIndex: 1}
	cRepo.LessonProgress["user-1:lesson-ja-1"] = &curriculum.UserLessonProgress{UserID: "user-1", LessonID: "lesson-ja-1", IsCompleted: true, Score: 100}
	cRepo.Lessons["lesson-ja-2"] = &curriculum.LessonNodeResponse{ID: "lesson-ja-2", UnitID: "unit-ja", Title: "L2", OrderIndex: 2}

	lRepo := language.NewMockRepository()
	langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", Name: "JLPT N5", OrderIndex: 1}
	lRepo.Languages["lang-ja"] = langJA
	lRepo.Levels["lvl-n5"] = lvlN5
	lRepo.Enrollments["enr-ja"] = &language.UserLanguageEnrollment{
		ID:             "enr-ja",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       false,
		Language:       langJA,
		CurrentLevel:   lvlN5,
	}

	cacheRepo := curriculum.NewMockRoadmapCacheRepository()
	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil, cacheRepo)

	res, err := uc.GetRoadmap(context.Background(), "user-1", &curriculum.GetRoadmapRequest{LanguageID: "lang-ja"})
	if err != nil {
		t.Fatalf("expected inactive roadmap query to succeed, got %v", err)
	}
	if res.CurrentLessonID != nil {
		t.Errorf("expected nil CurrentLessonID for inactive track, got %v", *res.CurrentLessonID)
	}
	for _, u := range res.Units {
		if u.IsUnlocked {
			t.Errorf("expected unit %s to report IsUnlocked=false for inactive track", u.ID)
		}
		for _, l := range u.Lessons {
			if l.IsUnlocked {
				t.Errorf("expected lesson %s to report IsUnlocked=false for inactive track", l.ID)
			}
		}
	}
	if cacheRepo.SetRoadmapCallCount != 0 {
		t.Errorf("expected inactive track roadmap not to populate shared active cache, got %d Set calls", cacheRepo.SetRoadmapCallCount)
	}
}

func TestGetRoadmap_CorruptCacheSelfHeals(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-ja"] = &curriculum.UnitNodeResponse{ID: "unit-ja", LevelID: "lvl-n5", Title: "JA Basics", UnitType: "curriculum", OrderIndex: 1}

	lRepo := language.NewMockRepository()
	langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", Name: "JLPT N5", OrderIndex: 1}
	lRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		Language:       langJA,
		CurrentLevel:   lvlN5,
	}

	cacheRepo := curriculum.NewMockRoadmapCacheRepository()
	cacheRepo.Cache["user-1:lang-ja"] = []byte("{corrupt-json")
	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil, cacheRepo)

	res, err := uc.GetRoadmap(context.Background(), "user-1", &curriculum.GetRoadmapRequest{})
	if err != nil {
		t.Fatalf("expected corrupt cache to self-heal via DB fallback, got %v", err)
	}
	if len(res.Units) != 1 || res.Units[0].ID != "unit-ja" {
		t.Errorf("unexpected roadmap after corrupt cache recovery: %+v", res.Units)
	}
	if cacheRepo.SetRoadmapCallCount != 1 {
		t.Errorf("expected SetRoadmapIfVersion to overwrite corrupt cache key once, got %d", cacheRepo.SetRoadmapCallCount)
	}
}

type canonicalLookupRepo struct {
	*curriculum.MockRepository
	unlockedCheckedID string
}

func (r *canonicalLookupRepo) GetLessonByID(ctx context.Context, id string, userID string) (*curriculum.LessonDetailResponse, error) {
	if id == "LESSON-1" {
		return r.MockRepository.GetLessonByID(ctx, "lesson-1", userID)
	}
	return r.MockRepository.GetLessonByID(ctx, id, userID)
}

func (r *canonicalLookupRepo) IsLessonUnlocked(ctx context.Context, userID string, lessonID string) (bool, error) {
	r.unlockedCheckedID = lessonID
	return r.MockRepository.IsLessonUnlocked(ctx, userID, lessonID)
}

func TestGetLessonDetail_NormalizesCanonicalLessonID(t *testing.T) {
	baseRepo := curriculum.NewMockRepository()
	baseRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", UnitType: "curriculum", OrderIndex: 1}
	baseRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	baseRepo.GrammarPoints["gp-2"] = &curriculum.GrammarPoint{ID: "gp-2", Title: "Point B", OrderIndex: 2}
	baseRepo.GrammarPoints["gp-1"] = &curriculum.GrammarPoint{ID: "gp-1", Title: "Point A", OrderIndex: 1}
	baseRepo.LessonGrammarPoints["lesson-1"] = []string{"gp-2", "gp-1"}

	cRepo := &canonicalLookupRepo{MockRepository: baseRepo}
	eRepo := exercise.NewMockRepository()
	canonLessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID: "ex-1", LessonID: &canonLessonID, Prompt: "Q1", CorrectAnswer: "A",
	}

	uc := curriculum.NewUsecase(cRepo, language.NewMockRepository(), eRepo, user.NewMockRepository(), nil)
	res, err := uc.GetLessonDetail(context.Background(), "user-1", "LESSON-1")
	if err != nil {
		t.Fatalf("expected GetLessonDetail with uppercase ID to succeed, got %v", err)
	}
	if cRepo.unlockedCheckedID != "lesson-1" {
		t.Errorf("expected canonical lesson ID 'lesson-1' passed to IsLessonUnlocked, got %q", cRepo.unlockedCheckedID)
	}
	if len(res.Exercises) != 1 || res.Exercises[0].ID != "ex-1" {
		t.Errorf("expected exercises looked up via canonical lesson ID, got %+v", res.Exercises)
	}
	if len(res.GrammarPoints) != 2 || res.GrammarPoints[0].ID != "gp-1" || res.GrammarPoints[1].ID != "gp-2" {
		t.Errorf("expected grammar points filtered and sorted by order_index ASC, got %+v", res.GrammarPoints)
	}
}

func TestRecordLessonCompletionTx_BlocksSkippedPrerequisiteDirectly(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	cRepo.Lessons["lesson-2"] = &curriculum.LessonNodeResponse{ID: "lesson-2", UnitID: "unit-1", Title: "Lesson 2", XPReward: 15, OrderIndex: 2}
	cRepo.AttemptSummaries["user-1:lesson-2"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     2,
		AttemptedExercises: 2,
		CorrectExercises:   2,
	}

	err := cRepo.RecordLessonCompletionTx(context.Background(), &curriculum.LessonCompletionPayload{
		Progress: &curriculum.UserLessonProgress{
			UserID:      "user-1",
			LessonID:    "lesson-2",
			IsCompleted: true,
			Score:       100,
			CompletedAt: time.Now(),
		},
		XPEarned: 15,
	})
	if !errors.Is(err, curriculum.ErrLessonLocked) {
		t.Fatalf("expected RecordLessonCompletionTx to reject skipped prerequisite with ErrLessonLocked, got %v", err)
	}
}

func TestCalculateRoadmapUnlocks_ComputesCountsWithoutPreAggregation(t *testing.T) {
	helper := curriculum.NewHelper()
	units := []curriculum.UnitNodeResponse{
		{
			ID:       "unit-1",
			UnitType: "curriculum",
			Lessons: []curriculum.LessonNodeResponse{
				{ID: "l-1", IsCompleted: true},
				{ID: "l-2", IsCompleted: false},
			},
		},
		{
			ID:       "unit-2",
			UnitType: "curriculum",
			Lessons: []curriculum.LessonNodeResponse{
				{ID: "l-3", IsCompleted: false},
			},
		},
	}

	out, total, completed, _, currentID := helper.CalculateRoadmapUnlocks(units)
	if total != 3 || completed != 1 {
		t.Fatalf("expected totals 3/1, got %d/%d", total, completed)
	}
	if out[0].TotalLessons != 2 || out[0].CompletedLessons != 1 {
		t.Errorf("expected unit-1 counts computed dynamically as 2/1, got %d/%d", out[0].TotalLessons, out[0].CompletedLessons)
	}
	if out[1].IsUnlocked {
		t.Errorf("expected unit-2 to remain locked while unit-1 has incomplete lessons even when TotalLessons started at 0")
	}
	if currentID == nil || *currentID != "l-2" {
		t.Errorf("expected currentLessonID 'l-2', got %v", currentID)
	}
}

type syncingUserRepo struct {
	*user.MockRepository
	postBadgeXP int
	calls       int
}

func (r *syncingUserRepo) GetByID(ctx context.Context, id string) (*user.User, error) {
	u, err := r.MockRepository.GetByID(ctx, id)
	if err != nil || u == nil {
		return u, err
	}
	r.calls++
	if r.calls >= 2 && r.postBadgeXP > u.XP {
		copyU := *u
		copyU.XP = r.postBadgeXP
		return &copyU, nil
	}
	return u, nil
}

func TestCompleteLesson_DynamicNextLessonAndAuthoritativeXPSync(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	cRepo.Lessons["lesson-2"] = &curriculum.LessonNodeResponse{ID: "lesson-2", UnitID: "unit-1", Title: "Lesson 2", XPReward: 20, OrderIndex: 2}
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:          2,
		AttemptedExercises:      2,
		CorrectExercises:        2,
		FreshAttemptedExercises: 2,
		FreshCorrectExercises:   2,
	}

	gRepo := gamification.NewMockRepository()
	gRepo.Badges["first_step"] = &gamification.BadgeDefinition{ID: "first_step", XPReward: 50}
	gRepo.Stats["user-1"] = &user.UserGamificationStats{XP: 0, CurrentLevel: 1}

	baseUserRepo := user.NewMockRepository()
	baseUserRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 120, CurrentLevel: 2},
	}
	uRepo := &syncingUserRepo{MockRepository: baseUserRepo, postBadgeXP: 250}

	uc := curriculum.NewUsecase(cRepo, language.NewMockRepository(), exercise.NewMockRepository(), uRepo, gRepo)
	res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    100,
	})
	if err != nil {
		t.Fatalf("expected CompleteLesson to succeed, got %v", err)
	}
	if res.UnlockedNextLessonID == nil || *res.UnlockedNextLessonID != "lesson-2" {
		t.Errorf("expected dynamic UnlockedNextLessonID 'lesson-2', got %v", res.UnlockedNextLessonID)
	}
	if res.Gamification.XP != 250 || res.Gamification.CurrentLevel != 3 {
		t.Errorf("expected authoritative XP/level synced from userRepo after badge award (250 / lvl 3), got %d / lvl %d", res.Gamification.XP, res.Gamification.CurrentLevel)
	}
}




