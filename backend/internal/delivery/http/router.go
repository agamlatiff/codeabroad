package http

import (
	"time"
	"codeabroad/backend/internal/delivery/http/handler"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// RouterConfig holds all handler dependencies required by the router
type RouterConfig struct {
	HealthHandler *handler.HealthHandler
}

// SetupRouter initializes the Gin engine and configures API v1 routes
func SetupRouter(cfg *RouterConfig) *gin.Engine  {
	r := gin.Default()

	// CORS configuration for frontend integration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// API version 1 route group
	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", cfg.HealthHandler.CheckHealth)
	}
	return r
}