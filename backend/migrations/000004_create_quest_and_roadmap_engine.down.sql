-- ============================================================================
-- Migration 000004 Down: Revert Quest and Roadmap Engine
-- ============================================================================

-- Delete seeded quests
DELETE FROM quests WHERE id IN (
    'd1000001-0000-0000-0000-000000000001',
    'd2000001-0000-0000-0000-000000000001',
    'd3000001-0000-0000-0000-000000000001',
    'e0000001-0000-0000-0000-000000000001',
    'e0000002-0000-0000-0000-000000000002',
    'e0000003-0000-0000-0000-000000000003',
    'e0000004-0000-0000-0000-000000000004',
    'e0000005-0000-0000-0000-000000000005',
    'e0000006-0000-0000-0000-000000000006',
    'e0000007-0000-0000-0000-000000000007',
    'e0000008-0000-0000-0000-000000000008',
    'e0000009-0000-0000-0000-000000000009',
    'e0000010-0000-0000-0000-000000000010'
);

-- Drop columns from user_quests
ALTER TABLE user_quests
    DROP COLUMN IF EXISTS code_submission,
    DROP COLUMN IF EXISTS tests_passed,
    DROP COLUMN IF EXISTS total_tests;

-- Drop columns from quests
ALTER TABLE quests
    DROP COLUMN IF EXISTS chapter_id,
    DROP COLUMN IF EXISTS chip_label,
    DROP COLUMN IF EXISTS story_context,
    DROP COLUMN IF EXISTS nihongo_notes,
    DROP COLUMN IF EXISTS acceptance_criteria,
    DROP COLUMN IF EXISTS starter_code,
    DROP COLUMN IF EXISTS test_suite;

-- Drop roadmap hierarchy tables
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS stations CASCADE;
DROP TABLE IF EXISTS roadmaps CASCADE;
