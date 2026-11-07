package auth

import (
	"net/http"
	"time"

	"codeabroad/backend/internal/delivery/http/middleware"
	"codeabroad/backend/internal/delivery/http/response"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

const (
	defaultAuthRateLimitMaxRequests = 10
	defaultAuthRateLimitWindow      = 1 * time.Minute
)

// Handler handles HTTP requests for user authentication and session management
type Handler struct {
	authUsecase domain.AuthUsecase
	rateLimiter gin.HandlerFunc
}

// New creates a new Auth Handler instance with default per-IP brute-force rate limiting (10 req/min)
func New(authUsecase domain.AuthUsecase) *Handler {
	return &Handler{
		authUsecase: authUsecase,
		rateLimiter: middleware.RateLimitMiddleware(defaultAuthRateLimitMaxRequests, defaultAuthRateLimitWindow),
	}
}

// NewWithRateLimiter creates a new Auth Handler instance with a custom rate limiter middleware
func NewWithRateLimiter(authUsecase domain.AuthUsecase, rateLimiter gin.HandlerFunc) *Handler {
	return &Handler{
		authUsecase: authUsecase,
		rateLimiter: rateLimiter,
	}
}

// Register handles POST /api/v1/auth/register
func (h *Handler) Register(c *gin.Context) {
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

// Login handles POST /api/v1/auth/login
func (h *Handler) Login(c *gin.Context) {
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

// RefreshToken handles POST /api/v1/auth/refresh
func (h *Handler) RefreshToken(c *gin.Context) {
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

// Logout handles POST /api/v1/auth/logout
func (h *Handler) Logout(c *gin.Context) {
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
	authProtected.Use(authMiddleware)
	{
		authProtected.POST("/logout", h.Logout)
	}
}
