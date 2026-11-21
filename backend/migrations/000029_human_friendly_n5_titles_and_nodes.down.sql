-- Rollback Migration 000029: Restore previous JLPT N5 unit & lesson titles/descriptions
BEGIN;

UPDATE units SET title = 'Hiragana 1: Vokal (あ–お) & Deret K (か–こ)', description = 'Mulai dari nol: teori 10 huruf pertama, kosakata pendek, kalimat sapaan awal, serta praktik ngomong, tulis & baca.' WHERE id = 'a0000002-0000-0000-0000-000000000002';
UPDATE lessons SET short_title = 'Huruf あ–こ', title = 'Node 1: Teori & 10 Huruf Hiragana Pertama (あ–お & か–こ)' WHERE id = 'b0000002-0000-0000-0000-000000000002';
UPDATE lessons SET short_title = 'Kata あ–こ', title = 'Node 2: Kosakata Pertama dari Huruf あ–こ (いえ・あおい・かお)' WHERE id = 'b0000026-0000-0000-0000-000000000102';
UPDATE lessons SET short_title = 'Kontras あ vs お', title = 'Node 3: Lanjutan Vokal & K — Kontras Bunyi & Huruf Mirip (あ vs お)' WHERE id = 'b0000027-0000-0000-0000-000001000003';
UPDATE lessons SET short_title = 'Kosakata あ–こ', title = 'Node 4: Kosakata Lengkap Huruf あ–こ & Konteks Harian (あき・いけ・ここ)' WHERE id = 'b0000027-0000-0000-0000-000001000004';
UPDATE lessons SET short_title = 'Frasa & Sapaan', title = 'Node 5: Frasa Pendek & Ungkapan Harian Pertama' WHERE id = 'b0000001-0000-0000-0000-000000000008';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 1' WHERE id = 'b0000026-0000-0000-0000-000000000104';
UPDATE lessons SET short_title = 'Checkpoint Unit 1', title = 'Node 7: Checkpoint Unit 1 — Evaluasi Mandiri 10 Huruf & Kosakata' WHERE id = 'b0000027-0000-0000-0000-000001000007';

UPDATE units SET title = 'Hiragana 2 (さ–の), Review あ–こ, Salam & Kata Tunjuk (これ・それ)', description = 'Review あ–こ lalu kuasai deret S-T-N, kosakata gabungan, kalimat salam, serta praktik ngomong, tulis & baca.' WHERE id = 'a0000026-0000-0000-0000-000000000002';
UPDATE lessons SET short_title = 'Review & さ–の', title = 'Node 1: Review あ–こ & Lanjut Hiragana さ–の (し・ち・つ)' WHERE id = 'b0000026-0000-0000-0000-000000000201';
UPDATE lessons SET short_title = 'Kata さ–の', title = 'Node 2: Kosakata dari Huruf あ–の (あさ・すし・いぬ・ねこ)' WHERE id = 'b0000026-0000-0000-0000-000000000202';
UPDATE lessons SET short_title = 'Trik し・ち・つ', title = 'Node 3: Lanjutan S-T-N — Trik Pengecualian Bunyi (し・ち・つ)' WHERE id = 'b0000027-0000-0000-0000-000002000003';
UPDATE lessons SET short_title = 'Kosakata あ–の', title = 'Node 4: Kosakata Lengkap Huruf あ–の (あさ・すし・いぬ・ねこ)' WHERE id = 'b0000027-0000-0000-0000-000002000004';
UPDATE lessons SET short_title = 'Kalimat Salam', title = 'Node 5: Bikin Kalimat — Salam & Kata Tunjuk (これ・それ)' WHERE id = 'b0000002-0000-0000-0000-000000000003';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 2' WHERE id = 'b0000026-0000-0000-0000-000000000204';
UPDATE lessons SET short_title = 'Checkpoint Unit 2', title = 'Node 7: Checkpoint Unit 2 — Evaluasi Mandiri 25 Huruf (あ–の)' WHERE id = 'b0000027-0000-0000-0000-000002000007';

UPDATE units SET title = 'Hiragana 3 (は–よ), Review あ–の & Kalimat Nominal (は・です)', description = 'Review あ–の lalu kuasai deret H-M-Y, kosakata gabungan, kalimat perkenalan は/です, & praktik 4 keterampilan.' WHERE id = 'a0000026-0000-0000-0000-000000000003';
UPDATE lessons SET short_title = 'Review & は–よ', title = 'Node 1: Review あ–の & Lanjut Hiragana は–よ (Bunyi ふ)' WHERE id = 'b0000026-0000-0000-0000-000000000301';
UPDATE lessons SET short_title = 'Kata は–よ', title = 'Node 2: Kosakata dari Huruf あ–よ (はな・みみ・やま・わたし)' WHERE id = 'b0000026-0000-0000-0000-000000000302';
UPDATE lessons SET short_title = 'Trik ふ & は vs ほ', title = 'Node 3: Lanjutan H-M-Y — Bunyi Pengecualian ふ & Huruf Mirip (は vs ほ)' WHERE id = 'b0000027-0000-0000-0000-000003000003';
UPDATE lessons SET short_title = 'Kosakata あ–よ', title = 'Node 4: Kosakata Lengkap Huruf あ–よ & Sapaan Harian (わたし・こんにちは)' WHERE id = 'b0000027-0000-0000-0000-000003000004';
UPDATE lessons SET short_title = 'Kalimat は・です', title = 'Node 5: Teori Partikel は (wa) & Kalimat Pertama (～です)' WHERE id = 'b0000001-0000-0000-0000-000000000001';
UPDATE lessons SET short_title = 'Perkenalan Diri', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 3' WHERE id = 'b0000026-0000-0000-0000-000000000304';
UPDATE lessons SET short_title = 'Checkpoint Unit 3', title = 'Node 7: Checkpoint Unit 3 — Evaluasi Mandiri 38 Huruf & Kalimat は・です' WHERE id = 'b0000027-0000-0000-0000-000003000007';

UPDATE units SET title = 'Hiragana 4 (ら–ん: Tuntas 46!), Review あ–よ, Kewarganegaraan & あれ', description = 'Review あ–よ lalu tuntaskan 46 Hiragana, kata kewarganegaraan, kalimat あれ, serta praktik ngomong, tulis & baca.' WHERE id = 'a0000026-0000-0000-0000-000000000004';
UPDATE lessons SET short_title = 'Review & ら–ん', title = 'Node 1: Review あ–よ & Tuntas 46 Hiragana (ら–ん)' WHERE id = 'b0000026-0000-0000-0000-000000000401';
UPDATE lessons SET short_title = '～じん & 本', title = 'Node 2: Kosakata Kewarganegaraan (～じん), Bahasa & 本' WHERE id = 'b0000026-0000-0000-0000-000000000402';
UPDATE lessons SET short_title = 'Tuntas 46 Huruf', title = 'Node 3: Lanjutan R-W-N — Bunyi Mora Tunggal ん & Partikel を (O)' WHERE id = 'b0000027-0000-0000-0000-000004000003';
UPDATE lessons SET short_title = 'Kosakata 46 Huruf', title = 'Node 4: Kosakata Lengkap 46 Huruf (ほん・にほんじん・せんせい・がくせい)' WHERE id = 'b0000027-0000-0000-0000-000004000004';
UPDATE lessons SET short_title = 'Kalimat あれ', title = 'Node 5: Teori & Kalimat Triad Penunjuk (これ・それ・あれ)' WHERE id = 'b0000026-0000-0000-0000-000000000403';
UPDATE lessons SET short_title = '46 Hiragana', title = 'Node 6: Praktik Ngomong, Menulis & Membaca 46 Hiragana' WHERE id = 'b0000026-0000-0000-0000-000000000404';
UPDATE lessons SET short_title = 'Checkpoint Unit 4', title = 'Node 7: Checkpoint Unit 4 — Evaluasi Mandiri Tuntas 46 Hiragana' WHERE id = 'b0000027-0000-0000-0000-000004000007';

