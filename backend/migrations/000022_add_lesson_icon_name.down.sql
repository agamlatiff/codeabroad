-- ============================================================================
-- Migration: 000022_add_lesson_icon_name.down.sql
-- ============================================================================

ALTER TABLE lessons DROP COLUMN IF EXISTS icon_name;
