package handler

import (
	"net/http"

	"codeabroad/backend/internal/delivery/http/response"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

// RoadmapHandler handles HTTP requests for roadmaps and curriculum syllabus
type RoadmapHandler struct {
	roadmapUsecase domain.RoadmapUsecase
}

// NewRoadmapHandler creates a new RoadmapHandler instance
func NewRoadmapHandler(roadmapUsecase domain.RoadmapUsecase) *RoadmapHandler {
	return &RoadmapHandler{roadmapUsecase: roadmapUsecase}
}

// GetActiveRoadmap handles GET /api/v1/roadmaps/active
func (h *RoadmapHandler) GetActiveRoadmap(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
		return
	}

	rm, err := h.roadmapUsecase.GetActiveUserRoadmap(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "active roadmap retrieved successfully", rm)
}

// GetTrackRoadmap handles GET /api/v1/roadmaps/:track_slug
func (h *RoadmapHandler) GetTrackRoadmap(c *gin.Context) {
	userID := c.GetString("userID")
	slug := c.Param("track_slug")

	rm, err := h.roadmapUsecase.GetTrackRoadmap(c.Request.Context(), slug, userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "track roadmap retrieved successfully", rm)
}

// RegisterRoutes registers the roadmap routes under the provided router group
func (h *RoadmapHandler) RegisterRoutes(r *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	roadmaps := r.Group("/roadmaps")
	roadmaps.Use(authMiddleware)
	{
		roadmaps.GET("/active", h.GetActiveRoadmap)
		roadmaps.GET("/:track_slug", h.GetTrackRoadmap)
	}
}
