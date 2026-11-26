package handler

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"

	"merantalk/backend/config"
	"merantalk/backend/infrastructure/postgres"
	"merantalk/backend/infrastructure/redis"
	"merantalk/backend/internal/app/auth"
	"merantalk/backend/internal/app/curriculum"
	"merantalk/backend/internal/app/exercise"
	"merantalk/backend/internal/app/flashcard"
	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/app/health"
	"merantalk/backend/internal/app/language"
	"merantalk/backend/internal/app/leaderboard"
	"merantalk/backend/internal/app/onboarding"
	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/middleware"
	"merantalk/backend/internal/shared/router"
)

type userStreakBadgeAdapter struct {
	repo gamification.Repository
}

func (a *userStreakBadgeAdapter) AwardStreakBadge(ctx context.Context, userID string, badgeKey string, currentLevel int) (bool, error) {
	ub, err := a.repo.AwardBadge(ctx, userID, badgeKey, currentLevel)
	if err != nil {
		return false, err
	}
	return ub != nil && ub.NewlyAwarded, nil
}

var (
	initOnce  sync.Once
	appEngine *gin.Engine
	initErr   error
)

func initRouter() (*gin.Engine, error) {
	cfg, err := config.LoadConfig()
	if err != nil {
		return nil, fmt.Errorf("failed to load configuration: %w", err)
	}
	if cfg.Env == "production" || cfg.Env == "staging" {
		gin.SetMode(gin.ReleaseMode)
	}

	ctx := context.Background()

	pg, err := postgres.NewPostgresDB(ctx, cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to postgres: %w", err)
	}

	rdb, err := redis.NewRedisClient(ctx, cfg)
	if err != nil {
		pg.Close()
		return nil, fmt.Errorf("failed to connect to redis: %w", err)
	}

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

	return router.SetupRouter(&router.Config{
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
	}), nil
}

// Handler is the Vercel Go Serverless Function entrypoint forwarding all requests to the Gin router.
func Handler(w http.ResponseWriter, r *http.Request) {
	initOnce.Do(func() {
		appEngine, initErr = initRouter()
		if initErr != nil {
			log.Printf("vercel handler init error: %v", initErr)
		}
	})

	if initErr != nil || appEngine == nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusServiceUnavailable)
		_, _ = w.Write([]byte(`{"status":"error","message":"service initialization failed; check server environment variables"}`))
		return
	}

	q := r.URL.Query()
	originalPath := ""
	if vals := q["__path"]; len(vals) > 0 {
		for i := len(vals) - 1; i >= 0; i-- {
			if strings.TrimSpace(vals[i]) != "" {
				originalPath = vals[i]
				break
			}
		}
		q.Del("__path")
	} else if p := strings.TrimSpace(q.Get("path")); p != "" && (r.URL.Path == "/api/index" || r.URL.Path == "/") {
		originalPath = "/api/v1/" + strings.TrimLeft(p, "/")
		q.Del("path")
	}

	if originalPath != "" {
		if !strings.HasPrefix(originalPath, "/") {
			originalPath = "/" + originalPath
		}
		for strings.HasPrefix(originalPath, "//") {
			originalPath = strings.TrimPrefix(originalPath, "/")
		}
		r.URL.Path = originalPath
		r.URL.RawPath = ""
		r.URL.RawQuery = q.Encode()
		r.RequestURI = r.URL.RequestURI()
	} else if r.URL.Path == "/" || r.URL.Path == "/api/index" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok","service":"merantalk-api","health":"/api/v1/health"}`))
		return
	}

	appEngine.ServeHTTP(w, r)
}
