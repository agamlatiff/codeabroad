-- ============================================================================
-- Migration: 000039_natural_ui_copy_cleanup.up.sql
-- Description: Replace technical/gimmick terms (Anki SRS, SM-2, sectional, CodeAbroad)
--              in user-facing seeded badge, lesson & quest copy with natural wording.
-- ============================================================================

UPDATE badge_definitions
SET description = 'Menguasai 25 kartu kosakata secara rutin dengan ingatan yang kuat.'
WHERE id = 'srs_veteran';

UPDATE badge_definitions
SET description = 'Mendaftar dan aktif mempelajari lebih dari 1 bahasa di Merantalk.'
WHERE id = 'multilingual_explorer';

UPDATE badge_definitions
SET description = 'Meraih skor kelulusan ≥ 60% pada ujian kesiapan JLPT N5.'
WHERE id = 'n5_mastery';

UPDATE daily_quest_templates
SET chip_label = 'HAFALAN'
WHERE code = 'dq_fc_remember_3';

UPDATE lessons
SET title = 'Simulasi Ujian N5: Tata Bahasa & Kosakata'
WHERE id = 'b0000001-0000-0000-0000-000000000003';
