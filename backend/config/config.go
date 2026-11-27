package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	App      AppConfig
	Database DatabaseConfig
	Redis    RedisConfig
	JWT      JWTConfig
	OAuth    OAuthConfig
	HTTP     HTTPConfig
}

type AppConfig struct {
	Env  string
	Port string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
	TLS      bool
}

type JWTConfig struct {
	Secret                  string
	AccessExpirationMinutes int
	RefreshExpirationDays   int
}

type OAuthConfig struct {
	GoogleClientID     string
	GoogleClientSecret string
}

type HTTPConfig struct {
	CORSAllowedOrigins []string
	TrustedProxies     []string
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		if trimmed := strings.TrimSpace(value); trimmed != "" {
			return trimmed
		}
	}
	return fallback
}

const (
	defaultDevJWTSecret     = "super-secret-jwt-key-must-be-at-least-32-chars-long"
	defaultDevDBPassword    = "merantalk_secret"
	defaultDevRedisPassword = "merantalk_redis_secret"
)

func (c AppConfig) IsLocalDevOrTest() bool {
	env := strings.ToLower(strings.TrimSpace(c.Env))
	return env == "development" || env == "test"
}

func (c AppConfig) Validate() error {
	switch strings.ToLower(strings.TrimSpace(c.Env)) {
	case "development", "test", "staging", "production":
		return nil
	default:
		return fmt.Errorf("invalid ENV value %q: must be development, test, staging, or production", c.Env)
	}
}

func (c DatabaseConfig) Validate(isLocalDevOrTest bool) error {
	if isLocalDevOrTest {
		return nil
	}
	password := strings.TrimSpace(c.Password)
	if password == "" || password == defaultDevDBPassword {
		return fmt.Errorf("DB_PASSWORD must be set to a non-default value")
	}
	sslMode := strings.ToLower(strings.TrimSpace(c.SSLMode))
	if sslMode == "" || sslMode == "disable" {
		return fmt.Errorf("DB_SSLMODE cannot be 'disable'")
	}
	return nil
}

func (c RedisConfig) Validate(isLocalDevOrTest bool) error {
	if isLocalDevOrTest {
		return nil
	}
	password := strings.TrimSpace(c.Password)
	if password == "" || password == defaultDevRedisPassword {
		return fmt.Errorf("REDIS_PASSWORD must be set to a non-default value")
	}
	return nil
}

func (c JWTConfig) Validate(isLocalDevOrTest bool) error {
	if isLocalDevOrTest {
		return nil
	}
	secret := strings.TrimSpace(c.Secret)
	if secret == "" || secret == defaultDevJWTSecret || len(secret) < 32 {
		return fmt.Errorf("JWT_SECRET must be set to a non-default value of at least 32 characters")
	}
	return nil
}

func (c HTTPConfig) Validate() error {
	for _, origin := range c.CORSAllowedOrigins {
		if strings.TrimSpace(origin) == "*" {
			return fmt.Errorf("CORS_ALLOWED_ORIGINS cannot include wildcard '*' when credentials are enabled")
		}
	}
	return nil
}

func (c *Config) Validate() error {
	if c == nil {
		return fmt.Errorf("config cannot be nil")
	}
	if err := c.App.Validate(); err != nil {
		return err
	}

	isLocalDevOrTest := c.App.IsLocalDevOrTest()
	if err := c.JWT.Validate(isLocalDevOrTest); err != nil {
		return fmt.Errorf("%w in %s", err, c.App.Env)
	}
	if err := c.Database.Validate(isLocalDevOrTest); err != nil {
		return fmt.Errorf("%w in %s", err, c.App.Env)
	}
	if err := c.Redis.Validate(isLocalDevOrTest); err != nil {
		return fmt.Errorf("%w in %s", err, c.App.Env)
	}
	if err := c.HTTP.Validate(); err != nil {
		return err
	}
	return nil
}

func LoadConfig() (*Config, error) {
	if err := godotenv.Load(".env"); err != nil {
		_ = godotenv.Load("../.env")
	}

	env := strings.ToLower(getEnv("ENV", "development"))

	jwtSecret := getEnv("JWT_SECRET", defaultDevJWTSecret)
	dbPassword := getEnv("DB_PASSWORD", defaultDevDBPassword)
	dbSSLMode := strings.ToLower(getEnv("DB_SSLMODE", "disable"))
	redisPassword := strings.TrimSpace(os.Getenv("REDIS_PASSWORD"))

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
		if trimmed := strings.TrimRight(strings.TrimSpace(origin), "/"); trimmed != "" {
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

	cfg := &Config{
		App: AppConfig{
			Env:  env,
			Port: getEnv("PORT", "8080"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "merantalk"),
			Password: dbPassword,
			Name:     getEnv("DB_NAME", "merantalk"),
			SSLMode:  dbSSLMode,
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnv("REDIS_PORT", "6379"),
			Password: redisPassword,
			TLS:      strings.EqualFold(getEnv("REDIS_TLS", "false"), "true"),
		},
		JWT: JWTConfig{
			Secret:                  jwtSecret,
			AccessExpirationMinutes: jwtExpMin,
			RefreshExpirationDays:   jwtRefreshExpDays,
		},
		OAuth: OAuthConfig{
			GoogleClientID:     getEnv("GOOGLE_CLIENT_ID", ""),
			GoogleClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
		},
		HTTP: HTTPConfig{
			CORSAllowedOrigins: corsOrigins,
			TrustedProxies:     trustedProxies,
		},
	}

	if err := cfg.Validate(); err != nil {
		return nil, err
	}

	return cfg, nil
}
