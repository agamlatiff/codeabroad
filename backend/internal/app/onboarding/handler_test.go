package onboarding_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"codeabroad/backend/internal/app/curriculum"
	"codeabroad/backend/internal/app/exercise"
	"codeabroad/backend/internal/app/gamification"
	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/app/onboarding"
	"codeabroad/backend/internal/app/user"
	"github.com/gin-gonic/gin"
)

func setupOnboardingTestRouter() (*gin.Engine, *user.MockRepository, *language.MockRepository) {
	gin.SetMode(gin.TestMode)

	userRepo := user.NewMockRepository()
	langRepo := language.NewMockRepository()
	curriculumRepo := curriculum.NewMockRepository()
	exerciseRepo := exercise.NewMockRepository()
	gamificationRepo := gamification.NewMockRepository()

	langID := "11111111-1111-1111-1111-111111111111"
	langRepo.Languages[langID] = &language.Language{
		ID:       langID,
		Code:     "ja",
		Name:     "Japanese",
		IsActive: true,
	}

	uc := onboarding.NewUsecase(userRepo, langRepo, curriculumRepo, exerciseRepo, gamificationRepo)
	h := onboarding.NewHandler(uc)

	mockAuthMiddleware := func(c *gin.Context) {
		c.Set("userID", "usr-123")
		c.Next()
	}

	r := gin.New()
	v1 := r.Group("/api/v1")
	h.RegisterRoutes(v1, mockAuthMiddleware)

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

func TestHTTP_GetPlacementQuestions_InvalidUUID(t *testing.T) {
	r, _, _ := setupOnboardingTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/onboarding/placement-questions/not-a-uuid", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request for invalid UUID, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_CompleteOnboarding_ZeroBeginner(t *testing.T) {
	r, userRepo, langRepo := setupOnboardingTestRouter()
	langID := "11111111-1111-1111-1111-111111111111"

	_ = userRepo.Create(context.Background(), &user.User{
		UserAccount: user.UserAccount{ID: "usr-123", Email: "test@example.com"},
		UserProfile: user.UserProfile{Username: "tester"},
	})
	langRepo.Levels["lvl-n5"] = &language.ProficiencyLevel{
		ID:         "lvl-n5",
		LanguageID: langID,
		OrderIndex: 1,
		Code:       "N5",
	}

	payload := onboarding.OnboardingRequest{
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

func TestHTTP_CompleteOnboarding_RateLimited(t *testing.T) {
	userRepo := user.NewMockRepository()
	langRepo := language.NewMockRepository()
	uc := onboarding.NewUsecase(userRepo, langRepo, curriculum.NewMockRepository(), exercise.NewMockRepository(), gamification.NewMockRepository())
	h := onboarding.NewHandlerWithRateLimiter(uc, func(c *gin.Context) {
		c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{"success": false, "message": "rate limited"})
	})

	gin.SetMode(gin.TestMode)
	r := gin.New()
	v1 := r.Group("/api/v1")
	h.RegisterRoutes(v1, func(c *gin.Context) {
		c.Set("userID", "usr-123")
		c.Next()
	})

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/onboarding", bytes.NewBufferString(`{}`))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 429 Too Many Requests, got: %d", w.Code)
	}
}
