package router_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"codeabroad/backend/internal/app/health"
	"codeabroad/backend/internal/shared/router"
	"github.com/gin-gonic/gin"
)

func TestSetupRouter_HealthEndpoint(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := router.SetupRouter(&router.Config{
		HealthHandler: health.NewHandler(nil, nil),
	})

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/health", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Since db/redis are nil, health returns 503 Service Unavailable
	if w.Code != http.StatusServiceUnavailable {
		t.Fatalf("expected 503 from degraded health check, got %d", w.Code)
	}
}

