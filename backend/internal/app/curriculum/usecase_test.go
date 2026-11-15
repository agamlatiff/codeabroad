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

func TestGetCurriculum_Success(t *testing.T) {
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
	res, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{LanguageID: "lang-ja"})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(res.Units) != 2 {
		t.Fatalf("expected 2 units, got %d", len(res.Units))
	}
	if !res.Units[0].IsUnlocked || !res.Units[1].IsUnlocked {
		t.Errorf("expected both units to be unlocked, got unit1=%v, unit2=%v", res.Units[0].IsUnlocked, res.Units[1].IsUnlocked)
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
	cRepo.UserXP["user-1"] = 20

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
	cRepo.UserXP["user-1"] = 100

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
	cRepo.UserXP["user-1"] = 100

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
	cRepo.MissingUsers["non-existent"] = true

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

func TestGetCurriculum_RedisCacheHitAndMiss(t *testing.T) {
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
	cacheRepo := curriculum.NewMockCurriculumCacheRepository()

	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, eRepo, uRepo, nil, cacheRepo)

	// First call: Cache miss -> queries DB and populates cache
	res1, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{LanguageID: "lang-ja"})
	if err != nil {
		t.Fatalf("first GetCurriculum failed: %v", err)
	}
	if res1 == nil || len(res1.Units) != 1 {
		t.Fatalf("expected 1 unit, got %v", res1)
	}
	if cacheRepo.SetCurriculumCallCount == 0 {
		t.Errorf("expected SetCurriculum to be called on cache miss")
	}

	// Mutate DB repo to verify second call serves strictly from cache
	delete(cRepo.Units, "unit-1")

	res2, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{LanguageID: "lang-ja"})
	if err != nil {
		t.Fatalf("second GetCurriculum failed: %v", err)
	}
	if len(res2.Units) != 1 {
		t.Errorf("expected cached curriculum to retain 1 unit, got %d", len(res2.Units))
	}
	if cacheRepo.GetCurriculumCallCount < 2 {
		t.Errorf("expected GetCurriculum cache calls >= 2, got %d", cacheRepo.GetCurriculumCallCount)
	}
}

func TestCompleteLesson_InvalidatesCurriculumCache(t *testing.T) {
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
	cacheRepo := curriculum.NewMockCurriculumCacheRepository()

	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, eRepo, uRepo, nil, cacheRepo)

	_, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    90,
	})
	if err != nil {
		t.Fatalf("CompleteLesson failed: %v", err)
	}
	if cacheRepo.InvalidateCallCount != 1 {
		t.Errorf("expected InvalidateCurriculum to be called once, got %d", cacheRepo.InvalidateCallCount)
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

func TestGetCurriculum_LanguageSwitch_NoCacheCollision(t *testing.T) {
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

	cacheRepo := curriculum.NewMockCurriculumCacheRepository()
	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil, cacheRepo)

	// 1. Default GetCurriculum (empty LanguageID) caches under canonical "lang-ja", NOT ""
	res1, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{})
	if err != nil {
		t.Fatalf("first GetCurriculum failed: %v", err)
	}
	if res1.Language.ID != "lang-ja" {
		t.Fatalf("expected lang-ja, got %s", res1.Language.ID)
	}
	if _, leakedEmptyKey := cacheRepo.Cache["user-1:"]; leakedEmptyKey {
		t.Fatalf("expected no cache entry under empty language key user-1:")
	}

	// 2. Switch active language to Korean and call GetCurriculum with empty LanguageID again
	_ = lRepo.SetActiveLanguage(context.Background(), "user-1", "lang-ko")
	res2, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{})
	if err != nil {
		t.Fatalf("second GetCurriculum after language switch failed: %v", err)
	}
	if res2.Language.ID != "lang-ko" {
		t.Errorf("expected Korean curriculum after language switch without cache collision, got %s", res2.Language.ID)
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
	cRepo.UserGems["user-1"] = 25

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

func TestGetCurriculum_StaleVersionDoesNotOverwriteInvalidatedCache(t *testing.T) {
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

	cacheRepo := curriculum.NewMockCurriculumCacheRepository()
	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil, cacheRepo)

	// 1. Requesting an enrolled inactive language via explicit LanguageID succeeds
	koCurriculum, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{LanguageID: "lang-ko"})
	if err != nil {
		t.Fatalf("expected enrolled inactive language curriculum via ?language_id to succeed, got %v", err)
	}
	if koCurriculum.Language.ID != "lang-ko" {
		t.Errorf("expected lang-ko curriculum, got %s", koCurriculum.Language.ID)
	}

	// 2. Simulating mid-flight invalidation prevents stale version write
	ver, _ := cacheRepo.GetCurriculumVersion(context.Background(), "user-1")
	_ = cacheRepo.InvalidateCurriculum(context.Background(), "user-1")
	_ = cacheRepo.SetCurriculumIfVersion(context.Background(), "user-1", "lang-ja", ver, koCurriculum, time.Minute)
	if _, exists := cacheRepo.Cache["user-1:lang-ja"]; exists {
		t.Errorf("expected stale SetCurriculumIfVersion write after invalidation to be discarded")
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
	cRepo.Lessons["lesson-n4-1"] = &curriculum.LessonNodeResponse{ID: "lesson-n4-1", UnitID: "unit-n4", Title: "N4 L1", XPReward: 20, OrderIndex: 1}
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

	cacheRepo := curriculum.NewMockCurriculumCacheRepository()
	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), uRepo, nil, cacheRepo)

	// Completing lesson 1/2 should keep user on N5 and point to lesson-2
	res1, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-1", Score: 100})
	if err != nil {
		t.Fatalf("lesson-1 completion failed: %v", err)
	}
	if res1.UnlockedNextLessonID == nil || *res1.UnlockedNextLessonID != "lesson-2" {
		t.Errorf("expected intra-level UnlockedNextLessonID 'lesson-2', got %v", res1.UnlockedNextLessonID)
	}
	if got := *lRepo.Enrollments["enr-1"].CurrentLevelID; got != "lvl-n5" {
		t.Fatalf("expected enrollment to remain at lvl-n5 until all lessons complete, got %s", got)
	}
	if cacheRepo.InvalidateCallCount != 1 {
		t.Fatalf("expected 1 cache invalidation after lesson-1, got %d", cacheRepo.InvalidateCallCount)
	}

	// Completing lesson 2/2 completes the entire level, advances N5 -> N4, and resolves first N4 lesson
	res2, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-2", Score: 100})
	if err != nil {
		t.Fatalf("lesson-2 completion failed: %v", err)
	}
	if res2.UnlockedNextLessonID == nil || *res2.UnlockedNextLessonID != "lesson-n4-1" {
		t.Errorf("expected cross-level UnlockedNextLessonID 'lesson-n4-1' on level-up, got %v", res2.UnlockedNextLessonID)
	}
	if got := *lRepo.Enrollments["enr-1"].CurrentLevelID; got != "lvl-n4" {
		t.Errorf("expected enrollment to advance to lvl-n4 after completing all N5 lessons, got %s", got)
	}
	if cacheRepo.InvalidateCallCount != 2 {
		t.Errorf("expected 2 cache invalidations (1 after lesson-1, 1 single invalidation after lesson-2 + level advance), got %d", cacheRepo.InvalidateCallCount)
	}
}

