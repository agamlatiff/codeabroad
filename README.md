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

**CodeAbroad** is an open-source, gamified IT learning platform engineered specifically for Indonesian software engineers. Think of it as a **Career RPG and International Developer GPS** — complete industrial coding quests, earn XP, maintain daily login streaks, unlock Tokyo arcade items, and track your readiness to land high-paying engineering roles overseas.

### Why CodeAbroad?
- 🎯 **A Clear End Goal:** Not just generic coding theory, but getting hired in Tokyo, Berlin, or Singapore.
- 🗺️ **Direct Industrial Curriculum Units:** Sequential learning path with numbered milestone nodes (Part 1, 2, 3...) with zero filler content.
- 💻 **In-Browser Coding Workspace:** Interactive Monaco code editor with real Go unit test assertions and Tokyo workplace Japanese (*Nihongo Notes*).
- 🎮 **Tactile 3D Gamification:** 90% Duolingo tactile 3D physics (Clean Light Mode `#FAFAF9`, 4px physical bevel shadows that amblas when clicked, native haptics) + 10% CodeAbroad Electric Blue.
- 🦊 **Kodi Mascot Companion:** Kodi the friendly mascot cheers your progress, celebrates milestones, and provides guidance.

---

## 🎮 Core Features

| Feature | Description |
| :--- | :--- |
| 🧭 **Curriculum Learning Path** | Sequential units (Golang Dasar, REST API & Middleware, Concurrency) with clear numbered parts (1, 2, 3...) |
| ⚡ **3 Interaction Node States** | ✅ Completed (Emerald 3D), ⚡ Active (Electric Blue 3D with pulsating ring + popover CTA + Kodi), 🔒 Locked (Slate 3D) |
| 💻 **Interactive Code Workspace** | Split-pane editor (Monaco Editor) with Go unit test runner and Nihongo workplace notes |
| 🔥 **Daily Streak Engine** | Real 7-day streak consistency tracking backed by Redis and PostgreSQL presence logs |
| 🎁 **Golden Chest & Daily 50 XP** | Interactive 3D reward chest tracking your daily habit milestones |
| 💎 **Akihabara Arcade Shop** | Virtual shop to spend earned blue gems on Streak Freezes, XP Boosters, and CV Review requests |
| 🇯🇵 **Tokyo Office Vocab** | Compact workplace Japanese flashcards with pronunciation and developer context |
| 🎫 **3D Boarding Pass Onboarding** | Interactive 4-step wizard generating your `CGK ✈️ NRT` developer boarding pass |
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

## 🗄️ Database Architecture & ERD (v2.1)

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
│  - Career Path & Country IDs │ │  - Last Active Timestamp     │
│  - Primary Stack & Level     │ └──────────────┬───────────────┘
│  - Onboarding Status         │                │
└──────────────────────────────┘                │ (1-to-Many FK user_id)
        ┌───────────────────────────────────────┴───────────────────────┐
        ▼                                       ▼                       ▼
  user_inventories                     user_activity_logs       daily_chest_claims
   (Arcade Items)                      (7-Day Consistency)      (Milestone Chests)
```

> 💡 **Visualisasi Interaktif:** Skrip DBML lengkap versi 2.1 siap di-copy-paste langsung ke **[dbdiagram.io](https://dbdiagram.io)** pada dokumen [`.agents/docs/erd.md`](.agents/docs/erd.md).

---

## 🗂️ Project Structure

```text
codeabroad/
├── .agents/                    # 🧠 Master AI Agent & Engineering Central
│   └── docs/
│       ├── SKILL.md            # Master Autonomous Engineering Workflow (SSOT)
│       ├── erd.md              # Database Schema (v2.1 Normalized) & DBML
│       ├── prd.md              # Product Requirements Document (v2.0)
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
│   ├── cmd/                    # Entry point (main.go & dependency wiring)
│   ├── internal/
│   │   ├── domain/             # Entities, request/response DTOs, repository interfaces
│   │   ├── usecase/            # Pure business logic (depends only on domain)
│   │   ├── repository/         # Database persistence implementations
│   │   │   ├── database/       # PostgreSQL queries via pgx/v5
│   │   │   └── session/        # Redis session & streak cache
│   │   ├── delivery/http/      # Gin HTTP handlers, middlewares & response envelopes
│   │   └── infrastructure/     # DB pools, Redis client, Kafka producer
│   └── migrations/             # SQL Migrations: 000001 to 000008 (Normalized schema)
│
├── nginx/                      # Nginx reverse proxy configuration
└── docker-compose.yml          # Local infra orchestration
```

---

## 🚀 Getting Started

### Prerequisites
- [Go 1.23+](https://golang.org/dl/)
- [Node.js 20+](https://nodejs.org/)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/codeabroad.git
cd codeabroad
```

