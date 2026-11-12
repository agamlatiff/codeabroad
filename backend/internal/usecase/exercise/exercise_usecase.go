package exercise

import (
	"codeabroad/backend/internal/domain"
	"context"
	"fmt"
	"time"
)

type usecase struct {
	exerciseRepo domain.ExerciseRepository
	srsRepo      domain.SRSRepository
	examRepo     domain.ReadinessExamRepository
	langRepo     domain.LanguageRepository
	userRepo     domain.UserRepository
	helper       *Helper
}

// New creates a combined exercise, SRS, and readiness exam usecase
func New(
	exerciseRepo domain.ExerciseRepository,
	srsRepo domain.SRSRepository,
	examRepo domain.ReadinessExamRepository,
	langRepo domain.LanguageRepository,
	userRepo domain.UserRepository,
) *usecase {
	return &usecase{
		exerciseRepo: exerciseRepo,
		srsRepo:      srsRepo,
		examRepo:     examRepo,
		langRepo:     langRepo,
		userRepo:     userRepo,
		helper:       NewHelper(),
	}
}

// ----------------------------------------------------------------------------
// EXERCISE USECASE IMPLEMENTATION
// ----------------------------------------------------------------------------

// GetExercisesByLesson returns the interactive exercises for a daily lesson
func (u *usecase) GetExercisesByLesson(ctx context.Context, lessonID string) ([]domain.Exercise, error) {
	if lessonID == "" {
		return nil, domain.ErrBadRequest
	}
	return u.exerciseRepo.GetExercisesByLessonID(ctx, lessonID)
}

// SubmitAnswer evaluates a single exercise response, logs telemetry, and injects into SRS on error
func (u *usecase) SubmitAnswer(ctx context.Context, userID string, req *domain.SubmitExerciseAnswerRequest) (*domain.SubmitExerciseAnswerResponse, error) {
	if userID == "" {
		return nil, domain.ErrUnauthorized
	}
	if req == nil || req.ExerciseID == "" {
		return nil, domain.ErrBadRequest
	}

	exercise, err := u.exerciseRepo.GetExerciseByID(ctx, req.ExerciseID)
	if err != nil {
		return nil, err
	}

	isCorrect := u.helper.EvaluateAnswer(exercise.CorrectAnswer, req.UserAnswer)

	attempt := &domain.UserExerciseAttempt{
		UserID:           userID,
		ExerciseID:       req.ExerciseID,
		IsCorrect:        isCorrect,
		UserAnswer:       req.UserAnswer,
		TimeSpentSeconds: req.TimeSpentSeconds,
	}
	_ = u.exerciseRepo.CreateAttempt(ctx, attempt)

	now := time.Now().UTC()
	var nextDue *time.Time
	var xpEarned int

	if !isCorrect {
		// Remediation rule: Automatically schedule memory card into Anki SRS for tomorrow
		tomorrow := now.AddDate(0, 0, 1)
		srsCard := &domain.UserSRSReview{
			UserID:         userID,
			ExerciseID:     req.ExerciseID,
			Repetitions:    0,
			IntervalDays:   1,
			EaseFactor:     2.5,
			DueDate:        tomorrow,
			LastReviewedAt: &now,
		}
		_ = u.srsRepo.UpsertReview(ctx, srsCard)
		nextDue = &tomorrow
	} else {
		xpEarned = exercise.XPReward
		if xpEarned <= 0 {
			xpEarned = 5 // Base exercise reward
		}
	}

	return &domain.SubmitExerciseAnswerResponse{
		IsCorrect:     isCorrect,
		CorrectAnswer: exercise.CorrectAnswer,
		Explanation:   exercise.Explanation,
		XPEarned:      xpEarned,
		StreakBonus:   0,
		NextReviewDue: nextDue,
	}, nil
}

// ----------------------------------------------------------------------------
// SRS USECASE IMPLEMENTATION (SUPERMEMO SM-2)
// ----------------------------------------------------------------------------

// GetDueReviews retrieves pending spaced repetition cards due today
func (u *usecase) GetDueReviews(ctx context.Context, userID string, limit int) (*domain.SRSQueueResponse, error) {
	if userID == "" {
		return nil, domain.ErrUnauthorized
	}
	if limit <= 0 {
		limit = 20
	}

	now := time.Now().UTC()
	reviews, err := u.srsRepo.GetDueReviews(ctx, userID, now, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query due reviews: %w", err)
	}

	dueCount, err := u.srsRepo.GetDueCount(ctx, userID, now)
	if err != nil {
		dueCount = len(reviews)
	}

	return &domain.SRSQueueResponse{
		TotalDue: dueCount,
		Items:    reviews,
	}, nil
}

