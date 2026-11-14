package exercise_test

import (
	"context"
	"errors"
	"math"
	"strings"
	"testing"
	"time"

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
		Prompt:        "What is 'Konnichiwa'?",
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
	if res.XPEarned != 0 {
		t.Errorf("expected 0 XP from SubmitAnswer, got %d", res.XPEarned)
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
		Prompt:        "What is 'Konnichiwa'?",
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

	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		ExerciseType:  exercise.ExerciseTypeFillBlank,
		Prompt:        "Review prompt",
		CorrectAnswer: "Answer",
	}

	uc := exercise.NewUsecase(eRepo, sRepo, examRepo, langRepo, userRepo)

	q := 4
	review, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{
		ExerciseID: "ex-1",
		Quality:    &q,
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if review.RepetitionCount != 1 {
		t.Errorf("expected repetition_count 1, got %d", review.RepetitionCount)
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
	if res.XPEarned != 0 {
		t.Errorf("expected 0 XP from SubmitAnswer, got %d", res.XPEarned)
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

func (s *stubCacheInvalidator) InvalidateCurriculum(ctx context.Context, userID string) error {
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
		t.Errorf("expected curriculum cache invalidation to be called once, got %d", inv.calls)
	}
}

func TestParseCorrectAndAcceptableAnswersJSON(t *testing.T) {
	if got := exercise.ParseCorrectAnswerJSON([]byte(`{"selected_id":"opt_1"}`)); got != "opt_1" {
		t.Errorf("expected opt_1 for selected_id, got %q", got)
	}
	if got := exercise.ParseCorrectAnswerJSON([]byte(`{"expected_transcript":"みずをのみます"}`)); got != "みずをのみます" {
		t.Errorf("expected expected_transcript extraction, got %q", got)
	}
	if got := exercise.ParseCorrectAnswerJSON([]byte(`["まいあさ", "ごはん", "を", "たべます"]`)); got != "まいあさ ごはん を たべます" {
		t.Errorf("expected space-joined token answer, got %q", got)
	}
	if got := exercise.ParseCorrectAnswerJSON([]byte(`{"selected":"を"}`)); got != "を" {
		t.Errorf("expected selected particle extraction, got %q", got)
	}

	nested := exercise.ParseAcceptableAnswersJSON([]byte(`[["毎朝", "ご飯", "を", "食べます"], ["毎朝", "ごはん", "を", "たべます"]]`))
	if len(nested) != 2 || nested[0] != "毎朝 ご飯 を 食べます" {
		t.Errorf("expected flattened acceptable answers, got %#v", nested)
	}
}

func TestHelper_EvaluateAndDiagnosticTokenFeedback(t *testing.T) {
	h := exercise.NewHelper()

	if !h.EvaluateAnswer("まいあさ ごはん を たべます", []string{"毎朝 ご飯 を 食べます"}, "まいあさごはんをたべます。") {
		t.Errorf("expected collapsed Japanese sentence with punctuation to match")
	}

	rubric := map[string]any{
		"パン":   "Pan berarti roti, bukan nasi.",
		"のみます": "Nomimasu berarti minum.",
	}
	fb := h.ExtractDiagnosticFeedback(rubric, "まいあさ パン を たべます")
	if fb == nil || *fb != "Pan berarti roti, bukan nasi." {
		t.Errorf("expected token distractor diagnostic feedback, got %v", fb)
	}
}

func TestSubmitExam_DeduplicatesRepeatedExerciseID(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	eRepo.ReadinessExamExercises["lvl-n5"] = []exercise.Exercise{
		{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"},
		{ID: "q-2", SkillPillar: "reading", CorrectAnswer: "B"},
	}

	langRepo := language.NewMockRepository()
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1, PassingScorePercent: 60}
	langRepo.Levels["lvl-n5"] = lvlN5
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}

	uc := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), exercise.NewMockReadinessExamRepository(), langRepo, user.NewMockRepository())

	res, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-n5",
		Answers: []exercise.SubmitExerciseAnswerRequest{
			{ExerciseID: "q-1", UserAnswer: "A"},
			{ExerciseID: "q-1", UserAnswer: "A"},
		},
	})
	if err != nil {
		t.Fatalf("expected submit exam not to fail cleanly, got %v", err)
	}
	if res.Attempt.ScorePercent != 50 || res.Attempt.OverallScore != 50 || res.Attempt.IsPassed {
		t.Errorf("expected deduplicated score 50%% fail, got overall=%d percent=%d passed=%v", res.Attempt.OverallScore, res.Attempt.ScorePercent, res.Attempt.IsPassed)
	}
}

