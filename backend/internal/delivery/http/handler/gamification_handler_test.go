package handler_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	deliveryHttp "codeabroad/backend/internal/delivery/http"
	"codeabroad/backend/internal/delivery/http/handler"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

type mockGamificationUsecase struct {
	status *domain.GamificationStatus
	err    error
}

func (m *mockGamificationUsecase) GetStatus(ctx context.Context, userID string) (*domain.GamificationStatus, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.status, nil
}

func (m *mockGamificationUsecase) ClaimDailyChest(ctx context.Context, userID string, tier int) (*domain.GamificationStatus, int, int, error) {
	if m.err != nil {
		return nil, 0, 0, m.err
	}
	m.status.ClaimedChests = append(m.status.ClaimedChests, tier)
	return m.status, 15, 10, nil
}

func (m *mockGamificationUsecase) BuyShopItem(ctx context.Context, userID string, itemID string) (*domain.GamificationStatus, error) {
	if m.err != nil {
		return nil, m.err
	}
	m.status.Inventory[itemID]++
	return m.status, nil
}

func (m *mockGamificationUsecase) ClaimMonthlyBadge(ctx context.Context, userID string) (*domain.GamificationStatus, error) {
	if m.err != nil {
		return nil, m.err
	}
	m.status.MonthlyBadgeClaimed = true
	return m.status, nil
}

func (m *mockGamificationUsecase) SubmitCoaching(ctx context.Context, userID string, req *domain.CoachingSubmissionRequest) (*domain.CoachingSubmission, *domain.GamificationStatus, error) {
	if m.err != nil {
		return nil, nil, m.err
	}
	sub := &domain.CoachingSubmission{
		ID:     "sub-test",
		UserID: userID,
		Type:   req.Type,
		Status: "in_review",
	}
	return sub, m.status, nil
}

func setupGamificationTestRouter(mockUc domain.GamificationUsecase) *gin.Engine {
	gin.SetMode(gin.TestMode)
	gHandler := handler.NewGamificationHandler(mockUc)

	authMiddleware := func(c *gin.Context) {
		c.Set("userID", "user-uuid-123")
		c.Next()
	}

	return deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		GamificationHandler: gHandler,
		AuthMiddleware:      authMiddleware,
	})
}

func TestGamificationHandler_Endpoints(t *testing.T) {
	mockUc := &mockGamificationUsecase{
		status: &domain.GamificationStatus{
			Gems: 100,
			Inventory: map[string]int{
				"streak-freeze":  1,
				"xp-booster":     0,
				"cv-review":      1,
				"mock-interview": 0,
			},
			ClaimedChests:       []int{},
			MonthlyBadgeClaimed: false,
		},
	}
	router := setupGamificationTestRouter(mockUc)

	// 1. GET /gamification/status
	t.Run("GetStatus", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/api/v1/gamification/status", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
		}
	})

	// 2. POST /gamification/chests/claim
	t.Run("ClaimDailyChest", func(t *testing.T) {
		body, _ := json.Marshal(map[string]int{"tier": 2})
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/gamification/chests/claim", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
		}
	})

	// 3. POST /gamification/shop/buy
	t.Run("BuyShopItem", func(t *testing.T) {
		body, _ := json.Marshal(map[string]string{"item_id": "streak-freeze"})
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/gamification/shop/buy", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
		}
	})

	// 4. POST /gamification/badges/claim-monthly
	t.Run("ClaimMonthlyBadge", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/gamification/badges/claim-monthly", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
		}
	})

	// 5. POST /gamification/coaching/submit
	t.Run("SubmitCoaching", func(t *testing.T) {
		body, _ := json.Marshal(domain.CoachingSubmissionRequest{
			Type:       "cv-review",
			TargetRole: "Golang Dev",
			GitHubURL:  "https://github.com/coder",
			ResumeURL:  "https://cv.pdf",
		})
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/gamification/coaching/submit", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
		}
	})
}
