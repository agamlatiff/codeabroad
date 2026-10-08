# Feature: Quest System & Roadmap Engine (03-quest-roadmap-system)

> **Branch:** `feature/quest-roadmap-system`  
> **Status:** Planning & Ready for Implementation  
> **Scope:** Full-stack vertical slice (Database Migration & Seeds ➔ Backend Clean Architecture ➔ Frontend Responsive UI/UX ➔ Automated Tests)

---

## 📌 1. Feature Overview & Strategic Focus

The **Quest System & Roadmap Engine** is the core gameplay and pedagogical loop of CodeAbroad. While Features 1 & 2 established authentication and personalized onboarding (Target Country: Japan 🇯🇵, Career Track: Go Backend, Starting Level, and Boarding Pass), Feature 3 acts as the **Career GPS** that guides Indonesian developers step-by-step from foundational skills to landing tech jobs abroad.

Instead of passive video lectures or generic tutorials, CodeAbroad delivers learning through **gamified, action-oriented quests** styled with a **90% Duolingo Clean Light Mode + 10% CodeAbroad Electric Blue Identity**.

### Key Objectives:
1. **Hierarchical Curriculum Tree (Roadmap Engine):**
   - **Track** (e.g., *Backend Specialist (Go)*) ➔ **Stations** (milestone modules e.g., *Go Basics*, *Gin Web Framework*, *Cloud Microservices*) ➔ **Chapters** (thematic units) ➔ **Quests** (actionable lessons & coding challenges).
   - Station-based progression with sequential prerequisite unlocking.
2. **Three-Tier Quest Categorization:**
   - 🎯 **Main Quests:** Mandatory sequential nodes on the roadmap tree required to advance stations.
   - ⚡ **Daily Quests:** 3 rotating micro-challenges reset daily at midnight (via Kafka/Cron scheduler), awarding bonus XP and maintaining the active streak.
   - 🛡️ **Side / Boss Quests:** Practical capstone challenges (e.g., Clean Architecture JWT Auth, Docker containerization) that test real-world readiness for Tokyo startups.
3. **Interactive Learning & Quest Runner Workspace (`/learn/:id`):**
   - Split-screen workspace pairing real-world problem briefings and Tokyo workplace context (*JLPT N3 Nihongo tech tips*) with an interactive code editor and unit test runner.
   - Distinct **Success State** (green checklist, passing tests) and **Fail State** (soft red alert banner, Kodi hints, test error output).
4. **Duolingo-Inspired Celebration & Reward Loop (Flow 5.3):**
   - Verified test completion emits `quest.completed` event.
   - Tactile celebration hub awarding **+XP**, **+Gems**, **Streak increment**, and advancing the **Tokyo Career GPS Flight Route (`CGK ➔ NRT`)**.
5. **Strict Design System & Token Compliance:**
   - Enforce the 3-color palette: Primary Electric Blue (`#2563EB`), Secondary Tokyo Cyan (`#0284C7`), and Amber Gold (`#F59E0B`).
   - Tactile 3D button primitives (`border-b-4 active:border-b-0`).

---

## 🏗️ 2. Architecture & Data Flow

```text
[ Browser / React Client ]
      │
      ├── 1. GET /api/v1/roadmaps/:track_slug (Load stations, chapters, progress)
      ├── 2. GET /api/v1/quests?type=daily (Load active daily quest carousel)
      ├── 3. User selects quest ➔ GET /api/v1/quests/:id (Load workspace details)
      ├── 4. User runs code ➔ POST /api/v1/quests/:id/run-tests (Validate unit tests)
      │       ├── State A: FAIL ➔ Render Red Alert Bar & Kodi Hint
      │       └── State B: PASS ➔ Enable Primary 3D Submit Button
      │
      ├── 5. User clicks "SELESAIKAN MISI ✓" ➔ POST /api/v1/quests/:id/submit
      ▼
[ Nginx Reverse Proxy ]
      │
      ▼
[ Gin Router ]
      │
      └── Protected Routes (Bearer JWT AuthMiddleware):
              ├── QuestHandler
              │       └── QuestUsecase
              │               ├── 1. Validate quest exists & user prerequisites satisfied
              │               ├── 2. UserQuestRepository.MarkCompleted(userID, questID)
              │               ├── 3. XPService.AwardXP(userID, quest.XPReward)
              │               ├── 4. StreakService.RecordActivity(userID)
              │               ├── 5. RoadmapService.UnlockNextQuest(userID, questID)
              │               ├── 6. Emit `quest.completed` event (Kafka producer)
              │               └── 7. Return QuestCompletionResponse (+XP, +Streak, NextQuestID)
```

### Quest State Machine:

```text
[ LOCKED ] ────────► [ AVAILABLE ] ────────► [ IN_PROGRESS ] ────────► [ COMPLETED ]
     │                      │                       │                        │
Prerequisites        Prerequisites          User executes            All criteria passed
unfulfilled           all satisfied         code / test run          & XP/Streak claimed
```

---

## 📋 3. OpenAPI / API Contract Specification

**Base URL:** `http://localhost:8080/api/v1`

### 3.1 Get Roadmap Curriculum Tree
- **Method / Path:** `GET /api/v1/roadmaps/:track_slug`
- **Access:** Protected (`Authorization: Bearer <token>`)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "roadmap retrieved successfully",
    "data": {
      "id": "rdm_8f9a2b1c-...",
      "track_slug": "backend",
      "track_title": "Backend Specialist (Go)",
      "total_stations": 5,
      "completed_stations": 2,
      "stations": [
        {
          "id": "stn_01",
          "station_number": 1,
          "title": "Go Fundamentals & Syntax",
          "chip_label": "GO // 01",
          "status": "completed",
          "total_quests": 6,
          "completed_quests": 6
        },
        {
          "id": "stn_02",
          "station_number": 2,
          "title": "Concurrency & Goroutines",
          "chip_label": "GO // 02",
          "status": "completed",
          "total_quests": 5,
          "completed_quests": 5
        },
        {
          "id": "stn_03",
          "station_number": 3,
          "title": "Gin Web Framework & REST APIs",
          "chip_label": "GIN // 04",
          "status": "active",
          "total_quests": 6,
          "completed_quests": 1,
          "chapters": [
            {
              "id": "chp_301",
              "chapter_number": 1,
              "title": "Routing & Parameter Binding",
              "status": "completed",
              "quests_count": 2
            },
            {
              "id": "chp_302",
              "chapter_number": 2,
              "title": "REST Handler & Auth Middleware",
              "status": "active",
              "quests_count": 2,
              "active_quest_id": "qst_gin_jwt_02"
            },
            {
              "id": "chp_303",
              "chapter_number": 3,
              "title": "GORM & PostgreSQL Database Integration",
              "status": "locked",
              "quests_count": 2
            }
          ]
        },
        {
          "id": "stn_04",
          "station_number": 4,
          "title": "Clean Architecture & Microservices",
          "chip_label": "ARCH // 05",
          "status": "locked",
          "total_quests": 8,
          "completed_quests": 0
        },
        {
          "id": "stn_05",
          "station_number": 5,
          "title": "Docker, Kubernetes & AWS Deployment",
          "chip_label": "CLOUD // 06",
          "status": "locked",
          "total_quests": 7,
          "completed_quests": 0
        }
      ]
    }
  }
  ```

---

### 3.2 Get Quest Catalog & Daily Quests
- **Method / Path:** `GET /api/v1/quests`
- **Query Params:** `?type=daily|main|side` & `?status=available|completed|locked`
- **Access:** Protected (`Authorization: Bearer <token>`)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "quests retrieved successfully",
    "data": {
      "daily_quests": [
        {
          "id": "qst_daily_01",
          "title": "Kuasai Handler Middleware di Gin",
          "type": "daily",
          "chip": "GIN // D1",
          "xp_reward": 20,
          "estimated_minutes": 15,
          "status": "in_progress",
          "progress": "1/2",
          "is_claimable": false
        },
        {
          "id": "qst_daily_02",
          "title": "Hafalkan 3 Kosakata IT JLPT N3",
          "type": "daily",
          "chip": "JLPT // D2",
          "xp_reward": 15,
          "estimated_minutes": 10,
          "status": "completed",
          "progress": "3/3",
          "is_claimable": true
        },
        {
          "id": "qst_daily_03",
          "title": "Selesaikan 1 Kuis Struktur Data",
          "type": "daily",
          "chip": "QUIZ // D3",
          "xp_reward": 15,
          "estimated_minutes": 10,
          "status": "available",
          "progress": "0/1",
          "is_claimable": false
        }
      ],
      "main_quests": [
        {
          "id": "qst_gin_jwt_02",
          "station_id": "stn_03",
          "station_label": "Station 3 • Bab 2",
          "title": "Misi: Validasi Bearer Token JWT Middleware",
          "type": "main",
          "difficulty": "intermediate",
          "xp_reward": 50,
          "estimated_minutes": 25,
          "status": "available"
        }
      ]
    }
  }
  ```

---

