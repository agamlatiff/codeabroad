package handler

import (
	"codeabroad/backend/internal/delivery/http/response"
	"codeabroad/backend/internal/domain"
	"net/http"

	"github.com/gin-gonic/gin"
)

// LeaderboardHandler handles HTTP requests for Tokyo League rankings
type LeaderboardHandler struct {
	leaderboardUsecase domain.LeaderboardUsecase
}

// NewLeaderboardHandler creates a new LeaderboardHandler instance
func NewLeaderboardHandler(leaderboardUsecase domain.LeaderboardUsecase) *LeaderboardHandler {
	return &LeaderboardHandler{leaderboardUsecase: leaderboardUsecase}
}

// GetWeeklyLeaderboard handles GET /api/v1/leaderboard/weekly
func (h *LeaderboardHandler) GetWeeklyLeaderboard(c *gin.Context) {
	userID := c.GetString("userID")
	division := domain.TokyoDivision(c.Query("division"))

	result, err := h.leaderboardUsecase.GetWeeklyLeaderboard(c.Request.Context(), userID, division)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "weekly leaderboard retrieved successfully", result)
}

// RegisterRoutes registers the leaderboard routes under the provided router group
func (h *LeaderboardHandler) RegisterRoutes(rg *gin.RouterGroup, optionalAuth gin.HandlerFunc) {
	leaderboard := rg.Group("/leaderboard")
	{
		if optionalAuth != nil {
			leaderboard.GET("/weekly", optionalAuth, h.GetWeeklyLeaderboard)
		} else {
			leaderboard.GET("/weekly", h.GetWeeklyLeaderboard)
		}
	}
}
