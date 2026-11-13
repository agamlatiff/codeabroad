package curriculum

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"time"

	infraRedis "codeabroad/backend/infrastructure/redis"
	"github.com/redis/go-redis/v9"
)

type redisRoadmapCacheRepository struct {
	rdb *infraRedis.RedisClient
}

const roadmapEpochTTL = 7 * 24 * time.Hour

var incrRoadmapVersionScript = redis.NewScript(`
local v = redis.call("INCR", KEYS[1])
redis.call("PEXPIRE", KEYS[1], ARGV[1])
return v
`)

var setRoadmapIfVersionScript = redis.NewScript(`
local currentVer = redis.call("GET", KEYS[1])
if not currentVer then
	currentVer = "0"
end
if currentVer ~= ARGV[1] then
	return 0
end
redis.call("SET", KEYS[2], ARGV[2], "PX", ARGV[3])
return 1
`)

// NewRoadmapCacheRepository creates a new Redis-backed roadmap cache repository
func NewRoadmapCacheRepository(rdb *infraRedis.RedisClient) RoadmapCacheRepository {
	return &redisRoadmapCacheRepository{rdb: rdb}
}

func roadmapVersionKey(userID string) string {
	return fmt.Sprintf("curriculum:roadmap:{%s}:ver", userID)
}

func roadmapCacheKey(userID string, version string, languageID string) string {
	return fmt.Sprintf("curriculum:roadmap:{%s}:v%s:%s", userID, version, languageID)
}

// GetRoadmapVersion retrieves the current invalidation epoch for a user's roadmap cache
func (c *redisRoadmapCacheRepository) GetRoadmapVersion(ctx context.Context, userID string) (string, error) {
	if c.rdb == nil || c.rdb.Client == nil {
		return "0", nil
	}
	ver, err := c.rdb.Client.Get(ctx, roadmapVersionKey(userID)).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return "0", nil
		}
		return "", err
	}
	return ver, nil
}

// GetRoadmap retrieves a cached roadmap response from Redis under the user's current version epoch
func (c *redisRoadmapCacheRepository) GetRoadmap(ctx context.Context, userID string, languageID string) (*RoadmapResponse, error) {
	roadmap, _, err := c.GetRoadmapWithVersion(ctx, userID, languageID)
	return roadmap, err
}

// GetRoadmapWithVersion retrieves a cached roadmap response along with the user's current invalidation epoch
// in minimal Redis calls so callers never issue duplicate version lookups or silently fall back on errors.
func (c *redisRoadmapCacheRepository) GetRoadmapWithVersion(ctx context.Context, userID string, languageID string) (*RoadmapResponse, string, error) {
	if c.rdb == nil || c.rdb.Client == nil {
		return nil, "0", nil
	}
	ver, err := c.GetRoadmapVersion(ctx, userID)
	if err != nil {
		return nil, "", err
	}
	key := roadmapCacheKey(userID, ver, languageID)
	data, err := c.rdb.Client.Get(ctx, key).Bytes()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return nil, ver, nil
		}
		return nil, ver, err
	}

	var roadmap RoadmapResponse
	if err := json.Unmarshal(data, &roadmap); err != nil {
		log.Printf("curriculum: corrupt roadmap cache entry %s: %v", key, err)
		_ = c.rdb.Client.Del(ctx, key).Err()
		return nil, ver, nil
	}
	return &roadmap, ver, nil
}

// SetRoadmap stores a decorated roadmap in Redis using the current version epoch
func (c *redisRoadmapCacheRepository) SetRoadmap(ctx context.Context, userID string, languageID string, roadmap *RoadmapResponse, ttl time.Duration) error {
	if c.rdb == nil || c.rdb.Client == nil || roadmap == nil {
		return nil
	}
	ver, err := c.GetRoadmapVersion(ctx, userID)
	if err != nil {
		return err
	}
	return c.SetRoadmapIfVersion(ctx, userID, languageID, ver, roadmap, ttl)
}

// SetRoadmapIfVersion atomically stores a roadmap only if the user's cache version epoch still matches expectedVersion,
// eliminating stale-write races when a lesson completes concurrently during cache population.
func (c *redisRoadmapCacheRepository) SetRoadmapIfVersion(ctx context.Context, userID string, languageID string, expectedVersion string, roadmap *RoadmapResponse, ttl time.Duration) error {
	if c.rdb == nil || c.rdb.Client == nil || roadmap == nil {
		return nil
	}
	if expectedVersion == "" {
		expectedVersion = "0"
	}
	data, err := json.Marshal(roadmap)
	if err != nil {
		return fmt.Errorf("failed to marshal roadmap for cache: %w", err)
	}
	verKey := roadmapVersionKey(userID)
	dataKey := roadmapCacheKey(userID, expectedVersion, languageID)
	ttlMs := ttl.Milliseconds()
	if ttlMs <= 0 {
		ttlMs = (15 * time.Minute).Milliseconds()
	}
	return setRoadmapIfVersionScript.Run(ctx, c.rdb.Client, []string{verKey, dataKey}, expectedVersion, data, ttlMs).Err()
}

// InvalidateRoadmap atomically advances the user's roadmap cache epoch in O(1) with a bounded long TTL
func (c *redisRoadmapCacheRepository) InvalidateRoadmap(ctx context.Context, userID string) error {
	if c.rdb == nil || c.rdb.Client == nil {
		return nil
	}
	return incrRoadmapVersionScript.Run(ctx, c.rdb.Client, []string{roadmapVersionKey(userID)}, roadmapEpochTTL.Milliseconds()).Err()
}

