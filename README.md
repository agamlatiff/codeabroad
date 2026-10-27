<div align="center">

# 🌍 CodeAbroad

### *Learn to code. Land an IT career abroad.*

A gamified career RPG & IT learning platform for Indonesian developers targeting tech jobs in **Tokyo 🇯🇵**, **Berlin 🇩🇪**, and **Singapore 🇸🇬**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Go Version](https://img.shields.io/badge/Go-1.23+-00ADD8?logo=go)](https://golang.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

[Documentation](.agents/docs/SKILL.md) · [ERD & DBML](.agents/docs/erd.md) · [PRD](.agents/docs/prd.md) · [Design System](.agents/docs/design-system.md)

</div>

---

## 📖 About CodeAbroad

**CodeAbroad** is an open-source, gamified IT learning platform engineered specifically for Indonesian software engineers. Think of it as a **Career RPG and International Developer GPS** — complete industrial coding quests, earn XP, maintain daily login streaks, unlock arcade items, and track your readiness to land high-paying engineering roles overseas.

### Why CodeAbroad?
- 🎯 **A Clear End Goal:** Not just generic coding theory, but getting hired in Tokyo, Berlin, or Singapore.
- 🗺️ **Direct Industrial Curriculum Units:** Sequential learning path with numbered milestone nodes (Part 1, 2, 3...) with zero filler content.
- 💻 **In-Browser Coding Workspace:** Interactive Monaco code editor with real Go unit test assertions and workplace Japanese (*Nihongo Notes*).
- 🎮 **Tactile 3D Gamification:** 90% Duolingo tactile 3D physics (Clean Light Mode `#FAFAF9`, 4px physical bevel shadows that amblas when clicked, native haptics) + 10% CodeAbroad Electric Blue.
- 🦊 **Kodi Mascot Companion:** Kodi the friendly mascot cheers your progress, celebrates milestones, and provides guidance.

---

## 🎮 Core Features

| Feature | Description |
| :--- | :--- |
| 🧭 **Modular Curriculum Learning Path** | Normalized units (`tech_stacks` ➔ `modules` ➔ `chapters` ➔ `quests`) with clear numbered parts (1, 2, 3...) |
| ⚡ **Multi-Format Quest Nodes** | Concept Quizzes, Fill-in-the-blank, in-browser Monaco Coding challenges, Daily habit reviews, and Boss milestones |
| 🎮 **3 Interaction Node States** | ✅ Completed (Emerald 3D), ⚡ Active (Electric Blue 3D with pulsating ring + popover CTA + Kodi), 🔒 Locked (Slate 3D) |
| 💻 **Interactive Code Workspace** | Split-pane editor (Monaco Editor) with Go unit test runner and workplace communication notes |
| 🔥 **Daily Streak Engine** | Real 7-day streak consistency tracking backed by Redis and PostgreSQL presence logs |
| 🎁 **Golden Chest & Daily 50 XP** | Interactive 3D reward chest tracking your daily habit milestones |
| 💎 **Akihabara Arcade Shop** | Virtual shop to spend earned blue gems on Streak Freezes and XP Boosters |
| 🇯🇵 **Multi-Country Workplace Vocab** | 150 JLPT vocabulary bank (N5–N1) with structured native pronunciation audio and CEFR support |
| 🎫 **3D Boarding Pass Onboarding** | Interactive 4-step wizard generating your `CGK ✈️ NRT` or `CGK ✈️ BER` developer boarding pass |
| 📊 **Leaderboard** | Weekly developer league rankings driving healthy peer motivation |

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework:** React 18 + TypeScript 5 (Strict **Zero `any`** policy)
- **Tooling:** Vite, Tailwind CSS v4 (`@theme`)
- **State Management:** **Zustand** (client auth & UI state) + **TanStack Query** (server caching & mutations)
- **Architecture:** **Headless Hook Pattern** (all API & business logic isolated into custom hooks, JSX pages remain purely presentational)
- **Design Primitives:** `<Button3D>`, `<Card3D>`, `<RoadmapNode3D>`, `<Modal3D>`, `<Input>`, `<MetricTile>`, `<BadgePill>`, `<ProgressBar3D>`, `<KodiMascot>`, `<Logo>`

### Backend
- **Language:** Golang 1.23+ with Gin Web Framework
- **Architecture:** **Strict Clean Architecture** (`delivery/http/` ➔ `usecase/` ➔ `repository/` ➔ `domain/`)
- **Authentication:** Stateless short-lived JWT Access Token (15m) + Stateful Rotated Refresh Token in Redis (30d)
- **Database:** PostgreSQL 16 (`pgcrypto`) with **The 3-Pillar Normalized Architecture** (`users` ➔ `user_profiles` + `user_gamification`)
- **Cache:** Redis 7 (sessions, active streaks, daily quest cache)
- **Messaging:** Apache Kafka (event-driven async processing)

### Infrastructure
- **Containers:** Docker + Docker Compose (PostgreSQL, Redis, Kafka, Zookeeper)
- **Reverse Proxy:** Nginx with security headers and SSL termination

---

## 🗄️ Database Architecture & ERD (v2.2)

CodeAbroad menerapkan **The 3-Pillar Normalized Architecture** untuk memisahkan domain secara ketat sesuai prinsip *Single Responsibility Principle* (SRP) dan *Zero-Leak Security*:

```text
┌────────────────────────────────────────────────────────┐
│               PILLAR 1: AUTH CORE                      │
│  users (UUID, Email, Password Hash)                    │
└───────────────────────────┬────────────────────────────┘
                            │ (1-to-1 FK user_id)
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│  PILLAR 2: PROFIL & KARIR    │ │  PILLAR 3: GAME LOOP ENGINE  │
│  user_profiles               │ │  user_gamification           │
│  - Name, Username, Bio       │ │  - XP, Level, Streak, Gems   │
│  - Country & Career Path FKs │ │  - Last Active Timestamp     │
│  - Normalized Tech Stack ID  │ └──────────────┬───────────────┘
│  - Onboarding Status         │                │
└──────────────────────────────┘                │ (1-to-Many FK user_id)
        ┌───────────────────────────────────────┴───────────────────────┐
        ▼                                       ▼                       ▼
  user_inventories                     user_activity_logs       daily_chest_claims
   (Player Bag)                        (7-Day Consistency)      (Milestone Chests)

┌────────────────────────────────────────────────────────────────────────┐
│                CURRICULUM & MULTI-COUNTRY WORKSPACE                    │
│  countries ──(FK)──> vocabularies (JLPT N5-N1 & CEFR with audio)       │
│  career_paths ──(FK)──> tech_stacks ──(FK)──> modules ──> chapters     │
│                                                            │           │
│                                                            ▼           │
│                                                 quests ──> user_quests │
└────────────────────────────────────────────────────────────────────────┘
```

> 💡 **Visualisasi Interaktif:** Skrip DBML lengkap versi 2.2 siap di-copy-paste langsung ke **[dbdiagram.io](https://dbdiagram.io)** pada dokumen [`.agents/docs/erd.md`](.agents/docs/erd.md).

---

## 🗂️ Project Structure

```text
codeabroad/
├── .agents/                    # 🧠 Master AI Agent & Engineering Central
│   └── docs/
│       ├── SKILL.md            # Master Autonomous Engineering Workflow (SSOT)
│       ├── erd.md              # Database Schema (v2.2 Normalized) & DBML
│       ├── prd.md              # Product Requirements Document (v2.2)
│       └── design-system.md    # Duolingo 3D Design System Specification (v3.1)
│
├── frontend/                   # React 18 + TypeScript Client
│   └── src/
│       ├── components/
│       │   ├── ui/             # Single Source of Truth 3D UI Primitives (Button3D, Card3D, etc.)
│       │   └── guards/         # ProtectedRoute & Onboarding enforcement
│       ├── hooks/              # Headless controller hooks (useLogin, useDashboard, etc.)
│       ├── pages/              # Pure declarative page layouts
│       ├── services/           # Typed Axios HTTP endpoints with auth interceptor
│       ├── store/              # Zustand global client stores
│       ├── tokens/             # Design token constants (TOKENS)
│       └── types/              # Strict TypeScript interfaces & DTOs (Zero 'any')
│
├── backend/                    # Go 1.23+ Clean Architecture API
│   ├── cmd/api/                # Main entrypoint
│   └── internal/
│       ├── config/             # Environment configs
│       ├── delivery/http/      # Gin HTTP controllers, routes & middleware
│       ├── domain/             # Pure entities, domain interfaces & business errors
│       ├── repository/         # Postgres & Redis persistence implementations
│       └── usecase/            # Pure business workflows
│
└── docker-compose.yml          # Local infra orchestration (Postgres, Redis, Kafka)
```

---

## 🚀 Quickstart

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ & npm
- Go 1.23+

### 1. Clone & Setup Environment
```bash
git clone https://github.com/agamlatiff/codeabroad.git
cd codeabroad

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Start Infrastructure
```bash
docker compose up -d postgres redis kafka zookeeper
```

### 3. Run Backend API
```bash
cd backend
go run cmd/api/main.go
```

### 4. Run Frontend App
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to start your developer journey abroad!

---

## 📜 Engineering Standards & Policies

1. **Zero `any` TypeScript:** All frontend code must use strict types. Type casting to `any` is strictly prohibited.
2. **Headless Hook Pattern:** Components in `frontend/src/pages` and `frontend/src/components` must remain presentational. All state, API calls, and lifecycle logic live in dedicated custom hooks.
3. **Strict Clean Architecture:** Domain entities and repository interfaces live in `backend/internal/domain`. HTTP handlers never communicate directly with repositories; they strictly call `usecase`.
4. **Duolingo 3D Tactile Design Standard:** All buttons, cards, and modal surfaces must follow the tactile 3D physical depth token system defined in [`design-system.md`](.agents/docs/design-system.md).

---

## 📄 License

CodeAbroad is licensed under the [MIT License](LICENSE).
