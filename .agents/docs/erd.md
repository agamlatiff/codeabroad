# Entity Relationship Diagram (ERD) — Merantalk
**Version:** 3.2 (Multi-Language Mastery Platform: JLPT N5–N1 & CEFR A1–C2 / TOEFL iBT, Pengingat Ulang Otomatis Anti Lupa & Diagnostic Exam Engine)  
**Last Updated:** 2026-11-27  
**Database:** PostgreSQL 16 (`pgcrypto`) on Neon Serverless + Upstash Redis (TLS)  
**Migrations:** `backend/migrations/000001_schema_ddl` through `000017_seed_english_us_curriculum_b2_c2` (**32 Active Tables**)

---

## 1. Conceptual Architecture & Bounded Contexts

Merantalk mengadopsi skema relasional ternormalisasi (**32 tabel aktif**) yang memisahkan **Core Identity & Subscription**, **User Profile**, **Gamification & Weekly League**, **Universal Multi-Language Curriculum (Jepang JLPT N5–N1 & Inggris Amerika CEFR A1–C2 / TOEFL iBT)**, serta **Pengingat Ulang Otomatis (Jadwal Latihan Ulang Adaptif) & Readiness Diagnostics**:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                     PILLAR 1: IDENTITY, OAUTH & TIER                         │
│  users (id, email, password_hash?, email_verified, subscription_tier)        │
│    └──(1:N)──> user_oauth_accounts (Google OAuth 2.0 linked identities)      │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │ (1-to-1 / 1-to-N FK user_id)
        ┌───────────────────────┼──────────────────────────────┐
        ▼                       ▼                              ▼
┌─────────────────────┐ ┌──────────────────────────┐ ┌─────────────────────────┐
│ PILLAR 2: PROFILE   │ │ PILLAR 3: GAMIFICATION   │ │ QUESTS, SHOP & LEAGUE   │
│ user_profiles       │ │ user_gamification        │ │ • shop_items            │
│ • name, username    │ │ • xp, current_level      │ │ • user_inventories      │
│ • bio, avatar_url   │ │ • streak, gems           │ │ • badge_definitions     │
│ • daily_goal_minutes│ │ • xp_booster_expires_at  │ │ • user_badges           │
│ • is_onboarded      │ │ • last_active_at         │ │ • daily_quest_templates │
│ • has_seen_tour     │ └──────────────────────────┘ │ • user_daily_quest_...  │
└─────────────────────┘                              │ • user_daily_chest_...  │
                                                     │ • user_monthly_badge_...│
                                                     │ • leaderboard_weekly_...│
                                                     │ • coaching_submissions  │
                                                     │ • user_activity_logs    │
                                                     └─────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│          DOMAIN 4: UNIVERSAL LANGUAGE CURRICULUM, GRAMMAR & DECKS            │
│  languages (ja [Active], en-us [Active], en-gb, de, zh, fr [Coming Soon])    │
│    ├──(1:N)──> proficiency_levels (JLPT N5–N1 | CEFR A1–C2 • TOEFL iBT)      │
│    │             ├──(1:N)──> grammar_points (examples + learning_guide JSONB)│
│    │             ├──(1:N)──> units (curriculum 1..10 | diagnostic_exam -1/99)│
│    │             │             └──(1:N)──> lessons (slug, short_title, icon) │
│    │             │                           └──(1:N)──> exercises (4 pillar)│
│    │             └──(1:N)──> readiness_exam_attempts (4-pillar breakdown)    │
│    ├──(code)─> flashcard_decks ──(1:N)──> flashcard_cards (Kartu Kosakata)   │
│    └──(ja)───> kana_characters (Hiragana, Katakana & Kanji Reference Chart)  │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│     DOMAIN 5: LEARNER PROGRESS, PENGINGAT ULANG OTOMATIS & MASTERY STATE     │
│  users ──(1:N)──> user_language_enrollments (Active track & placement state) │
│  users ──(1:N)──> user_lesson_progress      (Node completion, score, skip)   │
│  users ──(1:N)──> user_exercise_attempts    (Item-level answers & timing)    │
│  users ──(1:N)──> user_srs_reviews          (Pengingat ulang soal keliru)    │
│  users ──(1:N)──> user_flashcard_progress   (Jadwal ulang kartu kosakata)    │
│  users ──(1:N)──> user_grammar_progress     (Grammar 3-quiz mastery & review)│
│  users ──(1:N)──> user_kana_progress        (Kana/Kanji drill mastery)       │
│  users ──(1:N)──> readiness_exam_attempts   (JLPT / TOEFL Readiness Scores)  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Table Specifications (32 Active Tables)

### 2.1 Identity, OAuth & Subscription Domain (Pillar 1)

