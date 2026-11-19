-- ============================================================================
-- Migration: 000020_create_daily_quests.up.sql
-- Description: Add rotating daily quest templates across 3 learning pillars
--              (curriculum, flashcard, practice_xp) and atomic per-user claims.
-- ============================================================================

CREATE TABLE IF NOT EXISTS daily_quest_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(64) NOT NULL UNIQUE,
    slot_category VARCHAR(32) NOT NULL,
    title VARCHAR(160) NOT NULL,
    chip_label VARCHAR(48) NOT NULL,
    metric_type VARCHAR(48) NOT NULL,
    target_value INT NOT NULL DEFAULT 1,
    xp_reward INT NOT NULL DEFAULT 30,
    route VARCHAR(120) NOT NULL DEFAULT '/curriculum',
    icon_name VARCHAR(48) NOT NULL DEFAULT 'book-open',
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_daily_quest_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quest_template_id UUID NOT NULL REFERENCES daily_quest_templates(id) ON DELETE CASCADE,
    claim_date_wib VARCHAR(10) NOT NULL,
    xp_awarded INT NOT NULL DEFAULT 0,
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, quest_template_id, claim_date_wib)
);

CREATE INDEX IF NOT EXISTS idx_user_daily_quest_claims_user_date
    ON user_daily_quest_claims (user_id, claim_date_wib);

INSERT INTO daily_quest_templates (
    code, slot_category, title, chip_label, metric_type, target_value, xp_reward, route, icon_name, sort_order, is_active
) VALUES
    ('dq_lesson_1', 'curriculum', 'Tuntaskan 1 Pelajaran Bahasa', 'PELAJARAN', 'lessons_completed', 1, 50, '/curriculum', 'book-open', 1, true),
    ('dq_lesson_2', 'curriculum', 'Tuntaskan 2 Pelajaran Bahasa', 'PELAJARAN', 'lessons_completed', 2, 70, '/curriculum', 'book-open', 2, true),
    ('dq_lesson_acc85', 'curriculum', 'Lulus 1 Pelajaran Akurasi >= 85%', 'AKURASI', 'high_accuracy_lesson', 1, 60, '/curriculum', 'target', 3, true),
    ('dq_fc_review_3', 'flashcard', 'Ulas 3 Kartu Flashcard', 'KOSAKATA', 'flashcards_reviewed', 3, 30, '/flashcards', 'cards', 4, true),
    ('dq_fc_review_5', 'flashcard', 'Ulas 5 Kartu Flashcard', 'KOSAKATA', 'flashcards_reviewed', 5, 45, '/flashcards', 'cards', 5, true),
    ('dq_fc_remember_3', 'flashcard', 'Ingat 3 Kartu Flashcard', 'MEMORI SM-2', 'flashcards_remembered', 3, 40, '/flashcards', 'translate', 6, true),
    ('dq_xp_50', 'practice_xp', 'Kumpulkan 50 XP Harian', 'TARGET XP', 'xp_earned', 50, 40, '/flashcards', 'lightning', 7, true),
    ('dq_xp_80', 'practice_xp', 'Kumpulkan 80 XP Harian', 'TARGET XP', 'xp_earned', 80, 60, '/flashcards', 'lightning', 8, true),
    ('dq_ex_correct_5', 'practice_xp', 'Jawab Benar 5 Soal Latihan', 'LATIHAN', 'correct_exercises', 5, 45, '/curriculum', 'target', 9, true)
ON CONFLICT (code) DO UPDATE SET
    slot_category = EXCLUDED.slot_category,
    title = EXCLUDED.title,
    chip_label = EXCLUDED.chip_label,
    metric_type = EXCLUDED.metric_type,
    target_value = EXCLUDED.target_value,
    xp_reward = EXCLUDED.xp_reward,
    route = EXCLUDED.route,
    icon_name = EXCLUDED.icon_name,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;
