-- ============================================================================
-- Migration: 000007_seed_jlpt_n5_units_3_and_4.up.sql
-- Description: Seed JLPT N5 Curriculum Progression (Unit 3: Daily Activities & Unit 4: Time, Commute & Transport)
-- Version: CodeAbroad v3.0
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. GRAMMAR POINTS (N5 Extended: Verba -MASU, Partikel DE, Partikel NI Waktu)
-- ----------------------------------------------------------------------------
INSERT INTO grammar_points (level_id, code, category, title, formula, explanation, order_index)
SELECT pl.id, 'GP-JA-N5-006', 'conjugation', 'Konjugasi Verba Formal (-MASU / -MASEN)', '[Akar Kata Kerja] + ます / ません', 'Bentuk sopan formal kata kerja untuk menyatakan kegiatan rutin harian atau kebiasaan saat ini dan masa depan (misal: たべます = makan, たべません = tidak makan).', 6
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (level_id, code) DO NOTHING;

INSERT INTO grammar_points (level_id, code, category, title, formula, explanation, order_index)
SELECT pl.id, 'GP-JA-N5-007', 'particle', 'Partikel DE (Sarana & Lokasi Tindakan)', '[Sarana/Alat] + で / [Tempat] + で + [Verba]', 'Partikel で (de) memiliki 2 fungsi utama: menandai sarana/alat transportasi (misal: でんしゃ で = dengan kereta) dan menandai tempat berlangsungnya suatu aksi aktif (misal: カフェ で たべます = makan di kafe).', 7
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (level_id, code) DO NOTHING;

INSERT INTO grammar_points (level_id, code, category, title, formula, explanation, order_index)
SELECT pl.id, 'GP-JA-N5-008', 'particle', 'Partikel NI (Waktu Spesifik & Titik Jam)', '[Angka Jam / Hari] + に + [Verba]', 'Partikel に (ni) dilekatkan pada angka jam atau hari kalender spesifik untuk menunjukkan titik waktu dilakukannya kegiatan (misal: ７じ に おきます = bangun jam 7).', 8
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (level_id, code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. UNITS 3 & 4 (JLPT N5 ROADMAP)
-- ----------------------------------------------------------------------------

-- Unit 3: Aktivitas Harian & Konsumsi
INSERT INTO units (id, level_id, title, description, unit_type, order_index)
SELECT 
    'a0000001-0000-0000-0000-000000000003'::uuid,
    pl.id,
    'Unit 3: Aktivitas Harian & Konsumsi (Makanan, Minuman & Kerja)',
    'Pelajari cara mendeskripsikan kegiatan sehari-hari, memesan makanan/minuman, dan menggunakan partikel objek を serta verba bentuk -MASU.',
    'curriculum',
    3
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (id) DO NOTHING;

-- Unit 4: Waktu, Mobilitas & Komuter Kantor
INSERT INTO units (id, level_id, title, description, unit_type, order_index)
SELECT 
    'a0000001-0000-0000-0000-000000000004'::uuid,
    pl.id,
    'Unit 4: Waktu, Mobilitas & Komuter Kantor (Transportasi & Jam)',
    'Kuasai cara menyatakan waktu kerja, jadwal keberangkatan, sarana komuter kereta di Tokyo, serta partikel tempat & arah (に・で・へ).',
    'curriculum',
    4
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. LESSONS FOR UNITS 3 & 4
-- ----------------------------------------------------------------------------

-- Lessons in Unit 3
INSERT INTO lessons (id, unit_id, title, xp_reward, order_index)
VALUES 
    (
        'b0000001-0000-0000-0000-000000000004'::uuid,
        'a0000001-0000-0000-0000-000000000003'::uuid,
        'Pelajaran 1: Makan, Minum & Rutinitas Pagi',
        15,
        1
    ),
    (
        'b0000001-0000-0000-0000-000000000005'::uuid,
        'a0000001-0000-0000-0000-000000000003'::uuid,
        'Pelajaran 2: Membeli Barang & Memesan di Kafe',
        15,
        2
    )
ON CONFLICT (id) DO NOTHING;

-- Lessons in Unit 4
INSERT INTO lessons (id, unit_id, title, xp_reward, order_index)
VALUES 
    (
        'b0000001-0000-0000-0000-000000000006'::uuid,
        'a0000001-0000-0000-0000-000000000004'::uuid,
        'Pelajaran 1: Jam Kerja & Jadwal Harian',
        15,
        1
    ),
    (
        'b0000001-0000-0000-0000-000000000007'::uuid,
        'a0000001-0000-0000-0000-000000000004'::uuid,
        'Pelajaran 2: Komuter Kereta & Menuju Kantor Tokyo',
        20,
        2
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. EXERCISES FOR UNIT 3: LESSON 1 & LESSON 2
-- ----------------------------------------------------------------------------

-- Unit 3 Lesson 1 Exercise 1 (Writing: Sentence Builder - Gohan o tabemasu)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000004'::uuid,
    gp.id,
    'writing',
    'sentence_builder',
    'Susun kalimat: "Setiap pagi saya makan nasi."',
    '{
        "tokens": ["まいあさ", "ごはん", "を", "たべます", "パン", "のみます"],
        "target_translation": "Setiap pagi saya makan nasi.",
        "furigana": [{"kanji": "毎朝", "kana": "まいあさ"}, {"kanji": "ご飯", "kana": "ごはん"}, {"kanji": "食べます", "kana": "たべます"}],
        "romaji": "Maiasa gohan o tabemasu."
    }'::jsonb,
    '["まいあさ", "ごはん", "を", "たべます"]'::jsonb,
    '[["毎朝", "ご飯", "を", "食べます"], ["毎朝", "ごはん", "を", "たべます"]]'::jsonb,
    '{
        "パン": "Pan berarti roti, sedangkan kalimat meminta nasi (gohan).",
        "のみます": "Nomimasu berarti minum, sedangkan untuk makanan padat digunakan tabemasu (makan)."
    }'::jsonb,
    'Keterangan waktu frekuensi (まいあさ) diletakkan di awal kalimat, diikuti objek makanan (ごはん), partikel penderita (を), dan verba aksi (たべます).',
    1
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-004' LIMIT 1;

