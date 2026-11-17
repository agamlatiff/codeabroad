-- ============================================================================
-- Migration: 000013_deactivate_languages_without_curriculum.up.sql
-- Description: Only languages that actually have curriculum units are selectable.
-- Languages stay listed (multi-language ready) but show as "Segera Hadir".
-- Re-activate a language with: UPDATE languages SET is_active = TRUE WHERE code = '<code>';
-- ============================================================================

UPDATE languages l
SET is_active = EXISTS (
    SELECT 1
    FROM units u
    JOIN proficiency_levels pl ON pl.id = u.level_id
    WHERE pl.language_id = l.id
);
