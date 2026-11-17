import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import { vocabularyService } from '@/features/exercise/services/vocabularyService'
import { languageService } from '@/features/curriculum/services/languageService'
import {
  getDailyVocabulariesQueryKey,
  getLanguageEnrollmentsQueryKey,
} from '@/shared/constants/queryKeys'
import { triggerHaptic } from '@/shared/utils/haptics'
import { audioEngine } from '@/shared/utils/audio'

const COPY_FEEDBACK_DURATION_MS = 2000

export interface LanguageVocabItem {
  id: string
  level: string
  romaji: string
  kanji: string
  kana: string
  arti: string
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

export interface UseDailyLanguageCardOptions {
  onReview?: () => void
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
 * Resolves daily workplace vocabulary cards dynamically to the user's active enrolled language.
 */
export const useDailyLanguageCard = ({ onReview }: UseDailyLanguageCardOptions = {}) => {
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

  const { data: rawVocabs = [], isLoading } = useQuery({
    queryKey: getDailyVocabulariesQueryKey(user?.id, languageMeta.languageCode),
    queryFn: ({ signal }) => vocabularyService.getDailyVocabularies({ signal }),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 10,
    retry: false,
  })

  const vocabList: LanguageVocabItem[] = useMemo(() => {
    if (!rawVocabs || rawVocabs.length === 0) return []
    return rawVocabs.map((v) => {
      const targetText = v.target_text || v.term
      const parts = v.reading ? v.reading.split('•').map((s) => s.trim()) : []
      const kana = parts[0] || v.reading || ''
      const romaji = parts[1] || ''
      return {
        id: v.id,
        level: `${v.difficulty_level || 'Dasar'} • ${v.category.toUpperCase()}`,
        romaji,
        kanji: targetText,
        kana: kana !== targetText ? kana : '',
        arti: v.translation || v.meaning,
        contoh: v.example_target || v.example_ja,
        terjemahan: v.example_translation || v.example_id,
      }
    })
  }, [rawVocabs])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      audioEngine.stopSpeech()
    }
  }, [])

  const totalVocabsCount = vocabList.length
  const currentVocab = totalVocabsCount > 0 ? vocabList[currentIndex % totalVocabsCount] : null
  const activeStepNumber = totalVocabsCount > 0 ? (currentIndex % totalVocabsCount) + 1 : 0

  const handleNextVocab = useCallback(() => {
    triggerHaptic('tap')
    audioEngine.stopSpeech()
    setIsPlayingAudio(false)
    if (totalVocabsCount > 0) {
      setCurrentIndex((prev) => (prev + 1) % totalVocabsCount)
    }
  }, [totalVocabsCount])

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
    (textToSpeak?: string) => {
      if (!currentVocab) return
      triggerHaptic('tap')
      setIsPlayingAudio(true)
      onReview?.()
      const phrase =
        typeof textToSpeak === 'string' && textToSpeak
          ? textToSpeak
          : currentVocab.kanji || currentVocab.kana
      audioEngine.speakLanguage(
        phrase,
        languageMeta.ttsLangCode,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      )
    },
    [currentVocab, onReview, languageMeta.ttsLangCode]
  )

  return {
    languageMeta,
    isLoading,
    currentVocab,
    activeStepNumber,
    totalVocabsCount,
    copied,
    isPlayingAudio,
    handleNextVocab,
    handleCopy,
    handleSpeak,
  }
}

