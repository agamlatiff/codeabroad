import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowsClockwise,
  BookOpen,
  CaretDown,
  Check,
  CheckCircle,
  Eye,
  EyeSlash,
  Lightbulb,
  ListBullets,
  LockSimple,
  Sparkle,
  SpeakerHigh,
  Target,
  WarningCircle,
  Wrench,
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
import {
  useActiveLanguageCode,
  useActiveSpeechLocale,
} from '@/features/exercise/hooks/useActiveSpeechLocale'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'
import {
  LEVEL_ACCENT_STYLES,
  DEFAULT_LEVEL_ACCENT,
  formatCategoryLabel,
  getGrammarRoleStyle,
  isGrammarPointDueForReview,
  renderCategoryIcon,
} from '@/features/curriculum/constants/grammarStyles'
import { resolveGrammarDidYouKnow } from '@/features/curriculum/constants/grammarDidYouKnow'
import { GrammarFormulaVisual } from '@/features/curriculum/components/GrammarFormulaVisual'
import { GrammarWordBreakdownSection } from '@/features/curriculum/components/GrammarWordBreakdownSection'
import { GrammarMiniQuizCard } from '@/features/curriculum/components/GrammarMiniQuizCard'
import { GrammarSlotPlayground } from '@/features/curriculum/components/GrammarSlotPlayground'
import { GrammarOutlineDrawer } from '@/features/curriculum/components/GrammarOutlineDrawer'
import { GuestLoginPromptModal } from '@/features/auth/components/GuestLoginPromptModal'
import { TierUpgradeBanner } from '@/shared/components/ui/TierUpgradeBanner'
import { checkLevelAccess, isUserPro } from '@/shared/utils/levelAccess'

type GrammarLearningStep = 'understand' | 'build' | 'quiz'

