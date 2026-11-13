package curriculum

import (
	"net/http"
	"time"

	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/shared/middleware"
	"codeabroad/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for curriculum navigation and lesson completion
type Handler struct {
	curriculumUsecase   Usecase
	completeRateLimiter gin.HandlerFunc
}

// NewHandler creates a new Curriculum Handler instance
func NewHandler(curriculumUsecase Usecase) *Handler {
	return NewHandlerWithRateLimiter(curriculumUsecase, nil)
}

// NewHandlerWithRateLimiter creates a new Curriculum Handler instance with a custom lesson-completion rate limiter
func NewHandlerWithRateLimiter(curriculumUsecase Usecase, completeRateLimiter gin.HandlerFunc) *Handler {
	if completeRateLimiter == nil {
		completeRateLimiter = middleware.UserOrIPRateLimitMiddleware(
			30,
			time.Minute,
			"terlalu banyak percobaan penyelesaian lesson, silakan tunggu sebentar",
		)
	}
	return &Handler{
		curriculumUsecase:   curriculumUsecase,
		completeRateLimiter: completeRateLimiter,
	}
}

// GetCurriculum handles GET /api/v1/curriculum
func (h *Handler) GetCurriculum(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var req GetCurriculumRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		response.BadRequest(c, "invalid language_id query parameter format")
		return
	}

	res, err := h.curriculumUsecase.GetCurriculum(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "curriculum retrieved successfully", res)
}

// GetLessonDetail handles GET /api/v1/curriculum/lessons/:id
func (h *Handler) GetLessonDetail(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var uri struct {
		ID string `uri:"id" binding:"required,uuid"`
	}
	if err := c.ShouldBindUri(&uri); err != nil {
		response.BadRequest(c, "invalid lesson ID format, must be a valid UUID")
		return
	}

	lesson, err := h.curriculumUsecase.GetLessonDetail(c.Request.Context(), userID, uri.ID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "lesson detail retrieved successfully", lesson)
}

// CompleteLesson handles POST /api/v1/curriculum/lessons/:id/complete
func (h *Handler) CompleteLesson(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var uri struct {
		ID string `uri:"id" binding:"required,uuid"`
	}
	if err := c.ShouldBindUri(&uri); err != nil {
		response.BadRequest(c, "invalid lesson ID format, must be a valid UUID")
		return
	}

	var req CompleteLessonRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid request payload: score must be an integer between 0 and 100")
		return
	}
	req.LessonID = uri.ID

	res, err := h.curriculumUsecase.CompleteLesson(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "lesson completed successfully", res)
}

// GetGrammarPoints handles GET /api/v1/curriculum/grammar-points?level_id=...
func (h *Handler) GetGrammarPoints(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var query struct {
		LevelID string `form:"level_id" binding:"required,uuid"`
	}
	if err := c.ShouldBindQuery(&query); err != nil {
		response.BadRequest(c, "level_id query parameter is required and must be a valid UUID")
		return
	}

	points, err := h.curriculumUsecase.GetGrammarPoints(c.Request.Context(), userID, query.LevelID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "grammar points retrieved successfully", points)
}

// RegisterRoutes registers curriculum routes under the protected group
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	curriculum := rg.Group("/curriculum")
	if authMiddleware != nil {
		curriculum.Use(authMiddleware)
	}
	completeRateLimiter := h.completeRateLimiter
	if completeRateLimiter == nil {
		completeRateLimiter = middleware.UserOrIPRateLimitMiddleware(
			30,
			time.Minute,
			"terlalu banyak percobaan penyelesaian lesson, silakan tunggu sebentar",
		)
	}
	{
		curriculum.GET("", h.GetCurriculum)
		curriculum.GET("/lessons/:id", h.GetLessonDetail)
		curriculum.POST("/lessons/:id/complete", completeRateLimiter, h.CompleteLesson)
		curriculum.GET("/grammar-points", h.GetGrammarPoints)
	}
}

