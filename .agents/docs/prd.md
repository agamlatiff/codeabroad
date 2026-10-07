# Product Requirements Document (PRD)
# CodeAbroad

**Version:** 1.1  
**Status:** In Development (v0.2.0 released)  
**Last Updated:** 2026-10-08

---

## 1. Overview

### 1.1 Product Summary
CodeAbroad is a gamified IT learning platform designed specifically for Indonesian developers who aspire to work abroad. It combines structured programming roadmaps with country-specific career guidance, wrapped in a game-like quest system to keep users engaged and on track.

### 1.2 Problem Statement
Indonesian IT professionals who want to work abroad face several challenges:
- No single platform addresses both technical skills AND country-specific requirements
- Existing platforms (Udemy, Coursera) are generic and not tailored for the "work abroad" goal
- No structured, step-by-step roadmap from beginner to "job-ready abroad"
- Country-specific knowledge (visa, culture, language, salary) is scattered across the internet
- Lack of motivation and accountability without a structured system

### 1.3 Solution
A single platform that acts as a **personal career GPS** — telling users exactly what to learn, in what order, for their specific target country and career path, gamified to keep them motivated.

---

## 2. Goals & Success Metrics

### 2.1 Business Goals
- Build a well-known open-source project in the Indonesian dev community
- Serve as a strong portfolio piece demonstrating full-stack + system design skills
- Help Indonesian developers successfully land IT jobs abroad

### 2.2 Success Metrics (MVP)
| Metric | Target |
|--------|--------|
| GitHub Stars | 100+ within 3 months of launch |
| Registered users | 500+ within 3 months |
| Daily Active Users (DAU) | 50+ |
| Quest completion rate | > 40% |
| Average session duration | > 10 minutes |

---

## 3. Target Users

### Primary User
**Persona: Rizki, 22, Fresh Graduate**
- Just graduated from an IT/computer science university in Indonesia
- Wants to work as a backend developer in Singapore or Japan
- Knows basic programming but lacks direction on what to learn next
- Motivated but easily loses focus without structure

### Secondary User
**Persona: Dinda, 27, Career Switcher**
- Currently working in a non-IT field
- Self-learning programming for 6 months
- Wants a clear roadmap to transition into tech and eventually work abroad

---

## 4. Features

### 4.1 MVP Features (v1.0)

#### Authentication
- User registration with email & password
- User login with JWT (access + refresh token)
- Refresh token rotation stored in Redis
- "Remember me" support
- Secure server-side logout (session invalidation)

#### Onboarding
- Step 1 — Target country: Japan 🇯🇵 (active), Germany 🇩🇪 / Singapore 🇸🇬 (coming soon)
- Step 2 — Career mindset (Specialist / Generalist) → track → primary tech stack
  - Specialist: Frontend / Backend / DevOps
  - Generalist: Fullstack (FE + BE combo), Product Engineer & Solutions Architect (coming soon)
- Step 3 — Readiness: level (Beginner / Intermediate), target timeline
  (6 months / 1 year / exploring), language level (none / basic / conversational / fluent)
- Step 4 — Developer Boarding Pass (CGK ✈️ NRT) with +50 XP welcome bonus

#### Quest System
- **Main Quest** — Sequential, locked until previous is completed
- **Side Quest** — Optional, unlocked based on progress
- **Daily Quest** — 3 quests per day, resets every midnight (via Kafka)
- Each quest contains: title, description, resource links, XP reward, estimated time

#### Progression System
- XP gained per quest completion
- Level system (Level 1–50) with increasing XP thresholds
- Streak tracking (consecutive days active)
- Readiness Score per country (0–100%)

#### Achievements
- Milestone-based badges (e.g., "First Quest", "7-Day Streak", "Level 10")
- Achievement notifications

#### Dashboard
- Active quests overview
- XP & level progress bar
- Streak counter
- Readiness score per country
- Recent achievements

#### Learning Content
- Hard skill roadmaps (Frontend, Backend, DevOps, Fullstack)
- Soft skill modules (interviews, communication, teamwork)
- Mindset modules (growth mindset, imposter syndrome)
- Country guides: visa process, CV format, work culture, salary range

### 4.2 Future Features (v2.0+)
- Google / GitHub OAuth login
- Community forum & peer support
- Mentor matching system
- Job board (IT jobs abroad)
- Mock interview simulator
- AI-powered personalized recommendations
- Mobile app (React Native)
- Leaderboard

### 4.3 Release Roadmap

| Version | Feature | Status |
|---------|---------|--------|
| v0.1.0 | Auth & Session Management | ✅ Released |
| v0.2.0 | Onboarding & Boarding Pass | ✅ Released |
| v0.3.0 | Quest System & Roadmap Engine | 🚧 Next |
| v0.4.0 | Progression (XP, Level, Streak) & Achievements | Planned |
| v0.5.0 | Learning Content & Country Guides | Planned |

---

## 5. User Flows

### 5.1 New User Flow
```
Landing Page → Register → Onboarding (Country → Mindset/Track/Stack
→ Level/Timeline/Language) → Boarding Pass (+50 XP)
→ Dashboard → Start First Main Quest → Complete Quest → Gain XP
→ Level Up → Unlock Next Quest
```

### 5.2 Returning User Flow
```
Login → Dashboard → Check Daily Quests → Complete Quests
→ Check Progress → Explore Side Quests
```

### 5.3 Quest Completion Flow
```
User clicks "Mark as Complete" → Backend validates
→ Emit quest.completed event (Kafka)
→ XP Service: add XP, check level up
→ Achievement Service: check unlocked achievements
→ Streak Service: update streak
→ Response returned to user with updated stats
```

---

## 6. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| API response time | < 300ms (p95) |
| Uptime | > 99% |
| Mobile responsive | Yes (all screen sizes) |
| Browser support | Chrome, Firefox, Safari (latest 2 versions) |
| Security | OWASP Top 10 compliance |
| Touch targets | Min 44px on mobile |
| Design system | Duolingo-inspired tactile UI, shared tokens (`frontend/src/tokens`) |

---

## 7. Out of Scope (MVP)

- Payment / monetization features
- Video content production
- Native mobile apps
- Real-time features (WebSocket)
- AI/ML recommendations
- Multi-language UI (Indonesian UI copy only for MVP)
