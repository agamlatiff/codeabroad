BEGIN;

-- ============================================================================
-- 1. Weekly Leaderboard Top-3 Gems Rewards & Activity Log Constraints (Finding #5)
-- ============================================================================
CREATE TABLE IF NOT EXISTS leaderboard_weekly_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    season_year INTEGER NOT NULL,
    season_week INTEGER NOT NULL,
    division VARCHAR(32) NOT NULL CHECK (division IN ('bronze', 'silver', 'gold', 'diamond')),
    rank INTEGER NOT NULL CHECK (rank BETWEEN 1 AND 3),
    weekly_xp INTEGER NOT NULL DEFAULT 0,
    gems_awarded INTEGER NOT NULL CHECK (gems_awarded > 0),
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_leaderboard_weekly_rewards_user_season UNIQUE (user_id, season_year, season_week)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly_rewards_user
    ON leaderboard_weekly_rewards (user_id, season_year DESC, season_week DESC);

ALTER TABLE user_activity_logs
    DROP CONSTRAINT IF EXISTS user_activity_logs_activity_type_check;

ALTER TABLE user_activity_logs
    ADD CONSTRAINT user_activity_logs_activity_type_check CHECK (activity_type::text = ANY (ARRAY[
        'daily_login',
        'lesson_completed',
        'srs_review_completed',
        'readiness_exam_completed',
        'daily_golden_chest_claim',
        'quest_completed',
        'daily_vocab_quest_claim',
        'onboarding_completed',
        'badge_unlocked',
        'streak_freeze_consumed',
        'leaderboard_reward_claimed'
    ]::text[]));

-- ============================================================================
-- 2. Fix expected_transcript Romaji mismatch on speaking_repeat (Finding #1)
-- ============================================================================
UPDATE exercises e
SET correct_answer = '{"expected_transcript": "つき"}'::jsonb
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-unit2-kosakata-gabungan'
  AND e.order_index = 7
  AND e.exercise_type = 'speaking_repeat';

-- ============================================================================
-- 3. Fix 6 Pedagogical / Japanese Language Bugs & Prompt Leak (Findings #2 & #4)
-- ============================================================================
-- 3a. Contradictory prompt asking for とき while audio uses から
UPDATE exercises e
SET prompt = 'Dengarkan kalimat alasan sebab-akibat (から) ini dan pilih arti yang tepat:'
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-sebelum-maeni-dan-ketika-toki'
  AND e.order_index = 7
  AND e.exercise_type = 'listening_choice';

-- 3b. Contradiction between ななじはん (display/audio) and shichiji-han (romaji) -> standardize to しちじはん
UPDATE exercises e
SET prompt = 'Ucapkan waktu ''いま しちじはん です'' (Sekarang pukul 07.30):',
    content = jsonb_set(
        jsonb_set(e.content, '{display_text}', '"いま しちじはん です"'::jsonb),
        '{audio_text}',
        '"いま しちじはん です"'::jsonb
    ),
    correct_answer = '{"expected_transcript": "いま しちじはん です"}'::jsonb,
    acceptable_answers = '[["いま ななじはん です"], ["今七時半です"], ["今7時半です"]]'::jsonb
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-u10-menit-pun-dan-setengah-han'
  AND e.order_index = 7
  AND e.exercise_type = 'speaking_repeat';

-- 3c. Non-standard なに ですか -> standardize to なん ですか (3 exercises)
UPDATE exercises e
SET content = jsonb_set(e.content, '{audio_text}', '"これ は なん ですか"'::jsonb),
    explanation = 'これ は なん ですか (kore wa nan desu ka) berarti ''Ini apa?'' (sebelum です, 何 dibaca なん).'
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-unit2-praktik-4-keterampilan'
  AND e.order_index = 6
  AND e.exercise_type = 'listening_choice';

UPDATE exercises e
SET prompt = 'Tanyakan ''これ は なん ですか'' (Ini apa?):',
    content = jsonb_set(
        jsonb_set(
            jsonb_set(e.content, '{display_text}', '"これ は なん ですか"'::jsonb),
            '{audio_text}',
            '"これ は なん ですか"'::jsonb
        ),
        '{romaji}',
        '"kore wa nan desu ka"'::jsonb
    ),
    correct_answer = '{"expected_transcript": "これ は なん ですか"}'::jsonb,
    acceptable_answers = '[["これは何ですか"]]'::jsonb
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-unit2-praktik-4-keterampilan'
  AND e.order_index = 8
  AND e.exercise_type = 'speaking_repeat';

UPDATE exercises e
SET prompt = 'Tanyakan ''あれ は なん ですか'' (Itu apa?):',
    content = jsonb_set(
        jsonb_set(
            jsonb_set(e.content, '{display_text}', '"あれ は なん ですか"'::jsonb),
            '{audio_text}',
            '"あれ は なん ですか"'::jsonb
        ),
        '{romaji}',
        '"are wa nan desu ka"'::jsonb
    ),
    correct_answer = '{"expected_transcript": "あれ は なん ですか"}'::jsonb,
    acceptable_answers = '[["あれは何ですか"]]'::jsonb,
    explanation = 'Lafalkan are wa nan desu ka (sebelum です, 何 dibaca なん).'
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-unit4-kalimat-are-identitas'
  AND e.order_index = 6
  AND e.exercise_type = 'speaking_repeat';

-- 3d. Single-token sentence_builder trap on Unit 1 Lesson 1 #1
UPDATE exercises e
SET prompt = 'Susun salam perkenalan lengkap: "Senang bertemu pertama kali, mohon bantuannya."',
    content = jsonb_set(
        jsonb_set(e.content, '{romaji}', '"Hajimemashite, douzo yoroshiku onegaishimasu."'::jsonb),
        '{target_translation}',
        '"Senang bertemu pertama kali, mohon bantuannya."'::jsonb
    ),
    correct_answer = '["はじめまして", "どうぞ", "よろしく", "おねがいします"]'::jsonb,
    acceptable_answers = '[["初めまして", "どうぞ", "よろしく", "おねがいします"], ["はじめまして", "よろしく", "おねがいします"]]'::jsonb,
    explanation = '「はじめまして、どうぞよろしくおねがいします」(Hajimemashite, douzo yoroshiku onegaishimasu) adalah salam perkenalan sopan yang paling umum di Jepang.'
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-salam-pertama-aisatsu'
  AND e.order_index = 1
  AND e.exercise_type = 'sentence_builder';

-- 3e. Verbatim answer spoiler in fill_blank prompt
UPDATE exercises e
SET prompt = 'Apa arti tanda pemberitahuan darurat di pintu gerbang berikut?'
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-u30-dokumen-dan-pengumuman-praktis'
  AND e.order_index = 8
  AND e.exercise_type = 'fill_blank';

-- ============================================================================
-- 4. Strip parenthetical (... = ...) spoilers from fill_blank sentence_template (Finding #2)
-- ============================================================================
UPDATE exercises
SET content = CASE
    WHEN NULLIF(btrim(regexp_replace(content->>'sentence_template', '\s*\([^)]*=[^)]*\)', '', 'g')), '') IS NULL
      OR btrim(regexp_replace(content->>'sentence_template', '\s*\([^)]*=[^)]*\)', '', 'g')) = '[blank]'
    THEN content - 'sentence_template'
    ELSE jsonb_set(
        content,
        '{sentence_template}',
        to_jsonb(btrim(regexp_replace(content->>'sentence_template', '\s*\([^)]*=[^)]*\)', '', 'g')))
    )
END
WHERE exercise_type = 'fill_blank'
  AND content ? 'sentence_template'
  AND content->>'sentence_template' ~ '\([^)]*=[^)]*\)';

COMMIT;
