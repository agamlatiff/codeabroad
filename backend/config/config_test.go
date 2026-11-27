package config

import (
	"strings"
	"testing"
)

func setHardenedNonDevEnv(t *testing.T, env string) {
	t.Helper()
	t.Setenv("ENV", env)
	t.Setenv("JWT_SECRET", "prod-secret-key-with-at-least-32-characters-012345")
	t.Setenv("DB_PASSWORD", "strong-prod-db-password-999")
	t.Setenv("DB_SSLMODE", "require")
	t.Setenv("REDIS_PASSWORD", "strong-prod-redis-password-999")
}

func TestLoadConfig_AllowsDefaultsInDevAndTest(t *testing.T) {
	for _, env := range []string{"development", "test"} {
		t.Run(env, func(t *testing.T) {
			t.Setenv("ENV", env)
			t.Setenv("JWT_SECRET", "")
			t.Setenv("DB_PASSWORD", "")
			t.Setenv("DB_SSLMODE", "")
			t.Setenv("REDIS_PASSWORD", "")

			cfg, err := LoadConfig()
			if err != nil {
				t.Fatalf("expected LoadConfig to allow defaults in %s, got: %v", env, err)
			}
			if cfg.App.Env != env {
				t.Fatalf("expected App.Env=%s, got %s", env, cfg.App.Env)
			}
			if cfg.App.Port == "" {
				t.Fatal("expected non-empty App.Port")
			}
			if cfg.JWT.Secret != defaultDevJWTSecret {
				t.Fatalf("expected default JWT.Secret, got %q", cfg.JWT.Secret)
			}
			if cfg.Database.Password != defaultDevDBPassword {
				t.Fatalf("expected default Database.Password, got %q", cfg.Database.Password)
			}
			if cfg.Database.SSLMode != "disable" {
				t.Fatalf("expected default Database.SSLMode='disable', got %q", cfg.Database.SSLMode)
			}
		})
	}
}

func TestLoadConfig_RejectsWeakOrDefaultCredentialsInNonDev(t *testing.T) {
	cases := []struct {
		name      string
		env       string
		override  func(t *testing.T)
		wantInErr string
	}{
		{
			name:      "staging_default_jwt",
			env:       "staging",
			override:  func(t *testing.T) { t.Setenv("JWT_SECRET", defaultDevJWTSecret) },
			wantInErr: "JWT_SECRET",
		},
		{
			name:      "production_default_db_password",
			env:       "production",
			override:  func(t *testing.T) { t.Setenv("DB_PASSWORD", defaultDevDBPassword) },
			wantInErr: "DB_PASSWORD",
		},
		{
			name:      "staging_empty_db_password",
			env:       "staging",
			override:  func(t *testing.T) { t.Setenv("DB_PASSWORD", "") },
			wantInErr: "DB_PASSWORD",
		},
		{
			name:      "production_sslmode_disable",
			env:       "production",
			override:  func(t *testing.T) { t.Setenv("DB_SSLMODE", "disable") },
			wantInErr: "DB_SSLMODE",
		},
		{
			name:      "staging_sslmode_uppercase_disable",
			env:       "staging",
			override:  func(t *testing.T) { t.Setenv("DB_SSLMODE", "DISABLE") },
			wantInErr: "DB_SSLMODE",
		},
		{
			name:      "production_empty_redis_password",
			env:       "production",
			override:  func(t *testing.T) { t.Setenv("REDIS_PASSWORD", "") },
			wantInErr: "REDIS_PASSWORD",
		},
		{
			name:      "staging_default_redis_password",
			env:       "staging",
			override:  func(t *testing.T) { t.Setenv("REDIS_PASSWORD", defaultDevRedisPassword) },
			wantInErr: "REDIS_PASSWORD",
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			setHardenedNonDevEnv(t, tc.env)
			tc.override(t)

			_, err := LoadConfig()
			if err == nil {
				t.Fatalf("expected error containing %q in %s, got nil", tc.wantInErr, tc.env)
			}
			if !strings.Contains(err.Error(), tc.wantInErr) {
				t.Fatalf("expected error to mention %q, got: %v", tc.wantInErr, err)
			}
		})
	}
}

