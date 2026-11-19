-- ============================================================================
-- Migration: 000016_create_flashcards.up.sql
-- Description: Create standalone + SRS-connected flashcard decks, cards, and
--              per-user SM-2 progress tracking, seeded with 6 JLPT N5 decks
--              (42 pure-vocab cards) ready for immediate study.
-- ============================================================================

CREATE TABLE IF NOT EXISTS flashcard_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_code VARCHAR(16) NOT NULL,
    title VARCHAR(160) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category VARCHAR(64) NOT NULL,
    icon_name VARCHAR(64) NOT NULL DEFAULT 'cards',
    accent_color VARCHAR(32) NOT NULL DEFAULT 'blue',
    jlpt_level VARCHAR(16) NOT NULL DEFAULT 'N5',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flashcard_decks_lang_order
    ON flashcard_decks (language_code, sort_order);

CREATE TABLE IF NOT EXISTS flashcard_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
    front_text TEXT NOT NULL,
    reading TEXT NOT NULL DEFAULT '',
    back_meaning TEXT NOT NULL,
    part_of_speech VARCHAR(48) NOT NULL DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flashcard_cards_deck_order
    ON flashcard_cards (deck_id, sort_order);

CREATE TABLE IF NOT EXISTS user_flashcard_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES flashcard_cards(id) ON DELETE CASCADE,
    ease_factor DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    interval_days INT NOT NULL DEFAULT 0,
    repetitions INT NOT NULL DEFAULT 0,
    next_review_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, card_id)
);

CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_due
    ON user_flashcard_progress (user_id, next_review_at);

-- ============================================================================
-- Seed 6 JLPT N5 Flashcard Decks (Japanese)
-- ============================================================================
INSERT INTO flashcard_decks (id, language_code, title, description, category, icon_name, accent_color, jlpt_level, sort_order)
VALUES
    ('f1000001-0000-0000-0000-000000000001'::uuid, 'ja', 'Salam & Sapaan Sehari-hari', 'Ungkapan sopan wajib saat menyapa, berterima kasih, dan meminta maaf.', 'greetings', 'hand-waving', 'emerald', 'N5', 1),
    ('f1000001-0000-0000-0000-000000000002'::uuid, 'ja', 'Angka, Hari & Waktu', 'Kosakata dasar untuk menyebut angka, hari, dan jam.', 'numbers', 'clock', 'blue', 'N5', 2),
    ('f1000001-0000-0000-0000-000000000003'::uuid, 'ja', 'Makanan & Minuman', 'Kosakata populer saat memesan makanan dan minuman di Jepang.', 'food', 'bowl-food', 'amber', 'N5', 3),
    ('f1000001-0000-0000-0000-000000000004'::uuid, 'ja', 'Kata Kerja Dasar', 'Kata kerja aktivitas harian bentuk sopan (-masu) yang paling sering dipakai.', 'verbs', 'person-simple-run', 'violet', 'N5', 4),
    ('f1000001-0000-0000-0000-000000000005'::uuid, 'ja', 'Tempat & Transportasi', 'Kosakata lokasi umum dan transportasi untuk navigasi sehari-hari.', 'places', 'train', 'cyan', 'N5', 5),
    ('f1000001-0000-0000-0000-000000000006'::uuid, 'ja', 'Kata Sifat Populer', 'Kata sifat untuk mendeskripsikan ukuran, rasa, harga, dan kondisi.', 'adjectives', 'sparkle', 'rose', 'N5', 6)
ON CONFLICT (id) DO NOTHING;

-- Deck 1: Salam & Sapaan Sehari-hari
INSERT INTO flashcard_cards (id, deck_id, front_text, reading, back_meaning, part_of_speech, sort_order)
VALUES
    ('f2000001-0000-0000-0000-000000000001'::uuid, 'f1000001-0000-0000-0000-000000000001'::uuid, 'おはようございます', 'ohayou gozaimasu', 'Selamat pagi', 'Salam', 1),
    ('f2000001-0000-0000-0000-000000000002'::uuid, 'f1000001-0000-0000-0000-000000000001'::uuid, 'こんにちは', 'konnichiwa', 'Selamat siang', 'Salam', 2),
    ('f2000001-0000-0000-0000-000000000003'::uuid, 'f1000001-0000-0000-0000-000000000001'::uuid, 'こんばんは', 'konbanwa', 'Selamat malam', 'Salam', 3),
    ('f2000001-0000-0000-0000-000000000004'::uuid, 'f1000001-0000-0000-0000-000000000001'::uuid, 'ありがとうございます', 'arigatou gozaimasu', 'Terima kasih banyak', 'Ungkapan', 4),
    ('f2000001-0000-0000-0000-000000000005'::uuid, 'f1000001-0000-0000-0000-000000000001'::uuid, 'すみません', 'sumimasen', 'Permisi', 'Ungkapan', 5),
    ('f2000001-0000-0000-0000-000000000006'::uuid, 'f1000001-0000-0000-0000-000000000001'::uuid, 'おやすみなさい', 'oyasuminasai', 'Selamat tidur', 'Salam', 6),
    ('f2000001-0000-0000-0000-000000000007'::uuid, 'f1000001-0000-0000-0000-000000000001'::uuid, 'はじめまして', 'hajimemashite', 'Salam kenal', 'Salam', 7),

