-- ============================================================================
-- Migration: 000027_deepen_n5_nodes_and_exercises.down.sql
-- Description: Rollback migration 000027 cleanly.
-- ============================================================================

BEGIN;

-- 1. Delete all exercises created in migration 27
DELETE FROM exercises WHERE id >= 'c0000027-0000-0000-0000-000000000000'::uuid AND id <= 'c0000027-ffff-ffff-ffff-ffffffffffff'::uuid;

-- 2. Delete all lessons created in migration 27
DELETE FROM lessons WHERE id >= 'b0000027-0000-0000-0000-000000000000'::uuid AND id <= 'b0000027-ffff-ffff-ffff-ffffffffffff'::uuid;

-- 3. Restore original order_index and titles for shifted lessons
UPDATE lessons SET order_index = 3, title = 'Node 3: Frasa Pendek & Ungkapan Harian Pertama' WHERE id = 'b0000001-0000-0000-0000-000000000008'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 1' WHERE id = 'b0000026-0000-0000-0000-000000000104'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Bikin Kalimat — Salam & Kata Tunjuk (これ・それ)' WHERE id = 'b0000002-0000-0000-0000-000000000003'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 2' WHERE id = 'b0000026-0000-0000-0000-000000000204'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori Partikel は (wa) & Kalimat Pertama (～です)' WHERE id = 'b0000001-0000-0000-0000-000000000001'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 3' WHERE id = 'b0000026-0000-0000-0000-000000000304'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori & Kalimat Triad Penunjuk (これ・それ・あれ)' WHERE id = 'b0000026-0000-0000-0000-000000000403'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca 46 Hiragana' WHERE id = 'b0000026-0000-0000-0000-000000000404'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Bikin Kalimat Negatif (ではありません), Tanya & も' WHERE id = 'b0000001-0000-0000-0000-000000000002'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik 4 Pilar & Ujian Tahap 1' WHERE id = 'b0000026-0000-0000-0000-000000000504'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori Partikel の & Bikin Kalimat Kepemilikan' WHERE id = 'b0000001-0000-0000-0000-000000000011'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 6' WHERE id = 'b0000026-0000-0000-0000-000000000604'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Bikin Kalimat Perkenalan Keluarga & Profesi Sopan' WHERE id = 'b0000026-0000-0000-0000-000000000703'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 7' WHERE id = 'b0000026-0000-0000-0000-000000000704'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Bikin Kalimat Angka 1–100, Umur (～さい) & Negara' WHERE id = 'b0000001-0000-0000-0000-000000000009'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 8' WHERE id = 'b0000026-0000-0000-0000-000000000804'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori & Kalimat Belanja (いくら & Counters Wajib N5)' WHERE id = 'b0000026-0000-0000-0000-000000000903'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 9' WHERE id = 'b0000026-0000-0000-0000-000000000904'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori Partikel Waktu に & Kalimat Jadwal Harian' WHERE id = 'b0000018-0000-0000-0000-000000000003'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik 4 Pilar & Ujian Tahap 2' WHERE id = 'b0000026-0000-0000-0000-000000001004'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori Partikel Objek を & Kalimat Pesan Makanan' WHERE id = 'b0000001-0000-0000-0000-000000000005'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca di Kafe' WHERE id = 'b0000026-0000-0000-0000-000000001104'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori Negatif (～ません), Frekuensi & Kalimat Rutin' WHERE id = 'b0000018-0000-0000-0000-000000000002'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 12' WHERE id = 'b0000026-0000-0000-0000-000000001204'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori Kontras で vs に & Kalimat Multi-Partikel' WHERE id = 'b0000026-0000-0000-0000-000000001303'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 13' WHERE id = 'b0000026-0000-0000-0000-000000001304'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori & Kalimat Ajakan Sopan (～ませんか/ましょう)' WHERE id = 'b0000001-0000-0000-0000-000000000013'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 14' WHERE id = 'b0000026-0000-0000-0000-000000001404'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori Rentang (から～まで) & Kalimat Rute Harian' WHERE id = 'b0000018-0000-0000-0000-000000000004'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik 4 Pilar & Ujian Tahap 3' WHERE id = 'b0000026-0000-0000-0000-000000001504'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori あります vs います & Kalimat Lokasi' WHERE id = 'b0000001-0000-0000-0000-000000000016'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 16' WHERE id = 'b0000026-0000-0000-0000-000000001604'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori Daftar と vs や & Kalimat Denah Ruangan' WHERE id = 'b0000018-0000-0000-0000-000000000005'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 17' WHERE id = 'b0000026-0000-0000-0000-000000001704'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori & Kalimat Sifat-I (～い / ～くないです)' WHERE id = 'b0000001-0000-0000-0000-000000000020'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 18' WHERE id = 'b0000026-0000-0000-0000-000000001804'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori どの・どんな & Kalimat Belanja di Toko' WHERE id = 'b0000018-0000-0000-0000-000000000007'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Belanja' WHERE id = 'b0000026-0000-0000-0000-000000001904'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori Kesukaan (が好き) & Kalimat Perbandingan' WHERE id = 'b0000001-0000-0000-0000-000000000023'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik 4 Pilar & Ujian Tahap 4 (Ngomong, Tulis, Baca)' WHERE id = 'b0000018-0000-0000-0000-000000000008'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori ～てください & Kalimat Petunjuk Arah Jalan' WHERE id = 'b0000018-0000-0000-0000-000000000006'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Bentuk-TE' WHERE id = 'b0000026-0000-0000-0000-000000002104'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori ～ています (Sedang/Status) & Kalimat Harian' WHERE id = 'b0000001-0000-0000-0000-000000000025'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 22' WHERE id = 'b0000026-0000-0000-0000-000000002204'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori Larangan & Kalimat Permintaan ～ないでください' WHERE id = 'b0000018-0000-0000-0000-000000000011'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 23' WHERE id = 'b0000026-0000-0000-0000-000000002304'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori & Kalimat Kewajiban (～なければ / なくてもいい)' WHERE id = 'b0000026-0000-0000-0000-000000002403'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca di Klinik' WHERE id = 'b0000026-0000-0000-0000-000000002404'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori & Kalimat Perubahan (～くなる / ～になる)' WHERE id = 'b0000026-0000-0000-0000-000000002503'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik 4 Pilar & Ujian Tahap 5' WHERE id = 'b0000026-0000-0000-0000-000000002504'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori Pengalaman (～たことがある) & Kalimat Cerita' WHERE id = 'b0000001-0000-0000-0000-000000000030'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 26' WHERE id = 'b0000026-0000-0000-0000-000000002604'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori & Kalimat Sebelum (まえに) vs Ketika (とき)' WHERE id = 'b0000026-0000-0000-0000-000000002703'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 27' WHERE id = 'b0000026-0000-0000-0000-000000002704'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori & Kalimat Penjelas Benda (母が作った料理)' WHERE id = 'b0000026-0000-0000-0000-000000002803'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik 4 Pilar & Ujian Tahap 6' WHERE id = 'b0000026-0000-0000-0000-000000002804'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Teori & Kalimat あげる・もらう・くれます' WHERE id = 'b0000018-0000-0000-0000-000000000012'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Praktik Ngomong, Menulis & Membaca Unit 29' WHERE id = 'b0000026-0000-0000-0000-000000002904'::uuid;
UPDATE lessons SET order_index = 3, title = 'Node 3: Konsolidasi Lintas 16+ Grammar & Kontras Partikel' WHERE id = 'b0000018-0000-0000-0000-000000000014'::uuid;
UPDATE lessons SET order_index = 4, title = 'Node 4: Simulasi 4 Pilar — Ngomong, Tulis, Baca & Dengar N5' WHERE id = 'b0000026-0000-0000-0000-000000003004'::uuid;

COMMIT;
