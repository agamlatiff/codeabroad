---
name: codeabroad-workflow
description: >-
  Master autonomous engineering workflow, Clean Architecture rules,
  headless hook patterns, Duolingo 3D design system primitives,
  zero-any TypeScript policy, and vertical slice execution standards for CodeAbroad.
  Use whenever developing, refactoring, or scaffolding any feature in CodeAbroad.
---

# 🚀 CodeAbroad Master Engineering Workflow & Autonomous Development Skill

This skill is the **Single Source of Truth (SSOT)** for developing, maintaining, and refactoring any feature in the **CodeAbroad** platform.  
When this skill is loaded, the AI agent **must automatically follow every architectural principle, design system guideline, and code convention below** without requiring the user to re-instruct or remind.

---

## 🧭 1. Core Principles & Stack Lock

### 1.1 Stack Lock (Strict):
- **Backend:** Golang 1.23+, Gin Web Framework, PostgreSQL 16 (`pgcrypto`), Redis 7 (sessions, streak cache), Apache Kafka (async events), JWT (access token + rotated refresh token).
- **Frontend:** React 18, TypeScript 5, Vite, Tailwind CSS v4 (`@theme`), Zustand (client state), TanStack Query (server state), Axios (HTTP client), React Router v6.
- **Design System:** 90% Duolingo Tactile 3D Taste in Clean Light Mode (`#FAFAF9` canvas, `#FFFFFF` crisp cards, `rounded-3xl`, 4px-6px bottom physical bevel shadows that sink on click, native haptic feedback) + 10% CodeAbroad Electric Tech Blue (`#2563EB`) and Neon Cyan (`#38BDF8`).

### 1.2 Language & Localization Policy:
- **Code & Comments:** **All code, commit messages, variable names, function names, error codes, and inline comments MUST be written in English at all times.**  
  ❌ *Never write Indonesian in code comments, docstrings, or commits.*
- **User-Facing UI Copy:** All labels, placeholders, tooltips, dialogs, and toast notifications displayed to the end-user are in **Bahasa Indonesia** (tailored for Indonesian software engineers targeting global careers).

### 1.3 User Permission & Collaboration Rule:
- ⚠️ **Always Ask First:** Do not modify, insert, or delete any code without explicit user permission. Always present the plan and snippet first.
- 👨‍💻 **Hands-on Learning:** Encourage the user to write code, explaining the *why* and the architectural rationale rather than dumping unexplained code.
- 🎯 **Single Vertical Slice Focus:** Work on **ONE feature at a time from start to finish** across the stack (Database ➔ Backend ➔ Frontend) before moving to any other feature.

---

## ⚙️ 2. Backend Clean Architecture Law (`backend/internal/`)

Every backend service must adhere to the **strict unidirectional dependency flow**:
```
delivery/http/ ➔ usecase/ ➔ repository/ ➔ domain/
```

### 2.1 Layer Responsibilities:
1. **`domain/` (The Core SSOT):**
   - Contains pure Go structs (Entities, Request/Response DTOs) and Interface contracts (`UserRepository`, `GamificationRepository`).
   - Zero external framework dependencies (only `context`, `time`, and standard Go packages).
2. **`usecase/` (The Business Logic Conductor):**
   - Contains pure business rules, validation, cryptography (Bcrypt, JWT), and orchestration.
   - **STRICT PROHIBITION:** Never write `gin.Context`, HTTP status codes (`200/404/500`), or raw SQL queries in usecases!
   - Must depend ONLY on domain interfaces via Dependency Injection (`NewAuthUsecase(userRepo, ...)`).
3. **`repository/` (The Data Persistence Engine):**
   - Implements domain repository interfaces for PostgreSQL (`repository/database/`) and Redis (`repository/session/`).
   - Writes SQL queries with parameterized arguments (`$1, $2`) to prevent SQL injection.
   - **STRICT PROHIBITION:** Never put business logic (date offsets, XP calculations) in repository methods!
4. **`delivery/http/` (The API Gateway):**
   - Gin HTTP Handlers (`handler/`) and Middlewares (`middleware/`).
   - Handles JSON binding (`c.ShouldBindJSON`), context extraction (`c.GetString("userID")`), calls Usecase, and renders standardized JSON responses.

### 2.2 Context & Error Handling Standards:
- **Context First:** Every usecase and repository method must accept `ctx context.Context` as its very first argument.
- **Explicit Error Handling:** Never ignore errors with `_` unless explicitly intended and documented.
- **Unified Response Envelopes:**
  ```json
  // Success:
  { "success": true, "data": { ... }, "message": "Operation completed successfully" }
  // Error:
  { "success": false, "error": "Human-readable error explanation", "code": "SPECIFIC_ERROR_CODE" }
  ```

---

## 💻 3. Frontend Architecture & Headless Hook Pattern (`frontend/src/`)

### 3.1 Headless Hook Architecture (Mandatory):
- **JSX Page Components (`pages/*.tsx`) must remain clean, declarative, and presentational.**
- **STRICT PROHIBITION:** Do NOT write raw `useEffect` API calls, complex state management, or inline Axios queries inside page components!
- **Always extract orchestration into headless custom hooks (`hooks/use*.ts`):**
  - Page: `LoginPage.tsx` ➔ Headless Hook: `useLogin.ts`
  - Page: `DashboardPage.tsx` ➔ Headless Hook: `useDashboard.ts`
  - Page: `OnboardingPage.tsx` ➔ Headless Hook: `useOnboardingWizard.ts`

