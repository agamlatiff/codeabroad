# CodeAbroad Technical Standards & Quality Gate Policy

## 0. Single Source of Truth (SSOT) Precedence
- Primary references for product requirements, data modeling, and API contracts are **`.agents/docs/prd.md`**, **`.agents/docs/erd.md`**, **`docs/api/openapi.yaml`**, and the **actual codebase structure** (`backend/internal/app/*`, `frontend/src/features/*`, `frontend/src/shared/*`).
- For frontend UI primitives and design tokens, always inspect and reuse the actual files in `frontend/src/shared/components/ui/` and `frontend/src/shared/tokens/`.

## 1. Modular Feature-Boundary & Dependency Rules
- **Backend (`backend/internal/app/<module>/`)**:
  - Each domain module follows the modular slice structure (`domain.go`, `repository.go`, `usecase.go`, `handler.go`, `mock.go`, `*_test.go`) and strict unidirectional layer dependencies (`handler` -> `usecase` -> `repository` -> `domain`).
  - Modules must not directly depend on another module's internal `repository.go` or database tables without an agreed interface contract.
  - `backend/internal/shared/` (`apperror`, `middleware`, `response`, `router`) and `backend/cmd/api/main.go` are **shared boundaries** managed sequentially by the coordinator.
- **Frontend (`frontend/src/features/<feature>/`)**:
  - Keep page components declarative; extract API/state orchestration into `hooks/use*.ts`, typed clients in `services/`, and strict interfaces in `types/`.
  - Cross-feature imports must be avoided or routed through agreed `frontend/src/shared/` contracts (`components/ui`, `services/api.ts`, `types/api.ts`, `tokens`, `utils`) to prevent circular dependencies.
  - `frontend/src/shared/` and `frontend/src/App.tsx` are **shared boundaries** managed sequentially by the coordinator.

## 2. Database & Migration Safety
- **Single Sequential Migration Numbering**: Only the coordinator (or a single sequential step) may assign new migration sequence numbers in `backend/migrations/` (e.g., `000009_*.up.sql`) to prevent duplicate sequence prefixes.
- **Paired & Reversible Migrations**: Every schema or seed migration must include both `.up.sql` and `.down.sql`, align with `.agents/docs/erd.md`, and use safe guards (`IF NOT EXISTS`, explicit indexes, foreign keys) where appropriate.
- **Pillar Separation**: Preserve normalized boundaries across `users` (auth credentials), `user_profiles` (public profile/onboarding), and `user_gamification` (XP, streak, gems) to avoid row-lock contention.

## 3. API Contract, Validation & Security Baseline
- **DTO Separation & Zero-Leakage**: Never serialize raw database models directly in HTTP responses (especially sensitive fields such as `password_hash`). Use explicit request/response DTOs aligned 1:1 with frontend `types/`.
- **Unified Responses & Errors**: Backend handlers must use `backend/internal/shared/apperror` and `backend/internal/shared/response`. Never ignore returned errors silently (`_`) without an explicit reason.
- **SQL & Input Hygiene**:
  - All SQL queries in `repository.go` must use parameterized queries (`$1`, `$2`, ...); string interpolation in SQL is strictly prohibited.
  - Normalize identity inputs (e.g., `strings.ToLower(strings.TrimSpace(email))`) before querying or persisting.
  - Frontend forms must validate user input with `zod` and `react-hook-form`, with zero `any` types across TypeScript files.
- **Language Convention**: All code, identifiers, SQL, error codes, comments, and commit messages must be in English; end-user UI copy must be in Bahasa Indonesia.

## 4. Verification & Build Hygiene Gate
- Before marking any implementation task complete, run the relevant checks for modified areas:
  - **Backend**: `go test ./...` and `go vet ./...` (or `go build ./...`) inside `backend/`.
  - **Frontend**: `npm run build` (`tsc -b && vite build`) and `npm run lint` (`eslint .`) inside `frontend/`.
- **Build Artifact Hygiene**: Never leave compiled local binaries (such as `backend/api.exe`) modified by subagents or staged in commits.

## 5. Unit Testing & Mock Boundary Standards
- New or modified backend logic in `usecase.go` and `handler.go` must include unit tests (`usecase_test.go`, `handler_test.go`) backed by interface mocks in `mock.go`.
- Tests must cover happy paths, validation errors, and domain error codes without requiring a live PostgreSQL or Redis instance so parallel agents can verify behavior independently.

## 6. Policy Precedence
- This rule complements `minimal-diff-policy.md`, `multi-agent-coordination.md`, and `scope-and-goal-discipline.md`. Explicit user permission is always required before writing, modifying, or deleting any code.
