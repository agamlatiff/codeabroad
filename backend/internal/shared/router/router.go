package router

import (
	"log"

	"merantalk/backend/internal/app/auth"
	"merantalk/backend/internal/app/curriculum"
	"merantalk/backend/internal/app/exercise"
	"merantalk/backend/internal/app/flashcard"
	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/app/health"
	"merantalk/backend/internal/app/language"
	"merantalk/backend/internal/app/leaderboard"
	"merantalk/backend/internal/app/onboarding"
	"merantalk/backend/internal/shared/middleware"
	"merantalk/backend/internal/app/user"
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
	FlashcardHandler       *flashcard.Handler
	GamificationHandler    *gamification.Handler
	LeaderboardHandler     *leaderboard.Handler
	AuthMiddleware         gin.HandlerFunc
	OptionalAuthMiddleware gin.HandlerFunc
	CORSAllowedOrigins     []string
	TrustedProxies         []string
}

// SetupRouter initializes the Gin engine and configures API v1 routes
func SetupRouter(cfg *Config) *gin.Engine {
	r := gin.Default()
	if cfg == nil {
		cfg = &Config{}
	}
	if err := r.SetTrustedProxies(cfg.TrustedProxies); err != nil {
		log.Printf("router: failed to configure trusted proxies, trusting none: %v", err)
		_ = r.SetTrustedProxies(nil)
	}

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
			cfg.AuthHandler.RegisterRoutes(v1, cfg.AuthMiddleware, cfg.OptionalAuthMiddleware)
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
		if cfg.FlashcardHandler != nil {
			cfg.FlashcardHandler.RegisterRoutes(v1, cfg.AuthMiddleware)
		}
		if cfg.GamificationHandler != nil {
			cfg.GamificationHandler.RegisterRoutes(v1, cfg.AuthMiddleware)
		}
		if cfg.LeaderboardHandler != nil {
			cfg.LeaderboardHandler.RegisterRoutes(v1, cfg.AuthMiddleware, cfg.OptionalAuthMiddleware)
		}
	}
	return r
}

