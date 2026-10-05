-- Rollback Migration 000003
ALTER TABLE users 
DROP COLUMN IF EXISTS target_timeline,
DROP COLUMN IF EXISTS language_level;