UPDATE units SET title = 'Hiragana 5 (゛・゜・っ・きゃ), Negatif/Tanya & Ujian Tahap 1', description = 'Review 46 Hiragana lalu kuasai bunyi variasi, kosakata harian, kalimat negatif/tanya, & Ujian Tahap 1.' WHERE id = 'a0000026-0000-0000-0000-000000000005';
UPDATE lessons SET short_title = 'Review & ゛・っ', title = 'Node 1: Review 46 Huruf & Variasi (゛・゜・っ・きゃ)' WHERE id = 'b0000026-0000-0000-0000-000000000501';
UPDATE lessons SET short_title = 'Kata ゛・っ・きゃ', title = 'Node 2: Kosakata Bunyi Variasi (がっこう・おちゃ・きって)' WHERE id = 'b0000026-0000-0000-0000-000000000502';
UPDATE lessons SET short_title = 'Variasi っ & きゃ', title = 'Node 3: Lanjutan Bunyi Variasi — Sokuon (っ) & Yoon (きゃ・しゅ・ちょ)' WHERE id = 'b0000027-0000-0000-0000-000005000003';
UPDATE lessons SET short_title = 'Kosakata Variasi', title = 'Node 4: Kosakata Bunyi Variasi Lengkap (びょういん・きっぷ・ざっし)' WHERE id = 'b0000027-0000-0000-0000-000005000004';
UPDATE lessons SET short_title = 'Negatif & か', title = 'Node 5: Bikin Kalimat Negatif (ではありません), Tanya & も' WHERE id = 'b0000001-0000-0000-0000-000000000002';
UPDATE lessons SET short_title = 'Persiapan Ujian T1', title = 'Node 6: Praktik 4 Pilar — Integrasi Seluruh Hiragana & Persiapan Ujian Tahap 1' WHERE id = 'b0000027-0000-0000-0000-000005000006';
UPDATE lessons SET short_title = 'Ujian Tahap 1', title = 'Node 7: Praktik 4 Pilar & Ujian Tahap 1' WHERE id = 'b0000026-0000-0000-0000-000000000504';

UPDATE units SET title = 'Kepemilikan (の), Kata Tunjuk (この・その) & Benda Sekitar', description = 'Review Tahap 1, Kanji awal, kosakata benda kelas, kalimat kepemilikan の, serta praktik ngomong, tulis & baca.' WHERE id = 'a0000001-0000-0000-0000-000000000001';
UPDATE lessons SET short_title = 'Review & Kanji 本', title = 'Node 1: Review Tahap 1 & Kanji Benda Awal (本・名・前・何・私)' WHERE id = 'b0000026-0000-0000-0000-000000000601';
UPDATE lessons SET short_title = 'Benda & この', title = 'Node 2: Kosakata Benda Sekitar & Penunjuk この・その・あの' WHERE id = 'b0000001-0000-0000-0000-000000000010';
UPDATE lessons SET short_title = 'Pola この・その・あの', title = 'Node 6: Lanjutan Kata Tunjuk — Pola Adnomina (この・その・あの + Nomina)' WHERE id = 'b0000027-0000-0000-0000-000006000003';
UPDATE lessons SET short_title = 'Benda Ruang Belajar', title = 'Node 4: Kosakata Lengkap Benda Sekitar & Ruang Belajar (とけい・かさ・つくえ・いす)' WHERE id = 'b0000027-0000-0000-0000-000006000004';
UPDATE lessons SET short_title = 'Kalimat の', title = 'Node 5: Teori Partikel の & Bikin Kalimat Kepemilikan' WHERE id = 'b0000001-0000-0000-0000-000000000011';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 6' WHERE id = 'b0000026-0000-0000-0000-000000000604';
UPDATE lessons SET short_title = 'Checkpoint Unit 6', title = 'Node 7: Checkpoint Unit 6 — Evaluasi Partikel の & Demonstrativa' WHERE id = 'b0000027-0000-0000-0000-000006000007';

UPDATE units SET title = 'Keluarga, Profesi, Panggilan Sopan & Kanji Manusia', description = 'Review benda & の lalu kuasai 8 Kanji manusia, kosakata keluarga, kalimat sopan, & praktik 4 keterampilan.' WHERE id = 'a0000026-0000-0000-0000-000000000007';
UPDATE lessons SET short_title = 'Review & Kanji 人', title = 'Node 1: Review Unit 6 & 8 Kanji Manusia (人・男・女・子・父・母)' WHERE id = 'b0000026-0000-0000-0000-000000000701';
UPDATE lessons SET short_title = 'Keluarga', title = 'Node 2: Kosakata Keluarga Sendiri vs Orang Lain & Panggilan' WHERE id = 'b0000018-0000-0000-0000-000000000001';
UPDATE lessons SET short_title = 'Panggilan Sopan', title = 'Node 3: Lanjutan Keluarga & Panggilan — Kontras San, Sama, Chan & Kun' WHERE id = 'b0000027-0000-0000-0000-000007000003';
UPDATE lessons SET short_title = 'Profesi & Kerabat', title = 'Node 4: Kosakata Lengkap Profesi Modern & Kerabat (かいしゃいん・あに・あね)' WHERE id = 'b0000027-0000-0000-0000-000007000004';
UPDATE lessons SET short_title = 'Kalimat Keluarga', title = 'Node 5: Bikin Kalimat Perkenalan Keluarga & Profesi Sopan' WHERE id = 'b0000026-0000-0000-0000-000000000703';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 7' WHERE id = 'b0000026-0000-0000-0000-000000000704';
UPDATE lessons SET short_title = 'Checkpoint Unit 7', title = 'Node 7: Checkpoint Unit 7 — Evaluasi Profesi & Kerabat Sopan' WHERE id = 'b0000027-0000-0000-0000-000007000007';

UPDATE units SET title = 'Katakana Batch 1 (ア–ト): Negara, Angka 1-100 & Kanji 一–五', description = 'Review Kanji manusia, kuasai Katakana ア–ト, kosakata negara, kalimat umur & angka, & praktik 4 keterampilan.' WHERE id = 'a0000026-0000-0000-0000-000000000008';
UPDATE lessons SET short_title = 'Review & ア–ト', title = 'Node 1: Review Kanji Manusia & Katakana 1 (ア–ト)' WHERE id = 'b0000026-0000-0000-0000-000000000801';
UPDATE lessons SET short_title = 'Negara & 一–五', title = 'Node 2: Kosakata Negara Katakana & Kanji 一–五' WHERE id = 'b0000026-0000-0000-0000-000000000802';
UPDATE lessons SET short_title = 'Trik Chouon Katakana', title = 'Node 3: Lanjutan Katakana 1 — Vokal Panjang (ー) & Kata Serapan Barat' WHERE id = 'b0000027-0000-0000-0000-000008000003';
UPDATE lessons SET short_title = 'Angka 1–10', title = 'Node 4: Kosakata Angka Dasar 1–10 (一・二・三・四・五・六・七・八・九・十)' WHERE id = 'b0000027-0000-0000-0000-000008000004';
UPDATE lessons SET short_title = 'Angka & Negara', title = 'Node 5: Bikin Kalimat Angka 1–100, Umur (～さい) & Negara' WHERE id = 'b0000001-0000-0000-0000-000000000009';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 8' WHERE id = 'b0000026-0000-0000-0000-000000000804';
UPDATE lessons SET short_title = 'Checkpoint Unit 8', title = 'Node 7: Checkpoint Unit 8 — Evaluasi Katakana Batch 1 & Angka 1–10' WHERE id = 'b0000027-0000-0000-0000-000008000007';

