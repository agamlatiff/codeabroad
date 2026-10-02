package postgres

import (
	"codeabroad/backend/internal/config"
	"context"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

// PostgresDB wraps the PostgreSQL connection pool
type PostgresDB struct {
	Pool *pgxpool.Pool
}

func NewPostgresDB(ctx context.Context, cfg *config.Config) (*PostgresDB, error) {
	// Build the connection URI
	connStr := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBHost,
		cfg.DBPort,
		cfg.DBName,
		cfg.DBSSLMode,
	)

	// Parse pool configuration
	poolConfig, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to parse postgres config: %w", err)
	}

	// Connection pool tuning parameters
	poolConfig.MaxConns = 25
	poolConfig.MinConns = 2
	poolConfig.MaxConnLifetime = 1 * time.Hour
	poolConfig.MaxConnIdleTime = 30 * time.Minute

	// Create the connection pool
	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to create postgres connection pool: %w", err)
	}

	// Fail-fast verification: ensure database is reachable
	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if err := pool.Ping(pingCtx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to ping postgres database: %w", err)
	}
	return &PostgresDB{Pool: pool}, nil
}

// Close gracefully releases all connections in the pool
func (p *PostgresDB) Close() {
	if p.Pool != nil {
		p.Pool.Close()
	}
}
// Ping verifies whether the database connection is still alive
func (p *PostgresDB) Ping(ctx context.Context) error {
	return p.Pool.Ping(ctx)
}
