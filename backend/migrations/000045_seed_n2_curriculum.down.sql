-- ============================================================================
-- Migration: 000045_seed_n2_curriculum.down.sql
-- Description: Remove seeded JLPT N2 curriculum units (cascades to lessons and exercises).
-- ============================================================================

DELETE FROM units
WHERE unit_type = 'curriculum'
  AND level_id = (
      SELECT pl.id
      FROM proficiency_levels pl
      JOIN languages l ON l.id = pl.language_id
      WHERE l.code = 'ja' AND pl.code = 'N2'
      LIMIT 1
  );