const SLOW_SPEECH_RATE = 0.58

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
  const speechLocale = useActiveSpeechLocale()

  const [showRomaji, setShowRomaji] = useState(true)
  const [playingExampleKey, setPlayingExampleKey] = useState<string | null>(null)
  const [isFormulaCopied, setIsFormulaCopied] = useState(false)
  const [checkError, setCheckError] = useState<string | null>(null)
  const [isGuestGrammarModalOpen, setIsGuestGrammarModalOpen] = useState(false)
  const [activeStep, setActiveStep] = useState<GrammarLearningStep>(() =>
    location.hash === '#grammar-mini-quiz' ? 'quiz' : 'understand'
  )
  const [isOutlineOpen, setIsOutlineOpen] = useState(false)
  const [isGuideDetailsOpen, setIsGuideDetailsOpen] = useState(false)
  const [isFormsOpen, setIsFormsOpen] = useState(false)
  const [isMistakesOpen, setIsMistakesOpen] = useState(false)
  const [prevTargetId, setPrevTargetId] = useState(targetId)
  const [prevHash, setPrevHash] = useState(location.hash)

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const learningCardTopRef = useRef<HTMLDivElement | null>(null)

  if (targetId !== prevTargetId) {
    setPrevTargetId(targetId)
    setPrevHash(location.hash)
    setPlayingExampleKey(null)
    setIsFormulaCopied(false)
    setCheckError(null)
    setActiveStep(location.hash === '#grammar-mini-quiz' ? 'quiz' : 'understand')
    setIsOutlineOpen(false)
    setIsGuideDetailsOpen(false)
    setIsFormsOpen(false)
    setIsMistakesOpen(false)
  } else if (location.hash !== prevHash) {
    setPrevHash(location.hash)
    if (location.hash === '#grammar-mini-quiz') {
      setActiveStep('quiz')
    }
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

  // Sibling points within the same JLPT level for next/prev navigation & outline drawer
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
      audioService.speakLanguage(japaneseText, speechLocale, clear, clear, rate)
    },
    [playingExampleKey, speechLocale]
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [navigate]
  )

  const handleChangeStep = useCallback((nextStep: GrammarLearningStep, shouldScroll = false) => {
    triggerHaptic('tap')
    audioService.stopSpeech()
    setPlayingExampleKey(null)
    setActiveStep(nextStep)
    if (shouldScroll && learningCardTopRef.current) {
      learningCardTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const levelCode = (currentPoint?.level_code ?? 'N5').toUpperCase()
  const isPro = isUserPro(userData.user)
  const detailAccess = checkLevelAccess(levelCode, { isAuthenticated, isPro })
  const accent = LEVEL_ACCENT_STYLES[levelCode] ?? DEFAULT_LEVEL_ACCENT
  const guide = currentPoint?.learning_guide
  const examples = currentPoint?.examples ?? []
  const isDueForReview = Boolean(currentPoint && isGrammarPointDueForReview(currentPoint))
  const hasQuiz = Boolean(guide?.quiz && guide.quiz.length > 0)
  const effectiveStep: GrammarLearningStep =
    activeStep === 'quiz' && !hasQuiz ? 'understand' : activeStep

  const heroBreakdown = guide?.breakdowns?.[0] ?? null
  const heroBreakdownFullJp = heroBreakdown
    ? heroBreakdown.tokens.map((t) => t.jp).join('')
    : ''
  const heroBreakdownFullReading = heroBreakdown
    ? heroBreakdown.tokens
        .map((t) => t.reading)
        .filter(Boolean)
        .join(' ')
    : ''
  const heroFallbackExample = examples[0] ?? null
  const hasExtraGuideDetails = Boolean(
    (guide?.when_to_use && guide.when_to_use.length > 0) ||
      (guide?.steps && guide.steps.length > 0)
  )

  useEffect(() => {
    if (!isLoading && currentPoint && location.hash === '#grammar-mini-quiz' && effectiveStep === 'quiz') {
      const target = document.getElementById('grammar-mini-quiz')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [currentPoint, isLoading, location.hash, effectiveStep])

  const stepItems: Array<{
    id: GrammarLearningStep
    number: string
    label: string
    icon: typeof Sparkle
  }> = [
    { id: 'understand', number: '1', label: 'Pahami', icon: Sparkle },
    { id: 'build', number: '2', label: 'Coba Rakit', icon: Wrench },
    ...(hasQuiz ? [{ id: 'quiz' as const, number: '3', label: 'Tes Cepat', icon: Target }] : []),
  ]

  const renderPracticeCtaCard = () => (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_6px_0_0_#1E40AF]">
      <div className="space-y-1 min-w-0">
        <h3 className="font-brand font-black text-base sm:text-lg">
          {linkedPracticeTarget?.isUnlocked
            ? 'Siap Latihan di Kurikulum!'
            : 'Terapkan di Kurikulum'}
        </h3>
        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
          {linkedPracticeTarget
            ? `${
                linkedPracticeTarget.unitOrder > 0
                  ? `Unit ${linkedPracticeTarget.unitOrder} • `
                  : ''
              }${linkedPracticeTarget.lessonTitle}`
            : 'Terapkan pola ini langsung di sesi latihan menulis, mendengar, dan bicara.'}
        </p>
      </div>
      <div className="shrink-0">
        <Button3D
          variant="white"
          size="sm"
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
          className="text-blue-700 font-brand font-black w-full sm:w-auto"
        >
          {linkedPracticeTarget?.isUnlocked
            ? 'Mulai Latihan'
            : linkedPracticeTarget && linkedPracticeTarget.unitOrder > 0
              ? `Lihat Unit ${linkedPracticeTarget.unitOrder}`
              : 'Buka Kurikulum'}
        </Button3D>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      <AppLeftSidebar />

      <main className="flex-1 min-w-0 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 md:pb-12 space-y-5">
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-brand font-black border-2 transition-all cursor-pointer active:translate-y-0.5 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
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

        {/* Loading state skeleton (1-column) */}
        {isLoading && (
          <div className="space-y-5 animate-pulse">
            <div className="h-44 rounded-3xl bg-white border-2 border-slate-200/80" />
            <div className="h-64 rounded-3xl bg-white border-2 border-slate-200/80" />
            <div className="h-40 rounded-3xl bg-white border-2 border-slate-200/80" />
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

        {/* Tier Gate when user directly opens a locked N4-N1 grammar URL */}
        {!isLoading && currentPoint && !detailAccess.allowed && detailAccess.reason !== 'ok' && (
          <TierUpgradeBanner
            levelCode={levelCode}
            reason={detailAccess.reason}
            featureLabel="Materi Grammar"
            onSelectFreeLevel={() => navigate('/grammar?level=N5')}
          />
        )}

        {/* Main 1-Column Focused Learning Flow */}
        {!isLoading && currentPoint && detailAccess.allowed && (
          <article ref={learningCardTopRef} className="space-y-5 scroll-mt-4">
            {/* Spaced-Repetition Review Banner */}
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
                      Selesaikan ulang kuis 3 soal untuk memperbarui jadwal ulasan berikutnya.
                    </p>
                  </div>
                </div>
                {hasQuiz && (
                  <button
                    type="button"
                    onClick={() => {
                      handleChangeStep('quiz')
                      setTimeout(() => {
                        document
                          .getElementById('grammar-mini-quiz')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }, 60)
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-brand font-black transition-colors shrink-0 self-start sm:self-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
                  >
                    <span>Lompat ke Tes Cepat</span>
                    <ArrowDown weight="bold" className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* COMPACT HEADER + 3-STEP PROGRESSIVE DISCLOSURE BAR */}
            <header className="bg-white border-2 border-slate-200/90 rounded-3xl overflow-hidden shadow-[0_6px_0_0_#E2E8F0]">
              <div className={`h-2 w-full ${accent.topStrip}`} />

              <div className="p-5 sm:p-7 space-y-5">
                {/* Top metadata row + Outline Drawer trigger */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-brand font-black tracking-wide border ${accent.badge}`}
                    >
                      JLPT {levelCode}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-brand font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80">
                      {renderCategoryIcon(currentPoint.category, 'w-3.5 h-3.5 text-blue-600')}
                      <span>{formatCategoryLabel(currentPoint.category)}</span>
                    </span>
                    {currentPoint.is_understood && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-brand font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle weight="fill" className="w-3.5 h-3.5" />
                        <span>Paham</span>
                      </span>
                    )}
                  </div>

                  {siblingPoints.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap')
                        setIsOutlineOpen(true)
                      }}
                      aria-expanded={isOutlineOpen}
                      aria-haspopup="dialog"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <ListBullets weight="bold" className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs font-brand font-black">
                        Materi {siblingIndex + 1} dari {siblingPoints.length}
                      </span>
                      <span className="hidden sm:inline text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-1.5 py-0.5">
                        {understoodInLevel}/{siblingPoints.length} Paham
                      </span>
                      <CaretDown weight="bold" className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    </button>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-brand font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
                  {currentPoint.title}
                </h1>

                {/* 3-Step Segmented Stepper */}
                <div
                  role="group"
                  aria-label="Langkah belajar grammar"
                  className={`grid gap-2 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 ${
                    hasQuiz ? 'grid-cols-3' : 'grid-cols-2'
                  }`}
                >
                  {stepItems.map((step) => {
                    const isActive = effectiveStep === step.id
                    const StepIcon = step.icon
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => handleChangeStep(step.id)}
                        aria-pressed={isActive}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-brand font-black transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                          isActive
                            ? 'bg-white text-blue-700 border-2 border-blue-200 shadow-[0_3px_0_0_#DBEAFE]'
                            : 'text-slate-600 border-2 border-transparent hover:text-slate-900 hover:bg-white/60'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full text-[11px] font-mono font-black flex items-center justify-center shrink-0 ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {step.number}
                        </span>
                        <StepIcon
                          weight={isActive ? 'fill' : 'bold'}
                          className={`w-4 h-4 hidden sm:block shrink-0 ${
                            isActive ? 'text-blue-600' : 'text-slate-500'
                          }`}
                        />
                        <span className="truncate">{step.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </header>

            {/* =================================================================
                STEP 1: PAHAMI (Example-First + Friendly Indonesian Analogy)
            ================================================================= */}
            {effectiveStep === 'understand' && (
              <div className="space-y-5">
                {/* HERO KEY EXAMPLE ("Kalimat Sakti") */}
                {(heroBreakdown || heroFallbackExample) && (
                  <section className="bg-white border-2 border-blue-200/90 rounded-3xl p-5 sm:p-7 space-y-5 shadow-[0_6px_0_0_#DBEAFE]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-brand font-black uppercase tracking-wider">
                          Contoh Kalimat Utama
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          Ketuk kata untuk dengar bunyinya
                        </span>
                      </div>
                    </div>

                    {/* Interactive Tappable Word Tiles or Fallback Sentence */}
                    {heroBreakdown ? (
                      <div className="space-y-4">
                        <div className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-4 sm:p-5 space-y-4">
                          <div className="flex flex-wrap items-stretch gap-2 sm:gap-2.5">
                            {heroBreakdown.tokens.map((tok, tIdx) => {
                              const tokStyle = getGrammarRoleStyle(tok.role)
                              const tokKey = `hero-tok-${currentPoint.id}-${tIdx}`
                              const isTokPlaying = playingExampleKey === tokKey
                              return (
                                <button
                                  key={`${tok.jp}-${tIdx}`}
                                  type="button"
                                  onClick={() => handlePlayExample(tokKey, tok.jp)}
                                  aria-label={`Dengarkan kata ${tok.jp}, artinya ${tok.meaning}`}
                                  className={`group rounded-2xl border-2 px-3.5 py-2.5 text-left transition-all cursor-pointer active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${tokStyle.block} ${
                                    isTokPlaying
                                      ? 'ring-2 ring-blue-500 ring-offset-1 scale-[1.02]'
                                      : 'hover:shadow-sm'
                                  }`}
                                >
                                  <span
                                    lang="ja"
                                    className="block text-lg sm:text-2xl font-bold text-slate-900 leading-snug"
                                  >
                                    {tok.jp}
                                  </span>
                                  {showRomaji && tok.reading && (
                                    <span className="block font-mono text-xs font-semibold text-slate-600 mt-0.5">
                                      {tok.reading}
                                    </span>
                                  )}
                                  <span
                                    className={`block text-xs font-brand font-extrabold mt-1 ${tokStyle.label}`}
                                  >
                                    {tok.meaning}
                                  </span>
                                </button>
                              )
                            })}
                          </div>

                          {/* Indonesian Meaning */}
                          <div className="pt-3 border-t border-slate-200/80 space-y-1">
                            {showRomaji && heroBreakdownFullReading && (
                              <p className="font-mono text-xs sm:text-sm font-semibold text-blue-700">
                                {heroBreakdownFullReading}
                              </p>
                            )}
                            <p className="text-base sm:text-lg font-brand font-black text-slate-900">
                              &ldquo;{heroBreakdown.translation}&rdquo;
                            </p>
                          </div>
                        </div>

                        {/* Audio Controls */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              handlePlayExample(
                                `hero-full-${currentPoint.id}`,
                                heroBreakdownFullJp
                              )
                            }
                            aria-pressed={playingExampleKey === `hero-full-${currentPoint.id}`}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-brand font-black transition-all cursor-pointer active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                              playingExampleKey === `hero-full-${currentPoint.id}`
                                ? 'bg-blue-600 text-white border-blue-700'
                                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            }`}
                          >
                            <SpeakerHigh weight="fill" className="w-4 h-4" />
                            <span>
                              {playingExampleKey === `hero-full-${currentPoint.id}`
                                ? 'Memutar...'
                                : 'Dengar Kalimat'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handlePlayExample(
                                `hero-slow-${currentPoint.id}`,
                                heroBreakdownFullJp,
                                SLOW_SPEECH_RATE
                              )
                            }
                            aria-pressed={playingExampleKey === `hero-slow-${currentPoint.id}`}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-brand font-black transition-all cursor-pointer active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                              playingExampleKey === `hero-slow-${currentPoint.id}`
                                ? 'bg-emerald-600 text-white border-emerald-700'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <SpeakerHigh weight="bold" className="w-4 h-4" />
                            <span>0.6x Pelan</span>
                          </button>
                        </div>
                      </div>
                    ) : heroFallbackExample ? (
                      <div className="space-y-4">
                        <div className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-4 sm:p-5 space-y-2">
                          <p
                            lang="ja"
                            className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed"
                          >
                            {heroFallbackExample.jp}
                          </p>
                          {showRomaji && heroFallbackExample.reading && (
                            <p className="font-mono text-xs sm:text-sm font-semibold text-blue-700">
                              {heroFallbackExample.reading}
                            </p>
                          )}
                          <p className="text-base sm:text-lg font-brand font-black text-slate-900">
                            &ldquo;{heroFallbackExample.id}&rdquo;
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              handlePlayExample(
                                `hero-fallback-${currentPoint.id}`,
                                heroFallbackExample.jp
                              )
                            }
                            aria-pressed={playingExampleKey === `hero-fallback-${currentPoint.id}`}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-brand font-black transition-all cursor-pointer active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                              playingExampleKey === `hero-fallback-${currentPoint.id}`
                                ? 'bg-blue-600 text-white border-blue-700'
                                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            }`}
                          >
                            <SpeakerHigh weight="fill" className="w-4 h-4" />
                            <span>Dengar Kalimat</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handlePlayExample(
                                `hero-fallback-slow-${currentPoint.id}`,
                                heroFallbackExample.jp,
                                SLOW_SPEECH_RATE
                              )
                            }
                            aria-pressed={
                              playingExampleKey === `hero-fallback-slow-${currentPoint.id}`
                            }
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-brand font-black transition-all cursor-pointer active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                              playingExampleKey === `hero-fallback-slow-${currentPoint.id}`
                                ? 'bg-emerald-600 text-white border-emerald-700'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <SpeakerHigh weight="bold" className="w-4 h-4" />
                            <span>0.6x Pelan</span>
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </section>
                )}

                {/* FRIENDLY INDONESIAN ANALOGY CARD */}
                <section className="rounded-3xl bg-amber-50/80 border-2 border-amber-200/90 p-5 sm:p-7 space-y-4 shadow-[0_5px_0_0_#FDE68A]">
                  <div className="inline-flex items-center gap-1.5 text-xs font-brand font-black uppercase tracking-wider text-amber-800">
                    <Lightbulb weight="fill" className="w-4 h-4 text-amber-600" />
                    <span>Gampangnya Seperti Ini</span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-800 font-semibold leading-relaxed">
                    {guide?.analogy || currentPoint.explanation}
                  </p>

                  {hasExtraGuideDetails && (
                    <div className="pt-2 border-t border-amber-200/80">
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('tap')
                          setIsGuideDetailsOpen((prev) => !prev)
                        }}
                        aria-expanded={isGuideDetailsOpen}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-brand font-black text-amber-900 hover:text-amber-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 rounded-lg py-1"
                      >
                        <span>
                          {isGuideDetailsOpen
                            ? 'Sembunyikan kapan dipakai & langkah praktis'
                            : 'Lihat kapan dipakai & langkah praktis'}
                        </span>
                        <CaretDown
                          weight="bold"
                          className={`w-4 h-4 transition-transform ${
                            isGuideDetailsOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isGuideDetailsOpen && (
                        <div className="mt-4 space-y-4">
                          {guide?.when_to_use && guide.when_to_use.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-[11px] font-brand font-black uppercase tracking-wider text-amber-800">
                                Kapan Dipakai?
                              </p>
                              <ul className="space-y-1.5">
                                {guide.when_to_use.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed"
                                  >
                                    <Check
                                      weight="bold"
                                      className="w-4 h-4 text-amber-700 shrink-0 mt-0.5"
                                    />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {guide?.steps && guide.steps.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-[11px] font-brand font-black uppercase tracking-wider text-amber-800">
                                Langkah Membuat Kalimat
                              </p>
                              <ol className="space-y-2">
                                {guide.steps.map((step, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed"
                                  >
                                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-brand font-black flex items-center justify-center shrink-0 mt-0.5">
                                      {idx + 1}
                                    </span>
                                    <span className="font-medium">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* Fallback cultural note only when no structured guide exists */}
                {!guide && <DidYouKnowCallout {...resolveGrammarDidYouKnow(currentPoint)} />}

                {/* Step 1 Primary CTA */}
                <div className="flex justify-end pt-1">
                  <Button3D
                    variant="blue"
                    size="md"
                    icon={<ArrowRight weight="bold" className="w-4 h-4" />}
                    onClick={() => handleChangeStep('build', true)}
                    className="w-full sm:w-auto"
                  >
                    Lanjut: Coba Rakit Kalimat
                  </Button3D>
                </div>
              </div>
            )}

            {/* =================================================================
                STEP 2: COBA RAKIT (Slot Builder + Formula + Breakdowns + Accordions)
            ================================================================= */}
            {effectiveStep === 'build' && (
              <div className="space-y-5">
                {/* Interactive Mix-and-Match Slot Playground / Tap-to-Hear Explorer */}
                <GrammarSlotPlayground
                  key={currentPoint.id}
                  pointId={currentPoint.id}
                  pointCode={currentPoint.code}
                  breakdowns={guide?.breakdowns}
                  showRomaji={showRomaji}
                  playingExampleKey={playingExampleKey}
                  onPlayAudio={handlePlayExample}
                />

                {/* Visual Color-Coded Formula (Beginner-Friendly Labels) */}
                <section className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-[0_6px_0_0_#E2E8F0]">
                  <GrammarFormulaVisual
                    formula={currentPoint.formula}
                    formulaParts={guide?.formula_parts}
                    formulaReading={currentPoint.formula_reading}
                    showRomaji={showRomaji}
                    isCopied={isFormulaCopied}
                    onCopy={() => void handleCopyFormula(currentPoint.formula)}
                  />
                </section>

                {/* Progressive Word-by-Word Examples */}
                <GrammarWordBreakdownSection
                  pointId={currentPoint.id}
                  breakdowns={guide?.breakdowns}
                  fallbackExamples={examples}
                  showRomaji={showRomaji}
                  playingExampleKey={playingExampleKey}
                  onPlayAudio={handlePlayExample}
                />

                {/* Collapsible Accordion: Variasi Bentuk */}
                {guide?.forms && guide.forms.length > 0 && (
                  <section className="bg-white border-2 border-slate-200/90 rounded-3xl overflow-hidden shadow-[0_5px_0_0_#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap')
                        setIsFormsOpen((prev) => !prev)
                      }}
                      aria-expanded={isFormsOpen}
                      className="w-full px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/80 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                          <ArrowsClockwise weight="bold" className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <h2 className="font-brand font-black text-sm sm:text-base text-slate-900">
                            Variasi Bentuk
                          </h2>
                          <p className="text-xs text-slate-500">
                            Positif, negatif, lampau, dan tanya ({guide.forms.length} bentuk)
                          </p>
                        </div>
                      </div>
                      <CaretDown
                        weight="bold"
                        className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${
                          isFormsOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isFormsOpen && (
                      <div className="px-5 sm:px-7 pb-6 pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {guide.forms.map((form, idx) => {
                          const audioKey = `form-${currentPoint.id}-${idx}`
                          const isPlaying = playingExampleKey === audioKey
                          return (
                            <div
                              key={`${form.label}-${idx}`}
                              className="rounded-2xl border-2 border-slate-200/80 bg-slate-50/70 p-4 space-y-2"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-brand font-black text-blue-700">
                                  {form.label}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handlePlayExample(audioKey, form.jp)}
                                  aria-label={`Dengarkan contoh ${form.label}`}
                                  aria-pressed={isPlaying}
                                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                    isPlaying
                                      ? 'bg-blue-600 text-white border-blue-700'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600'
                                  }`}
                                >
                                  <SpeakerHigh weight="fill" className="w-4 h-4" />
                                </button>
                              </div>
                              <p lang="ja" className="text-base font-bold text-slate-900">
                                {form.jp}
                              </p>
                              {showRomaji && form.reading && (
                                <p className="font-mono text-xs font-semibold text-blue-700">
                                  {form.reading}
                                </p>
                              )}
                              <p className="text-xs font-medium text-slate-600">
                                {form.id}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </section>
                )}

                {/* Collapsible Accordion: Jangan Sampai Ketuker! */}
                {guide?.mistakes && guide.mistakes.length > 0 && (
                  <section className="bg-white border-2 border-rose-200/80 rounded-3xl overflow-hidden shadow-[0_5px_0_0_#FECDD3]">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap')
                        setIsMistakesOpen((prev) => !prev)
                      }}
                      aria-expanded={isMistakesOpen}
                      className="w-full px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between gap-3 text-left hover:bg-rose-50/40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-500"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                          <WarningCircle weight="fill" className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <h2 className="font-brand font-black text-sm sm:text-base text-slate-900">
                            Jangan Sampai Ketuker!
                          </h2>
                          <p className="text-xs text-slate-500">
                            Kesalahan yang sering terjadi pada pemula ({guide.mistakes.length} catatan)
                          </p>
                        </div>
                      </div>
                      <CaretDown
                        weight="bold"
                        className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${
                          isMistakesOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isMistakesOpen && (
                      <div className="px-5 sm:px-7 pb-6 pt-3 border-t border-rose-100 space-y-3">
                        {guide.mistakes.map((mistake, idx) => (
                          <div
                            key={idx}
                            className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 space-y-2.5"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 space-y-1">
                                <span className="inline-flex items-center gap-1 text-[11px] font-brand font-black text-rose-700">
                                  <XCircle weight="fill" className="w-3.5 h-3.5" />
                                  <span>Kurang Tepat</span>
                                </span>
                                <p
                                  lang="ja"
                                  className="text-sm sm:text-base font-bold text-rose-950 line-through decoration-rose-400"
                                >
                                  {mistake.wrong}
                                </p>
                              </div>

                              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 space-y-1">
                                <span className="inline-flex items-center gap-1 text-[11px] font-brand font-black text-emerald-700">
                                  <CheckCircle weight="fill" className="w-3.5 h-3.5" />
                                  <span>Yang Benar</span>
                                </span>
                                <p
                                  lang="ja"
                                  className="text-sm sm:text-base font-bold text-emerald-950"
                                >
                                  {mistake.right}
                                </p>
                              </div>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                              {mistake.why}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* Step 2 Footer Controls */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleChangeStep('understand', true)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 text-xs sm:text-sm font-brand font-black text-slate-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <ArrowLeft weight="bold" className="w-4 h-4" />
                    <span>Kembali: Pahami</span>
                  </button>

                  {hasQuiz ? (
                    <Button3D
                      variant="blue"
                      size="md"
                      icon={<ArrowRight weight="bold" className="w-4 h-4" />}
                      onClick={() => handleChangeStep('quiz', true)}
                      className="w-full sm:w-auto"
                    >
                      Lanjut: Tes Cepat ({guide?.quiz?.length ?? 3} Soal)
                    </Button3D>
                  ) : null}
                </div>

                {/* When there is no quiz on this point, place curriculum practice CTA at end of Step 2 */}
                {!hasQuiz && renderPracticeCtaCard()}
              </div>
            )}

            {/* =================================================================
                STEP 3: TES CEPAT (Focused Mini Quiz + Curriculum Practice CTA)
            ================================================================= */}
            {effectiveStep === 'quiz' && hasQuiz && guide?.quiz && (
              <div className="space-y-5">
                <div id="grammar-mini-quiz" className="scroll-mt-6">
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
                </div>

                {renderPracticeCtaCard()}

                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => handleChangeStep('build', true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 text-xs sm:text-sm font-brand font-black text-slate-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <ArrowLeft weight="bold" className="w-4 h-4" />
                    <span>Kembali: Coba Rakit</span>
                  </button>
                </div>
              </div>
            )}

            {/* BOTTOM PREV / NEXT TOPIC NAVIGATION */}
            <nav
              aria-label="Navigasi antar materi grammar"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"
            >
              {prevPoint ? (
                <button
                  type="button"
                  onClick={() => handleNavigatePoint(prevPoint)}
                  className="text-left p-4 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer shadow-[0_3px_0_0_#E2E8F0] active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span className="inline-flex items-center gap-1 text-[11px] font-brand font-extrabold uppercase tracking-wider text-slate-500">
                    <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
                    <span>Materi Sebelumnya</span>
                  </span>
                  <p className="font-brand font-black text-sm text-slate-900 mt-0.5 line-clamp-1">
                    {prevPoint.title}
                  </p>
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}

              {nextPoint && (
                <button
                  type="button"
                  onClick={() => handleNavigatePoint(nextPoint)}
                  className="text-right p-4 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer shadow-[0_3px_0_0_#E2E8F0] active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span className="inline-flex items-center justify-end gap-1 text-[11px] font-brand font-extrabold uppercase tracking-wider text-blue-600">
                    <span>Materi Berikutnya</span>
                    <ArrowRight weight="bold" className="w-3.5 h-3.5" />
                  </span>
                  <p className="font-brand font-black text-sm text-slate-900 mt-0.5 line-clamp-1">
                    {nextPoint.title}
                  </p>
                </button>
              )}
            </nav>
          </article>
        )}
      </main>

      {/* Slide-over Outline Drawer */}
      {!isLoading && currentPoint && (
        <GrammarOutlineDrawer
          isOpen={isOutlineOpen}
          onClose={() => setIsOutlineOpen(false)}
          levelCode={levelCode}
          siblingPoints={siblingPoints}
          currentPointId={currentPoint.id}
          understoodInLevel={understoodInLevel}
          levelProgressPct={levelProgressPct}
          onSelectPoint={handleNavigatePoint}
        />
      )}

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
