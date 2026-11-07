package middleware

import (
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

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

	// Periodic lazy eviction of expired IP buckets to prevent memory growth
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

// RateLimitMiddleware enforces per-IP rate limiting within the given time window (protects Login & Register against brute-force)
func RateLimitMiddleware(maxRequests int, window time.Duration) gin.HandlerFunc {
	limiter := newIPRateLimiter(maxRequests, window)

	return func(c *gin.Context) {
		clientIP := c.ClientIP()
		if clientIP == "" {
			clientIP = c.Request.RemoteAddr
		}

		now := time.Now()
		allowed, remaining, retryAfter := limiter.allow(clientIP, now)

		c.Header("X-RateLimit-Limit", fmt.Sprintf("%d", maxRequests))
		c.Header("X-RateLimit-Remaining", fmt.Sprintf("%d", remaining))

		if !allowed {
			c.Header("Retry-After", fmt.Sprintf("%d", retryAfter))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"error":   "terlalu banyak percobaan autentikasi, silakan coba lagi beberapa saat",
				"code":    "TOO_MANY_REQUESTS",
			})
			return
		}

		c.Next()
	}
}

