package middleware

import (
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

// DefaultMaxBodyBytes limits incoming HTTP request payloads to 1 MB to prevent memory exhaustion DoS
const DefaultMaxBodyBytes int64 = 1 << 20 // 1 MB

// CORSMiddleware configures cross-origin resource sharing policy
func CORSMiddleware(allowedOrigins []string) gin.HandlerFunc {
	if len(allowedOrigins) == 0 {
		allowedOrigins = []string{"http://localhost:5173", "http://localhost:3000", "http://localhost"}
	}

	return cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}

// SecurityHeadersMiddleware attaches standard production HTTP security headers to every response
func SecurityHeadersMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Next()
	}
}

// BodySizeLimitMiddleware restricts the maximum size of incoming request bodies
func BodySizeLimitMiddleware(maxBytes int64) gin.HandlerFunc {
	if maxBytes <= 0 {
		maxBytes = DefaultMaxBodyBytes
	}
	return func(c *gin.Context) {
		if c.Request.ContentLength > maxBytes {
			c.AbortWithStatusJSON(http.StatusRequestEntityTooLarge, gin.H{
				"success": false,
				"error":   "ukuran payload request melebihi batas maksimal yang diizinkan",
				"code":    "PAYLOAD_TOO_LARGE",
			})
			return
		}
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxBytes)
		c.Next()
	}
}

type rateLimitVisitor struct {
	count     int
	expiresAt time.Time
}

type ipRateLimiter struct {
	mu          sync.Mutex
	visitors    map[string]*rateLimitVisitor
	maxRequests int
	window      time.Duration
	lastCleanup time.Time
}

func newIPRateLimiter(maxRequests int, window time.Duration) *ipRateLimiter {
	return &ipRateLimiter{
		visitors:    make(map[string]*rateLimitVisitor),
		maxRequests: maxRequests,
		window:      window,
		lastCleanup: time.Now(),
	}
}

func (l *ipRateLimiter) allow(ip string, now time.Time) (allowed bool, remaining int, retryAfterSec int) {
	l.mu.Lock()
	defer l.mu.Unlock()

	if now.Sub(l.lastCleanup) >= l.window {
		for k, v := range l.visitors {
			if now.After(v.expiresAt) {
				delete(l.visitors, k)
			}
		}
		l.lastCleanup = now
	}

	visitor, exists := l.visitors[ip]
	if !exists || now.After(visitor.expiresAt) {
		l.visitors[ip] = &rateLimitVisitor{
			count:     1,
			expiresAt: now.Add(l.window),
		}
		return true, l.maxRequests - 1, 0
	}

	if visitor.count >= l.maxRequests {
		retryAfter := int(visitor.expiresAt.Sub(now).Seconds())
		if retryAfter < 1 {
			retryAfter = 1
		}
		return false, 0, retryAfter
	}

	visitor.count++
	return true, l.maxRequests - visitor.count, 0
}

func buildRateLimitHandler(maxRequests int, window time.Duration, keyFn func(*gin.Context) string, message string) gin.HandlerFunc {
	limiter := newIPRateLimiter(maxRequests, window)

	return func(c *gin.Context) {
		key := keyFn(c)
		now := time.Now()
		allowed, remaining, retryAfter := limiter.allow(key, now)

		c.Header("X-RateLimit-Limit", fmt.Sprintf("%d", maxRequests))
		c.Header("X-RateLimit-Remaining", fmt.Sprintf("%d", remaining))

		if !allowed {
			c.Header("Retry-After", fmt.Sprintf("%d", retryAfter))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"error":   message,
				"code":    "TOO_MANY_REQUESTS",
			})
			return
		}

		c.Next()
	}
}

// RateLimitMiddleware enforces per-IP rate limiting within the given time window
func RateLimitMiddleware(maxRequests int, window time.Duration) gin.HandlerFunc {
	return buildRateLimitHandler(maxRequests, window, func(c *gin.Context) string {
		if ip := c.ClientIP(); ip != "" {
			return ip
		}
		return c.Request.RemoteAddr
	}, "terlalu banyak percobaan autentikasi, silakan coba lagi beberapa saat")
}

// UserOrIPRateLimitMiddleware enforces rate limiting keyed by authenticated userID (falling back to client IP).
func UserOrIPRateLimitMiddleware(maxRequests int, window time.Duration, message string) gin.HandlerFunc {
	if message == "" {
		message = "terlalu banyak permintaan, silakan coba lagi beberapa saat"
	}
	return buildRateLimitHandler(maxRequests, window, func(c *gin.Context) string {
		if userID := c.GetString("userID"); userID != "" {
			return "user:" + userID
		}
		if ip := c.ClientIP(); ip != "" {
			return "ip:" + ip
		}
		return "ip:" + c.Request.RemoteAddr
	}, message)
}

var distributedRateLimitScript = redis.NewScript(`
local current = redis.call("INCR", KEYS[1])
if current == 1 then
	redis.call("PEXPIRE", KEYS[1], ARGV[1])
else
	local ttl = redis.call("PTTL", KEYS[1])
	if ttl < 0 then
		redis.call("PEXPIRE", KEYS[1], ARGV[1])
	end
end
local pttl = redis.call("PTTL", KEYS[1])
return {current, pttl}
`)

// DistributedUserOrIPRateLimitMiddleware enforces distributed Redis-backed rate limiting keyed by userID
// (or client IP), falling back to an in-memory per-instance limiter if Redis is unavailable.
func DistributedUserOrIPRateLimitMiddleware(rdb *redis.Client, keyPrefix string, maxRequests int, window time.Duration, message string) gin.HandlerFunc {
	if message == "" {
		message = "terlalu banyak permintaan, silakan coba lagi beberapa saat"
	}
	fallback := UserOrIPRateLimitMiddleware(maxRequests, window, message)
	if rdb == nil {
		return fallback
	}
	if keyPrefix == "" {
		keyPrefix = "default"
	}
	windowMs := window.Milliseconds()
	if windowMs <= 0 {
		windowMs = time.Minute.Milliseconds()
	}

	return func(c *gin.Context) {
		subject := "ip:" + c.ClientIP()
		if userID := c.GetString("userID"); userID != "" {
			subject = "user:" + userID
		} else if subject == "ip:" {
			subject = "ip:" + c.Request.RemoteAddr
		}
		key := fmt.Sprintf("rl:%s:%s", keyPrefix, subject)

		vals, err := distributedRateLimitScript.Run(c.Request.Context(), rdb, []string{key}, windowMs).Int64Slice()
		if err != nil || len(vals) < 2 {
			if err != nil {
				log.Printf("middleware: redis rate limit fallback (%s): %v", keyPrefix, err)
			}
			fallback(c)
			return
		}

		count := int(vals[0])
		pttlMs := vals[1]
		remaining := maxRequests - count
		if remaining < 0 {
			remaining = 0
		}
		c.Header("X-RateLimit-Limit", fmt.Sprintf("%d", maxRequests))
		c.Header("X-RateLimit-Remaining", fmt.Sprintf("%d", remaining))

		if count > maxRequests {
			retryAfter := int((pttlMs + 999) / 1000)
			if retryAfter < 1 {
				retryAfter = 1
			}
			c.Header("Retry-After", fmt.Sprintf("%d", retryAfter))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"error":   message,
				"code":    "TOO_MANY_REQUESTS",
			})
			return
		}

		c.Next()
	}
}

