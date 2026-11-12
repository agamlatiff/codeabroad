package curriculum_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	deliveryHttp "codeabroad/backend/internal/delivery/http"
	curriculumHandlerPkg "codeabroad/backend/internal/delivery/http/handler/curriculum"
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/mock"
	curriculumUsecasePkg "codeabroad/backend/internal/usecase/curriculum"
	"github.com/gin-gonic/gin"
)

func setupCurriculumTestRouter() (*gin.Engine, *mock.CurriculumRepository, *mock.LanguageRepository) {
	gin.SetMode(gin.TestMode)

	curriculumRepo := mock.NewCurriculumRepository()
	langRepo := mock.NewLanguageRepository()
	exerciseRepo := mock.NewExerciseRepository()
	userRepo := mock.NewUserRepository()
	gamificationRepo := mock.NewGamificationRepository()

	langID := "11111111-1111-1111-1111-111111111111"
	lvlID := "22222222-2222-2222-2222-222222222222"
	lessonID := "33333333-3333-3333-3333-333333333333"

	lang := &domain.Language{ID: langID, Code: "ja", Name: "Japanese"}
	lvl := &domain.ProficiencyLevel{ID: lvlID, LanguageID: langID, OrderIndex: 1, Code: "N5"}

	langRepo.Languages[langID] = lang
	langRepo.Levels[lvlID] = lvl
	langRepo.Enrollments["enr-1"] = &domain.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "usr-123",
		LanguageID:     langID,
		CurrentLevelID: &lvlID,
		IsActive:       true,
		Language:       lang,
		CurrentLevel:   lvl,
	}

	curriculumRepo.Lessons[lessonID] = &domain.Lesson{
		ID:         lessonID,
		UnitID:     "unit-1",
		Title:      "Hiragana Basics",
		OrderIndex: 1,
	}

	_ = userRepo.Create(context.Background(), &domain.User{
		UserAccount: domain.UserAccount{ID: "usr-123", Email: "test@example.com"},
		UserProfile: domain.UserProfile{Username: "tester"},
	})

	uc := curriculumUsecasePkg.New(curriculumRepo, langRepo, exerciseRepo, userRepo, gamificationRepo)
	h := curriculumHandlerPkg.New(uc)

	mockAuth := func(c *gin.Context) {
		c.Set("userID", "usr-123")
		c.Next()
	}

	r := deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		CurriculumHandler: h,
		AuthMiddleware:    mockAuth,
	})

	return r, curriculumRepo, langRepo
}

func TestHTTP_GetRoadmap(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/roadmap?language_id=11111111-1111-1111-1111-111111111111", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_GetLessonDetail(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/lessons/33333333-3333-3333-3333-333333333333", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_CompleteLesson(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()
	lessonID := "33333333-3333-3333-3333-333333333333"

	body, _ := json.Marshal(domain.CompleteLessonRequest{
		LessonID: lessonID,
		Score:    100,
	})

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/lessons/"+lessonID+"/complete", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}
