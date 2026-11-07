package http

import (
	"codeabroad/backend/internal/delivery/http/handler"
	authHandlerPkg "codeabroad/backend/internal/delivery/http/handler/auth"
	roadmapHandlerPkg "codeabroad/backend/internal/delivery/http/handler/roadmap"
	userHandlerPkg "codeabroad/backend/internal/delivery/http/handler/user"
	"codeabroad/backend/internal/delivery/http/middleware"
	"github.com/gin-gonic/gin"
)

// RouterConfig holds all handler dependencies required by the router
type RouterConfig struct {
	HealthHandler          *handler.HealthHandler
	AuthHandler            *authHandlerPkg.Handler
	UserHandler            *userHandlerPkg.Handler
	OnboardingHandler      *handler.OnboardingHandler
	RoadmapHandler         *roadmapHandlerPkg.Handler
	QuestHandler           *handler.QuestHandler
	VocabularyHandler      *handler.VocabularyHandler
	LeaderboardHandler     *handler.LeaderboardHandler
	GamificationHandler    *handler.GamificationHandler
	AuthMiddleware         gin.HandlerFunc
	OptionalAuthMiddleware gin.HandlerFunc
	CORSAllowedOrigins     []string
}

// SetupRouter initializes the Gin engine and configures API v1 routes
func SetupRouter(cfg *RouterConfig) *gin.Engine {
	r := gin.Default()

	r.Use(middleware.SecurityHeadersMiddleware())
	r.Use(middleware.BodySizeLimitMiddleware(middleware.DefaultMaxBodyBytes))
	r.Use(middleware.CORSMiddleware(cfg.CORSAllowedOrigins))

	// API version 1 route group
	v1 := r.Group("/api/v1")
	{
		if cfg.HealthHandler != nil {
			cfg.HealthHandler.RegisterRoutes(v1)
		}
		if cfg.AuthHandler != nil {
			cfg.AuthHandler.RegisterRoutes(v1, cfg.AuthMiddleware)
		}
		if cfg.UserHandler != nil {
			cfg.UserHandler.RegisterRoutes(v1, cfg.AuthMiddleware)
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
