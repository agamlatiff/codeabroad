package gamification_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/app/user"
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
	gamificationRepo.DailyQuestsDone["usr-123"] = 3
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
	r, repo := setupGamificationTestRouter()
	repo.Inventory["usr-123"] = []gamification.UserInventoryItem{
		{UserID: "usr-123", ItemID: "mock-interview", Quantity: 1},
	}

	body, _ := json.Marshal(gamification.CoachingSubmissionRequest{
		Type:              "mock-interview",
		DiscordHandle:     "mera#1234",
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

func TestHTTP_ListBadges_And_SubmitCoachingWithoutCoupon(t *testing.T) {
	r, _ := setupGamificationTestRouter()

	badgesReq, _ := http.NewRequest(http.MethodGet, "/api/v1/gamification/badges", nil)
	badgesW := httptest.NewRecorder()
	r.ServeHTTP(badgesW, badgesReq)
	if badgesW.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for GET /badges, got %d: %s", badgesW.Code, badgesW.Body.String())
	}

	body, _ := json.Marshal(gamification.CoachingSubmissionRequest{
		Type:       "cv-review",
		TargetRole: "Persiapan Kerja Jepang",
		ResumeURL:  "https://drive.google.com/file/d/abc",
	})
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/gamification/coaching", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request when user lacks cv-review coupon, got %d: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_GetAndClaimDailyQuests(t *testing.T) {
	r, repo := setupGamificationTestRouter()
	repo.DailyQuests["usr-123"] = []gamification.DailyQuestItem{
		{
			ID:              "dq-1",
			Code:            "dq_lesson_1",
			SlotCategory:    "curriculum",
			Title:           "Tuntaskan 1 Pelajaran Bahasa",
			ChipLabel:       "PELAJARAN",
			MetricType:      "lessons_completed",
			CurrentValue:    1,
			TargetValue:     1,
			ProgressPercent: 100,
			ProgressText:    "1/1",
			XPReward:        50,
			Route:           "/curriculum",
			IconName:        "book-open",
			IsCompleted:     true,
			IsClaimed:       false,
		},
		{
			ID:              "dq-2",
			Code:            "dq_fc_review_3",
			SlotCategory:    "flashcard",
			Title:           "Ulas 3 Kartu Flashcard",
			ChipLabel:       "KOSAKATA",
			MetricType:      "flashcards_reviewed",
			CurrentValue:    1,
			TargetValue:     3,
			ProgressPercent: 33,
			ProgressText:    "1/3 Kartu",
			XPReward:        30,
			Route:           "/flashcards",
			IconName:        "cards",
			IsCompleted:     false,
			IsClaimed:       false,
		},
	}

	reqList, _ := http.NewRequest(http.MethodGet, "/api/v1/gamification/daily-quests", nil)
	wList := httptest.NewRecorder()
	r.ServeHTTP(wList, reqList)
	if wList.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for GET /daily-quests, got %d: %s", wList.Code, wList.Body.String())
	}

	// Claim incomplete quest -> 400
	reqIncomplete, _ := http.NewRequest(http.MethodPost, "/api/v1/gamification/daily-quests/dq-2/claim", nil)
	wIncomplete := httptest.NewRecorder()
	r.ServeHTTP(wIncomplete, reqIncomplete)
	if wIncomplete.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for incomplete daily quest, got %d: %s", wIncomplete.Code, wIncomplete.Body.String())
	}

	// Claim completed quest -> 200
	reqClaim, _ := http.NewRequest(http.MethodPost, "/api/v1/gamification/daily-quests/dq-1/claim", nil)
	wClaim := httptest.NewRecorder()
	r.ServeHTTP(wClaim, reqClaim)
	if wClaim.Code != http.StatusOK {
		t.Fatalf("expected 200 for claiming completed daily quest, got %d: %s", wClaim.Code, wClaim.Body.String())
	}

	// Duplicate claim -> 409 Conflict
	reqDup, _ := http.NewRequest(http.MethodPost, "/api/v1/gamification/daily-quests/dq-1/claim", nil)
	wDup := httptest.NewRecorder()
	r.ServeHTTP(wDup, reqDup)
	if wDup.Code != http.StatusConflict {
		t.Fatalf("expected 409 Conflict on duplicate daily quest claim, got %d: %s", wDup.Code, wDup.Body.String())
	}
}
