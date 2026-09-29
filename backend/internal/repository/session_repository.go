package redis

import (
	"context"
	"fmt"
	"time"
	"codeabroad/backend/internal/domain"
	infraRedis "codeabroad/backend/internal/infrastructure/redis"
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
	return s.rdb.Client.Get(ctx, key).Result()
}

func (s *sessionRepository) DeleteSession(ctx context.Context, userID string) error {
	key := fmt.Sprintf("session:%s", userID)
	return s.rdb.Client.Del(ctx, key).Err()
}