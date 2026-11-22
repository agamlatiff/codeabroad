-- Rollback Migration 000031: Restore original Unit 1 exercises prior to letter progression cleanup
BEGIN;

UPDATE exercises
SET
  prompt = 'Kata ''kue'' dalam bahasa Jepang adalah:',
  content = '{"options": ["か", "き", "く", "け"], "translation": "Kue (okashi)", "sentence_template": "お [blank] し (kue)"}'::jsonb,
  correct_answer = '{"selected": "か"}'::jsonb
WHERE id = 'c0000027-0000-0000-0000-010002000008';

UPDATE exercises
SET
  prompt = 'Pilih huruf Hiragana yang dibaca "ka":',
  content = '{"options": ["か", "さ", "た", "な"], "translation": "Payung (ka-sa)", "sentence_template": "[blank] さ (kasa = payung)"}'::jsonb,
  correct_answer = '{"selected": "か"}'::jsonb
WHERE id = '2b63ddd7-3031-42e9-a141-fbe7564a073e';

UPDATE exercises
SET
  prompt = 'Susun kata benda dasar dari Hiragana berikut menjadi: "さかな" (ikan).',
  content = '{"romaji": "Sakana", "tokens": ["さ", "か", "な", "た", "き"], "target_translation": "Ikan (sakana)"}'::jsonb,
  correct_answer = '["さ", "か", "な"]'::jsonb
WHERE id = 'beefe423-7e82-440c-b5d2-450a66771823';

UPDATE exercises
SET
  prompt = 'Pilih arti ungkapan sopan "すみません":',
  content = '{"options": ["すみません", "さようなら", "おやすみ", "はい"], "translation": "Permisi, di mana stasiun?", "sentence_template": "[blank]、えきは どこですか。"}'::jsonb,
  correct_answer = '{"selected": "すみません"}'::jsonb
WHERE id = 'c0000018-0000-0000-0000-000000000005';

UPDATE exercises
SET
  prompt = 'Pilih huruf Hiragana yang dibaca "su":',
  content = '{"options": ["す", "さ", "し", "そ"], "translation": "Sushi (su-shi)", "sentence_template": "[blank] し (sushi)"}'::jsonb,
  correct_answer = '{"selected": "す"}'::jsonb
WHERE id = 'c0000018-0000-0000-0000-000000000006';

COMMIT;
