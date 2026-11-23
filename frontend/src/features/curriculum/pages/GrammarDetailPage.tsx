import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  ArrowsClockwise,
  BookOpen,
  Check,
  CheckCircle,
  Eye,
  EyeSlash,
  Lightbulb,
  ListBullets,
  LockSimple,
  SpeakerHigh,
  WarningCircle,
  XCircle,
} from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
import { AppTopBar } from '@/shared/components/layout/top-bar/AppTopBar'
import { Button3D } from '@/shared/components/ui/Button3D'
import { DidYouKnowCallout } from '@/shared/components/ui/DidYouKnowCallout'
import { useUser } from '@/features/user/hooks/useUser'
import {
  curriculumService,
  CURRICULUM_QUERY_KEY,
  GRAMMAR_POINTS_QUERY_KEY,
} from '@/features/curriculum/services/curriculumService'
import type { GrammarPoint, UnitNodeResponse } from '@/features/curriculum/types/curriculum'
import { extractApiErrorMessage } from '@/shared/services/api'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'
import {
  LEVEL_ACCENT_STYLES,
  DEFAULT_LEVEL_ACCENT,
  formatCategoryLabel,
  isGrammarPointDueForReview,
  renderCategoryIcon,
} from '@/features/curriculum/constants/grammarStyles'
import { resolveGrammarDidYouKnow } from '@/features/curriculum/constants/grammarDidYouKnow'
import { GrammarFormulaVisual } from '@/features/curriculum/components/GrammarFormulaVisual'
import { GrammarWordBreakdownSection } from '@/features/curriculum/components/GrammarWordBreakdownSection'
import { GrammarMiniQuizCard } from '@/features/curriculum/components/GrammarMiniQuizCard'
import { GuestLoginPromptModal } from '@/features/auth/components/GuestLoginPromptModal'
import { useActiveLanguageCode } from '@/features/exercise/hooks/useActiveSpeechLocale'

function resolveLinkedPracticeTarget(
  point: GrammarPoint | null,
  units?: UnitNodeResponse[]
) {
  if (!point?.practice_lesson_slug) return null
  const targetSlug = point.practice_lesson_slug.toLowerCase()
  for (const unit of units ?? []) {
    const match = (unit.lessons ?? []).find((l) => l.slug?.toLowerCase() === targetSlug)
    if (match) {
      return {
        lessonSlugOrId: match.slug || match.id,
        lessonTitle: match.title,
        unitOrder: unit.order_index,
        isUnlocked: match.is_unlocked,
      }
    }
  }
  return {
    lessonSlugOrId: point.practice_lesson_slug,
    lessonTitle: point.practice_lesson_title || 'Latihan Terkait',
    unitOrder: point.practice_unit_order || 0,
    isUnlocked: false,
  }
}

