-- ============================================================================
-- Migration: 000024_add_kanji_characters.up.sql
-- Description:
--   1. Extend kana_characters to support 'kanji' script and concise reading+meaning
--      labels in romaji (VARCHAR(48)).
--   2. Seed 50 foundational JLPT N5 Kanji characters across 10 thematic rows.
-- ============================================================================

BEGIN;

ALTER TABLE kana_characters
    ALTER COLUMN romaji TYPE VARCHAR(48);

ALTER TABLE kana_characters
    DROP CONSTRAINT IF EXISTS kana_characters_script_check;

ALTER TABLE kana_characters
    ADD CONSTRAINT kana_characters_script_check
    CHECK (script IN ('hiragana', 'katakana', 'kanji'));

INSERT INTO kana_characters (
    character, script, romaji, row_group, row_order, col_order,
    mnemonic, example_word, example_reading, example_meaning
)
VALUES
    -- Row 1: Angka Dasar (1–5)
    ('一', 'kanji', 'ichi • satu',      'kanji_num1', 1, 1, 'Satu garis mendatar lurus — melambangkan angka satu (1).', '一人', 'hitori', 'satu orang'),
    ('二', 'kanji', 'ni • dua',         'kanji_num1', 1, 2, 'Dua garis mendatar sejajar atas dan bawah — angka dua (2).', '二月', 'nigatsu', 'Februari'),
    ('三', 'kanji', 'san • tiga',       'kanji_num1', 1, 3, 'Tiga garis mendatar bertumpuk rapi — angka tiga (3).', '三日', 'mikka', 'tanggal tiga'),
    ('四', 'kanji', 'yon • empat',      'kanji_num1', 1, 4, 'Kotak jendela dengan dua tirai terbuka di dalamnya — empat (4) sudut.', '四月', 'shigatsu', 'April'),
    ('五', 'kanji', 'go • lima',        'kanji_num1', 1, 5, 'Lima garis bersilang membentuk rangka kursi kayu — lima (5).', '五円', 'goen', 'lima yen'),

    -- Row 2: Angka & Jumlah (6–10)
    ('六', 'kanji', 'roku • enam',      'kanji_num2', 2, 1, 'Atap kecil bertopi titik di atas dua kaki terbuka — enam (6).', '六時', 'rokuji', 'pukul enam'),
    ('七', 'kanji', 'nana • tujuh',     'kanji_num2', 2, 2, 'Angka 7 yang dibalik dengan satu garis melintang — tujuh (7).', '七月', 'shichigatsu', 'Juli'),
    ('八', 'kanji', 'hachi • delapan',  'kanji_num2', 2, 3, 'Dua garis miring terbuka ke bawah seperti gerbang atau kumis — delapan (8).', '八日', 'youka', 'tanggal delapan'),
    ('九', 'kanji', 'kyuu • sembilan',  'kanji_num2', 2, 4, 'Lengan melengkung menekuk ke kanan — sembilan (9).', '九時', 'kuji', 'pukul sembilan'),
    ('十', 'kanji', 'juu • sepuluh',    'kanji_num2', 2, 5, 'Tanda tambah (+) sempurna dari dua garis berpotongan — sepuluh (10).', '十円', 'juuen', 'sepuluh yen'),

    -- Row 3: Alam & Hari
    ('日', 'kanji', 'hi / nichi • hari',   'kanji_time', 3, 1, 'Kotak jendela yang menangkap cahaya matahari — hari / matahari.', '日本', 'nihon', 'Jepang'),
    ('月', 'kanji', 'tsuki / getsu • bulan','kanji_time', 3, 2, 'Bentuk bulan sabit ramping dengan dua garis bayangan — bulan.', '月曜日', 'getsuyoubi', 'hari Senin'),
    ('火', 'kanji', 'hi / ka • api',       'kanji_time', 3, 3, 'Nyala api unggun dengan dua percikan bara di kanan kiri — api.', '火曜日', 'kayoubi', 'hari Selasa'),
    ('水', 'kanji', 'mizu / sui • air',    'kanji_time', 3, 4, 'Aliran sungai utama di tengah dengan riak air di samping — air.', '水曜日', 'suiyoubi', 'hari Rabu'),
    ('木', 'kanji', 'ki / moku • pohon',   'kanji_time', 3, 5, 'Batang pohon tegak dengan cabang dan akar menjulur — pohon / kayu.', '木曜日', 'mokuyoubi', 'hari Kamis'),

    -- Row 4: Bumi & Alam
    ('金', 'kanji', 'kane / kin • emas',   'kanji_nature', 4, 1, 'Atap gunung menyimpan dua bongkah emas berkilau di dalam tanah.', 'お金', 'okane', 'uang'),
    ('土', 'kanji', 'tsuchi / do • tanah', 'kanji_nature', 4, 2, 'Tunas kecil yang menembus permukaan tanah datar — tanah.', '土曜日', 'doyoubi', 'hari Sabtu'),
    ('山', 'kanji', 'yama / san • gunung', 'kanji_nature', 4, 3, 'Tiga puncak gunung dengan puncak tertinggi menjulang di tengah.', '富士山', 'fujisan', 'Gunung Fuji'),
    ('川', 'kanji', 'kawa • sungai',       'kanji_nature', 4, 4, 'Tiga aliran arus air mengalir beriringan — sungai.', '川口', 'kawaguchi', 'muara sungai'),
    ('田', 'kanji', 'ta • sawah',          'kanji_nature', 4, 5, 'Petak sawah persegi yang dibagi empat saluran irigasi.', '田中', 'tanaka', 'marga Tanaka'),

    -- Row 5: Manusia & Keluarga
    ('人', 'kanji', 'hito / jin • orang',  'kanji_people', 5, 1, 'Dua kaki orang yang sedang melangkah — manusia / orang.', '日本人', 'nihonjin', 'orang Jepang'),
    ('子', 'kanji', 'ko • anak',           'kanji_people', 5, 2, 'Sosok anak kecil merentangkan kedua tangannya ke samping.', '子ども', 'kodomo', 'anak-anak'),
    ('女', 'kanji', 'onna • perempuan',    'kanji_people', 5, 3, 'Siluet anggun perempuan yang sedang duduk bersimpuh.', '女の子', 'onnanoko', 'anak perempuan'),
    ('男', 'kanji', 'otoko • laki-laki',   'kanji_people', 5, 4, 'Gabungan sawah (田) di atas dan tenaga (力) di bawah — laki-laki.', '男の子', 'otokonoko', 'anak laki-laki'),
    ('母', 'kanji', 'haha • ibu',          'kanji_people', 5, 5, 'Sosok ibu yang memeluk penuh kasih sayang — ibu.', 'お母さん', 'okaasan', 'ibu'),

    -- Row 6: Arah & Ukuran
    ('上', 'kanji', 'ue • atas',           'kanji_pos', 6, 1, 'Penunjuk berdiri tepat di atas garis dasar — atas / naik.', '上手', 'jouzu', 'mahir / pandai'),
    ('下', 'kanji', 'shita • bawah',       'kanji_pos', 6, 2, 'Penunjuk menggantung turun ke bawah garis dasar — bawah / turun.', '地下鉄', 'chikatetsu', 'kereta bawah tanah'),
    ('中', 'kanji', 'naka / chuu • tengah','kanji_pos', 6, 3, 'Garis vertikal membelah kotak tepat di bagian tengah — tengah / dalam.', '中国', 'chuugoku', 'Tiongkok'),
    ('大', 'kanji', 'oo / dai • besar',    'kanji_pos', 6, 4, 'Orang merentangkan tangan dan kaki selebar mungkin — besar.', '大学', 'daigaku', 'universitas'),
    ('小', 'kanji', 'chii / shou • kecil', 'kanji_pos', 6, 5, 'Garis tengah tipis diapit dua titik mungil — kecil.', '小学校', 'shougakkou', 'sekolah dasar'),

    -- Row 7: Belajar & Waktu
    ('学', 'kanji', 'gaku • belajar',      'kanji_school', 7, 1, 'Anak (子) belajar tekun di bawah atap sekolah — belajar / ilmu.', '学生', 'gakusei', 'pelajar / mahasiswa'),
    ('生', 'kanji', 'sei / i • hidup',     'kanji_school', 7, 2, 'Tunas segar tumbuh ke atas dari tanah — hidup / lahir.', '先生', 'sensei', 'guru'),
    ('先', 'kanji', 'saki / sen • depan',  'kanji_school', 7, 3, 'Kaki melangkah maju di barisan depan — duluan / depan.', '先週', 'senshuu', 'minggu lalu'),
    ('年', 'kanji', 'toshi / nen • tahun', 'kanji_school', 7, 4, 'Panen padi setahun sekali yang digotong petani — tahun.', '今年', 'kotoshi', 'tahun ini'),
    ('本', 'kanji', 'hon • buku / asal',   'kanji_school', 7, 5, 'Pohon (木) dengan tanda garis di akarnya — asal / buku.', '本屋', 'honya', 'toko buku'),

    -- Row 8: Tempat & Negara
    ('国', 'kanji', 'kuni / koku • negara','kanji_place', 8, 1, 'Permata berharga (玉) dijaga batas wilayah kotak — negara.', '外国', 'gaikoku', 'luar negeri'),
    ('外', 'kanji', 'soto / gai • luar',   'kanji_place', 8, 2, 'Bulan sore (夕) dan tongkat penunjuk berada di luar rumah.', '外国人', 'gaikokujin', 'orang asing'),
    ('駅', 'kanji', 'eki • stasiun',       'kanji_place', 8, 3, 'Kuda pos (馬) beristirahat di perhentian — stasiun kereta.', '東京駅', 'toukyoueki', 'Stasiun Tokyo'),
    ('店', 'kanji', 'mise / ten • toko',   'kanji_place', 8, 4, 'Bangunan beratap miring dengan etalase barang di bawahnya — toko.', '店員', 'tenin', 'pegawai toko'),
    ('社', 'kanji', 'sha • perusahaan',    'kanji_place', 8, 5, 'Altar (示) dan tanah (土) tempat komunitas berkumpul — kantor / kuil.', '会社', 'kaisha', 'perusahaan'),

    -- Row 9: Aktivitas Harian
    ('行', 'kanji', 'iku / kou • pergi',   'kanji_action1', 9, 1, 'Persimpangan jalan kota tempat orang melangkah pergi.', '行く', 'iku', 'pergi'),
    ('来', 'kanji', 'kuru / rai • datang', 'kanji_action1', 9, 2, 'Tanaman gandum tumbuh menyambut tamu yang datang.', '来る', 'kuru', 'datang'),
    ('食', 'kanji', 'taberu / shoku • makan','kanji_action1', 9, 3, 'Atap tudung saji di atas mangkuk nasi hangat — makan.', '食べる', 'taberu', 'makan'),
    ('飲', 'kanji', 'nomu / in • minum',   'kanji_action1', 9, 4, 'Seseorang membuka mulut meneguk minuman di sebelah kiri — minum.', '飲む', 'nomu', 'minum'),
    ('見', 'kanji', 'miru / ken • lihat',  'kanji_action1', 9, 5, 'Mata besar (目) berdiri di atas dua kaki berjalan — melihat.', '見る', 'miru', 'melihat'),

    -- Row 10: Komunikasi & Kerja
    ('聞', 'kanji', 'kiku / bun • dengar', 'kanji_action2', 10, 1, 'Telinga (耳) menempel di balik pintu (門) untuk mendengar.', '聞く', 'kiku', 'mendengar / bertanya'),
    ('読', 'kanji', 'yomu / doku • baca',  'kanji_action2', 10, 2, 'Kata-kata (言) di sebelah kiri dibaca berulang-ulang.', '読む', 'yomu', 'membaca'),
    ('書', 'kanji', 'kaku / sho • tulis',  'kanji_action2', 10, 3, 'Tangan memegang kuas di atas kertas matahari (日) — menulis.', '書く', 'kaku', 'menulis'),
    ('話', 'kanji', 'hanasu / wa • bicara','kanji_action2', 10, 4, 'Kata-kata (言) bertemu lidah (舌) — berbicara / cerita.', '電話', 'denwa', 'telepon'),
    ('休', 'kanji', 'yasumu / kyuu • istirahat','kanji_action2', 10, 5, 'Orang (亻) bersandar santai di bawah pohon (木) — istirahat.', '休み', 'yasumi', 'libur / istirahat')
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

COMMIT;
