import type {
  CurriculumExercise,
  GrammarExample,
  GrammarPoint,
  KanaScriptType,
  LessonDetailResponse,
} from '@/features/curriculum/types/curriculum'
import { LESSON_INTRO_DECKS_N4_N3 } from './lessonIntroN4N3'
import { LESSON_INTRO_DECKS_N2_N1 } from './lessonIntroN2N1'
import { LESSON_INTRO_DECKS_N4_N1_EXPANSION } from './lessonIntroN4N1Expansion'
import { LESSON_INTRO_DECKS_EN_A1_B1 } from './lessonIntroEnA1B1'
import { LESSON_INTRO_DECKS_EN_B2_C2 } from './lessonIntroEnB2C2'

export interface LessonIntroItem {
  symbol: string
  reading: string
  meaning: string
  mnemonic: string
  speakText: string
  firstExerciseIndex?: number
}

export interface StudyBatchSegment {
  batchNumber: number
  totalBatches: number
  triggerExerciseIndex: number
  items: LessonIntroItem[]
  grammarSummary?: LessonIntroGrammarSummary
  contrastiveTip?: string
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
    headline: 'Kenali Ungkapan Sapaan & Kata Pendek Baris K',
    subtitle:
      'Pahami kata penting baris K (か, く, あかい) serta frasa sopan sehari-hari sebelum mengerjakan soal.',
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
        symbol: 'く',
        reading: 'ku',
        meaning: 'Suku kata "ku"',
        mnemonic: 'Satu sudut menyiku ke kiri seperti paruh burung kukuk.',
        speakText: 'く',
      },
      {
        symbol: 'あかい',
        reading: 'akai',
        meaning: 'Merah',
        mnemonic: 'Tersusun dari huruf Unit 1 yang sudah kamu kenal: あ (a) + か (ka) + い (i).',
        speakText: 'あかい',
      },
      {
        symbol: 'きく',
        reading: 'kiku',
        meaning: 'Mendengar',
        mnemonic: 'Gabungan dua huruf baris K: き (ki) + く (ku).',
        speakText: 'きく',
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
  ...LESSON_INTRO_DECKS_N4_N3,
  ...LESSON_INTRO_DECKS_N2_N1,
  ...LESSON_INTRO_DECKS_N4_N1_EXPANSION,
  ...LESSON_INTRO_DECKS_EN_A1_B1,
  ...LESSON_INTRO_DECKS_EN_B2_C2,
}

const CHECKPOINT_SLUG_PATTERN = /checkpoint|spiral-test|musim-dan-suasana-kota|simulasi-akhir|tes-akhir|readiness-mock-exam|readiness-exam/i

/**
 * Returns true if the lesson slug identifies an evaluation Checkpoint or Stage Spiral Test
 * that should jump straight into testing without pre-quiz study spoilers or cheat drawers.
 */
export const isCheckpointLesson = (slug?: string | null): boolean => {
  if (!slug) return false
  return CHECKPOINT_SLUG_PATTERN.test(slug)
}

function detectScriptHint(lesson: LessonDetailResponse): KanaScriptType | undefined {
  const combined = `${lesson.slug ?? ''} ${lesson.title}`.toLowerCase()
  if (combined.startsWith('en-') || combined.startsWith('en_')) return undefined
  if (combined.includes('katakana')) return 'katakana'
  if (combined.includes('kanji')) return 'kanji'
  if (combined.includes('hiragana')) return 'hiragana'
  const sampleText = (lesson.study_items ?? []).map((it) => it.symbol).join('')
  if (/[\u3040-\u30ff\u4e00-\u9faf]/.test(sampleText)) return 'hiragana'
  return undefined
}

function asNonEmptyString(val: unknown): string {
  return typeof val === 'string' ? val.trim() : ''
}

const STUDY_BATCH_SIZE = 2

export function normalizeStudySymbolKey(symbol: string): string {
  return symbol.replace(/[\s。、.!?・]+/g, '').trim()
}

function extractTrailingParen(raw: string): string {
  const match = /\(([^()]+)\)\s*$/.exec(raw.trim())
  if (!match) return ''
  const inner = match[1].trim()
  if (inner.includes('=')) {
    const [, rhs] = inner.split('=').map((part) => part.trim())
    return rhs ?? ''
  }
  return inner
}

