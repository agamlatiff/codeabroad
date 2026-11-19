-- ============================================================================
-- Migration: 000022_add_lesson_icon_name.up.sql
-- Description: Store thematic solid-rounded icon identifiers directly on
--              curriculum lessons as Single Source of Truth (SSOT).
-- ============================================================================

ALTER TABLE lessons
    ADD COLUMN IF NOT EXISTS icon_name VARCHAR(48) NOT NULL DEFAULT 'book-open';

UPDATE lessons AS l
SET icon_name = v.icon_name
FROM (VALUES
    ('n5-placement-diagnostic', 'compass'),
    ('n5-vokal-utama-hiragana', 'translate'),
    ('n5-salam-pertama-aisatsu', 'hand-waving'),
    ('n5-konsonan-dasar-hiragana', 'text-aa'),
    ('n5-katakana-pinjaman-angka-dasar', 'hash'),
    ('n5-salam-perkenalan-identitas', 'identification-card'),
    ('n5-profesi-dan-kewarganegaraan', 'briefcase'),
    ('n5-kata-tunjuk-benda-kepemilikan', 'cube'),
    ('n5-informasi-dan-asal-daerah', 'map-pin'),
    ('n5-keluarga-dan-panggilan', 'users-three'),
    ('n5-makan-minum-rutinitas-pagi', 'bowl-food'),
    ('n5-membeli-barang-di-kafe', 'coffee'),
    ('n5-kegiatan-waktu-luang-hobi', 'music-note'),
    ('n5-mengajak-rekan-kerja', 'chat-circle-dots'),
    ('n5-frekuensi-kebiasaan-harian', 'repeat'),
    ('n5-jam-kerja-jadwal-harian', 'clock'),
    ('n5-komuter-kereta-tokyo', 'train'),
    ('n5-hari-tanggal-agenda-kantor', 'calendar-blank'),
    ('n5-durasi-perjalanan-transit', 'hourglass-medium'),
    ('n5-bulan-dan-tanggal-kalender', 'calendar-blank'),
    ('n5-rute-transportasi-dan-sarana', 'map-trifold'),
    ('n5-keberadaan-benda-dan-orang', 'map-pin'),
    ('n5-posisi-relatif-ruangan', 'cube'),
    ('n5-menghitung-benda-daftar-item', 'list-checks'),
    ('n5-letak-fasilitas-umum-kota', 'buildings'),
    ('n5-denah-kantor-dan-ruangan', 'laptop'),
    ('n5-menunjuk-arah-dan-petunjuk-jalan', 'signpost'),
    ('n5-kata-sifat-i-kehidupan-harian', 'sparkle'),
    ('n5-kata-sifat-na-penilaian-kerja', 'thumbs-up'),
    ('n5-lampau-kata-sifat-dan-cuaca', 'cloud-sun'),
    ('n5-perbandingan-dan-pilihan-favorit', 'scales'),
    ('n5-belanja-harga-dan-warna', 'shopping-bag'),
    ('n5-musim-dan-suasana-kota', 'sun'),
    ('n5-permintaan-sopan-di-kantor', 'handshake'),
    ('n5-aktivitas-sedang-berlangsung', 'play-circle'),
    ('n5-aturan-izin-dan-larangan', 'shield-check'),
    ('n5-menyambung-urutan-aktivitas', 'link-simple'),
    ('n5-bentuk-lampau-kata-kerja', 'clock-counter-clockwise'),
    ('n5-cerita-kegiatan-akhir-pekan', 'sun'),
    ('n5-sopan-santun-di-tempat-kerja', 'heart'),
    ('n5-keinginan-dan-target-n5', 'target'),
    ('n5-tujuan-kepergian-dan-alasan', 'airplane-tilt'),
    ('n5-pengalaman-dan-kebiasaan', 'medal'),
    ('n5-simulasi-percakapan-harian', 'chats-circle'),
    ('n5-memberi-dan-menerima-bantuan', 'gift'),
    ('n5-rencana-dan-kemahiran', 'lightbulb'),
    ('n5-ulasan-komprehensif-jlpt-n5', 'graduation-cap'),
    ('n5-readiness-mock-exam', 'trophy')
) AS v(slug, icon_name)
WHERE l.slug = v.slug;
