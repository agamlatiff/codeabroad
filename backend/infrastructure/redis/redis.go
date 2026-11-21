package redis

import (
	"context"
	"fmt"
	"time"

	"merantalk/backend/config"

	"github.com/redis/go-redis/v9"
)

type RedisClient struct {
	Client *redis.Client
}

func NewRedisClient(ctx context.Context, cfg *config.Config) (*RedisClient, error) {
	if cfg == nil {
		return nil, fmt.Errorf("redis config cannot be nil")
	}
	addr := fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort)

	rdb := redis.NewClient(&redis.Options{
		Addr:         addr,
		Password:     cfg.RedisPassword,
		DB:           0,
		PoolSize:     20,
		MinIdleConns: 2,
		DialTimeout:  2 * time.Second,
		ReadTimeout:  750 * time.Millisecond,
		WriteTimeout: 750 * time.Millisecond,
		MaxRetries:   1,
	})

	// Verify Redis connectivity within 5 seconds
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
	if r != nil && r.Client != nil {
		return r.Client.Close()
	}
	return nil
}

func (r *RedisClient) Ping(ctx context.Context) error {
	if r == nil || r.Client == nil {
		return fmt.Errorf("redis client is not initialized")
	}
	return r.Client.Ping(ctx).Err()
}