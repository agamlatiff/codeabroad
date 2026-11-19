import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Cards,
  Sparkle,
  Clock,
  CheckCircle,
  ArrowRight,
  X,
  HandWaving,
  BowlFood,
  PersonSimpleRun,
  Train,
  ArrowsClockwise,
  Fire,
  MagnifyingGlass,
} from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { useUser } from '@/features/user/hooks/useUser'
import {
  getProfileQueryKey,
  getDailyRewardsQueryKey,
  getActivityLogsQueryKey,
} from '@/shared/constants/queryKeys'
import {
  flashcardService,
  FLASHCARD_DECKS_QUERY_KEY,
  FLASHCARD_DUE_QUERY_KEY,
} from '@/features/flashcard/services/flashcardService'
import type { FlashcardCard, FlashcardDeck } from '@/features/flashcard/types/flashcard'
import { FlashcardFlipCard } from '@/features/flashcard/components/FlashcardFlipCard'
import {
  previewAnkiIntervals,
  resetCardForAnkiRequeue,
  type AnkiIntervalPreviews,
} from '@/features/flashcard/utils/ankiScheduler'
import { triggerHaptic } from '@/shared/utils/haptics'
import { playSound } from '@/shared/utils/sound'

type SessionMode = 'lobby' | 'session' | 'complete'
type JlptFilter = 'ALL' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

interface RatingOption {
  quality: number
  previewKey: keyof AnkiIntervalPreviews
  label: string
  shortcut: string
  className: string
}

const JLPT_FILTER_OPTIONS: Array<{ value: JlptFilter; label: string }> = [
  { value: 'ALL', label: 'Semua' },
  { value: 'N5', label: 'N5' },
  { value: 'N4', label: 'N4' },
  { value: 'N3', label: 'N3' },
  { value: 'N2', label: 'N2' },
  { value: 'N1', label: 'N1' },
]

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

const DECK_ACCENT_STYLES: Record<string, { badge: string; border: string }> = {
  emerald: {
    badge: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    border: 'hover:border-emerald-300',
  },
  blue: {
    badge: 'bg-blue-50 text-blue-600 border-blue-200',
    border: 'hover:border-blue-300',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-600 border-amber-200',
    border: 'hover:border-amber-300',
  },
  violet: {
    badge: 'bg-violet-50 text-violet-600 border-violet-200',
    border: 'hover:border-violet-300',
  },
  cyan: {
    badge: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    border: 'hover:border-cyan-300',
  },
  rose: {
    badge: 'bg-rose-50 text-rose-600 border-rose-200',
    border: 'hover:border-rose-300',
  },
}

function renderDeckIcon(iconName: string) {
  switch (iconName) {
    case 'hand-waving':
      return <HandWaving weight="fill" className="w-6 h-6" />
    case 'clock':
      return <Clock weight="fill" className="w-6 h-6" />
    case 'bowl-food':
      return <BowlFood weight="fill" className="w-6 h-6" />
    case 'person-simple-run':
      return <PersonSimpleRun weight="fill" className="w-6 h-6" />
    case 'train':
      return <Train weight="fill" className="w-6 h-6" />
    case 'sparkle':
      return <Sparkle weight="fill" className="w-6 h-6" />
    default:
      return <Cards weight="fill" className="w-6 h-6" />
  }
}

/**
 * Hybrid Flashcard page (/flashcards):
 * - Lobby: Scheduled Smart Review banner + JLPT N5-N1 filter tabs + Anki 3-state Topic Decks.
 * - Session: Interactive 3D flip card player with TTS audio, Modified SM-2 interval previews,
 *   and Anki intra-session re-queueing when `Ulangi` is pressed.
 */
