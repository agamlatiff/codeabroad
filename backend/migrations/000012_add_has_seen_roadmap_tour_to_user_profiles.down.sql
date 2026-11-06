-- Rollback has_seen_roadmap_tour from user_profiles table
ALTER TABLE user_profiles
DROP COLUMN IF EXISTS has_seen_roadmap_tour;

