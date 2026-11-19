import type { KanaScriptType } from '@/features/curriculum/types/curriculum'

export interface LessonIntroItem {
  symbol: string
  reading: string
  meaning: string
  mnemonic: string
  speakText: string
}

export interface LessonIntroDeck {
  headline: string
  subtitle: string
  kanaLinkScript?: KanaScriptType
  items: LessonIntroItem[]
}

const LESSON_INTRO_DECKS: Record<string, LessonIntroDeck> = {
  'n5-vokal-utama-hiragana': {
    headline: 'Kenali 5 Vokal Utama Hiragana Dulu',
    subtitle:
      'Semua kata dalam bahasa Jepang berawal dari 5 bunyi dasar ini. Dengarkan suaranya dan perhatikan bentuk tiap huruf sebelum mulai latihan.',
    kanaLinkScript: 'hiragana',
    items: [
      {
        symbol: 'あ',
        reading: 'a',
        meaning: 'Bunyi vokal "a" seperti "apa"',
        mnemonic: 'Bentuk lengkungnya memutar menyerupai huruf "a" bertangkai silang.',
        speakText: 'あ',
      },
      {
        symbol: 'い',
        reading: 'i',
        meaning: 'Bunyi vokal "i" seperti "ikan"',
        mnemonic: 'Dua garis tegak berdiri berdampingan mirip angka 11 ("ii").',
        speakText: 'い',
      },
      {
        symbol: 'う',
        reading: 'u',
        meaning: 'Bunyi vokal "u" seperti "udara"',
        mnemonic: 'Lengkungan huruf "U" menyamping dengan topi miring kecil di atas.',
        speakText: 'う',
      },
      {
        symbol: 'え',
        reading: 'e',
        meaning: 'Bunyi vokal "e" jelas seperti "ekor"',
        mnemonic: 'Mirip angka 2 zig-zag dengan tanda miring di atas.',
        speakText: 'え',
      },
      {
        symbol: 'お',
        reading: 'o',
        meaning: 'Bunyi vokal "o" seperti "obat"',
        mnemonic: 'Mirip あ, bedanya garis kanan berputar ke bawah + ada titik kecil.',
        speakText: 'お',
      },
      {
        symbol: 'いえ',
        reading: 'i-e',
        meaning: 'Rumah (gabungan い + え)',
        mnemonic: 'Gabungkan い (i) + え (e) menjadi kata pertama kamu: ie = rumah!',
        speakText: 'いえ',
      },
    ],
  },
  'n5-salam-pertama-aisatsu': {
    headline: 'Kenali Ungkapan Salam Pertama (Aisatsu)',
    subtitle:
      'Dengarkan pengucapan setiap salam sopan di bawah ini sebelum menjawab soal percakapan.',
    kanaLinkScript: 'hiragana',
    items: [
      {
        symbol: 'おはようございます',
        reading: 'ohayou gozaimasu',
        meaning: 'Selamat pagi (sopan)',
        mnemonic: 'Diucapkan dari bangun tidur hingga menjelang siang ke rekan atau guru.',
        speakText: 'おはようございます',
      },
      {
        symbol: 'こんにちは',
        reading: 'konnichiwa',
        meaning: 'Selamat siang / Halo',
        mnemonic: 'Perhatikan: ditulis memakai は (ha), namun selalu dibaca "wa" sebagai sapaan.',
        speakText: 'こんにちは',
      },
      {
        symbol: 'こんばんは',
        reading: 'konbanwa',
        meaning: 'Selamat malam',
        mnemonic: 'Dipakai mulai matahari terbenam — akhirannya juga memakai は yang dibaca "wa".',
        speakText: 'こんばんは',
      },
      {
        symbol: 'はじめまして',
        reading: 'hajimemashite',
        meaning: 'Salam kenal / Perkenalkan',
        mnemonic: 'Selalu diucapkan di awal sekali saat baru pertama kali bertemu orang baru.',
        speakText: 'はじめまして',
      },
    ],
  },
  'n5-konsonan-dasar-hiragana': {
    headline: 'Kenali Huruf Hiragana Konsonan Dasar',
    subtitle:
      'Pahami beberapa huruf dari baris K, S, N serta ungkapan sopan penting sebelum mengerjakan soal.',
    kanaLinkScript: 'hiragana',
    items: [
      {
        symbol: 'か',
        reading: 'ka',
        meaning: 'Suku kata "ka"',
        mnemonic: 'Garis melengkung mirip pisau katana + satu titik percikan di kanan.',
        speakText: 'か',
      },
      {
        symbol: 'さ',
        reading: 'sa',
        meaning: 'Suku kata "sa"',
        mnemonic: 'Satu garis mendatar disilang lalu melengkung seperti senyum sapaan.',
        speakText: 'さ',
      },
      {
        symbol: 'す',
        reading: 'su',
        meaning: 'Suku kata "su"',
        mnemonic: 'Lingkaran menggantung di batang lurus mirip gulungan sushi.',
        speakText: 'す',
      },
      {
        symbol: 'さかな',
        reading: 'sakana',
        meaning: 'Ikan',
        mnemonic: 'Tersusun dari tiga huruf dasar: さ (sa) + か (ka) + な (na).',
        speakText: 'さかな',
      },
      {
        symbol: 'ありがとうございます',
        reading: 'arigatou gozaimasu',
        meaning: 'Terima kasih banyak (sopan)',
        mnemonic: 'Akhiran "gozaimasu" membuat ucapan terima kasih lebih resmi & hormat.',
        speakText: 'ありがとうございます',
      },
      {
        symbol: 'すみません',
        reading: 'sumimasen',
        meaning: 'Permisi / Maaf',
        mnemonic: 'Ungkapan serbaguna untuk meminta maaf atau memanggil pelayan/orang.',
        speakText: 'すみません',
      },
    ],
  },
  'n5-katakana-pinjaman-angka-dasar': {
    headline: 'Kenali Katakana Serapan & Angka Dasar',
    subtitle:
      'Katakana berbentuk lebih bersudut tajam dan dipakai untuk kata serapan asing seperti nama menu dan benda elektronik.',
    kanaLinkScript: 'katakana',
    items: [
      {
        symbol: 'コーヒー',
        reading: 'koohii',
        meaning: 'Kopi (serapan "coffee")',
        mnemonic: 'Garis panjang "ー" memanjangkan bunyi vokal sebelumnya: ko-o-hi-i.',
        speakText: 'コーヒー',
      },
      {
        symbol: 'テレビ',
        reading: 'terebi',
        meaning: 'Televisi (serapan "television")',
        mnemonic: 'テ (te) + レ (re) + ビ (bi) — bunyi "v" di Jepang dibaca seperti "b".',
        speakText: 'テレビ',
      },
      {
        symbol: 'いち・に・さん',
        reading: 'ichi • ni • san',
        meaning: 'Angka 1, 2, 3',
        mnemonic: 'Hafalkan berurutan: 1 ichi, 2 ni, 3 san, 4 yon/shi, 5 go.',
        speakText: 'いち、に、さん',
      },
      {
        symbol: 'かさ',
        reading: 'kasa',
        meaning: 'Payung (Hiragana か + さ)',
        mnemonic: 'Kosakata asli Jepang tetap ditulis memakai Hiragana!',
        speakText: 'かさ',
      },
    ],
  },
}

/**
 * Returns a Learn-Before-Quiz intro deck for foundational beginner lessons (matched by slug),
 * or null if the lesson proceeds straight to interactive exercises.
 */
export const getLessonIntroDeck = (slug?: string): LessonIntroDeck | null => {
  if (!slug) return null
  return LESSON_INTRO_DECKS[slug.trim()] ?? null
}
