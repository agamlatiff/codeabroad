-- ============================================================================
-- Rollback Migration 000043: Remove JLPT N4 Curriculum Units
-- ============================================================================

DELETE FROM units
WHERE unit_type = 'curriculum'
  AND level_id = (
      SELECT pl.id
      FROM proficiency_levels pl
      JOIN languages l ON l.id = pl.language_id
      WHERE l.code = 'ja' AND pl.code = 'N4'
      LIMIT 1
  );
