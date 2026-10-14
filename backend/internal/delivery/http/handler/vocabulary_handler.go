package handler

import (
	"net/http"
	"strconv"

	"codeabroad/backend/internal/delivery/http/response"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

// VocabularyHandler handles HTTP requests for Japanese IT vocabulary bank
type VocabularyHandler struct {
	vocabUsecase domain.VocabularyUsecase
}

// NewVocabularyHandler creates a new VocabularyHandler instance
func NewVocabularyHandler(vocabUsecase domain.VocabularyUsecase) *VocabularyHandler {
	return &VocabularyHandler{vocabUsecase: vocabUsecase}
}

// GetDailyVocabularies handles GET /api/v1/vocabularies/daily
func (h *VocabularyHandler) GetDailyVocabularies(c *gin.Context) {
	vocabs, err := h.vocabUsecase.GetDailyVocabularies(c.Request.Context())
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "daily vocabularies retrieved successfully", vocabs)
}

// ListVocabularies handles GET /api/v1/vocabularies
func (h *VocabularyHandler) ListVocabularies(c *gin.Context) {
	category := c.Query("category")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	vocabs, total, err := h.vocabUsecase.ListVocabularies(c.Request.Context(), category, page, limit)
	if err != nil {
		response.Error(c, err)
		return
	}

	data := gin.H{
		"vocabularies": vocabs,
		"total":        total,
		"page":         page,
		"limit":        limit,
	}

	response.Success(c, http.StatusOK, "vocabularies retrieved successfully", data)
}

// RegisterRoutes registers the vocabulary routes under the provided router group
func (h *VocabularyHandler) RegisterRoutes(rg *gin.RouterGroup) {
	vocabs := rg.Group("/vocabularies")
	{
		vocabs.GET("", h.ListVocabularies)
		vocabs.GET("/daily", h.GetDailyVocabularies)
	}
}
