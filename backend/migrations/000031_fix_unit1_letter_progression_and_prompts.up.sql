-- Migration 000031: Fix Unit 1 Hiragana progression (remove Unit 2 letters like し/さ/す/な from Unit 1 drills) and fix mismatched prompt/options on n5-konsonan-dasar-hiragana
BEGIN;

-- 1. n5-unit1-kosakata-dasar #8: replace お [blank] し (し is taught in Unit 2) with pure Unit 1 あ [blank] い (akai = merah)
UPDATE exercises
SET
  prompt = 'Lengkapi kata "merah" (akai) dari huruf vokal & baris K:',
  content = '{"options": ["か", "き", "く", "け"], "translation": "Merah (akai)", "sentence_template": "あ [blank] い (merah = akai)"}'::jsonb,
  correct_answer = '{"selected": "か"}'::jsonb
WHERE id = 'c0000027-0000-0000-0000-010002000008';

-- 2. n5-konsonan-dasar-hiragana #1: replace [blank] さ (さ is Unit 2) with pure Unit 1 [blank] お (kao = wajah)
UPDATE exercises
SET
  prompt = 'Pilih huruf Hiragana yang dibaca "ka":',
  content = '{"options": ["か", "き", "く", "け"], "translation": "Wajah (kao)", "sentence_template": "[blank] お (kao = wajah)"}'::jsonb,
  correct_answer = '{"selected": "か"}'::jsonb
WHERE id = '2b63ddd7-3031-42e9-a141-fbe7564a073e';

-- 3. n5-konsonan-dasar-hiragana #2: replace さかな (さ/な are Unit 2) with pure Unit 1 あかい (merah)
UPDATE exercises
SET
  prompt = 'Susun kata "あかい" (merah) dari huruf vokal & baris K:',
  content = '{"romaji": "Akai", "tokens": ["あ", "か", "い", "き", "こ"], "target_translation": "Merah (akai)"}'::jsonb,
  correct_answer = '["あ", "か", "い"]'::jsonb
WHERE id = 'beefe423-7e82-440c-b5d2-450a66771823';

-- 4. n5-konsonan-dasar-hiragana #4: align prompt with Japanese expression options + romaji guide for zero beginners
UPDATE exercises
SET
  prompt = 'Pilih ungkapan sopan yang berarti "Permisi / Maaf" untuk melengkapi kalimat:',
  content = '{"romaji": "Sumimasen", "options": [{"id": "すみません", "text": "すみません (Sumimasen)"}, {"id": "さようなら", "text": "さようなら (Sayounara)"}, {"id": "おやすみ", "text": "おやすみ (Oyasumi)"}, {"id": "はい", "text": "はい (Hai)"}], "translation": "Permisi, di mana stasiun?", "sentence_template": "[blank]、えきは どこですか。(Sumimasen, eki wa doko desu ka?)"}'::jsonb,
  correct_answer = '{"selected": "すみません"}'::jsonb
WHERE id = 'c0000018-0000-0000-0000-000000000005';

-- 5. n5-konsonan-dasar-hiragana #5: replace す/すし (Unit 2) with pure Unit 1 ku / kiku (mendengar)
UPDATE exercises
SET
  prompt = 'Pilih huruf Hiragana yang dibaca "ku":',
  content = '{"options": ["く", "か", "き", "け"], "translation": "Mendengar (kiku)", "sentence_template": "き [blank] (kiku = mendengar)"}'::jsonb,
  correct_answer = '{"selected": "く"}'::jsonb
WHERE id = 'c0000018-0000-0000-0000-000000000006';

COMMIT;
