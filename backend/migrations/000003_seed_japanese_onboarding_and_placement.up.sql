-- ============================================================================
-- Migration: 000003_seed_japanese_onboarding_and_placement.up.sql
-- Description: Seed Japanese Onboarding Flow (Adaptive Placement Test & Zero-Beginner Foundation)
-- Version: CodeAbroad v3.0
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. GRAMMAR POINTS FOR PLACEMENT TEST & CORE FOUNDATION
-- ----------------------------------------------------------------------------

-- JLPT N5 Grammar Points
INSERT INTO grammar_points (level_id, code, category, title, formula, explanation, order_index)
SELECT pl.id, 'GP-JA-N5-001', 'sentence_pattern', 'Partikel WA (Topik Kalimat)', '[Topik / Subjek] + は + [Predikat] + です', 'Partikel は (dibaca wa) berfungsi sebagai penanda topik utama dalam kalimat bahasa Jepang. Digunakan untuk menyatakan identitas, profesi, atau sifat.', 1
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (level_id, code) DO NOTHING;

INSERT INTO grammar_points (level_id, code, category, title, formula, explanation, order_index)
SELECT pl.id, 'GP-JA-N5-002', 'conjugation', 'Bentuk Lampau Negatif (Deshita / Dewa Arimasen)', '[Predikat] + ではありませんでした', 'Digunakan untuk menyatakan negasi lampau (bukan / dulu tidak) secara sopan (Teineigo).', 2
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (level_id, code) DO NOTHING;

INSERT INTO grammar_points (level_id, code, category, title, formula, explanation, order_index)
SELECT pl.id, 'GP-JA-N5-003', 'particle', 'Partikel NO (Kepemilikan & Kualifikasi)', '[Kata Benda 1] + の + [Kata Benda 2]', 'Partikel の (no) menghubungkan dua kata benda untuk menyatakan kepemilikan, asal, atau atribut penjelasan (misal: わたし の なまえ = nama saya).', 3
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (level_id, code) DO NOTHING;

INSERT INTO grammar_points (level_id, code, category, title, formula, explanation, order_index)
SELECT pl.id, 'GP-JA-N5-004', 'particle', 'Partikel WO (Objek Penderita)', '[Objek] + を + [Verba Transitif]', 'Partikel を (dibaca o/wo) menandai objek langsung penderita tindakan kata kerja (misal: みず を のみます = minum air).', 4
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (level_id, code) DO NOTHING;

INSERT INTO grammar_points (level_id, code, category, title, formula, explanation, order_index)
SELECT pl.id, 'GP-JA-N5-005', 'particle', 'Partikel NI / HE (Tujuan Arah Perpindahan)', '[Tempat] + に / へ + いきます / きます', 'Partikel に (ni) atau へ (e) menunjukkan tempat tujuan arah perpindahan fisik.', 5
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (level_id, code) DO NOTHING;

-- JLPT N4 Diagnostic Grammar Points
INSERT INTO grammar_points (level_id, code, category, title, formula, explanation, order_index)
SELECT pl.id, 'GP-JA-N4-001', 'sentence_pattern', 'Bentuk Permohonan ~Te Kudasai', '[Verba Bentuk-Te] + ください', 'Digunakan untuk meminta atau menginstruksikan seseorang melakukan sesuatu secara sopan dan jelas dalam situasi sehari-hari dan tempat kerja.', 1
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N4'
ON CONFLICT (level_id, code) DO NOTHING;

INSERT INTO grammar_points (level_id, code, category, title, formula, explanation, order_index)
SELECT pl.id, 'GP-JA-N4-002', 'conjugation', 'Bentuk Progresif ~Te Iru', '[Verba Bentuk-Te] + います', 'Menyatakan aksi yang sedang berlangsung saat ini atau kondisi stabil yang diakibatkan oleh aksi sebelumnya.', 2
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N4'
ON CONFLICT (level_id, code) DO NOTHING;