#### `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, `gen_random_uuid()` | Primary user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email address |
| `password_hash` | VARCHAR(255) | NULLABLE | Bcrypt hash (`NULL` for pure Google OAuth accounts) |
| `email_verified` | BOOLEAN | NOT NULL, DEFAULT `false` | Verified email flag (`true` on verified Google OAuth) |
| `subscription_tier` | VARCHAR(16) | NOT NULL, DEFAULT `'free'`, CHECK IN (`'free'`, `'pro'`) | Access tier (`free`: N5–N3 & A1–B1; `pro`: N2–N1 & B2–C2) |
| `subscription_expires_at` | TIMESTAMPTZ | NULLABLE | Optional Pro subscription expiration timestamp |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Account update timestamp |

#### `user_oauth_accounts`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, `gen_random_uuid()` | OAuth link ID |
| `user_id` | UUID | NOT NULL, FK → `users.id` ON DELETE CASCADE | Linked Merantalk user |
| `provider` | VARCHAR(50) | NOT NULL | OAuth provider (`google`) |
| `provider_user_id` | VARCHAR(255) | NOT NULL | Provider subject identifier (`sub`) |
| `email` | VARCHAR(255) | NOT NULL | Provider email at link time |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Link creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Last OAuth login sync |
| *Index* | UNIQUE(`provider`, `provider_user_id`), UNIQUE(`user_id`, `provider`) | | Prevents duplicate identity binding |

---

### 2.2 Profile Domain (Pillar 2)

#### `user_profiles` (1-to-1 with `users`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, `gen_random_uuid()` | Profile ID |
| `user_id` | UUID | UNIQUE, NOT NULL, FK → `users.id` ON DELETE CASCADE | Owner user ID |
| `name` | VARCHAR(100) | NOT NULL | Display full name |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Unique public handle |
| `bio` | TEXT | NULLABLE | Optional learner bio |
| `avatar_url` | TEXT | NULLABLE | Custom or OAuth avatar URL |
| `daily_goal_minutes` | INTEGER | NOT NULL, DEFAULT `15`, CHECK IN (`5, 15, 30, 45`) | Daily study pace target |
| `is_onboarded` | BOOLEAN | NOT NULL, DEFAULT `false` | Onboarding completion flag |
| `has_seen_roadmap_tour` | BOOLEAN | NOT NULL, DEFAULT `false` | Interactive spotlight tour flag |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Update timestamp |

---

### 2.3 Gamification, Quests, Shop, Coaching & League Domain (Pillar 3)

#### `user_gamification` (1-to-1 with `users`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, `gen_random_uuid()` | Gamification row ID |
| `user_id` | UUID | UNIQUE, NOT NULL, FK → `users.id` ON DELETE CASCADE | Owner user ID |
| `xp` | INTEGER | NOT NULL, DEFAULT `0`, CHECK (`xp >= 0`) | Cumulative XP |
| `current_level` | INTEGER | NOT NULL, DEFAULT `1`, CHECK (`current_level >= 1`) | Learner gamification level |
| `streak` | INTEGER | NOT NULL, DEFAULT `0`, CHECK (`streak >= 0`) | Consecutive active WIB days |
| `gems` | INTEGER | NOT NULL, DEFAULT `0`, CHECK (`gems >= 0`) | Virtual currency balance |
| `xp_booster_expires_at` | TIMESTAMPTZ | NULLABLE | Active 2x XP booster expiration |
| `last_active_at` | TIMESTAMPTZ | NULLABLE | Last qualifying learning activity |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Update timestamp |

#### `badge_definitions` & `user_badges`
- `badge_definitions`: `id VARCHAR(100) PK`, `title VARCHAR(100)`, `description TEXT`, `category VARCHAR(50)`, `icon VARCHAR(100)`, `xp_reward INT (>= 0)`, `created_at TIMESTAMPTZ`.
- `user_badges`: `id UUID PK`, `user_id UUID FK → users.id`, `badge_key VARCHAR(100) FK → badge_definitions.id`, `awarded_at TIMESTAMPTZ`, UNIQUE(`user_id`, `badge_key`).

#### `shop_items` & `user_inventories`
- `shop_items`: `id VARCHAR(50) PK` (`streak-freeze`, `xp-booster`, etc.), `title VARCHAR(100)`, `subtitle TEXT`, `price_gems INT (>= 0)`, `category VARCHAR(50)`, `badge VARCHAR(50)`, `is_active BOOLEAN`, `created_at TIMESTAMPTZ`.
- `user_inventories`: `id UUID PK`, `user_id UUID FK → users.id`, `item_id VARCHAR(50) FK → shop_items.id`, `quantity INT (>= 0)`, `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`, UNIQUE(`user_id`, `item_id`).

