ALTER TABLE users
  DROP COLUMN IF EXISTS subscription_expires_at,
  DROP COLUMN IF EXISTS subscription_tier;