func TestLoadConfig_AcceptsHardenedStagingAndProduction(t *testing.T) {
	for _, env := range []string{"staging", "production"} {
		t.Run(env, func(t *testing.T) {
			setHardenedNonDevEnv(t, env)

			cfg, err := LoadConfig()
			if err != nil {
				t.Fatalf("expected valid hardened %s config, got: %v", env, err)
			}
			if cfg.Database.SSLMode != "require" {
				t.Fatalf("expected normalized Database.SSLMode='require', got %q", cfg.Database.SSLMode)
			}
		})
	}
}

func TestSubConfigValidation(t *testing.T) {
	t.Run("AppConfig_Validate", func(t *testing.T) {
		for _, valid := range []string{"development", "test", "staging", "production", "PRODUCTION"} {
			if err := (AppConfig{Env: valid}).Validate(); err != nil {
				t.Fatalf("expected Env=%q to be valid, got: %v", valid, err)
			}
		}
		if err := (AppConfig{Env: "qa"}).Validate(); err == nil || !strings.Contains(err.Error(), "invalid ENV value") {
			t.Fatalf("expected invalid ENV error, got: %v", err)
		}
	})

	t.Run("DatabaseConfig_Validate", func(t *testing.T) {
		if err := (DatabaseConfig{Password: defaultDevDBPassword, SSLMode: "disable"}).Validate(true); err != nil {
			t.Fatalf("expected local dev/test to allow default DB config, got: %v", err)
		}
		if err := (DatabaseConfig{Password: "", SSLMode: "require"}).Validate(false); err == nil || !strings.Contains(err.Error(), "DB_PASSWORD") {
			t.Fatalf("expected DB_PASSWORD error for empty password, got: %v", err)
		}
		if err := (DatabaseConfig{Password: defaultDevDBPassword, SSLMode: "require"}).Validate(false); err == nil || !strings.Contains(err.Error(), "DB_PASSWORD") {
			t.Fatalf("expected DB_PASSWORD error for default password, got: %v", err)
		}
		if err := (DatabaseConfig{Password: "strong-db-pass", SSLMode: "DISABLE"}).Validate(false); err == nil || !strings.Contains(err.Error(), "DB_SSLMODE") {
			t.Fatalf("expected DB_SSLMODE error for DISABLE, got: %v", err)
		}
		if err := (DatabaseConfig{Password: "strong-db-pass", SSLMode: ""}).Validate(false); err == nil || !strings.Contains(err.Error(), "DB_SSLMODE") {
			t.Fatalf("expected DB_SSLMODE error for empty sslmode, got: %v", err)
		}
		if err := (DatabaseConfig{Password: "strong-db-pass", SSLMode: "require"}).Validate(false); err != nil {
			t.Fatalf("expected valid hardened DB config, got: %v", err)
		}
	})

	t.Run("RedisConfig_Validate", func(t *testing.T) {
		if err := (RedisConfig{Password: ""}).Validate(true); err != nil {
			t.Fatalf("expected local dev/test to allow empty Redis password, got: %v", err)
		}
		if err := (RedisConfig{Password: ""}).Validate(false); err == nil || !strings.Contains(err.Error(), "REDIS_PASSWORD") {
			t.Fatalf("expected REDIS_PASSWORD error for empty password, got: %v", err)
		}
		if err := (RedisConfig{Password: defaultDevRedisPassword}).Validate(false); err == nil || !strings.Contains(err.Error(), "REDIS_PASSWORD") {
			t.Fatalf("expected REDIS_PASSWORD error for default password, got: %v", err)
		}
		if err := (RedisConfig{Password: "strong-redis-pass"}).Validate(false); err != nil {
			t.Fatalf("expected valid hardened Redis config, got: %v", err)
		}
	})

	t.Run("JWTConfig_Validate", func(t *testing.T) {
		if err := (JWTConfig{Secret: defaultDevJWTSecret}).Validate(true); err != nil {
			t.Fatalf("expected local dev/test to allow default JWT secret, got: %v", err)
		}
		if err := (JWTConfig{Secret: defaultDevJWTSecret}).Validate(false); err == nil || !strings.Contains(err.Error(), "JWT_SECRET") {
			t.Fatalf("expected JWT_SECRET error for default secret, got: %v", err)
		}
		if err := (JWTConfig{Secret: "too-short-secret"}).Validate(false); err == nil || !strings.Contains(err.Error(), "JWT_SECRET") {
			t.Fatalf("expected JWT_SECRET error for short secret, got: %v", err)
		}
		if err := (JWTConfig{Secret: "prod-secret-key-with-at-least-32-characters-012345"}).Validate(false); err != nil {
			t.Fatalf("expected valid hardened JWT config, got: %v", err)
		}
	})

	t.Run("HTTPConfig_Validate", func(t *testing.T) {
		if err := (HTTPConfig{CORSAllowedOrigins: []string{"http://localhost:5173", "*"}}).Validate(); err == nil || !strings.Contains(err.Error(), "CORS_ALLOWED_ORIGINS") {
			t.Fatalf("expected wildcard CORS error, got: %v", err)
		}
		if err := (HTTPConfig{CORSAllowedOrigins: []string{"https://app.merantalk.com"}}).Validate(); err != nil {
			t.Fatalf("expected valid CORS origins, got: %v", err)
		}
	})
}

