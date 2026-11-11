-- ============================================================================
-- Migration: 000005_seed_expand_jlpt_n5_curriculum_and_mock_exam.up.sql
-- Description: Expand JLPT N5 Unit 1 (4-Pillar completeness) & Unit 2 (5 Sectional Mock Exam Questions)
-- Version: CodeAbroad v3.0
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXPAND UNIT 1: LESSON 1 (Salam Perkenalan & Identitas)
-- ----------------------------------------------------------------------------

-- Exercise 3 in Lesson 1 (Speaking: Speaking Repeat)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000001'::uuid,
    gp.id,
    'speaking',
    'speaking_repeat',
    'Dengarkan dan tirukan kalimat perkenalan profesi berikut dengan artikulasi yang jelas.',
    '{
        "audio_url": "/static/audio/ja/n5/hajimemashite_watashi_wa_enjinia_desu.mp3",
        "display_text": "はじめまして、わたしはエンジニアです",
        "furigana": [{"kanji": "初めまして", "kana": "はじめまして"}, {"kanji": "私", "kana": "わたし"}],
        "romaji": "Hajimemashite, watashi wa enjinia desu.",
        "phonetic_breakdown": ["ha-ji-me-ma-shi-te", "wa-ta-shi", "wa", "en-ji-ni-a", "de-su"]
    }'::jsonb,
    '{"expected_transcript": "はじめましてわたしはエンジニアです"}'::jsonb,
    '[["初めまして、私はエンジニアです"], ["はじめまして、エンジニアです"]]'::jsonb,
    NULL,
    'Ucapkan salam pembuka 「はじめまして」 dengan nada ramah, diikuti nama profesi dan penutup kopula formal 「です」.',
    3
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-001' LIMIT 1;

-- Exercise 4 in Lesson 1 (Reading: Fill in the Blank - Meishi / Kartu Nama)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000001'::uuid,
    gp.id,
    'reading',
    'fill_blank',
    'Lengkapi kalimat pertukaran kartu nama di tempat kerja: これは わたし ___ めいし です。',
    '{
        "sentence_template": "これは わたし [blank] めいし です。",
        "translation": "Ini adalah kartu nama saya.",
        "furigana": [{"kanji": "名刺", "kana": "めいし"}],
        "options": ["の", "は", "を", "に"]
    }'::jsonb,
    '{"selected": "の"}'::jsonb,
    NULL,
    '{
        "は": "Partikel は digunakan untuk topik utama kalimat, bukan kepemilikan benda.",
        "を": "Partikel を menandai objek penderita kata kerja transitif.",
        "に": "Partikel に menunjukkan waktu atau tempat tujuan."
    }'::jsonb,
    'Partikel の (no) berfungsi menghubungkan dua kata benda untuk menyatakan kepemilikan: わたし (saya) + の + めいし (kartu nama) = "kartu nama saya".',
    4
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-003' LIMIT 1;

-- ----------------------------------------------------------------------------
-- 2. EXPAND UNIT 1: LESSON 2 (Profesi & Kewarganegaraan)
-- ----------------------------------------------------------------------------

-- Exercise 2 in Lesson 2 (Writing: Sentence Builder)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000002'::uuid,
    gp.id,
    'writing',
    'sentence_builder',
    'Susun kalimat: "Tanaka-san adalah orang Jepang."',
    '{
        "tokens": ["たなかさん", "は", "にほんじん", "です", "アメリカじん"],
        "target_translation": "Tanaka-san adalah orang Jepang.",
        "romaji": "Tanaka-san wa nihonjin desu."
    }'::jsonb,
    '["たなかさん", "は", "にほんじん", "です"]'::jsonb,
    '[["田中さん", "は", "日本人", "です"]]'::jsonb,
    '{"アメリカじん": "Amerika-jin berarti orang Amerika, bukan orang Jepang (nihonjin)."}'::jsonb,
    'Akhiran じん (jin) ditambahkan setelah nama negara untuk menyatakan warga negara: にほん (Jepang) + じん = orang Jepang.',
    2
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-001' LIMIT 1;

