-- ============================================================================
-- Migration: 000023_curriculum_short_titles_and_kana.up.sql
-- Description:
--   1. Add concise 1-2 word short_title to lessons & refine thematic icons
--      for zero-beginner Unit 1 lessons.
--   2. Create kana_characters (92 Gojuon: 46 Hiragana + 46 Katakana) and
--      user_kana_progress tables as Single Source of Truth for /kana.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Lessons short_title & refined Unit 1 icons
-- ----------------------------------------------------------------------------
ALTER TABLE lessons
    ADD COLUMN IF NOT EXISTS short_title VARCHAR(48) NOT NULL DEFAULT '';

UPDATE lessons AS l
SET
    short_title = v.short_title,
    icon_name   = COALESCE(v.icon_name, l.icon_name)
FROM (VALUES
    ('n5-placement-diagnostic',            'Placement Test',    NULL),
    ('n5-vokal-utama-hiragana',            'Vokal あ–お',        'hiragana'),
    ('n5-salam-pertama-aisatsu',           'Salam',             'hand-waving'),
    ('n5-konsonan-dasar-hiragana',         'Hiragana か–な',     'hiragana-ka'),
    ('n5-katakana-pinjaman-angka-dasar',   'Angka & Katakana',  'numbers'),
    ('n5-salam-perkenalan-identitas',      'Perkenalan',        NULL),
    ('n5-profesi-dan-kewarganegaraan',     'Profesi',           NULL),
    ('n5-kata-tunjuk-benda-kepemilikan',   'Kata Tunjuk',       NULL),
    ('n5-informasi-dan-asal-daerah',       'Asal Daerah',       NULL),
    ('n5-keluarga-dan-panggilan',          'Keluarga',          NULL),
    ('n5-makan-minum-rutinitas-pagi',      'Makan & Minum',     NULL),
    ('n5-membeli-barang-di-kafe',          'Kafe',              NULL),
    ('n5-kegiatan-waktu-luang-hobi',       'Hobi',              NULL),
    ('n5-mengajak-rekan-kerja',            'Ajakan',            NULL),
    ('n5-frekuensi-kebiasaan-harian',      'Kebiasaan',         NULL),
    ('n5-jam-kerja-jadwal-harian',         'Jam & Jadwal',      NULL),
    ('n5-komuter-kereta-tokyo',            'Kereta',            NULL),
    ('n5-hari-tanggal-agenda-kantor',      'Hari & Agenda',     NULL),
    ('n5-durasi-perjalanan-transit',       'Durasi Transit',    NULL),
    ('n5-bulan-dan-tanggal-kalender',      'Kalender',          NULL),
    ('n5-rute-transportasi-dan-sarana',    'Transportasi',      NULL),
    ('n5-keberadaan-benda-dan-orang',      'Keberadaan',        NULL),
    ('n5-posisi-relatif-ruangan',          'Posisi Benda',      NULL),
    ('n5-menghitung-benda-daftar-item',    'Hitung Benda',      NULL),
    ('n5-letak-fasilitas-umum-kota',       'Fasilitas Kota',    NULL),
    ('n5-denah-kantor-dan-ruangan',        'Denah Kantor',      NULL),
    ('n5-menunjuk-arah-dan-petunjuk-jalan','Petunjuk Arah',     NULL),
    ('n5-kata-sifat-i-kehidupan-harian',   'Sifat -i',          NULL),
    ('n5-kata-sifat-na-penilaian-kerja',   'Sifat -na',         NULL),
    ('n5-lampau-kata-sifat-dan-cuaca',     'Cuaca',             NULL),
    ('n5-perbandingan-dan-pilihan-favorit','Perbandingan',      NULL),
    ('n5-belanja-harga-dan-warna',         'Belanja',           NULL),
    ('n5-musim-dan-suasana-kota',          'Musim',             NULL),
    ('n5-permintaan-sopan-di-kantor',      'Permintaan',        NULL),
    ('n5-aktivitas-sedang-berlangsung',    'Bentuk -te iru',    NULL),
    ('n5-aturan-izin-dan-larangan',        'Izin & Larangan',   NULL),
    ('n5-menyambung-urutan-aktivitas',     'Urutan Kerja',      NULL),
    ('n5-bentuk-lampau-kata-kerja',        'Bentuk Lampau',     NULL),
    ('n5-cerita-kegiatan-akhir-pekan',     'Akhir Pekan',       NULL),
    ('n5-sopan-santun-di-tempat-kerja',    'Etika Kerja',       NULL),
    ('n5-keinginan-dan-target-n5',         'Keinginan',         NULL),
    ('n5-tujuan-kepergian-dan-alasan',     'Tujuan & Alasan',   NULL),
    ('n5-pengalaman-dan-kebiasaan',        'Pengalaman',        NULL),
    ('n5-simulasi-percakapan-harian',      'Percakapan',        NULL),
    ('n5-memberi-dan-menerima-bantuan',    'Saling Bantu',      NULL),
    ('n5-rencana-dan-kemahiran',           'Kemahiran',         NULL),
    ('n5-ulasan-komprehensif-jlpt-n5',     'Ulasan N5',         NULL),
    ('n5-readiness-mock-exam',             'Ujian N5',          NULL)
) AS v(slug, short_title, icon_name)
WHERE l.slug = v.slug;

