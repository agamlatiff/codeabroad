package flashcard

import (
	"net/http"
	"strconv"
	"time"

	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/middleware"
	"merantalk/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

const (
	// DefaultFlashcardReviewLimit is the per-minute rate limit for flashcard review submissions.
	DefaultFlashcardReviewLimit = 60
	// DefaultFlashcardReviewMessage is returned when flashcard review rate limit is exceeded.
	DefaultFlashcardReviewMessage = "terlalu banyak ulasan flashcard, tunggu sebentar"
)

// Handler exposes HTTP endpoints for standalone and spaced-repetition flashcards.
type Handler struct {
	usecase           Usecase
	reviewRateLimiter gin.HandlerFunc
}

// NewHandlerWithRateLimiter creates a flashcard HTTP handler with a custom rate limiter.
func NewHandlerWithRateLimiter(uc Usecase, reviewLimiter gin.HandlerFunc) *Handler {
	if reviewLimiter == nil {
		reviewLimiter = middleware.UserOrIPRateLimitMiddleware(
			DefaultFlashcardReviewLimit,
			time.Minute,
			DefaultFlashcardReviewMessage,
		)
	}
	return &Handler{
		usecase:           uc,
		reviewRateLimiter: reviewLimiter,
	}
}

func requireUserID(c *gin.Context) (string, bool) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return "", false
	}
	return userID, true
}

// ListDecks handles GET /api/v1/flashcards/decks.
func (h *Handler) ListDecks(c *gin.Context) {
	userID, ok := requireUserID(c)
	if !ok {
		return
	}

	lang := c.Query("lang")
	level := c.Query("level")

	isPaginated := c.Query("paginated") == "1" ||
		c.Query("paginated") == "true" ||
		c.Query("cursor") != "" ||
		c.Query("limit") != "" ||
		c.Query("category") != "" ||
		c.Query("q") != ""

	if isPaginated {
		limit := 0
		if rawLimit := c.Query("limit"); rawLimit != "" {
			if parsed, err := strconv.Atoi(rawLimit); err == nil {
				limit = parsed
			}
		}
		page, err := h.usecase.ListDecksPaginated(c.Request.Context(), userID, DeckListFilter{
			LanguageCode: lang,
			JLPTLevel:    level,
			Category:     c.Query("category"),
			Search:       c.Query("q"),
			Cursor:       c.Query("cursor"),
			Limit:        limit,
		})
		if err != nil {
			response.Error(c, err)
			return
		}
		response.Success(c, http.StatusOK, "flashcard decks page retrieved successfully", page)
		return
	}

	decks, err := h.usecase.ListDecks(c.Request.Context(), userID, lang, level)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "flashcard decks retrieved successfully", decks)
}

// GetDeck handles GET /api/v1/flashcards/decks/:id.
func (h *Handler) GetDeck(c *gin.Context) {
	userID, ok := requireUserID(c)
	if !ok {
		return
	}

	deckID := c.Param("id")
	detail, err := h.usecase.GetDeck(c.Request.Context(), userID, deckID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "flashcard deck retrieved successfully", detail)
}

// GetDueQueue handles GET /api/v1/flashcards/due.
func (h *Handler) GetDueQueue(c *gin.Context) {
	userID, ok := requireUserID(c)
	if !ok {
		return
	}

	lang := c.Query("lang")
	limit, _ := strconv.Atoi(c.Query("limit"))
	queue, err := h.usecase.GetDueQueue(c.Request.Context(), userID, lang, limit)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "due flashcards retrieved successfully", queue)
}

// ReviewCard handles POST /api/v1/flashcards/cards/:id/review.
func (h *Handler) ReviewCard(c *gin.Context) {
	userID, ok := requireUserID(c)
	if !ok {
		return
	}

	var req ReviewCardRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.Quality == nil {
		response.Error(c, apperror.ErrBadRequest)
		return
	}

	cardID := c.Param("id")
	res, err := h.usecase.ReviewCard(c.Request.Context(), userID, cardID, *req.Quality)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "flashcard review saved successfully", res)
}

// RegisterRoutes mounts flashcard routes onto the v1 router group.
func (h *Handler) RegisterRoutes(v1 *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	fc := v1.Group("/flashcards")
	fc.Use(authMiddleware)
	{
		fc.GET("/decks", h.ListDecks)
		fc.GET("/decks/:id", h.GetDeck)
		fc.GET("/due", h.GetDueQueue)
		fc.POST("/cards/:id/review", h.reviewRateLimiter, h.ReviewCard)
	}
}
