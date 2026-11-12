package gamification

import (
	"net/http"

	"codeabroad/backend/internal/delivery/http/response"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for Akihabara arcade shop, chests, badges, and mentorship coaching
type Handler struct {
	gamificationUsecase domain.GamificationUsecase
}

// New creates a new Gamification Handler instance
func New(gamificationUsecase domain.GamificationUsecase) *Handler {
	return &Handler{gamificationUsecase: gamificationUsecase}
}

// GetStatus handles GET /api/v1/gamification/status
func (h *Handler) GetStatus(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
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
		response.Error(c, domain.ErrUnauthorized)
		return
	}

	var req domain.ShopBuyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
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

// ListBadges handles GET /api/v1/gamification/badges
func (h *Handler) ListBadges(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
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
		response.Error(c, domain.ErrUnauthorized)
		return
	}

	var req domain.ClaimChestRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
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

// SubmitCoaching handles POST /api/v1/gamification/coaching
func (h *Handler) SubmitCoaching(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
		return
	}

	var req domain.CoachingSubmissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
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
	gamification := rg.Group("/gamification")
	if authMiddleware != nil {
		gamification.Use(authMiddleware)
	}
	{
		gamification.GET("/status", h.GetStatus)
		gamification.GET("/shop", h.ListShopItems)
		gamification.POST("/shop/buy", h.BuyShopItem)
		gamification.GET("/badges", h.ListBadges)
		gamification.POST("/chests/claim", h.ClaimDailyChest)
		gamification.POST("/coaching", h.SubmitCoaching)
	}
}

