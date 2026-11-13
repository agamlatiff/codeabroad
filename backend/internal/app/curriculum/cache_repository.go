package curriculum

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	infraRedis "codeabroad/backend/infrastructure/redis"
	"github.com/redis/go-redis/v9"
)

type redisRoadmapCacheRepository struct {
	rdb *infraRedis.RedisClient
}

// NewRoadmapCacheRepository creates a new Redis-backed roadmap cache repository
func NewRoadmapCacheRepository(rdb *infraRedis.RedisClient) RoadmapCacheRepository {
	return &redisRoadmapCacheRepository{rdb: rdb}
}

// GetRoadmap retrieves a cached roadmap response from Redis
func (c *redisRoadmapCacheRepository) GetRoadmap(ctx context.Context, userID string, languageID string) (*RoadmapResponse, error) {
	if c.rdb == nil || c.rdb.Client == nil {
		return nil, nil
	}
	key := fmt.Sprintf("curriculum:roadmap:%s:%s", userID, languageID)
	data, err := c.rdb.Client.Get(ctx, key).Bytes()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return nil, nil
		}
		return nil, err
	}

	var roadmap RoadmapResponse
	if err := json.Unmarshal(data, &roadmap); err != nil {
		return nil, err
	}
	return &roadmap, nil
}

// SetRoadmap stores a decorated roadmap in Redis with a specified TTL
func (c *redisRoadmapCacheRepository) SetRoadmap(ctx context.Context, userID string, languageID string, roadmap *RoadmapResponse, ttl time.Duration) error {
	if c.rdb == nil || c.rdb.Client == nil || roadmap == nil {
		return nil
	}
	key := fmt.Sprintf("curriculum:roadmap:%s:%s", userID, languageID)
	data, err := json.Marshal(roadmap)
	if err != nil {
		return fmt.Errorf("failed to marshal roadmap for cache: %w", err)
	}
	return c.rdb.Client.Set(ctx, key, data, ttl).Err()
}

// InvalidateRoadmap purges all cached roadmaps for a user across all languages
func (c *redisRoadmapCacheRepository) InvalidateRoadmap(ctx context.Context, userID string) error {
	if c.rdb == nil || c.rdb.Client == nil {
		return nil
	}
	pattern := fmt.Sprintf("curriculum:roadmap:%s:*", userID)
	iter := c.rdb.Client.Scan(ctx, 0, pattern, 100).Iterator()
	var keys []string
	for iter.Next(ctx) {
		keys = append(keys, iter.Val())
	}
	if err := iter.Err(); err != nil {
		return err
	}
	if len(keys) > 0 {
		return c.rdb.Client.Del(ctx, keys...).Err()
	}
	return nil
}

