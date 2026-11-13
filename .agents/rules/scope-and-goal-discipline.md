# Scope, Goal Discipline & Anti-Burnout Policy

## 1. Plan & Definition of Done (DoD) Before Parallel Execution
- Before launching multiple agents, the main coordinator agent must present a concise execution brief containing:
  1. **Primary Goal**: The single concrete outcome expected by the user.
  2. **Contract / Interface Lock**: Shared DTOs, API endpoints, or component props agreed upfront so parallel outputs integrate cleanly.
  3. **Disjoint Sub-Task Scopes**: Exact folders/files assigned to each agent.
  4. **Definition of Done (DoD)**: Measurable completion criteria (e.g., unit tests pass, TypeScript compiles with zero `any`, UI matches design tokens).

## 2. Concurrency Cap & Batching (Anti-Overwhelm)
- Limit concurrent **write/implementation subagents to a maximum of 3–4 per batch** (read-only research subagents may run alongside as needed).
- Do not launch a new batch until the current batch has been integrated and verified by the main coordinator agent.

## 3. Anti-Scope Creep & YAGNI
- Agents must strictly stick to the approved goal and DoD.
- **Strictly prohibited** unless explicitly requested by the user:
  - Refactoring or "cleaning up" unrelated existing code.
  - Adding unrequested features, abstractions, or premature optimizations.
  - Modifying architecture outside the agreed vertical slice.

## 4. Vertical Slice Alignment & Checkpoints
- Align parallel work with `.agents/docs/prd.md`, `.agents/docs/erd.md`, and the actual modular vertical slice structure (`backend/internal/app/*`, `frontend/src/features/*`):
  - Prefer parallelizing **within a single vertical slice** once contracts and schemas are locked (e.g., Research Agent + Backend Worker + Frontend Worker + Test/Docs), with the coordinator wiring `main.go`, `router.go`, and shared routes sequentially.
  - Only run multiple independent features in parallel when explicitly requested by the user and their file scopes are 100% disjoint.
- Deliver and verify in small, testable checkpoints rather than deferring all integration to the very end.

## 5. Concise & Structured Subagent Reporting
- To prevent context bloat and review fatigue, every subagent must return a brief, structured summary containing only:
  1. **Files Changed**: Exact paths created or modified within its scope.
  2. **Shared-File Handoff**: Exact updates needed in shared files (e.g., `router.go`, `main.go`, `package.json`, shared `types/`) for the coordinator to apply.
  3. **Verification & Blockers**: Commands run/checks passed, or any unresolved dependency/blocker.

## 6. Policy Precedence
- This rule operates alongside `multi-agent-coordination.md` and `minimal-diff-policy.md`. All code modifications still require explicit user permission beforehand.
