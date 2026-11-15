package gamification_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"codeabroad/backend/internal/app/gamification"
	"codeabroad/backend/internal/app/user"
	"github.com/gin-gonic/gin"
)

func setupGamificationTestRouter() (*gin.Engine, *gamification.MockRepository) {
	gin.SetMode(gin.TestMode)

	gamificationRepo := gamification.NewMockRepository()
	gamificationRepo.Stats["usr-123"] = &user.UserGamificationStats{
		XP:           100,
		CurrentLevel: 2,
		Streak:       3,
		Gems:         300,
	}
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

func TestHTTP_BuyShopItem(t *testing.T) {
	r, _ := setupGamificationTestRouter()

	body, _ := json.Marshal(gamification.ShopBuyRequest{ItemID: "item-freeze"})
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/gamification/shop/buy", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_ClaimDailyChest_ConflictOnDuplicate(t *testing.T) {
	r, _ := setupGamificationTestRouter()

	body, _ := json.Marshal(gamification.ClaimChestRequest{Tier: 1})

	req1, _ := http.NewRequest(http.MethodPost, "/api/v1/gamification/chests/claim", bytes.NewBuffer(body))
	req1.Header.Set("Content-Type", "application/json")
	w1 := httptest.NewRecorder()
	r.ServeHTTP(w1, req1)
	if w1.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w1.Code, w1.Body.String())
	}

	req2, _ := http.NewRequest(http.MethodPost, "/api/v1/gamification/chests/claim", bytes.NewBuffer(body))
	req2.Header.Set("Content-Type", "application/json")
	w2 := httptest.NewRecorder()
	r.ServeHTTP(w2, req2)
	if w2.Code != http.StatusConflict {
		t.Fatalf("expected 409 Conflict on duplicate claim, got: %d, body: %s", w2.Code, w2.Body.String())
	}
}

func TestHTTP_SubmitCoaching(t *testing.T) {
	r, _ := setupGamificationTestRouter()

	body, _ := json.Marshal(gamification.CoachingSubmissionRequest{
		Type:              "mock-interview",
		DiscordHandle:     "kodi#1234",
		InterviewLanguage: "nihongo",
		FocusTopic:        "Japanese Business Culture",
	})
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/gamification/coaching", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("expected 201 Created, got: %d, body: %s", w.Code, w.Body.String())
	}
}
