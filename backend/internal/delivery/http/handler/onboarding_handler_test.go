package handler_test

import (
	"bytes"
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

type mockOnboardingUsecase struct {
	countries     []domain.Country
	careerPaths   []domain.CareerPath
	profileResp   *domain.OnboardingProfileResponse
	getCountriesErr  error
	getPathsErr      error
	completeErr      error
}

func (m *mockOnboardingUsecase) GetCountries(ctx context.Context) ([]domain.Country, error) {
	if m.getCountriesErr != nil {
		return nil, m.getCountriesErr
	}
	return m.countries, nil
}

func (m *mockOnboardingUsecase) GetCareerPaths(ctx context.Context) ([]domain.CareerPath, error) {
	if m.getPathsErr != nil {
		return nil, m.getPathsErr
	}
	return m.careerPaths, nil
}

func (m *mockOnboardingUsecase) CompleteOnboarding(ctx context.Context, userID string, req *domain.OnboardingRequest) (*domain.OnboardingProfileResponse, error) {
	if m.completeErr != nil {
		return nil, m.completeErr
	}
	return m.profileResp, nil
}

func setupOnboardingTestRouter(mockUc *mockOnboardingUsecase, secret string) *gin.Engine {
	gin.SetMode(gin.TestMode)

	onboardingHandler := handler.NewOnboardingHandler(mockUc)
	authMiddleware := middleware.AuthMiddleware(secret)

	return deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		OnboardingHandler: onboardingHandler,
		AuthMiddleware:    authMiddleware,
	})
}

func generateTestToken(secret, userID, email, username string) string {
	claims := &usecase.JWTClaims{
		UserID:   userID,
		Email:    email,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString([]byte(secret))
	return tokenString
}

func TestHTTP_GetCountries(t *testing.T) {
	secret := "test-secret-at-least-32-chars-long-key-12345"
	mockUc := &mockOnboardingUsecase{
		countries: []domain.Country{
			{
				ID:        "c-jp",
				Code:      "JP",
				Name:      "Japan",
				FlagEmoji: "🇯🇵",
				IsActive:  true,
			},
		},
	}
	router := setupOnboardingTestRouter(mockUc, secret)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/countries", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d. Body: %s", w.Code, w.Body.String())
	}

	var resp struct {
		Success bool             `json:"success"`
		Data    []domain.Country `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if !resp.Success {
		t.Error("expected success = true")
	}
	if len(resp.Data) != 1 || resp.Data[0].Code != "JP" {
		t.Errorf("unexpected country data: %+v", resp.Data)
	}
}

func TestHTTP_GetCareerPaths(t *testing.T) {
	secret := "test-secret-at-least-32-chars-long-key-12345"
	mockUc := &mockOnboardingUsecase{
		careerPaths: []domain.CareerPath{
			{
				ID:    "cp-backend",
				Slug:  "backend",
				Label: "Backend Engineer",
				Stacks: []domain.TechStack{
					{Slug: "golang", Label: "Go", IsActive: true},
				},
			},
		},
	}
	router := setupOnboardingTestRouter(mockUc, secret)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/career-paths", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d. Body: %s", w.Code, w.Body.String())
	}

	var resp struct {
		Success bool                `json:"success"`
		Data    []domain.CareerPath `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if !resp.Success {
		t.Error("expected success = true")
	}
	if len(resp.Data) != 1 || resp.Data[0].Slug != "backend" {
		t.Errorf("unexpected career path data: %+v", resp.Data)
	}
}