### 3.3 Get Quest Details & Learning Workspace Data
- **Method / Path:** `GET /api/v1/quests/:id`
- **Access:** Protected (`Authorization: Bearer <token>`)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "quest details retrieved successfully",
    "data": {
      "id": "qst_gin_jwt_02",
      "title": "Misi: Validasi Bearer Token JWT Middleware",
      "station_number": 3,
      "chapter_number": 2,
      "station_title": "Gin Web Framework & REST APIs",
      "chip": "GIN // 04",
      "xp_reward": 50,
      "estimated_minutes": 25,
      "target_role": "Backend Specialist (Go Gin)",
      "target_location": "Startup FinTech Shibuya, Tokyo",
      "story_context": "Di sebagian besar microservices di Jepang, setiap request antar-service maupun client mobile wajib diverifikasi melalui HTTP Middleware sebelum mencapai endpoint controller utama.",
      "nihongo_notes": {
        "badge": "JLPT N3",
        "primary_vocab": "認可 (Nin-ka • Authorization)",
        "secondary_vocab": "認証 (Nin-shō • Authentication)",
        "context_usage": "Istilah kunci dalam code review & dokumentasi Jira tim tech Jepang."
      },
      "acceptance_criteria": [
        { "id": "ac_1", "text": "Ambil header 'Authorization' dari c.GetHeader()", "is_passed": true },
        { "id": "ac_2", "text": "Periksa apakah format diawali prefix 'Bearer '", "is_passed": true },
        { "id": "ac_3", "text": "Jika invalid, abort dengan c.AbortWithStatusJSON(401, ...)", "is_passed": false },
        { "id": "ac_4", "text": "Jika valid, simpan claims ke c.Set() dan panggil c.Next()", "is_passed": false }
      ],
      "files": [
        {
          "name": "handler.go",
          "is_editable": true,
          "content": "package middleware\n\nimport (\n    \"net/http\"\n    \"strings\"\n    \"github.com/gin-gonic/gin\"\n)\n\nfunc AuthMiddleware() gin.HandlerFunc {\n    return func(c *gin.Context) {\n        // implementation here\n    }\n}\n"
        },
        {
          "name": "handler_test.go",
          "is_editable": false,
          "content": "package middleware_test\n\nimport (\n    \"net/http\"\n    \"net/http/httptest\"\n    \"testing\"\n    \"github.com/gin-gonic/gin\"\n)\n// test suite\n"
        }
      ]
    }
  }
  ```

---

### 3.4 Execute Unit Tests in Workspace
- **Method / Path:** `POST /api/v1/quests/:id/run-tests`
- **Access:** Protected (`Authorization: Bearer <token>`)
- **Request Body:**
  ```json
  {
    "files": [
      {
        "name": "handler.go",
        "content": "package middleware\n..."
      }
    ]
  }
  ```
- **Response `200 OK` (Test Passed State):**
  ```json
  {
    "success": true,
    "passed": true,
    "summary": "2/2 tests passed",
    "logs": [
      "=== RUN   TestAuthMiddleware_ValidBearerToken",
      "--- PASS: TestAuthMiddleware_ValidBearerToken (0.002s)",
      "=== RUN   TestAuthMiddleware_MissingOrMalformedHeader",
      "--- PASS: TestAuthMiddleware_MissingOrMalformedHeader (0.001s)",
      "PASS"
    ],
    "criteria_results": [
      { "id": "ac_1", "passed": true },
      { "id": "ac_2", "passed": true },
      { "id": "ac_3", "passed": true },
      { "id": "ac_4", "passed": true }
    ]
  }
  ```
- **Response `200 OK` (Test Failed State):**
  ```json
  {
    "success": true,
    "passed": false,
    "summary": "1/2 tests failed",
    "logs": [
      "=== RUN   TestAuthMiddleware_ValidBearerToken",
      "--- PASS: TestAuthMiddleware_ValidBearerToken (0.002s)",
      "=== RUN   TestAuthMiddleware_MissingOrMalformedHeader",
      "    middleware_test.go:42: FAIL: expected HTTP 401 Unauthorized for malformed token, got HTTP 200 OK",
      "--- FAIL: TestAuthMiddleware_MissingOrMalformedHeader (0.001s)",
      "FAIL"
    ],
    "hint": "Fungsi test mengharapkan status HTTP 401 saat token tidak diawali dengan 'Bearer '. Pastikan kamu menggunakan strings.HasPrefix(authHeader, \"Bearer \")!",
    "criteria_results": [
      { "id": "ac_1", "passed": true },
      { "id": "ac_2", "passed": false },
      { "id": "ac_3", "passed": false },
      { "id": "ac_4", "passed": false }
    ]
  }
  ```

---

### 3.5 Submit Completed Quest & Claim Rewards
- **Method / Path:** `POST /api/v1/quests/:id/submit`
- **Access:** Protected (`Authorization: Bearer <token>`)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "quest completed successfully",
    "data": {
      "quest_id": "qst_gin_jwt_02",
      "xp_awarded": 50,
      "gems_awarded": 10,
      "current_xp": 1450,
      "current_level": 4,
      "streak": 5,
      "streak_extended": true,
      "readiness_increase": 2.0,
      "current_readiness_score": 70.0,
      "unlocked_vocab": {
        "term": "認可",
        "reading": "Nin-ka",
        "meaning": "Authorization"
      },
      "next_quest": {
        "id": "qst_gorm_db_03",
        "station_number": 3,
        "chapter_number": 3,
        "title": "Bab 3: GORM & Database Migration"
      }
    }
  }
  ```

---

## 📚 4. Multi-Track Curriculum & Task Seeds (Go, Docker/DevOps, React)

To power CodeAbroad's Tokyo Job-Readiness engine, Feature 3 includes complete multi-track curriculum seeds across the 3 primary career paths: **Backend (Go)**, **DevOps & Cloud (Docker/AWS)**, and **Frontend (React)**. Each track consists of **5 Stations**, progressive **Chapters**, interactive **Quests**, tailored **Starter Code**, and **Nihongo Tech Vocabulary**.

```
                           ┌─────────────────────────────────────────┐
                           │      CAREER TRACK ROADMAP SELECTOR      │
                           └────────────────────┬────────────────────┘
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼                                      ▼                                      ▼
┌──────────────────┐                  ┌──────────────────┐                  ┌──────────────────┐
│   BACKEND (GO)   │                  │  DEVOPS (DOCKER) │                  │ FRONTEND (REACT) │
├──────────────────┤                  ├──────────────────┤                  ├──────────────────┤
│ ST 1: Go Syntax  │                  │ ST 1: Linux CLI  │                  │ ST 1: Strict TS  │
│ ST 2: Gin REST   │                  │ ST 2: Docker     │                  │ ST 2: React Core │
│ ST 3: Clean Arch │                  │ ST 3: CI/CD      │                  │ ST 3: Next.js    │
│ ST 4: Redis/Perf │                  │ ST 4: Kubernetes │                  │ ST 4: Web Perf   │
│ ST 5: Production │                  │ ST 5: AWS Cloud  │                  │ ST 5: Testing    │
└──────────────────┘                  └──────────────────┘                  └──────────────────┘
```

---

### 🐹 4.1 Track: Go Backend Developer Catalog (`backend` / `golang`)
**Target Career:** Backend & Microservices Engineer (Tokyo Startups & Mega-ventures: Mercari, LINE Yahoo, Rakuten, SmartHR).

#### 🚉 Station 1: Go Foundations & Concurrency (`[ GO // 01 ]`)
1. **`qst_go_structs_01` — Structs, Pointers & Method Receivers**
   - **Station / Chapter:** ST 01 // Bab 1 (Go Foundations) | **XP:** 40 | **Gems:** 10
   - **Tokyo Briefing:** *“Payment gateway di Shibuya membutuhkan modul dompet digital (`Wallet`) dengan saldo rupiah/yen. Buat struct dan pointer method receiver untuk deposit dan penarikan yang aman.”*
   - **Acceptance Criteria:**
     1. Definisikan struct `Wallet` dengan field private `balance float64`.
     2. Implementasikan method `Deposit(amount float64) error` (return error jika `amount <= 0`).
     3. Implementasikan method `Withdraw(amount float64) error` (return error jika `amount > balance`).
     4. Gunakan pointer receiver `(w *Wallet)` agar mutasi saldo tersimpan.
   - **File:** `wallet.go` | **Runner:** `go test -v ./... -run TestWallet`
   - **Nihongo Tech:** 残高 (Zandaka - Balance) ・ 参照渡し (Sanshō-watashi - Pass by Reference)

2. **`qst_go_concurrency_02` — Concurrent Worker Pool with Channels**
   - **Station / Chapter:** ST 01 // Bab 2 (Concurrency) | **XP:** 50 | **Gems:** 15
   - **Tokyo Briefing:** *“Sistem logistik pengiriman paket di Tokyo memproses ribuan resi secara bersamaan. Buat worker pool menggunakan buffered channel dan `sync.WaitGroup` untuk membatasi 5 worker konkuren.”*
   - **Acceptance Criteria:**
     1. Fungsi `StartWorkerPool(numWorkers int, jobs <-chan Job, results chan<- Result)`.
     2. Menjalankan tepat `numWorkers` goroutine.
     3. Menggunakan `sync.WaitGroup` untuk memastikan seluruh worker selesai sebelum channel results ditutup.
   - **File:** `workerpool.go` | **Runner:** `go test -v ./... -run TestWorkerPool`
   - **Nihongo Tech:** 並行処理 (Heikō-shori - Concurrency) ・ 待機 (Taiki - Wait/Queue)

