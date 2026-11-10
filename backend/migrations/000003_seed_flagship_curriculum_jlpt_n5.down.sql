-- ============================================================================
-- Migration: 000003_seed_flagship_curriculum_jlpt_n5.down.sql
-- Description: Reversible rollback for JLPT N5 curriculum and exercises
-- Version: CodeAbroad v3.0
-- ============================================================================

DELETE FROM units 
WHERE id IN (
    'a0000001-0000-0000-0000-000000000001'::uuid,
    'a0000001-0000-0000-0000-000000000002'::uuid
);

DELETE FROM grammar_points 
WHERE code IN ('GP-JA-N5-001', 'GP-JA-N5-002');

