# Entity Relationship Diagram (ERD) - CodeAbroad
**Version:** 3.0 (Global Language Mastery Platform, Anki SRS & Diagnostic Exam Engine)  
**Last Updated:** 2026-11-09  
**Database:** PostgreSQL 16 (`pgcrypto`)  

---

## 🗺️ 1. Conceptual Architecture & Bounded Contexts

CodeAbroad mengadopsi arsitektur modular yang memadukan **Core Identity & Gamification Engine** dengan **Universal Language Mastery Engine** (Jepang 🇯🇵, Inggris 🇬🇧/🇺🇸, Jerman 🇩🇪, Mandarin 🇨🇳, Prancis 🇫🇷). Sistem mencakup 4 pilar kemampuan (*Reading, Listening, Writing, Speaking*), bank tata bahasa & konjugasi ternormalisasi, evaluasi cerdas multi-aksara, pengulangan berjarak (Anki SRS SM-2), serta simulasi ujian kesiapan (Mock Exam):

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
│  Target Country/Language) │      │ Last Active At)           │ │                             │
└─────────────┬─────────────┘      └───────────────────────────┘ └─────────────────────────────┘
              │                                  │                       │
              ├──────────────────────────────────┴───────────────────────┘
              ▼
┌───────────────────────────┐      ┌───────────────────────────┐
│    user_activity_logs     │      │  user_daily_chest_claims  │
│ (Daily presence, 7-day)   │      │ (Golden Chest Claims)     │
└───────────────────────────┘      └───────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│               UNIVERSAL LANGUAGE CURRICULUM & 4-PILLAR ENGINE          │
│                                                                        │
│   languages ──(1:N)──> proficiency_levels (JLPT N5-N1, CEFR A1-C1)     │
│                               │                                        │
│            ┌──────────────────┴──────────────────┐                     │
│            ▼                                     ▼                     │
│     grammar_points                             units                   │
│   (tenses, particles,                   (curriculum / mock)            │
│    conjugations)                                 │                     │
│            │                                     ▼                     │
│            │                                  lessons                  │
│            │                                     │                     │
│            └──────────────────┬──────────────────┘                     │
│                               ▼                                        │
│                           exercises                                    │
│            (Reading, Listening, Writing, Speaking)                     │
│            (Content, Rubric, Multi-Script Alternatives)                │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│             USER PROGRESS, ANKI SRS & READINESS DIAGNOSTICS            │
│                                                                        │
│  users ──(1:N)──> user_language_enrollments (Active study languages)   │
│  users ──(1:N)──> user_lesson_progress      (Node completion & score)  │
│  users ──(1:N)──> user_exercise_attempts    (Item-level attempt log)   │
│  users ──(1:N)──> user_srs_reviews          (Anki SM-2 Spaced Memory)  │
│  users ──(1:N)──> readiness_exam_attempts   (Mock Exam 4-Pillar Score) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ 2. Detailed Table Specifications

### 2.1 Identity & Authentication Domain (Pillar 1: Auth Core)

#### `users` (Core Account Entity - Zero Data Leak)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Unique identifier | Active |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email address | Active |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password | Active |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Registration timestamp | Active |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Account update timestamp | Active |

---

### 2.2 Profile Domain (Pillar 2: Application Profile)

#### `user_profiles` (1-to-1 with `users`)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Unique profile ID | Active |
| `user_id` | UUID | UNIQUE, NOT NULL, FK → `users.id` ON DELETE CASCADE | Associated user ID | Active |
| `name` | VARCHAR(100) | NOT NULL | User's full name | Active |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Unique platform username | Active |
| `bio` | TEXT | NULL | Short bio | Active |
| `is_onboarded` | BOOLEAN | NOT NULL, DEFAULT FALSE | Onboarding completion flag | Active |
| `daily_goal_minutes` | INTEGER | NOT NULL, DEFAULT 15, CHECK (`daily_goal_minutes` IN (5, 15, 30, 45)) | Target komitmen belajar harian dari Onboarding | Active |
| `preferred_roadmap_view` | VARCHAR(20) | NOT NULL, DEFAULT 'map', CHECK (`preferred_roadmap_view` IN ('map', 'syllabus')) | Persisted curriculum view preference across devices | Active |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Profile creation timestamp | Active |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Profile update timestamp | Active |

---

### 2.3 Gamification & Progression Domain (Pillar 3: High-Concurrency Game Loop)