INSERT INTO grammar_points (level_id, code, category, title, formula, explanation, order_index)
SELECT pl.id, 'GP-JA-N4-003', 'sentence_pattern', 'Bentuk Keharusan ~Nakereba Narimasen', '[Verba Bentuk-Nai (buang -i)] + ければなりません', 'Pola formal standar untuk menyatakan kewajiban atau keharusan mutlak (harus melakukan sesuatu).', 3
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N4'
ON CONFLICT (level_id, code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. UNITS FOR ONBOARDING
-- ----------------------------------------------------------------------------

-- Unit Diagnostik: Adaptive Placement Test (Order Index 0, Diagnostic Exam)
INSERT INTO units (id, level_id, title, description, unit_type, order_index)
SELECT 
    'a0000002-0000-0000-0000-000000000001'::uuid,
    pl.id,
    'Tes Penempatan Adaptif Bahasa Jepang (Placement Diagnostic)',
    'Uji kalibrasi 10 soal kilat multi-tingkat (N5 awal s/d N4) untuk menentukan titik awal belajar yang paling presisi.',
    'diagnostic_exam',
    0
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (id) DO NOTHING;

-- Unit 0: Gerbang Pembelajaran Pemula dari Nol (Zero-Beginner)
INSERT INTO units (id, level_id, title, description, unit_type, order_index)
SELECT 
    'a0000002-0000-0000-0000-000000000002'::uuid,
    pl.id,
    'Unit 0: Gerbang Aksara & Salam Pertama (Zero-Beginner)',
    'Pondasi awal bagi yang belum pernah belajar bahasa Jepang: kuasai 5 vokal utama (A-I-U-E-O) dan salam sapaan esensial.',
    'curriculum',
    0
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. LESSONS FOR ONBOARDING
-- ----------------------------------------------------------------------------

-- Lesson 1: Sesi Tes Penempatan (10 Soal Bergradasi)
INSERT INTO lessons (id, unit_id, title, xp_reward, order_index)
VALUES (
    'b0000002-0000-0000-0000-000000000001'::uuid,
    'a0000002-0000-0000-0000-000000000001'::uuid,
    'Sesi Tes Penempatan: Kalibrasi Kemampuan Awal',
    50,
    1
) ON CONFLICT (id) DO NOTHING;

-- Lesson 2: Pelajaran Vokal Hiragana Dasar (A-I-U-E-O)
INSERT INTO lessons (id, unit_id, title, xp_reward, order_index)
VALUES (
    'b0000002-0000-0000-0000-000000000002'::uuid,
    'a0000002-0000-0000-0000-000000000002'::uuid,
    'Pelajaran 1: 5 Vokal Utama (あ・い・う・え・お)',
    15,
    1
) ON CONFLICT (id) DO NOTHING;

-- Lesson 3: Pelajaran Salam Aisatsu Pertama & Respon Santun
INSERT INTO lessons (id, unit_id, title, xp_reward, order_index)
VALUES (
    'b0000002-0000-0000-0000-000000000003'::uuid,
    'a0000002-0000-0000-0000-000000000002'::uuid,
    'Pelajaran 2: Salam Pertama & Ungkapan Santun (Aisatsu)',
    15,
    2
) ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. 10 BUTIR SOAL ADAPTIVE PLACEMENT TEST (Unit: a0000002-...-0001)
-- ----------------------------------------------------------------------------

-- Soal 1: Reading - Vokal Hiragana (N5 Sangat Dasar)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000002-0000-0000-0000-000000000001'::uuid,
    NULL,
    'reading',
    'fill_blank',
    'Manakah huruf Hiragana yang berbunyi vokal "A"?',
    '{"romaji": "a", "options": ["あ", "い", "う", "お"]}'::jsonb,
    '{"selected": "あ"}'::jsonb,
    NULL,
    '{"い": "Karakter ini dibaca \"i\".", "う": "Karakter ini dibaca \"u\".", "お": "Karakter ini dibaca \"o\"."}'::jsonb,
    'Karakter あ adalah huruf pertama dalam urutan gojuuon Hiragana dan dilafalkan sebagai vokal murni "a".',
    1
);

-- Soal 2: Listening - Aisatsu Pagi (N5 Sangat Dasar)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000002-0000-0000-0000-000000000001'::uuid,
    NULL,
    'listening',
    'listening_choice',
    'Dengarkan audio penutur asli dan tentukan arti salam sapaan berikut.',
    '{
        "audio_url": "/static/audio/ja/onboarding/ohayou_gozaimasu.mp3",
        "audio_text": "おはようございます",
        "options": [
            {"id": "opt_1", "text": "Selamat pagi (Ohayou gozaimasu)"},
            {"id": "opt_2", "text": "Selamat malam (Konbanwa)"},
            {"id": "opt_3", "text": "Sampai jumpa (Sayounara)"},
            {"id": "opt_4", "text": "Terima kasih banyak (Arigatou gozaimasu)"}
        ]
    }'::jsonb,
    '{"selected_id": "opt_1"}'::jsonb,
    NULL,
    '{
        "opt_2": "Konbanwa diucapkan saat menyapa di waktu malam hari.",
        "opt_3": "Sayounara diucapkan saat berpisah/berpamitan.",
        "opt_4": "Arigatou gozaimasu adalah ungkapan terima kasih."
    }'::jsonb,
    'Frasa 「おはようございます」(Ohayou gozaimasu) adalah sapaan sopan standar di pagi hari, khususnya di lingkungan kantor atau sekolah.',
    2
);

