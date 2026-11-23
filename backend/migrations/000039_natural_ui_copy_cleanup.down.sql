-- ============================================================================
-- Migration: 000039_natural_ui_copy_cleanup.down.sql
-- Description: Revert natural UI copy updates on badge_definitions, lessons & daily quest templates.
-- ============================================================================

UPDATE badge_definitions
SET description = 'Menguasai 25 kartu ingatan Anki SRS secara beruntun dengan retensi tinggi.'
WHERE id = 'srs_veteran';

UPDATE badge_definitions
SET description = 'Mendaftar dan aktif mempelajari lebih dari 1 bahasa di CodeAbroad.'
WHERE id = 'multilingual_explorer';

UPDATE badge_definitions
SET description = 'Meraih skor kelulusan ≥ 60% pada evaluasi ujian sectional Unit 2.'
WHERE id = 'n5_mastery';

UPDATE daily_quest_templates
SET chip_label = 'MEMORI SM-2'
WHERE code = 'dq_fc_remember_3';

UPDATE lessons
SET title = 'Simulasi Sectional N5: Evaluasi Tata Bahasa & Kosakata'
WHERE id = 'b0000001-0000-0000-0000-000000000003';
