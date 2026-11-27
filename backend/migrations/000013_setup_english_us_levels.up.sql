-- Activate American English (en-us) and replace legacy 3-tier TOEFL placeholders
-- with full 6-level CEFR A1-C2 / TOEFL iBT proficiency progression.

UPDATE languages
SET is_active = true,
    name = 'Inggris (American)'
WHERE id = 'd0e37fce-33c2-4091-afc7-131867f5d20d';

INSERT INTO proficiency_levels (
    id,
    language_id,
    code,
    name,
    tier,
    official_exam_name,
    passing_score_percent,
    order_index
) VALUES
    ('e1000001-0000-4000-8000-000000000001', 'd0e37fce-33c2-4091-afc7-131867f5d20d', 'A1', 'CEFR A1 (Pra-TOEFL Dasar)', 'beginner', 'TOEFL iBT', 60, 1),
    ('e1000001-0000-4000-8000-000000000002', 'd0e37fce-33c2-4091-afc7-131867f5d20d', 'A2', 'CEFR A2 (TOEFL 32-41)', 'beginner', 'TOEFL iBT', 60, 2),
    ('e1000001-0000-4000-8000-000000000003', 'd0e37fce-33c2-4091-afc7-131867f5d20d', 'B1', 'CEFR B1 (TOEFL 42-71)', 'intermediate', 'TOEFL iBT', 65, 3),
    ('e1000001-0000-4000-8000-000000000004', 'd0e37fce-33c2-4091-afc7-131867f5d20d', 'B2', 'CEFR B2 (TOEFL 72-94)', 'intermediate', 'TOEFL iBT', 65, 4),
    ('e1000001-0000-4000-8000-000000000005', 'd0e37fce-33c2-4091-afc7-131867f5d20d', 'C1', 'CEFR C1 (TOEFL 95-114)', 'advanced', 'TOEFL iBT', 70, 5),
    ('e1000001-0000-4000-8000-000000000006', 'd0e37fce-33c2-4091-afc7-131867f5d20d', 'C2', 'CEFR C2 (TOEFL 115-120)', 'advanced', 'TOEFL iBT', 75, 6)
ON CONFLICT (id) DO UPDATE SET
    language_id = EXCLUDED.language_id,
    code = EXCLUDED.code,
    name = EXCLUDED.name,
    tier = EXCLUDED.tier,
    official_exam_name = EXCLUDED.official_exam_name,
    passing_score_percent = EXCLUDED.passing_score_percent,
    order_index = EXCLUDED.order_index;

-- Safely remap any legacy 3-tier TOEFL enrollments/exam attempts before removing unused placeholder rows
UPDATE user_language_enrollments
SET current_level_id = 'e1000001-0000-4000-8000-000000000001'
WHERE current_level_id = 'd830e1e6-1b30-4f45-8b1f-e4be44e095a3';

UPDATE user_language_enrollments
SET current_level_id = 'e1000001-0000-4000-8000-000000000003'
WHERE current_level_id = 'cc7e7ae5-89f2-4507-be40-d2e72ab99752';

UPDATE user_language_enrollments
SET current_level_id = 'e1000001-0000-4000-8000-000000000005'
WHERE current_level_id = '462ee974-89af-4b34-ae40-2c295a93a416';

UPDATE readiness_exam_attempts
SET level_id = 'e1000001-0000-4000-8000-000000000001'
WHERE level_id = 'd830e1e6-1b30-4f45-8b1f-e4be44e095a3';

UPDATE readiness_exam_attempts
SET level_id = 'e1000001-0000-4000-8000-000000000003'
WHERE level_id = 'cc7e7ae5-89f2-4507-be40-d2e72ab99752';

UPDATE readiness_exam_attempts
SET level_id = 'e1000001-0000-4000-8000-000000000005'
WHERE level_id = '462ee974-89af-4b34-ae40-2c295a93a416';

DELETE FROM proficiency_levels
WHERE id IN (
    'd830e1e6-1b30-4f45-8b1f-e4be44e095a3',
    'cc7e7ae5-89f2-4507-be40-d2e72ab99752',
    '462ee974-89af-4b34-ae40-2c295a93a416'
);