#### `user_gamification` (1-to-1 with `users`)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Unique gamification record ID | Active |
| `user_id` | UUID | UNIQUE, NOT NULL, FK → `users.id` ON DELETE CASCADE | Associated user ID | Active |
| `xp` | INTEGER | NOT NULL, DEFAULT 0 | Cumulative Experience Points | Active |
| `current_level`| INTEGER | NOT NULL, DEFAULT 1 | Current gamified level (1–50) | Active |
| `streak` | INTEGER | NOT NULL, DEFAULT 0 | Current consecutive active days | Active |
| `gems` | INTEGER | NOT NULL, DEFAULT 0 | Virtual currency balance (Blue Gems) | Active |
| `last_active_at`| TIMESTAMPTZ | NULL | Timestamp of last user activity | Active |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp | Active |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Last stats update timestamp | Active |

#### `badge_definitions` (Master Badge Catalog)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(100)| PRIMARY KEY | Unique badge SKU (e.g. `first_step`, `streak_7`) |
| `title` | VARCHAR(100)| NOT NULL | Display title (e.g. "Langkah Pertama") |
| `description` | TEXT | NOT NULL | Milestone description |
| `category` | VARCHAR(50) | NOT NULL | Category: `milestone`, `streak`, `srs`, `mastery` |
| `icon` | VARCHAR(100)| NULL | Icon identifier or vector asset name |
| `xp_reward` | INTEGER | NOT NULL, DEFAULT 50 | XP awarded on achievement claim |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### `shop_items` (Master Shop Catalog)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(50) | PRIMARY KEY | Unique item SKU (e.g. `streak-freeze`, `xp-booster`) |
| `title` | VARCHAR(100)| NOT NULL | Item name |
| `subtitle` | TEXT | NOT NULL | Item utility description |
| `price_gems` | INTEGER | NOT NULL | Price in virtual blue gems |
| `category` | VARCHAR(50) | NOT NULL | Category: `protection`, `booster`, `career` |
| `badge` | VARCHAR(50) | NULL | Promotion badge (e.g. "POPULER 🔥") |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Availability status in game shop |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### `user_inventories` (Player Bag / Consumables)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Inventory record ID |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | Item owner |
| `item_id` | VARCHAR(50) | NOT NULL, FK → `shop_items.id` ON DELETE CASCADE | Purchased item SKU |
| `quantity` | INTEGER | NOT NULL, DEFAULT 0 | Quantity remaining |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Purchase timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Consumption timestamp |
| *Index* | UNIQUE(`user_id`, `item_id`) | | One row per SKU per user |

