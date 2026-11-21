package health

import (
	"context"
	"net/http"
	"sync"
	"time"

	"merantalk/backend/infrastructure/postgres"
	"merantalk/backend/infrastructure/redis"
	"github.com/gin-gonic/gin"
)

// Handler manages system health inspection endpoints
type Handler struct {
	pg  *postgres.PostgresDB
	rdb *redis.RedisClient
}

// NewHandler creates a new Health Handler instance
func NewHandler(pg *postgres.PostgresDB, rdb *redis.RedisClient) *Handler {
	return &Handler{
		pg:  pg,
		rdb: rdb,
	}
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

	if !isHealthy {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"success": false,
			"error":   "system components degraded",
			"code":    "SERVICE_UNAVAILABLE",
			"data": gin.H{
				"status":   "degraded",
				"postgres": pgStatus,
				"redis":    redisStatus,
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"status":   "healthy",
			"postgres": pgStatus,
			"redis":    redisStatus,
		},
		"message": "system is fully operational",
	})
}

// RegisterRoutes registers health check endpoints to the router group
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/health", h.CheckHealth)
}

