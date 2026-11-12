package language

import (
	"net/http"

	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for destination languages and enrollments
type Handler struct {
	langUsecase Usecase
}

// NewHandler creates a new Language Handler instance
func NewHandler(langUsecase Usecase) *Handler {
	return &Handler{langUsecase: langUsecase}
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
		response.BadRequest(c, err.Error())
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

type switchLanguageRequest struct {
	LanguageID string `json:"language_id" binding:"required,uuid"`
}

// SwitchActiveLanguage handles POST /api/v1/languages/switch
func (h *Handler) SwitchActiveLanguage(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var req switchLanguageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
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
	langPublic := rg.Group("/languages")
	{
		langPublic.GET("", h.ListLanguages)
		langPublic.GET("/:id", h.GetLanguageDetails)
	}

	langProtected := rg.Group("/languages")
	if authMiddleware != nil {
		langProtected.Use(authMiddleware)
	}
	{
		langProtected.GET("/enrollments", h.GetUserEnrollments)
		langProtected.POST("/switch", h.SwitchActiveLanguage)
	}
}