-- Unit 3 Lesson 1 Exercise 2 (Listening: Listening Choice - Lokasi Aktivitas Partikel DE)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000004'::uuid,
    gp.id,
    'listening',
    'listening_choice',
    'Dengarkan audio penutur asli berikut dan tentukan di mana pembicara minum kopi.',
    '{
        "audio_url": "/static/audio/ja/n5/uchi_de_koohii_o_nomimasu.mp3",
        "audio_text": "わたしは うちで コーヒーを のみます。",
        "furigana": [{"kanji": "家", "kana": "うち"}],
        "options": [
            {"id": "opt_1", "text": "Di rumah (Uchi de)"},
            {"id": "opt_2", "text": "Di kafe (Kafe de)"},
            {"id": "opt_3", "text": "Di kantor (Kaisha de)"},
            {"id": "opt_4", "text": "Di stasiun (Eki de)"}
        ]
    }'::jsonb,
    '{"selected_id": "opt_1"}'::jsonb,
    NULL,
    '{
        "opt_2": "Pembicara menyebutkan kata うち (uchi = rumah), bukan kafe.",
        "opt_3": "Kantor adalah かいしゃ (kaisha)."
    }'::jsonb,
    'Partikel で (de) setelah kata うち (rumah) menunjukkan lokasi di mana aktivitas minum kopi berlangsung.',
    2
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-007' LIMIT 1;

-- Unit 3 Lesson 1 Exercise 3 (Speaking: Speaking Repeat - Mizu o nomimasu)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000004'::uuid,
    gp.id,
    'speaking',
    'speaking_repeat',
    'Dengarkan dan tirukan kalimat: "Saya minum air mineral."',
    '{
        "audio_url": "/static/audio/ja/n5/mizu_o_nomimasu.mp3",
        "display_text": "みずをのみます",
        "furigana": [{"kanji": "水", "kana": "みず"}, {"kanji": "飲みます", "kana": "のみます"}],
        "romaji": "Mizu o nomimasu.",
        "phonetic_breakdown": ["mi-zu", "o", "no-mi-ma-su"]
    }'::jsonb,
    '{"expected_transcript": "みずをのみます"}'::jsonb,
    '[["水を飲みます"], ["みずを飲みます"]]'::jsonb,
    NULL,
    'Ucapkan partikel を sebagai vokal bulat "o" yang mengalir halus antara kata mizu dan nomimasu.',
    3
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-004' LIMIT 1;

