package user

import (
	"net/http"

	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for user profile, preferences, and daily consistency
type Handler struct {
	userUsecase Usecase
}

// NewHandler creates a new User Handler instance
func NewHandler(userUsecase Usecase) *Handler {
	return &Handler{userUsecase: userUsecase}
}

// GetProfile handles GET /api/v1/users/me
func (h *Handler) GetProfile(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	usr, err := h.userUsecase.GetProfile(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "user profile retrieved successfully", usr)
}

// UpdateProfile handles PATCH /api/v1/users/me
func (h *Handler) UpdateProfile(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	usr, err := h.userUsecase.UpdateProfile(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "user profile updated successfully", usr)
}

// GetActivityLogs handles GET /api/v1/users/me/activity-logs
func (h *Handler) GetActivityLogs(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	summary, err := h.userUsecase.GetActivityLogs(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "user activity logs retrieved successfully", summary)
}

// ClaimDailyReward handles POST /api/v1/users/me/daily-rewards/claim
func (h *Handler) ClaimDailyReward(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var req DailyRewardClaimRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	res, err := h.userUsecase.ClaimDailyReward(c.Request.Context(), userID, req.RewardType)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "daily reward claimed successfully", res)
}

// GetDailyRewardsStatus handles GET /api/v1/users/me/daily-rewards
func (h *Handler) GetDailyRewardsStatus(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	status, err := h.userUsecase.GetDailyRewardsStatus(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "daily rewards status retrieved successfully", status)
}

// RegisterRoutes registers protected /users routes
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	users := rg.Group("/users")
	users.Use(authMiddleware)
	{
		users.GET("/me", h.GetProfile)
		users.PATCH("/me", h.UpdateProfile)
		users.GET("/me/activity-logs", h.GetActivityLogs)
		users.GET("/me/daily-rewards", h.GetDailyRewardsStatus)
		users.POST("/me/daily-rewards/claim", h.ClaimDailyReward)
	}
}

