import { api, unwrapApiResponse, type RequestOptions } from "@/shared/services/api"
import type { ApiResponse } from "@/shared/types/api"
import type {
  CurriculumResponse,
  LessonDetailResponse,
  CompleteLessonRequest,
  CompleteLessonResponse,
  GrammarPoint,
  SubmitGrammarCheckRequest,
  SubmitGrammarCheckResponse,
  KanaChartResponse,
  KanaPracticeItem,
  KanaPracticeResponse,
  KanaScriptType,
} from "@/features/curriculum/types/curriculum"
import { KANJI_N5_CATALOG } from "@/features/curriculum/constants/kanjiCatalog"

export const CURRICULUM_QUERY_KEY = ['curriculum'] as const
export const LESSON_DETAIL_QUERY_KEY = ['curriculum', 'lesson'] as const
export const GRAMMAR_POINTS_QUERY_KEY = ['curriculum', 'grammar-points'] as const
export const KANA_QUERY_KEY = ['curriculum', 'kana'] as const

interface LocalKanjiProgressEntry {
  practice_count: number
  correct_count: number
  mastery_score: number
  is_mastered: boolean
}

const KANJI_FALLBACK_STORAGE_KEY = 'merantalk_kanji_fallback_progress_v1'
const LEGACY_KANJI_FALLBACK_STORAGE_KEY = 'codeabroad_kanji_fallback_progress_v1'
const KANJI_FALLBACK_CHAR_SET = new Set(KANJI_N5_CATALOG.map((item) => item.character))
const memoryKanjiProgress: Record<string, LocalKanjiProgressEntry> = {}

function readLocalKanjiProgress(): Record<string, LocalKanjiProgressEntry> {
  if (typeof window === 'undefined') {
    return memoryKanjiProgress
  }
  try {
    let raw = window.localStorage.getItem(KANJI_FALLBACK_STORAGE_KEY)
    let migratedFromLegacy = false
    if (!raw) {
      raw = window.localStorage.getItem(LEGACY_KANJI_FALLBACK_STORAGE_KEY)
      migratedFromLegacy = Boolean(raw)
    }
    if (!raw) return memoryKanjiProgress
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return memoryKanjiProgress
    if (migratedFromLegacy) {
      window.localStorage.setItem(KANJI_FALLBACK_STORAGE_KEY, raw)
      window.localStorage.removeItem(LEGACY_KANJI_FALLBACK_STORAGE_KEY)
    }
    return { ...memoryKanjiProgress, ...(parsed as Record<string, LocalKanjiProgressEntry>) }
  } catch {
    return memoryKanjiProgress
  }
}

function writeLocalKanjiProgress(next: Record<string, LocalKanjiProgressEntry>): void {
  Object.assign(memoryKanjiProgress, next)
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KANJI_FALLBACK_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Ignore storage quota/privacy restrictions; memoryKanjiProgress remains active.
  }
}

function buildFallbackKanjiChart(): KanaChartResponse {
  const progressMap = readLocalKanjiProgress()
  const characters = KANJI_N5_CATALOG.map((item) => {
    const st = progressMap[item.character]
    return st ? { ...item, ...st } : { ...item }
  })
  const masteredCount = characters.filter((c) => c.is_mastered).length
  return {
    script: 'kanji',
    total: characters.length,
    mastered_count: masteredCount,
    characters,
  }
}

function applyLocalKanjiPractice(results: KanaPracticeItem[]): KanaPracticeResponse {
  const progressMap = { ...readLocalKanjiProgress() }
  let updatedCount = 0

  for (const item of results) {
    const ch = item.character.trim()
    if (!ch || !KANJI_FALLBACK_CHAR_SET.has(ch)) continue

    const prev = progressMap[ch]
    const practiceCount = (prev?.practice_count ?? 0) + 1
    const correctCount = (prev?.correct_count ?? 0) + (item.is_correct ? 1 : 0)
    const rawScore = item.is_correct
      ? prev
        ? prev.mastery_score + 35
        : 50
      : prev
        ? prev.mastery_score - 10
        : 10
    const masteryScore = Math.max(0, Math.min(100, rawScore))
    const isMastered = masteryScore >= 70 || correctCount >= 2

    progressMap[ch] = {
      practice_count: practiceCount,
      correct_count: correctCount,
      mastery_score: masteryScore,
      is_mastered: isMastered,
    }
    updatedCount += 1
  }

  writeLocalKanjiProgress(progressMap)
  const masteredTotal = Object.values(progressMap).filter((st) => st.is_mastered).length
  return {
    updated_count: updatedCount,
    mastered_total: masteredTotal,
  }
}

/**
 * Service managing language curriculum trees, lesson details, completion, and grammar references.
 * Directly corresponds to backend Curriculum endpoints (`/api/v1/curriculum/*`).
 */
