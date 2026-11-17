package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port                       string
	Env                        string
	DBHost                     string
	DBPort                     string
	DBUser                     string
	DBPassword                 string
	DBName                     string
	DBSSLMode                  string
	RedisHost                  string
	RedisPort                  string
	RedisPassword              string
	JWTSecret                  string
	JWTAccessExpirationMinutes int
	JWTRefreshExpirationDays   int
	CORSAllowedOrigins         []string
	TrustedProxies             []string
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		if trimmed := strings.TrimSpace(value); trimmed != "" {
			return trimmed
		}
	}
	return fallback
}

const defaultDevJWTSecret = "super-secret-jwt-key-must-be-at-least-32-chars-long"

func LoadConfig() (*Config, error) {
	if err := godotenv.Load(".env"); err != nil {
		_ = godotenv.Load("../.env")
	}

	env := strings.ToLower(getEnv("ENV", "development"))
	switch env {
	case "development", "test", "staging", "production":
	default:
		return nil, fmt.Errorf("invalid ENV value %q: must be development, test, staging, or production", env)
	}

	jwtSecret := getEnv("JWT_SECRET", defaultDevJWTSecret)
	isLocalDevOrTest := env == "development" || env == "test"
	if !isLocalDevOrTest && (jwtSecret == "" || jwtSecret == defaultDevJWTSecret || len(jwtSecret) < 32) {
		return nil, fmt.Errorf("JWT_SECRET must be set to a non-default value of at least 32 characters in %s", env)
	}

	jwtExpMin, err := strconv.Atoi(getEnv("JWT_EXPIRATION_MINUTES", "15"))
	if err != nil || jwtExpMin < 1 {
		jwtExpMin = 15
	}

	jwtRefreshExpDays, err := strconv.Atoi(getEnv("JWT_REFRESH_EXPIRATION_DAYS", "30"))
	if err != nil || jwtRefreshExpDays < 1 {
		jwtRefreshExpDays = 30
	}

	corsOriginsStr := getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,http://localhost")
	var corsOrigins []string
	for _, origin := range strings.Split(corsOriginsStr, ",") {
		trimmed := strings.TrimSpace(origin)
		if trimmed == "*" {
			return nil, fmt.Errorf("CORS_ALLOWED_ORIGINS cannot include wildcard '*' when credentials are enabled")
		}
		if trimmed != "" {
			corsOrigins = append(corsOrigins, trimmed)
		}
	}
	if len(corsOrigins) == 0 {
		corsOrigins = []string{"http://localhost:5173", "http://localhost:3000", "http://localhost"}
	}

	trustedProxiesStr := getEnv("TRUSTED_PROXIES", "")
	var trustedProxies []string
	for _, proxy := range strings.Split(trustedProxiesStr, ",") {
		if trimmed := strings.TrimSpace(proxy); trimmed != "" {
			trustedProxies = append(trustedProxies, trimmed)
		}
	}

	return &Config{
		Port:                       getEnv("PORT", "8080"),
		Env:                        env,
		DBHost:                     getEnv("DB_HOST", "localhost"),
		DBPort:                     getEnv("DB_PORT", "5432"),
		DBUser:                     getEnv("DB_USER", "codeabroad"),
		DBPassword:                 getEnv("DB_PASSWORD", "codeabroad_secret"),
		DBName:                     getEnv("DB_NAME", "codeabroad"),
		DBSSLMode:                  getEnv("DB_SSLMODE", "disable"),
		RedisHost:                  getEnv("REDIS_HOST", "localhost"),
		RedisPort:                  getEnv("REDIS_PORT", "6379"),
		RedisPassword:              strings.TrimSpace(os.Getenv("REDIS_PASSWORD")),
		JWTSecret:                  jwtSecret,
		JWTAccessExpirationMinutes: jwtExpMin,
		JWTRefreshExpirationDays:   jwtRefreshExpDays,
		CORSAllowedOrigins:         corsOrigins,
		TrustedProxies:             trustedProxies,
	}, nil
}
