-- ============================================================================
-- Migration: 000025_expand_n5_character_and_vocab_flashcards.up.sql
-- Description:
--   1. Add explicit canonical slug column to flashcard_decks.
--   2. Seed 18 supplementary JLPT N5 Kanji characters into kana_characters
--      so all 59 N5 Kanji cards support 2-way /kana <-> /flashcards sync.
--   3. Add 14 Pure-Character Flashcard Decks (5 Hiragana, 4 Katakana, 5 Kanji)
--      + 6 New JLPT N5 Vocabulary Decks, ordered seamlessly for Unit 1-30.
-- ============================================================================

BEGIN;

-- 1. Canonical slug support on flashcard_decks
ALTER TABLE flashcard_decks
    ADD COLUMN IF NOT EXISTS slug VARCHAR(120);

-- Bump existing N4-N1 sort_order so N5 spans 1..26 cleanly
UPDATE flashcard_decks
SET sort_order = sort_order + 20
WHERE jlpt_level IN ('N4', 'N3', 'N2', 'N1')
  AND sort_order <= 30;

-- Align existing 6 N5 deck sort orders & canonical slugs
UPDATE flashcard_decks SET slug = 'salam-sapaan-sehari-hari', sort_order = 6  WHERE id = 'f1000001-0000-0000-0000-000000000001'::uuid;
UPDATE flashcard_decks SET slug = 'angka-hari-waktu',         sort_order = 12 WHERE id = 'f1000001-0000-0000-0000-000000000002'::uuid;
UPDATE flashcard_decks SET slug = 'makanan-minuman',          sort_order = 15 WHERE id = 'f1000001-0000-0000-0000-000000000003'::uuid;
UPDATE flashcard_decks SET slug = 'kata-kerja-dasar',         sort_order = 16 WHERE id = 'f1000001-0000-0000-0000-000000000004'::uuid;
UPDATE flashcard_decks SET slug = 'tempat-transportasi',      sort_order = 19 WHERE id = 'f1000001-0000-0000-0000-000000000005'::uuid;
UPDATE flashcard_decks SET slug = 'kata-sifat-populer',       sort_order = 23 WHERE id = 'f1000001-0000-0000-0000-000000000006'::uuid;

-- 2. Add supplementary JLPT N5 Kanji characters to kana_characters (rows 11-14)
INSERT INTO kana_characters (
    character, script, romaji, row_group, row_order, col_order,
    mnemonic, example_word, example_reading, example_meaning
)
VALUES
    ('百', 'kanji', 'hyaku • seratus',    'kanji_num_ext', 11, 1, 'Garis satu di atas putih (白) melambangkan seratus (100).', '三百', 'sanbyaku', 'tiga ratus'),
    ('千', 'kanji', 'sen • seribu',       'kanji_num_ext', 11, 2, 'Tanda silang sepuluh (十) dengan goresan miring di atas — seribu (1.000).', '千円', 'senen', 'seribu yen'),
    ('万', 'kanji', 'man • sepuluh ribu', 'kanji_num_ext', 11, 3, 'Gerbang besar melengkung untuk hitungan puluhan ribu (10.000).', '一万', 'ichiman', 'sepuluh ribu'),
    ('円', 'kanji', 'en • yen / bulat',   'kanji_num_ext', 11, 4, 'Bingkai kotak berisi jendela uang logam — mata uang Yen Jepang.', '百円', 'hyakuen', 'seratus yen'),
    ('時', 'kanji', 'ji / toki • waktu',  'kanji_num_ext', 11, 5, 'Matahari (日) di sebelah kuil (寺) penanda jam & waktu.', '三時', 'sanji', 'pukul tiga'),

    ('分', 'kanji', 'fun / wa • menit',   'kanji_time_ext', 12, 1, 'Pisau (刀) membagi delapan (八) bagian — menit / membagi.', '五分', 'gofun', 'lima menit'),
    ('父', 'kanji', 'chichi • ayah',      'kanji_time_ext', 12, 2, 'Tangan ayah menyilang membawa dua perkakas keluarga.', 'お父さん', 'otousan', 'ayah'),
    ('友', 'kanji', 'tomo • teman',       'kanji_time_ext', 12, 3, 'Dua tangan saling berjabatan erat — teman sejati.', '友だち', 'tomodachi', 'teman'),
    ('名', 'kanji', 'na / mei • nama',    'kanji_time_ext', 12, 4, 'Sore hari (夕) memanggil lewat mulut (口) — menyebut nama.', '名前', 'namae', 'nama'),
    ('前', 'kanji', 'mae • depan',        'kanji_time_ext', 12, 5, 'Pisau berjalan ke arah bulan di depan — depan / sebelum.', '名前', 'namae', 'nama / sebelumnya'),

    ('後', 'kanji', 'ushiro / ato • belakang', 'kanji_dir_ext', 13, 1, 'Benang tertinggal di jejak langkah — belakang / setelah.', '後ろ', 'ushiro', 'belakang'),
    ('右', 'kanji', 'migi • kanan',            'kanji_dir_ext', 13, 2, 'Tangan memegang mangkuk mulut (口) ke arah kanan — kanan.', '右', 'migi', 'kanan'),
    ('左', 'kanji', 'hidari • kiri',           'kanji_dir_ext', 13, 3, 'Tangan menggenggam penggaris tukang (工) di tangan kiri.', '左', 'hidari', 'kiri'),
    ('校', 'kanji', 'kou • sekolah',           'kanji_dir_ext', 13, 4, 'Bangunan kayu (木) tempat anak bersilangan belajar (交) — sekolah.', '学校', 'gakkou', 'sekolah'),

    ('高', 'kanji', 'takai • tinggi / mahal',  'kanji_adj_ext', 14, 1, 'Menara atap bertingkat tinggi yang menjulang — tinggi / mahal.', '高い', 'takai', 'mahal / tinggi'),
    ('安', 'kanji', 'yasui • murah / aman',    'kanji_adj_ext', 14, 2, 'Sosok perempuan (女) tenang di bawah atap rumah (宀) — aman / murah.', '安い', 'yasui', 'murah'),
    ('新', 'kanji', 'atarashii • baru',        'kanji_adj_ext', 14, 3, 'Kapak memotong kayu segar berdiri tegak — baru.', '新しい', 'atarashii', 'baru'),
    ('古', 'kanji', 'furui • kuno / lama',     'kanji_adj_ext', 14, 4, 'Cerita yang diwariskan sepuluh (十) generasi lewat mulut (口) — lama/kuno.', '古い', 'furui', 'lama / kuno')
ON CONFLICT (character) DO UPDATE SET
    script          = EXCLUDED.script,
    romaji          = EXCLUDED.romaji,
    row_group       = EXCLUDED.row_group,
    row_order       = EXCLUDED.row_order,
    col_order       = EXCLUDED.col_order,
    mnemonic        = EXCLUDED.mnemonic,
    example_word    = EXCLUDED.example_word,
    example_reading = EXCLUDED.example_reading,
    example_meaning = EXCLUDED.example_meaning;

