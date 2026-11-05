import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { vocabularyService } from '../../../services/vocabularyService'
import { triggerHaptic } from '../../../utils/haptics'
import { audioEngine } from '../../../utils/audio'

export const DAILY_VOCABULARIES_QUERY_KEY = ['daily-vocabularies'] as const
const COPY_FEEDBACK_DURATION_MS = 2000

export interface NihongoVocabItem {
  id: string
  level: string
  romaji: string
  kanji: string
  kana: string
  arti: string
  contoh: string
  terjemahan: string
}

export interface UseNihongoCardOptions {
  onReview?: () => void
}

/**
 * 1:1 Headless controller hook for NihongoCard in AppRightSidebar.
 * Fetches daily IT Japanese vocabularies from PostgreSQL via TanStack Query
 * and manages card rotation, clipboard copying, and native ja-JP pronunciation.
 */
export const useNihongoCard = ({ onReview }: UseNihongoCardOptions = {}) => {
  const { data: rawVocabs = [], isLoading } = useQuery({
    queryKey: DAILY_VOCABULARIES_QUERY_KEY,
    queryFn: () => vocabularyService.getDailyVocabularies(),
    staleTime: 1000 * 60 * 10,
  })

  const vocabList: NihongoVocabItem[] = useMemo(() => {
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
      audioEngine.speakJapanese(
        phrase,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      )
    },
    [currentVocab, onReview]
  )

  return {
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
