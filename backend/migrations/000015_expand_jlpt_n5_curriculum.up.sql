-- ============================================================================
-- Migration: 000015_expand_jlpt_n5_curriculum.up.sql
-- Description: Expand JLPT N5 curriculum to 8 sequential units (32 lessons,
--              96+ balanced 4-pillar exercises), 16 grammar points, and an 8-item
--              readiness exam aligned with CodeAbroad production standards.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. NORMALIZE EXISTING N5 UNIT ORDERING & TITLES
-- ----------------------------------------------------------------------------
UPDATE units
SET order_index = 99
WHERE id = 'a0000001-0000-0000-0000-000000000002'::uuid;

UPDATE units
SET order_index = 1,
    title = 'Gerbang Aksara & Salam Pertama (Zero-Beginner)'
WHERE id = 'a0000002-0000-0000-0000-000000000002'::uuid;

UPDATE units
SET order_index = 2,
    title = 'Pondasi Kalimat & Identitas Diri'
WHERE id = 'a0000001-0000-0000-0000-000000000001'::uuid;

UPDATE units
SET order_index = 3,
    title = 'Aktivitas Harian & Konsumsi (Makanan, Minuman & Kerja)'
WHERE id = 'a0000001-0000-0000-0000-000000000003'::uuid;

UPDATE units
SET order_index = 4,
    title = 'Waktu, Mobilitas & Komuter Kantor (Transportasi & Jam)'
WHERE id = 'a0000001-0000-0000-0000-000000000004'::uuid;

