package onboarding

import (
	"net/http"

	"codeabroad/backend/internal/delivery/http/response"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for language destination onboarding
type Handler struct {
	onboardingUsecase domain.OnboardingUsecase
}

// New creates a new Onboarding Handler instance
func New(onboardingUsecase domain.OnboardingUsecase) *Handler {
	return &Handler{onboardingUsecase: onboardingUsecase}
}

// GetLanguages handles GET /api/v1/onboarding/languages
func (h *Handler) GetLanguages(c *gin.Context) {
	languages, err := h.onboardingUsecase.GetAvailableLanguages(c.Request.Context())
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "available languages retrieved successfully", languages)
}

// GetPlacementQuestions handles GET /api/v1/onboarding/placement-questions/:language_id
func (h *Handler) GetPlacementQuestions(c *gin.Context) {
	languageID := c.Param("language_id")
	if languageID == "" {
		response.BadRequest(c, "language_id parameter is required")
		return
	}

	res, err := h.onboardingUsecase.GetPlacementQuestions(c.Request.Context(), languageID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "placement test questions retrieved successfully", res)
}

// CompleteOnboarding handles POST /api/v1/onboarding
func (h *Handler) CompleteOnboarding(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
		return
	}

	var req domain.OnboardingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	res, err := h.onboardingUsecase.CompleteOnboarding(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "onboarding completed successfully", res)
}

// RegisterRoutes registers onboarding public and protected HTTP endpoints
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	onboardingPublic := rg.Group("/onboarding")
	{
		onboardingPublic.GET("/languages", h.GetLanguages)
		onboardingPublic.GET("/placement-questions/:language_id", h.GetPlacementQuestions)
	}

	onboardingProtected := rg.Group("/onboarding")
	if authMiddleware != nil {
		onboardingProtected.Use(authMiddleware)
	}
	{
		onboardingProtected.POST("", h.CompleteOnboarding)
	}
}

