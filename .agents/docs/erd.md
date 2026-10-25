# Entity Relationship Diagram (ERD) - CodeAbroad
**Version:** 2.1 (The 3-Pillar Normalized Architecture)  
**Last Updated:** 2026-10-25  
**Database:** PostgreSQL 16 (`pgcrypto`)  

---

## 🗺️ 1. Conceptual Architecture & Bounded Contexts

CodeAbroad mengadopsi **The 3-Pillar Architecture** memisahkan kredensial login (Auth Core), profil publik & target karir (Profile Domain), serta mesin progresi gamifikasi (Gamification Engine):

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
│  Socials, Career Targets) │      │ Last Active At)           │ │                             │
└───────────────────────────┘      └───────────────────────────┘ └─────────────────────────────┘
              │                                  │                       │
              ├──────────────────────────────────┴───────────────────────┘
              ▼
┌───────────────────────────┐      ┌───────────────────────────┐ ┌─────────────────────────────┐
│    user_activity_logs     │      │    daily_chest_claims     │ │    coaching_submissions   │
│ (Daily presence, 7-day)   │      │ (Golden Chest Claims)     │ │ (CV Review, Mock Interview) │
└───────────────────────────┘      └───────────────────────────┘ └─────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    CURRICULUM & INTERACTIVE WORKSPACE                  │
│  career_paths ──> roadmaps ──> stations ──> chapters ──> quests        │
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
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Unique profile ID | Target Mig 009 |
| `user_id` | UUID | UNIQUE, NOT NULL, FK → `users.id` ON DELETE CASCADE | Associated user ID | Target Mig 009 |
| `name` | VARCHAR(100) | NOT NULL | User's full name | Target Mig 009 |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Unique platform username | Target Mig 009 |
| `bio` | TEXT | NULL | Short developer bio | Target Mig 009 |
| `career_path_id`| UUID | FK → `career_paths.id`, NULL | Selected target career path | Target Mig 009 |
| `country_id` | UUID | FK → `countries.id`, NULL | Selected target country (JP, DE, SG) | Target Mig 009 |
| `primary_stack` | VARCHAR(50) | NULL | Main programming stack (golang, react) | Target Mig 009 |
| `level` | VARCHAR(20) | DEFAULT 'beginner' | Self-assessed onboarding level | Target Mig 009 |
| `is_onboarded` | BOOLEAN | NOT NULL, DEFAULT FALSE | Onboarding completion flag | Target Mig 009 |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Profile creation timestamp | Target Mig 009 |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Profile update timestamp | Target Mig 009 |

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

#### `user_inventories` (Akihabara Arcade Shop Items)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Inventory item record ID |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | Item owner |
| `item_id` | VARCHAR(50) | NOT NULL (`streak-freeze`, `xp-booster`, `cv-review`, `mock-interview`) | Purchased item SKU |
| `quantity` | INTEGER | NOT NULL, DEFAULT 0 | Quantity remaining |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Purchase timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Consumption timestamp |
| *Index* | UNIQUE(`user_id`, `item_id`) | | One row per item SKU per user |