-- ----------------------------------------------------------------------------
-- 2. SEED 8 NEW JLPT N5 GRAMMAR POINTS (GP-JA-N5-009 .. GP-JA-N5-016)
-- ----------------------------------------------------------------------------
INSERT INTO grammar_points (level_id, code, category, title, formula, explanation, order_index)
SELECT pl.id, v.code, v.category, v.title, v.formula, v.explanation, v.order_index
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
CROSS JOIN (
    VALUES
        ('GP-JA-N5-009', 'sentence_pattern', 'Keberadaan Benda & Makhluk Hidup (あります・います)', '[Tempat] に [Benda/Orang] が あります / います', 'Gunakan あります untuk benda mati/tumbuhan dan います untuk manusia/hewan guna menyatakan keberadaan di suatu lokasi.', 9),
        ('GP-JA-N5-010', 'particle', 'Partikel TO & YA (Daftar Lengkap vs Contoh)', '[Benda A] と [Benda B] / [Benda A] や [Benda B] など', 'Partikel と menyebut semua item secara lengkap ("dan"), sedangkan や (... など) menyebut sebagian contoh representatif.', 10),
        ('GP-JA-N5-011', 'conjugation', 'Kata Sifat-I & Negasinya (～い / ～くないです)', '[Adjektiva-I (buang い)] + くないです / かったです', 'Untuk membentuk negatif kata sifat-い, ganti akhiran い dengan くないです; untuk lampau positif gunakan かったです (pengecualian: いい → よくない・よかった).', 11),
        ('GP-JA-N5-012', 'sentence_pattern', 'Kata Sifat-Na & Perbandingan (～な / より / いちばん)', '[A] は [B] より [Adjektiva] です', 'Kata sifat-な memakai な saat menerangkan kata benda di depannya dan memakai ではありません untuk bentuk negatif sopan.', 12),
        ('GP-JA-N5-013', 'sentence_pattern', 'Ajakan Sopan (～ませんか・～ましょう)', '[Akar Verba] + ませんか / ましょう', '～ませんか dipakai untuk mengajak lawan bicara secara halus ("Maukah...?"), sedangkan ～ましょう untuk ajakan aktif ("Mari kita...").', 13),
        ('GP-JA-N5-014', 'conjugation', 'Permintaan Sopan & Urutan Aksi (～てください)', '[Verba Bentuk-TE] + ください', 'Mengubah verba ke bentuk-TE lalu menambahkan ください menghasilkan instruksi atau permohonan sopan di lingkungan kerja.', 14),
        ('GP-JA-N5-015', 'tense', 'Aksi Sedang Berlangsung & Status (～ています)', '[Verba Bentuk-TE] + います', 'Menyatakan kegiatan yang sedang dilakukan sekarang ("sedang ...") atau keadaan yang masih berlanjut seperti tempat tinggal & pekerjaan.', 15),
        ('GP-JA-N5-016', 'sentence_pattern', 'Keinginan & Tujuan Tindakan (～たいです・～にいきます)', '[Akar Verba] + たいです / [Tempat] へ [Akar Verba] に いきます', 'Ganti akhiran ～ます dengan ～たいです untuk menyatakan keinginan pribadi, dan pakai partikel に setelah akar verba sebelum いきます/きます untuk menyatakan tujuan.', 16)
) AS v(code, category, title, formula, explanation, order_index)
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (level_id, code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. SEED NEW UNITS 5..8 FOR JLPT N5
-- ----------------------------------------------------------------------------
INSERT INTO units (id, level_id, title, description, unit_type, order_index)
SELECT v.id, pl.id, v.title, v.description, 'curriculum', v.order_index
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
CROSS JOIN (
    VALUES
        ('a0000001-0000-0000-0000-000000000005'::uuid, 'Eksistensi, Lokasi & Navigasi Kota (あります・います)', 'Pelajari cara menyatakan keberadaan benda mati (arimasu) dan makhluk hidup (imasu), posisi relatif, serta navigasi fasilitas umum di Jepang.', 5),
        ('a0000001-0000-0000-0000-000000000006'::uuid, 'Kata Sifat, Cuaca & Deskripsi Pengalaman (い / な Adjektiva)', 'Kuasai kata sifat kelompok い (i-keiyoushi) dan な (na-keiyoushi), perubahan bentuk lampau/negatif, serta cara membandingkan pilihan.', 6),
        ('a0000001-0000-0000-0000-000000000007'::uuid, 'Bentuk-TE, Permintaan Sopan & Aturan Tempat Kerja', 'Pelajari konjugasi verba bentuk-TE untuk menyambung kalimat, meminta tolong dengan sopan (~te kudasai), menyatakan aksi sedang berlangsung (~te imasu), serta izin & larangan.', 7),
        ('a0000001-0000-0000-0000-000000000008'::uuid, 'Keinginan, Rencana Masa Depan & Komunikasi Praktis', 'Ungkapkan keinginan (~tai desu), tujuan keberangkatan (~ni ikimasu), alasan (~kara), dan simulasi percakapan terpadu untuk kesiapan kerja & hidup di Jepang.', 8)
) AS v(id, title, description, order_index)
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. INSERT 24 NEW CURRICULUM LESSONS (TOTAL 32 LESSONS: 4 PER UNIT)
-- ----------------------------------------------------------------------------
INSERT INTO lessons (id, unit_id, title, xp_reward, order_index)
VALUES
    -- Unit 1 extra lessons (3, 4)
    ('b0000001-0000-0000-0000-000000000008'::uuid, 'a0000002-0000-0000-0000-000000000002'::uuid, 'Pelajaran 3: Deret Konsonan Dasar Hiragana (か・さ・た・な)', 15, 3),
    ('b0000001-0000-0000-0000-000000000009'::uuid, 'a0000002-0000-0000-0000-000000000002'::uuid, 'Pelajaran 4: Katakana Pinjaman & Angka Dasar (1–10)', 15, 4),
    -- Unit 2 extra lessons (3, 4)
    ('b0000001-0000-0000-0000-000000000010'::uuid, 'a0000001-0000-0000-0000-000000000001'::uuid, 'Pelajaran 3: Kata Tunjuk Benda & Kepemilikan (これ・それ・あれ・の)', 15, 3),
    ('b0000001-0000-0000-0000-000000000011'::uuid, 'a0000001-0000-0000-0000-000000000001'::uuid, 'Pelajaran 4: Menanyakan Informasi & Asal Daerah (だれ・どこ・なん)', 20, 4),
    -- Unit 3 extra lessons (3, 4)
    ('b0000001-0000-0000-0000-000000000012'::uuid, 'a0000001-0000-0000-0000-000000000003'::uuid, 'Pelajaran 3: Kegiatan Waktu Luang & Hobi di Rumah', 15, 3),
    ('b0000001-0000-0000-0000-000000000013'::uuid, 'a0000001-0000-0000-0000-000000000003'::uuid, 'Pelajaran 4: Mengajak Rekan Kerja (~ませんか / ~ましょう)', 20, 4),
    -- Unit 4 extra lessons (3, 4)
    ('b0000001-0000-0000-0000-000000000014'::uuid, 'a0000001-0000-0000-0000-000000000004'::uuid, 'Pelajaran 3: Hari, Tanggal & Agenda Mingguan Kantor', 15, 3),
    ('b0000001-0000-0000-0000-000000000015'::uuid, 'a0000001-0000-0000-0000-000000000004'::uuid, 'Pelajaran 4: Durasi Perjalanan & Transit Stasiun (くらい・かかります)', 20, 4),
    -- Unit 5 lessons (1..4)
    ('b0000001-0000-0000-0000-000000000016'::uuid, 'a0000001-0000-0000-0000-000000000005'::uuid, 'Pelajaran 1: Keberadaan Benda & Orang (あります・います)', 15, 1),
    ('b0000001-0000-0000-0000-000000000017'::uuid, 'a0000001-0000-0000-0000-000000000005'::uuid, 'Pelajaran 2: Posisi Relatif Ruangan (うえ・した・まえ・うしろ・なか)', 15, 2),
    ('b0000001-0000-0000-0000-000000000018'::uuid, 'a0000001-0000-0000-0000-000000000005'::uuid, 'Pelajaran 3: Menghitung Benda & Daftar Item (と・や・ひとつ)', 15, 3),
    ('b0000001-0000-0000-0000-000000000019'::uuid, 'a0000001-0000-0000-0000-000000000005'::uuid, 'Pelajaran 4: Menanyakan Letak Fasilitas Umum Kota', 20, 4),
    -- Unit 6 lessons (1..4)
    ('b0000001-0000-0000-0000-000000000020'::uuid, 'a0000001-0000-0000-0000-000000000006'::uuid, 'Pelajaran 1: Kata Sifat-I dalam Kehidupan Sehari-hari (おおきい・たかい・あつい)', 15, 1),
    ('b0000001-0000-0000-0000-000000000021'::uuid, 'a0000001-0000-0000-0000-000000000006'::uuid, 'Pelajaran 2: Kata Sifat-Na & Penilaian Kerja (しずか・べんり・じょうず)', 15, 2),
    ('b0000001-0000-0000-0000-000000000022'::uuid, 'a0000001-0000-0000-0000-000000000006'::uuid, 'Pelajaran 3: Bentuk Lampau Kata Sifat & Pengalaman Cuaca', 15, 3),
    ('b0000001-0000-0000-0000-000000000023'::uuid, 'a0000001-0000-0000-0000-000000000006'::uuid, 'Pelajaran 4: Membandingkan Dua Hal & Pilihan Favorit (より・いちばん)', 20, 4),
    -- Unit 7 lessons (1..4)
    ('b0000001-0000-0000-0000-000000000024'::uuid, 'a0000001-0000-0000-0000-000000000007'::uuid, 'Pelajaran 1: Permintaan Sopan di Kantor (~てください)', 15, 1),
    ('b0000001-0000-0000-0000-000000000025'::uuid, 'a0000001-0000-0000-0000-000000000007'::uuid, 'Pelajaran 2: Aktivitas Sedang Berlangsung & Status (~ています)', 15, 2),
    ('b0000001-0000-0000-0000-000000000026'::uuid, 'a0000001-0000-0000-0000-000000000007'::uuid, 'Pelajaran 3: Aturan, Izin & Larangan (~てもいいです・~てはいけません)', 15, 3),
    ('b0000001-0000-0000-0000-000000000027'::uuid, 'a0000001-0000-0000-0000-000000000007'::uuid, 'Pelajaran 4: Menyambung Urutan Aktivitas Harian (~て、~て)', 20, 4),
    -- Unit 8 lessons (1..4)
    ('b0000001-0000-0000-0000-000000000028'::uuid, 'a0000001-0000-0000-0000-000000000008'::uuid, 'Pelajaran 1: Menyatakan Keinginan & Target (~たいです・ほしいです)', 15, 1),
    ('b0000001-0000-0000-0000-000000000029'::uuid, 'a0000001-0000-0000-0000-000000000008'::uuid, 'Pelajaran 2: Tujuan Kepergian & Alasan (~にいきます・~から)', 15, 2),
    ('b0000001-0000-0000-0000-000000000030'::uuid, 'a0000001-0000-0000-0000-000000000008'::uuid, 'Pelajaran 3: Pengalaman & Kebiasaan Dasar (~たことがあります)', 15, 3),
    ('b0000001-0000-0000-0000-000000000031'::uuid, 'a0000001-0000-0000-0000-000000000008'::uuid, 'Pelajaran 4: Simulasi Percakapan Harian & Pra-Ujian N5', 25, 4)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. TOP-UP EXERCISES ON EXISTING LESSONS (MINIMUM 3 EXERCISES PER LESSON)
-- ----------------------------------------------------------------------------
INSERT INTO exercises (
    id, lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt,
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES
    (
        'c0000015-0000-0000-0000-000000000001'::uuid,
        'b0000002-0000-0000-0000-000000000002'::uuid,
        NULL,
        'speaking',
        'speaking_repeat',
        'Ucapkan lima huruf vokal dasar Hiragana secara berurutan: "a, i, u, e, o".',
        '{"audio_url":"/static/audio/ja/n5/aiueo.mp3","display_text":"あいうえお","romaji":"A I U E O","phonetic_breakdown":["a","i","u","e","o"]}'::jsonb,
        '{"expected_transcript":"あいうえお"}'::jsonb,
        '[["あ い う え お"]]'::jsonb,
        NULL,
        'Kelima vokal あ・い・う・え・お menjadi fondasi pelafalan seluruh suku kata bahasa Jepang.',
        3
    ),
    (
        'c0000015-0000-0000-0000-000000000002'::uuid,
        'b0000002-0000-0000-0000-000000000003'::uuid,
        NULL,
        'listening',
        'listening_choice',
        'Dengarkan sapaan pagi yang sopan berikut. Apa arti ungkapan tersebut?',
        '{"audio_url":"/static/audio/ja/n5/ohayou_gozaimasu.mp3","audio_text":"おはようございます","options":[{"id":"opt_1","text":"Selamat pagi (sopan)"},{"id":"opt_2","text":"Selamat malam"},{"id":"opt_3","text":"Terima kasih"},{"id":"opt_4","text":"Sampai jumpa"}]}'::jsonb,
        '{"selected_id":"opt_1"}'::jsonb,
        NULL,
        '{"opt_2":"Selamat malam adalah こんばんは (konbanwa).","opt_3":"Terima kasih adalah ありがとうございます."}'::jsonb,
        '「おはようございます」 adalah salam pagi formal yang diucapkan kepada rekan kerja dan atasan.',
        3
    ),
    (
        'c0000015-0000-0000-0000-000000000003'::uuid,
        'b0000001-0000-0000-0000-000000000005'::uuid,
        NULL,
        'reading',
        'fill_blank',
        'Lengkapi pertanyaan harga di kasir: この コーヒー ___ いくら ですか。',
        '{"sentence_template":"この コーヒー [blank] いくら ですか。","translation":"Berapa harga kopi ini?","options":["は","を","で","に"]}'::jsonb,
        '{"selected":"は"}'::jsonb,
        NULL,
        '{"を":"Partikel を dipakai untuk objek kata kerja transitif, bukan kata tanya nominal です.","で":"Partikel で menandai tempat aksi atau alat."}'::jsonb,
        'Topik benda yang ditanyakan harganya ditandai dengan partikel は sebelum kata tanya いくらですか.',
        3
    ),
    (
        'c0000015-0000-0000-0000-000000000004'::uuid,
        'b0000001-0000-0000-0000-000000000006'::uuid,
        NULL,
        'listening',
        'listening_choice',
        'Dengarkan jadwal harian berikut. Jam berapa pembicara tidur setiap malam?',
        '{"audio_url":"/static/audio/ja/n5/juuichiji_nemasu.mp3","audio_text":"まいばん １１じに ねます。","options":[{"id":"opt_1","text":"Jam 11 malam"},{"id":"opt_2","text":"Jam 7 pagi"},{"id":"opt_3","text":"Jam 9 malam"},{"id":"opt_4","text":"Jam 1 siang"}]}'::jsonb,
        '{"selected_id":"opt_1"}'::jsonb,
        NULL,
        '{"opt_2":"Jam 7 adalah しちじ (7じ).","opt_3":"Jam 9 adalah くじ (9じ)."}'::jsonb,
        '「まいばん」(setiap malam) + 「１１じに」(jam 11) + 「ねます」(tidur).',
        3
    ),
    -- Readiness Exam extra questions (b0000001-...-0003 orders 6, 7, 8)
    (
        'c0000015-0000-0000-0000-000000000005'::uuid,
        'b0000001-0000-0000-0000-000000000003'::uuid,
        NULL,
        'writing',
        'sentence_builder',
        'Susun kalimat permintaan sopan berikut: "Tolong lihat dokumen ini."',
        '{"tokens":["この","しりょう","を","みて","ください","みません"],"target_translation":"Tolong lihat dokumen ini.","romaji":"Kono shiryou o mite kudasai."}'::jsonb,
        '["この","しりょう","を","みて","ください"]'::jsonb,
        '[["この","資料","を","見て","ください"]]'::jsonb,
        '{"みません":"Akhiran ～ません berarti tidak melihat, bukan permintaan sopan ～てください."}'::jsonb,
        'Gunakan bentuk-TE 「みて」 ditambah 「ください」 untuk meminta seseorang melihat sesuatu secara sopan.',
        6
    ),
    (
        'c0000015-0000-0000-0000-000000000006'::uuid,
        'b0000001-0000-0000-0000-000000000003'::uuid,
        NULL,
        'listening',
        'listening_choice',
        'Dengarkan pengumuman lokasi berikut. Di mana letak toilet?',
        '{"audio_url":"/static/audio/ja/n5/exam_toire_doko.mp3","audio_text":"トイレは エレベーターの となりに あります。","options":[{"id":"opt_1","text":"Di sebelah lift"},{"id":"opt_2","text":"Di depan pintu masuk"},{"id":"opt_3","text":"Di lantai tiga"},{"id":"opt_4","text":"Di luar gedung"}]}'::jsonb,
        '{"selected_id":"opt_1"}'::jsonb,
        NULL,
        '{"opt_2":"Di depan adalah まえ (mae), bukan となり (tonari = sebelah)."}'::jsonb,
        'Kata 「エレベーターの となり」 berarti di sebelah lift.',
        7
    ),
    (
        'c0000015-0000-0000-0000-000000000007'::uuid,
        'b0000001-0000-0000-0000-000000000003'::uuid,
        NULL,
        'speaking',
        'speaking_repeat',
        'Dengarkan dan ucapkan kalimat berikut: "Saya ingin bekerja di Jepang."',
        '{"audio_url":"/static/audio/ja/n5/nihon_de_hatarakitai.mp3","display_text":"にほんではたらきたいです","romaji":"Nihon de hatarakitai desu.","phonetic_breakdown":["ni-hon","de","ha-ta-ra-ki-tai","de-su"]}'::jsonb,
        '{"expected_transcript":"にほんではたらきたいです"}'::jsonb,
        '[["日本で働きたいです"]]'::jsonb,
        NULL,
        'Pola ～たいです menyatakan keinginan melakukan tindakan di lokasi yang ditandai partikel で.',
        8
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. SEED 72 EXERCISES FOR THE 24 NEW CURRICULUM LESSONS (3 PER LESSON)
-- ----------------------------------------------------------------------------
WITH exercise_seed (
    lesson_id, gp_code, skill_pillar, exercise_type, prompt,
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) AS (
    VALUES
        -- Lesson 0008 (Unit 1 Lesson 3: Deret Konsonan Dasar Hiragana)
        ('b0000001-0000-0000-0000-000000000008'::uuid, NULL, 'reading', 'fill_blank', 'Pilih huruf Hiragana yang dibaca "ka":', '{"sentence_template":"[blank] さ (kasa = payung)","translation":"Payung (ka-sa)","options":["か","さ","た","な"]}'::jsonb, '{"selected":"か"}'::jsonb, NULL::jsonb, '{"さ":"Huruf さ dibaca sa.","た":"Huruf た dibaca ta."}'::jsonb, 'Huruf か mewakili bunyi "ka", sehingga かさ dibaca kasa (payung).', 1),
        ('b0000001-0000-0000-0000-000000000008'::uuid, NULL, 'writing', 'sentence_builder', 'Susun kata benda dasar dari Hiragana berikut menjadi: "さかな" (ikan).', '{"tokens":["さ","か","な","た","き"],"target_translation":"Ikan (sakana)","romaji":"Sakana"}'::jsonb, '["さ","か","な"]'::jsonb, '[["魚"]]'::jsonb, '{"た":"Suku kata た dibaca ta, tidak ada pada kata sakana."}'::jsonb, 'Gabungan さ (sa) + か (ka) + な (na) membentuk kata さかな (ikan).', 2),
        ('b0000001-0000-0000-0000-000000000008'::uuid, NULL, 'speaking', 'speaking_repeat', 'Ucapkan kata sapaan terima kasih singkat: "ありがとうございます".', '{"audio_url":"/static/audio/ja/n5/arigatou_gozaimasu.mp3","display_text":"ありがとうございます","romaji":"Arigatou gozaimasu","phonetic_breakdown":["a-ri-ga-tou","go-za-i-ma-su"]}'::jsonb, '{"expected_transcript":"ありがとうございます"}'::jsonb, '[["有り難うございます"]]'::jsonb, NULL::jsonb, 'Ungkapan sopan standar untuk berterima kasih di Jepang.', 3),

        -- Lesson 0009 (Unit 1 Lesson 4: Katakana Pinjaman & Angka 1-10)
        ('b0000001-0000-0000-0000-000000000009'::uuid, NULL, 'reading', 'fill_blank', 'Lengkapi kata pinjaman Katakana untuk "kopi": コー [blank] ー', '{"sentence_template":"コー [blank] ー","translation":"Kopi (koohii)","options":["ヒ","シ","ツ","ン"]}'::jsonb, '{"selected":"ヒ"}'::jsonb, NULL::jsonb, '{"シ":"Huruf シ dibaca shi, bukan hi."}'::jsonb, 'Kata pinjaman ditulis memakai Katakana: コーヒー (koohii = kopi).', 1),
        ('b0000001-0000-0000-0000-000000000009'::uuid, NULL, 'listening', 'listening_choice', 'Dengarkan pelafalan angka berikut. Angka berapakah yang diucapkan?', '{"audio_url":"/static/audio/ja/n5/number_go.mp3","audio_text":"ご (5)","options":[{"id":"opt_1","text":"5 (Lima)"},{"id":"opt_2","text":"3 (Tiga)"},{"id":"opt_3","text":"8 (Delapan)"},{"id":"opt_4","text":"10 (Sepuluh)"}]}'::jsonb, '{"selected_id":"opt_1"}'::jsonb, NULL::jsonb, '{"opt_2":"Angka 3 dibaca san (さん)."}'::jsonb, 'Dalam sistem bilangan dasar: いち(1), に(2), さん(3), よん(4), ご(5).', 2),
        ('b0000001-0000-0000-0000-000000000009'::uuid, NULL, 'writing', 'sentence_builder', 'Susun angka berurutan satu, dua, tiga dalam Hiragana.', '{"tokens":["いち","に","さん","よん","ご"],"target_translation":"Satu, dua, tiga","romaji":"Ichi, ni, san"}'::jsonb, '["いち","に","さん"]'::jsonb, NULL::jsonb, '{"よん":"よん adalah angka empat."}'::jsonb, 'Urutan tiga angka pertama adalah いち (1), に (2), さん (3).', 3),

        -- Lesson 0010 (Unit 2 Lesson 3: Kata Tunjuk Benda & Kepemilikan)
        ('b0000001-0000-0000-0000-000000000010'::uuid, 'GP-JA-N5-003', 'reading', 'fill_blank', 'Pilih kata tunjuk untuk benda yang berada dekat dengan pembicara: ___ は ほん です。', '{"sentence_template":"[blank] は ほん です。","translation":"Ini adalah buku.","options":["これ","それ","あれ","どれ"]}'::jsonb, '{"selected":"これ"}'::jsonb, NULL::jsonb, '{"それ":"それ dipakai untuk benda yang dekat dengan lawan bicara."}'::jsonb, 'これ menunjuk benda dekat pembicara, それ dekat lawan bicara, dan あれ jauh dari keduanya.', 1),
        ('b0000001-0000-0000-0000-000000000010'::uuid, 'GP-JA-N5-003', 'writing', 'sentence_builder', 'Susun kalimat kepemilikan: "Itu adalah tas milik Yamada."', '{"tokens":["それ","は","やまださん","の","かばん","です","これ"],"target_translation":"Itu adalah tas milik Yamada.","romaji":"Sore wa Yamada-san no kaban desu."}'::jsonb, '["それ","は","やまださん","の","かばん","です"]'::jsonb, '[["それは山田さんのかばんです"]]'::jsonb, '{"これ":"これ berarti ini, sedangkan kalimat meminta kata tunjuk itu (それ)."}'::jsonb, 'Pemilik diikuti partikel の lalu kata bendanya: やまださんの かばん.', 2),
        ('b0000001-0000-0000-0000-000000000010'::uuid, 'GP-JA-N5-003', 'speaking', 'speaking_repeat', 'Ucapkan pertanyaan kepemilikan berikut: "Apakah ini buku catatan Anda?"', '{"audio_url":"/static/audio/ja/n5/kore_wa_noto_desu_ka.mp3","display_text":"これはあなたのノートですか","romaji":"Kore wa anata no nooto desu ka.","phonetic_breakdown":["ko-re","wa","a-na-ta","no","noo-to","de-su","ka"]}'::jsonb, '{"expected_transcript":"これはあなたのノートですか"}'::jsonb, NULL::jsonb, NULL::jsonb, 'Tambahkan partikel か di akhir kalimat untuk mengubah pernyataan menjadi pertanyaan.', 3),

        -- Lesson 0011 (Unit 2 Lesson 4: Menanyakan Informasi & Asal Daerah)
        ('b0000001-0000-0000-0000-000000000011'::uuid, 'GP-JA-N5-001', 'reading', 'fill_blank', 'Lengkapi pertanyaan asal negara: おくに は ___ ですか。', '{"sentence_template":"おくに は [blank] ですか。","translation":"Anda berasal dari negara mana?","options":["どちら","だれ","なんさい","いくら"]}'::jsonb, '{"selected":"どちら"}'::jsonb, NULL::jsonb, '{"だれ":"だれ menanyakan siapa (orang), bukan asal tempat/negara."}'::jsonb, '「どちら」 adalah bentuk sopan dari どこ (mana) untuk menanyakan asal negara atau perusahaan.', 1),
        ('b0000001-0000-0000-0000-000000000011'::uuid, 'GP-JA-N5-001', 'listening', 'listening_choice', 'Dengarkan dialog perkenalan ini. Siapakah nama pembicara?', '{"audio_url":"/static/audio/ja/n5/namae_wa_sato_desu.mp3","audio_text":"わたしの なまえは さとう です。","options":[{"id":"opt_1","text":"Sato"},{"id":"opt_2","text":"Tanaka"},{"id":"opt_3","text":"Suzuki"},{"id":"opt_4","text":"Takahashi"}]}'::jsonb, '{"selected_id":"opt_1"}'::jsonb, NULL::jsonb, '{"opt_2":"Tanaka tidak disebutkan pada rekaman."}'::jsonb, 'Frasa 「わたしの なまえは 〜 です」 digunakan untuk menyebutkan nama diri.', 2),
        ('b0000001-0000-0000-0000-000000000011'::uuid, 'GP-JA-N5-002', 'writing', 'sentence_builder', 'Susun kalimat negasi lampau: "Kemarin bukan hari kerja."', '{"tokens":["きのう","は","しごと","ではありませんでした","です"],"target_translation":"Kemarin bukan hari kerja.","romaji":"Kinou wa shigoto dewa arimasen deshita."}'::jsonb, '["きのう","は","しごと","ではありませんでした"]'::jsonb, '[["昨日は仕事ではありませんでした"]]'::jsonb, '{"です":"です adalah kalimat positif saat ini, bukan bentuk lampau negatif."}'::jsonb, 'Gunakan ではありませんでした untuk menyatakan "dulu bukan" pada kata benda.', 3),

        -- Lesson 0012 (Unit 3 Lesson 3: Kegiatan Waktu Luang & Hobi di Rumah)
        ('b0000001-0000-0000-0000-000000000012'::uuid, 'GP-JA-N5-004', 'reading', 'fill_blank', 'Lengkapi kalimat aktivitas rumah: いえで おんがく ___ ききます。', '{"sentence_template":"いえで おんがく [blank] ききます。","translation":"Saya mendengarkan musik di rumah.","options":["を","が","に","へ"]}'::jsonb, '{"selected":"を"}'::jsonb, NULL::jsonb, '{"に":"ききます (mendengarkan musik) memakai partikel objek を."}'::jsonb, 'Kata benda objek dari tindakan aktif seperti mendengarkan atau menonton memakai partikel を.', 1),
        ('b0000001-0000-0000-0000-000000000012'::uuid, 'GP-JA-N5-006', 'writing', 'sentence_builder', 'Susun kalimat: "Di kamar saya membaca buku."', '{"tokens":["へや","で","ほん","を","よみます","かきます"],"target_translation":"Di kamar saya membaca buku.","romaji":"Heya de hon o yomimasu."}'::jsonb, '["へや","で","ほん","を","よみます"]'::jsonb, '[["部屋で本を読みます"]]'::jsonb, '{"かきます":"かきます berarti menulis, sedangkan soal meminta membaca (よみます)."}'::jsonb, 'Lokasi tempat aktivitas menggunakan で (へやで), dan objeknya menggunakan を (ほんを).', 2),
        ('b0000001-0000-0000-0000-000000000012'::uuid, 'GP-JA-N5-006', 'speaking', 'speaking_repeat', 'Ucapkan kalimat berikut: "Setiap malam saya menonton berita."', '{"audio_url":"/static/audio/ja/n5/maiban_nyuusu_mimasu.mp3","display_text":"まいばんニュースをみます","romaji":"Maiban nyuusu o mimasu.","phonetic_breakdown":["mai-ban","nyuu-su","o","mi-ma-su"]}'::jsonb, '{"expected_transcript":"まいばんニュースをみます"}'::jsonb, '[["毎晩ニュースを見ます"]]'::jsonb, NULL::jsonb, 'Kata kerja みます berarti melihat atau menonton.', 3),

        -- Lesson 0013 (Unit 3 Lesson 4: Mengajak Rekan Kerja)
        ('b0000001-0000-0000-0000-000000000013'::uuid, 'GP-JA-N5-013', 'reading', 'fill_blank', 'Pilih akhiran ajakan sopan kepada rekan kerja: いっしょに ひるごはんを たべ ___ か。', '{"sentence_template":"いっしょに ひるごはんを たべ [blank] か。","translation":"Maukah makan siang bersama?","options":["ません","ます","ました","ませんでし"]}'::jsonb, '{"selected":"ません"}'::jsonb, NULL::jsonb, '{"ます":"たべますか hanya bertanya apakah makan, bukan mengajak secara sopan."}'::jsonb, 'Bentuk 「～ませんか」 dipakai untuk mengajak orang lain dengan penuh pertimbangan.', 1),
        ('b0000001-0000-0000-0000-000000000013'::uuid, 'GP-JA-N5-013', 'writing', 'sentence_builder', 'Susun kalimat ajakan langsung: "Mari kita minum kopi sebentar."', '{"tokens":["ちょっと","コーヒー","を","のみましょう","のみません"],"target_translation":"Mari kita minum kopi sebentar.","romaji":"Chotto koohii o nomimashou."}'::jsonb, '["ちょっと","コーヒー","を","のみましょう"]'::jsonb, '[["ちょっとコーヒーを飲みましょう"]]'::jsonb, '{"のみません":"のみません berarti tidak minum, bukan ajakan のみましょう."}'::jsonb, 'Akhiran ～ましょう ("mari kita...") menyatakan ajakan yang disepakati bersama.', 2),
        ('b0000001-0000-0000-0000-000000000013'::uuid, 'GP-JA-N5-013', 'listening', 'listening_choice', 'Dengarkan ajakan berikut. Apa yang diajak lakukan?', '{"audio_url":"/static/audio/ja/n5/isshoni_kaerimasen_ka.mp3","audio_text":"いっしょに かえりませんか。","options":[{"id":"opt_1","text":"Pulang bersama"},{"id":"opt_2","text":"Makan malam di kantor"},{"id":"opt_3","text":"Berangkat pagi"},{"id":"opt_4","text":"Minum teh hijau"}]}'::jsonb, '{"selected_id":"opt_1"}'::jsonb, NULL::jsonb, '{"opt_2":"Verba yang diucapkan adalah かえり (pulang), bukan たべ (makan)."}'::jsonb, '「いっしょに かえりませんか」 berarti "Maukah pulang bersama?"', 3),

        -- Lesson 0014 (Unit 4 Lesson 3: Hari, Tanggal & Agenda Mingguan Kantor)
        ('b0000001-0000-0000-0000-000000000014'::uuid, 'GP-JA-N5-008', 'reading', 'fill_blank', 'Lengkapi jadwal rapat mingguan: げつようび ___ かいぎ が あります。', '{"sentence_template":"げつようび [blank] かいぎ が あります。","translation":"Hari Senin ada rapat.","options":["に","を","へ","で"]}'::jsonb, '{"selected":"に"}'::jsonb, NULL::jsonb, '{"を":"Hari dalam seminggu bukan objek verba transitif."}'::jsonb, 'Nama hari spesifik seperti げつようび (Senin) diikuti partikel waktu に.', 1),
        ('b0000001-0000-0000-0000-000000000014'::uuid, 'GP-JA-N5-008', 'writing', 'sentence_builder', 'Susun kalimat: "Besok pergi ke Tokyo."', '{"tokens":["あした","とうきょう","へ","いきます","きのう"],"target_translation":"Besok pergi ke Tokyo.","romaji":"Ashita Toukyou e ikimasu."}'::jsonb, '["あした","とうきょう","へ","いきます"]'::jsonb, '[["明日東京へ行きます"],["あしたとうきょうにいきます"]]'::jsonb, '{"きのう":"きのう berarti kemarin, tidak cocok untuk verba bentuk non-lampau いきます."}'::jsonb, 'Kata keterangan waktu relatif seperti あした (besok) dan きょう (hari ini) tidak memerlukan partikel に.', 2),
        ('b0000001-0000-0000-0000-000000000014'::uuid, 'GP-JA-N5-008', 'speaking', 'speaking_repeat', 'Ucapkan hari libur akhir pekan: "Sabtu dan Minggu adalah hari libur."', '{"audio_url":"/static/audio/ja/n5/doyoubi_nichiyoubi_yasumi.mp3","display_text":"どようびとにちようびはやすみです","romaji":"Doyoubi to nichiyoubi wa yasumi desu.","phonetic_breakdown":["do-you-bi","to","ni-chi-you-bi","wa","ya-su-mi","de-su"]}'::jsonb, '{"expected_transcript":"どようびとにちようびはやすみです"}'::jsonb, '[["土曜日と日曜日は休みです"]]'::jsonb, NULL::jsonb, 'どようび adalah Sabtu dan にちようび adalah Minggu.', 3),

        -- Lesson 0015 (Unit 4 Lesson 4: Durasi Perjalanan & Transit Stasiun)
        ('b0000001-0000-0000-0000-000000000015'::uuid, 'GP-JA-N5-007', 'reading', 'fill_blank', 'Lengkapi kalimat durasi komuter: えきまで あるいて １０ぷん ___ かかります。', '{"sentence_template":"えきまで あるいて １０ぷん [blank] かかります。","translation":"Jalan kaki ke stasiun memakan waktu sekitar 10 menit.","options":["くらい","から","より","しか"]}'::jsonb, '{"selected":"くらい"}'::jsonb, NULL::jsonb, '{"から":"から berarti dari/karena, bukan perkiraan durasi."}'::jsonb, 'Kata 「くらい」(atau ぐらい) setelah durasi waktu berarti "kira-kira / sekitar".', 1),
        ('b0000001-0000-0000-0000-000000000015'::uuid, 'GP-JA-N5-007', 'writing', 'sentence_builder', 'Susun kalimat: "Dari asrama ke kantor naik sepeda."', '{"tokens":["りょう","から","かいしゃ","まで","じてんしゃ","で","いきます"],"target_translation":"Dari asrama ke kantor naik sepeda.","romaji":"Ryou kara kaisha made jitensha de ikimasu."}'::jsonb, '["りょう","から","かいしゃ","まで","じてんしゃ","で","いきます"]'::jsonb, '[["寮から会社まで自転車で行きます"]]'::jsonb, NULL::jsonb, 'Gunakan から (dari), まで (sampai), dan で (dengan sarana) dalam satu kalimat terstruktur.', 2),
        ('b0000001-0000-0000-0000-000000000015'::uuid, 'GP-JA-N5-007', 'listening', 'listening_choice', 'Dengarkan keterangan perjalanan berikut. Berapa lama waktu naik kereta ke Shinjuku?', '{"audio_url":"/static/audio/ja/n5/shinjuku_30pun_kakarimasu.mp3","audio_text":"しんじゅくまで でんしゃで ３０ぷん かかります。","options":[{"id":"opt_1","text":"30 menit"},{"id":"opt_2","text":"15 menit"},{"id":"opt_3","text":"1 jam"},{"id":"opt_4","text":"5 menit"}]}'::jsonb, '{"selected_id":"opt_1"}'::jsonb, NULL::jsonb, '{"opt_2":"Waktu yang disebutkan adalah さんじゅっぷん (30 menit)."}'::jsonb, 'Kata kerja 「かかります」 berarti memakan waktu (atau biaya).', 3),

        -- Lesson 0016 (Unit 5 Lesson 1: Keberadaan Benda & Orang)
        ('b0000001-0000-0000-0000-000000000016'::uuid, 'GP-JA-N5-009', 'reading', 'fill_blank', 'Pilih kata kerja keberadaan untuk komputer (benda mati): つくえの うえに パソコンが ___。', '{"sentence_template":"つくえの うえに パソコンが [blank]。","translation":"Di atas meja ada komputer.","options":["あります","います","いきます","します"]}'::jsonb, '{"selected":"あります"}'::jsonb, NULL::jsonb, '{"います":"います hanya digunakan untuk manusia dan hewan."}'::jsonb, 'Komputer (パソコン) adalah benda mati sehingga wajib menggunakan あります.', 1),
        ('b0000001-0000-0000-0000-000000000016'::uuid, 'GP-JA-N5-009', 'writing', 'sentence_builder', 'Susun kalimat keberadaan orang: "Di ruang rapat ada Pak Tanaka."', '{"tokens":["かいぎしつ","に","たなかさん","が","います","あります"],"target_translation":"Di ruang rapat ada Pak Tanaka.","romaji":"Kaigishitsu ni Tanaka-san ga imasu."}'::jsonb, '["かいぎしつ","に","たなかさん","が","います"]'::jsonb, '[["会議室に田中さんがいます"]]'::jsonb, '{"あります":"Pak Tanaka adalah manusia sehingga memakai います, bukan あります."}'::jsonb, 'Tempat lokasi keberadaan ditandai partikel に, dan subjek orang memakai partikel が + います.', 2),
        ('b0000001-0000-0000-0000-000000000016'::uuid, 'GP-JA-N5-009', 'speaking', 'speaking_repeat', 'Ucapkan pertanyaan: "Apakah ada minimarket di dekat stasiun?"', '{"audio_url":"/static/audio/ja/n5/eki_chikaku_konbini.mp3","display_text":"えきのちかくにコンビニがありますか","romaji":"Eki no chikaku ni konbini ga arimasu ka.","phonetic_breakdown":["e-ki","no","chi-ka-ku","ni","kon-bi-ni","ga","a-ri-ma-su","ka"]}'::jsonb, '{"expected_transcript":"えきのちかくにコンビニがありますか"}'::jsonb, '[["駅の近くにコンビニがありますか"]]'::jsonb, NULL::jsonb, 'Frasa 「えきの ちかくに」 berarti di dekat stasiun.', 3),

        -- Lesson 0017 (Unit 5 Lesson 2: Posisi Relatif Ruangan)
        ('b0000001-0000-0000-0000-000000000017'::uuid, 'GP-JA-N5-009', 'reading', 'fill_blank', 'Lengkapi kata posisi yang berarti "di dalam tas": かばんの ___ に かぎが あります。', '{"sentence_template":"かばんの [blank] に かぎが あります。","translation":"Di dalam tas ada kunci.","options":["なか","うえ","した","そと"]}'::jsonb, '{"selected":"なか"}'::jsonb, NULL::jsonb, '{"うえ":"うえ berarti di atas, bukan di dalam.","した":"した berarti di bawah."}'::jsonb, 'Kosakata posisi: なか (dalam), うえ (atas), した (bawah), まえ (depan), うしろ (belakang).', 1),
        ('b0000001-0000-0000-0000-000000000017'::uuid, 'GP-JA-N5-009', 'writing', 'sentence_builder', 'Susun kalimat posisi: "Bank ada di depan stasiun."', '{"tokens":["ぎんこう","は","えき","の","まえ","に","あります"],"target_translation":"Bank ada di depan stasiun.","romaji":"Ginkou wa eki no mae ni arimasu."}'::jsonb, '["ぎんこう","は","えき","の","まえ","に","あります"]'::jsonb, '[["銀行は駅の前にあります"]]'::jsonb, NULL::jsonb, 'Saat menjadi topik, letak benda ditulis di pola: [Benda] は [Patokan] の [Posisi] に あります.', 2),
        ('b0000001-0000-0000-0000-000000000017'::uuid, 'GP-JA-N5-009', 'listening', 'listening_choice', 'Dengarkan petunjuk posisi berikut. Di manakah posisi ATM?', '{"audio_url":"/static/audio/ja/n5/atm_yubinkyoku_tonari.mp3","audio_text":"ＡＴＭは ゆうびんきょくの となりに あります。","options":[{"id":"opt_1","text":"Di sebelah kantor pos"},{"id":"opt_2","text":"Di belakang rumah sakit"},{"id":"opt_3","text":"Di lantai dua bank"},{"id":"opt_4","text":"Di dalam restoran"}]}'::jsonb, '{"selected_id":"opt_1"}'::jsonb, NULL::jsonb, '{"opt_2":"ゆうびんきょく berarti kantor pos, bukan rumah sakit (びょういん)."}'::jsonb, '「ゆうびんきょくの となり」 berarti di sebelah kantor pos.', 3),

        -- Lesson 0018 (Unit 5 Lesson 3: Menghitung Benda & Daftar Item)
        ('b0000001-0000-0000-0000-000000000018'::uuid, 'GP-JA-N5-010', 'reading', 'fill_blank', 'Pilih partikel daftar sebagian contoh (seperti ..., ..., dan lain-lain): つくえの うえに ペン ___ ノートなどが あります。', '{"sentence_template":"つくえの うえに ペン [blank] ノートなどが あります。","translation":"Di atas meja ada pulpen, buku catatan, dan lain-lain.","options":["や","と","も","の"]}'::jsonb, '{"selected":"や"}'::jsonb, NULL::jsonb, '{"と":"Partikel と menyebut semua item tanpa kata など (dll.)."}'::jsonb, 'Kombinasi 「[A] や [B] など」 digunakan saat menyebut beberapa contoh benda.', 1),
        ('b0000001-0000-0000-0000-000000000018'::uuid, 'GP-JA-N5-010', 'writing', 'sentence_builder', 'Susun pesanan jumlah benda: "Tolong dua buah roti."', '{"tokens":["パン","を","ふたつ","ください","ふたり"],"target_translation":"Tolong dua buah roti.","romaji":"Pan o futatsu kudasai."}'::jsonb, '["パン","を","ふたつ","ください"]'::jsonb, NULL::jsonb, '{"ふたり":"ふたり dipakai untuk menghitung 2 orang, sedangkan 2 buah benda adalah ふたつ."}'::jsonb, 'Kata bantu bilangan benda umum: ひとつ (1 buah), ふたつ (2 buah), みっつ (3 buah).', 2),
        ('b0000001-0000-0000-0000-000000000018'::uuid, 'GP-JA-N5-010', 'speaking', 'speaking_repeat', 'Ucapkan kalimat berikut: "Saya membeli buku catatan dan pensil."', '{"audio_url":"/static/audio/ja/n5/nooto_to_enpitsu.mp3","display_text":"ノートとえんぴつをかいます","romaji":"Nooto to enpitsu o kaimasu.","phonetic_breakdown":["noo-to","to","en-pi-tsu","o","ka-i-ma-su"]}'::jsonb, '{"expected_transcript":"ノートとえんぴつをかいます"}'::jsonb, '[["ノートと鉛筆を買います"]]'::jsonb, NULL::jsonb, 'Gunakan と untuk menggabungkan dua benda secara lengkap.', 3),

        -- Lesson 0019 (Unit 5 Lesson 4: Menanyakan Letak Fasilitas Umum Kota)
        ('b0000001-0000-0000-0000-000000000019'::uuid, 'GP-JA-N5-009', 'reading', 'fill_blank', 'Lengkapi pertanyaan lokasi ruangan: じむしょは ___ ですか。', '{"sentence_template":"じむしょは [blank] ですか。","translation":"Di manakah ruang kantor administrasi?","options":["どこ","いつ","だれ","いくつ"]}'::jsonb, '{"selected":"どこ"}'::jsonb, NULL::jsonb, '{"いつ":"いつ menanyakan waktu (kapan), bukan lokasi."}'::jsonb, 'Kata tanya lokasi standar adalah どこ (di mana), atau bentuk sopannya どちら.', 1),
        ('b0000001-0000-0000-0000-000000000019'::uuid, 'GP-JA-N5-009', 'listening', 'listening_choice', 'Dengarkan arahan staf berikut. Di mana letak ruang istirahat?', '{"audio_url":"/static/audio/ja/n5/kyuukeishitsu_nikai.mp3","audio_text":"きゅうけいしつは ２かいに あります。","options":[{"id":"opt_1","text":"Di lantai 2"},{"id":"opt_2","text":"Di lantai 1"},{"id":"opt_3","text":"Di basement (B1)"},{"id":"opt_4","text":"Di gedung sebelah"}]}'::jsonb, '{"selected_id":"opt_1"}'::jsonb, NULL::jsonb, '{"opt_2":"Lantai 1 adalah いっかい (1かい), sedangkan yang terdengar adalah にかい (2かい)."}'::jsonb, 'Akhiran かい/がい digunakan untuk lantai gedung: 1かい (ikkai), 2かい (nikai), 3がい (sangai).', 2),
        ('b0000001-0000-0000-0000-000000000019'::uuid, 'GP-JA-N5-009', 'writing', 'sentence_builder', 'Susun pertanyaan lokasi sopan: "Permisi, di manakah stasiun?"', '{"tokens":["すみません","えき","は","どこ","ですか","だれ"],"target_translation":"Permisi, di manakah stasiun?","romaji":"Sumimasen, eki wa doko desu ka."}'::jsonb, '["すみません","えき","は","どこ","ですか"]'::jsonb, '[["すみません駅はどこですか"]]'::jsonb, '{"だれ":"だれ berarti siapa."}'::jsonb, 'Awali pertanyaan di tempat umum dengan 「すみません」 agar terdengar santun.', 3),

        -- Lesson 0020 (Unit 6 Lesson 1: Kata Sifat-I)
        ('b0000001-0000-0000-0000-000000000020'::uuid, 'GP-JA-N5-011', 'reading', 'fill_blank', 'Ubah kata sifat 「たかい」(mahal) ke bentuk negatif sopan: この へやは たか ___ です。', '{"sentence_template":"この へやは たか [blank] です。","translation":"Kamar ini tidak mahal.","options":["くない","じゃありません","い","かった"]}'::jsonb, '{"selected":"くない"}'::jsonb, NULL::jsonb, '{"じゃありません":"Adjektiva-I memakai akhiran ～くないです, bukan じゃありません."}'::jsonb, 'Hilangkan akhiran い pada たかい lalu tambahkan くないです → たかくないです.', 1),
        ('b0000001-0000-0000-0000-000000000020'::uuid, 'GP-JA-N5-011', 'writing', 'sentence_builder', 'Susun kalimat deskripsi: "Hari ini sangat panas."', '{"tokens":["きょう","は","とても","あつい","です","あつくない"],"target_translation":"Hari ini sangat panas.","romaji":"Kyou wa totemo atsui desu."}'::jsonb, '["きょう","は","とても","あつい","です"]'::jsonb, '[["今日はとても暑いです"]]'::jsonb, '{"あつくない":"Kalimat meminta pernyataan positif (panas), bukan tidak panas."}'::jsonb, 'Kata keterangan penguat 「とても」 ("sangat") digunakan bersama kalimat adjektiva positif.', 2),
        ('b0000001-0000-0000-0000-000000000020'::uuid, 'GP-JA-N5-011', 'speaking', 'speaking_repeat', 'Ucapkan kalimat berikut: "Makanan restoran ini enak."', '{"audio_url":"/static/audio/ja/n5/kono_mise_oishii.mp3","display_text":"このみせのりょうりはおいしいです","romaji":"Kono mise no ryouri wa oishii desu.","phonetic_breakdown":["ko-no","mi-se","no","ryou-ri","wa","o-i-shii","de-su"]}'::jsonb, '{"expected_transcript":"このみせのりょうりはおいしいです"}'::jsonb, '[["この店の料理はおいしいです"]]'::jsonb, NULL::jsonb, 'Adjektiva-I tetap mempertahankan huruf い di depan です pada kalimat positif kini.', 3),

        -- Lesson 0021 (Unit 6 Lesson 2: Kata Sifat-Na & Penilaian Kerja)
        ('b0000001-0000-0000-0000-000000000021'::uuid, 'GP-JA-N5-012', 'reading', 'fill_blank', 'Lengkapi penghubung kata sifat-Na sebelum kata benda: きょうとは ___ まち です。', '{"sentence_template":"きょうとは [blank] まち です。","translation":"Kyoto adalah kota yang tenang.","options":["しずかな","しずかい","しずか","しずかに"]}'::jsonb, '{"selected":"しずかな"}'::jsonb, NULL::jsonb, '{"しずか":"Saat menerangkan kata benda (まち) di depannya, wajib menambahkan な."}'::jsonb, 'Kata sifat-Na (seperti しずか, べんり, きれい) membutuhkan な sebelum nomina.', 1),
        ('b0000001-0000-0000-0000-000000000021'::uuid, 'GP-JA-N5-012', 'writing', 'sentence_builder', 'Susun kalimat: "Kereta Tokyo praktis."', '{"tokens":["とうきょう","の","でんしゃ","は","べんり","です","べんりな"],"target_translation":"Kereta Tokyo praktis.","romaji":"Toukyou no densha wa benri desu."}'::jsonb, '["とうきょう","の","でんしゃ","は","べんり","です"]'::jsonb, '[["東京の電車は便利です"]]'::jsonb, '{"べんりな":"Di akhir kalimat sebelum です, な tidak dipakai."}'::jsonb, 'Saat menjadi predikat sebelum です, adjektiva-Na langsung diikuti です tanpa な.', 2),
        ('b0000001-0000-0000-0000-000000000021'::uuid, 'GP-JA-N5-012', 'listening', 'listening_choice', 'Dengarkan penilaian berikut. Apa pendapat pembicara tentang kota asalnya?', '{"audio_url":"/static/audio/ja/n5/machi_shizuka_kirei.mp3","audio_text":"わたしの まちは しずかで きれいです。","options":[{"id":"opt_1","text":"Tenang dan bersih/indah"},{"id":"opt_2","text":"Ramai dan mahal"},{"id":"opt_3","text":"Kecil dan tidak praktis"},{"id":"opt_4","text":"Dingin dan jauh"}]}'::jsonb, '{"selected_id":"opt_1"}'::jsonb, NULL::jsonb, '{"opt_2":"Kata yang diucapkan adalah しずか (tenang) dan きれい (indah/bersih)."}'::jsonb, 'Dua kata sifat-Na disambungkan menggunakan partikel で: しずかで きれいです.', 3),

        -- Lesson 0022 (Unit 6 Lesson 3: Bentuk Lampau Kata Sifat)
        ('b0000001-0000-0000-0000-000000000022'::uuid, 'GP-JA-N5-011', 'reading', 'fill_blank', 'Ubah 「たのしい」(menyenangkan) menjadi bentuk lampau: きのうの パーティーは たのし ___ です。', '{"sentence_template":"きのうの パーティーは たのし [blank] です。","translation":"Pesta kemarin menyenangkan.","options":["かった","い","くない","でした"]}'::jsonb, '{"selected":"かった"}'::jsonb, NULL::jsonb, '{"でした":"Untuk adjektiva-I, bentuk lampau bukan たのしいでした melainkan たのしかったです."}'::jsonb, 'Bentuk lampau adjektiva-I dibentuk dengan mengganti い menjadi かったです.', 1),
        ('b0000001-0000-0000-0000-000000000022'::uuid, 'GP-JA-N5-012', 'writing', 'sentence_builder', 'Susun kalimat lampau adjektiva-Na: "Minggu lalu tidak sibuk (senggang)."', '{"tokens":["せんしゅう","は","ひま","でした","ではありませんでした"],"target_translation":"Minggu lalu senggang.","romaji":"Senshuu wa hima deshita."}'::jsonb, '["せんしゅう","は","ひま","でした"]'::jsonb, '[["先週は暇でした"]]'::jsonb, '{"ではありませんでした":"Bentuk ini berarti tidak senggang."}'::jsonb, 'Adjektiva-Na dan nomina memakai でした untuk bentuk lampau positif.', 2),
        ('b0000001-0000-0000-0000-000000000022'::uuid, 'GP-JA-N5-011', 'speaking', 'speaking_repeat', 'Ucapkan kalimat berikut: "Ujian kemarin agak sulit."', '{"audio_url":"/static/audio/ja/n5/shiken_muzukashikatta.mp3","display_text":"きのうのしけんはすこしむずかしかったです","romaji":"Kinou no shiken wa sukoshi muzukashikatta desu.","phonetic_breakdown":["ki-nou","no","shi-ken","wa","su-ko-shi","mu-zu-ka-shi-kat-ta","de-su"]}'::jsonb, '{"expected_transcript":"きのうのしけんはすこしむずかしかったです"}'::jsonb, '[["昨日の試験は少し難しかったです"]]'::jsonb, NULL::jsonb, 'むずかしい → むずかしかったです (dulu sulit).', 3),

        -- Lesson 0023 (Unit 6 Lesson 4: Membandingkan Dua Hal)
        ('b0000001-0000-0000-0000-000000000023'::uuid, 'GP-JA-N5-012', 'reading', 'fill_blank', 'Lengkapi kalimat perbandingan: でんしゃは バス ___ はやいです。', '{"sentence_template":"でんしゃは バス [blank] はやいです。","translation":"Kereta lebih cepat daripada bus.","options":["より","ほど","いちばん","から"]}'::jsonb, '{"selected":"より"}'::jsonb, NULL::jsonb, '{"いちばん":"いちばん dipakai untuk superlatif (paling), bukan membandingkan A dan B."}'::jsonb, 'Partikel より ditempatkan setelah pembanding B: [A] は [B] より [Adjektiva] です.', 1),
        ('b0000001-0000-0000-0000-000000000023'::uuid, 'GP-JA-N5-012', 'writing', 'sentence_builder', 'Susun kalimat superlatif: "Di Jepang, musim semi yang paling saya sukai."', '{"tokens":["にほん","で","はる","が","いちばん","すき","です"],"target_translation":"Di antara musim, saya paling suka musim semi di Jepang.","romaji":"Nihon de haru ga ichiban suki desu."}'::jsonb, '["にほん","で","はる","が","いちばん","すき","です"]'::jsonb, '[["日本で春が一番好きです"]]'::jsonb, NULL::jsonb, 'Gunakan 「〜が いちばん [Adjektiva] です」 untuk menyatakan hal nomor satu / paling.', 2),
        ('b0000001-0000-0000-0000-000000000023'::uuid, 'GP-JA-N5-012', 'listening', 'listening_choice', 'Dengarkan pertanyaan perbandingan berikut. Apa yang ditanyakan?', '{"audio_url":"/static/audio/ja/n5/koohii_ocha_dochira.mp3","audio_text":"コーヒーと おちゃと どちらが すきですか。","options":[{"id":"opt_1","text":"Antara kopi dan teh, mana yang lebih disukai?"},{"id":"opt_2","text":"Berapa harga kopi dan teh?"},{"id":"opt_3","text":"Di mana membeli kopi dan teh?"},{"id":"opt_4","text":"Apakah kopi lebih panas dari teh?"}]}'::jsonb, '{"selected_id":"opt_1"}'::jsonb, NULL::jsonb, '{"opt_2":"Tidak ada kata tanya harga (いくら) dalam kalimat."}'::jsonb, 'Pola 「[A] と [B] と どちらが 〜 ですか」 menanyakan pilihan di antara dua hal.', 3),

        -- Lesson 0024 (Unit 7 Lesson 1: Permintaan Sopan ~te kudasai)
        ('b0000001-0000-0000-0000-000000000024'::uuid, 'GP-JA-N5-014', 'reading', 'fill_blank', 'Lengkapi permintaan sopan di kantor: ここに なまえを ___ ください。', '{"sentence_template":"ここに なまえを [blank] ください。","translation":"Tolong tulis nama Anda di sini.","options":["かいて","かきます","かいた","かないで"]}'::jsonb, '{"selected":"かいて"}'::jsonb, NULL::jsonb, '{"かきます":"Sebelum ください harus berbentuk-TE (かいて), bukan bentuk-MASU."}'::jsonb, 'Verba かきます (menulis) diubah ke bentuk-TE menjadi かいて + ください.', 1),
        ('b0000001-0000-0000-0000-000000000024'::uuid, 'GP-JA-N5-014', 'writing', 'sentence_builder', 'Susun kalimat instruksi santun: "Tolong bicara perlahan."', '{"tokens":["すみません","ゆっくり","はなして","ください","はなします"],"target_translation":"Permisi, tolong bicara perlahan.","romaji":"Sumimasen, yukkuri hanashite kudasai."}'::jsonb, '["すみません","ゆっくり","はなして","ください"]'::jsonb, '[["すみませんゆっくり話してください"]]'::jsonb, '{"はなします":"Bentuk-TE dari はなします adalah はなして."}'::jsonb, 'Ungkapan 「ゆっくり はなしてください」 sangat berguna saat belum menangkap ucapan lawan bicara.', 2),
        ('b0000001-0000-0000-0000-000000000024'::uuid, 'GP-JA-N5-014', 'speaking', 'speaking_repeat', 'Ucapkan permohonan bantuan ini: "Tolong ajari saya kalimat ini."', '{"audio_url":"/static/audio/ja/n5/oshiete_kudasai.mp3","display_text":"おしえてください","romaji":"Oshiete kudasai.","phonetic_breakdown":["o-shi-e-te","ku-da-sai"]}'::jsonb, '{"expected_transcript":"おしえてください"}'::jsonb, '[["教えてください"]]'::jsonb, NULL::jsonb, 'おしえます (mengajar/memberi tahu) → おしえてください (tolong ajari / beri tahu).', 3),

        -- Lesson 0025 (Unit 7 Lesson 2: Aktivitas Sedang Berlangsung ~te imasu)
        ('b0000001-0000-0000-0000-000000000025'::uuid, 'GP-JA-N5-015', 'reading', 'fill_blank', 'Lengkapi kalimat status tempat tinggal: わたしは いま おおさかに ___ います。', '{"sentence_template":"わたしは いま おおさかに [blank] います。","translation":"Saya sekarang tinggal di Osaka.","options":["すんで","すみます","すんだ","すまない"]}'::jsonb, '{"selected":"すんで"}'::jsonb, NULL::jsonb, '{"すみます":"Sebelum います harus verba bentuk-TE (すんで)."}'::jsonb, 'Menyatakan tempat tinggal saat ini memakai pola tetap 「[Tempat] に すんでいます」.', 1),
        ('b0000001-0000-0000-0000-000000000025'::uuid, 'GP-JA-N5-015', 'writing', 'sentence_builder', 'Susun kalimat aksi berlangsung: "Sekarang sedang hujan."', '{"tokens":["いま","あめ","が","ふって","います","ふります"],"target_translation":"Sekarang sedang hujan.","romaji":"Ima ame ga futte imasu."}'::jsonb, '["いま","あめ","が","ふって","います"]'::jsonb, '[["今雨が降っています"]]'::jsonb, '{"ふります":"ふっています menyatakan hujan yang sedang turun saat ini."}'::jsonb, 'Verba ふります (turun hujan/salju) menjadi ふっています untuk kejadian sekarang.', 2),
        ('b0000001-0000-0000-0000-000000000025'::uuid, 'GP-JA-N5-015', 'listening', 'listening_choice', 'Dengarkan keterangan berikut. Apa yang sedang dilakukan Satou-san sekarang?', '{"audio_url":"/static/audio/ja/n5/sato_denwa_shiteimasu.mp3","audio_text":"さとうさんは いま でんわを かけています。","options":[{"id":"opt_1","text":"Sedang menelepon"},{"id":"opt_2","text":"Sedang menulis email"},{"id":"opt_3","text":"Sedang pulang ke rumah"},{"id":"opt_4","text":"Sedang minum kopi"}]}'::jsonb, '{"selected_id":"opt_1"}'::jsonb, NULL::jsonb, '{"opt_2":"でんわを かけています berarti sedang menelepon."}'::jsonb, 'Frasa 「でんわを かけます」 diubah ke ～ています menjadi sedang menelepon.', 3),

        -- Lesson 0026 (Unit 7 Lesson 3: Izin & Larangan)
        ('b0000001-0000-0000-0000-000000000026'::uuid, 'GP-JA-N5-014', 'reading', 'fill_blank', 'Lengkapi kalimat meminta izin: ここで しゃしんを ___ もいいですか。', '{"sentence_template":"ここで しゃしんを [blank] もいいですか。","translation":"Bolehkah mengambil foto di sini?","options":["とって","とります","とる","とらない"]}'::jsonb, '{"selected":"とって"}'::jsonb, NULL::jsonb, '{"とります":"Pola izin memakai bentuk-TE + もいいですか."}'::jsonb, 'Bentuk 「[Verba-TE] もいいですか」 digunakan untuk meminta izin melakukan sesuatu.', 1),
        ('b0000001-0000-0000-0000-000000000026'::uuid, 'GP-JA-N5-014', 'writing', 'sentence_builder', 'Susun kalimat larangan: "Tidak boleh masuk ke ruangan ini."', '{"tokens":["この","へや","に","はいって","はいけません","もいいです"],"target_translation":"Tidak boleh masuk ke ruangan ini.","romaji":"Kono heya ni haitte wa ikemasen."}'::jsonb, '["この","へや","に","はいって","はいけません"]'::jsonb, '[["この部屋に入ってはいけません"]]'::jsonb, '{"もいいです":"～もいいです berarti boleh, sedangkan kalimat meminta larangan (dilarang)."}'::jsonb, 'Pola larangan resmi adalah 「[Verba-TE] は いけません」.', 2),
        ('b0000001-0000-0000-0000-000000000026'::uuid, 'GP-JA-N5-014', 'speaking', 'speaking_repeat', 'Ucapkan pertanyaan meminta izin berikut: "Bolehkah saya memakai komputer ini?"', '{"audio_url":"/static/audio/ja/n5/pasokon_tsukatte_moii.mp3","display_text":"このパソコンをつかってもいいですか","romaji":"Kono pasokon o tsukatte mo ii desu ka.","phonetic_breakdown":["ko-no","pa-so-kon","o","tsu-kat-te","mo","ii","de-su","ka"]}'::jsonb, '{"expected_transcript":"このパソコンをつかってもいいですか"}'::jsonb, '[["このパソコンを使ってもいいですか"]]'::jsonb, NULL::jsonb, 'つかいます (memakai) → つかってもいいですか (bolehkah memakai?).', 3),

        -- Lesson 0027 (Unit 7 Lesson 4: Menyambung Urutan Aktivitas)
        ('b0000001-0000-0000-0000-000000000027'::uuid, 'GP-JA-N5-014', 'reading', 'fill_blank', 'Sambungkan dua kegiatan berurutan: あさ おきて、コーヒーを ___。', '{"sentence_template":"あさ おきて、コーヒーを [blank]。","translation":"Pagi hari bangun tidur, lalu minum kopi.","options":["のみます","のんで","のみませんでし","のむ"]}'::jsonb, '{"selected":"のみます"}'::jsonb, NULL::jsonb, '{"のんで":"Verba terakhir di akhir kalimat tetap memakai bentuk sopan ～ます."}'::jsonb, 'Saat menyambung urutan tindakan: aksi sebelumnya pakai bentuk-TE (おきて), aksi terakhir menentukan tense kalimat (のみます).', 1),
        ('b0000001-0000-0000-0000-000000000027'::uuid, 'GP-JA-N5-014', 'writing', 'sentence_builder', 'Susun kalimat berurutan: "Setelah bekerja, lalu pulang ke rumah."', '{"tokens":["しごと","を","して","うち","へ","かえります"],"target_translation":"Bekerja lalu pulang ke rumah.","romaji":"Shigoto o shite, uchi e kaerimasu."}'::jsonb, '["しごと","を","して","うち","へ","かえります"]'::jsonb, '[["仕事をしてうちへ帰ります"]]'::jsonb, NULL::jsonb, 'Verba します (melakukan) memiliki bentuk-TE tak beraturan yakni して.', 2),
        ('b0000001-0000-0000-0000-000000000027'::uuid, 'GP-JA-N5-014', 'listening', 'listening_choice', 'Dengarkan urutan kegiatan akhir pekan berikut. Apa yang dilakukan setelah berbelanja?', '{"audio_url":"/static/audio/ja/n5/kaimono_shite_eiga_mita.mp3","audio_text":"かいものを して、えいがを みました。","options":[{"id":"opt_1","text":"Menonton film"},{"id":"opt_2","text":"Makan ramen"},{"id":"opt_3","text":"Belajar Kanji"},{"id":"opt_4","text":"Tidur siang"}]}'::jsonb, '{"selected_id":"opt_1"}'::jsonb, NULL::jsonb, '{"opt_2":"Kegiatan kedua adalah えいがを みました (menonton film)."}'::jsonb, '「かいものを して」(berbelanja), lalu 「えいがを みました」(menonton film).', 3),

        -- Lesson 0028 (Unit 8 Lesson 1: Keinginan ~tai desu / hoshii desu)
        ('b0000001-0000-0000-0000-000000000028'::uuid, 'GP-JA-N5-016', 'reading', 'fill_blank', 'Lengkapi ungkapan keinginan melakukan aksi: にほんごを じょうずに はなし ___ です。', '{"sentence_template":"にほんごを じょうずに はなし [blank] です。","translation":"Saya ingin berbicara bahasa Jepang dengan mahir.","options":["たい","ほしい","ます","ながら"]}'::jsonb, '{"selected":"たい"}'::jsonb, NULL::jsonb, '{"ほしい":"ほしい dipakai setelah kata benda (ingin barang), bukan setelah akar verba."}'::jsonb, 'Tambahkan たいです setelah akar kata kerja (はなします → はなし + たいです).', 1),
        ('b0000001-0000-0000-0000-000000000028'::uuid, 'GP-JA-N5-016', 'writing', 'sentence_builder', 'Susun kalimat keinginan barang: "Saya ingin kamus baru."', '{"tokens":["わたし","は","あたらしい","じしょ","が","ほしい","です"],"target_translation":"Saya ingin kamus baru.","romaji":"Watashi wa atarashii jisho ga hoshii desu."}'::jsonb, '["わたし","は","あたらしい","じしょ","が","ほしい","です"]'::jsonb, '[["私は新しい辞書がほしいです"]]'::jsonb, NULL::jsonb, 'Untuk menginginkan sebuah benda, gunakan pola 「[Benda] が ほしいです」.', 2),
        ('b0000001-0000-0000-0000-000000000028'::uuid, 'GP-JA-N5-016', 'speaking', 'speaking_repeat', 'Ucapkan target belajarmu: "Saya ingin pergi ke Kyoto tahun depan."', '{"audio_url":"/static/audio/ja/n5/rainen_kyoto_ikitai.mp3","display_text":"らいねんきょうとへいきたいです","romaji":"Rainen Kyouto e ikitai desu.","phonetic_breakdown":["rai-nen","kyou-to","e","i-ki-tai","de-su"]}'::jsonb, '{"expected_transcript":"らいねんきょうとへいきたいです"}'::jsonb, '[["来年京都へ行きたいです"]]'::jsonb, NULL::jsonb, 'いきます (pergi) → いきたいです (ingin pergi).', 3),

        -- Lesson 0029 (Unit 8 Lesson 2: Tujuan Kepergian & Alasan)
        ('b0000001-0000-0000-0000-000000000029'::uuid, 'GP-JA-N5-016', 'reading', 'fill_blank', 'Lengkapi kalimat tujuan kepergian: スーパーへ やさいを かい ___ いきます。', '{"sentence_template":"スーパーへ やさいを かい [blank] いきます。","translation":"Saya pergi ke supermarket untuk membeli sayuran.","options":["に","を","で","から"]}'::jsonb, '{"selected":"に"}'::jsonb, NULL::jsonb, '{"で":"Menunjukkan tujuan setelah akar verba memakai partikel に."}'::jsonb, 'Akar verba かい (dari かいます) + に + いきます menyatakan maksud kepergian.', 1),
        ('b0000001-0000-0000-0000-000000000029'::uuid, 'GP-JA-N5-016', 'writing', 'sentence_builder', 'Susun kalimat alasan: "Karena sibuk, hari ini tidak menonton film."', '{"tokens":["いそがしい","から","きょう","は","えいが","を","みません"],"target_translation":"Karena sibuk, hari ini saya tidak menonton film.","romaji":"Isogashii kara, kyou wa eiga o mimasen."}'::jsonb, '["いそがしい","から","きょう","は","えいが","を","みません"]'::jsonb, '[["忙しいから今日は映画を見ません"]]'::jsonb, NULL::jsonb, 'Kata sambung 「から」 di akhir klausa menyatakan sebab/alasan ("karena...").', 2),
        ('b0000001-0000-0000-0000-000000000029'::uuid, 'GP-JA-N5-016', 'listening', 'listening_choice', 'Dengarkan alasan berikut. Mengapa pembicara tidak minum kopi malam ini?', '{"audio_url":"/static/audio/ja/n5/osoi_kara_nomimasen.mp3","audio_text":"もう おそいですから、コーヒーを のみません。","options":[{"id":"opt_1","text":"Karena sudah larut malam"},{"id":"opt_2","text":"Karena kopinya terlalu mahal"},{"id":"opt_3","text":"Karena kafe sudah tutup"},{"id":"opt_4","text":"Karena tidak suka kopi"}]}'::jsonb, '{"selected_id":"opt_1"}'::jsonb, NULL::jsonb, '{"opt_2":"おそいです berarti sudah terlambat/larut malam, bukan mahal (たかいです)."}'::jsonb, 'Kalimat sopan menyatakan alasan dengan 「〜ます / 〜ですから」.', 3),

        -- Lesson 0030 (Unit 8 Lesson 3: Pengalaman Dasar ~ta koto ga arimasu)
        ('b0000001-0000-0000-0000-000000000030'::uuid, 'GP-JA-N5-015', 'reading', 'fill_blank', 'Lengkapi ungkapan pengalaman hidup: すしを ___ ことが あります。', '{"sentence_template":"すしを [blank] ことが あります。","translation":"Saya pernah makan sushi.","options":["たべた","たべます","たべて","たべない"]}'::jsonb, '{"selected":"たべた"}'::jsonb, NULL::jsonb, '{"たべて":"Pola pernah melakukan sesuatu memakai bentuk-TA (たべた) + ことがあります."}'::jsonb, 'Gunakan verba bentuk lampau pendek (Bentuk-TA) sebelum 「ことがあります」 untuk menyatakan pengalaman.', 1),
        ('b0000001-0000-0000-0000-000000000030'::uuid, 'GP-JA-N5-015', 'writing', 'sentence_builder', 'Susun kalimat pengalaman: "Saya pernah naik Shinkansen."', '{"tokens":["しんかんせん","に","のった","こと","が","あります","のります"],"target_translation":"Saya pernah naik Shinkansen.","romaji":"Shinkansen ni notta koto ga arimasu."}'::jsonb, '["しんかんせん","に","のった","こと","が","あります"]'::jsonb, '[["新幹線に乗ったことがあります"]]'::jsonb, '{"のります":"Di depan ことがあります wajib menggunakan bentuk-TA yakni のった."}'::jsonb, 'のります (naik) → bentuk-TA のった + ことがあります = pernah naik.', 2),
        ('b0000001-0000-0000-0000-000000000030'::uuid, 'GP-JA-N5-015', 'speaking', 'speaking_repeat', 'Ucapkan pertanyaan pengalaman berikut: "Apakah Anda pernah pergi ke Jepang?"', '{"audio_url":"/static/audio/ja/n5/nihon_itta_koto_arimasu_ka.mp3","display_text":"にほんへいったことがありますか","romaji":"Nihon e itta koto ga arimasu ka.","phonetic_breakdown":["ni-hon","e","it-ta","ko-to","ga","a-ri-ma-su","ka"]}'::jsonb, '{"expected_transcript":"にほんへいったことがありますか"}'::jsonb, '[["日本へ行ったことがありますか"]]'::jsonb, NULL::jsonb, 'いきます (pergi) memiliki bentuk-TA khusus yaitu いった.', 3),

        -- Lesson 0031 (Unit 8 Lesson 4: Simulasi Percakapan Harian & Pra-Ujian N5)
        ('b0000001-0000-0000-0000-000000000031'::uuid, 'GP-JA-N5-016', 'reading', 'fill_blank', 'Lengkapi penutup percakapan bisnis saat menitipkan pesan: よろしく ___ します。', '{"sentence_template":"よろしく [blank] します。","translation":"Mohon kerja samanya / Salam hangat.","options":["おねがい","ありがとう","すみません","失礼"]}'::jsonb, '{"selected":"おねがい"}'::jsonb, NULL::jsonb, '{"ありがとう":"Kalimat tetapnya adalah よろしく おねがいします."}'::jsonb, 'Frasa 「よろしくお願いします」 digunakan saat memulai kerja sama maupun menitip salam.', 1),
        ('b0000001-0000-0000-0000-000000000031'::uuid, 'GP-JA-N5-016', 'writing', 'sentence_builder', 'Susun kalimat lengkap persiapan wawancara: "Saya belajar bahasa Jepang setiap hari karena ingin bekerja di Tokyo."', '{"tokens":["とうきょう","で","はたらきたい","から","まいにち","にほんご","を","べんきょうしています"],"target_translation":"Karena ingin bekerja di Tokyo, saya belajar bahasa Jepang setiap hari.","romaji":"Toukyou de hatarakitai kara, mainichi nihongo o benkyou shite imasu."}'::jsonb, '["とうきょう","で","はたらきたい","から","まいにち","にほんご","を","べんきょうしています"]'::jsonb, '[["東京で働きたいから毎日日本語を勉強しています"]]'::jsonb, NULL::jsonb, 'Kalimat ini menggabungkan ～たい (ingin), から (alasan), dan ～ています (kebiasaan rutin saat ini).', 2),
        ('b0000001-0000-0000-0000-000000000031'::uuid, 'GP-JA-N5-016', 'listening', 'listening_choice', 'Dengarkan pesan singkat rekan kerja berikut. Kapan laporan harus diserahkan?', '{"audio_url":"/static/audio/ja/n5/repooto_ashita_made.mp3","audio_text":"この レポートは あしたの ごご５じまでに おねがいします。","options":[{"id":"opt_1","text":"Paling lambat besok jam 5 sore"},{"id":"opt_2","text":"Hari ini jam 9 pagi"},{"id":"opt_3","text":"Minggu depan hari Senin"},{"id":"opt_4","text":"Kemarin malam"}]}'::jsonb, '{"selected_id":"opt_1"}'::jsonb, NULL::jsonb, '{"opt_2":"Deadline yang diucapkan adalah あしたの ごご５じまでに (sebelum besok jam 5 sore)."}'::jsonb, 'Partikel gabungan 「までに」 berarti tenggat waktu ("paling lambat sebelum...").', 3)
)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt,
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT
    es.lesson_id,
    gp.id,
    es.skill_pillar,
    es.exercise_type,
    es.prompt,
    es.content,
    es.correct_answer,
    es.acceptable_answers,
    es.diagnostic_rubric,
    es.explanation,
    es.order_index
FROM exercise_seed es
LEFT JOIN grammar_points gp ON gp.code = es.gp_code
WHERE NOT EXISTS (
    SELECT 1 FROM exercises existing
    WHERE existing.lesson_id = es.lesson_id AND existing.order_index = es.order_index
);
