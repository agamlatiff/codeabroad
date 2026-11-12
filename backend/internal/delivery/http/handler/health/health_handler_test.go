package health_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	deliveryHttp "codeabroad/backend/internal/delivery/http"
	healthHandlerPkg "codeabroad/backend/internal/delivery/http/handler/health"
	"github.com/gin-gonic/gin"
)

func TestHTTP_HealthCheck_DegradedWhenNil(t *testing.T) {
	gin.SetMode(gin.TestMode)

	h := healthHandlerPkg.New(nil, nil)
	r := deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		HealthHandler: h,
	})

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/health", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// When pg and rdb are nil, Ping causes degraded status 503
	if w.Code != http.StatusServiceUnavailable {
		t.Fatalf("expected 503 Service Unavailable for uninitialized db/redis, got: %d", w.Code)
	}
}

