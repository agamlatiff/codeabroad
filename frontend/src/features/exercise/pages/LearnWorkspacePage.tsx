import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useLearnWorkspace } from '@/features/exercise/hooks/useLearnWorkspace'
import { AccessibleModal } from '@/shared/components/ui/AccessibleModal'
import { Button3D } from '@/shared/components/ui/Button3D'
import { ExercisePromptRenderer } from '@/features/exercise/components/ExercisePromptRenderer'
import {
  ExerciseSessionHeader,
  type TimelineStepSegment,
} from '@/features/exercise/components/ExerciseSessionHeader'
import { ExerciseSessionStatusView } from '@/features/exercise/components/ExerciseSessionStatusView'
import { LessonFeedbackFooter } from '@/features/exercise/components/LessonFeedbackFooter'
import { LessonGrammarDrawer } from '@/features/exercise/components/LessonGrammarDrawer'
import { LessonStudyCardsDrawer } from '@/features/exercise/components/LessonStudyCardsDrawer'
import { LessonIntroView } from '@/features/exercise/components/LessonIntroView'
import {
  buildClientFallbackHint,
  buildDynamicLessonIntroDeck,
  buildInterleavedStudyBatches,
  findMatchingStudyItem,
} from '@/features/exercise/constants/lessonIntroCards'
import { audioService } from '@/shared/services/audioService'
import { useAudioStore } from '@/shared/store/audioStore'
import { useActiveSpeechLocale } from '@/features/exercise/hooks/useActiveSpeechLocale'
import {
  ArrowsClockwise,
  BookOpen,
  ShieldCheck,
  Sparkle,
  Translate,
} from '@phosphor-icons/react'

const JAPANESE_CHAR_REGEX = /[\u3040-\u30ff\u4e00-\u9faf]/
const SPEAKABLE_TEXT_REGEX = /[\p{L}\p{N}]/u