func TestGetCurriculum_UsesSingleVersionLookupAndHandlesCacheError(t *testing.T) {
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

	cacheRepo := curriculum.NewMockCurriculumCacheRepository()
	cacheRepo.GetCurriculumErr = errors.New("redis connection refused")
	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil, cacheRepo)

	// Redis read error falls back to DB cleanly without caching under bogus fallback version "0"
	res, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{})
	if err != nil {
		t.Fatalf("expected DB fallback to succeed on Redis error, got %v", err)
	}
	if res.Language.ID != "lang-ja" {
		t.Errorf("expected lang-ja curriculum, got %s", res.Language.ID)
	}
	if cacheRepo.GetVersionCallCount != 1 {
		t.Errorf("expected 1 single pre-DB GetCurriculumVersion call, got %d", cacheRepo.GetVersionCallCount)
	}
	if cacheRepo.GetCurriculumCallCount != 0 {
		t.Errorf("expected GetCurriculumWithVersion skipped after version lookup error, got %d", cacheRepo.GetCurriculumCallCount)
	}
	if cacheRepo.SetCurriculumCallCount != 0 {
		t.Errorf("expected SetCurriculumIfVersion NOT to be called when version lookup errored, got %d calls", cacheRepo.SetCurriculumCallCount)
	}

	// Recover Redis: single GetCurriculumWithVersion miss -> SetCurriculumIfVersion, then hit
	cacheRepo.GetCurriculumErr = nil
	if _, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{}); err != nil {
		t.Fatalf("expected healthy GetCurriculum to succeed, got %v", err)
	}
	if cacheRepo.SetCurriculumCallCount != 1 {
		t.Errorf("expected SetCurriculumIfVersion called once on healthy miss, got %d", cacheRepo.SetCurriculumCallCount)
	}
	if _, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{}); err != nil {
		t.Fatalf("expected cached GetCurriculum hit to succeed, got %v", err)
	}
	if cacheRepo.SetCurriculumCallCount != 1 {
		t.Errorf("expected cache hit not to re-write Redis, got %d Set calls", cacheRepo.SetCurriculumCallCount)
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

	// 1. Curriculum excludes both placement and unit-2 diagnostic_exam nodes
	res, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{})
	if err != nil {
		t.Fatalf("GetCurriculum failed: %v", err)
	}
	if len(res.Units) != 2 || res.Units[0].ID != "unit-0" || res.Units[1].ID != "unit-3" {
		t.Fatalf("expected only curriculum units [unit-0, unit-3], got %+v", res.Units)
	}
	if !res.Units[0].IsUnlocked || !res.Units[0].Lessons[0].IsUnlocked {
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

func TestGetCurriculum_InactiveTrackMarksNodesLocked(t *testing.T) {
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

	cacheRepo := curriculum.NewMockCurriculumCacheRepository()
	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil, cacheRepo)

	res, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{LanguageID: "lang-ja"})
	if err != nil {
		t.Fatalf("expected inactive curriculum query to succeed, got %v", err)
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
	if cacheRepo.SetCurriculumCallCount != 0 {
		t.Errorf("expected inactive track curriculum not to populate shared active cache, got %d Set calls", cacheRepo.SetCurriculumCallCount)
	}
}

