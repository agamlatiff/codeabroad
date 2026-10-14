package handler_test

import (
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

type mockVocabularyUsecase struct {
	dailyVocabs []domain.Vocabulary
	listVocabs  []domain.Vocabulary
	total       int
	err         error
}

func (m *mockVocabularyUsecase) GetDailyVocabularies(ctx context.Context) ([]domain.Vocabulary, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.dailyVocabs, nil
}

func (m *mockVocabularyUsecase) ListVocabularies(ctx context.Context, category string, page, limit int) ([]domain.Vocabulary, int, error) {
	if m.err != nil {
		return nil, 0, m.err
	}
	return m.listVocabs, m.total, nil
}

func setupVocabularyTestRouter(mockUc *mockVocabularyUsecase) *gin.Engine {
	gin.SetMode(gin.TestMode)
	vocabHandler := handler.NewVocabularyHandler(mockUc)

	return deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		VocabularyHandler: vocabHandler,
	})
}

func TestVocabularyHandler_GetDailyVocabularies(t *testing.T) {
	mockUc := &mockVocabularyUsecase{
		dailyVocabs: []domain.Vocabulary{
			{ID: "v1", Term: "挨拶", Reading: "あいさつ • Aisatsu", Meaning: "Sapaan Pagi & Etika Kantor"},
			{ID: "v2", Term: "実装", Reading: "じっそう • Jissou", Meaning: "Implementasi Fitur"},
		},
	}
	router := setupVocabularyTestRouter(mockUc)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/vocabularies/daily", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}

	var res map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if res["success"] != true {
		t.Fatalf("expected success: true, got %v", res["success"])
	}

	data, ok := res["data"].([]interface{})
	if !ok || len(data) != 2 {
		t.Fatalf("expected 2 vocabularies in data, got %v", res["data"])
	}
}

func TestVocabularyHandler_ListVocabularies(t *testing.T) {
	mockUc := &mockVocabularyUsecase{
		listVocabs: []domain.Vocabulary{
			{ID: "v1", Term: "挨拶", Category: "Etika Kantor"},
		},
		total: 1,
	}
	router := setupVocabularyTestRouter(mockUc)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/vocabularies?category=Etika%20Kantor&page=1&limit=10", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}

	var res map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if res["success"] != true {
		t.Fatalf("expected success: true, got %v", res["success"])
	}

	dataMap, ok := res["data"].(map[string]interface{})
	if !ok {
		t.Fatalf("expected data to be map, got %v", res["data"])
	}
	if dataMap["total"] != float64(1) {
		t.Errorf("expected total 1, got %v", dataMap["total"])
	}
}