func TestHTTP_CompleteOnboarding(t *testing.T) {
	secret := "test-secret-at-least-32-chars-long-key-12345"
	validToken := generateTestToken(secret, "user-123", "user@example.com", "usertest")
	primaryStack := "golang"

	validResp := &domain.OnboardingProfileResponse{
		ID:           "user-123",
		Name:         "User Test",
		Username:     "usertest",
		Email:        "user@example.com",
		Level:        "beginner",
		XP:           50,
		CurrentLevel: 1,
		Streak:       1,
		IsOnboarded:  true,
		PrimaryStack: &primaryStack,
		Country: &domain.CountrySummary{
			ID:        "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
			Code:      "JP",
			Name:      "Japan",
			FlagEmoji: "🇯🇵",
		},
		CareerPath: &domain.CareerPathSummary{
			ID:    "8a1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6c",
			Slug:  "backend",
			Label: "Backend Engineer",
		},
		CreatedAt: time.Now(),
	}

	t.Run("fails when unauthorized / missing token", func(t *testing.T) {
		mockUc := &mockOnboardingUsecase{}
		router := setupOnboardingTestRouter(mockUc, secret)

		payload := `{"country_id":"9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d","career_path_id":"8a1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6c","primary_stack":"golang","level":"beginner","target_timeline":"1_year","language_level":"basic"}`
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/onboarding", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Errorf("expected 401 Unauthorized, got %d", w.Code)
		}
	})

	t.Run("fails when request validation fails", func(t *testing.T) {
		mockUc := &mockOnboardingUsecase{}
		router := setupOnboardingTestRouter(mockUc, secret)

		// Invalid level (not beginner or intermediate) and invalid UUID
		payload := `{"country_id":"invalid-uuid","career_path_id":"bad","primary_stack":"golang","level":"senior"}`
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/onboarding", bytes.NewBufferString(payload))
		req.Header.Set("Authorization", "Bearer "+validToken)
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected 400 Bad Request, got %d", w.Code)
		}
	})

	t.Run("fails when country or stack is not active", func(t *testing.T) {
		mockUc := &mockOnboardingUsecase{
			completeErr: domain.ErrCountryNotActive,
		}
		router := setupOnboardingTestRouter(mockUc, secret)

		payload := `{"country_id":"9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d","career_path_id":"8a1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6c","primary_stack":"golang","level":"beginner","target_timeline":"1_year","language_level":"basic"}`
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/onboarding", bytes.NewBufferString(payload))
		req.Header.Set("Authorization", "Bearer "+validToken)
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected 400 Bad Request for inactive country, got %d", w.Code)
		}
	})

	t.Run("fails when user already onboarded", func(t *testing.T) {
		mockUc := &mockOnboardingUsecase{
			completeErr: domain.ErrAlreadyOnboarded,
		}
		router := setupOnboardingTestRouter(mockUc, secret)

		payload := `{"country_id":"9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d","career_path_id":"8a1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6c","primary_stack":"golang","level":"beginner","target_timeline":"1_year","language_level":"basic"}`
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/onboarding", bytes.NewBufferString(payload))
		req.Header.Set("Authorization", "Bearer "+validToken)
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusConflict {
			t.Errorf("expected 409 Conflict, got %d", w.Code)
		}
	})

	t.Run("happy path - completes onboarding successfully", func(t *testing.T) {
		mockUc := &mockOnboardingUsecase{
			profileResp: validResp,
		}
		router := setupOnboardingTestRouter(mockUc, secret)

		payload := `{"country_id":"9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d","career_path_id":"8a1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6c","primary_stack":"golang","level":"beginner","target_timeline":"1_year","language_level":"basic"}`
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/onboarding", bytes.NewBufferString(payload))
		req.Header.Set("Authorization", "Bearer "+validToken)
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected 200 OK, got %d. Body: %s", w.Code, w.Body.String())
		}

		var resp struct {
			Success bool                              `json:"success"`
			Message string                            `json:"message"`
			Data    domain.OnboardingProfileResponse `json:"data"`
		}
		if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
			t.Fatalf("failed to decode response: %v", err)
		}

		if !resp.Success {
			t.Error("expected success = true")
		}
		if !resp.Data.IsOnboarded {
			t.Error("expected IsOnboarded = true")
		}
		if resp.Data.XP != 50 {
			t.Errorf("expected XP = 50, got %d", resp.Data.XP)
		}
		if resp.Data.Country == nil || resp.Data.Country.Code != "JP" {
			t.Errorf("expected Country JP, got %+v", resp.Data.Country)
		}
	})
}
