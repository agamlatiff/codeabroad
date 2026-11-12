package onboarding_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	deliveryHttp "codeabroad/backend/internal/delivery/http"
	onboardingHandlerPkg "codeabroad/backend/internal/delivery/http/handler/onboarding"
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/mock"
	onboardingUsecasePkg "codeabroad/backend/internal/usecase/onboarding"
	"github.com/gin-gonic/gin"
)

func setupOnboardingTestRouter() (*gin.Engine, *mock.UserRepository, *mock.LanguageRepository) {
	gin.SetMode(gin.TestMode)

	userRepo := mock.NewUserRepository()
	langRepo := mock.NewLanguageRepository()
	curriculumRepo := mock.NewCurriculumRepository()
	exerciseRepo := mock.NewExerciseRepository()
	gamificationRepo := mock.NewGamificationRepository()

	// Seed language
	_ = langRepo.Languages
	langID := "11111111-1111-1111-1111-111111111111"
	langRepo.Languages[langID] = &domain.Language{
		ID:       langID,
		Code:     "ja",
		Name:     "Japanese",
		IsActive: true,
	}

	uc := onboardingUsecasePkg.New(userRepo, langRepo, curriculumRepo, exerciseRepo, gamificationRepo)
	h := onboardingHandlerPkg.New(uc)

	mockAuthMiddleware := func(c *gin.Context) {
		c.Set("userID", "usr-123")
		c.Next()
	}

	r := deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		OnboardingHandler: h,
		AuthMiddleware:    mockAuthMiddleware,
	})

	return r, userRepo, langRepo
}

func TestHTTP_GetLanguages(t *testing.T) {
	r, _, _ := setupOnboardingTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/onboarding/languages", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_GetPlacementQuestions(t *testing.T) {
	r, _, _ := setupOnboardingTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/onboarding/placement-questions/11111111-1111-1111-1111-111111111111", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_CompleteOnboarding_ZeroBeginner(t *testing.T) {
	r, userRepo, langRepo := setupOnboardingTestRouter()
	langID := "11111111-1111-1111-1111-111111111111"

	// Create user
	_ = userRepo.Create(context.Background(), &domain.User{
		UserAccount: domain.UserAccount{ID: "usr-123", Email: "test@example.com"},
		UserProfile: domain.UserProfile{Username: "tester"},
	})
	// Add Level
	langRepo.Levels["lvl-n5"] = &domain.ProficiencyLevel{
		ID:         "lvl-n5",
		LanguageID: langID,
		OrderIndex: 1,
		Code:       "N5",
	}

	payload := domain.OnboardingRequest{
		LanguageID:           langID,
		DailyGoalMinutes:     15,
		InitialPlacementType: "zero_beginner",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/onboarding", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}
