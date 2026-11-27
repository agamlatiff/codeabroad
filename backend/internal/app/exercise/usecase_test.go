package exercise_test

import (
	"context"
	"errors"
	"math"
	"strings"
	"testing"
	"time"

	"merantalk/backend/internal/app/exercise"
	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/app/language"
	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/apperror"
)

func TestSubmitAnswer_Correct(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		Prompt:        "What is 'Konnichiwa'?",
		CorrectAnswer: "Hello",
		XPReward:      10,
	}

	sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
		ID:           "srs-1",
		UserID:       "user-1",
		ExerciseID:   "ex-1",
		NextReviewAt: time.Now().UTC().Add(-time.Hour),
	}

	uc := exercise.NewUsecaseWithAccessChecker(eRepo, sRepo, examRepo, langRepo, userRepo, exercise.NewMockLessonAccessChecker(true))

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

	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		Prompt:        "What is 'Konnichiwa'?",
		CorrectAnswer: "Hello",
		XPReward:      10,
	}

	sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
		ID:           "srs-1",
		UserID:       "user-1",
		ExerciseID:   "ex-1",
		NextReviewAt: time.Now().UTC().Add(-time.Hour),
	}

	uc := exercise.NewUsecaseWithAccessChecker(eRepo, sRepo, examRepo, langRepo, userRepo, exercise.NewMockLessonAccessChecker(true))

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

	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		ExerciseType:  exercise.ExerciseTypeFillBlank,
		Prompt:        "Review prompt",
		CorrectAnswer: "Answer",
	}

	sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
		ID:           "srs-1",
		UserID:       "user-1",
		ExerciseID:   "ex-1",
		NextReviewAt: time.Now().UTC().Add(-time.Hour),
	}

	uc := exercise.NewUsecaseWithAccessChecker(eRepo, sRepo, examRepo, langRepo, userRepo, exercise.NewMockLessonAccessChecker(true))

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

	lessonID := "lesson-1"
	eRepo.Exercises["ex-2"] = &exercise.Exercise{
		ID:                "ex-2",
		LessonID:          &lessonID,
		Prompt:            "Type 'Tokyo' in Japanese",
		CorrectAnswer:     "東京",
		AcceptableAnswers: []string{"とうきょう", "tokyo"},
		XPReward:          10,
	}

	sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
		ID:           "srs-1",
		UserID:       "user-1",
		ExerciseID:   "ex-1",
		NextReviewAt: time.Now().UTC().Add(-time.Hour),
	}

	uc := exercise.NewUsecaseWithAccessChecker(eRepo, sRepo, examRepo, langRepo, userRepo, exercise.NewMockLessonAccessChecker(true))

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

	lessonID := "lesson-1"
	eRepo.Exercises["ex-3"] = &exercise.Exercise{
		ID:            "ex-3",
		LessonID:      &lessonID,
		Prompt:        "Choose particle for direction",
		CorrectAnswer: "へ",
		DiagnosticRubric: map[string]any{
			"で": "Partikel で digunakan untuk tempat terjadinya aktivitas, bukan arah.",
		},
		XPReward: 10,
	}

	sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
		ID:           "srs-1",
		UserID:       "user-1",
		ExerciseID:   "ex-1",
		NextReviewAt: time.Now().UTC().Add(-time.Hour),
	}

	uc := exercise.NewUsecaseWithAccessChecker(eRepo, sRepo, examRepo, langRepo, userRepo, exercise.NewMockLessonAccessChecker(true))

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
			{ExerciseID: " q-1 ", UserAnswer: "A", TimeSpentSeconds: 12},
			{ExerciseID: "q-2", UserAnswer: "B", TimeSpentSeconds: 999999},
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
	if answersMap, ok := res.Attempt.AnalysisReport["answers"].(map[string]any); ok {
		if q1, ok := answersMap["q-1"].(map[string]any); !ok || q1["time_spent_seconds"] != 12 {
			t.Errorf("expected trimmed q-1 time_spent_seconds=12, got %+v", answersMap["q-1"])
		}
		if q2, ok := answersMap["q-2"].(map[string]any); !ok || q2["time_spent_seconds"] != 86400 {
			t.Errorf("expected clamped q-2 time_spent_seconds=86400, got %+v", answersMap["q-2"])
		}
	} else {
		t.Errorf("expected answers map in AnalysisReport")
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
	eRepo.ReadinessExamExercises["lvl-n4"] = []exercise.Exercise{
		{ID: "q-n4-1", SkillPillar: "reading", CorrectAnswer: "B"},
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
	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		Prompt:        "Test",
		CorrectAnswer: "A",
	}

	uc := exercise.NewUsecaseWithAccessChecker(eRepo, exercise.NewMockSRSRepository(), exercise.NewMockReadinessExamRepository(), language.NewMockRepository(), user.NewMockRepository(), exercise.NewMockLessonAccessChecker(true))

	if _, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-1",
		UserAnswer: "A",
	}); !errors.Is(err, eRepo.CreateAttemptErr) {
		t.Fatalf("expected CreateAttempt error to propagate, got %v", err)
	}
}

func TestProcessReview_MissingExerciseAndDBError(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	uc := exercise.NewUsecaseWithAccessChecker(eRepo, sRepo, exercise.NewMockReadinessExamRepository(), language.NewMockRepository(), user.NewMockRepository(), exercise.NewMockLessonAccessChecker(true))

	q := 4
	_, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{
		ExerciseID: "missing-ex",
		Quality:    &q,
	})
	if !errors.Is(err, exercise.ErrExerciseNotFound) {
		t.Fatalf("expected ErrExerciseNotFound, got %v", err)
	}

	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
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
	eRepo.ReadinessExamExercises["lvl-n4"] = []exercise.Exercise{
		{ID: "q-n4-1", SkillPillar: "reading", CorrectAnswer: "B"},
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
	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		Prompt:        "Test 1",
		CorrectAnswer: "Correct",
	}
	eRepo.Exercises["ex-2"] = &exercise.Exercise{
		ID:            "ex-2",
		LessonID:      &lessonID,
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

	uc := exercise.NewUsecaseWithAccessChecker(eRepo, sRepo, exercise.NewMockReadinessExamRepository(), language.NewMockRepository(), user.NewMockRepository(), exercise.NewMockLessonAccessChecker(true))

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
	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		Prompt:        "Test 1",
		CorrectAnswer: "Correct",
	}
	eRepo.Exercises["ex-2"] = &exercise.Exercise{
		ID:            "ex-2",
		LessonID:      &lessonID,
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

	uc := exercise.NewUsecaseWithAccessChecker(eRepo, sRepo, exercise.NewMockReadinessExamRepository(), language.NewMockRepository(), user.NewMockRepository(), exercise.NewMockLessonAccessChecker(true))

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

func TestLoadAuthorizedExercise_RejectsDetachedExercise(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	eRepo.Exercises["ex-detached"] = &exercise.Exercise{
		ID:            "ex-detached",
		LessonID:      nil,
		Prompt:        "Detached",
		CorrectAnswer: "A",
	}
	emptyLesson := ""
	eRepo.Exercises["ex-empty-lesson"] = &exercise.Exercise{
		ID:            "ex-empty-lesson",
		LessonID:      &emptyLesson,
		Prompt:        "Empty Lesson",
		CorrectAnswer: "A",
	}

	uc := exercise.NewUsecaseWithAccessChecker(
		eRepo,
		exercise.NewMockSRSRepository(),
		exercise.NewMockReadinessExamRepository(),
		language.NewMockRepository(),
		user.NewMockRepository(),
		exercise.NewMockLessonAccessChecker(true),
	)

	if _, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-detached",
		UserAnswer: "A",
	}); !errors.Is(err, apperror.ErrForbidden) {
		t.Fatalf("expected apperror.ErrForbidden for detached exercise SubmitAnswer, got %v", err)
	}

	q := 4
	if _, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{
		ExerciseID: "ex-detached",
		Quality:    &q,
	}); !errors.Is(err, apperror.ErrForbidden) {
		t.Fatalf("expected apperror.ErrForbidden for detached exercise ProcessReview, got %v", err)
	}

	if _, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-empty-lesson",
		UserAnswer: "A",
	}); !errors.Is(err, apperror.ErrForbidden) {
		t.Fatalf("expected apperror.ErrForbidden for empty LessonID SubmitAnswer, got %v", err)
	}
}