func TestSubmitAnswer_CreateAttemptErrorPropagates(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	eRepo.CreateAttemptErr = errors.New("db write error")
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		Prompt:        "Test",
		CorrectAnswer: "A",
	}

	uc := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), exercise.NewMockReadinessExamRepository(), language.NewMockRepository(), user.NewMockRepository())

	if _, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-1",
		UserAnswer: "A",
	}); err == nil {
		t.Fatalf("expected error when CreateAttempt fails")
	}
}

func TestProcessReview_MissingExerciseAndDBError(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	uc := exercise.NewUsecase(eRepo, sRepo, exercise.NewMockReadinessExamRepository(), language.NewMockRepository(), user.NewMockRepository())

	q := 4
	_, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{
		ExerciseID: "missing-ex",
		Quality:    &q,
	})
	if !errors.Is(err, exercise.ErrExerciseNotFound) {
		t.Fatalf("expected ErrExerciseNotFound, got %v", err)
	}

	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		Prompt:        "Prompt",
		CorrectAnswer: "Answer",
	}
	dbErr := errors.New("connection reset")
	sRepo.GetReviewErr = dbErr

	_, err = uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{
		ExerciseID: "ex-1",
		Quality:    &q,
	})
	if !errors.Is(err, dbErr) {
		t.Fatalf("expected propagated GetReview error, got %v", err)
	}
}

func TestGetDueReviews_SanitizesExercise(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	uc := exercise.NewUsecase(eRepo, sRepo, exercise.NewMockReadinessExamRepository(), language.NewMockRepository(), user.NewMockRepository())

	expl := "Secret explanation"
	sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
		ID:           "srs-1",
		UserID:       "user-1",
		ExerciseID:   "ex-1",
		NextReviewAt: time.Now().UTC().Add(-time.Hour),
		Exercise: &exercise.Exercise{
			ID:                "ex-1",
			Prompt:            "Translate",
			CorrectAnswer:     "Konnichiwa",
			AcceptableAnswers: []string{"konnichiwa"},
			DiagnosticRubric:  map[string]any{"x": "y"},
			Explanation:       &expl,
		},
	}

	queue, err := uc.GetDueReviews(context.Background(), "user-1", 10)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(queue.Items) != 1 || queue.Items[0].Exercise == nil {
		t.Fatalf("expected 1 due review with embedded exercise, got %+v", queue.Items)
	}
	ex := queue.Items[0].Exercise
	if ex.CorrectAnswer != "" || ex.AcceptableAnswers != nil || ex.DiagnosticRubric != nil || ex.Explanation != nil {
		t.Fatalf("expected embedded exercise secrets to be sanitized, got %+v", ex)
	}
}

func TestSubmitExam_AlreadyPassedAndEmptyBank(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()

	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1, PassingScorePercent: 60}
	langRepo.Levels["lvl-n5"] = lvlN5
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}

	uc := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), examRepo, langRepo, user.NewMockRepository())

	// Empty bank should return 404 EXAM_QUESTIONS_NOT_FOUND
	_, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-n5",
		Answers: []exercise.SubmitExerciseAnswerRequest{{ExerciseID: "q-1", UserAnswer: "A"}},
	})
	var appErr *apperror.DomainError
	if !errors.As(err, &appErr) || appErr.Code != "EXAM_QUESTIONS_NOT_FOUND" {
		t.Fatalf("expected EXAM_QUESTIONS_NOT_FOUND for empty exam bank, got %v", err)
	}

	// Already passed should return ErrExamAlreadyPassed
	eRepo.ReadinessExamExercises["lvl-n5"] = []exercise.Exercise{{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"}}
	examRepo.Attempts = append(examRepo.Attempts, exercise.ReadinessExamAttempt{
		ID:       "att-1",
		UserID:   "user-1",
		LevelID:  "lvl-n5",
		IsPassed: true,
	})

	_, err = uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-n5",
		Answers: []exercise.SubmitExerciseAnswerRequest{{ExerciseID: "q-1", UserAnswer: "A"}},
	})
	if !errors.Is(err, exercise.ErrExamAlreadyPassed) {
		t.Fatalf("expected ErrExamAlreadyPassed, got %v", err)
	}
}

