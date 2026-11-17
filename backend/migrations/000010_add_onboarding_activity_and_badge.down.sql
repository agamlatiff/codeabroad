DELETE FROM user_activity_logs WHERE activity_type = 'onboarding_completed';

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
        'daily_vocab_quest_claim'
    ));