-- 3. Seed 14 Pure-Character Decks + 6 New N5 Vocabulary Decks
INSERT INTO flashcard_decks (id, slug, language_code, title, description, category, icon_name, accent_color, jlpt_level, sort_order)
VALUES
    -- 5 Hiragana Character Decks
    ('f1000025-0000-0000-0000-000000000001'::uuid, 'hiragana-vokal-dan-k',      'ja', 'Hiragana 1: Vokal & Baris K',        '10 huruf Hiragana pertama (あ–お dan か–こ) lengkap suara, mnemonik & contoh kata.', 'hiragana', 'translate', 'emerald', 'N5', 1),
    ('f1000025-0000-0000-0000-000000000002'::uuid, 'hiragana-s-t-n',            'ja', 'Hiragana 2: Baris S, T & N',         '15 huruf Hiragana konsonan tengah (さ–の) termasuk sorotan bunyi し, ち, つ.', 'hiragana', 'translate', 'emerald', 'N5', 2),
    ('f1000025-0000-0000-0000-000000000003'::uuid, 'hiragana-h-m-y',            'ja', 'Hiragana 3: Baris H, M & Y',         '13 huruf Hiragana baris は–よ termasuk bunyi ふ dan pembeda は (ha/wa).', 'hiragana', 'translate', 'emerald', 'N5', 3),
    ('f1000025-0000-0000-0000-000000000004'::uuid, 'hiragana-r-w-n',            'ja', 'Hiragana 4: Baris R, W & Sengau',    '8 huruf penutup 46 Gojūon Hiragana (ら–ろ, わ, を, dan sengau ん).', 'hiragana', 'translate', 'emerald', 'N5', 4),
    ('f1000025-0000-0000-0000-000000000005'::uuid, 'hiragana-dakuten-yoon',     'ja', 'Hiragana 5: Tenten, Maru & Yōon',    '15 kartu variasi bunyi: Tenten (が/ざ/だ/ば), Maru (ぱ), Tsu kecil (っ), & Yōon (きゃ/しゃ/ちゃ).', 'hiragana', 'translate', 'emerald', 'N5', 5),

    -- 4 Katakana Character Decks
    ('f1000025-0000-0000-0000-000000000006'::uuid, 'katakana-a-to',             'ja', 'Katakana 1: Vokal & Baris K–T',      '20 huruf Katakana pertama (ア–ト) untuk membaca nama negara & kata serapan dasar.', 'katakana', 'translate', 'cyan', 'N5', 10),
    ('f1000025-0000-0000-0000-000000000007'::uuid, 'katakana-na-ho',            'ja', 'Katakana 2: Baris N & H',            '10 huruf Katakana tengah (ナ–ホ) untuk membaca menu kafe, hotel & restoran.', 'katakana', 'translate', 'cyan', 'N5', 14),
    ('f1000025-0000-0000-0000-000000000008'::uuid, 'katakana-ma-ro',            'ja', 'Katakana 3: Baris M, Y & R',         '13 huruf Katakana (マ–ロ) untuk membaca fasilitas kota, bus, supermarket & mal.', 'katakana', 'translate', 'cyan', 'N5', 18),
    ('f1000025-0000-0000-0000-000000000009'::uuid, 'katakana-wa-n-special',     'ja', 'Katakana 4: ワ–ン & Pasangan Mirip', 'Penutup 46 Katakana (ワ・ヲ・ン), tanda panjang ー, bunyi modern, & kontras シ/ツ vs ソ/ン.', 'katakana', 'translate', 'cyan', 'N5', 22),

    -- 5 Kanji N5 Character Decks
    ('f1000025-0000-0000-0000-000000000010'::uuid, 'kanji-n5-angka-hitung',     'ja', 'Kanji N5 1: Angka & Hitungan',       '14 Kanji angka & mata uang (一 s/d 十, 百, 千, 万, 円) lengkap cara baca Onyomi & Kunyomi.', 'kanji', 'sparkle', 'amber', 'N5', 11),
    ('f1000025-0000-0000-0000-000000000011'::uuid, 'kanji-n5-waktu-alam',       'ja', 'Kanji N5 2: Hari, Waktu & Alam',     '12 Kanji hari, jam, menit & elemen alam (日・月・火・水・木・金・土・年・時・分・山・川).', 'kanji', 'sparkle', 'amber', 'N5', 13),
    ('f1000025-0000-0000-0000-000000000012'::uuid, 'kanji-n5-manusia-keluarga', 'ja', 'Kanji N5 3: Manusia & Keluarga',     '8 Kanji identitas, manusia, & anggota keluarga (人・男・女・子・父・母・友・名).', 'kanji', 'sparkle', 'amber', 'N5', 9),
    ('f1000025-0000-0000-0000-000000000013'::uuid, 'kanji-n5-tempat-arah',      'ja', 'Kanji N5 4: Arah, Tempat & Kota',    '11 Kanji posisi spasial & bangunan umum (上・下・中・外・前・後・右・左・校・店・駅).', 'kanji', 'sparkle', 'amber', 'N5', 21),
    ('f1000025-0000-0000-0000-000000000014'::uuid, 'kanji-n5-aksi-sifat',       'ja', 'Kanji N5 5: Aksi & Sifat',           '14 Kanji verba aktivitas & kata sifat populer (食・飲・見・聞・読・書・行・来・大・小・高・安・新・古).', 'kanji', 'sparkle', 'amber', 'N5', 17),

    -- 6 New N5 Vocabulary Decks
    ('f1000025-0000-0000-0000-000000000015'::uuid, 'benda-rumah-kelas',         'ja', 'Benda Sekitar, Rumah & Kelas',       'Kosakata benda sehari-hari di tas, kamar, meja kerja, dan ruang kelas.', 'objects', 'cards', 'blue', 'N5', 7),
    ('f1000025-0000-0000-0000-000000000016'::uuid, 'keluarga-orang-profesi',    'ja', 'Keluarga, Orang & Profesi',          'Panggilan anggota keluarga sendiri vs orang lain, profesi, & relasi sosial.', 'family', 'hand-waving', 'rose', 'N5', 8),
    ('f1000025-0000-0000-0000-000000000017'::uuid, 'arah-posisi-lokasi',        'ja', 'Posisi, Arah & Ruangan',             'Kosakata letak spasial (atas, bawah, dalam, samping, antara) & navigasi jalan.', 'directions', 'train', 'cyan', 'N5', 20),
    ('f1000025-0000-0000-0000-000000000018'::uuid, 'belanja-warna-pakaian',     'ja', 'Belanja, Warna & Pakaian',           'Kosakata warna dasar, item pakaian, harga, dan verba khusus memakai pakaian.', 'shopping', 'sparkle', 'rose', 'N5', 24),
    ('f1000025-0000-0000-0000-000000000019'::uuid, 'hobi-cuaca-musim',          'ja', 'Hobi, Cuaca & Musim',                'Kosakata hobi, aktivitas akhir pekan, prakiraan cuaca, & 4 musim di Jepang.', 'weather', 'sparkle', 'amber', 'N5', 25),
    ('f1000025-0000-0000-0000-000000000020'::uuid, 'tubuh-kesehatan-darurat',   'ja', 'Tubuh, Kesehatan & Situasi Darurat', 'Kosakata bagian tubuh, gejala sakit, rumah sakit, dan ungkapan saat darurat.', 'health', 'person-simple-run', 'violet', 'N5', 26)
