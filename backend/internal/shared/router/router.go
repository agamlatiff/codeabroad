package router

import (
	"codeabroad/backend/internal/app/auth"
	"codeabroad/backend/internal/app/curriculum"
	"codeabroad/backend/internal/app/exercise"
	"codeabroad/backend/internal/app/gamification"
	"codeabroad/backend/internal/app/health"
	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/app/leaderboard"
	"codeabroad/backend/internal/app/onboarding"
	"codeabroad/backend/internal/shared/middleware"
	"codeabroad/backend/internal/app/user"
	"github.com/gin-gonic/gin"
)

// Config holds all handler dependencies required by the router
type Config struct {
	HealthHandler          *health.Handler
	AuthHandler            *auth.Handler
	UserHandler            *user.Handler
	OnboardingHandler      *onboarding.Handler
	LanguageHandler        *language.Handler
	CurriculumHandler      *curriculum.Handler
	ExerciseHandler        *exercise.Handler
	GamificationHandler    *gamification.Handler
	LeaderboardHandler     *leaderboard.Handler
	AuthMiddleware         gin.HandlerFunc
	OptionalAuthMiddleware gin.HandlerFunc
	CORSAllowedOrigins     []string
}

// RouterConfig is an alias for Config to support standard router configurations
type RouterConfig = Config

// SetupRouter initializes the Gin engine and configures API v1 routes
func SetupRouter(cfg *Config) *gin.Engine {
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