func TestVerifyLessonUnlocked_MissingAccessCheckerRejected(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		Prompt:        "Test",
		CorrectAnswer: "A",
	}

	uc := exercise.NewUsecase(
		eRepo,
		exercise.NewMockSRSRepository(),
		exercise.NewMockReadinessExamRepository(),
		language.NewMockRepository(),
		user.NewMockRepository(),
	)

	if _, err := uc.GetExercisesByLesson(context.Background(), "user-1", lessonID); !errors.Is(err, apperror.ErrInternal) {
		t.Fatalf("expected apperror.ErrInternal when accessChecker is nil on GetExercisesByLesson, got %v", err)
	}
	if _, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-1",
		UserAnswer: "A",
	}); !errors.Is(err, apperror.ErrInternal) {
		t.Fatalf("expected apperror.ErrInternal when accessChecker is nil on SubmitAnswer, got %v", err)
	}
	q := 4
	if _, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{
		ExerciseID: "ex-1",
		Quality:    &q,
	}); !errors.Is(err, apperror.ErrInternal) {
		t.Fatalf("expected apperror.ErrInternal when accessChecker is nil on ProcessReview, got %v", err)
	}
}

func TestGetExamResult_SucceedsWhenLanguageEnrollmentInactive(t *testing.T) {
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
	lvlA1 := &language.ProficiencyLevel{
		ID:                  "lvl-a1",
		LanguageID:          "lang-de",
		Code:                "A1",
		OfficialExamName:    "Goethe A1",
		PassingScorePercent: 60,
		OrderIndex:          1,
	}
	langRepo.Levels["lvl-n5"] = lvlN5
	langRepo.Levels["lvl-a1"] = lvlA1
	langRepo.Enrollments["enr-ja"] = &language.UserLanguageEnrollment{
		ID:             "enr-ja",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       false,
		CurrentLevel:   lvlN5,
	}
	langRepo.Enrollments["enr-de"] = &language.UserLanguageEnrollment{
		ID:             "enr-de",
		UserID:         "user-1",
		LanguageID:     "lang-de",
		CurrentLevelID: &lvlA1.ID,
		IsActive:       true,
		CurrentLevel:   lvlA1,
	}

	examRepo.Attempts = append(examRepo.Attempts, exercise.ReadinessExamAttempt{
		ID:           "att-ja-1",
		UserID:       "user-1",
		LevelID:      "lvl-n5",
		ScorePercent: 85,
		IsPassed:     true,
		AttemptedAt:  time.Date(2026, 11, 10, 8, 0, 0, 0, time.UTC),
	})

	uc := exercise.NewUsecase(exercise.NewMockRepository(), exercise.NewMockSRSRepository(), examRepo, langRepo, userRepo)

	res, err := uc.GetExamResult(context.Background(), "user-1", "lvl-n5")
	if err != nil {
		t.Fatalf("expected GetExamResult to succeed for inactive language enrollment, got %v", err)
	}
	if res.Certificate == nil || res.Certificate.LevelCode != "N5" || res.Certificate.CandidateName != "Budi" {
		t.Fatalf("unexpected certificate payload: %+v", res.Certificate)
	}

	// Unenrolled user must still be rejected with ErrForbidden
	if _, err := uc.GetExamResult(context.Background(), "user-other", "lvl-n5"); !errors.Is(err, apperror.ErrForbidden) {
		t.Fatalf("expected apperror.ErrForbidden for user without language enrollment, got %v", err)
	}
}

func TestSubmitExam_DoesNotAdvanceToUnconfiguredNextLevel(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	eRepo.ReadinessExamExercises["lvl-n5"] = []exercise.Exercise{
		{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"},
	}
	// Note: lvl-n4 has no readiness exam exercises configured

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
		t.Fatalf("expected exam submission to succeed even when next level is unconfigured, got %v", err)
	}
	if !res.Attempt.IsPassed || res.Certificate == nil {
		t.Fatalf("expected passed attempt and certificate")
	}
	if langRepo.Enrollments["enr-1"].CurrentLevelID == nil || *langRepo.Enrollments["enr-1"].CurrentLevelID != "lvl-n5" {
		t.Fatalf("expected enrollment level to stay at lvl-n5 when lvl-n4 has no configured exercises, got %v", langRepo.Enrollments["enr-1"].CurrentLevelID)
	}
	if inv.calls != 0 {
		t.Fatalf("expected no curriculum cache invalidation when level did not advance, got %d", inv.calls)
	}
}

func TestMockRepository_GetExerciseByID_ReturnsNotFound(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	ex, err := eRepo.GetExerciseByID(context.Background(), "missing-id")
	if !errors.Is(err, exercise.ErrExerciseNotFound) || ex != nil {
		t.Fatalf("expected (nil, ErrExerciseNotFound), got (%v, %v)", ex, err)
	}
}

type spySRSRepository struct {
	*exercise.MockSRSRepository
	dueCountCalls int
	txReviewCalls int
	enableTx      bool
	masteredCount int
}

func (s *spySRSRepository) CountMasteredReviews(_ context.Context, _ string) (int, error) {
	return s.masteredCount, nil
}

func (s *spySRSRepository) GetDueCount(ctx context.Context, userID string, now time.Time) (int, error) {
	s.dueCountCalls++
	return s.MockSRSRepository.GetDueCount(ctx, userID, now)
}

func (s *spySRSRepository) ApplyDueReviewTx(
	ctx context.Context,
	userID, exerciseID string,
	now time.Time,
	compute func(prevReps, prevInterval int, prevEase float64) *exercise.UserSRSReview,
) (*exercise.UserSRSReview, error) {
	s.txReviewCalls++
	if !s.enableTx {
		return nil, errors.New("unexpected tx call")
	}
	return s.MockSRSRepository.ApplyDueReviewTx(ctx, userID, exerciseID, now, compute)
}

func (s *spySRSRepository) ApplyReviewTx(
	ctx context.Context,
	userID, exerciseID string,
	compute func(prevReps, prevInterval int, prevEase float64) *exercise.UserSRSReview,
) (*exercise.UserSRSReview, error) {
	s.txReviewCalls++
	if !s.enableTx {
		return nil, errors.New("unexpected tx call")
	}
	prevReps, prevInterval, prevEase := 0, 1, 2.5
	if cur, err := s.MockSRSRepository.GetReview(ctx, userID, exerciseID); err == nil && cur != nil {
		prevReps = cur.RepetitionCount
		prevInterval = cur.IntervalDays
		prevEase = cur.EaseFactor
	}
	updated := compute(prevReps, prevInterval, prevEase)
	if err := s.MockSRSRepository.UpsertReview(ctx, updated); err != nil {
		return nil, err
	}
	return updated, nil
}