ON CONFLICT (id) DO UPDATE SET
    slug        = EXCLUDED.slug,
    title       = EXCLUDED.title,
    description = EXCLUDED.description,
    category    = EXCLUDED.category,
    icon_name   = EXCLUDED.icon_name,
    accent_color= EXCLUDED.accent_color,
    jlpt_level  = EXCLUDED.jlpt_level,
    sort_order  = EXCLUDED.sort_order;

-- Backfill slug for N4-N1 rows and enforce NOT NULL + UNIQUE index
UPDATE flashcard_decks
SET slug = TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))) || '-' || LEFT(id::text, 4)
WHERE slug IS NULL OR slug = '';

ALTER TABLE flashcard_decks ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_flashcard_decks_slug ON flashcard_decks (slug);

-- ============================================================================
-- 4. Seed Cards for all 20 New Decks
-- ============================================================================

-- 4.1 Hiragana 1: Vokal & Baris K (10 cards)
INSERT INTO flashcard_cards (id, deck_id, front_text, reading, back_meaning, part_of_speech, sort_order)
VALUES
    ('f3002501-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000001'::uuid, 'あ', 'a • cth: あさ (pagi)', 'Bunyi vokal "a"', 'Huruf Hiragana', 1),
    ('f3002501-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000001'::uuid, 'い', 'i • cth: いえ (rumah)', 'Bunyi vokal "i"', 'Huruf Hiragana', 2),
    ('f3002501-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000001'::uuid, 'う', 'u • cth: うえ (atas)', 'Bunyi vokal "u"', 'Huruf Hiragana', 3),
    ('f3002501-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000001'::uuid, 'え', 'e • cth: えき (stasiun)', 'Bunyi vokal "e"', 'Huruf Hiragana', 4),
    ('f3002501-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000001'::uuid, 'お', 'o • cth: あおい (biru)', 'Bunyi vokal "o"', 'Huruf Hiragana', 5),
    ('f3002501-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000001'::uuid, 'か', 'ka • cth: かさ (payung)', 'Suku kata "ka"', 'Huruf Hiragana', 6),
    ('f3002501-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000001'::uuid, 'き', 'ki • cth: あき (musim gugur)', 'Suku kata "ki"', 'Huruf Hiragana', 7),
    ('f3002501-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000001'::uuid, 'く', 'ku • cth: くつ (sepatu)', 'Suku kata "ku"', 'Huruf Hiragana', 8),
    ('f3002501-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000001'::uuid, 'け', 'ke • cth: いけ (kolam)', 'Suku kata "ke"', 'Huruf Hiragana', 9),
    ('f3002501-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000001'::uuid, 'こ', 'ko • cth: ここ (di sini)', 'Suku kata "ko"', 'Huruf Hiragana', 10),

