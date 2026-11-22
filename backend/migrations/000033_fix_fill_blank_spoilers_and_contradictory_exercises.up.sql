BEGIN;

-- 1. Fix the specific contradictory, duplicate, and spoiler exercises
UPDATE exercises
SET prompt = 'Dengarkan kata berikut dan pilih artinya yang tepat:'
WHERE id = 'c0000018-0000-0000-0000-000000000002';

UPDATE exercises
SET prompt = 'Review あ–よ + Deret R-W-N: huruf pembuka kata "saya" (watashi) adalah:'
WHERE id = 'c0000026-0000-0000-0000-000000040101';

UPDATE exercises
SET
  prompt = 'Susun huruf menjadi kata "Langit (sora)":',
  correct_answer = '["そ", "ら"]'::jsonb,
  content = '{"romaji": "Sora", "tokens": ["そ", "ら", "ろ", "り"], "target_translation": "Langit (sora)"}'::jsonb
WHERE id = 'c0000027-0000-0000-0000-040001000006';

UPDATE exercises
SET prompt = 'Kontras deret R (ら・る・ろ): pilih ejaan Hiragana yang tepat untuk kata "langit" (sora):'
WHERE id = 'c0000026-0000-0000-0000-000000040401';

UPDATE exercises
SET
  prompt = 'Lengkapi akhiran sopan (kopula) pada kalimat afirmatif "Tanaka juga murid":',
  content = content || '{"translation": "Tanaka juga murid"}'::jsonb
WHERE id = 'c0000027-0000-0000-0000-050006000004';

UPDATE exercises
SET
  prompt = 'Kanji 本 dibaca "hon". Apa arti utama Kanji ini?',
  content = content - 'translation'
WHERE id = 'c0000027-0000-0000-0000-060001000004';

UPDATE exercises
SET
  prompt = 'Kanji 子 (ko) memiliki arti:',
  content = content - 'translation'
WHERE id = 'c0000027-0000-0000-0000-070002000007';

UPDATE exercises
SET prompt = 'Lengkapi kalimat berikut dengan nama hari "Rabu" dalam bahasa Jepang:'
WHERE id = 'c0000018-0000-0000-0000-000000000050';

UPDATE exercises
SET prompt = 'Lengkapi suku kata awal Katakana untuk "Museum" (Myuujiamu):'
WHERE id = 'c0000027-0000-0000-0000-160001000007';

UPDATE exercises
SET
  prompt = 'Konjugasi Bentuk-NAI: setelah mengubah akhiran verba Grup 1 ke vokal "a" (kaki → kaka), tambahkan akhiran negatif:',
  content = content - 'translation'
WHERE id = 'c0000027-0000-0000-0000-230003000004';

UPDATE exercises
SET
  prompt = 'Lengkapi kata sambung alasan pada kalimat "Karena capek, ingin istirahat":',
  content = content || '{"translation": "Karena capek, ingin istirahat"}'::jsonb
WHERE id = 'c0000027-0000-0000-0000-290005000010';

UPDATE exercises
SET
  prompt = 'Berapakah jumlah huruf dasar (Gojuon) pada aksara Katakana?',
  content = content - 'translation'
WHERE id = 'c0000027-0000-0000-0000-300001000004';

UPDATE exercises
SET prompt = 'Kontras konsonan ganda (sokuon っ): pilih ejaan Hiragana yang tepat untuk kata "prangko" (kitte):'
WHERE id = 'c0000026-0000-0000-0000-000000050201';

UPDATE exercises
SET prompt = 'Baca Kanji keluarga berikut dan lengkapi kalimat untuk "anak laki-laki":'
WHERE id = 'c0000026-0000-0000-0000-000000070401';

-- 2. Strip fill_blank content.translation exact-answer, option-match, and Romaji leaks
UPDATE exercises e
SET content = e.content - 'translation'
FROM lessons l
WHERE e.lesson_id = l.id
  AND e.exercise_type = 'fill_blank'
  AND e.content ? 'translation'
  AND (
    lower(trim(COALESCE(e.content->>'translation', ''))) = lower(trim(COALESCE(e.correct_answer->>'selected', '')))
    OR EXISTS (
      SELECT 1
      FROM jsonb_array_elements_text(e.content->'options') AS opt(val)
      WHERE lower(trim(opt.val)) = lower(trim(COALESCE(e.content->>'translation', '')))
    )
    OR lower(trim(COALESCE(e.content->>'translation', ''))) LIKE 'huruf %'
    OR lower(trim(COALESCE(e.content->>'translation', ''))) IN (
      'made', 'kara', 'wa', 'ga', 'ni', 'de', 'no', 'mo', 'to', 'ka', 'he', 'wo', 'o',
      'desu', 'masu', 'deshita', 'ii', 'ku', 'ta', 'da', 'nai', 'yo-ji', 'masenka',
      'mashou', 'arimasu', 'arimasen', 'nonde', 'kite', 'shite', 'tekara', 'yomimasu',
      'hakimasu', 'samukunai', 'yokatta', 'shirimasen', 'donata', 'are', 'kitte',
      'jin', 'kyuu', 'nani', 'isogashii', 'eh'
    )
    OR (
      l.slug ~* 'checkpoint|spiral-test|musim-dan-suasana-kota|simulasi-akhir'
      AND trim(COALESCE(e.content->>'translation', '')) !~ '[[:space:]]'
      AND (
        COALESCE(e.content->>'sentence_template', '') ~ '\([^()]+\)'
        OR replace(COALESCE(e.content->>'sentence_template', ''), '[blank]', '') ~ '[ぁ-んァ-ン一-龯]'
      )
    )
  );

COMMIT;
