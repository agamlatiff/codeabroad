package curriculum_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"merantalk/backend/internal/app/curriculum"
	"merantalk/backend/internal/app/exercise"
	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/app/language"
	"merantalk/backend/internal/app/user"
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

	lang := &language.Language{ID: langID, Code: "ja", Name: "Japanese", IsActive: true}
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

func TestHTTP_GetLessonDetail_BySlug(t *testing.T) {
	r, cRepo, _ := setupCurriculumTestRouter()
	cRepo.Lessons["33333333-3333-3333-3333-333333333333"].Slug = "n5-vokal-utama-hiragana"

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/lessons/n5-vokal-utama-hiragana", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for valid lesson slug, got: %d, body: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_GetLessonDetail_InvalidUUID_Returns400(t *testing.T) {
	r, _, _ := setupCurriculumTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/lessons/invalid@lesson!", nil)
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
	h.RegisterRoutes(v1, func(c *gin.Context) { c.Next() })

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

func TestHTTP_CurriculumIncludesShortTitleAndExerciseCounts(t *testing.T) {
	r, cRepo, _ := setupCurriculumTestRouter()
	cRepo.Units["unit-1"] = &curriculum.UnitNodeResponse{
		ID:         "unit-1",
		LevelID:    "22222222-2222-2222-2222-222222222222",
		Title:      "Unit 1",
		UnitType:   "curriculum",
		OrderIndex: 1,
	}
	lessonID := "33333333-3333-3333-3333-333333333333"
	cRepo.Lessons[lessonID].ShortTitle = "Vokal あ–お"
	cRepo.Lessons[lessonID].IconName = "hiragana"
	cRepo.Lessons[lessonID].TotalExercises = 5
	cRepo.Lessons[lessonID].CompletedExercises = 2

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum?language_id=11111111-1111-1111-1111-111111111111", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d, body: %s", w.Code, w.Body.String())
	}
	var resp struct {
		Success bool `json:"success"`
		Data    struct {
			Units []struct {
				Lessons []curriculum.LessonNodeResponse `json:"lessons"`
			} `json:"units"`
		} `json:"data"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("decode error: %v", err)
	}
	if len(resp.Data.Units) == 0 || len(resp.Data.Units[0].Lessons) == 0 {
		t.Fatalf("expected at least 1 unit and lesson")
	}
	got := resp.Data.Units[0].Lessons[0]
	if got.ShortTitle != "Vokal あ–お" || got.IconName != "hiragana" || got.TotalExercises != 5 || got.CompletedExercises != 2 {
		t.Fatalf("unexpected lesson payload: %+v", got)
	}
}

func TestHTTP_KanaChartAndPractice(t *testing.T) {
	r, cRepo, _ := setupCurriculumTestRouter()
	cRepo.KanaCatalog = []curriculum.KanaCharacterItem{
		{ID: "k-1", Character: "あ", Script: "hiragana", Romaji: "a", RowGroup: "a", RowOrder: 1, ColOrder: 1},
		{ID: "k-2", Character: "い", Script: "hiragana", Romaji: "i", RowGroup: "a", RowOrder: 1, ColOrder: 2},
		{ID: "k-3", Character: "ア", Script: "katakana", Romaji: "a", RowGroup: "a", RowOrder: 1, ColOrder: 1},
		{ID: "k-4", Character: "一", Script: "kanji", Romaji: "ichi • satu", RowGroup: "kanji_num1", RowOrder: 1, ColOrder: 1},
	}

	t.Run("GET invalid script returns 400", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/kana?script=hangul", nil)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		if w.Code != http.StatusBadRequest {
			t.Fatalf("expected 400, got %d", w.Code)
		}
	})

	t.Run("GET kanji script returns 200 with kanji items", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/kana?script=kanji", nil)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("expected 200 OK, got %d: %s", w.Code, w.Body.String())
		}
		var chartResp struct {
			Data curriculum.KanaChartResponse `json:"data"`
		}
		if err := json.Unmarshal(w.Body.Bytes(), &chartResp); err != nil {
			t.Fatalf("decode failed: %v", err)
		}
		if chartResp.Data.Script != "kanji" || chartResp.Data.Total != 1 || chartResp.Data.Characters[0].Character != "一" {
			t.Fatalf("expected 1 kanji item 一, got %+v", chartResp.Data)
		}
	})

	t.Run("POST practice updates mastery and GET reflects it", func(t *testing.T) {
		for i := 0; i < 2; i++ {
			body := []byte(`{"results":[{"character":"あ","is_correct":true}]}`)
			req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/kana/practice", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)
			if w.Code != http.StatusOK {
				t.Fatalf("expected 200 OK on practice %d, got %d: %s", i, w.Code, w.Body.String())
			}
		}

		req, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/kana?script=hiragana", nil)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("expected 200 OK, got %d", w.Code)
		}
		var chartResp struct {
			Data curriculum.KanaChartResponse `json:"data"`
		}
		if err := json.Unmarshal(w.Body.Bytes(), &chartResp); err != nil {
			t.Fatalf("decode failed: %v", err)
		}
		if chartResp.Data.Total != 2 || chartResp.Data.MasteredCount != 1 {
			t.Fatalf("expected 2 total and 1 mastered hiragana, got %+v", chartResp.Data)
		}
		if !chartResp.Data.Characters[0].IsMastered || chartResp.Data.Characters[0].CorrectCount != 2 {
			t.Fatalf("expected あ mastered with correct_count=2, got %+v", chartResp.Data.Characters[0])
		}
	})
}

func TestHTTP_GrammarCheckEndpoint(t *testing.T) {
	r, cRepo, _ := setupCurriculumTestRouter()
	cRepo.GrammarPoints["gp-1"] = &curriculum.GrammarPoint{
		ID:        "gp-1",
		LevelID:   "22222222-2222-2222-2222-222222222222",
		LevelCode: "N5",
		Code:      "GP-JA-N5-001",
		Category:  "particle",
		Title:     "Partikel WA",
	}

	t.Run("POST 3/3 marks understood and GET reflects progress", func(t *testing.T) {
		body := []byte(`{"correct_count":3,"total_questions":3}`)
		req, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/grammar-points/GP-JA-N5-001/check", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("expected 200 OK, got %d: %s", w.Code, w.Body.String())
		}
		var checkResp struct {
			Data curriculum.SubmitGrammarCheckResponse `json:"data"`
		}
		if err := json.Unmarshal(w.Body.Bytes(), &checkResp); err != nil {
			t.Fatalf("decode failed: %v", err)
		}
		if !checkResp.Data.Progress.IsUnderstood || checkResp.Data.UnderstoodTotal != 1 {
			t.Fatalf("expected understood=true total=1, got %+v", checkResp.Data)
		}

		getReq, _ := http.NewRequest(http.MethodGet, "/api/v1/curriculum/grammar-points?lang=ja&level_code=N5", nil)
		getW := httptest.NewRecorder()
		r.ServeHTTP(getW, getReq)
		if getW.Code != http.StatusOK {
			t.Fatalf("expected 200 OK on GET, got %d", getW.Code)
		}
		var listResp struct {
			Data []curriculum.GrammarPoint `json:"data"`
		}
		if err := json.Unmarshal(getW.Body.Bytes(), &listResp); err != nil {
			t.Fatalf("decode GET failed: %v", err)
		}
		if len(listResp.Data) != 1 || !listResp.Data[0].IsUnderstood {
			t.Fatalf("expected enriched IsUnderstood=true, got %+v", listResp.Data)
		}
	})

	t.Run("invalid payload and unknown code return 400 / 404", func(t *testing.T) {
		badBody := []byte(`{"correct_count":5,"total_questions":3}`)
		req1, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/grammar-points/GP-JA-N5-001/check", bytes.NewBuffer(badBody))
		req1.Header.Set("Content-Type", "application/json")
		w1 := httptest.NewRecorder()
		r.ServeHTTP(w1, req1)
		if w1.Code != http.StatusBadRequest {
			t.Fatalf("expected 400 Bad Request, got %d", w1.Code)
		}

		zeroBody := []byte(`{"correct_count":0,"total_questions":0}`)
		req2, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/grammar-points/GP-JA-N5-001/check", bytes.NewBuffer(zeroBody))
		req2.Header.Set("Content-Type", "application/json")
		w2 := httptest.NewRecorder()
		r.ServeHTTP(w2, req2)
		if w2.Code != http.StatusBadRequest {
			t.Fatalf("expected 400 Bad Request for total=0, got %d", w2.Code)
		}

		okBody := []byte(`{"correct_count":3,"total_questions":3}`)
		req3, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/grammar-points/UNKNOWN-CODE/check", bytes.NewBuffer(okBody))
		req3.Header.Set("Content-Type", "application/json")
		w3 := httptest.NewRecorder()
		r.ServeHTTP(w3, req3)
		if w3.Code != http.StatusNotFound {
			t.Fatalf("expected 404 Not Found for unknown grammar code, got %d", w3.Code)
		}
	})
}

func TestHTTP_GuestOptionalAuthPreviewAndProtectedMutations(t *testing.T) {
	gin.SetMode(gin.TestMode)

	cRepo := curriculum.NewMockRepository()
	lRepo := language.NewMockRepository()
	eRepo := exercise.NewMockRepository()
	uRepo := user.NewMockRepository()

	langID := "11111111-1111-1111-1111-111111111111"
	lvlID := "22222222-2222-2222-2222-222222222222"
	unit1ID := "aaaaaaaa-0000-0000-0000-000000000001"
	lessonID := "33333333-3333-3333-3333-333333333333"

	lRepo.Languages[langID] = &language.Language{ID: langID, Code: "ja", Name: "Japanese", IsActive: true}
	lRepo.Levels[lvlID] = &language.ProficiencyLevel{ID: lvlID, LanguageID: langID, Code: "N5", OrderIndex: 1}
	cRepo.Units[unit1ID] = &curriculum.UnitNodeResponse{ID: unit1ID, LevelID: lvlID, Title: "Unit 1", UnitType: "curriculum", OrderIndex: 1}
	cRepo.Lessons[lessonID] = &curriculum.LessonNodeResponse{ID: lessonID, UnitID: unit1ID, Title: "Lesson 1", OrderIndex: 1}
	cRepo.KanaCatalog = []curriculum.KanaCharacterItem{{ID: "kana-a", Character: "あ", Script: "hiragana", Romaji: "a"}}

	uc := curriculum.NewUsecase(cRepo, lRepo, eRepo, uRepo, nil)
	h := curriculum.NewHandler(uc)

	requireAuth := func(c *gin.Context) {
		if c.GetString("userID") == "" {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		c.Next()
	}
	optionalAuth := func(c *gin.Context) {
		c.Next()
	}

	r := gin.New()
	v1 := r.Group("/api/v1")
	h.RegisterRoutes(v1, requireAuth, optionalAuth)

	for _, path := range []string{
		"/api/v1/curriculum",
		"/api/v1/curriculum/lessons/" + lessonID,
		"/api/v1/curriculum/kana?script=hiragana",
	} {
		req, _ := http.NewRequest(http.MethodGet, path, nil)
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("expected 200 OK for guest GET %s, got %d (%s)", path, w.Code, w.Body.String())
		}
	}

	postReq, _ := http.NewRequest(http.MethodPost, "/api/v1/curriculum/lessons/"+lessonID+"/complete", bytes.NewBufferString(`{"score":100}`))
	postReq.Header.Set("Content-Type", "application/json")
	postW := httptest.NewRecorder()
	r.ServeHTTP(postW, postReq)
	if postW.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 Unauthorized for guest CompleteLesson, got %d", postW.Code)
	}
}