-- Exercise 3 in Lesson 2 (Listening: Listening Choice)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000001-0000-0000-0000-000000000002'::uuid,
    NULL,
    'listening',
    'listening_choice',
    'Dengarkan dialog singkat berikut dan tentukan profesi pembicara.',
    '{
        "audio_url": "/static/audio/ja/n5/watashi_wa_isha_dewa_arimasen.mp3",
        "audio_text": "わたしはいしゃではありません。エンジニアです。",
        "furigana": [{"kanji": "医者", "kana": "いしゃ"}],
        "options": [
            {"id": "opt_1", "text": "Insinyur (Bukan dokter)"},
            {"id": "opt_2", "text": "Dokter (Bukan insinyur)"},
            {"id": "opt_3", "text": "Guru (Sensei)"},
            {"id": "opt_4", "text": "Mahasiswa (Gakusei)"}
        ]
    }'::jsonb,
    '{"selected_id": "opt_1"}'::jsonb,
    NULL,
    '{
        "opt_2": "Perhatikan bentuk negatif ではありません setelah kata isha (dokter), yang berarti bukan dokter."
    }'::jsonb,
    'Pembicara menyatakan 「いしゃではありません」(bukan dokter) lalu menegaskan identitasnya 「エンジニアです」(adalah insinyur).',
    3
);

-- Exercise 4 in Lesson 2 (Speaking: Speaking Repeat - Partikel MO)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000001-0000-0000-0000-000000000002'::uuid,
    NULL,
    'speaking',
    'speaking_repeat',
    'Dengarkan dan tirukan kalimat persetujuan: "Saya juga orang Indonesia."',
    '{
        "audio_url": "/static/audio/ja/n5/watashi_mo_indonesiajin_desu.mp3",
        "display_text": "わたしもインドネシアじんです",
        "romaji": "Watashi mo indonesiajin desu.",
        "phonetic_breakdown": ["wa-ta-shi", "mo", "in-do-ne-shi-a-jin", "de-su"]
    }'::jsonb,
    '{"expected_transcript": "わたしもインドネシアじんです"}'::jsonb,
    '[["私もインドネシア人です"], ["わたしもインドネシア人です"]]'::jsonb,
    NULL,
    'Partikel も (mo) menggantikan partikel は ketika ingin menyatakan kesamaan arti: "juga / pun".',
    4
);

-- ----------------------------------------------------------------------------
-- 3. FILL UNIT 2: LESSON 1 (Simulasi Sectional N5: Evaluasi Tata Bahasa)
-- ----------------------------------------------------------------------------

-- Mock Exam Question 1: Seksi Moji/Goi (Reading)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000001-0000-0000-0000-000000000003'::uuid,
    NULL,
    'reading',
    'fill_blank',
    '[SEKSI KOSAKATA] Pilih cara baca Hiragana yang benar untuk kanji berikut: 日本人',
    '{
        "target_word": "日本人",
        "options": ["にほんじん", "にぽんじん", "にほんびと", "にほんひと"]
    }'::jsonb,
    '{"selected": "にほんじん"}'::jsonb,
    NULL,
    '{"にほんびと": "Kanji 人 jika dilekatkan pada nama negara dibaca jin, bukan hito/bito."}'::jsonb,
    'Kombinasi kanji 日本 (Nihon = Jepang) dan 人 (jin = orang) dibaca secara resmi sebagai にほんじん (nihonjin).',
    1
);

-- Mock Exam Question 2: Seksi Bunpo (Writing: Sentence Builder)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000003'::uuid,
    gp.id,
    'writing',
    'sentence_builder',
    '[SEKSI TATA BAHASA] Susun kalimat penolakan sopan: "Bukan, dia bukan mahasiswa."',
    '{
        "tokens": ["いいえ", "かれ", "は", "がくせい", "ではありません", "です"],
        "target_translation": "Bukan, dia bukan mahasiswa.",
        "romaji": "Iie, kare wa gakusei dewa arimasen."
    }'::jsonb,
    '["いいえ", "かれ", "は", "がくせい", "ではありません"]'::jsonb,
    '[["いいえ", "彼", "は", "学生", "ではありません"]]'::jsonb,
    '{"です": "Bentuk です adalah afirmatif positif, bertentangan dengan kata sanggahan いいえ (bukan)."}'::jsonb,
    'Jawaban negatif formal diawali kata いいえ (iie) dan diakhiri bentuk negasi ではありません (dewa arimasen).',
    2
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-002' LIMIT 1;

