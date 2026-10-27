# Entity Relationship Diagram (ERD) - CodeAbroad
**Version:** 2.2 (Multi-Country Normalized Architecture & Modular Tech Stacks)  
**Last Updated:** 2026-10-27  
**Database:** PostgreSQL 16 (`pgcrypto`)  

---

## 🗺️ 1. Conceptual Architecture & Bounded Contexts

CodeAbroad mengadopsi **The 3-Pillar Architecture** memisahkan kredensial login (Auth Core), profil publik & target karir (Profile Domain), serta mesin progresi gamifikasi (Gamification Engine), yang terintegrasi secara modular dengan kurikulum koding dan bank bahasa multi-country:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PILLAR 1: CORE AUTH                             │
│ ┌─────────────────────────┐                                            │
│ │          users          │ (Pure Credentials: ID, Email, Password)    │
│ └───────────┬─────────────┘                                            │
└─────────────┼──────────────────────────────────────────────────────────┘
              │ (1-to-1 FK user_id)
              ├──────────────────────────────────┬───────────────────────┐
              ▼                                  ▼                       ▼
┌───────────────────────────┐      ┌───────────────────────────┐ ┌─────────────────────────────┐
│  PILLAR 2: user_profiles  │      │PILLAR 3: user_gamification│ │     user_inventories        │
│ (Name, Username, Bio,     │      │(XP, Level, Streak, Gems,  │ │ (Streak Freeze, Boosters)   │
│  Career, Country, Stack)  │      │ Last Active At)           │ │                             │
└─────────────┬─────────────┘      └───────────────────────────┘ └─────────────────────────────┘
              │                                  │                       │
              ├──────────────────────────────────┴───────────────────────┘
              ▼
┌───────────────────────────┐      ┌───────────────────────────┐
│    user_activity_logs     │      │  user_daily_chest_claims  │
│ (Daily presence, 7-day)   │      │ (Golden Chest Claims)     │
└───────────────────────────┘      └───────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                 CURRICULUM & MULTI-COUNTRY WORKSPACE                   │
│                                                                        │
│  countries ──(FK)──> vocabularies (N5-N1 / A1-C2 with audio)           │
│                                                                        │
│  career_paths ──(FK)──> tech_stacks ──(FK)──> modules ──> chapters     │
│                                                            │           │
│                                                            ▼           │
│                                                          quests        │
│                                                            │           │
│                                                            ▼           │
│                                                       user_quests      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ 2. Detailed Table Specifications

### 2.1 Identity & Authentication Domain (Pillar 1: Auth Core)

#### `users` (Core Account Entity - Zero Data Leak)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Unique identifier | Active |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email address | Active |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password | Active |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Registration timestamp | Active |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Account update timestamp | Active |

---

### 2.2 Profile & Career Target Domain (Pillar 2: Application Profile)

#### `user_profiles` (1-to-1 with `users`)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Unique profile ID | Active (Mig 001) |
| `user_id` | UUID | UNIQUE, NOT NULL, FK → `users.id` ON DELETE CASCADE | Associated user ID | Active (Mig 001) |
| `name` | VARCHAR(100) | NOT NULL | User's full name | Active (Mig 001) |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Unique platform username | Active (Mig 001) |
| `bio` | TEXT | NULL | Short developer bio | Active (Mig 001) |
| `career_path_id`| UUID | FK → `career_paths.id` ON DELETE SET NULL, NULL | Selected target career track (backend, frontend, etc.) | Active (Mig 001) |
| `country_id` | VARCHAR(2) | FK → `countries.code` ON DELETE SET NULL, NULL | Selected target country (JP, DE, SG) | Active (Mig 001) |
| `tech_stack_id` | UUID | FK → `tech_stacks.id` ON DELETE SET NULL, NULL | Selected primary tech stack (golang, react, etc.) | Active (Mig 001) |
| `is_onboarded` | BOOLEAN | NOT NULL, DEFAULT FALSE | Onboarding completion flag | Active (Mig 001) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Profile creation timestamp | Active (Mig 001) |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Profile update timestamp | Active (Mig 001) |

