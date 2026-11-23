package exercise

import (
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/middleware"
	"merantalk/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

var exerciseLessonSlugRegex = regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*$`)

func isValidExerciseLessonIdentifier(val string) bool {
	trimmed := strings.TrimSpace(val)
	if trimmed == "" || len(trimmed) > 160 {
		return false
	}
	if apperror.ValidateEntityUUID(trimmed) == nil {
		return true
	}
	return len(trimmed) >= 2 && exerciseLessonSlugRegex.MatchString(trimmed)
}

// Handler handles HTTP requests for exercise interactions, SRS reviews, and diagnostic readiness exams
type Handler struct {
	exerciseUsecase   Usecase
	srsUsecase        SRSUsecase
	examUsecase       ReadinessExamUsecase
	submitRateLimiter gin.HandlerFunc
	reviewRateLimiter gin.HandlerFunc
	examRateLimiter   gin.HandlerFunc
}

func resolveRateLimiter(custom gin.HandlerFunc, maxRequests int, message string) gin.HandlerFunc {
	if custom != nil {
		return custom
	}
	return middleware.UserOrIPRateLimitMiddleware(maxRequests, time.Minute, message)
}

// NewHandler creates a new combined Exercise, SRS, and Exam Handler instance
func NewHandler(
	exerciseUsecase Usecase,
	srsUsecase SRSUsecase,
	examUsecase ReadinessExamUsecase,
) *Handler {
	return NewHandlerWithRateLimiters(exerciseUsecase, srsUsecase, examUsecase, nil, nil, nil)
}

const (
	// DefaultExerciseSubmitLimit is the default per-minute limit for single exercise answer submissions.
	DefaultExerciseSubmitLimit = 30
	// DefaultExerciseSubmitMessage is the rate-limit error message returned for exercise submissions.
	DefaultExerciseSubmitMessage = "too many exercise submissions, please wait a moment"
	// DefaultSRSReviewLimit is the default per-minute limit for spaced repetition reviews.
	DefaultSRSReviewLimit = 30
	// DefaultSRSReviewMessage is the rate-limit error message returned for SRS reviews.
	DefaultSRSReviewMessage = "too many SRS review submissions, please wait a moment"
	// DefaultExamSubmitLimit is the default per-minute limit for readiness exam submissions.
	DefaultExamSubmitLimit = 10
	// DefaultExamSubmitMessage is the rate-limit error message returned for readiness exam submissions.
	DefaultExamSubmitMessage = "too many readiness exam submissions, please wait a moment"
)

// NewHandlerWithRateLimiters creates a Handler with custom rate limiter middlewares for mutating routes
func NewHandlerWithRateLimiters(
	exerciseUsecase Usecase,
	srsUsecase SRSUsecase,
	examUsecase ReadinessExamUsecase,
	submitRateLimiter gin.HandlerFunc,
	reviewRateLimiter gin.HandlerFunc,
	examRateLimiter gin.HandlerFunc,
) *Handler {
	return &Handler{
		exerciseUsecase: exerciseUsecase,
		srsUsecase:      srsUsecase,
		examUsecase:     examUsecase,
		submitRateLimiter: resolveRateLimiter(
			submitRateLimiter,
			DefaultExerciseSubmitLimit,
			DefaultExerciseSubmitMessage,
		),
		reviewRateLimiter: resolveRateLimiter(
			reviewRateLimiter,
			DefaultSRSReviewLimit,
			DefaultSRSReviewMessage,
		),
		examRateLimiter: resolveRateLimiter(
			examRateLimiter,
			DefaultExamSubmitLimit,
			DefaultExamSubmitMessage,
		),
	}
}

func requireUserID(c *gin.Context) (string, bool) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return "", false
	}
	return userID, true
}

// GetExercisesByLesson handles GET /api/v1/exercises/lesson/:lesson_id (supports Unit-1 guest trial preview)
func (h *Handler) GetExercisesByLesson(c *gin.Context) {
	userID := c.GetString("userID")
	if h.exerciseUsecase == nil {
		response.Error(c, apperror.ErrInternal)
		return
	}

	lessonParam := strings.TrimSpace(c.Param("lesson_id"))
	if !isValidExerciseLessonIdentifier(lessonParam) {
		response.BadRequest(c, "invalid lesson_id parameter format, must be a valid UUID or slug")
		return
	}

	exercises, err := h.exerciseUsecase.GetExercisesByLesson(c.Request.Context(), userID, lessonParam)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "lesson exercises retrieved successfully", exercises)
}

// SubmitAnswer handles POST /api/v1/exercises/submit (supports stateless Unit-1 guest trial evaluation)
func (h *Handler) SubmitAnswer(c *gin.Context) {
	userID := c.GetString("userID")
	if h.exerciseUsecase == nil {
		response.Error(c, apperror.ErrInternal)
		return
	}

	var req SubmitExerciseAnswerRequest
	if !response.BindJSON(c, &req) {
		return
	}

	res, err := h.exerciseUsecase.SubmitAnswer(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "exercise answer submitted successfully", res)
}

func parseLimitQuery(c *gin.Context, defaultVal int) (int, bool) {
	limitStr := c.DefaultQuery("limit", strconv.Itoa(defaultVal))
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		response.BadRequest(c, "invalid limit query parameter, must be a positive integer")
		return 0, false
	}
	return limit, true
}

// GetDueReviews handles GET /api/v1/srs/due
func (h *Handler) GetDueReviews(c *gin.Context) {
	userID, ok := requireUserID(c)
	if !ok {
		return
	}
	if h.srsUsecase == nil {
		response.Error(c, apperror.ErrInternal)
		return
	}

	limit, ok := parseLimitQuery(c, 20)
	if !ok {
		return
	}

	queue, err := h.srsUsecase.GetDueReviews(c.Request.Context(), userID, limit)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "due SRS reviews retrieved successfully", queue)
}

// ProcessReview handles POST /api/v1/srs/review
func (h *Handler) ProcessReview(c *gin.Context) {
	userID, ok := requireUserID(c)
	if !ok {
		return
	}
	if h.srsUsecase == nil {
		response.Error(c, apperror.ErrInternal)
		return
	}

	var req SubmitSRSReviewRequest
	if !response.BindJSON(c, &req) {
		return
	}

	review, err := h.srsUsecase.ProcessReview(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "SRS review processed successfully", review)
}

func bindLevelIDURI(c *gin.Context) (string, bool) {
	var uri struct {
		LevelID string `uri:"level_id" binding:"required,uuid"`
	}
	if err := c.ShouldBindUri(&uri); err != nil {
		response.BadRequest(c, "invalid level_id parameter format, must be a valid UUID")
		return "", false
	}
	return uri.LevelID, true
}

// GetExamQuestions handles GET /api/v1/exams/questions/:level_id
func (h *Handler) GetExamQuestions(c *gin.Context) {
	userID, ok := requireUserID(c)
	if !ok {
		return
	}
	if h.examUsecase == nil {
		response.Error(c, apperror.ErrInternal)
		return
	}

	levelID, ok := bindLevelIDURI(c)
	if !ok {
		return
	}

	questions, err := h.examUsecase.GetExamQuestions(c.Request.Context(), userID, levelID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "readiness exam questions retrieved successfully", questions)
}

// GetExamResult handles GET /api/v1/exams/result/:level_id
func (h *Handler) GetExamResult(c *gin.Context) {
	userID, ok := requireUserID(c)
	if !ok {
		return
	}
	if h.examUsecase == nil {
		response.Error(c, apperror.ErrInternal)
		return
	}

	levelID, ok := bindLevelIDURI(c)
	if !ok {
		return
	}

	result, err := h.examUsecase.GetExamResult(c.Request.Context(), userID, levelID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "readiness exam result retrieved successfully", result)
}

// SubmitExam handles POST /api/v1/exams/submit
func (h *Handler) SubmitExam(c *gin.Context) {
	userID, ok := requireUserID(c)
	if !ok {
		return
	}
	if h.examUsecase == nil {
		response.Error(c, apperror.ErrInternal)
		return
	}

	var req SubmitReadinessExamRequest
	if !response.BindJSON(c, &req) {
		return
	}

	res, err := h.examUsecase.SubmitExam(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "readiness exam submitted successfully", res)
}

// GetDailyVocabularies handles GET /api/v1/vocabularies/daily
func (h *Handler) GetDailyVocabularies(c *gin.Context) {
	userID, ok := requireUserID(c)
	if !ok {
		return
	}
	if h.exerciseUsecase == nil {
		response.Error(c, apperror.ErrInternal)
		return
	}

	limit, ok := parseLimitQuery(c, 10)
	if !ok {
		return
	}

	items, err := h.exerciseUsecase.GetDailyVocabularies(c.Request.Context(), userID, limit)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "daily vocabularies retrieved successfully", items)
}

// RegisterRoutes registers exercise, SRS, and readiness exam endpoints
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc, optionalAuthMiddleware ...gin.HandlerFunc) {
	if authMiddleware == nil {
		panic("exercise.Handler.RegisterRoutes requires non-nil authMiddleware")
	}
	submitRateLimiter := resolveRateLimiter(
		h.submitRateLimiter,
		DefaultExerciseSubmitLimit,
		DefaultExerciseSubmitMessage,
	)
	reviewRateLimiter := resolveRateLimiter(
		h.reviewRateLimiter,
		DefaultSRSReviewLimit,
		DefaultSRSReviewMessage,
	)
	examRateLimiter := resolveRateLimiter(
		h.examRateLimiter,
		DefaultExamSubmitLimit,
		DefaultExamSubmitMessage,
	)

	trialMiddleware := authMiddleware
	if len(optionalAuthMiddleware) > 0 && optionalAuthMiddleware[0] != nil {
		trialMiddleware = optionalAuthMiddleware[0]
	}

	exercises := rg.Group("/exercises")
	exercises.Use(trialMiddleware)
	{
		exercises.GET("/lesson/:lesson_id", h.GetExercisesByLesson)
		exercises.POST("/submit", submitRateLimiter, h.SubmitAnswer)
	}

	vocabularies := rg.Group("/vocabularies")
	vocabularies.Use(authMiddleware)
	{
		vocabularies.GET("/daily", h.GetDailyVocabularies)
	}

	srs := rg.Group("/srs")
	srs.Use(authMiddleware)
	{
		srs.GET("/due", h.GetDueReviews)
		srs.POST("/review", reviewRateLimiter, h.ProcessReview)
	}

	exams := rg.Group("/exams")
	exams.Use(authMiddleware)
	{
		exams.GET("/questions/:level_id", h.GetExamQuestions)
		exams.GET("/result/:level_id", h.GetExamResult)
		exams.POST("/submit", examRateLimiter, h.SubmitExam)
	}
}

