import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import { vocabularyService } from '@/features/exercise/services/vocabularyService'
import { languageService } from '@/features/curriculum/services/languageService'
import type { VocabularyItem } from '@/features/exercise/types/vocabulary'
import {
  getDailyVocabulariesQueryKey,
  getLanguageEnrollmentsQueryKey,
} from '@/shared/constants/queryKeys'
import { triggerHaptic } from '@/shared/utils/haptics'
import { audioEngine } from '@/shared/utils/audio'

const COPY_FEEDBACK_DURATION_MS = 2000

export type DailyCardMode = 'study' | 'quiz'
export type AudioPlaybackSpeed = 'normal' | 'slow'

export interface LanguageVocabItem {
  id: string
  deckId: string
  deckTitle: string
  languageCode: string
  level: string
  romaji: string
  kanji: string
  kana: string
  arti: string
  quizChoices: string[]
  isReviewedToday: boolean
  contoh: string
  terjemahan: string
}

export interface DestinationLanguageMeta {
  languageCode: string
  countryCode: string
  countryName: string
  languageTitle: string
  ttsLangCode: string
}

const DESTINATION_LANGUAGE_MAP: Record<string, DestinationLanguageMeta> = {
  ja: {
    languageCode: 'ja',
    countryCode: 'JP',
    countryName: 'Jepang',
    languageTitle: 'Bahasa Jepang Harian',
    ttsLangCode: 'ja-JP',
  },
  'en-gb': {
    languageCode: 'en-gb',
    countryCode: 'UK',
    countryName: 'Inggris',
    languageTitle: 'Bahasa Inggris (UK)',
    ttsLangCode: 'en-GB',
  },
  'en-us': {
    languageCode: 'en-us',
    countryCode: 'US',
    countryName: 'Amerika Serikat',
    languageTitle: 'Bahasa Inggris (US)',
    ttsLangCode: 'en-US',
  },
  de: {
    languageCode: 'de',
    countryCode: 'DE',
    countryName: 'Jerman',
    languageTitle: 'Bahasa Jerman Harian',
    ttsLangCode: 'de-DE',
  },
  zh: {
    languageCode: 'zh',
    countryCode: 'CN',
    countryName: 'Tiongkok',
    languageTitle: 'Bahasa Mandarin Harian',
    ttsLangCode: 'zh-CN',
  },
  fr: {
    languageCode: 'fr',
    countryCode: 'FR',
    countryName: 'Prancis',
    languageTitle: 'Bahasa Prancis Harian',
    ttsLangCode: 'fr-FR',
  },
}

/**
 * Emergency client fallback only if backend omitted quiz_choices on a custom item.
 */
function buildFallbackChoices(current: VocabularyItem, allItems: VocabularyItem[]): string[] {
  const answer = (current.translation || current.meaning || '').trim()
  if (!answer) return []
  const pool = allItems
    .filter((item) => item.id !== current.id)
    .map((item) => (item.translation || item.meaning || '').trim())
    .filter((m) => m !== '' && m.toLowerCase() !== answer.toLowerCase())
  const unique = Array.from(new Set(pool)).slice(0, 2)
  return [answer, ...unique].sort((a, b) => a.localeCompare(b))
}

/**
 * Interactive Daily Language Card controller:
 * - Renders backend flashcard-backed daily vocabularies with Kana/Romaji/Flag metadata.
 * - Supports 2-speed pronunciation audio (`normal` 0.9x and `slow` 0.58x) without XP bypass.
 * - Supports interactive `Belajar | Tebak` quick drill (0 XP; XP & SM-2 stay in Lesson & /flashcards).
 */