---

### 2.3 Gamification & Progression Domain (Pillar 3: Normalized in Migration 000008)

#### `user_gamification` (1-to-1 with `users`)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Unique gamification record ID | Active (Mig 008) |
| `user_id` | UUID | UNIQUE, NOT NULL, FK → `users.id` ON DELETE CASCADE | Associated user ID | Active (Mig 008) |
| `xp` | INTEGER | NOT NULL, DEFAULT 0 | Cumulative Experience Points | Active (Mig 008) |
| `current_level`| INTEGER | NOT NULL, DEFAULT 1 | Current gamified level (1–50) | Active (Mig 008) |
| `streak` | INTEGER | NOT NULL, DEFAULT 0 | Current consecutive active days | Active (Mig 008) |
| `gems` | INTEGER | NOT NULL, DEFAULT 0 | Virtual currency balance (Blue Gems) | Active (Mig 008) |
| `last_active_at`| TIMESTAMPTZ | NULL | Timestamp of last user activity | Active (Mig 008) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp | Active (Mig 008) |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Last stats update timestamp | Active (Mig 008) |

#### `user_inventories` (Player Bag / Owned Items)
> Katalog item (`streak-freeze` 20 gems, `xp-booster` 35 gems) **tidak disimpan di tabel**. Harga & efek di-hardcode di Go (`BuyShopItem`) dan metadata UI di React (`SHOP_ITEMS`). `item_id` diperlakukan sebagai application-level enum.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Inventory item record ID |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | Item owner |
| `item_id` | VARCHAR(50) | NOT NULL (enum: `streak-freeze`, `xp-booster`) | Purchased item SKU (validated in Go) |
| `quantity` | INTEGER | NOT NULL, DEFAULT 0 | Quantity remaining in bag |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Purchase timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Consumption timestamp |
| *Index* | UNIQUE(`user_id`, `item_id`) | | One row per item SKU per user |

