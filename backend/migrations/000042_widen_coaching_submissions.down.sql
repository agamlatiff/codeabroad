-- ============================================================================
-- Migration: 000042_widen_coaching_submissions.down.sql
-- Description: Revert coaching_submissions column lengths safely to 100/255
-- ============================================================================

BEGIN;

ALTER TABLE coaching_submissions
    ALTER COLUMN target_role TYPE VARCHAR(100) USING LEFT(target_role, 100),
    ALTER COLUMN github_url TYPE VARCHAR(255) USING LEFT(github_url, 255),
    ALTER COLUMN resume_url TYPE VARCHAR(255) USING LEFT(resume_url, 255),
    ALTER COLUMN focus_topic TYPE VARCHAR(100) USING LEFT(focus_topic, 100),
    ALTER COLUMN preferred_time TYPE VARCHAR(100) USING LEFT(preferred_time, 100);

COMMIT;
