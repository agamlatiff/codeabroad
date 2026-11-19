import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BookOpen,
  MagnifyingGlass,
  SpeakerHigh,
  X,
  Quotes,
  Copy,
  Check,
  Eye,
  EyeSlash,
  SquaresFour,
  TextAa,
  ArrowsLeftRight,
  LinkSimple,
  ClockCounterClockwise,
  CrownSimple,
  ArrowLeft,
  ArrowRight,
} from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
import { AccessibleModal } from '@/shared/components/ui/AccessibleModal'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { useUser } from '@/features/user/hooks/useUser'
import {
  curriculumService,
  GRAMMAR_POINTS_QUERY_KEY,
} from '@/features/curriculum/services/curriculumService'
import type { GrammarPoint } from '@/features/curriculum/types/curriculum'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

type JlptLevelFilter = 'ALL' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

const JLPT_LEVEL_OPTIONS: Array<{ value: JlptLevelFilter; label: string }> = [
  { value: 'ALL', label: 'Semua' },
  { value: 'N5', label: 'N5' },
  { value: 'N4', label: 'N4' },
  { value: 'N3', label: 'N3' },
  { value: 'N2', label: 'N2' },
  { value: 'N1', label: 'N1' },
]

const CATEGORY_LABELS: Record<string, string> = {
  sentence_pattern: 'Pola Kalimat',
  conjugation: 'Konjugasi',
  particle: 'Partikel',
  tense: 'Tense',
  honorific: 'Keigo & Sopan',
}

interface LevelAccentTheme {
  topStrip: string
  badge: string
  hoverBorder: string
}

const LEVEL_ACCENT_STYLES: Record<string, LevelAccentTheme> = {
  N5: {
    topStrip: 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    hoverBorder: 'hover:border-emerald-300/90',
  },
  N4: {
    topStrip: 'bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-500',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    hoverBorder: 'hover:border-sky-300/90',
  },
  N3: {
    topStrip: 'bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-500',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    hoverBorder: 'hover:border-violet-300/90',
  },
  N2: {
    topStrip: 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    hoverBorder: 'hover:border-amber-300/90',
  },
  N1: {
    topStrip: 'bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    hoverBorder: 'hover:border-rose-300/90',
  },
}

const DEFAULT_LEVEL_ACCENT: LevelAccentTheme = {
  topStrip: 'bg-gradient-to-r from-slate-400 to-slate-500',
  badge: 'bg-slate-100 text-slate-700 border-slate-200',
  hoverBorder: 'hover:border-blue-300/90',
}

function formatCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category.replace(/_/g, ' ')
}

function renderCategoryIcon(category: string, className = 'w-3.5 h-3.5') {
  switch (category) {
    case 'ALL':
      return <SquaresFour weight="bold" className={className} />
    case 'sentence_pattern':
      return <TextAa weight="bold" className={className} />
    case 'conjugation':
      return <ArrowsLeftRight weight="bold" className={className} />
    case 'particle':
      return <LinkSimple weight="bold" className={className} />
    case 'tense':
      return <ClockCounterClockwise weight="bold" className={className} />
    case 'honorific':
      return <CrownSimple weight="fill" className={className} />
    default:
      return <BookOpen weight="bold" className={className} />
  }
}

/**
 * Full-width 3D tactile Grammar Guide (/grammar):
 * - Covers JLPT N5-N1 grammar patterns with gradient hero banner, level-colored accent strips,
 *   formula callouts with copy-to-clipboard, Romaji visibility toggle, and tactile Japanese TTS buttons.
 */
