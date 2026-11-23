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

	"merantalk/backend/internal/app/auth"
	"merantalk/backend/config"
	"merantalk/backend/internal/app/curriculum"
	"merantalk/backend/internal/app/exercise"
	"merantalk/backend/internal/app/flashcard"
	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/app/health"
	"merantalk/backend/infrastructure/postgres"
	"merantalk/backend/infrastructure/redis"
	"merantalk/backend/internal/app/language"
	"merantalk/backend/internal/app/leaderboard"
	"merantalk/backend/internal/app/onboarding"
	"merantalk/backend/internal/shared/middleware"
	"merantalk/backend/internal/shared/router"
	"merantalk/backend/internal/app/user"
	"github.com/gin-gonic/gin"
)

type userStreakBadgeAdapter struct {
	repo gamification.Repository
}

func (a *userStreakBadgeAdapter) AwardStreakBadge(ctx context.Context, userID string, badgeKey string, currentLevel int) error {
	_, err := a.repo.AwardBadge(ctx, userID, badgeKey, currentLevel)
	return err
}

func main() {
	// 1. Load application configuration from .env
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("failed to load configuration: %v", err)
	}
	if cfg.Env == "production" || cfg.Env == "staging" {
		gin.SetMode(gin.ReleaseMode)
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
	curriculumCache := curriculum.NewCurriculumCacheRepository(rdb)
	exerciseRepo := exercise.NewRepository(pg)
	srsRepo := exercise.NewSRSRepository(pg)
	examRepo := exercise.NewReadinessExamRepository(pg)
	flashcardRepo := flashcard.NewRepository(pg)
	gamificationRepo := gamification.NewRepository(pg)
	leaderboardRepo := leaderboard.NewRepository(pg)

	// 5. Initialize Usecases (Business Logic Services)
	authUsecase := auth.NewUsecase(userRepo, sessionRepo, cfg)
	userUsecase := user.NewUsecaseWithBadges(userRepo, &userStreakBadgeAdapter{repo: gamificationRepo})
	onboardingUsecase := onboarding.NewUsecaseWithStore(userRepo, langRepo, curriculumRepo, exerciseRepo, gamificationRepo, curriculumCache, onboarding.NewPostgresStore(pg))
	langUsecase := language.NewUsecaseFull(langRepo, curriculumCache, gamificationRepo)
	curriculumUsecase := curriculum.NewUsecaseWithCache(curriculumRepo, langRepo, exerciseRepo, userRepo, gamificationRepo, curriculumCache)
	exerciseUsecase := exercise.NewUsecaseFull(exerciseRepo, srsRepo, examRepo, langRepo, userRepo, curriculumRepo, curriculumCache).
		WithBadgeAwarder(gamificationRepo)
	flashcardUsecase := flashcard.NewUsecaseWithBadges(flashcardRepo, userRepo, gamificationRepo)
	gamificationUsecase := gamification.NewUsecase(gamificationRepo)
	leaderboardUsecase := leaderboard.NewUsecaseWithCache(leaderboardRepo, rdb)

	// 6. Initialize Handlers & Middlewares
	healthHandler := health.NewHandler(pg, rdb)
	authLimiter := middleware.DistributedUserOrIPRateLimitMiddleware(
		rdb.Client,
		"auth:public",
		10,
		time.Minute,
		"terlalu banyak percobaan autentikasi, silakan coba lagi beberapa saat",
	)
	authHandler := auth.NewHandlerWithRateLimiter(authUsecase, authLimiter)
	authHandler.SetHelper(auth.NewHelper(cfg))
	userProfileLimiter := middleware.DistributedUserOrIPRateLimitMiddleware(
		rdb.Client,
		"user:profile_update",
		user.DefaultProfileUpdateLimit,
		time.Minute,
		user.DefaultProfileUpdateMessage,
	)
	userDailyRewardLimiter := middleware.DistributedUserOrIPRateLimitMiddleware(
		rdb.Client,
		"user:daily_reward_claim",
		user.DefaultDailyRewardClaimLimit,
		time.Minute,
		user.DefaultDailyRewardClaimMessage,
	)
	userHandler := user.NewHandlerWithRateLimiters(userUsecase, userProfileLimiter, userDailyRewardLimiter)
	onboardingLimiter := middleware.DistributedUserOrIPRateLimitMiddleware(
		rdb.Client,
		"onboarding:complete",
		onboarding.DefaultOnboardingCompleteLimit,
		time.Minute,
		onboarding.DefaultOnboardingCompleteMessage,
	)
	onboardingHandler := onboarding.NewHandlerWithRateLimiter(onboardingUsecase, onboardingLimiter)
	langSwitchLimiter := middleware.DistributedUserOrIPRateLimitMiddleware(
		rdb.Client,
		"language:switch",
		language.DefaultLanguageSwitchLimit,
		time.Minute,
		language.DefaultLanguageSwitchMessage,
	)
	langHandler := language.NewHandlerWithRateLimiter(langUsecase, langSwitchLimiter)
	curriculumLimiter := middleware.DistributedUserOrIPRateLimitMiddleware(
		rdb.Client,
		"curriculum:complete",
		30,
		time.Minute,
		"terlalu banyak percobaan penyelesaian lesson, silakan tunggu sebentar",
	)
	curriculumHandler := curriculum.NewHandlerWithRateLimiter(curriculumUsecase, curriculumLimiter)
	exerciseSubmitLimiter := middleware.DistributedUserOrIPRateLimitMiddleware(
		rdb.Client,
		"exercise:submit",
		exercise.DefaultExerciseSubmitLimit,
		time.Minute,
		exercise.DefaultExerciseSubmitMessage,
	)
	srsReviewLimiter := middleware.DistributedUserOrIPRateLimitMiddleware(
		rdb.Client,
		"srs:review",
		exercise.DefaultSRSReviewLimit,
		time.Minute,
		exercise.DefaultSRSReviewMessage,
	)
	examSubmitLimiter := middleware.DistributedUserOrIPRateLimitMiddleware(
		rdb.Client,
		"exam:submit",
		exercise.DefaultExamSubmitLimit,
		time.Minute,
		exercise.DefaultExamSubmitMessage,
	)
	exerciseHandler := exercise.NewHandlerWithRateLimiters(
		exerciseUsecase,
		exerciseUsecase,
		exerciseUsecase,
		exerciseSubmitLimiter,
		srsReviewLimiter,
		examSubmitLimiter,
	)
	flashcardReviewLimiter := middleware.DistributedUserOrIPRateLimitMiddleware(
		rdb.Client,
		"flashcard:review",
		flashcard.DefaultFlashcardReviewLimit,
		time.Minute,
		flashcard.DefaultFlashcardReviewMessage,
	)
	flashcardHandler := flashcard.NewHandlerWithRateLimiter(flashcardUsecase, flashcardReviewLimiter)
	gamificationMutationLimiter := middleware.DistributedUserOrIPRateLimitMiddleware(
		rdb.Client,
		"gamification:mutate",
		gamification.DefaultGamificationMutationLimit,
		time.Minute,
		gamification.DefaultGamificationMutationMessage,
	)
	gamificationHandler := gamification.NewHandlerWithRateLimiter(gamificationUsecase, gamificationMutationLimiter)
	leaderboardReadLimiter := middleware.DistributedUserOrIPRateLimitMiddleware(
		rdb.Client,
		"leaderboard:weekly",
		leaderboard.DefaultLeaderboardLimit,
		time.Minute,
		leaderboard.DefaultLeaderboardMessage,
	)
	leaderboardHandler := leaderboard.NewHandlerWithRateLimiter(leaderboardUsecase, leaderboardReadLimiter)
	authMiddleware := middleware.AuthMiddlewareWithSessionCheck(cfg.JWTSecret, sessionRepo)
	optionalAuth := middleware.OptionalAuthMiddlewareWithSessionCheck(cfg.JWTSecret, sessionRepo)

	// 7. Setup Gin router with registered routes
	appRouter := router.SetupRouter(&router.Config{
		HealthHandler:          healthHandler,
		AuthHandler:            authHandler,
		UserHandler:            userHandler,
		OnboardingHandler:      onboardingHandler,
		LanguageHandler:        langHandler,
		CurriculumHandler:      curriculumHandler,
		ExerciseHandler:        exerciseHandler,
		FlashcardHandler:       flashcardHandler,
		GamificationHandler:    gamificationHandler,
		LeaderboardHandler:     leaderboardHandler,
		AuthMiddleware:         authMiddleware,
		OptionalAuthMiddleware: optionalAuth,
		CORSAllowedOrigins:     cfg.CORSAllowedOrigins,
		TrustedProxies:         cfg.TrustedProxies,
	})

	// 8. Configure HTTP server
	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           appRouter,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      20 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    1 << 20,
	}

	// 9. Start server in a background goroutine
	serverErrCh := make(chan error, 1)
	go func() {
		log.Printf("Merantalk API server listening on port %s (%s environment)", cfg.Port, cfg.Env)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			serverErrCh <- err
		}
	}()

	// 10. Graceful shutdown listening for OS signals or unexpected server error
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	select {
	case <-quit:
		log.Println("shutting down server gracefully...")
	case srvErr := <-serverErrCh:
		log.Printf("server listen error: %v", srvErr)
		return
	}

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("server forced to shutdown: %v", err)
	}
	log.Println("server exited cleanly")
}
