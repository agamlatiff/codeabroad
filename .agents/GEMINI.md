# CodeAbroad — Project Rules & Guidelines

> These rules apply to the entire CodeAbroad project. The AI agent must follow
> these guidelines at all times when working on this codebase.

---

## 🌐 Language

- **Code Comments:** **All code comments MUST be written in English at all times.** Never write Indonesian in code comments (JSX comments, inline comments, docstrings).
- **Code & Commits:** All code, commit messages, technical documentation, variable names, and function names must be written in **English**.
- **User-Facing UI Copy:** Labels, placeholders, and notification messages displayed to the end-user are in **Indonesian** (since the target audience is Indonesian software engineers).

---

## 🏗️ Architecture

- Strictly follow **Clean Architecture** with these layers:
  - `domain/` → Entities & repository interfaces (no external dependencies)
  - `usecase/` → Business logic (depends only on domain)
  - `repository/` → Database implementations (implements domain interfaces)
  - `delivery/http/` → Gin handlers (depends only on usecase)
  - `infrastructure/` → Kafka, Redis, DB connections
- **Never** put business logic directly in Gin handlers.
- **Never** call the database directly from handlers — always go through usecase → repository.
- Each layer must only depend on the layer directly below it.

---

## 📦 Tech Stack

The following stack is locked. Do not introduce new libraries or tools without explicit user approval:

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- TanStack Query (server state)
- Axios (HTTP client)
- React Router v6

### Backend
- Golang + Gin
- PostgreSQL (primary database)
- Redis (caching, sessions, streaks)
- Kafka (event-driven messaging)
- JWT (authentication)

### Infrastructure
- Docker + Docker Compose
- Nginx (reverse proxy)

---

## 📝 Code Conventions

### Go (Backend)
- File names: `snake_case.go`
- Struct names: `PascalCase`
- Function names: `camelCase` (unexported), `PascalCase` (exported)
- Constants: `SCREAMING_SNAKE_CASE`
- Error messages: lowercase, no punctuation at end (e.g., `"user not found"`)
- Always handle errors explicitly — never ignore with `_` unless intentional
- Use `context.Context` as the first parameter in all service/repository methods

### TypeScript (Frontend)
- File names: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- Component names: `PascalCase`
- Hooks: prefix with `use` (e.g., `useQuests`)
- Types/Interfaces: `PascalCase`, prefix interfaces with `I` only if needed for clarity
- Always define explicit TypeScript types — avoid `any`

---

## 🔌 API Design

- All endpoints must be versioned: `/api/v1/...`
- Use RESTful conventions:
  - `GET` → Read
  - `POST` → Create
  - `PUT` → Full update
  - `PATCH` → Partial update
  - `DELETE` → Delete
- Response format must always be:
  ```json
  {
    "success": true,
    "data": {},
    "message": "string"
  }
  ```
- Error response:
  ```json
  {
    "success": false,
    "error": "error message",
    "code": "ERROR_CODE"
  }
  ```

---

## 🌿 Git Branching Strategy

This project uses a **3-layer branching model**:

```
main        → Production-ready, stable code only
staging     → Pre-production, integration testing
feature/*   → Individual feature development
```

### Rules
- **Never** commit directly to `main` or `staging`.
- All new work starts from a `feature/` branch.
- Feature branches merge into `staging` first via Pull Request.
- `staging` merges into `main` only after testing is complete.
- Branch naming convention:
  - `feature/auth-service`
  - `feature/quest-system`
  - `feature/kafka-events`
  - `fix/login-bug`
  - `chore/update-dependencies`
  - `docs/readme-update`

### Commit Message Format

Follow **Conventional Commits**:

```
<type>(<scope>): <short description>

Types:
  feat     → New feature
  fix      → Bug fix
  chore    → Maintenance, dependencies
  docs     → Documentation only
  refactor → Code refactor, no feature change
  test     → Adding or updating tests
  style    → Formatting, no logic change
  ci       → CI/CD changes

Examples:
  feat(auth): add JWT refresh token endpoint
  fix(quest): resolve daily quest reset timing issue
  chore(docker): update postgres image to 16-alpine
  docs(readme): add setup instructions
```

---

## 🔒 Security

- **Never** hardcode secrets, API keys, passwords, or tokens in code.
- All sensitive config must use **environment variables** via `.env` files.
- `.env` files must always be in `.gitignore`.
- JWT secrets must be at least 32 characters long.
- Always validate and sanitize all user inputs.

---

## 🤝 Collaboration Rules (AI Agent)

- **Do not modify, create, or delete any file without explicit user permission.**
- **Never implement or write feature code directly into files**: Always provide implementation code snippets in chat so the user can type/implement them manually for learning.
- **Automated Test Suite Generation by AI**: After a feature slice is implemented, the AI agent is responsible for authoring automated test files (`*_test.go`) directly, covering happy paths, edge cases, and error handling.
- **Do not run `go build`, compile, or test commands automatically**: Let the user build, run, and verify code themselves.
- Always explain what you plan to do before doing it.
- When suggesting changes, show the diff or new content first and wait for approval.
- If unsure about intent, ask — don't assume.
- Prefer small, focused changes over large sweeping edits.
- **Proactive Technical Debt & Best Practice Warnings**: Always prioritize production-grade best practices. If a quick, simplified, or "dirty" approach is ever suggested, **explicitly warn the user** that it incurs technical debt, explain why, and present the industry best practice alongside it.

---

## 🎯 Feature Development Flow (End-to-End Vertical Slice)

- **Strict Single-Feature Focus:** Work on **ONE feature at a time from start to finish** across the full stack (Backend ➔ Frontend ➔ DevOps/Testing/Integration) before moving to another feature.
- **No Premature Context Switching:** Never jump to a new domain or separate feature until the current feature's complete lifecycle is implemented, wired, and verified.
- **Full Lifecycle Visibility:** The goal is to see each feature fully alive — from database migration, backend domain/usecase/delivery, frontend UI/UX and state management, to Docker/reverse proxy configuration.
