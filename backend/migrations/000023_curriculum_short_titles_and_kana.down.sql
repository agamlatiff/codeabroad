-- ============================================================================
-- Migration: 000023_curriculum_short_titles_and_kana.down.sql
-- Description: Revert kana_characters, user_kana_progress, and lessons.short_title
-- ============================================================================

BEGIN;

DROP INDEX IF EXISTS idx_user_kana_progress_user;
DROP TABLE IF EXISTS user_kana_progress;

DROP INDEX IF EXISTS idx_kana_script_order;
DROP TABLE IF EXISTS kana_characters;

ALTER TABLE lessons
    DROP COLUMN IF EXISTS short_title;

COMMIT;
