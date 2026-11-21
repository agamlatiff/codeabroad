# Merantalk — Developer Automation Makefile
.PHONY: help dev dev-backend build-backend test-backend test-coverage lint-backend tidy-backend \
        dev-frontend build-frontend lint-frontend install-frontend \
        docker-up docker-down docker-logs docker-ps docker-restart \
        db-migrate-up db-migrate-down db-migrate-status db-shell redis-cli

# Default target when running 'make'
help:
	@echo "=========================================================="
	@echo "🚀 Merantalk Development Commands"
	@echo "=========================================================="
	@echo "Fullstack Development:"
	@echo "  make dev                  Run both backend & frontend concurrently"
	@echo ""
	@echo "Backend Development:"
	@echo "  make dev-backend          Run Go API server locally (port 8080)"
	@echo "  make build-backend        Build Go binary into backend/bin/api"
	@echo "  make test-backend         Run all Go automated unit & HTTP tests"
	@echo "  make test-coverage        Run Go tests and generate coverage report"
	@echo "  make lint-backend         Run go vet static analysis"
	@echo "  make tidy-backend         Tidy Go module dependencies"
	@echo ""
	@echo "Frontend Development:"
	@echo "  make dev-frontend         Run Vite React dev server (port 5173)"
	@echo "  make build-frontend       Build production frontend bundle"
	@echo "  make lint-frontend        Run ESLint static analysis"
	@echo "  make install-frontend     Install frontend npm dependencies"
	@echo ""
	@echo "Docker Infrastructure:"
	@echo "  make docker-up            Start all docker containers in background"
	@echo "  make docker-down          Stop and remove docker containers"
	@echo "  make docker-logs          Follow logs of running containers"
	@echo "  make docker-ps            List status of project containers"
	@echo "  make docker-restart       Restart all docker containers"
	@echo ""
	@echo "Database & Cache CLI:"
	@echo "  make db-migrate-up        Run all pending PostgreSQL database migrations"
	@echo "  make db-migrate-down      Rollback the latest database migration"
	@echo "  make db-migrate-status    Check current database migration version"
	@echo "  make db-shell             Connect to PostgreSQL container CLI (psql)"
	@echo "  make redis-cli            Connect to Redis container CLI (redis-cli)"
	@echo "=========================================================="

# -----------------------------------------------------------------------------
# Fullstack Concurrent Runner
# -----------------------------------------------------------------------------
dev:
	@echo "Starting backend and frontend concurrently..."
	$(MAKE) -j2 dev-backend dev-frontend

# -----------------------------------------------------------------------------
# Backend Targets
# -----------------------------------------------------------------------------
dev-backend:
	cd backend && go run cmd/api/main.go

build-backend:
	cd backend && go build -o bin/api cmd/api/main.go

test-backend:
	cd backend && go test -v ./...

test-coverage:
	cd backend && go test -coverprofile=coverage.out ./... && go tool cover -html=coverage.out

lint-backend:
	cd backend && go vet ./...

tidy-backend:
	cd backend && go mod tidy

# -----------------------------------------------------------------------------
# Frontend Targets
# -----------------------------------------------------------------------------
dev-frontend:
	cd frontend && npm run dev

build-frontend:
	cd frontend && npm run build

lint-frontend:
	cd frontend && npm run lint

install-frontend:
	cd frontend && npm install

# -----------------------------------------------------------------------------
# Docker Infrastructure Targets
# -----------------------------------------------------------------------------
docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

docker-ps:
	docker compose ps

docker-restart:
	docker compose restart

# -----------------------------------------------------------------------------
# Direct Container Shell Access
# -----------------------------------------------------------------------------
db-shell:
	docker exec -it merantalk-postgres psql -U merantalk -d merantalk

redis-cli:
	docker exec -it merantalk-redis sh -c 'if [ -n "$$REDIS_PASSWORD" ]; then exec redis-cli -a "$$REDIS_PASSWORD"; else exec redis-cli; fi'

# -----------------------------------------------------------------------------
# Database Migration Runner (Supports Local Docker & Custom DB_URL Overrides)
# -----------------------------------------------------------------------------
-include .env
DB_USER ?= merantalk
DB_PASSWORD ?= merantalk_secret
DB_NAME ?= merantalk
DOCKER_MIGRATE_NET ?= container:merantalk-postgres
DB_URL ?= postgres://$(DB_USER):$(DB_PASSWORD)@localhost:5432/$(DB_NAME)?sslmode=disable

db-migrate-up:
	docker run --rm -v $(CURDIR)/backend/migrations:/migrations --network $(DOCKER_MIGRATE_NET) migrate/migrate -path=/migrations/ -database "$(DB_URL)" up

db-migrate-down:
	docker run --rm -v $(CURDIR)/backend/migrations:/migrations --network $(DOCKER_MIGRATE_NET) migrate/migrate -path=/migrations/ -database "$(DB_URL)" down 1

db-migrate-status:
	docker run --rm -v $(CURDIR)/backend/migrations:/migrations --network $(DOCKER_MIGRATE_NET) migrate/migrate -path=/migrations/ -database "$(DB_URL)" version
