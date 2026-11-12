package health_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"codeabroad/backend/internal/app/health"
	"github.com/gin-gonic/gin"
)

func TestHTTP_HealthCheck_DegradedWhenNil(t *testing.T) {
	gin.SetMode(gin.TestMode)

	h := health.NewHandler(nil, nil)
	r := gin.New()
	v1 := r.Group("/api/v1")
	h.RegisterRoutes(v1)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/health", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// When pg and rdb are nil, Ping causes degraded status 503
	if w.Code != http.StatusServiceUnavailable {
		t.Fatalf("expected 503 Service Unavailable for uninitialized db/redis, got: %d", w.Code)
	}
}