func TestGetDueReviews_SkipsGetDueCountWhenBelowLimit(t *testing.T) {
	sRepo := &spySRSRepository{MockSRSRepository: exercise.NewMockSRSRepository()}
	sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
		ID:           "srs-1",
		UserID:       "user-1",
		ExerciseID:   "ex-1",
		NextReviewAt: time.Now().UTC().Add(-time.Hour),
	}

	uc := exercise.NewUsecase(
		exercise.NewMockRepository(),
		sRepo,
		exercise.NewMockReadinessExamRepository(),
		language.NewMockRepository(),
		user.NewMockRepository(),
	)

	queue, err := uc.GetDueReviews(context.Background(), "user-1", 10)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if queue.TotalDue != 1 || sRepo.dueCountCalls != 0 {
		t.Fatalf("expected TotalDue=1 and 0 GetDueCount calls when len<limit, got TotalDue=%d calls=%d", queue.TotalDue, sRepo.dueCountCalls)
	}

	// When len(reviews) == limit, GetDueCount must be queried for accurate total_due.
	sRepo.Reviews["user-1:ex-2"] = &exercise.UserSRSReview{
		ID:           "srs-2",
		UserID:       "user-1",
		ExerciseID:   "ex-2",
		NextReviewAt: time.Now().UTC().Add(-2 * time.Hour),
	}
	queue2, err := uc.GetDueReviews(context.Background(), "user-1", 1)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if queue2.TotalDue != 2 || sRepo.dueCountCalls != 1 {
		t.Fatalf("expected TotalDue=2 and 1 GetDueCount call when len>=limit, got TotalDue=%d calls=%d", queue2.TotalDue, sRepo.dueCountCalls)
	}
}

func TestSubmitAnswer_ClampsExcessiveTimeSpentSeconds(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		Prompt:        "Test",
		CorrectAnswer: "A",
	}

	uc := exercise.NewUsecaseFull(
		eRepo,
		exercise.NewMockSRSRepository(),
		exercise.NewMockReadinessExamRepository(),
		language.NewMockRepository(),
		user.NewMockRepository(),
		&stubLessonAccessChecker{unlocked: true},
		nil,
	)

	_, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID:       "ex-1",
		UserAnswer:       "A",
		TimeSpentSeconds: 999999,
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(eRepo.Attempts) != 1 || eRepo.Attempts[0].TimeSpentSeconds != 86400 {
		t.Fatalf("expected TimeSpentSeconds clamped to 86400, got %+v", eRepo.Attempts)
	}
}

func TestProcessReview_UsesTransactionalSRSReviewerWhenSupported(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		Prompt:        "Test",
		CorrectAnswer: "A",
	}

	sRepo := &spySRSRepository{
		MockSRSRepository: exercise.NewMockSRSRepository(),
		enableTx:          true,
	}
	sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
		ID:           "srs-1",
		UserID:       "user-1",
		ExerciseID:   "ex-1",
		NextReviewAt: time.Now().UTC().Add(-time.Hour),
	}
	uc := exercise.NewUsecaseFull(
		eRepo,
		sRepo,
		exercise.NewMockReadinessExamRepository(),
		language.NewMockRepository(),
		user.NewMockRepository(),
		&stubLessonAccessChecker{unlocked: true},
		nil,
	)

	q := 5
	rev, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{
		ExerciseID: "ex-1",
		Quality:    &q,
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if sRepo.txReviewCalls != 1 || rev.RepetitionCount != 1 {
		t.Fatalf("expected ApplyReviewTx called once and RepetitionCount=1, got calls=%d reps=%d", sRepo.txReviewCalls, rev.RepetitionCount)
	}
}

type stubBadgeAwarder struct {
	calls []string
}

func (s *stubBadgeAwarder) AwardBadge(_ context.Context, _ string, badgeKey string, _ int) (*gamification.UserBadge, error) {
	s.calls = append(s.calls, badgeKey)
	return &gamification.UserBadge{
		BadgeKey:     badgeKey,
		NewlyAwarded: true,
		Badge: &gamification.BadgeDefinition{
			ID:       badgeKey,
			Title:    "Penakluk JLPT N5",
			XPReward: 150,
		},
	}, nil
}

func TestSubmitExam_AwardsN5MasteryBadgeOnHighScore(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	lvlID := "lvl-n5"
	eRepo.ReadinessExamExercises[lvlID] = []exercise.Exercise{
		{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"},
		{ID: "q-2", SkillPillar: "reading", CorrectAnswer: "A"},
		{ID: "q-3", SkillPillar: "reading", CorrectAnswer: "A"},
		{ID: "q-4", SkillPillar: "reading", CorrectAnswer: "A"},
		{ID: "q-5", SkillPillar: "reading", CorrectAnswer: "A"},
	}

	langRepo := language.NewMockRepository()
	lvlN5 := &language.ProficiencyLevel{ID: lvlID, LanguageID: "lang-ja", Code: "N5", OrderIndex: 1, PassingScorePercent: 60}
	langRepo.Levels[lvlID] = lvlN5
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}

	badgeAwarder := &stubBadgeAwarder{}
	uc := exercise.NewUsecase(
		eRepo,
		exercise.NewMockSRSRepository(),
		exercise.NewMockReadinessExamRepository(),
		langRepo,
		user.NewMockRepository(),
	).WithBadgeAwarder(badgeAwarder)

	// 2/5 = 40%: fails exam -> should NOT award n5_mastery
	res40, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: lvlID,
		Answers: []exercise.SubmitExerciseAnswerRequest{
			{ExerciseID: "q-1", UserAnswer: "A"},
			{ExerciseID: "q-2", UserAnswer: "A"},
			{ExerciseID: "q-3", UserAnswer: "B"},
			{ExerciseID: "q-4", UserAnswer: "B"},
			{ExerciseID: "q-5", UserAnswer: "B"},
		},
	})
	if err != nil {
		t.Fatalf("expected 40%% submission to succeed, got %v", err)
	}
	if res40.Attempt.IsPassed || len(res40.AwardedBadges) != 0 || len(badgeAwarder.calls) != 0 {
		t.Fatalf("expected failed attempt without n5_mastery badge at 40%%, got passed=%v badges=%+v", res40.Attempt.IsPassed, res40.AwardedBadges)
	}

	// Fresh exam repo for 3/5 = 60%: meets passing threshold -> passes exam and awards n5_mastery
	uc60 := exercise.NewUsecase(
		eRepo,
		exercise.NewMockSRSRepository(),
		exercise.NewMockReadinessExamRepository(),
		langRepo,
		user.NewMockRepository(),
	).WithBadgeAwarder(badgeAwarder)
	res60, err := uc60.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: lvlID,
		Answers: []exercise.SubmitExerciseAnswerRequest{
			{ExerciseID: "q-1", UserAnswer: "A"},
			{ExerciseID: "q-2", UserAnswer: "A"},
			{ExerciseID: "q-3", UserAnswer: "A"},
			{ExerciseID: "q-4", UserAnswer: "B"},
			{ExerciseID: "q-5", UserAnswer: "B"},
		},
	})
	if err != nil {
		t.Fatalf("expected 60%% submission to succeed, got %v", err)
	}
	if !res60.Attempt.IsPassed || len(res60.AwardedBadges) != 1 || res60.AwardedBadges[0].ID != "n5_mastery" {
		t.Fatalf("expected passed attempt with n5_mastery badge at 60%%, got passed=%v badges=%+v", res60.Attempt.IsPassed, res60.AwardedBadges)
	}
}

