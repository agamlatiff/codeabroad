-- ============================================================================
-- Migration: 000012_audit_hardening_and_indexes.down.sql
-- Description: Reverse 000012 hardening & index changes cleanly
-- ============================================================================

DELETE FROM user_badges WHERE badge_key = 'multilingual_explorer';
DELETE FROM badge_definitions WHERE id = 'multilingual_explorer';
UPDATE badge_definitions SET title = 'Penjelajah Akihabara' WHERE id = 'akihabara_novice';

DELETE FROM user_activity_logs WHERE activity_type = 'badge_unlocked';
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
        'onboarding_completed'
    ));

DROP INDEX IF EXISTS idx_user_lesson_progress_completed_active;
DROP INDEX IF EXISTS idx_user_activity_logs_created_at;
DROP INDEX IF EXISTS idx_user_activity_logs_user_type_created;

CREATE INDEX IF NOT EXISTS idx_languages_code ON languages(code);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

DROP INDEX IF EXISTS uq_user_active_language;

ALTER TABLE user_daily_chest_claims
    ALTER COLUMN claim_date SET DEFAULT CURRENT_DATE;

ALTER TABLE user_gamification
    DROP CONSTRAINT IF EXISTS chk_user_gamification_gems_non_negative,
    DROP CONSTRAINT IF EXISTS chk_user_gamification_streak_non_negative,
    DROP CONSTRAINT IF EXISTS chk_user_gamification_level_min_one,
    DROP CONSTRAINT IF EXISTS chk_user_gamification_xp_non_negative;

ALTER TABLE user_profiles
    DROP COLUMN IF EXISTS avatar_url;
