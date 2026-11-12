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

	_ = userRepo.Create(context.Background(), &user.User{
		UserAccount: user.UserAccount{ID: "usr-123", Email: "test@example.com"},
		UserProfile: user.UserProfile{Username: "tester"},
	})

	exerciseRepo.Exercises[exID] = &exercise.Exercise{
		ID:            exID,
		LessonID:      &lesID,
		Type:          exercise.ExerciseTypeMultipleChoice,
		QuestionText:  "Choose the correct greeting",
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

