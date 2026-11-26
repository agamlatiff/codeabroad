-- Migration: 000044_seed_n3_curriculum.down.sql
-- Description: Remove JLPT N3 curriculum units (cascades to lessons and exercises).

DO $$
DECLARE
    v_level_id uuid;
BEGIN
    SELECT pl.id INTO v_level_id
    FROM proficiency_levels pl
    JOIN languages l ON l.id = pl.language_id
    WHERE l.code = 'ja' AND pl.code = 'N3'
    LIMIT 1;

    IF v_level_id IS NULL THEN
        RETURN;
    END IF;

    DELETE FROM units
    WHERE level_id = v_level_id AND unit_type = 'curriculum';
END $$;
