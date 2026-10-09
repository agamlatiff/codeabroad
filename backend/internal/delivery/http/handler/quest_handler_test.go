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
	"codeabroad/backend/internal/delivery/http/middleware"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

type mockQuestUsecase struct {
	quest       *domain.Quest
	quests      []domain.Quest
	runResult   *domain.RunTestsResponse
	submitResp  *domain.SubmitQuestResponse
	err         error
}

func (m *mockQuestUsecase) GetQuestDetails(ctx context.Context, questID string, userID string) (*domain.Quest, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.quest, nil
}

func (m *mockQuestUsecase) GetDailyQuests(ctx context.Context, userID string) ([]domain.Quest, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.quests, nil
}

func (m *mockQuestUsecase) ListQuests(ctx context.Context, filter domain.QuestFilter, userID string) ([]domain.Quest, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.quests, nil
}

func (m *mockQuestUsecase) RunUnitTests(ctx context.Context, questID string, req *domain.RunTestsRequest) (*domain.RunTestsResponse, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.runResult, nil
}

func (m *mockQuestUsecase) SubmitQuest(ctx context.Context, questID string, userID string, req *domain.SubmitQuestRequest) (*domain.SubmitQuestResponse, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.submitResp, nil
}

func setupQuestTestRouter(mockUc *mockQuestUsecase, secret string) *gin.Engine {
	gin.SetMode(gin.TestMode)
	questHandler := handler.NewQuestHandler(mockUc)
	authMiddleware := middleware.AuthMiddleware(secret)

	return deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		QuestHandler:   questHandler,
		AuthMiddleware: authMiddleware,
	})
}

func TestQuestHandler_GetQuestDetails(t *testing.T) {
	secret := "test-secret"
	mockUc := &mockQuestUsecase{
		quest: &domain.Quest{
			ID:    "quest-1",
			Title: "Bab 2: Gin JWT Auth Middleware",
		},
	}
	router := setupQuestTestRouter(mockUc, secret)
	token := generateRoadmapTestToken(secret, "user-123")

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/quests/quest-1", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}
}

func TestQuestHandler_RunTests(t *testing.T) {
	secret := "test-secret"
	mockUc := &mockQuestUsecase{
		runResult: &domain.RunTestsResponse{
			Success:     true,
			TestsPassed: 3,
			TotalTests:  3,
			Output:      "PASS 3/3",
		},
	}
	router := setupQuestTestRouter(mockUc, secret)
	token := generateRoadmapTestToken(secret, "user-123")

	body, _ := json.Marshal(domain.RunTestsRequest{Code: "package main"})
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/quests/quest-1/run-tests", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var resp struct {
		Success bool                    `json:"success"`
		Data    domain.RunTestsResponse `json:"data"`
	}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)

	if !resp.Data.Success {
		t.Errorf("expected test success true, got false")
	}
}

func TestQuestHandler_SubmitQuest(t *testing.T) {
	secret := "test-secret"
	mockUc := &mockQuestUsecase{
		submitResp: &domain.SubmitQuestResponse{
			QuestID:   "quest-1",
			XPAwarded: 50,
			CurrentXP: 200,
		},
	}
	router := setupQuestTestRouter(mockUc, secret)
	token := generateRoadmapTestToken(secret, "user-123")

	body, _ := json.Marshal(domain.SubmitQuestRequest{Code: "package main"})
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/quests/quest-1/submit", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var resp struct {
		Success bool                       `json:"success"`
		Data    domain.SubmitQuestResponse `json:"data"`
	}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)

	if resp.Data.XPAwarded != 50 {
		t.Errorf("expected 50 XP awarded, got %d", resp.Data.XPAwarded)
	}
}