func TestSubmitExam_SkippedPillarScoresZero(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	eRepo.ReadinessExamExercises["lvl-n5"] = []exercise.Exercise{
		{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"},
		{ID: "q-2", SkillPillar: "listening", CorrectAnswer: "B"},
	}

	langRepo := language.NewMockRepository()
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1, PassingScorePercent: 80}
	langRepo.Levels["lvl-n5"] = lvlN5
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}

	uc := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), exercise.NewMockReadinessExamRepository(), langRepo, user.NewMockRepository())

	res, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-n5",
		Answers: []exercise.SubmitExerciseAnswerRequest{
			{ExerciseID: "q-1", UserAnswer: "A"},
		},
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.Attempt.ReadingScore != 100 || res.Attempt.ListeningScore != 0 || res.Attempt.OverallScore != 50 {
		t.Fatalf("expected reading=100, listening=0, overall=50, got reading=%d listening=%d overall=%d",
			res.Attempt.ReadingScore, res.Attempt.ListeningScore, res.Attempt.OverallScore)
	}
}

func TestProcessReview_LockedLessonReturnsForbidden(t *testing.T) {
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

	q := 4
	_, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{
		ExerciseID: "ex-1",
		Quality:    &q,
	})
	if !errors.Is(err, exercise.ErrExerciseLessonLocked) {
		t.Fatalf("expected ErrExerciseLessonLocked, got %v", err)
	}
}

func TestSubmitExam_InvalidExerciseIDReturnsBadRequest(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	eRepo.ReadinessExamExercises["lvl-n5"] = []exercise.Exercise{
		{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"},
	}

	langRepo := language.NewMockRepository()
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1, PassingScorePercent: 60}
	langRepo.Levels["lvl-n5"] = lvlN5
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}

	examRepo := exercise.NewMockReadinessExamRepository()
	uc := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), examRepo, langRepo, user.NewMockRepository())

	_, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-n5",
		Answers: []exercise.SubmitExerciseAnswerRequest{
			{ExerciseID: "foreign-question", UserAnswer: "A"},
		},
	})
	var domErr *apperror.DomainError
	if !errors.As(err, &domErr) || domErr.Code != "INVALID_EXAM_EXERCISE" {
		t.Fatalf("expected INVALID_EXAM_EXERCISE bad request, got %v", err)
	}
	if len(examRepo.Attempts) != 0 {
		t.Fatalf("expected no exam attempt saved on invalid exercise_id")
	}
}

type stubTxExamRepo struct {
	*exercise.MockReadinessExamRepository
	langRepo    *language.MockRepository
	txErr       error
	txCalled    bool
	nextLevelID string
}

func (s *stubTxExamRepo) RecordExamSubmissionTx(
	ctx context.Context,
	attempt *exercise.ReadinessExamAttempt,
	enrollmentID string,
	expectedLevelID string,
	nextLevelID string,
) (bool, error) {
	s.txCalled = true
	s.nextLevelID = nextLevelID
	if s.txErr != nil {
		return false, s.txErr
	}
	if err := s.CreateExamAttempt(ctx, attempt); err != nil {
		return false, err
	}
	if attempt.IsPassed && enrollmentID != "" && nextLevelID != "" && s.langRepo != nil {
		if err := s.langRepo.UpdateEnrollmentLevelIfCurrent(ctx, enrollmentID, expectedLevelID, nextLevelID); err != nil {
			return false, err
		}
		return true, nil
	}
	return false, nil
}

func TestSubmitExam_UsesTransactionalRecorderAndRollsBackOnError(t *testing.T) {
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

	txRepo := &stubTxExamRepo{
		MockReadinessExamRepository: exercise.NewMockReadinessExamRepository(),
		langRepo:                    langRepo,
		txErr:                       errors.New("tx aborted"),
	}
	inv := &stubCacheInvalidator{}
	uc := exercise.NewUsecaseFull(eRepo, exercise.NewMockSRSRepository(), txRepo, langRepo, user.NewMockRepository(), nil, inv)

	if _, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-n5",
		Answers: []exercise.SubmitExerciseAnswerRequest{{ExerciseID: "q-1", UserAnswer: "A"}},
	}); err == nil {
		t.Fatalf("expected transactional error to fail SubmitExam")
	}
	if !txRepo.txCalled || txRepo.nextLevelID != "lvl-n4" {
		t.Fatalf("expected RecordExamSubmissionTx called with nextLevelID=lvl-n4, got called=%v next=%s", txRepo.txCalled, txRepo.nextLevelID)
	}
	if inv.calls != 0 || len(txRepo.Attempts) != 0 {
		t.Fatalf("expected no cache invalidation or attempt recorded on rollback")
	}
}