function buildIntroItemsFromLesson(lesson: LessonDetailResponse): LessonIntroItem[] {
  const collected: LessonIntroItem[] = []
  const seenKeys = new Set<string>()

  const pushItem = (item: LessonIntroItem) => {
    const cleanSymbol = item.symbol.trim()
    const normalizedKey = normalizeStudySymbolKey(cleanSymbol)
    if (!cleanSymbol || !normalizedKey || seenKeys.has(normalizedKey) || collected.length >= 8) {
      return
    }
    seenKeys.add(normalizedKey)
    collected.push({ ...item, symbol: cleanSymbol })
  }

  // Prefer server-curated distractor-free study_items whenever present
  if (Array.isArray(lesson.study_items) && lesson.study_items.length > 0) {
    for (const item of lesson.study_items) {
      pushItem({
        symbol: item.symbol,
        reading: item.reading,
        meaning: item.meaning,
        mnemonic: item.mnemonic,
        speakText: item.speak_text || item.symbol,
        firstExerciseIndex: item.first_exercise_index,
      })
    }
    if (collected.length > 0) {
      return collected
    }
  }

  // Client-side fallback: never join content.tokens blindly because tokens contain distractors
  for (let i = 0; i < lesson.exercises.length; i++) {
    const ex = lesson.exercises[i]
    const content = ex.content ?? {}
    const hintText = (ex.hint ?? '').trim()

    const audioText = asNonEmptyString(content.audio_text)
    if (audioText) {
      const meaning = asNonEmptyString(content.translation) || ex.prompt
      const parenReading = extractTrailingParen(meaning)
      pushItem({
        symbol: audioText,
        reading:
          asNonEmptyString(content.romaji) ||
          asNonEmptyString(content.reading) ||
          parenReading ||
          'Pelafalan audio',
        meaning,
        mnemonic:
          hintText || 'Dengarkan audio Normal & 0.6x untuk membedakan suku kata awal dan panjang vokal.',
        speakText: audioText,
        firstExerciseIndex: i,
      })
      continue
    }

    const word =
      asNonEmptyString(content.word) ||
      asNonEmptyString(content.japanese) ||
      asNonEmptyString(content.display_text) ||
      asNonEmptyString(content.prompt_jp)
    if (word) {
      const meaning = asNonEmptyString(content.translation) || ex.prompt
      const parenReading = extractTrailingParen(meaning)
      pushItem({
        symbol: word,
        reading:
          asNonEmptyString(content.reading) ||
          asNonEmptyString(content.romaji) ||
          parenReading ||
          'Kosakata kunci',
        meaning,
        mnemonic:
          hintText || 'Perhatikan bentuk tulisan, bacaan romaji, dan artinya sebelum mulai latihan.',
        speakText: word,
        firstExerciseIndex: i,
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
        firstExerciseIndex: 0,
      })
    }
  }

  return collected
}

/**
 * Splits a lesson's study items into focused 2-card mini-batches interleaved with exercises
 * (Opsi A: 2 Materi -> 2-3 Soal -> 2 Materi -> 2-3 Soal) along a single unified timeline.
 */