#### `daily_quest_templates`, `user_daily_quest_claims`, `user_daily_chest_claims`, `user_monthly_badge_claims`
- `daily_quest_templates`: Rotating daily quest catalog (`id UUID PK`, `code VARCHAR(64) UNIQUE`, `slot_category VARCHAR(32)`, `title VARCHAR(160)`, `chip_label VARCHAR(48)`, `metric_type VARCHAR(48)`, `target_value INT`, `xp_reward INT`, `route VARCHAR(120)`, `icon_name VARCHAR(48)`, `sort_order INT`, `is_active BOOLEAN`).
- `user_daily_quest_claims`: Idempotent WIB daily quest reward lock (`id UUID PK`, `user_id UUID`, `quest_template_id UUID`, `claim_date_wib VARCHAR(10)`, `xp_awarded INT`, `claimed_at TIMESTAMPTZ`, UNIQUE(`user_id`, `quest_template_id`, `claim_date_wib`)).
- `user_daily_chest_claims`: Milestone chest claims (`id UUID PK`, `user_id UUID`, `claim_date DATE`, `tier INT CHECK IN (1, 2, 3)`, `gems_awarded INT`, `xp_awarded INT`, `created_at TIMESTAMPTZ`, UNIQUE(`user_id`, `claim_date`, `tier`)).
- `user_monthly_badge_claims`: Monthly 25-quest honor badge (`id UUID PK`, `user_id UUID`, `month_key VARCHAR(7)`, `badge_key VARCHAR(64)`, `completed_count INT`, `xp_awarded INT DEFAULT 150`, `claimed_at TIMESTAMPTZ`, UNIQUE(`user_id`, `month_key`)).

#### `leaderboard_weekly_rewards`, `coaching_submissions`, `user_activity_logs`
- `leaderboard_weekly_rewards`: ISO-week Top-3 podium Gem rewards (`id UUID PK`, `user_id UUID`, `season_year INT`, `season_week INT`, `division VARCHAR(32) CHECK IN ('bronze','silver','gold','diamond')`, `rank INT CHECK (1..3)`, `weekly_xp INT`, `gems_awarded INT (> 0)`, `claimed_at TIMESTAMPTZ`, UNIQUE(`user_id`, `season_year`, `season_week`)).
- `coaching_submissions`: Career coaching & mock interview check-ins (`id UUID PK`, `user_id UUID`, `type VARCHAR(50)`, `target_role`, `github_url`, `resume_url`, `discord_handle`, `interview_language`, `focus_topic`, `preferred_time`, `notes`, `status VARCHAR(30) DEFAULT 'pending'`, `created_at`, `updated_at`).
- `user_activity_logs`: Append-only XP & streak ledger (`id UUID PK`, `user_id UUID`, `activity_type VARCHAR(50)` in `daily_login | lesson_completed | srs_review_completed | readiness_exam_completed | daily_golden_chest_claim | daily_chest_claimed | quest_completed | daily_vocab_quest_claim | onboarding_completed | badge_unlocked | streak_freeze_consumed | leaderboard_reward_claimed | xp_booster_activated | monthly_badge_claimed`, `xp_earned INT`, `metadata JSONB`, `created_at TIMESTAMPTZ`).

---

### 2.4 Universal Language Curriculum, Grammar, Kana & Flashcard Domain

#### `languages`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, `gen_random_uuid()` | Language UUID |
| `code` | VARCHAR(10) | UNIQUE, NOT NULL | ISO code (`ja`, `en-us`, `en-gb`, `de`, `zh`, `fr`) |
| `name` | VARCHAR(50) | NOT NULL | Localized Indonesian display name (`Jepang`, `Inggris (American)`, etc.) |
| `supported_scripts` | JSONB | NOT NULL, DEFAULT `'["latin"]'` | Writing systems (`["hiragana","katakana","kanji","romaji"]` or `["latin"]`) |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT `false` | `true` for `ja` & `en-us`; `false` (*Segera Hadir*) for `en-gb`, `de`, `zh`, `fr` |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Creation timestamp |

#### `proficiency_levels`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, `gen_random_uuid()` | Proficiency level UUID |
| `language_id` | UUID | NOT NULL, FK → `languages.id` ON DELETE CASCADE | Parent language |
| `code` | VARCHAR(30) | NOT NULL | Level code (`N5`..`N1` for `ja`; `A1`..`C2` for `en-us`) |
| `name` | VARCHAR(50) | NOT NULL | Display name (`JLPT N5`, `CEFR B2 (TOEFL 72-94)`, etc.) |
| `tier` | VARCHAR(20) | NOT NULL, CHECK IN (`'beginner'`, `'intermediate'`, `'advanced'`) | Difficulty tier |
| `official_exam_name` | VARCHAR(50) | NOT NULL | Benchmark exam (`JLPT`, `TOEFL iBT`, `IELTS`, `Goethe`, `HSK`, `DELF`) |
| `passing_score_percent` | INTEGER | NOT NULL, DEFAULT `60`, CHECK (`1..100`) | Mock exam pass mark |
| `order_index` | INTEGER | NOT NULL | Progression order (`1..5` for JLPT, `1..6` for CEFR) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Creation timestamp |
| *Index* | UNIQUE(`language_id`, `code`) | | Unique level code per language |

