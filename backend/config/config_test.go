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
			if cfg.Env != env {
				t.Fatalf("expected Env=%s, got %s", env, cfg.Env)
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
			if cfg.DBSSLMode != "require" {
				t.Fatalf("expected normalized DBSSLMode='require', got %q", cfg.DBSSLMode)
			}
		})
	}
}
