import type {
  CurriculumResponse,
  LessonNodeResponse,
} from '@/features/curriculum/types/curriculum'

export type N5StageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface N5UnitStudyGuide {
  unitNumber: number
  stageNumber: N5StageNumber
  stageTitle: string
  stageSubtitle: string
  isStageStart?: boolean
  unitSummary: string
  theoryTips: [string, string, string]
  contrastiveWarning: string
  kanaLink: '/kana/hiragana' | '/kana/katakana' | '/kana/kanji'
  kanaLabel: string
  flashcardDeckSlug: string
  flashcardLabel: string
  grammarCode: string
  grammarLabel: string
}

const STAGE_META: Record<N5StageNumber, { title: string; subtitle: string }> = {
  1: {
    title: 'Fondasi Huruf & Kalimat Pertama',
    subtitle: 'Kuasai 46 Hiragana beserta bunyi variasinya sambil berlatih menyapa dan menyusun kalimat pertama.',
  },
  2: {
    title: 'Identitas, Keluarga, Angka & Jadwal',
    subtitle: 'Mulai baca Katakana dan 25+ Kanji dasar untuk menyebut nama negara, cara hitung benda, jam, dan hari.',
  },
  3: {
    title: 'Rutinitas Harian & Aktivitas Sopan',
    subtitle: 'Ceritakan kegiatan sehari-hari, bedakan penanda tempat dan alat, ajak teman, serta bahas transportasi.',
  },
  4: {
    title: 'Ruang, Keberadaan & Kata Sifat',
    subtitle: 'Tuntaskan seluruh 46 Katakana sambil belajar letak benda, belanja pakaian, sifat benda, dan cuaca.',
  },
  5: {
    title: 'Bentuk Sambung, Izin & Kewajiban',
    subtitle: 'Pelajari cara meminta tolong dengan sopan, meminta izin, aturan larangan, berobat di klinik, dan perubahan keadaan.',
  },
  6: {
    title: 'Lampau, Pengalaman, Kamus & Gaya Santai',
    subtitle: 'Ceritakan kejadian lampau dan pengalaman, bahas hobi dengan bentuk kamus, sampaikan opini, serta gaya bicara santai.',
  },
  7: {
    title: 'Keinginan, Saling Bantu & Simulasi JLPT N5',
    subtitle: 'Ungkapkan keinginan, tujuan pergi, budaya saling membantu, hingga simulasi penuh kesiapan ujian JLPT N5.',
  },
}

