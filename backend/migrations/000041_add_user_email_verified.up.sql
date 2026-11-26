-- ============================================================================
-- Migration: 000041_add_user_email_verified.up.sql
-- Description: Track verified email ownership to prevent unverified OAuth auto-link pre-hijacking
-- ============================================================================

BEGIN;

ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE users u
SET email_verified = TRUE
FROM user_oauth_accounts uoa
WHERE uoa.user_id = u.id;

COMMIT;
