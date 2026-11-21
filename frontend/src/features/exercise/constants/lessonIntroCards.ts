import type {
  GrammarExample,
  KanaScriptType,
  LessonDetailResponse,
} from '@/features/curriculum/types/curriculum'

export interface LessonIntroItem {
  symbol: string
  reading: string
  meaning: string
  mnemonic: string
  speakText: string
}

export interface LessonIntroGrammarSummary {
  code: string
  title: string
  formula: string
  formulaReading?: string
  explanation: string
  examples?: GrammarExample[]
}

export interface LessonIntroDeck {
  headline: string
  subtitle: string
  kanaLinkScript?: KanaScriptType
  items: LessonIntroItem[]
  grammarSummary?: LessonIntroGrammarSummary
  contrastiveTip?: string
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

const CHECKPOINT_SLUG_PATTERN = /checkpoint|spiral-test|musim-dan-suasana-kota|simulasi-akhir/i

/**
 * Returns true if the lesson slug identifies an evaluation Checkpoint or Stage Spiral Test
 * that should jump straight into testing without pre-quiz study spoilers or cheat drawers.
 */
export const isCheckpointLesson = (slug?: string | null): boolean => {
  if (!slug) return false
  return CHECKPOINT_SLUG_PATTERN.test(slug)
}

function detectScriptHint(lesson: LessonDetailResponse): KanaScriptType {
  const combined = `${lesson.slug ?? ''} ${lesson.title}`.toLowerCase()
  if (combined.includes('katakana')) return 'katakana'
  if (combined.includes('kanji')) return 'kanji'
  return 'hiragana'
}

function asNonEmptyString(val: unknown): string {
  return typeof val === 'string' ? val.trim() : ''
}

function buildIntroItemsFromLesson(lesson: LessonDetailResponse): LessonIntroItem[] {
  const collected: LessonIntroItem[] = []
  const seenSymbols = new Set<string>()

  const pushItem = (item: LessonIntroItem) => {
    const cleanSymbol = item.symbol.trim()
    if (!cleanSymbol || seenSymbols.has(cleanSymbol) || collected.length >= 6) return
    seenSymbols.add(cleanSymbol)
    collected.push({ ...item, symbol: cleanSymbol })
  }

  for (const ex of lesson.exercises) {
    const content = ex.content ?? {}
    const hintText = (ex.hint ?? '').trim() || 'Perhatikan pola bunyi dan konteks penggunaannya.'

    const audioText = asNonEmptyString(content.audio_text)
    if (audioText) {
      const firstCorrectOption = Array.isArray(content.options)
        ? (content.options.find(
            (opt): opt is { text?: string } =>
              typeof opt === 'object' && opt !== null && typeof (opt as { text?: unknown }).text === 'string'
          )?.text ?? '')
        : ''
      pushItem({
        symbol: audioText,
        reading: asNonEmptyString(content.romaji) || asNonEmptyString(content.reading) || 'Dengarkan audio',
        meaning: asNonEmptyString(content.translation) || firstCorrectOption || ex.prompt,
        mnemonic: hintText,
        speakText: audioText,
      })
      continue
    }

    const tokens = Array.isArray(content.tokens)
      ? content.tokens.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
      : []
    if (tokens.length > 0) {
      const sentence = tokens.join(' ')
      pushItem({
        symbol: sentence,
        reading: asNonEmptyString(content.romaji) || 'Susunan kalimat utuh',
        meaning: asNonEmptyString(content.target_translation) || ex.prompt,
        mnemonic: hintText,
        speakText: tokens.join(''),
      })
      continue
    }

    const word =
      asNonEmptyString(content.word) ||
      asNonEmptyString(content.japanese) ||
      asNonEmptyString(content.prompt_jp) ||
      asNonEmptyString(content.display_text)
    if (word) {
      pushItem({
        symbol: word,
        reading: asNonEmptyString(content.reading) || asNonEmptyString(content.romaji) || 'Kosakata kunci',
        meaning: asNonEmptyString(content.translation) || ex.prompt,
        mnemonic: hintText,
        speakText: word,
      })
    }
  }

  // Fallback / enrich with grammar point examples so every non-checkpoint lesson has rich preview items
  for (const gp of lesson.grammar_points) {
    for (const ex of gp.examples ?? []) {
      pushItem({
        symbol: ex.jp,
        reading: ex.reading,
        meaning: ex.id,
        mnemonic: `Contoh pola ${gp.title}`,
        speakText: ex.jp,
      })
    }
  }

  return collected
}

/**
 * Returns a Learn-Before-Quiz intro deck for foundational beginner lessons (matched by slug),
 * or null if the lesson proceeds straight to interactive exercises.
 */
export const getLessonIntroDeck = (slug?: string): LessonIntroDeck | null => {
  if (!slug) return null
  return LESSON_INTRO_DECKS[slug.trim()] ?? null
}

/**
 * Resolves a complete 3-Slide Study Intro deck ("Pahami Materi Dulu") for any non-checkpoint lesson.
 * Returns null for Checkpoint and Stage Spiral Test lessons so evaluations remain cheat-free.
 */
export const buildDynamicLessonIntroDeck = (
  lesson?: LessonDetailResponse | null
): LessonIntroDeck | null => {
  if (!lesson || isCheckpointLesson(lesson.slug)) {
    return null
  }

  const staticDeck = getLessonIntroDeck(lesson.slug)
  const primaryGrammar = lesson.grammar_points[0]
  const grammarSummary: LessonIntroGrammarSummary | undefined = primaryGrammar
    ? {
        code: primaryGrammar.code,
        title: primaryGrammar.title,
        formula: primaryGrammar.formula,
        formulaReading: primaryGrammar.formula_reading,
        explanation: primaryGrammar.explanation,
        examples: primaryGrammar.examples,
      }
    : undefined

  const firstExerciseHint =
    lesson.exercises.find((ex) => typeof ex.hint === 'string' && ex.hint.trim().length > 0)?.hint?.trim() ??
    undefined

  if (staticDeck) {
    return {
      ...staticDeck,
      grammarSummary: staticDeck.grammarSummary ?? grammarSummary,
      contrastiveTip:
        staticDeck.contrastiveTip ??
        firstExerciseHint ??
        'Perhatikan bentuk huruf kembar & fungsi partikel sebelum memilih jawaban di kuis.',
    }
  }

  const items = buildIntroItemsFromLesson(lesson)
  if (items.length === 0 && !grammarSummary) {
    return null
  }

  return {
    headline: `Pahami Materi Dulu: ${lesson.short_title || lesson.title}`,
    subtitle:
      'Pelajari aksara, kosakata kunci, rumus pola kalimat, dan jebakan umum sebelum masuk ke sesi kuis interaktif.',
    kanaLinkScript: detectScriptHint(lesson),
    items,
    grammarSummary,
    contrastiveTip:
      firstExerciseHint ??
      primaryGrammar?.explanation ??
      'Baca seluruh kalimat sampai akhir untuk memastikan partikel, bentuk sopan/kasual, dan penanda waktunya tepat.',
  }
}