#### `user_badges` (Monthly Milestones & Badges - Slim Junction)
> Judul, deskripsi, dan ikon lencana **tidak disimpan per baris**. Di-resolve di kode dari `badge_key` (contoh: `codeabroad_monthly_badge_2026_10`).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Badge award ID |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | Badge recipient |
| `badge_key` | VARCHAR(100)| NOT NULL | Unique badge identifier |
| `awarded_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Award timestamp |
| *Index* | UNIQUE(`user_id`, `badge_key`) | | One award per badge per user |

#### `user_daily_chest_claims` (Golden Chest Milestone Rewards)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Claim ID |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | Claimant user |
| `claim_date` | DATE | NOT NULL | Date of claim |
| `tier` | INTEGER | NOT NULL, CHECK IN (1, 2, 3) | Chest tier milestone |
| `gems_awarded` | INTEGER | NOT NULL | Gems received |
| `xp_awarded` | INTEGER | NOT NULL | XP received |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Timestamp |
| *Index* | UNIQUE(`user_id`, `claim_date`, `tier`) | | Anti double-claim lock (ACID) |

#### `user_activity_logs` (Daily Tracking & 7-Day History)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Activity entry ID |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | User ID |
| `activity_type` | VARCHAR(50) | NOT NULL, CHECK IN (`daily_login`, `quest_completed`, `daily_vocab_quest_claim`, `daily_golden_chest_claim`) | Activity type |
| `xp_earned` | INTEGER | NOT NULL, DEFAULT 0 | XP awarded |
| `metadata` | JSONB | NULL | Dynamic context (dates, details) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Log timestamp |
| *Index* | (`user_id`, `created_at`) | | Speeds up 7-day calendar, streak & leaderboard queries |

---

### 2.4 Curriculum & Workspace Domain

#### `countries` (Multi-Country Destinations)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `code` | VARCHAR(2) | PRIMARY KEY | Country ISO code (`JP`, `DE`, `SG`) | Active (Mig 001) |
| `name` | VARCHAR(100)| NOT NULL | Country display name (Japan, Germany, Singapore) | Active (Mig 001) |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Country availability flag | Active (Mig 001) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Registration timestamp | Active (Mig 001) |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Update timestamp | Active (Mig 001) |

#### `career_paths` (High-Level Engineering Tracks)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Career path ID | Active (Mig 001) |
| `slug` | VARCHAR(50) | UNIQUE, NOT NULL | Track slug (`backend`, `frontend`, `devops`, `fullstack`, etc.) | Active (Mig 001) |
| `label` | VARCHAR(100)| NOT NULL | Track title (Backend Engineer, Frontend Engineer) | Active (Mig 001) |
| `description` | TEXT | NULL | Track overview description | Active (Mig 001) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp | Active (Mig 001) |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Update timestamp | Active (Mig 001) |

#### `tech_stacks` (Normalized Technology Stacks & Foundation)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Tech stack ID | Active (Mig 001) |
| `career_path_id`| UUID | FK → `career_paths.id` ON DELETE SET NULL, NULLABLE | Parent career track (`NULL` for Universal Foundation) | Active (Mig 001) |
| `slug` | VARCHAR(50) | UNIQUE, NOT NULL | Stack slug (`golang`, `react`, `web_fundamental`, etc.) | Active (Mig 001) |
| `label` | VARCHAR(100)| NOT NULL | Display label (Go Gin, React & Next.js) | Active (Mig 001) |
| `badge` | VARCHAR(50) | NULL | UI badge (`Recommended`, `Foundation`, `Popular`) | Active (Mig 001) |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Availability status flag | Active (Mig 001) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp | Active (Mig 001) |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Update timestamp | Active (Mig 001) |

#### `modules` (Sequential Learning Units per Tech Stack)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Module ID | Active (Mig 001) |
| `tech_stack_id` | UUID | NOT NULL, FK → `tech_stacks.id` ON DELETE CASCADE | Associated tech stack | Active (Mig 001) |
| `module_number` | INT | NOT NULL | Unit sequence order (1, 2, 3...) | Active (Mig 001) |
| `title` | VARCHAR(255)| NOT NULL | Module title (Go Syntax & Concurrency Core) | Active (Mig 001) |
| `description` | TEXT | NULL | Module curriculum syllabus | Active (Mig 001) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp | Active (Mig 001) |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Update timestamp | Active (Mig 001) |
| *Constraint* | UNIQUE(`tech_stack_id`, `module_number`) | | Ensures numbered sequence integrity | Active (Mig 001) |

#### `chapters` (Sub-Chapters in a Module)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Chapter ID | Active (Mig 001) |
| `module_id` | UUID | NOT NULL, FK → `modules.id` ON DELETE CASCADE | Parent module ID | Active (Mig 001) |
| `chapter_number`| INT | NOT NULL | Chapter sequence order (1, 2, 3...) | Active (Mig 001) |
| `title` | VARCHAR(255)| NOT NULL | Chapter title | Active (Mig 001) |
| `description` | TEXT | NULL | Chapter summary | Active (Mig 001) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp | Active (Mig 001) |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Update timestamp | Active (Mig 001) |
| *Constraint* | UNIQUE(`module_id`, `chapter_number`) | | Prevents duplicate chapter ordering | Active (Mig 001) |

#### `quests` (Duolingo-style Interactive Learning Nodes)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Quest ID | Active (Mig 001) |
| `chapter_id` | UUID | NOT NULL, FK → `chapters.id` ON DELETE CASCADE | Parent chapter ID | Active (Mig 001) |
| `title` | VARCHAR(255)| NOT NULL | Node title | Active (Mig 001) |
| `description` | TEXT | NULL | Problem statement and instructions | Active (Mig 001) |
| `type` | VARCHAR(50) | NOT NULL, CHECK IN (`main`, `boss`, `daily`) | Quest milestone tier | Active (Mig 001) |
| `format` | VARCHAR(50) | NOT NULL, CHECK IN (`code`, `quiz`, `fill_blank`) | Interactive interface format | Active (Mig 001) |
| `difficulty` | VARCHAR(20) | NOT NULL, DEFAULT `'easy'`, CHECK IN (`easy`, `medium`, `hard`) | Challenge difficulty | Active (Mig 001) |
| `xp_reward` | INT | NOT NULL, DEFAULT 10 | Experience Points awarded upon completion | Active (Mig 001) |
| `gems_reward` | INT | NOT NULL, DEFAULT 5 | Blue Gems awarded upon completion | Active (Mig 001) |
| `estimated_minutes` | INT | NOT NULL, DEFAULT 5 | Expected time to solve | Active (Mig 001) |
| `order_index` | INT | NOT NULL | Sequential roadmap node position (1, 2, 3...) | Active (Mig 001) |
| `starter_code` | TEXT | NULL | Initial boilerplate code in Monaco editor | Active (Mig 001) |
| `test_suite` | JSONB | NULL | Unit test assertions schema | Active (Mig 001) |
| `solution_code`| TEXT | NULL | Official reference solution | Active (Mig 001) |
| `quiz_data` | JSONB | NULL | Multiple-choice questions, options & explanation | Active (Mig 001) |
| `hints` | JSONB | NULL | Hint snippets array | Active (Mig 001) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp | Active (Mig 001) |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Update timestamp | Active (Mig 001) |
| *Constraint* | UNIQUE(`chapter_id`, `order_index`) | | Guarantees ordered progression on map | Active (Mig 001) |

#### `user_quests` (User Node Progress State)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Record ID | Active (Mig 001) |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | Associated user | Active (Mig 001) |
| `quest_id` | UUID | NOT NULL, FK → `quests.id` ON DELETE CASCADE | Associated quest | Active (Mig 001) |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT `'locked'`, CHECK IN (`locked`, `available`, `completed`) | 3D Node state | Active (Mig 001) |
| `code_submission`| TEXT | NULL | Last submitted user code | Active (Mig 001) |
| `tests_passed` | INT | NOT NULL, DEFAULT 0 | Number of test cases passed | Active (Mig 001) |
| `total_tests` | INT | NOT NULL, DEFAULT 0 | Total test cases in test suite | Active (Mig 001) |
| `completed_at` | TIMESTAMPTZ | NULL | Timestamp of quest victory | Active (Mig 001) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Record created timestamp | Active (Mig 001) |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Last attempt timestamp | Active (Mig 001) |
| *Constraint* | UNIQUE(`user_id`, `quest_id`) | | One state record per user per quest | Active (Mig 001) |

#### `vocabularies` (Multi-Country Workplace Vocabulary Bank)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Vocabulary ID | Active (Mig 001) |
| `country_id` | VARCHAR(2) | NOT NULL, FK → `countries.code` ON DELETE CASCADE | Target country (`JP`, `DE`, `SG`) | Active (Mig 001) |
| `term` | VARCHAR(100)| NOT NULL | Term in native script (Kanji, German, etc.) | Active (Mig 001) |
| `reading` | VARCHAR(150)| NOT NULL | Pronunciation guide (Romaji / Phonetic) | Active (Mig 001) |
| `meaning` | VARCHAR(255)| NOT NULL | Indonesian translation & office context | Active (Mig 001) |
| `category` | VARCHAR(100)| NOT NULL | Category (`greetings`, `courtesy`, `office_basics`, etc.) | Active (Mig 001) |
| `audio_url` | VARCHAR(255)| NULL | Structured static audio path (`/audio/vocab/jp/n5/...`) | Active (Mig 001) |
| `example_sentence` | TEXT | NOT NULL | Natural workplace sentence in target language | Active (Mig 001) |
| `example_translation` | TEXT | NOT NULL | Indonesian translation of example sentence | Active (Mig 001) |
| `difficulty_level` | VARCHAR(20) | NOT NULL, DEFAULT `'A1'` | Level (`N5`-`N1` for JP, `A1`-`C2` for DE/SG) | Active (Mig 001) |
| `position` | INT | NOT NULL, DEFAULT 0 | Sequence display position | Active (Mig 001) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Timestamp | Active (Mig 001) |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Timestamp | Active (Mig 001) |
| *Index* | (`country_id`, `category`) | | Composite index for lightning-fast localized filtering | Active (Mig 001) |

---

## ⚠️ 3. Deprecated & Pruned Database Fields & Tables (Audit Findings)

Berdasarkan audit statis di seluruh kode Go dan React, item-item berikut telah **resmi dipangkas dari spesifikasi**:

| Table / Field | Migration Source | Alasan Pemangkasan | Status |
| :--- | :--- | :--- | :--- |
| **`achievements`** (table) | Mig 000001 | Digantikan oleh `user_badges` di Mig 000007. **0 query di Go & TS**. | ❌ Pruned |
| **`user_achievements`** (table)| Mig 000001 | Digantikan oleh `user_badges` di Mig 000007. **0 query di Go & TS**. | ❌ Pruned |
| **`xp_logs`** (table) | Mig 000001 | Digantikan oleh `user_activity_logs` di Mig 000006. **0 query di Go & TS**. | ❌ Pruned |
| **`coaching_submissions`** (table) | Mig 000007 | Black-hole table (hanya INSERT, 0 query SELECT di backend & 0 halaman di frontend). Item career coaching dipangkas agar inventory fokus ke game consumable. | ❌ Pruned |
| `user_profiles.github_url` | Mig 000001 | Tidak ada input di settings/onboarding (100% dead data). | ❌ Pruned |
| `user_profiles.linkedin_url` | Mig 000001 | Tidak pernah diinput atau dirender di UI mana pun (100% dead data). | ❌ Pruned |
| `user_profiles.avatar_url` | Mig 000001 | UI menghasilkan SVG avatar secara dinamis via DiceBear dari username. | ❌ Pruned |
| `user_profiles.target_timeline`| Mig 000003 | Input di onboarding, namun tidak pernah dipakai di filter/rekomendasi mana pun. | ❌ Pruned |
| `user_profiles.language_level` | Mig 000003 | Input di onboarding, namun tidak pernah dipakai di logika materi/quest. | ❌ Pruned |
| `countries.visa_info` | Mig 000001 | Disederhanakan. Data disimpan tapi tidak pernah dirender di frontend. | ❌ Pruned |
| `countries.salary_range` | Mig 000001 | Disederhanakan. Data disimpan tapi tidak pernah dirender di frontend. | ❌ Pruned |
| `countries.work_culture` | Mig 000001 | Disederhanakan. Data disimpan tapi tidak pernah dirender di frontend. | ❌ Pruned |
| `quests.resource_url` | Mig 000001 | Usang. Semua quest sekarang in-browser Monaco, bukan link luar. | ❌ Pruned |
| `quests.prerequisites` | Mig 000001 | Tidak pernah di-SELECT dalam query. Progresi diatur sekuensial by chapter. | ❌ Pruned |
| **`roadmaps`** (table) | Mig 000004 | Relasi 1-to-1 kaku dengan `career_paths` (title/description duplikat). `stations` kini langsung FK ke `career_paths`, hemat 1 tabel & 1 JOIN. | ❌ Pruned |
| **`shop_items`** (table) | Draft ERD (tidak pernah di-migrate) | Hanya 2 item statis yang harga/efeknya di-hardcode di Go & React. `item_id` cukup application-level enum. | ❌ Pruned |
| `quests.career_path_id` | Mig 000001 | Redundan: sudah tercakup via chapter ➔ station ➔ career_path. 0 query di Go. | ❌ Pruned |
| `quests.country_id` | Mig 000001 | Dead: materi tidak pernah difilter per negara. 0 query di Go & TS. | ❌ Pruned |
| `vocabularies.career_path_id` | Mig 000005 | Dead: seluruh nilai NULL, kosakata bersifat universal untuk semua track. | ❌ Pruned |
| `user_badges.title` / `description` / `icon` | Mig 000007 | Teks identik diulang per user. Cukup `badge_key`, sisanya di-resolve di kode. | ❌ Pruned |

---

## 📊 4. DBML Script (dbdiagram.io)

Copy-paste kode DBML berikut langsung ke **[dbdiagram.io](https://dbdiagram.io)** untuk memvisualisasikan diagram interaktif relasi database CodeAbroad:

```dbml
// ============================================================================
// CodeAbroad ERD (Database Markup Language - dbdiagram.io)
// Version: 2.1 (The 3-Pillar Normalized Architecture)
// Paste this directly into https://dbdiagram.io
// ============================================================================

