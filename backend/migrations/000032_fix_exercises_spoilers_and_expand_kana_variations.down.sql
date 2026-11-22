BEGIN;

-- Revert seeded Dakuten/Handakuten + Yoon characters in kana_characters
DELETE FROM kana_characters
WHERE script IN ('hiragana', 'katakana')
  AND row_order >= 12;

-- Revert Unit 15 Q8 and Unit 21 Q11 fixes
UPDATE exercises e
SET correct_answer = '{"selected": "made"}'::jsonb
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-rute-transportasi-dan-sarana'
  AND e.order_index = 8
  AND e.correct_answer->>'selected' = 'まで';

UPDATE exercises e
SET prompt = replace(e.prompt, 'もう一度 言って ください', 'もう一度 行って ください')
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-permintaan-sopan-di-kantor'
  AND e.order_index = 11
  AND e.prompt LIKE '%もう一度 言って ください%';

-- Revert the 20 speaking_repeat exercises normalized from exact_match/phrase
UPDATE exercises
SET
  correct_answer = jsonb_build_object('exact_match', correct_answer->>'expected_transcript'),
  content = content - 'display_text' - 'audio_text'
WHERE exercise_type = 'speaking_repeat'
  AND content ? 'phrase'
  AND correct_answer ? 'expected_transcript';

COMMIT;
