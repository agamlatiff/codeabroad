package exercise

import (
	"context"
	"errors"
	"fmt"
	"log"
	"sort"
	"time"

	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/app/user"
)

type usecase struct {
	exerciseRepo     Repository
	srsRepo          SRSRepository
	examRepo         ReadinessExamRepository
	langRepo         language.Repository
	userRepo         user.Repository
	accessChecker    LessonAccessChecker
	cacheInvalidator CurriculumCacheInvalidator
	helper           *Helper
}

// NewUsecaseFull creates an exercise, SRS, and readiness exam usecase with lesson lock checks and curriculum cache invalidation
func NewUsecaseFull(
	exerciseRepo Repository,
	srsRepo SRSRepository,
	examRepo ReadinessExamRepository,
	langRepo language.Repository,
	userRepo user.Repository,
	accessChecker LessonAccessChecker,
	cacheInvalidator CurriculumCacheInvalidator,
) *usecase {
	return &usecase{
		exerciseRepo:     exerciseRepo,
		srsRepo:          srsRepo,
		examRepo:         examRepo,
		langRepo:         langRepo,
		userRepo:         userRepo,
		accessChecker:    accessChecker,
		cacheInvalidator: cacheInvalidator,
		helper:           NewHelper(),
	}
}

// NewUsecaseWithAccessChecker creates a combined exercise, SRS, and readiness exam usecase with lesson lock enforcement
func NewUsecaseWithAccessChecker(
	exerciseRepo Repository,
	srsRepo SRSRepository,
	examRepo ReadinessExamRepository,
	langRepo language.Repository,
	userRepo user.Repository,
	accessChecker LessonAccessChecker,
) *usecase {
	return NewUsecaseFull(exerciseRepo, srsRepo, examRepo, langRepo, userRepo, accessChecker, nil)
}

// NewUsecase creates a combined exercise, SRS, and readiness exam usecase
func NewUsecase(
	exerciseRepo Repository,
	srsRepo SRSRepository,
	examRepo ReadinessExamRepository,
	langRepo language.Repository,
	userRepo user.Repository,
) *usecase {
	return NewUsecaseWithAccessChecker(exerciseRepo, srsRepo, examRepo, langRepo, userRepo, nil)
}

func (u *usecase) verifyLessonUnlocked(ctx context.Context, userID string, lessonID string) error {
	if u.accessChecker == nil || lessonID == "" {
		return nil
	}
	unlocked, err := u.accessChecker.IsLessonUnlocked(ctx, userID, lessonID)
	if err != nil {
		return fmt.Errorf("failed to verify lesson access: %w", err)
	}
	if !unlocked {
		return ErrExerciseLessonLocked
	}
	return nil
}

func (u *usecase) loadAuthorizedExercise(ctx context.Context, userID string, exerciseID string) (*Exercise, error) {
	ex, err := u.exerciseRepo.GetExerciseByID(ctx, exerciseID)
	if err != nil {
		return nil, err
	}
	if ex == nil {
		return nil, ErrExerciseNotFound
	}
	if ex.LessonID != nil {
		if err := u.verifyLessonUnlocked(ctx, userID, *ex.LessonID); err != nil {
			return nil, err
		}
	}
	return ex, nil
}

// GetExercisesByLesson returns sanitized interactive exercises for an unlocked lesson node
func (u *usecase) GetExercisesByLesson(ctx context.Context, userID string, lessonID string) ([]Exercise, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if lessonID == "" {
		return nil, apperror.ErrBadRequest
	}
	if err := u.verifyLessonUnlocked(ctx, userID, lessonID); err != nil {
		return nil, err
	}

	exercises, err := u.exerciseRepo.GetExercisesByLessonID(ctx, lessonID)
	if err != nil {
		return nil, err
	}
	return SanitizeExercises(exercises), nil
}

// GetDailyVocabularies returns daily contextual vocabulary cards derived from active curriculum content
func (u *usecase) GetDailyVocabularies(ctx context.Context, userID string, limit int) ([]VocabularyItem, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	return u.exerciseRepo.GetDailyVocabularies(ctx, userID, normalizeLimit(limit, 10, 50))
}