export const N5_UNIT_STUDY_GUIDES: N5UnitStudyGuide[] = [
  // ── STAGE 1 (Units 1–5) ────────────────────────────────────────────────────
  {
    unitNumber: 1,
    stageNumber: 1,
    stageTitle: STAGE_META[1].title,
    stageSubtitle: STAGE_META[1].subtitle,
    isStageStart: true,
    unitSummary: 'Mulai dari 0: kenali 10 huruf Hiragana pertama (あ–こ) dan langsung baca kata 2–3 huruf pertamamu.',
    theoryTips: [
      'Aksara: Fokus 5 vokal (あ・い・う・え・お) dan 5 deret K (か・き・く・け・こ).',
      'Kosakata: Rangkai bunyi menjadi kata nyata langsung seperti あか (merah), いけ (kolam), かお (wajah).',
      'Grammar: Belum ada konjugasi berat — latih kepekaan telinga terhadap vokal pendek Jepang.',
    ],
    contrastiveWarning:
      'Jangan tertukar き (ki, 2 garis melintang di atas batang) dengan さ (sa, hanya 1 garis melintang)!',
    kanaLink: '/kana/hiragana',
    kanaLabel: 'Hiragana あ–こ',
    flashcardDeckSlug: 'hiragana-vokal-dan-k',
    flashcardLabel: 'Hiragana 1: Vokal & K',
    grammarCode: 'GP-JA-N5-001',
    grammarLabel: 'Pola A は B です',
  },
  {
    unitNumber: 2,
    stageNumber: 1,
    stageTitle: STAGE_META[1].title,
    stageSubtitle: STAGE_META[1].subtitle,
    unitSummary: 'Kuasai 15 Hiragana baru (さ–の) sembari berlatih salam pagi–malam & menunjuk benda dekat (これ/それ).',
    theoryTips: [
      'Aksara: Perhatikan bunyi pengecualian di deret S & T: bukan "si/ti/tu", melainkan し (shi), ち (chi), dan つ (tsu).',
      'Kosakata: Hafalkan sapaan inti おはよう, こんにちは, ありがとう + kata tunjuk これ (ini) / それ (itu dekat).',
      'Grammar: Pasangkan salam & tunjuk benda sebelum masuk partikel topik は.',
    ],
    contrastiveWarning:
      'Awas terbalik ち (chi, perut menghadap kanan seperti angka 5) vs さ (sa, melengkung ke bawah dengan 1 palang)! Dan di salam malam こんばんは ditulis pakai huruf は namun dibaca "konban-WA".',
    kanaLink: '/kana/hiragana',
    kanaLabel: 'Hiragana さ–の',
    flashcardDeckSlug: 'hiragana-s-t-n',
    flashcardLabel: 'Hiragana 2: S, T & N',
    grammarCode: 'GP-JA-N5-001',
    grammarLabel: 'Kalimat Nominal は・です',
  },
  {
    unitNumber: 3,
    stageNumber: 1,
    stageTitle: STAGE_META[1].title,
    stageSubtitle: STAGE_META[1].subtitle,
    unitSummary: 'Pelajari baris H, M & Y (は–よ) dan susun kalimat perkenalan diri penuh pertama: [Saya] は [Nama] です.',
    theoryTips: [
      'Aksara: Dalam deret H, huruf ふ dibaca "fu" lembut (hembusan bibir tanpa menggigit gigi bawah).',
      'Kosakata: Kosakata perkenalan diri: わたし (saya), がくせい (pelajar), せんせい (guru), はじめまして.',
      'Grammar: Rumus inti [Topik] は [Identitas] です. Jika berfungsi sebagai penanda topik, は wajib dibaca "wa"!',
    ],
    contrastiveWarning:
      'Bedakan dua huruf kembar berikal: は (ha/wa, kaki kanan punya simpul ke kanan) vs ほ (ho, punya DUA garis melintang atas) vs ま (ma, tanpa tiang kiri terpisah)!',
    kanaLink: '/kana/hiragana',
    kanaLabel: 'Hiragana は–よ',
    flashcardDeckSlug: 'hiragana-h-m-y',
    flashcardLabel: 'Hiragana 3: H, M & Y',
    grammarCode: 'GP-JA-N5-001',
    grammarLabel: 'Topik は + です',
  },
  {
    unitNumber: 4,
    stageNumber: 1,
    stageTitle: STAGE_META[1].title,
    stageSubtitle: STAGE_META[1].subtitle,
    unitSummary: 'Tuntaskan 46 Hiragana Gojūon (ら–ん), nyatakan kewarganegaraan (～じん) & bahasa (～ご), serta lengkapkan これ/それ/あれ.',
    theoryTips: [
      'Aksara: Lafal R Jepang (ら・り・る・れ・ろ) berada di antara R lembut dan L — ujung lidah menyentuh langit-langit sekali.',
      'Kosakata: Tambahakn ～じん (orang negara) & ～ご (bahasa), misal インドネシアじん & にほんご.',
      'Grammar: を hanya dipakai sebagai penanda objek kata kerja (dibaca "o"); あれ menunjuk benda jauh dari kedua pembicara.',
    ],
    contrastiveWarning:
      'Hati-hati trio mirip れ (re, ekor menyapu keluar ke kanan), わ (wa, perut menutup masuk seperti balon), dan ね (ne, punya simpul kecil di ujung bawah)!',
    kanaLink: '/kana/hiragana',
    kanaLabel: 'Hiragana ら–ん',
    flashcardDeckSlug: 'hiragana-r-w-n',
    flashcardLabel: 'Hiragana 4: R, W & ん',
    grammarCode: 'GP-JA-N5-001',
    grammarLabel: 'Identitas & Pertanyaan か',
  },
  {
    unitNumber: 5,
    stageNumber: 1,
    stageTitle: STAGE_META[1].title,
    stageSubtitle: STAGE_META[1].subtitle,
    unitSummary: 'Kuasai tanda petik (゛), bulat (゜), konsonan ganda (っ), huruf gabung (きゃ), & kalimat negatif/tanya sebelum Ujian Tahap 1.',
    theoryTips: [
      'Aksara: Tenten (゛) mengubah bunyi bening → bersuara (k→g, s→z, t→d, h→b); Maru (゜) hanya untuk baris H → P.',
      'Kosakata: Latih kontras makna lewat tsu kecil: きて (datanglah) vs きって (prangko).',
      'Grammar: Negatif sopan nominal adalah ～ではありません / ～じゃありません; kalimat tanya cukup tambah か di akhir.',
    ],
    contrastiveWarning:
      'Jangan membaca つ besar sama dengan っ kecil! きって punya jeda 1 ketukan penuh di konsonan "t" sebelum berbunyi "te".',
    kanaLink: '/kana/hiragana',
    kanaLabel: 'Tenten & Yōon',
    flashcardDeckSlug: 'hiragana-dakuten-yoon',
    flashcardLabel: 'Hiragana 5: Dakuten & Yōon',
    grammarCode: 'GP-JA-N5-002',
    grammarLabel: 'Negatif ではありません & か',
  },

  // ── STAGE 2 (Units 6–10) ───────────────────────────────────────────────────
  {
    unitNumber: 6,
    stageNumber: 2,
    stageTitle: STAGE_META[2].title,
    stageSubtitle: STAGE_META[2].subtitle,
    isStageStart: true,
    unitSummary: 'Hubungkan dua benda memakai partikel の, bedakan これ vs この, dan hafal benda sekitar kelas & kamar.',
    theoryTips: [
      'Aksara: Mulai biasakan membaca kalimat utuh dengan kombinasi Hiragana murni tanpa bantuan spasi panjang.',
      'Kosakata: Benda harian tas & meja: ほん (buku), かぎ (kunci), かばん (tas), つくえ (meja), けいたい (ponsel).',
      'Grammar: [Pemilik/Kategori] の [Benda] dibalik urutannya dibanding Indonesia ("buku saya" = わたしの ほん).',
    ],
    contrastiveWarning:
      'これ / それ / あれ berdiri SENDIRI sebelum は (これは 本です), sedangkan この / その / あの WAJIB langsung diikuti kata benda (この 本は 高いです)!',
    kanaLink: '/kana/hiragana',
    kanaLabel: 'Review Hiragana',
    flashcardDeckSlug: 'benda-rumah-kelas',
    flashcardLabel: 'Benda Sekitar & Kelas',
    grammarCode: 'GP-JA-N5-003',
    grammarLabel: 'Kepemilikan の & この',
  },
  {
    unitNumber: 7,
    stageNumber: 2,
    stageTitle: STAGE_META[2].title,
    stageSubtitle: STAGE_META[2].subtitle,
    unitSummary: 'Bedakan sebutan keluarga sendiri vs keluarga orang lain sekaligus mulai menguasai 8 Kanji manusia N5.',
    theoryTips: [
      'Aksara: Kanji tahap 1 bertumpu pada gambar: 人 (orang), 男 (tenaga di sawah = pria), 女 (perempuan), 子 (anak).',
      'Kosakata: Keluarga sendiri: ちち / はは / あに / あね; keluarga orang lain (pakai お/さん): おとうさん / おかあさん.',
      'Grammar: Akiran さん tidak pernah dipakai untuk nama atau anggota keluarga sendiri!',
    ],
    contrastiveWarning:
      'Saat berbicara dengan teman, jangan menyebut ayah sendiri sebagai おとうさん — gunakan ちち untuk keluarga sendiri dan おとうさん untuk ayah lawan bicara.',
    kanaLink: '/kana/kanji',
    kanaLabel: '8 Kanji Manusia',
    flashcardDeckSlug: 'kanji-n5-manusia-keluarga',
    flashcardLabel: 'Kanji N5: Manusia & Keluarga',
    grammarCode: 'GP-JA-N5-003',
    grammarLabel: 'Relasi の & Profesi',
  },
  {
    unitNumber: 8,
    stageNumber: 2,
    stageTitle: STAGE_META[2].title,
    stageSubtitle: STAGE_META[2].subtitle,
    unitSummary: 'Masuk ke Katakana bagian 1 (ア–ト) untuk membaca nama negara & katakana populer, angka 1–100, serta Kanji 一–五.',
    theoryTips: [
      'Aksara: Katakana berujung lebih tajam untuk kata serapan asing & nama negara (アメリカ, インドネシア, タイ).',
      'Kosakata: Angka dasar 1–10 (いち s/d じゅう) plus cara bentuk puluhan 21–99 ([Puluhan] じゅう [Satuan]).',
      'Grammar: Sebutkan umur memakai angka + さい (misal 20 tahun istimewa: はたち).',
    ],
    contrastiveWarning:
      'Kenali bacaan spesial angka: 4 dibaca よん / し (hindari し saat hitung benda), 7 = なな / しち, dan gabungkan hanya yang lazim dipakai di percakapan.',
    kanaLink: '/kana/katakana',
    kanaLabel: 'Katakana ア–ト',
    flashcardDeckSlug: 'katakana-a-to',
    flashcardLabel: 'Katakana 1: ア–ト',
    grammarCode: 'GP-JA-N5-001',
    grammarLabel: 'Identitas Negara & Umur',
  },
  {
    unitNumber: 9,
    stageNumber: 2,
    stageTitle: STAGE_META[2].title,
    stageSubtitle: STAGE_META[2].subtitle,
    unitSummary: 'Kuasai angka ratusan–puluhan ribu (百・千・万), mata uang Yen (円), & kata bantu hitung wajib N5.',
    theoryTips: [
      'Aksara: Kanji nominal penting untuk struk belanja: 百 (100), 千 (1.000), 万 (10.000), 円 (Yen).',
      'Kosakata: Beda kata bantu hitung menurut bentuk benda: つ (umum), 人 (orang), 枚 (tipis), 本 (silinder panjang), 冊 (buku).',
      'Grammar: Pola tanya jumlah "berapa buah/orang/harga": いくつ, なんにん, いくらですか.',
    ],
    contrastiveWarning:
      'Perhatikan perubahan bunyi pada 300 (さんびゃく), 600 (ろっぴゃく), 800 (はっぴゃく) & 3.000 (さんぜん) — serta 1 orang (ひとり), 2 orang (ふたり)!',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Kanji Angka & 円',
    flashcardDeckSlug: 'kanji-n5-angka-hitung',
    flashcardLabel: 'Kanji N5: Angka & Hitungan',
    grammarCode: 'GP-JA-N5-003',
    grammarLabel: 'Nominal Harga & Counters',
  },
  {
    unitNumber: 10,
    stageNumber: 2,
    stageTitle: STAGE_META[2].title,
    stageSubtitle: STAGE_META[2].subtitle,
    unitSummary: 'Sebutkan jam, menit, 7 hari seminggu lewat Kanji Alam (日–土), partikel waktu に, & tuntaskan Ujian Tahap 2.',
    theoryTips: [
      'Aksara: 7 hari memakai elemen alam: 日 (matahari), 月 (bulan), 火 (api), 水 (air), 木 (pohon), 金 (emas), 土 (tanah).',
      'Kosakata: Jam (～じ), menit (～ふん / ～ぷん), serta bulan (～がつ) & tanggal spesial (ついたち, ふつか...).',
      'Grammar: Waktu spesifik (jam 7, hari Senin, tgl 5) wajib memakai partikel に, sedangkan kata relatif (hari ini/besok) TANPA に!',
    ],
    contrastiveWarning:
      'Kapan TIDAK boleh memakai に? Jangan tulis きょう に atau あした に! Waktu relatif seperti きょう (hari ini), あした (besok), まいにち (setiap hari) langsung berdiri tanpa に.',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Kanji Hari & Waktu',
    flashcardDeckSlug: 'kanji-n5-waktu-alam',
    flashcardLabel: 'Kanji N5: Waktu & Alam',
    grammarCode: 'GP-JA-N5-008',
    grammarLabel: 'Partikel Waktu Spesifik に',
  },

  // ── STAGE 3 (Units 11–15) ──────────────────────────────────────────────────
  {
    unitNumber: 11,
    stageNumber: 3,
    stageTitle: STAGE_META[3].title,
    stageSubtitle: STAGE_META[3].subtitle,
    isStageStart: true,
    unitSummary: 'Baca menu kafe dalam Katakana Batch 2 (ナ–ホ) & langsung praktik memesan makanan memakai partikel objek を.',
    theoryTips: [
      'Aksara: Latih baris N & H Katakana (ナ・ニ・ヌ・ネ・ノ・ハ・ヒ・フ・ヘ・ホ) di menu seperti コーヒー, ケーキ, ハンバーグ.',
      'Kosakata: Makanan & minuman populer plus ungkapan restoran: ください / おねがいします.',
      'Grammar: Rumus verba transitif: [Objek] を [Kata Kerja] — huruf を tetap dibaca "o" murni.',
    ],
    contrastiveWarning:
      'Jangan tertukar penanda subjek/topik は dengan penanda objek langsung を: saya (わたし は) minum kopi (コーヒー を 飲みます).',
    kanaLink: '/kana/katakana',
    kanaLabel: 'Katakana ナ–ホ',
    flashcardDeckSlug: 'katakana-na-ho',
    flashcardLabel: 'Katakana 2: ナ–ホ',
    grammarCode: 'GP-JA-N5-004',
    grammarLabel: 'Partikel Objek を',
  },
  {
    unitNumber: 12,
    stageNumber: 3,
    stageTitle: STAGE_META[3].title,
    stageSubtitle: STAGE_META[3].subtitle,
    unitSummary: 'Ubah kata kerja ke bentuk sopan aktif (～ます) dan negatif (～ません), plus kata frekuensi & Kanji aksi pertama.',
    theoryTips: [
      'Aksara: Kenali Kanji aksi sehari-hari: 食 (makan), 飲 (minum), 見 (lihat), 聞 (dengar), 読 (baca), 書 (tulis).',
      'Kosakata: Adverbia frekuensi: いつも (selalu), よく (sering), ときどき (kadang-kadang), あまり (+ negatif = jarang).',
      'Grammar: 4 pilar kala bentuk sopan: ～ます (sekarang/akan), ～ません (tidak), ～ました (lampau), ～ませんでした (tidak di masa lalu).',
    ],
    contrastiveWarning:
      'Kata あまり (jarang) dan ぜんぜん (sama sekali tidak) WAJIB diikuti verba bentuk negatif (～ません / ～ませんでした), tidak boleh ～ます!',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Kanji Aksi Dasar',
    flashcardDeckSlug: 'kata-kerja-dasar',
    flashcardLabel: 'Kata Kerja Dasar ～ます',
    grammarCode: 'GP-JA-N5-006',
    grammarLabel: 'Bentuk Sopan ～ます / ～ません',
  },
  {
    unitNumber: 13,
    stageNumber: 3,
    stageTitle: STAGE_META[3].title,
    stageSubtitle: STAGE_META[3].subtitle,
    unitSummary: 'Kuasai dua fungsi utama partikel で (lokasi aktivitas aktif & alat/bahasa) dan kontrasnya melawan partikel に.',
    theoryTips: [
      'Aksara: Kanji penunjang aktivitas: 校 (sekolah), 店 (toko), 書 (menulis), 語 (bahasa).',
      'Kosakata: Tempat beraktivitas (図書館 perpustakaan, 会社 kantor) + alat & bahasa (はし sumpit, にほんご bahasa Jepang).',
      'Grammar: Tempat untuk MELAKUKAN kegiatan pakai で (カフェで 勉強します), sedangkan sekadar ADA pakai に (部屋に あります).',
    ],
    contrastiveWarning:
      'Jebakan klasik pemula: 駅で (melakukan aksi di stasiun) vs 駅に (berada/tiba di stasiun). Selain tempat aksi, alat dan bahasa juga pakai で (スプーンで / 日本語で)!',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Kanji Aksi & Tempat',
    flashcardDeckSlug: 'kanji-n5-aksi-sifat',
    flashcardLabel: 'Kanji N5: Aksi & Sifat',
    grammarCode: 'GP-JA-N5-007',
    grammarLabel: 'Partikel で (Lokasi & Alat)',
  },
  {
    unitNumber: 14,
    stageNumber: 3,
    stageTitle: STAGE_META[3].title,
    stageSubtitle: STAGE_META[3].subtitle,
    unitSummary: 'Ajak teman dengan sopan (～ませんか vs ～ましょう), tawarkan bantuan (～ましょうか), & sambung kalimat rapi.',
    theoryTips: [
      'Aksara: Baca kalimat ajakan utuh lengkap dengan partikel intonasi naik か di akhir.',
      'Kosakata: Konjungsi penting: そして (lalu/dan), それから (setelah itu), でも / しかし (tetapi).',
      'Grammar: ～ませんか menanyakan kesediaan lawan bicara (lebih halus); ～ましょう mengajak dengan asumsi setuju ("Ayo!").',
    ],
    contrastiveWarning:
      'Hati-hati perbedaan ～ましょう ("Ayo kita lakukan bareng") dengan ～ましょうか ("Biar saya bantu melakukannya untukmu?").',
    kanaLink: '/kana/hiragana',
    kanaLabel: 'Review Baca Cepat',
    flashcardDeckSlug: 'makanan-minuman',
    flashcardLabel: 'Makanan, Minuman & Ajakan',
    grammarCode: 'GP-JA-N5-013',
    grammarLabel: 'Ajakan ～ませんか / ～ましょう',
  },
  {
    unitNumber: 15,
    stageNumber: 3,
    stageTitle: STAGE_META[3].title,
    stageSubtitle: STAGE_META[3].subtitle,
    unitSummary: 'Jelaskan rute transportasi naik kereta/bus (で), tujuan (へ/に), rentang waktu/jarak (から～まで), & Ujian Tahap 3.',
    theoryTips: [
      'Aksara: Kanji arah perjalanan: 行 (pergi), 来 (datang), 駅 (stasiun) + Katakana transportasi (バス, タクシー).',
      'Kosakata: Kendaraan & rute: でんしゃ (kereta), ちかてつ (kereta bawah tanah), あるいて (jalan kaki), ひとり / ともだち.',
      'Grammar: Kendaraan pakai で (kecuali jalan kaki あるいて TANPA で!), tujuan pakai へ (dibaca "e") atau に, rentang pakai から ～ まで.',
    ],
    contrastiveWarning:
      'Partikel arah へ ditulis huruf Hiragana "he" namun WAJIB dibaca "e"! Dan jalan kaki "あるいて" tidak memakai partikel で.',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Kanji 行・来・駅',
    flashcardDeckSlug: 'tempat-transportasi',
    flashcardLabel: 'Tempat & Transportasi',
    grammarCode: 'GP-JA-N5-005',
    grammarLabel: 'Arah へ/に & Rentang から～まで',
  },

  // ── STAGE 4 (Units 16–20) ──────────────────────────────────────────────────
  {
    unitNumber: 16,
    stageNumber: 4,
    stageTitle: STAGE_META[4].title,
    stageSubtitle: STAGE_META[4].subtitle,
    isStageStart: true,
    unitSummary: 'Pelajari Katakana Batch 3 (マ–ロ) untuk membaca fasilitas kota sekaligus kuasai あります (benda) vs います (makhluk hidup).',
    theoryTips: [
      'Aksara: Baris M, Y, R Katakana (マ・ミ・ム・メ・モ・ヤ・ユ・ヨ・ラ・リ・ル・レ・ロ) sering muncul di kata スーパー, ホテル, レストラン.',
      'Kosakata: Fasilitas umum kota + hewan peliharaan/anggota keluarga di rumah.',
      'Grammar: Pola keberadaan benda/orang memakai が, BUKAN を: [Tempat] に [Subjek] が あります / います.',
    ],
    contrastiveWarning:
      'Jangan pakai を sebelum あります / います! Robot, tanaman & buku (tidak bergerak sendiri) memakai あります; orang, kucing & anjing memakai います.',
    kanaLink: '/kana/katakana',
    kanaLabel: 'Katakana マ–ロ',
    flashcardDeckSlug: 'katakana-ma-ro',
    flashcardLabel: 'Katakana 3: マ–ロ',
    grammarCode: 'GP-JA-N5-009',
    grammarLabel: 'Keberadaan あります / います',
  },
  {
    unitNumber: 17,
    stageNumber: 4,
    stageTitle: STAGE_META[4].title,
    stageSubtitle: STAGE_META[4].subtitle,
    unitSummary: 'Deskripsikan posisi spasial benda di ruangan dengan Kanji arah serta daftar lengkap と vs daftar contoh や.',
    theoryTips: [
      'Aksara: 8 Kanji arah & posisi spasial: 上 (atas), 下 (bawah), 中 (dalam), 外 (luar), 前 (depan), 後 (belakang), 右 (kanan), 左 (kiri).',
      'Kosakata: となり (di sebelah persis), ちかく (di dekat), あいだ (di antara A dan B).',
      'Grammar: Rumus posisi: [Acuan] の [Posisi] に [Benda] が あります. Daftar lengkap A & B pakai と; contoh tidak lengkap pakai や (～など).',
    ],
    contrastiveWarning:
      'Bedakan pasangan と vs や: [A と B] artinya HANYA ada A dan B (tuntas), sedangkan [A や B など] berarti A, B, dan benda lainnya lagi!',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Kanji Posisi & Arah',
    flashcardDeckSlug: 'arah-posisi-lokasi',
    flashcardLabel: 'Posisi, Arah & Ruangan',
    grammarCode: 'GP-JA-N5-010',
    grammarLabel: 'Daftar Lengkap と vs Contoh や',
  },
  {
    unitNumber: 18,
    stageNumber: 4,
    stageTitle: STAGE_META[4].title,
    stageSubtitle: STAGE_META[4].subtitle,
    unitSummary: 'Tuntaskan 46 huruf Katakana (ワ–ン) plus kontras huruf mirip シ/ツ vs ソ/ン sambil melatih konjugasi Kata Sifat-I (い).',
    theoryTips: [
      'Aksara: Kunci anti-ketukar シ/ツ & ソ/ン — perhatikan ARAH garis utama dan keselarasan titiknya dari samping vs atas!',
      'Kosakata: Pasangan sifat-I berlawanan: おおきい/ちいさい, たかい/やすい, あつい/さむい, おもしろい/つまらない.',
      'Grammar: Negasi Sifat-I: buang い terakhir lalu tambah くないです (kecuali いい → よくないです!).',
    ],
    contrastiveWarning:
      'Pengecualian wajib hafal! Kata sifat "baik" (いい / よい) saat negatif menjadi よくないです (BUKAN いくないです). Lampau positifnya menjadi よかったです.',
    kanaLink: '/kana/katakana',
    kanaLabel: 'Katakana ワ–ン & Kembar',
    flashcardDeckSlug: 'katakana-wa-n-special',
    flashcardLabel: 'Katakana 4: ワ–ン & Kontras',
    grammarCode: 'GP-JA-N5-011',
    grammarLabel: 'Negasi Kata Sifat-I',
  },
  {
    unitNumber: 19,
    stageNumber: 4,
    stageTitle: STAGE_META[4].title,
    stageSubtitle: STAGE_META[4].subtitle,
    unitSummary: 'Belanja warna & ukuran, gunakan どの/どんな, serta bedakan 4 verba khusus "memakai pakaian" di bahasa Jepang.',
    theoryTips: [
      'Aksara: Kanji sifat harga & ukuran (高・安・新・古・大・小) + Katakana pakaian (シャツ, セーター, コート, ネクタイ).',
      'Kosakata: Nama warna (あかい, しろい, くろい, あおい) & ungkapan belanja ("Boleh lihat ini?", "Terlalu mahal").',
      'Grammar: Kata tanya pilihan terbatas (dari 3+ barang) memakai どの [Benda], sedangkan menanyakan ciri/kriteria memakai どんな [Benda].',
    ],
    contrastiveWarning:
      'Bahasa Jepang membedakan cara memakai berdasar letak tubuh: atasan → 着ます (kimasu), bawahan/sepatu → 履きます (hakimasu), topi → かぶります, kacamata → かけます!',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Kanji Sifat & Ukuran',
    flashcardDeckSlug: 'belanja-warna-pakaian',
    flashcardLabel: 'Belanja, Warna & Pakaian',
    grammarCode: 'GP-JA-N5-011',
    grammarLabel: 'Sifat Pemilih & どの/どんな',
  },
  {
    unitNumber: 20,
    stageNumber: 4,
    stageTitle: STAGE_META[4].title,
    stageSubtitle: STAGE_META[4].subtitle,
    unitSummary: 'Kuasai Kata Sifat-Na (～な [Benda]), kala lampau Sifat-I/Na, pola kesukaan (が好き), perbandingan, & Ujian Tahap 4.',
    theoryTips: [
      'Aksara: Latih membedakan akhiran きれい・ゆうめい・すき (terlihat berakhiran -i tetapi semuanya adalah Sifat-NA!).',
      'Kosakata: Cuaca (あたたかい, すずしい, むしあつい), musim (はる/なつ/あき/ふゆ), & hobi/kesukaan.',
      'Grammar: Sifat-Na wajib pakai な saat menempel kata benda (しずかな まち) dan negasinya ～ではありません; perbandingan memakai より & のほうが.',
    ],
    contrastiveWarning:
      'Jebakan klasik JLPT N5: きれい (cantik/bersih) dan ゆうめい (terkenal) memang berakhir vokal -i, TAPI termasuk Sifat-NA — bukan きれくない, melainkan きれいではありません!',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Kanji Cuaca & Sifat',
    flashcardDeckSlug: 'kata-sifat-populer',
    flashcardLabel: 'Kata Sifat-I & Na Populer',
    grammarCode: 'GP-JA-N5-012',
    grammarLabel: 'Sifat-Na & Perbandingan より',
  },

  // ── STAGE 5 (Units 21–25) ──────────────────────────────────────────────────
  {
    unitNumber: 21,
    stageNumber: 5,
    stageTitle: STAGE_META[5].title,
    stageSubtitle: STAGE_META[5].subtitle,
    isStageStart: true,
    unitSummary: 'Jantung tatabahasa N5: kuasai aturan konjugasi Bentuk-TE (Grup 1, 2, 3), permintaan sopan (～てください), & penunjuk arah.',
    theoryTips: [
      'Aksara: Kanji arah & gedung kota (右・左・前・後・店・駅) dipakai langsung pada petunjuk belok kanan/kiri.',
      'Kosakata: Kata kerja instruksi & arah jalan (まがります belok, とまります berhenti, 見せます perlihatkan, 教えます beritahu).',
      'Grammar: Grup 2 tinggal ganti ます → て; Grup 1 ikuti kelompok bunyi akhiran ます (い/ち/り→って, み/び/に→んで, き→いて [kecuali 行きます→行って!], ぎ→いで, し→して).',
    ],
    contrastiveWarning:
      'Pengecualian nomor satu di seluruh N5: いきます (pergi) diakhiri bunyi "ki", namun bentuk-TE nya BUKAN いいて melainkan いって (行って)!',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Kanji Arah & Lokasi',
    flashcardDeckSlug: 'kanji-n5-tempat-arah',
    flashcardLabel: 'Kanji N5: Arah & Kota',
    grammarCode: 'GP-JA-N5-014',
    grammarLabel: 'Bentuk-TE & ～てください',
  },
  {
    unitNumber: 22,
    stageNumber: 5,
    stageTitle: STAGE_META[5].title,
    stageSubtitle: STAGE_META[5].subtitle,
    unitSummary: 'Rangkai dua aksi berurutan (～てから) dan kuasai dua makna ～ています (sedang berlangsung vs status hasil/pekerjaan).',
    theoryTips: [
      'Aksara: Kenali Kanji rutinitas hidup & pekerjaan (住 tinggal, 働 bekerja, 知 tahu) dalam bacaan pendek.',
      'Kosakata: Kosa kata status harian: けっこんします (menikah), すみます (tinggal), しります (tahu), もっています (punya).',
      'Grammar: Pola urutan A lalu B bisa [Aて、B] atau lebih tegas selesai dulu [Aてから、B]. Pola [Vて + います] menyatakan aksi sedang terjadi ATAU kondisi permanen.',
    ],
    contrastiveWarning:
      'Hati-hati kata kerja しります (mengetahui): jawaban "Saya tahu" adalah しっています (status), sedangkan kebalikannya "Saya tidak tahu" BUKAN しっていません melainkan しりません!',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Kanji Aksi Rutin',
    flashcardDeckSlug: 'kata-kerja-dasar',
    flashcardLabel: 'Verba Aktif & Status',
    grammarCode: 'GP-JA-N5-015',
    grammarLabel: 'Urutan ～てから & ～ています',
  },
  {
    unitNumber: 23,
    stageNumber: 5,
    stageTitle: STAGE_META[5].title,
    stageSubtitle: STAGE_META[5].subtitle,
    unitSummary: 'Berlatih dialog meminta izin (～てもいいですか), larangan tempat umum (～てはいけません), & Bentuk-NAI (～ないでください).',
    theoryTips: [
      'Aksara: Papan peringatan tempat umum N5 memakai Bentuk-TE & Kanji dasar (写真の撮影・禁煙).',
      'Kosakata: Kata kerja aturan tempat umum: とります (memotret), すいます (merokok), さわります (menyentuh), わすれます (lupa).',
      'Grammar: Cara bikin Bentuk-NAI Grup 1: ubah vokal baris -i sebelum ます ke baris -a + ない (kecuali akhiran "i" seperti かいます → かわない, bukan かあない!).',
    ],
    contrastiveWarning:
      'Saat meminta orang agar TIDAK melakukan sesuatu secara sopan, gunakan Bentuk-NAI + でください (例: わすれないでください), JANGAN campur Bentuk-TE menjadi てないで!',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Kanji Ruang Publik',
    flashcardDeckSlug: 'tempat-transportasi',
    flashcardLabel: 'Aturan Tempat Umum',
    grammarCode: 'GP-JA-N5-014',
    grammarLabel: 'Izin ～てもいい & Larangan ～ないで',
  },
  {
    unitNumber: 24,
    stageNumber: 5,
    stageTitle: STAGE_META[5].title,
    stageSubtitle: STAGE_META[5].subtitle,
    unitSummary: 'Sampaikan keluhan sakit tubuh di klinik (～が いたいです) sambil membedakan kewajiban (～なければ) vs tidak perlu (～なくてもいい).',
    theoryTips: [
      'Aksara: Kanji bagian tubuh penunjang N5 (目 mata, 口 mulut, 耳 telinga, 手 tangan, 足 kaki).',
      'Kosakata: Gejala sakit: あたまが いたい (sakit kepala), ねつが ある (demam), かぜを ひく (masuk angin), くすり (obat).',
      'Grammar: Ambil Bentuk-NAI tanpa い akhir + ければなりません (harus), atau + くてもいいです (tidak usah / boleh tidak).',
    ],
    contrastiveWarning:
      'Jangan keliru antara larangan vs tidak wajib! ～てはいけません artinya DILARANG keras, sedangkan ～なくてもいいです artinya TIDAK PERLU (bebas mau lakukan atau tidak).',
    kanaLink: '/kana/hiragana',
    kanaLabel: 'Review Huruf Tubuh',
    flashcardDeckSlug: 'tubuh-kesehatan-darurat',
    flashcardLabel: 'Tubuh, Kesehatan & Klinik',
    grammarCode: 'GP-JA-N5-014',
    grammarLabel: 'Kewajiban & Boleh Tidak',
  },
  {
    unitNumber: 25,
    stageNumber: 5,
    stageTitle: STAGE_META[5].title,
    stageSubtitle: STAGE_META[5].subtitle,
    unitSummary: 'Gabungkan dua kata sifat atau status dalam satu kalimat (～くて / ～で), nyatakan perubahan (～くなる/になる), & Ujian Tahap 5.',
    theoryTips: [
      'Aksara: Baca teks pendek yang mendeskripsikan suasana kamar/kota menggunakan 2+ kata sifat tersambung.',
      'Kosakata: Kata sifat deskriptif kombinasi (明るくて 広い = terang & luas, 静かで 便利 = tenang & praktis).',
      'Grammar: Menyambung sifat: Sifat-I → ～くて; Sifat-Na & Kata Benda → ～で. Menyatakan perubahan: Sifat-I → ～くなります; Sifat-Na/Nomina → ～になります.',
    ],
    contrastiveWarning:
      'Aturan larangan klasik: jangan sambung Sifat-I dengan Sifat-I memakai と! Pakai くて untuk Sifat-I (安くて おいしい) dan で untuk Sifat-Na (親切で きれい).',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Kanji Sifat & Perubahan',
    flashcardDeckSlug: 'kata-sifat-populer',
    flashcardLabel: 'Sifat Majemuk & Perubahan',
    grammarCode: 'GP-JA-N5-011',
    grammarLabel: 'Sambung Sifat & Perubahan',
  },

  // ── STAGE 6 (Units 26–28) ──────────────────────────────────────────────────
  {
    unitNumber: 26,
    stageNumber: 6,
    stageTitle: STAGE_META[6].title,
    stageSubtitle: STAGE_META[6].subtitle,
    isStageStart: true,
    unitSummary: 'Ceritakan aktivitas akhir pekan & pengalaman hidup dengan Bentuk-TA (～たことがある), daftar acak ～たり, & urutan ～たあとで.',
    theoryTips: [
      'Aksara: Latih perubahan Kanji dalam kala lampau (行った, 食べた, 見た, した, 来た).',
      'Kosakata: Aktivitas akhir pekan & pengalaman wisata: りょこう (jalan-jalan), しゃしん (foto), のぼります (mendaki), あいます (bertemu).',
      'Grammar: Trik emas N5 — kalau sudah hafal Bentuk-TE, Bentuk-TA tinggal mengganti て→た dan で→だ! Dipakai di ～たことがある ("pernah ...") & ～たり～たりします ("melakukan ini-itu").',
    ],
    contrastiveWarning:
      'Bentuk negatif lampau tidak pakai ～たことがある melainkan memakai negasi di akhir atau langsung bentuk lampau! Dan setelah daftar ～たり～たり wajib ditutup oleh します/しました.',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Review Kanji Aktivitas',
    flashcardDeckSlug: 'hobi-cuaca-musim',
    flashcardLabel: 'Hobi, Cuaca & Pengalaman',
    grammarCode: 'GP-JA-N5-015',
    grammarLabel: 'Bentuk-TA, Pengalaman & ～たり',
  },
  {
    unitNumber: 27,
    stageNumber: 6,
    stageTitle: STAGE_META[6].title,
    stageSubtitle: STAGE_META[6].subtitle,
    unitSummary: 'Konjugasi verba ke Bentuk Kamus (辞書形) untuk menyatakan kemampuan (ことができます), hobi, sebelum (～まえに), & ketika (～とき).',
    theoryTips: [
      'Aksara: Kenali bentuk kamus verba inti di kamus Jepang (飲む, 食べる, する, 来る / くる).',
      'Kosakata: Hobi & keterampilan (ひきます bermain piano/gitar, およぎます berenang, うんてんします menyetir).',
      'Grammar: Mengubah dari ～ます ke Kamus: Grup 2 tinggal ganti ます → る; Grup 1 ubah bunyi -i ke -u (のみます → のむ); します → する, きます → くる!',
    ],
    contrastiveWarning:
      'Hati-hati pola "sebelum melakukan A" (まえに): walaupun kalimat berakhir di masa lampau, kata kerja di depan まえに SELALU menggunakan Bentuk Kamus (寝る まえに, BUKAN 寝た まえに)!',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Review Kanji Verba',
    flashcardDeckSlug: 'kata-kerja-dasar',
    flashcardLabel: 'Bentuk Kamus & Hobi',
    grammarCode: 'GP-JA-N5-016',
    grammarLabel: 'Bentuk Kamus, まえに & とき',
  },
  {
    unitNumber: 28,
    stageNumber: 6,
    stageTitle: STAGE_META[6].title,
    stageSubtitle: STAGE_META[6].subtitle,
    unitSummary: 'Kuasai Kalimat Kasual (普通形) sebelum と思います/と言いました serta anak kalimat penjelas benda sebelum Ujian Tahap 6.',
    theoryTips: [
      'Aksara: Baca dialog kasual akrab dan artikel mini yang memuat anak kalimat penjelas sebelum nomina.',
      'Kosakata: Frasa pendapat & kutipan: たぶん (mungkin), きっと (pasti), ほんとうに (sungguh), と思います (menurut saya).',
      'Grammar: Sebelum と思います atau penjelas kata benda, predikat harus diubah ke Gaya Biasa/Kasual (です→だ, でした→だった, ～ます→Kamus, ～ません→Bentuk-NAI).',
    ],
    contrastiveWarning:
      'Jangan pakai です di dalam anak kalimat atau tepat sebelum と思います! Salah: 便利だと思います bukan 便利ですと思います; untuk memodifikasi kata benda pun きのう 見た 映画 (bukan 見ました 映画).',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Review Kanji Bacaan',
    flashcardDeckSlug: 'hobi-cuaca-musim',
    flashcardLabel: 'Opini, Cuaca & Deskripsi',
    grammarCode: 'GP-JA-N5-015',
    grammarLabel: 'Kalimat Kasual & と思います',
  },

  // ── STAGE 7 (Units 29–30) ──────────────────────────────────────────────────
  {
    unitNumber: 29,
    stageNumber: 7,
    stageTitle: STAGE_META[7].title,
    stageSubtitle: STAGE_META[7].subtitle,
    isStageStart: true,
    unitSummary: 'Ekspresikan keinginan (～たい vs ほしい), tujuan pergi (～に行く), alasan (から/ので), & sudut pandang memberi-menerima.',
    theoryTips: [
      'Aksara: Gabungkan Kanji keluarga, benda, & verba dalam dialog hadiah, rencana kerja, dan undangan.',
      'Kosakata: Verba interaksi sosial: あげます (memberi ke orang lain), もらいます (menerima), くれます (orang memberi ke SAYA/keluarga saya).',
      'Grammar: Ingin MELAKUKAN aksi pakai [Akar Verba] + たいです (konjugasi persis Sifat-I!), ingin MEMILIKI benda pakai ～が ほしいです.',
    ],
    contrastiveWarning:
      'Pembeda krusial pemberi hadiah: ketika orang lain memberi hadiah KEPADA SAYA, tidak boleh memakai あげます melainkan WAJIB くれます (teman-san ga watashi ni kuremashita)!',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Kanji Lengkap N5',
    flashcardDeckSlug: 'keluarga-orang-profesi',
    flashcardLabel: 'Interaksi & Saling Bantu',
    grammarCode: 'GP-JA-N5-016',
    grammarLabel: 'Keinginan ～たい & Tujuan ～に',
  },
  {
    unitNumber: 30,
    stageNumber: 7,
    stageTitle: STAGE_META[7].title,
    stageSubtitle: STAGE_META[7].subtitle,
    unitSummary: 'Konsolidasi total 50+ Kanji, seluruh 46 Hiragana + 46 Katakana, & 16+ tatabahasa JLPT N5 sebelum Ujian Akhir N5.',
    theoryTips: [
      'Aksara: Uji campuran Kanji + Okurigana (misal 行く・食べる・高い・安い・静か) tanpa tergelincir huruf kembar.',
      'Kosakata: Tinjau ulang kata-kata jebakan antar unit: counters, kata sifat pemilih, keterangan frekuensi, & kata sambung.',
      'Grammar: Validasi pemilihan partikel lintas kasus (は vs が, に vs で, を vs が) serta perubahan kata kerja (～ます / て / ない / た / Kamus / たい).',
    ],
    contrastiveWarning:
      'Siap tempur JLPT N5? Di tahap akhir ini baca seluruh kalimat sampai selesai sebelum memilih partikel — perhatikan penanda kala (きのう vs あした) di awal atau akhir kalimat!',
    kanaLink: '/kana/kanji',
    kanaLabel: 'Ulang Semua Aksara',
    flashcardDeckSlug: 'salam-sapaan-sehari-hari',
    flashcardLabel: 'Review Lintas Kosakata N5',
    grammarCode: 'GP-JA-N5-016',
    grammarLabel: 'Konsolidasi 16+ Grammar N5',
  },
]