UPDATE units SET title = 'Angka Besar (百・千・万), Harga & Kata Bantu Hitung (Counters)', description = 'Review Katakana 1, kuasai Kanji ratusan-ribuan, kosakata counters, kalimat belanja, & praktik 4 keterampilan.' WHERE id = 'a0000026-0000-0000-0000-000000000009';
UPDATE lessons SET short_title = 'Review & 百・千', title = 'Node 1: Review Katakana 1 & Kanji Angka (百・千・万・円)' WHERE id = 'b0000026-0000-0000-0000-000000000901';
UPDATE lessons SET short_title = 'Counters N5', title = 'Node 2: Kosakata Kata Bantu Hitung (～つ・人・枚・本・冊)' WHERE id = 'b0000001-0000-0000-0000-000000000018';
UPDATE lessons SET short_title = 'Counters ひとつ～とお', title = 'Node 3: Lanjutan Belanja — Penggolong Benda Asli Jepang (ひとつ～とお)' WHERE id = 'b0000027-0000-0000-0000-000009000003';
UPDATE lessons SET short_title = 'Belanja & Uang', title = 'Node 4: Kosakata Lengkap Belanja & Mata Uang (いくら・百・千・万・円)' WHERE id = 'b0000027-0000-0000-0000-000009000004';
UPDATE lessons SET short_title = 'Kalimat Harga', title = 'Node 5: Teori & Kalimat Belanja (いくら & Counters Wajib N5)' WHERE id = 'b0000026-0000-0000-0000-000000000903';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 9' WHERE id = 'b0000026-0000-0000-0000-000000000904';
UPDATE lessons SET short_title = 'Checkpoint Unit 9', title = 'Node 7: Checkpoint Unit 9 — Evaluasi Angka Besar, Harga & Belanja' WHERE id = 'b0000027-0000-0000-0000-000009000007';

UPDATE units SET title = 'Jam, Hari, Kalender (に), Kanji Alam & Ujian Tahap 2', description = 'Review counters, kuasai 7 Kanji hari, kosakata jam/kalender, kalimat waktu に, & Ujian Tahap 2.' WHERE id = 'a0000026-0000-0000-0000-000000000010';
UPDATE lessons SET short_title = 'Review & 日–土', title = 'Node 1: Review Counters & 7 Kanji Elemen Alam (日–土)' WHERE id = 'b0000001-0000-0000-0000-000000000014';
UPDATE lessons SET short_title = 'Jam & Menit', title = 'Node 2: Kosakata Jam, Menit & Penyebutan Kalender' WHERE id = 'b0000001-0000-0000-0000-000000000006';
UPDATE lessons SET short_title = 'Menit 分 & 半', title = 'Node 3: Lanjutan Waktu — Satuan Menit (分) & Jam Setengah (半)' WHERE id = 'b0000027-0000-0000-0000-000010000003';
UPDATE lessons SET short_title = 'Jam Kerja & Rentang', title = 'Node 4: Kosakata Jam Kerja & Rentang Waktu (から・まで・なんじ)' WHERE id = 'b0000027-0000-0000-0000-000010000004';
UPDATE lessons SET short_title = 'Kalimat Waktu', title = 'Node 5: Teori Partikel Waktu に & Kalimat Jadwal Harian' WHERE id = 'b0000018-0000-0000-0000-000000000003';
UPDATE lessons SET short_title = 'Persiapan Ujian T2', title = 'Node 6: Praktik 4 Pilar — Integrasi Katakana, Angka, Belanja & Waktu (Persiapan Ujian Tahap 2)' WHERE id = 'b0000027-0000-0000-0000-000010000006';
UPDATE lessons SET short_title = 'Ujian Tahap 2', title = 'Node 7: Praktik 4 Pilar & Ujian Tahap 2' WHERE id = 'b0000026-0000-0000-0000-000000001004';

UPDATE units SET title = 'Katakana Batch 2 (ナ–ホ), Menu Kafe & Partikel Objek を', description = 'Review waktu & Katakana 1, kuasai menu kafe, kalimat pesan dengan を, serta praktik ngomong, tulis & baca.' WHERE id = 'a0000001-0000-0000-0000-000000000003';
UPDATE lessons SET short_title = 'Review & ナ–ホ', title = 'Node 1: Review Waktu & Lanjut Katakana 2 (ナ–ホ)' WHERE id = 'b0000026-0000-0000-0000-000000001101';
UPDATE lessons SET short_title = 'Menu Kafe', title = 'Node 2: Kosakata Menu Kafe, Makanan & Minuman' WHERE id = 'b0000001-0000-0000-0000-000000000004';
UPDATE lessons SET short_title = 'Katakana ナ–ホ & Menu', title = 'Node 3: Lanjutan Katakana 2 — Deret ナ–ホ & Kosakata Menu Kafe' WHERE id = 'b0000027-0000-0000-0000-000011000003';
UPDATE lessons SET short_title = 'Partikel Objek を', title = 'Node 4: Kosakata Menu Lengkap & Penggunaan Partikel Objek を (O)' WHERE id = 'b0000027-0000-0000-0000-000011000004';
UPDATE lessons SET short_title = 'Kalimat を', title = 'Node 5: Teori Partikel Objek を & Kalimat Pesan Makanan' WHERE id = 'b0000001-0000-0000-0000-000000000005';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca di Kafe' WHERE id = 'b0000026-0000-0000-0000-000000001104';
UPDATE lessons SET short_title = 'Checkpoint Unit 11', title = 'Node 7: Checkpoint Unit 11 — Evaluasi Menu Kafe & Objek を' WHERE id = 'b0000027-0000-0000-0000-000011000007';

