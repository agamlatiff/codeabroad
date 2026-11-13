import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from "@/features/auth/store/authStore"
import { vocabularyService } from "@/features/exercise/services/vocabularyService"
import { triggerHaptic } from "@/shared/utils/haptics"
import { audioEngine } from "@/shared/utils/audio"

export const DAILY_VOCABULARIES_QUERY_KEY = ['daily-vocabularies'] as const
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
  countryCode: string
  countryName: string
  targetCity: string
  languageTitle: string
  ttsLangCode: string
  flagEmoji: string
}

export interface UseDailyLanguageCardOptions {
  onReview?: () => void
}

const DESTINATION_LANGUAGE_MAP: Record<string, DestinationLanguageMeta> = {
  JP: {
    countryCode: 'JP',
    countryName: 'Jepang',
    targetCity: 'Tokyo',
    languageTitle: 'Bahasa Jepang Tokyo',
    ttsLangCode: 'ja-JP',
    flagEmoji: '🇯🇵',
  },
  DE: {
    countryCode: 'DE',
    countryName: 'Jerman',
    targetCity: 'Berlin',
    languageTitle: 'Bahasa Jerman Kerja',
    ttsLangCode: 'de-DE',
    flagEmoji: '🇩🇪',
  },
  SG: {
    countryCode: 'SG',
    countryName: 'Singapura',
    targetCity: 'Singapura',
    languageTitle: 'Bahasa Inggris Bisnis',
    ttsLangCode: 'en-SG',
    flagEmoji: '🇸🇬',
  },
  UK: {
    countryCode: 'UK',
    countryName: 'Inggris',
    targetCity: 'London',
    languageTitle: 'Bahasa Inggris Bisnis',
    ttsLangCode: 'en-GB',
    flagEmoji: '🇬🇧',
  },
}

/**
 * 1:1 Headless controller hook for DailyLanguageCard in AppRightSidebar.
 * Adapts vocabulary metadata dynamically to the user's targeted career destination country
 * (Tokyo 🇯🇵, Berlin 🇩🇪, Singapore 🇸🇬, London 🇬🇧), pulls daily vocabularies from PostgreSQL,
 * and manages pronunciation via native Web Speech synthesis.
 */
export const useDailyLanguageCard = ({ onReview }: UseDailyLanguageCardOptions = {}) => {
  const { user } = useAuthStore()

  // Resolve target country & language metadata dynamically
  const languageMeta: DestinationLanguageMeta = useMemo(() => {
    const rawCode = user?.country?.code?.toUpperCase() || 'JP'
    if (DESTINATION_LANGUAGE_MAP[rawCode]) {
      return DESTINATION_LANGUAGE_MAP[rawCode]
    }
    return {
      countryCode: rawCode,
      countryName: user?.country?.name || 'Tujuan Global',
      targetCity: user?.country?.name || 'Global',
      languageTitle: `Bahasa Kerja ${user?.country?.name || 'Global'}`,
      ttsLangCode: 'en-US',
      flagEmoji: user?.country?.flag_emoji || '🌐',
    }
  }, [user?.country])

  const { data: rawVocabs = [], isLoading } = useQuery({
    queryKey: [
      ...DAILY_VOCABULARIES_QUERY_KEY,
      user?.id ?? 'anonymous',
      languageMeta.countryCode,
    ],
    queryFn: ({ signal }) => vocabularyService.getDailyVocabularies({ signal }),
    staleTime: 1000 * 60 * 10,
    retry: false,
  })

  const vocabList: LanguageVocabItem[] = useMemo(() => {
    if (!rawVocabs || rawVocabs.length === 0) return []
    return rawVocabs.map((v) => {
      const parts = v.reading ? v.reading.split('•').map((s) => s.trim()) : []
      const kana = parts[0] || v.reading || ''
      const romaji = parts[1] || ''
      return {
        id: v.id,
        level: `${v.difficulty_level || 'N3'} • ${v.category.toUpperCase()}`,
        romaji,
        kanji: v.term,
        kana,
        arti: v.meaning,
        contoh: v.example_ja,
        terjemahan: v.example_id,
      }
    })
  }, [rawVocabs])

  const [currentIndex, setCurrentIndex] = useState(() => {
    const dayOfYear = Math.floor(Date.now() / 86400000)
    return dayOfYear
  })
  const [copied, setCopied] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const totalVocabsCount = vocabList.length
  const currentVocab = totalVocabsCount > 0 ? vocabList[currentIndex % totalVocabsCount] : null
  const activeStepNumber = totalVocabsCount > 0 ? (currentIndex % totalVocabsCount) + 1 : 0

  const handleNextVocab = useCallback(() => {
    triggerHaptic('tap')
    if (totalVocabsCount > 0) {
      setCurrentIndex((prev) => (prev + 1) % totalVocabsCount)
    }
  }, [totalVocabsCount])

  const handleCopy = useCallback(() => {
    if (!currentVocab) return
    triggerHaptic('tap')
    const romajiPart = currentVocab.romaji ? ` (${currentVocab.romaji})` : ''
    void navigator.clipboard.writeText(
      `${currentVocab.kanji}${romajiPart} - ${currentVocab.arti}`
    )
    setCopied(true)
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    copyTimerRef.current = setTimeout(() => {
      setCopied(false)
    }, COPY_FEEDBACK_DURATION_MS)
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
          : currentVocab.kana || currentVocab.kanji
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

