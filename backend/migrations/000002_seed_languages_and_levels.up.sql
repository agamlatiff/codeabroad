-- ============================================================================
-- Migration: 000002_seed_languages_and_levels.up.sql
-- Description: Seed 6 Global Language Tracks and Standard Proficiency Levels (JLPT, IELTS, TOEFL, Goethe, HSK, DELF)
-- Version: CodeAbroad v3.0
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED 6 GLOBAL LANGUAGES
-- ----------------------------------------------------------------------------
INSERT INTO languages (code, name, supported_scripts, is_active) VALUES
    ('ja', 'Jepang', '["kanji", "hiragana", "katakana", "romaji"]'::jsonb, TRUE),
    ('en-gb', 'Inggris (British)', '["latin"]'::jsonb, TRUE),
    ('en-us', 'Inggris (American)', '["latin"]'::jsonb, TRUE),
    ('de', 'Jerman', '["latin"]'::jsonb, TRUE),
    ('zh', 'Mandarin', '["simplified", "traditional", "pinyin"]'::jsonb, TRUE),
    ('fr', 'Prancis', '["latin"]'::jsonb, TRUE)
ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name,
    supported_scripts = EXCLUDED.supported_scripts,
    is_active = EXCLUDED.is_active;

-- ----------------------------------------------------------------------------
-- 2. SEED PROFICIENCY LEVELS
-- ----------------------------------------------------------------------------

-- 🇯🇵 JAPANESE (JLPT N5 -> N1)
INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'N5', 'JLPT N5 (Pemula)', 'beginner', 'JLPT', 60, 1 FROM languages WHERE code = 'ja'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'N4', 'JLPT N4 (Dasar Lanjutan)', 'beginner', 'JLPT', 60, 2 FROM languages WHERE code = 'ja'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'N3', 'JLPT N3 (Menengah Pra-Kerja)', 'intermediate', 'JLPT', 60, 3 FROM languages WHERE code = 'ja'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'N2', 'JLPT N2 (Bisnis Profesional)', 'intermediate', 'JLPT', 60, 4 FROM languages WHERE code = 'ja'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'N1', 'JLPT N1 (Mahir Fasih)', 'advanced', 'JLPT', 60, 5 FROM languages WHERE code = 'ja'
ON CONFLICT (language_id, code) DO NOTHING;

-- 🇬🇧 BRITISH ENGLISH (IELTS Track)
INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'IELTS_FOUNDATION', 'IELTS Foundation (Band 4.0 - 5.0)', 'beginner', 'IELTS', 60, 1 FROM languages WHERE code = 'en-gb'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'IELTS_INTERMEDIATE', 'IELTS Intermediate (Band 5.5 - 6.5)', 'intermediate', 'IELTS', 65, 2 FROM languages WHERE code = 'en-gb'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'IELTS_ADVANCED', 'IELTS Advanced (Band 7.0 - 9.0)', 'advanced', 'IELTS', 75, 3 FROM languages WHERE code = 'en-gb'
ON CONFLICT (language_id, code) DO NOTHING;

-- 🇺🇸 AMERICAN ENGLISH (TOEFL Track)
INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'TOEFL_FOUNDATION', 'TOEFL Foundation (Score 40 - 60)', 'beginner', 'TOEFL iBT', 60, 1 FROM languages WHERE code = 'en-us'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'TOEFL_INTERMEDIATE', 'TOEFL Intermediate (Score 61 - 90)', 'intermediate', 'TOEFL iBT', 65, 2 FROM languages WHERE code = 'en-us'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'TOEFL_ADVANCED', 'TOEFL Advanced (Score 91 - 120)', 'advanced', 'TOEFL iBT', 75, 3 FROM languages WHERE code = 'en-us'
ON CONFLICT (language_id, code) DO NOTHING;

-- 🇩🇪 GERMAN (Goethe-Zertifikat Track)
INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'A1', 'Goethe A1 (Start Deutsch 1)', 'beginner', 'Goethe-Zertifikat', 60, 1 FROM languages WHERE code = 'de'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'A2', 'Goethe A2 (Start Deutsch 2)', 'beginner', 'Goethe-Zertifikat', 60, 2 FROM languages WHERE code = 'de'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'B1', 'Goethe B1 (Zertifikat Deutsch)', 'intermediate', 'Goethe-Zertifikat', 60, 3 FROM languages WHERE code = 'de'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'B2', 'Goethe B2', 'intermediate', 'Goethe-Zertifikat', 60, 4 FROM languages WHERE code = 'de'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'C1', 'Goethe C1', 'advanced', 'Goethe-Zertifikat', 60, 5 FROM languages WHERE code = 'de'
ON CONFLICT (language_id, code) DO NOTHING;

-- 🇨🇳 MANDARIN CHINESE (HSK Track)
INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'HSK1', 'HSK Level 1 (Pemula)', 'beginner', 'HSK', 60, 1 FROM languages WHERE code = 'zh'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'HSK2', 'HSK Level 2 (Dasar)', 'beginner', 'HSK', 60, 2 FROM languages WHERE code = 'zh'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'HSK3', 'HSK Level 3 (Menengah Awal)', 'intermediate', 'HSK', 60, 3 FROM languages WHERE code = 'zh'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'HSK4', 'HSK Level 4 (Menengah Atas)', 'intermediate', 'HSK', 60, 4 FROM languages WHERE code = 'zh'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'HSK5', 'HSK Level 5 (Mahir)', 'advanced', 'HSK', 60, 5 FROM languages WHERE code = 'zh'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'HSK6', 'HSK Level 6 (Mastery)', 'advanced', 'HSK', 60, 6 FROM languages WHERE code = 'zh'
ON CONFLICT (language_id, code) DO NOTHING;

-- 🇫🇷 FRENCH (DELF / DALF Track)
INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'A1', 'DELF A1 (Découverte)', 'beginner', 'DELF', 60, 1 FROM languages WHERE code = 'fr'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'A2', 'DELF A2 (Survie)', 'beginner', 'DELF', 60, 2 FROM languages WHERE code = 'fr'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'B1', 'DELF B1 (Seuil)', 'intermediate', 'DELF', 60, 3 FROM languages WHERE code = 'fr'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'B2', 'DELF B2 (Avancé)', 'intermediate', 'DELF', 60, 4 FROM languages WHERE code = 'fr'
ON CONFLICT (language_id, code) DO NOTHING;

INSERT INTO proficiency_levels (language_id, code, name, tier, official_exam_name, passing_score_percent, order_index)
SELECT id, 'C1', 'DALF C1 (Autonome)', 'advanced', 'DALF', 60, 5 FROM languages WHERE code = 'fr'
ON CONFLICT (language_id, code) DO NOTHING;

