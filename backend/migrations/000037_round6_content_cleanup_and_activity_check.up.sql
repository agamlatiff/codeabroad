BEGIN;

-- ============================================================================
-- 1. Restore missing activity_type values in user_activity_logs_activity_type_check
-- ============================================================================
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
        'leaderboard_reward_claimed',
        'xp_booster_activated',
        'monthly_badge_claimed'
    ]::text[]));

-- ============================================================================
-- 2. Fix 3 Katakana flashcard back_meaning values (Finding #4)
-- ============================================================================
UPDATE flashcard_cards fc
SET back_meaning = CASE fc.front_text
    WHEN 'ソ' THEN 'Suku kata "so"'
    WHEN 'ツ' THEN 'Pengecualian "tsu"'
    WHEN 'シ' THEN 'Pengecualian "shi"'
    ELSE fc.back_meaning
END
FROM flashcard_decks fd
WHERE fc.deck_id = fd.id
  AND fd.slug = 'katakana-wa-n-special'
  AND fc.front_text IN ('ソ', 'ツ', 'シ');

-- ============================================================================
-- 3. Add Indonesian meaning to 2 speaking_repeat exercises (Finding #5)
-- ============================================================================
UPDATE exercises e
SET prompt = 'Dengarkan dan tirukan ungkapan santun perkenalan ("Mohon bantuannya / Senang berkenalan dengan Anda") berikut dengan pelafalan yang jelas.',
    content = jsonb_set(e.content, '{translation}', '"Mohon bantuannya / Senang berkenalan dengan Anda"'::jsonb, true)
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-salam-pertama-aisatsu'
  AND e.order_index = 2
  AND e.exercise_type = 'speaking_repeat';

UPDATE exercises e
SET prompt = 'Dengarkan dan tirukan kalimat perkenalan profesi ("Perkenalkan, saya adalah insinyur.") berikut dengan artikulasi yang jelas.',
    content = jsonb_set(e.content, '{translation}', '"Perkenalkan, saya adalah insinyur."'::jsonb, true)
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-salam-perkenalan-identitas'
  AND e.order_index = 3
  AND e.exercise_type = 'speaking_repeat';

-- ============================================================================
-- 4. Fix 3 minor exercise content typos (Finding #5)
-- ============================================================================
UPDATE exercises e
SET content = jsonb_set(
    e.content,
    '{sentence_template}',
    to_jsonb(replace(e.content->>'sentence_template', 'にモツ', 'にもつ')),
    true
)
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-belanja-harga-dan-warna'
  AND e.order_index = 4
  AND e.exercise_type = 'fill_blank'
  AND e.content->>'sentence_template' LIKE '%にモツ%';

UPDATE exercises e
SET prompt = 'Susun potongan kata menjadi kalimat "Setiap hari bangun jam 7 naik kereta ke kantor":',
    content = jsonb_set(e.content, '{target_translation}', '"Setiap hari bangun jam 7 naik kereta ke kantor."'::jsonb, true)
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-u30-jebakan-partikel-n5'
  AND e.order_index = 3
  AND e.exercise_type = 'sentence_builder';

UPDATE exercises e
SET content = jsonb_set(e.content, '{audio_text}', '"ご"'::jsonb, true)
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-katakana-pinjaman-angka-dasar'
  AND e.order_index = 2
  AND e.exercise_type = 'listening_choice';

-- ============================================================================
-- 5. Strip Romaji spoilers from listening_choice option texts (Finding #5)
-- ============================================================================
WITH rebuilt AS (
    SELECT
        e.id,
        jsonb_agg(
            CASE
                WHEN elem->>'text' ~ '\s*\([^)]+\)$'
                    AND elem->>'text' !~* '\((Lima|Tiga|Delapan|Sepuluh|Sembilan|Enam|Empat|Tujuh|5|6|7|8|B1|basement|sopan|kasual|lampau|status|status pekerjaan|punya mobil|tidak boleh ambil foto|sarana bahasa|lokasi|sengau|vokal|jauh|dekat lawan bicara|Bukan dokter|Bukan insinyur|panggilan akrab/sayang|formal|guru|sangat hormat|Selamat datang kembali|Selamat tidur|Terima kasih makanannya|Salam kenal)\)$'
                    AND btrim(regexp_replace(elem->>'text', '\s*\([^)]+\)$', '')) <> ''
                THEN jsonb_set(
                    elem,
                    '{text}',
                    to_jsonb(btrim(regexp_replace(elem->>'text', '\s*\([^)]+\)$', ''))),
                    true
                )
                ELSE elem
            END
            ORDER BY ord
        ) AS new_options
    FROM exercises e
    CROSS JOIN LATERAL jsonb_array_elements(e.content->'options') WITH ORDINALITY AS arr(elem, ord)
    WHERE e.exercise_type = 'listening_choice'
      AND jsonb_typeof(e.content->'options') = 'array'
    GROUP BY e.id
)
UPDATE exercises e
SET content = jsonb_set(e.content, '{options}', r.new_options, true)
FROM rebuilt r
WHERE e.id = r.id
  AND e.content->'options' IS DISTINCT FROM r.new_options;

COMMIT;
