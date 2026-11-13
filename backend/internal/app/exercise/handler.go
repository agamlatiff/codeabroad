package exercise

import (
	"net/http"
	"strconv"

	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for exercise interactions, SRS reviews, and diagnostic readiness exams
type Handler struct {
	exerciseUsecase Usecase
	srsUsecase      SRSUsecase
	examUsecase     ReadinessExamUsecase
}

// NewHandler creates a new combined Exercise, SRS, and Exam Handler instance
func NewHandler(
	exerciseUsecase Usecase,
	srsUsecase SRSUsecase,
	examUsecase ReadinessExamUsecase,
) *Handler {
	return &Handler{
		exerciseUsecase: exerciseUsecase,
		srsUsecase:      srsUsecase,
		examUsecase:     examUsecase,
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

// GetExercisesByLesson handles GET /api/v1/exercises/lesson/:lesson_id
func (h *Handler) GetExercisesByLesson(c *gin.Context) {
	userID, ok := requireUserID(c)
	if !ok {
		return
	}

	var uri struct {
		LessonID string `uri:"lesson_id" binding:"required,uuid"`
	}
	if err := c.ShouldBindUri(&uri); err != nil {
		response.BadRequest(c, "invalid lesson_id parameter format, must be a valid UUID")
		return
	}

	exercises, err := h.exerciseUsecase.GetExercisesByLesson(c.Request.Context(), userID, uri.LessonID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "lesson exercises retrieved successfully", exercises)
}

// SubmitAnswer handles POST /api/v1/exercises/submit
func (h *Handler) SubmitAnswer(c *gin.Context) {
	userID, ok := requireUserID(c)
	if !ok {
		return
	}

	var req SubmitExerciseAnswerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
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
	if err != nil {
		response.BadRequest(c, "invalid limit query parameter, must be an integer")
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

	var req SubmitSRSReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
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

	var req SubmitReadinessExamRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
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
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	exercises := rg.Group("/exercises")
	if authMiddleware != nil {
		exercises.Use(authMiddleware)
	}
	{
		exercises.GET("/lesson/:lesson_id", h.GetExercisesByLesson)
		exercises.POST("/submit", h.SubmitAnswer)
	}

	vocabularies := rg.Group("/vocabularies")
	if authMiddleware != nil {
		vocabularies.Use(authMiddleware)
	}
	{
		vocabularies.GET("/daily", h.GetDailyVocabularies)
	}

	srs := rg.Group("/srs")
	if authMiddleware != nil {
		srs.Use(authMiddleware)
	}
	{
		srs.GET("/due", h.GetDueReviews)
		srs.POST("/review", h.ProcessReview)
	}

	exams := rg.Group("/exams")
	if authMiddleware != nil {
		exams.Use(authMiddleware)
	}
	{
		exams.GET("/questions/:level_id", h.GetExamQuestions)
		exams.GET("/result/:level_id", h.GetExamResult)
		exams.POST("/submit", h.SubmitExam)
	}
}