-- 4.2 Hiragana 2: Baris S, T & N (15 cards)
    ('f3002502-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'さ', 'sa • cth: あさ (pagi)', 'Suku kata "sa"', 'Huruf Hiragana', 1),
    ('f3002502-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'し', 'shi • cth: すし (sushi)', 'Pengecualian "shi"', 'Huruf Hiragana', 2),
    ('f3002502-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'す', 'su • cth: いす (kursi)', 'Suku kata "su"', 'Huruf Hiragana', 3),
    ('f3002502-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'せ', 'se • cth: せんせい (guru)', 'Suku kata "se"', 'Huruf Hiragana', 4),
    ('f3002502-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'そ', 'so • cth: それ (itu)', 'Suku kata "so"', 'Huruf Hiragana', 5),
    ('f3002502-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'た', 'ta • cth: あした (besok)', 'Suku kata "ta"', 'Huruf Hiragana', 6),
    ('f3002502-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'ち', 'chi • cth: ちち (ayah)', 'Pengecualian "chi"', 'Huruf Hiragana', 7),
    ('f3002502-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'つ', 'tsu • cth: つくえ (meja)', 'Pengecualian "tsu"', 'Huruf Hiragana', 8),
    ('f3002502-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'て', 'te • cth: てがみ (surat)', 'Suku kata "te"', 'Huruf Hiragana', 9),
    ('f3002502-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'と', 'to • cth: ありがとう (trm kasih)', 'Suku kata "to"', 'Huruf Hiragana', 10),
    ('f3002502-0000-0000-0000-000000000011'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'な', 'na • cth: さかな (ikan)', 'Suku kata "na"', 'Huruf Hiragana', 11),
    ('f3002502-0000-0000-0000-000000000012'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'に', 'ni • cth: なに (apa)', 'Suku kata "ni"', 'Huruf Hiragana', 12),
    ('f3002502-0000-0000-0000-000000000013'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'ぬ', 'nu • cth: いぬ (anjing)', 'Suku kata "nu"', 'Huruf Hiragana', 13),
    ('f3002502-0000-0000-0000-000000000014'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'ね', 'ne • cth: ねこ (kucing)', 'Suku kata "ne"', 'Huruf Hiragana', 14),
    ('f3002502-0000-0000-0000-000000000015'::uuid, 'f1000025-0000-0000-0000-000000000002'::uuid, 'の', 'no • cth: わたしの (milik saya)', 'Suku kata "no"', 'Huruf Hiragana', 15),

-- 4.3 Hiragana 3: Baris H, M & Y (13 cards)
    ('f3002503-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000003'::uuid, 'は', 'ha / partikel wa • cth: はな', 'Suku kata "ha" (partikel: "wa")', 'Huruf Hiragana', 1),
    ('f3002503-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000003'::uuid, 'ひ', 'hi • cth: ひと (orang)', 'Suku kata "hi"', 'Huruf Hiragana', 2),
    ('f3002503-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000003'::uuid, 'ふ', 'fu • cth: ふゆ (musim dingin)', 'Pengecualian "fu"', 'Huruf Hiragana', 3),
    ('f3002503-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000003'::uuid, 'へ', 'he / partikel e • cth: へや', 'Suku kata "he" (arah: "e")', 'Huruf Hiragana', 4),
    ('f3002503-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000003'::uuid, 'ほ', 'ho • cth: ほん (buku)', 'Suku kata "ho"', 'Huruf Hiragana', 5),
    ('f3002503-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000003'::uuid, 'ま', 'ma • cth: まち (kota)', 'Suku kata "ma"', 'Huruf Hiragana', 6),
    ('f3002503-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000003'::uuid, 'み', 'mi • cth: みみ (telinga)', 'Suku kata "mi"', 'Huruf Hiragana', 7),
    ('f3002503-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000003'::uuid, 'む', 'mu • cth: むずかしい (sulit)', 'Suku kata "mu"', 'Huruf Hiragana', 8),
    ('f3002503-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000003'::uuid, 'め', 'me • cth: めがね (kacamata)', 'Suku kata "me"', 'Huruf Hiragana', 9),
    ('f3002503-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000003'::uuid, 'も', 'mo • cth: わたしも (saya juga)', 'Suku kata "mo"', 'Huruf Hiragana', 10),
    ('f3002503-0000-0000-0000-000000000011'::uuid, 'f1000025-0000-0000-0000-000000000003'::uuid, 'や', 'ya • cth: やま (gunung)', 'Suku kata "ya"', 'Huruf Hiragana', 11),
    ('f3002503-0000-0000-0000-000000000012'::uuid, 'f1000025-0000-0000-0000-000000000003'::uuid, 'ゆ', 'yu • cth: ゆき (salju)', 'Suku kata "yu"', 'Huruf Hiragana', 12),
    ('f3002503-0000-0000-0000-000000000013'::uuid, 'f1000025-0000-0000-0000-000000000003'::uuid, 'よ', 'yo • cth: おはよう (pagi)', 'Suku kata "yo"', 'Huruf Hiragana', 13),

-- 4.4 Hiragana 4: Baris R, W & Sengau (8 cards)
    ('f3002504-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000004'::uuid, 'ら', 'ra • cth: そら (langit)', 'Suku kata "ra"', 'Huruf Hiragana', 1),
    ('f3002504-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000004'::uuid, 'り', 'ri • cth: ひとり (satu org)', 'Suku kata "ri"', 'Huruf Hiragana', 2),
    ('f3002504-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000004'::uuid, 'る', 'ru • cth: よる (malam)', 'Suku kata "ru"', 'Huruf Hiragana', 3),
    ('f3002504-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000004'::uuid, 'れ', 're • cth: あれ (itu jauh)', 'Suku kata "re"', 'Huruf Hiragana', 4),
    ('f3002504-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000004'::uuid, 'ろ', 'ro • cth: しろ (putih)', 'Suku kata "ro"', 'Huruf Hiragana', 5),
    ('f3002504-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000004'::uuid, 'わ', 'wa • cth: わたし (saya)', 'Suku kata "wa"', 'Huruf Hiragana', 6),
    ('f3002504-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000004'::uuid, 'を', 'o (wo) • partikel objek', 'Partikel objek "o"', 'Huruf Hiragana', 7),
    ('f3002504-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000004'::uuid, 'ん', 'n • cth: にほん (Jepang)', 'Konsonan sengau "n"', 'Huruf Hiragana', 8),

-- 4.5 Hiragana 5: Tenten, Maru & Yōon (15 cards)
    ('f3002505-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'が', 'ga (か + tenten ゛) • がくせい', 'Bunyi "ga"', 'Huruf Hiragana', 1),
    ('f3002505-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'ぎ', 'gi (き + tenten ゛) • かぎ', 'Bunyi "gi"', 'Huruf Hiragana', 2),
    ('f3002505-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'ぐ', 'gu (く + tenten ゛) • すぐ', 'Bunyi "gu"', 'Huruf Hiragana', 3),
    ('f3002505-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'げ', 'ge (け + tenten ゛) • げんき', 'Bunyi "ge"', 'Huruf Hiragana', 4),
    ('f3002505-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'ご', 'go (こ + tenten ゛) • ごはん', 'Bunyi "go"', 'Huruf Hiragana', 5),
    ('f3002505-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'ざ', 'za (さ + tenten ゛) • ざっし', 'Bunyi "za"', 'Huruf Hiragana', 6),
    ('f3002505-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'じ', 'ji (し + tenten ゛) • じかん', 'Bunyi "ji"', 'Huruf Hiragana', 7),
    ('f3002505-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'だ', 'da (た + tenten ゛) • だれ', 'Bunyi "da"', 'Huruf Hiragana', 8),
    ('f3002505-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'ば', 'ba (は + tenten ゛) • かばん', 'Bunyi "ba"', 'Huruf Hiragana', 9),
    ('f3002505-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'ぱ', 'pa (は + maru ゜) • いっぱい', 'Bunyi "pa"', 'Huruf Hiragana', 10),
    ('f3002505-0000-0000-0000-000000000011'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'っ', 'Tsu kecil • がっこう / きって', 'Jeda konsonan ganda', 'Huruf Hiragana', 11),
    ('f3002505-0000-0000-0000-000000000012'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'きゃ', 'kya (き + や kecil) • きゃく', 'Bunyi gabungan "kya"', 'Huruf Hiragana', 12),
    ('f3002505-0000-0000-0000-000000000013'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'しゃ', 'sha (し + や kecil) • かいしゃ', 'Bunyi gabungan "sha"', 'Huruf Hiragana', 13),
    ('f3002505-0000-0000-0000-000000000014'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'ちゃ', 'cha (ち + や kecil) • おちゃ', 'Bunyi gabungan "cha"', 'Huruf Hiragana', 14),
    ('f3002505-0000-0000-0000-000000000015'::uuid, 'f1000025-0000-0000-0000-000000000005'::uuid, 'りょ', 'ryo (り + よ kecil) • りょこう', 'Bunyi gabungan "ryo"', 'Huruf Hiragana', 15),

-- 4.6 Katakana 1: Vokal & Baris K–T (20 cards)
    ('f3002506-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'ア', 'a • cth: アイス (es krim)', 'Katakana vokal "a"', 'Huruf Katakana', 1),
    ('f3002506-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'イ', 'i • cth: インドネシア', 'Katakana vokal "i"', 'Huruf Katakana', 2),
    ('f3002506-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'ウ', 'u • cth: ウール (wol)', 'Katakana vokal "u"', 'Huruf Katakana', 3),
    ('f3002506-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'エ', 'e • cth: エレベーター', 'Katakana vokal "e"', 'Huruf Katakana', 4),
    ('f3002506-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'オ', 'o • cth: オレンジ (jeruk)', 'Katakana vokal "o"', 'Huruf Katakana', 5),
    ('f3002506-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'カ', 'ka • cth: カメラ (kamera)', 'Katakana "ka"', 'Huruf Katakana', 6),
    ('f3002506-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'キ', 'ki • cth: キッチン (dapur)', 'Katakana "ki"', 'Huruf Katakana', 7),
    ('f3002506-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'ク', 'ku • cth: クラス (kelas)', 'Katakana "ku"', 'Huruf Katakana', 8),
    ('f3002506-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'ケ', 'ke • cth: ケーキ (kue)', 'Katakana "ke"', 'Huruf Katakana', 9),
    ('f3002506-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'コ', 'ko • cth: コーヒー (kopi)', 'Katakana "ko"', 'Huruf Katakana', 10),
    ('f3002506-0000-0000-0000-000000000011'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'サ', 'sa • cth: サッカー (bola)', 'Katakana "sa"', 'Huruf Katakana', 11),
    ('f3002506-0000-0000-0000-000000000012'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'シ', 'shi • senyum ke atas', 'Katakana "shi"', 'Huruf Katakana', 12),
    ('f3002506-0000-0000-0000-000000000013'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'ス', 'su • cth: スーパー', 'Katakana "su"', 'Huruf Katakana', 13),
    ('f3002506-0000-0000-0000-000000000014'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'セ', 'se • cth: セーター (sweter)', 'Katakana "se"', 'Huruf Katakana', 14),
    ('f3002506-0000-0000-0000-000000000015'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'ソ', 'so • garis menukik dari atas', 'Katakana "so"', 'Huruf Katakana', 15),
    ('f3002506-0000-0000-0000-000000000016'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'タ', 'ta • cth: タクシー (taksi)', 'Katakana "ta"', 'Huruf Katakana', 16),
    ('f3002506-0000-0000-0000-000000000017'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'チ', 'chi • cth: チーズ (keju)', 'Katakana "chi"', 'Huruf Katakana', 17),
    ('f3002506-0000-0000-0000-000000000018'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'ツ', 'tsu • dua titik turun dr atas', 'Katakana "tsu"', 'Huruf Katakana', 18),
    ('f3002506-0000-0000-0000-000000000019'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'テ', 'te • cth: テスト (ujian)', 'Katakana "te"', 'Huruf Katakana', 19),
    ('f3002506-0000-0000-0000-000000000020'::uuid, 'f1000025-0000-0000-0000-000000000006'::uuid, 'ト', 'to • cth: トイレ (toilet)', 'Katakana "to"', 'Huruf Katakana', 20),

-- 4.7 Katakana 2: Baris N & H (10 cards)
    ('f3002507-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000007'::uuid, 'ナ', 'na • cth: ナイフ (pisau)', 'Katakana "na"', 'Huruf Katakana', 1),
    ('f3002507-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000007'::uuid, 'ニ', 'ni • cth: ニュース (berita)', 'Katakana "ni"', 'Huruf Katakana', 2),
    ('f3002507-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000007'::uuid, 'ヌ', 'nu • cth: カヌー (kano)', 'Katakana "nu"', 'Huruf Katakana', 3),
    ('f3002507-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000007'::uuid, 'ネ', 'ne • cth: ネクタイ (dasi)', 'Katakana "ne"', 'Huruf Katakana', 4),
    ('f3002507-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000007'::uuid, 'ノ', 'no • cth: ノート (buku catat)', 'Katakana "no"', 'Huruf Katakana', 5),
    ('f3002507-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000007'::uuid, 'ハ', 'ha • cth: ハンバーガー', 'Katakana "ha"', 'Huruf Katakana', 6),
    ('f3002507-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000007'::uuid, 'ヒ', 'hi • cth: コーヒー (kopi)', 'Katakana "hi"', 'Huruf Katakana', 7),
    ('f3002507-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000007'::uuid, 'フ', 'fu • cth: フォーク (garpu)', 'Katakana "fu"', 'Huruf Katakana', 8),
    ('f3002507-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000007'::uuid, 'ヘ', 'he • sama dgn hiragana へ', 'Katakana "he"', 'Huruf Katakana', 9),
    ('f3002507-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000007'::uuid, 'ホ', 'ho • cth: ホテル (hotel)', 'Katakana "ho"', 'Huruf Katakana', 10),

-- 4.8 Katakana 3: Baris M, Y & R (13 cards)
    ('f3002508-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000008'::uuid, 'マ', 'ma • cth: マンション', 'Katakana "ma"', 'Huruf Katakana', 1),
    ('f3002508-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000008'::uuid, 'ミ', 'mi • cth: ミルク (susu)', 'Katakana "mi"', 'Huruf Katakana', 2),
    ('f3002508-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000008'::uuid, 'ム', 'mu • cth: ゲーム (gim)', 'Katakana "mu"', 'Huruf Katakana', 3),
    ('f3002508-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000008'::uuid, 'メ', 'me • cth: メニュー (menu)', 'Katakana "me"', 'Huruf Katakana', 4),
    ('f3002508-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000008'::uuid, 'モ', 'mo • cth: モニター', 'Katakana "mo"', 'Huruf Katakana', 5),
    ('f3002508-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000008'::uuid, 'ヤ', 'ya • cth: タイヤ (ban)', 'Katakana "ya"', 'Huruf Katakana', 6),
    ('f3002508-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000008'::uuid, 'ユ', 'yu • cth: ニュース (berita)', 'Katakana "yu"', 'Huruf Katakana', 7),
    ('f3002508-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000008'::uuid, 'ヨ', 'yo • cth: ヨーグルト', 'Katakana "yo"', 'Huruf Katakana', 8),
    ('f3002508-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000008'::uuid, 'ラ', 'ra • cth: ラーメン (ramen)', 'Katakana "ra"', 'Huruf Katakana', 9),
    ('f3002508-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000008'::uuid, 'リ', 'ri • cth: リスト (daftar)', 'Katakana "ri"', 'Huruf Katakana', 10),
    ('f3002508-0000-0000-0000-000000000011'::uuid, 'f1000025-0000-0000-0000-000000000008'::uuid, 'ル', 'ru • cth: ホテル (hotel)', 'Katakana "ru"', 'Huruf Katakana', 11),
    ('f3002508-0000-0000-0000-000000000012'::uuid, 'f1000025-0000-0000-0000-000000000008'::uuid, 'レ', 're • cth: レストラン', 'Katakana "re"', 'Huruf Katakana', 12),
    ('f3002508-0000-0000-0000-000000000013'::uuid, 'f1000025-0000-0000-0000-000000000008'::uuid, 'ロ', 'ro • cth: ロボット (robot)', 'Katakana "ro"', 'Huruf Katakana', 13),

-- 4.9 Katakana 4: ワ–ン & Pasangan Mirip (10 cards)
    ('f3002509-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000009'::uuid, 'ワ', 'wa • cth: ワイン (anggur)', 'Katakana "wa"', 'Huruf Katakana', 1),
    ('f3002509-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000009'::uuid, 'ヲ', 'wo / o • versi katakana を', 'Katakana partikel "o"', 'Huruf Katakana', 2),
    ('f3002509-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000009'::uuid, 'ン', 'n • cth: パン (roti)', 'Katakana sengau "n"', 'Huruf Katakana', 3),
    ('f3002509-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000009'::uuid, 'ー', 'Chōonpu • cth: コーヒー', 'Tanda vokal panjang', 'Huruf Katakana', 4),
    ('f3002509-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000009'::uuid, 'シ', 'shi • titik naik dr bawah (vs ツ)', 'Jangan tertukar ツ!', 'Huruf Katakana', 5),
    ('f3002509-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000009'::uuid, 'ツ', 'tsu • titik turun dr atas (vs シ)', 'Jangan tertukar シ!', 'Huruf Katakana', 6),
    ('f3002509-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000009'::uuid, 'ソ', 'so • 1 titik turun tegak (vs ン)', 'Jangan tertukar ン!', 'Huruf Katakana', 7),
    ('f3002509-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000009'::uuid, 'ファ', 'fa • cth: ファイル (file)', 'Bunyi modern "fa"', 'Huruf Katakana', 8),
    ('f3002509-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000009'::uuid, 'ティ', 'ti • cth: パーティー (pesta)', 'Bunyi modern "ti"', 'Huruf Katakana', 9),
    ('f3002509-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000009'::uuid, 'ウィ', 'wi • cth: ウィルス / スマホ', 'Bunyi modern "wi"', 'Huruf Katakana', 10),

-- 4.10 Kanji N5 1: Angka & Hitungan (14 cards)
    ('f3002510-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '一', 'いち / ひと(つ)', 'Satu (1)', 'Huruf Kanji', 1),
    ('f3002510-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '二', 'に / ふた(つ)', 'Dua (2)', 'Huruf Kanji', 2),
    ('f3002510-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '三', 'さん / みっ(つ)', 'Tiga (3)', 'Huruf Kanji', 3),
    ('f3002510-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '四', 'よん・し / よっ(つ)', 'Empat (4)', 'Huruf Kanji', 4),
    ('f3002510-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '五', 'ご / いつ(つ)', 'Lima (5)', 'Huruf Kanji', 5),
    ('f3002510-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '六', 'ろく / むっ(つ)', 'Enam (6)', 'Huruf Kanji', 6),
    ('f3002510-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '七', 'なな・しち / なな(つ)', 'Tujuh (7)', 'Huruf Kanji', 7),
    ('f3002510-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '八', 'はち / やっ(つ)', 'Delapan (8)', 'Huruf Kanji', 8),
    ('f3002510-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '九', 'きゅう・く / ここの(つ)', 'Sembilan (9)', 'Huruf Kanji', 9),
    ('f3002510-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '十', 'じゅう / とお', 'Sepuluh (10)', 'Huruf Kanji', 10),
    ('f3002510-0000-0000-0000-000000000011'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '百', 'ひゃく (さんびゃく)', 'Seratus (100)', 'Huruf Kanji', 11),
    ('f3002510-0000-0000-0000-000000000012'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '千', 'せん (さんぜん)', 'Seribu (1.000)', 'Huruf Kanji', 12),
    ('f3002510-0000-0000-0000-000000000013'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '万', 'まん / いちまん', 'Sepuluh ribu (10.000)', 'Huruf Kanji', 13),
    ('f3002510-0000-0000-0000-000000000014'::uuid, 'f1000025-0000-0000-0000-000000000010'::uuid, '円', 'えん • cth: ひゃくえん', 'Yen / Lingkaran', 'Huruf Kanji', 14),

-- 4.11 Kanji N5 2: Hari, Waktu & Alam (12 cards)
    ('f3002511-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000011'::uuid, '日', 'にち・ひ / 日曜日', 'Hari / Matahari', 'Huruf Kanji', 1),
    ('f3002511-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000011'::uuid, '月', 'がつ・げつ・つき', 'Bulan / Senin', 'Huruf Kanji', 2),
    ('f3002511-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000011'::uuid, '火', 'か・ひ / 火曜日', 'Api / Selasa', 'Huruf Kanji', 3),
    ('f3002511-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000011'::uuid, '水', 'すい・みず / 水曜日', 'Air / Rabu', 'Huruf Kanji', 4),
    ('f3002511-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000011'::uuid, '木', 'もく・き / 木曜日', 'Pohon / Kamis', 'Huruf Kanji', 5),
    ('f3002511-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000011'::uuid, '金', 'きん・かね / 金曜日', 'Emas / Uang / Jumat', 'Huruf Kanji', 6),
    ('f3002511-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000011'::uuid, '土', 'ど・つち / 土曜日', 'Tanah / Sabtu', 'Huruf Kanji', 7),
    ('f3002511-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000011'::uuid, '年', 'ねん・とし / 今年', 'Tahun', 'Huruf Kanji', 8),
    ('f3002511-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000011'::uuid, '時', 'じ・とき / 何時', 'Jam / Waktu', 'Huruf Kanji', 9),
    ('f3002511-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000011'::uuid, '分', 'ふん・ぷん・わかる', 'Menit / Mengerti', 'Huruf Kanji', 10),
    ('f3002511-0000-0000-0000-000000000011'::uuid, 'f1000025-0000-0000-0000-000000000011'::uuid, '山', 'やま・さん / 富士山', 'Gunung', 'Huruf Kanji', 11),
    ('f3002511-0000-0000-0000-000000000012'::uuid, 'f1000025-0000-0000-0000-000000000011'::uuid, '川', 'かわ・せん', 'Sungai', 'Huruf Kanji', 12),

-- 4.12 Kanji N5 3: Manusia & Keluarga (8 cards)
    ('f3002512-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000012'::uuid, '人', 'ひと・じん・にん', 'Orang / Manusia', 'Huruf Kanji', 1),
    ('f3002512-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000012'::uuid, '男', 'おとこ・だん / 男の人', 'Laki-laki', 'Huruf Kanji', 2),
    ('f3002512-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000012'::uuid, '女', 'おんな・じょ / 女の人', 'Perempuan', 'Huruf Kanji', 3),
    ('f3002512-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000012'::uuid, '子', 'こ・し / 子ども', 'Anak kecil', 'Huruf Kanji', 4),
    ('f3002512-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000012'::uuid, '父', 'ちち / お父さん', 'Ayah', 'Huruf Kanji', 5),
    ('f3002512-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000012'::uuid, '母', 'はは / お母さん', 'Ibu', 'Huruf Kanji', 6),
    ('f3002512-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000012'::uuid, '友', 'とも / 友だち', 'Teman', 'Huruf Kanji', 7),
    ('f3002512-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000012'::uuid, '名', 'な・めい / 名前', 'Nama / Terkenal', 'Huruf Kanji', 8),

-- 4.13 Kanji N5 4: Arah, Tempat & Kota (11 cards)
    ('f3002513-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000013'::uuid, '上', 'うえ・じょう / 上手', 'Atas / Naik', 'Huruf Kanji', 1),
    ('f3002513-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000013'::uuid, '下', 'した・か / 地下鉄', 'Bawah / Turun', 'Huruf Kanji', 2),
    ('f3002513-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000013'::uuid, '中', 'なか・ちゅう', 'Dalam / Tengah', 'Huruf Kanji', 3),
    ('f3002513-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000013'::uuid, '外', 'そと・がい / 外国', 'Luar', 'Huruf Kanji', 4),
    ('f3002513-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000013'::uuid, '前', 'まえ・ぜん / 午前', 'Depan / Sebelum', 'Huruf Kanji', 5),
    ('f3002513-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000013'::uuid, '後', 'うしろ・あと・ご', 'Belakang / Sesudah', 'Huruf Kanji', 6),
    ('f3002513-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000013'::uuid, '右', 'みぎ・う', 'Kanan', 'Huruf Kanji', 7),
    ('f3002513-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000013'::uuid, '左', 'ひだり・さ', 'Kiri', 'Huruf Kanji', 8),
    ('f3002513-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000013'::uuid, '校', 'こう / 学校', 'Sekolah', 'Huruf Kanji', 9),
    ('f3002513-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000013'::uuid, '店', 'みせ・てん / 店員', 'Toko / Kedai', 'Huruf Kanji', 10),
    ('f3002513-0000-0000-0000-000000000011'::uuid, 'f1000025-0000-0000-0000-000000000013'::uuid, '駅', 'えき / 東京駅', 'Stasiun kereta', 'Huruf Kanji', 11),

-- 4.14 Kanji N5 5: Aksi & Sifat (14 cards)
    ('f3002514-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '食', 'た(べる)・しょく', 'Makan / Makanan', 'Huruf Kanji', 1),
    ('f3002514-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '飲', 'の(む)・いん', 'Minum / Minuman', 'Huruf Kanji', 2),
    ('f3002514-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '見', 'み(る)・けん', 'Melihat / Menonton', 'Huruf Kanji', 3),
    ('f3002514-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '聞', 'き(く)・ぶん', 'Mendengar / Bertanya', 'Huruf Kanji', 4),
    ('f3002514-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '読', 'よ(む)・どく', 'Membaca', 'Huruf Kanji', 5),
    ('f3002514-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '書', 'か(く)・しょ', 'Menulis', 'Huruf Kanji', 6),
    ('f3002514-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '行', 'い(く)・こう', 'Pergi', 'Huruf Kanji', 7),
    ('f3002514-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '来', 'く(る)・らい', 'Datang', 'Huruf Kanji', 8),
    ('f3002514-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '大', 'おお(きい)・だい', 'Besar', 'Huruf Kanji', 9),
    ('f3002514-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '小', 'ちい(さい)・しょう', 'Kecil', 'Huruf Kanji', 10),
    ('f3002514-0000-0000-0000-000000000011'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '高', 'たか(い)・こう', 'Tinggi / Mahal', 'Huruf Kanji', 11),
    ('f3002514-0000-0000-0000-000000000012'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '安', 'やす(い)・あん', 'Murah / Aman', 'Huruf Kanji', 12),
    ('f3002514-0000-0000-0000-000000000013'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '新', 'あたら(しい)・しん', 'Baru', 'Huruf Kanji', 13),
    ('f3002514-0000-0000-0000-000000000014'::uuid, 'f1000025-0000-0000-0000-000000000014'::uuid, '古', 'ふる(い)・こ', 'Lama / Kuno', 'Huruf Kanji', 14),

-- 4.15 Deck Baru: Benda Sekitar, Rumah & Kelas (10 cards)
    ('f3002515-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000015'::uuid, '机（つくえ）', 'tsukue', 'Meja belajar', 'Kata Benda', 1),
    ('f3002515-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000015'::uuid, 'いす', 'isu', 'Kursi', 'Kata Benda', 2),
    ('f3002515-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000015'::uuid, 'かばん', 'kaban', 'Tas', 'Kata Benda', 3),
    ('f3002515-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000015'::uuid, 'かぎ', 'kagi', 'Kunci', 'Kata Benda', 4),
    ('f3002515-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000015'::uuid, '時計（とけい）', 'tokei', 'Jam dinding / tangan', 'Kata Benda', 5),
    ('f3002515-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000015'::uuid, '本（ほん）', 'hon', 'Buku', 'Kata Benda', 6),
    ('f3002515-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000015'::uuid, '鉛筆（えんぴつ）', 'enpitsu', 'Pensil', 'Kata Benda', 7),
    ('f3002515-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000015'::uuid, '部屋（へや）', 'heya', 'Kamar / Ruangan', 'Kata Benda', 8),
    ('f3002515-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000015'::uuid, '窓（まど）', 'mado', 'Jendela', 'Kata Benda', 9),
    ('f3002515-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000015'::uuid, 'パソコン', 'pasokon', 'Laptop / Komputer', 'Kata Benda', 10),

-- 4.16 Deck Baru: Keluarga, Orang & Profesi (10 cards)
    ('f3002516-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000016'::uuid, '家族（かぞく）', 'kazoku', 'Keluarga', 'Keluarga', 1),
    ('f3002516-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000016'::uuid, '父（ちち）', 'chichi', 'Ayah (sendiri)', 'Keluarga', 2),
    ('f3002516-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000016'::uuid, 'お父さん（おとうさん）', 'otousan', 'Ayah (orang lain)', 'Keluarga', 3),
    ('f3002516-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000016'::uuid, '母（はは）', 'haha', 'Ibu (sendiri)', 'Keluarga', 4),
    ('f3002516-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000016'::uuid, 'お母さん（おかあさん）', 'okaasan', 'Ibu (orang lain)', 'Keluarga', 5),
    ('f3002516-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000016'::uuid, '兄（あに）', 'ani', 'Kakak laki-laki (sendiri)', 'Keluarga', 6),
    ('f3002516-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000016'::uuid, '姉（あね）', 'ane', 'Kakak perempuan (sendiri)', 'Keluarga', 7),
    ('f3002516-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000016'::uuid, '会社員（かいしゃいん）', 'kaishain', 'Karyawan perusahaan', 'Profesi', 8),
    ('f3002516-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000016'::uuid, '医者（いしゃ）', 'isha', 'Dokter', 'Profesi', 9),
    ('f3002516-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000016'::uuid, '学生（がくせい）', 'gakusei', 'Mahasiswa / Pelajar', 'Profesi', 10),

-- 4.17 Deck Baru: Posisi, Arah & Ruangan (10 cards)
    ('f3002517-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000017'::uuid, '上（うえ）', 'ue', 'Di atas', 'Posisi', 1),
    ('f3002517-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000017'::uuid, '下（した）', 'shita', 'Di bawah', 'Posisi', 2),
    ('f3002517-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000017'::uuid, '中（なか）', 'naka', 'Di dalam', 'Posisi', 3),
    ('f3002517-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000017'::uuid, '外（そと）', 'soto', 'Di luar', 'Posisi', 4),
    ('f3002517-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000017'::uuid, '前（まえ）', 'mae', 'Di depan', 'Posisi', 5),
    ('f3002517-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000017'::uuid, '後ろ（うしろ）', 'ushiro', 'Di belakang', 'Posisi', 6),
    ('f3002517-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000017'::uuid, '右（みぎ）', 'migi', 'Sebelah kanan', 'Posisi', 7),
    ('f3002517-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000017'::uuid, '左（ひだり）', 'hidari', 'Sebelah kiri', 'Posisi', 8),
    ('f3002517-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000017'::uuid, '隣（となり）', 'tonari', 'Di sebelah', 'Posisi', 9),
    ('f3002517-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000017'::uuid, '間（あいだ）', 'aida', 'Di antara', 'Posisi', 10),

-- 4.18 Deck Baru: Belanja, Warna & Pakaian (10 cards)
    ('f3002518-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000018'::uuid, '赤い（あかい）', 'akai', 'Merah', 'Warna / Sifat-i', 1),
    ('f3002518-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000018'::uuid, '青い（あおい）', 'aoi', 'Biru', 'Warna / Sifat-i', 2),
    ('f3002518-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000018'::uuid, '白い（しろい）', 'shiroi', 'Putih', 'Warna / Sifat-i', 3),
    ('f3002518-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000018'::uuid, '黒い（くろい）', 'kuroi', 'Hitam', 'Warna / Sifat-i', 4),
    ('f3002518-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000018'::uuid, '服（ふく）', 'fuku', 'Pakaian / Baju', 'Kata Benda', 5),
    ('f3002518-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000018'::uuid, '靴（くつ）', 'kutsu', 'Sepatu', 'Kata Benda', 6),
    ('f3002518-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000018'::uuid, '着ます（きます）', 'kimasu', 'Memakai (baju atasan)', 'Kata Kerja', 7),
    ('f3002518-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000018'::uuid, '履きます（はきます）', 'hakimasu', 'Memakai (celana/sepatu)', 'Kata Kerja', 8),
    ('f3002518-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000018'::uuid, 'かぶります', 'kaburimasu', 'Memakai (topi)', 'Kata Kerja', 9),
    ('f3002518-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000018'::uuid, '眼鏡をかけます（めがね）', 'megane o kakemasu', 'Memakai kacamata', 'Kata Kerja', 10),

-- 4.19 Deck Baru: Hobi, Cuaca & Musim (10 cards)
    ('f3002519-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000019'::uuid, '天気（てんき）', 'tenki', 'Cuaca', 'Kata Benda', 1),
    ('f3002519-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000019'::uuid, '雨（あめ）', 'ame', 'Hujan', 'Kata Benda', 2),
    ('f3002519-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000019'::uuid, '晴れ（はれ）', 'hare', 'Cerah', 'Kata Benda', 3),
    ('f3002519-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000019'::uuid, '春（はる）', 'haru', 'Musim semi', 'Musim', 4),
    ('f3002519-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000019'::uuid, '夏（なつ）', 'natsu', 'Musim panas', 'Musim', 5),
    ('f3002519-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000019'::uuid, '秋（あき）', 'aki', 'Musim gugur', 'Musim', 6),
    ('f3002519-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000019'::uuid, '冬（ふゆ）', 'fuyu', 'Musim dingin', 'Musim', 7),
    ('f3002519-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000019'::uuid, '趣味（しゅみ）', 'shumi', 'Hobi / Kegemaran', 'Kata Benda', 8),
    ('f3002519-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000019'::uuid, '音楽（おんがく）', 'ongaku', 'Musik', 'Kata Benda', 9),
    ('f3002519-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000019'::uuid, 'スポーツ', 'supootsu', 'Olahraga', 'Kata Benda', 10),

-- 4.20 Deck Baru: Tubuh, Kesehatan & Situasi Darurat (10 cards)
    ('f3002520-0000-0000-0000-000000000001'::uuid, 'f1000025-0000-0000-0000-000000000020'::uuid, '頭（あたま）', 'atama', 'Kepala', 'Tubuh', 1),
    ('f3002520-0000-0000-0000-000000000002'::uuid, 'f1000025-0000-0000-0000-000000000020'::uuid, 'お腹（おなか）', 'onaka', 'Perut', 'Tubuh', 2),
    ('f3002520-0000-0000-0000-000000000003'::uuid, 'f1000025-0000-0000-0000-000000000020'::uuid, '目（め）', 'me', 'Mata', 'Tubuh', 3),
    ('f3002520-0000-0000-0000-000000000004'::uuid, 'f1000025-0000-0000-0000-000000000020'::uuid, '手（て）', 'te', 'Tangan', 'Tubuh', 4),
    ('f3002520-0000-0000-0000-000000000005'::uuid, 'f1000025-0000-0000-0000-000000000020'::uuid, '痛い（いたい）', 'itai', 'Sakit / Nyeri', 'Kata Sifat-i', 5),
    ('f3002520-0000-0000-0000-000000000006'::uuid, 'f1000025-0000-0000-0000-000000000020'::uuid, '風邪（かぜ）', 'kaze', 'Masuk angin / Flu', 'Kesehatan', 6),
    ('f3002520-0000-0000-0000-000000000007'::uuid, 'f1000025-0000-0000-0000-000000000020'::uuid, '熱（ねつ）', 'netsu', 'Demam', 'Kesehatan', 7),
    ('f3002520-0000-0000-0000-000000000008'::uuid, 'f1000025-0000-0000-0000-000000000020'::uuid, '薬（くすり）', 'kusuri', 'Obat', 'Kesehatan', 8),
    ('f3002520-0000-0000-0000-000000000009'::uuid, 'f1000025-0000-0000-0000-000000000020'::uuid, '病院（びょういん）', 'byouin', 'Rumah sakit', 'Tempat', 9),
    ('f3002520-0000-0000-0000-000000000010'::uuid, 'f1000025-0000-0000-0000-000000000020'::uuid, '大丈夫（だいじょうぶ）', 'daijoubu', 'Tidak apa-apa / Baik-baik saja', 'Kata Sifat-na', 10)
ON CONFLICT (id) DO UPDATE SET
    front_text     = EXCLUDED.front_text,
    reading        = EXCLUDED.reading,
    back_meaning   = EXCLUDED.back_meaning,
    part_of_speech = EXCLUDED.part_of_speech,
    sort_order     = EXCLUDED.sort_order;

COMMIT;
