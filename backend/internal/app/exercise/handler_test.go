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

	uc := exercise.NewUsecaseWithAccessChecker(exerciseRepo, srsRepo, examRepo, langRepo, userRepo, exercise.NewMockLessonAccessChecker(true))
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

func TestHTTP_GetExamResult_Returns404Then200WhenPassed(t *testing.T) {
	r, _, _, examRepo := setupExerciseTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/exams/result/22222222-2222-2222-2222-222222222222", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Fatalf("expected 404 Not Found before passing exam, got: %d, body: %s", w.Code, w.Body.String())
	}

	examRepo.Attempts = append(examRepo.Attempts, exercise.ReadinessExamAttempt{
		ID:           "att-passed",
		UserID:       "usr-123",
		LevelID:      "22222222-2222-2222-2222-222222222222",
		ScorePercent: 100,
		IsPassed:     true,
	})

	req2, _ := http.NewRequest(http.MethodGet, "/api/v1/exams/result/22222222-2222-2222-2222-222222222222", nil)
	w2 := httptest.NewRecorder()
	r.ServeHTTP(w2, req2)

	if w2.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for passed exam result, got: %d, body: %s", w2.Code, w2.Body.String())
	}
}

func TestHTTP_RateLimiter_ExercisesSubmitReturns429(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	body, _ := json.Marshal(exercise.SubmitExerciseAnswerRequest{
		ExerciseID:       "44444444-4444-4444-4444-444444444444",
		UserAnswer:       "Konnichiwa",
		TimeSpentSeconds: 3,
	})

	for i := 0; i < 30; i++ {
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/exercises/submit", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("expected request %d to return 200 OK, got: %d, body: %s", i+1, w.Code, w.Body.String())
		}
	}

	req31, _ := http.NewRequest(http.MethodPost, "/api/v1/exercises/submit", bytes.NewBuffer(body))
	req31.Header.Set("Content-Type", "application/json")
	w31 := httptest.NewRecorder()
	r.ServeHTTP(w31, req31)

	if w31.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 429 Too Many Requests on 31st /exercises/submit, got: %d, body: %s", w31.Code, w31.Body.String())
	}
}

func TestHTTP_RateLimiter_SRSReviewReturns429(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	q := 4
	body, _ := json.Marshal(exercise.SubmitSRSReviewRequest{
		ExerciseID: "44444444-4444-4444-4444-444444444444",
		Quality:    &q,
	})

	for i := 0; i < 30; i++ {
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/srs/review", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("expected request %d to return 200 OK, got: %d, body: %s", i+1, w.Code, w.Body.String())
		}
	}

	req31, _ := http.NewRequest(http.MethodPost, "/api/v1/srs/review", bytes.NewBuffer(body))
	req31.Header.Set("Content-Type", "application/json")
	w31 := httptest.NewRecorder()
	r.ServeHTTP(w31, req31)

	if w31.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 429 Too Many Requests on 31st /srs/review, got: %d, body: %s", w31.Code, w31.Body.String())
	}
}

func TestHTTP_RateLimiter_ExamsSubmitReturns429(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	body := []byte(`{"level_id":"22222222-2222-2222-2222-222222222222","answers":[{"exercise_id":"44444444-4444-4444-4444-444444444444","user_answer":"Wrong"}]}`)

	for i := 0; i < 10; i++ {
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/exams/submit", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("expected request %d to return 200 OK, got: %d, body: %s", i+1, w.Code, w.Body.String())
		}
	}

	req11, _ := http.NewRequest(http.MethodPost, "/api/v1/exams/submit", bytes.NewBuffer(body))
	req11.Header.Set("Content-Type", "application/json")
	w11 := httptest.NewRecorder()
	r.ServeHTTP(w11, req11)

	if w11.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 429 Too Many Requests on 11th /exams/submit, got: %d, body: %s", w11.Code, w11.Body.String())
	}
}

func TestHTTP_ProcessReview_InvalidQualityReturns400(t *testing.T) {
	r, _, _, _ := setupExerciseTestRouter()

	for _, bodyStr := range []string{
		`{"exercise_id":"44444444-4444-4444-4444-444444444444","quality":-1}`,
		`{"exercise_id":"44444444-4444-4444-4444-444444444444","quality":6}`,
	} {
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/srs/review", bytes.NewBufferString(bodyStr))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		if w.Code != http.StatusBadRequest {
			t.Fatalf("expected 400 Bad Request for payload %s, got: %d, body: %s", bodyStr, w.Code, w.Body.String())
		}
	}
}