UPDATE units SET title = 'Kata Kerja Rutinitas (～ます/～ません), Frekuensi & Kanji Aksi', description = 'Review menu kafe, kuasai Kanji aksi, kosakata rutin, kalimat frekuensi, serta praktik ngomong, tulis & baca.' WHERE id = 'a0000026-0000-0000-0000-000000000012';
UPDATE lessons SET short_title = 'Review & Kanji', title = 'Node 1: Review Objek を & Kanji Aksi (食・飲・見・聞・読・書)' WHERE id = 'b0000026-0000-0000-0000-000000001201';
UPDATE lessons SET short_title = 'Kata Kerja', title = 'Node 2: Kosakata Kata Kerja Aktivitas Harian (～ます)' WHERE id = 'b0000001-0000-0000-0000-000000000012';
UPDATE lessons SET short_title = 'Kanji Tindakan Harian', title = 'Node 3: Lanjutan Verba — 6 Kanji Tindakan Harian (食・飲・見・聞・読・書)' WHERE id = 'b0000027-0000-0000-0000-000012000003';
UPDATE lessons SET short_title = 'Rutinitas Makan', title = 'Node 4: Kosakata Rutinitas Makan & Waktu Harian (あさごはん・ばんごはん・まいにち)' WHERE id = 'b0000027-0000-0000-0000-000012000004';
UPDATE lessons SET short_title = 'Kalimat Rutin', title = 'Node 5: Teori Negatif (～ません), Frekuensi & Kalimat Rutin' WHERE id = 'b0000018-0000-0000-0000-000000000002';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 12' WHERE id = 'b0000026-0000-0000-0000-000000001204';
UPDATE lessons SET short_title = 'Checkpoint Unit 12', title = 'Node 7: Checkpoint Unit 12 — Evaluasi Verba Transitif & Rutinitas' WHERE id = 'b0000027-0000-0000-0000-000012000007';

UPDATE units SET title = 'Lokasi Aktivitas, Alat & Bahasa (Partikel で vs に)', description = 'Review verba ～ます, kuasai Kanji lokasi, kosakata alat & tempat, kontras で vs に, & praktik 4 keterampilan.' WHERE id = 'a0000026-0000-0000-0000-000000000013';
UPDATE lessons SET short_title = 'Review & で', title = 'Node 1: Review Verba ～ます & Tempat Aksi で (Kanji 校・店)' WHERE id = 'b0000026-0000-0000-0000-000000001301';
UPDATE lessons SET short_title = 'Alat & Lokasi', title = 'Node 2: Kosakata Lokasi, Alat & Bahasa (はし・日本語)' WHERE id = 'b0000026-0000-0000-0000-000000001302';
UPDATE lessons SET short_title = 'Sarana & Bahasa で', title = 'Node 3: Lanjutan Partikel で — Sarana, Alat & Pengantar Bahasa (はしで・日本語で)' WHERE id = 'b0000027-0000-0000-0000-000013000003';
UPDATE lessons SET short_title = 'Tempat Aksi Harian', title = 'Node 4: Kosakata Tempat Aksi & Fasilitas (としょかん・レストラン・デパート)' WHERE id = 'b0000027-0000-0000-0000-000013000004';
UPDATE lessons SET short_title = 'Kontras で vs に', title = 'Node 5: Teori Kontras で vs に & Kalimat Multi-Partikel' WHERE id = 'b0000026-0000-0000-0000-000000001303';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 13' WHERE id = 'b0000026-0000-0000-0000-000000001304';
UPDATE lessons SET short_title = 'Checkpoint Unit 13', title = 'Node 7: Checkpoint Unit 13 — Evaluasi Partikel で (Aksi & Sarana)' WHERE id = 'b0000027-0000-0000-0000-000013000007';

UPDATE units SET title = 'Ajakan Sopan (～ませんか/～ましょう) & Kata Sambung Kalimat', description = 'Review partikel で, kuasai kosakata ajakan & konjungsi, kalimat mengajak teman, serta praktik 4 keterampilan.' WHERE id = 'a0000026-0000-0000-0000-000000000014';
UPDATE lessons SET short_title = 'Review & Ajakan', title = 'Node 1: Review Partikel で/に/を & Pola Ajakan (～ませんか)' WHERE id = 'b0000026-0000-0000-0000-000000001401';
UPDATE lessons SET short_title = 'Sambung Kalimat', title = 'Node 2: Kosakata Ajakan, Tawar Bantuan & Kata Sambung' WHERE id = 'b0000026-0000-0000-0000-000000001402';
UPDATE lessons SET short_title = 'Tawar Bantuan ましょうか', title = 'Node 3: Lanjutan Ajakan — Menawarkan Bantuan (～ましょうか) & Respon Sopan' WHERE id = 'b0000027-0000-0000-0000-000014000003';
UPDATE lessons SET short_title = 'Kata Sambung Harian', title = 'Node 4: Kosakata Kata Sambung & Penata Wacana (そして・それから・それじゃ)' WHERE id = 'b0000027-0000-0000-0000-000014000004';
UPDATE lessons SET short_title = 'Kalimat Ajakan', title = 'Node 5: Teori & Kalimat Ajakan Sopan (～ませんか/ましょう)' WHERE id = 'b0000001-0000-0000-0000-000000000013';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 14' WHERE id = 'b0000026-0000-0000-0000-000000001404';
UPDATE lessons SET short_title = 'Checkpoint Unit 14', title = 'Node 7: Checkpoint Unit 14 — Evaluasi Ajakan & Tawar Bantuan' WHERE id = 'b0000027-0000-0000-0000-000014000007';

UPDATE units SET title = 'Transportasi (で), Arah (へ), Rentang (から～まで) & Ujian Tahap 3', description = 'Review ajakan, verba gerak & kendaraan, kalimat rute harian, serta praktik 4 pilar & Ujian Tahap 3.' WHERE id = 'a0000001-0000-0000-0000-000000000004';
UPDATE lessons SET short_title = 'Review & Arah へ', title = 'Node 1: Review Ajakan & Kanji Gerak (行・来・駅) + Arah へ' WHERE id = 'b0000001-0000-0000-0000-000000000007';
UPDATE lessons SET short_title = 'Transportasi', title = 'Node 2: Kosakata Kendaraan, Jalan Kaki & Teman と' WHERE id = 'b0000001-0000-0000-0000-000000000015';
UPDATE lessons SET short_title = 'Arah Gerak へ', title = 'Node 3: Lanjutan Arah Gerak — Partikel へ (e) & Verba Perpindahan (行きます・来ます・帰ります)' WHERE id = 'b0000027-0000-0000-0000-000015000003';
UPDATE lessons SET short_title = 'Transportasi & Sarana', title = 'Node 4: Kosakata Transportasi & Sarana Perjalanan (でんしゃ・バス・しんかんせん)' WHERE id = 'b0000027-0000-0000-0000-000015000004';
UPDATE lessons SET short_title = 'Kalimat Rute', title = 'Node 5: Teori Rentang (から～まで) & Kalimat Rute Harian' WHERE id = 'b0000018-0000-0000-0000-000000000004';
UPDATE lessons SET short_title = 'Persiapan Ujian T3', title = 'Node 6: Praktik 4 Pilar — Verba Masu, Objek を, Tempat で & Arah (Persiapan Ujian 3)' WHERE id = 'b0000027-0000-0000-0000-000015000006';
UPDATE lessons SET short_title = 'Ujian Tahap 3', title = 'Node 7: Praktik 4 Pilar & Ujian Tahap 3' WHERE id = 'b0000026-0000-0000-0000-000000001504';

