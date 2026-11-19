import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Quotes, ArrowRight } from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
import { AppTopBar } from '@/shared/components/layout/top-bar/AppTopBar'
import { PageHeroHeader } from '@/shared/components/ui/PageHeroHeader'
import { FilterToolbar } from '@/shared/components/ui/FilterToolbar'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { useUser } from '@/features/user/hooks/useUser'
import {
  curriculumService,
  GRAMMAR_POINTS_QUERY_KEY,
} from '@/features/curriculum/services/curriculumService'
import type { GrammarPoint } from '@/features/curriculum/types/curriculum'
import { triggerHaptic } from '@/shared/utils/haptics'
import {
  LEVEL_ACCENT_STYLES,
  DEFAULT_LEVEL_ACCENT,
  formatCategoryLabel,
  renderCategoryIcon,
} from '@/features/curriculum/constants/grammarStyles'

type JlptLevelFilter = 'ALL' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

const JLPT_LEVEL_OPTIONS: Array<{ value: JlptLevelFilter; label: string }> = [
  { value: 'N5', label: 'N5' },
  { value: 'N4', label: 'N4' },
  { value: 'N3', label: 'N3' },
  { value: 'N2', label: 'N2' },
  { value: 'N1', label: 'N1' },
  { value: 'ALL', label: 'Semua' },
]

const VALID_JLPT_FILTERS: ReadonlySet<JlptLevelFilter> = new Set([
  'ALL',
  'N5',
  'N4',
  'N3',
  'N2',
  'N1',
])

function parseLevelFilterParam(raw: string | null): JlptLevelFilter {
  const upper = (raw ?? '').trim().toUpperCase() as JlptLevelFilter
  return VALID_JLPT_FILTERS.has(upper) ? upper : 'N5'
}

/**
 * Full-width 3D tactile Grammar Guide (/grammar):
 * - Unified AppTopBar + AppBreadcrumb + Clean Tactile PageHeroHeader + 1-Row FilterToolbar.
 * - Always displays accurate formula Romaji beneath each pattern for beginner clarity.
 */
export const GrammarPage = () => {
  const { data: userData } = useUser()
  const userIdKey = userData.user?.id ?? 'anonymous'
  const [searchParams, setSearchParams] = useSearchParams()

  const levelFilter = useMemo(
    () => parseLevelFilterParam(searchParams.get('level')),
    [searchParams]
  )
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSelectLevel = (nextLevel: JlptLevelFilter) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (nextLevel === 'N5') {
          next.delete('level')
        } else {
          next.set('level', nextLevel)
        }
        return next
      },
      { replace: true }
    )
  }

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

  const categoryOptions = useMemo(() => {
    const seen = new Set<string>()
    for (const point of grammarPoints) {
      if (point.category) seen.add(point.category)
    }
    return [
      { value: 'ALL', label: 'Kategori: Semua' },
      ...Array.from(seen).map((cat) => ({
        value: cat,
        label: formatCategoryLabel(cat),
      })),
    ]
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

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      <AppLeftSidebar />

      <main className="flex-1 min-w-0 w-full px-4 sm:px-8 lg:px-10 py-6 pb-24 md:pb-12 space-y-6">
        <AppTopBar
          breadcrumbs={[
            { label: 'Beranda', to: '/curriculum' },
            { label: 'Panduan Grammar' },
            { label: levelFilter === 'ALL' ? 'Semua Level' : `JLPT ${levelFilter}` },
          ]}
        />

        {/* Unified Clean Tactile Hero Header */}
        <PageHeroHeader
          theme="blue"
          icon={<BookOpen weight="fill" className="w-6 h-6" />}
          badges={
            <span className="text-[11px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800">
              Tata Bahasa • JLPT N5–N1
            </span>
          }
          title="Panduan Grammar"
          description="Referensi pola kalimat, partikel, konjugasi, dan keigo lengkap dengan rumus cepat, contoh nyata, dan pelafalan penutur."
          rightSlot={
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3.5 py-2 rounded-2xl bg-white border-2 border-blue-200/80 text-xs font-brand font-black text-blue-900 shadow-2xs">
                {filteredPoints.length} Materi
              </div>
              <div className="hidden sm:block">
                <KodiCharacter emotion="happy" size={64} />
              </div>
            </div>
          }
        />

        {/* Compact 1-Row Segmented + Category + Search Toolbar */}
        <FilterToolbar
          levelOptions={JLPT_LEVEL_OPTIONS.map((opt) => ({
            value: opt.value,
            label: opt.label,
            count: levelCounts[opt.value],
          }))}
          selectedLevel={levelFilter}
          onSelectLevel={(v) => handleSelectLevel(v as JlptLevelFilter)}
          categoryOptions={categoryOptions}
          selectedCategory={categoryFilter}
          onSelectCategory={setCategoryFilter}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari pola kalimat, partikel, atau contoh..."
        />

        {/* Gentle onboarding hint */}
        {!isLoading && filteredPoints.length > 0 && (
          <div className="flex items-start sm:items-center gap-3 rounded-2xl border border-amber-200/90 bg-amber-50/70 px-4 py-3 text-xs sm:text-sm text-amber-900">
            <span className="w-8 h-8 rounded-xl bg-white border border-amber-200 flex items-center justify-center shrink-0 font-brand font-black text-amber-600">
              💡
            </span>
            <p className="leading-relaxed">
              Mulai dari <b>satu materi</b> dulu. Klik kartu untuk membuka halaman materi lengkap beserta penjelasan,
              contoh kalimat, dan audio pelan <b>0.6x</b>. Baris biru di bawah rumus adalah cara bacanya (Romaji).
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
                <Link
                  key={point.id}
                  to={`/grammar/${encodeURIComponent(point.code || point.id)}`}
                  onClick={() => triggerHaptic('tap')}
                  aria-label={`Pelajari materi: ${point.title}`}
                  className={`group text-left bg-white border-2 border-slate-200/90 ${accent.hoverBorder} rounded-3xl overflow-hidden shadow-[0_4px_0_0_#E2E8F0] hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_#CBD5E1] active:translate-y-0.5 active:shadow-[0_2px_0_0_#E2E8F0] transition-all flex flex-col focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200`}
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

                    <h2 className="font-brand font-black text-[15px] sm:text-base text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {point.title}
                    </h2>

                    <div className="rounded-2xl bg-gradient-to-r from-blue-50/95 via-indigo-50/60 to-white border border-blue-200/80 border-l-4 border-l-blue-500 px-3 py-2 space-y-0.5">
                      <code className="block font-mono text-xs sm:text-[13px] font-extrabold text-blue-950 break-words">
                        {point.formula}
                      </code>
                      {point.formula_reading && (
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
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