#### `user_badges` (Milestones & Achievements)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Badge award ID |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | Badge recipient |
| `badge_key` | VARCHAR(100)| NOT NULL, FK → `badge_definitions.id` ON DELETE CASCADE | Unique badge identifier |
| `awarded_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Award timestamp |
| *Index* | UNIQUE(`user_id`, `badge_key`) | | One award per badge per user |

#### `user_daily_chest_claims` (Milestone Chest Claims)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Claim ID |
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
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Activity entry ID |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | User ID |
| `activity_type` | VARCHAR(50) | NOT NULL, CHECK IN (`daily_login`, `lesson_completed`, `srs_review_completed`, `readiness_exam_completed`, `daily_golden_chest_claim`) | Activity type |
| `xp_earned` | INTEGER | NOT NULL, DEFAULT 0 | XP awarded |
| `metadata` | JSONB | NULL | Dynamic context (dates, details) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Log timestamp |
| *Index* | (`user_id`, `created_at`) | | Fast 7-day calendar & streak queries |

---

### 2.4 Universal Language Curriculum Domain

#### `languages` (Multi-Language Master)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Language ID | Planned v3.0 |
| `code` | VARCHAR(10) | UNIQUE, NOT NULL | ISO Code (`ja`, `en-us`, `en-gb`, `de`, `zh`, `fr`) | Planned v3.0 |
| `name` | VARCHAR(50) | NOT NULL | Display name (`Jepang`, `Jerman`, `Inggris`) | Planned v3.0 |
| `supported_scripts` | JSONB | NOT NULL | Array of writing systems: `["kanji", "hiragana", "katakana", "romaji"]` | Planned v3.0 |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT FALSE | Availability flag | Planned v3.0 |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp | Planned v3.0 |

#### `proficiency_levels` (International Standard Proficiency Levels)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Level ID | Planned v3.0 |
| `language_id` | UUID | NOT NULL, FK → `languages.id` ON DELETE CASCADE | Parent language | Planned v3.0 |
| `code` | VARCHAR(10) | NOT NULL | Level code (`N5`, `N4`, `A1`, `B2`, `HSK1`) | Planned v3.0 |
| `name` | VARCHAR(50) | NOT NULL | Level name (`JLPT N5`, `CEFR B2`, `HSK 3`) | Planned v3.0 |
| `tier` | VARCHAR(20) | NOT NULL, DEFAULT `'beginner'`, CHECK IN (`beginner`, `intermediate`, `advanced`) | Kemahiran umum: Pemula (N5/A1), Menengah (N3/B1), Mahir (N1/C1) | Planned v3.0 |
| `official_exam_name` | VARCHAR(50)| NOT NULL | Official exam title (`JLPT`, `IELTS`, `Goethe`) | Planned v3.0 |
| `passing_score_percent`| INT | NOT NULL, DEFAULT 60 | Passing threshold percentage | Planned v3.0 |
| `order_index` | INT | NOT NULL | Difficulty sequence (1 = beginner, 5 = master) | Planned v3.0 |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp | Planned v3.0 |
| *Constraint* | UNIQUE(`language_id`, `code`) | | Prevent duplicate level codes per language | Planned v3.0 |

#### `grammar_points` (Normalized Grammar & Tenses Engine)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Grammar Point ID | Planned v3.0 |
| `level_id` | UUID | NOT NULL, FK → `proficiency_levels.id` ON DELETE CASCADE | Target proficiency level | Planned v3.0 |
| `code` | VARCHAR(30) | NOT NULL | Unique code (`GP-JA-N5-001`, `GP-DE-A1-004`) | Planned v3.0 |
| `category` | VARCHAR(30) | NOT NULL, CHECK IN (`tense`, `conjugation`, `particle`, `honorific`, `sentence_pattern`) | Grammar category | Planned v3.0 |
| `title` | VARCHAR(100)| NOT NULL | Title (e.g. `Bentuk Lampau Mashita`, `Past Simple`) | Planned v3.0 |
| `formula` | TEXT | NOT NULL | Grammar syntax: `[Root] + ました` | Planned v3.0 |
| `explanation` | TEXT | NOT NULL | Educational explanation & usage rules | Planned v3.0 |
| `order_index` | INT | NOT NULL | Introduction sequence | Planned v3.0 |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp | Planned v3.0 |
| *Constraint* | UNIQUE(`level_id`, `code`) | | Unique code per level | Planned v3.0 |

#### `units` (Curriculum & Mock Exam Units)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Unit ID | Planned v3.0 |
| `level_id` | UUID | NOT NULL, FK → `proficiency_levels.id` ON DELETE CASCADE | Target level | Planned v3.0 |
| `title` | VARCHAR(100)| NOT NULL | Unit title (`Pondasi Kalimat & Diri`) | Planned v3.0 |
| `description` | TEXT | NULL | Unit synopsis & pedagogical goals | Planned v3.0 |
| `unit_type` | VARCHAR(20) | NOT NULL, DEFAULT `'curriculum'`, CHECK IN (`curriculum`, `diagnostic_exam`) | Module type | Planned v3.0 |
| `order_index` | INT | NOT NULL | Roadmap sequential position | Planned v3.0 |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp | Planned v3.0 |

#### `lessons` (Daily Learning Sessions)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Lesson ID | Planned v3.0 |
| `unit_id` | UUID | NOT NULL, FK → `units.id` ON DELETE CASCADE | Parent unit | Planned v3.0 |
| `title` | VARCHAR(100)| NOT NULL | Lesson title (`Mengenalkan Profesi`) | Planned v3.0 |
| `xp_reward` | INT | NOT NULL, DEFAULT 15 | Gamification reward upon completion | Planned v3.0 |
| `order_index` | INT | NOT NULL | Lesson sequence in unit | Planned v3.0 |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp | Planned v3.0 |

#### `exercises` (Interactive 4-Pillar Exercises)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Exercise ID | Planned v3.0 |
| `lesson_id` | UUID | NOT NULL, FK → `lessons.id` ON DELETE CASCADE | Parent lesson | Planned v3.0 |
| `grammar_point_id`| UUID | FK → `grammar_points.id` ON DELETE SET NULL, NULLABLE | Linked grammar point for diagnostic analytics | Planned v3.0 |
| `skill_pillar` | VARCHAR(20) | NOT NULL, CHECK IN (`reading`, `listening`, `writing`, `speaking`) | The 4 Language Pillars | Planned v3.0 |
| `exercise_type` | VARCHAR(30) | NOT NULL, CHECK IN (`sentence_builder`, `fill_blank`, `listening_choice`, `speaking_repeat`, `dialogue_roleplay`) | Exercise widget format | Planned v3.0 |
| `prompt` | TEXT | NOT NULL | Challenge question / instruction | Planned v3.0 |
| `content` | JSONB | NOT NULL | Polymorphic payload (audio URL, furigana, IPA, tokens) | Planned v3.0 |
| `correct_answer` | JSONB | NOT NULL | Primary canonical correct answer | Planned v3.0 |
| `acceptable_answers`| JSONB | NULL | Multi-script valid alternatives (Kanji vs Hiragana vs Romaji) | Planned v3.0 |
| `diagnostic_rubric`| JSONB | NULL | Intelligent error feedback mapping per incorrect option | Planned v3.0 |
| `explanation` | TEXT | NOT NULL | Educational feedback explaining the rule | Planned v3.0 |
| `order_index` | INT | NOT NULL | Question sequence in lesson | Planned v3.0 |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Creation timestamp | Planned v3.0 |

---

### 2.5 User Progress, Anki SRS & Diagnostic Exam Domain

#### `user_language_enrollments` (Multi-Language Study Tracking)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Enrollment ID | Planned v3.0 |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | Enrolled user | Planned v3.0 |
| `language_id` | UUID | NOT NULL, FK → `languages.id` ON DELETE CASCADE | Enrolled language | Planned v3.0 |
| `current_level_id`| UUID | FK → `proficiency_levels.id` ON DELETE SET NULL, NULLABLE | Current active level | Planned v3.0 |
| `initial_placement_type`| VARCHAR(30)| NOT NULL, DEFAULT `'zero_beginner'`, CHECK IN (`zero_beginner`, `placement_test`, `manual_select`) | Jalur penempatan awal pengguna | Planned v3.0 |
| `placement_score_percent`| INT | NULL | Skor hasil placement test jika mengikuti tes | Planned v3.0 |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Active study language flag | Planned v3.0 |
| `enrolled_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Enrollment date | Planned v3.0 |
| *Constraint* | UNIQUE(`user_id`, `language_id`) | | One enrollment per language per user | Planned v3.0 |

