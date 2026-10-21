package http

import (
	"codeabroad/backend/internal/delivery/http/handler"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

// RouterConfig holds all handler dependencies required by the router
type RouterConfig struct {
	HealthHandler     *handler.HealthHandler
	AuthHandler       *handler.AuthHandler
	OnboardingHandler *handler.OnboardingHandler
	RoadmapHandler    *handler.RoadmapHandler
	QuestHandler      *handler.QuestHandler
	VocabularyHandler *handler.VocabularyHandler
	LeaderboardHandler *handler.LeaderboardHandler
	GamificationHandler *handler.GamificationHandler
	AuthMiddleware         gin.HandlerFunc
	OptionalAuthMiddleware gin.HandlerFunc
	CORSAllowedOrigins     []string
}

// SetupRouter initializes the Gin engine and configures API v1 routes
func SetupRouter(cfg *RouterConfig) *gin.Engine {
	r := gin.Default()

	origins := cfg.CORSAllowedOrigins
	if len(origins) == 0 {
		origins = []string{"http://localhost:5173", "http://localhost:3000", "http://localhost"}
	}

	// CORS configuration for frontend integration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// API version 1 route group
	v1 := r.Group("/api/v1")
	{
		if cfg.HealthHandler != nil {
			cfg.HealthHandler.RegisterRoutes(v1)
		}
		if cfg.AuthHandler != nil {
			cfg.AuthHandler.RegisterRoutes(v1, cfg.AuthMiddleware)
		}
		if cfg.OnboardingHandler != nil {
			cfg.OnboardingHandler.RegisterRoutes(v1, cfg.AuthMiddleware)
		}
		if cfg.RoadmapHandler != nil {
			cfg.RoadmapHandler.RegisterRoutes(v1, cfg.AuthMiddleware)
		}
		if cfg.QuestHandler != nil {
			cfg.QuestHandler.RegisterRoutes(v1, cfg.AuthMiddleware)
		}
		if cfg.VocabularyHandler != nil {
			cfg.VocabularyHandler.RegisterRoutes(v1)
		}
		if cfg.LeaderboardHandler != nil {
			cfg.LeaderboardHandler.RegisterRoutes(v1, cfg.OptionalAuthMiddleware)
		}
		if cfg.GamificationHandler != nil {
			cfg.GamificationHandler.RegisterRoutes(v1, cfg.AuthMiddleware)
		}
	}
	return r
}