// SubmitAnswer evaluates a single exercise response, logs telemetry, and injects into SRS on error
func (u *usecase) SubmitAnswer(ctx context.Context, userID string, req *SubmitExerciseAnswerRequest) (*SubmitExerciseAnswerResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if req == nil || req.ExerciseID == "" {
		return nil, apperror.ErrBadRequest
	}

	ex, err := u.loadAuthorizedExercise(ctx, userID, req.ExerciseID)
	if err != nil {
		return nil, err
	}

	isCorrect := u.helper.EvaluateAnswer(ex.CorrectAnswer, ex.AcceptableAnswers, req.UserAnswer)
	var diagnosticFeedback *string
	if !isCorrect {
		diagnosticFeedback = u.helper.ExtractDiagnosticFeedback(ex.DiagnosticRubric, req.UserAnswer)
	}

	attempt := &UserExerciseAttempt{
		UserID:           userID,
		ExerciseID:       req.ExerciseID,
		IsCorrect:        isCorrect,
		SelectedAnswer:   map[string]any{"user_answer": req.UserAnswer},
		TimeSpentSeconds: req.TimeSpentSeconds,
	}
	if err := u.exerciseRepo.CreateAttempt(ctx, attempt); err != nil {
		return nil, fmt.Errorf("failed to record exercise attempt: %w", err)
	}

	now := time.Now().UTC()
	var nextDue *time.Time

	if !isCorrect {
		prevEase := 2.5
		if existing, revErr := u.srsRepo.GetReview(ctx, userID, req.ExerciseID); revErr == nil && existing != nil {
			prevEase = existing.EaseFactor
		} else if revErr != nil && !errors.Is(revErr, ErrReviewNotFound) {
			log.Printf("exercise: failed to fetch existing srs card for user %s exercise %s: %v", userID, req.ExerciseID, revErr)
		}

		sm2 := u.helper.CalculateSM2(0, 0, 1, prevEase, now)
		srsCard := &UserSRSReview{
			UserID:          userID,
			ExerciseID:      req.ExerciseID,
			RepetitionCount: sm2.Repetitions,
			IntervalDays:    sm2.IntervalDays,
			EaseFactor:      sm2.EaseFactor,
			NextReviewAt:    sm2.DueDate,
			LastReviewedAt:  &now,
		}
		if srsErr := u.srsRepo.UpsertReview(ctx, srsCard); srsErr != nil {
			log.Printf("exercise: failed to upsert srs card for user %s exercise %s: %v", userID, req.ExerciseID, srsErr)
		} else {
			nextDue = &sm2.DueDate
		}
	}

	return &SubmitExerciseAnswerResponse{
		IsCorrect:          isCorrect,
		CorrectAnswer:      ex.CorrectAnswer,
		Explanation:        ex.Explanation,
		DiagnosticFeedback: diagnosticFeedback,
		XPEarned:           0,
		StreakBonus:        0,
		NextReviewDue:      nextDue,
	}, nil
}

// GetDueReviews retrieves pending spaced repetition cards due today with solution fields stripped
func (u *usecase) GetDueReviews(ctx context.Context, userID string, limit int) (*SRSQueueResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	limit = normalizeLimit(limit, 20, 100)

	now := time.Now().UTC()
	reviews, err := u.srsRepo.GetDueReviews(ctx, userID, now, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query due reviews: %w", err)
	}

	for i := range reviews {
		if reviews[i].Exercise != nil {
			sanitized := SanitizeExercises([]Exercise{*reviews[i].Exercise})
			reviews[i].Exercise = &sanitized[0]
		}
	}

	dueCount, err := u.srsRepo.GetDueCount(ctx, userID, now)
	if err != nil {
		dueCount = len(reviews)
	}

	return &SRSQueueResponse{
		TotalDue: dueCount,
		Items:    reviews,
	}, nil
}

// ProcessReview executes SM-2 memory retention adjustment based on user recall grade (0-5)
func (u *usecase) ProcessReview(ctx context.Context, userID string, req *SubmitSRSReviewRequest) (*UserSRSReview, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if req == nil || req.ExerciseID == "" || req.Quality == nil {
		return nil, apperror.ErrBadRequest
	}
	quality := *req.Quality
	if quality < 0 || quality > 5 {
		return nil, ErrInvalidQualityRating
	}

	if _, err := u.loadAuthorizedExercise(ctx, userID, req.ExerciseID); err != nil {
		return nil, err
	}

	currentReview, err := u.srsRepo.GetReview(ctx, userID, req.ExerciseID)
	prevReps := 0
	prevInterval := 1
	prevEase := 2.5
	if err != nil {
		if !errors.Is(err, ErrReviewNotFound) {
			return nil, fmt.Errorf("failed to query existing srs review: %w", err)
		}
	} else if currentReview != nil {
		prevReps = currentReview.RepetitionCount
		prevInterval = currentReview.IntervalDays
		prevEase = currentReview.EaseFactor
	}

	now := time.Now().UTC()
	sm2 := u.helper.CalculateSM2(quality, prevReps, prevInterval, prevEase, now)

	updatedReview := &UserSRSReview{
		UserID:          userID,
		ExerciseID:      req.ExerciseID,
		RepetitionCount: sm2.Repetitions,
		IntervalDays:    sm2.IntervalDays,
		EaseFactor:      sm2.EaseFactor,
		NextReviewAt:    sm2.DueDate,
		LastReviewedAt:  &now,
	}

	if err := u.srsRepo.UpsertReview(ctx, updatedReview); err != nil {
		return nil, fmt.Errorf("failed to update srs review: %w", err)
	}

	return updatedReview, nil
}

