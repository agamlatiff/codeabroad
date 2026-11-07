package session

import (
	"codeabroad/backend/internal/domain"
	infraRedis "codeabroad/backend/internal/infrastructure/redis"
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type sessionRepository struct {
	rdb *infraRedis.RedisClient
}

// NewSessionRepository creates a new Redis session repository
func NewSessionRepository(rdb *infraRedis.RedisClient) domain.SessionRepository {
	return &sessionRepository{rdb: rdb}
}

func (s *sessionRepository) SetSession(ctx context.Context, userID string, token string, ttl time.Duration) error {
	key := fmt.Sprintf("session:%s", userID)
	return s.rdb.Client.Set(ctx, key, token, ttl).Err()
}

func (s *sessionRepository) GetSession(ctx context.Context, userID string) (string, error) {
	key := fmt.Sprintf("session:%s", userID)
	token, err := s.rdb.Client.Get(ctx, key).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return "", domain.ErrTokenExpired
		}
		return "", fmt.Errorf("failed to get session from redis: %w", err)
	}
	return token, nil
}

func (s *sessionRepository) DeleteSession(ctx context.Context, userID string) error {
	key := fmt.Sprintf("session:%s", userID)
	return s.rdb.Client.Del(ctx, key).Err()
}
