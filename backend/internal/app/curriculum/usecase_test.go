package curriculum_test

import (
	"context"
	"errors"
	"sync"
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
	cRepo.TotalLessonExercises["lesson-1"] = 3
	cRepo.AttemptedLessonExercises["user-1:lesson-1"] = 0

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

	cRepo.AttemptedLessonExercises["user-1:lesson-1"] = 1
	res, err := uc.CompleteLesson(context.Background(), "user-1", &curriculum.CompleteLessonRequest{
		LessonID: "lesson-1",
		Score:    100,
	})
	if err != nil {
		t.Fatalf("expected completion after attempting exercise to succeed, got %v", err)
	}
	if res.Gamification.XP != 15 {
		t.Errorf("expected 15 XP, got %d", res.Gamification.XP)
	}
}

func TestCompleteLesson_ConcurrentBurst_AntiExploit(t *testing.T) {
	cRepo := curriculum.NewMockRepository()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{ID: "unit-1", LevelID: "lvl-n5", OrderIndex: 1}
	cRepo.Lessons["lesson-1"] = &curriculum.LessonNodeResponse{ID: "lesson-1", UnitID: "unit-1", Title: "Lesson 1", XPReward: 15, OrderIndex: 1}
	cRepo.TotalLessonExercises["lesson-1"] = 2
	cRepo.AttemptedLessonExercises["user-1:lesson-1"] = 2

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

	for err := range errCh {
		if err != nil {
			t.Fatalf("unexpected error during concurrent completion: %v", err)
		}
	}

	// 1st serialized completion = 15 XP; 4 concurrent replays = 4 * 5 XP => 35 XP total (never 75 XP)
	if gotXP := cRepo.UserXP["user-1"]; gotXP != 35 {
		t.Errorf("expected 35 XP after serialized concurrent burst, got %d", gotXP)
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