-- Mock Exam Question 3: Seksi Dokkai (Reading: Pemahaman Kartu Nama)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000001-0000-0000-0000-000000000003'::uuid,
    NULL,
    'reading',
    'fill_blank',
    '[SEKSI BACAAN] Baca kartu nama berikut:\n【東京テクノロジー株式会社 / システムエンジニア / 佐藤 健】\nApa profesi Sato Ken?',
    '{
        "passage": "佐藤 健 (Sato Ken) adalah karyawan di Tokyo Technology.",
        "options": ["Sistem Insinyur (SE)", "Dokter Umum", "Guru Bahasa", "Akuntan"]
    }'::jsonb,
    '{"selected": "Sistem Insinyur (SE)"}'::jsonb,
    NULL,
    '{"Guru Bahasa": "Pada kartu tertulis システムエンジニア (System Engineer)."}'::jsonb,
    'Kata serapan katakana システムエンジニア (shisutemu enjinia) berarti System Engineer.',
    3
);

-- Mock Exam Question 4: Seksi Choukai (Listening: Dialog Kantor)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
) VALUES (
    'b0000001-0000-0000-0000-000000000003'::uuid,
    NULL,
    'listening',
    'listening_choice',
    '[SEKSI MENDENGARKAN] Dengarkan percakapan sambutan kantor dan pilih intisari yang benar.',
    '{
        "audio_url": "/static/audio/ja/n5/mock_office_welcome.mp3",
        "audio_text": "A: はじめまして、サトウです。どうぞよろしく。\nB: スミスです。こちらこそよろしくおねがいします。",
        "options": [
            {"id": "opt_1", "text": "Sato dan Smith saling berkenalan di tempat kerja"},
            {"id": "opt_2", "text": "Sato berpamitan pulang kepada Smith"},
            {"id": "opt_3", "text": "Smith menolak bekerja sama dengan Sato"},
            {"id": "opt_4", "text": "Sato meminta maaf karena datang terlambat"}
        ]
    }'::jsonb,
    '{"selected_id": "opt_1"}'::jsonb,
    NULL,
    '{"opt_4": "Tidak ada ungkapan permohonan maaf (sumimasen) dalam audio."}'::jsonb,
    'Frasa 「こちらこそよろしくおねがいします」(Kochira koso yoroshiku onegaishimasu) adalah balasan standar ketika seseorang diajak berkenalan pertama kali.',
    4
);

-- Mock Exam Question 5: Seksi Sintesis (Writing: Kalimat Lengkap)
INSERT INTO exercises (
    lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, 
    content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index
)
SELECT 
    'b0000001-0000-0000-0000-000000000003'::uuid,
    gp.id,
    'writing',
    'sentence_builder',
    '[SEKSI SINTESIS] Susun kalimat utuh: "Saya adalah orang Indonesia, bukan orang Jepang."',
    '{
        "tokens": ["わたし", "は", "インドネシアじん", "です", "にほんじん", "ではありません"],
        "target_translation": "Saya adalah orang Indonesia, bukan orang Jepang.",
        "romaji": "Watashi wa indonesiajin desu. Nihonjin dewa arimasen."
    }'::jsonb,
    '["わたし", "は", "インドネシアじん", "です", "にほんじん", "ではありません"]'::jsonb,
    '[["私", "は", "インドネシア人", "です", "日本人", "ではありません"]]'::jsonb,
    NULL,
    'Struktur kalimat memadukan deklarasi afirmatif identitas diri (... desu) dengan negasi pembeda (... dewa arimasen).',
    5
FROM grammar_points gp WHERE gp.code = 'GP-JA-N5-001' LIMIT 1;