func TestGetCurriculum_CorruptCacheSelfHeals(t *testing.T) {
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

	cacheRepo := curriculum.NewMockCurriculumCacheRepository()
	cacheRepo.Cache["user-1:lang-ja"] = []byte("{corrupt-json")
	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil, cacheRepo)

	res, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{})
	if err != nil {
		t.Fatalf("expected corrupt cache to self-heal via DB fallback, got %v", err)
	}
	if len(res.Units) != 1 || res.Units[0].ID != "unit-ja" {
		t.Errorf("unexpected curriculum after corrupt cache recovery: %+v", res.Units)
	}
	if cacheRepo.SetCurriculumCallCount != 1 {
		t.Errorf("expected SetCurriculumIfVersion to overwrite corrupt cache key once, got %d", cacheRepo.SetCurriculumCallCount)
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

func TestCalculateCurriculumUnlocks_ComputesCountsWithoutPreAggregation(t *testing.T) {
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

	out, total, completed, _, currentID := helper.CalculateCurriculumUnlocks(units)
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
	if r.calls >= 1 && r.postBadgeXP > u.XP {
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

func TestRecordLessonCompletionTx_DerivesAuthoritativeXPAndMetadataLessonID(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "L1", XPReward: 25, OrderIndex: 1}
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:          2,
		AttemptedExercises:      2,
		CorrectExercises:        2,
		FreshAttemptedExercises: 2,
		FreshCorrectExercises:   2,
	}

	payload := &curriculum.LessonCompletionPayload{
		Progress: &curriculum.UserLessonProgress{
			UserID:      "user-1",
			LessonID:    "lesson-1",
			IsCompleted: true,
			Score:       100,
			CompletedAt: time.Now(),
		},
		XPEarned: 999,
		NewXP:    999,
	}
	if err := cRepo.RecordLessonCompletionTx(context.Background(), payload); err != nil {
		t.Fatalf("expected direct tx completion to succeed, got %v", err)
	}
	if payload.XPEarned != 25 || payload.NewXP != 25 {
		t.Errorf("expected authoritative first-completion XP 25 overriding caller 999, got XPEarned=%d NewXP=%d", payload.XPEarned, payload.NewXP)
	}
	if payload.Metadata["lesson_id"] != "lesson-1" {
		t.Errorf("expected metadata['lesson_id'] normalized to 'lesson-1', got %v", payload.Metadata["lesson_id"])
	}
	if payload.ActivityType != "lesson_completed" {
		t.Errorf("expected default ActivityType 'lesson_completed', got %q", payload.ActivityType)
	}
}

type trackingGamificationRepo struct {
	*gamification.MockRepository
	getBadgesCalls int
}

func (r *trackingGamificationRepo) GetBadges(ctx context.Context) ([]gamification.BadgeDefinition, error) {
	r.getBadgesCalls++
	return r.MockRepository.GetBadges(ctx)
}

func TestCompleteLesson_SkipsGetBadgesAndDoesNotAdvanceIntoEmptyLessonUnit(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Units["unit-n4"] = &curriculum.UnitNodeResponse{ID: "unit-n4", LevelID: "lvl-n4", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "L1", XPReward: 15, OrderIndex: 1}
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     2,
		AttemptedExercises: 2,
		CorrectExercises:   2,
	}

	lRepo := language.NewMockRepository()
	langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
	lvlN4 := &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}
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

	gRepo := &trackingGamificationRepo{MockRepository: gamification.NewMockRepository()}
	gRepo.UserBadges["user-1"] = []gamification.UserBadge{{UserID: "user-1", BadgeKey: "first_step"}}

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 0, CurrentLevel: 1},
	}

	uc := curriculum.NewUsecase(cRepo, lRepo, exercise.NewMockRepository(), uRepo, gRepo)
	if _, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    100,
	}); err != nil {
		t.Fatalf("expected CompleteLesson to succeed, got %v", err)
	}
	if gRepo.getBadgesCalls != 0 {
		t.Errorf("expected GetBadges NOT to be queried when all candidate badges are already owned, got %d calls", gRepo.getBadgesCalls)
	}
	if got := *lRepo.Enrollments["enr-1"].CurrentLevelID; got != "lvl-n5" {
		t.Errorf("expected enrollment to remain on lvl-n5 when lvl-n4 unit has zero lessons, got %s", got)
	}
}

func TestCompleteLesson_FailedReplayEarnsZeroXP(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1, IsCompleted: true}
	cRepo.LessonProgress["user-1:lesson-1"] = &curriculum.UserLessonProgress{
		UserID:      "user-1",
		LessonID:    "lesson-1",
		IsCompleted: true,
		Score:       90,
	}
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:          5,
		AttemptedExercises:      5,
		CorrectExercises:        5,
		FreshAttemptedExercises: 5,
		FreshCorrectExercises:   2, // 40% < 60%
	}
	cRepo.UserXP["user-1"] = 100

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 100, CurrentLevel: 2, Streak: 1},
	}

	uc := curriculum.NewUsecase(cRepo, language.NewMockRepository(), exercise.NewMockRepository(), uRepo, nil)

	// 1. Failed replay (40%) with forged request score=100 must earn 0 XP and preserve high score 90
	res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    100,
	})
	if err != nil {
		t.Fatalf("expected failed replay to complete cleanly with 0 XP, got %v", err)
	}
	if res.Gamification.XP != 100 || cRepo.UserXP["user-1"] != 100 {
		t.Errorf("expected 0 XP earned on 40%% failed replay (stay at 100 XP), got resp=%d repo=%d", res.Gamification.XP, cRepo.UserXP["user-1"])
	}
	if res.Progress.Score != 90 {
		t.Errorf("expected preserved high score 90, got %d", res.Progress.Score)
	}

	// 2. Failed replay (0%) must also earn 0 XP
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:          5,
		AttemptedExercises:      5,
		CorrectExercises:        5,
		FreshAttemptedExercises: 5,
		FreshCorrectExercises:   0,
	}
	resZero, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    0,
	})
	if err != nil {
		t.Fatalf("expected 0%% replay to complete cleanly with 0 XP, got %v", err)
	}
	if resZero.Gamification.XP != 100 || cRepo.UserXP["user-1"] != 100 {
		t.Errorf("expected 0 XP earned on 0%% failed replay (stay at 100 XP), got resp=%d repo=%d", resZero.Gamification.XP, cRepo.UserXP["user-1"])
	}

	// 3. Subsequent passing replay (60%) earns 5 practice XP
	cRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:          5,
		AttemptedExercises:      5,
		CorrectExercises:        5,
		FreshAttemptedExercises: 5,
		FreshCorrectExercises:   3, // 60%
	}
	resPass, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    60,
	})
	if err != nil {
		t.Fatalf("expected 60%% passing replay to succeed, got %v", err)
	}
	if resPass.Gamification.XP != 105 || cRepo.UserXP["user-1"] != 105 {
		t.Errorf("expected 105 XP after passing replay (+5 XP), got resp=%d repo=%d", resPass.Gamification.XP, cRepo.UserXP["user-1"])
	}
}