export const useDailyLanguageCard = () => {
  const user = useAuthStore((s) => s.user)

  const { data: enrollments = [] } = useQuery({
    queryKey: getLanguageEnrollmentsQueryKey(user?.id),
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 5,
  })

  const languageMeta: DestinationLanguageMeta = useMemo(() => {
    const active = enrollments.find((e) => e.is_active) ?? enrollments[0]
    const rawCode = (active?.language?.code || 'ja').toLowerCase()
    return DESTINATION_LANGUAGE_MAP[rawCode] ?? DESTINATION_LANGUAGE_MAP.ja
  }, [enrollments])

  const dailyVocabQueryKey = useMemo(
    () => getDailyVocabulariesQueryKey(user?.id, languageMeta.languageCode),
    [user?.id, languageMeta.languageCode]
  )

  const { data: rawVocabs = [], isLoading } = useQuery({
    queryKey: dailyVocabQueryKey,
    queryFn: ({ signal }) => vocabularyService.getDailyVocabularies({ signal }),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardMode, setCardMode] = useState<DailyCardMode>('study')
  const [copied, setCopied] = useState(false)
  const [playingSpeed, setPlayingSpeed] = useState<AudioPlaybackSpeed | null>(null)
  const [selectedChoiceByCardId, setSelectedChoiceByCardId] = useState<Record<string, string>>({})
  const [localCorrectIds, setLocalCorrectIds] = useState<Set<string>>(() => new Set())

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      audioEngine.stopSpeech()
    }
  }, [])

  const vocabList: LanguageVocabItem[] = useMemo(() => {
    if (!rawVocabs || rawVocabs.length === 0) return []
    return rawVocabs.map((v) => {
      const targetText = v.target_text || v.term
      const parts = v.reading ? v.reading.split('•').map((s) => s.trim()) : []
      const parsedKana = v.kana ?? (parts[0] || v.reading || '')
      const kana = parsedKana !== targetText ? parsedKana : ''
      const romaji = v.romaji ?? (parts[1] || '')
      const choices =
        v.quiz_choices && v.quiz_choices.length >= 2
          ? v.quiz_choices
          : buildFallbackChoices(v, rawVocabs)

      return {
        id: v.id,
        deckId: v.deck_id || '',
        deckTitle: v.deck_title || '',
        languageCode: v.language_code || languageMeta.languageCode,
        level: `${v.difficulty_level || 'Dasar'} • ${v.category.toUpperCase()}`,
        romaji,
        kanji: targetText,
        kana,
        arti: v.translation || v.meaning,
        quizChoices: choices,
        isReviewedToday: Boolean(v.is_reviewed_today) || localCorrectIds.has(v.id),
        contoh: v.example_target || v.example_ja,
        terjemahan: v.example_translation || v.example_id,
      }
    })
  }, [rawVocabs, languageMeta.languageCode, localCorrectIds])

  const totalVocabsCount = vocabList.length
  const normalizedIndex =
    totalVocabsCount > 0 ? ((currentIndex % totalVocabsCount) + totalVocabsCount) % totalVocabsCount : 0
  const currentVocab = totalVocabsCount > 0 ? vocabList[normalizedIndex] : null
  const activeStepNumber = totalVocabsCount > 0 ? normalizedIndex + 1 : 0
  const reviewedTodayCount = useMemo(
    () => vocabList.filter((item) => item.isReviewedToday).length,
    [vocabList]
  )

  const handleNextVocab = useCallback(() => {
    triggerHaptic('tap')
    audioEngine.stopSpeech()
    setPlayingSpeed(null)
    if (totalVocabsCount > 0) {
      setCurrentIndex((prev) => (prev + 1) % totalVocabsCount)
    }
  }, [totalVocabsCount])

  const handlePrevVocab = useCallback(() => {
    triggerHaptic('tap')
    audioEngine.stopSpeech()
    setPlayingSpeed(null)
    if (totalVocabsCount > 0) {
      setCurrentIndex((prev) => (prev - 1 + totalVocabsCount) % totalVocabsCount)
    }
  }, [totalVocabsCount])

  const handleSetCardMode = useCallback((nextMode: DailyCardMode) => {
    triggerHaptic('tap')
    setCardMode(nextMode)
  }, [])

  const handleCopy = useCallback(async () => {
    if (!currentVocab) return
    triggerHaptic('tap')
    const romajiPart = currentVocab.romaji ? ` (${currentVocab.romaji})` : ''
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(
          `${currentVocab.kanji}${romajiPart} - ${currentVocab.arti}`
        )
      }
      setCopied(true)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => {
        setCopied(false)
      }, COPY_FEEDBACK_DURATION_MS)
    } catch {
      // Clipboard API unavailable in non-HTTPS contexts; degrade silently
    }
  }, [currentVocab])

  const handleSpeak = useCallback(
    (speed: AudioPlaybackSpeed = 'normal', textToSpeak?: string) => {
      if (!currentVocab) return
      triggerHaptic('tap')
      setPlayingSpeed(speed)
      const phrase =
        typeof textToSpeak === 'string' && textToSpeak
          ? textToSpeak
          : currentVocab.kanji || currentVocab.kana
      const rate = speed === 'slow' ? 0.58 : 0.9
      audioEngine.speakLanguage(
        phrase,
        languageMeta.ttsLangCode,
        () => setPlayingSpeed(null),
        () => setPlayingSpeed(null),
        rate
      )
    },
    [currentVocab, languageMeta.ttsLangCode]
  )

  const handleSelectQuizChoice = useCallback(
    (choice: string) => {
      if (!currentVocab) return
      if (selectedChoiceByCardId[currentVocab.id]) return

      const isCorrect =
        choice.trim().toLowerCase() === currentVocab.arti.trim().toLowerCase()

      setSelectedChoiceByCardId((prev) => ({
        ...prev,
        [currentVocab.id]: choice,
      }))

      triggerHaptic(isCorrect ? 'success' : 'error')
      if (isCorrect) {
        audioEngine.playSuccess()
        setLocalCorrectIds((prev) => {
          const next = new Set(prev)
          next.add(currentVocab.id)
          return next
        })
      } else {
        audioEngine.playError()
      }
    },
    [currentVocab, selectedChoiceByCardId]
  )

  const handleRetryQuizChoice = useCallback(() => {
    if (!currentVocab) return
    triggerHaptic('tap')
    setSelectedChoiceByCardId((prev) => {
      if (!(currentVocab.id in prev)) return prev
      const next = { ...prev }
      delete next[currentVocab.id]
      return next
    })
  }, [currentVocab])

  const selectedQuizChoice = currentVocab ? selectedChoiceByCardId[currentVocab.id] ?? null : null

  return {
    languageMeta,
    isLoading,
    currentVocab,
    activeStepNumber,
    totalVocabsCount,
    reviewedTodayCount,
    cardMode,
    copied,
    playingSpeed,
    selectedQuizChoice,
    handleSetCardMode,
    handlePrevVocab,
    handleNextVocab,
    handleCopy,
    handleSpeak,
    handleSelectQuizChoice,
    handleRetryQuizChoice,
  }
}