UPDATE units SET title = 'Katakana Batch 3 (マ–ロ): Fasilitas Kota & Keberadaan (あります・います)', description = 'Review Tahap 3, kuasai Katakana fasilitas kota, kalimat keberadaan statis, serta praktik ngomong, tulis & baca.' WHERE id = 'a0000001-0000-0000-0000-000000000005';
UPDATE lessons SET short_title = 'Review & マ–ロ', title = 'Node 1: Review Tahap 3 & Lanjut Katakana 3 (マ–ロ)' WHERE id = 'b0000026-0000-0000-0000-000000001601';
UPDATE lessons SET short_title = 'Fasilitas Kota', title = 'Node 2: Kosakata Fasilitas Kota & Makhluk Hidup' WHERE id = 'b0000001-0000-0000-0000-000000000019';
UPDATE lessons SET short_title = 'Katakana マ–ロ & Fasilitas', title = 'Node 3: Lanjutan Katakana 3 — Deret マ–ロ & Kosakata Fasilitas Kota Modern' WHERE id = 'b0000027-0000-0000-0000-000016000003';
UPDATE lessons SET short_title = 'Kontras あります vs います', title = 'Node 4: Kosakata Keberadaan & Aturan Kontras (あります vs います)' WHERE id = 'b0000027-0000-0000-0000-000016000004';
UPDATE lessons SET short_title = 'あります・います', title = 'Node 5: Teori あります vs います & Kalimat Lokasi' WHERE id = 'b0000001-0000-0000-0000-000000000016';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 16' WHERE id = 'b0000026-0000-0000-0000-000000001604';
UPDATE lessons SET short_title = 'Checkpoint Unit 16', title = 'Node 7: Checkpoint Unit 16 — Evaluasi Keberadaan あります・います' WHERE id = 'b0000027-0000-0000-0000-000016000007';

UPDATE units SET title = 'Posisi Spasial (うえ・した・となり), Daftar と vs や & Kanji Arah', description = 'Review keberadaan, kuasai 8 Kanji arah, kosakata posisi, kalimat と vs や, serta praktik ngomong, tulis & baca.' WHERE id = 'a0000026-0000-0000-0000-000000000017';
UPDATE lessons SET short_title = 'Review & Arah', title = 'Node 1: Review Keberadaan & 8 Kanji Posisi (上・下・中・前・右)' WHERE id = 'b0000026-0000-0000-0000-000000001701';
UPDATE lessons SET short_title = 'Posisi Benda', title = 'Node 2: Kosakata Posisi Spasial (うえ・した・となり・あいだ)' WHERE id = 'b0000001-0000-0000-0000-000000000017';
UPDATE lessons SET short_title = '8 Kanji Posisi Ruang', title = 'Node 3: Lanjutan Posisi — 8 Kanji Posisi & Arah Ruang (上・下・前・後・右・左・中・間)' WHERE id = 'b0000027-0000-0000-0000-000017000003';
UPDATE lessons SET short_title = 'Posisi Relatif Kompleks', title = 'Node 4: Kosakata Posisi Relatif Kompleks (となり・ちかく・よこ・あいだ)' WHERE id = 'b0000027-0000-0000-0000-000017000004';
UPDATE lessons SET short_title = 'Kalimat Denah', title = 'Node 5: Teori Daftar と vs や & Kalimat Denah Ruangan' WHERE id = 'b0000018-0000-0000-0000-000000000005';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 17' WHERE id = 'b0000026-0000-0000-0000-000000001704';
UPDATE lessons SET short_title = 'Checkpoint Unit 17', title = 'Node 7: Checkpoint Unit 17 — Evaluasi Posisi Relatif & Arah' WHERE id = 'b0000027-0000-0000-0000-000017000007';

UPDATE units SET title = 'Katakana Batch 4 (ワ–ン): Tuntas 46 Huruf & Kata Sifat-I (い)', description = 'Review posisi, tuntaskan Katakana (シ/ツ vs ソ/ン), negasi Sifat-I, serta praktik ngomong, tulis & baca.' WHERE id = 'a0000001-0000-0000-0000-000000000006';
UPDATE lessons SET short_title = 'Review & ワ–ン', title = 'Node 1: Review Posisi & Tuntas 46 Katakana (シ/ツ vs ソ/ン)' WHERE id = 'b0000026-0000-0000-0000-000000001801';
UPDATE lessons SET short_title = 'Kata Sifat-I', title = 'Node 2: Kosakata Kata Sifat-I Populer & Antonim Harian' WHERE id = 'b0000026-0000-0000-0000-000000001802';
UPDATE lessons SET short_title = 'Tuntas 46 Katakana', title = 'Node 3: Lanjutan Katakana 4 — Trik Membedakan Pasangan Mirip (シ vs ツ & ソ vs ン)' WHERE id = 'b0000027-0000-0000-0000-000018000003';
UPDATE lessons SET short_title = 'Kata Sifat-I Harian', title = 'Node 4: Kosakata Kata Sifat-I Populer & Antonim Harian (おおきい・たかい・あたらしい)' WHERE id = 'b0000027-0000-0000-0000-000018000004';
UPDATE lessons SET short_title = 'Kalimat Sifat-I', title = 'Node 5: Teori & Kalimat Sifat-I (～い / ～くないです)' WHERE id = 'b0000001-0000-0000-0000-000000000020';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 18' WHERE id = 'b0000026-0000-0000-0000-000000001804';
UPDATE lessons SET short_title = 'Checkpoint Unit 18', title = 'Node 7: Checkpoint Unit 18 — Evaluasi Tuntas 46 Katakana & Kata Sifat-I' WHERE id = 'b0000027-0000-0000-0000-000018000007';

UPDATE units SET title = 'Warna, Belanja & Verba Pakaian (着ます・履きます・かぶります)', description = 'Review Sifat-I, kuasai Kanji warna & harga, 4 verba pakaian, kalimat belanja どんな, & praktik 4 keterampilan.' WHERE id = 'a0000026-0000-0000-0000-000000000019';
UPDATE lessons SET short_title = 'Review & Kanji', title = 'Node 1: Review 46 Katakana & Kanji Warna/Harga (赤・青・高・安)' WHERE id = 'b0000026-0000-0000-0000-000000001901';
UPDATE lessons SET short_title = 'Verba Pakaian', title = 'Node 2: Kosakata Pakaian & Verba Khusus (着ます・履きます)' WHERE id = 'b0000026-0000-0000-0000-000000001902';
UPDATE lessons SET short_title = 'Rumus Negasi ～くない', title = 'Node 3: Lanjutan Sifat-I — Rumus Negasi (～くない) & Pengecualian いい (よくない)' WHERE id = 'b0000027-0000-0000-0000-000019000003';
UPDATE lessons SET short_title = 'Warna & Pakaian', title = 'Node 4: Kosakata Warna, Pakaian & Verba Mengenakan (きます・はきます・かぶります)' WHERE id = 'b0000027-0000-0000-0000-000019000004';
UPDATE lessons SET short_title = 'Kalimat Belanja', title = 'Node 5: Teori どの・どんな & Kalimat Belanja di Toko' WHERE id = 'b0000018-0000-0000-0000-000000000007';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Belanja' WHERE id = 'b0000026-0000-0000-0000-000000001904';
UPDATE lessons SET short_title = 'Checkpoint Unit 19', title = 'Node 7: Checkpoint Unit 19 — Evaluasi Negasi Sifat-I & Pakaian' WHERE id = 'b0000027-0000-0000-0000-000019000007';

