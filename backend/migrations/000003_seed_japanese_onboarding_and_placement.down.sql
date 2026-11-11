-- ============================================================================
-- Migration: 000003_seed_japanese_onboarding_and_placement.down.sql
-- Description: Reversible rollback for Japanese Onboarding & Placement Seed
-- Version: CodeAbroad v3.0
-- ============================================================================

DELETE FROM units 
WHERE id IN (
    'a0000002-0000-0000-0000-000000000001'::uuid,
    'a0000002-0000-0000-0000-000000000002'::uuid
);

DELETE FROM grammar_points 
WHERE code IN (
    'GP-JA-N5-001',
    'GP-JA-N5-002',
    'GP-JA-N5-003',
    'GP-JA-N5-004',
    'GP-JA-N5-005',
    'GP-JA-N4-001',
    'GP-JA-N4-002',
    'GP-JA-N4-003'
);

