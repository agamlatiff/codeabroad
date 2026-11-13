package auth

import (
	"net/http"

	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for user authentication and session management
type Handler struct {
	authUsecase Usecase
	rateLimiter gin.HandlerFunc
}

// NewHandler creates a new Auth Handler instance without built-in middleware wiring
func NewHandler(authUsecase Usecase) *Handler {
	return NewHandlerWithRateLimiter(authUsecase, nil)
}

// NewHandlerWithRateLimiter creates a new Auth Handler instance with a custom rate limiter middleware
func NewHandlerWithRateLimiter(authUsecase Usecase, rateLimiter gin.HandlerFunc) *Handler {
	return &Handler{
		authUsecase: authUsecase,
		rateLimiter: rateLimiter,
	}
}

// Register handles POST /api/v1/auth/register
func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
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

// Login handles POST /api/v1/auth/login
func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
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

// RefreshToken handles POST /api/v1/auth/refresh
func (h *Handler) RefreshToken(c *gin.Context) {
	var req RefreshTokenRequest
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

// Logout handles POST /api/v1/auth/logout (terminates active device session)
func (h *Handler) Logout(c *gin.Context) {
	userID := c.GetString("userID")
	sessionID := c.GetString("sessionID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	if err := h.authUsecase.Logout(c.Request.Context(), userID, sessionID); err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "user logged out successfully", nil)
}

// LogoutAll handles POST /api/v1/auth/logout-all (terminates all active device sessions for this user)
func (h *Handler) LogoutAll(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	if err := h.authUsecase.LogoutAll(c.Request.Context(), userID); err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "all user device sessions terminated successfully", nil)
}

// RegisterRoutes registers public and protected /auth routes with rate limiting on login, register, and refresh
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	authPublic := rg.Group("/auth")
	{
		if h.rateLimiter != nil {
			authPublic.POST("/register", h.rateLimiter, h.Register)
			authPublic.POST("/login", h.rateLimiter, h.Login)
			authPublic.POST("/refresh", h.rateLimiter, h.RefreshToken)
		} else {
			authPublic.POST("/register", h.Register)
			authPublic.POST("/login", h.Login)
			authPublic.POST("/refresh", h.RefreshToken)
		}
	}

	authProtected := rg.Group("/auth")
	if authMiddleware != nil {
		authProtected.Use(authMiddleware)
	}
	{
		authProtected.POST("/logout", h.Logout)
		authProtected.POST("/logout-all", h.LogoutAll)
	}
}
