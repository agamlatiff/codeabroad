# Feature: User Onboarding & Career Passport (02-onboarding-system)

> **Branch:** `feature/onboarding-system`  
> **Status:** Planning & Ready for Implementation  
> **Scope:** Full-stack vertical slice (Database Migration & Seeds ➔ Backend Clean Architecture ➔ Frontend Responsive UI/UX ➔ Automated Tests)

---

## 📌 1. Feature Overview & Strategic Focus

The **User Onboarding & Career Passport** feature bridges newly registered users into active, motivated platform members. While registration captures basic credentials, it leaves the user profile in an uninitialized state (`is_onboarded = false`, null target country, null career path, null primary tech stack).

To maximize market impact and maintain laser focus for MVP, CodeAbroad focuses initially on the **Tokyo, Japan 🇯🇵 Tech Market**, where demand for international software engineers is at an all-time high (Mercari, PayPay, MoneyForward, Rakuten). Other international hubs (Germany 🇩🇪 and Singapore 🇸🇬) and alternative tech stacks (Java, Node.js, Vue, Svelte) are elegantly presented as **"Coming Soon ⏳"** to demonstrate platform vision while directing all users toward proven, unlocked visa-sponsorship roadmaps.

### Key Objectives:
1. **Target Destination Strategy:**
   - 🇯🇵 **Japan (Tokyo Tech Track):** ✅ **ACTIVE / UNLOCKED** with comprehensive visa roadmap (COE, Highly Skilled Professional points), Tokyo salary benchmarks (¥4.5M - ¥14M/year), and startup culture notes.
   - 🇩🇪 **Germany** & 🇸🇬 **Singapore:** ⏳ **COMING SOON** (Displayed as non-selectable preview cards with notification badges).