func TestGetDailyVocabularies_ReturnsItems(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	eRepo.DailyVocabularies = []exercise.VocabularyItem{
		{ID: "v-1", Term: "みず", Reading: "みず • Mizu", Meaning: "Air", Category: "basic", DifficultyLevel: "N5"},
	}

	uc := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), exercise.NewMockReadinessExamRepository(), language.NewMockRepository(), user.NewMockRepository())
	items, err := uc.GetDailyVocabularies(context.Background(), "user-1", 0)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(items) != 1 || items[0].Term != "みず" {
		t.Fatalf("expected 1 daily vocabulary item, got %+v", items)
	}
}

func TestSubmitAnswer_WrongLowersExistingEaseFactorWithFloor(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		Prompt:        "Test 1",
		CorrectAnswer: "Correct",
	}
	eRepo.Exercises["ex-2"] = &exercise.Exercise{
		ID:            "ex-2",
		Prompt:        "Test 2",
		CorrectAnswer: "Correct",
	}
	sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
		ID:              "srs-1",
		UserID:          "user-1",
		ExerciseID:      "ex-1",
		RepetitionCount: 3,
		IntervalDays:    6,
		EaseFactor:      2.40,
	}
	sRepo.Reviews["user-1:ex-2"] = &exercise.UserSRSReview{
		ID:              "srs-2",
		UserID:          "user-1",
		ExerciseID:      "ex-2",
		RepetitionCount: 3,
		IntervalDays:    6,
		EaseFactor:      1.85,
	}

	uc := exercise.NewUsecase(eRepo, sRepo, exercise.NewMockReadinessExamRepository(), language.NewMockRepository(), user.NewMockRepository())

	if _, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-1",
		UserAnswer: "Wrong",
	}); err != nil {
		t.Fatalf("expected no error for ex-1, got %v", err)
	}
	if _, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-2",
		UserAnswer: "Wrong",
	}); err != nil {
		t.Fatalf("expected no error for ex-2, got %v", err)
	}

	updated1 := sRepo.Reviews["user-1:ex-1"]
	if updated1.RepetitionCount != 0 || updated1.IntervalDays != 1 || math.Abs(updated1.EaseFactor-1.60) > 1e-9 {
		t.Fatalf("expected reps=0 interval=1 lowered ease=1.60 (from 2.40), got %+v", updated1)
	}
	updated2 := sRepo.Reviews["user-1:ex-2"]
	if updated2.RepetitionCount != 0 || updated2.IntervalDays != 1 || math.Abs(updated2.EaseFactor-1.30) > 1e-9 {
		t.Fatalf("expected reps=0 interval=1 floored ease=1.30 (from 1.85), got %+v", updated2)
	}
}

func TestExtractDiagnosticFeedback_ShortRuneGuard(t *testing.T) {
	h := exercise.NewHelper()
	rubric := map[string]any{
		"は": "Partikel topik.",
	}

	if fb := h.ExtractDiagnosticFeedback(rubric, "おはよう"); fb != nil {
		t.Fatalf("expected single-rune particle key not to false-match inside unrelated word, got %q", *fb)
	}
	if fb := h.ExtractDiagnosticFeedback(rubric, "わたし は がくせい"); fb == nil || *fb != "Partikel topik." {
		t.Fatalf("expected token match on isolated particle, got %v", fb)
	}
}

func TestGetExamQuestions_RejectsAlreadyPassedLevel(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()

	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1}
	langRepo.Levels["lvl-n5"] = lvlN5
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}
	eRepo.ReadinessExamExercises["lvl-n5"] = []exercise.Exercise{{ID: "q-1", SkillPillar: "reading"}}
	examRepo.Attempts = append(examRepo.Attempts, exercise.ReadinessExamAttempt{
		ID:       "att-1",
		UserID:   "user-1",
		LevelID:  "lvl-n5",
		IsPassed: true,
	})

	uc := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), examRepo, langRepo, user.NewMockRepository())
	_, err := uc.GetExamQuestions(context.Background(), "user-1", "lvl-n5")
	if !errors.Is(err, exercise.ErrExamAlreadyPassed) {
		t.Fatalf("expected ErrExamAlreadyPassed when level already passed, got %v", err)
	}
}