### 2. Setup Environment Variables
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Start Infrastructure (Docker)
```bash
docker-compose up -d
```
Starts: PostgreSQL 16, Redis 7, Kafka, and Zookeeper.

### 4. Run the Backend API
```bash
cd backend
go mod download
go run cmd/main.go
```
Backend API will be live at `http://localhost:8080/api/v1`

### 5. Run the Frontend App
```bash
cd frontend
npm install
npm run dev
```
Frontend App will be live at `http://localhost:5173`

---

## 📡 API Endpoints Overview

Base URL: `http://localhost:8080/api/v1`

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/register` | Register new account (auto-login enabled) |
| **Auth** | `POST` | `/auth/login` | Login with credentials & update login streak |
| **Auth** | `POST` | `/auth/refresh` | Auto-refresh access token via Redis session |
| **Auth** | `POST` | `/auth/logout` | Revoke session from Redis |
| **User** | `GET` | `/users/me` | Fetch active user profile |
| **User** | `PATCH` | `/users/me` | Update profile fields |
| **User** | `GET` | `/users/me/activity-logs` | Fetch 7-day weekly activity history |
| **Onboarding** | `POST` | `/onboarding` | Submit 4-step wizard & claim welcome bonus |
| **Roadmap** | `GET` | `/roadmap` | Fetch active learning path units and parts |
| **Quest** | `GET` | `/quests` | List curriculum quests with filter |
| **Quest** | `POST` | `/quests/:id/submit` | Submit code solution & run unit tests |
| **Gamification**| `GET` | `/gamification/status` | Fetch gems, inventory, and chest status |
| **Gamification**| `POST` | `/gamification/daily-chest` | Claim daily milestone golden chest |
| **Gamification**| `POST` | `/gamification/shop/buy` | Buy items in Akihabara arcade shop |
| **Leaderboard** | `GET` | `/leaderboard` | Get weekly developer league rankings |
| **Vocabulary** | `GET` | `/vocabulary` | Get Tokyo office workplace Japanese cards |

---

## 📚 Master Engineering Documentation

All architectural standards and documentation are centralized in [`.agents/docs/`](.agents/docs/):

| Document | Purpose |
| :--- | :--- |
| **[Master Workflow Skill](.agents/docs/SKILL.md)** | Autonomous development rules, Clean Architecture laws, Headless Hook patterns, and zero-any policy. |
| **[ERD & DBML Specification](.agents/docs/erd.md)** | Normalized database schema (v2.0) with interactive dbdiagram.io code. |
| **[Product Requirements (PRD)](.agents/docs/prd.md)** | Product vision, curriculum learning path specs, and gamification mechanics. |
| **[Design System Spec](.agents/docs/design-system.md)** | 90% Duolingo 3D Tactile design tokens, component primitives, and Anti-AI Slop manifesto. |

---

## 🌿 Git Branching & Conventional Commits

```text
main       → Production-ready, stable releases
staging    → Integration and walkthrough testing
feature/*  → Isolated feature development (e.g. feature/normalize-user-gamification)
```

Format commits with **Conventional Commits** in **English**:
```text
feat(auth): normalize user gamification 1-to-1 table
fix(roadmap): resolve 3d node pulsating ring z-index
docs(skill): update master autonomous development guidelines
```

---

## 📄 License & Community

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.  
Built with ❤️ for Indonesian developers aiming to conquer global tech engineering hubs.
