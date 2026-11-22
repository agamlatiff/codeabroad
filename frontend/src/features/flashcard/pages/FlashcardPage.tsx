import { useState, useEffect, useCallback, useMemo, useRef, useId } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Cards,
  CheckCircle,
  X,
  ArrowsClockwise,
  Fire,
} from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
import { AppTopBar } from '@/shared/components/layout/top-bar/AppTopBar'
import { FilterToolbar } from '@/shared/components/ui/FilterToolbar'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { FlashcardHeroIllustration } from '@/features/flashcard/components/FlashcardHeroIllustration'
import { FlashcardDeckCard } from '@/features/flashcard/components/FlashcardDeckCard'
import { useUser } from '@/features/user/hooks/useUser'
import {
  getProfileQueryKey,
  getDailyRewardsQueryKey,
  getActivityLogsQueryKey,
  DAILY_QUESTS_QUERY_KEY,
} from '@/shared/constants/queryKeys'
import {
  flashcardService,
  FLASHCARD_DECKS_QUERY_KEY,
  FLASHCARD_DUE_QUERY_KEY,
} from '@/features/flashcard/services/flashcardService'
import {
  getFlashcardDeckSlug,
  type FlashcardCard,
  type FlashcardDeck,
} from '@/features/flashcard/types/flashcard'
import { FlashcardFlipCard } from '@/features/flashcard/components/FlashcardFlipCard'
import {
  previewAnkiIntervals,
  resetCardForAnkiRequeue,
  type AnkiIntervalPreviews,
} from '@/features/flashcard/utils/ankiScheduler'
import { triggerHaptic } from '@/shared/utils/haptics'
import { playSound } from '@/shared/utils/sound'
import { audioEngine } from '@/shared/utils/audio'

type SessionMode = 'lobby' | 'session' | 'complete'
type JlptFilter = 'ALL' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
type DeckCategoryFilter = 'ALL' | 'hiragana' | 'katakana' | 'kanji' | 'vocab'

const DECK_CATEGORY_OPTIONS: Array<{ value: DeckCategoryFilter; label: string }> = [
  { value: 'ALL', label: 'Semua Jenis Dek' },
  { value: 'hiragana', label: 'Huruf Hiragana' },
  { value: 'katakana', label: 'Huruf Katakana' },
  { value: 'kanji', label: 'Huruf Kanji' },
  { value: 'vocab', label: 'Kosakata & Ungkapan' },
]

interface RatingOption {
  quality: number
  previewKey: keyof AnkiIntervalPreviews
  label: string
  shortcut: string
  className: string
}

const JLPT_FILTER_OPTIONS: Array<{ value: JlptFilter; label: string }> = [
  { value: 'N5', label: 'N5' },
  { value: 'N4', label: 'N4' },
  { value: 'N3', label: 'N3' },
  { value: 'N2', label: 'N2' },
  { value: 'N1', label: 'N1' },
  { value: 'ALL', label: 'Semua' },
]

const VALID_JLPT_FILTERS: ReadonlySet<JlptFilter> = new Set([
  'ALL',
  'N5',
  'N4',
  'N3',
  'N2',
  'N1',
])

function parseFlashcardLevelParam(raw: string | null): JlptFilter {
  const upper = (raw ?? '').trim().toUpperCase() as JlptFilter
  return VALID_JLPT_FILTERS.has(upper) ? upper : 'N5'
}

const RATING_OPTIONS: RatingOption[] = [
  {
    quality: 1,
    previewKey: 'again',
    label: 'Ulangi',
    shortcut: '1',
    className: 'border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700',
  },
  {
    quality: 3,
    previewKey: 'hard',
    label: 'Susah',
    shortcut: '2',
    className: 'border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800',
  },
  {
    quality: 4,
    previewKey: 'good',
    label: 'Ingat',
    shortcut: '3',
    className: 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700',
  },
  {
    quality: 5,
    previewKey: 'easy',
    label: 'Mudah',
    shortcut: '4',
    className: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700',
  },
]