Project CodeAbroad {
  database_type: 'PostgreSQL'
  Note: '''
    # CodeAbroad Database Schema (v2.1)
    Gamified IT learning platform for Indonesian developers targeting global tech careers.
    Architecture: Clean Modular Architecture with The 3-Pillar Normalized Identity:
      - Pillar 1: users (Auth Core)
      - Pillar 2: user_profiles (Public Profile & Career Goals)
      - Pillar 3: user_gamification (Game Loop & Stats)
  '''
}

// ----------------------------------------------------------------------------
// 1. IDENTITY & AUTHENTICATION (Pillar 1: Auth Core)
// ----------------------------------------------------------------------------
Table users {
  id uuid [pk, default: `gen_random_uuid()`]
  email varchar(255) [unique, not null]
  password_hash varchar(255) [not null]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]

  Note: 'Pure credentials table. Zero data leak. Stripped of profile and gamification.'
}

// ----------------------------------------------------------------------------
// 2. PROFILE & CAREER TARGET (Pillar 2: Application Profile)
// ----------------------------------------------------------------------------
Table user_profiles {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [unique, not null]
  name varchar(100) [not null]
  username varchar(50) [unique, not null]
  bio text
  career_path_id uuid
  country_id varchar(2)
  tech_stack_id uuid
  is_onboarded boolean [not null, default: false]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]

  Note: 'Clean public profile and career onboarding goals.'
}