#### `user_badges` (Monthly Milestones & Badges)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Badge award ID |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | Badge recipient |
| `badge_key` | VARCHAR(100)| NOT NULL | Unique badge identifier |
| `title` | VARCHAR(200)| NOT NULL | Display badge title |
| `description` | TEXT | NULL | Badge achievement narrative |
| `icon` | VARCHAR(50) | NULL | Icon identifier |
| `awarded_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Award timestamp |

#### `daily_chest_claims` (Golden Chest Milestone Rewards)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Claim ID |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | Claimant user |
| `claim_date` | VARCHAR(10) | NOT NULL (YYYY-MM-DD) | Date of claim |
| `tier` | INTEGER | NOT NULL (1, 2, or 3) | Chest tier milestone |
| `gems_awarded` | INTEGER | NOT NULL | Gems received |
| `xp_awarded` | INTEGER | NOT NULL | XP received |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Timestamp |

#### `user_activity_logs` (Daily Tracking & 7-Day History)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Activity entry ID |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | User ID |
| `activity_type` | VARCHAR(50) | NOT NULL (`daily_login`, `quest_completed`, `daily_vocab_quest_claim`, `daily_golden_chest_claim`) | Activity type |
| `xp_earned` | INTEGER | NOT NULL, DEFAULT 0 | XP awarded |
| `metadata` | JSONB | NULL | Dynamic context (dates, details) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Log timestamp |

---

### 2.4 Curriculum, Roadmap & Workspace Domain

#### `countries`
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Country ID | Active |
| `code` | VARCHAR(10) | UNIQUE, NOT NULL | Country code (JP, DE, SG) | Active |
| `name` | VARCHAR(100)| NOT NULL | Country name | Active |
| `flag_emoji` | VARCHAR(10) | NOT NULL | Emoji icon (🇯🇵, 🇩🇪, 🇸🇬) | Active |
| `badge` | VARCHAR(50) | NULL | Display badge text | Active |
| `is_active` | BOOLEAN | DEFAULT TRUE | Availability status | Active |

#### `career_paths`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Career path ID |
| `slug` | VARCHAR(50) | UNIQUE, NOT NULL | Path slug (frontend, backend, devops) |
| `label` | VARCHAR(100)| NOT NULL | Display title |
| `description` | TEXT | NULL | Path summary |
| `stacks` | JSONB | NULL | Available tech stacks |

#### `roadmaps` ➔ `stations` ➔ `chapters` ➔ `quests`
| Table | Key Columns | Description |
| :--- | :--- | :--- |
| **`roadmaps`** | `id`, `career_path_id` (FK), `title`, `is_active` | Root learning track per career path |
| **`stations`** | `id`, `roadmap_id` (FK), `station_number`, `title`, `chip_label` | High-level curriculum station / unit |
| **`chapters`** | `id`, `station_id` (FK), `chapter_number`, `title` | Sub-chapter within a station |
| **`quests`** | `id`, `chapter_id` (FK), `title`, `description`, `xp_reward`, `estimated_minutes`, `story_context`, `nihongo_notes`, `acceptance_criteria`, `starter_code`, `test_suite` | Interactive coding challenge / lesson |
| **`user_quests`** | `id`, `user_id` (FK), `quest_id` (FK), `status` (locked/available/completed), `code_submission`, `tests_passed`, `total_tests`, `completed_at` | User progress and code submissions |

#### `vocabularies` (Tokyo Office Vocab Bank)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, gen_random_uuid() | Vocab ID |
| `career_path_id`| UUID | FK → `career_paths.id`, NULL | Optional role association |
| `term` | VARCHAR(100)| NOT NULL | Japanese term in Kanji/Katakana |
| `reading` | VARCHAR(150)| NOT NULL | Romaji / Hiragana pronunciation |
| `meaning` | VARCHAR(255)| NOT NULL | Indonesian translation |
| `category` | VARCHAR(100)| NOT NULL | Category (Etika Kantor, Git, Code Review) |
| `example_ja` | TEXT | NOT NULL | Japanese usage example |
| `example_id` | TEXT | NOT NULL | Indonesian translation of example |
| `difficulty_level`| VARCHAR(20) | DEFAULT 'N3' | JLPT difficulty level (N5 - N2) |
| `order_index` | INT | DEFAULT 0 | Display sequence order |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp |

---

## ⚠️ 3. Deprecated & Pruned Database Fields & Tables (Audit Findings)

Berdasarkan audit statis di seluruh kode Go dan React, item-item berikut telah **resmi dipangkas dari spesifikasi**:

| Table / Field | Migration Source | Alasan Pemangkasan | Status |
| :--- | :--- | :--- | :--- |
| **`achievements`** (table) | Mig 000001 | Digantikan oleh `user_badges` di Mig 000007. **0 query di Go & TS**. | ❌ Pruned |
| **`user_achievements`** (table)| Mig 000001 | Digantikan oleh `user_badges` di Mig 000007. **0 query di Go & TS**. | ❌ Pruned |
| **`xp_logs`** (table) | Mig 000001 | Digantikan oleh `user_activity_logs` di Mig 000006. **0 query di Go & TS**. | ❌ Pruned |
| `user_profiles.github_url` | Mig 000001 | Tidak ada input di settings/onboarding. Cukup disimpan di `coaching_submissions`. | ❌ Pruned |
| `user_profiles.linkedin_url` | Mig 000001 | Tidak pernah diinput atau dirender di UI mana pun (100% dead data). | ❌ Pruned |
| `user_profiles.avatar_url` | Mig 000001 | UI menghasilkan SVG avatar secara dinamis via DiceBear dari username. | ❌ Pruned |
| `user_profiles.target_timeline`| Mig 000003 | Input di onboarding, namun tidak pernah dipakai di filter/rekomendasi mana pun. | ❌ Pruned |
| `user_profiles.language_level` | Mig 000003 | Input di onboarding, namun tidak pernah dipakai di logika materi/quest. | ❌ Pruned |
| `countries.visa_info` | Mig 000001 | Disederhanakan. Data disimpan tapi tidak pernah dirender di frontend. | ❌ Pruned |
| `countries.salary_range` | Mig 000001 | Disederhanakan. Data disimpan tapi tidak pernah dirender di frontend. | ❌ Pruned |
| `countries.work_culture` | Mig 000001 | Disederhanakan. Data disimpan tapi tidak pernah dirender di frontend. | ❌ Pruned |
| `quests.resource_url` | Mig 000001 | Usang. Semua quest sekarang in-browser Monaco, bukan link luar. | ❌ Pruned |
| `quests.prerequisites` | Mig 000001 | Tidak pernah di-SELECT dalam query. Progresi diatur sekuensial by chapter. | ❌ Pruned |

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
  country_id uuid
  primary_stack varchar(50)
  level varchar(20) [default: 'beginner']
  is_onboarded boolean [not null, default: false]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]

  Note: 'Clean public profile and career onboarding goals. Pruned of dead URLs and unused levels.'
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
  item_id varchar(50) [not null, note: 'streak-freeze, xp-booster, cv-review, mock-interview']
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
  badge_key varchar(100) [not null]
  title varchar(200) [not null]
  description text
  icon varchar(50)
  awarded_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

Table daily_chest_claims {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  claim_date varchar(10) [not null, note: 'YYYY-MM-DD']
  tier integer [not null, note: '1, 2, or 3']
  gems_awarded integer [not null]
  xp_awarded integer [not null]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

Table user_activity_logs {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  activity_type varchar(50) [not null, note: 'daily_login, quest_completed, daily_golden_chest_claim']
  xp_earned integer [not null, default: 0]
  metadata jsonb
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

Table coaching_submissions {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  type varchar(50) [not null, note: 'cv-review or mock-interview']
  target_role varchar(100)
  github_url varchar(255)
  resume_url varchar(255)
  discord_handle varchar(100)
  interview_language varchar(50)
  focus_topic text
  preferred_time varchar(100)
  notes text
  status varchar(50) [not null, default: 'in_review']
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

// ----------------------------------------------------------------------------
// 3. TARGET DESTINATIONS & CAREER PATHS
// ----------------------------------------------------------------------------
Table countries {
  id uuid [pk, default: `gen_random_uuid()`]
  code varchar(10) [unique, not null, note: 'JP, DE, SG']
  name varchar(100) [not null]
  flag_emoji varchar(10) [not null]
  badge varchar(50)
  is_active boolean [default: true]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

Table career_paths {
  id uuid [pk, default: `gen_random_uuid()`]
  slug varchar(50) [unique, not null, note: 'frontend, backend, devops']
  label varchar(100) [not null]
  description text
  stacks jsonb
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

// ----------------------------------------------------------------------------
// 4. CURRICULUM ROADMAP & WORKSPACE LESSONS
// ----------------------------------------------------------------------------
Table roadmaps {
  id uuid [pk, default: `gen_random_uuid()`]
  career_path_id uuid [unique, not null]
  title varchar(255) [not null]
  description text
  is_active boolean [not null, default: true]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

Table stations {
  id uuid [pk, default: `gen_random_uuid()`]
  roadmap_id uuid [not null]
  station_number int [not null]
  title varchar(255) [not null]
  chip_label varchar(50) [not null]
  description text
  order_index int [not null]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (roadmap_id, station_number) [unique]
  }
}

Table chapters {
  id uuid [pk, default: `gen_random_uuid()`]
  station_id uuid [not null]
  chapter_number int [not null]
  title varchar(255) [not null]
  description text
  order_index int [not null]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (station_id, chapter_number) [unique]
  }
}

Table quests {
  id uuid [pk, default: `gen_random_uuid()`]
  chapter_id uuid
  career_path_id uuid
  country_id uuid
  title varchar(255) [not null]
  description text
  type varchar(20) [not null, note: 'main, side, daily']
  difficulty varchar(20) [not null, default: 'beginner']
  xp_reward integer [not null, default: 50]
  estimated_minutes integer [not null, default: 30]
  chip_label varchar(50)
  story_context text
  nihongo_notes jsonb
  acceptance_criteria jsonb
  starter_code jsonb
  test_suite jsonb
  order_index integer [not null, default: 0]
  is_active boolean [not null, default: true]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

Table user_quests {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  quest_id uuid [not null]
  status varchar(20) [not null, note: 'locked, available, completed']
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
  career_path_id uuid
  term varchar(100) [not null]
  reading varchar(150) [not null]
  meaning varchar(255) [not null]
  category varchar(100) [not null]
  example_ja text [not null]
  example_id text [not null]
  difficulty_level varchar(20) [default: 'N3']
  order_index int [default: 0]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

// ----------------------------------------------------------------------------
// RELATIONSHIPS & CARDINALITIES
// ----------------------------------------------------------------------------
Ref: user_profiles.user_id - users.id [delete: cascade] // 1-to-1 Normalized (Pillar 2)
Ref: user_gamification.user_id - users.id [delete: cascade] // 1-to-1 Normalized (Pillar 3)
Ref: user_inventories.user_id > users.id [delete: cascade]
Ref: user_badges.user_id > users.id [delete: cascade]
Ref: daily_chest_claims.user_id > users.id [delete: cascade]
Ref: user_activity_logs.user_id > users.id [delete: cascade]
Ref: coaching_submissions.user_id > users.id [delete: cascade]

Ref: user_profiles.country_id > countries.id [delete: set null]
Ref: user_profiles.career_path_id > career_paths.id [delete: set null]

Ref: roadmaps.career_path_id - career_paths.id [delete: cascade]
Ref: stations.roadmap_id > roadmaps.id [delete: cascade]
Ref: chapters.station_id > stations.id [delete: cascade]
Ref: quests.chapter_id > chapters.id [delete: set null]
Ref: quests.career_path_id > career_paths.id [delete: cascade]
Ref: quests.country_id > countries.id [delete: set null]

Ref: user_quests.user_id > users.id [delete: cascade]
Ref: user_quests.quest_id > quests.id [delete: cascade]

Ref: vocabularies.career_path_id > career_paths.id [delete: set null]
```
