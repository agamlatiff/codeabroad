BEGIN;

DROP TABLE IF EXISTS user_monthly_badge_claims;

ALTER TABLE user_gamification
  DROP COLUMN IF EXISTS xp_booster_expires_at;

COMMIT;
