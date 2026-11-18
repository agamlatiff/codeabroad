-- ============================================================================
-- Migration: 000015_expand_jlpt_n5_curriculum.down.sql
-- Description: Reverse 000015 JLPT N5 curriculum expansion cleanly
-- ============================================================================

-- Remove top-up exercises added to pre-existing lessons & readiness exam
DELETE FROM exercises
WHERE id IN (
    'c0000015-0000-0000-0000-000000000001'::uuid,
    'c0000015-0000-0000-0000-000000000002'::uuid,
    'c0000015-0000-0000-0000-000000000003'::uuid,
    'c0000015-0000-0000-0000-000000000004'::uuid,
    'c0000015-0000-0000-0000-000000000005'::uuid,
    'c0000015-0000-0000-0000-000000000006'::uuid,
    'c0000015-0000-0000-0000-000000000007'::uuid
);

-- Remove the 24 new lessons (cascades their exercises)
DELETE FROM lessons
WHERE id IN (
    'b0000001-0000-0000-0000-000000000008'::uuid,
    'b0000001-0000-0000-0000-000000000009'::uuid,
    'b0000001-0000-0000-0000-000000000010'::uuid,
    'b0000001-0000-0000-0000-000000000011'::uuid,
    'b0000001-0000-0000-0000-000000000012'::uuid,
    'b0000001-0000-0000-0000-000000000013'::uuid,
    'b0000001-0000-0000-0000-000000000014'::uuid,
    'b0000001-0000-0000-0000-000000000015'::uuid,
    'b0000001-0000-0000-0000-000000000016'::uuid,
    'b0000001-0000-0000-0000-000000000017'::uuid,
    'b0000001-0000-0000-0000-000000000018'::uuid,
    'b0000001-0000-0000-0000-000000000019'::uuid,
    'b0000001-0000-0000-0000-000000000020'::uuid,
    'b0000001-0000-0000-0000-000000000021'::uuid,
    'b0000001-0000-0000-0000-000000000022'::uuid,
    'b0000001-0000-0000-0000-000000000023'::uuid,
    'b0000001-0000-0000-0000-000000000024'::uuid,
    'b0000001-0000-0000-0000-000000000025'::uuid,
    'b0000001-0000-0000-0000-000000000026'::uuid,
    'b0000001-0000-0000-0000-000000000027'::uuid,
    'b0000001-0000-0000-0000-000000000028'::uuid,
    'b0000001-0000-0000-0000-000000000029'::uuid,
    'b0000001-0000-0000-0000-000000000030'::uuid,
    'b0000001-0000-0000-0000-000000000031'::uuid
);

-- Remove Units 5..8
DELETE FROM units
WHERE id IN (
    'a0000001-0000-0000-0000-000000000005'::uuid,
    'a0000001-0000-0000-0000-000000000006'::uuid,
    'a0000001-0000-0000-0000-000000000007'::uuid,
    'a0000001-0000-0000-0000-000000000008'::uuid
);

-- Remove N5 Grammar Points 009..016
DELETE FROM grammar_points
WHERE code IN (
    'GP-JA-N5-009', 'GP-JA-N5-010', 'GP-JA-N5-011', 'GP-JA-N5-012',
    'GP-JA-N5-013', 'GP-JA-N5-014', 'GP-JA-N5-015', 'GP-JA-N5-016'
);

-- Restore original unit order_index and titles
UPDATE units
SET order_index = 2
WHERE id = 'a0000001-0000-0000-0000-000000000002'::uuid;

UPDATE units
SET order_index = 0,
    title = 'Unit 0: Gerbang Aksara & Salam Pertama (Zero-Beginner)'
WHERE id = 'a0000002-0000-0000-0000-000000000002'::uuid;

UPDATE units
SET order_index = 1,
    title = 'Unit 1: Pondasi Kalimat & Identitas Diri'
WHERE id = 'a0000001-0000-0000-0000-000000000001'::uuid;

UPDATE units
SET order_index = 3,
    title = 'Unit 3: Aktivitas Harian & Konsumsi (Makanan, Minuman & Kerja)'
WHERE id = 'a0000001-0000-0000-0000-000000000003'::uuid;

UPDATE units
SET order_index = 4,
    title = 'Unit 4: Waktu, Mobilitas & Komuter Kantor (Transportasi & Jam)'
WHERE id = 'a0000001-0000-0000-0000-000000000004'::uuid;
