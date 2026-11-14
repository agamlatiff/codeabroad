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

type redisCurriculumCacheRepository struct {
	rdb *infraRedis.RedisClient
}

const curriculumEpochTTL = 7 * 24 * time.Hour

var incrCurriculumVersionScript = redis.NewScript(`
local v = redis.call("INCR", KEYS[1])
redis.call("PEXPIRE", KEYS[1], ARGV[1])
return v
`)

var setCurriculumIfVersionScript = redis.NewScript(`
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

// NewCurriculumCacheRepository creates a new Redis-backed curriculum cache repository
func NewCurriculumCacheRepository(rdb *infraRedis.RedisClient) CurriculumCacheRepository {
	return &redisCurriculumCacheRepository{rdb: rdb}
}

func curriculumVersionKey(userID string) string {
	return fmt.Sprintf("curriculum:{%s}:ver", userID)
}

func curriculumCacheKey(userID string, version string, languageID string) string {
	return fmt.Sprintf("curriculum:{%s}:v%s:%s", userID, version, languageID)
}

// GetCurriculumVersion retrieves the current invalidation epoch for a user's curriculum cache
func (c *redisCurriculumCacheRepository) GetCurriculumVersion(ctx context.Context, userID string) (string, error) {
	if c.rdb == nil || c.rdb.Client == nil {
		return "0", nil
	}
	ver, err := c.rdb.Client.Get(ctx, curriculumVersionKey(userID)).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return "0", nil
		}
		return "", err
	}
	return ver, nil
}

// GetCurriculum retrieves a cached curriculum response from Redis under the user's current version epoch
func (c *redisCurriculumCacheRepository) GetCurriculum(ctx context.Context, userID string, languageID string) (*CurriculumResponse, error) {
	curriculum, _, err := c.GetCurriculumWithVersion(ctx, userID, languageID)
	return curriculum, err
}

// GetCurriculumWithVersion retrieves a cached curriculum response along with the user's current invalidation epoch
// in minimal Redis calls so callers never issue duplicate version lookups or silently fall back on errors.
func (c *redisCurriculumCacheRepository) GetCurriculumWithVersion(ctx context.Context, userID string, languageID string) (*CurriculumResponse, string, error) {
	if c.rdb == nil || c.rdb.Client == nil {
		return nil, "0", nil
	}
	ver, err := c.GetCurriculumVersion(ctx, userID)
	if err != nil {
		return nil, "", err
	}
	key := curriculumCacheKey(userID, ver, languageID)
	data, err := c.rdb.Client.Get(ctx, key).Bytes()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return nil, ver, nil
		}
		return nil, ver, err
	}

	var curriculum CurriculumResponse
	if err := json.Unmarshal(data, &curriculum); err != nil {
		log.Printf("curriculum: corrupt curriculum cache entry %s: %v", key, err)
		_ = c.rdb.Client.Del(ctx, key).Err()
		return nil, ver, nil
	}
	return &curriculum, ver, nil
}

// SetCurriculum stores a decorated curriculum in Redis using the current version epoch
func (c *redisCurriculumCacheRepository) SetCurriculum(ctx context.Context, userID string, languageID string, curriculum *CurriculumResponse, ttl time.Duration) error {
	if c.rdb == nil || c.rdb.Client == nil || curriculum == nil {
		return nil
	}
	ver, err := c.GetCurriculumVersion(ctx, userID)
	if err != nil {
		return err
	}
	return c.SetCurriculumIfVersion(ctx, userID, languageID, ver, curriculum, ttl)
}

// SetCurriculumIfVersion atomically stores a curriculum only if the user's cache version epoch still matches expectedVersion,
// eliminating stale-write races when a lesson completes concurrently during cache population.
func (c *redisCurriculumCacheRepository) SetCurriculumIfVersion(ctx context.Context, userID string, languageID string, expectedVersion string, curriculum *CurriculumResponse, ttl time.Duration) error {
	if c.rdb == nil || c.rdb.Client == nil || curriculum == nil || userID == "" || languageID == "" || expectedVersion == "" {
		return nil
	}
	data, err := json.Marshal(curriculum)
	if err != nil {
		return fmt.Errorf("failed to marshal curriculum for cache: %w", err)
	}
	verKey := curriculumVersionKey(userID)
	dataKey := curriculumCacheKey(userID, expectedVersion, languageID)
	ttlMs := ttl.Milliseconds()
	if ttlMs <= 0 {
		ttlMs = (15 * time.Minute).Milliseconds()
	}
	return setCurriculumIfVersionScript.Run(ctx, c.rdb.Client, []string{verKey, dataKey}, expectedVersion, data, ttlMs).Err()
}

// InvalidateCurriculum atomically advances the user's curriculum cache epoch in O(1) with a bounded long TTL
func (c *redisCurriculumCacheRepository) InvalidateCurriculum(ctx context.Context, userID string) error {
	if c.rdb == nil || c.rdb.Client == nil {
		return nil
	}
	return incrCurriculumVersionScript.Run(ctx, c.rdb.Client, []string{curriculumVersionKey(userID)}, curriculumEpochTTL.Milliseconds()).Err()
}

