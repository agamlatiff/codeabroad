package language_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	deliveryHttp "codeabroad/backend/internal/delivery/http"
	languageHandlerPkg "codeabroad/backend/internal/delivery/http/handler/language"
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/mock"
	languageUsecasePkg "codeabroad/backend/internal/usecase/language"
	"github.com/gin-gonic/gin"
)

func setupLanguageTestRouter() (*gin.Engine, *mock.LanguageRepository) {
	gin.SetMode(gin.TestMode)

	langRepo := mock.NewLanguageRepository()
	langID := "11111111-1111-1111-1111-111111111111"
	langRepo.Languages[langID] = &domain.Language{
		ID:       langID,
		Code:     "ja",
		Name:     "Japanese",
		IsActive: true,
	}
	langRepo.Levels["lvl-1"] = &domain.ProficiencyLevel{
		ID:         "lvl-1",
		LanguageID: langID,
		OrderIndex: 1,
		Code:       "N5",
	}

	uc := languageUsecasePkg.New(langRepo)
	h := languageHandlerPkg.New(uc)

	mockAuth := func(c *gin.Context) {
		c.Set("userID", "usr-123")
		c.Next()
	}

	r := deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		LanguageHandler: h,
		AuthMiddleware:  mockAuth,
	})

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

	langRepo.Enrollments["enr-1"] = &domain.UserLanguageEnrollment{
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

