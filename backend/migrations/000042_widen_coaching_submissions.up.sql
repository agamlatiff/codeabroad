-- ============================================================================
-- Migration: 000042_widen_coaching_submissions.up.sql
-- Description: Align coaching_submissions column lengths with DTO validation limits (120/500)
-- ============================================================================

BEGIN;

ALTER TABLE coaching_submissions
    ALTER COLUMN target_role TYPE VARCHAR(120),
    ALTER COLUMN github_url TYPE VARCHAR(500),
    ALTER COLUMN resume_url TYPE VARCHAR(500),
    ALTER COLUMN focus_topic TYPE VARCHAR(120),
    ALTER COLUMN preferred_time TYPE VARCHAR(120);

COMMIT;