export const GrammarDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const targetId = (id ?? '').trim().toLowerCase()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { data: userData } = useUser()
  const isAuthenticated = Boolean(userData.isAuthenticated && userData.user)
  const userIdKey = userData.user?.id ?? 'anonymous'
  const activeLanguageCode = useActiveLanguageCode()

  const [showRomaji, setShowRomaji] = useState(true)
  const [playingExampleKey, setPlayingExampleKey] = useState<string | null>(null)
  const [isFormulaCopied, setIsFormulaCopied] = useState(false)
  const [checkError, setCheckError] = useState<string | null>(null)
  const [isGuestGrammarModalOpen, setIsGuestGrammarModalOpen] = useState(false)
  const [prevTargetId, setPrevTargetId] = useState(targetId)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (targetId !== prevTargetId) {
    setPrevTargetId(targetId)
    setPlayingExampleKey(null)
    setIsFormulaCopied(false)
    setCheckError(null)
  }

  useEffect(() => {
    audioService.stopSpeech()
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current)
      copyTimerRef.current = null
    }
    return () => {
      audioService.stopSpeech()
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current)
        copyTimerRef.current = null
      }
    }
  }, [targetId])

  // Fetch all grammar points (shared TanStack cache with /grammar)
  const { data: grammarPoints = [], isLoading } = useQuery({
    queryKey: [...GRAMMAR_POINTS_QUERY_KEY, userIdKey, activeLanguageCode],
    queryFn: ({ signal }) =>
      curriculumService.getGrammarPointsByFilter(activeLanguageCode, undefined, { signal }),
    staleTime: 1000 * 60 * 5,
  })

  // Fetch active curriculum tree so we know if the linked lesson is unlocked for direct launch
  const { data: curriculumData } = useQuery({
    queryKey: [...CURRICULUM_QUERY_KEY, userIdKey],
    queryFn: ({ signal }) => curriculumService.getCurriculum(undefined, { signal }),
    staleTime: 1000 * 60 * 5,
  })

  const checkMutation = useMutation({
    mutationFn: ({
      pointKey,
      correctCount,
      totalQuestions,
    }: {
      pointKey: string
      correctCount: number
      totalQuestions: number
    }) =>
      curriculumService.submitGrammarCheck(pointKey, {
        correct_count: correctCount,
        total_questions: totalQuestions,
      }),
    onMutate: () => {
      setCheckError(null)
    },
    onSuccess: () => {
      setCheckError(null)
      void queryClient.invalidateQueries({ queryKey: [...GRAMMAR_POINTS_QUERY_KEY] })
    },
    onError: (err) => {
      setCheckError(
        extractApiErrorMessage(err, 'Gagal menyimpan hasil kuis. Coba lagi ya.')
      )
    },
  })

  // Match point by ID or code (case-insensitive)
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

  // Sibling points within the same JLPT level for next/prev navigation & mastery summary
  const siblingPoints = useMemo(() => {
    if (!currentPoint) return []
    const level = (currentPoint.level_code ?? 'N5').toUpperCase()
    return grammarPoints.filter((p) => (p.level_code ?? 'N5').toUpperCase() === level)
  }, [grammarPoints, currentPoint])

  const siblingIndex = useMemo(() => {
    if (!currentPoint) return -1
    return siblingPoints.findIndex((p) => p.id === currentPoint.id)
  }, [siblingPoints, currentPoint])

  const understoodInLevel = useMemo(
    () => siblingPoints.filter((p) => p.is_understood).length,
    [siblingPoints]
  )
  const levelProgressPct =
    siblingPoints.length > 0 ? Math.round((understoodInLevel / siblingPoints.length) * 100) : 0

  const prevPoint = siblingIndex > 0 ? siblingPoints[siblingIndex - 1] : null
  const nextPoint =
    siblingIndex >= 0 && siblingIndex < siblingPoints.length - 1
      ? siblingPoints[siblingIndex + 1]
      : null

  // Resolve linked practice lesson status from user's curriculum tree
  const linkedPracticeTarget = resolveLinkedPracticeTarget(currentPoint, curriculumData?.units)

  const handlePlayExample = useCallback(
    (exampleKey: string, japaneseText: string, rate?: number) => {
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
    },
    [playingExampleKey]
  )

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
      setCheckError(null)
      navigate(`/grammar/${encodeURIComponent(targetPoint.code || targetPoint.id)}`)
    },
    [navigate]
  )

  const levelCode = (currentPoint?.level_code ?? 'N5').toUpperCase()
  const accent = LEVEL_ACCENT_STYLES[levelCode] ?? DEFAULT_LEVEL_ACCENT
  const guide = currentPoint?.learning_guide
  const examples = currentPoint?.examples ?? []
  const isDueForReview = Boolean(currentPoint && isGrammarPointDueForReview(currentPoint))

  useEffect(() => {
    if (!isLoading && currentPoint && location.hash === '#grammar-mini-quiz') {
      const target = document.getElementById('grammar-mini-quiz')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [currentPoint, isLoading, location.hash])

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      <AppLeftSidebar />

      <main className="flex-1 min-w-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 md:pb-12 space-y-5">
        <AppTopBar
          breadcrumbs={[
            { label: 'Beranda', to: '/curriculum' },
            { label: 'Panduan Grammar', to: `/grammar?level=${encodeURIComponent(levelCode)}` },
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
              <div className="h-72 rounded-3xl bg-white border-2 border-slate-200/80" />
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
              onClick={() => navigate('/grammar?level=N5')}
            >
              Kembali ke Daftar Grammar
            </Button3D>
          </div>
        )}

        {/* Main 2-Column Learning Canvas */}
        {!isLoading && currentPoint && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <article className="xl:col-span-8 min-w-0 space-y-6">
              {isDueForReview && (
                <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50/70 to-orange-50/50 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_3px_0_0_#FDE68A]">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0">
                      <ArrowsClockwise weight="bold" className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-brand font-black text-xs sm:text-sm text-amber-950">
                        Waktunya Ulas Kembali Materi Ini!
                      </p>
                      <p className="text-[11px] font-medium text-amber-900/80">
                        Selesaikan ulang kuis 3 soal di bawah untuk memperbarui jadwal ulasan berikutnya.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap')
                      document.getElementById('grammar-mini-quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-brand font-black transition-colors shrink-0 self-start sm:self-center cursor-pointer"
                  >
                    Lompat ke Kuis Review ↓
                  </button>
                </div>
              )}

              {/* 1. HERO HEADER CARD: Title + Indonesian Analogy + Color Formula + Steps */}
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
                      {currentPoint.is_understood && (
                        <span className="inline-flex items-center gap-1 text-xs font-brand font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle weight="fill" className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Paham ✓</span>
                        </span>
                      )}
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

                  {/* Casual Indonesian Analogy Box */}
                  {guide?.analogy && (
                    <div className="rounded-2xl bg-gradient-to-br from-amber-50/90 via-yellow-50/40 to-white border-2 border-amber-200/80 p-4 sm:p-5 space-y-3">
                      <div className="inline-flex items-center gap-1.5 text-xs font-brand font-black uppercase tracking-wider text-amber-800">
                        <Lightbulb weight="fill" className="w-4 h-4 text-amber-500" />
                        <span>Bayangkan Seperti Ini di Bahasa Indonesia</span>
                      </div>
                      <p className="text-sm sm:text-base text-slate-800 font-bold leading-relaxed">
                        {guide.analogy}
                      </p>
                      {guide.when_to_use && guide.when_to_use.length > 0 && (
                        <div className="pt-2 border-t border-amber-200/60 space-y-1.5">
                          <span className="text-[11px] font-brand font-black uppercase tracking-wider text-amber-700 block">
                            Kapan Dipakai?
                          </span>
                          <ul className="space-y-1">
                            {guide.when_to_use.map((situation, idx) => (
                              <li
                                key={`when-${idx}`}
                                className="flex items-start gap-2 text-xs sm:text-[13px] font-medium text-slate-700"
                              >
                                <Check
                                  weight="bold"
                                  className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0"
                                />
                                <span>{situation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Color-coded Formula Visual */}
                  <GrammarFormulaVisual
                    formula={currentPoint.formula}
                    formulaReading={currentPoint.formula_reading}
                    formulaParts={guide?.formula_parts}
                    showRomaji={showRomaji}
                    isCopied={isFormulaCopied}
                    onCopy={() => void handleCopyFormula(currentPoint.formula)}
                  />

                  {/* Actionable Steps OR Fallback Explanation */}
                  {guide?.steps && guide.steps.length > 0 ? (
                    <div className="space-y-2.5 pt-1">
                      <h3 className="text-xs font-brand font-black uppercase tracking-wider text-slate-500">
                        Cara Bikin Kalimatnya (Langkah Praktis)
                      </h3>
                      <ol className="space-y-2">
                        {guide.steps.map((step, sIdx) => (
                          <li
                            key={`step-${sIdx}`}
                            className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed"
                          >
                            <span className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-brand font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="font-medium">{step}</span>
                          </li>
                        ))}
                      </ol>
                      {currentPoint.explanation && (
                        <p className="text-xs sm:text-sm text-slate-500 pt-1 leading-relaxed">
                          {currentPoint.explanation}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-2">
                      <h3 className="text-xs font-brand font-black uppercase tracking-wider text-slate-400">
                        Penjelasan Pola
                      </h3>
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                        {currentPoint.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Fallback callout when no structured learning_guide is present */}
              {!guide && <DidYouKnowCallout {...resolveGrammarDidYouKnow(currentPoint)} />}

              {/* 2. PROGRESSIVE EXAMPLES BROKEN DOWN BY WORD */}
              <GrammarWordBreakdownSection
                pointId={currentPoint.id}
                breakdowns={guide?.breakdowns}
                fallbackExamples={examples}
                showRomaji={showRomaji}
                playingExampleKey={playingExampleKey}
                onPlayAudio={handlePlayExample}
              />

              {/* 3. FORM VARIATIONS TABLE (POSITIF / NEGATIF / TANYA) */}
              {guide?.forms && guide.forms.length > 0 && (
                <section className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-[0_6px_0_0_#E2E8F0]">
                  <div className="space-y-0.5">
                    <h2 className="text-sm sm:text-base font-brand font-black text-slate-900">
                      Variasi Bentuk (Positif, Negatif & Konteks Lain)
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Perubahan bentuk akhir atau variasi sambungan yang paling sering muncul.
                    </p>
                  </div>

                  <div className="divide-y divide-slate-200/80 rounded-2xl border-2 border-slate-200/80 overflow-hidden bg-slate-50/40">
                    {guide.forms.map((form, fIdx) => {
                      const audioKey = `${currentPoint.id}-form-${fIdx}`
                      const isPlaying = playingExampleKey === audioKey
                      return (
                        <div
                          key={`form-${fIdx}`}
                          className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50/70 transition-colors"
                        >
                          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                            <span className="text-[11px] font-brand font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 shrink-0 min-w-[100px] text-center">
                              {form.label}
                            </span>
                            <div className="min-w-0 space-y-0.5 flex-1">
                              <p className="font-brand font-black text-sm sm:text-base text-slate-900 break-words">
                                {form.jp}
                              </p>
                              {showRomaji && form.reading && (
                                <p className="text-xs font-bold text-blue-600 break-words">
                                  {form.reading}
                                </p>
                              )}
                              <p className="text-xs font-medium text-slate-500">{form.id}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePlayExample(audioKey, form.jp)}
                            aria-label={`Putar audio: ${form.jp}`}
                            className={`h-8 px-2.5 rounded-lg border font-brand font-bold text-xs inline-flex items-center gap-1 self-end sm:self-center shrink-0 cursor-pointer transition-all ${
                              isPlaying
                                ? 'bg-blue-600 border-blue-700 text-white animate-pulse'
                                : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                            }`}
                          >
                            <SpeakerHigh weight="fill" className="w-3.5 h-3.5" />
                            <span>Dengar</span>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* 4. COMMON BEGINNER MISTAKES */}
              {guide?.mistakes && guide.mistakes.length > 0 && (
                <section className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-[0_6px_0_0_#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <WarningCircle weight="fill" className="w-5 h-5 text-rose-500 shrink-0" />
                    <div>
                      <h2 className="text-sm sm:text-base font-brand font-black text-slate-900">
                        Jangan Sampai Ketuker! (Kesalahan Umum Pemula)
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {guide.mistakes.map((m, mIdx) => (
                      <div
                        key={`mistake-${mIdx}`}
                        className="rounded-2xl border-2 border-slate-200/80 bg-slate-50/70 p-4 space-y-2.5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 flex items-start gap-2">
                            <XCircle weight="fill" className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] font-brand font-black uppercase tracking-wider text-rose-700 block">
                                Kurang Tepat
                              </span>
                              <p className="font-brand font-bold text-sm text-rose-950 break-words">
                                {m.wrong}
                              </p>
                            </div>
                          </div>
                          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 flex items-start gap-2">
                            <CheckCircle
                              weight="fill"
                              className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] font-brand font-black uppercase tracking-wider text-emerald-700 block">
                                Yang Benar
                              </span>
                              <p className="font-brand font-bold text-sm text-emerald-950 break-words">
                                {m.right}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed pl-1">
                          {m.why}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 5. INTERACTIVE UNDERSTANDING CHECK (3 QUESTIONS) */}
              {guide?.quiz && guide.quiz.length > 0 && (
                <GrammarMiniQuizCard
                  key={currentPoint.id}
                  questions={guide.quiz}
                  isAlreadyUnderstood={Boolean(currentPoint.is_understood)}
                  nextReviewAt={currentPoint.next_review_at}
                  isSubmitting={checkMutation.isPending}
                  submitError={checkError}
                  onSubmitResult={(correctCount, totalQuestions) => {
                    if (!isAuthenticated) {
                      setIsGuestGrammarModalOpen(true)
                      return
                    }
                    checkMutation.mutate({
                      pointKey: currentPoint.code || currentPoint.id,
                      correctCount,
                      totalQuestions,
                    })
                  }}
                  onRetrySubmit={(correctCount, totalQuestions) => {
                    if (!isAuthenticated) {
                      setIsGuestGrammarModalOpen(true)
                      return
                    }
                    checkMutation.mutate({
                      pointKey: currentPoint.code || currentPoint.id,
                      correctCount,
                      totalQuestions,
                    })
                  }}
                />
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

                <div className="px-5 py-4 border-b border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <ListBullets weight="bold" className="w-4 h-4 text-blue-600 shrink-0" />
                      <h2 className="font-brand font-black text-sm text-slate-900 truncate">
                        Daftar Materi JLPT {levelCode}
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {understoodInLevel}/{siblingPoints.length} Paham
                    </span>
                  </div>

                  {/* Level Mastery Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${levelProgressPct}%` }}
                    />
                  </div>
                </div>

                <div className="max-h-[420px] overflow-y-auto custom-scrollbar divide-y divide-slate-100">
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
                              : item.is_understood
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-500 border border-slate-200/70'
                          }`}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center justify-between gap-1.5">
                            <p
                              className={`font-brand font-black text-xs leading-snug line-clamp-1 ${
                                isActive ? 'text-blue-900' : 'text-slate-800'
                              }`}
                            >
                              {item.title}
                            </p>
                            {item.is_understood && (
                              <CheckCircle
                                weight="fill"
                                className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                                aria-label="Sudah paham"
                              />
                            )}
                          </div>
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

              {/* Direct Practice CTA Card linked to Curriculum Node */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-4 shadow-[0_6px_0_0_#1E40AF]">
                <div className="space-y-1">
                  <h3 className="font-brand font-black text-base">
                    {linkedPracticeTarget?.isUnlocked
                      ? 'Langsung Latihan Soal!'
                      : 'Latihan di Kurikulum'}
                  </h3>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    {linkedPracticeTarget
                      ? `${
                          linkedPracticeTarget.unitOrder > 0
                            ? `Unit ${linkedPracticeTarget.unitOrder} • `
                            : ''
                        }${linkedPracticeTarget.lessonTitle}`
                      : 'Terapkan pola ini langsung di sesi latihan menulis, mendengar, dan bicara.'}
                  </p>
                </div>
                <Button3D
                  variant="white"
                  size="sm"
                  fullWidth
                  icon={
                    linkedPracticeTarget && !linkedPracticeTarget.isUnlocked ? (
                      <LockSimple weight="bold" className="w-4 h-4 text-blue-600" />
                    ) : (
                      <ArrowRight weight="bold" className="w-4 h-4 text-blue-600" />
                    )
                  }
                  onClick={() => {
                    triggerHaptic('tap')
                    if (linkedPracticeTarget?.isUnlocked) {
                      navigate(`/learn/${encodeURIComponent(linkedPracticeTarget.lessonSlugOrId)}`)
                    } else {
                      navigate('/curriculum')
                    }
                  }}
                  className="text-blue-700 font-brand font-black"
                >
                  {linkedPracticeTarget?.isUnlocked
                    ? 'Latihan di Kurikulum'
                    : linkedPracticeTarget && linkedPracticeTarget.unitOrder > 0
                      ? `Lihat di Peta (Unit ${linkedPracticeTarget.unitOrder})`
                      : 'Buka Kurikulum'}
                </Button3D>
              </div>
            </aside>
          </div>
        )}
      </main>

      {!isAuthenticated && (
        <GuestLoginPromptModal
          isOpen={isGuestGrammarModalOpen}
          onClose={() => setIsGuestGrammarModalOpen(false)}
          reason="grammar_check"
        />
      )}
    </div>
  )
}
