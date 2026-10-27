# Product Requirements Document (PRD) - CodeAbroad
**Version:** 2.2 (Multi-Country Modular Architecture & JLPT/CEFR Engine)  
**Status:** In Active Development (v0.3.0)  
**Last Updated:** 2026-10-27  

---

## 🧭 1. Executive Summary & Vision

### 1.1 Product Mission
**CodeAbroad** is an open-source, gamified IT learning platform engineered specifically for Indonesian software engineers targeting overseas tech careers in **Tokyo 🇯🇵**, **Berlin 🇩🇪**, and **Singapore 🇸🇬**.

Unlike generic video platforms (Udemy, Coursera), CodeAbroad acts as a **Career RPG and International Developer GPS**:
- **Structured Vertical Milestones:** Sequential units and numbered parts (1, 2, 3...) with zero filler content.
- **Interactive Multi-Format Workspace:** Real code editing (Monaco Editor) with automated test runners, concept quizzes, fill-in-the-blank syntax challenges, and workplace vocabulary notes.
- **Gamified Duolingo 3D Tactile Physics:** Chunky physical 3D buttons, pulsating milestone nodes, streak tracking, golden chests, and companion mascot (**Kodi**).
- **Multi-Country & Multi-Stack Career Intelligence:** Realistic engineering track alignment (Backend, Frontend, DevOps, Fullstack, Product Engineer, Solutions Architect) and stacks (Golang, React, AWS, Foundation).

---

## 🎯 2. Target Personas & Success Metrics

### 2.1 Personas
1. **Primary: Farhan, 23 (Indonesian Backend Dev / Fresh Grad)**
   - Wants to work in Tokyo or Singapore. Knows basic Go/REST APIs, but lacks production confidence, Docker skills, and Japanese tech vocabulary.
   - Motivated by streaks, level-ups, and concrete proof-of-work.
2. **Secondary: Sarah, 27 (Career Switcher / Mid-Level Frontend Dev)**
   - Transitioning to international tech hubs. Needs structured guidance on system design and global CV standards.

### 2.2 Core Product Metrics
| Metric | Target | Measurement |
| :--- | :--- | :--- |
| **Daily Habit Retention (7-Day Streak)** | > 45% of registered users | Redis streak sessions & daily presence logs |
| **Unit Lesson Completion Rate** | > 60% per unit | Node progress completions in `user_quests` |
| **Interactive Workspace Submission** | > 75% first-pass pass rate | Go unit test runner completions |
| **Boarding Pass Onboarding Conversion**| > 85% completion | User onboarding wizard completions |

---

## 🎮 3. Core Features & System Breakdown

### 3.1 Authentication & The 3-Pillar Architecture (v2.2)
- **Stateless Access Token (JWT):** 15-minute lifespan for high security.
- **Stateful Rotated Refresh Token (Redis):** 30-day session (Remember Me) or 24-hour temporary session. Instant token revocation on logout.
- **Auto-Login on Registration:** Seamless UX transitioning directly from sign-up into the onboarding flight wizard.
- **The 3-Pillar Normalized Architecture (v2.2):**
  1. **Pillar 1 (`users`):** Auth Core murni (ID, Email, Password Hash). Zero Data Leakage pada query profil publik.
  2. **Pillar 2 (`user_profiles`):** Data diri publik, bio, target negara (`country_id`), track karir (`career_path_id`), dan tech stack pilihan (`tech_stack_id`).
  3. **Pillar 3 (`user_gamification`):** Engine gamifikasi terisolasi (XP, Level, Streak, Gems, Last Active At) untuk high-concurrency write loop.

### 3.2 Global Developer Onboarding Wizard
- **Step 1 — Target Destination:** Tokyo 🇯🇵 (Active), Berlin 🇩🇪 & Singapore 🇸🇬.
- **Step 2 — Career Track:** Backend, Frontend, DevOps, Fullstack, Product Engineer, Solutions Architect.
- **Step 3 — Primary Tech Stack:** Specific technology (e.g. Go Gin, React & Next.js, AWS & Kubernetes) plus universal foundation access (HTML/CSS/JS, CS Fundamentals).
- **Step 4 — 3D Boarding Pass Ticket:** Tactile boarding pass (`CGK ✈️ NRT` / `CGK ✈️ BER`) granting +50 XP welcome milestone bonus.

