package curriculum_test

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
	"codeabroad/backend/internal/app/user"
	"github.com/gin-gonic/gin"
)

func setupCurriculumTestRouter() (*gin.Engine, *curriculum.MockRepository, *language.MockRepository) {
	gin.SetMode(gin.TestMode)

	curriculumRepo := curriculum.NewMockRepository()
	langRepo := language.NewMockRepository()
	exerciseRepo := exercise.NewMockRepository()
	userRepo := user.NewMockRepository()
	gamificationRepo := gamification.NewMockRepository()

	langID := "11111111-1111-1111-1111-111111111111"
	lvlID := "22222222-2222-2222-2222-222222222222"
	lessonID := "33333333-3333-3333-3333-333333333333"

	lang := &language.Language{ID: langID, Code: "ja", Name: "Japanese"}
	lvl := &language.ProficiencyLevel{ID: lvlID, LanguageID: langID, OrderIndex: 1, Code: "N5"}

	langRepo.Languages[langID] = lang
	langRepo.Levels[lvlID] = lvl
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "usr-123",
		LanguageID:     langID,
		CurrentLevelID: &lvlID,
		IsActive:       true,
		Language:       lang,
		CurrentLevel:   lvl,
	}

	curriculumRepo.Lessons[lessonID] = &curriculum.LessonNodeResponse{
		ID:         lessonID,
		UnitID:     "unit-1",
		Title:      "Hiragana Basics",
		OrderIndex: 1,
	}
	curriculumRepo.AttemptSummaries["usr-123:"+lessonID] = &curriculum.LessonAttemptSummary{
		TotalExercises:          2,
		AttemptedExercises:      2,
		CorrectExercises:        2,
		FreshAttemptedExercises: 2,
		FreshCorrectExercises:   2,
	}

	_ = userRepo.Create(context.Background(), &user.User{
		UserAccount: user.UserAccount{ID: "usr-123", Email: "test@example.com"},
		UserProfile: user.UserProfile{Username: "tester"},
	})

	uc := curriculum.NewUsecase(curriculumRepo, langRepo, exerciseRepo, userRepo, gamificationRepo)
	h := curriculum.NewHandler(uc)

	mockAuth := func(c *gin.Context) {
		c.Set("userID", "usr-123")
		c.Next()
	}

	r := gin.New()
	v1 := r.Group("/api/v1")
	h.RegisterRoutes(v1, mockAuth)

	return r, curriculumRepo, langRepo
}

func TestHTTP_GetRoadmap(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/roadmap?language_id=11111111-1111-1111-1111-111111111111", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d", w.Code)
	}
}

func TestHTTP_GetRoadmap_InvalidLanguageID_Returns400(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/roadmap?language_id=not-a-valid-uuid", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request, got: %d", w.Code)
	}
}

func TestHTTP_GetLessonDetail(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/lessons/33333333-3333-3333-3333-333333333333", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d", w.Code)
	}
}

func TestHTTP_GetLessonDetail_InvalidUUID_Returns400(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/lessons/not-a-valid-uuid", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request, got: %d", w.Code)
	}
}

func TestHTTP_CompleteLesson(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()
	lessonID := "33333333-3333-3333-3333-333333333333"

	body, _ := json.Marshal(curriculum.CompleteLessonRequest{
		LessonID: lessonID,
		Score:    100,
	})

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/lessons/"+lessonID+"/complete", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d", w.Code)
	}
}

func TestHTTP_CompleteLesson_BodyWithoutLessonID(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()
	lessonID := "33333333-3333-3333-3333-333333333333"

	// Omit lesson_id from body; URI parameter must be used as Single Source of Truth
	body := []byte(`{"score": 95}`)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/lessons/"+lessonID+"/complete", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_CompleteLesson_InvalidBody_SanitizedError(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()
	lessonID := "33333333-3333-3333-3333-333333333333"

	body := []byte(`{"score": 150}`)
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/lessons/"+lessonID+"/complete", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request, got: %d", w.Code)
	}
	if bytes.Contains(w.Body.Bytes(), []byte("CompleteLessonRequest")) || bytes.Contains(w.Body.Bytes(), []byte("Field validation")) {
		t.Errorf("expected sanitized validation error without struct field leakage, got: %s", w.Body.String())
	}
}

func TestHTTP_GetGrammarPoints(t *testing.T) {
	r, cRepo, _ := setupCurriculumTestRouter()
	cRepo.GrammarPoints["gp-1"] = &curriculum.GrammarPoint{
		ID:       "gp-1",
		LevelID:  "22222222-2222-2222-2222-222222222222",
		Code:     "GP-01",
		Category: "sentence_pattern",
		Title:    "WA Particle",
	}

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/grammar-points?level_id=22222222-2222-2222-2222-222222222222", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d", w.Code)
	}
}

func TestHTTP_GetGrammarPoints_InvalidLevelID_Returns400(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/grammar-points?level_id=not-a-valid-uuid", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request, got: %d", w.Code)
	}
}
