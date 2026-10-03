package config

import (
	"github.com/joho/godotenv"
	"os"
	"strconv"
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
	KafkaBrokers               string
	JWTSecret                  string
	JWTAccessExpirationMinutes int
	JWTRefreshExpirationDays   int
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists && value != "" {
		return value
	}
	return fallback
}

func LoadConfig() (*Config, error) {
	if err := godotenv.Load(".env"); err != nil {
		_ = godotenv.Load("../.env")
	}

	jwtExpMin, err := strconv.Atoi(getEnv("JWT_EXPIRATION_MINUTES", "15"))
	if err != nil {
		jwtExpMin = 15
	}

	jwtRefreshExpDays, err := strconv.Atoi(getEnv("JWT_REFRESH_EXPIRATION_DAYS", "30"))
	if err != nil {
		jwtRefreshExpDays = 30
	}

	return &Config{
		Port:                     getEnv("PORT", "8080"),
		Env:                      getEnv("ENV", "development"),
		DBHost:                   getEnv("DB_HOST", "localhost"),
		DBPort:                   getEnv("DB_PORT", "5432"),
		DBUser:                   getEnv("DB_USER", "codeabroad"),
		DBPassword:               getEnv("DB_PASSWORD", "codeabroad_secret"),
		DBName:                   getEnv("DB_NAME", "codeabroad"),
		DBSSLMode:                getEnv("DB_SSLMODE", "disable"),
		RedisHost:                getEnv("REDIS_HOST", "localhost"),
		RedisPort:                getEnv("REDIS_PORT", "6379"),
		RedisPassword:            getEnv("REDIS_PASSWORD", ""),
		KafkaBrokers:             getEnv("KAFKA_BROKERS", "localhost:9092"),
		JWTSecret:                getEnv("JWT_SECRET", "super-secret-jwt-key-must-be-at-least-32-chars-long"),
		JWTAccessExpirationMinutes:     jwtExpMin,
		JWTRefreshExpirationDays: jwtRefreshExpDays,
	}, nil
}