// ----------------------------------------------------------------------------
// 3. GAMIFICATION & INVENTORY (Pillar 3: High-Concurrency Game Loop)
// ----------------------------------------------------------------------------
Table user_gamification {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [unique, not null]
  xp integer [not null, default: 0]
  current_level integer [not null, default: 1]
  streak integer [not null, default: 0]
  gems integer [not null, default: 0]
  last_active_at timestamptz
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]

  Note: 'Normalized 1-to-1 table with users for high-concurrency game loop.'
}

Table user_inventories {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  item_id varchar(50) [not null, note: 'App-level enum: streak-freeze, xp-booster']
  quantity integer [not null, default: 0]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (user_id, item_id) [unique]
  }
}

Table user_badges {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  badge_key varchar(100) [not null, note: 'Title, description & icon resolved in application code by badge_key']
  awarded_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (user_id, badge_key) [unique]
  }
}

Table user_daily_chest_claims {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  claim_date date [not null]
  tier integer [not null, note: 'CHECK IN (1, 2, 3)']
  gems_awarded integer [not null]
  xp_awarded integer [not null]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (user_id, claim_date, tier) [unique]
  }
}

Table user_activity_logs {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  activity_type varchar(50) [not null, note: 'CHECK IN (daily_login, quest_completed, daily_vocab_quest_claim, daily_golden_chest_claim)']
  xp_earned integer [not null, default: 0]
  metadata jsonb
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (user_id, created_at) [name: 'idx_activity_user_created']
  }
}

