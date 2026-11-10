<div align="center">

# 🌍 CodeAbroad

### *Master Languages. Achieve Global Certification.*

A world-class gamified language learning mastery platform engineered for global learners.  
Combining **Duolingo 3D Tactile Physics**, **Anki Spaced Repetition (SuperMemo SM-2)**, and **Official International Standards**:  
**JLPT 🇯🇵 (N5–N1)** · **IELTS 🇬🇧 (5.0–8.5)** · **TOEFL 🇺🇸 (60–120)** · **Goethe 🇩🇪 (A1–C1)** · **HSK 🇨🇳 (1–6)** · **DELF 🇫🇷 (A1–C1)**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Go Version](https://img.shields.io/badge/Go-1.23+-00ADD8?logo=go)](https://golang.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Web Audio API](https://img.shields.io/badge/Web%20Audio-Procedural%20SFX-8B5CF6)](frontend/src/services/audioService.ts)

[Documentation](.agents/docs/SKILL.md) · [ERD & DBML (v3.0)](.agents/docs/erd.md) · [PRD (v3.0)](.agents/docs/prd.md) · [Design System](.agents/docs/design-system.md)

</div>

---

## 📖 About CodeAbroad

**CodeAbroad** is an open-source, gamified language acquisition and certification platform. Unlike generic language apps that focus on mindless vocabulary memorization, CodeAbroad bridges three worlds into a unified pedagogical engine:

1. 🎮 **The Tactile Delight of Duolingo 3D:**  
   Chunky physical 3D buttons (4px depth), an interactive serpentine RPG roadmap, procedural Web Audio synthesizer soundscape (zero network latency), daily streak flames, golden reward chests, and an empathetic companion mascot (**Kodi**).
2. 🧠 **The Pedagogical Rigor of Anki SRS (SuperMemo SM-2):**  
   Eliminating the forgetting curve. Every mistake made in daily lessons or exams is automatically scheduled into an adaptive Spaced Repetition memory queue with dynamic interval math ($1 \to 3 \to 6 \to 12 \to 30$ days).
3. 🏛️ **The Standard of Official International Certifications:**  
   No arbitrary app levels. All curriculum tracks map directly to global certification frameworks (**JLPT, IELTS, TOEFL, Goethe-Zertifikat, HSK, DELF**) with full-length **Diagnostic Mock Exams** simulating official timer conditions, audio rules, and sectional pass marks.
4. 🧩 **Visual Syntax Scaffolding (Mastery Over Memorization):**  
   Sentences are deconstructed into color-coded functional syntax blocks:  
   🟦 **Subject/Topic** · 🟩 **Particle/Case/Preposition** · 🟧 **Object/Target/Context** · 🟪 **Predicate/Verb Tenses**.

---

## 🗺️ 6 Global Destination Tracks

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CODEABROAD 6 GLOBAL DESTINATION TRACKS                                        │
├──────────────────┬──────────────────┬──────────────────┬──────────────────┬──────────────────┬──────────────────┤
│   🇯🇵 JEPANG      │ 🇬🇧 INGGRIS (UK)  │ 🇺🇸 INGGRIS (US)  │    🇩🇪 JERMAN     │   🇨🇳 MANDARIN    │    🇫🇷 PRANCIS    │
│  (Tokyo Track)   │  (London Track)  │(Silicon Valley)  │  (Berlin Track)  │ (Shanghai Track) │  (Paris Track)   │
├──────────────────┼──────────────────┼──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ • JLPT N5 – N1   │ • IELTS 5.0–8.5  │ • TOEFL iBT      │ • Goethe A1 – C1 │ • HSK 1 – 6      │ • DELF A1 – C1   │
│ • Kanji, Kana    │ • UK Spelling    │ • US Spelling    │ • Artikel Kasus  │ • Hanzi & Pinyin │ • Gender Benda   │
│   & Romaji       │   (colour/lift)  │   (color/elev.)  │   (Der/Die/Das)  │   4 Nada (Tones) │ • Passé Composé  │
│ • Partikel SOV   │ • Non-Rhotic RP  │ • Rhotic Flap-T  │ • V2 & Perfekt   │ • Aspek '了'     │ • Aksen é/è/ç    │
│ • Tiket CGK✈️HND  │ • Tiket CGK✈️LHR │ • Tiket CGK✈️SFO │ • Tiket CGK✈️BER │ • Tiket CGK✈️PEK │ • Tiket CGK✈️CDG │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

---

## 🎮 Core Learning Features

| Feature | Description |
| :--- | :--- |
| 🧩 **Visual Syntax Builder** | Interactive drag-and-drop / tap-to-assemble sentence builder with color-coded syntax roles and distractor tiles |
| 👂 **Multi-Pillar 4 Indera** | Reading (dynamic Furigana `<ruby>`), Listening (native audio + 0.75x Turtle mode), Writing (multi-script tolerance), Speaking (Web Speech API mic recognition) |
| 🦉 **Kodi AI Diagnostic Coach** | Instant conceptual error analysis via `diagnostic_rubric` explaining *why* a specific mistake was made (e.g. particle `で` vs `に`, case `Akkusativ` vs `Dativ`) |
| 🗂️ **Automated Anki SRS Decks** | SuperMemo SM-2 spaced repetition queue auto-scheduling failed exercises into daily review warm-ups |
| 📋 **Diagnostic Mock Exam Engine** | Full-length timed mock exams simulating official testing conditions, sectional cutoffs, and pass probability prediction |
| 🛡️ **Adaptive Placement Test** | 10-minute dynamic test allowing experienced learners to skip beginner levels with auto-completed prior units and zero-clutter SRS |
| ⚡ **Multi-Language Switcher** | Instant language drawer switching in TopBar with **Zero Collision Architecture** (isolated progress & SRS per language) |
| 🔊 **Procedural Web Audio Engine** | 13 Duolingo-grade procedural tactile sound effects synthesized in browser with zero network download latency |
| 🎫 **3D Tactile Boarding Pass** | Interactive onboarding milestone ticket (`CGK ✈️ HND`, `CGK ✈️ BER`, etc.) granting +50 XP welcome bonus |
| 🔥 **Daily Streak & Golden Chest** | Flame streak consistency tracking with 3D golden chests unlocked at 50 XP daily habit milestones |

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework:** React 18 + TypeScript 5 (Strict **Zero `any`** policy)
- **Tooling:** Vite, Tailwind CSS v4 (`@theme`)
- **State Management:** **Zustand** (client auth & UI state) + **TanStack Query** (server caching & mutations)
- **Architecture:** **Headless Hook Pattern** (all API & business logic isolated into custom hooks, JSX pages remain purely presentational)
- **Audio & Speech:** **Web Audio API** (Procedural Synthesizer in `audioService.ts`) + **Web Speech API** (`SpeechRecognition` & `speakLanguage`)
- **Design Primitives:** `<Button3D>`, `<Card3D>`, `<RoadmapNode3D>`, `<Modal3D>`, `<Input>`, `<MetricTile>`, `<BadgePill>`, `<ProgressBar3D>`, `<KodiMascot>`, `<Logo>`

### Backend
- **Language:** Golang 1.23+ with Gin Web Framework
- **Architecture:** **Strict Clean Architecture** (`delivery/http/` ➔ `usecase/` ➔ `repository/` ➔ `domain/`)
- **Authentication:** Stateless short-lived JWT Access Token (15m) + Stateful Rotated Refresh Token in Redis (30d)
- **Database:** PostgreSQL 16 (`pgcrypto`) with Normalized 3NF Curriculum & JSONB Interactive Payloads
- **Cache:** Redis 7 (sessions, active streaks, daily review queue cache)
- **Messaging:** Apache Kafka (event-driven async processing)

### Infrastructure
- **Containers:** Docker + Docker Compose (PostgreSQL, Redis, Kafka, Zookeeper)
- **Reverse Proxy:** Nginx with security headers and SSL termination

---

## 🗄️ Database Architecture & ERD (v3.0)

CodeAbroad v3.0 unites **Core Identity & Gamification** with the **Universal Language Curriculum & SRS Engine**:

```text
┌────────────────────────────────────────────────────────┐
│               PILLAR 1: AUTH CORE                      │
│  users (UUID, Email, Password Hash)                    │
└───────────────────────────┬────────────────────────────┘
                            │ (1-to-1 FK user_id)
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│  PILLAR 2: USER PROFILES     │ │  PILLAR 3: GAME LOOP ENGINE  │
│  user_profiles               │ │  user_gamification           │
│  - Name, Username, Bio       │ │  - XP, Level, Streak, Gems   │
│  - Roadmap View Preference   │ │  - Last Active Timestamp     │
│  - Onboarding Wizard Flags   │ └──────────────┬───────────────┘
└──────────────────────────────┘                │ (1-to-Many FK user_id)
        ┌───────────────────────────────────────┴───────────────────────┐
        ▼                                       ▼                       ▼
  user_inventories                     user_activity_logs       user_daily_chest_claims
   (Consumables & Bag)                 (7-Day Consistency)      (Milestone Chests)

┌────────────────────────────────────────────────────────────────────────┐
│             UNIVERSAL LANGUAGE CURRICULUM & 4-PILLAR EXERCISES         │
│  languages (6 tracks: ja, en-gb, en-us, de, zh, fr + supported_scripts)│
│       │ (1:N)                                                          │
│       ▼                                                                │
│  proficiency_levels (JLPT N5-N1, CEFR A1-C1, HSK 1-6 + tier)           │
│       ├───────────────────┬───────────────────┐                        │
│       ▼                   ▼                   ▼                        │
│  grammar_points         units               readiness_exam_attempts    │
│  (category: tense,     (curriculum &        (4-Pillar Score & Report)  │
│   conjugation,          mock exam)                                     │
│   particles)              │                                            │
│       │                   ▼                                            │
│       │                lessons (daily node)                            │
│       │                   │                                            │
│       └─────────┬─────────┘                                            │
│                 ▼                                                      │
│             exercises                                                  │
│             - skill_pillar: reading, listening, writing, speaking      │
│             - type: sentence_builder, fill_blank, speaking_repeat      │
│             - content, correct_answer, acceptable_answers, rubric      │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│             USER PROGRESS, ANKI SRS & READINESS DIAGNOSTICS            │
│  users ──(1:N)──> user_language_enrollments (Active study languages)   │
│  users ──(1:N)──> user_lesson_progress      (Node completion & score)  │
│  users ──(1:N)──> user_exercise_attempts    (Item-level attempt log)   │
│  users ──(1:N)──> user_srs_reviews          (Anki SM-2 Spaced Memory)  │
│  users ──(1:N)──> readiness_exam_attempts   (Mock Exam 4-Pillar Score) │
└────────────────────────────────────────────────────────────────────────┘
```

> 💡 **Interactive Visualizer:** Copy-paste the full DBML script from [`.agents/docs/erd.md`](.agents/docs/erd.md) directly into **[dbdiagram.io](https://dbdiagram.io)**.

---

## 🗂️ Project Structure

```text
codeabroad/
├── .agents/                    # 🧠 Master AI Agent & Engineering Central
│   └── docs/
│       ├── SKILL.md            # Master Autonomous Engineering Workflow (SSOT)
│       ├── erd.md              # Database Schema (v3.0 Normalized) & DBML
│       ├── prd.md              # Product Requirements Document (v3.0)
│       └── design-system.md    # Duolingo 3D Design System Specification (v3.1)
│
├── frontend/                   # React 18 + TypeScript Client
│   └── src/
│       ├── components/
│       │   ├── ui/             # Single Source of Truth 3D UI Primitives (Button3D, Card3D, etc.)
│       │   └── guards/         # ProtectedRoute & Onboarding enforcement
│       ├── hooks/              # Headless controller hooks (useLogin, useLearnWorkspace, etc.)
│       ├── pages/              # Pure declarative page layouts
│       ├── services/           # Typed Axios HTTP endpoints + AudioService (Web Audio procedural SFX)
│       ├── store/              # Zustand global client stores (auth, audio, roadmap)
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
docker compose up -d postgres redis kafka
```

### 3. Run Database Migrations
Apply normalized schema tables, official proficiency levels, grammar banks, and seed lessons:
```bash
make db-migrate-up
```

### 4. Run Backend API
```bash
cd backend
go run cmd/api/main.go
```

### 5. Run Frontend App
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to start your language mastery journey!

---

## 📜 Engineering Standards & Policies

1. **Zero `any` TypeScript:** All frontend code must use strict types. Type casting to `any` is strictly prohibited.
2. **Headless Hook Pattern:** Components in `frontend/src/pages` and `frontend/src/components` must remain presentational. All state, API calls, and lifecycle logic live in dedicated custom hooks.
3. **Strict Clean Architecture:** Domain entities and repository interfaces live in `backend/internal/domain`. HTTP handlers never communicate directly with repositories; they strictly call `usecase`.
4. **Duolingo 3D Tactile Design Standard:** All buttons, cards, and modal surfaces must follow the tactile 3D physical depth token system defined in [`design-system.md`](.agents/docs/design-system.md).
5. **Zero Raw Emoji Policy:** Database and UI components must use clean vector 3D SVG flag badges instead of raw OS Unicode emojis.

---

## 📄 License

CodeAbroad is licensed under the [MIT License](LICENSE).