#### `grammar_points`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, `gen_random_uuid()` | Grammar point UUID (`116` seeded: `56` `ja` + `60` `en-us`) |
| `level_id` | UUID | NOT NULL, FK → `proficiency_levels.id` ON DELETE CASCADE | Target level |
| `code` | VARCHAR(30) | NOT NULL | Canonical code (`GP-JA-N5-001`..`GP-EN-C2-010`) |
| `category` | VARCHAR(30) | NOT NULL, CHECK IN (`tense`, `conjugation`, `particle`, `honorific`, `sentence_pattern`) | Linguistic category |
| `title` | VARCHAR(100) | NOT NULL | Editorial title + parenthetical pattern |
| `formula` | TEXT | NOT NULL | Structural syntax formula |
| `formula_reading` | TEXT | NOT NULL, DEFAULT `''` | Romaji / US IPA reading of formula |
| `explanation` | TEXT | NOT NULL | Contrastive Indonesian explanation |
| `examples` | JSONB | NOT NULL, DEFAULT `'[]'` | Example pairs `[{id, jp, reading}]` |
| `learning_guide` | JSONB | NOT NULL, DEFAULT `'{}'` | Interactive guide (`analogy`, `when_to_use`, `formula_parts`, `steps`, `breakdowns`, `forms`, `mistakes`, `quiz`) |
| `order_index` | INTEGER | NOT NULL, DEFAULT `1` | Sequence within level |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Creation timestamp |
| *Index* | UNIQUE(`level_id`, `code`) | | Unique code per level |

#### `kana_characters` (Japanese Script Reference)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, `gen_random_uuid()` | Character row ID |
| `character` | VARCHAR(8) | NOT NULL | Hiragana, Katakana, or Kanji glyph |
| `script` | VARCHAR(16) | NOT NULL, CHECK IN (`hiragana`, `katakana`, `kanji`) | Script group |
| `romaji` | VARCHAR(48) | NOT NULL | Hepburn reading |
| `row_group` | VARCHAR(16) | NOT NULL | Gojuon row / Kanji thematic group |
| `row_order` / `col_order` | INTEGER | NOT NULL | Grid coordinates |
| `mnemonic` | TEXT | NOT NULL | Visual memory cue in Bahasa Indonesia |
| `example_word` / `example_reading` / `example_meaning` | VARCHAR | NOT NULL | Contextual vocabulary example |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Creation timestamp |

#### `flashcard_decks` & `flashcard_cards` (Dek Kartu Kosakata dengan Jadwal Ulang Adaptif)
- `flashcard_decks` (`180` decks: `120` `ja` + `60` `en-us`): `id UUID PK`, `language_code VARCHAR(16)`, `slug VARCHAR(120) UNIQUE`, `title VARCHAR(160)`, `description TEXT`, `category VARCHAR(64)` (`daily`, `work_study`, `phrasal_idioms`, `academic_toefl`, etc.), `icon_name VARCHAR(64)`, `accent_color VARCHAR(32)`, `jlpt_level VARCHAR(16)` (stores `N5–N1` or `A1–C2`), `sort_order INT`, `created_at TIMESTAMPTZ`.
- `flashcard_cards` (`2,719` cards: `1,819` `ja` + `900` `en-us`): `id UUID PK`, `deck_id UUID FK → flashcard_decks.id ON DELETE CASCADE`, `front_text TEXT`, `reading TEXT` (Kana/Romaji or US IPA), `back_meaning TEXT` (Bahasa Indonesia), `part_of_speech VARCHAR(48)`, `sort_order INT`, `created_at TIMESTAMPTZ`.

#### `units`, `lessons`, `exercises` (4-Pillar Curriculum & Exam Tree)
- `units` (`143` units: `76` `ja` + `67` `en-us`): `id UUID PK`, `level_id UUID FK → proficiency_levels.id`, `title VARCHAR(100)`, `description TEXT`, `unit_type VARCHAR(20)` (`curriculum` at `order_index 1..10`; `diagnostic_exam` at `order_index -1` Placement & `99` Readiness Exam), `order_index INT`, `created_at TIMESTAMPTZ`.
- `lessons` (`743` lessons: `496` `ja` + `247` `en-us`): `id UUID PK`, `unit_id UUID FK → units.id`, `slug VARCHAR(160) UNIQUE`, `title VARCHAR(100)`, `short_title VARCHAR(48)`, `icon_name VARCHAR(48)`, `xp_reward INT (>= 0)`, `order_index INT`, `created_at TIMESTAMPTZ`.
- `exercises` (`6,144` exercises: `4,113` `ja` + `2,031` `en-us`): `id UUID PK`, `lesson_id UUID FK → lessons.id`, `grammar_point_id UUID NULLABLE FK → grammar_points.id`, `skill_pillar VARCHAR(20)` (`reading | listening | writing | speaking`), `exercise_type VARCHAR(30)` (`sentence_builder | fill_blank | listening_choice | speaking_repeat | dialogue_roleplay`), `prompt TEXT`, `content JSONB`, `correct_answer JSONB`, `acceptable_answers JSONB`, `diagnostic_rubric JSONB`, `explanation TEXT`, `order_index INT`, `created_at TIMESTAMPTZ`.

