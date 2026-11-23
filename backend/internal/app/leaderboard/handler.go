package leaderboard

import (
	"net/http"
	"time"

	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/middleware"
	"merantalk/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

const (
	DefaultLeaderboardLimit   = 60
	DefaultLeaderboardMessage = "terlalu banyak permintaan papan peringkat, silakan tunggu sebentar"
)

// Handler handles HTTP requests for weekly league rankings
type Handler struct {
	leaderboardUsecase Usecase
	readLimiter        gin.HandlerFunc
}

// NewHandler creates a new Leaderboard Handler instance
func NewHandler(leaderboardUsecase Usecase) *Handler {
	return NewHandlerWithRateLimiter(leaderboardUsecase, nil)
}

// NewHandlerWithRateLimiter creates a Leaderboard Handler with custom rate limiting.
func NewHandlerWithRateLimiter(leaderboardUsecase Usecase, readLimiter gin.HandlerFunc) *Handler {
	if readLimiter == nil {
		readLimiter = middleware.UserOrIPRateLimitMiddleware(DefaultLeaderboardLimit, time.Minute, DefaultLeaderboardMessage)
	}
	return &Handler{
		leaderboardUsecase: leaderboardUsecase,
		readLimiter:        readLimiter,
	}
}

// GetWeeklyLeaderboard handles GET /api/v1/leaderboard/weekly
func (h *Handler) GetWeeklyLeaderboard(c *gin.Context) {
	userID := c.GetString("userID")
	division := LeagueDivision(c.Query("division"))

	result, err := h.leaderboardUsecase.GetWeeklyLeaderboard(c.Request.Context(), userID, division)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "weekly leaderboard retrieved successfully", result)
}

// ClaimWeeklyReward handles POST /api/v1/leaderboard/weekly/claim
func (h *Handler) ClaimWeeklyReward(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	result, err := h.leaderboardUsecase.ClaimWeeklyReward(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "weekly leaderboard reward claimed successfully", result)
}

// RegisterRoutes registers the leaderboard routes under the provided router group
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc, optionalAuth gin.HandlerFunc) {
	if authMiddleware == nil {
		panic("leaderboard.Handler.RegisterRoutes requires non-nil authMiddleware")
	}
	limiter := h.readLimiter
	if limiter == nil {
		limiter = middleware.UserOrIPRateLimitMiddleware(DefaultLeaderboardLimit, time.Minute, DefaultLeaderboardMessage)
	}
	leaderboard := rg.Group("/leaderboard")
	{
		if optionalAuth != nil {
			leaderboard.GET("/weekly", optionalAuth, limiter, h.GetWeeklyLeaderboard)
		} else {
			leaderboard.GET("/weekly", limiter, h.GetWeeklyLeaderboard)
		}
		leaderboard.POST("/weekly/claim", authMiddleware, limiter, h.ClaimWeeklyReward)
	}
}