-- Unit 3 Lesson 2 Exercise 1 (Reading: Fill Blank - Pesan Barang Kore o kudasai)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000005'::uuid,
    gp.id,
    'reading',
    'fill_blank',
    'Lengkapi kalimat saat memesan barang di toko/kafe: すみません、これ ___ ください。',
    '{
        "sentence_template": "すみません、これ [blank] ください。",
        "translation": "Permisi, tolong berikan yang ini.",
        "options": ["を", "は", "に", "で"]
    }'::jsonb,
    '{"selected": "を"}'::jsonb,
    NULL,
    '{
        "は": "Partikel は digunakan untuk penanda topik pembicaraan.",
        "に": "Partikel に digunakan untuk tujuan waktu atau tempat.",
        "で": "Partikel で digunakan untuk sarana atau lokasi tindakan."
    }'::jsonb,
    'Frasa 「これ を ください」(Kore o kudasai) adalah ungkapan standar transaksi di Jepang untuk meminta barang yang ditunjuk kepada kasir.',
    1
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-004' LIMIT 1;

-- Unit 3 Lesson 2 Exercise 2 (Listening: Listening Choice - Kasir Konbini Tokyo)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000001-0000-0000-0000-000000000005'::uuid,
    NULL,
    'listening',
    'listening_choice',
    'Dengarkan percakapan di konbini berikut. Berapa total belanjaan pelanggan?',
    '{
        "audio_url": "/static/audio/ja/n5/konbini_total_sanbyaku_en.mp3",
        "audio_text": "店員: ありがとうございます。ぜんぶで さんびゃくえん です。",
        "options": [
            {"id": "opt_1", "text": "300 Yen (Sanbyaku-en)"},
            {"id": "opt_2", "text": "500 Yen (Gohyaku-en)"},
            {"id": "opt_3", "text": "3000 Yen (Sanzen-en)"},
            {"id": "opt_4", "text": "100 Yen (Hyaku-en)"}
        ]
    }'::jsonb,
    '{"selected_id": "opt_1"}'::jsonb,
    NULL,
    '{
        "opt_2": "500 Yen adalah gohyaku-en.",
        "opt_3": "3000 Yen adalah sanzen-en (ribuan)."
    }'::jsonb,
    'Kata さんびゃく (sanbyaku) berarti 300, dan えん (en) adalah mata uang Yen Jepang.',
    2
);

-- ----------------------------------------------------------------------------
-- 5. EXERCISES FOR UNIT 4: LESSON 1 & LESSON 2
-- ----------------------------------------------------------------------------

-- Unit 4 Lesson 1 Exercise 1 (Reading: Fill Blank - Partikel NI Titik Jam)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000006'::uuid,
    gp.id,
    'reading',
    'fill_blank',
    'Lengkapi kalimat waktu bangun pagi: まいあさ ７じ ___ おきます。',
    '{
        "sentence_template": "まいあさ ７じ [blank] おきます。",
        "translation": "Setiap pagi saya bangun pada jam 7.",
        "furigana": [{"kanji": "毎朝", "kana": "まいあさ"}, {"kanji": "７時", "kana": "しちじ"}, {"kanji": "起きます", "kana": "おきます"}],
        "options": ["に", "で", "を", "は"]
    }'::jsonb,
    '{"selected": "に"}'::jsonb,
    NULL,
    '{
        "で": "Partikel で tidak digunakan untuk titik waktu jam.",
        "を": "Partikel を adalah penanda objek langsung penderita verba."
    }'::jsonb,
    'Partikel に (ni) wajib digunakan setelah angka waktu jam pasti (７じ に) untuk menandai momen terjadinya tindakan bangun (おきます).',
    1
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-008' LIMIT 1;

-- Unit 4 Lesson 1 Exercise 2 (Writing: Sentence Builder - Dari Jam 9 Sampai Jam 5)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000006'::uuid,
    gp.id,
    'writing',
    'sentence_builder',
    'Susun jam kerja kantor: "Bekerja dari jam 9 sampai jam 5."',
    '{
        "tokens": ["９じ", "から", "５じ", "まで", "はたらきます", "やすみます"],
        "target_translation": "Bekerja dari jam 9 sampai jam 5.",
        "furigana": [{"kanji": "９時", "kana": "くじ"}, {"kanji": "５時", "kana": "ごじ"}, {"kanji": "働きます", "kana": "はたらきます"}],
        "romaji": "Kuji kara goji made hatarakimasu."
    }'::jsonb,
    '["９じ", "から", "５じ", "まで", "はたらきます"]'::jsonb,
    '[["9時", "から", "5時", "まで", "働きます"], ["９時", "から", "５時", "まで", "はたらきます"]]'::jsonb,
    '{
        "やすみます": "Yasumimasu berarti istirahat/libur, sedangkan kalimat meminta bekerja (hatarakimasu)."
    }'::jsonb,
    'Kombinasi partikel から (kara = dari) dan まで (made = sampai) menunjukkan rentang waktu kerja kantor di Jepang.',
    2
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-008' LIMIT 1;

