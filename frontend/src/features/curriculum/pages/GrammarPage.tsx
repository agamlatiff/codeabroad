import { useState, useMemo, useEffect, useRef } from 'react'
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
} from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
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

  const [levelFilter, setLevelFilter] = useState<JlptLevelFilter>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showRomaji, setShowRomaji] = useState(true)
  const [playingExampleKey, setPlayingExampleKey] = useState<string | null>(null)
  const [copiedPointId, setCopiedPointId] = useState<string | null>(null)
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
        point.explanation.toLowerCase().includes(query) ||
        exampleMatch
      )
    })
  }, [grammarPoints, levelFilter, categoryFilter, searchQuery])

  const handlePlayExample = (exampleKey: string, japaneseText: string) => {
    triggerHaptic('tap')
    if (playingExampleKey === exampleKey) {
      audioService.stopSpeech()
      setPlayingExampleKey(null)
      return
    }
    setPlayingExampleKey(exampleKey)
    audioService.speakJapanese(
      japaneseText,
      () => setPlayingExampleKey((prev) => (prev === exampleKey ? null : prev)),
      () => setPlayingExampleKey((prev) => (prev === exampleKey ? null : prev))
    )
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

        {/* Grammar Cards Grid (2 Columns on Desktop) */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-60 rounded-3xl bg-white border-2 border-slate-200/80 animate-pulse"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredPoints.map((point) => {
              const levelCode = (point.level_code ?? 'N5').toUpperCase()
              const accent = LEVEL_ACCENT_STYLES[levelCode] ?? DEFAULT_LEVEL_ACCENT
              const examples = point.examples ?? []
              const isFormulaCopied = copiedPointId === point.id

              return (
                <article
                  key={point.id}
                  className={`bg-white border-2 border-slate-200/90 ${accent.hoverBorder} rounded-3xl overflow-hidden shadow-[0_4px_0_0_#E2E8F0] hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_#CBD5E1] transition-all flex flex-col`}
                >
                  {/* Level-Colored Top Accent Strip */}
                  <div className={`h-1.5 w-full ${accent.topStrip}`} />

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      {/* Level & Category Badges + Subtle Corner Icon */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center flex-wrap gap-2">
                          <span
                            className={`text-[10px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${accent.badge}`}
                          >
                            JLPT {levelCode}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                            {renderCategoryIcon(point.category, 'w-3 h-3')}
                            <span>{formatCategoryLabel(point.category)}</span>
                          </span>
                        </div>
                      </div>

                      <h2 className="font-brand font-black text-base sm:text-lg text-slate-900 leading-snug">
                        {point.title}
                      </h2>

                      {/* Hero Formula Callout with Copy-to-Clipboard */}
                      <div className="bg-gradient-to-r from-blue-50/95 via-indigo-50/60 to-white border border-blue-200/80 border-l-4 border-l-blue-500 rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2.5 shadow-2xs">
                        <code className="font-mono text-xs sm:text-sm font-extrabold text-blue-950 break-words min-w-0">
                          {point.formula}
                        </code>
                        <button
                          type="button"
                          onClick={() => void handleCopyFormula(point.id, point.formula)}
                          aria-label={`Salin rumus: ${point.title}`}
                          title="Salin rumus pola kalimat"
                          className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-brand font-black transition-all cursor-pointer active:translate-y-0.5 ${
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
                              <span className="hidden sm:inline">Salin</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {point.explanation}
                      </p>
                    </div>

                    {/* Example Sentences + Tactile 3D Audio Buttons */}
                    {examples.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        <p className="inline-flex items-center gap-1.5 text-[10px] font-brand font-black uppercase tracking-wider text-slate-500">
                          <Quotes weight="fill" className="w-3 h-3 text-blue-500" />
                          <span>Contoh Kalimat</span>
                        </p>

                        <div className="space-y-2">
                          {examples.map((ex, idx) => {
                            const exampleKey = `${point.id}-${idx}`
                            const isPlaying = playingExampleKey === exampleKey
                            const indexLabel = String(idx + 1).padStart(2, '0')

                            return (
                              <div
                                key={exampleKey}
                                className="rounded-2xl bg-slate-50/95 border border-slate-200/80 px-3.5 py-2.5 flex items-center justify-between gap-3"
                              >
                                <div className="flex items-start gap-2.5 min-w-0">
                                  <span className="mt-0.5 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-black text-slate-500 shrink-0 shadow-2xs">
                                    {indexLabel}
                                  </span>
                                  <div className="min-w-0 space-y-0.5">
                                    <p className="font-brand font-black text-[15px] text-slate-900 break-words leading-snug">
                                      {ex.jp}
                                    </p>
                                    {showRomaji && ex.reading && (
                                      <p className="text-xs font-bold text-blue-600">
                                        {ex.reading}
                                      </p>
                                    )}
                                    <p className="text-xs sm:text-[13px] font-medium text-slate-600">
                                      {ex.id}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handlePlayExample(exampleKey, ex.jp)}
                                  title="Putar pengucapan bahasa Jepang"
                                  aria-label={`Putar audio contoh: ${ex.jp}`}
                                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer active:translate-y-0.5 active:shadow-none ${
                                    isPlaying
                                      ? 'bg-blue-600 border-blue-700 text-white shadow-[0_2px_0_0_#1D4ED8] ring-4 ring-blue-200/70 animate-pulse'
                                      : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 shadow-[0_2px_0_0_#BFDBFE]'
                                  }`}
                                >
                                  <SpeakerHigh weight="fill" className="w-4 h-4" />
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
