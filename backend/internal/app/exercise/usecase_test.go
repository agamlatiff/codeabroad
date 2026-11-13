package exercise_test

import (
	"context"
	"errors"
	"testing"

	"codeabroad/backend/internal/app/exercise"
	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/app/user"
	"codeabroad/backend/internal/shared/apperror"
)

func TestSubmitAnswer_Correct(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		QuestionText:  "What is 'Konnichiwa'?",
		CorrectAnswer: "Hello",
		XPReward:      10,
	}

	uc := exercise.NewUsecase(eRepo, sRepo, examRepo, langRepo, userRepo)

	res, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-1",
		UserAnswer: "Hello",
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if !res.IsCorrect {
		t.Errorf("expected is_correct true")
	}
	if res.XPEarned != 10 {
		t.Errorf("expected 10 XP, got %d", res.XPEarned)
	}
}

func TestSubmitAnswer_Wrong_InjectsSRS(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		QuestionText:  "What is 'Konnichiwa'?",
		CorrectAnswer: "Hello",
		XPReward:      10,
	}

	uc := exercise.NewUsecase(eRepo, sRepo, examRepo, langRepo, userRepo)

	res, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-1",
		UserAnswer: "Good morning",
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.IsCorrect {
		t.Errorf("expected is_correct false")
	}
	if res.NextReviewDue == nil {
		t.Errorf("expected next review due scheduled in SRS")
	}
	if _, ok := sRepo.Reviews["user-1:ex-1"]; !ok {
		t.Errorf("expected card to be upserted in SRS repo")
	}
}

