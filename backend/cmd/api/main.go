package main

import (
	"codeabroad/backend/internal/config"
	"codeabroad/backend/internal/repository/database"
	"codeabroad/backend/internal/repository/session"
	"codeabroad/backend/internal/usecase"
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	deliveryHttp "codeabroad/backend/internal/delivery/http"
	"codeabroad/backend/internal/delivery/http/handler"
	"codeabroad/backend/internal/delivery/http/middleware"
	"codeabroad/backend/internal/infrastructure/postgres"
	"codeabroad/backend/internal/infrastructure/redis"
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

	// 4. Initialize Repositories (Data Layer)
	userRepo := database.NewUserRepository(pg)
	sessionRepo := session.NewSessionRepository(rdb)

	// 5. Initialize Usecases (Business Logic Layer)
	authUsecase := usecase.NewAuthUsecase(userRepo, sessionRepo, cfg)


	// 6. Initialize Handlers & Middlewares (Delivery Layer)
	healthHandler := handler.NewHealthHandler(pg, rdb)
	authHandler := handler.NewAuthHandler(authUsecase)
	authMiddleware := middleware.AuthMiddleware(cfg.JWTSecret)

	// 7. Setup Gin router with registered routes
	router := deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		HealthHandler:  healthHandler,
		AuthHandler:    authHandler,
		AuthMiddleware: authMiddleware,
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