type orderTrackingCacheRepo struct {
	*curriculum.MockCurriculumCacheRepository
	onInvalidate func()
}

func (r *orderTrackingCacheRepo) InvalidateCurriculum(ctx context.Context, userID string) error {
	if r.onInvalidate != nil {
		r.onInvalidate()
	}
	return r.MockCurriculumCacheRepository.InvalidateCurriculum(ctx, userID)
}

type fixedOrderLangRepo struct {
	*language.MockRepository
	orderedLevels []language.ProficiencyLevel
}

func (r *fixedOrderLangRepo) GetLevelsByLanguageID(ctx context.Context, languageID string) ([]language.ProficiencyLevel, error) {
	if r.GetLevelsErr != nil {
		return nil, r.GetLevelsErr
	}
	return r.orderedLevels, nil
}

func TestCompleteLesson_SingleInvalidationAfterAdvance_AndDeterministicLevelSort(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-n5"] = &curriculum.UnitNodeResponse{ID: "unit-n5", LevelID: "lvl-n5", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Units["unit-n4-b"] = &curriculum.UnitNodeResponse{ID: "unit-n4-b", LevelID: "lvl-n4-b", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Units["unit-n4-a"] = &curriculum.UnitNodeResponse{ID: "unit-n4-a", LevelID: "lvl-n4-a", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Lessons["lesson-n5"] = &curriculum.LessonNodeResponse{ID: "lesson-n5", UnitID: "unit-n5", Title: "N5 Final", XPReward: 15, OrderIndex: 1}
	cRepo.Lessons["lesson-n4-b"] = &curriculum.LessonNodeResponse{ID: "lesson-n4-b", UnitID: "unit-n4-b", Title: "N4 B", XPReward: 20, OrderIndex: 1}
	cRepo.Lessons["lesson-n4-a"] = &curriculum.LessonNodeResponse{ID: "lesson-n4-a", UnitID: "unit-n4-a", Title: "N4 A", XPReward: 20, OrderIndex: 1}
	cRepo.AttemptSummaries["user-1:lesson-n5"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     2,
		AttemptedExercises: 2,
		CorrectExercises:   2,
	}

	baseLangRepo := language.NewMockRepository()
	langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
	lvlN4B := &language.ProficiencyLevel{ID: "lvl-n4-b", LanguageID: "lang-ja", Code: "N4B", OrderIndex: 2}
	lvlN4A := &language.ProficiencyLevel{ID: "lvl-n4-a", LanguageID: "lang-ja", Code: "N4A", OrderIndex: 2}
	baseLangRepo.Languages["lang-ja"] = langJA
	baseLangRepo.Levels["lvl-n5"] = lvlN5
	baseLangRepo.Levels["lvl-n4-b"] = lvlN4B
	baseLangRepo.Levels["lvl-n4-a"] = lvlN4A
	baseLangRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		Language:       langJA,
		CurrentLevel:   lvlN5,
	}
	lRepo := &fixedOrderLangRepo{
		MockRepository: baseLangRepo,
		orderedLevels:  []language.ProficiencyLevel{*lvlN4B, *lvlN4A, *lvlN5},
	}

	uRepo := user.NewMockRepository()
	uRepo.Users["user-1"] = &user.User{
		UserAccount:           user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{XP: 0, CurrentLevel: 1},
	}

	baseCache := curriculum.NewMockCurriculumCacheRepository()
	levelAtInvalidate := ""
	cacheRepo := &orderTrackingCacheRepo{
		MockCurriculumCacheRepository: baseCache,
		onInvalidate: func() {
			if enr := baseLangRepo.Enrollments["enr-1"]; enr != nil && enr.CurrentLevelID != nil {
				levelAtInvalidate = *enr.CurrentLevelID
			}
		},
	}

	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), uRepo, nil, cacheRepo)
	res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-n5",
		Score:    100,
	})
	if err != nil {
		t.Fatalf("CompleteLesson failed: %v", err)
	}
	if res.UnlockedNextLessonID == nil || *res.UnlockedNextLessonID != "lesson-n4-a" {
		t.Errorf("expected deterministic cross-level UnlockedNextLessonID 'lesson-n4-a', got %v", res.UnlockedNextLessonID)
	}

	if baseCache.InvalidateCallCount != 1 {
		t.Errorf("expected exactly 1 InvalidateCurriculum call after level advancement, got %d", baseCache.InvalidateCallCount)
	}
	if levelAtInvalidate != "lvl-n4-a" {
		t.Errorf("expected enrollment level already advanced to deterministic lvl-n4-a before InvalidateCurriculum, got %q", levelAtInvalidate)
	}
	if got := *baseLangRepo.Enrollments["enr-1"].CurrentLevelID; got != "lvl-n4-a" {
		t.Errorf("expected final enrollment CurrentLevelID lvl-n4-a via ID tie-break, got %s", got)
	}
}

