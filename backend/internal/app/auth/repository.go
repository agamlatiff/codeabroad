package auth

import (
	"context"
	"errors"
	"fmt"
	"time"

	infraRedis "merantalk/backend/infrastructure/redis"
	"github.com/redis/go-redis/v9"
)

var setSessionScript = redis.NewScript(`
redis.call("SET", KEYS[1], ARGV[1], "PX", ARGV[2])
local nowMs = tonumber(ARGV[4])
local expMs = nowMs + tonumber(ARGV[2])
redis.call("ZADD", KEYS[2], expMs, ARGV[3])
redis.call("ZREMRANGEBYSCORE", KEYS[2], "-inf", nowMs)
local setTTL = redis.call("PTTL", KEYS[2])
local newTTL = tonumber(ARGV[2])
if setTTL < newTTL then
	redis.call("PEXPIRE", KEYS[2], newTTL)
end
return 1
`)

var rotateSessionScript = redis.NewScript(`
local current = redis.call("GET", KEYS[1])
if not current then
	redis.call("ZREM", KEYS[2], ARGV[4])
	return 0
end
if current ~= ARGV[1] then
	redis.call("DEL", KEYS[1])
	redis.call("ZREM", KEYS[2], ARGV[4])
	return -1
end
redis.call("SET", KEYS[1], ARGV[2], "PX", ARGV[3])
local nowMs = tonumber(ARGV[5])
local expMs = nowMs + tonumber(ARGV[3])
redis.call("ZADD", KEYS[2], expMs, ARGV[4])
redis.call("ZREMRANGEBYSCORE", KEYS[2], "-inf", nowMs)
local setTTL = redis.call("PTTL", KEYS[2])
local newTTL = tonumber(ARGV[3])
if setTTL < newTTL then
	redis.call("PEXPIRE", KEYS[2], newTTL)
end
return 1
`)

var deleteAllSessionsScript = redis.NewScript(`
local sessionIDs = redis.call("ZRANGE", KEYS[1], 0, -1)
for _, sid in ipairs(sessionIDs) do
	redis.call("DEL", ARGV[1] .. sid)
end
redis.call("DEL", KEYS[1])
return #sessionIDs
`)

type redisSessionRepository struct {
	rdb *infraRedis.RedisClient
}

// NewSessionRepository creates a new Redis session repository supporting multi-device sessions
func NewSessionRepository(rdb *infraRedis.RedisClient) SessionRepository {
	return &redisSessionRepository{rdb: rdb}
}

func sessionKey(userID string, sessionID string) string {
	return fmt.Sprintf("session:{%s}:%s", userID, sessionID)
}

func userSessionsKey(userID string) string {
	return fmt.Sprintf("user_sessions:{%s}", userID)
}

func ttlMillis(ttl time.Duration) int64 {
	ms := ttl.Milliseconds()
	if ms <= 0 {
		return 1
	}
	return ms
}

func (s *redisSessionRepository) ensureClient() error {
	if s == nil || s.rdb == nil || s.rdb.Client == nil {
		return errors.New("redis client is not initialized")
	}
	return nil
}

func (s *redisSessionRepository) SetSession(ctx context.Context, userID string, sessionID string, tokenHash string, ttl time.Duration) error {
	if err := s.ensureClient(); err != nil {
		return err
	}
	if ttl <= 0 {
		return s.DeleteSession(ctx, userID, sessionID)
	}
	nowMs := time.Now().UnixMilli()
	return setSessionScript.Run(
		ctx,
		s.rdb.Client,
		[]string{sessionKey(userID, sessionID), userSessionsKey(userID)},
		tokenHash,
		ttlMillis(ttl),
		sessionID,
		nowMs,
	).Err()
}

func (s *redisSessionRepository) GetSession(ctx context.Context, userID string, sessionID string) (string, error) {
	if err := s.ensureClient(); err != nil {
		return "", err
	}
	key := sessionKey(userID, sessionID)
	tokenHash, err := s.rdb.Client.Get(ctx, key).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return "", ErrTokenExpired
		}
		return "", fmt.Errorf("failed to get session from redis: %w", err)
	}
	return tokenHash, nil
}

func (s *redisSessionRepository) RotateSession(
	ctx context.Context,
	userID string,
	sessionID string,
	expectedTokenHash string,
	newTokenHash string,
	ttl time.Duration,
) error {
	if err := s.ensureClient(); err != nil {
		return err
	}
	if ttl <= 0 {
		_ = s.DeleteSession(ctx, userID, sessionID)
		return ErrTokenExpired
	}
	nowMs := time.Now().UnixMilli()
	res, err := rotateSessionScript.Run(
		ctx,
		s.rdb.Client,
		[]string{sessionKey(userID, sessionID), userSessionsKey(userID)},
		expectedTokenHash,
		newTokenHash,
		ttlMillis(ttl),
		sessionID,
		nowMs,
	).Int64()
	if err != nil {
		return fmt.Errorf("failed to rotate session in redis: %w", err)
	}
	if res != 1 {
		return ErrTokenExpired
	}
	return nil
}

func (s *redisSessionRepository) DeleteSession(ctx context.Context, userID string, sessionID string) error {
	if err := s.ensureClient(); err != nil {
		return err
	}
	pipe := s.rdb.Client.TxPipeline()
	pipe.Del(ctx, sessionKey(userID, sessionID))
	pipe.ZRem(ctx, userSessionsKey(userID), sessionID)
	_, err := pipe.Exec(ctx)
	return err
}

func (s *redisSessionRepository) DeleteAllSessions(ctx context.Context, userID string) error {
	if err := s.ensureClient(); err != nil {
		return err
	}
	return deleteAllSessionsScript.Run(
		ctx,
		s.rdb.Client,
		[]string{userSessionsKey(userID)},
		fmt.Sprintf("session:{%s}:", userID),
	).Err()
}
