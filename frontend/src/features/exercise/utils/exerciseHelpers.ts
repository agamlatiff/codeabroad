import type { CurriculumExercise } from '@/features/curriculum/types/curriculum'
import type {
  ExerciseChoiceOption,
  ExerciseFuriganaItem,
  ParsedExerciseContent,
} from '@/features/exercise/types/exercise'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const readString = (record: Record<string, unknown>, key: string): string | undefined => {
  const val = record[key]
  return typeof val === 'string' && val.trim() !== '' ? val : undefined
}

const readStringArray = (record: Record<string, unknown>, key: string): string[] => {
  const val = record[key]
  if (!Array.isArray(val)) return []
  return val.filter((item): item is string => typeof item === 'string')
}

const readFurigana = (record: Record<string, unknown>): ExerciseFuriganaItem[] => {
  const val = record.furigana
  if (!Array.isArray(val)) return []
  return val.reduce<ExerciseFuriganaItem[]>((acc, item) => {
    if (!isRecord(item)) return acc
    const kanji = readString(item, 'kanji')
    const kana = readString(item, 'kana')
    if (kanji && kana) {
      acc.push({ kanji, kana })
    }
    return acc
  }, [])
}

const readChoiceOptions = (
  content: Record<string, unknown>,
  fallbackOptions?: string[]
): ExerciseChoiceOption[] => {
  const rawOptions = content.options
  if (Array.isArray(rawOptions) && rawOptions.length > 0) {
    const normalized: ExerciseChoiceOption[] = []
    for (const item of rawOptions) {
      if (typeof item === 'string' && item.trim() !== '') {
        normalized.push({ id: item, text: item })
      } else if (isRecord(item)) {
        const id = readString(item, 'id')
        const text = readString(item, 'text')
        if (id && text) {
          normalized.push({ id, text })
        }
      }
    }
    if (normalized.length > 0) return normalized
  }

  if (Array.isArray(fallbackOptions) && fallbackOptions.length > 0) {
    return fallbackOptions
      .filter((opt): opt is string => typeof opt === 'string' && opt.trim() !== '')
      .map((opt) => ({ id: opt, text: opt }))
  }

  return []
}

const shuffleTokensDeterministically = (tokens: string[], seedKey: string): string[] => {
  if (tokens.length <= 1) return [...tokens]

  const result = [...tokens]
  let seed = 2166136261
  for (let i = 0; i < seedKey.length; i++) {
    seed ^= seedKey.charCodeAt(i)
    seed = Math.imul(seed, 16777619)
  }

  for (let i = result.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    const j = seed % (i + 1)
    const tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }

  const unchanged = result.every((token, idx) => token === tokens[idx])
  const hasDistinctTokens = new Set(tokens).size > 1
  if (unchanged && hasDistinctTokens) {
    return [...result.slice(1), result[0]]
  }

  return result
}

/**
 * Safely normalizes dynamic backend JSONB `exercise.content` into strongly typed UI structures.
 */
export const parseExerciseContent = (exercise: CurriculumExercise): ParsedExerciseContent => {
  const raw = isRecord(exercise.content) ? exercise.content : {}
  const rawTokens = readStringArray(raw, 'tokens')

  return {
    tokens: shuffleTokensDeterministically(rawTokens, exercise.id),
    targetTranslation: readString(raw, 'target_translation'),
    sentenceTemplate: readString(raw, 'sentence_template'),
    passage: readString(raw, 'passage'),
    translation: readString(raw, 'translation'),
    displayText: readString(raw, 'display_text'),
    audioText: readString(raw, 'audio_text'),
    audioUrl: exercise.media_url ?? readString(raw, 'audio_url') ?? readString(raw, 'media_url'),
    romaji: readString(raw, 'romaji'),
    phoneticBreakdown: readStringArray(raw, 'phonetic_breakdown'),
    furigana: readFurigana(raw),
    choiceOptions: readChoiceOptions(raw, exercise.options),
    hint: exercise.hint ?? readString(raw, 'hint'),
  }
}

export interface ExerciseSubmissionInput {
  selectedTokens: string[]
  selectedOptionValue: string
  textInput: string
}

/**
 * Formats user selection according to backend exercise evaluation expectations.
 */
export const formatUserAnswerForSubmission = (
  exercise: CurriculumExercise,
  input: ExerciseSubmissionInput
): string => {
  const exerciseType = exercise.exercise_type

  if (exerciseType === 'sentence_builder') {
    return input.selectedTokens.join(' ').trim()
  }

  if (exerciseType === 'speaking_repeat') {
    return input.textInput.trim()
  }

  if (input.selectedOptionValue.trim() !== '') {
    return input.selectedOptionValue.trim()
  }

  return input.textInput.trim()
}

export const SKILL_PILLAR_LABELS: Record<string, { label: string; badgeClass: string }> = {
  writing: {
    label: 'Menulis & Susun Kalimat',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  reading: {
    label: 'Membaca & Tata Bahasa',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  listening: {
    label: 'Mendengarkan',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  speaking: {
    label: 'Berbicara & Pelafalan',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
}

/**
 * Maps language ISO codes returned by backend curriculum APIs to BCP-47 speech synthesis locales.
 */
export const resolveSpeechLocale = (languageCode?: string): string => {
  switch (languageCode) {
    case 'en':
      return 'en-US'
    case 'ko':
      return 'ko-KR'
    case 'de':
      return 'de-DE'
    case 'zh':
      return 'zh-CN'
    case 'ja':
    default:
      return 'ja-JP'
  }
}

