package handler

import (
	"net/http"

	"codeabroad/backend/internal/delivery/http/response"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

// OnboardingHandler handles HTTP requests for destination countries, career paths, and onboarding submissions
type OnboardingHandler struct {
	onboardingUsecase domain.OnboardingUsecase
}

// NewOnboardingHandler creates a new OnboardingHandler instance
func NewOnboardingHandler(onboardingUsecase domain.OnboardingUsecase) *OnboardingHandler {
	return &OnboardingHandler{onboardingUsecase: onboardingUsecase}
}

// GetCountries handles GET /api/v1/countries
func (h *OnboardingHandler) GetCountries(c *gin.Context) {
	countries, err := h.onboardingUsecase.GetCountries(c.Request.Context())
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "countries retrieved successfully", countries)
}

// GetCareerPaths handles GET /api/v1/career-paths
func (h *OnboardingHandler) GetCareerPaths(c *gin.Context) {
	paths, err := h.onboardingUsecase.GetCareerPaths(c.Request.Context())
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "career paths retrieved successfully", paths)
}

// CompleteOnboarding handles POST /api/v1/onboarding
func (h *OnboardingHandler) CompleteOnboarding(c *gin.Context) {
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

// RegisterRoutes registers the onboarding public and protected HTTP endpoints
func (h *OnboardingHandler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	// Public master data endpoints
	rg.GET("/countries", h.GetCountries)
	rg.GET("/career-paths", h.GetCareerPaths)

	// Protected onboarding submission endpoint
	protected := rg.Group("")
	protected.Use(authMiddleware)
	{
		protected.POST("/onboarding", h.CompleteOnboarding)
	}
}

