# System Architecture
# CodeAbroad

**Version:** 1.0  
**Last Updated:** 2026-09-28

---

## Overview

CodeAbroad follows a **microservice-inspired monolith** architecture on the backend, using event-driven communication via Kafka for async operations. The system is containerized with Docker and served behind Nginx.

---

## Architecture Diagram

```
                            ┌─────────────────────────────────┐
                            │           CLIENT                 │
                            │     React + TypeScript (Vite)    │
                            │  Zustand │ TanStack │ Axios       │
                            └─────────────────┬───────────────┘
                                              │ HTTPS
                            ┌─────────────────▼───────────────┐
                            │             NGINX                │
                            │         (Reverse Proxy)          │
                            └────────┬────────────┬───────────┘
                                     │            │
                          /api/v1/*  │            │  /* (static)
                                     │            │
                    ┌────────────────▼──┐    ┌───▼─────────────┐
                    │   Go + Gin API    │    │  Frontend Static  │
                    │   (Port 8080)     │    │    (Port 3000)    │
                    │                   │    └──────────────────┘
                    │  ┌─────────────┐  │
                    │  │   Handlers  │  │
                    │  │  (Delivery) │  │
                    │  └──────┬──────┘  │
                    │         │         │
                    │  ┌──────▼──────┐  │
                    │  │  Use Cases  │  │
                    │  │ (Business)  │  │
                    │  └──────┬──────┘  │
                    │         │         │
                    │  ┌──────▼──────┐  │
                    │  │ Repositories│  │
                    │  │  (Data)     │  │
                    │  └──────┬──────┘  │
                    └─────────┼─────────┘
                              │
            ┌─────────────────┼──────────────────┐
            │                 │                  │
    ┌───────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
    │  PostgreSQL  │  │    Redis      │  │    Kafka      │
    │  (Port 5432) │  │  (Port 6379)  │  │  (Port 9092)  │
    │              │  │               │  │               │
    │  Primary DB  │  │  - Sessions   │  │  - Events     │
    │  - users     │  │  - Streaks    │  │  - Async jobs │
    │  - quests    │  │  - Daily Q    │  │               │
    │  - progress  │  │  - XP Cache   │  │               │
    └──────────────┘  └───────────────┘  └───────┬───────┘
                                                  │
                                         ┌────────▼────────┐
                                         │  Kafka Consumer  │
                                         │   (Go Workers)   │
                                         │                  │
                                         │ - XP Service     │
                                         │ - Streak Service │
                                         │ - Achievement    │
                                         │   Service        │
                                         └─────────────────┘
```

---

## Component Breakdown

### 1. Frontend (React + TypeScript)

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| UI Components | React + Tailwind | Reusable UI elements |
| Global State | Zustand | Auth state, user data |
| Server State | TanStack Query | API data fetching, caching, sync |
| HTTP Client | Axios | API calls with interceptors |
| Routing | React Router v6 | Page navigation & protected routes |

**Key Patterns:**
- Axios interceptors for auto token refresh
- TanStack Query for all server state (quests, progress, achievements)
- Zustand only for client-only state (auth tokens, UI state)
- Protected route wrapper for authenticated pages

---

### 2. Backend (Go + Gin)

Follows **Clean Architecture** with strict layer separation:

```
cmd/
└── main.go                     ← Entry point

internal/
├── domain/                     ← Layer 1: Core (no dependencies)
│   ├── entity/                 ← Structs (User, Quest, Achievement...)
│   └── repository/             ← Repository interfaces
│
├── usecase/                    ← Layer 2: Business Logic
│   ├── auth_usecase.go
│   ├── quest_usecase.go
│   └── progress_usecase.go
│
├── repository/                 ← Layer 3: Data Access
│   ├── postgres/
│   └── redis/
│
├── delivery/
│   └── http/                   ← Layer 4: HTTP Handlers
│       ├── handler/
│       ├── middleware/
│       └── router.go
│
└── infrastructure/             ← Layer 5: External Services
    ├── database/               ← DB connection
    ├── kafka/                  ← Producer & Consumer
    └── redis/                  ← Redis client
```

---

### 3. Kafka Event Flow

```
User Action (HTTP)
      │
      ▼
Gin Handler
      │
      ▼
Use Case ──────────────────► Kafka Producer
      │                           │
      ▼                           │ (async)
Response to User                  ▼
                           Kafka Topic
                                  │
                    ┌─────────────┼──────────────┐
                    ▼             ▼               ▼
              XP Consumer   Streak Consumer   Achievement
                    │             │             Consumer
                    ▼             ▼               ▼
              Update XP     Update Streak   Check & Unlock
              in Postgres    in Redis        in Postgres
```

**Kafka Topics:**

| Topic | Producer | Consumer | Description |
|-------|----------|----------|-------------|
| `quest.completed` | Quest Handler | XP, Achievement, Streak Service | User finishes a quest |
| `user.daily_login` | Auth Handler | Streak Service | User logs in |
| `daily_quest.reset` | Scheduler | Quest Service | Midnight reset |
| `xp.gained` | XP Service | Level Checker | XP added |
| `achievement.unlocked` | Achievement Service | Notification | Badge earned |

---

### 4. Data Storage Strategy

| Data | Storage | Reason |
|------|---------|--------|
| Users, Quests, Progress | PostgreSQL | Relational, persistent |
| Refresh tokens | Redis (TTL 7d) | Fast lookup, auto-expire |
| Streak data | Redis (TTL 25h) | Fast read/write, reset daily |
| Daily quest assignments | Redis (TTL 25h) | Ephemeral, daily reset |
| XP (cached) | Redis (TTL 1h) | Reduce DB reads on dashboard |

---

### 5. Infrastructure (Docker Compose)

```yaml
services:
  nginx          → Port 80/443 (reverse proxy)
  frontend       → Port 3000 (React static / dev server)
  backend        → Port 8080 (Go API)
  postgres       → Port 5432 (primary database)
  redis          → Port 6379 (cache & sessions)
  kafka          → Port 9092 (event streaming)
  zookeeper      → Port 2181 (Kafka dependency)
```

---

## Security Architecture

```
Request Flow:
  Client ──► Nginx (TLS termination) ──► Backend
                                             │
                                     JWT Middleware
                                             │
                              ┌──────────────┴──────────────┐
                              │         Validation           │
                              │  - Signature check           │
                              │  - Expiry check              │
                              │  - Token blacklist (Redis)   │
                              └─────────────────────────────┘
```

**Security Measures:**
- HTTPS only in production (TLS at Nginx)
- JWT with short expiry (15 min access, 7 day refresh)
- Refresh token rotation on each use
- Token blacklisting on logout (Redis)
- Rate limiting at Nginx level
- Input validation on all endpoints
- Parameterized SQL queries (no raw SQL string concatenation)
- Secrets via environment variables only

---

## Git Branching & Deployment

```
feature/* ──► staging ──► main
                │             │
                ▼             ▼
          Staging Env    Production Env
          (testing)      (live)
```

| Branch | Environment | Auto-deploy |
|--------|-------------|-------------|
| `feature/*` | Local only | No |
| `staging` | Staging server | Yes (GitHub Actions) |
| `main` | Production | Yes (GitHub Actions) |
