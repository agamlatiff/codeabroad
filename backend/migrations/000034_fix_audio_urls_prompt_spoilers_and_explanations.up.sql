BEGIN;

-- Finding #6: Remove 43 missing /static/audio/... URLs so audio_text/display_text TTS triggers immediately without HTTP 404
UPDATE exercises
SET content = content - 'audio_url'
WHERE content->>'audio_url' LIKE '/static/audio/%';

-- Finding #4: Strip fill_blank content.translation spoilers ('Partikel XX' and 'Kanji <ans>', preserving 'Kanji nama')
UPDATE exercises
SET content = content - 'translation'
WHERE exercise_type = 'fill_blank'
  AND (
    coalesce(content->>'translation', '') ~* '^partikel\s+[a-z]{1,4}$'
    OR (
      coalesce(content->>'translation', '') ~* '^kanji\s+'
      AND position(trim(coalesce(correct_answer->>'selected', '')) IN coalesce(content->>'translation', '')) > 0
      AND length(trim(coalesce(correct_answer->>'selected', ''))) >= 1
    )
  );

-- Findings #3 & #4: Fix 22 exercises with mismatched explanations, direct answer spoilers, or contradictory prompts
UPDATE exercises
SET explanation = 'あ (a) + か (ka) + い (i) = あかい (merah).'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit1-kosakata-dasar')
  AND order_index = 8;

UPDATE exercises
SET explanation = 'き (ki) + く (ku) = きく (mendengar). Huruf く berada di deret か-き-く-け-こ.'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-konsonan-dasar-hiragana')
  AND order_index = 5;

UPDATE exercises
SET explanation = 'Akhiran sopan です digunakan untuk menutup kalimat pernyataan nomina ("... adalah ...").'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u5-persiapan-ujian-tahap1')
  AND order_index = 4;

UPDATE exercises
SET prompt = 'Pilih vokal pembuka yang tepat untuk kata "atas" (ue):'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u1-vokal-k-kontras-bunyi')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Bedakan pasangan mirip あ vs お — lengkapi huruf berbunyi "o" pada kata "biru" (aoi):'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit1-praktik-4-keterampilan')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Kontras ぬ vs ね: lengkapi huruf pembuka untuk kata "kucing" (neko):'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit2-kosakata-gabungan')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Pilih huruf Hiragana yang tepat untuk melengkapi kata "telinga" (mimi):'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit3-kosakata-hmy')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Pilih huruf partikel penanda topik/subjek (dibaca "wa") yang melengkapi kalimat berikut:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u3-kosakata-salam-harian-identitas')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Review Tahap 1 + Kanji Awal: pilih Kanji untuk kata "buku" (hon):'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit6-review-kanji-awal')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Pilih Kanji angka 5 (go) yang tepat untuk melengkapi umur 25 tahun (nijuu-go-sai):'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit8-kosakata-negara')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Review Unit 8 + Angka Besar: pilih satuan Yen beserta bacaan pengecualian yang tepat untuk 300 Yen (三百...):'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-angka-besar-harga')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Review ～ます + Partikel Lokasi: pilih partikel yang tepat untuk tempat terjadinya aksi aktif:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-lokasi-aksi-partikel-de')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Pilih partikel yang tepat untuk menandai alat atau sarana yang dipakai ("memakai sumpit"):'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-alat-dan-bahasa-partikel-de')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Pilih Kanji yang dibaca "go" dan berarti "bahasa" pada kata Bahasa Jepang (Nihongo):'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-alat-dan-bahasa-partikel-de')
  AND order_index = 4;

UPDATE exercises
SET prompt = 'Pilih partikel yang tepat untuk menyatakan alat atau sarana ("dengan sumpit"):'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u13-alat-dan-bahasa-de')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Pilih partikel lokasi aktivitas yang tepat untuk kalimat "Minum kopi di kafe":'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit13-kalimat-de-vs-ni')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Pilih huruf partikel penunjuk arah tujuan (dilafalkan "e") untuk kalimat "Pergi ke Tokyo":'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u15-arah-gerak-partikel-e')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Pilih partikel yang tepat untuk menandai sarana kendaraan ("dengan kereta api"):'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u15-kendaraan-dan-transportasi-de')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Review Keberadaan + Kanji Posisi: lengkapi kalimat dengan Kanji yang berarti "sebelah kiri":'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit17-review-kanji-arah')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Lengkapi huruf kecil (yoon) Katakana yang tepat pada kata "kaus" (shatsu):',
    explanation = 'Huruf kecil ャ (ya) digabung setelah シ (shi) membentuk bunyi "sha" pada kata シャツ (shatsu = kaus).'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-katakana-batch4-wan-special')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Review Sifat-I + Kanji Warna: lengkapi kalimat dengan Kanji warna yang berarti "putih":'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit19-review-kanji-sifat')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Ujian 4: Pilih partikel yang tepat untuk menandai jalan yang diseberangi pada kalimat "みち ___ わたります":'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u21-checkpoint')
  AND order_index = 4;

COMMIT;
