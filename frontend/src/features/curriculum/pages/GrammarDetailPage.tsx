import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Eye,
  EyeSlash,
  Quotes,
  SpeakerHigh,
  Sparkle,
  ListBullets,
} from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
import { AppTopBar } from '@/shared/components/layout/top-bar/AppTopBar'
import { Button3D } from '@/shared/components/ui/Button3D'
import { useUser } from '@/features/user/hooks/useUser'
import {
  curriculumService,
  GRAMMAR_POINTS_QUERY_KEY,
} from '@/features/curriculum/services/curriculumService'
import type { GrammarPoint } from '@/features/curriculum/types/curriculum'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'
import {
  LEVEL_ACCENT_STYLES,
  DEFAULT_LEVEL_ACCENT,
  formatCategoryLabel,
  renderCategoryIcon,
} from '@/features/curriculum/constants/grammarStyles'

const SLOW_SPEECH_RATE = 0.58

export const GrammarDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: userData } = useUser()
  const userIdKey = userData.user?.id ?? 'anonymous'

  const [showRomaji, setShowRomaji] = useState(true)
  const [playingExampleKey, setPlayingExampleKey] = useState<string | null>(null)
  const [isFormulaCopied, setIsFormulaCopied] = useState(false)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      audioService.stopSpeech()
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  // Fetch all grammar points (shared TanStack cache with /grammar)
  const { data: grammarPoints = [], isLoading } = useQuery({
    queryKey: [...GRAMMAR_POINTS_QUERY_KEY, userIdKey, 'ja'],
    queryFn: ({ signal }) => curriculumService.getGrammarPointsByFilter('ja', undefined, { signal }),
    staleTime: 1000 * 60 * 5,
  })

  // Match point by ID or code (case-insensitive)
  const targetId = (id ?? '').trim().toLowerCase()
  const currentPointIndex = useMemo(
    () =>
      grammarPoints.findIndex(
        (p) =>
          p.id.toLowerCase() === targetId ||
          p.code.toLowerCase() === targetId ||
          p.id.replace(/-/g, '').toLowerCase() === targetId.replace(/-/g, '')
      ),
    [grammarPoints, targetId]
  )

  const currentPoint: GrammarPoint | null =
    currentPointIndex >= 0 ? grammarPoints[currentPointIndex] : null

  // Sibling points within the same JLPT level for intuitive next/prev navigation
  const siblingPoints = useMemo(() => {
    if (!currentPoint) return []
    const level = (currentPoint.level_code ?? 'N5').toUpperCase()
    return grammarPoints.filter((p) => (p.level_code ?? 'N5').toUpperCase() === level)
  }, [grammarPoints, currentPoint])

  const siblingIndex = useMemo(() => {
    if (!currentPoint) return -1
    return siblingPoints.findIndex((p) => p.id === currentPoint.id)
  }, [siblingPoints, currentPoint])

  const prevPoint = siblingIndex > 0 ? siblingPoints[siblingIndex - 1] : null
  const nextPoint =
    siblingIndex >= 0 && siblingIndex < siblingPoints.length - 1
      ? siblingPoints[siblingIndex + 1]
      : null

  const handlePlayExample = useCallback((exampleKey: string, japaneseText: string, rate?: number) => {
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
  }, [playingExampleKey])

  const handleCopyFormula = useCallback(async (formula: string) => {
    triggerHaptic('tap')
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(formula)
      }
      setIsFormulaCopied(true)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => {
        setIsFormulaCopied(false)
      }, 1500)
    } catch {
      // Degrade gracefully
    }
  }, [])

  const handleNavigatePoint = useCallback(
    (targetPoint: GrammarPoint) => {
      triggerHaptic('tap')
      audioService.stopSpeech()
      setPlayingExampleKey(null)
      setIsFormulaCopied(false)
      navigate(`/grammar/${encodeURIComponent(targetPoint.code || targetPoint.id)}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [navigate]
  )

  const levelCode = (currentPoint?.level_code ?? 'N5').toUpperCase()
  const accent = LEVEL_ACCENT_STYLES[levelCode] ?? DEFAULT_LEVEL_ACCENT
  const examples = currentPoint?.examples ?? []

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      <AppLeftSidebar />

      <main className="flex-1 min-w-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 md:pb-12 space-y-5">
        <AppTopBar
          breadcrumbs={[
            { label: 'Beranda', to: '/curriculum' },
            { label: 'Panduan Grammar', to: '/grammar' },
            {
              label: `JLPT ${levelCode}`,
              to: `/grammar?level=${encodeURIComponent(levelCode)}`,
            },
            ...(currentPoint ? [{ label: currentPoint.title }] : []),
          ]}
          breadcrumbRightSlot={
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap')
                setShowRomaji((prev) => !prev)
              }}
              aria-pressed={showRomaji}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-brand font-black border-2 transition-all cursor-pointer active:translate-y-0.5 shadow-2xs ${
                showRomaji
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {showRomaji ? (
                <Eye weight="fill" className="w-4 h-4 text-blue-600" />
              ) : (
                <EyeSlash weight="bold" className="w-4 h-4 text-slate-500" />
              )}
              <span>Romaji: {showRomaji ? 'Tampil' : 'Sembunyi'}</span>
            </button>
          }
        />

        {/* Loading state skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-pulse">
            <div className="xl:col-span-8 space-y-4">
              <div className="h-56 rounded-3xl bg-white border-2 border-slate-200/80" />
              <div className="h-64 rounded-3xl bg-white border-2 border-slate-200/80" />
            </div>
            <div className="xl:col-span-4 h-96 rounded-3xl bg-white border-2 border-slate-200/80" />
          </div>
        )}

        {/* Not Found state */}
        {!isLoading && !currentPoint && (
          <div className="max-w-xl mx-auto bg-white border-2 border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-[0_4px_0_0_#E2E8F0]">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <BookOpen weight="duotone" className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="font-brand font-black text-lg sm:text-xl text-slate-900">
                Materi Grammar Tidak Ditemukan
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Materi yang kamu tuju mungkin telah dipindahkan atau kode pola tidak cocok.
              </p>
            </div>
            <Button3D
              variant="blue"
              size="sm"
              icon={<ArrowLeft weight="bold" className="w-4 h-4" />}
              onClick={() => navigate('/grammar')}
            >
              Kembali ke Daftar Grammar
            </Button3D>
          </div>
        )}

        {/* Main 2-Column Learning Canvas */}
        {!isLoading && currentPoint && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <article className="xl:col-span-8 min-w-0 space-y-6">
            {/* Hero Header Card */}
            <section className="bg-white border-2 border-slate-200/90 rounded-3xl overflow-hidden shadow-[0_6px_0_0_#E2E8F0] relative">
              <div className={`h-2.5 w-full ${accent.topStrip}`} />

              <div className="p-6 sm:p-8 space-y-5">
                {/* Badges row */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center flex-wrap gap-2">
                    <span
                      className={`text-xs font-brand font-black uppercase tracking-wider px-3 py-1 rounded-xl border ${accent.badge}`}
                    >
                      JLPT {levelCode}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-brand font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                      {renderCategoryIcon(currentPoint.category, 'w-3.5 h-3.5')}
                      <span>{formatCategoryLabel(currentPoint.category)}</span>
                    </span>
                  </div>
                  {siblingIndex >= 0 && (
                    <span className="text-xs font-mono font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                      Materi {siblingIndex + 1} dari {siblingPoints.length}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-brand font-black text-2xl sm:text-3xl text-slate-900 leading-tight">
                  {currentPoint.title}
                </h1>

                {/* Formula Callout Hero Box */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-50/95 via-indigo-50/70 to-white border-2 border-blue-200/90 p-4 sm:p-5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-brand font-black uppercase tracking-wider text-blue-600 flex items-center gap-1">
                      <Sparkle weight="fill" className="w-3.5 h-3.5" />
                      Rumus Pola Kalimat
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleCopyFormula(currentPoint.formula)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-brand font-black transition-all cursor-pointer active:translate-y-0.5 shadow-2xs ${
                        isFormulaCopied
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      {isFormulaCopied ? (
                        <>
                          <Check weight="bold" className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy weight="bold" className="w-3.5 h-3.5" />
                          <span>Salin Rumus</span>
                        </>
                      )}
                    </button>
                  </div>

                  <code className="block font-mono text-base sm:text-lg font-black text-blue-950 break-words leading-relaxed">
                    {currentPoint.formula}
                  </code>

                  {showRomaji && currentPoint.formula_reading && (
                    <div className="pt-1 border-t border-blue-100 flex items-center gap-2">
                      <span className="text-[11px] font-brand font-bold text-blue-400">Cara baca:</span>
                      <p className="text-xs sm:text-sm font-bold text-blue-700 break-words">
                        {currentPoint.formula_reading}
                      </p>
                    </div>
                  )}
                </div>

                {/* Explanation text */}
                <div className="space-y-1.5 pt-2">
                  <h3 className="text-xs font-brand font-black uppercase tracking-wider text-slate-400">
                    Penjelasan Pola
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    {currentPoint.explanation}
                  </p>
                </div>
              </div>
            </section>

            {/* Example Sentences Section */}
            {examples.length > 0 && (
              <section className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-[0_6px_0_0_#E2E8F0]">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="inline-flex items-center gap-2 text-sm sm:text-base font-brand font-black text-slate-900">
                    <Quotes weight="fill" className="w-4 h-4 text-blue-600" />
                    <span>Contoh Kalimat Nyata ({examples.length})</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    Klik speaker untuk memutar audio
                  </span>
                </div>

                <div className="space-y-3">
                  {examples.map((ex, idx) => {
                    const normalKey = `${currentPoint.id}-${idx}-normal`
                    const slowKey = `${currentPoint.id}-${idx}-slow`
                    const isPlayingNormal = playingExampleKey === normalKey
                    const isPlayingSlow = playingExampleKey === slowKey

                    return (
                      <div
                        key={`${currentPoint.id}-${idx}`}
                        className="rounded-2xl bg-slate-50/90 hover:bg-slate-50 border-2 border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                      >
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          <span className="mt-0.5 px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-black text-slate-500 shrink-0 shadow-2xs">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0 space-y-1 flex-1">
                            <p className="font-brand font-black text-base sm:text-lg text-slate-900 break-words leading-snug">
                              {ex.jp}
                            </p>
                            {showRomaji && ex.reading && (
                              <p className="text-xs sm:text-sm font-bold text-blue-600 break-words">
                                {ex.reading}
                              </p>
                            )}
                            <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                              {ex.id}
                            </p>
                          </div>
                        </div>

                        {/* Audio Controls */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handlePlayExample(normalKey, ex.jp)}
                            aria-label={`Putar audio kecepatan normal: ${ex.jp}`}
                            title="Putar kecepatan normal"
                            className={`h-10 px-3.5 rounded-xl border-2 font-brand font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 shadow-2xs ${
                              isPlayingNormal
                                ? 'bg-blue-600 border-blue-700 text-white animate-pulse'
                                : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                            }`}
                          >
                            <SpeakerHigh weight="fill" className="w-4 h-4" />
                            <span>Normal</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePlayExample(slowKey, ex.jp, SLOW_SPEECH_RATE)}
                            aria-label={`Putar audio kecepatan pelan: ${ex.jp}`}
                            title="Putar kecepatan pelan 0.6x"
                            className={`h-10 px-3 rounded-xl border-2 font-brand font-black text-xs flex items-center gap-1 transition-all cursor-pointer active:translate-y-0.5 shadow-2xs ${
                              isPlayingSlow
                                ? 'bg-blue-600 border-blue-700 text-white animate-pulse'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <SpeakerHigh weight="bold" className="w-3.5 h-3.5 text-blue-600" />
                            <span>0.6x</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Bottom Next/Prev Sibling Navigation */}
            <nav
              aria-label="Navigasi materi grammar"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"
            >
              {prevPoint ? (
                <button
                  type="button"
                  onClick={() => handleNavigatePoint(prevPoint)}
                  className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-blue-300 shadow-[0_3px_0_0_#E2E8F0] text-left transition-all cursor-pointer group active:translate-y-0.5"
                >
                  <span className="text-[10px] font-brand font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    ← Materi Sebelumnya
                  </span>
                  <span className="font-brand font-black text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {prevPoint.title}
                  </span>
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}

              {nextPoint && (
                <button
                  type="button"
                  onClick={() => handleNavigatePoint(nextPoint)}
                  className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-blue-300 shadow-[0_3px_0_0_#E2E8F0] text-right sm:col-start-2 transition-all cursor-pointer group active:translate-y-0.5"
                >
                  <span className="text-[10px] font-brand font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Materi Berikutnya →
                  </span>
                  <span className="font-brand font-black text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {nextPoint.title}
                  </span>
                </button>
              )}
            </nav>
          </article>

          {/* Right Sticky Outline Sidebar */}
          <aside aria-label="Daftar materi JLPT" className="xl:col-span-4 xl:sticky xl:top-6 space-y-4">
            <div className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-[0_6px_0_0_#E2E8F0] overflow-hidden">
              <div className={`h-1.5 w-full ${accent.topStrip}`} />

              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <ListBullets weight="bold" className="w-4 h-4 text-blue-600 shrink-0" />
                  <h2 className="font-brand font-black text-sm text-slate-900 truncate">
                    Daftar Materi JLPT {levelCode}
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                  {siblingIndex + 1}/{siblingPoints.length}
                </span>
              </div>

              <div className="max-h-[440px] overflow-y-auto custom-scrollbar divide-y divide-slate-100">
                {siblingPoints.map((item, idx) => {
                  const isActive = item.id === currentPoint.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (!isActive) handleNavigatePoint(item)
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-blue-50/90 border-l-4 border-l-blue-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`mt-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black shrink-0 ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-500 border border-slate-200/70'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p
                          className={`font-brand font-black text-xs leading-snug line-clamp-1 ${
                            isActive ? 'text-blue-900' : 'text-slate-800'
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="font-mono text-[11px] font-semibold text-slate-500 truncate">
                          {item.formula}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60">
                <Link
                  to={`/grammar?level=${encodeURIComponent(levelCode)}`}
                  onClick={() => triggerHaptic('tap')}
                  className="inline-flex items-center gap-1.5 text-xs font-brand font-black text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>Lihat Semua Materi</span>
                  <ArrowRight weight="bold" className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Compact Practice CTA Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-4 shadow-[0_6px_0_0_#1E40AF]">
              <div className="space-y-1">
                <h3 className="font-brand font-black text-base">
                  Sudah paham konsep pola ini?
                </h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Latih langsung lewat soal latihan interaktif di kurikulum pembelajaran.
                </p>
              </div>
              <Button3D
                variant="white"
                size="sm"
                fullWidth
                icon={<ArrowRight weight="bold" className="w-4 h-4 text-blue-600" />}
                onClick={() => {
                  triggerHaptic('tap')
                  navigate('/curriculum')
                }}
                className="text-blue-700 font-brand font-black"
              >
                Buka Kurikulum
              </Button3D>
            </div>
          </aside>
        </div>
        )}
      </main>
    </div>
  )
}
