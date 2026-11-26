-- ============================================================================
-- Migration: 000049_deepen_n2_n1_curriculum_and_exams.down.sql
-- Description: Cleanly revert migration 000049 (remove N2/N1 diagnostic exams,
--              40 added curriculum lessons, order_index 7-8 extension exercises,
--              and restore existing tes-akhir lessons back to order_index = 5).
-- ============================================================================

DO $$
DECLARE
    v_n2_level_id uuid;
    v_n1_level_id uuid;
BEGIN
    SELECT pl.id INTO v_n2_level_id
    FROM proficiency_levels pl
    JOIN languages l ON l.id = pl.language_id
    WHERE l.code = 'ja' AND pl.code = 'N2'
    LIMIT 1;

    SELECT pl.id INTO v_n1_level_id
    FROM proficiency_levels pl
    JOIN languages l ON l.id = pl.language_id
    WHERE l.code = 'ja' AND pl.code = 'N1'
    LIMIT 1;

    DELETE FROM units
    WHERE level_id IN (v_n2_level_id, v_n1_level_id)
      AND unit_type = 'diagnostic_exam'
      AND order_index = 99;

    DELETE FROM lessons
    WHERE slug LIKE 'n2-%-baca-konteks'
       OR slug LIKE 'n2-%-praktik-terpadu'
       OR slug LIKE 'n1-%-baca-konteks'
       OR slug LIKE 'n1-%-praktik-terpadu';

    DELETE FROM exercises
    WHERE order_index IN (7, 8)
      AND lesson_id IN (
          SELECT id FROM lessons
          WHERE slug LIKE 'n2-u%' OR slug LIKE 'n1-u%'
      );

    UPDATE lessons
    SET order_index = 5
    WHERE slug LIKE 'n2-u%-tes-akhir'
       OR slug LIKE 'n1-u%-tes-akhir';
END $$;