type racingLangRepo struct {
	*language.MockRepository
	onActiveEnrollment func()
}

func (r *racingLangRepo) GetActiveEnrollment(ctx context.Context, userID string, languageID string) (*language.UserLanguageEnrollment, error) {
	enr, err := r.MockRepository.GetActiveEnrollment(ctx, userID, languageID)
	if err == nil && enr != nil && r.onActiveEnrollment != nil {
		snapshot := *enr
		r.onActiveEnrollment()
		return &snapshot, nil
	}
	return enr, err
}

func TestGetCurriculum_EpochMismatchPreventsStaleCacheWrite(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-n5"] = &curriculum.UnitNodeResponse{ID: "unit-n5", LevelID: "lvl-n5", Title: "N5 Unit", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Lessons["lesson-n5"] = &curriculum.LessonNodeResponse{ID: "lesson-n5", UnitID: "unit-n5", Title: "N5 L1", OrderIndex: 1}
	cRepo.Units["unit-n4"] = &curriculum.UnitNodeResponse{ID: "unit-n4", LevelID: "lvl-n4", Title: "N4 Unit", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Lessons["lesson-n4"] = &curriculum.LessonNodeResponse{ID: "lesson-n4", UnitID: "unit-n4", Title: "N4 L1", OrderIndex: 1}

	baseLangRepo := language.NewMockRepository()
	langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
	lvlN4 := &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}
	baseLangRepo.Languages["lang-ja"] = langJA
	baseLangRepo.Levels["lvl-n5"] = lvlN5
	baseLangRepo.Levels["lvl-n4"] = lvlN4
	baseLangRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		Language:       langJA,
		CurrentLevel:   lvlN5,
	}

	cacheRepo := curriculum.NewMockCurriculumCacheRepository()
	triggered := false
	lRepo := &racingLangRepo{
		MockRepository: baseLangRepo,
		onActiveEnrollment: func() {
			if triggered {
				return
			}
			triggered = true
			baseLangRepo.Enrollments["enr-1"].CurrentLevelID = &lvlN4.ID
			baseLangRepo.Enrollments["enr-1"].CurrentLevel = lvlN4
			_ = cacheRepo.InvalidateCurriculum(context.Background(), "user-1")
		},
	}

	uc := curriculum.NewUsecaseWithCache(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil, cacheRepo)

	// 1. Concurrent level-up + invalidation occurs right after enrollment snapshot is read;
	// stale N5 data must NOT be written under the new cache epoch.
	res1, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{})
	if err != nil {
		t.Fatalf("first GetCurriculum failed: %v", err)
	}
	if res1.Level.ID != "lvl-n5" {
		t.Fatalf("expected in-flight snapshot response lvl-n5, got %s", res1.Level.ID)
	}
	if _, exists := cacheRepo.Cache["user-1:lang-ja"]; exists {
		t.Fatalf("expected stale N5 curriculum NOT to be cached after epoch mismatch")
	}

	// 2. Subsequent GetCurriculum reads fresh N4 from DB and caches N4 under the new epoch
	res2, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{})
	if err != nil {
		t.Fatalf("second GetCurriculum failed: %v", err)
	}
	if res2.Level.ID != "lvl-n4" {
		t.Errorf("expected fresh lvl-n4 curriculum on subsequent request, got %s", res2.Level.ID)
	}
	if _, exists := cacheRepo.Cache["user-1:lang-ja"]; !exists {
		t.Errorf("expected fresh N4 curriculum to be cached under current epoch")
	}

	// 3. Direct SetCurriculumIfVersion with empty expectedVersion must not write to cache
	delete(cacheRepo.Cache, "user-1:lang-ja")
	_ = cacheRepo.SetCurriculumIfVersion(context.Background(), "user-1", "lang-ja", "", res2, time.Minute)
	if _, exists := cacheRepo.Cache["user-1:lang-ja"]; exists {
		t.Errorf("expected SetCurriculumIfVersion with empty expectedVersion to be rejected")
	}
}

