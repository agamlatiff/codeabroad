import { useEffect, useState, useMemo, useId } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ArrowsClockwise, BookOpen, CheckCircle } from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
import { AppTopBar } from '@/shared/components/layout/top-bar/AppTopBar'
import { FilterToolbar } from '@/shared/components/ui/FilterToolbar'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { useUser } from '@/features/user/hooks/useUser'
import { useActiveLanguageCode } from '@/features/exercise/hooks/useActiveSpeechLocale'
import {
  curriculumService,
  GRAMMAR_POINTS_QUERY_KEY,
} from '@/features/curriculum/services/curriculumService'
import type { GrammarPoint } from '@/features/curriculum/types/curriculum'
import {
  formatCategoryLabel,
  isGrammarPointDueForReview,
} from '@/features/curriculum/constants/grammarStyles'
import { GrammarEditorialCard } from '@/features/curriculum/components/GrammarEditorialCard'
import { GrammarHeroIllustration } from '@/features/curriculum/components/GrammarHeroIllustration'
import { TierUpgradeBanner } from '@/shared/components/ui/TierUpgradeBanner'
import { checkLevelAccess, isUserPro } from '@/shared/utils/levelAccess'

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
 * - Unified AppTopBar + AppBreadcrumb + Clean Tactile Hero + 1-Row FilterToolbar.
 * - Always displays accurate formula Romaji beneath each pattern for beginner clarity.
 */
