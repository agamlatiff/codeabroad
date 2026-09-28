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
	"codeabroad/backend/internal/delivery/http/handler"
	"codeabroad/backend/internal/infrastructure/database"
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
	pg, err := database.NewPostgresDB(ctx, cfg)
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

	// 4. Initialize HTTP delivery handlers
	healthHandler := handler.NewHealthHandler(pg, rdb)

	// 5. Setup Gin router with registered routes
	router := deliveryHttp.SetupRouter(&deliveryHttp.RouterConfig{
		HealthHandler: healthHandler,
	})

	// 6. Configure HTTP server
	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// 7. Start server in a background goroutine
	go func() {
		log.Printf("CodeAbroad API server listening on port %s (%s environment)", cfg.Port, cfg.Env)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("server listen error: %v", err)
		}
	}()

	// 8. Graceful shutdown listening for OS signals (Ctrl+C, SIGTERM)
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