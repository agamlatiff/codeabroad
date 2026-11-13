---
name: codeabroad-workflow
description: >-
  CodeAbroad development workflow aligned with .agents/docs/prd.md,
  .agents/docs/erd.md, docs/api/openapi.yaml, and .agents/rules/*.
  Use whenever planning, implementing, testing, or reviewing features in CodeAbroad.
---

# CodeAbroad Engineering Workflow

This skill aligns feature delivery with the current repository architecture, documentation, and workspace rules.

## 1. Single Source of Truth (SSOT)
Always consult these sources before designing or modifying features:
- **Product Requirements:** `.agents/docs/prd.md`
- **Database Schema & Bounded Contexts:** `.agents/docs/erd.md`
- **REST API Contracts:** `docs/api/openapi.yaml`
- **Workspace Rules:**
  - `.agents/rules/minimal-diff-policy.md`
  - `.agents/rules/multi-agent-coordination.md`
  - `.agents/rules/scope-and-goal-discipline.md`
  - `.agents/rules/technical-standards.md`

## 2. Actual Codebase Structure

### Backend (`backend/`)
- **Entrypoint:** `backend/cmd/api/main.go`
- **Shared Core:** `backend/internal/shared/` (`apperror`, `middleware`, `response`, `router`)
- **Feature Modules:** `backend/internal/app/<module>/`
  - Typical module files: `domain.go`, `repository.go`, `usecase.go`, `handler.go`, `mock.go`, `usecase_test.go`, `handler_test.go`
  - Dependency direction: `handler` -> `usecase` -> `repository` -> `domain`
- **Migrations:** `backend/migrations/` (sequential `.up.sql` and `.down.sql` pairs)

### Frontend (`frontend/src/`)
- **App Entry & Routing:** `frontend/src/App.tsx`, `frontend/src/main.tsx`
- **Shared Layer:** `frontend/src/shared/`
  - UI & Layout: `shared/components/ui/`, `shared/components/layout/`
  - Design Tokens: `shared/tokens/` (`colorTokens.ts`, `elevationTokens.ts`, `hapticTokens.ts`, `layoutTokens.ts`, `soundTokens.ts`, `typographyTokens.ts`)
  - API & State Helpers: `shared/services/api.ts`, `shared/types/api.ts`, `shared/hooks/`, `shared/utils/`
- **Feature Modules:** `frontend/src/features/<feature>/` (`components`, `hooks`, `pages`, `services`, `store`, `types`, `utils`)

## 3. Feature Execution Lifecycle
1. **Contract & Scope Lock:** Verify requirements against `prd.md`, `erd.md`, and `docs/api/openapi.yaml`. Lock DTOs/types and get explicit user permission before editing code.
2. **Database Migration (Sequential):** If schema changes are required, add paired `.up.sql` / `.down.sql` files sequentially and keep normalized pillars (`users`, `user_profiles`, `user_gamification`) intact.
3. **Module Implementation (Parallel-Safe):**
   - Implement backend slice (`domain.go` -> `repository.go` -> `usecase.go` -> `handler.go`) with mock-backed unit tests (`mock.go`, `*_test.go`).
   - Implement frontend slice (`types/` -> `services/` -> `hooks/` -> `components/` -> `pages/`) using `zod` + `react-hook-form`, strict TypeScript (zero `any`), and existing `shared/components/ui/` primitives + `shared/tokens/`.
4. **Sequential Wiring & API Sync:** Wire shared boundaries (`main.go`, `router`, `App.tsx`, `shared/`) sequentially and update `docs/api/openapi.yaml` when endpoints change.
5. **Verification Gate:** Run `go test ./...` and `go vet ./...` in `backend/`, and `npm run build` (`tsc -b && vite build`) and `npm run lint` in `frontend/`.

## 4. Git Workflow (Per-Feature)
1. **Feature Branching:** Implement each feature on a dedicated `feature/<feature-name>` branch (e.g., `feature/srs-deck`, `feature/mock-exam`) matching `.github/workflows/ci.yml` triggers (`feature/**`). Never commit or push directly to `main` or `staging` without explicit user permission.
2. **Pre-Commit CI Parity:** Before committing or opening a PR to `staging`/`main`, ensure the exact CI checks in `.github/workflows/ci.yml` pass (`go vet ./...`, `go test -v -count=1 ./...`, `npx eslint .`, `npm run build`).
3. **Conventional Commits (English):** Commit only after coordinator integration and explicit user approval, using `<type>(<scope>): <description in English>` (e.g., `feat(exercise): ...`, `refactor(auth): ...`, `fix(user): ...`).