export const GrammarPage = () => {
  const { data: userData } = useUser()
  const isAuthenticated = Boolean(userData.isAuthenticated && userData.user)
  const isPro = isUserPro(userData.user)
  const userIdKey = userData.user?.id ?? 'anonymous'
  const activeLanguageCode = useActiveLanguageCode()
  const heroPatternId = `grammar-hero-seigaiha-${useId().replace(/:/g, '')}`
  const [searchParams, setSearchParams] = useSearchParams()

  const rawLevelParam = searchParams.get('level')
  const levelFilter = useMemo(() => parseLevelFilterParam(rawLevelParam), [rawLevelParam])
  const levelAccess = useMemo(
    () => checkLevelAccess(levelFilter, { isAuthenticated, isPro }),
    [levelFilter, isAuthenticated, isPro]
  )
  const categoryFilter = searchParams.get('category')?.trim() || 'ALL'
  const reviewFilter = searchParams.get('review')?.trim().toLowerCase() === 'due' ? 'due' : 'all'
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

  const handleSetReviewFilter = (mode: 'all' | 'due') => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('level', levelFilter)
        if (mode === 'due') {
          next.set('review', 'due')
        } else {
          next.delete('review')
        }
        return next
      },
      { replace: true }
    )
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('level', levelFilter)
        next.delete('category')
        next.delete('review')
        return next
      },
      { replace: true }
    )
  }

  const { data: grammarPoints = [], isLoading } = useQuery({
    queryKey: [...GRAMMAR_POINTS_QUERY_KEY, userIdKey, activeLanguageCode],
    queryFn: ({ signal }) =>
      curriculumService.getGrammarPointsByFilter(activeLanguageCode, undefined, { signal }),
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

  const levelMasteryStats = useMemo(() => {
    const matching =
      levelFilter === 'ALL'
        ? grammarPoints
        : grammarPoints.filter((p) => (p.level_code ?? 'N5').toUpperCase() === levelFilter)
    const understoodCount = matching.filter((p) => p.is_understood).length
    return {
      understoodCount,
      totalInLevel: matching.length,
    }
  }, [grammarPoints, levelFilter])

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

  const duePointsInScope = useMemo(
    () =>
      grammarPoints.filter((point) => {
        const levelCode = (point.level_code ?? 'N5').toUpperCase()
        if (levelFilter !== 'ALL' && levelCode !== levelFilter) return false
        return isGrammarPointDueForReview(point)
      }),
    [grammarPoints, levelFilter]
  )

  const filteredPoints = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return grammarPoints.filter((point: GrammarPoint) => {
      const levelCode = (point.level_code ?? 'N5').toUpperCase()
      if (levelFilter === 'ALL' && !checkLevelAccess(levelCode, { isAuthenticated, isPro }).allowed) {
        return false
      }
      if (levelFilter !== 'ALL' && levelCode !== levelFilter) return false
      if (categoryFilter !== 'ALL' && point.category !== categoryFilter) return false
      if (reviewFilter === 'due' && !isGrammarPointDueForReview(point)) return false
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
  }, [grammarPoints, levelFilter, categoryFilter, reviewFilter, searchQuery, isAuthenticated, isPro])

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

          <div className="relative z-10 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Left Info */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-blue-500 to-indigo-600 shadow-[0_3px_0_0_#1E3A8A] text-white flex items-center justify-center shrink-0">
                <BookOpen weight="fill" className="w-6 h-6" />
              </div>

              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="text-lg sm:text-xl font-brand font-black text-slate-900 tracking-tight leading-snug">
                    Panduan Grammar
                  </h1>
                  {levelMasteryStats.totalInLevel > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-brand font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                      <CheckCircle weight="fill" className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {levelMasteryStats.understoodCount}/{levelMasteryStats.totalInLevel} Materi Paham
                      </span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed font-medium">
                  Analogi bahasa Indonesia, rumus berwarna, contoh dipecah per kata, dan cek pemahaman 3 soal agar langsung paham.
                </p>
              </div>
            </div>

            {/* Right: Custom Grammar Syntax & Notebook Illustration */}
            <GrammarHeroIllustration
              levelLabel={levelFilter === 'ALL' ? 'N5–N1' : levelFilter}
              className="hidden md:flex shrink-0"
            />
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

        {/* Scheduled SRS Grammar Review Banner */}
        {!isLoading && duePointsInScope.length > 0 && (
          <section
            aria-label="Jadwal Ulasan Tata Bahasa"
            className="rounded-2xl border-2 border-amber-300/90 bg-gradient-to-r from-amber-50 via-yellow-50/70 to-orange-50/60 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_3px_0_0_#FDE68A]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0">
                <ArrowsClockwise weight="bold" className="w-4 h-4" />
              </span>
              <div className="min-w-0 space-y-0.5">
                <p className="font-brand font-black text-xs sm:text-sm text-amber-950">
                  {duePointsInScope.length} Materi Tata Bahasa Siap Diulas
                </p>
                <p className="text-[11px] font-medium text-amber-900/80">
                  Uji kembali ingatanmu agar pola kalimat tetap nempel jangka panjang.
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleSetReviewFilter(reviewFilter === 'due' ? 'all' : 'due')}
                className={`px-3 py-1.5 rounded-xl border-2 text-xs font-brand font-black transition-all cursor-pointer ${
                  reviewFilter === 'due'
                    ? 'bg-amber-600 border-amber-700 text-white'
                    : 'bg-white border-amber-300 text-amber-900 hover:bg-amber-100/70'
                }`}
              >
                {reviewFilter === 'due'
                  ? 'Tampilkan Semua'
                  : `Filter Perlu Diulas (${duePointsInScope.length})`}
              </button>
              <Link
                to={`/grammar/${encodeURIComponent(duePointsInScope[0].code || duePointsInScope[0].id)}#grammar-mini-quiz`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-brand font-black transition-colors shadow-2xs"
              >
                <span>Mulai Ulas Sekarang</span>
                <ArrowRight weight="bold" className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        )}

        {/* Tier Gate or Horizontal Editorial Grammar Cards */}
        {!levelAccess.allowed && levelAccess.reason !== 'ok' ? (
          <TierUpgradeBanner
            levelCode={levelFilter}
            reason={levelAccess.reason}
            featureLabel="Panduan Grammar"
            onSelectFreeLevel={() => handleSelectLevel('N5')}
          />
        ) : isLoading ? (
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
            {(searchQuery.trim().length > 0 || categoryFilter !== 'ALL' || reviewFilter === 'due') && (
              <Button3D
                variant="white"
                size="sm"
                onClick={handleResetFilters}
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