// ----------------------------------------------------------------------------
// 4. TARGET DESTINATIONS & CAREER PATHS
// ----------------------------------------------------------------------------
Table countries {
  code varchar(2) [pk, note: 'JP, DE, SG']
  name varchar(100) [not null]
  is_active boolean [not null, default: true]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

Table career_paths {
  id uuid [pk, default: `gen_random_uuid()`]
  slug varchar(50) [unique, not null, note: 'backend, frontend, devops, fullstack']
  label varchar(100) [not null]
  description text
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

Table tech_stacks {
  id uuid [pk, default: `gen_random_uuid()`]
  career_path_id uuid [null, note: 'NULL for universal foundations (HTML/CSS, CS fundamentals)']
  slug varchar(50) [unique, not null, note: 'golang, react, devops_aws, web_fundamental']
  label varchar(100) [not null]
  badge varchar(50)
  is_active boolean [not null, default: true]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

// ----------------------------------------------------------------------------
// 5. CURRICULUM & INTERACTIVE WORKSPACE
// ----------------------------------------------------------------------------
Table modules {
  id uuid [pk, default: `gen_random_uuid()`]
  tech_stack_id uuid [not null]
  module_number int [not null]
  title varchar(255) [not null]
  description text
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (tech_stack_id, module_number) [unique]
  }
}

Table chapters {
  id uuid [pk, default: `gen_random_uuid()`]
  module_id uuid [not null]
  chapter_number int [not null]
  title varchar(255) [not null]
  description text
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (module_id, chapter_number) [unique]
  }
}

Table quests {
  id uuid [pk, default: `gen_random_uuid()`]
  chapter_id uuid [not null]
  title varchar(255) [not null]
  description text
  type varchar(50) [not null, note: 'CHECK IN (main, boss, daily)']
  format varchar(50) [not null, note: 'CHECK IN (code, quiz, fill_blank)']
  difficulty varchar(20) [not null, default: 'easy', note: 'CHECK IN (easy, medium, hard)']
  xp_reward integer [not null, default: 10]
  gems_reward integer [not null, default: 5]
  estimated_minutes integer [not null, default: 5]
  order_index integer [not null]
  starter_code text
  test_suite jsonb
  solution_code text
  quiz_data jsonb
  hints jsonb
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (chapter_id, order_index) [unique]
  }
}

