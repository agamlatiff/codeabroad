package gamification_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"codeabroad/backend/internal/app/gamification"
	"github.com/gin-gonic/gin"
)

func setupGamificationTestRouter() (*gin.Engine, *gamification.MockRepository) {
	gin.SetMode(gin.TestMode)

	gamificationRepo := gamification.NewMockRepository()
	itemID := "item-freeze"
	gamificationRepo.ShopItems[itemID] = &gamification.ShopItem{
		ID:          itemID,
		Name:        "Streak Freeze",
		PriceGems:   200,
		IsAvailable: true,
	}

	uc := gamification.NewUsecase(gamificationRepo)
	h := gamification.NewHandler(uc)

	mockAuth := func(c *gin.Context) {
		c.Set("userID", "usr-123")
		c.Next()
	}

	r := gin.New()
	v1 := r.Group("/api/v1")
	h.RegisterRoutes(v1, mockAuth)

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

	body, _ := json.Marshal(gamification.ClaimChestRequest{
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