func (u *usecase) verifyLevelExamAccess(ctx context.Context, userID string, levelID string) (*language.ProficiencyLevel, *language.UserLanguageEnrollment, error) {
	lvl, err := u.langRepo.GetLevelByID(ctx, levelID)
	if err != nil {
		return nil, nil, err
	}
	if lvl == nil {
		return nil, nil, language.ErrProficiencyLevelNotFound
	}

	enrollment, err := u.langRepo.GetActiveEnrollment(ctx, userID, lvl.LanguageID)
	if err != nil {
		if errors.Is(err, language.ErrEnrollmentNotFound) {
			return nil, nil, apperror.ErrForbidden
		}
		return nil, nil, err
	}
	if enrollment == nil || enrollment.CurrentLevel == nil || lvl.OrderIndex > enrollment.CurrentLevel.OrderIndex {
		return nil, nil, apperror.ErrForbidden
	}
	return lvl, enrollment, nil
}

// GetExamQuestions returns sanitized questions for an official sectional mock certification exam on an unlocked level
func (u *usecase) GetExamQuestions(ctx context.Context, userID string, levelID string) ([]Exercise, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if levelID == "" {
		return nil, apperror.ErrBadRequest
	}
	if _, _, err := u.verifyLevelExamAccess(ctx, userID, levelID); err != nil {
		return nil, err
	}

	prevPassed, err := u.examRepo.GetLatestPassedAttempt(ctx, userID, levelID)
	if err != nil {
		return nil, fmt.Errorf("failed to verify previous exam status: %w", err)
	}
	if prevPassed != nil {
		return nil, ErrExamAlreadyPassed
	}

	questions, err := u.exerciseRepo.GetReadinessExamExercises(ctx, levelID)
	if err != nil {
		return nil, err
	}
	return SanitizeExercises(questions), nil
}

type examGradingResult struct {
	totalScore     int
	maxScore       int
	scorePercent   int
	readingScore   int
	listeningScore int
	writingScore   int
	speakingScore  int
	isPassed       bool
	analysisReport map[string]any
}

func (u *usecase) gradeExamSubmission(
	questions []Exercise,
	answers []SubmitExerciseAnswerRequest,
	passingScorePercent int,
) (*examGradingResult, error) {
	questionsMap := make(map[string]Exercise, len(questions))
	pillarCatalogTotal := make(map[string]int)
	for _, q := range questions {
		questionsMap[q.ID] = q
		pillar := q.SkillPillar
		if pillar == "" {
			pillar = "reading"
		}
		pillarCatalogTotal[pillar]++
	}

	totalScore := 0
	maxScore := len(questions)
	answersPayload := make(map[string]any)
	pillarCorrect := make(map[string]int)
	seenExerciseIDs := make(map[string]bool, len(answers))

	for _, ans := range answers {
		if seenExerciseIDs[ans.ExerciseID] {
			continue
		}
		seenExerciseIDs[ans.ExerciseID] = true

		q, exists := questionsMap[ans.ExerciseID]
		if !exists {
			return nil, apperror.NewBadRequestError(
				"INVALID_EXAM_EXERCISE",
				"one or more submitted exercise_id values do not belong to this readiness exam",
				map[string]any{"exercise_id": ans.ExerciseID},
			)
		}
		pillar := q.SkillPillar
		if pillar == "" {
			pillar = "reading"
		}

		isCorrect := u.helper.EvaluateAnswer(q.CorrectAnswer, q.AcceptableAnswers, ans.UserAnswer)
		if isCorrect {
			totalScore++
			pillarCorrect[pillar]++
		}
		answersPayload[ans.ExerciseID] = map[string]any{
			"user_answer": ans.UserAnswer,
			"is_correct":  isCorrect,
		}
	}

	scorePercent := 0
	if maxScore > 0 {
		scorePercent = (totalScore * 100) / maxScore
	}

	calcPillarScore := func(pillar string) int {
		total := pillarCatalogTotal[pillar]
		if total == 0 {
			return scorePercent
		}
		return (pillarCorrect[pillar] * 100) / total
	}

	readingScore := calcPillarScore("reading")
	listeningScore := calcPillarScore("listening")
	writingScore := calcPillarScore("writing")
	speakingScore := calcPillarScore("speaking")

	passingScore := passingScorePercent
	if passingScore <= 0 {
		passingScore = 60
	}

	return &examGradingResult{
		totalScore:     totalScore,
		maxScore:       maxScore,
		scorePercent:   scorePercent,
		readingScore:   readingScore,
		listeningScore: listeningScore,
		writingScore:   writingScore,
		speakingScore:  speakingScore,
		isPassed:       scorePercent >= passingScore,
		analysisReport: map[string]any{
			"answers": answersPayload,
			"pillars": map[string]int{
				"reading":   readingScore,
				"listening": listeningScore,
				"writing":   writingScore,
				"speaking":  speakingScore,
			},
		},
	}, nil
}