func TestExerciseUsecase_NilRepoGuardsReturnInternalError(t *testing.T) {
	uc := exercise.NewUsecase(nil, nil, nil, nil, nil)

	if _, err := uc.GetDailyVocabularies(context.Background(), "user-1", 10); !errors.Is(err, apperror.ErrInternal) {
		t.Fatalf("expected ErrInternal on GetDailyVocabularies with nil repo, got %v", err)
	}
	if _, err := uc.GetDueReviews(context.Background(), "user-1", 10); !errors.Is(err, apperror.ErrInternal) {
		t.Fatalf("expected ErrInternal on GetDueReviews with nil repo, got %v", err)
	}
	if _, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-1",
		Answers: []exercise.SubmitExerciseAnswerRequest{{ExerciseID: "q-1", UserAnswer: "A"}},
	}); !errors.Is(err, apperror.ErrInternal) {
		t.Fatalf("expected ErrInternal on SubmitExam with nil repo, got %v", err)
	}
}

func TestProcessReview_AwardsSRSVeteranBadgeWhenMastered25(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		Prompt:        "Test",
		CorrectAnswer: "A",
	}

	sRepo := &spySRSRepository{
		MockSRSRepository: exercise.NewMockSRSRepository(),
		enableTx:          true,
		masteredCount:     25,
	}
	sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
		UserID:          "user-1",
		ExerciseID:      "ex-1",
		RepetitionCount: 2,
		IntervalDays:    6,
		EaseFactor:      2.5,
	}

	badgeAwarder := &stubBadgeAwarder{}
	uc := exercise.NewUsecaseFull(
		eRepo,
		sRepo,
		exercise.NewMockReadinessExamRepository(),
		language.NewMockRepository(),
		user.NewMockRepository(),
		&stubLessonAccessChecker{unlocked: true},
		nil,
	).WithBadgeAwarder(badgeAwarder)

	q := 4
	rev, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{
		ExerciseID: "ex-1",
		Quality:    &q,
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if rev.RepetitionCount != 3 {
		t.Fatalf("expected RepetitionCount=3, got %d", rev.RepetitionCount)
	}
	if len(badgeAwarder.calls) != 1 || badgeAwarder.calls[0] != "srs_veteran" {
		t.Fatalf("expected srs_veteran badge awarded, got %+v", badgeAwarder.calls)
	}
}

func TestHelper_EvaluateAnswer_NormalizesJapaneseAndEnglishPunctuation(t *testing.T) {
	h := exercise.NewHelper()
	if !h.EvaluateAnswer("こんにちは、元気ですか？", nil, "「こんにちは」 元気ですか") {
		t.Fatalf("expected Japanese punctuation variations to match")
	}
	if !h.EvaluateAnswer("Yes, I am ready!", nil, "yes i am ready") {
		t.Fatalf("expected English comma and exclamation variations to match")
	}
}

func TestSubmitAndGetExamResult_PreservesCatalogMaxScoreOnPartialAnswers(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

	_ = userRepo.Create(context.Background(), &user.User{
		UserAccount: user.UserAccount{ID: "user-1", Email: "ani@example.com"},
		UserProfile: user.UserProfile{Name: "Ani", Username: "ani"},
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

	eRepo.ReadinessExamExercises["lvl-n5"] = []exercise.Exercise{
		{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"},
		{ID: "q-2", SkillPillar: "reading", CorrectAnswer: "B"},
		{ID: "q-3", SkillPillar: "listening", CorrectAnswer: "C"},
		{ID: "q-4", SkillPillar: "writing", CorrectAnswer: "D"},
		{ID: "q-5", SkillPillar: "speaking", CorrectAnswer: "E"},
	}

	uc := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), examRepo, langRepo, userRepo)
	submitRes, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-n5",
		Answers: []exercise.SubmitExerciseAnswerRequest{
			{ExerciseID: "q-1", UserAnswer: "A"},
			{ExerciseID: "q-2", UserAnswer: "B"},
			{ExerciseID: "q-3", UserAnswer: "C"},
			{ExerciseID: "q-4", UserAnswer: "D"},
		},
	})
	if err != nil {
		t.Fatalf("expected SubmitExam to succeed, got %v", err)
	}
	if !submitRes.Attempt.IsPassed || submitRes.Attempt.ScorePercent != 80 || submitRes.Attempt.MaxScore != 5 {
		t.Fatalf("expected passed 80%% with MaxScore=5 on submit, got %+v", submitRes.Attempt)
	}

	// Simulate fresh DB reload where Attempt.MaxScore column doesn't exist and only AnalysisReport is stored.
	examRepo.Attempts[0].MaxScore = 0
	getRes, err := uc.GetExamResult(context.Background(), "user-1", "lvl-n5")
	if err != nil {
		t.Fatalf("expected GetExamResult to succeed, got %v", err)
	}
	if getRes.Attempt.MaxScore != 5 {
		t.Fatalf("expected Attempt.MaxScore=5 restored from analysis_report, got %d", getRes.Attempt.MaxScore)
	}
	if getRes.Certificate == nil || getRes.Certificate.Score != 4 || getRes.Certificate.MaxScore != 5 {
		t.Fatalf("expected certificate Score=4 MaxScore=5, got %+v", getRes.Certificate)
	}
}

func TestSanitizeExercises_ClonesContentAndStripsSolutionKeys(t *testing.T) {
	explanation := "Because は marks the topic."
	orig := []exercise.Exercise{
		{
			ID:                "ex-1",
			Prompt:            "Test",
			CorrectAnswer:     "は",
			AcceptableAnswers: []string{"wa"},
			DiagnosticRubric:  map[string]any{"を": "Object marker"},
			Explanation:       &explanation,
			Content: map[string]any{
				"display_text":        "わたしは",
				"correct_answer":      "は",
				"acceptable_answers":  []string{"wa"},
				"expected_transcript": "watashi wa",
				"diagnostic_rubric":   map[string]any{"x": "y"},
				"explanation":         "secret",
			},
		},
	}

	sanitized := exercise.SanitizeExercises(orig)
	if len(sanitized) != 1 {
		t.Fatalf("expected 1 exercise, got %d", len(sanitized))
	}
	if sanitized[0].CorrectAnswer != "" || sanitized[0].AcceptableAnswers != nil || sanitized[0].DiagnosticRubric != nil || sanitized[0].Explanation != nil {
		t.Fatalf("expected top-level solution fields stripped, got %+v", sanitized[0])
	}
	for _, key := range []string{"correct_answer", "acceptable_answers", "expected_transcript", "diagnostic_rubric", "explanation"} {
		if _, exists := sanitized[0].Content[key]; exists {
			t.Fatalf("expected content key %q to be stripped", key)
		}
	}
	if sanitized[0].Content["display_text"] != "わたしは" {
		t.Fatalf("expected safe content key display_text preserved, got %v", sanitized[0].Content["display_text"])
	}
	// Mutating sanitized Content must not mutate original Content map.
	sanitized[0].Content["display_text"] = "mutated"
	if orig[0].Content["display_text"] != "わたしは" {
		t.Fatalf("expected original Content map untouched by mutation to sanitized copy")
	}
	if _, exists := orig[0].Content["correct_answer"]; !exists {
		t.Fatalf("expected original Content keys preserved")
	}
}