export const buildInterleavedStudyBatches = (
  deck: LessonIntroDeck,
  totalExercises: number
): Map<number, StudyBatchSegment> => {
  const batches = new Map<number, StudyBatchSegment>()
  if (totalExercises <= 0) return batches

  if (deck.items.length === 0) {
    if (deck.grammarSummary) {
      batches.set(0, {
        batchNumber: 1,
        totalBatches: 1,
        triggerExerciseIndex: 0,
        items: [],
        grammarSummary: deck.grammarSummary,
        contrastiveTip: deck.contrastiveTip,
      })
    }
    return batches
  }

  const rawChunks: LessonIntroItem[][] = []
  for (let i = 0; i < deck.items.length; i += STUDY_BATCH_SIZE) {
    rawChunks.push(deck.items.slice(i, i + STUDY_BATCH_SIZE))
  }

  const placed: Array<{ triggerExerciseIndex: number; items: LessonIntroItem[] }> = []

  for (let b = 0; b < rawChunks.length; b++) {
    const chunk = rawChunks[b]
    if (b === 0) {
      placed.push({ triggerExerciseIndex: 0, items: [...chunk] })
      continue
    }

    const prevTrigger = placed[placed.length - 1].triggerExerciseIndex
    const idealSlot = Math.round((b * totalExercises) / rawChunks.length)
    const explicitIndices = chunk
      .map((item) => item.firstExerciseIndex)
      .filter((idx): idx is number => typeof idx === 'number' && idx >= 0 && idx < totalExercises)
    const earliestExplicit =
      explicitIndices.length > 0 ? Math.min(...explicitIndices) : idealSlot

    const desiredSlot = Math.min(idealSlot, earliestExplicit)
    const candidateSlot = Math.max(prevTrigger + 1, desiredSlot)

    if (candidateSlot < totalExercises) {
      placed.push({ triggerExerciseIndex: candidateSlot, items: [...chunk] })
    } else {
      placed[placed.length - 1].items.push(...chunk)
    }
  }

  const totalBatches = placed.length
  for (let i = 0; i < totalBatches; i++) {
    const segment = placed[i]
    batches.set(segment.triggerExerciseIndex, {
      batchNumber: i + 1,
      totalBatches,
      triggerExerciseIndex: segment.triggerExerciseIndex,
      items: segment.items,
      grammarSummary: i === 0 ? deck.grammarSummary : undefined,
      contrastiveTip: i === totalBatches - 1 ? deck.contrastiveTip : undefined,
    })
  }

  return batches
}

/**
 * Matches a study card item to the current exercise or resolved correct answer for mistake recall support.
 */
export const findMatchingStudyItem = (
  items: LessonIntroItem[],
  exerciseIndex: number,
  answerText?: string
): LessonIntroItem | null => {
  if (items.length === 0) return null
  const cleanAnswerKey = normalizeStudySymbolKey(answerText ?? '')
  if (cleanAnswerKey) {
    const exact = items.find((item) => {
      const symKey = normalizeStudySymbolKey(item.symbol)
      return symKey === cleanAnswerKey || symKey.includes(cleanAnswerKey)
    })
    if (exact) return exact
  }
  return items.find((item) => item.firstExerciseIndex === exerciseIndex) ?? null
}

/**
 * Builds a spoiler-free contextual client hint when backend exercise.hint is absent.
 */
