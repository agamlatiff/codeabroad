package auth

import (
	"context"
	"errors"
	"fmt"
	"time"

	infraRedis "codeabroad/backend/infrastructure/redis"
	"github.com/redis/go-redis/v9"
)

type redisSessionRepository struct {
	rdb *infraRedis.RedisClient
}

// NewSessionRepository creates a new Redis session repository supporting multi-device sessions
func NewSessionRepository(rdb *infraRedis.RedisClient) SessionRepository {
	return &redisSessionRepository{rdb: rdb}
}

func (s *redisSessionRepository) SetSession(ctx context.Context, userID string, sessionID string, token string, ttl time.Duration) error {
	key := fmt.Sprintf("session:%s:%s", userID, sessionID)
	return s.rdb.Client.Set(ctx, key, token, ttl).Err()
}

func (s *redisSessionRepository) GetSession(ctx context.Context, userID string, sessionID string) (string, error) {
	key := fmt.Sprintf("session:%s:%s", userID, sessionID)
	token, err := s.rdb.Client.Get(ctx, key).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return "", ErrTokenExpired
		}
		return "", fmt.Errorf("failed to get session from redis: %w", err)
	}
	return token, nil
}

func (s *redisSessionRepository) DeleteSession(ctx context.Context, userID string, sessionID string) error {
	key := fmt.Sprintf("session:%s:%s", userID, sessionID)
	return s.rdb.Client.Del(ctx, key).Err()
}

func (s *redisSessionRepository) DeleteAllSessions(ctx context.Context, userID string) error {
	pattern := fmt.Sprintf("session:%s:*", userID)
	var keys []string
	iter := s.rdb.Client.Scan(ctx, 0, pattern, 0).Iterator()
	for iter.Next(ctx) {
		keys = append(keys, iter.Val())
	}
	if err := iter.Err(); err != nil {
		return fmt.Errorf("failed to scan user sessions: %w", err)
	}
	if len(keys) == 0 {
		return nil
	}
	return s.rdb.Client.Del(ctx, keys...).Err()
}