func TestGetExamResult_ReturnsAttemptAndCertificate(t *testing.T) {
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

	_ = userRepo.Create(context.Background(), &user.User{
		UserAccount: user.UserAccount{ID: "user-1", Email: "budi@example.com"},
		UserProfile: user.UserProfile{Name: "Budi", Username: "budi"},
	})
	lvlN5 := &language.ProficiencyLevel{
		ID:                  "lvl-n5",
		LanguageID:          "lang-ja",
		Code:                "N5",
		OfficialExamName:    "JLPT N5 Readiness",
		PassingScorePercent: 60,
		OrderIndex:          1,
	}
	langRepo.Levels["lvl-n5"] = lvlN5
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}

	uc := exercise.NewUsecase(exercise.NewMockRepository(), exercise.NewMockSRSRepository(), examRepo, langRepo, userRepo)

	if _, err := uc.GetExamResult(context.Background(), "user-1", "lvl-n5"); !errors.Is(err, exercise.ErrExamResultNotFound) {
		t.Fatalf("expected ErrExamResultNotFound before any passed attempt, got %v", err)
	}

	examRepo.Attempts = append(examRepo.Attempts, exercise.ReadinessExamAttempt{
		ID:           "att-1",
		UserID:       "user-1",
		LevelID:      "lvl-n5",
		ReadingScore: 100,
		ScorePercent: 80,
		IsPassed:     true,
		AttemptedAt:  time.Date(2026, 11, 10, 8, 0, 0, 0, time.UTC),
		AnalysisReport: map[string]any{
			"answers": map[string]any{
				"q-1": map[string]any{"is_correct": true},
				"q-2": map[string]any{"is_correct": true},
				"q-3": map[string]any{"is_correct": true},
				"q-4": map[string]any{"is_correct": true},
				"q-5": map[string]any{"is_correct": false},
			},
		},
	})

	res, err := uc.GetExamResult(context.Background(), "user-1", "lvl-n5")
	if err != nil {
		t.Fatalf("expected GetExamResult to succeed, got %v", err)
	}
	if res.Certificate == nil || res.Certificate.CandidateName != "Budi" || res.Certificate.Score != 4 || res.Certificate.MaxScore != 5 {
		t.Fatalf("unexpected certificate payload: %+v", res.Certificate)
	}
}

func TestSubmitAnswer_SkipSRSSchedule_PreservesExistingSRSState(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		Prompt:        "Test 1",
		CorrectAnswer: "Correct",
	}
	eRepo.Exercises["ex-2"] = &exercise.Exercise{
		ID:            "ex-2",
		Prompt:        "Test 2",
		CorrectAnswer: "Correct",
	}

	existingDue := time.Date(2026, 11, 20, 9, 0, 0, 0, time.UTC)
	sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
		ID:              "srs-1",
		UserID:          "user-1",
		ExerciseID:      "ex-1",
		RepetitionCount: 4,
		IntervalDays:    15,
		EaseFactor:      2.35,
		NextReviewAt:    existingDue,
	}

	uc := exercise.NewUsecase(eRepo, sRepo, exercise.NewMockReadinessExamRepository(), language.NewMockRepository(), user.NewMockRepository())

	res1, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID:      "ex-1",
		UserAnswer:      "Wrong",
		SkipSRSSchedule: true,
	})
	if err != nil {
		t.Fatalf("expected no error for ex-1, got %v", err)
	}
	if res1.IsCorrect {
		t.Fatalf("expected is_correct false")
	}
	if res1.NextReviewDue != nil {
		t.Fatalf("expected NextReviewDue nil when skip_srs_schedule is true, got %v", res1.NextReviewDue)
	}
	card1 := sRepo.Reviews["user-1:ex-1"]
	if card1.RepetitionCount != 4 || card1.IntervalDays != 15 || math.Abs(card1.EaseFactor-2.35) > 1e-9 || !card1.NextReviewAt.Equal(existingDue) {
		t.Fatalf("expected existing SRS card to remain untouched, got %+v", card1)
	}

	res2, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID:      "ex-2",
		UserAnswer:      "Wrong",
		SkipSRSSchedule: true,
	})
	if err != nil {
		t.Fatalf("expected no error for ex-2, got %v", err)
	}
	if res2.NextReviewDue != nil {
		t.Fatalf("expected NextReviewDue nil for unscheduled card, got %v", res2.NextReviewDue)
	}
	if _, exists := sRepo.Reviews["user-1:ex-2"]; exists {
		t.Fatalf("expected no new SRS card created when skip_srs_schedule is true")
	}
}