#### `user_lesson_progress` (Lesson Node Completion)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Progress ID | Planned v3.0 |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | User ID | Planned v3.0 |
| `lesson_id` | UUID | NOT NULL, FK → `lessons.id` ON DELETE CASCADE | Lesson ID | Planned v3.0 |
| `is_completed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status | Planned v3.0 |
| `score` | INT | NOT NULL, DEFAULT 0 | Score percentage (0–100) | Planned v3.0 |
| `is_skipped` | BOOLEAN | NOT NULL, DEFAULT FALSE | Selesai otomatis via bypass/placement skip level | Planned v3.0 |
| `completed_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Completion timestamp | Planned v3.0 |
| *Constraint* | UNIQUE(`user_id`, `lesson_id`) | | One progress record per user per lesson | Planned v3.0 |

#### `user_exercise_attempts` (Item-Level Attempt Log & Analytics)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Attempt ID | Planned v3.0 |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | User ID | Planned v3.0 |
| `exercise_id` | UUID | NOT NULL, FK → `exercises.id` ON DELETE CASCADE | Exercise ID | Planned v3.0 |
| `is_correct` | BOOLEAN | NOT NULL | Correctness flag | Planned v3.0 |
| `selected_answer`| JSONB | NOT NULL | User's chosen answer or speech transcript | Planned v3.0 |
| `time_spent_seconds`| INT | NOT NULL, DEFAULT 0 | Thinking / answering time | Planned v3.0 |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Attempt timestamp | Planned v3.0 |
| *Index* | (`user_id`, `exercise_id`, `is_correct`) | | Fast query for error pattern analytics | Planned v3.0 |