func TestHydrateExerciseJSONFields_SyncsObjectOptionIDAndTextAcceptableAnswers(t *testing.T) {
	h := exercise.NewHelper()
	contentJSON := []byte(`{"options":[{"id":"opt_1","text":"Insinyur (Bukan dokter)"},{"id":"opt_2","text":"Dokter (Bukan insinyur)"}]}`)

	var byID exercise.Exercise
	exercise.HydrateExerciseJSONFields(
		&byID,
		contentJSON,
		[]byte(`{"selected_id":"opt_1"}`),
		[]byte(`[]`),
		nil,
	)

	if byID.CorrectAnswer != "Insinyur (Bukan dokter)" {
		t.Fatalf("expected human-readable CorrectAnswer='Insinyur (Bukan dokter)', got %q", byID.CorrectAnswer)
	}
	if len(byID.AcceptableAnswers) != 1 || byID.AcceptableAnswers[0] != "opt_1" {
		t.Fatalf("expected AcceptableAnswers to preserve option id 'opt_1', got %v", byID.AcceptableAnswers)
	}
	if !h.EvaluateAnswer(byID.CorrectAnswer, byID.AcceptableAnswers, "opt_1") {
		t.Fatalf("expected option id 'opt_1' to pass EvaluateAnswer")
	}
	if !h.EvaluateAnswer(byID.CorrectAnswer, byID.AcceptableAnswers, "Insinyur (Bukan dokter)") {
		t.Fatalf("expected option text 'Insinyur (Bukan dokter)' to pass EvaluateAnswer, got acceptable=%v", byID.AcceptableAnswers)
	}
	if h.EvaluateAnswer(byID.CorrectAnswer, byID.AcceptableAnswers, "Dokter (Bukan insinyur)") {
		t.Fatalf("expected distractor option text not to pass EvaluateAnswer")
	}

	var byText exercise.Exercise
	exercise.HydrateExerciseJSONFields(
		&byText,
		contentJSON,
		[]byte(`{"selected":"Insinyur (Bukan dokter)"}`),
		[]byte(`["OPT_1"]`),
		[]byte(`{"Dokter (Bukan insinyur)":"Perhatikan bentuk negatif -masen"}`),
	)

	if len(byText.AcceptableAnswers) != 1 {
		t.Fatalf("expected deduplicated AcceptableAnswers of length 1, got %v", byText.AcceptableAnswers)
	}
	if !h.EvaluateAnswer(byText.CorrectAnswer, byText.AcceptableAnswers, "opt_1") {
		t.Fatalf("expected reverse mapping option id 'opt_1' to pass EvaluateAnswer")
	}
	if !h.EvaluateAnswer(byText.CorrectAnswer, byText.AcceptableAnswers, "Insinyur (Bukan dokter)") {
		t.Fatalf("expected option text to pass EvaluateAnswer")
	}
	if fb := h.ExtractDiagnosticFeedback(byText.DiagnosticRubric, "opt_2"); fb == nil || *fb != "Perhatikan bentuk negatif -masen" {
		t.Fatalf("expected reverse-synced DiagnosticRubric feedback for 'opt_2', got %v", fb)
	}

	var withRubricByID exercise.Exercise
	exercise.HydrateExerciseJSONFields(
		&withRubricByID,
		contentJSON,
		[]byte(`{"selected_id":"opt_1"}`),
		[]byte(`[]`),
		[]byte(`{"opt_2":"Perhatikan bentuk negatif -masen"}`),
	)
	if fb := h.ExtractDiagnosticFeedback(withRubricByID.DiagnosticRubric, "opt_2"); fb == nil || *fb != "Perhatikan bentuk negatif -masen" {
		t.Fatalf("expected DiagnosticRubric feedback for 'opt_2', got %v", fb)
	}
	if fb := h.ExtractDiagnosticFeedback(withRubricByID.DiagnosticRubric, "Dokter (Bukan insinyur)"); fb == nil || *fb != "Perhatikan bentuk negatif -masen" {
		t.Fatalf("expected synced DiagnosticRubric feedback for option text, got %v", fb)
	}
}

func TestSubmitAnswer_RejectsWhitespaceAndOversizedAnswers(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		Prompt:        "Test",
		CorrectAnswer: "はい",
	}

	uc := exercise.NewUsecaseWithAccessChecker(eRepo, sRepo, exercise.NewMockReadinessExamRepository(), language.NewMockRepository(), user.NewMockRepository(), exercise.NewMockLessonAccessChecker(true))

	for _, invalid := range []string{"", "   \t\n  ", strings.Repeat("a", 2001)} {
		_, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
			ExerciseID: "ex-1",
			UserAnswer: invalid,
		})
		if !errors.Is(err, apperror.ErrBadRequest) {
			t.Fatalf("expected apperror.ErrBadRequest for answer len=%d, got %v", len(invalid), err)
		}
	}
	if len(eRepo.Attempts) != 0 || len(sRepo.Reviews) != 0 {
		t.Fatalf("expected no attempts or srs reviews recorded on rejected answers")
	}
}

func TestSubmitExam_RejectsWhitespaceAndOversizedAnswers(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

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
	eRepo.ReadinessExamExercises["lvl-n5"] = []exercise.Exercise{
		{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"},
	}

	uc := exercise.NewUsecase(eRepo, exercise.NewMockSRSRepository(), examRepo, langRepo, userRepo)

	for _, invalid := range []string{"   ", strings.Repeat("x", 2001)} {
		_, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
			LevelID: "lvl-n5",
			Answers: []exercise.SubmitExerciseAnswerRequest{{ExerciseID: "q-1", UserAnswer: invalid}},
		})
		if !errors.Is(err, apperror.ErrBadRequest) {
			t.Fatalf("expected apperror.ErrBadRequest for exam answer len=%d, got %v", len(invalid), err)
		}
	}
	if len(examRepo.Attempts) != 0 {
		t.Fatalf("expected no exam attempt stored for rejected exam submission")
	}
}

func TestProcessReviewAndSubmitExam_LogsUserActivities(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		Prompt:        "Test",
		CorrectAnswer: "A",
	}

	sRepo := &spySRSRepository{
		MockSRSRepository: exercise.NewMockSRSRepository(),
		enableTx:          true,
		masteredCount:     25,
	}
	sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
		UserID:          "user-1",
		ExerciseID:      "ex-1",
		RepetitionCount: 2,
		IntervalDays:    6,
		EaseFactor:      2.5,
	}

	lvlID := "lvl-n5"
	eRepo.ReadinessExamExercises[lvlID] = []exercise.Exercise{
		{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"},
	}
	langRepo := language.NewMockRepository()
	lvlN5 := &language.ProficiencyLevel{ID: lvlID, LanguageID: "lang-ja", Code: "N5", OrderIndex: 1, PassingScorePercent: 60}
	langRepo.Levels[lvlID] = lvlN5
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}

	userRepo := user.NewMockRepository()
	badgeAwarder := &stubBadgeAwarder{}
	uc := exercise.NewUsecaseFull(
		eRepo,
		sRepo,
		exercise.NewMockReadinessExamRepository(),
		langRepo,
		userRepo,
		&stubLessonAccessChecker{unlocked: true},
		nil,
	).WithBadgeAwarder(badgeAwarder)

	q := 4
	if _, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{
		ExerciseID: "ex-1",
		Quality:    &q,
	}); err != nil {
		t.Fatalf("expected ProcessReview to succeed, got %v", err)
	}

	if _, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: lvlID,
		Answers: []exercise.SubmitExerciseAnswerRequest{{ExerciseID: "q-1", UserAnswer: "A"}},
	}); err != nil {
		t.Fatalf("expected SubmitExam to succeed, got %v", err)
	}

	if len(userRepo.ActivityLogs) != 2 {
		t.Fatalf("expected 2 user activity logs recorded, got %d (%+v)", len(userRepo.ActivityLogs), userRepo.ActivityLogs)
	}
	if userRepo.ActivityLogs[0].ActivityType != "srs_review_completed" || userRepo.ActivityLogs[0].XPEarned != 0 {
		t.Fatalf("unexpected SRS activity log (expected XPEarned=0 because AwardBadge already logs badge XP): %+v", userRepo.ActivityLogs[0])
	}
	if got, _ := userRepo.ActivityLogs[0].Metadata["badge_xp_awarded"].(int); got != 150 {
		t.Fatalf("expected SRS activity metadata badge_xp_awarded=150, got %+v", userRepo.ActivityLogs[0].Metadata)
	}
	if userRepo.ActivityLogs[1].ActivityType != "readiness_exam_completed" || userRepo.ActivityLogs[1].XPEarned != 0 {
		t.Fatalf("unexpected readiness exam activity log (expected XPEarned=0 because AwardBadge already logs badge XP): %+v", userRepo.ActivityLogs[1])
	}
	if got, _ := userRepo.ActivityLogs[1].Metadata["badge_xp_awarded"].(int); got != 150 {
		t.Fatalf("expected readiness exam activity metadata badge_xp_awarded=150, got %+v", userRepo.ActivityLogs[1].Metadata)
	}

	// Best-effort telemetry: LogActivity errors must not fail ProcessReview or SubmitExam
	sRepo.Reviews["user-1:ex-1"].NextReviewAt = time.Now().UTC().Add(-time.Hour)
	userRepo.LogActivityError = errors.New("activity insert failed")
	if _, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{
		ExerciseID: "ex-1",
		Quality:    &q,
	}); err != nil {
		t.Fatalf("expected ProcessReview to tolerate LogActivityError, got %v", err)
	}

	uc2 := exercise.NewUsecaseFull(
		eRepo,
		sRepo,
		exercise.NewMockReadinessExamRepository(),
		langRepo,
		userRepo,
		&stubLessonAccessChecker{unlocked: true},
		nil,
	)
	if _, err := uc2.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: lvlID,
		Answers: []exercise.SubmitExerciseAnswerRequest{{ExerciseID: "q-1", UserAnswer: "A"}},
	}); err != nil {
		t.Fatalf("expected SubmitExam to tolerate LogActivityError, got %v", err)
	}
}

