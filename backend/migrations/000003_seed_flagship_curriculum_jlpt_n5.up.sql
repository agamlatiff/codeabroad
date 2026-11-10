-- ============================================================================
-- Migration: 000003_seed_flagship_curriculum_jlpt_n5.up.sql
-- Description: Seed JLPT N5 Flagship Curriculum (Grammar Points, Units, Lessons & 4-Pillar Exercises)
-- Version: CodeAbroad v3.0
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. GRAMMAR POINTS (JLPT N5)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 2. UNITS & LESSONS (JLPT N5)
-- ----------------------------------------------------------------------------

-- Unit 1: Curriculum Module
INSERT INTO units (id, level_id, title, description, unit_type, order_index)
SELECT 
    'a0000001-0000-0000-0000-000000000001'::uuid,
    pl.id,
    'Unit 1: Pondasi Kalimat & Identitas Diri',
    'Kuasai cara memperkenalkan diri, latar belakang, dan struktur dasar kalimat bahasa Jepang (A wa B desu).',
    'curriculum',
    1
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (id) DO NOTHING;

-- Lesson 1 in Unit 1
INSERT INTO lessons (id, unit_id, title, xp_reward, order_index)
VALUES (
    'b0000001-0000-0000-0000-000000000001'::uuid,
    'a0000001-0000-0000-0000-000000000001'::uuid,
    'Pelajaran 1: Salam Perkenalan & Identitas',
    15,
    1
) ON CONFLICT (id) DO NOTHING;

-- Lesson 2 in Unit 1
INSERT INTO lessons (id, unit_id, title, xp_reward, order_index)
VALUES (
    'b0000001-0000-0000-0000-000000000002'::uuid,
    'a0000001-0000-0000-0000-000000000001'::uuid,
    'Pelajaran 2: Profesi & Kewarganegaraan',
    15,
    2
) ON CONFLICT (id) DO NOTHING;

-- Unit 2: Diagnostic Mock Exam Module
INSERT INTO units (id, level_id, title, description, unit_type, order_index)
SELECT 
    'a0000001-0000-0000-0000-000000000002'::uuid,
    pl.id,
    'Unit 2: Evaluasi Kesiapan N5 (Diagnostic Mock Exam)',
    'Uji kesiapan pemahaman tata bahasa dan kosakata dasar dengan simulasi berbatas waktu.',
    'diagnostic_exam',
    2
FROM proficiency_levels pl
JOIN languages l ON pl.language_id = l.id
WHERE l.code = 'ja' AND pl.code = 'N5'
ON CONFLICT (id) DO NOTHING;

-- Lesson 1 in Unit 2 (Exam Session)
INSERT INTO lessons (id, unit_id, title, xp_reward, order_index)
VALUES (
    'b0000001-0000-0000-0000-000000000003'::uuid,
    'a0000001-0000-0000-0000-000000000002'::uuid,
    'Simulasi Sectional N5: Evaluasi Tata Bahasa',
    30,
    1
) ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. INTERACTIVE 4-PILLAR EXERCISES
-- ----------------------------------------------------------------------------

-- Exercise 1 (Writing: Sentence Builder)
INSERT INTO exercises (
    lesson_id, 
    grammar_point_id, 
    skill_pillar, 
    exercise_type, 
    prompt, 
    content, 
    correct_answer, 
    acceptable_answers, git ad
    diagnostic_rubric, 
    explanation, 
    order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000001'::uuid,
    gp.id,
    'writing',
    'sentence_builder',
    'Susun balok kata berikut menjadi kalimat: "Saya adalah seorang insinyur."',
    '{
        "tokens": ["わたし", "は", "エンジニア", "です", "がくせい", "ではありませ"],
        "target_translation": "Saya adalah seorang insinyur.",
        "romaji": "Watashi wa enjinia desu."
    }'::jsonb,
    '["わたし", "は", "エンジニア", "です"]'::jsonb,
    '[["私", "は", "エンジニア", "です"], ["わたし", "は", "えんじにあ", "です"]]'::jsonb,
    '{
        "がくせい": "Kamu memilih kata yang berarti mahasiswa/pelajar, bukan insinyur.",
        "ではありませ": "Bentuk ini merupakan akhiran negatif, sedangkan kalimat yang diminta adalah deklaratif positif."
    }'::jsonb,
    'Dalam bahasa Jepang, partikel は (wa) diletakkan setelah topik/subjek (わたし), diikuti predikat (エンジニア), dan diakhiri kopula formal です (desu).',
    1
