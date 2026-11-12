package exercise_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	deliveryHttp "codeabroad/backend/internal/delivery/http"
	exerciseHandlerPkg "codeabroad/backend/internal/delivery/http/handler/exercise"
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/mock"
	exerciseUsecasePkg "codeabroad/backend/internal/usecase/exercise"
	"github.com/gin-gonic/gin"
)

func setupExerciseTestRouter() (*gin.Engine, *mock.ExerciseRepository, *mock.SRSRepository, *mock.ReadinessExamRepository) {
	gin.SetMode(gin.TestMode)

	exerciseRepo := mock.NewExerciseRepository()
	srsRepo := mock.NewSRSRepository()
	examRepo := mock.NewReadinessExamRepository()
	langRepo := mock.NewLanguageRepository()
	userRepo := mock.NewUserRepository()

	exID := "44444444-4444-4444-4444-444444444444"
	lesID := "33333333-3333-3333-3333-333333333333"
	lvlID := "22222222-2222-2222-2222-222222222222"

	_ = userRepo.Create(context.Background(), &domain.User{
		UserAccount: domain.UserAccount{ID: "usr-123", Email: "test@example.com"},
		UserProfile: domain.UserProfile{Username: "tester"},
	})

	exerciseRepo.Exercises[exID] = &domain.Exercise{
		ID:            exID,
		LessonID:      &lesID,
		Type:          domain.ExerciseTypeMultipleChoice,
		QuestionText:  "Choose the correct greeting",
		Options:       []string{"Konnichiwa", "Sayonara"},
		CorrectAnswer: "Konnichiwa",
	}
	exerciseRepo.ReadinessExamExercises[lvlID] = []domain.Exercise{
		*exerciseRepo.Exercises[exID],
	}

	uc := exerciseUsecasePkg.New(exerciseRepo, srsRepo, examRepo, langRepo, userRepo)
	h := exerciseHandlerPkg.New(uc, uc, uc)

	mockAuth := func(c *gin.Context) {
		c.Set("userID", "usr-123")
		c.Next()
	}

	r := deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		ExerciseHandler: h,
		AuthMiddleware:  mockAuth,
	})

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

	body, _ := json.Marshal(domain.SubmitExerciseAnswerRequest{
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
