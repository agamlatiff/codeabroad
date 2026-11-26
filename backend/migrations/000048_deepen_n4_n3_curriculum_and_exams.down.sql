-- Migration: 000048_deepen_n4_n3_curriculum_and_exams.down.sql
-- Description: Revert JLPT N4 and N3 curriculum deepening and Readiness Mock Exams.

DO $$
DECLARE
    v_n4_level_id uuid;
    v_n3_level_id uuid;
BEGIN
    SELECT pl.id INTO v_n4_level_id
    FROM proficiency_levels pl
    JOIN languages l ON l.id = pl.language_id
    WHERE l.code = 'ja' AND pl.code = 'N4'
    LIMIT 1;

    SELECT pl.id INTO v_n3_level_id
    FROM proficiency_levels pl
    JOIN languages l ON l.id = pl.language_id
    WHERE l.code = 'ja' AND pl.code = 'N3'
    LIMIT 1;

    IF v_n4_level_id IS NOT NULL THEN
        DELETE FROM units WHERE level_id = v_n4_level_id AND unit_type = 'diagnostic_exam' AND order_index = 99;
        DELETE FROM lessons WHERE slug LIKE 'n4-u%-baca-konteks' OR slug LIKE 'n4-u%-praktik-terpadu';
        DELETE FROM exercises
        WHERE order_index IN (7, 8)
          AND lesson_id IN (SELECT id FROM lessons WHERE slug LIKE 'n4-u%');
        UPDATE lessons SET order_index = 5 WHERE slug LIKE 'n4-u%-tes-akhir';
    END IF;

    IF v_n3_level_id IS NOT NULL THEN
        DELETE FROM units WHERE level_id = v_n3_level_id AND unit_type = 'diagnostic_exam' AND order_index = 99;
        DELETE FROM lessons WHERE slug LIKE 'n3-u%-baca-konteks' OR slug LIKE 'n3-u%-praktik-terpadu';
        DELETE FROM exercises
        WHERE order_index IN (7, 8)
          AND lesson_id IN (SELECT id FROM lessons WHERE slug LIKE 'n3-u%');
        UPDATE lessons SET order_index = 5 WHERE slug LIKE 'n3-u%-tes-akhir';
    END IF;
END $$;
