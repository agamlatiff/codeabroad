package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"codeabroad/backend/internal/app/auth"
	"codeabroad/backend/config"
	"codeabroad/backend/internal/app/curriculum"
	"codeabroad/backend/internal/app/exercise"
	"codeabroad/backend/internal/app/gamification"
	"codeabroad/backend/internal/app/health"
	"codeabroad/backend/infrastructure/postgres"
	"codeabroad/backend/infrastructure/redis"
	"codeabroad/backend/internal/app/language"
	"codeabroad/backend/internal/app/leaderboard"
	"codeabroad/backend/internal/app/onboarding"
	"codeabroad/backend/internal/shared/middleware"
	"codeabroad/backend/internal/shared/router"
	"codeabroad/backend/internal/app/user"
)

func main() {
	// 1. Load application configuration from .env
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("failed to load configuration: %v", err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// 2. Initialize PostgreSQL connection pool
	pg, err := postgres.NewPostgresDB(ctx, cfg)
	if err != nil {
		log.Fatalf("failed to connect to postgres: %v", err)
	}
	defer pg.Close()
	log.Println("connected to PostgreSQL successfully")

	// 3. Initialize Redis client
	rdb, err := redis.NewRedisClient(ctx, cfg)
	if err != nil {
		log.Fatalf("failed to connect to redis: %v", err)
	}
	defer func() {
		if err := rdb.Close(); err != nil {
			log.Printf("error closing redis: %v", err)
		}
	}()
	log.Println("connected to Redis successfully")

	// 4. Initialize Repositories (Domain Encapsulation)
	userRepo := user.NewRepository(pg)
	sessionRepo := auth.NewSessionRepository(rdb)
	langRepo := language.NewRepository(pg)
	curriculumRepo := curriculum.NewRepository(pg)
	curriculumCache := curriculum.NewRoadmapCacheRepository(rdb)
	exerciseRepo := exercise.NewRepository(pg)
	srsRepo := exercise.NewSRSRepository(pg)
	examRepo := exercise.NewReadinessExamRepository(pg)
	gamificationRepo := gamification.NewRepository(pg)
	leaderboardRepo := leaderboard.NewRepository(pg)

	// 5. Initialize Usecases (Business Logic Services)
	authUsecase := auth.NewUsecase(userRepo, sessionRepo, cfg)
	userUsecase := user.NewUsecase(userRepo)
	onboardingUsecase := onboarding.NewUsecaseWithCache(userRepo, langRepo, curriculumRepo, exerciseRepo, gamificationRepo, curriculumCache)
	langUsecase := language.NewUsecase(langRepo)
	curriculumUsecase := curriculum.NewUsecaseWithCache(curriculumRepo, langRepo, exerciseRepo, userRepo, gamificationRepo, curriculumCache)
	exerciseUsecase := exercise.NewUsecaseWithAccessChecker(exerciseRepo, srsRepo, examRepo, langRepo, userRepo, curriculumRepo)
	gamificationUsecase := gamification.NewUsecase(gamificationRepo)
	leaderboardUsecase := leaderboard.NewUsecase(leaderboardRepo)

	// 6. Initialize Handlers & Middlewares
	healthHandler := health.NewHandler(pg, rdb)
	authHandler := auth.NewHandler(authUsecase)
	userHandler := user.NewHandler(userUsecase)
	onboardingHandler := onboarding.NewHandler(onboardingUsecase)
	langHandler := language.NewHandler(langUsecase)
	curriculumHandler := curriculum.NewHandler(curriculumUsecase)
	exerciseHandler := exercise.NewHandler(exerciseUsecase, exerciseUsecase, exerciseUsecase)
	gamificationHandler := gamification.NewHandler(gamificationUsecase)
	leaderboardHandler := leaderboard.NewHandler(leaderboardUsecase)
	authMiddleware := middleware.AuthMiddleware(cfg.JWTSecret)
	optionalAuth := middleware.OptionalAuthMiddleware(cfg.JWTSecret)

	// 7. Setup Gin router with registered routes
	appRouter := router.SetupRouter(&router.Config{
		HealthHandler:          healthHandler,
		AuthHandler:            authHandler,
		UserHandler:            userHandler,
		OnboardingHandler:      onboardingHandler,
		LanguageHandler:        langHandler,
		CurriculumHandler:      curriculumHandler,
		ExerciseHandler:        exerciseHandler,
		GamificationHandler:    gamificationHandler,
		LeaderboardHandler:     leaderboardHandler,
		AuthMiddleware:         authMiddleware,
		OptionalAuthMiddleware: optionalAuth,
		CORSAllowedOrigins:     cfg.CORSAllowedOrigins,
	})

	// 8. Configure HTTP server
	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      appRouter,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// 9. Start server in a background goroutine
	go func() {
		log.Printf("CodeAbroad API server listening on port %s (%s environment)", cfg.Port, cfg.Env)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("server listen error: %v", err)
		}
	}()

	// 10. Graceful shutdown listening for OS signals (Ctrl+C, SIGTERM)
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("shutting down server gracefully...")

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("server forced to shutdown: %v", err)
	}
	log.Println("server exited cleanly")
}