func TestSubmitAnswer_SkipSRSSchedule_TagsAttemptAsSRSReview(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		Prompt:        "Test",
		CorrectAnswer: "はい",
	}

	uc := exercise.NewUsecaseWithAccessChecker(
		eRepo,
		sRepo,
		exercise.NewMockReadinessExamRepository(),
		language.NewMockRepository(),
		user.NewMockRepository(),
		&stubLessonAccessChecker{unlocked: true},
	)

	if _, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID:      "ex-1",
		UserAnswer:      "いいえ",
		SkipSRSSchedule: true,
	}); err != nil {
		t.Fatalf("expected SRS-skipped submit to succeed, got %v", err)
	}
	if _, err := uc.SubmitAnswer(context.Background(), "user-1", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID:      "ex-1",
		UserAnswer:      "はい",
		SkipSRSSchedule: false,
	}); err != nil {
		t.Fatalf("expected lesson submit to succeed, got %v", err)
	}

	if len(eRepo.Attempts) != 2 {
		t.Fatalf("expected 2 recorded attempts, got %d", len(eRepo.Attempts))
	}
	if flag, ok := eRepo.Attempts[0].SelectedAnswer["is_srs_review"].(bool); !ok || !flag {
		t.Fatalf("expected SkipSRSSchedule attempt to be tagged is_srs_review=true, got %+v", eRepo.Attempts[0].SelectedAnswer)
	}
	if _, exists := eRepo.Attempts[1].SelectedAnswer["is_srs_review"]; exists {
		t.Fatalf("expected normal lesson attempt not to carry is_srs_review flag, got %+v", eRepo.Attempts[1].SelectedAnswer)
	}
}

func TestExercise_HardenedInvariants(t *testing.T) {
	t.Run("ProcessReview enforces existing due card", func(t *testing.T) {
		eRepo := exercise.NewMockRepository()
		sRepo := exercise.NewMockSRSRepository()
		lessonID := "lesson-1"
		eRepo.Exercises["ex-1"] = &exercise.Exercise{ID: "ex-1", LessonID: &lessonID, CorrectAnswer: "Yes"}
		uc := exercise.NewUsecaseWithAccessChecker(eRepo, sRepo, exercise.NewMockReadinessExamRepository(), language.NewMockRepository(), user.NewMockRepository(), exercise.NewMockLessonAccessChecker(true))

		q := 4
		if _, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{ExerciseID: "ex-1", Quality: &q}); !errors.Is(err, exercise.ErrReviewNotFound) {
			t.Fatalf("expected ErrReviewNotFound when card missing, got %v", err)
		}

		sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
			UserID:       "user-1",
			ExerciseID:   "ex-1",
			NextReviewAt: time.Now().UTC().Add(24 * time.Hour),
		}
		if _, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{ExerciseID: "ex-1", Quality: &q}); !errors.Is(err, exercise.ErrReviewNotDue) {
			t.Fatalf("expected ErrReviewNotDue when review is in future, got %v", err)
		}
	})

	t.Run("EvaluateAnswer collapses CJK spaces only and normalizes German sharp S", func(t *testing.T) {
		h := exercise.NewHelper()
		if h.EvaluateAnswer("I am", nil, "Iam") {
			t.Fatalf("expected Latin space mismatch 'I am' vs 'Iam' to return false")
		}
		if !h.EvaluateAnswer("わたし は です", nil, "わたしはです") {
			t.Fatalf("expected CJK space-collapsed match to return true")
		}
		if !h.EvaluateAnswer("Straße", nil, "strasse") {
			t.Fatalf("expected German ß -> ss normalization to match")
		}
		rubric := map[string]any{"am": "Verb to be hint"}
		if fb := h.ExtractDiagnosticFeedback(rubric, "example"); fb != nil {
			t.Fatalf("expected word-boundary diagnostic lookup not to match 'am' inside 'example', got %q", *fb)
		}
	})

	t.Run("SM2 uses newly computed EF and snaps due date to WIB midnight", func(t *testing.T) {
		h := exercise.NewHelper()
		now := time.Date(2026, 11, 16, 10, 0, 0, 0, time.UTC)
		res := h.CalculateSM2(5, 2, 6, 2.5, now)
		if res.IntervalDays != 16 {
			t.Fatalf("expected 6 * 2.6 = 16 using new EF', got %d", res.IntervalDays)
		}
		wib := time.FixedZone("WIB", 7*3600)
		inWIB := res.DueDate.In(wib)
		if inWIB.Hour() != 0 || inWIB.Minute() != 0 || inWIB.Second() != 0 {
			t.Fatalf("expected due date snapped to midnight WIB, got %v", inWIB)
		}
	})
}

