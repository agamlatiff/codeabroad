-- ============================================================================
-- Migration: 000013_deactivate_languages_without_curriculum.down.sql
-- Description: Restore seed behaviour (all languages active).
-- ============================================================================

UPDATE languages SET is_active = TRUE;