func TestProcessReview_SM2(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

	uc := exercise.NewUsecase(eRepo, sRepo, examRepo, langRepo, userRepo)

	review, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{
		ExerciseID: "ex-1",
		Quality:    4,
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if review.Repetitions != 1 {
		t.Errorf("expected repetitions 1, got %d", review.Repetitions)
	}
	if review.IntervalDays != 1 {
		t.Errorf("expected interval 1, got %d", review.IntervalDays)
	}
}

func TestSubmitAnswer_AcceptableAnswer_Matches(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

	eRepo.Exercises["ex-2"] = &exercise.Exercise{
		ID:                "ex-2",
		Prompt:            "Type 'Tokyo' in Japanese",
		CorrectAnswer:     "東京",
		AcceptableAnswers: []string{"とうきょう", "tokyo"},
		XPReward:          10,
	}

	uc := exercise.NewUsecase(eRepo, sRepo, examRepo, langRepo, userRepo)

	// User types romaji "tokyo" which is in acceptable answers
	res, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-2",
		UserAnswer: "tokyo",
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if !res.IsCorrect {
		t.Errorf("expected acceptable answer to be graded correct")
	}
	if res.XPEarned != 10 {
		t.Errorf("expected 10 XP, got %d", res.XPEarned)
	}
}

func TestSubmitAnswer_DiagnosticFeedback_Surfaces(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

	eRepo.Exercises["ex-3"] = &exercise.Exercise{
		ID:            "ex-3",
		Prompt:        "Choose particle for direction",
		CorrectAnswer: "へ",
		DiagnosticRubric: map[string]any{
			"で": "Partikel で digunakan untuk tempat terjadinya aktivitas, bukan arah.",
		},
		XPReward: 10,
	}

	uc := exercise.NewUsecase(eRepo, sRepo, examRepo, langRepo, userRepo)

	res, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-3",
		UserAnswer: "で",
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.IsCorrect {
		t.Fatalf("expected answer to be incorrect")
	}
	if res.DiagnosticFeedback == nil || *res.DiagnosticFeedback != "Partikel で digunakan untuk tempat terjadinya aktivitas, bukan arah." {
		t.Errorf("expected targeted diagnostic feedback, got %v", res.DiagnosticFeedback)
	}
}

func TestSubmitExam_4PillarScoring_Success(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

	lvlID := "lvl-1"
	lvl1 := &language.ProficiencyLevel{
		ID:                  lvlID,
		LanguageID:          "lang-ja",
		Code:                "N5",
		OrderIndex:          1,
		PassingScorePercent: 60,
	}
	langRepo.Levels[lvlID] = lvl1
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlID,
		IsActive:       true,
		CurrentLevel:   lvl1,
	}

	eRepo.ReadinessExamExercises["lvl-1"] = []exercise.Exercise{
		{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"},
		{ID: "q-2", SkillPillar: "listening", CorrectAnswer: "B"},
		{ID: "q-3", SkillPillar: "writing", CorrectAnswer: "C"},
		{ID: "q-4", SkillPillar: "speaking", CorrectAnswer: "D"},
	}

	uc := exercise.NewUsecase(eRepo, sRepo, examRepo, langRepo, userRepo)

	res, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-1",
		Answers: []exercise.SubmitExerciseAnswerRequest{
			{ExerciseID: "q-1", UserAnswer: "A"},
			{ExerciseID: "q-2", UserAnswer: "B"},
			{ExerciseID: "q-3", UserAnswer: "C"},
			{ExerciseID: "q-4", UserAnswer: "D"},
		},
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if !res.Attempt.IsPassed {
		t.Errorf("expected exam to pass")
	}
	if res.Attempt.ReadingScore != 100 || res.Attempt.ListeningScore != 100 {
		t.Errorf("expected 100 on 4 pillars, got reading=%d, listening=%d", res.Attempt.ReadingScore, res.Attempt.ListeningScore)
	}
	if res.Certificate == nil {
		t.Errorf("expected certificate to be issued")
	}
}

type stubLessonAccessChecker struct {
	unlocked bool
	err      error
}

func (s *stubLessonAccessChecker) IsLessonUnlocked(ctx context.Context, userID string, lessonID string) (bool, error) {
	return s.unlocked, s.err
}

func TestGetExercisesByLesson_SanitizesAndChecksLock(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	lessonID := "lesson-locked"
	expl := "Secret explanation"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:                "ex-1",
		LessonID:          &lessonID,
		Prompt:            "Translate 'hello'",
		CorrectAnswer:     "こんにちは",
		AcceptableAnswers: []string{"konnichiwa"},
		DiagnosticRubric:  map[string]any{"x": "y"},
		Explanation:       &expl,
	}

	ucLocked := exercise.NewUsecaseWithAccessChecker(
		eRepo,
		exercise.NewMockSRSRepository(),
		exercise.NewMockReadinessExamRepository(),
		language.NewMockRepository(),
		user.NewMockRepository(),
		&stubLessonAccessChecker{unlocked: false},
	)

	if _, err := ucLocked.GetExercisesByLesson(context.Background(), "user-1", lessonID); !errors.Is(err, exercise.ErrExerciseLessonLocked) {
		t.Fatalf("expected ErrExerciseLessonLocked for locked lesson, got %v", err)
	}

	ucUnlocked := exercise.NewUsecaseWithAccessChecker(
		eRepo,
		exercise.NewMockSRSRepository(),
		exercise.NewMockReadinessExamRepository(),
		language.NewMockRepository(),
		user.NewMockRepository(),
		&stubLessonAccessChecker{unlocked: true},
	)

	list, err := ucUnlocked.GetExercisesByLesson(context.Background(), "user-1", lessonID)
	if err != nil {
		t.Fatalf("expected unlocked lesson exercises to succeed, got %v", err)
	}
	if len(list) != 1 {
		t.Fatalf("expected 1 exercise, got %d", len(list))
	}
	if list[0].CorrectAnswer != "" || list[0].AcceptableAnswers != nil || list[0].DiagnosticRubric != nil || list[0].Explanation != nil {
		t.Fatalf("expected exercise answers to be sanitized, got %+v", list[0])
	}
}

