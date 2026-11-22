BEGIN;

UPDATE flashcard_cards fc
SET back_meaning = CASE fc.front_text
    WHEN 'ソ' THEN 'Jangan tertukar ン!'
    WHEN 'ツ' THEN 'Jangan tertukar シ!'
    WHEN 'シ' THEN 'Jangan tertukar ツ!'
    ELSE fc.back_meaning
END
FROM flashcard_decks fd
WHERE fc.deck_id = fd.id
  AND fd.slug = 'katakana-wa-n-special'
  AND fc.front_text IN ('ソ', 'ツ', 'シ');

UPDATE exercises e
SET prompt = 'Dengarkan dan tirukan ungkapan santun perkenalan berikut dengan pelafalan yang jelas.',
    content = e.content - 'translation'
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-salam-pertama-aisatsu'
  AND e.order_index = 2
  AND e.exercise_type = 'speaking_repeat';

UPDATE exercises e
SET prompt = 'Dengarkan dan tirukan kalimat perkenalan profesi berikut dengan artikulasi yang jelas.',
    content = e.content - 'translation'
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-salam-perkenalan-identitas'
  AND e.order_index = 3
  AND e.exercise_type = 'speaking_repeat';

UPDATE exercises e
SET content = jsonb_set(
    e.content,
    '{sentence_template}',
    to_jsonb(replace(e.content->>'sentence_template', 'にもつ', 'にモツ')),
    true
)
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-belanja-harga-dan-warna'
  AND e.order_index = 4
  AND e.exercise_type = 'fill_blank'
  AND e.content->>'sentence_template' LIKE '%にもつ%';

UPDATE exercises e
SET prompt = 'Susun potongan kata menjadi kalimat "Bangun jam 7 naik kereta ke kantor":',
    content = jsonb_set(e.content, '{target_translation}', '"Bangun jam 7 naik kereta ke kantor"'::jsonb, true)
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-u30-jebakan-partikel-n5'
  AND e.order_index = 3
  AND e.exercise_type = 'sentence_builder';

UPDATE exercises e
SET content = jsonb_set(e.content, '{audio_text}', '"ご (5)"'::jsonb, true)
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-katakana-pinjaman-angka-dasar'
  AND e.order_index = 2
  AND e.exercise_type = 'listening_choice';

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

COMMIT;