#### `user_srs_reviews` (Anki Spaced Repetition Engine - SM-2)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Card ID | Planned v3.0 |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | User ID | Planned v3.0 |
| `exercise_id` | UUID | NOT NULL, FK → `exercises.id` ON DELETE CASCADE | Target exercise card | Planned v3.0 |
| `interval_days`| INT | NOT NULL, DEFAULT 1 | SuperMemo SM-2 days until next review | Planned v3.0 |
| `repetition_count`| INT | NOT NULL, DEFAULT 0 | Consecutive successful recalls | Planned v3.0 |
| `ease_factor` | NUMERIC(4,2)| NOT NULL, DEFAULT 2.50 | Memory ease coefficient (lowered on fail) | Planned v3.0 |
| `next_review_at`| TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Due timestamp for daily review | Planned v3.0 |
| `last_reviewed_at`| TIMESTAMPTZ | NULL | Last review timestamp | Planned v3.0 |
| *Constraint* | UNIQUE(`user_id`, `exercise_id`) | | One memory card per user per exercise | Planned v3.0 |
| *Index* | (`user_id`, `next_review_at`) | | Lightning-fast retrieval of today's due cards | Planned v3.0 |

#### `readiness_exam_attempts` (Diagnostic Mock Exam Attempts)
| Column | Type | Constraints | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Mock Exam Attempt ID | Planned v3.0 |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | Candidate user | Planned v3.0 |
| `level_id` | UUID | NOT NULL, FK → `proficiency_levels.id` ON DELETE CASCADE | Target official exam level | Planned v3.0 |
| `reading_score` | INT | NOT NULL | Reading pillar score (0–100) | Planned v3.0 |
| `listening_score`| INT | NOT NULL | Listening pillar score (0–100) | Planned v3.0 |
| `writing_score` | INT | NOT NULL | Writing pillar score (0–100) | Planned v3.0 |
| `speaking_score`| INT | NOT NULL | Speaking pillar score (0–100) | Planned v3.0 |
| `overall_score` | INT | NOT NULL | Aggregate score (0–100) | Planned v3.0 |
| `is_passed` | BOOLEAN | NOT NULL | Passed official passing threshold | Planned v3.0 |
| `analysis_report`| JSONB | NOT NULL | Diagnostic report: grammar weaknesses & remediation | Planned v3.0 |
| `attempted_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Exam attempt timestamp | Planned v3.0 |

---

## 📊 3. DBML Script (dbdiagram.io)

Copy-paste kode DBML berikut langsung ke **[dbdiagram.io](https://dbdiagram.io)** untuk memvisualisasikan diagram interaktif relasi database CodeAbroad v3.0:

```dbml
// ============================================================================
// CodeAbroad ERD (Database Markup Language - dbdiagram.io)
// Version: 3.0 (Global Language Mastery Platform & Anki SRS Engine)
// Paste this directly into https://dbdiagram.io
// ============================================================================

