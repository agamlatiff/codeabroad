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

  ## ✅ 4. End-to-End Implementation Tracker

  ### Phase A: Backend (Golang + Clean Architecture)
  - [x] **Database Migration:** `users` table created with indexes on `email` and `username`.
  - [x] **Domain Layer:** Entities (`User`), DTOs (`RegisterRequest`, `LoginRequest`, `AuthResponse`), and repository interfaces in `internal/domain/user.go`.
  - [x] **Repository Layer (PostgreSQL):** `internal/repository/postgres/user_repository.go` implementing `Create`, `GetByEmail`, `GetByUsername`, `GetByID`.
  - [x] **Session Store Layer (Redis):** `internal/repository/session_repository.go` with TTL-based Redis keys `session:{user_id}`.
  - [x] **Usecase Layer:** `internal/usecase/auth_usecase.go` with Bcrypt hashing, session tracking, and JWT token rotation.
  - [x] **Delivery Middleware:** `internal/delivery/http/middleware/auth_middleware.go` validating Bearer JWT and storing user claims into Gin context.
  - [x] **Delivery Handler:** `internal/delivery/http/handler/auth_handler.go` with Gin handlers for `/register`, `/login`, `/refresh`, and `/me`.
  - [x] **Router & Dependency Injection:** Wire usecase, handler, and middleware in `internal/delivery/http/router.go` and `cmd/api/main.go`.
  - [x] **Automated Unit & Integration Tests:** Auth Usecase and HTTP Handler test suites in `auth_usecase_test.go` and `auth_handler_test.go`.

  ---

  ### Phase B: Frontend (React + TypeScript + Vite + Tailwind CSS + Zustand)
  - [ ] **Project Setup:** Initialize Vite React TypeScript app in `frontend/`.
  - [ ] **Design Tokens & Theme:** Configure Tailwind CSS with Raycast / Obsidian dark theme (`#0D0D11`, glassmorphism, accent micro-glows).
  - [ ] **Axios Client & Auto-Refresh Interceptor:** Setup HTTP client with interceptor to handle `401` by calling `/api/v1/auth/refresh` seamlessly.
  - [ ] **Zustand State Store (`useAuthStore`):** Manage `user`, `accessToken`, `isAuthenticated`, `login`, `logout`.
  - [ ] **Authentication Pages:**
    - `RegisterPage.tsx`: Input validation, registration form, error alerts.
    - `LoginPage.tsx`: Credentials input, error state, redirect after login.
  - [ ] **Protected Route Component:** Router wrapper redirecting unauthenticated users to `/login`.
  - [ ] **Profile / Dashboard Screen (`/me`):** Display user avatar, level, streak, XP, and logout button.

  ---

  ### Phase C: DevOps & Container Integration
  - [ ] **Backend Dockerfile:** Multi-stage build for Go binary.
  - [ ] **Frontend Dockerfile:** Multi-stage build for React Vite app with Nginx.
  - [ ] **Nginx Reverse Proxy:** Route `/api/*` to Go backend service and `/*` to React frontend.
  - [ ] **Docker Compose Integration:** Single command `docker-compose up` orchestrating PostgreSQL, Redis, Kafka, Backend, Frontend, and Nginx.
  - [ ] **End-to-End Walkthrough:** Full browser test from registration to auto-token renewal.