func TestGetCurriculum_NilCurrentLevelFallbackAndMissingLevels(t *testing.T) {
	t.Run("falls back to lowest proficiency level when current_level_id is nil", func(t *testing.T) {
		cRepo := curriculum.NewMockRepository()
		cRepo.Units["unit-n5"] = &curriculum.UnitNodeResponse{ID: "unit-n5", LevelID: "lvl-n5", Title: "N5 Unit", UnitType: "curriculum", OrderIndex: 1}
		cRepo.Lessons["lesson-n5"] = &curriculum.LessonNodeResponse{ID: "lesson-n5", UnitID: "unit-n5", Title: "N5 L1", OrderIndex: 1}

		lRepo := language.NewMockRepository()
		langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
		lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
		lvlN4 := &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}
		lRepo.Languages["lang-ja"] = langJA
		lRepo.Levels["lvl-n4"] = lvlN4
		lRepo.Levels["lvl-n5"] = lvlN5
		lRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
			ID:             "enr-1",
			UserID:         "user-1",
			LanguageID:     "lang-ja",
			CurrentLevelID: nil,
			CurrentLevel:   nil,
			IsActive:       true,
			Language:       langJA,
		}

		uc := curriculum.NewUsecase(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil)
		res, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{})
		if err != nil {
			t.Fatalf("expected fallback to lowest level without error/panic, got %v", err)
		}
		if res.Level.ID != "lvl-n5" {
			t.Errorf("expected fallback level lvl-n5, got %s", res.Level.ID)
		}
		if len(res.Units) != 1 || res.Units[0].ID != "unit-n5" {
			t.Errorf("expected N5 units loaded via fallback, got %+v", res.Units)
		}
	})

	t.Run("returns ErrProficiencyLevelNotFound when language has no levels", func(t *testing.T) {
		cRepo := curriculum.NewMockRepository()
		lRepo := language.NewMockRepository()
		langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
		lRepo.Languages["lang-ja"] = langJA
		lRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
			ID:             "enr-1",
			UserID:         "user-1",
			LanguageID:     "lang-ja",
			CurrentLevelID: nil,
			CurrentLevel:   nil,
			IsActive:       true,
			Language:       langJA,
		}

		uc := curriculum.NewUsecase(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil)
		_, err := uc.GetCurriculum(context.Background(), "user-1", &curriculum.GetCurriculumRequest{})
		if !errors.Is(err, language.ErrProficiencyLevelNotFound) {
			t.Fatalf("expected ErrProficiencyLevelNotFound when no levels exist, got %v", err)
		}
	})
}

func TestCompleteLesson_CrossLevelNextLessonResolution(t *testing.T) {
	t.Run("multi-unit next level resolves first curriculum unit and lesson deterministically", func(t *testing.T) {
		cRepo := curriculum.NewMockRepository()
		cRepo.Units["unit-n5"] = &curriculum.UnitNodeResponse{ID: "unit-n5", LevelID: "lvl-n5", UnitType: "curriculum", OrderIndex: 1}
		cRepo.Units["unit-n4-2"] = &curriculum.UnitNodeResponse{ID: "unit-n4-2", LevelID: "lvl-n4", UnitType: "curriculum", OrderIndex: 2}
		cRepo.Units["unit-n4-1"] = &curriculum.UnitNodeResponse{ID: "unit-n4-1", LevelID: "lvl-n4", UnitType: "curriculum", OrderIndex: 1}
		cRepo.Units["unit-n4-exam"] = &curriculum.UnitNodeResponse{ID: "unit-n4-exam", LevelID: "lvl-n4", UnitType: "diagnostic_exam", OrderIndex: 0}

		cRepo.Lessons["lesson-n5-last"] = &curriculum.LessonNodeResponse{ID: "lesson-n5-last", UnitID: "unit-n5", Title: "N5 Last", XPReward: 15, OrderIndex: 1}
		cRepo.Lessons["lesson-n4-exam"] = &curriculum.LessonNodeResponse{ID: "lesson-n4-exam", UnitID: "unit-n4-exam", Title: "Exam", OrderIndex: 1}
		cRepo.Lessons["lesson-u2"] = &curriculum.LessonNodeResponse{ID: "lesson-u2", UnitID: "unit-n4-2", Title: "U2 L1", OrderIndex: 1}
		cRepo.Lessons["lesson-n4-b"] = &curriculum.LessonNodeResponse{ID: "lesson-n4-b", UnitID: "unit-n4-1", Title: "U1 B", OrderIndex: 1}
		cRepo.Lessons["lesson-n4-a"] = &curriculum.LessonNodeResponse{ID: "lesson-n4-a", UnitID: "unit-n4-1", Title: "U1 A", OrderIndex: 1}
		cRepo.Lessons["lesson-n4-2"] = &curriculum.LessonNodeResponse{ID: "lesson-n4-2", UnitID: "unit-n4-1", Title: "U1 L2", OrderIndex: 2}

		cRepo.AttemptSummaries["user-1:lesson-n5-last"] = &curriculum.LessonAttemptSummary{
			TotalExercises:     2,
			AttemptedExercises: 2,
			CorrectExercises:   2,
		}

		lRepo := language.NewMockRepository()
		langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
		lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
		lvlN4 := &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}
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

		uc := curriculum.NewUsecase(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil)
		res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
			LessonID: "lesson-n5-last",
			Score:    100,
		})
		if err != nil {
			t.Fatalf("expected CompleteLesson to succeed, got %v", err)
		}
		if got := *lRepo.Enrollments["enr-1"].CurrentLevelID; got != "lvl-n4" {
			t.Fatalf("expected enrollment to advance to lvl-n4, got %s", got)
		}
		if res.UnlockedNextLessonID == nil || *res.UnlockedNextLessonID != "lesson-n4-a" {
			t.Errorf("expected UnlockedNextLessonID 'lesson-n4-a' (first curriculum unit & lesson), got %v", res.UnlockedNextLessonID)
		}
	})

	t.Run("does not expose non-curriculum or empty next level lesson when advancement is skipped", func(t *testing.T) {
		cRepo := curriculum.NewMockRepository()
		cRepo.Units["unit-n5"] = &curriculum.UnitNodeResponse{ID: "unit-n5", LevelID: "lvl-n5", UnitType: "curriculum", OrderIndex: 1}
		cRepo.Units["unit-n4-exam"] = &curriculum.UnitNodeResponse{ID: "unit-n4-exam", LevelID: "lvl-n4", UnitType: "diagnostic_exam", OrderIndex: 1}
		cRepo.Units["unit-n4-empty"] = &curriculum.UnitNodeResponse{ID: "unit-n4-empty", LevelID: "lvl-n4", UnitType: "curriculum", OrderIndex: 2}
		cRepo.Lessons["lesson-n5"] = &curriculum.LessonNodeResponse{ID: "lesson-n5", UnitID: "unit-n5", Title: "N5 L1", XPReward: 15, OrderIndex: 1}
		cRepo.Lessons["lesson-n4-exam"] = &curriculum.LessonNodeResponse{ID: "lesson-n4-exam", UnitID: "unit-n4-exam", Title: "Exam", OrderIndex: 1}
		cRepo.AttemptSummaries["user-1:lesson-n5"] = &curriculum.LessonAttemptSummary{
			TotalExercises:     2,
			AttemptedExercises: 2,
			CorrectExercises:   2,
		}

		lRepo := language.NewMockRepository()
		langJA := &language.Language{ID: "lang-ja", Code: "ja", Name: "Japanese", IsActive: true}
		lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
		lvlN4 := &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}
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

		uc := curriculum.NewUsecase(cRepo, lRepo, exercise.NewMockRepository(), user.NewMockRepository(), nil)
		res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
			LessonID: "lesson-n5",
			Score:    100,
		})
		if err != nil {
			t.Fatalf("expected CompleteLesson to succeed, got %v", err)
		}
		if got := *lRepo.Enrollments["enr-1"].CurrentLevelID; got != "lvl-n5" {
			t.Errorf("expected enrollment to remain lvl-n5 when next level has no curriculum lessons, got %s", got)
		}
		if res.UnlockedNextLessonID != nil {
			t.Errorf("expected nil UnlockedNextLessonID when next level has no curriculum lessons, got %v", *res.UnlockedNextLessonID)
		}
	})
}