Project CodeAbroad {
  database_type: 'PostgreSQL'
  Note: '''
    # CodeAbroad Database Schema (v3.0)
    World-class gamified language learning mastery platform.
    Features:
      - Multi-Language & Multi-Script (Japanese Kanji/Kana, English, German, Mandarin)
      - International Standards (JLPT N5-N1, CEFR A1-C1, HSK 1-6)
      - 4 Pillars: Reading, Listening, Writing, Speaking
      - Anki Spaced Repetition System (SM-2)
      - Diagnostic Mock Exam Engine
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
}

// ----------------------------------------------------------------------------
// 2. PROFILE & PREFERENCES (Pillar 2: Application Profile)
// ----------------------------------------------------------------------------
Table user_profiles {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [unique, not null]
  name varchar(100) [not null]
  username varchar(50) [unique, not null]
  bio text
  is_onboarded boolean [not null, default: false]
  daily_goal_minutes integer [not null, default: 15, note: '5 | 15 | 30 | 45']
  preferred_roadmap_view varchar(20) [not null, default: 'map', note: 'map | syllabus']
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [default: `CURRENT_TIMESTAMP`]
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
}

Table badge_definitions {
  id varchar(100) [pk]
  title varchar(100) [not null]
  description text [not null]
  category varchar(50) [not null, note: 'milestone | streak | srs | mastery']
  icon varchar(100)
  xp_reward integer [not null, default: 50]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

Table shop_items {
  id varchar(50) [pk]
  title varchar(100) [not null]
  subtitle text [not null]
  price_gems integer [not null]
  category varchar(50) [not null, note: 'protection | booster | career']
  badge varchar(50)
  is_active boolean [not null, default: true]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

Table user_inventories {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  item_id varchar(50) [not null]
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
  activity_type varchar(50) [not null]
  xp_earned integer [not null, default: 0]
  metadata jsonb
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (user_id, created_at) [name: 'idx_activity_user_created']
  }
}

// ----------------------------------------------------------------------------
// 4. LANGUAGE CURRICULUM MASTER DOMAIN
// ----------------------------------------------------------------------------
Table languages {
  id uuid [pk, default: `gen_random_uuid()`]
  code varchar(10) [unique, not null, note: 'ja, en-us, en-gb, de, zh, fr']
  name varchar(50) [not null]
  supported_scripts jsonb [not null, note: '["kanji", "hiragana", "katakana", "romaji"]']
  is_active boolean [not null, default: false]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

Table proficiency_levels {
  id uuid [pk, default: `gen_random_uuid()`]
  language_id uuid [not null]
  code varchar(10) [not null, note: 'N5, N4, A1, B2, HSK1']
  name varchar(50) [not null, note: 'JLPT N5, CEFR B2, HSK 1']
  tier varchar(20) [not null, default: 'beginner', note: 'beginner | intermediate | advanced']
  official_exam_name varchar(50) [not null, note: 'JLPT, IELTS, Goethe']
  passing_score_percent integer [not null, default: 60]
  order_index integer [not null]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (language_id, code) [unique]
  }
}

Table grammar_points {
  id uuid [pk, default: `gen_random_uuid()`]
  level_id uuid [not null]
  code varchar(30) [not null, note: 'GP-JA-N5-001']
  category varchar(30) [not null, note: 'tense, conjugation, particle, honorific, sentence_pattern']
  title varchar(100) [not null]
  formula text [not null]
  explanation text [not null]
  order_index integer [not null]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (level_id, code) [unique]
  }
}

Table units {
  id uuid [pk, default: `gen_random_uuid()`]
  level_id uuid [not null]
  title varchar(100) [not null]
  description text
  unit_type varchar(20) [not null, default: 'curriculum', note: 'curriculum | diagnostic_exam']
  order_index integer [not null]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

Table lessons {
  id uuid [pk, default: `gen_random_uuid()`]
  unit_id uuid [not null]
  title varchar(100) [not null]
  xp_reward integer [not null, default: 15]
  order_index integer [not null]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

Table exercises {
  id uuid [pk, default: `gen_random_uuid()`]
  lesson_id uuid [not null]
  grammar_point_id uuid [null]
  skill_pillar varchar(20) [not null, note: 'reading | listening | writing | speaking']
  exercise_type varchar(30) [not null, note: 'sentence_builder | fill_blank | listening_choice | speaking_repeat | dialogue_roleplay']
  prompt text [not null]
  content jsonb [not null, note: 'pronunciation, audio_url, furigana, tokens']
  correct_answer jsonb [not null]
  acceptable_answers jsonb [note: 'multi-script variations (Kanji vs Kana)']
  diagnostic_rubric jsonb [note: 'targeted misconception correction']
  explanation text [not null]
  order_index integer [not null]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

// ----------------------------------------------------------------------------
// 5. USER PROGRESS, ANKI SRS & DIAGNOSTIC MOCK EXAMS
// ----------------------------------------------------------------------------
Table user_language_enrollments {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  language_id uuid [not null]
  current_level_id uuid [null]
  initial_placement_type varchar(30) [not null, default: 'zero_beginner', note: 'zero_beginner | placement_test | manual_select']
  placement_score_percent integer [null]
  is_active boolean [not null, default: true]
  enrolled_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (user_id, language_id) [unique]
  }
}

Table user_lesson_progress {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  lesson_id uuid [not null]
  is_completed boolean [not null, default: false]
  score integer [not null, default: 0]
  is_skipped boolean [not null, default: false, note: 'True if completed via placement skip']
  completed_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (user_id, lesson_id) [unique]
  }
}

Table user_exercise_attempts {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  exercise_id uuid [not null]
  is_correct boolean [not null]
  selected_answer jsonb [not null]
  time_spent_seconds integer [not null, default: 0]
  created_at timestamptz [default: `CURRENT_TIMESTAMP`]

  indexes {
    (user_id, exercise_id, is_correct) [name: 'idx_attempts_user_ex']
  }
}

Table user_srs_reviews {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  exercise_id uuid [not null]
  interval_days integer [not null, default: 1]
  repetition_count integer [not null, default: 0]
  ease_factor decimal(4,2) [not null, default: 2.50]
  next_review_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
  last_reviewed_at timestamptz

  indexes {
    (user_id, exercise_id) [unique]
    (user_id, next_review_at) [name: 'idx_srs_user_due']
  }
}

Table readiness_exam_attempts {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  level_id uuid [not null]
  reading_score integer [not null]
  listening_score integer [not null]
  writing_score integer [not null]
  speaking_score integer [not null]
  overall_score integer [not null]
  is_passed boolean [not null]
  analysis_report jsonb [not null]
  attempted_at timestamptz [default: `CURRENT_TIMESTAMP`]
}

// ----------------------------------------------------------------------------
// RELATIONSHIPS & CARDINALITIES
// ----------------------------------------------------------------------------
Ref: user_profiles.user_id - users.id [delete: cascade]
Ref: user_gamification.user_id - users.id [delete: cascade]
Ref: user_inventories.user_id > users.id [delete: cascade]
Ref: user_inventories.item_id > shop_items.id [delete: cascade]
Ref: user_badges.user_id > users.id [delete: cascade]
Ref: user_badges.badge_key > badge_definitions.id [delete: cascade]
Ref: user_daily_chest_claims.user_id > users.id [delete: cascade]
Ref: user_activity_logs.user_id > users.id [delete: cascade]

Ref: proficiency_levels.language_id > languages.id [delete: cascade]
Ref: grammar_points.level_id > proficiency_levels.id [delete: cascade]
Ref: units.level_id > proficiency_levels.id [delete: cascade]
Ref: lessons.unit_id > units.id [delete: cascade]
Ref: exercises.lesson_id > lessons.id [delete: cascade]
Ref: exercises.grammar_point_id > grammar_points.id [delete: set null]

Ref: user_language_enrollments.user_id > users.id [delete: cascade]
Ref: user_language_enrollments.language_id > languages.id [delete: cascade]
Ref: user_language_enrollments.current_level_id > proficiency_levels.id [delete: set null]

Ref: user_lesson_progress.user_id > users.id [delete: cascade]
Ref: user_lesson_progress.lesson_id > lessons.id [delete: cascade]

Ref: user_exercise_attempts.user_id > users.id [delete: cascade]
Ref: user_exercise_attempts.exercise_id > exercises.id [delete: cascade]

Ref: user_srs_reviews.user_id > users.id [delete: cascade]
Ref: user_srs_reviews.exercise_id > exercises.id [delete: cascade]

Ref: readiness_exam_attempts.user_id > users.id [delete: cascade]
Ref: readiness_exam_attempts.level_id > proficiency_levels.id [delete: cascade]
```

---

## ⚠️ 4. Deprecated / Pruned Tables & Evolution Path

| Tabel Lama (v2.2) | Pengganti di v3.0 | Alasan & Transformasi |
| :--- | :--- | :--- |
| `countries` | `languages` | Beralih dari entitas negara menjadi entitas bahasa resmi dunia yang modular dengan field `supported_scripts`. |
| `career_paths` & `tech_stacks` | `proficiency_levels` | Tidak lagi kaku berbasis framework koding saja; beralih ke level sertifikasi bahasa resmi internasional (JLPT N5-N1, CEFR A1-C1, HSK 1-6). |
| `modules` & `chapters` | `units` & `lessons` | Disederhanakan menjadi 2 tingkat hierarki (`units` ➔ `lessons`) yang universal dan bebas dari metafora stasiun/tiket kereta api. |
| `quests` | `exercises` | Dari Monaco coding runner menjadi engine soal interaktif 4 pilar (*Reading, Listening, Writing, Speaking*) dengan dukungan audio native, Furigana Ruby, dan multi-aksara. |
| `user_quests` | `user_lesson_progress` + `user_exercise_attempts` | Pemisahan antara status komplesi pelajaran harian dan log detail jawaban butir soal untuk analitik kelemahan. |
| `vocabularies` | `exercises` (tipe vocab) + `user_srs_reviews` | Kosakata diintegrasikan langsung ke bank latihan dan kartu Anki SRS SM-2 otomatis. |
