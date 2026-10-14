package handler

import (
	"net/http"

	"codeabroad/backend/internal/delivery/http/response"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authUsecase domain.AuthUsecase
}

func NewAuthHandler(authUsecase domain.AuthUsecase) *AuthHandler {
	return &AuthHandler{authUsecase: authUsecase}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req domain.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	res, err := h.authUsecase.Register(c.Request.Context(), &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusCreated, "user registered successfully", res)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req domain.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	res, err := h.authUsecase.Login(c.Request.Context(), &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "login successful", res)
}

func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req domain.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	res, err := h.authUsecase.RefreshToken(c.Request.Context(), req.RefreshToken)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "token refreshed successfully", res)
}

func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
		return
	}

	user, err := h.authUsecase.GetProfile(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "user profile retrieved successfully", user)
}

func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
		return
	}

	var req domain.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	user, err := h.authUsecase.UpdateProfile(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "user profile updated successfully", user)
}

// GetActivityLogs handles GET /api/v1/users/me/activity-logs
func (h *AuthHandler) GetActivityLogs(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
		return
	}

	summary, err := h.authUsecase.GetActivityLogs(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "user activity logs retrieved successfully", summary)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
		return
	}

	if err := h.authUsecase.Logout(c.Request.Context(), userID); err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "user logged out successfully", nil)
}

// ClaimDailyReward handles POST /api/v1/users/me/daily-rewards/claim
func (h *AuthHandler) ClaimDailyReward(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
		return
	}

	var req domain.DailyRewardClaimRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	res, err := h.authUsecase.ClaimDailyReward(c.Request.Context(), userID, req.RewardType)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "daily reward claimed successfully", res)
}

// GetDailyRewardsStatus handles GET /api/v1/users/me/daily-rewards
func (h *AuthHandler) GetDailyRewardsStatus(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
		return
	}

	status, err := h.authUsecase.GetDailyRewardsStatus(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "daily rewards status retrieved successfully", status)
}

func (h *AuthHandler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	// Public routes
	auth := rg.Group("/auth")
	{
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
		auth.POST("/refresh", h.RefreshToken)
	}

	// Protected auth routes
	authProtected := rg.Group("/auth")
	authProtected.Use(authMiddleware)
	{
		authProtected.POST("/logout", h.Logout)
	}

	// Protected user routes
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
