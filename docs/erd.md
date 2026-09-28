# Entity Relationship Diagram (ERD)
# CodeAbroad

**Version:** 1.0  
**Last Updated:** 2026-09-28  
**Database:** PostgreSQL

---

## Diagram

```
┌─────────────────────┐         ┌─────────────────────────┐
│        users        │         │      career_paths        │
├─────────────────────┤         ├─────────────────────────┤
│ id (PK)             │         │ id (PK)                  │
│ name                │    ┌───>│ slug (frontend/backend…) │
│ username (UNIQUE)   │    │    │ label                    │
│ email (UNIQUE)      │    │    │ description              │
│ password_hash       │    │    └─────────────────────────┘
│ avatar_url          │    │
│ bio                 │    │    ┌─────────────────────────┐
│ github_url          │    │    │        countries         │
│ linkedin_url        │    │    ├─────────────────────────┤
│ career_path_id (FK) │────┘    │ id (PK)                  │
│ country_id (FK)     │────┐    │ code (JP/DE/SG)          │
│ level               │    │    │ name                     │
│ xp                  │    └───>│ flag_emoji               │
│ current_level       │         │ visa_info (JSONB)        │
│ streak              │         │ salary_range (JSONB)     │
│ last_active_at      │         │ work_culture (text)      │
│ is_onboarded        │         └─────────────────────────┘
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
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
           └──────────────────────────────────────────────┘

┌─────────────────────┐         ┌─────────────────────────┐
│    achievements     │         │    user_achievements     │
├─────────────────────┤         ├─────────────────────────┤
│ id (PK)             │<────────│ id (PK)                  │
│ name                │         │ user_id (FK → users.id)  │
│ description         │         │ achievement_id (FK)      │
│ icon                │         │ unlocked_at              │
│ condition_type      │         └─────────────────────────┘
│ condition_value     │
│ xp_bonus            │
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
Stores all registered users and their current game state.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `name` | VARCHAR(100) | Display name |
| `username` | VARCHAR(50) | Unique handle e.g. `@rizki_dev` |
| `email` | VARCHAR(255) | Unique, used for login |
| `password_hash` | VARCHAR(255) | Bcrypt hashed |
| `avatar_url` | VARCHAR(500) | Profile photo URL, nullable |
| `bio` | TEXT | Short self-description, nullable |
| `github_url` | VARCHAR(255) | GitHub profile URL, nullable |
| `linkedin_url` | VARCHAR(255) | LinkedIn profile URL, nullable |
| `career_path_id` | UUID (FK) | Selected career path |
| `country_id` | UUID (FK) | Target country |
| `level` | VARCHAR(20) | beginner / intermediate |
| `xp` | INTEGER | Total accumulated XP |
| `current_level` | INTEGER | Game level (1-50) |
| `streak` | INTEGER | Current streak in days |
| `last_active_at` | TIMESTAMP | For streak calculation |
| `is_onboarded` | BOOLEAN | Whether onboarding is complete |

---

### `quests`
Contains all quest content. Seeded and managed by admins.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `type` | ENUM | main / side / daily |
| `career_path_id` | UUID (FK) | Which career path this belongs to |
| `country_id` | UUID (FK) | NULL = applies to all countries |
| `xp_reward` | INTEGER | XP earned on completion |
| `order_index` | INTEGER | Order within the path |
| `prerequisites` | UUID[] | Array of quest IDs required before this |

---

### `user_quests`
Junction table tracking each user's progress per quest.

| Column | Type | Notes |
|--------|------|-------|
| `status` | ENUM | locked / available / completed |
| `completed_at` | TIMESTAMP | NULL if not completed |

---

### `achievements`
Predefined milestone badges.

| Column | Type | Notes |
|--------|------|-------|
| `condition_type` | VARCHAR | quest_count / streak / level / xp |
| `condition_value` | INTEGER | e.g., 10 (complete 10 quests) |
| `xp_bonus` | INTEGER | Bonus XP for unlocking |

---

### `xp_logs`
Immutable audit log of all XP earned. Used for analytics and debugging.

---

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_user_quests_user_id ON user_quests(user_id);
CREATE INDEX idx_user_quests_status ON user_quests(status);
CREATE INDEX idx_quests_career_path ON quests(career_path_id);
CREATE INDEX idx_quests_type ON quests(type);
CREATE INDEX idx_xp_logs_user_id ON xp_logs(user_id);
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_user_achievements ON user_achievements(user_id, achievement_id);
```

---

## Redis Schema

| Key Pattern | Type | TTL | Purpose |
|-------------|------|-----|---------|
| `session:{user_id}` | String | 7 days | Refresh token |
| `streak:{user_id}` | Hash | 25h | Streak tracking |
| `daily_quests:{user_id}:{date}` | Set | 25h | Today's daily quests |
| `user_xp:{user_id}` | String | 1h | Cached XP (write-through) |
| `leaderboard` | Sorted Set | - | XP leaderboard (future) |
