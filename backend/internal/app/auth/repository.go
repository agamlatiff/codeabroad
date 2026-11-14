package auth

import (
	"context"
	"errors"
	"fmt"
	"time"

	infraRedis "codeabroad/backend/infrastructure/redis"
	"github.com/redis/go-redis/v9"
)

var setSessionScript = redis.NewScript(`
redis.call("SET", KEYS[1], ARGV[1], "PX", ARGV[2])
redis.call("SADD", KEYS[2], ARGV[3])
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
	redis.call("SREM", KEYS[2], ARGV[4])
	return 0
end
if current ~= ARGV[1] then
	redis.call("DEL", KEYS[1])
	redis.call("SREM", KEYS[2], ARGV[4])
	return -1
end
redis.call("SET", KEYS[1], ARGV[2], "PX", ARGV[3])
redis.call("SADD", KEYS[2], ARGV[4])
local setTTL = redis.call("PTTL", KEYS[2])
local newTTL = tonumber(ARGV[3])
if setTTL < newTTL then
	redis.call("PEXPIRE", KEYS[2], newTTL)
end
return 1
`)

type redisSessionRepository struct {
	rdb *infraRedis.RedisClient
}

// NewSessionRepository creates a new Redis session repository supporting multi-device sessions
func NewSessionRepository(rdb *infraRedis.RedisClient) SessionRepository {
	return &redisSessionRepository{rdb: rdb}
}

func sessionKey(userID string, sessionID string) string {
	return fmt.Sprintf("session:%s:%s", userID, sessionID)
}

func userSessionsKey(userID string) string {
	return fmt.Sprintf("user_sessions:%s", userID)
}

func ttlMillis(ttl time.Duration) int64 {
	ms := ttl.Milliseconds()
	if ms <= 0 {
		return 1
	}
	return ms
}

func (s *redisSessionRepository) SetSession(ctx context.Context, userID string, sessionID string, tokenHash string, ttl time.Duration) error {
	if ttl <= 0 {
		return s.DeleteSession(ctx, userID, sessionID)
	}
	return setSessionScript.Run(
		ctx,
		s.rdb.Client,
		[]string{sessionKey(userID, sessionID), userSessionsKey(userID)},
		tokenHash,
		ttlMillis(ttl),
		sessionID,
	).Err()
}

func (s *redisSessionRepository) GetSession(ctx context.Context, userID string, sessionID string) (string, error) {
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
	if ttl <= 0 {
		_ = s.DeleteSession(ctx, userID, sessionID)
		return ErrTokenExpired
	}
	res, err := rotateSessionScript.Run(
		ctx,
		s.rdb.Client,
		[]string{sessionKey(userID, sessionID), userSessionsKey(userID)},
		expectedTokenHash,
		newTokenHash,
		ttlMillis(ttl),
		sessionID,
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
	pipe := s.rdb.Client.TxPipeline()
	pipe.Del(ctx, sessionKey(userID, sessionID))
	pipe.SRem(ctx, userSessionsKey(userID), sessionID)
	_, err := pipe.Exec(ctx)
	return err
}

func (s *redisSessionRepository) DeleteAllSessions(ctx context.Context, userID string) error {
	setKey := userSessionsKey(userID)
	sessionIDs, err := s.rdb.Client.SMembers(ctx, setKey).Result()
	if err != nil && !errors.Is(err, redis.Nil) {
		return fmt.Errorf("failed to list user sessions: %w", err)
	}
	if len(sessionIDs) == 0 {
		return nil
	}

	keys := make([]string, 0, len(sessionIDs)+1)
	for _, sessionID := range sessionIDs {
		keys = append(keys, sessionKey(userID, sessionID))
	}
	keys = append(keys, setKey)
	return s.rdb.Client.Del(ctx, keys...).Err()
}