UPDATE units SET title = 'Kata Sifat-Na, Cuaca, Lampau Sifat, Perbandingan & Ujian Tahap 4', description = 'Review pakaian & Sifat-I, kuasai Sifat-Na, kosakata cuaca/kesukaan, kalimat perbandingan, & Ujian Tahap 4.' WHERE id = 'a0000026-0000-0000-0000-000000000020';
UPDATE lessons SET short_title = 'Review & Sifat-Na', title = 'Node 1: Review Pakaian & Teori Kata Sifat-Na (きれい)' WHERE id = 'b0000001-0000-0000-0000-000000000021';
UPDATE lessons SET short_title = 'Cuaca & Lampau', title = 'Node 2: Kosakata Cuaca, Musim & Perubahan Kala Sifat' WHERE id = 'b0000001-0000-0000-0000-000000000022';
UPDATE lessons SET short_title = 'Sifat-Na & Perbandingan', title = 'Node 3: Lanjutan Sifat-Na & Perbandingan — Rumus Atributif (な) & Lebih Unggul (より・ほう)' WHERE id = 'b0000027-0000-0000-0000-000020000003';
UPDATE lessons SET short_title = 'Cuaca & 4 Musim', title = 'Node 4: Kosakata Cuaca, 4 Musim & Suasana Kota (はる・なつ・あき・ふゆ・あめ)' WHERE id = 'b0000027-0000-0000-0000-000020000004';
UPDATE lessons SET short_title = 'Perbandingan', title = 'Node 5: Teori Kesukaan (が好き) & Kalimat Perbandingan' WHERE id = 'b0000001-0000-0000-0000-000000000023';
UPDATE lessons SET short_title = 'Persiapan Ujian T4', title = 'Node 6: Praktik 4 Pilar — Kata Sifat-I, Sifat-Na, Cuaca & Komparasi (Persiapan Ujian 4)' WHERE id = 'b0000027-0000-0000-0000-000020000006';
UPDATE lessons SET short_title = 'Ujian Tahap 4', title = 'Node 7: Praktik 4 Pilar & Ujian Tahap 4 (Ngomong, Tulis, Baca)' WHERE id = 'b0000018-0000-0000-0000-000000000008';

UPDATE units SET title = 'Konjugasi Bentuk-TE (て-Form), Permintaan (～てください) & Arah Jalan', description = 'Review Tahap 4, kuasai konjugasi Bentuk-TE Grup 1-3, kalimat arah jalan, serta praktik ngomong, tulis & baca.' WHERE id = 'a0000001-0000-0000-0000-000000000007';
UPDATE lessons SET short_title = 'Review & て-Form', title = 'Node 1: Review Tahap 4 & Rumus Bentuk-TE (Grup 1-3)' WHERE id = 'b0000001-0000-0000-0000-000000000024';
UPDATE lessons SET short_title = 'Arah & Jalan', title = 'Node 2: Kosakata Arah Jalan & Instruksi (まがる・わたる・かど)' WHERE id = 'b0000026-0000-0000-0000-000000002102';
UPDATE lessons SET short_title = '3 Golongan Verba TE', title = 'Node 3: Lanjutan Bentuk-TE — 3 Golongan Kata Kerja & Rumus Konjugasi Lengkap' WHERE id = 'b0000027-0000-0000-0000-000021000003';
UPDATE lessons SET short_title = 'Petunjuk Jalan', title = 'Node 4: Kosakata Petunjuk Arah Jalan & Landmark (まがる・わたる・しんごう・かど)' WHERE id = 'b0000027-0000-0000-0000-000021000004';
UPDATE lessons SET short_title = 'Kalimat てください', title = 'Node 5: Teori ～てください & Kalimat Petunjuk Arah Jalan' WHERE id = 'b0000018-0000-0000-0000-000000000006';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Bentuk-TE' WHERE id = 'b0000026-0000-0000-0000-000000002104';
UPDATE lessons SET short_title = 'Checkpoint Unit 21', title = 'Node 7: Checkpoint Unit 21 — Evaluasi Bentuk-TE & Instruksi Arah' WHERE id = 'b0000027-0000-0000-0000-000021000007';

UPDATE units SET title = 'Urutan Aksi (～てから) & Sedang Berlangsung / Status (～ています)', description = 'Review Bentuk-TE, kuasai urutan ～てから, kosakata status harian, kalimat ～ています, & praktik 4 keterampilan.' WHERE id = 'a0000026-0000-0000-0000-000000000022';
UPDATE lessons SET short_title = 'Review & てから', title = 'Node 1: Review Bentuk-TE Unit 21 & Verba Status (住・知・持)' WHERE id = 'b0000026-0000-0000-0000-000000002201';
UPDATE lessons SET short_title = 'Urutan てから', title = 'Node 2: Kosakata Rangkaian Aktivitas & Urutan (～てから)' WHERE id = 'b0000001-0000-0000-0000-000000000027';
UPDATE lessons SET short_title = 'Sedang & Status ています', title = 'Node 3: Lanjutan Bentuk-TE — Rumus Sedang Berlangsung vs Keberadaan Status (～ています)' WHERE id = 'b0000027-0000-0000-0000-000022000003';
UPDATE lessons SET short_title = 'Urutan Aktivitas てから', title = 'Node 4: Kosakata Rangkaian Aktivitas & Pola Urutan (～てから / ～て、～て)' WHERE id = 'b0000027-0000-0000-0000-000022000004';
UPDATE lessons SET short_title = 'Kalimat ています', title = 'Node 5: Teori ～ています (Sedang/Status) & Kalimat Harian' WHERE id = 'b0000001-0000-0000-0000-000000000025';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 22' WHERE id = 'b0000026-0000-0000-0000-000000002204';
UPDATE lessons SET short_title = 'Checkpoint Unit 22', title = 'Node 7: Checkpoint Unit 22 — Evaluasi ～ています & ～てから' WHERE id = 'b0000027-0000-0000-0000-000022000007';

UPDATE units SET title = 'Meminta Izin (～てもいい), Larangan & Bentuk-NAI (～ないで)', description = 'Review ～ています & Bentuk-NAI, kosakata aturan umum, kalimat izin & larangan halus, & praktik 4 keterampilan.' WHERE id = 'a0000026-0000-0000-0000-000000000023';
UPDATE lessons SET short_title = 'Review & ない-Form', title = 'Node 1: Review ～ています & Rumus Bentuk-NAI (Grup 1-3)' WHERE id = 'b0000026-0000-0000-0000-000000002301';
UPDATE lessons SET short_title = 'Izin & Rambu', title = 'Node 2: Kosakata Rambu Umum & Pola Izin (～てもいい)' WHERE id = 'b0000001-0000-0000-0000-000000000026';
UPDATE lessons SET short_title = 'Larangan & Bentuk-NAI', title = 'Node 3: Lanjutan Aturan — Rumus Larangan (～てはいけません) & Bentuk-NAI (ない形)' WHERE id = 'b0000027-0000-0000-0000-000023000003';
UPDATE lessons SET short_title = 'Izin & Rambu Umum', title = 'Node 4: Kosakata Izin (～てもいい) & Rambu Larangan di Tempat Kerja (きんえん・ちゅうしゃ)' WHERE id = 'b0000027-0000-0000-0000-000023000004';
UPDATE lessons SET short_title = 'ないでください', title = 'Node 5: Teori Larangan & Kalimat Permintaan ～ないでください' WHERE id = 'b0000018-0000-0000-0000-000000000011';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 23' WHERE id = 'b0000026-0000-0000-0000-000000002304';
UPDATE lessons SET short_title = 'Checkpoint Unit 23', title = 'Node 7: Checkpoint Unit 23 — Evaluasi Izin, Larangan & Bentuk-NAI' WHERE id = 'b0000027-0000-0000-0000-000023000007';