const STUDY_GUIDE_BY_UNIT = new Map<number, N5UnitStudyGuide>(
  N5_UNIT_STUDY_GUIDES.map((guide) => [guide.unitNumber, guide])
)

/**
 * Returns the structured study guide metadata (Stage, Aksara/Flashcard/Grammar shortcuts,
 * 3-bullet summary, and contrastive warning) for a JLPT N5 Micro-Unit (1..30).
 */
export function getUnitStudyGuide(unitNumber: number): N5UnitStudyGuide | null {
  return STUDY_GUIDE_BY_UNIT.get(unitNumber) ?? null
}

export interface CurriculumActiveGuidance {
  unitNumber: number
  lessonRoute: string
  lessonTitle: string | null
  flashcardRoute: string
  flashcardLabel: string | null
  kanaRoute: string
}

function cleanGuidanceLessonTitle(title: string, shortTitle?: string): string {
  if (shortTitle?.trim()) return shortTitle.trim()
  return title.replace(/^(?:pelajaran|lesson)\s*\d+\s*[:.\-–—]\s*/i, '').trim() || title
}

/**
 * Resolves the user's current active curriculum micro-unit and recommended
 * Unit-matched Kana / Flashcard / Lesson routes from a CurriculumResponse.
 */
export function resolveCurriculumActiveGuidance(
  curriculum?: CurriculumResponse | null
): CurriculumActiveGuidance {
  const defaultGuide = getUnitStudyGuide(1)
  const fallback: CurriculumActiveGuidance = {
    unitNumber: 1,
    lessonRoute: '/curriculum',
    lessonTitle: null,
    flashcardRoute: defaultGuide ? `/flashcards?deck=${defaultGuide.flashcardDeckSlug}` : '/flashcards',
    flashcardLabel: defaultGuide?.flashcardLabel ?? null,
    kanaRoute: defaultGuide?.kanaLink ?? '/kana/hiragana',
  }

  if (!curriculum) return fallback

  const langCode = curriculum.language?.code
  const levelCode = curriculum.level?.code?.toUpperCase()
  const isJapaneseN5 = (!langCode || langCode === 'ja') && (!levelCode || levelCode === 'N5')

  const curriculumUnits = (curriculum.units ?? []).filter((u) => u.unit_type === 'curriculum')
  let activeUnitNumber = 1
  let chosenLesson: LessonNodeResponse | null = null

  for (let idx = 0; idx < curriculumUnits.length; idx += 1) {
    const unit = curriculumUnits[idx]
    const unitNum = unit.order_index > 0 ? unit.order_index : idx + 1
    for (const lesson of unit.lessons ?? []) {
      if (curriculum.current_lesson_id && lesson.id === curriculum.current_lesson_id) {
        activeUnitNumber = unitNum
        chosenLesson = lesson
        break
      }
      if (!chosenLesson && lesson.is_unlocked && !lesson.is_completed) {
        activeUnitNumber = unitNum
        chosenLesson = lesson
      }
    }
    if (curriculum.current_lesson_id && chosenLesson?.id === curriculum.current_lesson_id) {
      break
    }
  }

  const unitGuide = isJapaneseN5 ? getUnitStudyGuide(activeUnitNumber) ?? defaultGuide : null

  return {
    unitNumber: activeUnitNumber,
    lessonRoute: chosenLesson ? `/learn/${chosenLesson.slug || chosenLesson.id}` : '/curriculum',
    lessonTitle: chosenLesson
      ? cleanGuidanceLessonTitle(chosenLesson.title, chosenLesson.short_title)
      : null,
    flashcardRoute: unitGuide
      ? `/flashcards?deck=${unitGuide.flashcardDeckSlug}`
      : '/flashcards',
    flashcardLabel: unitGuide?.flashcardLabel ?? null,
    kanaRoute: unitGuide?.kanaLink ?? '/kana/hiragana',
  }
}

/**
 * Enriches a backend daily quest route & chip label so clicking it takes the learner
 * straight to the active Micro-Unit's matching Flashcard deck or next Lesson.
 */
export function contextualizeDailyQuestTarget(
  quest: { slot_category?: string; route?: string; chip_label: string },
  guidance: CurriculumActiveGuidance
): { route: string; chipLabel: string } {
  const rawRoute = (quest.route ?? '').trim()
  const isFlashcardQuest =
    quest.slot_category === 'flashcard' || rawRoute.startsWith('/flashcard')

  if (isFlashcardQuest) {
    return {
      route: guidance.flashcardRoute,
      chipLabel: guidance.flashcardLabel
        ? `${quest.chip_label} • Unit ${guidance.unitNumber}: ${guidance.flashcardLabel}`
        : quest.chip_label,
    }
  }

  if (quest.slot_category === 'curriculum' && (rawRoute === '/curriculum' || rawRoute === '')) {
    return {
      route: guidance.lessonRoute,
      chipLabel: guidance.lessonTitle
        ? `${quest.chip_label} • Unit ${guidance.unitNumber}`
        : quest.chip_label,
    }
  }

  return {
    route: rawRoute || '/curriculum',
    chipLabel: quest.chip_label,
  }
}
