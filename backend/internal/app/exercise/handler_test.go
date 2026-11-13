package exercise_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"codeabroad/backend/internal/app/exercise"
	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/app/user"
	"github.com/gin-gonic/gin"
)

func setupExerciseTestRouter() (*gin.Engine, *exercise.MockRepository, *exercise.MockSRSRepository, *exercise.MockReadinessExamRepository) {
	gin.SetMode(gin.TestMode)

	exerciseRepo := exercise.NewMockRepository()
	srsRepo := exercise.NewMockSRSRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

	exID := "44444444-4444-4444-4444-444444444444"
	lesID := "33333333-3333-3333-3333-333333333333"
	lvlID := "22222222-2222-2222-2222-222222222222"
	langID := "11111111-1111-1111-1111-111111111111"

	_ = userRepo.Create(context.Background(), &user.User{
		UserAccount: user.UserAccount{ID: "usr-123", Email: "test@example.com"},
		UserProfile: user.UserProfile{Username: "tester"},
	})

	lvl := &language.ProficiencyLevel{ID: lvlID, LanguageID: langID, Code: "N5", OrderIndex: 1}
	langRepo.Levels[lvlID] = lvl
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "usr-123",
		LanguageID:     langID,
		CurrentLevelID: &lvlID,
		IsActive:       true,
		CurrentLevel:   lvl,
	}

	exerciseRepo.Exercises[exID] = &exercise.Exercise{
		ID:            exID,
		LessonID:      &lesID,
		ExerciseType:  exercise.ExerciseTypeFillBlank,
		Prompt:        "Choose the correct greeting",
		Options:       []string{"Konnichiwa", "Sayonara"},
		CorrectAnswer: "Konnichiwa",
	}
	exerciseRepo.ReadinessExamExercises[lvlID] = []exercise.Exercise{
		*exerciseRepo.Exercises[exID],
	}

	uc := exercise.NewUsecase(exerciseRepo, srsRepo, examRepo, langRepo, userRepo)
	h := exercise.NewHandler(uc, uc, uc)

	mockAuth := func(c *gin.Context) {
		c.Set("userID", "usr-123")
		c.Next()
	}

	r := gin.New()
	v1 := r.Group("/api/v1")
	h.RegisterRoutes(v1, mockAuth)

	return r, exerciseRepo, srsRepo, examRepo
}

func TestHTTP_GetExercisesByLesson(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/exercises/lesson/33333333-3333-3333-3333-333333333333", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_SubmitAnswer(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	body, _ := json.Marshal(exercise.SubmitExerciseAnswerRequest{
		ExerciseID:       "44444444-4444-4444-4444-444444444444",
		UserAnswer:       "Konnichiwa",
		TimeSpentSeconds: 5,
	})

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/exercises/submit", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_GetDueReviews(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/srs/due", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_GetExamQuestions(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/exams/questions/22222222-2222-2222-2222-222222222222", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_GetExercisesByLesson_InvalidUUID_Returns400(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/exercises/lesson/not-a-valid-uuid", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request on invalid lesson uuid, got: %d", w.Code)
	}
}

func TestHTTP_GetExamQuestions_InvalidUUID_Returns400(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/exams/questions/not-a-valid-uuid", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request on invalid level uuid, got: %d", w.Code)
	}
}

func TestHTTP_ProcessReview_AllowsZeroQuality(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	q := 0
	body, _ := json.Marshal(exercise.SubmitSRSReviewRequest{
		ExerciseID: "44444444-4444-4444-4444-444444444444",
		Quality:    &q,
	})

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/srs/review", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK when submitting SM-2 quality 0, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_ProcessReview_MissingQualityReturns400(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	body := []byte(`{"exercise_id":"44444444-4444-4444-4444-444444444444"}`)
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/srs/review", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request when quality is missing, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_GetDueReviews_InvalidLimitReturns400(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/srs/due?limit=abc", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request on invalid limit, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_GetDailyVocabularies_Success(t *testing.T) {
	r, exRepo, _, _ := setupExerciseTestRouter()
	exRepo.DailyVocabularies = []exercise.VocabularyItem{
		{ID: "v-1", Term: "おはよう", Reading: "おはよう • Ohayou", Meaning: "Selamat pagi", Category: "greeting", DifficultyLevel: "N5"},
	}

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/vocabularies/daily?limit=5", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK on /vocabularies/daily, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_SubmitExam_SerializesZeroScorePercent(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	body := []byte(`{"level_id":"22222222-2222-2222-2222-222222222222","answers":[{"exercise_id":"44444444-4444-4444-4444-444444444444","user_answer":"Wrong"}]}`)
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/exams/submit", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK on exam submit, got: %d, body: %s", w.Code, w.Body.String())
	}

	var parsed struct {
		Data struct {
			Attempt map[string]any `json:"attempt"`
		} `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &parsed); err != nil {
		t.Fatalf("failed to parse response JSON: %v", err)
	}
	val, exists := parsed.Data.Attempt["score_percent"]
	if !exists || val != float64(0) {
		t.Fatalf("expected score_percent=0 to be present in JSON, got exists=%v val=%v", exists, val)
	}
}



