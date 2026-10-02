package handler

import (
	"codeabroad/backend/internal/infrastructure/postgres"
	"codeabroad/backend/internal/infrastructure/redis"
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// HealthHandler manages system health inspection endpoints
type HealthHandler struct {
	pg  *postgres.PostgresDB
	rdb *redis.RedisClient
}

// NewHealthHandler creates a new HealthHandler instance
func NewHealthHandler(pg *postgres.PostgresDB, rdb *redis.RedisClient) *HealthHandler {
	return &HealthHandler{
		pg:  pg,
		rdb: rdb,
	}
}

func (h *HealthHandler) CheckHealth(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	pgStatus := "connected"
	redisStatus := "connected"
	isHealthy := true

	// Verify PostgreSQL connectivity
	if err := h.pg.Ping(ctx); err != nil {
		pgStatus = "disconnected"
		isHealthy = false
	}

	// Verify Redis connectivity
	if err := h.rdb.Ping(ctx); err != nil {
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
func (h *HealthHandler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/health", h.CheckHealth)
}