-- Deck 2: Angka, Hari & Waktu
    ('f2000002-0000-0000-0000-000000000001'::uuid, 'f1000001-0000-0000-0000-000000000002'::uuid, '一（いち）', 'ichi', 'Satu (1)', 'Angka', 1),
    ('f2000002-0000-0000-0000-000000000002'::uuid, 'f1000001-0000-0000-0000-000000000002'::uuid, '二（に）', 'ni', 'Dua (2)', 'Angka', 2),
    ('f2000002-0000-0000-0000-000000000003'::uuid, 'f1000001-0000-0000-0000-000000000002'::uuid, '三（さん）', 'san', 'Tiga (3)', 'Angka', 3),
    ('f2000002-0000-0000-0000-000000000004'::uuid, 'f1000001-0000-0000-0000-000000000002'::uuid, '今日（きょう）', 'kyou', 'Hari ini', 'Waktu', 4),
    ('f2000002-0000-0000-0000-000000000005'::uuid, 'f1000001-0000-0000-0000-000000000002'::uuid, '明日（あした）', 'ashita', 'Besok', 'Waktu', 5),
    ('f2000002-0000-0000-0000-000000000006'::uuid, 'f1000001-0000-0000-0000-000000000002'::uuid, '今（いま）', 'ima', 'Sekarang', 'Waktu', 6),
    ('f2000002-0000-0000-0000-000000000007'::uuid, 'f1000001-0000-0000-0000-000000000002'::uuid, '何時（なんじ）', 'nanji', 'Jam berapa', 'Kata Tanya', 7),

-- Deck 3: Makanan & Minuman
    ('f2000003-0000-0000-0000-000000000001'::uuid, 'f1000001-0000-0000-0000-000000000003'::uuid, '水（みず）', 'mizu', 'Air minum', 'Kata Benda', 1),
    ('f2000003-0000-0000-0000-000000000002'::uuid, 'f1000001-0000-0000-0000-000000000003'::uuid, 'ご飯（ごはん）', 'gohan', 'Nasi', 'Kata Benda', 2),
    ('f2000003-0000-0000-0000-000000000003'::uuid, 'f1000001-0000-0000-0000-000000000003'::uuid, 'パン', 'pan', 'Roti', 'Kata Benda', 3),
    ('f2000003-0000-0000-0000-000000000004'::uuid, 'f1000001-0000-0000-0000-000000000003'::uuid, 'りんご', 'ringo', 'Apel', 'Kata Benda', 4),
    ('f2000003-0000-0000-0000-000000000005'::uuid, 'f1000001-0000-0000-0000-000000000003'::uuid, 'コーヒー', 'koohii', 'Kopi', 'Kata Benda', 5),
    ('f2000003-0000-0000-0000-000000000006'::uuid, 'f1000001-0000-0000-0000-000000000003'::uuid, 'お茶（おちゃ）', 'ocha', 'Teh hijau', 'Kata Benda', 6),
    ('f2000003-0000-0000-0000-000000000007'::uuid, 'f1000001-0000-0000-0000-000000000003'::uuid, '魚（さかな）', 'sakana', 'Ikan', 'Kata Benda', 7),