func TestLoadConfig_RejectsWildcardCORSAndParsesSubConfigs(t *testing.T) {
	t.Run("rejects_wildcard_cors", func(t *testing.T) {
		t.Setenv("ENV", "test")
		t.Setenv("CORS_ALLOWED_ORIGINS", "https://app.merantalk.com, *")

		_, err := LoadConfig()
		if err == nil || !strings.Contains(err.Error(), "CORS_ALLOWED_ORIGINS") {
			t.Fatalf("expected CORS_ALLOWED_ORIGINS error, got: %v", err)
		}
	})

	t.Run("parses_nested_fields", func(t *testing.T) {
		t.Setenv("ENV", "test")
		t.Setenv("PORT", "9090")
		t.Setenv("REDIS_TLS", "true")
		t.Setenv("JWT_EXPIRATION_MINUTES", "invalid")
		t.Setenv("JWT_REFRESH_EXPIRATION_DAYS", "0")
		t.Setenv("GOOGLE_CLIENT_ID", "google-client-id")
		t.Setenv("GOOGLE_CLIENT_SECRET", "google-client-secret")
		t.Setenv("CORS_ALLOWED_ORIGINS", "https://merantalk.id, https://www.merantalk.id")
		t.Setenv("TRUSTED_PROXIES", "127.0.0.1, 10.0.0.0/8")

		cfg, err := LoadConfig()
		if err != nil {
			t.Fatalf("expected LoadConfig to succeed, got: %v", err)
		}
		if cfg.App.Port != "9090" {
			t.Fatalf("expected App.Port=9090, got %q", cfg.App.Port)
		}
		if !cfg.Redis.TLS {
			t.Fatal("expected Redis.TLS=true")
		}
		if cfg.JWT.AccessExpirationMinutes != 15 || cfg.JWT.RefreshExpirationDays != 30 {
			t.Fatalf("expected JWT expiration fallbacks 15/30, got %d/%d", cfg.JWT.AccessExpirationMinutes, cfg.JWT.RefreshExpirationDays)
		}
		if cfg.OAuth.GoogleClientID != "google-client-id" || cfg.OAuth.GoogleClientSecret != "google-client-secret" {
			t.Fatalf("unexpected OAuth config: %+v", cfg.OAuth)
		}
		if len(cfg.HTTP.CORSAllowedOrigins) != 2 || len(cfg.HTTP.TrustedProxies) != 2 {
			t.Fatalf("unexpected HTTP config: %+v", cfg.HTTP)
		}
	})
}
