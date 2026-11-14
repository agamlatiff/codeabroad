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

func TestHTTP_GetCurriculum(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum?language_id=11111111-1111-1111-1111-111111111111", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d", w.Code)
	}
}

func TestHTTP_GetCurriculum_InvalidLanguageID_Returns400(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum?language_id=not-a-valid-uuid", nil)
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

func TestHTTP_CompleteLesson_EmptyAndNilBody(t *testing.T) {
	lessonID := "33333333-3333-3333-3333-333333333333"

	t.Run("empty EOF body succeeds", func(t *testing.T) {
		r, _, _ := setupCurriculumTestRouter()
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/lessons/"+lessonID+"/complete", bytes.NewBuffer(nil))
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected 200 OK for empty body, got %d, body: %s", w.Code, w.Body.String())
		}
	})

	t.Run("empty EOF body with JSON content type succeeds", func(t *testing.T) {
		r, _, _ := setupCurriculumTestRouter()
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/lessons/"+lessonID+"/complete", bytes.NewBuffer(nil))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected 200 OK for empty JSON body, got %d, body: %s", w.Code, w.Body.String())
		}
	})

	t.Run("nil request body succeeds", func(t *testing.T) {
		r, _, _ := setupCurriculumTestRouter()
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/lessons/"+lessonID+"/complete", nil)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected 200 OK for nil body, got %d, body: %s", w.Code, w.Body.String())
		}
	})
}

func TestHTTP_CompleteLesson_InvalidNonScoreBody_SanitizedMessage(t *testing.T) {
	lessonID := "33333333-3333-3333-3333-333333333333"

	t.Run("invalid lesson_id in body does not emit score error", func(t *testing.T) {
		r, _, _ := setupCurriculumTestRouter()
		body := []byte(`{"lesson_id": "not-a-uuid", "score": 90}`)
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/lessons/"+lessonID+"/complete", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		if w.Code != http.StatusBadRequest {
			t.Fatalf("expected 400 Bad Request, got %d, body: %s", w.Code, w.Body.String())
		}
		var errResp struct {
			Success bool   `json:"success"`
			Error   string `json:"error"`
			Code    string `json:"code"`
		}
		if err := json.Unmarshal(w.Body.Bytes(), &errResp); err != nil {
			t.Fatalf("failed to decode response body: %v", err)
		}
		if errResp.Code != "BAD_REQUEST" {
			t.Errorf("expected BAD_REQUEST code, got %q", errResp.Code)
		}
		if bytes.Contains(bytes.ToLower(w.Body.Bytes()), []byte("score")) {
			t.Errorf("expected non-score validation error not to mention score, got %s", w.Body.String())
		}
	})

	t.Run("malformed JSON does not emit score error", func(t *testing.T) {
		r, _, _ := setupCurriculumTestRouter()
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/lessons/"+lessonID+"/complete", bytes.NewBufferString("{bad-json"))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		if w.Code != http.StatusBadRequest {
			t.Fatalf("expected 400 Bad Request, got %d, body: %s", w.Code, w.Body.String())
		}
		if bytes.Contains(bytes.ToLower(w.Body.Bytes()), []byte("score")) {
			t.Errorf("expected malformed JSON error not to mention score, got %s", w.Body.String())
		}
	})
}

func TestHTTP_CompleteLesson_Locked_Returns403(t *testing.T) {
	r, cRepo, _ := setupCurriculumTestRouter()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{
		ID:         "unit-1",
		LevelID:    "22222222-2222-2222-2222-222222222222",
		UnitType:   "curriculum",
		OrderIndex: 1,
	}
	lesson2ID := "44444444-4444-4444-4444-444444444444"
	cRepo.Lessons[lesson2ID] = &curriculum.LessonNodeResponse{
		ID:         lesson2ID,
		UnitID:     "unit-1",
		Title:      "Katakana Basics",
		OrderIndex: 2,
	}
	cRepo.AttemptSummaries["usr-123:"+lesson2ID] = &curriculum.LessonAttemptSummary{
		TotalExercises:          2,
		AttemptedExercises:      2,
		CorrectExercises:        2,
		FreshAttemptedExercises: 2,
		FreshCorrectExercises:   2,
	}

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/lessons/"+lesson2ID+"/complete", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusForbidden {
		t.Fatalf("expected 403 Forbidden for locked lesson, got %d, body: %s", w.Code, w.Body.String())
	}
	var errResp struct {
		Code string `json:"code"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &errResp); err != nil {
		t.Fatalf("failed to decode response body: %v", err)
	}
	if errResp.Code != "LESSON_LOCKED" {
		t.Errorf("expected code LESSON_LOCKED, got %q", errResp.Code)
	}
}

func TestHTTP_CompleteLesson_NotFound_Returns404(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()
	unknownID := "99999999-9999-9999-9999-999999999999"

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/lessons/"+unknownID+"/complete", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Fatalf("expected 404 Not Found for unknown lesson, got %d, body: %s", w.Code, w.Body.String())
	}
	var errResp struct {
		Code string `json:"code"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &errResp); err != nil {
		t.Fatalf("failed to decode response body: %v", err)
	}
	if errResp.Code != "LESSON_NOT_FOUND" {
		t.Errorf("expected code LESSON_NOT_FOUND, got %q", errResp.Code)
	}
}

func TestHTTP_CompleteLesson_Unauthorized_Returns401(t *testing.T) {
	gin.SetMode(gin.TestMode)
	uc := curriculum.NewUsecase(
		curriculum.NewMockRepository(),
		language.NewMockRepository(),
		exercise.NewMockRepository(),
		user.NewMockRepository(),
		gamification.NewMockRepository(),
	)
	h := curriculum.NewHandler(uc)
	r := gin.New()
	v1 := r.Group("/api/v1")
	h.RegisterRoutes(v1, nil)

	lessonID := "33333333-3333-3333-3333-333333333333"
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/lessons/"+lessonID+"/complete", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 Unauthorized when userID is missing, got %d, body: %s", w.Code, w.Body.String())
	}
	var errResp struct {
		Code string `json:"code"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &errResp); err != nil {
		t.Fatalf("failed to decode response body: %v", err)
	}
	if errResp.Code != "UNAUTHORIZED" {
		t.Errorf("expected code UNAUTHORIZED, got %q", errResp.Code)
	}
}
