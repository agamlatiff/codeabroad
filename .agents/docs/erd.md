# Entity Relationship Diagram (ERD)
# CodeAbroad

**Version:** 1.1  
**Last Updated:** 2026-10-08  
**Database:** PostgreSQL

---

## Diagram

```
┌─────────────────────────┐         ┌─────────────────────────┐
│          users          │         │      career_paths        │
├─────────────────────────┤         ├─────────────────────────┤
│ id (PK)                 │         │ id (PK)                  │
│ name                    │    ┌───>│ slug (UNIQUE)            │
│ username (UNIQUE)       │    │    │ label                    │
│ email (UNIQUE)          │    │    │ description              │
│ password_hash           │    │    │ stacks (JSONB)           │
│ avatar_url              │    │    │ created_at               │
│ bio                     │    │    │ updated_at               │
│ github_url              │    │    └─────────────────────────┘
│ linkedin_url            │    │
│ career_path_id (FK)     │────┘    ┌─────────────────────────┐
│ country_id (FK)         │────┐    │        countries         │
│ level                   │    │    ├─────────────────────────┤
│ xp                      │    └───>│ id (PK)                  │
│ current_level           │         │ code (UNIQUE: JP/DE/SG)  │
│ streak                  │         │ name                     │
│ last_active_at          │         │ flag_emoji               │
│ is_onboarded            │         │ is_active                │
│ primary_stack           │         │ badge                    │
│ target_timeline         │         │ visa_info (JSONB)        │
│ language_level          │         │ salary_range (JSONB)     │
│ created_at              │         │ work_culture (text)      │
│ updated_at              │         │ created_at               │
└────────────┬────────────┘         │ updated_at               │
             │                      └─────────────────────────┘
             │
             │    ┌──────────────────────────────────────────┐
             │    │              user_quests                  │
             │    ├──────────────────────────────────────────┤
             └───>│ id (PK)                                   │
                  │ user_id (FK → users.id)                   │
                  │ quest_id (FK → quests.id)                 │
                  │ status (locked/available/completed)       │
                  │ completed_at                              │
                  │ created_at                                │
                  │ updated_at                                │
                  │ UNIQUE(user_id, quest_id)                 │
                  └──────────────────┬───────────────────────┘
                                     │
             ┌───────────────────────▼──────────────────────┐
             │                    quests                     │
             ├──────────────────────────────────────────────┤
             │ id (PK)                                       │
             │ title                                         │
             │ description (text)                            │
             │ type (main/side/daily)                        │
             │ career_path_id (FK → career_paths.id)         │
             │ country_id (FK → countries.id, nullable)      │
             │ difficulty (beginner/intermediate/advanced)   │
             │ xp_reward                                     │
             │ estimated_minutes                             │
             │ resource_url                                  │
             │ order_index                                   │
             │ prerequisites (UUID[], nullable)              │
             │ is_active                                     │
             │ created_at                                    │
             │ updated_at                                    │
             └──────────────────────────────────────────────┘

┌─────────────────────┐         ┌─────────────────────────┐
│    achievements     │         │    user_achievements     │
├─────────────────────┤         ├─────────────────────────┤
│ id (PK)             │<────────│ id (PK)                  │
│ name                │         │ user_id (FK → users.id)  │
│ description         │         │ achievement_id (FK)      │
│ icon                │         │ unlocked_at              │
│ condition_type      │         │ UNIQUE(user, achv)       │
│ condition_value     │         └─────────────────────────┘
│ xp_bonus            │
│ created_at          │
└─────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     xp_logs                             │
├─────────────────────────────────────────────────────────┤
│ id (PK)                                                  │
│ user_id (FK → users.id)                                  │
│ amount                                                   │
│ source (quest_completed/achievement/bonus)               │
│ reference_id (quest_id or achievement_id)                │
│ created_at                                               │
└─────────────────────────────────────────────────────────┘
```

---

## Table Descriptions

