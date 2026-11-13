package exercise_test

import (
	"context"
	"errors"
	"testing"

	"codeabroad/backend/internal/app/exercise"
	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/app/user"
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

	langRepo.Levels["lvl-1"] = &language.ProficiencyLevel{
		ID:                  "lvl-1",
		Code:                "N5",
		PassingScorePercent: 60,
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



