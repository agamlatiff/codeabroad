package redis

import (
	"context"
	"fmt"
	"time"

	"codeabroad/backend/internal/config"

	"github.com/redis/go-redis/v9"
)

type RedisClient struct {
	Client *redis.Client
}

func NewRedisClient(ctx context.Context, cfg *config.Config) (*RedisClient, error) {
	addr := fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort)

	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: cfg.RedisPassword,
		DB:       0,
	})

	// Checking Redis with a context timeout of 5 minutes
	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	// Ensure Redis Ping is Successful
	if err := rdb.Ping(pingCtx).Err(); err != nil {
		_ = rdb.Close()
		return nil, fmt.Errorf("failed to ping redis: %w", err)
	}

	return &RedisClient{Client: rdb}, nil
}


func (r *RedisClient) Close() error {
	if r.Client != nil {
		return r.Client.Close()
	}
	return nil
}

func (r *RedisClient) Ping(ctx context.Context) error {
	return r.Client.Ping(ctx).Err()
}