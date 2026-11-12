package gamification_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	deliveryHttp "codeabroad/backend/internal/delivery/http"
	gamificationHandlerPkg "codeabroad/backend/internal/delivery/http/handler/gamification"
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/mock"
	gamificationUsecasePkg "codeabroad/backend/internal/usecase/gamification"
	"github.com/gin-gonic/gin"
)

func setupGamificationTestRouter() (*gin.Engine, *mock.GamificationRepository) {
	gin.SetMode(gin.TestMode)

	gamificationRepo := mock.NewGamificationRepository()
	itemID := "item-freeze"
	gamificationRepo.ShopItems[itemID] = &domain.ShopItem{
		ID:          itemID,
		Name:        "Streak Freeze",
		PriceGems:   200,
		IsAvailable: true,
	}

	uc := gamificationUsecasePkg.New(gamificationRepo)
	h := gamificationHandlerPkg.New(uc)

	mockAuth := func(c *gin.Context) {
		c.Set("userID", "usr-123")
		c.Next()
	}

	r := deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		GamificationHandler: h,
		AuthMiddleware:      mockAuth,
	})

	return r, gamificationRepo
}

func TestHTTP_GetStatus(t *testing.T) {
	r, _ := setupGamificationTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/gamification/status", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_ListShopItems(t *testing.T) {
	r, _ := setupGamificationTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/gamification/shop", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_ClaimDailyChest(t *testing.T) {
	r, _ := setupGamificationTestRouter()

	body, _ := json.Marshal(domain.ClaimChestRequest{
		Tier: 1,
	})

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/gamification/chests/claim", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