export const FlashcardPage = () => {
  const queryClient = useQueryClient()
  const { data: userData } = useUser()
  const userIdKey = userData.user?.id ?? 'anonymous'

  const [mode, setMode] = useState<SessionMode>('lobby')
  const [levelFilter, setLevelFilter] = useState<JlptFilter>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

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

  const { data: decks = [], isLoading: decksLoading } = useQuery({
    queryKey: [...FLASHCARD_DECKS_QUERY_KEY, userIdKey, 'ja'],
    queryFn: ({ signal }) => flashcardService.listDecks('ja', { signal }),
    staleTime: 1000 * 60,
  })

  const { data: dueQueue, isLoading: dueLoading } = useQuery({
    queryKey: [...FLASHCARD_DUE_QUERY_KEY, userIdKey, 'ja'],
    queryFn: ({ signal }) => flashcardService.getDueQueue('ja', 20, { signal }),
    staleTime: 1000 * 30,
  })

  const levelCounts = useMemo(() => {
    const counts: Record<JlptFilter, number> = {
      ALL: decks.length,
      N5: 0,
      N4: 0,
      N3: 0,
      N2: 0,
      N1: 0,
    }
    for (const deck of decks) {
      const lvl = deck.jlpt_level.toUpperCase() as JlptFilter
      if (lvl in counts) {
        counts[lvl] += 1
      }
    }
    return counts
  }, [decks])

  const filteredDecks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return decks.filter((deck) => {
      if (levelFilter !== 'ALL' && deck.jlpt_level.toUpperCase() !== levelFilter) {
        return false
      }
      if (!query) return true
      return (
        deck.title.toLowerCase().includes(query) ||
        deck.description.toLowerCase().includes(query) ||
        deck.jlpt_level.toLowerCase().includes(query)
      )
    })
  }, [decks, levelFilter, searchQuery])

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
    },
  })

  const initSessionQueue = (cards: FlashcardCard[], title: string, deckId: string | null) => {
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
  }

  const startDeckSession = async (deck: FlashcardDeck) => {
    triggerHaptic('tap')
    setLoadingSession(true)
    setSessionError(null)
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
  }

  const startDueSession = () => {
    if (!dueQueue || dueQueue.cards.length === 0) return
    triggerHaptic('tap')
    initSessionQueue(dueQueue.cards, 'Ulasan Terjadwal', null)
  }

  const currentCardId = queue[0]
  const currentCard = currentCardId ? cardMap[currentCardId] : undefined

  const handleRate = useCallback(
    async (quality: number) => {
      if (!currentCard || reviewMutation.isPending) return

      triggerHaptic('tap')
      playSound(quality >= 3 ? 'zen_bell' : 'node_tap')

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
    const deck = decks.find((d) => d.id === activeDeckId)
    if (deck) {
      void startDeckSession(deck)
    } else {
      exitToLobby()
    }
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
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10 gap-6 max-w-2xl w-full mx-auto">
          <FlashcardFlipCard
            key={`${currentCard.id}-${reviewedCount}`}
            card={currentCard}
            isFlipped={isFlipped}
            onToggleFlip={() => setIsFlipped((prev) => !prev)}
          />

          {/* Action Controls */}
          <div className="w-full max-w-lg">
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

      <main className="flex-1 min-w-0 w-full px-4 sm:px-8 lg:px-10 py-6 pb-24 md:pb-12 space-y-6">
        {/* Page Header */}
        <header className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-brand font-black text-[11px] uppercase tracking-wider">
            <Cards weight="fill" className="w-3.5 h-3.5" />
            <span>Flashcard Kosakata • JLPT N5–N1</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-brand font-black text-slate-900 tracking-tight">
            Belajar &amp; Ulas Flashcard
          </h1>
          <p className="text-sm text-slate-600">
            Langsung hafalkan kosakata lewat kartu flip Anki SM-2 depan–belakang kapan saja lintas tingkat JLPT N5 hingga N1.
          </p>
        </header>

        {sessionError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            {sessionError}
          </div>
        )}

        {/* Smart Scheduled Review Banner */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-[0_4px_0_0_#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                totalDue > 0
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}
            >
              {totalDue > 0 ? (
                <Clock weight="fill" className="w-6 h-6" />
              ) : (
                <Sparkle weight="fill" className="w-6 h-6" />
              )}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="font-brand font-black text-base text-slate-900">
                  {dueLoading
                    ? 'Memeriksa jadwal ulasan...'
                    : totalDue > 0
                      ? `${totalDue} Kartu Jatuh Tempo untuk Diulas`
                      : totalLearned === 0
                        ? 'Belum Ada Jadwal Ulasan'
                        : 'Semua Jadwal Ulasan Sudah Beres!'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                {totalDue > 0
                  ? 'Ulas kartu ini sekarang agar kosakata tetap menempel di memori jangka panjang.'
                  : totalLearned === 0
                    ? 'Pilih salah satu dek topik di bawah untuk mulai belajar. Kartu yang kamu pelajari otomatis terjadwal di sini.'
                    : `${totalLearned} kartu sudah masuk memori terpantau dan belum ada yang jatuh tempo saat ini.`}
              </p>
            </div>
          </div>

          {totalDue > 0 && (
            <Button3D
              variant="blue"
              size="md"
              onClick={startDueSession}
              icon={<ArrowRight weight="bold" className="w-4 h-4" />}
              className="shrink-0"
            >
              MULAI ULASAN
            </Button3D>
          )}
        </section>

        {/* Level Filter Tabs & Search */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {JLPT_FILTER_OPTIONS.map((opt) => {
              const active = levelFilter === opt.value
              const count = levelCounts[opt.value]
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    triggerHaptic('tap')
                    setLevelFilter(opt.value)
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 font-brand font-black text-xs transition-all cursor-pointer ${
                    active
                      ? 'bg-[#2563EB] text-white border-[#1D4ED8] shadow-[0_3px_0_0_#1D4ED8]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-[0_2px_0_0_#E2E8F0]'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <MagnifyingGlass
              weight="bold"
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau topik dek..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border-2 border-slate-200 focus:border-[#2563EB] outline-none text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Hapus pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg hover:bg-slate-100 text-slate-400 flex items-center justify-center cursor-pointer"
              >
                <X weight="bold" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* Topic Decks Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-brand font-black uppercase tracking-wider text-slate-700">
              Dek Topik Siap Pakai ({filteredDecks.length})
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Klik dek mana saja untuk langsung mulai
            </span>
          </div>

          {decksLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-44 rounded-3xl bg-white border-2 border-slate-200/80 animate-pulse"
                />
              ))}
            </div>
          ) : filteredDecks.length === 0 ? (
            <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 text-center space-y-2 shadow-[0_4px_0_0_#E2E8F0]">
              <p className="font-brand font-black text-base text-slate-800">
                Tidak ada dek yang cocok
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Coba ubah filter tingkat JLPT atau kata kunci pencarianmu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDecks.map((deck) => {
                const style = DECK_ACCENT_STYLES[deck.accent_color] ?? DECK_ACCENT_STYLES.blue
                const newCards = deck.new_cards ?? 0
                const dueCards = deck.due_cards ?? 0
                const scheduledCards = deck.scheduled_cards ?? 0

                const ctaLabel =
                  dueCards > 0
                    ? `Ulas ${dueCards} Kartu`
                    : newCards > 0
                      ? 'Mulai Belajar'
                      : 'Latihan Ulang'

                return (
                  <button
                    key={deck.id}
                    type="button"
                    disabled={loadingSession}
                    onClick={() => void startDeckSession(deck)}
                    className={`group text-left bg-white border-2 border-slate-200/90 ${style.border} rounded-3xl p-5 shadow-[0_4px_0_0_#E2E8F0] hover:shadow-[0_6px_0_0_#CBD5E1] active:translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 disabled:opacity-60`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${style.badge}`}
                      >
                        {renderDeckIcon(deck.icon_name)}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-brand font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {deck.jlpt_level} • {deck.total_cards} Kartu
                          </span>
                          {dueCards > 0 && (
                            <span className="text-[10px] font-brand font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                              Perlu Ulas
                            </span>
                          )}
                        </div>
                        <h3 className="font-brand font-black text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                          {deck.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {deck.description}
                        </p>
                      </div>
                    </div>

                    {/* Anki 3-State Memory Cycle Pills & Dynamic CTA */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center flex-wrap gap-1.5 text-[10px] font-brand font-extrabold">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/70">
                          Baru {newCards}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/70">
                          Ulas {dueCards}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          Ingat {scheduledCards}
                        </span>
                      </div>

                      <span className="text-[11px] font-brand font-black text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 shrink-0">
                        {ctaLabel} <ArrowRight weight="bold" className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
