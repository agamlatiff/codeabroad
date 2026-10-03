  # Feature: User Authentication & Session Management (01-auth-service)

  > **Branch:** `feature/auth-service`  
  > **Status:** In Progress (Backend HTTP Delivery phase)  
  > **Scope:** Full-stack vertical slice (Backend ➔ Frontend ➔ DevOps / Deployment)

  ---

  ## 📌 1. Feature Overview

  The **Authentication & Session Service** provides secure, token-based authentication for the CodeAbroad platform. It enables Indonesian developers to register, log in, maintain active sessions with automatic token rotation, and access their authenticated user profiles.

  ### Key Capabilities:
  - **Registration & Login:** Secure password hashing with Bcrypt, unique email and username validation.
  - **Dual-Token System (JWT):** Short-lived Access Token (15m) + Long-lived Refresh Token (7d).
  - **Token Rotation & Invalidation:** Refresh tokens are tracked in Redis under `session:{user_id}` and rotated on every refresh.
  - **Role & Profile Access:** Protected endpoint to retrieve authenticated user details.
  - **Seamless Frontend Interceptor:** Axios client automatically catches `401 Unauthorized` and rotates tokens without user interruption.

  ---

  ## 🏗️ 2. Architecture & Data Flow

  ```text
  [ Browser / React Client ]
        │  (Axios Interceptor + Zustand Store)
        ▼
    [ Nginx ]  (Reverse Proxy: /api ➔ Backend, / ➔ Frontend)
        │
        ▼
  [ Gin Router ]
        │
        ├── Public Routes: /api/v1/auth/register, /login, /refresh
        │       └── AuthHandler ➔ AuthUsecase ➔ UserRepository / SessionRepository
        │
        └── Protected Routes: /api/v1/users/me
                └── AuthMiddleware (Bearer JWT check) ➔ AuthHandler ➔ AuthUsecase
  ```

  ---

  ## 📋 3. OpenAPI / API Contract Specification

  **Base URL:** `http://localhost:8080/api/v1`

  ### 3.1 Register User
  - **Method / Path:** `POST /api/v1/auth/register`
  - **Access:** Public
  - **Request Headers:** `Content-Type: application/json`
  - **Request Body:**
    ```json
    {
      "name": "Budi Pratama",
      "username": "budipratama",
      "email": "budi@example.com",
      "password": "Password123!"
    }
    ```
  - **Responses:**
    - `201 Created`
      ```json
      {
        "success": true,
        "message": "user registered successfully",
        "data": {
          "access_token": "eyJhbGciOi...",
          "refresh_token": "eyJhbGciOi...",
          "user": {
            "id": "usr_c48b2d1...",
            "name": "Budi Pratama",
            "username": "budipratama",
            "email": "budi@example.com",
            "level": "beginner",
            "xp": 0,
            "current_level": 1,
            "streak": 0,
            "is_onboarded": false,
            "created_at": "2026-10-01T12:00:00Z"
          }
        }
      }
      ```
    - `400 Bad Request` (Validation error):
      ```json
      {
        "success": false,
        "error": "invalid request payload",
        "code": "BAD_REQUEST"
      }
      ```
    - `409 Conflict` (Duplicate email/username):
      ```json
      {
        "success": false,
        "error": "email is already registered",
        "code": "CONFLICT"
      }
      ```

  ---

  ### 3.2 Login User
  - **Method / Path:** `POST /api/v1/auth/login`
  - **Access:** Public
  - **Request Body:**
    ```json
    {
      "email": "budi@example.com",
      "password": "Password123!"
    }
    ```
  - **Responses:**
    - `200 OK`
      ```json
      {
        "success": true,
        "message": "login successful",
        "data": {
          "access_token": "eyJhbGciOi...",
          "refresh_token": "eyJhbGciOi...",
          "user": {
            "id": "usr_c48b2d1...",
            "name": "Budi Pratama",
            "username": "budipratama",
            "email": "budi@example.com",
            "level": "beginner",
            "xp": 0,
            "current_level": 1,
            "streak": 0,
            "is_onboarded": false
          }
        }
      }
      ```
    - `401 Unauthorized` (Invalid credentials):
      ```json
      {
        "success": false,
        "error": "invalid email or password",
        "code": "UNAUTHORIZED"
      }
      ```

  ---

  ### 3.3 Refresh Token (Token Rotation)
  - **Method / Path:** `POST /api/v1/auth/refresh`
  - **Access:** Public (Requires valid Refresh Token in payload)
  - **Request Body:**
    ```json
    {
      "refresh_token": "eyJhbGciOi..."
    }
    ```
  - **Responses:**
    - `200 OK`
      ```json
      {
        "success": true,
        "message": "token refreshed successfully",
        "data": {
          "access_token": "eyJhbGciOi...new_access_token...",
          "refresh_token": "eyJhbGciOi...new_refresh_token...",
          "user": {
            "id": "usr_c48b2d1...",
            "name": "Budi Pratama",
            "email": "budi@example.com"
          }
        }
      }
      ```
    - `401 Unauthorized` (Revoked or expired refresh token):
      ```json
      {
        "success": false,
        "error": "refresh token has been revoked or expired",
        "code": "UNAUTHORIZED"
      }
      ```

  ---

  ### 3.4 Get Current User Profile
  - **Method / Path:** `GET /api/v1/users/me`
  - **Access:** Protected (Requires `Authorization: Bearer <access_token>`)
  - **Responses:**
    - `200 OK`
      ```json
      {
        "success": true,
        "message": "user profile retrieved successfully",
        "data": {
          "id": "usr_c48b2d1...",
          "name": "Budi Pratama",
          "username": "budipratama",
          "email": "budi@example.com",
          "level": "beginner",
          "xp": 0,
          "current_level": 1,
          "streak": 0,
          "is_onboarded": false,
          "created_at": "2026-10-01T12:00:00Z"
        }
      }
      ```
    - `401 Unauthorized` (Missing or invalid Bearer token):
      ```json
      {
        "success": false,
        "error": "authorization header is required",
        "code": "UNAUTHORIZED"
      }
      ```

  ---

  ### 3.5 Logout User (Server-Side Session Revocation)
  - **Method / Path:** `POST /api/v1/auth/logout`
  - **Access:** Protected (Requires `Authorization: Bearer <access_token>`)
  - **Responses:**
    - `200 OK`
      ```json
      {
        "success": true,
        "message": "logout successful",
        "data": null
      }
      ```
    - `401 Unauthorized` (Missing or invalid Bearer token):
      ```json
      {
        "success": false,
        "error": "authorization header is required",
        "code": "UNAUTHORIZED"
      }
      ```

  ---

  ## ✅ 4. End-to-End Implementation Tracker

  ### Phase A: Backend (Golang + Clean Architecture)
  - [x] **Database Migration:** `users` table created with indexes on `email` and `username`.
  - [x] **Domain Layer:** Entities (`User`), DTOs (`RegisterRequest`, `LoginRequest`, `AuthResponse`), and repository interfaces in `internal/domain/user.go`.
  - [x] **DTO Validation:** Strict min/max bounds (`name`: 2-100, `username`: 3-30, `email`: max 255, `password`: 8-72).
  - [x] **Repository Layer (PostgreSQL):** `internal/repository/postgres/user_repository.go` implementing `Create`, `GetByEmail`, `GetByUsername`, `GetByID`.
  - [x] **Session Store Layer (Redis):** `internal/repository/session_repository.go` with TTL-based Redis keys `session:{user_id}` and `DeleteSession`.
  - [x] **Usecase Layer:** `internal/usecase/auth_usecase.go` with Bcrypt hashing, dynamic session tracking (1d vs 30d Remember Me), server-side logout, and JWT token rotation.
  - [x] **Delivery Middleware:** `internal/delivery/http/middleware/auth_middleware.go` validating Bearer JWT and storing user claims into Gin context.
  - [x] **Delivery Handler:** `internal/delivery/http/handler/auth_handler.go` with Gin handlers for `/register`, `/login`, `/refresh`, `/logout`, and `/me`.
  - [x] **Router & Dependency Injection:** Wire usecase, handler, and middleware in `internal/delivery/http/router.go` and `cmd/api/main.go`.
  - [x] **Automated Unit & Integration Tests:** Auth Usecase and HTTP Handler test suites in `auth_usecase_test.go` and `auth_handler_test.go`.

  ---

  ### Phase B: Frontend (React + TypeScript + Vite + Tailwind CSS + Zustand)
  - [x] **Project Setup:** Initialize Vite React TypeScript app in `frontend/`.
  - [x] **Design Tokens & Theme:** Clean Japanese tech aesthetic with mint accents, pastel podium cards, and responsive 100vh layout.
  - [x] **Axios Client & Auto-Refresh Interceptor:** Setup HTTP client with interceptor to handle `401` by calling `/api/v1/auth/refresh` seamlessly.
  - [x] **Zustand State Store (`useAuthStore`):** Manage `user`, `accessToken`, `isAuthenticated`, `login`, `logout` with `localStorage` persistence.
  - [x] **Authentication Pages:**
    - `RegisterPage.tsx`: Input validation, password strength meter, client-side preflight length checks, responsive companion card.
    - `LoginPage.tsx`: Credentials input, remember me toggle, responsive split-screen layout, error alerts.
  - [x] **Protected Route Component:** Router wrapper redirecting unauthenticated users to `/login`.
  - [x] **Profile / Dashboard Screen (`/dashboard`):** Display user avatar, level, streak, XP, token verification test, and server-side logout.
  - [x] **Gamified Avatar Kit & Mascot:** Deterministic SVG developer avatars (`adventurer`, `bottts`, `lorelei`) and Kodi bear mascot poses (`welcome`, `coding`, `celebrate`).

  ---

  ### Phase C: DevOps & Container Integration
  - [x] **Backend Dockerfile:** Multi-stage build for Go binary (`golang:1.24-alpine` builder ➔ `alpine:3.20` non-root runtime).
  - [x] **Frontend Dockerfile:** Multi-stage build for React Vite app (`node:20-alpine` builder ➔ `nginx:1.27-alpine` runtime).
  - [x] **Nginx Reverse Proxy:** Route `/api/*` to Go backend service and `/*` to React frontend SPA in `nginx/nginx.conf`.
  - [x] **Docker Compose Integration:** Single command `docker compose up` orchestrating PostgreSQL, Redis, Kafka, Backend, Frontend, and Nginx.
  - [x] **End-to-End Walkthrough:** Full containerized stack running seamlessly on http://localhost via Nginx Gateway.

  ---

  ## 🔮 5. Future Scope & Backlog (Postponed Features)

  > [!NOTE]
  > The features below have been intentionally postponed from the initial `feature/auth-service` vertical slice to allow the team to focus on delivering a robust, battle-tested core authentication foundation (Bcrypt hashing, JWT dual-token rotation, Redis-backed sessions, and developer avatar kit) before introducing external third-party service dependencies.

  ### 5.1 OAuth 2.0 / Social Login (Google & GitHub)
  - **Objective:** Streamline the onboarding experience for Indonesian software engineers through one-click sign-up and login using their **GitHub** (leveraging repository history, contributions, and developer profile) and **Google** accounts.
  - **Architecture & Implementation Plan:**
    - Standard OAuth 2.0 Authorization Code Flow with PKCE.
    - Backend Endpoints:
      - `GET /api/v1/auth/oauth/{provider}`: Generates a cryptographically secure random `state` CSRF token stored in Redis, then redirects the client to the provider's OAuth consent screen.
      - `GET /api/v1/auth/oauth/{provider}/callback`: Validates `state`, exchanges the authorization code for provider access tokens, retrieves the profile (email, name, avatar), and links it to the `users` table (or provisions a new account if unregistered).
    - Automatically syncs developer profile data (avatar image, GitHub username) into the CodeAbroad user entity.
  - **Status:** ⏳ *Postponed (Next milestone after core onboarding flow is finalized)*.

  ### 5.2 Password Recovery & Reset Flow (Forgot & Reset Password)
  - **Objective:** Provide a self-service account recovery mechanism if an engineer forgets their credentials, verified via email ownership.
  - **Architecture & Implementation Plan:**
    - Backend Endpoints:
      - `POST /api/v1/auth/forgot-password`: Accepts an email, generates a high-entropy reset token with a 15-minute expiration stored in Redis (`pwd_reset:{token}` ➔ `user_id`), and publishes an asynchronous email event.
      - `POST /api/v1/auth/reset-password`: Validates the token and new password bounds (8–72 characters), hashes the new secret using Bcrypt, updates the record in PostgreSQL, deletes the token from Redis, and invalidates all existing active sessions.
    - External Service Integration: Transactional email provider (e.g., Resend, AWS SES, or Mailgun) or decoupled via Kafka event consumer `event.user.password_reset_requested`.
    - Frontend UX: Dedicated `/forgot-password` and `/reset-password` views with real-time feedback and password strength verification.
  - **Status:** ⏳ *Postponed (Next milestone once email delivery infrastructure is provisioned)*.

  ### 5.3 Distributed Rate Limiting (Brute-Force & Credential Stuffing Protection)
  - **Objective:** Protect public authentication endpoints (`POST /api/v1/auth/login`, `POST /api/v1/auth/register`, and `/api/v1/auth/refresh`) against automated brute-force attacks, password spraying, and DoS abuse.
  - **Architecture & Implementation Plan:**
    - Redis Sliding Window or Token Bucket algorithm implemented via Gin middleware layer (`RateLimitMiddleware`).
    - Key Strategy:
      - By Client IP: `ratelimit:ip:{ip_address}:{endpoint}` (e.g., max 5 login attempts per minute per IP).
      - By Target Account: `ratelimit:account:{email}` to defend against distributed botnets targeting a specific developer account across multiple proxy IPs.
    - Standard Headers: Return HTTP `429 Too Many Requests` with `Retry-After`, `X-RateLimit-Limit`, and `X-RateLimit-Reset`.
  - **Status:** ⏳ *Postponed (Next security hardening milestone before public staging deployment)*.

  ### 5.4 Access Token Blacklisting / Instant Revocation on Logout
  - **Objective:** Enforce instantaneous invalidation of short-lived JWT Access Tokens upon explicit user logout, eliminating the 15-minute residual validity window.
  - **Architecture & Implementation Plan:**
    - Current State: `POST /api/v1/auth/logout` revokes the Redis session key (`session:{user_id}`) preventing token rotation, but the active JWT access token remains valid until its 15-minute `exp` claim expires.
    - Enhanced State:
      - Assign a unique JWT ID claim (`jti` - UUIDv4) in every Access Token.
      - Upon calling `/auth/logout`, extract `jti` and set `blacklist:access_token:{jti}` in Redis with TTL equal to the remaining expiration duration (`exp - now()`).
      - In `AuthMiddleware`, verify `EXISTS blacklist:access_token:{jti}` in Redis (sub-millisecond O(1) lookup). If present, abort immediately with `401 Unauthorized` (`TOKEN_REVOKED`).
  - **Status:** ⏳ *Postponed (Next security hardening milestone before public staging deployment)*.

  ### 5.5 Advanced Developer Avatar Personalization & Gender Representation
  - **Objective:** Empower Indonesian software engineers to express their digital identity authentically with gender-aligned aesthetics (masculine, feminine, gender-neutral hair and facial features), tech gear accessories, and optional custom photo uploads.
  - **Architecture & Implementation Plan:**
    - Schema & Data Model:
      - Add `gender` column (`varchar(20)`, values: `'male'`, `'female'`, `'non_binary'`, `'prefer_not_to_say'`) and `avatar_preferences` (`jsonb` for hairstyles, accessories, skin tone, background color) to the PostgreSQL `users` table.
    - DiceBear Parametric Integration:
      - Leverage DiceBear query parameters (e.g., `hair`, `accessories`, `clothingColor`) to render gender-aware developer avatars rather than purely random deterministic seeds.
    - Interactive Avatar Studio (Frontend UI):
      - Build a live visual Avatar Customizer modal in Profile Settings with real-time SVG preview, preset categories (Casual Coder, Tokyo Commuter, Hacker, Minimalist), and toggleable dev gear (headphones, glasses, hoodies, coffee cups).
    - Custom Photo Upload Pipeline (Cloudflare R2 / AWS S3):
      - Support direct photo uploads via presigned PUT URLs with server-side validation (max 2MB, WebP/JPEG), automatic square cropping, and CDN edge delivery.
  - **Status:** ⏳ *Postponed (Scheduled for Sprint 2: Profile Customization & Gamified Onboarding)*.




