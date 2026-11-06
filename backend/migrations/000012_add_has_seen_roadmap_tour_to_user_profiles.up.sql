-- Add has_seen_roadmap_tour to user_profiles table for persistent cross-device onboarding tour
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS has_seen_roadmap_tour BOOLEAN NOT NULL DEFAULT FALSE;

