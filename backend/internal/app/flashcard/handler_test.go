package flashcard

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"merantalk/backend/internal/app/user"
	"github.com/gin-gonic/gin"
)

func setupFlashcardHandlerTestRouter() (*gin.Engine, *stubFlashcardRepo) {
	gin.SetMode(gin.TestMode)
	repo := &stubFlashcardRepo{cardExists: true}
	uRepo := user.NewMockRepository()
	uRepo.Users["11111111-1111-1111-1111-111111111111"] = &user.User{
		UserAccount:           user.UserAccount{ID: "11111111-1111-1111-1111-111111111111", Email: "tester@merantalk.id"},
		UserGamificationStats: user.UserGamificationStats{XP: 50, CurrentLevel: 1, Streak: 1},
	}
	uc := NewUsecase(repo, uRepo)
	noopLimiter := func(c *gin.Context) { c.Next() }
	h := NewHandlerWithRateLimiter(uc, noopLimiter)

	mockAuth := func(c *gin.Context) {
		c.Set("userID", "11111111-1111-1111-1111-111111111111")
		c.Next()
	}

	r := gin.New()
	v1 := r.Group("/api/v1")
	h.RegisterRoutes(v1, mockAuth)
	return r, repo
}

func TestHTTP_ReviewCard_InvalidUUID_Returns400(t *testing.T) {
	r, _ := setupFlashcardHandlerTestRouter()

	req, _ := http.NewRequest(
		http.MethodPost,
		"/api/v1/flashcards/cards/not-a-uuid/review",
		bytes.NewBufferString(`{"quality":4}`),
	)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request for invalid card UUID, got %d: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_ReviewCard_ValidUUID_Returns200(t *testing.T) {
	r, _ := setupFlashcardHandlerTestRouter()

	req, _ := http.NewRequest(
		http.MethodPost,
		"/api/v1/flashcards/cards/22222222-2222-2222-2222-222222222222/review",
		bytes.NewBufferString(`{"quality":4}`),
	)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for valid card UUID, got %d: %s", w.Code, w.Body.String())
	}
}

func TestHTTP_GetDueQueue_InvalidLimit_Returns400(t *testing.T) {
	r, _ := setupFlashcardHandlerTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/flashcards/due?limit=abc", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request for non-numeric limit, got %d: %s", w.Code, w.Body.String())
	}
}