2. **Career Track & Primary Tech Stack Strategy:**
   - 💻 **Backend Engineer:**
     - 🐹 **Golang (Go):** ✅ **UNLOCKED** (The #1 darling of Tokyo microservices: Mercari, PayPay).
     - ☕ **Java (Spring Boot):** ⏳ **COMING SOON** (Rakuten & Enterprise track).
     - 🟩 **Node.js (Express / NestJS):** ⏳ **COMING SOON**.
   - 🎨 **Frontend Engineer:**
     - ⚛️ **React + TypeScript (Next.js):** ✅ **UNLOCKED** (Standard for 85%+ Tokyo startups).
     - 🟢 **Vue.js:** ⏳ **COMING SOON**.
     - 🧡 **Svelte:** ⏳ **COMING SOON**.
   - ⚡ **Fullstack Engineer:**
     - ⚛️🐹 **React + Golang:** ✅ **UNLOCKED** (High-performance modern stack).
     - ⚛️🟩 **React + Node.js:** ⏳ **COMING SOON**.
   - ☁️ **Cloud & DevOps Engineer:**
     - 🐳 **Docker + Kubernetes + AWS:** ✅ **UNLOCKED** (Top-tier compensation, minimal Japanese language requirement).
3. **Skill Level Calibration:** Establish starting baseline (`beginner` vs `intermediate`) to calibrate future quest difficulty and XP requirements.
4. **Route Protection & Gatekeeping:** Prevent un-onboarded users from accessing the dashboard until their career passport is stamped.
5. **Gamified Visual Delight:** Provide an inspiring "Boarding Pass" experience featuring the Kodi bear mascot, salary benchmarks, and visa requirements.

---

## 🏗️ 2. Architecture & Data Flow

```text
[ Browser / React Client ]
      │  
      ├── 1. GET /api/v1/countries & GET /api/v1/career-paths (Load Options & Unlocked Stacks)
      ├── 2. User completes:
      │       Step 1: Country (Japan 🇯🇵 active, DE/SG coming soon)
      │       Step 2: Role & Primary Stack (e.g. Backend ➔ Go active, Java/Node coming soon)
      │       Step 3: Level Calibration (Beginner vs Intermediate)
      │       Step 4: Stamped "Global Dev Passport" Review
      │
      ├── 3. POST /api/v1/onboarding (Submit choices)
      ▼
  [ Nginx Reverse Proxy ]
      │
      ▼
[ Gin Router ]
      │
      └── Protected Route: POST /api/v1/onboarding
              └── AuthMiddleware (Validate Bearer JWT)
                      └── OnboardingHandler 
                              └── OnboardingUsecase
                                      ├── Validates country_id is active (Japan)
                                      ├── Validates primary_stack is active for selected track
                                      ├── UserRepository.UpdateOnboarding(...)
                                      ├── Awards +50 XP Welcome Bonus
                                      └── Returns updated User entity with populated relations
```

### Route Protection Matrix:

| User Authentication State | `is_onboarded` Flag | Target URL | Navigation Action |
|---------------------------|---------------------|------------|-------------------|
| Unauthenticated           | N/A                 | Any        | Redirect to `/login` |
| Authenticated             | `false`             | `/dashboard` | Redirect to `/onboarding` |
| Authenticated             | `false`             | `/onboarding` | Render Onboarding Wizard |
| Authenticated             | `true`              | `/onboarding` | Redirect to `/dashboard` |
| Authenticated             | `true`              | `/dashboard` | Render Personalized Dashboard |

---

## 📋 3. OpenAPI / API Contract Specification

**Base URL:** `http://localhost:8080/api/v1`

### 3.1 Get All Available Countries
- **Method / Path:** `GET /api/v1/countries`
- **Access:** Public or Authenticated
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "countries retrieved successfully",
    "data": [
      {
        "id": "c1a2b3c4-...",
        "code": "JP",
        "name": "Japan",
        "flag_emoji": "🇯🇵",
        "is_active": true,
        "badge": "Active Track",
        "visa_info": {
          "type": "Engineer / Specialist in Humanities",
          "difficulty": "Moderate",
          "language_req": "JLPT N3 - N2 recommended (English-first startups exist in Tokyo)",
          "key_benefit": "Fast-track permanent residency via Highly Skilled Professional (HSP) point system",
          "processing_time": "1 - 3 months after COE issuance"
        },
        "salary_range": {
          "currency": "JPY",
          "junior": "¥4,000,000 - ¥6,000,000",
          "mid": "¥6,000,000 - ¥9,000,000",
          "senior": "¥9,000,000 - ¥14,000,000",
          "idr_approx": "Rp 420jt - Rp 1.5M / tahun"
        },
        "work_culture": "High craftsmanship and engineering discipline. Modern international startups in Tokyo (Shibuya/Roppongi) embrace English and hybrid working."
      },
      {
        "id": "d2e3f4a5-...",
        "code": "DE",
        "name": "Germany",
        "flag_emoji": "🇩🇪",
        "is_active": false,
        "badge": "Coming Soon",
        "visa_info": {
          "type": "EU Blue Card / IT Specialist Visa",
          "difficulty": "Accessible",
          "language_req": "English-first in tech (B1 German for PR)",
          "key_benefit": "30 days paid vacation, PR in 21-27 months"
        },
        "salary_range": {
          "currency": "EUR",
          "junior": "€48,000 - €60,000",
          "mid": "€60,000 - €80,000",
          "senior": "€80,000 - €110,000",
          "idr_approx": "Rp 850jt - Rp 1.9M / tahun"
        },
        "work_culture": "Feierabend (strict work-life balance), direct asynchronous communication, Berlin international tech hub."
      },
      {
        "id": "e3f4a5b6-...",
        "code": "SG",
        "name": "Singapore",
        "flag_emoji": "🇸🇬",
        "is_active": false,
        "badge": "Coming Soon",
        "visa_info": {
          "type": "Employment Pass (COMPASS Point System)",
          "difficulty": "Competitive",
          "language_req": "Fluent Professional English",
          "key_benefit": "Lowest personal income tax (0-22%), 1h 45m flight to Jakarta"
        },
        "salary_range": {
          "currency": "SGD",
          "junior": "S$60,000 - S$85,000",
          "mid": "S$85,000 - S$130,000",
          "senior": "S$130,000 - S$180,000",
          "idr_approx": "Rp 700jt - Rp 2.1M / tahun"
        },
        "work_culture": "Fast-paced APAC regional headquarters, high compensation, intense meritocracy."
      }
    ]
  }
  ```

---

### 3.2 Get All Career Paths & Stacks
- **Method / Path:** `GET /api/v1/career-paths`
- **Access:** Public or Authenticated
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "career paths retrieved successfully",
    "data": [
      {
        "id": "p1a2b3c4-...",
        "slug": "backend",
        "label": "Backend Engineer",
        "description": "Master microservices, high-concurrency systems, and cloud architectures for high-scale global applications.",
        "stacks": [
          { "slug": "golang", "label": "Go (Golang)", "is_active": true, "badge": "🔥 High Demand Tokyo" },
          { "slug": "java", "label": "Java (Spring Boot)", "is_active": false, "badge": "⏳ Coming Soon (Rakuten)" },
          { "slug": "node", "label": "Node.js (Express/Nest)", "is_active": false, "badge": "⏳ Coming Soon" }
        ]
      },
      {
        "id": "p2b3c4d5-...",
        "slug": "frontend",
        "label": "Frontend Engineer",
        "description": "Craft high-performance, responsive web interfaces with modern UI engineering standards.",
        "stacks": [
          { "slug": "react", "label": "React + TypeScript", "is_active": true, "badge": "🏆 Tokyo Standard" },
          { "slug": "vue", "label": "Vue.js", "is_active": false, "badge": "⏳ Coming Soon" },
          { "slug": "svelte", "label": "Svelte", "is_active": false, "badge": "⏳ Coming Soon" }
        ]
      },
      {
        "id": "p3c4d5e6-...",
        "slug": "fullstack",
        "label": "Fullstack Engineer",
        "description": "Bridge end-to-end product delivery combining reactive frontends with robust backend architectures.",
        "stacks": [
          { "slug": "react_golang", "label": "React + Golang", "is_active": true, "badge": "⭐ High Performance" },
          { "slug": "react_node", "label": "React + Node.js", "is_active": false, "badge": "⏳ Coming Soon" }
        ]
      },
      {
        "id": "p4d5e6f7-...",
        "slug": "devops",
        "label": "Cloud & DevOps Engineer",
        "description": "Automate and scale cloud-native infrastructure with Docker, Kubernetes, Terraform, and cloud platforms.",
        "stacks": [
          { "slug": "devops_cloud", "label": "Docker, Kubernetes & AWS", "is_active": true, "badge": "💎 Highest Salary" }
        ]
      }
    ]
  }
  ```

