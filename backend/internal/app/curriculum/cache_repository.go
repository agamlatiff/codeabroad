package curriculum

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/rand/v2"
	"time"

	infraRedis "codeabroad/backend/infrastructure/redis"
	"codeabroad/backend/internal/shared/apperror"
	"github.com/redis/go-redis/v9"
)

type redisCurriculumCacheRepository struct {
	rdb *infraRedis.RedisClient
}

const (
	curriculumEpochTTL      = 7 * 24 * time.Hour
	curriculumCacheBaseTTL  = 15 * time.Minute
	curriculumCacheJitterMs = 60 * 1000
)

var incrCurriculumVersionScript = redis.NewScript(`
local v = redis.call("INCR", KEYS[1])
redis.call("PEXPIRE", KEYS[1], ARGV[1])
return v
`)

var getCurriculumWithVersionScript = redis.NewScript(`
local ver = redis.call("GET", KEYS[1])
if not ver then
	ver = "0"
end
local dataKey = "curriculum:{" .. ARGV[1] .. "}:v" .. ver .. ":" .. ARGV[2]
local data = redis.call("GET", dataKey)
return {ver, data}
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

func curriculumActiveLangKey(userID string) string {
	return fmt.Sprintf("curriculum:{%s}:active_lang", userID)
}

func curriculumCacheKey(userID string, version string, languageID string) string {
	return fmt.Sprintf("curriculum:{%s}:v%s:%s", userID, version, languageID)
}

func jitteredCurriculumTTL(ttl time.Duration) time.Duration {
	if ttl <= 0 {
		ttl = curriculumCacheBaseTTL
	}
	return ttl + time.Duration(rand.IntN(curriculumCacheJitterMs))*time.Millisecond
}

// GetActiveLanguage returns the cached active language UUID for a user if present.
func (c *redisCurriculumCacheRepository) GetActiveLanguage(ctx context.Context, userID string) (string, error) {
	if c.rdb == nil || c.rdb.Client == nil || userID == "" {
		return "", nil
	}
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return "", err
	}
	langID, err := c.rdb.Client.Get(ctx, curriculumActiveLangKey(userID)).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return "", nil
		}
		return "", err
	}
	if err := apperror.ValidateEntityUUID(langID); err != nil {
		_ = c.rdb.Client.Del(ctx, curriculumActiveLangKey(userID)).Err()
		return "", nil
	}
	return langID, nil
}

// SetActiveLanguage caches a user's active language UUID in Redis.
func (c *redisCurriculumCacheRepository) SetActiveLanguage(ctx context.Context, userID string, languageID string, ttl time.Duration) error {
	if c.rdb == nil || c.rdb.Client == nil || userID == "" || languageID == "" {
		return nil
	}
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return err
	}
	if err := apperror.ValidateEntityUUID(languageID); err != nil {
		return err
	}
	return c.rdb.Client.Set(ctx, curriculumActiveLangKey(userID), languageID, jitteredCurriculumTTL(ttl)).Err()
}

// GetCurriculumVersion retrieves the current invalidation epoch for a user's curriculum cache
func (c *redisCurriculumCacheRepository) GetCurriculumVersion(ctx context.Context, userID string) (string, error) {
	if c.rdb == nil || c.rdb.Client == nil {
		return "0", nil
	}
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return "", err
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

// GetCurriculumWithVersion retrieves a cached curriculum response along with the user's current invalidation epoch
// in a single atomic Redis roundtrip using a cluster-safe Lua script to eliminate duplicate version lookups.
func (c *redisCurriculumCacheRepository) GetCurriculumWithVersion(ctx context.Context, userID string, languageID string) (*CurriculumResponse, string, error) {
	if c.rdb == nil || c.rdb.Client == nil || userID == "" || languageID == "" {
		return nil, "0", nil
	}
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, "", err
	}
	if err := apperror.ValidateEntityUUID(languageID); err != nil {
		return nil, "", err
	}

	res, err := getCurriculumWithVersionScript.Run(
		ctx,
		c.rdb.Client,
		[]string{curriculumVersionKey(userID)},
		userID,
		languageID,
	).Slice()
	if err != nil {
		return nil, "", err
	}
	if len(res) < 2 {
		return nil, "0", nil
	}

	ver, _ := res[0].(string)
	if ver == "" {
		ver = "0"
	}

	rawPayload := res[1]
	if rawPayload == nil {
		return nil, ver, nil
	}

	dataStr, ok := rawPayload.(string)
	if !ok || dataStr == "" {
		return nil, ver, nil
	}

	var curriculum CurriculumResponse
	if err := json.Unmarshal([]byte(dataStr), &curriculum); err != nil {
		key := curriculumCacheKey(userID, ver, languageID)
		log.Printf("curriculum: corrupt curriculum cache entry %s: %v", key, err)
		_ = c.rdb.Client.Del(ctx, key).Err()
		return nil, ver, nil
	}
	return &curriculum, ver, nil
}

// SetCurriculumIfVersion atomically stores a curriculum only if the user's cache version epoch still matches expectedVersion,
// eliminating stale-write races when a lesson completes concurrently during cache population.
func (c *redisCurriculumCacheRepository) SetCurriculumIfVersion(ctx context.Context, userID string, languageID string, expectedVersion string, curriculum *CurriculumResponse, ttl time.Duration) error {
	if c.rdb == nil || c.rdb.Client == nil || curriculum == nil || userID == "" || languageID == "" || expectedVersion == "" {
		return nil
	}
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return err
	}
	if err := apperror.ValidateEntityUUID(languageID); err != nil {
		return err
	}
	data, err := json.Marshal(curriculum)
	if err != nil {
		return fmt.Errorf("failed to marshal curriculum for cache: %w", err)
	}
	verKey := curriculumVersionKey(userID)
	dataKey := curriculumCacheKey(userID, expectedVersion, languageID)
	ttlMs := jitteredCurriculumTTL(ttl).Milliseconds()
	return setCurriculumIfVersionScript.Run(ctx, c.rdb.Client, []string{verKey, dataKey}, expectedVersion, data, ttlMs).Err()
}

// InvalidateCurriculum atomically advances the user's curriculum cache epoch in O(1) with a bounded long TTL
func (c *redisCurriculumCacheRepository) InvalidateCurriculum(ctx context.Context, userID string) error {
	if c.rdb == nil || c.rdb.Client == nil || userID == "" {
		return nil
	}
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return err
	}
	if err := c.rdb.Client.Del(ctx, curriculumActiveLangKey(userID)).Err(); err != nil {
		log.Printf("curriculum: failed to clear active language cache key for user %s: %v", userID, err)
	}
	return incrCurriculumVersionScript.Run(ctx, c.rdb.Client, []string{curriculumVersionKey(userID)}, curriculumEpochTTL.Milliseconds()).Err()
}

