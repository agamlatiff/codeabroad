package health

import (
	"context"
	"net/http"
	"sync"
	"time"

	"codeabroad/backend/infrastructure/postgres"
	"codeabroad/backend/infrastructure/redis"
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

// NewHandler creates a new Health Handler instance (standard naming convention)
func NewHandler(pg *postgres.PostgresDB, rdb *redis.RedisClient) *Handler {
	return New(pg, rdb)
}

// CheckHealth performs ping checks on Postgres and Redis and returns system readiness status
func (h *Handler) CheckHealth(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	pgStatus := "connected"
	redisStatus := "connected"
	pgOK := true
	redisOK := true

	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		if h.pg == nil || h.pg.Ping(ctx) != nil {
			pgStatus = "disconnected"
			pgOK = false
		}
	}()

	go func() {
		defer wg.Done()
		if h.rdb == nil || h.rdb.Ping(ctx) != nil {
			redisStatus = "disconnected"
			redisOK = false
		}
	}()

	wg.Wait()
	isHealthy := pgOK && redisOK

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

