-- ============================================================================
-- Migration: 000019_expand_grammar_points_n5_to_n1.down.sql
-- ============================================================================

DELETE FROM grammar_points WHERE id::text LIKE 'd1000019-0000-0000-0000-%';
ALTER TABLE grammar_points DROP COLUMN IF EXISTS examples;
