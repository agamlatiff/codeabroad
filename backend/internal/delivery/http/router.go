package http

import (
	authHandlerPkg "codeabroad/backend/internal/delivery/http/handler/auth"
	curriculumHandlerPkg "codeabroad/backend/internal/delivery/http/handler/curriculum"
	exerciseHandlerPkg "codeabroad/backend/internal/delivery/http/handler/exercise"
	gamificationHandlerPkg "codeabroad/backend/internal/delivery/http/handler/gamification"
	healthHandlerPkg "codeabroad/backend/internal/delivery/http/handler/health"
	languageHandlerPkg "codeabroad/backend/internal/delivery/http/handler/language"
	leaderboardHandlerPkg "codeabroad/backend/internal/delivery/http/handler/leaderboard"
	onboardingHandlerPkg "codeabroad/backend/internal/delivery/http/handler/onboarding"
	userHandlerPkg "codeabroad/backend/internal/delivery/http/handler/user"
	"codeabroad/backend/internal/delivery/http/middleware"
	"github.com/gin-gonic/gin"
)

// RouterConfig holds all handler dependencies required by the router
type RouterConfig struct {
	HealthHandler          *healthHandlerPkg.Handler
	AuthHandler            *authHandlerPkg.Handler
	UserHandler            *userHandlerPkg.Handler
	OnboardingHandler      *onboardingHandlerPkg.Handler
	LanguageHandler        *languageHandlerPkg.Handler
	CurriculumHandler      *curriculumHandlerPkg.Handler
	ExerciseHandler        *exerciseHandlerPkg.Handler
	GamificationHandler    *gamificationHandlerPkg.Handler
	LeaderboardHandler     *leaderboardHandlerPkg.Handler
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
		if cfg.LanguageHandler != nil {
			cfg.LanguageHandler.RegisterRoutes(v1, cfg.AuthMiddleware)
		}
		if cfg.CurriculumHandler != nil {
			cfg.CurriculumHandler.RegisterRoutes(v1, cfg.AuthMiddleware)
		}
		if cfg.ExerciseHandler != nil {
			cfg.ExerciseHandler.RegisterRoutes(v1, cfg.AuthMiddleware)
		}
		if cfg.GamificationHandler != nil {
			cfg.GamificationHandler.RegisterRoutes(v1, cfg.AuthMiddleware)
		}
		if cfg.LeaderboardHandler != nil {
			cfg.LeaderboardHandler.RegisterRoutes(v1, cfg.OptionalAuthMiddleware)
		}
	}
	return r
}
