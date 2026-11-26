-- ============================================================================
-- Migration: 000040_add_oauth_accounts.down.sql
-- Description: Transactionally revert OAuth 2.0 accounts table and restore password_hash constraint
-- ============================================================================

BEGIN;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE password_hash IS NULL) THEN
        RAISE EXCEPTION 'Cannot rollback 000040_add_oauth_accounts while OAuth-only users without password_hash exist';
    END IF;
END $$;

DROP TABLE IF EXISTS user_oauth_accounts;
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;

COMMIT;