UPDATE lessons
SET short_title = LEFT(title, 48)
WHERE short_title = '';

-- ----------------------------------------------------------------------------
-- 2. Kana Characters Catalog (92 Gojuon: 46 Hiragana + 46 Katakana)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS kana_characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character VARCHAR(8) NOT NULL UNIQUE,
    script VARCHAR(16) NOT NULL CHECK (script IN ('hiragana', 'katakana')),
    romaji VARCHAR(16) NOT NULL,
    row_group VARCHAR(16) NOT NULL,
    row_order INT NOT NULL,
    col_order INT NOT NULL,
    mnemonic TEXT NOT NULL,
    example_word VARCHAR(64) NOT NULL DEFAULT '',
    example_reading VARCHAR(64) NOT NULL DEFAULT '',
    example_meaning VARCHAR(120) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kana_script_order
    ON kana_characters(script, row_order, col_order);

INSERT INTO kana_characters (
    character, script, romaji, row_group, row_order, col_order,
    mnemonic, example_word, example_reading, example_meaning
)
VALUES
    -- ======================== HIRAGANA (46) ========================
    -- Row 1: Vowels (a)
    ('あ', 'hiragana', 'a',   'a', 1, 1, 'Seperti huruf "a" dengan garis lengkung melingkar — bunyikan "a" pada "apa".', 'あさ', 'asa', 'pagi'),
    ('い', 'hiragana', 'i',   'a', 1, 2, 'Dua garis tegak mirip angka 11 ("ii") berdiri berdampingan.', 'いえ', 'ie', 'rumah'),
    ('う', 'hiragana', 'u',   'a', 1, 3, 'Topi kecil miring di atas lengkungan huruf "U".', 'うみ', 'umi', 'laut'),
    ('え', 'hiragana', 'e',   'a', 1, 4, 'Mirip angka 2 dengan topi tipis — bunyi "e" tegas seperti "ekor".', 'えき', 'eki', 'stasiun'),
    ('お', 'hiragana', 'o',   'a', 1, 5, 'Huruf "a" yang memakai titik kecil di kanan atas sebagai tanda "o".', 'おちゃ', 'ocha', 'teh'),

    -- Row 2: K
    ('か', 'hiragana', 'ka',  'k', 2, 1, 'Pisau pemotong (katana) plus satu percikan kecil di kanan — "KA-tana".', 'かさ', 'kasa', 'payung'),
    ('き', 'hiragana', 'ki',  'k', 2, 2, 'Bentuknya persis seperti kunci ("KEY") klasik bergigi dua.', 'き', 'ki', 'pohon'),
    ('く', 'hiragana', 'ku',  'k', 2, 3, 'Paruh burung ("KU-ku") yang terbuka tajam menghadap kanan.', 'くつ', 'kutsu', 'sepatu'),
    ('け', 'hiragana', 'ke',  'k', 2, 4, 'Seperti tong kayu ("KEG") dengan pegangan di samping kiri.', 'けさ', 'kesa', 'tadi pagi'),
    ('こ', 'hiragana', 'ko',  'k', 2, 5, 'Dua koin tipis sejajar atas dan bawah — "KO-in".', 'こども', 'kodomo', 'anak'),

    -- Row 3: S
    ('さ', 'hiragana', 'sa',  's', 3, 1, 'Garis silang di atas lengkungan seperti wajah tersenyum "SA-pa".', 'さかな', 'sakana', 'ikan'),
    ('し', 'hiragana', 'shi', 's', 3, 2, 'Kail pancing ("fi-SHI-ng hook") melengkung ke kanan.', 'しろ', 'shiro', 'putih'),
    ('す', 'hiragana', 'su',  's', 3, 3, 'Lingkaran menggantung di batang bambu — "SU-shi" gulung.', 'すし', 'sushi', 'sushi'),
    ('せ', 'hiragana', 'se',  's', 3, 4, 'Orang duduk bersila sambil bilang "SE-bentar".', 'せんせい', 'sensei', 'guru'),
    ('そ', 'hiragana', 'so',  's', 3, 5, 'Jahitan zig-zag benang ("SO-w" / menjahit) menjadi satu goresan.', 'そら', 'sora', 'langit'),

    -- Row 4: T
    ('た', 'hiragana', 'ta',  't', 4, 1, 'Terlihat jelas seperti gabungan huruf "t" dan "a" ("ta").', 'たまご', 'tamago', 'telur'),
    ('ち', 'hiragana', 'chi', 't', 4, 2, 'Sangat mirip angka 5 dengan topi miring — "CHI-cago 5".', 'ちず', 'chizu', 'peta'),
    ('つ', 'hiragana', 'tsu', 't', 4, 3, 'Ombak besar melengkung menghantam pantai — "TSU-nami".', 'つき', 'tsuki', 'bulan'),
    ('て', 'hiragana', 'te',  't', 4, 4, 'Garis datar dan lengkung mirip huruf "T" besar untuk "TE-n".', 'てがみ', 'tegami', 'surat'),
    ('と', 'hiragana', 'to',  't', 4, 5, 'Batu kecil tersangkut di kaki ("TO-e") atau huruf t terbalik.', 'とけい', 'tokei', 'jam'),

    -- Row 5: N
    ('な', 'hiragana', 'na',  'n', 5, 1, 'Salib kecil di kiri dengan simpul tali ("KNO-t") di bawahnya.', 'なまえ', 'namae', 'nama'),
    ('に', 'hiragana', 'ni',  'n', 5, 2, 'Lutut ("KNEE") berdiri tegak dengan tempurung lutut di kanan.', 'にほん', 'nihon', 'Jepang'),
    ('ぬ', 'hiragana', 'nu',  'n', 5, 3, 'Sumpit menggulung mi ("NU-del" / noodle) bersimpul ganda.', 'いぬ', 'inu', 'anjing'),
    ('ね', 'hiragana', 'ne',  'n', 5, 4, 'Garis tegak dengan ekor kucing melingkar — "NE-ko" (kucing).', 'ねこ', 'neko', 'kucing'),
    ('の', 'hiragana', 'no',  'n', 5, 5, 'Lingkaran satu tarikan mirip rambu dilarang ("NO").', 'のみもの', 'nomimono', 'minuman'),

    -- Row 6: H
    ('は', 'hiragana', 'ha',  'h', 6, 1, 'Huruf "H" di kiri ditambah simpul "a" — tertawa "HA-ha".', 'はな', 'hana', 'bunga'),
    ('ひ', 'hiragana', 'hi',  'h', 6, 2, 'Senyum lebar menyeringai sambil tertawa kecil — "HI-hi".', 'ひと', 'hito', 'orang'),
    ('ふ', 'hiragana', 'fu',  'h', 6, 3, 'Gunung "FU-ji" bermahkota awan dengan 2 titik di samping.', 'ふゆ', 'fuyu', 'musim dingin'),
    ('へ', 'hiragana', 'he',  'h', 6, 4, 'Anak panah atau puncak atap menunjuk ke atas — "HE-aven".', 'へや', 'heya', 'kamar'),
    ('ほ', 'hiragana', 'ho',  'h', 6, 5, 'Mirip は tetapi beratap dua garis datar di kanan — "HO-me".', 'ほん', 'hon', 'buku'),

    -- Row 7: M
    ('ま', 'hiragana', 'ma',  'm', 7, 1, 'Tiang kapal layar dengan simpul jangkar di bawah — "MA-st".', 'まち', 'machi', 'kota'),
    ('み', 'hiragana', 'mi',  'm', 7, 2, 'Seperti angka 21 bersambung — ulang tahun ke-21 "MI-likku".', 'みず', 'mizu', 'air'),
    ('む', 'hiragana', 'mu',  'm', 7, 3, 'Wajah sapi bermoncong melingkar sedang melenguh "MUU".', 'むし', 'mushi', 'serangga'),
    ('め', 'hiragana', 'me',  'm', 7, 4, 'Garis melingkar terbuka seperti bola mata ("ME" dalam bahasa Jepang).', 'めがね', 'megane', 'kacamata'),
    ('も', 'hiragana', 'mo',  'm', 7, 5, 'Kail dengan dua umpan ganda untuk menangkap ikan "MO-re" banyak.', 'もり', 'mori', 'hutan'),

    -- Row 8: Y
    ('や', 'hiragana', 'ya',  'y', 8, 1, 'Bentuk kepala kerbau "YA-k" bertanduk dengan garis miring.', 'やま', 'yama', 'gunung'),
    ('ゆ', 'hiragana', 'yu',  'y', 8, 3, 'Ikan unik berenang memutar — huruf "U" dibaca "YU".', 'ゆき', 'yuki', 'salju'),
    ('よ', 'hiragana', 'yo',  'y', 8, 5, 'Orang melambaikan yoyo gantung ke bawah — "YO-yo".', 'よる', 'yoru', 'malam'),

    -- Row 9: R
    ('ら', 'hiragana', 'ra',  'r', 9, 1, 'Sangat mirip angka 5 atau kelinci bertelinga turun ("RA-bbit").', 'らいねん', 'rainen', 'tahun depan'),
    ('り', 'hiragana', 'ri',  'r', 9, 2, 'Dua helai alang-alang ("RI-ngan") melambai, sebelah kanan lebih panjang.', 'りんご', 'ringo', 'apel'),
    ('る', 'hiragana', 'ru',  'r', 9, 3, 'Mirip angka 3 yang menggulung lingkaran tertutup di ujung — "RU-nd".', 'くるま', 'kuruma', 'mobil'),
    ('れ', 'hiragana', 're',  'r', 9, 4, 'Tiang dengan selendang menjuntai ke kanan — "RE-st".', 'れきし', 'rekishi', 'sejarah'),
    ('ろ', 'hiragana', 'ro',  'r', 9, 5, 'Sama seperti る tetapi ujungnya terbuka tanpa lingkaran ("RO-ad").', 'ろく', 'roku', 'enam'),

    -- Row 10-11: W & N
    ('わ', 'hiragana', 'wa',  'w', 10, 1, 'Tiang dengan sayap mengembang ke luar — "WA-w!".', 'わたし', 'watashi', 'saya'),
    ('を', 'hiragana', 'wo',  'w', 10, 5, 'Penari melompat di atas batu (dipakai khusus sebagai partikel objek "o").', 'ほんをよむ', 'hon o yomu', 'membaca buku'),
    ('ん', 'hiragana', 'n',   'n_final', 11, 1, 'Persis seperti huruf kecil "n" miring! Satu-satunya konsonan tunggal.', 'にほん', 'nihon', 'Jepang'),

    -- ======================== KATAKANA (46) ========================
    -- Row 1: Vowels (a)
    ('ア', 'katakana', 'a',   'a', 1, 1, 'Seperti kapak tajam atau huruf "A" miring menyamping.', 'アイス', 'aisu', 'es krim'),
    ('イ', 'katakana', 'i',   'a', 1, 2, 'Seperti tiang kuda-kuda lukis (Easel / "I").', 'インドネシア', 'indoneshia', 'Indonesia'),
    ('ウ', 'katakana', 'u',   'a', 1, 3, 'Garis tegas bersudut dari あう — perhatikan goresan atasnya tegak.', 'ウール', 'uuru', 'wol'),
    ('エ', 'katakana', 'e',   'a', 1, 4, 'Persis huruf "I" kapital lebar untuk rel kereta ("E-levator").', 'エレベーター', 'erebeetaa', 'lift'),
    ('オ', 'katakana', 'o',   'a', 1, 5, 'Penyanyi opera mengangkat tangan sambil menyanyikan nada "O".', 'オレンジ', 'orenji', 'jeruk'),

    -- Row 2: K
    ('カ', 'katakana', 'ka',  'k', 2, 1, 'Sama persis seperti か hiragana, hanya bersudut tajam tanpa titik!', 'カメラ', 'kamera', 'kamera'),
    ('キ', 'katakana', 'ki',  'k', 2, 2, 'Bagian atas kunci き disederhanakan menjadi 3 garis tegas.', 'キッチン', 'kitchin', 'dapur'),
    ('ク', 'katakana', 'ku',  'k', 2, 3, 'Ujung paruh elang atau angka 7 bersayap — "KU-at".', 'クラス', 'kurasu', 'kelas'),
    ('ケ', 'katakana', 'ke',  'k', 2, 4, 'Huruf "K" miring terbalik membentuk sudut tajam — "KE-ju".', 'ケーキ', 'keeki', 'kue'),
    ('コ', 'katakana', 'ko',  'k', 2, 5, 'Tiga sisi kotak ("KO-tak") yang terbuka di sisi kiri.', 'コーヒー', 'koohii', 'kopi'),

    -- Row 3: S
    ('サ', 'katakana', 'sa',  's', 3, 1, 'Pagar kayu bersilang menyerupai pelana kuda ("SA-ddle").', 'サッカー', 'sakkaa', 'sepak bola'),
    ('シ', 'katakana', 'shi', 's', 3, 2, 'Wajah tersenyum melihat ke ATAS/KANAN ("SHI smiles upward").', 'シャツ', 'shatsu', 'kemeja'),
    ('ス', 'katakana', 'su',  's', 3, 3, 'Gantungan baju atau orang meluncur cepat ("SU-per ski").', 'スーパー', 'suupaa', 'supermarket'),
    ('セ', 'katakana', 'se',  's', 3, 4, 'Versi kotak bersudut langsung dari hiragana せ.', 'セーター', 'seetaa', 'sweter'),
    ('ソ', 'katakana', 'so',  's', 3, 5, 'Satu titik turun ke bawah — jauh lebih ramping daripada ン!', 'ソファ', 'sofa', 'sofa'),

    -- Row 4: T
    ('タ', 'katakana', 'ta',  't', 4, 1, 'Mirip dengan ク katakana tetapi ditambah satu garis di tengah.', 'タクシー', 'takushii', 'taksi'),
    ('チ', 'katakana', 'chi', 't', 4, 2, 'Seperti pemandu sorak ("CHI-erleader") dengan dua tangan terentang.', 'チーズ', 'chiizu', 'keju'),
    ('ツ', 'katakana', 'tsu', 't', 4, 3, 'Dua garis miring turun dari atas — bedakan dengan シ yang mendatar.', 'ツアー', 'tsuaa', 'tur'),
    ('テ', 'katakana', 'te',  't', 4, 4, 'Tiang telepon bertingkat dua ("TE-lepon").', 'テレビ', 'terebi', 'televisi'),
    ('ト', 'katakana', 'to',  't', 4, 5, 'Pohon totem lurus dengan satu cabang menunjuk ke kanan.', 'トイレ', 'toire', 'toilet'),

    -- Row 5: N
    ('ナ', 'katakana', 'na',  'n', 5, 1, 'Pisau dapur bersilang melengkung sedikit ke kiri — "NA-if".', 'ナイフ', 'naifu', 'pisau'),
    ('ニ', 'katakana', 'ni',  'n', 5, 2, 'Angka romawi dua (II) tidur — dalam bahasa Jepang 2 adalah "NI".', 'ニュース', 'nyuusu', 'berita'),
    ('ヌ', 'katakana', 'nu',  'n', 5, 3, 'Tangkai Sumpit menembus roti pipih — bunyinya "NU".', 'カヌー', 'kanuu', 'kano'),
    ('ネ', 'katakana', 'ne',  'n', 5, 4, 'Kaki tiga atau sarang burung di puncak pohon — "NE-st".', 'ネクタイ', 'nekutai', 'dasi'),
    ('ノ', 'katakana', 'no',  'n', 5, 5, 'Satu garis miring tegas membelah seperti tanda larangan ("NO").', 'ノート', 'nooto', 'buku catatan'),

    -- Row 6: H
    ('ハ', 'katakana', 'ha',  'h', 6, 1, 'Dua kaki terbuka membentuk angka 8 atau atap tenda "HA-ha".', 'ハンバーガー', 'hanbaagaa', 'hamburger'),
    ('ヒ', 'katakana', 'hi',  'h', 6, 2, 'Seseorang tersenyum menyamping sambil berkata "HI!".', 'ヒーター', 'hiitaa', 'pemanas'),
    ('フ', 'katakana', 'fu',  'h', 6, 3, 'Satu garis siku sederhana — bentuk atap bendera "FU-ji".', 'フォーク', 'fooku', 'garpu'),
    ('ヘ', 'katakana', 'he',  'h', 6, 4, 'Bentuknya sama persis dengan hiragana へ!', 'ヘリコプター', 'herikoputaa', 'helikopter'),
    ('ホ', 'katakana', 'ho',  'h', 6, 5, 'Salib suci bercabang di kiri dan kanan — "HO-ly cross".', 'ホテル', 'hoteru', 'hotel'),

    -- Row 7: M
    ('マ', 'katakana', 'ma',  'm', 7, 1, 'Sudut atap tajam membentuk huruf M terpotong — "MA-p".', 'マップ', 'mappu', 'peta'),
    ('ミ', 'katakana', 'mi',  'm', 7, 2, 'Tiga garis miring sejajar seperti kumis kucing ("MI-au").', 'ミルク', 'miruku', 'susu'),
    ('ム', 'katakana', 'mu',  'm', 7, 3, 'Tanduk banteng tunggal menyentuh tanah — "MU-u".', 'ゲーム', 'geemu', 'gim'),
    ('メ', 'katakana', 'me',  'm', 7, 4, 'Tanda silang "X" pada mata bajak laut — "ME" (mata).', 'メニュー', 'menyuu', 'menu'),
    ('モ', 'katakana', 'mo',  'm', 7, 5, 'Bentuk lurus tegas dari hiragana も ("MO-nitor").', 'モニター', 'monitaa', 'monitor'),

    -- Row 8: Y
    ('ヤ', 'katakana', 'ya',  'y', 8, 1, 'Versi kotak minimalis dari hiragana や.', 'ヤシ', 'yashi', 'pohon palem'),
    ('ユ', 'katakana', 'yu',  'y', 8, 3, 'Periskop kapal selam di bawah permukaan air — "YU-boat".', 'ユーモア', 'yuumoa', 'humor'),
    ('ヨ', 'katakana', 'yo',  'y', 8, 5, 'Huruf "E" terbalik ke kiri mirip pegangan yoyo — "YO".', 'ヨーグルト', 'yooguruto', 'yogurt'),

    -- Row 9: R
    ('ラ', 'katakana', 'ra',  'r', 9, 1, 'Seperti kursi malas ("RA-pt") bertopi garis datar di atas.', 'ラーメン', 'raamen', 'ramen'),
    ('リ', 'katakana', 'ri',  'r', 9, 2, 'Hampir identik dengan hiragana り, tetapi lebih lurus dan kaku.', 'リスト', 'risuto', 'daftar'),
    ('ル', 'katakana', 'ru',  'r', 9, 3, 'Dua akar pohon bercabang ke bawah — "RU-t" (root).', 'ルール', 'ruuru', 'aturan'),
    ('レ', 'katakana', 're',  'r', 9, 4, 'Satu garis siku tajam mirip tanda centang — "RE-ady!".', 'レストラン', 'resutoran', 'restoran'),
    ('ロ', 'katakana', 'ro',  'r', 9, 5, 'Kotak persegi sempurna tertutup di keempat sisinya — "RO-om".', 'ロボット', 'robotto', 'robot'),

    -- Row 10-11: W & N
    ('ワ', 'katakana', 'wa',  'w', 10, 1, 'Gelas wine tanpa kaki penuh dengan air — "WA-ter".', 'ワイン', 'wain', 'anggur'),
    ('ヲ', 'katakana', 'wo',  'w', 10, 5, 'Gabungan garis フ dan satu garis tengah — versi katakana partikel "o".', 'ヲ', 'wo', 'partikel o'),
    ('ン', 'katakana', 'n',   'n_final', 11, 1, 'Wajah tersenyum satu mata mengarah mendatar — bedakan dari ソ yang menukik ke bawah.', 'パン', 'pan', 'roti')
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

-- ----------------------------------------------------------------------------
-- 3. Per-user Kana Mastery & Practice Progress
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_kana_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    character VARCHAR(8) NOT NULL REFERENCES kana_characters(character) ON DELETE CASCADE,
    practice_count INT NOT NULL DEFAULT 0,
    correct_count INT NOT NULL DEFAULT 0,
    mastery_score INT NOT NULL DEFAULT 0,
    is_mastered BOOLEAN NOT NULL DEFAULT false,
    last_practiced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, character)
);

CREATE INDEX IF NOT EXISTS idx_user_kana_progress_user
    ON user_kana_progress(user_id);

COMMIT;
