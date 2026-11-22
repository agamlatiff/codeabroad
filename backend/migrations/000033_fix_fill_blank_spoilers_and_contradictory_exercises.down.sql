BEGIN;

-- Revert explicit exercise row edits by UUID
UPDATE exercises
SET prompt = 'Dengarkan kata berikut. Apa arti kata "いえ"?'
WHERE id = 'c0000018-0000-0000-0000-000000000002';

UPDATE exercises
SET prompt = 'Review あ–よ + Deret R-W-N: huruf penutup kata "わたし" (saya = watashi) adalah:'
WHERE id = 'c0000026-0000-0000-0000-000000040101';

UPDATE exercises
SET
  prompt = 'Susun huruf menjadi kata "Malam (yoru)":',
  correct_answer = '["よ", "る"]'::jsonb,
  content = '{"romaji": "Yoru", "tokens": ["よ", "る", "ゆ", "ろ"], "target_translation": "Malam (yoru)"}'::jsonb
WHERE id = 'c0000027-0000-0000-0000-040001000006';

UPDATE exercises
SET prompt = 'Kontras る vs ろ: pilih bacaan Hiragana yang tepat untuk "そら" (langit):'
WHERE id = 'c0000026-0000-0000-0000-000000040401';

UPDATE exercises
SET
  prompt = 'Penanda kepemilikan ''juga'' dalam kalimat afirmatif menggunakan partikel:',
  content = content || '{"translation": "Desu"}'::jsonb
WHERE id = 'c0000027-0000-0000-0000-050006000004';

UPDATE exercises
SET
  prompt = 'Kanji 本 dibaca ''hon'' yang berarti buku atau asal:',
  content = content || '{"translation": "Buku / asal"}'::jsonb
WHERE id = 'c0000027-0000-0000-0000-060001000004';

UPDATE exercises
SET
  prompt = 'Kanji 子 (ko) berarti anak pada kata:',
  content = content || '{"translation": "Anak"}'::jsonb
WHERE id = 'c0000027-0000-0000-0000-070002000007';

UPDATE exercises
SET prompt = 'Pilih arti hari dalam seminggu berikut — "すいようび" artinya:'
WHERE id = 'c0000018-0000-0000-0000-000000000050';

UPDATE exercises
SET prompt = 'Lengkapi Katakana untuk kata "Museum" (ミュージアム) deret Ma-Mi-Mu-Me-Mo:'
WHERE id = 'c0000027-0000-0000-0000-160001000007';

UPDATE exercises
SET
  prompt = 'Konjugasi Bentuk-NAI: Verba Grup 1 mengubah vokal ''i'' sebelum -masu menjadi vokal [blank] + ない:',
  content = content || '{"translation": "Nai"}'::jsonb
WHERE id = 'c0000027-0000-0000-0000-230003000004';

UPDATE exercises
SET
  prompt = 'Lengkapi alasan から ''Karena capek, ingin istirahat'':',
  content = content || '{"translation": "Kara"}'::jsonb
WHERE id = 'c0000027-0000-0000-0000-290005000010';

UPDATE exercises
SET
  prompt = 'Total huruf dasar Hiragana adalah 46 dan Katakana berjumlah:',
  content = content || '{"translation": "46"}'::jsonb
WHERE id = 'c0000027-0000-0000-0000-300001000004';

UPDATE exercises
SET prompt = 'Kontras きて (datanglah) vs きって (prangko): pilih ejaan "prangko":'
WHERE id = 'c0000026-0000-0000-0000-000000050201';

UPDATE exercises
SET prompt = 'Baca Kanji keluarga berikut: pilih arti dari "男の子供" (男の子):'
WHERE id = 'c0000026-0000-0000-0000-000000070401';

COMMIT;