FROM grammar_points gp
WHERE gp.code = 'GP-JA-N5-001'
LIMIT 1;

-- Exercise 2 (Listening: Listening Choice)
INSERT INTO exercises (
    lesson_id, 
    grammar_point_id, 
    skill_pillar, 
    exercise_type, 
    prompt, 
    content, 
    correct_answer, 
    acceptable_answers, 
    diagnostic_rubric, 
    explanation, 
    order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000001'::uuid,
    gp.id,
    'listening',
    'listening_choice',
    'Dengarkan audio penutur asli berikut dan pilih arti kalimat yang tepat.',
    '{
        "audio_url": "/static/audio/ja/n5/watashi_wa_nihonjin_desu.mp3",
        "audio_text": "わたしはにほんじんです",
        "furigana": [{"kanji": "私", "kana": "わたし"}, {"kanji": "日本人", "kana": "にほんじん"}],
        "options": [
            {"id": "opt_1", "text": "Saya adalah orang Jepang."},
            {"id": "opt_2", "text": "Saya sedang pergi ke Jepang."},
            {"id": "opt_3", "text": "Apakah kamu orang Jepang?"},
            {"id": "opt_4", "text": "Saya bukan orang Jepang."}
        ]
    }'::jsonb,
    '{"selected_id": "opt_1"}'::jsonb,
    NULL,
    '{
        "opt_2": "Perhatikan bahwa kalimat tidak menggunakan kata kerja perpindahan (ikimasu), melainkan kopula です.",
        "opt_3": "Kalimat ini tidak diakhiri partikel tanya か (ka).",
        "opt_4": "Bentuk kalimat ini adalah positif, bukan bentuk negatif (dewa arimasen)."
    }'::jsonb,
    'Frasa 「わたしはにほんじんです」(Watashi wa nihonjin desu) secara harfiah berarti "Saya adalah orang Jepang".',
    2
FROM grammar_points gp
WHERE gp.code = 'GP-JA-N5-001'
LIMIT 1;

-- Exercise 3 (Reading: Fill in the Blank)
INSERT INTO exercises (
    lesson_id, 
    grammar_point_id, 
    skill_pillar, 
    exercise_type, 
    prompt, 
    content, 
    correct_answer, 
    acceptable_answers, 
    diagnostic_rubric, 
    explanation, 
    order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000002'::uuid,
    gp.id,
    'reading',
    'fill_blank',
    'Lengkapi bagian kosong dengan partikel yang tepat: 田中さん ___ 先生です。',
    '{
        "sentence_template": "田中さん [blank] 先生です。",
        "translation": "Tanaka-san adalah seorang guru.",
        "options": ["は", "が", "を", "に"]
    }'::jsonb,
    '{"selected": "は"}'::jsonb,
    NULL,
    '{
        "が": "Partikel が digunakan untuk penekanan subjek gramatikal, namun untuk topik perkenalan umum yang netral digunakan は.",
        "を": "Partikel を digunakan sebagai penanda objek langsung penderita kata kerja transitif.",
        "に": "Partikel に digunakan untuk tujuan tempat atau waktu spesifik."
    }'::jsonb,
    'Dalam struktur kalimat sederhana "A adalah B", partikel topik は (wa) digunakan setelah subjek 田中さん.',
    1
FROM grammar_points gp
WHERE gp.code = 'GP-JA-N5-001'
LIMIT 1;

