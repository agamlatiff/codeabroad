package onboarding

import (
	"net/http"

	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

func isValidUUID(s string) bool {
	if len(s) != 36 {
		return false
	}
	for i := 0; i < 36; i++ {
		if i == 8 || i == 13 || i == 18 || i == 23 {
			if s[i] != '-' {
				return false
			}
			continue
		}
		c := s[i]
		if !((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')) {
			return false
		}
	}
	return true
}

const (
	// DefaultOnboardingCompleteLimit caps onboarding completion attempts per user per minute
	DefaultOnboardingCompleteLimit = 10
	// DefaultOnboardingCompleteMessage is returned when onboarding rate limit is exceeded
	DefaultOnboardingCompleteMessage = "terlalu banyak percobaan penyelesaian onboarding, silakan tunggu sebentar"
)

// Handler handles HTTP requests for language destination onboarding
type Handler struct {
	onboardingUsecase Usecase
	completeLimiter   gin.HandlerFunc
}

// NewHandler creates a new Onboarding Handler instance
func NewHandler(onboardingUsecase Usecase) *Handler {
	return &Handler{onboardingUsecase: onboardingUsecase}
}

// NewHandlerWithRateLimiter creates an Onboarding Handler with an optional rate limiter on POST /onboarding
func NewHandlerWithRateLimiter(onboardingUsecase Usecase, completeLimiter gin.HandlerFunc) *Handler {
	return &Handler{
		onboardingUsecase: onboardingUsecase,
		completeLimiter:   completeLimiter,
	}
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
	if !isValidUUID(languageID) {
		response.BadRequest(c, "language_id harus berupa UUID yang valid")
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
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var req OnboardingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "invalid onboarding submission payload")
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
		if h.completeLimiter != nil {
			onboardingProtected.POST("", h.completeLimiter, h.CompleteOnboarding)
		} else {
			onboardingProtected.POST("", h.CompleteOnboarding)
		}
	}
}