---

### 2.5 Learner Progress, Pengingat Ulang Otomatis & Readiness Diagnostics Domain

- `user_language_enrollments`: `id UUID PK`, `user_id UUID`, `language_id UUID`, `current_level_id UUID NULLABLE`, `initial_placement_type VARCHAR(30)` (`zero_beginner | placement_test | manual_select`), `placement_score_percent INT NULLABLE`, `is_active BOOLEAN`, `enrolled_at TIMESTAMPTZ`, UNIQUE(`user_id`, `language_id`).
- `user_lesson_progress`: `id UUID PK`, `user_id UUID`, `lesson_id UUID`, `is_completed BOOLEAN`, `score INT (0..100)`, `is_skipped BOOLEAN`, `completed_at TIMESTAMPTZ`, UNIQUE(`user_id`, `lesson_id`).
- `user_exercise_attempts`: `id UUID PK`, `user_id UUID`, `exercise_id UUID`, `is_correct BOOLEAN`, `selected_answer JSONB`, `time_spent_seconds INT (>= 0)`, `created_at TIMESTAMPTZ`.
- `user_srs_reviews` (*Antrean pengingat ulang otomatis untuk soal latihan yang masih keliru*): `id UUID PK`, `user_id UUID`, `exercise_id UUID`, `interval_days INT (>= 1)` (*jarak hari menuju latihan ulang berikutnya*), `repetition_count INT (>= 0)`, `ease_factor NUMERIC(4,2) (>= 1.30)` (*faktor kemudahan adaptif untuk mengatur jarak waktu munculnya kembali soal*), `next_review_at TIMESTAMPTZ`, `last_reviewed_at TIMESTAMPTZ`, UNIQUE(`user_id`, `exercise_id`).
- `user_flashcard_progress` (*Jadwal latihan ulang adaptif per kartu kosakata agar ingat lebih lama*): `id UUID PK`, `user_id UUID`, `card_id UUID FK → flashcard_cards.id`, `ease_factor DOUBLE PRECISION DEFAULT 2.5` (*faktor kemudahan adaptif untuk mengatur jarak waktu munculnya kembali kartu*), `interval_days INT DEFAULT 0`, `repetitions INT DEFAULT 0`, `next_review_at TIMESTAMPTZ`, `last_reviewed_at TIMESTAMPTZ`, `created_at`, `updated_at`, UNIQUE(`user_id`, `card_id`).
- `user_grammar_progress` (Grammar Mini-Quiz Mastery): `id UUID PK`, `user_id UUID`, `grammar_point_id UUID FK → grammar_points.id`, `quiz_score INT (0..100)`, `correct_count INT`, `total_questions INT`, `attempts_count INT`, `is_understood BOOLEAN`, `understood_at TIMESTAMPTZ`, `next_review_at TIMESTAMPTZ`, `last_attempted_at TIMESTAMPTZ`, UNIQUE(`user_id`, `grammar_point_id`).
- `user_kana_progress`: `id UUID PK`, `user_id UUID`, `character VARCHAR(8)`, `practice_count INT`, `correct_count INT`, `mastery_score INT`, `is_mastered BOOLEAN`, `last_practiced_at TIMESTAMPTZ`, UNIQUE(`user_id`, `character`).
- `readiness_exam_attempts`: `id UUID PK`, `user_id UUID`, `level_id UUID FK → proficiency_levels.id`, `reading_score INT (0..100)`, `listening_score INT (0..100)`, `writing_score INT (0..100)`, `speaking_score INT (0..100)`, `overall_score INT (0..100)`, `is_passed BOOLEAN`, `analysis_report JSONB`, `attempted_at TIMESTAMPTZ`.

---

## 3. DBML Script (dbdiagram.io — Full 32-Table Schema)

