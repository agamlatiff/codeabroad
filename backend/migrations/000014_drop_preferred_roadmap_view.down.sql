-- ============================================================================
-- Migration: 000014_drop_preferred_roadmap_view.down.sql
-- Description: Restore preferred_roadmap_view column on user_profiles
-- ============================================================================

ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS preferred_roadmap_view VARCHAR(20) NOT NULL DEFAULT 'map'
        CHECK (preferred_roadmap_view IN ('map', 'syllabus'));
