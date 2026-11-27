-- Revert American English (en-us) 6-level CEFR A1-C2 setup back to legacy 3-tier TOEFL placeholders

INSERT INTO proficiency_levels ("id", "language_id", "code", "name", "tier", "official_exam_name", "passing_score_percent", "order_index")
VALUES
    ('d830e1e6-1b30-4f45-8b1f-e4be44e095a3', 'd0e37fce-33c2-4091-afc7-131867f5d20d', 'TOEFL_FOUNDATION', 'TOEFL Foundation (Score 40 - 60)', 'beginner', 'TOEFL iBT', 60, 1),
    ('cc7e7ae5-89f2-4507-be40-d2e72ab99752', 'd0e37fce-33c2-4091-afc7-131867f5d20d', 'TOEFL_INTERMEDIATE', 'TOEFL Intermediate (Score 61 - 90)', 'intermediate', 'TOEFL iBT', 65, 2),
    ('462ee974-89af-4b34-ae40-2c295a93a416', 'd0e37fce-33c2-4091-afc7-131867f5d20d', 'TOEFL_ADVANCED', 'TOEFL Advanced (Score 91 - 120)', 'advanced', 'TOEFL iBT', 75, 3)
ON CONFLICT DO NOTHING;

UPDATE user_language_enrollments
SET current_level_id = 'd830e1e6-1b30-4f45-8b1f-e4be44e095a3'
WHERE current_level_id IN ('e1000001-0000-4000-8000-000000000001', 'e1000001-0000-4000-8000-000000000002');

UPDATE user_language_enrollments
SET current_level_id = 'cc7e7ae5-89f2-4507-be40-d2e72ab99752'
WHERE current_level_id IN ('e1000001-0000-4000-8000-000000000003', 'e1000001-0000-4000-8000-000000000004');

UPDATE user_language_enrollments
SET current_level_id = '462ee974-89af-4b34-ae40-2c295a93a416'
WHERE current_level_id IN ('e1000001-0000-4000-8000-000000000005', 'e1000001-0000-4000-8000-000000000006');

DELETE FROM proficiency_levels
WHERE id IN (
    'e1000001-0000-4000-8000-000000000001',
    'e1000001-0000-4000-8000-000000000002',
    'e1000001-0000-4000-8000-000000000003',
    'e1000001-0000-4000-8000-000000000004',
    'e1000001-0000-4000-8000-000000000005',
    'e1000001-0000-4000-8000-000000000006'
);

UPDATE languages
SET is_active = false
WHERE id = 'd0e37fce-33c2-4091-afc7-131867f5d20d';