```dbml
Project Merantalk {
  database_type: 'PostgreSQL'
  Note: '''
    # Merantalk Database Schema (v3.2)
    32 Normalized Tables powering Japanese (JLPT N5-N1) & American English (CEFR A1-C2 / TOEFL iBT),
    Adaptive Smart Review (Pengingat Ulang Otomatis), Interactive Grammar Guides, Kana/Kanji Drills, Daily Quests & Weekly Leagues.
  '''
}

Table users {
  id uuid [pk, default: `gen_random_uuid()`]
  email varchar(255) [unique, not null]
  password_hash varchar(255) [null]
  email_verified boolean [not null, default: false]
  subscription_tier varchar(16) [not null, default: 'free', note: 'free | pro']
  subscription_expires_at timestamptz [null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table user_oauth_accounts {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  provider varchar(50) [not null, note: 'google']
  provider_user_id varchar(255) [not null]
  email varchar(255) [not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (provider, provider_user_id) [unique]
    (user_id, provider) [unique]
  }
}

Table user_profiles {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [unique, not null]
  name varchar(100) [not null]
  username varchar(50) [unique, not null]
  bio text
  avatar_url text
  daily_goal_minutes integer [not null, default: 15, note: '5 | 15 | 30 | 45']
  is_onboarded boolean [not null, default: false]
  has_seen_roadmap_tour boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table user_gamification {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [unique, not null]
  xp integer [not null, default: 0]
  current_level integer [not null, default: 1]
  streak integer [not null, default: 0]
  gems integer [not null, default: 0]
  xp_booster_expires_at timestamptz [null]
  last_active_at timestamptz [null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table badge_definitions {
  id varchar(100) [pk]
  title varchar(100) [not null]
  description text [not null]
  category varchar(50) [not null]
  icon varchar(100)
  xp_reward integer [not null, default: 50]
  created_at timestamptz [not null, default: `now()`]
}

Table user_badges {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  badge_key varchar(100) [not null]
  awarded_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, badge_key) [unique]
  }
}

Table shop_items {
  id varchar(50) [pk]
  title varchar(100) [not null]
  subtitle text [not null]
  price_gems integer [not null]
  category varchar(50) [not null]
  badge varchar(50)
  is_active boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
}

Table user_inventories {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  item_id varchar(50) [not null]
  quantity integer [not null, default: 0]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, item_id) [unique]
  }
}

Table daily_quest_templates {
  id uuid [pk, default: `gen_random_uuid()`]
  code varchar(64) [unique, not null]
  slot_category varchar(32) [not null]
  title varchar(160) [not null]
  chip_label varchar(48) [not null]
  metric_type varchar(48) [not null]
  target_value integer [not null, default: 1]
  xp_reward integer [not null, default: 30]
  route varchar(120) [not null, default: '/curriculum']
  icon_name varchar(48) [not null, default: 'book-open']
  sort_order integer [not null, default: 0]
  is_active boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
}

Table user_daily_quest_claims {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  quest_template_id uuid [not null]
  claim_date_wib varchar(10) [not null]
  xp_awarded integer [not null, default: 0]
  claimed_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, quest_template_id, claim_date_wib) [unique]
  }
}

Table user_daily_chest_claims {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  claim_date date [not null]
  tier integer [not null, note: '1 | 2 | 3']
  gems_awarded integer [not null, default: 0]
  xp_awarded integer [not null, default: 0]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, claim_date, tier) [unique]
  }
}

Table user_monthly_badge_claims {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  month_key varchar(7) [not null]
  badge_key varchar(64) [not null]
  completed_count integer [not null, default: 0]
  xp_awarded integer [not null, default: 150]
  claimed_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, month_key) [unique]
  }
}

Table leaderboard_weekly_rewards {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  season_year integer [not null]
  season_week integer [not null]
  division varchar(32) [not null, note: 'bronze | silver | gold | diamond']
  rank integer [not null, note: '1..3']
  weekly_xp integer [not null, default: 0]
  gems_awarded integer [not null]
  claimed_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, season_year, season_week) [unique]
  }
}

Table coaching_submissions {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  type varchar(50) [not null, note: 'cv-review | mock-interview']
  target_role varchar(120)
  github_url varchar(500)
  resume_url varchar(500)
  discord_handle varchar(100)
  interview_language varchar(50)
  focus_topic varchar(120)
  preferred_time varchar(120)
  notes text
  status varchar(30) [not null, default: 'pending']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table user_activity_logs {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  activity_type varchar(50) [not null]
  xp_earned integer [not null, default: 0]
  metadata jsonb
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, created_at)
  }
}

Table languages {
  id uuid [pk, default: `gen_random_uuid()`]
  code varchar(10) [unique, not null, note: 'ja | en-us | en-gb | de | zh | fr']
  name varchar(50) [not null]
  supported_scripts jsonb [not null, default: `["latin"]`]
  is_active boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]
}

Table proficiency_levels {
  id uuid [pk, default: `gen_random_uuid()`]
  language_id uuid [not null]
  code varchar(30) [not null, note: 'N5..N1 | A1..C2']
  name varchar(50) [not null]
  tier varchar(20) [not null, default: 'beginner', note: 'beginner | intermediate | advanced']
  official_exam_name varchar(50) [not null]
  passing_score_percent integer [not null, default: 60]
  order_index integer [not null]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (language_id, code) [unique]
  }
}

Table grammar_points {
  id uuid [pk, default: `gen_random_uuid()`]
  level_id uuid [not null]
  code varchar(30) [not null]
  category varchar(30) [not null, note: 'tense | conjugation | particle | honorific | sentence_pattern']
  title varchar(100) [not null]
  formula text [not null]
  formula_reading text [not null, default: '']
  explanation text [not null]
  examples jsonb [not null, default: `[]`]
  learning_guide jsonb [not null, default: `{}`]
  order_index integer [not null, default: 1]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (level_id, code) [unique]
  }
}

Table kana_characters {
  id uuid [pk, default: `gen_random_uuid()`]
  character varchar(8) [unique, not null]
  script varchar(16) [not null, note: 'hiragana | katakana | kanji']
  romaji varchar(48) [not null]
  row_group varchar(16) [not null]
  row_order integer [not null]
  col_order integer [not null]
  mnemonic text [not null]
  example_word varchar(64) [not null, default: '']
  example_reading varchar(64) [not null, default: '']
  example_meaning varchar(120) [not null, default: '']
  created_at timestamptz [not null, default: `now()`]
}

Table flashcard_decks {
  id uuid [pk, default: `gen_random_uuid()`]
  language_code varchar(16) [not null, note: 'ja | en-us']
  slug varchar(120) [unique, not null]
  title varchar(160) [not null]
  description text [not null, default: '']
  category varchar(64) [not null]
  icon_name varchar(64) [not null, default: 'cards']
  accent_color varchar(32) [not null, default: 'blue']
  jlpt_level varchar(16) [not null, default: 'N5', note: 'N5..N1 | A1..C2']
  sort_order integer [not null, default: 0]
  created_at timestamptz [not null, default: `now()`]
}

Table flashcard_cards {
  id uuid [pk, default: `gen_random_uuid()`]
  deck_id uuid [not null]
  front_text text [not null]
  reading text [not null, default: '']
  back_meaning text [not null]
  part_of_speech varchar(48) [not null, default: '']
  sort_order integer [not null, default: 0]
  created_at timestamptz [not null, default: `now()`]
}

Table units {
  id uuid [pk, default: `gen_random_uuid()`]
  level_id uuid [not null]
  title varchar(100) [not null]
  description text
  unit_type varchar(20) [not null, default: 'curriculum', note: 'curriculum | diagnostic_exam']
  order_index integer [not null, default: 1]
  created_at timestamptz [not null, default: `now()`]
}

Table lessons {
  id uuid [pk, default: `gen_random_uuid()`]
  unit_id uuid [not null]
  slug varchar(160) [unique, not null]
  title varchar(100) [not null]
  short_title varchar(48) [not null, default: '']
  icon_name varchar(48) [not null, default: 'book-open']
  xp_reward integer [not null, default: 15]
  order_index integer [not null, default: 1]
  created_at timestamptz [not null, default: `now()`]
}

Table exercises {
  id uuid [pk, default: `gen_random_uuid()`]
  lesson_id uuid [not null]
  grammar_point_id uuid [null]
  skill_pillar varchar(20) [not null, note: 'reading | listening | writing | speaking']
  exercise_type varchar(30) [not null, note: 'sentence_builder | fill_blank | listening_choice | speaking_repeat | dialogue_roleplay']
  prompt text [not null]
  content jsonb [not null]
  correct_answer jsonb [not null]
  acceptable_answers jsonb
  diagnostic_rubric jsonb
  explanation text [not null]
  order_index integer [not null, default: 1]
  created_at timestamptz [not null, default: `now()`]
}

Table user_language_enrollments {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  language_id uuid [not null]
  current_level_id uuid [null]
  initial_placement_type varchar(30) [not null, default: 'zero_beginner']
  placement_score_percent integer [null]
  is_active boolean [not null, default: true]
  enrolled_at timestamptz [not null, default: `now()`]

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
  is_skipped boolean [not null, default: false]
  completed_at timestamptz [not null, default: `now()`]

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
  created_at timestamptz [not null, default: `now()`]
}

Table user_srs_reviews {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  exercise_id uuid [not null]
  interval_days integer [not null, default: 1]
  repetition_count integer [not null, default: 0]
  ease_factor decimal(4,2) [not null, default: 2.50]
  next_review_at timestamptz [not null, default: `now()`]
  last_reviewed_at timestamptz

  indexes {
    (user_id, exercise_id) [unique]
  }
}

Table user_flashcard_progress {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  card_id uuid [not null]
  ease_factor double [not null, default: 2.5]
  interval_days integer [not null, default: 0]
  repetitions integer [not null, default: 0]
  next_review_at timestamptz [not null, default: `now()`]
  last_reviewed_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, card_id) [unique]
  }
}

Table user_grammar_progress {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  grammar_point_id uuid [not null]
  quiz_score integer [not null, default: 0]
  correct_count integer [not null, default: 0]
  total_questions integer [not null, default: 3]
  attempts_count integer [not null, default: 1]
  is_understood boolean [not null, default: false]
  understood_at timestamptz
  next_review_at timestamptz
  last_attempted_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, grammar_point_id) [unique]
  }
}

Table user_kana_progress {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  character varchar(8) [not null]
  practice_count integer [not null, default: 0]
  correct_count integer [not null, default: 0]
  mastery_score integer [not null, default: 0]
  is_mastered boolean [not null, default: false]
  last_practiced_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, character) [unique]
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
  attempted_at timestamptz [not null, default: `now()`]
}

Ref: user_oauth_accounts.user_id > users.id [delete: cascade]
Ref: user_profiles.user_id - users.id [delete: cascade]
Ref: user_gamification.user_id - users.id [delete: cascade]
Ref: user_badges.user_id > users.id [delete: cascade]
Ref: user_badges.badge_key > badge_definitions.id [delete: cascade]
Ref: user_inventories.user_id > users.id [delete: cascade]
Ref: user_inventories.item_id > shop_items.id [delete: cascade]
Ref: user_daily_quest_claims.user_id > users.id [delete: cascade]
Ref: user_daily_quest_claims.quest_template_id > daily_quest_templates.id [delete: cascade]
Ref: user_daily_chest_claims.user_id > users.id [delete: cascade]
Ref: user_monthly_badge_claims.user_id > users.id [delete: cascade]
Ref: leaderboard_weekly_rewards.user_id > users.id [delete: cascade]
Ref: coaching_submissions.user_id > users.id [delete: cascade]
Ref: user_activity_logs.user_id > users.id [delete: cascade]

Ref: proficiency_levels.language_id > languages.id [delete: cascade]
Ref: grammar_points.level_id > proficiency_levels.id [delete: cascade]
Ref: flashcard_cards.deck_id > flashcard_decks.id [delete: cascade]
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
Ref: user_flashcard_progress.user_id > users.id [delete: cascade]
Ref: user_flashcard_progress.card_id > flashcard_cards.id [delete: cascade]
Ref: user_grammar_progress.user_id > users.id [delete: cascade]
Ref: user_grammar_progress.grammar_point_id > grammar_points.id [delete: cascade]
Ref: user_kana_progress.user_id > users.id [delete: cascade]
Ref: readiness_exam_attempts.user_id > users.id [delete: cascade]
Ref: readiness_exam_attempts.level_id > proficiency_levels.id [delete: cascade]
```

