-- ============================================================================
-- Migration: 000014_drop_preferred_roadmap_view.up.sql
-- Description: Remove preferred_roadmap_view column (Peta Belajar is now the sole view)
-- ============================================================================

ALTER TABLE user_profiles
    DROP COLUMN IF EXISTS preferred_roadmap_view;