-- Soal 3: Writing - Partikel Topik WA (N5 Dasar)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT
    'b0000002-0000-0000-0000-000000000001'::uuid,
    gp.id,
    'writing',
    'sentence_builder',
    'Susun balok kata berikut menjadi kalimat: "Saya adalah seorang siswa."',
    '{
        "tokens": ["わたし", "は", "がくせい", "です", "せんせい"],
        "target_translation": "Saya adalah seorang siswa.",
        "romaji": "Watashi wa gakusei desu."
    }'::jsonb,
    '["わたし", "は", "がくせい", "です"]'::jsonb,
    '[["私", "は", "学生", "です"]]'::jsonb,
    '{"せんせい": "Sensei berarti guru/pengajar, bukan siswa (gakusei)."}'::jsonb,
    'Subjek perkenalan diri (わたし) diikuti penanda topik は (wa), predikat (がくせい), dan diakhiri kopula formal です (desu).',
    3
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-001' LIMIT 1;

-- Soal 4: Reading - Kata Tunjuk Tempat KOKO (N5 Menengah)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000002-0000-0000-0000-000000000001'::uuid,
    NULL,
    'reading',
    'fill_blank',
    'Pilih kata penunjuk tempat yang berarti "Di sini": ___ は きょうしつ です。',
    '{
        "sentence_template": "[blank] は きょうしつ です。",
        "translation": "Di sini adalah ruang kelas.",
        "options": ["ここ", "そこ", "あそこ", "どこ"]
    }'::jsonb,
    '{"selected": "ここ"}'::jsonb,
    NULL,
    '{
        "そこ": "Soko berarti lokasi dekat lawan bicara (\"di situ\").",
        "あそこ": "Asoko berarti lokasi jauh dari pembicara dan lawan bicara (\"di sana\").",
        "どこ": "Doko adalah kata tanya penunjuk (\"di mana\")."
    }'::jsonb,
    'Kata penunjuk posisi ruangan Jepang mengikuti pola ko-so-a-do: ここ (koko) selalu merujuk pada area dekat pembicara ("di sini").',
    4
);

-- Soal 5: Writing - Partikel Objek WO & Minum (N5 Menengah)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT
    'b0000002-0000-0000-0000-000000000001'::uuid,
    gp.id,
    'writing',
    'sentence_builder',
    'Susun kalimat: "Minum air."',
    '{
        "tokens": ["みず", "を", "のみます", "たべます"],
        "target_translation": "Minum air.",
        "romaji": "Mizu o nomimasu."
    }'::jsonb,
    '["みず", "を", "のみます"]'::jsonb,
    '[["水", "を", "飲みます"]]'::jsonb,
    '{"たべます": "Tabemasu berarti makan makanan padat. Untuk air (mizu) gunakan nomimasu (minum)."}'::jsonb,
    'Partikel を (wo) menghubungkan kata benda objek penderita (みず) dengan verba transitif (のみます).',
    5
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-004' LIMIT 1;

-- Soal 6: Reading - Konjugasi Lampau Negatif (N5 Lanjutan)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT
    'b0000002-0000-0000-0000-000000000001'::uuid,
    gp.id,
    'reading',
    'fill_blank',
    'Lengkapi kalimat dengan bentuk lampau negatif formal: きのう べんきょう___。',
    '{
        "sentence_template": "きのう べんきょう[blank]。",
        "translation": "Kemarin saya tidak belajar.",
        "options": ["しませんでした", "します", "しません", "しました"]
    }'::jsonb,
    '{"selected": "しませんでした"}'::jsonb,
    NULL,
    '{
        "します": "Bentuk positif sekarang/kebiasaan.",
        "しません": "Bentuk negatif sekarang (tidak akan belajar).",
        "しました": "Bentuk positif lampau (sudah belajar)."
    }'::jsonb,
    'Keterangan waktu lampau きのう (kemarin) dipadukan dengan verba lampau negatif formal 〜ませんでした (shimasen deshita).',
    6
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-002' LIMIT 1;