// ProcessReview executes SM-2 memory retention adjustment based on user recall grade (0-5)
func (u *usecase) ProcessReview(ctx context.Context, userID string, req *domain.SubmitSRSReviewRequest) (*domain.UserSRSReview, error) {
	if userID == "" {
		return nil, domain.ErrUnauthorized
	}
	if req == nil || req.ExerciseID == "" {
		return nil, domain.ErrBadRequest
	}
	if req.Quality < 0 || req.Quality > 5 {
		return nil, domain.ErrInvalidQualityRating
	}

	currentReview, err := u.srsRepo.GetReview(ctx, userID, req.ExerciseID)
	prevReps := 0
	prevInterval := 1
	prevEase := 2.5
	if err == nil && currentReview != nil {
		prevReps = currentReview.Repetitions
		prevInterval = currentReview.IntervalDays
		prevEase = currentReview.EaseFactor
	}

	now := time.Now().UTC()
	sm2 := u.helper.CalculateSM2(req.Quality, prevReps, prevInterval, prevEase, now)

	updatedReview := &domain.UserSRSReview{
		UserID:         userID,
		ExerciseID:     req.ExerciseID,
		Repetitions:    sm2.Repetitions,
		IntervalDays:   sm2.IntervalDays,
		EaseFactor:     sm2.EaseFactor,
		DueDate:        sm2.DueDate,
		LastReviewedAt: &now,
	}

	if err := u.srsRepo.UpsertReview(ctx, updatedReview); err != nil {
		return nil, fmt.Errorf("failed to update srs review: %w", err)
	}

	return updatedReview, nil
}

// ----------------------------------------------------------------------------
// READINESS EXAM USECASE IMPLEMENTATION
// ----------------------------------------------------------------------------

// GetExamQuestions returns questions for an official sectional mock certification exam
func (u *usecase) GetExamQuestions(ctx context.Context, levelID string) ([]domain.Exercise, error) {
	if levelID == "" {
		return nil, domain.ErrBadRequest
	}
	return u.exerciseRepo.GetReadinessExamExercises(ctx, levelID)
}

// SubmitExam grades all answers for a mock exam and issues certification if score exceeds passing grade
func (u *usecase) SubmitExam(ctx context.Context, userID string, req *domain.SubmitReadinessExamRequest) (*domain.ReadinessExamResponse, error) {
	if userID == "" {
		return nil, domain.ErrUnauthorized
	}
	if req == nil || req.LevelID == "" || len(req.Answers) == 0 {
		return nil, domain.ErrBadRequest
	}

	level, err := u.langRepo.GetLevelByID(ctx, req.LevelID)
	if err != nil {
		return nil, err
	}

	questions, err := u.exerciseRepo.GetReadinessExamExercises(ctx, req.LevelID)
	if err != nil {
		return nil, fmt.Errorf("failed to load exam questions: %w", err)
	}

	questionsMap := make(map[string]domain.Exercise)
	for _, q := range questions {
		questionsMap[q.ID] = q
	}

	totalScore := 0
	maxScore := len(questions)
	answersPayload := make(map[string]any)

	for _, ans := range req.Answers {
		q, exists := questionsMap[ans.ExerciseID]
		if !exists {
			continue
		}
		isCorrect := u.helper.EvaluateAnswer(q.CorrectAnswer, ans.UserAnswer)
		if isCorrect {
			totalScore++
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

	passingScore := level.PassingScorePercent
	if passingScore <= 0 {
		passingScore = 60 // Default passing score 60%
	}
	isPassed := scorePercent >= passingScore

	now := time.Now().UTC()
	attempt := &domain.ReadinessExamAttempt{
		UserID:         userID,
		LevelID:        req.LevelID,
		TotalScore:     totalScore,
		MaxScore:       maxScore,
		ScorePercent:   scorePercent,
		IsPassed:       isPassed,
		AnswersPayload: answersPayload,
		CompletedAt:    now,
	}

	if err := u.examRepo.CreateExamAttempt(ctx, attempt); err != nil {
		return nil, fmt.Errorf("failed to record exam attempt: %w", err)
	}

	var cert *domain.ExamCertificate
	if isPassed {
		user, _ := u.userRepo.GetByID(ctx, userID)
		name := "Learner"
		if user != nil && user.Name != "" {
			name = user.Name
		}

		cert = &domain.ExamCertificate{
			CertificateID: fmt.Sprintf("CERT-%s-%s", level.Code, now.Format("20060102")),
			ExamName:      level.OfficialExamName,
			LevelCode:     level.Code,
			CandidateName: name,
			Score:         totalScore,
			MaxScore:      maxScore,
			Percentage:    scorePercent,
			IssuedAt:      now,
		}
	}

	return &domain.ReadinessExamResponse{
		Attempt:     *attempt,
		Certificate: cert,
	}, nil
}