export const buildClientFallbackHint = (
  exercise: CurriculumExercise,
  studyItem: LessonIntroItem | null,
  grammarPoint?: GrammarPoint
): string => {
  if (typeof exercise.hint === 'string' && exercise.hint.trim().length > 0) {
    return exercise.hint.trim()
  }

  if (studyItem?.mnemonic) {
    const sanitized = studyItem.mnemonic.split(studyItem.symbol).join('huruf/kata ini')
    return sanitized
  }

  switch (exercise.exercise_type) {
    case 'sentence_builder':
      return grammarPoint?.formula
        ? `Susun potongan sesuai urutan pola ${grammarPoint.formula} (abaikan kata pengecoh).`
        : 'Susun potongan yang membentuk kalimat inti dan abaikan kata pengecoh.'
    case 'listening_choice': {
      const promptLower = exercise.prompt.toLowerCase()
      const audioSample = asNonEmptyString((exercise.content ?? {}).audio_text)
      const isJapaneseAudio = /[\u3040-\u30ff\u4e00-\u9faf]/.test(audioSample)
      if (promptLower.includes('siapakah') || promptLower.includes('siapa ') || promptLower.includes('nama')) {
        return isJapaneseAudio
          ? 'Fokus dengarkan nama orang atau subjek yang disebutkan sebelum です atau は pada audio.'
          : 'Fokus dengarkan nama pembicara, jabatan, atau subjek utama pada awal kalimat audio.'
      }
      if (promptLower.includes('di mana') || promptLower.includes('dimana') || promptLower.includes('posisi') || promptLower.includes('letak')) {
        return 'Fokus dengarkan nama tempat dan kata petunjuk lokasi pada audio.'
      }
      if (promptLower.includes('kapan') || promptLower.includes('berapa lama') || promptLower.includes('jam berapa') || promptLower.includes('hari apa')) {
        return 'Fokus dengarkan keterangan waktu, hari, atau durasi angka pada audio (putar 0.6x Pelan bila cepat).'
      }
      if (promptLower.includes('mengapa') || promptLower.includes('kenapa') || promptLower.includes('alasan')) {
        return isJapaneseAudio
          ? 'Fokus dengarkan bagian alasan atau sebab yang biasanya ditandai kata hubung から (karena).'
          : 'Fokus dengarkan klausa alasan (because / since / due to) yang disebutkan pembicara.'
      }
      if (promptLower.includes('ajakan') || promptLower.includes('diajak') || promptLower.includes('himbauan') || promptLower.includes('diminta')) {
        return 'Fokus dengarkan kata kerja utama dan ungkapan permintaan/ajakan pada audio.'
      }
      if (promptLower.includes('salam') || promptLower.includes('sapaan') || promptLower.includes('perkenalan')) {
        return 'Kenali situasi sosial ungkapan pada audio (sapaan waktu, perkenalan, terima kasih, atau maaf).'
      }
      if (grammarPoint?.formula) {
        return `Dengarkan pola ${grammarPoint.formula} pada audio lalu cocokkan dengan arti yang sesuai di Kartu Materi.`
      }
      return 'Putar audio 0.6x Pelan, tangkap kata kunci utamanya, lalu hubungkan dengan arti di Kartu Materi.'
    }
    case 'speaking_repeat':
      return 'Dengarkan contoh audio pelan 0.6x di Intip Materi lalu tirukan intonasi dan penekanan katanya.'
    default:
      return grammarPoint?.title
        ? `Ingat pola ${grammarPoint.title}, atau klik Intip Kartu Materi di bawah jika lupa.`
        : 'Perhatikan konteks kalimat atau klik Intip Kartu Materi untuk melihat pengingat bentuk & pelafalan.'
  }
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
  const primaryGrammar = lesson.grammar_points?.[0]
  const isEnglishLesson = Boolean(lesson.slug?.toLowerCase().startsWith('en-'))
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

  if (staticDeck) {
    const serverIndexBySymbol = new Map<string, number>()
    for (const st of lesson.study_items ?? []) {
      serverIndexBySymbol.set(normalizeStudySymbolKey(st.symbol), st.first_exercise_index)
    }
    const enrichedItems = staticDeck.items.map((item) => ({
      ...item,
      firstExerciseIndex:
        item.firstExerciseIndex ??
        serverIndexBySymbol.get(normalizeStudySymbolKey(item.symbol)),
    }))
    return {
      ...staticDeck,
      items: enrichedItems,
      grammarSummary: staticDeck.grammarSummary ?? grammarSummary,
      contrastiveTip:
        staticDeck.contrastiveTip ??
        (isEnglishLesson
          ? 'Perhatikan perubahan waktu kata kerja (tense), kolokasi preposisi, dan intonasi kata kunci sebelum menjawab.'
          : 'Perhatikan bentuk huruf kembar & fungsi partikel sebelum memilih jawaban di kuis.'),
    }
  }

  const items = buildIntroItemsFromLesson(lesson)
  if (items.length === 0 && !grammarSummary) {
    return null
  }

  return {
    headline: `Pahami Materi Dulu: ${lesson.short_title || lesson.title}`,
    subtitle: isEnglishLesson
      ? 'Pelajari kosakata kunci, pelafalan IPA Amerika, rumus kalimat, dan jebakan umum sebelum masuk ke kuis interaktif.'
      : 'Pelajari aksara, kosakata kunci, rumus pola kalimat, dan jebakan umum sebelum masuk ke sesi kuis interaktif.',
    kanaLinkScript: detectScriptHint(lesson),
    items,
    grammarSummary,
    contrastiveTip:
      primaryGrammar?.explanation ??
      (isEnglishLesson
        ? 'Perhatikan bentuk subjek-kata kerja, penanda waktu, dan pelafalan kata kunci sebelum menjawab.'
        : 'Perhatikan bentuk huruf kembar, pelafalan panjang-pendek, serta posisi partikel sebelum menjawab.'),
  }
}