-- Soal 7: Listening - Bentuk Permohonan Te Kudasai (N4 Dasar)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT
    'b0000002-0000-0000-0000-000000000001'::uuid,
    gp.id,
    'listening',
    'listening_choice',
    'Dengarkan instruksi kerja penutur asli berikut dan pilih arti yang tepat.',
    '{
        "audio_url": "/static/audio/ja/onboarding/kiite_kudasai.mp3",
        "audio_text": "よくきいてください",
        "options": [
            {"id": "opt_1", "text": "Tolong dengarkan baik-baik"},
            {"id": "opt_2", "text": "Tolong tulis di sini"},
            {"id": "opt_3", "text": "Tolong baca buku ini"},
            {"id": "opt_4", "text": "Tolong bicara lebih keras"}
        ]
    }'::jsonb,
    '{"selected_id": "opt_1"}'::jsonb,
    NULL,
    '{
        "opt_2": "Instruksi menulis adalah kaite kudasai.",
        "opt_3": "Instruksi membaca adalah yonde kudasai."
    }'::jsonb,
    'Bentuk 〜てください (-te kudasai) berasal dari verba bentuk-te + kudasai yang berfungsi menyampaikan instruksi atau permohonan santun.',
    7
FROM grammar_points gp WHERE gp.code = 'GP-JA-N4-001' LIMIT 1;

-- Soal 8: Writing - Bentuk Progresif ~Te Iru (N4 Menengah)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT
    'b0000002-0000-0000-0000-000000000001'::uuid,
    gp.id,
    'writing',
    'sentence_builder',
    'Susun kalimat: "Sekarang sedang membaca buku."',
    '{
        "tokens": ["いま", "ほん", "を", "よんで", "います", "みます"],
        "target_translation": "Sekarang sedang membaca buku.",
        "romaji": "Ima hon o yonde imasu."
    }'::jsonb,
    '["いま", "ほん", "を", "よんで", "います"]'::jsonb,
    '[["今", "本", "を", "読んで", "います"]]'::jsonb,
    '{"みます": "Mimasu berarti melihat/menonton. Untuk membaca buku (hon), gunakan yomimasu -> yonde imasu."}'::jsonb,
    'Pola verba bentuk-Te + います menyatakan aktivitas yang sedang berlangsung pada saat pembicaraan berlangsung.',
    8
FROM grammar_points gp WHERE gp.code = 'GP-JA-N4-002' LIMIT 1;

-- Soal 9: Reading - Partikel Alasan Kara (N4 Menengah)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000002-0000-0000-0000-000000000001'::uuid,
    NULL,
    'reading',
    'fill_blank',
    'Pilih partikel alasan sebab-akibat yang tepat: あめが ふっています ___、タクシーで いきます。',
    '{
        "sentence_template": "あめが ふっています [blank]、タクシーで いきます。",
        "translation": "Karena hujan turun, saya pergi naik taksi.",
        "options": ["から", "けど", "demo", "なら"]
    }'::jsonb,
    '{"selected": "から"}'::jsonb,
    NULL,
    '{
        "けど": "Kedo menandai pertentangan (tetapi / meskipun).",
        "demo": "Demo adalah kata sambung pengantar di awal kalimat baru.",
        "なら": "Nara digunakan untuk topik bersyarat."
    }'::jsonb,
    'Partikel から (kara) diletakkan di akhir klausa penyebab untuk menghubungkan alasan dengan keputusan/tindakan yang diambil.',
    9
);

-- Soal 10: Writing - Bentuk Keharusan ~Nakereba Narimasen (N4 Lanjutan)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT
    'b0000002-0000-0000-0000-000000000001'::uuid,
    gp.id,
    'writing',
    'sentence_builder',
    'Susun kalimat kewajiban kerja: "Besok harus pergi ke kantor."',
    '{
        "tokens": ["あした", "かいしゃ", "へ", "いかなければ", "なりません", "いきたいです"],
        "target_translation": "Besok harus pergi ke kantor.",
        "romaji": "Ashita kaisha e ikanakereba narimasen."
    }'::jsonb,
    '["あした", "かいしゃ", "へ", "いかなければ", "なりません"]'::jsonb,
    '[["明日", "会社", "へ", "行かなければ", "なりません"]]'::jsonb,
    '{"いきたいです": "Ikitai desu menyatakan keinginan subjek (ingin pergi), bukan keharusan tugas (harus pergi)."}'::jsonb,
    'Pola 〜なければなりません (-nakereba narimasen) adalah ekspresi formal standar dalam dunia profesional untuk menyatakan kewajiban mutlak.',
    10