func TestSubmitExam_ZeroQuestionPillarScoresZero(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	eRepo.ReadinessExamExercises["lvl-n5"] = []exercise.Exercise{
		{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"},
	}

	langRepo := language.NewMockRepository()
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1, PassingScorePercent: 60}
	langRepo.Levels["lvl-n5"] = lvlN5
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}

	uc := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), exercise.NewMockReadinessExamRepository(), langRepo, user.NewMockRepository())

	res, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-n5",
		Answers: []exercise.SubmitExerciseAnswerRequest{{ExerciseID: "q-1", UserAnswer: "A"}},
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.Attempt.OverallScore != 100 || res.Attempt.ReadingScore != 100 {
		t.Fatalf("expected overall=100 reading=100, got overall=%d reading=%d", res.Attempt.OverallScore, res.Attempt.ReadingScore)
	}
	if res.Attempt.ListeningScore != 0 || res.Attempt.WritingScore != 0 || res.Attempt.SpeakingScore != 0 {
		t.Fatalf("expected zero-question pillars to score 0, got listening=%d writing=%d speaking=%d",
			res.Attempt.ListeningScore, res.Attempt.WritingScore, res.Attempt.SpeakingScore)
	}
	pillars, ok := res.Attempt.AnalysisReport["pillars"].(map[string]int)
	if !ok {
		t.Fatalf("expected pillars map in analysis report, got %T", res.Attempt.AnalysisReport["pillars"])
	}
	if pillars["listening"] != 0 || pillars["writing"] != 0 || pillars["speaking"] != 0 {
		t.Fatalf("expected 0 for untested pillars in analysis report, got %+v", pillars)
	}
}