UPDATE units SET title = 'Tubuh, Kesehatan (痛い) & Kewajiban (～なければ/なくてもいい)', description = 'Review Bentuk-NAI, kuasai Kanji tubuh, kosakata klinik, kalimat kewajiban vs tidak perlu, & praktik 4 keterampilan.' WHERE id = 'a0000026-0000-0000-0000-000000000024';
UPDATE lessons SET short_title = 'Review & Tubuh', title = 'Node 1: Review Bentuk-NAI & Kanji Tubuh (病・院・目・手・足)' WHERE id = 'b0000026-0000-0000-0000-000000002401';
UPDATE lessons SET short_title = 'Tubuh & Sakit', title = 'Node 2: Kosakata Tubuh, Klinik & Keluhan Sakit (頭が痛い)' WHERE id = 'b0000026-0000-0000-0000-000000002402';
UPDATE lessons SET short_title = 'Kewajiban なければ', title = 'Node 3: Lanjutan Kesehatan — Rumus Kewajiban (～なければなりません) & Bebas Tugas (～なくてもいい)' WHERE id = 'b0000027-0000-0000-0000-000024000003';
UPDATE lessons SET short_title = 'Tubuh & Keluhan Klinik', title = 'Node 4: Kosakata Bagian Tubuh & Keluhan Sakit di Klinik (頭が痛い・熱がある)' WHERE id = 'b0000027-0000-0000-0000-000024000004';
UPDATE lessons SET short_title = 'Kewajiban N5', title = 'Node 5: Teori & Kalimat Kewajiban (～なければ / なくてもいい)' WHERE id = 'b0000026-0000-0000-0000-000000002403';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca di Klinik' WHERE id = 'b0000026-0000-0000-0000-000000002404';
UPDATE lessons SET short_title = 'Checkpoint Unit 24', title = 'Node 7: Checkpoint Unit 24 — Evaluasi Tubuh, Klinik & Kewajiban なければ' WHERE id = 'b0000027-0000-0000-0000-000024000007';

UPDATE units SET title = 'Sambungan Sifat (～くて/～で), Perubahan Keadaan & Ujian Tahap 5', description = 'Review klinik, kuasai sambung sifat ～くて/で, kosakata deskriptif, perubahan ～くなる/になる, & Ujian Tahap 5.' WHERE id = 'a0000026-0000-0000-0000-000000000025';
UPDATE lessons SET short_title = 'Review & ～くて', title = 'Node 1: Review Klinik & Rumus Sambung Sifat (～くて / ～で)' WHERE id = 'b0000026-0000-0000-0000-000000002501';
UPDATE lessons SET short_title = 'Sifat Majemuk', title = 'Node 2: Kosakata Sifat Majemuk & Deskripsi Lingkungan' WHERE id = 'b0000026-0000-0000-0000-000000002502';
UPDATE lessons SET short_title = 'Menjadi くなる・になる', title = 'Node 3: Lanjutan Perubahan — Rumus Menjadi / Bertransformasi (～くなる / ～になる)' WHERE id = 'b0000027-0000-0000-0000-000025000003';
UPDATE lessons SET short_title = 'Sambungan Sifat くて・で', title = 'Node 4: Kosakata Sambungan Sifat Majemuk (～くて / ～で・安くておいしい)' WHERE id = 'b0000027-0000-0000-0000-000025000004';
UPDATE lessons SET short_title = '～くなる・になる', title = 'Node 5: Teori & Kalimat Perubahan (～くなる / ～になる)' WHERE id = 'b0000026-0000-0000-0000-000000002503';
UPDATE lessons SET short_title = 'Persiapan Ujian T5', title = 'Node 6: Praktik 4 Pilar — Bentuk-TE, NAI, Kewajiban & Sambung Sifat (Persiapan Ujian 5)' WHERE id = 'b0000027-0000-0000-0000-000025000006';
UPDATE lessons SET short_title = 'Ujian Tahap 5', title = 'Node 7: Praktik 4 Pilar & Ujian Tahap 5' WHERE id = 'b0000026-0000-0000-0000-000000002504';

UPDATE units SET title = 'Masa Lampau (～ました), Pengalaman (～たことがある) & Akhir Pekan', description = 'Review Tahap 5, kuasai Bentuk-TA, kalimat cerita kemarin & pengalaman, serta praktik ngomong, tulis & baca.' WHERE id = 'a0000001-0000-0000-0000-000000000008';
UPDATE lessons SET short_title = 'Review & た-Form', title = 'Node 1: Review Tahap 5 & Rumus Bentuk-TA (～ました/～た)' WHERE id = 'b0000018-0000-0000-0000-000000000009';
UPDATE lessons SET short_title = '～たり・あとで', title = 'Node 2: Kosakata Akhir Pekan & Pola ～たり / ～たあとで' WHERE id = 'b0000018-0000-0000-0000-000000000010';
UPDATE lessons SET short_title = 'Kegiatan Acak ～たり', title = 'Node 3: Lanjutan Bentuk-TA — Rangkaian Contoh Kegiatan Acak (～たり、～たり します)' WHERE id = 'b0000027-0000-0000-0000-000026000003';
UPDATE lessons SET short_title = 'Setelah ～たあとで', title = 'Node 4: Kosakata Rangkaian Waktu Lampau & Pola Setelah (～たあとで・経験)' WHERE id = 'b0000027-0000-0000-0000-000026000004';
UPDATE lessons SET short_title = 'たことがある', title = 'Node 5: Teori Pengalaman (～たことがある) & Kalimat Cerita' WHERE id = 'b0000001-0000-0000-0000-000000000030';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 26' WHERE id = 'b0000026-0000-0000-0000-000000002604';
UPDATE lessons SET short_title = 'Checkpoint Unit 26', title = 'Node 7: Checkpoint Unit 26 — Evaluasi Bentuk-TA, Pengalaman & ～たり' WHERE id = 'b0000027-0000-0000-0000-000026000007';

UPDATE units SET title = 'Bentuk Kamus (辞書形), Hobi, Sebelum (～まえに) & Ketika (～とき)', description = 'Review Bentuk-TA, kuasai Bentuk Kamus, kosakata hobi & kemampuan, kalimat まえに/とき, & praktik 4 keterampilan.' WHERE id = 'a0000026-0000-0000-0000-000000000027';
UPDATE lessons SET short_title = 'Review & 辞書形', title = 'Node 1: Review Bentuk-TA & Rumus Bentuk Kamus (辞書形)' WHERE id = 'b0000018-0000-0000-0000-000000000013';
UPDATE lessons SET short_title = 'Hobi & Bakat', title = 'Node 2: Kosakata Hobi, Bakat & Kemampuan (ことができます)' WHERE id = 'b0000026-0000-0000-0000-000000002702';
UPDATE lessons SET short_title = 'Sebelum まえに & とき', title = 'Node 3: Lanjutan Bentuk Kamus — Pola Sebelum (まえに) & Ketika / Saat (とき)' WHERE id = 'b0000027-0000-0000-0000-000027000003';
UPDATE lessons SET short_title = 'Kemampuan できます & Hobi', title = 'Node 4: Kosakata Kemampuan, Hobi & Bakat (～ことが できます・しゅみ)' WHERE id = 'b0000027-0000-0000-0000-000027000004';
UPDATE lessons SET short_title = 'まえに・とき', title = 'Node 5: Teori & Kalimat Sebelum (まえに) vs Ketika (とき)' WHERE id = 'b0000026-0000-0000-0000-000000002703';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 27' WHERE id = 'b0000026-0000-0000-0000-000000002704';
UPDATE lessons SET short_title = 'Checkpoint Unit 27', title = 'Node 7: Checkpoint Unit 27 — Evaluasi Bentuk Kamus, Kemampuan & Waktu' WHERE id = 'b0000027-0000-0000-0000-000027000007';

