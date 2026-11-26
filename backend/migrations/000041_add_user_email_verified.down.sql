-- ============================================================================
-- Migration: 000041_add_user_email_verified.down.sql
-- Description: Revert email_verified column on users table
-- ============================================================================

BEGIN;

ALTER TABLE users DROP COLUMN IF EXISTS email_verified;

COMMIT;
