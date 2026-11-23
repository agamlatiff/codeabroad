export interface LanguageCatalogMeta {
  code: string
  name: string
  shortName: string
  examTag: string
  examShort: string
  countryLabel: string
  description: string
  badgeLabel: string
  hasDedicatedScriptBoard: boolean
  fallbackActive: boolean
}

/**
 * Single source of truth for global destination language tracks supported across Merantalk.
 * Mirrors backend migration `000002_seed_languages_and_levels.up.sql`.
 */
export const GLOBAL_LANGUAGE_CATALOG: ReadonlyArray<LanguageCatalogMeta> = [
  {
    code: 'ja',
    name: 'Jepang',
    shortName: 'Jepang',
    examTag: 'JLPT N5 – N1',
    examShort: 'JLPT',
    countryLabel: 'Jepang • JLPT N5 – N1',
    description:
      'Kuasai Kanji, Hiragana, Katakana & percakapan kerja maupun keseharian di Jepang.',
    badgeLabel: 'Populer',
    hasDedicatedScriptBoard: true,
    fallbackActive: true,
  },
  {
    code: 'en-gb',
    name: 'Inggris (British)',
    shortName: 'Inggris UK',
    examTag: 'IELTS Band 4.0 – 9.0',
    examShort: 'IELTS',
    countryLabel: 'Inggris (UK) • IELTS / CEFR',
    description:
      'Kuasai bahasa Inggris British untuk studi, beasiswa, dan komunikasi global.',
    badgeLabel: 'Tersedia',
    hasDedicatedScriptBoard: false,
    fallbackActive: false,
  },
  {
    code: 'en-us',
    name: 'Inggris (American)',
    shortName: 'Inggris US',
    examTag: 'TOEFL iBT 40 – 120',
    examShort: 'TOEFL iBT',
    countryLabel: 'Inggris (US) • TOEFL / Business',
    description:
      'Bahasa Inggris Amerika untuk presentasi global, interview & kolaborasi internasional.',
    badgeLabel: 'Tersedia',
    hasDedicatedScriptBoard: false,
    fallbackActive: false,
  },
  {
    code: 'de',
    name: 'Jerman',
    shortName: 'Jerman',
    examTag: 'Goethe A1 – C1',
    examShort: 'Goethe',
    countryLabel: 'Jerman • Goethe A1 – C1',
    description:
      'Persiapan bahasa Jerman standar Goethe untuk studi, riset & karier internasional.',
    badgeLabel: 'Tersedia',
    hasDedicatedScriptBoard: false,
    fallbackActive: false,
  },
  {
    code: 'zh',
    name: 'Mandarin',
    shortName: 'Mandarin',
    examTag: 'HSK 1 – 6',
    examShort: 'HSK',
    countryLabel: 'Mandarin • HSK 1 – 6',
    description:
      'Penguasaan Hanzi & Pinyin untuk studi, bisnis, dan ekosistem Asia Timur.',
    badgeLabel: 'Tersedia',
    hasDedicatedScriptBoard: false,
    fallbackActive: false,
  },
  {
    code: 'fr',
    name: 'Prancis',
    shortName: 'Prancis',
    examTag: 'DELF A1 – DALF C1',
    examShort: 'DELF / DALF',
    countryLabel: 'Prancis • DELF A1 – C1',
    description:
      'Komunikasi profesional dan akademik berbahasa Prancis standar DELF.',
    badgeLabel: 'Tersedia',
    hasDedicatedScriptBoard: false,
    fallbackActive: false,
  },
]

const ENGLISH_GENERIC_META: LanguageCatalogMeta = {
  code: 'en',
  name: 'Inggris',
  shortName: 'Inggris',
  examTag: 'IELTS / TOEFL',
  examShort: 'IELTS / TOEFL',
  countryLabel: 'Inggris • IELTS / TOEFL',
  description: 'Bahasa komunikasi global & sertifikasi akademik internasional.',
  badgeLabel: 'Tersedia',
  hasDedicatedScriptBoard: false,
  fallbackActive: false,
}

const UPPERCASE_LEVEL_WORDS = new Set([
  'IELTS',
  'TOEFL',
  'CEFR',
  'JLPT',
  'HSK',
  'DELF',
  'DALF',
])

export function getLanguageCatalogMeta(
  code?: string,
  fallbackName?: string
): LanguageCatalogMeta {
  const normalized = code?.trim().toLowerCase() ?? ''
  const matched = GLOBAL_LANGUAGE_CATALOG.find((item) => item.code === normalized)
  if (matched) return matched

  if (normalized === 'en') {
    return fallbackName
      ? { ...ENGLISH_GENERIC_META, name: fallbackName, shortName: fallbackName }
      : ENGLISH_GENERIC_META
  }

  const resolvedName = fallbackName?.trim() || 'Bahasa Asing'
  return {
    code: normalized || 'lang',
    name: resolvedName,
    shortName: resolvedName,
    examTag: 'Standar Internasional',
    examShort: 'Sertifikasi',
    countryLabel: resolvedName,
    description: 'Pelajari bahasa ini secara terstruktur dari nol hingga mahir.',
    badgeLabel: 'Tersedia',
    hasDedicatedScriptBoard: false,
    fallbackActive: false,
  }
}

export function supportsKanaBoard(code?: string): boolean {
  return code?.trim().toLowerCase() === 'ja'
}

function formatCodeSegment(segment: string): string {
  const upper = segment.toUpperCase()
  if (UPPERCASE_LEVEL_WORDS.has(upper)) return upper
  if (segment === segment.toUpperCase() && segment.length > 2) {
    return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
  }
  return segment
}

export function formatLevelDisplayLabel(
  level?: { code?: string; name?: string; official_exam_name?: string | null } | null
): string {
  const rawCode = level?.code?.trim()
  if (!rawCode) {
    return level?.name?.trim() ?? ''
  }

  const formattedCode = rawCode.includes('_')
    ? rawCode
        .split('_')
        .filter(Boolean)
        .map(formatCodeSegment)
        .join(' ')
    : rawCode

  const exam = level?.official_exam_name?.trim()
  if (exam && !formattedCode.toLowerCase().startsWith(exam.toLowerCase())) {
    return `${exam} ${formattedCode}`
  }
  return formattedCode
}
