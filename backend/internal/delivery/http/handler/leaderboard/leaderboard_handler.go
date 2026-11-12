package leaderboard

import (
	"net/http"

	"codeabroad/backend/internal/delivery/http/response"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for Tokyo League rankings
type Handler struct {
	leaderboardUsecase domain.LeaderboardUsecase
}

// New creates a new Leaderboard Handler instance
func New(leaderboardUsecase domain.LeaderboardUsecase) *Handler {
	return &Handler{leaderboardUsecase: leaderboardUsecase}
}

// GetWeeklyLeaderboard handles GET /api/v1/leaderboard/weekly
func (h *Handler) GetWeeklyLeaderboard(c *gin.Context) {
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
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, optionalAuth gin.HandlerFunc) {
	leaderboard := rg.Group("/leaderboard")
	{
		if optionalAuth != nil {
			leaderboard.GET("/weekly", optionalAuth, h.GetWeeklyLeaderboard)
		} else {
			leaderboard.GET("/weekly", h.GetWeeklyLeaderboard)
		}
	}
}

