package handler

import (
	"net/http"

	"codeabroad/backend/internal/delivery/http/response"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

// GamificationHandler handles HTTP requests for gamification features
type GamificationHandler struct {
	usecase domain.GamificationUsecase
}

// NewGamificationHandler creates a new GamificationHandler instance
func NewGamificationHandler(usecase domain.GamificationUsecase) *GamificationHandler {
	return &GamificationHandler{usecase: usecase}
}

// GetStatus handles GET /api/v1/gamification/status
func (h *GamificationHandler) GetStatus(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
		return
	}

	status, err := h.usecase.GetStatus(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "gamification status retrieved successfully", status)
}

// ClaimDailyChest handles POST /api/v1/gamification/chests/claim
func (h *GamificationHandler) ClaimDailyChest(c *gin.Context) {
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

	status, gemsAwarded, xpAwarded, err := h.usecase.ClaimDailyChest(c.Request.Context(), userID, req.Tier)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "daily chest claimed successfully", gin.H{
		"status":       status,
		"gems_awarded": gemsAwarded,
		"xp_awarded":   xpAwarded,
	})
}

// BuyShopItem handles POST /api/v1/gamification/shop/buy
func (h *GamificationHandler) BuyShopItem(c *gin.Context) {
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

	status, err := h.usecase.BuyShopItem(c.Request.Context(), userID, req.ItemID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "item purchased successfully", status)
}

// ClaimMonthlyBadge handles POST /api/v1/gamification/badges/claim-monthly
func (h *GamificationHandler) ClaimMonthlyBadge(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
		return
	}

	status, err := h.usecase.ClaimMonthlyBadge(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "monthly badge claimed successfully", status)
}

// SubmitCoaching handles POST /api/v1/gamification/coaching/submit
func (h *GamificationHandler) SubmitCoaching(c *gin.Context) {
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

	sub, status, err := h.usecase.SubmitCoaching(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "coaching submission received successfully", gin.H{
		"submission": sub,
		"status":     status,
	})
}

// RegisterRoutes registers the gamification routes under the provided router group
func (h *GamificationHandler) RegisterRoutes(r *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	g := r.Group("/gamification")
	g.Use(authMiddleware)
	{
		g.GET("/status", h.GetStatus)
		g.POST("/chests/claim", h.ClaimDailyChest)
		g.POST("/shop/buy", h.BuyShopItem)
		g.POST("/badges/claim-monthly", h.ClaimMonthlyBadge)
		g.POST("/coaching/submit", h.SubmitCoaching)
	}
}