func TestProcessReviewAndSubmitExam_EvaluatesStreakBadges(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()
	gRepo := gamification.NewMockRepository()

	gRepo.Badges["streak_7"] = &gamification.BadgeDefinition{ID: "streak_7", Title: "Konsisten 7 Hari", XPReward: 50}
	gRepo.Badges["streak_30"] = &gamification.BadgeDefinition{ID: "streak_30", Title: "Dedikasi 30 Hari", XPReward: 150}

	yesterday := time.Now().UTC().Add(-24 * time.Hour)
	userRepo.Users["user-1"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-1"},
		UserGamificationStats: user.UserGamificationStats{
			XP:           100,
			CurrentLevel: 2,
			Streak:       6,
			LastActiveAt: &yesterday,
		},
	}

	lessonID := "lesson-1"
	eRepo.Exercises["ex-1"] = &exercise.Exercise{
		ID:            "ex-1",
		LessonID:      &lessonID,
		ExerciseType:  exercise.ExerciseTypeFillBlank,
		Prompt:        "Prompt",
		CorrectAnswer: "A",
	}
	sRepo.Reviews["user-1:ex-1"] = &exercise.UserSRSReview{
		ID:           "srs-1",
		UserID:       "user-1",
		ExerciseID:   "ex-1",
		NextReviewAt: time.Now().UTC().Add(-time.Hour),
	}

	uc := exercise.NewUsecaseWithAccessChecker(eRepo, sRepo, examRepo, langRepo, userRepo, exercise.NewMockLessonAccessChecker(true)).
		WithBadgeAwarder(gRepo)

	q := 4
	if _, err := uc.ProcessReview(context.Background(), "user-1", &exercise.SubmitSRSReviewRequest{
		ExerciseID: "ex-1",
		Quality:    &q,
	}); err != nil {
		t.Fatalf("expected ProcessReview to succeed, got %v", err)
	}
	if len(gRepo.UserBadges["user-1"]) != 1 || gRepo.UserBadges["user-1"][0].BadgeKey != "streak_7" {
		t.Fatalf("expected streak_7 badge awarded on ProcessReview reaching 7-day streak, got %+v", gRepo.UserBadges["user-1"])
	}

	// Now advance user to streak 29 yesterday -> SubmitExam reaching 30 should award streak_30 in AwardedBadges
	userRepo.Users["user-1"].Streak = 29
	userRepo.Users["user-1"].LastActiveAt = &yesterday

	lvlID := "lvl-1"
	lvl1 := &language.ProficiencyLevel{ID: lvlID, LanguageID: "lang-ja", Code: "N5", OrderIndex: 1, PassingScorePercent: 60}
	langRepo.Levels[lvlID] = lvl1
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "user-1",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlID,
		IsActive:       true,
		CurrentLevel:   lvl1,
	}
	eRepo.ReadinessExamExercises[lvlID] = []exercise.Exercise{
		{ID: "q-1", SkillPillar: "reading", CorrectAnswer: "A"},
	}

	examRes, err := uc.SubmitExam(context.Background(), "user-1", &exercise.SubmitReadinessExamRequest{
		LevelID: lvlID,
		Answers: []exercise.SubmitExerciseAnswerRequest{{ExerciseID: "q-1", UserAnswer: "A"}},
	})
	if err != nil {
		t.Fatalf("expected SubmitExam to succeed, got %v", err)
	}
	foundStreak30 := false
	for _, b := range examRes.AwardedBadges {
		if b.ID == "streak_30" {
			foundStreak30 = true
		}
	}
	if !foundStreak30 {
		t.Fatalf("expected streak_30 in SubmitExam AwardedBadges, got %+v", examRes.AwardedBadges)
	}
}

type stubSlugAccessChecker struct {
	slugs   map[string]string
	checked []string
}

func (s *stubSlugAccessChecker) IsLessonUnlocked(_ context.Context, _ string, lessonID string) (bool, error) {
	s.checked = append(s.checked, lessonID)
	return true, nil
}

func (s *stubSlugAccessChecker) ResolveLessonID(_ context.Context, idOrSlug string) (string, error) {
	if resolved, ok := s.slugs[idOrSlug]; ok {
		return resolved, nil
	}
	return "", apperror.NewNotFoundError("LESSON_NOT_FOUND", "lesson not found")
}

func TestGetExercisesByLesson_ResolvesSlug(t *testing.T) {
	eRepo := exercise.NewMockRepository()
	sRepo := exercise.NewMockSRSRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

	const canonicalLessonUUID = "33333333-3333-3333-3333-333333333333"
	lessonRef := canonicalLessonUUID
	eRepo.Exercises["ex-slug-1"] = &exercise.Exercise{
		ID:            "ex-slug-1",
		LessonID:      &lessonRef,
		ExerciseType:  exercise.ExerciseTypeFillBlank,
		Prompt:        "Pilih arti sapaan",
		Options:       []string{"Halo", "Terima kasih"},
		CorrectAnswer: "Halo",
	}

	checker := &stubSlugAccessChecker{
		slugs: map[string]string{"n5-vokal-dasar": canonicalLessonUUID},
	}
	uc := exercise.NewUsecaseWithAccessChecker(eRepo, sRepo, examRepo, langRepo, userRepo, checker)

	list, err := uc.GetExercisesByLesson(context.Background(), "user-1", "n5-vokal-dasar")
	if err != nil {
		t.Fatalf("expected slug GetExercisesByLesson to succeed, got %v", err)
	}
	if len(list) != 1 || list[0].ID != "ex-slug-1" {
		t.Fatalf("expected 1 resolved exercise, got %+v", list)
	}
	if len(checker.checked) != 1 || checker.checked[0] != canonicalLessonUUID {
		t.Fatalf("expected IsLessonUnlocked checked with canonical UUID %s, got %+v", canonicalLessonUUID, checker.checked)
	}

	if _, err := uc.GetExercisesByLesson(context.Background(), "user-1", "unknown-lesson-slug"); err == nil {
		t.Fatal("expected error for unknown lesson slug")
	}
}

type mockSelectiveAccessChecker struct {
	unlocked map[string]bool
}

func (m *mockSelectiveAccessChecker) IsLessonUnlocked(_ context.Context, _ string, lessonID string) (bool, error) {
	return m.unlocked[lessonID], nil
}

func TestGuestMode_TrialEvaluationWithoutDBWritesAndUnit2Locked(t *testing.T) {
	ctx := context.Background()
	eRepo := exercise.NewMockRepository()
	eRepo.CreateAttemptErr = errors.New("must not write guest attempts")
	sRepo := exercise.NewMockSRSRepository()

	unit1LessonID := "33333333-3333-3333-3333-333333333301"
	unit2LessonID := "33333333-3333-3333-3333-333333333302"

	expl := "あ dibaca a."
	eRepo.Exercises["ex-u1"] = &exercise.Exercise{
		ID:            "ex-u1",
		LessonID:      &unit1LessonID,
		ExerciseType:  exercise.ExerciseTypeFillBlank,
		Prompt:        "Pilih huruf a",
		Options:       []string{"あ", "い"},
		CorrectAnswer: "あ",
		Explanation:   &expl,
	}
	eRepo.Exercises["ex-u2"] = &exercise.Exercise{
		ID:            "ex-u2",
		LessonID:      &unit2LessonID,
		ExerciseType:  exercise.ExerciseTypeFillBlank,
		Prompt:        "Unit 2",
		Options:       []string{"か"},
		CorrectAnswer: "か",
	}

	checker := &mockSelectiveAccessChecker{
		unlocked: map[string]bool{
			unit1LessonID: true,
			unit2LessonID: false,
		},
	}
	uc := exercise.NewUsecaseWithAccessChecker(eRepo, sRepo, exercise.NewMockReadinessExamRepository(), language.NewMockRepository(), user.NewMockRepository(), checker)

	// Guest can fetch and evaluate unlocked Unit 1 exercises without DB writes (CreateAttemptErr would fail if called)
	exs, err := uc.GetExercisesByLesson(ctx, "", unit1LessonID)
	if err != nil || len(exs) != 1 {
		t.Fatalf("expected 1 Unit 1 exercise for guest, got len=%d err=%v", len(exs), err)
	}
	res, err := uc.SubmitAnswer(ctx, "", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-u1",
		UserAnswer: "い",
	})
	if err != nil {
		t.Fatalf("expected guest SubmitAnswer to succeed without DB write, got %v", err)
	}
	if res.IsCorrect || res.Explanation == nil || *res.Explanation != "あ dibaca a." || res.NextReviewDue != nil {
		t.Fatalf("unexpected guest evaluation result: %+v", res)
	}
	if len(sRepo.Reviews) != 0 {
		t.Fatalf("expected zero SRS reviews written for guest, got %d", len(sRepo.Reviews))
	}

	// Guest is blocked from locked Unit 2 lessons & exercises
	if _, err := uc.GetExercisesByLesson(ctx, "", unit2LessonID); !errors.Is(err, exercise.ErrExerciseLessonLocked) {
		t.Fatalf("expected ErrExerciseLessonLocked for guest Unit 2 lesson, got %v", err)
	}
	if _, err := uc.SubmitAnswer(ctx, "", &exercise.SubmitExerciseAnswerRequest{
		ExerciseID: "ex-u2",
		UserAnswer: "か",
	}); !errors.Is(err, exercise.ErrExerciseLessonLocked) {
		t.Fatalf("expected ErrExerciseLessonLocked for guest Unit 2 exercise, got %v", err)
	}
}

