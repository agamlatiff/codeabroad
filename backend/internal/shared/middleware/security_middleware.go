package middleware

import (
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
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

// RateLimitMiddleware enforces per-IP rate limiting within the given time window
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

