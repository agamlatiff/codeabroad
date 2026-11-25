-- ============================================================================
-- Migration: 000040_add_oauth_accounts.down.sql
-- Description: Revert OAuth 2.0 accounts table and restore password_hash constraint
-- ============================================================================

DROP TABLE IF EXISTS user_oauth_accounts;
UPDATE users SET password_hash = '' WHERE password_hash IS NULL;
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;
