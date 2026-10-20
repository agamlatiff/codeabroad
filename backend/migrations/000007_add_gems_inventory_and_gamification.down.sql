-- 000007_add_gems_inventory_and_gamification.down.sql
DROP TABLE IF EXISTS coaching_submissions CASCADE;
DROP TABLE IF EXISTS user_daily_chest_claims CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS user_inventories CASCADE;
ALTER TABLE users DROP COLUMN IF EXISTS gems;
