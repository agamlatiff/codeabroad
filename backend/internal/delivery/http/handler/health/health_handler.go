package health

import (
	"context"
	"net/http"
	"time"

	"codeabroad/backend/internal/infrastructure/postgres"
	"codeabroad/backend/internal/infrastructure/redis"
	"github.com/gin-gonic/gin"
)

// Handler manages system health inspection endpoints
type Handler struct {
	pg  *postgres.PostgresDB
	rdb *redis.RedisClient
}

// New creates a new Health Handler instance
func New(pg *postgres.PostgresDB, rdb *redis.RedisClient) *Handler {
	return &Handler{
		pg:  pg,
		rdb: rdb,
	}
}

func (h *Handler) CheckHealth(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	pgStatus := "connected"
	redisStatus := "connected"
	isHealthy := true

	// Verify PostgreSQL connectivity
	if h.pg == nil || h.pg.Ping(ctx) != nil {
		pgStatus = "disconnected"
		isHealthy = false
	}

	// Verify Redis connectivity
	if h.rdb == nil || h.rdb.Ping(ctx) != nil {
		redisStatus = "disconnected"
		isHealthy = false
	}

	statusCode := http.StatusOK
	message := "system is fully operational"
	statusText := "healthy"

	if !isHealthy {
		statusCode = http.StatusServiceUnavailable
		message = "system components degraded"
		statusText = "degraded"
	}

	c.JSON(statusCode, gin.H{
		"success": isHealthy,
		"data": gin.H{
			"status":   statusText,
			"postgres": pgStatus,
			"redis":    redisStatus,
		},
		"message": message,
	})
}

// RegisterRoutes registers health check endpoints to the router group
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/health", h.CheckHealth)
}
