---
name: codeabroad-architecture
description: >-
  Core fullstack architecture patterns, Duolingo 3D design system primitives,
  folder structure conventions, and vertical slice implementation workflow for CodeAbroad.
  Use when designing, scaffolding, or implementing UI components and Clean Architecture layers.
---

# CodeAbroad Architecture & Design System Skill

This skill acts as the master guide and architectural reference for the **CodeAbroad** platform. It provides the exact file conventions, design system primitives, and layering rules so any new feature can be built in full harmony with the existing codebase without needing to re-explain context.

---

## 🧭 1. Project Context & Tech Stack

**CodeAbroad** is a gamified IT learning platform empowering Indonesian software engineers to land overseas tech careers (Tokyo, Berlin, Singapore).

### Stack Lock (Strict):
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS v4 (`@theme`), Zustand (client state), TanStack Query (server state), Axios (HTTP client), React Router v6.
- **Backend:** Golang 1.23+, Gin Web Framework, PostgreSQL 16 (primary DB with `pgcrypto`), Redis (sessions, streaks, daily quest cache), Apache Kafka (event-driven messaging), JWT (short-lived access + rotated refresh token).
- **Architecture:** Strict Clean Architecture (Backend) + Headless Hook & Component Layering (Frontend).
- **Language Policy:**
  - **Code, comments, commits, docs, variable names:** **English only.**
  - **User-facing UI copy (labels, placeholders, toast notifications):** **Indonesian.**

---

## 🎨 2. Visual Design System (90% Duolingo Tactile 3D Taste in Clean Light Mode + 10% CodeAbroad Identity)

Refer to `.agents/docs/design-system.md`.

### 2.1 Visual Philosophy
- **90% Duolingo Tactile 3D Taste (Clean Light Mode):** Latar belakang canvas putih-hangat (`#FAFAF9`), kartu putih bersih (`#FFFFFF`), sudut membulat ramah (`rounded-2xl` & `rounded-3xl`), tombol 3D tebal dengan kedalaman bayangan fisik (`shadow-[0_4px_0_0_#1D4ED8]`) yang amblas saat diklik (`active:translate-y-1 active:shadow-none`), dan native haptic feedback (`triggerHaptic`).
- **10% CodeAbroad Identity:** **Electric Tech Blue / Cobalt** (`#2563EB`, `#3B82F6`, `#1D4ED8`) dengan **Neon Cyan** (`#38BDF8`) flight path accents, menggantikan hijau neon Duolingo.
- **Brand Companion:** Kodi the mascot menemani pembelajaran, milestone, dan selebrasi (`<KodiMascot>`).
- **Brand Logo:** `<Logo>` wajib selalu me-render `variant="slate"` (obsidian/slate) atau `variant="blue"`. **Dilarang keras menggunakan matcha green**.

### 2.2 Anti-AI Slop Rules
- ❌ **No generic SaaS filler cards:** Tidak ada kartu dengan bullet list tak bermakna atau fake checklist.
- ❌ **No arbitrary gray icon boxes:** Setiap icon harus fungsional dan berkarakter.
- ❌ **No cluttered multi-column widgets:** Jaga fokus dengan satu objektif interaksi utama per viewport.
- ❌ **No lazy responsive stacking:** Jangan sekadar menumpuk 2 kolom desktop jadi kolom vertikal panjang di mobile. Ikuti task-first mobile design dengan min 44px touch targets.

### 2.3 Official Reusable UI Primitives (`frontend/src/components/ui/`)
Always import and use these components instead of writing ad-hoc Tailwind values:
- `<Button3D>`: Chunky 3D Duolingo button (`variant="blue"|"cyan"|"dark"|"emerald"|"ghost"`, `size="sm"|"md"|"lg"`).
- `<Card3D>`: Clean white card container with rounded-3xl and tactile border.
- `<Input>`: Tactile input field with 2px border, rounded-2xl geometry, and Electric Blue focus ring.
- `<RoadmapNode3D>`: Gamified circular learning path node with completed, active, and locked states.
- `<Modal3D>`: Clean light mode tactile dialog with backdrop blur, 3D action buttons, and ESC listener.
- `<Skeleton3D>`: Tactile shimmer placeholders for cards, text lines, and buttons.
- `<MetricTile>`: Gamified 2x2 stat tile supporting `surface="light"|"dark"`.
- `<BadgePill>`: Status pill (`variant="xp"|"streak"|"verified"|"blue"|"cyan"|"neutral"|"error"`, `size="sm"|"md"|"lg"`).
- `<ProgressBar3D>`: 3D progress capsule with internal gloss reflection.
- `<KodiMascot>` & `<SpeechBubble>`: Companion mascot with animated emotional poses.
- `<Logo>`: Platform brand mark (slate/blue only).

---