export const curriculumService = {
  /**
   * Fetches the user's curriculum tree (defaults to active enrollment if languageId is omitted).
   */
  async getCurriculum(
    languageId?: string,
    options?: RequestOptions,
    levelCode?: string
  ): Promise<CurriculumResponse> {
    const trimmed = languageId?.trim()
    const trimmedLevel = levelCode?.trim().toUpperCase()
    const params: Record<string, string> = {}
    if (trimmed) params.language_id = trimmed
    if (trimmedLevel) params.level_code = trimmedLevel
    const response = await api.get<ApiResponse<CurriculumResponse>>('/curriculum', {
      params: Object.keys(params).length > 0 ? params : undefined,
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat kurikulum belajar.')
  },

  /**
   * Fetches full lesson node details including exercises and linked grammar points.
   */
  async getLessonDetail(
    lessonId: string,
    options?: RequestOptions
  ): Promise<LessonDetailResponse> {
    const encodedId = encodeURIComponent(lessonId.trim())
    const response = await api.get<ApiResponse<LessonDetailResponse>>(
      `/curriculum/lessons/${encodedId}`,
      { signal: options?.signal }
    )
    return unwrapApiResponse(response, 'Gagal memuat detail lesson.')
  },

  /**
   * Completes a lesson node atomically on the backend and awards XP/streak/badges.
   */
  async completeLesson(
    lessonId: string,
    payload: CompleteLessonRequest,
    options?: RequestOptions
  ): Promise<CompleteLessonResponse> {
    const encodedId = encodeURIComponent(lessonId.trim())
    const response = await api.post<ApiResponse<CompleteLessonResponse>>(
      `/curriculum/lessons/${encodedId}/complete`,
      payload,
      { signal: options?.signal }
    )
    return unwrapApiResponse(response, 'Gagal menyelesaikan lesson.')
  },

  /**
   * Fetches vocabulary and grammar points for an unlocked proficiency level.
   */
  async getGrammarPoints(
    levelId: string,
    options?: RequestOptions
  ): Promise<GrammarPoint[]> {
    const response = await api.get<ApiResponse<GrammarPoint[]>>('/curriculum/grammar-points', {
      params: { level_id: levelId.trim() },
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat daftar grammar level.')
  },

  /**
   * Fetches grammar points filtered by language code and optional JLPT level code (e.g. N5..N1).
   */
  async getGrammarPointsByFilter(
    lang = 'ja',
    levelCode?: string,
    options?: RequestOptions
  ): Promise<GrammarPoint[]> {
    const trimmedLang = lang.trim() || 'ja'
    const trimmedLevel = levelCode?.trim()
    const response = await api.get<ApiResponse<GrammarPoint[]>>('/curriculum/grammar-points', {
      params: {
        lang: trimmedLang,
        ...(trimmedLevel && trimmedLevel !== 'ALL' ? { level_code: trimmedLevel } : {}),
      },
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat daftar grammar.')
  },

  /**
   * Persists the learner's mini comprehension quiz outcome and SRS schedule for a grammar point.
   */
  async submitGrammarCheck(
    grammarPointIdOrCode: string,
    payload: SubmitGrammarCheckRequest,
    options?: RequestOptions
  ): Promise<SubmitGrammarCheckResponse> {
    const encodedId = encodeURIComponent(grammarPointIdOrCode.trim())
    const response = await api.post<ApiResponse<SubmitGrammarCheckResponse>>(
      `/curriculum/grammar-points/${encodedId}/check`,
      payload,
      { signal: options?.signal }
    )
    return unwrapApiResponse(response, 'Gagal menyimpan hasil cek pemahaman grammar.')
  },

  /**
   * Fetches the full Hiragana/Katakana Gojuon or Kanji N5 chart merged with user mastery progress.
   */
  async getKanaChart(
    script?: KanaScriptType,
    options?: RequestOptions
  ): Promise<KanaChartResponse> {
    try {
      const response = await api.get<ApiResponse<KanaChartResponse>>('/curriculum/kana', {
        params: script ? { script } : undefined,
        signal: options?.signal,
      })
      const chart = unwrapApiResponse(response, 'Gagal memuat daftar huruf Hiragana, Katakana & Kanji.')
      if (script === 'kanji' && chart.characters.length === 0) {
        return buildFallbackKanjiChart()
      }
      return chart
    } catch (err) {
      if (script === 'kanji' && !options?.signal?.aborted) {
        return buildFallbackKanjiChart()
      }
      throw err
    }
  },

  /**
   * Records practice/quiz outcomes for one or more Kana/Kanji characters atomically.
   */
  async submitKanaPractice(
    results: KanaPracticeItem[],
    options?: RequestOptions
  ): Promise<KanaPracticeResponse> {
    const kanjiItems = results.filter((item) => KANJI_FALLBACK_CHAR_SET.has(item.character.trim()))
    try {
      const response = await api.post<ApiResponse<KanaPracticeResponse>>(
        '/curriculum/kana/practice',
        { results },
        { signal: options?.signal }
      )
      const res = unwrapApiResponse(response, 'Gagal menyimpan progres latihan huruf.')
      if (kanjiItems.length > 0 && res.updated_count === 0) {
        return applyLocalKanjiPractice(kanjiItems)
      }
      return res
    } catch (err) {
      if (kanjiItems.length > 0 && !options?.signal?.aborted) {
        return applyLocalKanjiPractice(kanjiItems)
      }
      throw err
    }
  },
}