type noRedundantReadCurriculumRepo struct {
	*curriculum.MockRepository
	isUnlockedCalls int
}

func (r *noRedundantReadCurriculumRepo) IsLessonUnlocked(ctx context.Context, userID string, lessonID string) (bool, error) {
	r.isUnlockedCalls++
	return r.MockRepository.IsLessonUnlocked(ctx, userID, lessonID)
}

type countingUserRepo struct {
	*user.MockRepository
	getByIDCalls int
}

func (r *countingUserRepo) GetByID(ctx context.Context, id string) (*user.User, error) {
	r.getByIDCalls++
	return r.MockRepository.GetByID(ctx, id)
}

func TestCompleteLesson_SkipsRedundantPreTXReads(t *testing.T) {
	baseRepo := curriculum.NewMockRepository()
	baseRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", UnitType: "curriculum", OrderIndex: 1}
	baseRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "L1", XPReward: 15, OrderIndex: 1}
	baseRepo.Lessons["lesson-2"] = &curriculum.LessonNodeResponse{ID: "lesson-2", UnitID: "unit-1", Title: "L2", XPReward: 15, OrderIndex: 2}
	baseRepo.AttemptSummaries["user-1:lesson-1"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     2,
		AttemptedExercises: 2,
		CorrectExercises:   2,
	}
	baseRepo.AttemptSummaries["user-1:lesson-2"] = &curriculum.LessonAttemptSummary{
		TotalExercises:     2,
		AttemptedExercises: 2,
		CorrectExercises:   2,
	}

	cRepo := &noRedundantReadCurriculumRepo{MockRepository: baseRepo}
	uRepo := &countingUserRepo{MockRepository: user.NewMockRepository()}
	uc := curriculum.NewUsecase(cRepo, language.NewMockRepository(), exercise.NewMockRepository(), uRepo, nil)

	// Completing locked lesson-2 still rejects atomically inside RecordLessonCompletionTx without pre-TX IsLessonUnlocked read
	if _, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-2"}); !errors.Is(err, curriculum.ErrLessonLocked) {
		t.Fatalf("expected ErrLessonLocked for lesson-2, got %v", err)
	}
	if cRepo.isUnlockedCalls != 0 {
		t.Errorf("expected 0 pre-TX IsLessonUnlocked calls on locked rejection, got %d", cRepo.isUnlockedCalls)
	}

	// Completing lesson-1 succeeds with 0 pre-TX IsLessonUnlocked or userRepo.GetByID calls and computes streak=1 in TX
	res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{LessonID: "lesson-1"})
	if err != nil {
		t.Fatalf("expected lesson-1 completion to succeed, got %v", err)
	}
	if cRepo.isUnlockedCalls != 0 {
		t.Errorf("expected 0 pre-TX IsLessonUnlocked calls on success, got %d", cRepo.isUnlockedCalls)
	}
	if uRepo.getByIDCalls != 0 {
		t.Errorf("expected 0 pre-TX userRepo.GetByID calls when no badges awarded, got %d", uRepo.getByIDCalls)
	}
	if res.Gamification.XP != 15 || res.Gamification.Streak != 1 {
		t.Errorf("expected TX-derived XP=15 and Streak=1, got XP=%d Streak=%d", res.Gamification.XP, res.Gamification.Streak)
	}
}

