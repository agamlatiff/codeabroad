-- Allow onboarding_completed in user_activity_logs and seed akihabara_novice badge
ALTER TABLE user_activity_logs
    DROP CONSTRAINT IF EXISTS user_activity_logs_activity_type_check;

ALTER TABLE user_activity_logs
    ADD CONSTRAINT user_activity_logs_activity_type_check CHECK (activity_type IN (
        'daily_login',
        'lesson_completed',
        'srs_review_completed',
        'readiness_exam_completed',
        'daily_golden_chest_claim',
        'quest_completed',
        'daily_vocab_quest_claim',
        'onboarding_completed'
    ));

INSERT INTO badge_definitions (id, title, description, category, icon, xp_reward)
VALUES (
    'akihabara_novice',
    'Penjelajah Akihabara',
    'Menyelesaikan onboarding dan resmi memulai perjalanan bahasa di CodeAbroad.',
    'milestone',
    'compass',
    0
)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    icon = EXCLUDED.icon,
    xp_reward = EXCLUDED.xp_reward;