func (u *usecase) resolveNextLevelTarget(
	ctx context.Context,
	lvl *language.ProficiencyLevel,
	enrollment *language.UserLanguageEnrollment,
) (enrollmentID, expectedLevelID, nextLevelID string, err error) {
	if enrollment == nil || enrollment.CurrentLevel == nil || enrollment.CurrentLevel.ID != lvl.ID {
		return "", "", "", nil
	}
	levels, lvErr := u.langRepo.GetLevelsByLanguageID(ctx, lvl.LanguageID)
	if lvErr != nil {
		return "", "", "", fmt.Errorf("failed to resolve next proficiency level: %w", lvErr)
	}
	sort.Slice(levels, func(i, j int) bool {
		return levels[i].OrderIndex < levels[j].OrderIndex
	})
	for _, nextLvl := range levels {
		if nextLvl.OrderIndex > lvl.OrderIndex {
			return enrollment.ID, lvl.ID, nextLvl.ID, nil
		}
	}
	return "", "", "", nil
}

func (u *usecase) invalidateCurriculumSafely(ctx context.Context, userID string) {
	if u.cacheInvalidator == nil {
		return
	}
	if invErr := u.cacheInvalidator.InvalidateCurriculum(ctx, userID); invErr != nil {
		log.Printf("exercise: failed to invalidate curriculum cache for user %s: %v", userID, invErr)
	}
}

func (u *usecase) persistExamSubmission(
	ctx context.Context,
	userID string,
	attempt *ReadinessExamAttempt,
	enrollmentID, expectedLevelID, nextLevelID string,
) error {
	if txRepo, ok := u.examRepo.(TransactionalExamRecorder); ok {
		advanced, err := txRepo.RecordExamSubmissionTx(ctx, attempt, enrollmentID, expectedLevelID, nextLevelID)
		if err != nil {
			return err
		}
		if advanced {
			u.invalidateCurriculumSafely(ctx, userID)
		}
		return nil
	}

	if err := u.examRepo.CreateExamAttempt(ctx, attempt); err != nil {
		return fmt.Errorf("failed to record exam attempt: %w", err)
	}
	if nextLevelID != "" {
		if updErr := u.langRepo.UpdateEnrollmentLevelIfCurrent(ctx, enrollmentID, expectedLevelID, nextLevelID); updErr != nil {
			if !errors.Is(updErr, language.ErrEnrollmentLevelChanged) {
				return fmt.Errorf("failed to advance enrollment level: %w", updErr)
			}
		} else {
			u.invalidateCurriculumSafely(ctx, userID)
		}
	}
	return nil
}

func extractAttemptScoreCounts(attempt *ReadinessExamAttempt) (score int, maxScore int) {
	if attempt == nil {
		return 0, 0
	}
	if answersRaw, ok := attempt.AnalysisReport["answers"].(map[string]any); ok && len(answersRaw) > 0 {
		correctCount := 0
		for _, entry := range answersRaw {
			if entryMap, ok := entry.(map[string]any); ok {
				if isCorrect, ok := entryMap["is_correct"].(bool); ok && isCorrect {
					correctCount++
				}
			}
		}
		return correctCount, len(answersRaw)
	}
	if attempt.MaxScore > 0 {
		return (attempt.ScorePercent * attempt.MaxScore) / 100, attempt.MaxScore
	}
	return attempt.ScorePercent, 100
}