func TestHTTP_GetExamQuestions_ForbiddenAndConflict(t *testing.T) {
	gin.SetMode(gin.TestMode)

	exerciseRepo := exercise.NewMockRepository()
	srsRepo := exercise.NewMockSRSRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

	langID := "11111111-1111-1111-1111-111111111111"
	lvlN5ID := "22222222-2222-2222-2222-222222222222"
	lvlN4ID := "55555555-5555-5555-5555-555555555555"

	lvlN5 := &language.ProficiencyLevel{ID: lvlN5ID, LanguageID: langID, Code: "N5", OrderIndex: 1}
	lvlN4 := &language.ProficiencyLevel{ID: lvlN4ID, LanguageID: langID, Code: "N4", OrderIndex: 2}
	langRepo.Levels[lvlN5ID] = lvlN5
	langRepo.Levels[lvlN4ID] = lvlN4
	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:             "enr-1",
		UserID:         "usr-123",
		LanguageID:     langID,
		CurrentLevelID: &lvlN5ID,
		IsActive:       true,
		CurrentLevel:   lvlN5,
	}
	exerciseRepo.ReadinessExamExercises[lvlN5ID] = []exercise.Exercise{{ID: "q-n5", SkillPillar: "reading"}}
	exerciseRepo.ReadinessExamExercises[lvlN4ID] = []exercise.Exercise{{ID: "q-n4", SkillPillar: "reading"}}

	uc := exercise.NewUsecaseWithAccessChecker(exerciseRepo, srsRepo, examRepo, langRepo, userRepo, exercise.NewMockLessonAccessChecker(true))
	h := exercise.NewHandler(uc, uc, uc)

	r := gin.New()
	v1 := r.Group("/api/v1")
	h.RegisterRoutes(v1, func(c *gin.Context) {
		c.Set("userID", "usr-123")
		c.Next()
	})

	// Locked higher level (N4 while enrolled at N5) -> 403 Forbidden
	reqForbidden, _ := http.NewRequest(http.MethodGet, "/api/v1/exams/questions/"+lvlN4ID, nil)
	wForbidden := httptest.NewRecorder()
	r.ServeHTTP(wForbidden, reqForbidden)
	if wForbidden.Code != http.StatusForbidden {
		t.Fatalf("expected 403 Forbidden for locked level exam questions, got: %d, body: %s", wForbidden.Code, wForbidden.Body.String())
	}

	// Already passed current level (N5) -> 409 Conflict
	examRepo.Attempts = append(examRepo.Attempts, exercise.ReadinessExamAttempt{
		ID:       "att-passed",
		UserID:   "usr-123",
		LevelID:  lvlN5ID,
		IsPassed: true,
	})
	reqConflict, _ := http.NewRequest(http.MethodGet, "/api/v1/exams/questions/"+lvlN5ID, nil)
	wConflict := httptest.NewRecorder()
	r.ServeHTTP(wConflict, reqConflict)
	if wConflict.Code != http.StatusConflict {
		t.Fatalf("expected 409 Conflict for already passed exam questions, got: %d, body: %s", wConflict.Code, wConflict.Body.String())
	}
}

func TestHTTP_GetExamResult_InactiveEnrollmentReturns200(t *testing.T) {
	gin.SetMode(gin.TestMode)

	exerciseRepo := exercise.NewMockRepository()
	srsRepo := exercise.NewMockSRSRepository()
	examRepo := exercise.NewMockReadinessExamRepository()
	langRepo := language.NewMockRepository()
	userRepo := user.NewMockRepository()

	langJA := "11111111-1111-1111-1111-111111111111"
	langDE := "66666666-6666-6666-6666-666666666666"
	lvlN5ID := "22222222-2222-2222-2222-222222222222"
	lvlA1ID := "77777777-7777-7777-7777-777777777777"

	lvlN5 := &language.ProficiencyLevel{ID: lvlN5ID, LanguageID: langJA, Code: "N5", OfficialExamName: "JLPT", OrderIndex: 1}
	lvlA1 := &language.ProficiencyLevel{ID: lvlA1ID, LanguageID: langDE, Code: "A1", OfficialExamName: "Goethe", OrderIndex: 1}
	langRepo.Levels[lvlN5ID] = lvlN5
	langRepo.Levels[lvlA1ID] = lvlA1
	langRepo.Enrollments["enr-ja"] = &language.UserLanguageEnrollment{
		ID:             "enr-ja",
		UserID:         "usr-123",
		LanguageID:     langJA,
		CurrentLevelID: &lvlN5ID,
		IsActive:       false,
		CurrentLevel:   lvlN5,
	}
	langRepo.Enrollments["enr-de"] = &language.UserLanguageEnrollment{
		ID:             "enr-de",
		UserID:         "usr-123",
		LanguageID:     langDE,
		CurrentLevelID: &lvlA1ID,
		IsActive:       true,
		CurrentLevel:   lvlA1,
	}
	examRepo.Attempts = append(examRepo.Attempts, exercise.ReadinessExamAttempt{
		ID:           "att-ja-n5",
		UserID:       "usr-123",
		LevelID:      lvlN5ID,
		ScorePercent: 90,
		IsPassed:     true,
	})

	uc := exercise.NewUsecaseWithAccessChecker(exerciseRepo, srsRepo, examRepo, langRepo, userRepo, exercise.NewMockLessonAccessChecker(true))
	h := exercise.NewHandler(uc, uc, uc)

	r := gin.New()
	v1 := r.Group("/api/v1")
	h.RegisterRoutes(v1, func(c *gin.Context) {
		c.Set("userID", "usr-123")
		c.Next()
	})

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/exams/result/"+lvlN5ID, nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for earned exam result on inactive language enrollment, got: %d, body: %s", w.Code, w.Body.String())
	}
}