func TestExamCertificate_UniqueAcrossUsersAndAttempts(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	eRepo.ReadinessExamExercises["lvl-n5"] = []exercise.Exercise{
		{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"},
	}

	langRepo := language.NewMockRepository()
	lvlN5 := &language.ProficiencyLevel{
		ID:                  "lvl-n5",
		LanguageID:          "lang-ja",
		Code:                "N5",
		OfficialExamName:    "JLPT N5 Readiness",
		OrderIndex:          1,
		PassingScorePercent: 60,
	}
	langRepo.Levels["lvl-n5"] = lvlN5
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}
	langRepo.Enrollments["enr-2"] = &language.UserLanguageEnrollment{
		ID:             "enr-2",
		UserID:         "user-2",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}

	userRepo := user.NewMockRepository()
	_ = userRepo.Create(context.Background(), &user.User{
		UserAccount: user.UserAccount{ID: "user-1", Email: "alice@example.com"},
		UserProfile: user.UserProfile{Name: "Alice", Username: "alice"},
	})
	_ = userRepo.Create(context.Background(), &user.User{
		UserAccount: user.UserAccount{ID: "user-2", Email: "bob@example.com"},
		UserProfile: user.UserProfile{Name: "Bob", Username: "bob"},
	})

	examRepo := exercise.NewMockReadinessExamRepository()
	uc := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), examRepo, langRepo, userRepo)

	res1, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-n5",
		Answers: []exercise.SubmitExerciseAnswerRequest{{ExerciseID: "q-1", UserAnswer: "A"}},
	})
	if err != nil {
		t.Fatalf("expected user-1 SubmitExam to succeed, got %v", err)
	}
	res2, err := uc.SubmitExam(context.Background(), "user-2", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-n5",
		Answers: []exercise.SubmitExerciseAnswerRequest{{ExerciseID: "q-1", UserAnswer: "A"}},
	})
	if err != nil {
		t.Fatalf("expected user-2 SubmitExam to succeed, got %v", err)
	}
	if res1.Certificate == nil || res2.Certificate == nil {
		t.Fatalf("expected both users to receive certificates")
	}
	if !strings.HasPrefix(res1.Certificate.CertificateID, "CERT-N5-") {
		t.Fatalf("expected CertificateID prefix CERT-N5-, got %s", res1.Certificate.CertificateID)
	}
	if res1.Certificate.CertificateID == res2.Certificate.CertificateID {
		t.Fatalf("expected same-day certificates across users to have distinct IDs, both got %s", res1.Certificate.CertificateID)
	}

	got1, err := uc.GetExamResult(context.Background(), "user-1", "lvl-n5")
	if err != nil {
		t.Fatalf("expected GetExamResult to succeed, got %v", err)
	}
	if got1.Certificate == nil || got1.Certificate.CertificateID != res1.Certificate.CertificateID {
		t.Fatalf("expected deterministic CertificateID %s on GetExamResult, got %+v", res1.Certificate.CertificateID, got1.Certificate)
	}

	sameDay := time.Date(2026, 11, 14, 10, 0, 0, 0, time.UTC)
	examRepoA := exercise.NewMockReadinessExamRepository()
	examRepoA.Attempts = append(examRepoA.Attempts, exercise.ReadinessExamAttempt{
		ID: "att-a", UserID: "user-1", LevelID: "lvl-n5", ScorePercent: 100, IsPassed: true, AttemptedAt: sameDay,
	})
	examRepoB := exercise.NewMockReadinessExamRepository()
	examRepoB.Attempts = append(examRepoB.Attempts, exercise.ReadinessExamAttempt{
		ID: "att-b", UserID: "user-1", LevelID: "lvl-n5", ScorePercent: 100, IsPassed: true, AttemptedAt: sameDay,
	})
	resA, err := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), examRepoA, langRepo, userRepo).GetExamResult(context.Background(), "user-1", "lvl-n5")
	if err != nil {
		t.Fatalf("expected examRepoA GetExamResult to succeed, got %v", err)
	}
	resB, err := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), examRepoB, langRepo, userRepo).GetExamResult(context.Background(), "user-1", "lvl-n5")
	if err != nil {
		t.Fatalf("expected examRepoB GetExamResult to succeed, got %v", err)
	}
	if resA.Certificate.CertificateID == resB.Certificate.CertificateID {
		t.Fatalf("expected distinct attempts on same day to yield distinct CertificateIDs, both got %s", resA.Certificate.CertificateID)
	}
}

func TestHelper_CalculateSM2_FailLowersEaseAndFloorsAt130(t *testing.T) {
	h := exercise.NewHelper()
	now := time.Date(2026, 11, 14, 0, 0, 0, 0, time.UTC)

	cases := []struct {
		name         string
		quality      int
		prevReps     int
		prevInterval int
		prevEase     float64
		wantReps     int
		wantInterval int
		wantEase     float64
	}{
		{name: "quality 2 lowers ease", quality: 2, prevReps: 2, prevInterval: 6, prevEase: 2.50, wantReps: 0, wantInterval: 1, wantEase: 2.18},
		{name: "quality 1 lowers ease", quality: 1, prevReps: 3, prevInterval: 12, prevEase: 2.50, wantReps: 0, wantInterval: 1, wantEase: 1.96},
		{name: "quality 0 lowers ease", quality: 0, prevReps: 1, prevInterval: 1, prevEase: 2.50, wantReps: 0, wantInterval: 1, wantEase: 1.70},
		{name: "quality 0 clamps to 1.30 floor", quality: 0, prevReps: 2, prevInterval: 6, prevEase: 1.50, wantReps: 0, wantInterval: 1, wantEase: 1.30},
		{name: "quality 0 at 1.30 stays at 1.30", quality: 0, prevReps: 0, prevInterval: 1, prevEase: 1.30, wantReps: 0, wantInterval: 1, wantEase: 1.30},
		{name: "quality 3 clamps to 1.30 floor", quality: 3, prevReps: 0, prevInterval: 1, prevEase: 1.35, wantReps: 1, wantInterval: 1, wantEase: 1.30},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			got := h.CalculateSM2(tc.quality, tc.prevReps, tc.prevInterval, tc.prevEase, now)
			if got.Repetitions != tc.wantReps || got.IntervalDays != tc.wantInterval || math.Abs(got.EaseFactor-tc.wantEase) > 1e-9 {
				t.Fatalf("got %+v, want reps=%d interval=%d ease=%.2f", got, tc.wantReps, tc.wantInterval, tc.wantEase)
			}
		})
	}
}
