import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BookOpen,
  MagnifyingGlass,
  SpeakerHigh,
  X,
  Quotes,
} from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
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

const LEVEL_BADGE_STYLES: Record<string, string> = {
  N5: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  N4: 'bg-sky-50 text-sky-700 border-sky-200',
  N3: 'bg-violet-50 text-violet-700 border-violet-200',
  N2: 'bg-amber-50 text-amber-800 border-amber-200',
  N1: 'bg-rose-50 text-rose-700 border-rose-200',
}

function formatCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category.replace(/_/g, ' ')
}

/**
 * Full-width interactive Grammar Guide (/grammar):
 * - Covers JLPT N5-N1 grammar patterns with level filter, category filter, and search.
 * - Shows clean topic formulas, explanations, and real Japanese example sentences with TTS audio.
 */
export const GrammarPage = () => {
  const { data: userData } = useUser()
  const userIdKey = userData.user?.id ?? 'anonymous'

  const [levelFilter, setLevelFilter] = useState<JlptLevelFilter>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [playingExampleKey, setPlayingExampleKey] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      audioService.stopSpeech()
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

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      <AppLeftSidebar />

      <main className="flex-1 min-w-0 w-full px-4 sm:px-8 lg:px-10 py-6 pb-24 md:pb-12 space-y-6">
        {/* Header Card */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-[0_4px_0_0_#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <BookOpen weight="fill" className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-xl sm:text-2xl font-brand font-black text-slate-900 tracking-tight">
                  Panduan Grammar
                </h1>
                <span className="text-[11px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  JLPT N5–N1
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Pola kalimat, partikel, konjugasi, dan contoh pemakaian bahasa Jepang lengkap dengan pelafalan audio.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-brand font-black text-slate-700 shrink-0 self-start sm:self-center">
            <span>{filteredPoints.length} Materi</span>
          </div>
        </section>

        {/* Controls: Search, JLPT Level Tabs, & Category Pills */}
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
          </div>

          {/* Category Filter Chips */}
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-brand font-bold border transition-all cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </section>

        {/* Grammar Cards Grid (2 Columns on Desktop) */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-56 rounded-3xl bg-white border-2 border-slate-200/80 animate-pulse"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredPoints.map((point) => {
              const levelCode = (point.level_code ?? 'N5').toUpperCase()
              const levelBadgeClass =
                LEVEL_BADGE_STYLES[levelCode] ?? 'bg-slate-100 text-slate-700 border-slate-200'
              const examples = point.examples ?? []

              return (
                <article
                  key={point.id}
                  className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-[0_4px_0_0_#E2E8F0] flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    {/* User-Friendly Level & Category Badges (No internal DB code) */}
                    <div className="flex items-center flex-wrap gap-2">
                      <span
                        className={`text-[10px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${levelBadgeClass}`}
                      >
                        JLPT {levelCode}
                      </span>
                      <span className="text-[10px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                        {formatCategoryLabel(point.category)}
                      </span>
                    </div>

                    <h2 className="font-brand font-black text-base sm:text-lg text-slate-900 leading-snug">
                      {point.title}
                    </h2>

                    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 font-mono text-xs sm:text-sm font-bold text-blue-800 break-words">
                      {point.formula}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {point.explanation}
                    </p>
                  </div>

                  {/* Example Sentences + TTS Audio */}
                  {examples.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <p className="inline-flex items-center gap-1.5 text-[10px] font-brand font-black uppercase tracking-wider text-slate-500">
                        <Quotes weight="fill" className="w-3 h-3 text-blue-500" />
                        <span>Contoh Kalimat</span>
                      </p>

                      <div className="space-y-2">
                        {examples.map((ex, idx) => {
                          const exampleKey = `${point.id}-${idx}`
                          const isPlaying = playingExampleKey === exampleKey
                          return (
                            <div
                              key={exampleKey}
                              className="rounded-2xl bg-slate-50/90 border border-slate-200/80 px-3.5 py-2.5 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0 space-y-0.5">
                                <p className="font-bold text-sm text-slate-900 break-words">
                                  {ex.jp}
                                </p>
                                {ex.reading && (
                                  <p className="text-[11px] font-semibold text-blue-600">
                                    {ex.reading}
                                  </p>
                                )}
                                <p className="text-xs text-slate-600">{ex.id}</p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handlePlayExample(exampleKey, ex.jp)}
                                title="Putar pengucapan bahasa Jepang"
                                aria-label={`Putar audio contoh: ${ex.jp}`}
                                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                  isPlaying
                                    ? 'bg-blue-600 border-blue-700 text-white shadow-[0_2px_0_0_#1D4ED8]'
                                    : 'bg-white border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 shadow-2xs'
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
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
