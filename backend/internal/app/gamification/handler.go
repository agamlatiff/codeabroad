package gamification

import (
	"net/http"

	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for Akihabara arcade shop, chests, badges, and mentorship coaching
type Handler struct {
	gamificationUsecase Usecase
	mutationLimiter     gin.HandlerFunc
}

// NewHandler creates a new Gamification Handler instance
func NewHandler(gamificationUsecase Usecase) *Handler {
	return &Handler{gamificationUsecase: gamificationUsecase}
}

// NewHandlerWithRateLimiter creates a Gamification Handler with rate limiting on mutation endpoints
func NewHandlerWithRateLimiter(gamificationUsecase Usecase, mutationLimiter gin.HandlerFunc) *Handler {
	return &Handler{
		gamificationUsecase: gamificationUsecase,
		mutationLimiter:     mutationLimiter,
	}
}

// GetStatus handles GET /api/v1/gamification/status
func (h *Handler) GetStatus(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	status, err := h.gamificationUsecase.GetStatus(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "gamification status retrieved successfully", status)
}

// ListShopItems handles GET /api/v1/gamification/shop
func (h *Handler) ListShopItems(c *gin.Context) {
	items, err := h.gamificationUsecase.ListShopItems(c.Request.Context())
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "shop items retrieved successfully", items)
}

// BuyShopItem handles POST /api/v1/gamification/shop/buy
func (h *Handler) BuyShopItem(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var req ShopBuyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, apperror.NewBadRequestError("INVALID_REQUEST", "invalid shop purchase payload", nil))
		return
	}

	inventoryItem, status, err := h.gamificationUsecase.BuyShopItem(c.Request.Context(), userID, req.ItemID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "shop item purchased successfully", gin.H{
		"purchased_item": inventoryItem,
		"status":         status,
	})
}

// ActivateShopItem handles POST /api/v1/gamification/shop/activate
func (h *Handler) ActivateShopItem(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var req ShopActivateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, apperror.NewBadRequestError("INVALID_REQUEST", "invalid shop activation payload", nil))
		return
	}

	status, err := h.gamificationUsecase.ActivateShopItem(c.Request.Context(), userID, req.ItemID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "shop item activated successfully", gin.H{
		"status": status,
	})
}

// ListBadges handles GET /api/v1/gamification/badges
func (h *Handler) ListBadges(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	catalog, userBadges, err := h.gamificationUsecase.ListBadges(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "badges retrieved successfully", gin.H{
		"catalog":     catalog,
		"user_badges": userBadges,
	})
}

// ClaimDailyChest handles POST /api/v1/gamification/chests/claim
func (h *Handler) ClaimDailyChest(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var req ClaimChestRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, apperror.NewBadRequestError("INVALID_REQUEST", "invalid chest claim payload", nil))
		return
	}

	claim, status, err := h.gamificationUsecase.ClaimDailyChest(c.Request.Context(), userID, req.Tier)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "daily chest claimed successfully", gin.H{
		"claim":  claim,
		"status": status,
	})
}

// GetDailyQuests handles GET /api/v1/gamification/daily-quests
func (h *Handler) GetDailyQuests(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	quests, err := h.gamificationUsecase.GetDailyQuests(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "daily quests retrieved successfully", quests)
}

// ClaimDailyQuest handles POST /api/v1/gamification/daily-quests/:id/claim
func (h *Handler) ClaimDailyQuest(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	questID := c.Param("id")
	res, err := h.gamificationUsecase.ClaimDailyQuest(c.Request.Context(), userID, questID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "daily quest claimed successfully", res)
}

// ClaimMonthlyBadge handles POST /api/v1/gamification/monthly-badge/claim
func (h *Handler) ClaimMonthlyBadge(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	claim, status, err := h.gamificationUsecase.ClaimMonthlyBadge(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "monthly badge claimed successfully", gin.H{
		"claim":  claim,
		"status": status,
	})
}

// SubmitCoaching handles POST /api/v1/gamification/coaching
func (h *Handler) SubmitCoaching(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var req CoachingSubmissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, apperror.NewBadRequestError("INVALID_REQUEST", "invalid coaching submission payload", nil))
		return
	}

	submission, status, err := h.gamificationUsecase.SubmitCoaching(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusCreated, "coaching submission received successfully", gin.H{
		"submission": submission,
		"status":     status,
	})
}

// RegisterRoutes registers gamification endpoints under the protected group
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	group := rg.Group("/gamification")
	if authMiddleware != nil {
		group.Use(authMiddleware)
	}

	group.GET("/status", h.GetStatus)
	group.GET("/shop", h.ListShopItems)
	group.GET("/badges", h.ListBadges)
	group.GET("/daily-quests", h.GetDailyQuests)

	if h.mutationLimiter != nil {
		group.POST("/shop/buy", h.mutationLimiter, h.BuyShopItem)
		group.POST("/shop/activate", h.mutationLimiter, h.ActivateShopItem)
		group.POST("/chests/claim", h.mutationLimiter, h.ClaimDailyChest)
		group.POST("/daily-quests/:id/claim", h.mutationLimiter, h.ClaimDailyQuest)
		group.POST("/monthly-badge/claim", h.mutationLimiter, h.ClaimMonthlyBadge)
		group.POST("/coaching", h.mutationLimiter, h.SubmitCoaching)
	} else {
		group.POST("/shop/buy", h.BuyShopItem)
		group.POST("/shop/activate", h.ActivateShopItem)
		group.POST("/chests/claim", h.ClaimDailyChest)
		group.POST("/daily-quests/:id/claim", h.ClaimDailyQuest)
		group.POST("/monthly-badge/claim", h.ClaimMonthlyBadge)
		group.POST("/coaching", h.SubmitCoaching)
	}
}