### 3.3 Curriculum Path System (The Learning Path)
Organized via clean normalized hierarchy: **`tech_stacks` ➔ `modules` ➔ `chapters` ➔ `quests`**:
- **Sequential Unit Breakdown:**
  - **Module 1: Go Syntax & Concurrency Core**
    - Chapter 1: Go Basics & Goroutines Initiation
- **Multi-Format Quest Nodes:**
  1. **Concept Quiz:** Multiple-choice conceptual checks (`quiz_data`).
  2. **Fill-in-the-Blank:** Code syntax completion (`fill_blank`).
  3. **Coding Challenge:** In-browser Monaco editor challenges with live unit test suites (`test_suite`).
  4. **Daily Habit Quest:** Fast daily code reviews keeping habit streaks alive (`daily`).
  5. **Boss Milestone Quest:** Comprehensive architectural milestone challenges (`boss`).
- **Three Strict Node Interaction States:**
  1. ✅ **Completed (`sudah selesai dikerjakan`):** Emerald green 3D button with checkmark badge `✓`. Replayable anytime.
  2. ⚡ **Available / Active (`sudah bisa dikerjakan`):** Electric Blue 3D button with pulsating outer ring, floating popover CTA (*"Part X: [Judul] • LANJUTKAN (+50 XP)"*), and cheering Kodi mascot.
  3. 🔒 **Locked (`belum bisa dikerjakan`):** Tactile slate-gray button showing embossed part number with padlock badge `🔒`.
- **Vertical Bezier Flow:** Smooth SVG S-curves with ample breathing room (~180px vertical distance per node) preventing UI overlap.

### 3.4 Interactive Coding Workspace (`LearnWorkspacePage.tsx`)
- **Split-Pane Architecture:** Split layout with curriculum brief on the left and interactive Monaco code editor on the right.
- **Story Context & Workplace Nihongo Notes:** Integrated Japanese workplace idioms (e.g., *Hensuu*, *Kansuu*, *Maji-koodo*) with readings and translations.
- **Live Test Runner:** Simulates industrial Go unit test execution with passed/failed test assertion feedback.
- **Milestone Celebration:** Modal celebration upon passing tests with XP and Gems rewards.

### 3.5 Multi-Country Workplace Vocabulary & Gamification
- **Modular Vocabulary Bank (JLPT N5–N1 & CEFR A1–C2):**
  - Categorized workplace terms: Greetings, Courtesy & Etiquette, Daily Office, Standup/Agile, Architecture, & Enterprise Governance.
  - Native pronunciation audio files structured by level (`/audio/vocab/jp/n5/...`) with automatic Web Speech API browser fallback.
- **Daily 7-Day Streak Tracker 🔥:** Synced via Redis and PostgreSQL activity logs.
- **Golden Chest & Daily 50 XP Goal 🎁:** Interactive 3D reward chest tracking daily habit milestones.
- **Akihabara Arcade Inventory & Shop:** Virtual shop to redeem earned gems for streak freezes and XP boosters.
- **Leaderboard:** Weekly developer rankings driving peer motivation.

---

## 🛠️ 4. Technical Architecture Stack

| Layer | Technology | Architecture Pattern |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript 5, Vite, Tailwind CSS v4, Lucide & Phosphor Icons | **Headless Hook Pattern** (Zero logic in JSX; state managed via custom hooks) + Zustand + TanStack Query |
| **Backend** | Golang 1.23+, Gin Web Framework | **Strict Clean Architecture** (`delivery/http` ➔ `usecase` ➔ `repository` ➔ `domain`) |
| **Database** | PostgreSQL 16 (`pgcrypto`), Redis 7 | Normalized relational tables (1-to-1 `users` ➔ `user_gamification`) |
| **Event Streaming** | Apache Kafka | Async background events (daily quest resets, activity auditing) |
| **Design System** | Vanilla CSS + Tailwind v4 (`TOKENS`) | **90% Duolingo 3D Tactile Taste (Clean Light Mode) + 10% CodeAbroad Electric Blue** |
