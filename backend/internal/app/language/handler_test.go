package language_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"codeabroad/backend/internal/app/language"
	"github.com/gin-gonic/gin"
)

func setupLanguageTestRouter() (*gin.Engine, *language.MockRepository) {
	gin.SetMode(gin.TestMode)

	langRepo := language.NewMockRepository()
	langID := "11111111-1111-1111-1111-111111111111"
	langRepo.Languages[langID] = &language.Language{
		ID:       langID,
		Code:     "ja",
		Name:     "Japanese",
		IsActive: true,
	}
	langRepo.Levels["lvl-1"] = &language.ProficiencyLevel{
		ID:         "lvl-1",
		LanguageID: langID,
		OrderIndex: 1,
		Code:       "N5",
	}

	uc := language.NewUsecase(langRepo)
	h := language.NewHandler(uc)

	mockAuth := func(c *gin.Context) {
		c.Set("userID", "usr-123")
		c.Next()
	}

	r := gin.New()
	v1 := r.Group("/api/v1")
	h.RegisterRoutes(v1, mockAuth)

	return r, langRepo
}

func TestHTTP_ListLanguages(t *testing.T) {
	r, _ := setupLanguageTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/languages", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d", w.Code)
	}
}

func TestHTTP_GetLanguageDetails(t *testing.T) {
	r, _ := setupLanguageTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/languages/11111111-1111-1111-1111-111111111111", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d", w.Code)
	}
}

func TestHTTP_SwitchActiveLanguage(t *testing.T) {
	r, langRepo := setupLanguageTestRouter()
	langID := "11111111-1111-1111-1111-111111111111"

	langRepo.Enrollments["enr-1"] = &language.UserLanguageEnrollment{
		ID:         "enr-1",
		UserID:     "usr-123",
		LanguageID: langID,
		IsActive:   false,
	}

	body, _ := json.Marshal(map[string]string{
		"language_id": langID,
	})

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/languages/switch", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got: %d, body: %s", w.Code, w.Body.String())
	}
}

