# CodeAbroad — Developer Automation Makefile
.PHONY: help dev-backend build-backend test-backend test-coverage lint-backend tidy-backend \
        docker-up docker-down docker-logs docker-ps docker-restart \
        db-shell redis-cli

# Default target when running 'make'
help:
	@echo "=========================================================="
	@echo "🚀 CodeAbroad Development Commands"
	@echo "=========================================================="
	@echo "Backend Development:"
	@echo "  make dev-backend          Run Go API server locally"
	@echo "  make build-backend        Build Go binary into backend/bin/api"
	@echo "  make test-backend         Run all Go automated unit & HTTP tests"
	@echo "  make test-coverage        Run Go tests and generate coverage report"
	@echo "  make lint-backend         Run go vet static analysis"
	@echo "  make tidy-backend         Tidy Go module dependencies"
	@echo ""
	@echo "Docker Infrastructure:"
	@echo "  make docker-up            Start all docker containers in background"
	@echo "  make docker-down          Stop and remove docker containers"
	@echo "  make docker-logs          Follow logs of running containers"
	@echo "  make docker-ps            List status of project containers"
	@echo "  make docker-restart       Restart all docker containers"
	@echo ""
	@echo "Database & Cache CLI:"
	@echo "  make db-shell             Connect to PostgreSQL container CLI (psql)"
	@echo "  make redis-cli            Connect to Redis container CLI (redis-cli)"
	@echo "=========================================================="

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
	docker exec -it codeabroad-postgres psql -U codeabroad -d codeabroad_db

redis-cli:
	docker exec -it codeabroad-redis redis-cli
