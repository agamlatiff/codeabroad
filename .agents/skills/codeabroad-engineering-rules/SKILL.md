---
name: codeabroad-engineering-rules
description: >-
  Project governance, code conventions (Go & TypeScript), REST API envelopes,
  Git branching & commit standards, security policies, and AI pair programming collaboration rules for CodeAbroad.
  Use when writing code, structuring commits, designing endpoints, or adhering to repository policies.
---

# CodeAbroad Engineering Rules & Project Governance Skill

This skill defines the non-negotiable coding conventions, architectural boundaries, security policies, git workflows, and pair programming collaboration standards for the **CodeAbroad** repository.

---

## 🌐 1. Language & Localization Policy

- **Code & Comments:** **All code, commit messages, technical documentation, variable names, function names, and code comments MUST be written in English at all times.**
  - ❌ Never write Indonesian in code comments (JSX comments, inline comments, docstrings).
- **User-Facing UI Copy:** Labels, placeholders, modal descriptions, and notification toasts displayed to the end-user are in **Indonesian** (tailored for Indonesian software engineers targeting global careers).

---

## 📝 2. Code Conventions

### 2.1 Golang (Backend)
- **File Names:** `snake_case.go` (e.g., `user_repository.go`, `onboarding_handler.go`).
- **Struct Names:** `PascalCase` (e.g., `OnboardingRequest`, `Country`).
- **Function Names:** `camelCase` (unexported), `PascalCase` (exported).
- **Constants:** `SCREAMING_SNAKE_CASE` (e.g., `ErrCodeInvalidStack`).
- **Error Messages:** Lowercase, no trailing punctuation (e.g., `"user not found"`, `"invalid tech stack"`).
- **Explicit Error Handling:** Never ignore errors with `_`. Always handle and return errors explicitly.
- **Context First:** Pass `ctx context.Context` as the first argument in all usecase, service, and repository methods.
- **Clean Architecture Boundaries:**
  - Handlers never contain business logic or direct database queries.
  - Dependencies flow strictly inwards: `delivery ➔ usecase ➔ repository ➔ domain`.

### 2.2 TypeScript & React (Frontend)
- **File Names:** `PascalCase.tsx` for components and pages; `camelCase.ts` for utilities, hooks, stores, and services.
- **Component Names:** `PascalCase` (e.g., `Step4BoardingPass`, `Button3D`).
- **Custom Hooks:** Always prefixed with `use` (e.g., `useOnboardingWizard`, `useDashboard`).
- **Types & Interfaces:** `PascalCase`. Explicitly type all props, state, and API payloads.
- **Zero `any`:** Never use `any`. Use `unknown` with type narrowing or define explicit interfaces.
- **Headless Hook Architecture:** Extract state orchestration, API queries, and heavy handlers into custom hooks. Keep JSX page components clean and declarative.

---

## 🔌 3. REST API Design & Response Envelopes

- **Versioned Endpoints:** All public and protected routes must be prefixed with `/api/v1/...`.
- **Standard HTTP Methods:**
  - `GET` → Read resources
  - `POST` → Create resources or submit actions
  - `PUT` → Full replacement
  - `PATCH` → Partial update
  - `DELETE` → Remove resource
- **Standard Success Response Format:**
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Operation completed successfully"
  }
  ```
- **Standard Error Response Format:**
  ```json
  {
    "success": false,
    "error": "Human-readable error explanation",
    "code": "SPECIFIC_BUSINESS_ERROR_CODE"
  }
  ```

---

## 🌿 4. Git Branching Strategy & Commit Standards

### 4.1 Three-Layer Branching Model
```text
main        → Production-ready, stable releases only (e.g. release(v0.2.0))
staging     → Pre-production integration & walkthrough testing
feature/*   → Individual feature development (e.g. feature/quest-system)
```

### 4.2 Branching Rules
- **Never** commit directly to `main` or `staging`.
- All new feature work starts by checking out a branch from `staging`: `git checkout -b feature/<name>`.
- Feature branches merge into `staging` via Pull Request or non-fast-forward merge (`git merge --no-ff`).
- `staging` merges into `main` only after full end-to-end walkthrough verification.

### 4.3 Conventional Commits Format
```text
<type>(<scope>): <short description in English>

Types:
  feat     → New user-facing feature
  fix      → Bug fix
  chore    → Maintenance, dependencies, config
  docs     → Documentation only
  refactor → Code refactor without behavior changes
  test     → Adding or updating unit tests
  style    → Code formatting, whitespace

Examples:
  feat(onboarding): add 3d tactile boarding pass ticket
  fix(auth): resolve refresh token expiration on redis
  docs(design-system): update tokens and duolingo guidelines
```

---

## 🔒 5. Security & Data Protection Standards

- **Zero Hardcoded Secrets:** Never hardcode passwords, database connection strings, or JWT keys in source files.
- **Environment Variables:** All secrets must be loaded via `.env` files. Ensure `.env` is always included in `.gitignore`.
- **JWT Key Strength:** JWT secret keys must be cryptographically secure and at least 32 characters in length.
- **Input Validation & Sanitization:**
  - Client-side: Validate inputs before submitting (`utils/validation.ts`).
  - Server-side: Strictly enforce Gin binding validators (`binding:"required,uuid"`, `binding:"required,oneof=..."`).
- **Session Security:** Refresh tokens are tracked in Redis and rotated on every refresh to prevent replay attacks.

---

## 🤝 6. AI Agent Collaboration Rules

<!-- - **Permission Before File Modifications:** Do not modify, insert, or delete any code without explicit user permission. Always propose the plan first.
- **Code Ownership & Learning:** Never dump completed feature implementations directly without showing snippets so the user understands the mechanics. -->
- **Automated Test Suite Generation:** The AI agent is responsible for authoring comprehensive automated test files (`*_test.go`) covering happy paths, edge cases, and domain error codes.
- **No Automatic Compiles/Builds:** Do not run `go build`, compile, or test commands automatically without user approval; allow the user to run and verify code themselves.
- **Single-Feature Vertical Slice Focus:** Work on **ONE feature at a time from start to finish** across the full stack (Database ➔ Backend ➔ Frontend ➔ Integration) before moving to any other feature.
- **Proactive Technical Debt Warnings:** Never recommend quick, dirty hacks. If a temporary shortcut is considered, explicitly warn the user of the technical debt and outline the production-grade best practice.