const LearnWorkspaceContent = ({ lessonId }: { lessonId?: string }) => {
  const navigate = useNavigate()
  const speechLocale = useActiveSpeechLocale()
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false)
  const {
    lesson,
    exercises,
    baseExercisesCount,
    currentExercise,
    parsedContent,
    currentIndex,
    isCheckpoint,
    isRetryRound,
    dismissedStudyBatches,
    progressPercent,
    resolvedCorrectAnswer,
    selectedTokenIndices,
    selectedTokens,
    selectedOptionValue,
    textInput,
    submittedResult,
    submitError,
    isScoreTooLowError,
    showHint,
    isGrammarDrawerOpen,
    setIsGrammarDrawerOpen,
    isStudyDrawerOpen,
    setIsStudyDrawerOpen,
    handleDismissStudyBatch,
    isSpeakingAudio,
    isRecordingSpeech,
    speechRecognitionSupported,
    audioPlaybackError,
    canCheckAnswer,
    isLastExercise,
    isLoading,
    isError,
    isRetryingLesson,
    isGuest,
    isLessonLockedError,
    lessonErrorMessage,
    isChecking,
    isCompleting,
    refetchLesson,
    handleAddToken,
    handleRemoveToken,
    handleClearTokens,
    handleSelectOption,
    handleSetTextInput,
    handlePlayAudio,
    handleToggleRecording,
    handleCheckAnswer,
    handleContinue,
    handleRetryLesson,
    handleToggleHint,
    handleExitToCurriculum,
    handleEnterShortcut,
  } = useLearnWorkspace(lessonId)

  const introDeck = useMemo(
    () => (isCheckpoint || !lesson ? null : buildDynamicLessonIntroDeck(lesson)),
    [isCheckpoint, lesson]
  )

  const studyBatches = useMemo(
    () =>
      introDeck
        ? buildInterleavedStudyBatches(introDeck, baseExercisesCount)
        : new Map(),
    [baseExercisesCount, introDeck]
  )

  const activeStudyBatch = useMemo(() => {
    if (isCheckpoint || isRetryRound) return null
    if (!studyBatches.has(currentIndex)) return null
    if (dismissedStudyBatches.includes(currentIndex)) return null
    return studyBatches.get(currentIndex) ?? null
  }, [currentIndex, dismissedStudyBatches, isCheckpoint, isRetryRound, studyBatches])

  const hasAutoPlayableQuestionAudio = Boolean(
    parsedContent?.audioUrl || parsedContent?.audioText || parsedContent?.displayText
  )

  // Auto-play spoken Japanese question audio when entering an exercise
  useEffect(() => {
    if (
      activeStudyBatch ||
      isStudyDrawerOpen ||
      isGrammarDrawerOpen ||
      !currentExercise ||
      !hasAutoPlayableQuestionAudio ||
      submittedResult !== null
    ) {
      return
    }

    const timer = window.setTimeout(() => {
      const { autoPlayVoice, audioMode } = useAudioStore.getState()
      if (!autoPlayVoice || audioMode === 'muted') return
      handlePlayAudio(undefined, { isAutoPlay: true })
    }, 220)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    activeStudyBatch,
    currentExercise,
    handlePlayAudio,
    hasAutoPlayableQuestionAudio,
    isGrammarDrawerOpen,
    isStudyDrawerOpen,
    submittedResult,
  ])

  const answerCandidateText =
    resolvedCorrectAnswer || submittedResult?.correct_answer || ''

  const answerStudyItem = useMemo(() => {
    if (!introDeck || isCheckpoint) return null
    return findMatchingStudyItem(
      introDeck.items,
      currentIndex,
      submittedResult && !submittedResult.is_correct ? answerCandidateText : undefined
    )
  }, [answerCandidateText, currentIndex, introDeck, isCheckpoint, submittedResult])

  const fallbackHint = useMemo(() => {
    if (isCheckpoint || !currentExercise || !lesson) return undefined
    return buildClientFallbackHint(
      currentExercise,
      answerStudyItem,
      lesson.grammar_points[0]
    )
  }, [answerStudyItem, currentExercise, isCheckpoint, lesson])

  // Safety Net #3 + Auto-Play: softly pronounce the missed word when an answer is wrong
  useEffect(() => {
    if (!submittedResult || submittedResult.is_correct || isCheckpoint) return
    const canSpeakCandidate = speechLocale.startsWith('ja')
      ? JAPANESE_CHAR_REGEX.test(answerCandidateText)
      : currentExercise?.exercise_type !== 'select_meaning' &&
        SPEAKABLE_TEXT_REGEX.test(answerCandidateText)
    const speakTarget =
      answerStudyItem?.speakText || (canSpeakCandidate ? answerCandidateText : '')
    if (!speakTarget) return

    const timer = window.setTimeout(() => {
      const { autoPlayVoice, audioMode } = useAudioStore.getState()
      if (!autoPlayVoice || audioMode === 'muted') return
      audioService.speakLanguage(speakTarget, speechLocale)
    }, 450)

    return () => {
      window.clearTimeout(timer)
      audioService.stopSpeech()
    }
  }, [
    answerCandidateText,
    answerStudyItem?.speakText,
    currentExercise?.exercise_type,
    isCheckpoint,
    speechLocale,
    submittedResult,
  ])

  useEffect(() => {
    if (isLastExercise) {
      void import('@/features/exercise/pages/QuestCompletePage')
    }
  }, [isLastExercise])

  if (isLoading) {
    return (
      <ExerciseSessionStatusView
        mode="loading"
        message="Menyiapkan materi pelajaran..."
        onExit={handleExitToCurriculum}
      />
    )
  }

  if (isError || !lesson) {
    if (isGuest && isLessonLockedError) {
      return (
        <ExerciseSessionStatusView
          mode="status"
          emotion="thinking"
          title="Unit Lanjutan Membutuhkan Akun Gratis"
          message="Di Mode Coba Tanpa Login, kamu bisa mengerjakan seluruh pelajaran Unit 1. Buat akun gratis dalam 10 detik untuk membuka seluruh unit lanjutan dan menyimpan progresmu."
          primaryLabel="Daftar Gratis & Buka Semua Unit"
          onPrimary={() => navigate('/register?from=guest')}
          secondaryLabel="Kembali ke Unit 1"
          onSecondary={handleExitToCurriculum}
        />
      )
    }

    return (
      <ExerciseSessionStatusView
        mode="status"
        emotion="worried"
        title="Pelajaran Tidak Dapat Dibuka"
        message={
          lessonErrorMessage ||
          'Pelajaran tidak ditemukan atau masih terkunci.'
        }
        primaryLabel="Kembali ke Kurikulum"
        onPrimary={handleExitToCurriculum}
        secondaryLabel="Coba Lagi"
        isSecondaryLoading={isRetryingLesson}
        onSecondary={() => void refetchLesson()}
      />
    )
  }

  if (exercises.length === 0 || !currentExercise || !parsedContent) {
    return (
      <ExerciseSessionStatusView
        mode="status"
        emotion="thinking"
        title="Belum Ada Soal Latihan"
        message="Materi soal untuk pelajaran ini belum tersedia di kurikulum."
        primaryLabel="Kembali ke Kurikulum"
        onPrimary={handleExitToCurriculum}
      />
    )
  }

  const totalTimelineSteps = exercises.length + studyBatches.size
  const completedBatchCount = Array.from(studyBatches.keys()).filter((idx) =>
    dismissedStudyBatches.includes(idx)
  ).length
  const completedTimelineSteps =
    currentIndex + completedBatchCount + (submittedResult !== null ? 1 : 0)
  const unifiedProgressPercent =
    totalTimelineSteps > 0
      ? Math.min(100, Math.round((completedTimelineSteps / totalTimelineSteps) * 100))
      : progressPercent

  const timelineSteps: TimelineStepSegment[] | undefined =
    !isCheckpoint && !isRetryRound && studyBatches.size > 0
      ? Array.from({ length: exercises.length }, (_, idx) => {
          const items: TimelineStepSegment[] = []
          if (studyBatches.has(idx)) {
            const isDismissed = dismissedStudyBatches.includes(idx)
            const isActiveBatch = Boolean(activeStudyBatch && currentIndex === idx)
            items.push({
              kind: 'study',
              state: isDismissed || idx < currentIndex ? 'done' : isActiveBatch ? 'current' : 'upcoming',
            })
          }
          const exState: TimelineStepSegment['state'] =
            idx < currentIndex
              ? 'done'
              : idx === currentIndex && !activeStudyBatch
                ? submittedResult !== null
                  ? 'done'
                  : 'current'
                : 'upcoming'
          items.push({ kind: 'exercise', state: exState })
          return items
        }).flat()
      : undefined

  const hasSessionProgress =
    currentIndex > 0 || dismissedStudyBatches.length > 0 || submittedResult !== null

  const requestExitSession = () => {
    if (hasSessionProgress) {
      setIsExitConfirmOpen(true)
      return
    }
    handleExitToCurriculum()
  }

  const exitConfirmModal = (
    <AccessibleModal
      isOpen={isExitConfirmOpen}
      onClose={() => setIsExitConfirmOpen(false)}
      ariaLabel="Konfirmasi Keluar dari Pelajaran"
    >
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
        <div className="space-y-1.5">
          <h2 className="font-brand font-black text-lg text-slate-900">
            Keluar dari Pelajaran?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Progresmu di sesi ini tersimpan sementara di perangkat ini, jadi kamu bisa melanjutkannya
            saat kembali.
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
          <Button3D
            type="button"
            variant="white"
            size="md"
            fullWidth
            onClick={() => {
              setIsExitConfirmOpen(false)
              handleExitToCurriculum()
            }}
          >
            Keluar ke Peta
          </Button3D>
          <Button3D
            type="button"
            variant="blue"
            size="md"
            fullWidth
            onClick={() => setIsExitConfirmOpen(false)}
          >
            Lanjut Belajar
          </Button3D>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsExitConfirmOpen(false)
            handleRetryLesson()
          }}
          className="w-full text-center text-xs font-brand font-bold text-slate-500 hover:text-rose-600 py-1 transition-colors cursor-pointer"
        >
          Mulai Ulang Sesi dari Awal
        </button>
      </div>
    </AccessibleModal>
  )

  if (introDeck && activeStudyBatch) {
    return (
      <>
        <LessonIntroView
          lessonTitle={lesson.title}
          xpReward={lesson.xp_reward}
          deck={introDeck}
          batch={activeStudyBatch}
          progressPercent={Math.max(5, unifiedProgressPercent)}
          counterLabel={`Materi ${activeStudyBatch.batchNumber}/${activeStudyBatch.totalBatches}`}
          timelineSteps={timelineSteps}
          onExit={requestExitSession}
          onStartQuiz={() => handleDismissStudyBatch(currentIndex)}
        />
        {exitConfirmModal}
      </>
    )
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#FAFAF9] text-slate-900 font-sans overflow-hidden">
      <ExerciseSessionHeader
        onExit={requestExitSession}
        exitAriaLabel="Keluar ke Kurikulum"
        exitDisabled={isChecking || isCompleting}
        progressPercent={unifiedProgressPercent}
        progressFillClass={isRetryRound ? 'bg-amber-500' : 'bg-emerald-500'}
        counterLabel={
          exercises.length > 0
            ? `${Math.min(currentIndex + 1, exercises.length)}/${exercises.length}`
            : '0/0'
        }
        timelineSteps={timelineSteps}
        rightSlot={
          <div className="flex items-center gap-2 shrink-0">
            {isRetryRound && !isCheckpoint && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-[11px] font-black text-amber-800">
                <ArrowsClockwise weight="bold" className="w-3.5 h-3.5" />
                <span>Latih Ulang Kesalahan</span>
              </span>
            )}

            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-700">
              <Sparkle weight="fill" className="w-4 h-4 text-amber-500" />
              +{lesson.xp_reward} XP
            </span>

            {isCheckpoint ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-extrabold text-rose-700">
                <ShieldCheck weight="fill" className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">Ujian Checkpoint • Tanpa Bantuan</span>
                <span className="sm:hidden">Ujian</span>
              </span>
            ) : (
              <>
                {introDeck && introDeck.items.length > 0 && (
                  <button
                    type="button"
                    disabled={isChecking || isCompleting}
                    onClick={() => setIsStudyDrawerOpen(true)}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-extrabold text-emerald-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Translate weight="bold" className="w-4 h-4" />
                    <span className="hidden sm:inline">Intip Materi</span>
                  </button>
                )}

                {lesson.grammar_points.length > 0 && (
                  <button
                    type="button"
                    disabled={isChecking || isCompleting}
                    onClick={() => setIsGrammarDrawerOpen(true)}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-extrabold text-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <BookOpen weight="bold" className="w-4 h-4" />
                    <span className="hidden sm:inline">Tata Bahasa</span>
                  </button>
                )}
              </>
            )}
          </div>
        }
      />

      {/* Main Interactive Exercise Stage */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            {lesson.title}
          </p>

          <MotionConfig reducedMotion="user">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentExercise.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <ExercisePromptRenderer
                  exercise={currentExercise}
                  parsedContent={parsedContent}
                  selectedTokenIndices={selectedTokenIndices}
                  selectedTokens={selectedTokens}
                  selectedOptionValue={selectedOptionValue}
                  textInput={textInput}
                  submittedResult={submittedResult}
                  isSubmitting={isChecking || isCompleting}
                  showHint={showHint}
                  isCheckpoint={isCheckpoint}
                  fallbackHint={fallbackHint}
                  onOpenStudyDrawer={
                    !isCheckpoint && introDeck && introDeck.items.length > 0
                      ? () => setIsStudyDrawerOpen(true)
                      : undefined
                  }
                  isSpeakingAudio={isSpeakingAudio}
                  isRecordingSpeech={isRecordingSpeech}
                  speechRecognitionSupported={speechRecognitionSupported}
                  audioPlaybackError={audioPlaybackError}
                  onAddToken={handleAddToken}
                  onRemoveToken={handleRemoveToken}
                  onClearTokens={handleClearTokens}
                  onSelectOption={handleSelectOption}
                  onSetTextInput={handleSetTextInput}
                  onPlayAudio={handlePlayAudio}
                  onToggleRecording={handleToggleRecording}
                  onToggleHint={handleToggleHint}
                  onEnterKey={handleEnterShortcut}
                />
              </motion.div>
            </AnimatePresence>
          </MotionConfig>
        </div>
      </main>

      {/* Sticky Bottom Verification & Feedback Footer */}
      <LessonFeedbackFooter
        submittedResult={submittedResult}
        resolvedCorrectAnswer={resolvedCorrectAnswer}
        answerStudyItem={isCheckpoint ? null : answerStudyItem}
        submitError={submitError}
        canCheckAnswer={canCheckAnswer}
        isChecking={isChecking}
        isCompleting={isCompleting}
        isLastExercise={isLastExercise}
        canRetryLesson={isScoreTooLowError}
        onCheckAnswer={() => void handleCheckAnswer()}
        onContinue={handleContinue}
        onRetryLesson={handleRetryLesson}
      />

      {/* Quick Study Cards Drawer (Safety Net #2) */}
      <LessonStudyCardsDrawer
        isOpen={isStudyDrawerOpen}
        items={introDeck?.items ?? []}
        kanaLinkScript={introDeck?.kanaLinkScript}
        onClose={() => setIsStudyDrawerOpen(false)}
      />

      {/* Grammar Reference Drawer */}
      <LessonGrammarDrawer
        isOpen={isGrammarDrawerOpen}
        grammarPoints={lesson.grammar_points}
        onClose={() => setIsGrammarDrawerOpen(false)}
      />

      {exitConfirmModal}
    </div>
  )
}

/**
 * Interactive language lesson player (/learn/:id), keyed per route param to reset state cleanly.
 */
export const LearnWorkspacePage = () => {
  const { id } = useParams<{ id: string }>()
  const userId = useAuthStore((s) => s.user?.id ?? 'anonymous')
  return <LearnWorkspaceContent key={`${userId}:${id ?? 'missing'}`} lessonId={id} />
}
