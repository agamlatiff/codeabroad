BEGIN;

UPDATE exercises
SET explanation = 'お + か + し = おかし (okashi).'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit1-kosakata-dasar')
  AND order_index = 8;

UPDATE exercises
SET explanation = 'Huruf す dibaca "su" dalam deret さ-し-す-せ-そ.'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-konsonan-dasar-hiragana')
  AND order_index = 5;

UPDATE exercises
SET explanation = 'Partikel も menggantikan は untuk menyatakan ''juga''.'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u5-persiapan-ujian-tahap1')
  AND order_index = 4;

UPDATE exercises
SET prompt = 'Pilih vokal pembuka yang tepat untuk kata ''atas'' (うえ):'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u1-vokal-k-kontras-bunyi')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Bedakan pasangan mirip あ vs お — huruf manakah yang dibaca "o" pada kata "あおい"?'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit1-praktik-4-keterampilan')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Kontras ぬ vs ね: huruf yang benar untuk kata "ねこ" (kucing) adalah:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit2-kosakata-gabungan')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Kontras は vs ほ vs ま: mana huruf untuk kata "みみ" (telinga)?'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit3-kosakata-hmy')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Partikel は ketika berfungsi sebagai penanda subjek dibaca:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u3-kosakata-salam-harian-identitas')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Review Tahap 1 + Kanji Awal: pilih Kanji untuk kata "本" (hon = buku):'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit6-review-kanji-awal')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Cocokkan Kanji angka 五 (go): pada umur 25 tahun (nijuu-go-sai) dibaca:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit8-kosakata-negara')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Review Unit 8 + Angka Besar: bagaimana bacaan pengecualian untuk 300 (三百)?'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-angka-besar-harga')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Review ～ます + Partikel で: mana partikel untuk lokasi terjadinya aksi aktif?'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-lokasi-aksi-partikel-de')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Selain tempat aksi, partikel で juga menandai alat & bahasa ("memakai ..."). Contoh:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-alat-dan-bahasa-partikel-de')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Kanji 語 dibaca ''go'' yang berarti bahasa pada kata:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-alat-dan-bahasa-partikel-de')
  AND order_index = 4;

UPDATE exercises
SET prompt = 'Partikel untuk menyatakan alat atau sarana yang digunakan adalah で:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u13-alat-dan-bahasa-de')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Kontras 4 partikel: カフェ [blank] 九じ [blank] コーヒーを のみます。'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit13-kalimat-de-vs-ni')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Huruf へ saat berfungsi sebagai partikel penunjuk arah tujuan dilafalkan:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u15-arah-gerak-partikel-e')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Partikel yang menandai sarana kendaraan yang dinaiki adalah で:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u15-kendaraan-dan-transportasi-de')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Review Keberadaan + 8 Kanji Posisi: arti dari pasangan 右 dan 左 adalah:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit17-review-kanji-arah')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Review Posisi + Kontras Katakana kembar シ vs ツ: pada kata "tshirt / kaus" (shatsu) memakai:',
    explanation = 'シ garis bawah menyapu dari kiri-bawah ke kanan-atas; ツ menghadap ke bawah.'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-katakana-batch4-wan-special')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Review Sifat-I + Kanji Warna & Harga: arti dari gabungan 赤い dan 白い adalah:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit19-review-kanji-sifat')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Ujian 4: Menyeberangi jalan menggunakan partikel objek を: みち [blank] わたります:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u21-checkpoint')
  AND order_index = 4;

COMMIT;