---

## 4. Sequential Migration Inventory (`000001` – `000017`)

| Migration | Scope & Seed Counts |
| :--- | :--- |
| `000001_schema_ddl` | Core DDL for all **32 normalized tables**, PKs, FKs, indexes, and `CHECK` constraints |
| `000002_seed_languages_and_levels` | 6 destination languages (`ja`, `en-gb`, `en-us`, `de`, `zh`, `fr`) & baseline proficiency levels |
| `000003_seed_gamification_catalog` | Shop items, badge definitions, and rotating daily quest templates |
| `000004_seed_kana_and_kanji` | Hiragana, Katakana, and core JLPT Kanji reference characters (`kana_characters`) |
| `000005_seed_grammar_points` | **56** Japanese (`ja` `N5–N1`) grammar points & interactive `learning_guide` JSONB |
| `000006_seed_flashcards_n5_n4` | Japanese `N5–N4` flashcard decks & cards |
| `000007_seed_flashcards_n3_n2_n1` | Japanese `N3–N1` flashcard decks & cards (total **120** `ja` decks / **1,819** cards) |
| `000008_seed_curriculum_n5` | Japanese `N5` curriculum, placement diagnostic (`order_index = -1`), and N5 readiness exam |
| `000009` – `000012` | Japanese `N4`, `N3`, `N2`, `N1` full curriculum & readiness exams (total **76** `ja` units / **496** lessons / **4,113** exercises) |
| `000013_setup_english_us_levels` | Activates `en-us` (**Inggris (American)**) with 6 levels `CEFR A1–C2` mapped to TOEFL iBT score bands |
| `000014_seed_english_us_grammar` | **60** American English (`A1–C2`) grammar points (`GP-EN-A1-001`..`GP-EN-C2-010`) with US IPA & 3-item quizzes |
| `000015_seed_english_us_flashcards` | **60** American English (`A1–C2`) flashcard decks / **900** adaptive vocabulary review cards (`daily`, `work_study`, `phrasal_idioms`, `academic_toefl`) |
| `000016_seed_english_us_curriculum_a1_b1` | **34** `en-us` `A1–B1` units (1 Placement + 30 Curriculum + 3 Readiness Exams), **124** lessons, **1,023** exercises |
| `000017_seed_english_us_curriculum_b2_c2` | **33** `en-us` `B2–C2` units (30 Curriculum + 3 Readiness Exams), **123** lessons, **1,008** exercises |
