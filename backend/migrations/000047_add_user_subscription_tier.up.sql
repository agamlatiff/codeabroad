ALTER TABLE users
  ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(16) NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'pro')),
  ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;
