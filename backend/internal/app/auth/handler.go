package auth

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"

	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for user authentication and session management
type Handler struct {
	authUsecase Usecase
	rateLimiter gin.HandlerFunc
	helper      *Helper
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

// SetHelper assigns the auth helper for token parsing in handlers
func (h *Handler) SetHelper(helper *Helper) {
	h.helper = helper
}

func sanitizedBindErrorMessage(err error) string {
	var syntaxErr *json.SyntaxError
	var typeErr *json.UnmarshalTypeError
	if errors.As(err, &syntaxErr) || errors.As(err, &typeErr) || errors.Is(err, io.EOF) || errors.Is(err, io.ErrUnexpectedEOF) {
		return "invalid JSON request body"
	}
	return "invalid request payload: please check required fields and input format"
}

func bindAuthJSON(c *gin.Context, dst any) bool {
	if err := c.ShouldBindJSON(dst); err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			c.JSON(http.StatusRequestEntityTooLarge, response.ErrorResponse{
				Success: false,
				Error:   "ukuran payload request melebihi batas maksimal yang diizinkan",
				Code:    "PAYLOAD_TOO_LARGE",
			})
			return false
		}
		response.BadRequest(c, sanitizedBindErrorMessage(err))
		return false
	}
	return true
}

// Register handles POST /api/v1/auth/register
func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if !bindAuthJSON(c, &req) {
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
	if !bindAuthJSON(c, &req) {
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
	if !bindAuthJSON(c, &req) {
		return
	}

	res, err := h.authUsecase.RefreshToken(c.Request.Context(), req.RefreshToken)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "token refreshed successfully", res)
}

type LogoutRequest struct {
	RefreshToken string `json:"refresh_token"`
}

// Logout handles POST /api/v1/auth/logout (terminates active device session)
func (h *Handler) Logout(c *gin.Context) {
	userID := c.GetString("userID")
	sessionID := c.GetString("sessionID")

	// If missing from Bearer claim (e.g. access token was expired), parse from optional refresh_token body
	if (userID == "" || sessionID == "") && h.helper != nil {
		var req LogoutRequest
		if err := c.ShouldBindJSON(&req); err == nil && strings.TrimSpace(req.RefreshToken) != "" {
			if claims, err := h.helper.ParseRefreshToken(strings.TrimSpace(req.RefreshToken)); err == nil {
				userID = claims.UserID
				sessionID = claims.SessionID
			}
		}
	}

	if userID == "" || sessionID == "" {
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

// RegisterRoutes registers public and protected /auth routes with rate limiting on login, register, refresh, and logout
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc, optionalAuthMiddleware ...gin.HandlerFunc) {
	if authMiddleware == nil {
		panic("auth handler requires non-nil authMiddleware")
	}

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

		// Allow Logout with optional bearer auth so clients with expired access token can logout using refresh_token in body
		var optAuth gin.HandlerFunc
		if len(optionalAuthMiddleware) > 0 && optionalAuthMiddleware[0] != nil {
			optAuth = optionalAuthMiddleware[0]
		}
		if optAuth != nil {
			if h.rateLimiter != nil {
				authPublic.POST("/logout", h.rateLimiter, optAuth, h.Logout)
			} else {
				authPublic.POST("/logout", optAuth, h.Logout)
			}
		}
	}

	authProtected := rg.Group("/auth")
	authProtected.Use(authMiddleware)
	{
		if len(optionalAuthMiddleware) == 0 || optionalAuthMiddleware[0] == nil {
			if h.rateLimiter != nil {
				authProtected.POST("/logout", h.rateLimiter, h.Logout)
			} else {
				authProtected.POST("/logout", h.Logout)
			}
		}
		authProtected.POST("/logout-all", h.LogoutAll)
	}
}
