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

	"codeabroad/backend/internal/config"
	deliveryHttp "codeabroad/backend/internal/delivery/http"
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
	"codeabroad/backend/internal/infrastructure/postgres"
	"codeabroad/backend/internal/infrastructure/redis"
	"codeabroad/backend/internal/repository/database"
	"codeabroad/backend/internal/repository/session"
	authUsecasePkg "codeabroad/backend/internal/usecase/auth"
	curriculumUsecasePkg "codeabroad/backend/internal/usecase/curriculum"
	exerciseUsecasePkg "codeabroad/backend/internal/usecase/exercise"
	gamificationUsecasePkg "codeabroad/backend/internal/usecase/gamification"
	languageUsecasePkg "codeabroad/backend/internal/usecase/language"
	leaderboardUsecasePkg "codeabroad/backend/internal/usecase/leaderboard"
	onboardingUsecasePkg "codeabroad/backend/internal/usecase/onboarding"
	userUsecasePkg "codeabroad/backend/internal/usecase/user"
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

	// 4. Initialize Repositories (Data Layer v3.0)
	userRepo := database.NewUserRepository(pg)
	sessionRepo := session.NewSessionRepository(rdb)
	langRepo := database.NewLanguageRepository(pg)
	curriculumRepo := database.NewCurriculumRepository(pg)
	exerciseRepo := database.NewExerciseRepository(pg)
	srsRepo := database.NewSRSRepository(pg)
	examRepo := database.NewReadinessExamRepository(pg)
	gamificationRepo := database.NewGamificationRepository(pg)
	leaderboardRepo := database.NewLeaderboardRepository(pg)

	// 5. Initialize Usecases (Business Logic Layer v3.0)
	authUsecase := authUsecasePkg.New(userRepo, sessionRepo, cfg)
	userUsecase := userUsecasePkg.New(userRepo)
	onboardingUsecase := onboardingUsecasePkg.New(userRepo, langRepo, curriculumRepo, exerciseRepo, gamificationRepo)
	langUsecase := languageUsecasePkg.New(langRepo)
	curriculumUsecase := curriculumUsecasePkg.New(curriculumRepo, langRepo, exerciseRepo, userRepo, gamificationRepo)
	exerciseUsecase := exerciseUsecasePkg.New(exerciseRepo, srsRepo, examRepo, langRepo, userRepo)
	gamificationUsecase := gamificationUsecasePkg.New(gamificationRepo)
	leaderboardUsecase := leaderboardUsecasePkg.New(leaderboardRepo)

	// 6. Initialize Handlers & Middlewares (Delivery Layer v3.0)
	healthHandler := healthHandlerPkg.New(pg, rdb)
	authHandler := authHandlerPkg.New(authUsecase)
	userHandler := userHandlerPkg.New(userUsecase)
	onboardingHandler := onboardingHandlerPkg.New(onboardingUsecase)
	langHandler := languageHandlerPkg.New(langUsecase)
	curriculumHandler := curriculumHandlerPkg.New(curriculumUsecase)
	exerciseHandler := exerciseHandlerPkg.New(exerciseUsecase, exerciseUsecase, exerciseUsecase)
	gamificationHandler := gamificationHandlerPkg.New(gamificationUsecase)
	leaderboardHandler := leaderboardHandlerPkg.New(leaderboardUsecase)
	authMiddleware := middleware.AuthMiddleware(cfg.JWTSecret)
	optionalAuth := middleware.OptionalAuthMiddleware(cfg.JWTSecret)

	// 7. Setup Gin router with registered routes
	router := deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
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
		Handler:      router,
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
