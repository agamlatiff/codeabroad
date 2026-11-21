-- ============================================================================
-- Migration: 000026_restructure_n5_30_interleaved_micro_units.down.sql
-- Description: Revert JLPT N5 curriculum back to the 8-unit layout.
-- ============================================================================

BEGIN;

-- Restore original unit mappings for the 46 N5 lessons
UPDATE lessons SET unit_id = 'a0000002-0000-0000-0000-000000000002'::uuid, order_index = 1 WHERE slug = 'n5-vokal-utama-hiragana';
UPDATE lessons SET unit_id = 'a0000002-0000-0000-0000-000000000002'::uuid, order_index = 2 WHERE slug = 'n5-salam-pertama-aisatsu';
UPDATE lessons SET unit_id = 'a0000002-0000-0000-0000-000000000002'::uuid, order_index = 3 WHERE slug = 'n5-konsonan-dasar-hiragana';
UPDATE lessons SET unit_id = 'a0000002-0000-0000-0000-000000000002'::uuid, order_index = 4 WHERE slug = 'n5-katakana-pinjaman-angka-dasar';

UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000001'::uuid, order_index = 1 WHERE slug = 'n5-salam-perkenalan-identitas';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000001'::uuid, order_index = 2 WHERE slug = 'n5-profesi-dan-kewarganegaraan';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000001'::uuid, order_index = 3 WHERE slug = 'n5-kata-tunjuk-benda-kepemilikan';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000001'::uuid, order_index = 4 WHERE slug = 'n5-informasi-dan-asal-daerah';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000001'::uuid, order_index = 5 WHERE slug = 'n5-keluarga-dan-panggilan';

UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000003'::uuid, order_index = 1 WHERE slug = 'n5-makan-minum-rutinitas-pagi';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000003'::uuid, order_index = 2 WHERE slug = 'n5-membeli-barang-di-kafe';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000003'::uuid, order_index = 3 WHERE slug = 'n5-kegiatan-waktu-luang-hobi';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000003'::uuid, order_index = 4 WHERE slug = 'n5-mengajak-rekan-kerja';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000003'::uuid, order_index = 5 WHERE slug = 'n5-frekuensi-kebiasaan-harian';

UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000004'::uuid, order_index = 1 WHERE slug = 'n5-jam-kerja-jadwal-harian';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000004'::uuid, order_index = 2 WHERE slug = 'n5-komuter-kereta-tokyo';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000004'::uuid, order_index = 3 WHERE slug = 'n5-hari-tanggal-agenda-kantor';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000004'::uuid, order_index = 4 WHERE slug = 'n5-durasi-perjalanan-transit';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000004'::uuid, order_index = 5 WHERE slug = 'n5-bulan-dan-tanggal-kalender';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000004'::uuid, order_index = 6 WHERE slug = 'n5-rute-transportasi-dan-sarana';

UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000005'::uuid, order_index = 1 WHERE slug = 'n5-keberadaan-benda-dan-orang';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000005'::uuid, order_index = 2 WHERE slug = 'n5-posisi-relatif-ruangan';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000005'::uuid, order_index = 3 WHERE slug = 'n5-menghitung-benda-daftar-item';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000005'::uuid, order_index = 4 WHERE slug = 'n5-letak-fasilitas-umum-kota';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000005'::uuid, order_index = 5 WHERE slug = 'n5-denah-kantor-dan-ruangan';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000005'::uuid, order_index = 6 WHERE slug = 'n5-menunjuk-arah-dan-petunjuk-jalan';

UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000006'::uuid, order_index = 1 WHERE slug = 'n5-kata-sifat-i-kehidupan-harian';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000006'::uuid, order_index = 2 WHERE slug = 'n5-kata-sifat-na-penilaian-kerja';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000006'::uuid, order_index = 3 WHERE slug = 'n5-lampau-kata-sifat-dan-cuaca';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000006'::uuid, order_index = 4 WHERE slug = 'n5-perbandingan-dan-pilihan-favorit';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000006'::uuid, order_index = 5 WHERE slug = 'n5-belanja-harga-dan-warna';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000006'::uuid, order_index = 6 WHERE slug = 'n5-musim-dan-suasana-kota';

UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000007'::uuid, order_index = 1 WHERE slug = 'n5-permintaan-sopan-di-kantor';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000007'::uuid, order_index = 2 WHERE slug = 'n5-aktivitas-sedang-berlangsung';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000007'::uuid, order_index = 3 WHERE slug = 'n5-aturan-izin-dan-larangan';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000007'::uuid, order_index = 4 WHERE slug = 'n5-menyambung-urutan-aktivitas';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000007'::uuid, order_index = 5 WHERE slug = 'n5-bentuk-lampau-kata-kerja';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000007'::uuid, order_index = 6 WHERE slug = 'n5-cerita-kegiatan-akhir-pekan';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000007'::uuid, order_index = 7 WHERE slug = 'n5-sopan-santun-di-tempat-kerja';

UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000008'::uuid, order_index = 1 WHERE slug = 'n5-keinginan-dan-target-n5';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000008'::uuid, order_index = 2 WHERE slug = 'n5-tujuan-kepergian-dan-alasan';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000008'::uuid, order_index = 3 WHERE slug = 'n5-pengalaman-dan-kebiasaan';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000008'::uuid, order_index = 4 WHERE slug = 'n5-simulasi-percakapan-harian';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000008'::uuid, order_index = 5 WHERE slug = 'n5-memberi-dan-menerima-bantuan';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000008'::uuid, order_index = 6 WHERE slug = 'n5-rencana-dan-kemahiran';
UPDATE lessons SET unit_id = 'a0000001-0000-0000-0000-000000000008'::uuid, order_index = 7 WHERE slug = 'n5-ulasan-komprehensif-jlpt-n5';

-- Delete newly inserted micro-exercises, micro-lessons & micro-units
DELETE FROM exercises WHERE id::text LIKE 'c0000026-%';
DELETE FROM lessons WHERE id::text LIKE 'b0000026-%';
DELETE FROM units WHERE id::text LIKE 'a0000026-%';

-- Restore original order_index on the 8 core units
UPDATE units SET order_index = 1 WHERE id = 'a0000002-0000-0000-0000-000000000002'::uuid;
UPDATE units SET order_index = 2 WHERE id = 'a0000001-0000-0000-0000-000000000001'::uuid;
UPDATE units SET order_index = 3 WHERE id = 'a0000001-0000-0000-0000-000000000003'::uuid;
UPDATE units SET order_index = 4 WHERE id = 'a0000001-0000-0000-0000-000000000004'::uuid;
UPDATE units SET order_index = 5 WHERE id = 'a0000001-0000-0000-0000-000000000005'::uuid;
UPDATE units SET order_index = 6 WHERE id = 'a0000001-0000-0000-0000-000000000006'::uuid;
UPDATE units SET order_index = 7 WHERE id = 'a0000001-0000-0000-0000-000000000007'::uuid;
UPDATE units SET order_index = 8 WHERE id = 'a0000001-0000-0000-0000-000000000008'::uuid;

COMMIT;