-- Deck 4: Kata Kerja Dasar
    ('f2000004-0000-0000-0000-000000000001'::uuid, 'f1000001-0000-0000-0000-000000000004'::uuid, '食べます（たべます）', 'tabemasu', 'Makan', 'Kata Kerja', 1),
    ('f2000004-0000-0000-0000-000000000002'::uuid, 'f1000001-0000-0000-0000-000000000004'::uuid, '飲みます（のみます）', 'nomimasu', 'Minum', 'Kata Kerja', 2),
    ('f2000004-0000-0000-0000-000000000003'::uuid, 'f1000001-0000-0000-0000-000000000004'::uuid, '行きます（いきます）', 'ikimasu', 'Pergi', 'Kata Kerja', 3),
    ('f2000004-0000-0000-0000-000000000004'::uuid, 'f1000001-0000-0000-0000-000000000004'::uuid, '来ます（きます）', 'kimasu', 'Datang', 'Kata Kerja', 4),
    ('f2000004-0000-0000-0000-000000000005'::uuid, 'f1000001-0000-0000-0000-000000000004'::uuid, '見ます（みます）', 'mimasu', 'Menonton', 'Kata Kerja', 5),
    ('f2000004-0000-0000-0000-000000000006'::uuid, 'f1000001-0000-0000-0000-000000000004'::uuid, '聞きます（ききます）', 'kikimasu', 'Mendengarkan', 'Kata Kerja', 6),
    ('f2000004-0000-0000-0000-000000000007'::uuid, 'f1000001-0000-0000-0000-000000000004'::uuid, '読みます（よみます）', 'yomimasu', 'Membaca', 'Kata Kerja', 7),

-- Deck 5: Tempat & Transportasi
    ('f2000005-0000-0000-0000-000000000001'::uuid, 'f1000001-0000-0000-0000-000000000005'::uuid, '駅（えき）', 'eki', 'Stasiun kereta', 'Tempat', 1),
    ('f2000005-0000-0000-0000-000000000002'::uuid, 'f1000001-0000-0000-0000-000000000005'::uuid, '学校（がっこう）', 'gakkou', 'Sekolah', 'Tempat', 2),
    ('f2000005-0000-0000-0000-000000000003'::uuid, 'f1000001-0000-0000-0000-000000000005'::uuid, '病院（びょういん）', 'byouin', 'Rumah sakit', 'Tempat', 3),
    ('f2000005-0000-0000-0000-000000000004'::uuid, 'f1000001-0000-0000-0000-000000000005'::uuid, '家（いえ）', 'ie', 'Rumah', 'Tempat', 4),
    ('f2000005-0000-0000-0000-000000000005'::uuid, 'f1000001-0000-0000-0000-000000000005'::uuid, '電車（でんしゃ）', 'densha', 'Kereta listrik', 'Transportasi', 5),
    ('f2000005-0000-0000-0000-000000000006'::uuid, 'f1000001-0000-0000-0000-000000000005'::uuid, 'バス', 'basu', 'Bus', 'Transportasi', 6),
    ('f2000005-0000-0000-0000-000000000007'::uuid, 'f1000001-0000-0000-0000-000000000005'::uuid, '店（みせ）', 'mise', 'Toko', 'Tempat', 7),

-- Deck 6: Kata Sifat Populer
    ('f2000006-0000-0000-0000-000000000001'::uuid, 'f1000001-0000-0000-0000-000000000006'::uuid, '大きい（おおきい）', 'ookii', 'Besar', 'Kata Sifat-i', 1),
    ('f2000006-0000-0000-0000-000000000002'::uuid, 'f1000001-0000-0000-0000-000000000006'::uuid, '小さい（ちいさい）', 'chiisai', 'Kecil', 'Kata Sifat-i', 2),
    ('f2000006-0000-0000-0000-000000000003'::uuid, 'f1000001-0000-0000-0000-000000000006'::uuid, '新しい（あたらしい）', 'atarashii', 'Baru', 'Kata Sifat-i', 3),
    ('f2000006-0000-0000-0000-000000000004'::uuid, 'f1000001-0000-0000-0000-000000000006'::uuid, '古い（ふるい）', 'furui', 'Kuno', 'Kata Sifat-i', 4),
    ('f2000006-0000-0000-0000-000000000005'::uuid, 'f1000001-0000-0000-0000-000000000006'::uuid, 'おいしい', 'oishii', 'Enak', 'Kata Sifat-i', 5),
    ('f2000006-0000-0000-0000-000000000006'::uuid, 'f1000001-0000-0000-0000-000000000006'::uuid, '高い（たかい）', 'takai', 'Mahal', 'Kata Sifat-i', 6),
    ('f2000006-0000-0000-0000-000000000007'::uuid, 'f1000001-0000-0000-0000-000000000006'::uuid, '安い（やすい）', 'yasui', 'Murah', 'Kata Sifat-i', 7)
ON CONFLICT (id) DO NOTHING;