### `users`
Stores all registered users, their onboarding preferences, and current game state.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key (`gen_random_uuid()`) |
| `name` | VARCHAR(100) | Display name |
| `username` | VARCHAR(50) | Unique handle e.g. `@rizki_dev` |
| `email` | VARCHAR(255) | Unique, used for authentication |
| `password_hash` | VARCHAR(255) | Bcrypt hashed |
| `avatar_url` | VARCHAR(500) | Profile photo URL, nullable |
| `bio` | TEXT | Short self-description, nullable |
| `github_url` | VARCHAR(255) | GitHub profile URL, nullable |
| `linkedin_url` | VARCHAR(255) | LinkedIn profile URL, nullable |
| `career_path_id` | UUID (FK) | Selected career path (nullable, set via onboarding) |
| `country_id` | UUID (FK) | Target destination country (nullable, set via onboarding) |
| `level` | VARCHAR(20) | Experience calibration (`beginner` / `intermediate`) |
| `xp` | INTEGER | Total accumulated XP (starts with +50 welcome bonus) |
| `current_level` | INTEGER | Game level (1–50) |
| `streak` | INTEGER | Consecutive active days |
| `last_active_at` | TIMESTAMP | Last interaction timestamp (used for streak calculation) |
| `is_onboarded` | BOOLEAN | Onboarding completion flag (enforced by route guards) |
| `primary_stack` | VARCHAR(50) | Selected primary technology stack slug (e.g. `golang`, `react_golang`) |
| `target_timeline` | VARCHAR(50) | Timeline goal: `6_months`, `1_year`, or `exploring` (default: `1_year`) |
| `language_level` | VARCHAR(50) | Target language readiness: `none`, `basic`, `conversational`, `fluent` (default: `none`) |
| `created_at` | TIMESTAMP WITH TIME ZONE | Account creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | Profile last updated timestamp |

---

### `countries`
Master list of destination countries with immigration, market salary, and cultural data.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key (`gen_random_uuid()`) |
| `code` | VARCHAR(10) | Unique country code (`JP`, `DE`, `SG`) |
| `name` | VARCHAR(100) | Country name |
| `flag_emoji` | VARCHAR(10) | Flag display emoji |
| `is_active` | BOOLEAN | Track availability (`true` for JP; `false` for DE/SG) |
| `badge` | VARCHAR(50) | Display badge (e.g. `'Jalur Aktif'`, `'Coming Soon'`) |
| `visa_info` | JSONB | Visa details: `type`, `difficulty`, `language_req`, `key_benefit`, `processing_time` |
| `salary_range` | JSONB | Market salaries: `currency`, `junior`, `mid`, `senior`, `idr_approx` |
| `work_culture` | TEXT | Work culture overview and international engineering environment |
| `created_at` | TIMESTAMP WITH TIME ZONE | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | Last updated timestamp |

---

### `career_paths`
Master list of software engineering career tracks and their available tech stacks.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key (`gen_random_uuid()`) |
| `slug` | VARCHAR(50) | Unique slug (`backend`, `frontend`, `fullstack`, `devops`) |
| `label` | VARCHAR(100) | Display label |
| `description` | TEXT | High-level curriculum and market demand overview |
| `stacks` | JSONB | Array of available stacks: `[{"slug": "...", "label": "...", "is_active": true/false, "badge": "..."}]` |
| `created_at` | TIMESTAMP WITH TIME ZONE | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | Last updated timestamp |

---

### `quests`
Contains all learning quest modules. Seeded and managed for curriculum roadmaps.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key (`gen_random_uuid()`) |
| `title` | VARCHAR(255) | Quest module title |
| `description` | TEXT | Learning objectives and instructions |
| `type` | VARCHAR(20) | `main` (roadmap nodes), `side` (optional), `daily` (rotating challenges) |
| `career_path_id` | UUID (FK) | Which career track this quest belongs to |
| `country_id` | UUID (FK) | Target country requirement (NULL = global/universal) |
| `difficulty` | VARCHAR(20) | `beginner`, `intermediate`, `advanced` |
| `xp_reward` | INTEGER | XP awarded upon verified completion |
| `estimated_minutes` | INTEGER | Estimated time commitment |
| `resource_url` | VARCHAR(500) | External reading, repository, or documentation link |
| `order_index` | INTEGER | Sequential order within the skill tree |
| `prerequisites` | UUID[] | Array of quest IDs required before this node unlocks |
| `is_active` | BOOLEAN | Whether quest is currently published |
| `created_at` | TIMESTAMP WITH TIME ZONE | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | Last updated timestamp |

---

