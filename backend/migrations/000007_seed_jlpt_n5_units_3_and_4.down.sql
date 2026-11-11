-- ============================================================================
-- Migration: 000007_seed_jlpt_n5_units_3_and_4.down.sql
-- Description: Reversible rollback for JLPT N5 Units 3 & 4
-- Version: CodeAbroad v3.0
-- ============================================================================

DELETE FROM units 
WHERE id IN (
    'a0000001-0000-0000-0000-000000000003'::uuid,
    'a0000001-0000-0000-0000-000000000004'::uuid
);

DELETE FROM grammar_points 
WHERE code IN (
    'GP-JA-N5-006',
    'GP-JA-N5-007',
    'GP-JA-N5-008'
);