FROM grammar_points gp WHERE gp.code = 'GP-JA-N4-003' LIMIT 1;

-- ----------------------------------------------------------------------------
-- 5. SOAL LATIHAN GERBANG PEMULA (Zero-Beginner Unit 0)
-- ----------------------------------------------------------------------------

-- Latihan Vokal 1 (Reading: Hiragana A-I-U-E-O)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000002-0000-0000-0000-000000000002'::uuid,
    NULL,
    'reading',
    'fill_blank',
    'Pilih huruf Hiragana yang memiliki pelafalan bunyi vokal "E":',
    '{"romaji": "e", "options": ["え", "あ", "い", "う"]}'::jsonb,
    '{"selected": "え"}'::jsonb,
    NULL,
    '{"あ": "Huruf ini dibaca \"a\".", "い": "Huruf ini dibaca \"i\".", "う": "Huruf ini dibaca \"u\"."}'::jsonb,
    'Huruf え dibaca "e" seperti dalam kata "enak".',
    1
);

-- Latihan Vokal 2 (Listening: Mengenali Suara Vokal I)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000002-0000-0000-0000-000000000002'::uuid,
    NULL,
    'listening',
    'listening_choice',
    'Dengarkan suara berikut dan pilih huruf Hiragana yang sesuai.',
    '{
        "audio_url": "/static/audio/ja/onboarding/vowel_i.mp3",
        "audio_text": "い",
        "options": [
            {"id": "opt_1", "text": "い (i)"},
            {"id": "opt_2", "text": "あ (a)"},
            {"id": "opt_3", "text": "う (u)"},
            {"id": "opt_4", "text": "お (o)"}
        ]
    }'::jsonb,
    '{"selected_id": "opt_1"}'::jsonb,
    NULL,
    '{"opt_2": "Suara tersebut melafalkan huruf vokal i, bukan a."}'::jsonb,
    'Huruf い terdiri dari dua coretan vertikal melengkung yang melambangkan vokal "i".',
    2
);

-- Latihan Salam Aisatsu (Writing: Salam Pertama Hajimemashite)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000002-0000-0000-0000-000000000003'::uuid,
    NULL,
    'writing',
    'sentence_builder',
    'Susun salam perkenalan pertama: "Senang bertemu pertama kali dengan Anda."',
    '{
        "tokens": ["はじめまして", "どうぞ", "よろしく", "おねがいします"],
        "target_translation": "Senang bertemu pertama kali dengan Anda.",
        "romaji": "Hajimemashite"
    }'::jsonb,
    '["はじめまして"]'::jsonb,
    '[["初めまして"]]'::jsonb,
    NULL,
    '「はじめまして」(Hajimemashite) berasal dari verba hajimeru (memulai), diucapkan saat pertama kali bertemu seseorang.',
    1
);

-- Latihan Salam Aisatsu (Speaking: Pengucapan Santun Yoroshiku)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000002-0000-0000-0000-000000000003'::uuid,
    NULL,
    'speaking',
    'speaking_repeat',
    'Dengarkan dan tirukan ungkapan santun perkenalan berikut dengan pelafalan yang jelas.',
    '{
        "audio_url": "/static/audio/ja/onboarding/yoroshiku_onegaishimasu.mp3",
        "display_text": "どうぞよろしくおねがいします",
        "romaji": "Douzo yoroshiku onegaishimasu",
        "phonetic_breakdown": ["dou-zo", "yo-ro-shi-ku", "o-ne-gai-shi-ma-su"]
    }'::jsonb,
    '{"expected_transcript": "どうぞよろしくおねがいします"}'::jsonb,
    '[["どうぞよろしくお願いします"], ["よろしくおねがいします"]]'::jsonb,
    NULL,
    'Ungkapan ini adalah penutup wajib perkenalan diri dalam kultur kerja Jepang yang bermakna "Mohon kerja sama dan bimbingan baiknya".',
    2
);