### `user_quests`
Junction table tracking each user's progress through the quest roadmap.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key (`gen_random_uuid()`) |
| `user_id` | UUID (FK) | References `users(id)` ON DELETE CASCADE |
| `quest_id` | UUID (FK) | References `quests(id)` ON DELETE CASCADE |
| `status` | VARCHAR(20) | `locked`, `available`, `completed` |
| `completed_at` | TIMESTAMP WITH TIME ZONE | Completion timestamp (NULL if not completed) |
| `created_at` | TIMESTAMP WITH TIME ZONE | Record creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | Status change timestamp |

*Constraint:* `UNIQUE (user_id, quest_id)` prevents duplicate progress records.

---

### `achievements`
Predefined gamification milestones and badges.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key (`gen_random_uuid()`) |
| `name` | VARCHAR(100) | Badge name |
| `description` | TEXT | Criteria for earning the badge |
| `icon` | VARCHAR(50) | Icon identifier |
| `condition_type` | VARCHAR(50) | `quest_count`, `streak`, `level`, `xp` |
| `condition_value` | INTEGER | Threshold value (e.g. 10 quests, 7 days streak) |
| `xp_bonus` | INTEGER | Bonus XP awarded upon unlocking |
| `created_at` | TIMESTAMP WITH TIME ZONE | Creation timestamp |

---

### `user_achievements`
Junction table tracking unlocked badges per user.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key (`gen_random_uuid()`) |
| `user_id` | UUID (FK) | References `users(id)` ON DELETE CASCADE |
| `achievement_id` | UUID (FK) | References `achievements(id)` ON DELETE CASCADE |
| `unlocked_at` | TIMESTAMP WITH TIME ZONE | Unlock timestamp |

*Constraint:* `UNIQUE (user_id, achievement_id)`.

---

### `xp_logs`
Immutable audit log of all XP transactions for anti-cheat verification, streaks, and analytics.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key (`gen_random_uuid()`) |
| `user_id` | UUID (FK) | References `users(id)` ON DELETE CASCADE |
| `amount` | INTEGER | XP gained (positive integer) |
| `source` | VARCHAR(50) | `quest_completed`, `achievement`, `bonus`, `onboarding` |
| `reference_id` | UUID | Reference to `quest_id`, `achievement_id`, or NULL |
| `created_at` | TIMESTAMP WITH TIME ZONE | Timestamp of XP grant |

---

## Indexes & Constraints

```sql
-- Performance Indexes (active from migration 000001)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_quests_career_path ON quests(career_path_id);
CREATE INDEX IF NOT EXISTS idx_quests_type ON quests(type);
CREATE INDEX IF NOT EXISTS idx_user_quests_user_id ON user_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_status ON user_quests(status);
CREATE INDEX IF NOT EXISTS idx_xp_logs_user_id ON xp_logs(user_id);

-- Uniqueness Constraints (enforced at table level)
-- users(email) UNIQUE
-- users(username) UNIQUE
-- countries(code) UNIQUE
-- career_paths(slug) UNIQUE
-- user_quests UNIQUE (user_id, quest_id)
-- user_achievements UNIQUE (user_id, achievement_id)
```

---

## Migration History

| Migration | File | Description |
|---|---|---|
| `000001` | `000001_init_schema` | Initial schema: all core tables (`countries`, `career_paths`, `users`, `quests`, `user_quests`, `achievements`, `user_achievements`, `xp_logs`) and performance indexes |
| `000002` | `000002_seed_and_enhance_onboarding` | Added `countries.is_active`, `countries.badge`, `career_paths.stacks` (JSONB), `users.primary_stack`, plus master seed data for Japan, Germany, and Singapore |
| `000003` | `000003_add_timeline_and_language_to_users` | Added `users.target_timeline` and `users.language_level` to store readiness calibration from Onboarding Step 3 |

---

## Redis Schema

| Key Pattern | Type | TTL | Purpose |
|-------------|------|-----|---------|
| `session:{user_id}` | String | 7 days | Refresh token rotation & session tracking |
| `streak:{user_id}` | Hash | 25h | Daily streak tracking and freeze tokens |
| `daily_quests:{user_id}:{date}` | Set | 25h | Today's active daily quests |
| `user_xp:{user_id}` | String | 1h | Cached user XP for fast UI reads (write-through) |
| `leaderboard` | Sorted Set | - | Global XP leaderboard ranking |
