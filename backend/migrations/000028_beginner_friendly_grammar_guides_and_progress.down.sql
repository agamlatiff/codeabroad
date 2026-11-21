-- ============================================================================
-- Migration: 000028_beginner_friendly_grammar_guides_and_progress.down.sql
-- ============================================================================

BEGIN;
DROP TABLE IF EXISTS user_grammar_progress;
ALTER TABLE grammar_points DROP COLUMN IF EXISTS learning_guide;
COMMIT;
