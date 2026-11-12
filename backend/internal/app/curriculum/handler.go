package curriculum

import (
	"net/http"

	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for curriculum navigation, roadmaps, and lesson completion
type Handler struct {
	curriculumUsecase Usecase
}

// NewHandler creates a new Curriculum Handler instance
func NewHandler(curriculumUsecase Usecase) *Handler {
	return &Handler{curriculumUsecase: curriculumUsecase}
}

// GetRoadmap handles GET /api/v1/curriculum/roadmap
func (h *Handler) GetRoadmap(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var req GetRoadmapRequest
	_ = c.ShouldBindQuery(&req)

	roadmap, err := h.curriculumUsecase.GetRoadmap(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "curriculum roadmap retrieved successfully", roadmap)
}

// GetLessonDetail handles GET /api/v1/curriculum/lessons/:id
func (h *Handler) GetLessonDetail(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	lessonID := c.Param("id")
	if lessonID == "" {
		response.BadRequest(c, "lesson ID parameter is required")
		return
	}

	lesson, err := h.curriculumUsecase.GetLessonDetail(c.Request.Context(), userID, lessonID)
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

	lessonID := c.Param("id")
	var req CompleteLessonRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	if req.LessonID == "" {
		req.LessonID = lessonID
	}

	res, err := h.curriculumUsecase.CompleteLesson(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "lesson completed successfully", res)
}

// RegisterRoutes registers curriculum routes under the protected group
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	curriculum := rg.Group("/curriculum")
	if authMiddleware != nil {
		curriculum.Use(authMiddleware)
	}
	{
		curriculum.GET("/roadmap", h.GetRoadmap)
		curriculum.GET("/lessons/:id", h.GetLessonDetail)
		curriculum.POST("/lessons/:id/complete", h.CompleteLesson)
	}
}