## 🏛️ 3. Frontend Architecture Pattern (`frontend/src/`)

Maintain clean separation across dedicated directories:

```text
frontend/src/
├── components/
│   ├── ui/             # Single Source of Truth for design system primitives
│   ├── guards/         # Route access & onboarding enforcement (ProtectedRoute)
│   ├── illustrations/  # Pure SVG artwork, country flags, flight roadmap doodles
├── hooks/              # Headless controllers (isolate business logic, React Query, Zustand)
├── pages/              # Pure page layout orchestration (consumes custom hooks)
├── services/           # Axios HTTP endpoints with typed Promise responses
├── static/             # Static configuration, options list, static copy
├── store/              # Zustand global client stores (use persist middleware if needed)
├── tokens/             # Design Tokens SSOT (TOKENS export)
├── types/              # Strict TypeScript interfaces & DTOs (ZERO 'any')
└── utils/              # Pure helpers: formatting, date, haptics, validation
```

### Key Frontend Rules:
1. **Headless Hook Pattern:** Pages (e.g. `DashboardPage.tsx`) should not write raw `useEffect`, inline Axios calls, or heavy state calculations. Delegate to headless hooks (e.g. `useDashboard.ts`).
2. **Design Tokens First:** Use predefined tokens from `TOKENS` and Tailwind utility classes defined in `index.css`.
3. **Zero `any`:** Every API response and function parameter must have an explicit TypeScript interface in `types/`.

---

## ⚙️ 4. Backend Clean Architecture Pattern (`backend/internal/`)

Strict unidirectional dependency rule:
`delivery/http/ ➔ usecase/ ➔ repository/ (implements domain interfaces) ➔ domain/`

```text
backend/
├── internal/
│   ├── domain/             # Entities, custom error types, repository contracts (pure Go)
│   ├── usecase/            # Pure business logic (depends only on domain)
│   ├── repository/         # Database persistence implementations (PostgreSQL, Redis)
│   │   ├── database/       # PostgreSQL queries via sql.DB
│   │   └── cache/          # Redis session, streak, and cache operations
│   ├── delivery/
│   │   └── http/
│   │       ├── handler/    # Gin HTTP handlers (bind JSON, call usecase, render response)
│   │       ├── middleware/ # JWT AuthMiddleware, CORS, Recovery
│   │       └── response/   # Standardized JSON response helpers
│   └── infrastructure/     # Kafka producer/consumer, DB & Redis pool setup
├── migrations/             # SQL migrations: 00000X_name.up.sql & .down.sql
```

### Key Backend Rules:
1. **No Business Logic in Handlers:** Gin handlers only handle HTTP binding, authentication context extraction (`c.GetString("userID")`), calling the usecase, and sending JSON responses.
2. **No Direct DB Calls in Handlers:** Always route through Usecase ➔ Repository.
3. **Context First:** Every service and repository function must accept `ctx context.Context` as its first parameter.
4. **Standard API Response Format:**
   ```json
   // Success:
   { "success": true, "data": { ... }, "message": "string" }
   // Error:
   { "success": false, "error": "error message", "code": "ERROR_CODE" }
   ```
5. **Domain Error Architecture:** Use unified domain errors (`domain.NewNotFoundError`, `domain.NewBadRequestError`, `domain.NewConflictError`) mapped to HTTP status codes via `response.Error(c, err)`.

---

## 🎯 5. End-to-End Vertical Slice Workflow

When implementing any new feature, follow this exact step-by-step lifecycle:

```text
[Step 1: Specs & Documentation]
  └─ Create/update .agents/features/XX-feature-name.md with ERD, endpoints, and UI state.

[Step 2: Database Migration]
  └─ Create backend/migrations/00000X_feature.up.sql and .down.sql with clean indexes.

[Step 3: Backend Clean Architecture]
  ├─ 1. domain/: Define structs, request DTOs, and repository interfaces.
  ├─ 2. repository/: Implement database queries in internal/repository/database/.
  ├─ 3. usecase/: Write business logic in internal/usecase/.
  └─ 4. delivery/http/: Create handler and register routes in router.go.

[Step 4: Frontend Implementation]
  ├─ 1. types/: Add TypeScript interfaces for DTOs.
  ├─ 2. services/: Add API call functions in services/.
  ├─ 3. store/ & hooks/: Manage client state and React Query hooks.
  ├─ 4. components/: Build UI using <Button3D>, <Card3D>, <MetricTile>, <BadgePill>.
  └─ 5. pages/: Mount components into page routes.

[Step 5: Automated Testing Suite]
  └─ Author Go unit tests (*_test.go) covering happy path, validation, and error cases.

[Step 6: Git Workflow]
  └─ Commit with Conventional Commits (feat, fix, docs, refactor) on feature branch.
```