export const GrammarPage = () => {
  const { data: userData } = useUser()
  const userIdKey = userData.user?.id ?? 'anonymous'

  // Default to N5 so beginners see a focused set instead of the full 56-card wall.
  const [levelFilter, setLevelFilter] = useState<JlptLevelFilter>('N5')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showRomaji, setShowRomaji] = useState(true)
  const [playingExampleKey, setPlayingExampleKey] = useState<string | null>(null)
  const [copiedPointId, setCopiedPointId] = useState<string | null>(null)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      audioService.stopSpeech()
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const { data: grammarPoints = [], isLoading } = useQuery({
    queryKey: [...GRAMMAR_POINTS_QUERY_KEY, userIdKey, 'ja'],
    queryFn: ({ signal }) => curriculumService.getGrammarPointsByFilter('ja', undefined, { signal }),
    staleTime: 1000 * 60 * 5,
  })

  const levelCounts = useMemo(() => {
    const counts: Record<JlptLevelFilter, number> = {
      ALL: grammarPoints.length,
      N5: 0,
      N4: 0,
      N3: 0,
      N2: 0,
      N1: 0,
    }
    for (const point of grammarPoints) {
      const code = (point.level_code ?? 'N5').toUpperCase() as JlptLevelFilter
      if (code in counts) {
        counts[code] += 1
      }
    }
    return counts
  }, [grammarPoints])

  const availableCategories = useMemo(() => {
    const seen = new Set<string>()
    for (const point of grammarPoints) {
      if (point.category) seen.add(point.category)
    }
    return ['ALL', ...Array.from(seen)]
  }, [grammarPoints])

  const filteredPoints = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return grammarPoints.filter((point: GrammarPoint) => {
      const levelCode = (point.level_code ?? 'N5').toUpperCase()
      if (levelFilter !== 'ALL' && levelCode !== levelFilter) return false
      if (categoryFilter !== 'ALL' && point.category !== categoryFilter) return false
      if (!query) return true

      const exampleMatch = (point.examples ?? []).some(
        (ex) =>
          ex.jp.toLowerCase().includes(query) ||
          ex.reading.toLowerCase().includes(query) ||
          ex.id.toLowerCase().includes(query)
      )

      return (
        point.title.toLowerCase().includes(query) ||
        point.formula.toLowerCase().includes(query) ||
        (point.formula_reading ?? '').toLowerCase().includes(query) ||
        point.explanation.toLowerCase().includes(query) ||
        exampleMatch
      )
    })
  }, [grammarPoints, levelFilter, categoryFilter, searchQuery])

  const selectedIndex = useMemo(
    () => (selectedPointId ? filteredPoints.findIndex((p) => p.id === selectedPointId) : -1),
    [filteredPoints, selectedPointId]
  )
  const selectedPoint = selectedIndex >= 0 ? filteredPoints[selectedIndex] : null

  const handleOpenPoint = (pointId: string) => {
    triggerHaptic('tap')
    setSelectedPointId(pointId)
  }

  const handleClosePoint = useCallback(() => {
    audioService.stopSpeech()
    setPlayingExampleKey(null)
    setSelectedPointId(null)
  }, [])

  const handleStepPoint = (direction: -1 | 1) => {
    const nextPoint = filteredPoints[selectedIndex + direction]
    if (!nextPoint) return
    triggerHaptic('tap')
    audioService.stopSpeech()
    setPlayingExampleKey(null)
    setSelectedPointId(nextPoint.id)
  }

  const handlePlayExample = (exampleKey: string, japaneseText: string, rate?: number) => {
    triggerHaptic('tap')
    if (playingExampleKey === exampleKey) {
      audioService.stopSpeech()
      setPlayingExampleKey(null)
      return
    }
    audioService.stopSpeech()
    setPlayingExampleKey(exampleKey)
    const clear = () => setPlayingExampleKey((prev) => (prev === exampleKey ? null : prev))
    if (typeof rate === 'number') {
      audioService.speakLanguage(japaneseText, 'ja-JP', clear, clear, rate)
    } else {
      audioService.speakJapanese(japaneseText, clear, clear)
    }
  }

  const handleCopyFormula = async (pointId: string, formula: string) => {
    triggerHaptic('tap')
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(formula)
      }
      setCopiedPointId(pointId)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => {
        setCopiedPointId((prev) => (prev === pointId ? null : prev))
      }, 1500)
    } catch {
      // Degrade gracefully when clipboard permission is unavailable
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      <AppLeftSidebar />

      <main className="flex-1 min-w-0 w-full px-4 sm:px-8 lg:px-10 py-6 pb-24 md:pb-12 space-y-6">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white p-5 sm:p-6 shadow-[0_6px_0_0_#1E40AF]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-14 -right-14 w-48 h-48 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 left-1/3 w-56 h-36 rounded-full bg-sky-300/15 blur-2xl"
          />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                <BookOpen weight="fill" className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="text-xl sm:text-2xl font-brand font-black tracking-tight">
                    Panduan Grammar
                  </h1>
                  <span className="text-[11px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-white">
                    JLPT N5–N1
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
                  Referensi pola kalimat, partikel, konjugasi, dan keigo lengkap dengan rumus cepat, contoh nyata, dan pelafalan penutur.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
              <div className="px-3.5 py-2 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-xs text-xs font-brand font-black text-white shadow-2xs">
                {filteredPoints.length} Materi
              </div>
              <div className="hidden sm:block">
                <KodiCharacter emotion="happy" size={64} />
              </div>
            </div>
          </div>
        </section>

        {/* Controls: JLPT Tabs, Search, Category Chips & Romaji Toggle */}
        <section className="space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* JLPT Level Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {JLPT_LEVEL_OPTIONS.map((opt) => {
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
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 font-brand font-black text-xs transition-all cursor-pointer active:translate-y-0.5 ${
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

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <MagnifyingGlass
                weight="bold"
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pola kalimat, partikel, atau contoh..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border-2 border-slate-200 focus:border-[#2563EB] outline-none text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-colors shadow-2xs"
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
          </div>

          {/* Category Filter Chips + Interactive Romaji Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {availableCategories.map((cat) => {
                const active = categoryFilter === cat
                const label = cat === 'ALL' ? 'Semua Kategori' : formatCategoryLabel(cat)
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap')
                      setCategoryFilter(cat)
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-brand font-bold border-2 transition-all cursor-pointer active:translate-y-0.5 ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900 shadow-[0_2px_0_0_#020617]'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-[0_2px_0_0_#E2E8F0]'
                    }`}
                  >
                    {renderCategoryIcon(cat, 'w-3.5 h-3.5')}
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap')
                setShowRomaji((prev) => !prev)
              }}
              aria-pressed={showRomaji}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-brand font-black border-2 transition-all cursor-pointer shrink-0 self-start sm:self-center active:translate-y-0.5 ${
                showRomaji
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-[0_2px_0_0_#BFDBFE]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-[0_2px_0_0_#E2E8F0]'
              }`}
              title="Tampilkan atau sembunyikan panduan baca Romaji untuk latihan membaca aksara Jepang"
            >
              {showRomaji ? (
                <Eye weight="fill" className="w-4 h-4 text-blue-600" />
              ) : (
                <EyeSlash weight="bold" className="w-4 h-4 text-slate-500" />
              )}
              <span>Romaji: {showRomaji ? 'Tampil' : 'Sembunyi'}</span>
            </button>
          </div>
        </section>

        {/* Gentle onboarding hint so beginners know how to use the guide */}
        {!isLoading && filteredPoints.length > 0 && (
          <div className="flex items-start sm:items-center gap-3 rounded-2xl border border-amber-200/90 bg-amber-50/70 px-4 py-3 text-xs sm:text-sm text-amber-900">
            <span className="w-8 h-8 rounded-xl bg-white border border-amber-200 flex items-center justify-center shrink-0 font-brand font-black text-amber-600">
              💡
            </span>
            <p className="leading-relaxed">
              Mulai dari <b>satu materi</b> dulu. Klik kartu untuk membuka penjelasan lengkap, contoh kalimat,
              dan audio pelan <b>0.6x</b>. Baris biru di bawah rumus adalah cara bacanya (Romaji).
            </p>
          </div>
        )}

        {/* Compact Scannable Grammar Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-52 rounded-3xl bg-white border-2 border-slate-200/80 animate-pulse"
              />
            ))}
          </div>
        ) : filteredPoints.length === 0 ? (
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 text-center space-y-2 shadow-[0_4px_0_0_#E2E8F0]">
            <p className="font-brand font-black text-base text-slate-800">
              Tidak ada materi grammar yang cocok
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              Coba pilih tingkat JLPT lain atau ubah kata kunci pencarianmu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPoints.map((point, pointIdx) => {
              const levelCode = (point.level_code ?? 'N5').toUpperCase()
              const accent = LEVEL_ACCENT_STYLES[levelCode] ?? DEFAULT_LEVEL_ACCENT
              const exampleCount = point.examples?.length ?? 0

              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => handleOpenPoint(point.id)}
                  aria-label={`Pelajari materi: ${point.title}`}
                  className={`group text-left bg-white border-2 border-slate-200/90 ${accent.hoverBorder} rounded-3xl overflow-hidden shadow-[0_4px_0_0_#E2E8F0] hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_#CBD5E1] active:translate-y-0.5 active:shadow-[0_2px_0_0_#E2E8F0] transition-all flex flex-col cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200`}
                >
                  <div className={`h-1.5 w-full ${accent.topStrip}`} />

                  <div className="p-4 sm:p-5 flex-1 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span
                          className={`text-[10px] font-brand font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${accent.badge}`}
                        >
                          {levelCode}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-brand font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                          {renderCategoryIcon(point.category, 'w-3 h-3')}
                          <span>{formatCategoryLabel(point.category)}</span>
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-black text-slate-400">
                        #{String(pointIdx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h2 className="font-brand font-black text-[15px] sm:text-base text-slate-900 leading-snug line-clamp-2">
                      {point.title}
                    </h2>

                    <div className="rounded-2xl bg-gradient-to-r from-blue-50/95 via-indigo-50/60 to-white border border-blue-200/80 border-l-4 border-l-blue-500 px-3 py-2 space-y-0.5">
                      <code className="block font-mono text-xs sm:text-[13px] font-extrabold text-blue-950 break-words">
                        {point.formula}
                      </code>
                      {showRomaji && point.formula_reading && (
                        <p className="text-[11px] font-bold text-blue-600 break-words">
                          {point.formula_reading}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {point.explanation}
                    </p>

                    <div className="mt-auto pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                      <span className="inline-flex items-center gap-1 text-[10px] font-brand font-bold text-slate-500">
                        <Quotes weight="fill" className="w-3 h-3 text-blue-400" />
                        {exampleCount} contoh kalimat
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-brand font-black text-blue-600 group-hover:gap-1.5 transition-all">
                        Pelajari Materi
                        <ArrowRight weight="bold" className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </main>

      {/* ── FOCUS STUDY MODAL: 1 grammar point at a time ── */}
      <AccessibleModal
        isOpen={Boolean(selectedPoint)}
        onClose={handleClosePoint}
        ariaLabel={selectedPoint ? `Materi grammar: ${selectedPoint.title}` : 'Materi grammar'}
      >
        {selectedPoint && (
          <GrammarFocusPanel
            point={selectedPoint}
            positionLabel={`${selectedIndex + 1} / ${filteredPoints.length}`}
            showRomaji={showRomaji}
            isFormulaCopied={copiedPointId === selectedPoint.id}
            playingExampleKey={playingExampleKey}
            hasPrev={selectedIndex > 0}
            hasNext={selectedIndex >= 0 && selectedIndex < filteredPoints.length - 1}
            onPrev={() => handleStepPoint(-1)}
            onNext={() => handleStepPoint(1)}
            onClose={handleClosePoint}
            onCopyFormula={() => void handleCopyFormula(selectedPoint.id, selectedPoint.formula)}
            onPlayExample={handlePlayExample}
          />
        )}
      </AccessibleModal>
    </div>
  )
}

interface GrammarFocusPanelProps {
  point: GrammarPoint
  positionLabel: string
  showRomaji: boolean
  isFormulaCopied: boolean
  playingExampleKey: string | null
  hasPrev: boolean
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
  onClose: () => void
  onCopyFormula: () => void
  onPlayExample: (exampleKey: string, japaneseText: string, rate?: number) => void
}

const SLOW_SPEECH_RATE = 0.58

const GrammarFocusPanel = ({
  point,
  positionLabel,
  showRomaji,
  isFormulaCopied,
  playingExampleKey,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onClose,
  onCopyFormula,
  onPlayExample,
}: GrammarFocusPanelProps) => {
  const levelCode = (point.level_code ?? 'N5').toUpperCase()
  const accent = LEVEL_ACCENT_STYLES[levelCode] ?? DEFAULT_LEVEL_ACCENT
  const examples = point.examples ?? []

  return (
    <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl border-2 border-slate-200 shadow-[0_8px_0_0_#CBD5E1] overflow-hidden flex flex-col">
      <div className={`h-2 w-full ${accent.topStrip}`} />

      {/* Header */}
      <div className="px-5 sm:px-6 pt-4 pb-3 flex items-start justify-between gap-3 border-b border-slate-100">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center flex-wrap gap-1.5">
            <span
              className={`text-[10px] font-brand font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${accent.badge}`}
            >
              JLPT {levelCode}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-brand font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              {renderCategoryIcon(point.category, 'w-3 h-3')}
              <span>{formatCategoryLabel(point.category)}</span>
            </span>
            <span className="text-[10px] font-mono font-black text-slate-400">{positionLabel}</span>
          </div>
          <h2 className="font-brand font-black text-lg sm:text-xl text-slate-900 leading-snug">
            {point.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup materi"
          className="w-9 h-9 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 cursor-pointer shadow-[0_2px_0_0_#E2E8F0] active:translate-y-0.5"
        >
          <X weight="bold" className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 sm:px-6 py-4 space-y-4">
        {/* Hero formula */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/70 to-white border-2 border-blue-200/80 p-4 space-y-2">
          <p className="text-[10px] font-brand font-black uppercase tracking-wider text-blue-500">
            Rumus
          </p>
          <code className="block font-mono text-sm sm:text-base font-extrabold text-blue-950 break-words">
            {point.formula}
          </code>
          {showRomaji && point.formula_reading && (
            <p className="text-xs sm:text-sm font-bold text-blue-600 break-words">
              Cara baca: {point.formula_reading}
            </p>
          )}
          <button
            type="button"
            onClick={onCopyFormula}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-brand font-black transition-all cursor-pointer active:translate-y-0.5 ${
              isFormulaCopied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
            }`}
          >
            {isFormulaCopied ? (
              <>
                <Check weight="bold" className="w-3 h-3 text-emerald-600" />
                <span>Disalin</span>
              </>
            ) : (
              <>
                <Copy weight="bold" className="w-3 h-3" />
                <span>Salin Rumus</span>
              </>
            )}
          </button>
        </div>

        {/* Explanation */}
        <div className="space-y-1">
          <p className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-500">
            Penjelasan
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{point.explanation}</p>
        </div>

        {/* Examples */}
        {examples.length > 0 && (
          <div className="space-y-2">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-brand font-black uppercase tracking-wider text-slate-500">
              <Quotes weight="fill" className="w-3 h-3 text-blue-500" />
              <span>Contoh Kalimat</span>
            </p>
            {examples.map((ex, idx) => {
              const normalKey = `${point.id}-${idx}-normal`
              const slowKey = `${point.id}-${idx}-slow`
              const isPlayingNormal = playingExampleKey === normalKey
              const isPlayingSlow = playingExampleKey === slowKey

              return (
                <div
                  key={`${point.id}-${idx}`}
                  className="rounded-2xl bg-slate-50/95 border border-slate-200/80 px-3.5 py-3 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="mt-0.5 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-black text-slate-500 shrink-0 shadow-2xs">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <p className="font-brand font-black text-base text-slate-900 break-words leading-snug">
                        {ex.jp}
                      </p>
                      {showRomaji && ex.reading && (
                        <p className="text-xs font-bold text-blue-600">{ex.reading}</p>
                      )}
                      <p className="text-xs sm:text-[13px] font-medium text-slate-600">{ex.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onPlayExample(normalKey, ex.jp)}
                      aria-label={`Putar audio normal: ${ex.jp}`}
                      title="Putar kecepatan normal"
                      className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer active:translate-y-0.5 ${
                        isPlayingNormal
                          ? 'bg-blue-600 border-blue-700 text-white shadow-[0_2px_0_0_#1D4ED8] animate-pulse'
                          : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 shadow-[0_2px_0_0_#BFDBFE]'
                      }`}
                    >
                      <SpeakerHigh weight="fill" className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onPlayExample(slowKey, ex.jp, SLOW_SPEECH_RATE)}
                      aria-label={`Putar audio pelan: ${ex.jp}`}
                      title="Putar pelan 0.6x"
                      className={`h-9 px-2 rounded-xl border-2 flex items-center justify-center gap-0.5 text-[10px] font-brand font-black transition-all cursor-pointer active:translate-y-0.5 ${
                        isPlayingSlow
                          ? 'bg-blue-600 border-blue-700 text-white shadow-[0_2px_0_0_#1D4ED8] animate-pulse'
                          : 'bg-white hover:bg-blue-50 border-blue-200 text-blue-700 shadow-[0_2px_0_0_#BFDBFE]'
                      }`}
                    >
                      <SpeakerHigh weight="bold" className="w-3.5 h-3.5" />
                      0.6x
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer navigation */}
      <div className="px-5 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-xs font-brand font-black text-slate-700 shadow-[0_2px_0_0_#E2E8F0] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:translate-y-0.5"
        >
          <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-[#1D4ED8] bg-[#2563EB] text-xs font-brand font-black text-white shadow-[0_3px_0_0_#1D4ED8] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:translate-y-0.5"
        >
          <span>Berikutnya</span>
          <ArrowRight weight="bold" className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