func (u *usecase) buildExamCertificate(
	ctx context.Context,
	userID string,
	lvl *language.ProficiencyLevel,
	score int,
	maxScore int,
	scorePercent int,
	issuedAt time.Time,
) *ExamCertificate {
	usr, _ := u.userRepo.GetByID(ctx, userID)
	name := "Learner"
	if usr != nil && usr.Name != "" {
		name = usr.Name
	}

	effectiveIssuedAt := issuedAt
	if effectiveIssuedAt.IsZero() {
		effectiveIssuedAt = time.Now().UTC()
	}

	return &ExamCertificate{
		CertificateID: fmt.Sprintf("CERT-%s-%s", lvl.Code, effectiveIssuedAt.Format("20060102")),
		ExamName:      lvl.OfficialExamName,
		LevelCode:     lvl.Code,
		CandidateName: name,
		Score:         score,
		MaxScore:      maxScore,
		Percentage:    scorePercent,
		IssuedAt:      effectiveIssuedAt,
	}
}

// GetExamResult retrieves the latest passed readiness exam attempt and certificate for a level
func (u *usecase) GetExamResult(ctx context.Context, userID string, levelID string) (*ReadinessExamResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if levelID == "" {
		return nil, apperror.ErrBadRequest
	}
	lvl, _, err := u.verifyLevelExamAccess(ctx, userID, levelID)
	if err != nil {
		return nil, err
	}

	passedAttempt, err := u.examRepo.GetLatestPassedAttempt(ctx, userID, levelID)
	if err != nil {
		return nil, fmt.Errorf("failed to query passed exam attempt: %w", err)
	}
	if passedAttempt == nil {
		return nil, ErrExamResultNotFound
	}

	score, maxScore := extractAttemptScoreCounts(passedAttempt)
	if passedAttempt.MaxScore <= 0 && maxScore > 0 {
		passedAttempt.MaxScore = maxScore
	}
	cert := u.buildExamCertificate(ctx, userID, lvl, score, maxScore, passedAttempt.ScorePercent, passedAttempt.AttemptedAt)

	return &ReadinessExamResponse{
		Attempt:     *passedAttempt,
		Certificate: cert,
	}, nil
}

// SubmitExam grades all answers for a mock exam and issues certification if score exceeds passing grade
func (u *usecase) SubmitExam(ctx context.Context, userID string, req *SubmitReadinessExamRequest) (*ReadinessExamResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if req == nil || req.LevelID == "" || len(req.Answers) == 0 {
		return nil, apperror.ErrBadRequest
	}

	lvl, enrollment, err := u.verifyLevelExamAccess(ctx, userID, req.LevelID)
	if err != nil {
		return nil, err
	}

	prevPassed, err := u.examRepo.GetLatestPassedAttempt(ctx, userID, req.LevelID)
	if err != nil {
		return nil, fmt.Errorf("failed to verify previous exam status: %w", err)
	}
	if prevPassed != nil {
		return nil, ErrExamAlreadyPassed
	}

	questions, err := u.exerciseRepo.GetReadinessExamExercises(ctx, req.LevelID)
	if err != nil {
		return nil, fmt.Errorf("failed to load exam questions: %w", err)
	}
	if len(questions) == 0 {
		return nil, apperror.NewNotFoundError("EXAM_QUESTIONS_NOT_FOUND", "no readiness exam questions configured for this level")
	}

	graded, err := u.gradeExamSubmission(questions, req.Answers, lvl.PassingScorePercent)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	attempt := &ReadinessExamAttempt{
		UserID:         userID,
		LevelID:        req.LevelID,
		ReadingScore:   graded.readingScore,
		ListeningScore: graded.listeningScore,
		WritingScore:   graded.writingScore,
		SpeakingScore:  graded.speakingScore,
		OverallScore:   graded.scorePercent,
		MaxScore:       graded.maxScore,
		ScorePercent:   graded.scorePercent,
		IsPassed:       graded.isPassed,
		AnalysisReport: graded.analysisReport,
		AttemptedAt:    now,
	}

	var enrollmentID, expectedLevelID, nextLevelID string
	if graded.isPassed {
		enrollmentID, expectedLevelID, nextLevelID, err = u.resolveNextLevelTarget(ctx, lvl, enrollment)
		if err != nil {
			return nil, err
		}
	}

	if err := u.persistExamSubmission(ctx, userID, attempt, enrollmentID, expectedLevelID, nextLevelID); err != nil {
		return nil, err
	}

	var cert *ExamCertificate
	if graded.isPassed {
		cert = u.buildExamCertificate(ctx, userID, lvl, graded.totalScore, graded.maxScore, graded.scorePercent, now)
	}

	return &ReadinessExamResponse{
		Attempt:     *attempt,
		Certificate: cert,
	}, nil
}