/**
 * Hybrid Flashcard page (/flashcards):
 * - Lobby: Scheduled Smart Review banner + JLPT N5-N1 filter tabs + Anki 3-state Topic Decks.
 * - Session: Interactive 3D flip card player with TTS audio, Modified SM-2 interval previews,
 *   and Anki intra-session re-queueing when `Ulangi` is pressed.
 */
export const FlashcardPage = () => {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const handledDeckParamRef = useRef<string | null>(null)
  const handledReviewParamRef = useRef<boolean>(false)
  const { data: userData } = useUser()
  const userIdKey = userData.user?.id ?? 'anonymous'
  const heroPatternId = `flashcards-hero-seigaiha-${useId().replace(/:/g, '')}`

  const [mode, setMode] = useState<SessionMode>('lobby')
  const [lobbyLevelMemory, setLobbyLevelMemory] = useState<JlptFilter>(() =>
    parseFlashcardLevelParam(searchParams.get('level'))
  )
  const rawLevelParam = searchParams.get('level')
  const levelFilter = useMemo(
    () => (rawLevelParam ? parseFlashcardLevelParam(rawLevelParam) : lobbyLevelMemory),
    [rawLevelParam, lobbyLevelMemory]
  )
  const [categoryFilter, setCategoryFilter] = useState<DeckCategoryFilter>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 250)
    return () => window.clearTimeout(timer)
  }, [searchQuery])

  const [sessionTitle, setSessionTitle] = useState('')
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null)
  const [cardMap, setCardMap] = useState<Record<string, FlashcardCard>>({})
  const [queue, setQueue] = useState<string[]>([])
  const [requeuedIds, setRequeuedIds] = useState<Set<string>>(() => new Set())
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set())
  const [initialTotal, setInitialTotal] = useState(0)

  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionXp, setSessionXp] = useState(0)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [loadingSession, setLoadingSession] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)

  const {
    data: deckPages,
    isLoading: decksLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      ...FLASHCARD_DECKS_QUERY_KEY,
      'paginated',
      userIdKey,
      'ja',
      levelFilter,
      categoryFilter,
      debouncedSearch,
    ],
    initialPageParam: '',
    queryFn: ({ pageParam, signal }) =>
      flashcardService.listDecksPage(
        {
          lang: 'ja',
          level: levelFilter,
          category: categoryFilter,
          q: debouncedSearch,
          cursor: pageParam || undefined,
          limit: 12,
        },
        { signal }
      ),
    getNextPageParam: (lastPage) =>
      lastPage.has_more && lastPage.next_cursor ? lastPage.next_cursor : undefined,
    staleTime: 1000 * 60,
  })

  const { data: dueQueue, isLoading: dueLoading } = useQuery({
    queryKey: [...FLASHCARD_DUE_QUERY_KEY, userIdKey, 'ja'],
    queryFn: ({ signal }) => flashcardService.getDueQueue('ja', 20, { signal }),
    staleTime: 1000 * 30,
  })

  const loadedDecks = useMemo(() => {
    if (!deckPages?.pages) return []
    const seen = new Set<string>()
    const result: FlashcardDeck[] = []
    for (const page of deckPages.pages) {
      for (const deck of page.items) {
        if (!seen.has(deck.id)) {
          seen.add(deck.id)
          result.push(deck)
        }
      }
    }
    return result
  }, [deckPages])

  const levelCounts = useMemo<Record<JlptFilter, number>>(() => {
    const raw = deckPages?.pages[0]?.level_counts
    return {
      ALL: raw?.ALL ?? 0,
      N5: raw?.N5 ?? 0,
      N4: raw?.N4 ?? 0,
      N3: raw?.N3 ?? 0,
      N2: raw?.N2 ?? 0,
      N1: raw?.N1 ?? 0,
    }
  }, [deckPages])

  const totalFilteredCount = deckPages?.pages[0]?.total_count ?? loadedDecks.length

  useEffect(() => {
    if (mode !== 'lobby' || !hasNextPage || isFetchingNextPage) return
    const target = loadMoreSentinelRef.current
    if (!target || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void fetchNextPage()
        }
      },
      { rootMargin: '300px' }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, mode])

  const reviewMutation = useMutation({
    mutationFn: ({ cardId, quality }: { cardId: string; quality: number }) =>
      flashcardService.reviewCard(cardId, quality),
    onSuccess: (res) => {
      setSessionXp((prev) => prev + res.xp_awarded)
      setReviewedCount((prev) => prev + 1)
      void queryClient.invalidateQueries({ queryKey: FLASHCARD_DECKS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: FLASHCARD_DUE_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: getProfileQueryKey(userIdKey) })
      void queryClient.invalidateQueries({ queryKey: getDailyRewardsQueryKey(userIdKey) })
      void queryClient.invalidateQueries({ queryKey: getActivityLogsQueryKey(userIdKey) })
      void queryClient.invalidateQueries({ queryKey: DAILY_QUESTS_QUERY_KEY })
    },
  })

  const initSessionQueue = useCallback(
    (cards: FlashcardCard[], title: string, deckId: string | null) => {
      const nextMap: Record<string, FlashcardCard> = {}
      const nextQueue: string[] = []
      for (const card of cards) {
        nextMap[card.id] = card
        nextQueue.push(card.id)
      }
      setActiveDeckId(deckId)
      setSessionTitle(title)
      setCardMap(nextMap)
      setQueue(nextQueue)
      setRequeuedIds(new Set())
      setCompletedIds(new Set())
      setInitialTotal(cards.length)
      setIsFlipped(false)
      setSessionXp(0)
      setReviewedCount(0)
      setMode('session')
      audioEngine.playCardSlide()
    },
    []
  )

  const handleSelectLevel = (nextLevel: JlptFilter) => {
    setLobbyLevelMemory(nextLevel)
    setSearchParams({ level: nextLevel }, { replace: true })
  }

  // Canonicalize lobby URL so default N5 reflects explicitly in ?level=N5
  useEffect(() => {
    if (mode !== 'lobby') return
    if (searchParams.has('deck') || searchParams.get('mode') === 'review') return
    const currentRaw = searchParams.get('level')
    const normalized = parseFlashcardLevelParam(currentRaw)
    if (!currentRaw || currentRaw.trim().toUpperCase() !== normalized) {
      setSearchParams({ level: lobbyLevelMemory }, { replace: true })
    }
  }, [lobbyLevelMemory, mode, searchParams, setSearchParams])

  const startDeckSession = useCallback(
    async (deck: FlashcardDeck) => {
      triggerHaptic('tap')
      setLoadingSession(true)
      setSessionError(null)
      const deckSlug = getFlashcardDeckSlug(deck)
      handledDeckParamRef.current = deckSlug
      setSearchParams({ deck: deckSlug }, { replace: true })
      try {
        const detail = await flashcardService.getDeck(deck.id)
        if (detail.cards.length === 0) {
          setSessionError('Dek ini belum memiliki kartu.')
          return
        }
        initSessionQueue(detail.cards, deck.title, deck.id)
      } catch {
        setSessionError('Gagal memuat kartu dek. Coba lagi sebentar.')
      } finally {
        setLoadingSession(false)
      }
    },
    [initSessionQueue, setSearchParams]
  )

  const handleSelectDeck = useCallback(
    (deck: FlashcardDeck) => {
      void startDeckSession(deck)
    },
    [startDeckSession]
  )

  // Deep-link handler: /flashcards?deck=<slug|id> fetches directly across all paginated pages
  useEffect(() => {
    const requestedDeckParam = searchParams.get('deck')
    if (!requestedDeckParam) return
    if (handledDeckParamRef.current === requestedDeckParam) return

    handledDeckParamRef.current = requestedDeckParam
    let cancelled = false

    flashcardService
      .getDeck(requestedDeckParam)
      .then((detail) => {
        if (cancelled) return
        const canonicalSlug = getFlashcardDeckSlug(detail.deck)
        handledDeckParamRef.current = canonicalSlug
        if (requestedDeckParam !== canonicalSlug) {
          setSearchParams({ deck: canonicalSlug }, { replace: true })
        }
        if (detail.cards.length === 0) {
          setSessionError('Dek ini belum memiliki kartu.')
          return
        }
        initSessionQueue(detail.cards, detail.deck.title, detail.deck.id)
      })
      .catch(() => {
        if (!cancelled) {
          handledDeckParamRef.current = null
          setSessionError('Dek flashcard tidak ditemukan atau gagal dimuat.')
        }
      })

    return () => {
      cancelled = true
    }
  }, [initSessionQueue, searchParams, setSearchParams])

  // Deep-link handler: /flashcards?mode=review starts due queue automatically if available
  useEffect(() => {
    if (searchParams.get('mode') !== 'review') return
    if (handledReviewParamRef.current || mode !== 'lobby') return
    if (dueLoading || !dueQueue || dueQueue.cards.length === 0) return
    handledReviewParamRef.current = true
    let cancelled = false
    Promise.resolve(dueQueue.cards).then((cards) => {
      if (!cancelled) {
        initSessionQueue(cards, 'Ulasan Terjadwal', null)
      }
    })
    return () => {
      cancelled = true
    }
  }, [dueLoading, dueQueue, initSessionQueue, mode, searchParams])

  const currentCardId = queue[0]
  const currentCard = currentCardId ? cardMap[currentCardId] : undefined
  const upcomingCards = useMemo(
    () =>
      queue
        .slice(1, 4)
        .map((id) => cardMap[id])
        .filter((card): card is FlashcardCard => Boolean(card)),
    [queue, cardMap]
  )

  const handleRate = useCallback(
    async (quality: number) => {
      if (!currentCard || reviewMutation.isPending) return

      triggerHaptic('tap')
      playSound(quality >= 3 ? 'zen_bell' : 'node_tap')
      audioEngine.playCardSlide()

      let updatedCard: FlashcardCard
      try {
        const res = await reviewMutation.mutateAsync({ cardId: currentCard.id, quality })
        updatedCard = {
          ...currentCard,
          ease_factor: res.ease_factor,
          interval_days: res.interval_days,
          repetitions: res.repetitions,
          next_review_at: res.next_review_at,
          last_reviewed_at: new Date().toISOString(),
        }
      } catch {
        updatedCard = quality < 3 ? resetCardForAnkiRequeue(currentCard) : currentCard
      }

      setCardMap((prev) => ({
        ...prev,
        [currentCard.id]: updatedCard,
      }))

      const remaining = queue.slice(1)

      if (quality < 3) {
        // Anki intra-session re-queue: return `Ulangi` card after up to 3 intermediate cards
        const insertOffset = Math.min(3, remaining.length)
        const nextQueue = [
          ...remaining.slice(0, insertOffset),
          currentCard.id,
          ...remaining.slice(insertOffset),
        ]
        setRequeuedIds((prev) => {
          const next = new Set(prev)
          next.add(currentCard.id)
          return next
        })
        setIsFlipped(false)
        setQueue(nextQueue)
        return
      }

      setRequeuedIds((prev) => {
        if (!prev.has(currentCard.id)) return prev
        const next = new Set(prev)
        next.delete(currentCard.id)
        return next
      })
      setCompletedIds((prev) => {
        const next = new Set(prev)
        next.add(currentCard.id)
        return next
      })

      if (remaining.length === 0) {
        playSound('quest_complete')
        setQueue([])
        setMode('complete')
      } else {
        setIsFlipped(false)
        setQueue(remaining)
      }
    },
    [currentCard, queue, reviewMutation]
  )

  // Keyboard shortcuts during active flip session (Space to flip, 1-4 to rate when flipped)
  useEffect(() => {
    if (mode !== 'session') return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (!isFlipped && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        triggerHaptic('tap')
        setIsFlipped(true)
        return
      }
      if (!isFlipped) return
      const option = RATING_OPTIONS.find((opt) => opt.shortcut === e.key)
      if (option) {
        e.preventDefault()
        void handleRate(option.quality)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mode, isFlipped, handleRate])

  const exitToLobby = () => {
    triggerHaptic('tap')
    handledDeckParamRef.current = null
    handledReviewParamRef.current = false
    setSearchParams({ level: lobbyLevelMemory }, { replace: true })
    setMode('lobby')
    setQueue([])
    setCardMap({})
    setRequeuedIds(new Set())
    setCompletedIds(new Set())
    setIsFlipped(false)
  }

  const replayActiveDeck = () => {
    if (!activeDeckId) {
      exitToLobby()
      return
    }
    const deck = loadedDecks.find((d) => d.id === activeDeckId)
    if (deck) {
      void startDeckSession(deck)
      return
    }
    setLoadingSession(true)
    flashcardService
      .getDeck(activeDeckId)
      .then((detail) => {
        if (detail.cards.length === 0) {
          setSessionError('Dek ini belum memiliki kartu.')
          exitToLobby()
          return
        }
        initSessionQueue(detail.cards, detail.deck.title, detail.deck.id)
      })
      .catch(() => {
        setSessionError('Gagal mengulang dek. Coba lagi sebentar.')
        exitToLobby()
      })
      .finally(() => setLoadingSession(false))
  }

  const sessionStats = useMemo(() => {
    let newRemaining = 0
    let dueRemaining = 0
    for (const id of queue) {
      if (requeuedIds.has(id)) continue
      const card = cardMap[id]
      if (!card?.last_reviewed_at && (card?.repetitions ?? 0) === 0) {
        newRemaining += 1
      } else {
        dueRemaining += 1
      }
    }
    return {
      newRemaining,
      dueRemaining,
      requeuedCount: requeuedIds.size,
      completedCount: completedIds.size,
    }
  }, [queue, cardMap, requeuedIds, completedIds])

  const ratingPreviews = useMemo(
    () => (currentCard ? previewAnkiIntervals(currentCard) : null),
    [currentCard]
  )

  // ── COMPLETE SCREEN ──
  if (mode === 'complete') {
    return (
      <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex flex-col items-center justify-center p-4">
        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-[0_6px_0_0_#E2E8F0] animate-pop">
          <div className="flex justify-center">
            <KodiCharacter emotion="celebrate" size={110} />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-brand font-black text-xs uppercase tracking-wider">
            <CheckCircle weight="fill" className="w-4 h-4" />
            <span>Sesi Flashcard Selesai</span>
          </span>
          <div className="space-y-1">
            <h1 className="text-2xl font-brand font-black text-slate-900">
              Mantap! {completedIds.size || reviewedCount} Kartu Lulus Diingat
            </h1>
            <p className="text-sm text-slate-600">
              Total {reviewedCount} peninjauan tersimpan ke jadwal SM-2 agar ingatan jangka panjangmu makin kuat.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-brand font-black text-sm">
            <Fire weight="fill" className="w-4 h-4 text-amber-500" />
            <span>+{sessionXp} XP Didapat</span>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <Button3D variant="blue" fullWidth size="md" onClick={exitToLobby}>
              KEMBALI KE DEK FLASHCARD
            </Button3D>
            {activeDeckId && (
              <Button3D variant="white" fullWidth size="md" onClick={replayActiveDeck}>
                ULANGI DEK INI
              </Button3D>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── ACTIVE 3D FLIP CARD PLAYER ──
  if (mode === 'session' && currentCard && ratingPreviews) {
    const progressPercent =
      initialTotal > 0
        ? Math.round(((sessionStats.completedCount + (isFlipped ? 0.35 : 0)) / initialTotal) * 100)
        : 0

    return (
      <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex flex-col">
        {/* Top Session Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
          <div className="max-w-3xl mx-auto flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={exitToLobby}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Kembali ke daftar dek"
              aria-label="Kembali ke daftar dek"
            >
              <X weight="bold" className="w-4 h-4" />
            </button>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs font-brand font-bold text-slate-600">
                <span className="truncate">{sessionTitle}</span>
                <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
                  <span
                    className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 font-extrabold"
                    title="Kartu baru tersisa"
                  >
                    {sessionStats.newRemaining} Baru
                  </span>
                  {sessionStats.dueRemaining > 0 && (
                    <span
                      className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200/80 font-extrabold"
                      title="Kartu ulasan terjadwal tersisa"
                    >
                      {sessionStats.dueRemaining} Ulas
                    </span>
                  )}
                  <span
                    className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 font-extrabold"
                    title="Kartu perlu diulang di sesi ini"
                  >
                    {sessionStats.requeuedCount} Ulangi
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-extrabold"
                    title="Kartu selesai diingat"
                  >
                    {sessionStats.completedCount}/{initialTotal} Selesai
                  </span>
                </div>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#2563EB] transition-all duration-300"
                  style={{ width: `${Math.max(8, progressPercent)}%` }}
                />
              </div>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-brand font-black text-xs shrink-0">
              <span>+{sessionXp} XP</span>
            </div>
          </div>
        </header>

        {/* Card Stage */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10 gap-8 max-w-2xl w-full mx-auto overflow-x-clip">
          <div className="relative w-full max-w-lg mx-auto mb-3 sm:mb-4">
            {/* Upcoming cards peeking fanned behind (real stack that shrinks as you review) */}
            {upcomingCards
              .slice()
              .reverse()
              .map((card, revIdx) => {
                const depth = upcomingCards.length - revIdx
                const stackStyle =
                  depth === 1
                    ? 'translate-x-2.5 sm:translate-x-3.5 translate-y-1 rotate-[1.5deg] scale-[0.985]'
                    : depth === 2
                      ? 'translate-x-5 sm:translate-x-7 translate-y-2 rotate-[3deg] scale-[0.97]'
                      : 'translate-x-7 sm:translate-x-10 translate-y-3 rotate-[4.5deg] scale-[0.955]'
                return (
                  <div
                    key={`upcoming-${card.id}`}
                    aria-hidden="true"
                    className={`pointer-events-none select-none absolute inset-0 rounded-3xl bg-white border-2 border-slate-200/90 shadow-[0_6px_0_0_#E2E8F0] origin-center transition-transform duration-300 ${stackStyle}`}
                    style={{ opacity: 1 - depth * 0.18 }}
                  >
                    <span className="absolute top-3 right-4 font-brand font-black text-sm text-slate-400 max-w-[120px] truncate">
                      {card.front_text}
                    </span>
                  </div>
                )
              })}
            <div className="relative z-10">
              <FlashcardFlipCard
                key={`${currentCard.id}-${reviewedCount}`}
                card={currentCard}
                isFlipped={isFlipped}
                onToggleFlip={() => setIsFlipped((prev) => !prev)}
              />
            </div>
          </div>

          {/* Action Controls */}
          <div className="relative z-20 w-full max-w-lg">
            {!isFlipped ? (
              <Button3D
                variant="blue"
                size="lg"
                fullWidth
                icon={<ArrowsClockwise weight="bold" className="w-5 h-5" />}
                onClick={() => {
                  triggerHaptic('tap')
                  setIsFlipped(true)
                }}
              >
                BALIK KARTU
              </Button3D>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {RATING_OPTIONS.map((opt) => (
                    <button
                      key={opt.quality}
                      type="button"
                      disabled={reviewMutation.isPending}
                      onClick={() => void handleRate(opt.quality)}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer active:translate-y-0.5 disabled:opacity-50 ${opt.className}`}
                    >
                      <span className="block text-[11px] font-brand font-extrabold opacity-80">
                        {ratingPreviews[opt.previewKey]}
                      </span>
                      <span className="block font-brand font-black text-sm mt-0.5">
                        {opt.label}
                      </span>
                      <span className="block text-[10px] font-semibold opacity-65 mt-0.5">
                        Tombol {opt.shortcut}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  // ── HYBRID FLASHCARD LOBBY ──
  const totalDue = dueQueue?.total_due ?? 0
  const totalLearned = dueQueue?.total_learned ?? 0

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      <AppLeftSidebar />

      <main className="flex-1 min-w-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 md:pb-12 space-y-5">
        <AppTopBar
          breadcrumbs={[
            { label: 'Beranda', to: '/curriculum' },
            { label: 'Flashcards' },
            { label: levelFilter === 'ALL' ? 'Semua Level' : `JLPT ${levelFilter}` },
          ]}
        />

        {/* Custom Editorial Flashcard Hero Banner with Kodi & Fanned Vector Cards */}
        <section className="relative rounded-3xl border-2 border-slate-200/90 bg-gradient-to-br from-sky-50/75 via-white to-blue-50/45 shadow-[0_4px_0_0_#E2E8F0] overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

          {/* Subtle Japanese Seigaiha Background Pattern */}
          <svg
            className="absolute inset-0 w-full h-full text-sky-700 opacity-[0.055] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern id={heroPatternId} width="48" height="24" patternUnits="userSpaceOnUse">
                <path
                  d="M0 24A12 12 0 0 1 24 24M24 24A12 12 0 0 1 48 24M12 12A12 12 0 0 1 36 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${heroPatternId})`} />
          </svg>

          <div className="relative z-10 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Left Info */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 shadow-[0_3px_0_0_#1D4ED8] text-white flex items-center justify-center shrink-0">
                <Cards weight="fill" className="w-6 h-6" />
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-brand font-black text-slate-900 tracking-tight leading-snug">
                  Belajar &amp; Ulas Flashcard
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed font-medium">
                  Hafalkan kosakata lewat kartu flip kapan saja lintas tingkat JLPT N5 hingga N1.
                </p>
              </div>
            </div>

            {/* Right: Custom Floating Card Mascot Illustration */}
            <FlashcardHeroIllustration
              totalDue={totalDue}
              totalLearned={totalLearned}
              className="hidden md:flex shrink-0"
            />
          </div>
        </section>

        {sessionError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            {sessionError}
          </div>
        )}

        {/* Unified 1-Row Filter Toolbar */}
        <FilterToolbar
          levelOptions={JLPT_FILTER_OPTIONS.map((opt) => ({
            value: opt.value,
            label: opt.label,
            count: levelCounts[opt.value],
          }))}
          selectedLevel={levelFilter}
          onSelectLevel={(v) => handleSelectLevel(v as JlptFilter)}
          categoryOptions={DECK_CATEGORY_OPTIONS}
          selectedCategory={categoryFilter}
          onSelectCategory={(v) => setCategoryFilter(v as DeckCategoryFilter)}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari judul, huruf, atau topik dek..."
        />

        {/* Permanent Fanned Collectible Decks Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-sm font-brand font-black uppercase tracking-wider text-slate-700">
                Dek Topik Siap Pakai ({totalFilteredCount})
              </h2>
              {totalFilteredCount > 0 && (
                <span className="text-[11px] font-brand font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Menampilkan {loadedDecks.length} dari {totalFilteredCount} dek
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Arahkan kursor ke kartu untuk mengintip kata, klik dek untuk mulai
            </span>
          </div>

          {decksLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-64 rounded-3xl bg-white border-2 border-slate-200/80 animate-pulse"
                />
              ))}
            </div>
          ) : loadedDecks.length === 0 ? (
            <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 text-center space-y-3 shadow-[0_4px_0_0_#E2E8F0]">
              <div className="flex justify-center">
                <KodiCharacter emotion="curious" size={88} interactive />
              </div>
              <div className="space-y-1">
                <p className="font-brand font-black text-base text-slate-800">
                  Tidak ada dek yang cocok
                </p>
                <p className="text-xs sm:text-sm text-slate-500">
                  Coba ubah filter tingkat JLPT atau kata kunci pencarianmu.
                </p>
              </div>
              {searchQuery.trim().length > 0 && (
                <Button3D
                  variant="white"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="text-xs px-4 py-2 mx-auto"
                >
                  Reset Pencarian
                </Button3D>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {loadedDecks.map((deck) => (
                  <FlashcardDeckCard
                    key={deck.id}
                    deck={deck}
                    disabled={loadingSession}
                    onSelect={handleSelectDeck}
                  />
                ))}
                {isFetchingNextPage &&
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={`next-skeleton-${idx}`}
                      className="h-64 rounded-3xl bg-white border-2 border-slate-200/80 animate-pulse"
                    />
                  ))}
              </div>

              <div ref={loadMoreSentinelRef} className="pt-2 flex flex-col items-center gap-3">
                {hasNextPage ? (
                  <Button3D
                    variant="white"
                    size="sm"
                    disabled={isFetchingNextPage}
                    onClick={() => void fetchNextPage()}
                    className="text-xs px-5 py-2.5"
                  >
                    {isFetchingNextPage ? 'Memuat dek berikutnya...' : 'Muat Lebih Banyak Dek'}
                  </Button3D>
                ) : (
                  loadedDecks.length > 0 && (
                    <p className="text-xs font-semibold text-slate-400">
                      Semua {totalFilteredCount} dek telah ditampilkan
                    </p>
                  )
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
