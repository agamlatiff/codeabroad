import { useEffect, useState, useMemo, useId } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Sparkle } from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
import { AppTopBar } from '@/shared/components/layout/top-bar/AppTopBar'
import { FilterToolbar } from '@/shared/components/ui/FilterToolbar'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { DidYouKnowCallout } from '@/shared/components/ui/DidYouKnowCallout'
import { useUser } from '@/features/user/hooks/useUser'
import {
  curriculumService,
  GRAMMAR_POINTS_QUERY_KEY,
} from '@/features/curriculum/services/curriculumService'
import type { GrammarPoint } from '@/features/curriculum/types/curriculum'
import { formatCategoryLabel, renderCategoryIcon } from '@/features/curriculum/constants/grammarStyles'
import { GrammarEditorialCard } from '@/features/curriculum/components/GrammarEditorialCard'
import { GrammarHeroIllustration } from '@/features/curriculum/components/GrammarHeroIllustration'

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
  const heroPatternId = `grammar-hero-seigaiha-${useId().replace(/:/g, '')}`
  const [searchParams, setSearchParams] = useSearchParams()

  const rawLevelParam = searchParams.get('level')
  const levelFilter = useMemo(() => parseLevelFilterParam(rawLevelParam), [rawLevelParam])
  const categoryFilter = searchParams.get('category')?.trim() || 'ALL'
  const [searchQuery, setSearchQuery] = useState('')

  // Ensure default N5 reflects explicitly in /grammar?level=N5 for consistent sharable URLs
  useEffect(() => {
    if (!rawLevelParam || rawLevelParam.trim().toUpperCase() !== levelFilter) {
      const next = new URLSearchParams(searchParams)
      next.set('level', levelFilter)
      setSearchParams(next, { replace: true })
    }
  }, [levelFilter, rawLevelParam, searchParams, setSearchParams])

  const handleSelectLevel = (nextLevel: JlptLevelFilter) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('level', nextLevel)
        return next
      },
      { replace: true }
    )
  }

  const handleSelectCategory = (nextCat: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('level', levelFilter)
        if (nextCat === 'ALL') {
          next.delete('category')
        } else {
          next.set('category', nextCat)
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

  const categoryCountsForLevel = useMemo(() => {
    const counts = new Map<string, number>()
    for (const point of grammarPoints) {
      const code = (point.level_code ?? 'N5').toUpperCase()
      if (levelFilter !== 'ALL' && code !== levelFilter) continue
      if (!point.category) continue
      counts.set(point.category, (counts.get(point.category) ?? 0) + 1)
    }
    return Array.from(counts.entries()).map(([category, count]) => ({
      category,
      label: formatCategoryLabel(category),
      count,
    }))
  }, [grammarPoints, levelFilter])

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

      <main className="flex-1 min-w-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 md:pb-12 space-y-5">
        <AppTopBar
          breadcrumbs={[
            { label: 'Beranda', to: '/curriculum' },
            { label: 'Panduan Grammar' },
            { label: levelFilter === 'ALL' ? 'Semua Level' : `JLPT ${levelFilter}` },
          ]}
        />

        {/* Custom Editorial Grammar Hero Banner with Kodi & Syntax Blocks Illustration */}
        <section className="relative rounded-3xl border-2 border-slate-200/90 bg-gradient-to-br from-blue-50/75 via-white to-indigo-50/45 shadow-[0_4px_0_0_#E2E8F0] overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500" />

          {/* Subtle Japanese Seigaiha Background Pattern */}
          <svg
            className="absolute inset-0 w-full h-full text-blue-700 opacity-[0.05] pointer-events-none"
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

          <div className="relative z-10 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left Info + Quick Category Count Chips */}
            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-blue-500 to-indigo-600 shadow-[0_3px_0_0_#1E3A8A] text-white flex items-center justify-center shrink-0">
                <BookOpen weight="fill" className="w-6 h-6" />
              </div>

              <div className="space-y-2.5 min-w-0 flex-1">
                <div className="space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-[11px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800">
                      Tata Bahasa • JLPT N5–N1
                    </span>
                    <span className="text-[11px] font-brand font-black px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                      {levelFilter === 'ALL' ? 'Semua Level' : `JLPT ${levelFilter}`}
                    </span>
                  </div>

                  <h1 className="text-lg sm:text-xl font-brand font-black text-slate-900 tracking-tight leading-snug">
                    Panduan Grammar
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed font-medium">
                    Referensi pola kalimat, partikel, konjugasi, dan keigo lengkap dengan rumus cepat, contoh nyata, dan pelafalan penutur.
                  </p>
                </div>

                {/* Interactive Category Quick-Filter Pills for Active Level */}
                {categoryCountsForLevel.length > 0 && (
                  <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
                    {categoryCountsForLevel.map((item) => {
                      const isActive = categoryFilter === item.category
                      return (
                        <button
                          key={item.category}
                          type="button"
                          onClick={() => handleSelectCategory(isActive ? 'ALL' : item.category)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-brand font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#2563EB] text-white border-[#1D4ED8] shadow-xs'
                              : 'bg-white/90 text-slate-700 border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/50'
                          }`}
                        >
                          {renderCategoryIcon(item.category, 'w-3 h-3')}
                          <span>{item.label}</span>
                          <span
                            className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md ${
                              isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Custom Grammar Syntax & Notebook Illustration + Active Material Stat Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <GrammarHeroIllustration
                levelLabel={levelFilter === 'ALL' ? 'N5–N1' : levelFilter}
                className="hidden md:flex shrink-0"
              />

              <div className="rounded-2xl bg-white/95 border-2 border-blue-200/85 px-4 py-3 flex items-center gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-blue-500 to-indigo-600 shadow-[0_2px_0_0_#1E40AF] text-white flex items-center justify-center shrink-0">
                  <Sparkle weight="fill" className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-brand font-black text-xs text-slate-900 leading-tight whitespace-nowrap">
                    {filteredPoints.length} Materi
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                    {levelFilter === 'ALL' ? 'Lintas N5–N1' : `Level JLPT ${levelFilter}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
          onSelectCategory={handleSelectCategory}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari pola kalimat, partikel, atau contoh..."
        />

        {/* Beginner-friendly Tahukah Kamu? callout */}
        {!isLoading && filteredPoints.length > 0 && (
          <DidYouKnowCallout
            tone="amber"
            emotion="curious"
            badge="Tahukah Kamu?"
            title="Apa itu Partikel, Predikat, dan Konjugasi di Bahasa Jepang?"
            description={
              <>
                <b>Partikel</b> adalah penanda kecil (seperti <code>は</code>, <code>の</code>, <code>を</code>) di belakang kata untuk menjelaskan perannya, <b>Predikat</b> selalu ditaruh di akhir kalimat, dan <b>Konjugasi</b> mengubah akhiran kata kerja (seperti <code>-masu</code> / <code>-masen</code>). Klik kartu di bawah untuk penjelasan lengkap &amp; audio pelan <b>0.6x</b>.
              </>
            }
            example="Contoh singkat: わたしは がくせい です — 「は」 (wa) adalah partikel topik, sedangkan 「です」 menutup kalimat secara sopan."
          />
        )}

        {/* Horizontal Editorial Grammar Cards (LingoDeer-inspired) */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-48 rounded-3xl bg-white border-2 border-slate-200/80 animate-pulse"
              />
            ))}
          </div>
        ) : filteredPoints.length === 0 ? (
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 text-center space-y-3 shadow-[0_4px_0_0_#E2E8F0]">
            <div className="flex justify-center">
              <KodiCharacter emotion="curious" size={88} interactive />
            </div>
            <div className="space-y-1">
              <p className="font-brand font-black text-base text-slate-800">
                Tidak ada materi grammar yang cocok
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Coba pilih tingkat JLPT lain atau ubah kata kunci pencarianmu.
              </p>
            </div>
            {(searchQuery.trim().length > 0 || categoryFilter !== 'ALL') && (
              <Button3D
                variant="white"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  handleSelectCategory('ALL')
                }}
                className="text-xs px-4 py-2 mx-auto"
              >
                Reset Filter
              </Button3D>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPoints.map((point, pointIdx) => (
              <GrammarEditorialCard key={point.id} point={point} index={pointIdx} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
