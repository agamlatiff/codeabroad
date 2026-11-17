-- ============================================================================
-- Migration: 000012_audit_hardening_and_indexes.up.sql
-- Description: Add user_profiles.avatar_url, integrity constraints,
--              partial unique active-language index, composite performance indexes,
--              and seed typo / emoji hygiene fixes.
-- ============================================================================

-- 1. Support profile avatar_url across user_profiles & leaderboard queries
ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Clamp any out-of-bounds legacy values before adding CHECK constraints
UPDATE user_gamification
SET xp = GREATEST(0, xp),
    current_level = GREATEST(1, current_level),
    streak = GREATEST(0, streak),
    gems = GREATEST(0, gems)
WHERE xp < 0 OR current_level < 1 OR streak < 0 OR gems < 0;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_user_gamification_xp_non_negative') THEN
        ALTER TABLE user_gamification ADD CONSTRAINT chk_user_gamification_xp_non_negative CHECK (xp >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_user_gamification_level_min_one') THEN
        ALTER TABLE user_gamification ADD CONSTRAINT chk_user_gamification_level_min_one CHECK (current_level >= 1);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_user_gamification_streak_non_negative') THEN
        ALTER TABLE user_gamification ADD CONSTRAINT chk_user_gamification_streak_non_negative CHECK (streak >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_user_gamification_gems_non_negative') THEN
        ALTER TABLE user_gamification ADD CONSTRAINT chk_user_gamification_gems_non_negative CHECK (gems >= 0);
    END IF;
END $$;

-- 3. Default daily chest claim_date to Asia/Jakarta (WIB) date rather than container UTC
ALTER TABLE user_daily_chest_claims
    ALTER COLUMN claim_date SET DEFAULT (NOW() AT TIME ZONE 'Asia/Jakarta')::date;

-- 4. Guarantee at most one active language enrollment per user
WITH ranked_active AS (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY enrolled_at DESC, id ASC) AS rn
    FROM user_language_enrollments
    WHERE is_active = TRUE
)
UPDATE user_language_enrollments ule
SET is_active = FALSE
FROM ranked_active ra
WHERE ule.id = ra.id AND ra.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_active_language
    ON user_language_enrollments (user_id)
    WHERE is_active = TRUE;

-- 5. Drop redundant indexes already backed by UNIQUE constraints
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_user_profiles_username;
DROP INDEX IF EXISTS idx_languages_code;

-- 6. Add composite / partial indexes for activity, daily rewards & leaderboard scans
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_type_created
    ON user_activity_logs (user_id, activity_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at
    ON user_activity_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_completed_active
    ON user_lesson_progress (user_id, completed_at DESC)
    WHERE is_completed = TRUE AND is_skipped = FALSE;

-- 7. Seed data fixes (non-destructive updates)
-- Separate diagnostic placement unit order from Unit 0 curriculum
UPDATE units
SET order_index = -1
WHERE id = 'a0000002-0000-0000-0000-000000000001'::uuid
  AND unit_type = 'diagnostic_exam'
  AND order_index = 0;

-- Fix mixed Romaji distractor in placement Q9 ("demo" -> "でも")
UPDATE exercises
SET content = jsonb_set(content, '{options}', '["から", "けど", "でも", "なら"]'::jsonb),
    diagnostic_rubric = (COALESCE(diagnostic_rubric, '{}'::jsonb) - 'demo')
        || '{"でも": "Demo adalah kata sambung pengantar di awal kalimat baru."}'::jsonb
WHERE lesson_id = 'b0000002-0000-0000-0000-000000000001'::uuid
  AND order_index = 9
  AND content->'options' @> '["demo"]'::jsonb;

-- Fix truncated Japanese distractor in flagship Unit 1 Ex 1 ("ではありませ" -> "ではありません")
UPDATE exercises
SET content = jsonb_set(content, '{tokens}', '["わたし", "は", "エンジニア", "です", "がくせい", "ではありません"]'::jsonb),
    diagnostic_rubric = (COALESCE(diagnostic_rubric, '{}'::jsonb) - 'ではありませ')
        || '{"ではありません": "Bentuk ini merupakan akhiran negatif, sedangkan kalimat yang diminta adalah deklaratif positif."}'::jsonb
WHERE lesson_id = 'b0000001-0000-0000-0000-000000000001'::uuid
  AND order_index = 1
  AND content->'tokens' @> '["ではありませ"]'::jsonb;

-- Align n5_mastery badge description with JLPT N5 passing_score_percent (60%)
UPDATE badge_definitions
SET description = 'Meraih skor kelulusan ≥ 60% pada evaluasi ujian kesiapan JLPT N5.'
WHERE id = 'n5_mastery';

-- Remove raw Unicode emojis from shop_items catalog (Zero Raw Emoji Policy PRD v3.0)
UPDATE shop_items
SET title = CASE id
        WHEN 'streak-freeze' THEN 'Streak Freeze'
        WHEN 'xp-booster' THEN 'XP Booster Potion'
        WHEN 'cv-review' THEN 'Kupon Review CV Global'
        WHEN 'mock-interview' THEN 'Akses VIP Mock Interview'
        ELSE title
    END,
    badge = CASE id
        WHEN 'streak-freeze' THEN 'POPULER'
        WHEN 'xp-booster' THEN 'BOOSTER'
        WHEN 'cv-review' THEN 'KARIER GLOBAL'
        WHEN 'mock-interview' THEN 'EKSKLUSIF'
        ELSE badge
    END
WHERE id IN ('streak-freeze', 'xp-booster', 'cv-review', 'mock-interview');

-- 8. Allow badge_unlocked activity logging and seed universal multi-language badges
ALTER TABLE user_activity_logs
    DROP CONSTRAINT IF EXISTS user_activity_logs_activity_type_check;

ALTER TABLE user_activity_logs
    ADD CONSTRAINT user_activity_logs_activity_type_check CHECK (activity_type IN (
        'daily_login',
        'lesson_completed',
        'srs_review_completed',
        'readiness_exam_completed',
        'daily_golden_chest_claim',
        'quest_completed',
        'daily_vocab_quest_claim',
        'onboarding_completed',
        'badge_unlocked'
    ));

UPDATE badge_definitions
SET title = 'Penjelajah Global'
WHERE id = 'akihabara_novice';

INSERT INTO badge_definitions (id, title, description, category, icon, xp_reward)
VALUES (
    'multilingual_explorer',
    'Penjelajah Multibahasa',
    'Mendaftar pada dua atau lebih bahasa destinasi di CodeAbroad.',
    'milestone',
    'globe',
    50
)
ON CONFLICT (id) DO NOTHING;
