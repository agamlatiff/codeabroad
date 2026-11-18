import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpenText, MagnifyingGlass, ArrowClockwise } from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
import { Button3D } from '@/shared/components/ui/Button3D'
import { useUser } from '@/features/user/hooks/useUser'
import {
  curriculumService,
  CURRICULUM_QUERY_KEY,
  GRAMMAR_POINTS_QUERY_KEY,
} from '@/features/curriculum/services/curriculumService'
import { extractApiErrorMessage } from '@/shared/services/api'

const CATEGORY_LABELS: Record<string, string> = {
  tense: 'Tense',
  conjugation: 'Konjugasi',
  particle: 'Partikel',
  honorific: 'Honorifik / Keigo',
  sentence_pattern: 'Pola Kalimat',
}

/** Dedicated page displaying level-scoped grammar points and sentence formulas. */
export const GrammarPage = () => {
  const { data: userData } = useUser()
  const userIdKey = userData.user?.id ?? 'anonymous'

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const { data: curriculum } = useQuery({
    queryKey: [...CURRICULUM_QUERY_KEY, userIdKey, 'active'],
    queryFn: ({ signal }) => curriculumService.getCurriculum(undefined, { signal }),
    staleTime: 1000 * 60 * 2,
  })

  const activeLevel = curriculum?.level
  const activeLanguage = curriculum?.language
  const activeLevelId = activeLevel?.id ?? ''

  const {
    data: grammarPoints = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [...GRAMMAR_POINTS_QUERY_KEY, userIdKey, activeLevelId],
    queryFn: ({ signal }) => curriculumService.getGrammarPoints(activeLevelId, { signal }),
    enabled: Boolean(activeLevelId),
    staleTime: 1000 * 60 * 10,
  })

  const error = queryError
    ? extractApiErrorMessage(queryError, 'Gagal memuat daftar grammar level.')
    : null

  const categories = useMemo(() => {
    const present = Array.from(new Set(grammarPoints.map((p) => p.category)))
    return ['all', ...present]
  }, [grammarPoints])

  const filteredPoints = useMemo(() => {
    const q = search.trim().toLowerCase()
    return grammarPoints.filter((point) => {
      if (selectedCategory !== 'all' && point.category !== selectedCategory) return false
      if (!q) return true
      return (
        point.title.toLowerCase().includes(q) ||
        point.code.toLowerCase().includes(q) ||
        point.formula.toLowerCase().includes(q) ||
        point.explanation.toLowerCase().includes(q)
      )
    })
  }, [grammarPoints, search, selectedCategory])

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      <AppLeftSidebar />

      <main className="flex-1 min-w-0 max-w-4xl mx-auto px-4 sm:px-8 py-6 pb-24 md:pb-12 space-y-6">
        {/* Header */}
        <header className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xs flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <BookOpenText weight="fill" className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-brand font-black text-xl text-slate-900">
                  Panduan Grammar
                </h1>
                {activeLevel?.code && (
                  <span className="bg-blue-100 text-blue-800 border border-blue-200 font-brand font-black text-xs px-2.5 py-0.5 rounded-full">
                    {activeLevel.code}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 truncate">
                {activeLanguage?.name ? `${activeLanguage.name} • ` : ''}
                {activeLevel?.name || 'Ringkasan rumus tata bahasa dan pola kalimat level aktif'}
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            {grammarPoints.length} Materi
          </span>
        </header>

        {/* Search & Category Filters */}
        {!isLoading && !error && grammarPoints.length > 0 && (
          <div className="space-y-3">
            <div className="relative">
              <MagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pola kalimat, partikel, atau penjelasan..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border-2 border-slate-200/90 focus:border-[#2563EB] focus:outline-none text-sm font-medium text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {categories.length > 2 && (
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map((cat) => {
                  const active = selectedCategory === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-brand font-black transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                      }`}
                    >
                      {cat === 'all' ? 'Semua' : CATEGORY_LABELS[cat] || cat}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {isLoading || !activeLevelId ? (
          <div className="py-16 text-center text-sm font-semibold text-slate-500 animate-pulse">
            Memuat panduan grammar...
          </div>
        ) : error ? (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-rose-800">{error}</span>
            <Button3D
              variant="rose"
              size="sm"
              icon={<ArrowClockwise weight="bold" className="w-4 h-4" />}
              onClick={() => void refetch()}
            >
              Coba Lagi
            </Button3D>
          </div>
        ) : filteredPoints.length === 0 ? (
          <div className="py-14 text-center text-sm font-semibold text-slate-500 bg-white rounded-3xl border-2 border-slate-200/80">
            {grammarPoints.length === 0
              ? 'Belum ada catatan grammar yang terdaftar untuk level ini.'
              : 'Tidak ada pola grammar yang cocok dengan pencarian.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredPoints.map((point) => (
              <article
                key={point.id}
                className="p-5 rounded-3xl border-2 border-slate-200/90 bg-white space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {point.code}
                  </span>
                  <span className="text-[11px] font-brand font-black uppercase px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {CATEGORY_LABELS[point.category] || point.category}
                  </span>
                </div>

                <h2 className="font-brand font-black text-base text-slate-900">
                  {point.title}
                </h2>

                <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs sm:text-sm font-bold text-blue-900">
                  {point.formula}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {point.explanation}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default GrammarPage
