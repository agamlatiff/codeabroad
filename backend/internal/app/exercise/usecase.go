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

// GetExercisesByLesson returns sanitized interactive exercises for an unlocked lesson node
func (u *usecase) GetExercisesByLesson(ctx context.Context, userID string, lessonID string) ([]Exercise, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if lessonID == "" {
		return nil, apperror.ErrBadRequest
	}
	if u.accessChecker != nil {
		unlocked, err := u.accessChecker.IsLessonUnlocked(ctx, userID, lessonID)
		if err != nil {
			return nil, fmt.Errorf("failed to verify lesson access: %w", err)
		}
		if !unlocked {
			return nil, ErrExerciseLessonLocked
		}
	}

	exercises, err := u.exerciseRepo.GetExercisesByLessonID(ctx, lessonID)
	if err != nil {
		return nil, err
	}
	return SanitizeExercises(exercises), nil
}

// SubmitAnswer evaluates a single exercise response, logs telemetry, and injects into SRS on error
func (u *usecase) SubmitAnswer(ctx context.Context, userID string, req *SubmitExerciseAnswerRequest) (*SubmitExerciseAnswerResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if req == nil || req.ExerciseID == "" {
		return nil, apperror.ErrBadRequest
	}

	ex, err := u.exerciseRepo.GetExerciseByID(ctx, req.ExerciseID)
	if err != nil {
		return nil, err
	}
	if ex == nil {
		return nil, ErrExerciseNotFound
	}
	if u.accessChecker != nil && ex.LessonID != nil && *ex.LessonID != "" {
		unlocked, err := u.accessChecker.IsLessonUnlocked(ctx, userID, *ex.LessonID)
		if err != nil {
			return nil, fmt.Errorf("failed to verify lesson access: %w", err)
		}
		if !unlocked {
			return nil, ErrExerciseLessonLocked
		}
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
		tomorrow := now.AddDate(0, 0, 1)
		srsCard := &UserSRSReview{
			UserID:          userID,
			ExerciseID:      req.ExerciseID,
			RepetitionCount: 0,
			IntervalDays:    1,
			EaseFactor:      2.5,
			NextReviewAt:    tomorrow,
			LastReviewedAt:  &now,
		}
		if srsErr := u.srsRepo.UpsertReview(ctx, srsCard); srsErr != nil {
			log.Printf("exercise: failed to upsert srs card for user %s exercise %s: %v", userID, req.ExerciseID, srsErr)
		} else {
			nextDue = &tomorrow
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
	if limit <= 0 {
		limit = 20
	} else if limit > 100 {
		limit = 100
	}

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

	ex, err := u.exerciseRepo.GetExerciseByID(ctx, req.ExerciseID)
	if err != nil {
		return nil, err
	}
	if ex == nil {
		return nil, ErrExerciseNotFound
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

	questions, err := u.exerciseRepo.GetReadinessExamExercises(ctx, levelID)
	if err != nil {
		return nil, err
	}
	return SanitizeExercises(questions), nil
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
	seenExerciseIDs := make(map[string]bool, len(req.Answers))

	for _, ans := range req.Answers {
		if seenExerciseIDs[ans.ExerciseID] {
			continue
		}
		seenExerciseIDs[ans.ExerciseID] = true

		q, exists := questionsMap[ans.ExerciseID]
		if !exists {
			continue
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

	passingScore := lvl.PassingScorePercent
	if passingScore <= 0 {
		passingScore = 60
	}
	isPassed := scorePercent >= passingScore

	now := time.Now().UTC()
	attempt := &ReadinessExamAttempt{
		UserID:         userID,
		LevelID:        req.LevelID,
		ReadingScore:   readingScore,
		ListeningScore: listeningScore,
		WritingScore:   writingScore,
		SpeakingScore:  speakingScore,
		OverallScore:   scorePercent,
		MaxScore:       maxScore,
		ScorePercent:   scorePercent,
		IsPassed:       isPassed,
		AnalysisReport: map[string]any{
			"answers": answersPayload,
			"pillars": map[string]int{
				"reading":   readingScore,
				"listening": listeningScore,
				"writing":   writingScore,
				"speaking":  speakingScore,
			},
		},
		AttemptedAt: now,
	}

	if err := u.examRepo.CreateExamAttempt(ctx, attempt); err != nil {
		return nil, fmt.Errorf("failed to record exam attempt: %w", err)
	}

	var cert *ExamCertificate
	if isPassed {
		usr, _ := u.userRepo.GetByID(ctx, userID)
		name := "Learner"
		if usr != nil && usr.Name != "" {
			name = usr.Name
		}

		cert = &ExamCertificate{
			CertificateID: fmt.Sprintf("CERT-%s-%s", lvl.Code, now.Format("20060102")),
			ExamName:      lvl.OfficialExamName,
			LevelCode:     lvl.Code,
			CandidateName: name,
			Score:         totalScore,
			MaxScore:      maxScore,
			Percentage:    scorePercent,
			IssuedAt:      now,
		}

		if enrollment != nil && enrollment.CurrentLevel != nil && enrollment.CurrentLevel.ID == lvl.ID {
			if levels, lvErr := u.langRepo.GetLevelsByLanguageID(ctx, lvl.LanguageID); lvErr == nil {
				sort.Slice(levels, func(i, j int) bool {
					return levels[i].OrderIndex < levels[j].OrderIndex
				})
				for _, nextLvl := range levels {
					if nextLvl.OrderIndex > lvl.OrderIndex {
						if updErr := u.langRepo.UpdateEnrollmentLevelIfCurrent(ctx, enrollment.ID, lvl.ID, nextLvl.ID); updErr != nil {
							if !errors.Is(updErr, language.ErrEnrollmentLevelChanged) {
								log.Printf("exercise: failed to advance enrollment %s to level %s: %v", enrollment.ID, nextLvl.ID, updErr)
							}
						} else if u.cacheInvalidator != nil {
							if invErr := u.cacheInvalidator.InvalidateCurriculum(ctx, userID); invErr != nil {
								log.Printf("exercise: failed to invalidate curriculum cache for user %s: %v", userID, invErr)
							}
						}
						break
					}
				}
			}
		}
	}

	return &ReadinessExamResponse{
		Attempt:     *attempt,
		Certificate: cert,
	}, nil
}