3. **`qst_go_errors_03` — Custom Domain Error Wrapping**
   - **Station / Chapter:** ST 01 // Bab 3 (Error Handling) | **XP:** 45 | **Gems:** 10
   - **Tokyo Briefing:** *“Sistem perbankan di Tokyo mewajibkan penelusuran akar masalah (root-cause). Bungkus low-level SQL error dengan `%w` dan sediakan sentinel error `ErrInsufficientFunds`.”*
   - **Acceptance Criteria:**
     1. Ekspor sentinel error `ErrInsufficientFunds = errors.New("insufficient funds")`.
     2. Fungsi `WrapDBError(err error) error` membungkus error dengan `fmt.Errorf("db operation failed: %w", err)`.
     3. Kompatibel dengan pemeriksaan `errors.Is` dan `errors.As`.
   - **File:** `errors.go` | **Runner:** `go test -v ./... -run TestErrors`
   - **Nihongo Tech:** 例外処理 (Reigai-shori - Exception Handling) ・ 根本原因 (Konpon Gen'in - Root Cause)

#### 🚉 Station 2: REST APIs with Gin Framework (`[ GIN // 02 ]`)
4. **`qst_gin_routing_01` — Route Groups & JSON Query Binding**
   - **Station / Chapter:** ST 02 // Bab 1 (Routing) | **XP:** 50 | **Gems:** 10
   - **Tokyo Briefing:** *“Job board Tokyo membutuhkan endpoint pencarian lowongan `/api/v1/jobs` dengan paginasi query parameter (`page`, `limit`) dan response standar envelope.”*
   - **Acceptance Criteria:**
     1. Buat route group `/api/v1` pada Gin engine.
     2. Bind struct `PaginationQuery` menggunakan tag `form:"page,default=1"` dan `form:"limit,default=20"`.
     3. Return JSON response berformat `{ "success": true, "data": [...], "meta": { "page": 1, "limit": 20 } }`.
   - **File:** `handler/job_handler.go` | **Runner:** `go test -v ./handler -run TestGetJobs`
   - **Nihongo Tech:** 経路設定 (Keiro Settei - Routing) ・ ページネーション (Pējinēshon - Pagination)

5. **`qst_gin_jwt_02` — JWT Authentication Middleware (Screen 10 / 10B)**
   - **Station / Chapter:** ST 02 // Bab 2 (Security) | **XP:** 50 | **Gems:** 10
   - **Tokyo Briefing:** *“Fintech di Roppongi mewajibkan otorisasi berbasis token untuk semua transaksi. Bangun middleware Gin untuk memverifikasi Bearer JWT token.”*
   - **Acceptance Criteria:**
     1. Return HTTP 401 jika header `Authorization` kosong atau tidak berawalan `Bearer `.
     2. Validasi token JWT dengan secret key dari environment variable `JWT_SECRET`.
     3. Ekstrak klaim user dan simpan ke Gin context `c.Set("user_id", claims.UserID)`.
     4. Panggil `c.Next()` jika valid; panggil `c.AbortWithStatusJSON(401, ...)` jika gagal.
   - **File:** `middleware/auth.go` | **Runner:** `go test -v ./middleware -run TestAuthMiddleware`
   - **Nihongo Tech:** 認可 (Nin-ka - Authorization) ・ 中間処理 (Chūkan-shori - Middleware)

6. **`qst_gorm_db_03` — GORM Relations & Database Transaction**
   - **Station / Chapter:** ST 02 // Bab 3 (Database ORM) | **XP:** 55 | **Gems:** 15
   - **Tokyo Briefing:** *“Ketika kandidat mendaftar lowongan kerja, kurangi sisa kuota lowongan dan buat record lamaran dalam satu transaksi database atomik.”*
   - **Acceptance Criteria:**
     1. Model `Job` (has-many `Applications`) dan `Application` (belongs-to `Job`).
     2. Fungsi `ApplyJobTx(db *gorm.DB, jobID, userID uuid.UUID) error` menggunakan `db.Transaction(...)`.
     3. Rollback otomatis jika kuota lowongan sudah 0 atau terjadi deadlock.
   - **File:** `repository/application_repo.go` | **Runner:** `go test -v ./repository -run TestApplyJobTx`
   - **Nihongo Tech:** トランザクション (Toranzakushon - Transaction) ・ 排他ロック (Haita Rokku - Exclusive Lock)

#### 🚉 Station 3: Clean Architecture & SOLID Design (`[ ARCH // 03 ]`)
7. **`qst_arch_entity_01` — Domain Entities & Repository Contracts**
   - **Station / Chapter:** ST 03 // Bab 1 (Domain Layer) | **XP:** 45 | **Gems:** 10
   - **Tokyo Briefing:** *“Bebaskan domain core dari ketergantungan framework (Gin/GORM). Definisikan struct Entity murni dan interface Repository.”*
   - **Acceptance Criteria:**
     1. Struct `JobApplicant` tanpa struct tag external ORM.
     2. Interface `JobApplicantRepository` dengan method `Create`, `FindByID`, dan `UpdateStatus`.
   - **File:** `domain/applicant.go` | **Runner:** `go test -v ./domain -run TestApplicantEntity`
   - **Nihongo Tech:** 責務分離 (Sekimu Bunri - Separation of Concerns) ・ 抽象化 (Chūshōka - Abstraction)

8. **`qst_arch_usecase_02` — Business Logic Usecase with Dependency Injection**
   - **Station / Chapter:** ST 03 // Bab 2 (Usecase Layer) | **XP:** 55 | **Gems:** 15
   - **Tokyo Briefing:** *“Implementasikan `ApplicantUsecase` yang mengorkestrasi validasi visa kerja, penyimpanan ke repository, dan pengiriman notifikasi email.”*
   - **Acceptance Criteria:**
     1. Constructor `NewApplicantUsecase(repo domain.JobApplicantRepository, mailer EmailService)`.
     2. Validasi kelayakan paspor sebelum menyimpan lamaran ke database.
     3. Emit status `ApplicationSubmitted` jika proses berhasil.
   - **File:** `usecase/applicant_usecase.go` | **Runner:** `go test -v ./usecase -run TestSubmitApplication`
   - **Nihongo Tech:** 依存性の注入 (Izon-sei no Chūnyū - Dependency Injection) ・ 業務ロジック (Gyōmu Rojikku - Business Logic)

9. **`qst_arch_mock_03` — Unit Testing with Testify Mocks**
   - **Station / Chapter:** ST 03 // Bab 3 (Unit Testing) | **XP:** 50 | **Gems:** 10
   - **Tokyo Briefing:** *“Uji usecase tanpa menyentuh database nyata menggunakan mock objects (`github.com/stretchr/testify/mock`).”*
   - **Acceptance Criteria:**
     1. Buat `MockApplicantRepository` yang mengimplementasikan domain interface.
     2. Uji skenario sukses dan skenario database down (assert error propagated).
     3. Panggil `mockRepo.AssertExpectations(t)` pada akhir pengujian.
   - **File:** `usecase/applicant_usecase_test.go` | **Runner:** `go test -v ./usecase -run TestMock`
   - **Nihongo Tech:** モックテスト (Mokku Tesuto - Mock Testing) ・ 単体テスト (Tantai Tesuto - Unit Test)

#### 🚉 Station 4: Caching & Performance (`[ PERF // 04 ]`)
10. **`qst_redis_cache_01` — Redis Cache-Aside Helper with Dynamic TTL**
    - **Station / Chapter:** ST 04 // Bab 1 (Redis Cache) | **XP:** 55 | **Gems:** 15
    - **Tokyo Briefing:** *“Sistem portal lowongan Shinjuku mengalami lonjakan traffic. Buat fungsi Cache-Aside: cek Redis terlebih dahulu; jika miss, panggil database dan cache selama 5 menit.”*
    - **Acceptance Criteria:**
      1. Fungsi `GetOrSetCache[T any](ctx context.Context, key string, ttl time.Duration, fetchFn func() (T, error)) (T, error)`.
      2. Serialize data ke format JSON saat menulis ke Redis.
      3. Set dynamic TTL dengan random jitter (±10 detik) untuk mencegah Cache Stampede.
    - **File:** `cache/redis_helper.go` | **Runner:** `go test -v ./cache -run TestCacheAside`
    - **Nihongo Tech:** キャッシュ (Kyasshu - Cache) ・ 雪崩現象 (Nadare Genshō - Stampede)

11. **`qst_redis_ratelimit_02` — Sliding Window Rate Limiter with Redis**
    - **Station / Chapter:** ST 04 // Bab 2 (Rate Limiting) | **XP:** 60 | **Gems:** 20
    - **Tokyo Briefing:** *“Cegah scraping liar data lowongan kerja. Buat Gin middleware rate limiter berbasis Redis Sorted Set (ZSET) dengan algoritma sliding window 60 detik.”*
    - **Acceptance Criteria:**
      1. Batasi maksimal 60 request per IP per 60 detik.
      2. Bersihkan timestamp lama dengan `ZREMRANGEBYSCORE`.
      3. Return HTTP 429 Too Many Requests jika kuota habis beserta header `Retry-After`.
    - **File:** `middleware/ratelimit.go` | **Runner:** `go test -v ./middleware -run TestRateLimiter`
    - **Nihongo Tech:** レート制限 (Rēto Seigen - Rate Limit) ・ 遮断 (Shadan - Throttle/Block)

12. **`qst_async_worker_03` — Background Job Queue with Error Retries**
    - **Station / Chapter:** ST 04 // Bab 3 (Message Queues) | **XP:** 55 | **Gems:** 15
    - **Tokyo Briefing:** *“Proses pembuatan sertifikat PDF onboarding memakan waktu 3 detik. Pindahkan proses ke background worker dengan Redis Streams dan 3x retry otomatis.”*
    - **Acceptance Criteria:**
      1. Enqueue payload PDF job ke Redis Stream `stream:certificates`.
      2. Worker membaca stream via consumer group dan menjalankan worker handler.
      3. Jika handler error, naikkan retry count; jika mencapai 3x, pindahkan ke Dead Letter Queue (DLQ).
    - **File:** `worker/certificate_worker.go` | **Runner:** `go test -v ./worker -run TestCertWorker`
    - **Nihongo Tech:** 非同期キュー (Hidōki Kyū - Asynchronous Queue) ・ 再試行 (Saishikō - Retry)

#### 🚉 Station 5: Tokyo Production Deploy (`[ PROD // 05 ]`)
13. **`qst_prod_logging_01` — Structured Zerolog JSON Logger with Request ID**
    - **Station / Chapter:** ST 05 // Bab 1 (Observability) | **XP:** 45 | **Gems:** 10
    - **Tokyo Briefing:** *“Standar observability di Tokyo mewajibkan format JSON terstruktur untuk diekspor ke Grafana/Loki. Konfigurasi Zerolog dengan `request_id`, level, timestamp, dan latency.”*
    - **Acceptance Criteria:**
      1. Gin middleware menginjeksi header `X-Request-ID` ke log context.
      2. Output log berformat JSON satu baris per event (tanpa ANSI color).
      3. Log level `ERROR` menyertakan stack trace pemanggilan.
    - **File:** `logger/logger.go` | **Runner:** `go test -v ./logger -run TestStructuredLogger`
    - **Nihongo Tech:** 構造化ログ (Kōzōka Rogu - Structured Logging) ・ 可観測性 (Kakansokusei - Observability)

14. **`qst_prod_docker_02` — Ultra-Slim Go Dockerfile with Scratch Base**
    - **Station / Chapter:** ST 05 // Bab 2 (Containerization) | **XP:** 50 | **Gems:** 10
    - **Tokyo Briefing:** *“Optimalkan binary Go backend agar berjalan di base image `scratch` tanpa shell dengan ukuran di bawah 20MB dan sertifikat TLS root.”*
    - **Acceptance Criteria:**
      1. Multi-stage build (`FROM golang:1.23-alpine AS builder` ➔ `FROM scratch`).
      2. Compile flag `CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s"`.
      3. Salin `/etc/ssl/certs/ca-certificates.crt` untuk koneksi HTTPS keluar.
      4. Total image size < 20MB.
    - **File:** `Dockerfile` | **Runner:** `hadolint Dockerfile && docker build -t backend:prod .`
    - **Nihongo Tech:** 軽量化 (Keiryōka - Slimming/Minification) ・ 静的リンク (Seiteki Rinku - Static Linking)

15. **`qst_prod_shutdown_03` — Graceful OS Signal Handling (`SIGTERM`)**
    - **Station / Chapter:** ST 05 // Bab 3 (Production Reliability) | **XP:** 60 | **Gems:** 20
    - **Tokyo Briefing:** *“Saat Kubernetes melakukan rolling update, pod menerima signal SIGTERM. Tangani signal tersebut agar koneksi HTTP yang sedang aktif diselesaikan terlebih dahulu dalam batas 10 detik.”*
    - **Acceptance Criteria:**
      1. Dengarkan signal `os.Interrupt` dan `syscall.SIGTERM` menggunakan `signal.NotifyContext`.
      2. Panggil `server.Shutdown(ctx)` dengan timeout 10 detik.
      3. Tutup koneksi pool PostgreSQL dan Redis setelah HTTP server berhenti menerima koneksi baru.
    - **File:** `main.go` | **Runner:** `go test -v ./... -run TestGracefulShutdown`
    - **Nihongo Tech:** 正常終了 (Seijō Shūryō - Graceful Shutdown) ・ 排他 (Haita - Drain/Release)

---

### 🐳 4.2 Track: Cloud & DevOps Engineer Catalog (`devops` / `devops_aws`)
**Target Career:** Cloud & Infrastructure Engineer (Tokyo High Salary Standard: Mercari, CyberAgent, PayPay, AWS Japan).

#### 🚉 Station 1: Linux CLI & Shell Automation (`[ LINUX // 01 ]`)
1. **`qst_linux_bash_01` — Bash Log Analyzer for Nginx 5xx HTTP Anomalies**
   - **Station / Chapter:** ST 01 // Bab 1 (POSIX Streams & Piping) | **XP:** 40 | **Gems:** 10
   - **Tokyo Briefing:** *“Web server production mengalami spike error di jam sibuk. Tulis skrip Bash yang membaca 100.000 baris access log Nginx dan mencetak 5 IP pengirim error 5xx terbanyak.”*
   - **Acceptance Criteria:**
     1. Menerima path file log sebagai argumen `$1`.
     2. Memfilter baris dengan status code `500`, `502`, `503`, atau `504` menggunakan `awk` / `grep`.
     3. Menampilkan format: `<count> <ip_address>` diurutkan descending, maksimal 5 baris.
   - **File:** `scripts/analyze_logs.sh` | **Runner:** `bash scripts/test_analyze_logs.sh`
   - **Nihongo Tech:** 障害解析 (Shōgai Kaiseki - Failure Analysis) ・ 標準出力 (Hyōjun Shutsuryoku - stdout)

2. **`qst_linux_systemd_02` — Systemd Service Unit with Auto-Restart**
   - **Station / Chapter:** ST 01 // Bab 2 (Daemons & Processes) | **XP:** 45 | **Gems:** 10
   - **Tokyo Briefing:** *“Aplikasi daemon Go harus otomatis berjalan saat VM reboot dan langsung hidup kembali jika crash.”*
   - **Acceptance Criteria:**
     1. Buat unit file `codeabroad-api.service`.
     2. Konfigurasi `Restart=always` dan `RestartSec=5s`.
     3. Tentukan `User=appuser` dan `EnvironmentFile=/etc/codeabroad/app.env`.
     4. Set dependency `After=network.target postgresql.service`.
   - **File:** `systemd/codeabroad-api.service` | **Runner:** `systemd-analyze verify systemd/codeabroad-api.service`
   - **Nihongo Tech:** 常駐プロセス (Jōchū Purosesu - Daemon) ・ 自動再起動 (Jidō Sai-kidō - Auto Restart)

3. **`qst_linux_net_03` — Network Diagnostics Script with cURL & dig**
   - **Station / Chapter:** ST 01 // Bab 3 (Networking Fundamentals) | **XP:** 45 | **Gems:** 10
   - **Tokyo Briefing:** *“Bantu tim support Tokyo mendiagnosis keluhan latensi user. Tulis skrip diagnosa yang mengukur DNS lookup time, TCP connect time, dan TLS handshake time.”*
   - **Acceptance Criteria:**
     1. Skrip menerima argumen URL target (misal `https://api.codeabroad.jp`).
     2. Menggunakan `curl` dengan custom format template untuk mengekstrak timing metrics (`time_namelookup`, `time_connect`, `time_appconnect`).
     3. Cetak peringatan berwarna kuning jika TLS handshake > 200ms.
   - **File:** `scripts/net_diag.sh` | **Runner:** `bash scripts/test_net_diag.sh`
   - **Nihongo Tech:** 疎通確認 (Sotsū Kakunin - Connectivity Check) ・ 遅延 (Chien - Latency)

#### 🚉 Station 2: Docker Containerization Mastery (`[ DOCKER // 02 ]`)
4. **`qst_docker_cli_01` — Container Lifecycle, Healthcheck & Prune**
   - **Station / Chapter:** ST 02 // Bab 1 (Container CLI) | **XP:** 45 | **Gems:** 10
   - **Tokyo Briefing:** *“Server staging penuh karena container mati dan volume zombie. Buat skrip automasi yang membersihkan resources yang tidak terpakai secara aman.”*
   - **Acceptance Criteria:**
     1. Eksekusi `docker system prune` dengan filter usia > 24 jam (`until=24h`).
     2. Menjaga volume database yang memiliki label `preserve=true`.
     3. Cetak total disk space yang berhasil dibebaskan (dalam MB/GB).
   - **File:** `scripts/docker_clean.sh` | **Runner:** `bash scripts/test_docker_clean.sh`
   - **Nihongo Tech:** 容量解放 (Yōryō Kaihō - Disk Release) ・ 健全性確認 (Kenzen-sei Kakunin - Health Check)

5. **`qst_docker_multistage_02` — Production Multi-Stage Build (< 45MB)**
   - **Station / Chapter:** ST 02 // Bab 2 (Dockerfile Optimization) | **XP:** 55 | **Gems:** 15
   - **Tokyo Briefing:** *“Fintech di Roppongi menolak Docker image sebesar 1.2GB karena memperlambat auto-scaling. Ubah Dockerfile single-stage menjadi multi-stage build yang aman dan ramping.”*
   - **Acceptance Criteria:**
     1. Stage 1 (`AS builder`) menggunakan `golang:1.23-alpine`.
     2. Stage 2 (runtime) menggunakan minimal `alpine:3.20`.
     3. Aplikasi dijalankan dengan non-root user (`USER nonroot:nonroot`).
     4. Ukuran total image < 45MB dan lulus linting `hadolint`.
   - **File:** `Dockerfile` | **Runner:** `hadolint Dockerfile && docker build -t app:test .`
   - **Nihongo Tech:** コンテナ (Kontena - Container) ・ 最適化 (Saitekika - Optimization)

6. **`qst_docker_compose_03` — Multi-Service Compose (App + Postgres + Redis)**
   - **Station / Chapter:** ST 02 // Bab 3 (Multi-Container Compose) | **XP:** 55 | **Gems:** 15
   - **Tokyo Briefing:** *“Setup environment lokal untuk developer baru dalam 1 perintah `docker compose up`. Hubungkan App, Postgres, dan Redis dengan healthcheck dependencies.”*
   - **Acceptance Criteria:**
     1. Konfigurasi 3 services: `backend`, `db` (Postgres 16), `cache` (Redis 7).
     2. Service `backend` hanya boleh start jika `db` sudah sehat (`condition: service_healthy`).
     3. Gunakan named volume untuk persistensi data database.
     4. Isolasikan backend dan db dalam bridge network private.
   - **File:** `docker-compose.yml` | **Runner:** `docker compose config --quiet`
   - **Nihongo Tech:** 構成定義 (Kōsei Teigi - Configuration Definition) ・ 依存関係 (Izon-kankei - Dependency)

#### 🚉 Station 3: CI/CD Pipeline Automation (`[ CICD // 03 ]`)
7. **`qst_cicd_ghactions_01` — GitHub Actions Lint, Test & Security Scan**
   - **Station / Chapter:** ST 03 // Bab 1 (GitHub Actions) | **XP:** 50 | **Gems:** 10
   - **Tokyo Briefing:** *“Cegah commit bermasalah masuk ke branch main. Buat workflow GitHub Actions yang menjalankan linter, test coverage, dan scanning celah keamanan.”*
   - **Acceptance Criteria:**
     1. Trigger pada `push` ke `main` dan `pull_request`.
     2. Jalankan step `golangci-lint` atau `eslint` dengan cache dependencies.
     3. Jalankan `go test -race` / `npm test`.
     4. Scan kerentanan container image menggunakan Trivy action.
   - **File:** `.github/workflows/ci.yml` | **Runner:** `actionlint .github/workflows/ci.yml`
   - **Nihongo Tech:** 継続的統合 (Keizokuteki Tōgō - Continuous Integration) ・ 脆弱性診断 (Zeijakusei Shindan - Vulnerability Scan)

8. **`qst_cicd_ecr_02` — Build & Push Tagged Multi-Arch Images to AWS ECR**
   - **Station / Chapter:** ST 03 // Bab 2 (Registry Pipelines) | **XP:** 55 | **Gems:** 15
   - **Tokyo Briefing:** *“Bangun pipeline rilis otomatis yang melakukan kompilasi arsitektur ganda (AMD64 & ARM64 Graviton) dan upload ke AWS Elastic Container Registry (ECR).”*
   - **Acceptance Criteria:**
     1. Gunakan `docker/setup-buildx-action`.
     2. Autentikasi ke AWS ECR menggunakan IAM OIDC role (tanpa hardcode AWS Secret Key).
     3. Tag image dengan format SemVer git tag (`v1.2.3`) dan git SHA commit.
   - **File:** `.github/workflows/release.yml` | **Runner:** `actionlint .github/workflows/release.yml`
   - **Nihongo Tech:** レジストリ (Rejisutori - Registry) ・ 重複アーキテクチャ (Jūfuku Ākitekucha - Multi-Arch)

9. **`qst_cicd_rollback_03` — Blue-Green Zero-Downtime Deployment Script**
   - **Station / Chapter:** ST 03 // Bab 3 (Deployment Strategies) | **XP:** 60 | **Gems:** 20
   - **Tokyo Briefing:** *“Deploy versi baru tanpa downtime sedikitpun. Buat skrip deployment Blue-Green yang beralih ke container Green hanya jika healthcheck HTTP 200 tercapai.”*
   - **Acceptance Criteria:**
     1. Jalankan container baru pada port idle (Green).
     2. Polling endpoint `/healthz` selama maksimal 30 detik.
     3. Jika sehat, reload konfigurasi NGINX upstream ke port baru.
     4. Jika gagal, hentikan container Green dan pertahankan container Blue (rollback otomatis).
   - **File:** `scripts/deploy_blue_green.sh` | **Runner:** `bash scripts/test_deploy_blue_green.sh`
   - **Nihongo Tech:** 無停止配備 (Muteishi Haibi - Zero-Downtime Deploy) ・ 切り戻し (Kiri-modoshi - Rollback)

#### 🚉 Station 4: Kubernetes Cluster Orchestration (`[ K8S // 04 ]`)
10. **`qst_k8s_deploy_01` — Production Deployment with Resource Limits**
    - **Station / Chapter:** ST 04 // Bab 1 (Pods & Deployments) | **XP:** 50 | **Gems:** 10
    - **Tokyo Briefing:** *“Cegah skenario Out-Of-Memory (OOM) yang dapat menumbangkan cluster Kubernetes. Buat manifest Deployment dengan resource limits ketat.”*
    - **Acceptance Criteria:**
      1. Replicas minimal 3 pod dengan rolling update strategy (`maxSurge: 1`, `maxUnavailable: 0`).
      2. Tentukan `resources.requests` (100m CPU, 128Mi RAM) dan `limits` (500m CPU, 256Mi RAM).
      3. Konfigurasi `livenessProbe` dan `readinessProbe` ke path `/healthz`.
    - **File:** `k8s/deployment.yaml` | **Runner:** `kubeval k8s/deployment.yaml`
    - **Nihongo Tech:** リソース制限 (Risōsu Seigen - Resource Limit) ・ 死活監視 (Shikatsu Kanshi - Liveness Probe)

11. **`qst_k8s_ingress_02` — NGINX Ingress Controller with Path Routing & TLS**
    - **Station / Chapter:** ST 04 // Bab 2 (Ingress & Services) | **XP:** 55 | **Gems:** 15
    - **Tokyo Briefing:** *“Arahkan traffic domain publik Tokyo `codeabroad.jp` ke backend API dan frontend web melalui satu Load Balancer Ingress.”*
    - **Acceptance Criteria:**
      1. Aturan routing `/api` diarahkan ke service `backend-svc:8080`.
      2. Aturan default `/` diarahkan ke service `frontend-svc:80`.
      3. Konfigurasi TLS secret `codeabroad-tls` untuk enkripsi HTTPS port 443.
    - **File:** `k8s/ingress.yaml` | **Runner:** `kubeval k8s/ingress.yaml`
    - **Nihongo Tech:** 経路制御 (Keiro Seigyo - Routing) ・ 暗号化通信 (Angōka Tsūshin - TLS)

12. **`qst_k8s_hpa_03` — Horizontal Pod Autoscaler (HPA) targeting 70% CPU**
    - **Station / Chapter:** ST 04 // Bab 3 (Autoscaling) | **XP:** 60 | **Gems:** 20
    - **Tokyo Briefing:** *“Ketika promo gajian akhir bulan tiba di Tokyo, traffic melonjak 5x lipat. Konfigurasi HPA agar jumlah pod bertambah otomatis dari 2 hingga 10 pod.”*
    - **Acceptance Criteria:**
      1. Target referensi ke `Deployment` backend.
      2. `minReplicas: 2`, `maxReplicas: 10`.
      3. Trigger scaling ketika rata-rata utilitas CPU pod melebihi 70%.
    - **File:** `k8s/hpa.yaml` | **Runner:** `kubeval k8s/hpa.yaml`
    - **Nihongo Tech:** 自動スケーリング (Jidō Sukēringu - Autoscaling) ・ 負荷急増 (Fuka Kyūzō - Traffic Surge)

#### 🚉 Station 5: AWS Cloud & Terraform IaC (`[ AWS // 05 ]`)
13. **`qst_aws_vpc_01` — Terraform Modular Multi-AZ VPC**
    - **Station / Chapter:** ST 05 // Bab 1 (VPC & Networking) | **XP:** 55 | **Gems:** 15
    - **Tokyo Briefing:** *“Bangun infrastruktur cloud yang tahan gempa/gangguan data center dengan arsitektur Multi-AZ di region Tokyo (`ap-northeast-1`).”*
    - **Acceptance Criteria:**
      1. 2 Public Subnet dan 2 Private Subnet terbagi di Availability Zone `ap-northeast-1a` dan `ap-northeast-1c`.
      2. 1 Internet Gateway untuk Public Subnet.
      3. 1 NAT Gateway di Public Subnet agar Private Subnet dapat download patch dengan aman.
    - **File:** `terraform/vpc.tf` | **Runner:** `terraform validate`
    - **Nihongo Tech:** 冗長構成 (Jōchō Kōsei - Redundant Architecture) ・ 可用性 (Kayōsei - Availability)

14. **`qst_aws_ecs_02` — AWS ECS Fargate Task Definition with CloudWatch Logs**
    - **Station / Chapter:** ST 05 // Bab 2 (Serverless Containers) | **XP:** 55 | **Gems:** 15
    - **Tokyo Briefing:** *“Jalankan container tanpa perlu mengelola server EC2 menggunakan AWS Fargate dan streaming log otomatis ke CloudWatch.”*
    - **Acceptance Criteria:**
      1. Konfigurasi `requires_compatibilities = ["FARGATE"]`.
      2. Tentukan alokasi 256 CPU unit (0.25 vCPU) dan 512MB RAM.
      3. Setup `logConfiguration` driver `awslogs` mengarah ke log group `/ecs/codeabroad-api`.
    - **File:** `terraform/ecs_task.tf` | **Runner:** `terraform validate`
    - **Nihongo Tech:** サーバーレス (Sābāresu - Serverless) ・ 集中ログ (Shūchū Rogu - Centralized Logging)

15. **`qst_aws_alarm_03` — CloudWatch Alarm & SNS Notification for 5xx Spike**
    - **Station / Chapter:** ST 05 // Bab 3 (Monitoring & Alerting) | **XP:** 60 | **Gems:** 20
    - **Tokyo Briefing:** *“Ketika sistem production error lebih dari 10 kali dalam 5 menit, kirim alert darurat ke Slack tim On-Call Tokyo via SNS.”*
    - **Acceptance Criteria:**
      1. Resource `aws_cloudwatch_metric_alarm` memantau metrik ALB `HTTPCode_Target_5XX_Count`.
      2. Periode evaluasi 300 detik (5 menit) dengan threshold `>= 10`.
      3. `alarm_actions` mengarah ke ARN `aws_sns_topic.devops_alerts`.
    - **File:** `terraform/alarm.tf` | **Runner:** `terraform validate`
    - **Nihongo Tech:** 監視通報 (Kanshi Tsūhō - Monitoring Alert) ・ 閾値 (Iki-chi - Threshold)

---

### ⚛️ 4.3 Track: Frontend Web Engineer Catalog (`frontend` / `react`)
**Target Career:** Frontend & Web Applications Engineer (Tokyo Modern Web: Mercari Web, Wantedly, Sansan, DMM).

#### 🚉 Station 1: Strict TypeScript & Modern JavaScript (`[ TS // 01 ]`)
1. **`qst_ts_generics_01` — Generic API Response Wrapper (`ApiResponse<T>`)**
   - **Station / Chapter:** ST 01 // Bab 1 (Generics) | **XP:** 40 | **Gems:** 10
   - **Tokyo Briefing:** *“Standardisasi komunikasi data dengan backend Tokyo. Buat type-safe generic wrapper untuk membedakan respon sukses dan payload error.”*
   - **Acceptance Criteria:**
     1. Tipe generic `ApiResponse<T> = ApiSuccess<T> | ApiError`.
     2. `ApiSuccess<T>` memiliki field `{ success: true, data: T, meta?: PageMeta }`.
     3. Fungsi fetcher `fetchApi<T>(url: string): Promise<ApiResponse<T>>` dengan casting tipe akurat.
   - **File:** `types/api.ts` | **Runner:** `npm test -- api.test.ts`
   - **Nihongo Tech:** 型安全 (Kata Anzen - Type Safety) ・ 総称型 (Sōshō-gata - Generics)

2. **`qst_ts_unions_02` — Discriminated Unions for Reducer State Machines**
   - **Station / Chapter:** ST 01 // Bab 2 (Unions & Type Narrowing) | **XP:** 45 | **Gems:** 10
   - **Tokyo Briefing:** *“Cegah bug UI mustahil (misal status `isLoading = true` sekaligus `isError = true`). Gunakan Discriminated Union untuk status submit lamaran.”*
   - **Acceptance Criteria:**
     1. Definisikan `type FormState = { status: 'idle' } | { status: 'submitting' } | { status: 'success'; data: Application } | { status: 'error'; error: string }`.
     2. Reducer function menggunakan exhaustiveness checking (`switch (state.status)`).
   - **File:** `types/state.ts` | **Runner:** `npm test -- state.test.ts`
   - **Nihongo Tech:** 判別共用体 (Hanbetsu Kyōyōtai - Discriminated Union) ・ 状態遷移 (Jōtai Seni - State Transition)

3. **`qst_ts_zod_03` — Zod Runtime Schema Validation for External APIs**
   - **Station / Chapter:** ST 01 // Bab 3 (Runtime Validation) | **XP:** 50 | **Gems:** 10
   - **Tokyo Briefing:** *“Data dari API partner lowongan Jepang sering berubah tanpa pemberitahuan. Validasi bentuk payload saat runtime menggunakan library Zod.”*
   - **Acceptance Criteria:**
     1. Skema `JobSchema = z.object({ id: z.string().uuid(), salary_yen: z.number().positive(), tags: z.array(z.string()) })`.
     2. Fungsi `parseJobPayload(raw: unknown)` melempar error validasi jika field tidak cocok.
     3. Ekspor TypeScript inference `type Job = z.infer<typeof JobSchema>`.
   - **File:** `schemas/job.schema.ts` | **Runner:** `npm test -- job.schema.test.ts`
   - **Nihongo Tech:** 実行時検証 (Jikkōji Kenshō - Runtime Validation) ・ 推論 (Suiron - Inference)

#### 🚉 Station 2: React Core & Component Architecture (`[ REACT // 02 ]`)
4. **`qst_react_hooks_01` — Custom Hooks (`useDebounce` and `useLocalStorage`)**
   - **Station / Chapter:** ST 02 // Bab 1 (Custom Hooks) | **XP:** 45 | **Gems:** 10
   - **Tokyo Briefing:** *“Isolasi side-effect dan bangun komponen yang modular. Buat custom hook `useDebounce` untuk input pencarian dan `useLocalStorage` untuk menyimpan draft jawaban.”*
   - **Acceptance Criteria:**
     1. `useDebounce<T>(value: T, delayMs: number): T` menunda update state selama `delayMs`.
     2. `useLocalStorage<T>(key: string, initialValue: T): [T, (val: T) => void]` mensinkronkan nilai ke `window.localStorage`.
     3. Tangani fallback aman jika LocalStorage diblokir oleh browser mode incognito.
   - **File:** `hooks/useUtilityHooks.ts` | **Runner:** `npm test -- hooks.test.ts`
   - **Nihongo Tech:** カスタムフック (Kasutamu Fukku - Custom Hook) ・ 副作用 (Fukusayō - Side Effect)

5. **`qst_react_compound_02` — Accessible Compound Accordion Component**
   - **Station / Chapter:** ST 02 // Bab 2 (Compound Pattern) | **XP:** 55 | **Gems:** 15
   - **Tokyo Briefing:** *“Startup edutech di Meguro membutuhkan komponen FAQ Accordion dengan Compound Component pattern agar mudah dikustomisasi oleh tim desain.”*
   - **Acceptance Criteria:**
     1. Ekspor `Accordion`, `Accordion.Item`, `Accordion.Header`, dan `Accordion.Body`.
     2. Menggunakan React Context untuk membagikan active item index.
     3. Mendukung navigasi keyboard: tombol `Enter` / `Space` untuk toggle, dan `aria-expanded` dinamis.
   - **File:** `components/Accordion.tsx` | **Runner:** `npm test -- Accordion.test.tsx`
   - **Nihongo Tech:** 再利用性 (Sai-riyō-sei - Reusability) ・ アクセシビリティ (Akuseshibiriti - Accessibility)

6. **`qst_react_zustand_03` — Modular Zustand State Store with Persistence**
   - **Station / Chapter:** ST 02 // Bab 3 (Global State Management) | **XP:** 50 | **Gems:** 10
   - **Tokyo Briefing:** *“Kelola state quest aktif, isi kode editor, dan status test runner secara global tanpa prop drilling menggunakan Zustand.”*
   - **Acceptance Criteria:**
     1. State `activeQuestId`, `codeBuffer`, `testResults`, dan action `setCodeBuffer`, `setTestResults`.
     2. Gunakan middleware `persist` untuk menyimpan `codeBuffer` di LocalStorage.
     3. Sediakan selector hook terpisah untuk mencegah re-render komponen yang tidak perlu.
   - **File:** `store/questStore.ts` | **Runner:** `npm test -- questStore.test.ts`
   - **Nihongo Tech:** 状態管理 (Jōtai Kanri - State Management) ・ 再描画防止 (Sai-byōga Bōshi - Prevent Re-render)

#### 🚉 Station 3: Next.js & Server-Driven Architecture (`[ NEXT // 03 ]`)
7. **`qst_next_rsc_01` — Server Components with Suspense Streaming**
   - **Station / Chapter:** ST 03 // Bab 1 (RSC & Streaming) | **XP:** 50 | **Gems:** 10
   - **Tokyo Briefing:** *“Render halaman direktori lowongan kerja Tokyo dengan zero client-side JavaScript overhead menggunakan React Server Components.”*
   - **Acceptance Criteria:**
     1. Komponen `JobList` mengambil data async langsung di server (`async function JobList()`).
     2. Bungkus di parent page dengan `<Suspense fallback={<JobSkeletonList />}>`.
     3. Pastikan tidak ada hook client (`useState`/`useEffect`) di server component.
   - **File:** `app/jobs/page.tsx` | **Runner:** `npm test -- jobsPage.test.tsx`
   - **Nihongo Tech:** サーバーコンポーネント (Server Component) ・ 分割配信 (Bunkatsu Haishin - Streaming)

8. **`qst_next_optimistic_02` — Optimistic UI Upvote with Auto-Rollback**
   - **Station / Chapter:** ST 03 // Bab 2 (Server Actions & Optimistic) | **XP:** 55 | **Gems:** 15
   - **Tokyo Briefing:** *“Tingkatkan kesan responsif pada tombol bookmark/upvote lowongan. Naikkan angka seketika di UI dan batalkan (rollback) jika server mengembalikan error.”*
   - **Acceptance Criteria:**
     1. Gunakan hook `useOptimistic` untuk state bookmark lowongan.
     2. UI langsung berubah aktif tanpa menunggu respon network.
     3. Rollback ke status semula jika Server Action melempar exception atau network offline.
   - **File:** `components/BookmarkButton.tsx` | **Runner:** `npm test -- BookmarkButton.test.tsx`
   - **Nihongo Tech:** 楽観的更新 (Rakkanteki Kōshin - Optimistic Update) ・ 即時反映 (Sokuji Han'ei - Instant Feedback)

9. **`qst_tanstack_query_03` — TanStack Query Prefetching & Cache Invalidation**
   - **Station / Chapter:** ST 03 // Bab 3 (Client Data Caching) | **XP:** 55 | **Gems:** 15
   - **Tokyo Briefing:** *“Sinkronkan data quest user dengan server. Lakukan background revalidation dan invalidasi cache otomatis saat user menyelesaikan misi.”*
   - **Acceptance Criteria:**
     1. Gunakan `useQuery` dengan query key `['quests', trackId]` dan `staleTime: 5 * 60 * 1000`.
     2. Gunakan `useMutation` pada submission quest yang memanggil `queryClient.invalidateQueries`.
     3. Implementasikan retry logic 2 kali dengan exponential delay.
   - **File:** `services/questQuery.ts` | **Runner:** `npm test -- questQuery.test.ts`
   - **Nihongo Tech:** キャッシュ無効化 (Kyasshu Mukōka - Cache Invalidation) ・ 再検証 (Sai-kenshō - Revalidation)

#### 🚉 Station 4: Web Performance & Core Web Vitals (`[ PERF // 04 ]`)
10. **`qst_react_virtual_01` — Virtualized 10,000-Item Realtime List**
    - **Station / Chapter:** ST 04 // Bab 1 (List Virtualization) | **XP:** 55 | **Gems:** 15
    - **Tokyo Briefing:** *“Aplikasi orderbook mata uang Tokyo menampilkan 10.000 transaksi. Render hanya item yang terlihat di viewport agar scrolling tetap mulus di 60 FPS.”*
    - **Acceptance Criteria:**
      1. Gunakan `@tanstack/react-virtual` hook `useVirtualizer`.
      2. Jumlah elemen DOM yang dirender tidak boleh lebih dari 30 node sekaligus.
      3. Posisi container virtual dihitung tepat menggunakan CSS `transform: translateY(...)`.
    - **File:** `components/OrderBookVirtualList.tsx` | **Runner:** `npm test -- virtualList.test.tsx`
    - **Nihongo Tech:** 仮想スクロール (Kasō Sukurōru - Virtual Scroll) ・ 描画負荷軽減 (Byōga Fuka Keigen - Render Load Reduction)

11. **`qst_react_split_02` — Dynamic Imports & Lazy-Loading Heavy Modules**
    - **Station / Chapter:** ST 04 // Bab 2 (Code Splitting) | **XP:** 50 | **Gems:** 10
    - **Tokyo Briefing:** *“Halaman editor belajar sangat berat karena memuat Monaco Editor (5MB). Pisahkan bundle editor menggunakan dynamic import agar first page load di bawah 1 detik.”*
    - **Acceptance Criteria:**
      1. Import editor menggunakan `React.lazy(() => import('@monaco-editor/react'))`.
      2. Tampilkan `<EditorSkeleton />` selama Monaco diunduh di background.
      3. Ukuran main bundle berkurang minimal 40%.
    - **File:** `components/LazyCodeEditor.tsx` | **Runner:** `npm test -- lazyEditor.test.tsx`
    - **Nihongo Tech:** 遅延読み込み (Chien Yomikomi - Lazy Loading) ・ バンドル分割 (Bandoru Bunkatsu - Bundle Splitting)

12. **`qst_react_vitals_03` — Core Web Vitals Optimization (Fixing CLS & LCP)**
    - **Station / Chapter:** ST 04 // Bab 3 (Core Web Vitals) | **XP:** 55 | **Gems:** 15
    - **Tokyo Briefing:** *“Skor Google PageSpeed jelek karena banner promosi bergeser saat gambar selesai dimuat. Eliminasi CLS (Cumulative Layout Shift) hingga di bawah 0.05.”*
    - **Acceptance Criteria:**
      1. Terapkan rasio aspek eksplisit (`aspect-ratio` atau reserved skeleton height) pada gambar.
      2. Gunakan font display `font-display: swap` dengan font metric override.
      3. Lulus audit CLS < 0.05 dan LCP < 2.0s pada lighthouse test runner.
    - **File:** `components/HeroBanner.tsx` | **Runner:** `npm test -- vitals.test.tsx`
    - **Nihongo Tech:** 表示崩れ防止 (Hyōji Kuzure Bōshi - CLS Prevention) ・ 読み込み速度 (Yomikomi Sokudo - Load Speed)

#### 🚉 Station 5: Testing & a11y Standards (`[ TEST // 05 ]`)
13. **`qst_react_rtl_01` — Unit & Component Testing with Vitest + RTL**
    - **Station / Chapter:** ST 05 // Bab 1 (Component Testing) | **XP:** 50 | **Gems:** 10
    - **Tokyo Briefing:** *“Uji form lamaran kerja di Tokyo. Pastikan tombol submit ter-disable saat input kosong, pesan error muncul saat validasi gagal, dan loading spinner muncul saat submit.”*
    - **Acceptance Criteria:**
      1. Uji komponen menggunakan `@testing-library/react` dan `@testing-library/user-event`.
      2. Query elemen menggunakan accessibility selectors (`getByRole`, `getByLabelText`).
      3. Assert mock submission handler dipanggil tepat 1 kali dengan payload yang sesuai.
    - **File:** `components/JobApplicationForm.test.tsx` | **Runner:** `npm test -- JobApplicationForm.test.tsx`
    - **Nihongo Tech:** コンポーネントテスト (Konpōnento Tesuto - Component Test) ・ 振る舞い検証 (Furumai Kenshō - Behavior Verification)

14. **`qst_react_e2e_02` — Playwright End-to-End User Journey**
    - **Station / Chapter:** ST 05 // Bab 2 (E2E Testing) | **XP:** 60 | **Gems:** 20
    - **Tokyo Briefing:** *“Otomatisasi pengujian alur lengkap user: Dari Login ➔ Buka Workspace Belajar ➔ Tulis Solusi ➔ Klik Periksa ➔ Muncul Layar Misi Selesai.”*
    - **Acceptance Criteria:**
      1. Skenario Playwright menguji routing dan autentikasi.
      2. Ketik kode ke editor dan klik tombol `#btn-check-code`.
      3. Verifikasi munculnya modal perayaan dengan teks `Misi Selesai!` dan penambahan XP.
    - **File:** `e2e/quest-flow.spec.ts` | **Runner:** `npx playwright test e2e/quest-flow.spec.ts`
    - **Nihongo Tech:** 統合試験 (Tōgō Shiken - Integration/E2E Test) ・ 自動操作 (Jidō Sōsa - Automated Interaction)

15. **`qst_react_a11y_03` — WCAG 2.1 AA Accessibility & Keyboard Traps**
    - **Station / Chapter:** ST 05 // Bab 3 (Web Accessibility) | **XP:** 55 | **Gems:** 15
    - **Tokyo Briefing:** *“Standar portal publik Jepang mewajibkan kepatuhan disabilitas (WCAG 2.1 AA). Bangun modal dialog dengan focus trap dan navigasi tombol Escape.”*
    - **Acceptance Criteria:**
      1. Komponen modal memiliki atribut `role="dialog"` dan `aria-modal="true"`.
      2. Menjebak fokus keyboard (`Tab` dan `Shift+Tab`) tetap berada di dalam modal saat terbuka.
      3. Menutup modal ketika tombol `Escape` ditekan dan mengembalikan fokus ke trigger button.
    - **File:** `components/A11yModal.tsx` | **Runner:** `npm test -- A11yModal.test.tsx`
    - **Nihongo Tech:** アクセシビリティ (Akuseshibiriti - Accessibility) ・ キーボード操作 (Kībōdo Sōsa - Keyboard Navigation)

---

### ⚡ 4.4 Rotating Daily Quests Pool (10 Micro-Challenges)
*Misi harian 5–10 menit (+20 XP, +5 Gems) yang dirotasi 3 buah setiap tengah malam (00:00 JST / 22:00 WIB) untuk mempertahankan streak aktif.*

| Quest ID | Kategori | Judul Tantangan Harian | Problem Statement & Solusi Cepat | Runner & Verifikasi |
|---|---|---|---|---|
| **`daily_01`** | SQL / DB | Perbaiki Query Foreign Key JOIN | Query laporan bulanan menghasilkan duplikat baris karena salah tipe `LEFT JOIN`. Ubah menjadi `INNER JOIN` dengan agregasi `COUNT(DISTINCT)`. | `psql -c "EXPLAIN ANALYZE ..."` |
| **`daily_02`** | Golang | Tangani Nil Pointer Dereference | Service crashing dengan panic `runtime error: invalid memory address`. Tambahkan guard clause `if user == nil { return ErrNotFound }`. | `go test -run TestNilGuard` |
| **`daily_03`** | TypeScript | User-Defined Type Guard | Bedakan respon API `{ error: string }` vs `{ data: Job }` menggunakan function `isError(res: unknown): res is ApiError`. | `npm test -- typeguard.test.ts` |
| **`daily_04`** | Docker | Optimasi Urutan Cache Layer | Docker build lama karena `COPY . .` berada sebelum `go mod download`. Pindahkan copy manifest dependensi ke atas untuk memaksimalkan layer cache. | `hadolint Dockerfile` |
| **`daily_05`** | Regex | Validasi Kode Pos Jepang (`〒150-0002`) | Buat regex untuk memvalidasi format kode pos Tokyo: 3 digit angka, tanda strip, 4 digit angka (`^\d{3}-\d{4}$`). | `npm test -- postal.test.ts` |
| **`daily_06`** | Security | Hitung Masa Berlaku Token JWT | Buat helper Go yang menghitung sisa waktu token dalam detik berdasarkan klaim `exp` unix epoch vs `time.Now().Unix()`. | `go test -run TestJWTTTL` |
| **`daily_07`** | React | Debounce Pencarian Lowongan | Cegah request beruntun ke backend saat user mengetik cepat dengan menambahkan delay timer 300ms pada `onChange`. | `npm test -- debounce.test.tsx` |
| **`daily_08`** | Linux | Ekstrak Penggunaan Memory Container | Tulis 1-liner Bash command menggunakan `docker stats --no-stream --format "{{.MemUsage}}"` untuk monitoring server. | `bash test_stats.sh` |
| **`daily_09`** | Nihongo | Terjemahkan & Debug Error Server | Diberikan log error: *「データベース接続タイムアウトが発生しました」* (Database connection timeout occurred). Set timeout parameter ke 10 detik. | `go test -run TestTimeout` |
| **`daily_10`** | CSS / Web | Eliminasi Layout Shift Banner | Gambar promosi menggeser konten artikel saat load. Berikan properti CSS `aspect-ratio: 16 / 9` dan `width: 100%`. | `npm test -- banner.test.tsx` |

---

### 💻 4.5 Multi-Language Workspace Runner Engine

To support interactive coding quests across Go, Docker, and React without switching platforms, CodeAbroad implements a unified workspace runner specification:

| Track | Editor Language | File Layout | Runner Execution Backend | Output Parsing & Success Matcher |
|---|---|---|---|---|
| **Golang** | `go` | `solution.go`<br>`solution_test.go` | Sandbox container runs `go test -v -json` | `=== RUN` and `--- PASS:` indicators, parse test duration and failure stack traces. |
| **Docker** | `dockerfile` / `yaml` | `Dockerfile`<br>`docker-compose.yml` | Container linter + dry-run engine (`hadolint -f json` & `docker compose config`) | Exit code 0, 0 warning violations, base image security validation. |
| **React** | `typescript` | `Solution.tsx`<br>`Solution.test.tsx` | Node.js sandbox runs `vitest run --reporter=json` | `numPassedTests === numTotalTests`, execution time, console log captures. |

---

## 🗄️ 5. Database Schema & Migration Changes

### Migration `000003_create_quest_and_roadmap_engine.up.sql`:

```sql
-- 1. Create roadmaps table
CREATE TABLE roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_path_id UUID NOT NULL REFERENCES career_paths(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(career_path_id)
);

-- 2. Create stations table
CREATE TABLE stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    station_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    chip_label VARCHAR(50) NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(roadmap_id, station_number)
);

-- 3. Create chapters table
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(station_id, chapter_number)
);

-- 4. Extend quests table
ALTER TABLE quests
    ADD COLUMN chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
    ADD COLUMN chip_label VARCHAR(50),
    ADD COLUMN story_context TEXT,
    ADD COLUMN nihongo_notes JSONB,
    ADD COLUMN acceptance_criteria JSONB,
    ADD COLUMN starter_code JSONB,
    ADD COLUMN test_suite JSONB;

-- 5. Extend user_quests table
ALTER TABLE user_quests
    ADD COLUMN code_submission TEXT,
    ADD COLUMN tests_passed INT DEFAULT 0,
    ADD COLUMN total_tests INT DEFAULT 0;

-- Indexes for performance (p95 < 100ms)
CREATE INDEX idx_stations_roadmap_id ON stations(roadmap_id);
CREATE INDEX idx_chapters_station_id ON chapters(station_id);
CREATE INDEX idx_quests_chapter_id ON quests(chapter_id);
CREATE INDEX idx_quests_type ON quests(type);
CREATE INDEX idx_user_quests_user_status ON user_quests(user_id, status);
```

---

## 🎨 6. Frontend UI/UX Architecture & Screen SSOT

All screens are designed and mathematically aligned in `codeabroad.pen` following the Duolingo Clean Light Design System:

| Screen Number | Component Name | URL Route | Node ID in `codeabroad.pen` | Layout & Key Responsibilities |
|---|---|---|---|---|
| **07** | `DashboardPage.tsx` | `/dashboard` | `nBvwB` (Desktop)<br>`cbmT5` (Tablet)<br>`v8MrHU` (Mobile) | **Beranda Hub:** Active track hero card, quick resume button `[ LANJUTKAN KODING ▶ ]`, 3 Daily Quests carousel, Tokyo readiness gauge, streak counter. |
| **08** | `RoadmapPage.tsx` | `/courses` / `/roadmap/:track` | `AFrSg` (Desktop)<br>`XVmT8` (Tablet)<br>`G921iz` (Mobile) | **Syllabus Tree:** Stations 1–5 vertical track, accordion chapters, `✓ LULUS` badges, active station highlights (`#EFF6FF` with `#2563EB` border), and locked stations. |
| **09** | `QuestLogPage.tsx` | `/quests` | `Ilelx` (Desktop)<br>`N928x` (Tablet)<br>`mwwZX` (Mobile) | **Quest Directory:** Filterable tabs (*Semua, Harian, Utama, Tantangan*), countdown timer to midnight reset, XP reward chips (`[ GIN // D1 ]`), weekly chest claim card. |
| **10** | `LearnWorkspacePage.tsx` *(Success State)* | `/learn/:id` | `z9HqoP` (Desktop)<br>`K90X5G` (Tablet)<br>`HH7KX` (Mobile) | **Interactive Coding Workspace (Pass):** Left briefing + acceptance checklist (green checkmarks) + Nihongo tech chip; Right Go syntax-highlighted editor + terminal (`● 2/2 PASSING`); Bottom bar `[ PERIKSA & SELESAIKAN MISI ✓ ]`. |
| **10B** | `LearnWorkspacePage.tsx` *(Fail State)* | `/learn/:id` | `s8Cx8f` (Desktop)<br>`HiyXA` (Tablet)<br>`mV5Zg` (Mobile) | **Interactive Coding Workspace (Fail):** Highlighted failed criteria in red (`[✕]`), Kodi amber hint card, terminal failure logs (`FAIL 1/2`), Duolingo soft red alert footer (`#FEF2F2`), and retry button `[ ▶ JALANKAN ULANG ]`. |
| **11** | `QuestCompletePage.tsx` | `/learn/:id/complete` | `H3R9gl` (Desktop)<br>`F2vHa` (Tablet)<br>`nqOAC` (Mobile) | **Celebration Hub:** Clean light canvas (`#F8FAFC`), Kodi celebration mascot (`🎉`), 3 tactile badges (`+50 XP ⚡`, `100% 🎯`, `5 HARI 🔥`), Tokyo Flight GPS progress bar (`CGK ➔ NRT: 70%`), JLPT N3 stamp, and 3D CTA `[ LANJUTKAN KE BAB 3 ▶ ]`. |

---

## ✅ 7. End-to-End Implementation Tracker

### Phase A: Database Migrations & Seeds
- [ ] **Migration 000003:** Create `000003_create_quest_and_roadmap_engine.up.sql` and `.down.sql`.
- [ ] **Seed Multi-Track Curriculum:** Seed Go Backend (`golang`), DevOps/Docker (`devops_aws`), and React (`react`) Roadmaps with 5 Stations each, progressive Chapters, and initial practical Quests.
- [ ] **Seed Daily Quests Pool:** Seed 10 rotating daily micro-quests.

### Phase B: Backend Clean Architecture (Golang)
- [ ] **Domain Layer (`internal/domain/`):**
  - Define `Roadmap`, `Station`, `Chapter`, `Quest`, `UserQuest` structs and DTOs.
  - Define `QuestRepository`, `RoadmapRepository`, `UserQuestRepository` interfaces.
- [ ] **Repository Layer (`internal/repository/`):**
  - Implement `roadmap_repository.go` (query syllabus with station/chapter hierarchy).
  - Implement `quest_repository.go` (query quests by type, slug, prerequisites).
  - Implement `user_quest_repository.go` (query/update user progress and status).
- [ ] **Usecase Layer (`internal/usecase/`):**
  - Implement `roadmap_usecase.go` (`GetTrackRoadmap`, `GetUserProgress`).
  - Implement `quest_usecase.go` (`GetQuestDetails`, `RunUnitTests`, `SubmitQuest`).
  - Hook into `XPService` (+XP calculation) and `StreakService` (+1 day consecutive check).
- [ ] **Delivery Layer (`internal/delivery/http/`):**
  - Implement `roadmap_handler.go` and `quest_handler.go`.
  - Register `/api/v1/roadmaps` and `/api/v1/quests` in Gin router under `AuthMiddleware`.
- [ ] **Unit & Integration Tests:**
  - Test prerequisite validation (locked quests cannot be accessed).
  - Test test-runner mock execution (pass vs fail).
  - Test idempotent XP awarding on quest submission.

### Phase C: Frontend Components & Pages (React + TypeScript)
- [ ] **Types & API Client (`frontend/src/types/`, `frontend/src/services/`):**
  - Define TypeScript interfaces matching API DTOs.
  - Create `roadmapService.ts` and `questService.ts`.
- [ ] **Zustand Store Updates (`frontend/src/store/`):**
  - Create `questStore.ts` managing active quest state, code buffers, and test results.
- [ ] **Page Implementations (`frontend/src/pages/`):**
  - Implement `RoadmapPage.tsx` (`/courses`).
  - Implement `QuestLogPage.tsx` (`/quests`).
  - Implement `LearnWorkspacePage.tsx` (`/learn/:id`) with Monaco/CodeMirror editor and Terminal output.
  - Implement `QuestCompletePage.tsx` / `QuestCelebrationModal.tsx`.
- [ ] **Router & Navigation Updates (`frontend/src/App.tsx`):**
  - Register `/courses`, `/quests`, `/learn/:id`, and `/learn/:id/complete` under `ProtectedRoute`.

### Phase D: End-to-End Verification
- [ ] Verify full learning loop: Dashboard ➔ Start Quest ➔ Edit Code ➔ Run Test (Fail ➔ Pass) ➔ Submit ➔ Celebration Screen ➔ XP & Streak incremented.
- [ ] Responsive UI verification on Mobile (390px), Tablet (768px), and Desktop (1440px).

---

## 🔮 8. Future Scope & Backlog

- **In-Browser WebAssembly Go Runner:** Client-side test execution via Yaegi or Go WebAssembly for instant sub-50ms test feedback.
- **Kafka Event Consumer for Daily Reset:** Automated midnight worker rotating the 3 daily quests.
- **Soft Skill Interactive Interview Quests:** Voice/text conversational quest simulator for Tokyo HR cultural interviews.