type mockIncompleteCurriculumChecker struct{}

func (m *mockIncompleteCurriculumChecker) IsLessonUnlocked(ctx context.Context, userID string, lessonID string) (bool, error) {
	return true, nil
}

func (m *mockIncompleteCurriculumChecker) IsLevelCurriculumCompleted(ctx context.Context, userID string, levelID string) (bool, error) {
	return false, nil
}

func TestReadinessExam_TestOutAllowedWithoutPriorLessonsAndEnforcesProTier(t *testing.T) {
	ctx := context.Background()
	eRepo := exercise.NewMockRepository()
	eRepo.ReadinessExamExercises["lvl-n5"] = []exercise.Exercise{
		{ID: "q-read", SkillPillar: "reading", CorrectAnswer: "A"},
		{ID: "q-listen", SkillPillar: "listening", CorrectAnswer: "B"},
		{ID: "q-write", SkillPillar: "writing", CorrectAnswer: "C"},
		{ID: "q-speak", SkillPillar: "speaking", CorrectAnswer: "D"},
	}
	eRepo.ReadinessExamExercises["lvl-n4"] = []exercise.Exercise{
		{ID: "q-n4", SkillPillar: "reading", CorrectAnswer: "X"},
	}
	eRepo.ReadinessExamExercises["lvl-n2"] = []exercise.Exercise{
		{ID: "q-n2", SkillPillar: "reading", CorrectAnswer: "Y"},
	}

	langRepo := language.NewMockRepository()
	lvlN5 := &language.ProficiencyLevel{ID: "lvl-n5", LanguageID: "lang-ja", Code: "N5", OrderIndex: 1, PassingScorePercent: 60}
	lvlN4 := &language.ProficiencyLevel{ID: "lvl-n4", LanguageID: "lang-ja", Code: "N4", OrderIndex: 2, PassingScorePercent: 60}
	lvlN2 := &language.ProficiencyLevel{ID: "lvl-n2", LanguageID: "lang-ja", Code: "N2", OrderIndex: 4, PassingScorePercent: 60}
	langRepo.Levels["lvl-n5"] = lvlN5
	langRepo.Levels["lvl-n4"] = lvlN4
	langRepo.Levels["lvl-n2"] = lvlN2

	langRepo.Enrollments["enr-free"] = &language.UserLanguageEnrollment{
		ID:             "enr-free",
		UserID:         "user-free",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN5.ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}
	langRepo.Enrollments["enr-free-n2"] = &language.UserLanguageEnrollment{
		ID:             "enr-free-n2",
		UserID:         "user-free-n2",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN2.ID,
		IsActive:       true,
		CurrentLevel:   lvlN2,
	}
	langRepo.Enrollments["enr-pro-n2"] = &language.UserLanguageEnrollment{
		ID:             "enr-pro-n2",
		UserID:         "user-pro-n2",
		LanguageID:     "lang-ja",
		CurrentLevelID: &lvlN2.ID,
		IsActive:       true,
		CurrentLevel:   lvlN2,
	}

	uRepo := user.NewMockRepository()
	uRepo.Users["user-free"] = &user.User{UserAccount: user.UserAccount{ID: "user-free", SubscriptionTier: "free"}}
	uRepo.Users["user-free-n2"] = &user.User{UserAccount: user.UserAccount{ID: "user-free-n2", SubscriptionTier: "free"}}
	uRepo.Users["user-pro-n2"] = &user.User{UserAccount: user.UserAccount{ID: "user-pro-n2", SubscriptionTier: "pro"}}

	uc := exercise.NewUsecaseFull(
		eRepo,
		exercise.NewMockSRSRepository(),
		exercise.NewMockReadinessExamRepository(),
		langRepo,
		uRepo,
		&mockIncompleteCurriculumChecker{},
		nil,
	)

	// 1. Unauthenticated user is blocked
	if _, err := uc.GetExamQuestions(ctx, "", "lvl-n5"); !errors.Is(err, apperror.ErrUnauthorized) {
		t.Fatalf("expected ErrUnauthorized for guest exam questions, got %v", err)
	}

	// 2. Enrolled user at N5 with 0% lessons completed CAN start & submit N5 Readiness Exam and advance to N4
	qs, err := uc.GetExamQuestions(ctx, "user-free", "lvl-n5")
	if err != nil || len(qs) != 4 {
		t.Fatalf("expected test-out N5 exam to be accessible without completing lessons, got len=%d err=%v", len(qs), err)
	}
	res, err := uc.SubmitExam(ctx, "user-free", &exercise.SubmitReadinessExamRequest{
		LevelID: "lvl-n5",
		Answers: []exercise.SubmitExerciseAnswerRequest{
			{ExerciseID: "q-read", UserAnswer: "A"},
			{ExerciseID: "q-listen", UserAnswer: "B"},
			{ExerciseID: "q-write", UserAnswer: "C"},
			{ExerciseID: "q-speak", UserAnswer: "D"},
		},
	})
	if err != nil {
		t.Fatalf("expected test-out SubmitExam to succeed, got %v", err)
	}
	if !res.Attempt.IsPassed || res.Attempt.ScorePercent != 100 {
		t.Fatalf("expected passed exam with 100%% score, got passed=%v score=%d", res.Attempt.IsPassed, res.Attempt.ScorePercent)
	}
	if langRepo.Enrollments["enr-free"].CurrentLevelID == nil || *langRepo.Enrollments["enr-free"].CurrentLevelID != "lvl-n4" {
		t.Fatalf("expected enrollment current_level_id to advance to lvl-n4, got %v", langRepo.Enrollments["enr-free"].CurrentLevelID)
	}
	if res.Attempt.ReadingScore != 100 || res.Attempt.ListeningScore != 100 || res.Attempt.WritingScore != 100 || res.Attempt.SpeakingScore != 100 {
		t.Fatalf("expected all 4 pillars graded at 100%%, got R=%d L=%d W=%d S=%d",
			res.Attempt.ReadingScore, res.Attempt.ListeningScore, res.Attempt.WritingScore, res.Attempt.SpeakingScore)
	}

	// 3. Free-tier user attempting Pro-tier N2 exam must receive PRO_REQUIRED_FOR_LEVEL
	if _, err := uc.GetExamQuestions(ctx, "user-free-n2", "lvl-n2"); err == nil {
		t.Fatalf("expected PRO_REQUIRED_FOR_LEVEL error for free user on N2 exam, got nil")
	} else {
		var domErr *apperror.DomainError
		if !errors.As(err, &domErr) || domErr.Code != "PRO_REQUIRED_FOR_LEVEL" {
			t.Fatalf("expected PRO_REQUIRED_FOR_LEVEL domain error, got %v", err)
		}
	}

	// 4. Pro-tier user at N2 with 0% lessons completed CAN access N2 Readiness Exam
	proQs, err := uc.GetExamQuestions(ctx, "user-pro-n2", "lvl-n2")
	if err != nil || len(proQs) != 1 {
		t.Fatalf("expected Pro user to access N2 test-out exam, got len=%d err=%v", len(proQs), err)
	}
}