### 3.2 Strict TypeScript Standards (Zero `any`):
- **NEVER use `any` under any circumstances.**
- Define strict interfaces for every API payload, component prop, and state in `frontend/src/types/`.
- Use `ApiResponse<T>` wrappers for all Axios service calls.

### 3.3 State Management Split:
- **Client State (Zustand):** Used for session tokens, active user profile, theme, and local UI flags (`store/*.ts`).
- **Server State (TanStack Query):** Used for caching, background refetching, mutations, and optimistic updates.
- **Axios Interceptor (`services/api.ts`):** Automatically injects `Authorization: Bearer <token>` and handles seamless 401 refresh token rotation.

---

## 🎨 4. Visual Design System & Anti-AI Slop Manifesto

### 4.1 Visual Identity:
- **90% Duolingo Tactile 3D Taste (Clean Light Mode):**
  - Canvas: `#FAFAF9` (warm-white ground).
  - Cards: `#FFFFFF` (crisp white) with `rounded-3xl` and `border-slate-200`.
  - Buttons: Physical 3D buttons with 4px-6px bottom depth shadows (`shadow-[0_4px_0_0_#1D4ED8]`) that sink upon clicking (`active:translate-y-1 active:shadow-none`).
  - Native haptic feedback on touch (`triggerHaptic`).
- **10% CodeAbroad Identity:**
  - Electric Tech Blue (`#2563EB`, `#3B82F6`) & Neon Cyan (`#38BDF8`).
  - Mascot: **Kodi** (`<KodiMascot>`) with animated emotions (`welcome`, `celebrate`, `coding`, `proud`).
  - Logo: Must always render `variant="slate"` or `variant="blue"`. **Strictly NO matcha green logos.**

### 4.2 Mandatory Reusable Primitives (`components/ui/`):
Always import and use official primitives instead of ad-hoc Tailwind classes:
- `<Button3D>`: Chunky 3D Duolingo button (`variant="blue"|"cyan"|"white"|"emerald"|"amber"|"rose"|"ghost"`).
- `<Card3D>`: Clean white container with tactile border and rounded-3xl.
- `<RoadmapNode3D>`: Gamified circular numbered node (1, 2, 3...) with 3 states (`completed`, `active`, `locked`).
- `<Modal3D>`: Clean light mode tactile dialog with ESC key listener and backdrop blur.
- `<MetricTile>`: Gamified 2x2 scannable metric card for dashboard.
- `<BadgePill>`: Status pill (`variant="xp"|"streak"|"verified"|"blue"|"cyan"|"neutral"|"error"`).
- `<ProgressBar3D>`: 3D progress capsule with internal gloss shine.
- `<Input>`: 2px border input with Electric Blue focus ring.
- `<KodiMascot>` & `<SpeechBubble>`: Companion mascot with directional speech tail.

### 4.3 Anti-AI Slop Rules:
- ❌ **No generic SaaS bullet cards.**
- ❌ **No arbitrary gray icon boxes.**
- ❌ **No cluttered multi-column widgets.**
- ❌ **No lazy responsive stacking** (use task-first mobile design with min 44px touch targets).

---

## 🔄 5. End-to-End Vertical Slice Workflow

When developing, refactoring, or scaffolding any feature, follow this exact 6-step lifecycle:

```text
[Step 1: Documentation & Contracts]
  └─ Review/update .agents/docs/erd.md and .agents/docs/prd.md.

[Step 2: Database Migration]
  └─ Create backend/migrations/00000X_*.up.sql and .down.sql with clean indexes and foreign keys.

[Step 3: Backend Clean Architecture]
  ├─ 1. domain/: Define structs, request/response DTOs, and repository interfaces.
  ├─ 2. repository/: Implement SQL queries in internal/repository/database/.
  ├─ 3. usecase/: Write pure business logic in internal/usecase/.
  ├─ 4. delivery/http/: Create handler in handler/ and register route in router.go.
  └─ 5. main.go: Wire dependencies via constructor injection.

[Step 4: Frontend Implementation]
  ├─ 1. types/: Add TypeScript interfaces for all DTOs (Zero 'any').
  ├─ 2. services/: Create typed Axios API calls in services/.
  ├─ 3. hooks/: Create headless controller hook in hooks/ (useMutation, useQuery).
  ├─ 4. components/: Build UI using <Button3D>, <Card3D>, <MetricTile>, <BadgePill>.
  └─ 5. pages/: Mount components into page routes.

[Step 5: Automated Testing]
  └─ Author Go unit tests (*_test.go) covering happy path, validation, and domain error codes.

[Step 6: Git Workflow]
  └─ Commit with Conventional Commits (<type>(<scope>): <description in English>).
```

---

## 🎯 6. Autonomous Agent Directives

When interacting with the CodeAbroad codebase, the AI Agent must **automatically**:
1. Check existing domain models and database migrations before proposing schema changes.
2. Ensure database tables are normalized (avoiding bloated God Tables).
3. Respect Clean Architecture boundaries (never leak HTTP into usecases or SQL into handlers).
4. Build frontend components using the tactile 3D Duolingo design system tokens.
5. Author automated tests for backend logic.
6. Communicate with the user in conversational, educational, and respectful Indonesian while keeping all code, comments, and commit messages in English.