-- Unit 4 Lesson 2 Exercise 1 (Writing: Sentence Builder - Naik Bus ke Stasiun)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000007'::uuid,
    gp.id,
    'writing',
    'sentence_builder',
    'Susun kalimat mobilitas: "Pergi ke stasiun naik bus."',
    '{
        "tokens": ["バス", "で", "えき", "へ", "いきます", "かえります"],
        "target_translation": "Pergi ke stasiun naik bus.",
        "furigana": [{"kanji": "駅", "kana": "えき"}, {"kanji": "行きます", "kana": "いきます"}],
        "romaji": "Basu de eki e ikimasu."
    }'::jsonb,
    '["バス", "で", "えき", "へ", "いきます"]'::jsonb,
    '[["バス", "で", "駅", "へ", "行きます"], ["バス", "で", "えき", "に", "いきます"]]'::jsonb,
    '{
        "かえります": "Kaerimasu berarti pulang (ke rumah/negara asal), bukan pergi (ikimasu)."
    }'::jsonb,
    'Sarana transportasi menggunakan partikel で (バス で), tempat tujuan menggunakan partikel へ atau に (えき へ), dan kata kerja arah (いきます).',
    1
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-007' LIMIT 1;

-- Unit 4 Lesson 2 Exercise 2 (Listening: Listening Choice - Pengumuman Yamanote Line Tokyo)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000001-0000-0000-0000-000000000007'::uuid,
    NULL,
    'listening',
    'listening_choice',
    'Dengarkan pengumuman kereta komuter stasiun Tokyo berikut. Menuju ke stasiun manakah kereta ini?',
    '{
        "audio_url": "/static/audio/ja/n5/train_announcement_shinjuku_yuki.mp3",
        "audio_text": "まもなく、２ばんせんに しぶや・しんじゅくほうめん いきの でんしゃが まいります。",
        "options": [
            {"id": "opt_1", "text": "Menuju Shibuya & Shinjuku"},
            {"id": "opt_2", "text": "Menuju Bandara Haneda"},
            {"id": "opt_3", "text": "Menuju Yokohama"},
            {"id": "opt_4", "text": "Kereta terakhir tidak beroperasi"}
        ]
    }'::jsonb,
    '{"selected_id": "opt_1"}'::jsonb,
    NULL,
    '{
        "opt_2": "Tidak ada penyebutan bandara (kuukou) dalam audio pengumuman."
    }'::jsonb,
    'Pengumuman stasiun menggunakan frasa 「しぶや・しんじゅくほうめん いき」(arah tujuan Shibuya & Shinjuku).',
    2
);

-- Unit 4 Lesson 2 Exercise 3 (Speaking: Speaking Repeat - Densha de ikimasu)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000007'::uuid,
    gp.id,
    'speaking',
    'speaking_repeat',
    'Dengarkan dan tirukan kalimat komuter kerja: "Saya pergi naik kereta listrik."',
    '{
        "audio_url": "/static/audio/ja/n5/densha_de_ikimasu.mp3",
        "display_text": "でんしゃでいきます",
        "furigana": [{"kanji": "電車", "kana": "でんしゃ"}, {"kanji": "行きます", "kana": "いきます"}],
        "romaji": "Densha de ikimasu.",
        "phonetic_breakdown": ["den-sha", "de", "i-ki-ma-su"]
    }'::jsonb,
    '{"expected_transcript": "でんしゃでいきます"}'::jsonb,
    '[["電車で行きます"], ["でんしゃで行きます"]]'::jsonb,
    NULL,
    'Kata でんしゃ (densha = kereta listrik komuter) dipadukan dengan partikel sarana で (de) dan verba いき (iki).',
    3
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-007' LIMIT 1;

