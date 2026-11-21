package language

import (
	"net/http"

	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for destination languages and enrollments
type Handler struct {
	langUsecase     Usecase
	mutationLimiter gin.HandlerFunc
}

// NewHandler creates a new Language Handler instance
func NewHandler(langUsecase Usecase) *Handler {
	return &Handler{langUsecase: langUsecase}
}

// NewHandlerWithRateLimiter creates a Language Handler with rate limiting on mutation endpoints
func NewHandlerWithRateLimiter(langUsecase Usecase, mutationLimiter gin.HandlerFunc) *Handler {
	return &Handler{
		langUsecase:     langUsecase,
		mutationLimiter: mutationLimiter,
	}
}

// ListLanguages handles GET /api/v1/languages
func (h *Handler) ListLanguages(c *gin.Context) {
	languages, err := h.langUsecase.ListLanguages(c.Request.Context())
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "languages retrieved successfully", languages)
}

type getLanguageDetailsURI struct {
	ID string `uri:"id" binding:"required,uuid"`
}

// GetLanguageDetails handles GET /api/v1/languages/:id
func (h *Handler) GetLanguageDetails(c *gin.Context) {
	var uri getLanguageDetailsURI
	if err := c.ShouldBindUri(&uri); err != nil {
		response.Error(c, apperror.NewBadRequestError("INVALID_LANGUAGE_ID", "invalid language id format", nil))
		return
	}

	lang, levels, err := h.langUsecase.GetLanguageDetails(c.Request.Context(), uri.ID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "language details retrieved successfully", gin.H{
		"language": lang,
		"levels":   levels,
	})
}

// GetUserEnrollments handles GET /api/v1/languages/enrollments
func (h *Handler) GetUserEnrollments(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	enrollments, err := h.langUsecase.GetUserEnrollments(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "user enrollments retrieved successfully", enrollments)
}

type languageMutationRequest struct {
	LanguageID string `json:"language_id" binding:"required,uuid"`
}

// EnrollLanguage handles POST /api/v1/languages/enroll
func (h *Handler) EnrollLanguage(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var req languageMutationRequest
	if !response.BindJSON(c, &req) {
		return
	}

	enrollment, err := h.langUsecase.EnrollLanguage(c.Request.Context(), userID, req.LanguageID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusCreated, "enrolled in language track successfully", enrollment)
}

// SwitchActiveLanguage handles POST /api/v1/languages/switch
func (h *Handler) SwitchActiveLanguage(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var req languageMutationRequest
	if !response.BindJSON(c, &req) {
		return
	}

	enrollment, err := h.langUsecase.SwitchActiveLanguage(c.Request.Context(), userID, req.LanguageID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "active language switched successfully", enrollment)
}

// RegisterRoutes registers language public and protected HTTP endpoints
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	if authMiddleware == nil {
		panic("language.Handler.RegisterRoutes requires non-nil authMiddleware")
	}
	langProtected := rg.Group("/languages")
	langProtected.Use(authMiddleware)
	{
		langProtected.GET("/enrollments", h.GetUserEnrollments)
		if h.mutationLimiter != nil {
			langProtected.POST("/enroll", h.mutationLimiter, h.EnrollLanguage)
			langProtected.POST("/switch", h.mutationLimiter, h.SwitchActiveLanguage)
		} else {
			langProtected.POST("/enroll", h.EnrollLanguage)
			langProtected.POST("/switch", h.SwitchActiveLanguage)
		}
	}

	langPublic := rg.Group("/languages")
	{
		langPublic.GET("", h.ListLanguages)
		langPublic.GET("/:id", h.GetLanguageDetails)
	}
}

