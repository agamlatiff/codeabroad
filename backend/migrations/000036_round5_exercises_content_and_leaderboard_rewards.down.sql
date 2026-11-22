BEGIN;

UPDATE exercises e
SET correct_answer = '{"expected_transcript": "tsuki"}'::jsonb
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-unit2-kosakata-gabungan'
  AND e.order_index = 7
  AND e.exercise_type = 'speaking_repeat';

UPDATE exercises e
SET prompt = 'Dengarkan klausul waktu "ketika" (とき) ini:'
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-sebelum-maeni-dan-ketika-toki'
  AND e.order_index = 7
  AND e.exercise_type = 'listening_choice';

UPDATE exercises e
SET prompt = 'Ucapkan waktu ''いま ななじはん です'' (Sekarang pukul 07.30):',
    content = jsonb_set(
        jsonb_set(e.content, '{display_text}', '"いま ななじはん です"'::jsonb),
        '{audio_text}',
        '"いま ななじはん です"'::jsonb
    ),
    correct_answer = '{"expected_transcript": "いま ななじはん です"}'::jsonb,
    acceptable_answers = NULL
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-u10-menit-pun-dan-setengah-han'
  AND e.order_index = 7
  AND e.exercise_type = 'speaking_repeat';

UPDATE exercises e
SET content = jsonb_set(e.content, '{audio_text}', '"これ は なに ですか"'::jsonb),
    explanation = 'これ は なに ですか berarti ''Ini apa?''.'
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-unit2-praktik-4-keterampilan'
  AND e.order_index = 6
  AND e.exercise_type = 'listening_choice';

UPDATE exercises e
SET prompt = 'Tanyakan ''これ は なに ですか'' (Ini apa?):',
    content = jsonb_set(
        jsonb_set(
            jsonb_set(e.content, '{display_text}', '"これ は なに ですか"'::jsonb),
            '{audio_text}',
            '"これ は なに ですか"'::jsonb
        ),
        '{romaji}',
        '"kore wa nani desu ka"'::jsonb
    ),
    correct_answer = '{"expected_transcript": "これ は なに ですか"}'::jsonb,
    acceptable_answers = NULL
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-unit2-praktik-4-keterampilan'
  AND e.order_index = 8
  AND e.exercise_type = 'speaking_repeat';

UPDATE exercises e
SET prompt = 'Tanyakan ''あれ は なに ですか'' (Itu apa?):',
    content = jsonb_set(
        jsonb_set(
            jsonb_set(e.content, '{display_text}', '"あれ は なに ですか"'::jsonb),
            '{audio_text}',
            '"あれ は なに ですか"'::jsonb
        ),
        '{romaji}',
        '"are wa nani desu ka"'::jsonb
    ),
    correct_answer = '{"expected_transcript": "あれ は なに ですか"}'::jsonb,
    acceptable_answers = NULL,
    explanation = 'Lafalkan are wa nani desu ka.'
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-unit4-kalimat-are-identitas'
  AND e.order_index = 6
  AND e.exercise_type = 'speaking_repeat';

UPDATE exercises e
SET prompt = 'Susun salam perkenalan pertama: "Senang bertemu pertama kali dengan Anda."',
    content = jsonb_set(
        jsonb_set(e.content, '{romaji}', '"Hajimemashite"'::jsonb),
        '{target_translation}',
        '"Senang bertemu pertama kali dengan Anda."'::jsonb
    ),
    correct_answer = '["はじめまして"]'::jsonb,
    acceptable_answers = '[["初めまして"]]'::jsonb,
    explanation = '「はじめまして」(Hajimemashite) berasal dari verba hajimeru (memulai), diucapkan saat pertama kali bertemu seseorang.'
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-salam-pertama-aisatsu'
  AND e.order_index = 1
  AND e.exercise_type = 'sentence_builder';

UPDATE exercises e
SET prompt = 'Pemberitahuan darurat ''Dilarang masuk'' di pintu gerbang ditulis:'
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-u30-dokumen-dan-pengumuman-praktis'
  AND e.order_index = 8
  AND e.exercise_type = 'fill_blank';

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
        'badge_unlocked'
    ]::text[]));

DROP TABLE IF EXISTS leaderboard_weekly_rewards;

COMMIT;