func TestMockRepository_Parity_GrammarPointsAndLessonErrors(t *testing.T) {
	ctx := context.Background()

	t.Run("GetGrammarPointsByLessonID returns empty slice when lesson has no linked grammar points", func(t *testing.T) {
		cRepo := curriculum.NewMockRepository()
		cRepo.GrammarPoints["gp-1"] = &curriculum.GrammarPoint{ID: "gp-1", LevelID: "lvl-n5", Code: "GP-1", Title: "WA", OrderIndex: 1}
		cRepo.GrammarPoints["gp-2"] = &curriculum.GrammarPoint{ID: "gp-2", LevelID: "lvl-n5", Code: "GP-2", Title: "GA", OrderIndex: 2}
		cRepo.LessonGrammarPoints["lesson-linked"] = []string{"gp-1"}

		unlinked, err := cRepo.GetGrammarPointsByLessonID(ctx, "lesson-unlinked")
		if err != nil {
			t.Fatalf("expected nil error for unlinked lesson, got %v", err)
		}
		if unlinked == nil {
			t.Fatalf("expected non-nil empty slice for unlinked lesson, got nil")
		}
		if len(unlinked) != 0 {
			t.Errorf("expected 0 grammar points for unlinked lesson instead of returning all grammar points, got %d", len(unlinked))
		}

		linked, err := cRepo.GetGrammarPointsByLessonID(ctx, "lesson-linked")
		if err != nil {
			t.Fatalf("expected nil error for linked lesson, got %v", err)
		}
		if len(linked) != 1 || linked[0].ID != "gp-1" {
			t.Errorf("expected only linked gp-1, got %+v", linked)
		}
	})

	t.Run("GetLessonByID returns ErrLessonNotFound for missing and non-curriculum lessons", func(t *testing.T) {
		cRepo := curriculum.NewMockRepository()
		cRepo.Units["unit-exam"] = &curriculum.UnitNodeResponse{ID: "unit-exam", LevelID: "lvl-n5", UnitType: "diagnostic_exam", OrderIndex: 1}
		cRepo.Lessons["lesson-exam"] = &curriculum.LessonNodeResponse{ID: "lesson-exam", UnitID: "unit-exam", Title: "Exam", OrderIndex: 1}

		if detail, err := cRepo.GetLessonByID(ctx, "does-not-exist", "user-1"); !errors.Is(err, curriculum.ErrLessonNotFound) || detail != nil {
			t.Errorf("expected (nil, ErrLessonNotFound) for missing lesson, got (%v, %v)", detail, err)
		}
		if detail, err := cRepo.GetLessonByID(ctx, "lesson-exam", "user-1"); !errors.Is(err, curriculum.ErrLessonNotFound) || detail != nil {
			t.Errorf("expected (nil, ErrLessonNotFound) for non-curriculum lesson, got (%v, %v)", detail, err)
		}
	})

	t.Run("RecordLessonCompletionTx enforces ErrLessonNotFound, ErrLessonLocked, and ErrUserNotFound", func(t *testing.T) {
		cRepo := curriculum.NewMockRepository()
		cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", UnitType: "curriculum", OrderIndex: 1}
		cRepo.Units["unit-exam"] = &curriculum.UnitNodeResponse{ID: "unit-exam", LevelID: "lvl-n5", UnitType: "diagnostic_exam", OrderIndex: 2}
		cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "L1", OrderIndex: 1}
		cRepo.Lessons["lesson-2"] = &curriculum.LessonNodeResponse{ID: "lesson-2", UnitID: "unit-1", Title: "L2", OrderIndex: 2}
		cRepo.Lessons["lesson-exam"] = &curriculum.LessonNodeResponse{ID: "lesson-exam", UnitID: "unit-exam", Title: "Exam", OrderIndex: 1}
		cRepo.MissingUsers["missing-user"] = true

		if err := cRepo.RecordLessonCompletionTx(ctx, &curriculum.LessonCompletionPayload{
			Progress: &curriculum.UserLessonProgress{UserID: "missing-user", LessonID: "lesson-1"},
		}); !errors.Is(err, user.ErrUserNotFound) {
			t.Errorf("expected user.ErrUserNotFound for missing user, got %v", err)
		}

		if err := cRepo.RecordLessonCompletionTx(ctx, &curriculum.LessonCompletionPayload{
			Progress: &curriculum.UserLessonProgress{UserID: "user-1", LessonID: "missing-lesson"},
		}); !errors.Is(err, curriculum.ErrLessonNotFound) {
			t.Errorf("expected ErrLessonNotFound for missing lesson, got %v", err)
		}

		if err := cRepo.RecordLessonCompletionTx(ctx, &curriculum.LessonCompletionPayload{
			Progress: &curriculum.UserLessonProgress{UserID: "user-1", LessonID: "lesson-exam"},
		}); !errors.Is(err, curriculum.ErrLessonNotFound) {
			t.Errorf("expected ErrLessonNotFound for diagnostic_exam lesson, got %v", err)
		}

		if err := cRepo.RecordLessonCompletionTx(ctx, &curriculum.LessonCompletionPayload{
			Progress: &curriculum.UserLessonProgress{UserID: "user-1", LessonID: "lesson-2"},
		}); !errors.Is(err, curriculum.ErrLessonLocked) {
			t.Errorf("expected ErrLessonLocked for locked lesson, got %v", err)
		}
	})
}
