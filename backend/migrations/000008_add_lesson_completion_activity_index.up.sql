-- Add partial expression index for fast per-user/per-lesson completion cutoff and daily replay XP cap queries
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_lesson_completed
    ON user_activity_logs (user_id, (metadata->>'lesson_id'), created_at DESC)
    WHERE activity_type = 'lesson_completed';
