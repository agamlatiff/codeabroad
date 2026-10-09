package handler_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	deliveryHttp "codeabroad/backend/internal/delivery/http"
	"codeabroad/backend/internal/delivery/http/handler"
	"codeabroad/backend/internal/delivery/http/middleware"
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/usecase"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type mockRoadmapUsecase struct {
	roadmap *domain.Roadmap
	err     error
}

func (m *mockRoadmapUsecase) GetTrackRoadmap(ctx context.Context, slug string, userID string) (*domain.Roadmap, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.roadmap, nil
}

func (m *mockRoadmapUsecase) GetActiveUserRoadmap(ctx context.Context, userID string) (*domain.Roadmap, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.roadmap, nil
}

func generateRoadmapTestToken(secret, userID string) string {
	claims := &usecase.JWTClaims{
		UserID:   userID,
		Email:    "test@example.com",
		Username: "testuser",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, _ := token.SignedString([]byte(secret))
	return signed
}

func setupRoadmapTestRouter(mockUc *mockRoadmapUsecase, secret string) *gin.Engine {
	gin.SetMode(gin.TestMode)
	roadmapHandler := handler.NewRoadmapHandler(mockUc)
	authMiddleware := middleware.AuthMiddleware(secret)

	return deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		RoadmapHandler: roadmapHandler,
		AuthMiddleware: authMiddleware,
	})
}

func TestRoadmapHandler_GetTrackRoadmap(t *testing.T) {
	secret := "test-secret"
	mockUc := &mockRoadmapUsecase{
		roadmap: &domain.Roadmap{
			ID:    "rm-1",
			Title: "Golang Backend Specialist",
		},
	}
	router := setupRoadmapTestRouter(mockUc, secret)
	token := generateRoadmapTestToken(secret, "user-123")

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/roadmaps/backend", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var resp struct {
		Success bool           `json:"success"`
		Data    domain.Roadmap `json:"data"`
	}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)

	if !resp.Success {
		t.Errorf("expected success true, got false")
	}
	if resp.Data.Title != "Golang Backend Specialist" {
		t.Errorf("expected title 'Golang Backend Specialist', got %s", resp.Data.Title)
	}
}

func TestRoadmapHandler_GetActiveRoadmap_Unauthorized(t *testing.T) {
	secret := "test-secret"
	mockUc := &mockRoadmapUsecase{}
	router := setupRoadmapTestRouter(mockUc, secret)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/roadmaps/active", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected status 401 for missing token, got %d", w.Code)
	}
}
