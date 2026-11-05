import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { vocabularyService } from '../../services/vocabularyService'
import { triggerHaptic } from '../../utils/haptics'
import { audioEngine } from '../../utils/audio'

export const DAILY_VOCABULARIES_QUERY_KEY = ['daily-vocabularies'] as const
const COPY_FEEDBACK_DURATION_MS = 2000

export interface NihongoVocabItem {
  level: string
  romaji: string
  kanji: string
  kana: string
  arti: string
  contoh: string
  terjemahan: string
}

export interface UseRightSidebarNihongoCardOptions {
  onReview?: () => void
}

/**
 * 1:1 Headless controller hook for RightSidebarNihongoCard.
 * Fetches daily IT Japanese vocabularies from PostgreSQL via TanStack Query
 * and manages card rotation, clipboard copying, and native ja-JP pronunciation.
 */
export const useRightSidebarNihongoCard = ({
  onReview,
}: UseRightSidebarNihongoCardOptions = {}) => {
  const { user } = useAuthStore()
  const developerName = user?.name ? user.name.split(' ')[0] : user?.username || 'developer'

  const defaultVocabList: NihongoVocabItem[] = useMemo(
    () => [
      {
        level: 'LEVEL 1 • SAPAAN HARIAN',
        romaji: 'Aisatsu',
        kanji: '挨拶',
        kana: 'あいさつ',
        arti: 'Sapaan Pagi & Etika Kantor',
        contoh: 'Minasan, ohayou gozaimasu! Kyou mo yoroshiku onegaishimasu.',
        terjemahan: 'Selamat pagi semuanya! Mohon kerja samanya hari ini juga.',
      },
      {
        level: 'LEVEL 1 • PERKENALAN DIRI',
        romaji: 'Jikoshoukai',
        kanji: '自己紹介',
        kana: 'じこしょうかい',
        arti: 'Perkenalan Diri Developer',
        contoh: `Hajimemashite, Indonesia kara kimashita ${developerName} to moushimasu.`,
        terjemahan: `Salam kenal, saya ${developerName} dari Indonesia. Senang berkenalan dengan Anda.`,
      },
      {
        level: 'LEVEL 2 • MORNING STANDUP',
        romaji: 'Asakai',
        kanji: '朝会',
        kana: 'あさかい',
        arti: 'Standup Harian IT',
        contoh: 'Kinou wa Gin API wo jissou shimashita. Kyou wa unit test wo kakimasu.',
        terjemahan: 'Kemarin saya implementasi Gin API. Hari ini saya tulis unit test.',
      },
      {
        level: 'LEVEL 3 • CODE REVIEW',
        romaji: 'Fuguai',
        kanji: '不具合',
        kana: 'ふぐあい',
        arti: 'Bug / Isu Teknis',
        contoh: 'Login endpoint de fuguai ga hassei shimashita node, shuusei chuu desu.',
        terjemahan: 'Terjadi bug pada endpoint login, saat ini sedang dalam perbaikan.',
      },
      {
        level: 'LEVEL 3 • IMPLEMENTASI FITUR',
        romaji: 'Jissou',
        kanji: '実装',
        kana: 'じっそう',
        arti: 'Implementasi Fitur',
        contoh: 'Kinou no PR wa mou jissou shimashita.',
        terjemahan: 'PR kemarin sudah selesai saya implementasikan.',
      },
    ],
    [developerName]
  )

  const { data: rawVocabs = [] } = useQuery({
    queryKey: DAILY_VOCABULARIES_QUERY_KEY,
    queryFn: () => vocabularyService.getDailyVocabularies(),
    staleTime: 1000 * 60 * 10,
  })

  const vocabList: NihongoVocabItem[] = useMemo(() => {
    if (!rawVocabs || rawVocabs.length === 0) return defaultVocabList
    return rawVocabs.map((v) => {
      const parts = v.reading ? v.reading.split('•').map((s) => s.trim()) : []
      const kana = parts[0] || v.reading || ''
      const romaji = parts[1] || ''
      return {
        level: `${v.difficulty_level || 'N3'} • ${v.category.toUpperCase()}`,
        romaji,
        kanji: v.term,
        kana,
        arti: v.meaning,
        contoh: v.example_ja,
        terjemahan: v.example_id,
      }
    })
  }, [rawVocabs, defaultVocabList])

  const [currentIndex, setCurrentIndex] = useState(() => {
    const dayOfYear = Math.floor(Date.now() / 86400000)
    return dayOfYear % 5
  })
  const [copied, setCopied] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const currentVocab = vocabList[currentIndex % vocabList.length]
  const activeStepNumber = (currentIndex % vocabList.length) + 1
  const totalVocabsCount = vocabList.length

  const handleNextVocab = useCallback(() => {
    triggerHaptic('tap')
    setCurrentIndex((prev) => (prev + 1) % vocabList.length)
  }, [vocabList.length])

  const handleCopy = useCallback(() => {
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