Table user_quests {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  quest_id uuid [not null]
  status varchar(20) [not null, default: 'locked', note: 'CHECK IN (locked, available, completed)']
  code_submission text
  tests_passed int [default: 0]
  total_tests int [default: 0]
  completed_at timestamptz
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (user_id, quest_id) [unique]
  }
}

Table vocabularies {
  id uuid [pk, default: `gen_random_uuid()`]
  country_id varchar(2) [not null, note: 'FK -> countries.code (JP, DE, SG)']
  term varchar(100) [not null]
  reading varchar(150) [not null]
  meaning varchar(255) [not null]
  category varchar(100) [not null]
  audio_url varchar(255)
  example_sentence text [not null]
  example_translation text [not null]
  difficulty_level varchar(20) [not null, default: 'A1', note: 'N5-N1 (JP) / A1-C2 (DE/SG)']
  position int [not null, default: 0]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (country_id, category) [name: 'idx_vocab_country_cat']
  }
}

// ----------------------------------------------------------------------------
// RELATIONSHIPS & CARDINALITIES
// ----------------------------------------------------------------------------
Ref: user_profiles.user_id - users.id [delete: cascade] // 1-to-1 Normalized (Pillar 2)
Ref: user_gamification.user_id - users.id [delete: cascade] // 1-to-1 Normalized (Pillar 3)
Ref: user_inventories.user_id > users.id [delete: cascade]
Ref: user_badges.user_id > users.id [delete: cascade]
Ref: user_daily_chest_claims.user_id > users.id [delete: cascade]
Ref: user_activity_logs.user_id > users.id [delete: cascade]

Ref: user_profiles.country_id > countries.code [delete: set null]
Ref: user_profiles.career_path_id > career_paths.id [delete: set null]
Ref: user_profiles.tech_stack_id > tech_stacks.id [delete: set null]

Ref: tech_stacks.career_path_id > career_paths.id [delete: set null]
Ref: modules.tech_stack_id > tech_stacks.id [delete: cascade]
Ref: chapters.module_id > modules.id [delete: cascade]
Ref: quests.chapter_id > chapters.id [delete: cascade]

Ref: user_quests.user_id > users.id [delete: cascade]
Ref: user_quests.quest_id > quests.id [delete: cascade]

Ref: vocabularies.country_id > countries.code [delete: cascade]

```