func TestSubmitAnswer_LockedLesson_Blocked(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	lessonID := "lesson-locked"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		Prompt:        "Test",
		CorrectAnswer: "A",
	}

	uc := exercise.NewUsecaseWithAccessChecker(
		eRepo,
		exercise.NewMockSRSRepository(),
		exercise.NewMockReadinessExamRepository(),
		language.NewMockRepository(),
		user.NewMockRepository(),
		&stubLessonAccessChecker{unlocked: false},
	)

	_, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-1",
		UserAnswer: "A",
	})
	if !errors.Is(err, exercise.ErrExerciseLessonLocked) {
		t.Fatalf("expected ErrExerciseLessonLocked when submitting answer for locked lesson, got %v", err)
	}
}

type stubCacheInvalidator struct {
	calls int
}

func (s *stubCacheInvalidator) InvalidateRoadmap(ctx context.Context, userID string) error {
	s.calls++
	return nil
}

func TestGetExamQuestions_SanitizesAndChecksLevelAccess(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	expl := "Exam explanation"
	eRepo.ReadinessExamExercises["lvl-n5"] = []exercise.Exercise{
		{
			ID:                "q-n5",
			SkillPillar:       "reading",
			CorrectAnswer:     "A",
			AcceptableAnswers: []string{"A"},
			DiagnosticRubric:  map[string]any{"hint": "no"},
			Explanation:       &expl,
		},
	}
	eRepo.ReadinessExamExercises["lvl-n4"] = []exercise.Exercise{
		{ID: "q-n4", SkillPillar: "reading", CorrectAnswer: "B"},
	}

	langRepo := language.NewMockRepository()
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
	lvlN4 := &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2}
	langRepo.Levels["lvl-n5"] = lvlN5
	langRepo.Levels["lvl-n4"] = lvlN4
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}

	uc := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), exercise.NewMockReadinessExamRepository(), langRepo, user.NewMockRepository())

	// Locked higher level (N4 while enrolled at N5) must return Forbidden
	if _, err := uc.GetExamQuestions(context.Background(), "user-1", "lvl-n4"); !errors.Is(err, apperror.ErrForbidden) {
		t.Fatalf("expected ErrForbidden for locked level exam, got %v", err)
	}

	// Enrolled N5 succeeds with sanitized answers
	qs, err := uc.GetExamQuestions(context.Background(), "user-1", "lvl-n5")
	if err != nil {
		t.Fatalf("expected N5 exam questions to succeed, got %v", err)
	}
	if len(qs) != 1 || qs[0].CorrectAnswer != "" || qs[0].AcceptableAnswers != nil || qs[0].DiagnosticRubric != nil || qs[0].Explanation != nil {
		t.Fatalf("expected sanitized exam questions, got %+v", qs)
	}
}

func TestSubmitExam_PassedAdvancesLevelAndInvalidatesCache(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	eRepo.ReadinessExamExercises["lvl-n5"] = []exercise.Exercise{
		{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"},
	}

	langRepo := language.NewMockRepository()
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1, PassingScorePercent: 60}
	lvlN4 := &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2, PassingScorePercent: 60}
	langRepo.Levels["lvl-n5"] = lvlN5
	langRepo.Levels["lvl-n4"] = lvlN4
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}

	inv := &stubCacheInvalidator{}
	uc := exercise.NewUsecaseFull(eRepo, exercise.NewMockSRSRepository(), exercise.NewMockReadinessExamRepository(), langRepo, user.NewMockRepository(), nil, inv)

	res, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-n5",
		Answers: []exercise.SubmitExerciseAnswerRequest{{ExerciseID: "q-1", UserAnswer: "A"}},
	})
	if err != nil {
		t.Fatalf("expected exam submission to succeed, got %v", err)
	}
	if !res.Attempt.IsPassed {
		t.Fatalf("expected exam attempt to pass")
	}
	if langRepo.Enrollments["enr-1"].CurrentLevelID == nil || *langRepo.Enrollments["enr-1"].CurrentLevelID != "lvl-n4" {
		t.Errorf("expected enrollment current_level_id to advance to lvl-n4, got %v", langRepo.Enrollments["enr-1"].CurrentLevelID)
	}
	if inv.calls != 1 {
		t.Errorf("expected roadmap cache invalidation to be called once, got %d", inv.calls)
	}
}