UPDATE units SET title = 'Kalimat Kasual (普通形), Opini, Anak Kalimat Nomina & Ujian Tahap 6', description = 'Review Bentuk Kamus, kuasai gaya kasual 普通形, kosakata opini, anak kalimat nomina, & Ujian Tahap 6.' WHERE id = 'a0000026-0000-0000-0000-000000000028';
UPDATE lessons SET short_title = 'Review & 普通形', title = 'Node 1: Review Bentuk Kamus & Teori Gaya Kasual (普通形)' WHERE id = 'b0000026-0000-0000-0000-000000002801';
UPDATE lessons SET short_title = 'Opini & Kutipan', title = 'Node 2: Kosakata Opini (と思う) & Kutipan (と言いました)' WHERE id = 'b0000026-0000-0000-0000-000000002802';
UPDATE lessons SET short_title = 'Modifikasi Nomina Kasual', title = 'Node 3: Lanjutan Kasual — Anak Kalimat Modifikasi Nomina (母が作った料理・私が読む本)' WHERE id = 'b0000027-0000-0000-0000-000028000003';
UPDATE lessons SET short_title = 'Opini と思う & Kutipan', title = 'Node 4: Kosakata Opini (～と 思う) & Kalimat Kutipan Langsung/Tak Langsung (～と 言いました)' WHERE id = 'b0000027-0000-0000-0000-000028000004';
UPDATE lessons SET short_title = 'Penjelas Nomina', title = 'Node 5: Teori & Kalimat Penjelas Benda (母が作った料理)' WHERE id = 'b0000026-0000-0000-0000-000000002803';
UPDATE lessons SET short_title = 'Persiapan Ujian T6', title = 'Node 6: Praktik 4 Pilar — Bentuk Kasual, Modifikasi Benda & Opini (Persiapan Ujian 6)' WHERE id = 'b0000027-0000-0000-0000-000028000006';
UPDATE lessons SET short_title = 'Ujian Tahap 6', title = 'Node 7: Praktik 4 Pilar & Ujian Tahap 6' WHERE id = 'b0000026-0000-0000-0000-000000002804';

UPDATE units SET title = 'Keinginan (～たい vs ほしい), Tujuan (～に行く), Alasan & Saling Bantu', description = 'Review Tahap 6, kuasai keinginan ～たい vs ほしい, tujuan ～に行く, budaya あげる/もらう/くれる, & praktik 4 keterampilan.' WHERE id = 'a0000026-0000-0000-0000-000000000029';
UPDATE lessons SET short_title = 'Review & ～たい', title = 'Node 1: Review Tahap 6 & Teori Keinginan (～たい vs ほしい)' WHERE id = 'b0000001-0000-0000-0000-000000000028';
UPDATE lessons SET short_title = 'Tujuan & Alasan', title = 'Node 2: Kosakata Rencana, Tujuan (～に行く) & Alasan から' WHERE id = 'b0000001-0000-0000-0000-000000000029';
UPDATE lessons SET short_title = 'Keinginan たい vs ほしい', title = 'Node 3: Lanjutan Keinginan — Rumus Ingin Melakukan (～たい) vs Ingin Benda (ほしい)' WHERE id = 'b0000027-0000-0000-0000-000029000003';
UPDATE lessons SET short_title = 'Memberi & Menerima', title = 'Node 4: Kosakata Saling Bantu & Memberi-Menerima (あげる・もらう・くれる)' WHERE id = 'b0000027-0000-0000-0000-000029000004';
UPDATE lessons SET short_title = 'Saling Bantu', title = 'Node 5: Teori & Kalimat あげる・もらう・くれます' WHERE id = 'b0000018-0000-0000-0000-000000000012';
UPDATE lessons SET short_title = 'Ngomong & Baca', title = 'Node 6: Praktik Ngomong, Menulis & Membaca Unit 29' WHERE id = 'b0000026-0000-0000-0000-000000002904';
UPDATE lessons SET short_title = 'Checkpoint Unit 29', title = 'Node 7: Checkpoint Unit 29 — Evaluasi Keinginan & Saling Bantu' WHERE id = 'b0000027-0000-0000-0000-000029000007';

UPDATE units SET title = 'Konsolidasi Total JLPT N5 & Simulasi Ujian Kesiapan N5', description = 'Review seluruh 46 Hiragana, 46 Katakana, 50+ Kanji, kosakata jebakan, grammar kontras, & simulasi 4 pilar N5.' WHERE id = 'a0000026-0000-0000-0000-000000000030';
UPDATE lessons SET short_title = 'Review Aksara', title = 'Node 1: Review Total 46 Hiragana, 46 Katakana & 50+ Kanji' WHERE id = 'b0000026-0000-0000-0000-000000003001';
UPDATE lessons SET short_title = 'Kosakata N5', title = 'Node 2: Konsolidasi Kosakata Jebakan & Percakapan Harian' WHERE id = 'b0000001-0000-0000-0000-000000000031';
UPDATE lessons SET short_title = 'Jebakan Partikel N5', title = 'Node 3: Konsolidasi Lintas 16+ Pola — Mengurai Jebakan Partikel N5 (は・が・に・で・へ・を)' WHERE id = 'b0000027-0000-0000-0000-000030000003';
UPDATE lessons SET short_title = 'Wacana Dokumen Praktis', title = 'Node 4: Pemahaman Wacana Pendek & Dokumen Praktis (Pengumuman, Jam Buka & Tiket)' WHERE id = 'b0000027-0000-0000-0000-000030000004';
UPDATE lessons SET short_title = 'Grammar N5', title = 'Node 5: Konsolidasi Lintas 16+ Grammar & Kontras Partikel' WHERE id = 'b0000018-0000-0000-0000-000000000014';
UPDATE lessons SET short_title = 'Simulasi Wawancara', title = 'Node 6: Praktik 4 Pilar — Simulasi Percakapan Wawancara Nyata & Kehidupan Jepang' WHERE id = 'b0000027-0000-0000-0000-000030000006';
UPDATE lessons SET short_title = 'Simulasi N5', title = 'Node 7: Simulasi 4 Pilar — Ngomong, Tulis, Baca & Dengar N5' WHERE id = 'b0000026-0000-0000-0000-000000003004';

UPDATE units SET title = 'Unit 2: Evaluasi Kesiapan N5 (Diagnostic Mock Exam)', description = 'Uji kesiapan pemahaman tata bahasa dan kosakata dasar dengan simulasi berbatas waktu.' WHERE id = 'a0000001-0000-0000-0000-000000000002';
UPDATE lessons SET short_title = 'Ujian N5', title = 'Simulasi Sectional N5: Evaluasi Tata Bahasa' WHERE id = 'b0000001-0000-0000-0000-000000000003';

COMMIT;