---

### 3.3 Submit Onboarding (Complete Setup)
- **Method / Path:** `POST /api/v1/onboarding`
- **Access:** Protected (Requires `Authorization: Bearer <access_token>`)
- **Request Body:**
  ```json
  {
    "country_id": "c1a2b3c4-...",
    "career_path_id": "p1a2b3c4-...",
    "primary_stack": "golang",
    "level": "beginner"
  }
  ```
- **Validation Rules:**
  - `country_id`: Must be a valid UUID for an active country (`is_active = true`).
  - `career_path_id`: Must be a valid UUID existing in `career_paths` table.
  - `primary_stack`: Must match an active stack for the selected career path.
  - `level`: Must be one of `beginner` or `intermediate`.
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "onboarding completed successfully",
    "data": {
      "id": "usr_c48b2d1...",
      "name": "Budi Pratama",
      "username": "budipratama",
      "email": "budi@example.com",
      "level": "beginner",
      "xp": 50,
      "current_level": 1,
      "streak": 1,
      "is_onboarded": true,
      "primary_stack": "golang",
      "country": {
        "id": "c1a2b3c4-...",
        "code": "JP",
        "name": "Japan",
        "flag_emoji": "🇯🇵"
      },
      "career_path": {
        "id": "p1a2b3c4-...",
        "slug": "backend",
        "label": "Backend Engineer"
      },
      "created_at": "2026-10-01T12:00:00Z"
    }
  }
  ```

---

## 🗄️ 4. Database Schema & Migration Changes

### Migration `000002_seed_and_enhance_onboarding.up.sql`:
1. **Schema Enhancements:**
   - Add `is_active BOOLEAN NOT NULL DEFAULT TRUE` and `badge VARCHAR(50)` to `countries` table.
   - Add `stacks JSONB` to `career_paths` table.
   - Add `primary_stack VARCHAR(50)` to `users` table.
2. **Seed Data:**
   - Insert Japan (`JP`, `is_active: true`), Germany (`DE`, `is_active: false`), Singapore (`SG`, `is_active: false`).
   - Insert Career Paths with their respective stacks and `is_active` flags.

---

## 📱 5. Frontend UX & Boarding Pass Design

The Onboarding experience will be built under **`frontend/src/pages/OnboardingPage.tsx`** featuring a 4-step interactive flow:

```
[ Step 1: Destination ] ➔ [ Step 2: Track & Stack ] ➔ [ Step 3: Level ] ➔ [ Step 4: Stamped Boarding Pass ]
```

### Key UI Components:
1. **Destination Card:**
   - Japan card is interactive, highlighted with a subtle gold accent and Tokyo skyline doodle.
   - Germany & Singapore cards render with a disabled state and sleek "Coming Soon ⏳" pill badge.
2. **Career Track & Stack Selector:**
   - Role cards (Backend, Frontend, Fullstack, DevOps).
   - Selecting a role displays the primary tech stack selector:
     - Unlocked stack is preselected and highlighted with a green checkmark.
     - Coming soon stacks have lock icons and "Coming Soon" badges.
3. **Level Calibration:**
   - `beginner` (< 1-2 years coding experience).
   - `intermediate` (2+ years coding experience, seeking overseas leap).
4. **The Global Developer Passport / Boarding Pass:**
   - Visual boarding ticket layout with flight/destination styling (`JKT ➔ HND` Tokyo Haneda).
   - Stamped with the Japanese Hanko `合格` mark.
   - User Avatar + Kodi Mascot in celebration pose (`celebrate`).
   - Primary Action: *"Buka Dashboard Karier"* (routes to `/dashboard`).

---

## ✅ 6. End-to-End Implementation Tracker

### Phase A: Database Seeds & Backend (Golang Clean Architecture)
- [ ] **Migration 000002:** Create `000002_seed_and_enhance_onboarding.up.sql` and `.down.sql`.
- [ ] **Domain Entities & Interfaces:**
  - Define `Country`, `CareerPath`, `TechStack` in `internal/domain/`.
  - Add `OnboardingRequest` DTO and repository interfaces (`CountryRepository`, `CareerPathRepository`).
- [ ] **Repository Layer:**
  - Implement `country_repository.go` (`GetAll`, `GetByID`, `GetByCode`).
  - Implement `career_path_repository.go` (`GetAll`, `GetByID`, `GetBySlug`).
  - Extend `user_repository.go` to support onboarding updates and eager-loading country & career path.
- [ ] **Usecase Layer:**
  - Implement `onboarding_usecase.go` (`CompleteOnboarding`, `GetMasterData`).
  - Award initial 50 XP bonus on onboarding completion.
- [ ] **HTTP Delivery Layer:**
  - Create `onboarding_handler.go` with `/countries`, `/career-paths`, and `/onboarding` endpoints.
  - Register endpoints in Gin router.
- [ ] **Automated Tests:**
  - Author unit tests covering valid onboarding, inactive country validation, invalid stack validation, and duplicate submission.

---

### Phase B: Frontend (React + TypeScript + Zustand)
- [ ] **Zustand Store Updates:** Update `authStore.ts` to store populated `country`, `career_path`, and `primary_stack`.
- [ ] **Route Guard Updates:** Update `ProtectedRoute.tsx` to enforce onboarding redirection.
- [ ] **Onboarding Page (`OnboardingPage.tsx`):**
  - Implement multi-step state with progress indicator bar.
  - Step 1: Destination Selector (Japan active, DE/SG coming soon).
  - Step 2: Track & Stack Selector (React/Go unlocked, others coming soon).
  - Step 3: Experience Calibration (Beginner vs Intermediate).
  - Step 4: Stamped Developer Boarding Pass with Hanko seal.
- [ ] **Dashboard Personalization:**
  - Dynamically display the user's chosen country flag, name, salary benchmarks, and tech track.

---

### Phase C: Integration, Container & Walkthrough
- [ ] **Docker Compose Verification:** Ensure seeds run and containers build cleanly.
- [ ] **End-to-End Walkthrough:** New user registration ➔ redirected to onboarding ➔ complete wizard ➔ personalized dashboard.

---

## 🔮 7. Future Scope & Backlog

- **Unlocking Germany & Singapore Tracks:** Provide dedicated EU Blue Card / COMPASS point roadmaps.
- **Unlocking Java, Node, Vue, Svelte Tracks:** Expand quest curriculum to multi-language options.
- **Language Level Assessment:** JLPT N5-N1 selector for Japan, Goethe A1-C1 selector for Germany.
