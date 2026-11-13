# Multi-Agent Coordination & Conflict Prevention Policy

## 1. Strict Scope & File Ownership
- Every parallel subagent must be assigned an explicit, non-overlapping scope (specific feature folder, module, or file list).
- Subagents must **only** create or modify files inside their assigned scope.
- If a task requires changes outside the assigned scope, the subagent must stop and report the dependency to the main coordinator agent rather than editing out-of-scope files.

## 2. Shared & Entry-Point Files Protection
- Shared files are **read-only** for parallel write subagents. Examples include:
  - Package manifests and lockfiles (`package.json`, `pnpm-lock.yaml`, etc.)
  - Global configs (`tsconfig.json`, `.env*`, linter/formatter configs)
  - Database schemas and migrations
  - Root entry points, global routers, shared barrel files (`index.ts`), and global type definitions
  - Infrastructure & environment files (`docker-compose.yml`, `nginx/nginx.conf`, `Makefile`, `.github/`, `.env.example`)
- **`.env` is strictly off-limits**: Agents must never read, print, or modify `.env`. If new environment variables are needed, document placeholders in `.env.example` and notify the user.
- Parallel subagents must list any required edits to shared files in their final report so the main coordinator agent can apply them sequentially.

## 3. Workspace Isolation
- **Read-only research subagents**: May run concurrently using `Workspace: inherit`.
- **Write/implementation subagents**:
  - Prefer `Workspace: branch` or `Workspace: share` when multiple agents edit code concurrently.
  - Only run multiple write subagents on `Workspace: inherit` if their target directories are 100% disjoint and no shared files are touched.

## 4. Sequential Integration & Verification
- The main coordinator agent is responsible for:
  1. Reviewing subagent outputs and merging/applying shared file updates sequentially.
  2. Ensuring consistent types, imports, and architectural boundaries across modules.
  3. Running final verification (`typecheck`, `lint`, `test`) after all parallel work is integrated.

## 5. User Permission & Minimal Diff Compliance
- All agents (main and subagents) must follow `minimal-diff-policy.md` and obtain explicit user permission before writing, modifying, or deleting any code.

## 6. Git & Terminal Safety
- Work per feature on a dedicated `feature/<feature-name>` branch; never commit or push directly to `main` or `staging` without explicit user permission.
- Subagents must **never** run destructive commands (`git reset --hard`, `git checkout --`, `docker compose down -v`, etc.).
- Subagents must **never** run `git commit` on their own; the coordinator commits only after integration, CI check verification, and explicit user approval using English Conventional Commits (`<type>(<scope>): <description>`).
