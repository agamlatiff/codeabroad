import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import { languageService } from '@/features/curriculum/services/languageService'
import { ExamResultSummary } from '@/features/exercise/components/ExamResultSummary'
import { ExercisePromptRenderer } from '@/features/exercise/components/ExercisePromptRenderer'
import { ExerciseSessionHeader } from '@/features/exercise/components/ExerciseSessionHeader'
import { ExerciseSessionStatusView } from '@/features/exercise/components/ExerciseSessionStatusView'
import { useReadinessExamPage } from '@/features/exercise/hooks/useReadinessExamPage'
import { AccessibleModal } from '@/shared/components/ui/AccessibleModal'
import { Button3D } from '@/shared/components/ui/Button3D'
import {
  LANGUAGES_QUERY_KEY,
  getLanguageEnrollmentsQueryKey,
} from '@/shared/constants/queryKeys'
import { ArrowLeft, ArrowRight, Certificate } from '@phosphor-icons/react'

const ReadinessExamContent = ({ levelId }: { levelId?: string }) => {
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false)
  const {
    questions,
    answersById,
    currentIndex,
    answeredCount,
    progressPercent,
    currentExercise,
    parsedContent,
    selectedTokenIndices,
    selectedTokens,
    selectedOptionValue,
    textInput,
    showHint,
    isSpeakingAudio,
    isRecordingSpeech,
    speechRecognitionSupported,
    audioPlaybackError,
    isFirstQuestion,
    isLastQuestion,
    allAnswered,
    examResult,
    submitError,
    isSubmitConfirmOpen,
    isLoading,
    isError,
    isRetryingQuestions,
    isAlreadyPassed,
    loadErrorMessage,
    isSubmitting,
    refetchQuestions,
    handleAddToken,
    handleRemoveToken,
    handleClearTokens,
    handleSelectOption,
    handleSetTextInput,
    handlePlayAudio,
    handleToggleRecording,
    handleToggleHint,
    handlePreviousQuestion,
    handleNextQuestion,
    handleJumpToQuestion,
    handleEnterShortcut,
    openSubmitConfirm,
    closeSubmitConfirm,
    handleSubmitExam,
    handleRetryExam,
    handleBackToCurriculum,
  } = useReadinessExamPage(levelId)

  if (isLoading) {
    return (
      <ExerciseSessionStatusView
        mode="loading"
        message="Menyiapkan soal ujian kesiapan level..."
        onExit={handleBackToCurriculum}
      />
    )
  }

  if (isAlreadyPassed) {
    return (
      <ExerciseSessionStatusView
        mode="status"
        emotion="celebrate"
        title="Ujian Kesiapan Sudah Lulus"
        message="Kamu sudah lulus ujian kesiapan untuk unit ini dan akses ke tingkat berikutnya sudah terbuka."
        primaryLabel="Kembali ke Kurikulum"
        primaryVariant="emerald"
        onPrimary={handleBackToCurriculum}
      />
    )
  }

  if (isError) {
    return (
      <ExerciseSessionStatusView
        mode="status"
        emotion="worried"
        title="Ujian Tidak Dapat Dibuka"
        message={loadErrorMessage ?? 'Terjadi kesalahan saat memuat soal ujian.'}
        primaryLabel="Kembali ke Kurikulum"
        onPrimary={handleBackToCurriculum}
        secondaryLabel="Coba Lagi"
        isSecondaryLoading={isRetryingQuestions}
        onSecondary={() => void refetchQuestions()}
      />
    )
  }

  if (examResult) {
    return (
      <ExamResultSummary
        result={examResult}
        onRetryExam={handleRetryExam}
        onBackToCurriculum={handleBackToCurriculum}
      />
    )
  }

  if (questions.length === 0) {
    return (
      <ExerciseSessionStatusView
        mode="status"
        emotion="thinking"
        title="Belum Ada Soal Ujian"
        message="Soal ujian kesiapan untuk level ini belum tersedia."
        primaryLabel="Kembali ke Kurikulum"
        onPrimary={handleBackToCurriculum}
      />
    )
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#FAFAF9] text-slate-900 font-sans overflow-hidden">
      <ExerciseSessionHeader
        onExit={() => (answeredCount > 0 ? setIsExitConfirmOpen(true) : handleBackToCurriculum())}
        exitAriaLabel="Keluar dari Ujian"
        exitDisabled={isSubmitting}
        progressPercent={progressPercent}
        progressFillClass="bg-amber-500"
        counterLabel={`${answeredCount}/${questions.length} terjawab`}
        rightSlot={
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-800 shrink-0">
            <Certificate weight="fill" className="w-4 h-4 text-amber-600" />
            Ujian Kesiapan
          </span>
        }
      />

      {/* Main Question Stage */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Quick Question Stepper */}
          <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap sm:overflow-visible items-center gap-1.5 pb-1 sm:pb-0">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex
              const isAnswered = (answersById[q.id] ?? '').length > 0
              return (
                <button
                  key={q.id}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleJumpToQuestion(idx)}
                  aria-label={`Soal ${idx + 1}${isAnswered ? ' (terjawab)' : ' (belum terjawab)'}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`shrink-0 min-w-[44px] min-h-[44px] px-2.5 rounded-xl text-xs font-extrabold border-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-600 border-blue-700 text-white shadow-xs'
                      : isAnswered
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>

          {currentExercise && parsedContent && (
            <ExercisePromptRenderer
              exercise={currentExercise}
              parsedContent={parsedContent}
              selectedTokenIndices={selectedTokenIndices}
              selectedTokens={selectedTokens}
              selectedOptionValue={selectedOptionValue}
              textInput={textInput}
              submittedResult={null}
              isSubmitting={isSubmitting}
              showHint={showHint}
              isCheckpoint={true}
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
          )}
        </div>
      </main>

      {/* Bottom Exam Navigation & Submit Bar */}
      <footer className="shrink-0 border-t-2 border-slate-200 bg-white px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {submitError && (
            <p className="text-xs sm:text-sm font-bold text-rose-600">{submitError}</p>
          )}

          <div className="flex items-center justify-between gap-3">
            <Button3D
              type="button"
              variant="white"
              size="md"
              disabled={isFirstQuestion || isSubmitting}
              onClick={handlePreviousQuestion}
              icon={<ArrowLeft weight="bold" className="w-4 h-4" />}
            >
              Sebelumnya
            </Button3D>

            <div className="flex items-center gap-3">
              {!isLastQuestion ? (
                <Button3D
                  type="button"
                  variant="blue"
                  size="md"
                  disabled={isSubmitting}
                  onClick={handleNextQuestion}
                  icon={<ArrowRight weight="bold" className="w-4 h-4" />}
                >
                  Selanjutnya
                </Button3D>
              ) : (
                <Button3D
                  type="button"
                  variant="emerald"
                  size="md"
                  disabled={!allAnswered || isSubmitting}
                  loading={isSubmitting}
                  onClick={openSubmitConfirm}
                >
                  {allAnswered
                    ? 'Kumpulkan Ujian'
                    : `Jawab Semua (${answeredCount}/${questions.length})`}
                </Button3D>
              )}
            </div>
          </div>
        </div>
      </footer>

      <AccessibleModal
        isOpen={isSubmitConfirmOpen}
        disableClose={isSubmitting}
        onClose={isSubmitting ? () => undefined : closeSubmitConfirm}
        ariaLabel="Konfirmasi Pengumpulan Ujian Kesiapan"
      >
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
          <div className="space-y-1.5">
            <h2 className="font-brand font-black text-lg text-slate-900">
              Kumpulkan Jawaban Ujian?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Seluruh {questions.length} soal sudah terjawab. Setelah dikumpulkan, jawaban akan
              langsung dinilai oleh sistem untuk kelulusan level ini.
            </p>
          </div>
          {submitError && (
            <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {submitError}
            </p>
          )}
          <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
            <Button3D
              type="button"
              variant="white"
              size="md"
              fullWidth
              disabled={isSubmitting}
              onClick={closeSubmitConfirm}
            >
              Periksa Lagi
            </Button3D>
            <Button3D
              type="button"
              variant="emerald"
              size="md"
              fullWidth
              loading={isSubmitting}
              loadingText="Menilai..."
              onClick={() => void handleSubmitExam()}
            >
              Ya, Kumpulkan
            </Button3D>
          </div>
        </div>
      </AccessibleModal>

      <AccessibleModal
        isOpen={isExitConfirmOpen}
        onClose={() => setIsExitConfirmOpen(false)}
        ariaLabel="Konfirmasi Keluar dari Ujian Kesiapan"
      >
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
          <div className="space-y-1.5">
            <h2 className="font-brand font-black text-lg text-slate-900">
              Keluar dari Ujian Kesiapan?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Semua {answeredCount} jawaban ujian yang sudah diisi akan hilang jika kamu keluar
              sekarang.
            </p>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
            <Button3D
              type="button"
              variant="blue"
              size="md"
              fullWidth
              onClick={() => setIsExitConfirmOpen(false)}
            >
              Lanjut Ujian
            </Button3D>
            <Button3D
              type="button"
              variant="rose"
              size="md"
              fullWidth
              onClick={() => {
                setIsExitConfirmOpen(false)
                handleBackToCurriculum()
              }}
            >
              Keluar &amp; Hapus Jawaban
            </Button3D>
          </div>
        </div>
      </AccessibleModal>
    </div>
  )
}

/**
 * Interactive Readiness Exam page supporting clean slug routes (/exam/:langCode/:levelCode, e.g. /exam/en-us/a1)
 * and backward-compatible UUID routes (/exam/:levelId), keyed per resolved levelId to reset session state cleanly.
 */
export const ReadinessExamPage = () => {
  const navigate = useNavigate()
  const userId = useAuthStore((state) => state.user?.id ?? 'anonymous')
  const { levelId: routeLevelId, langCode, levelCode } = useParams<{
    levelId?: string
    langCode?: string
    levelCode?: string
  }>()

  const normalizedLangCode = (langCode ?? '').trim().toLowerCase()
  const normalizedLevelCode = (levelCode ?? '').trim().toLowerCase()
  const isSlugRoute = Boolean(normalizedLangCode && normalizedLevelCode)

  const languagesQuery = useQuery({
    queryKey: LANGUAGES_QUERY_KEY,
    queryFn: ({ signal }) => languageService.listLanguages({ signal }),
    enabled: isSlugRoute,
    staleTime: 1000 * 60 * 10,
  })

  const matchedLanguage = useMemo(() => {
    if (!isSlugRoute) return null
    const list = languagesQuery.data ?? []
    return (
      list.find((lang) => lang.code.trim().toLowerCase() === normalizedLangCode) ??
      list.find((lang) => lang.id.trim().toLowerCase() === normalizedLangCode) ??
      null
    )
  }, [isSlugRoute, languagesQuery.data, normalizedLangCode])

  const languageDetailsQuery = useQuery({
    queryKey: ['language-details', matchedLanguage?.id ?? ''],
    queryFn: ({ signal }) => languageService.getLanguageDetails(matchedLanguage!.id, { signal }),
    enabled: isSlugRoute && Boolean(matchedLanguage?.id),
    staleTime: 1000 * 60 * 10,
  })

  const resolvedSlugLevelId = useMemo(() => {
    if (!isSlugRoute) return undefined
    const levels = languageDetailsQuery.data?.levels ?? []
    const matched = levels.find(
      (lvl) => lvl.code.trim().toLowerCase() === normalizedLevelCode
    )
    return matched?.id
  }, [isSlugRoute, languageDetailsQuery.data?.levels, normalizedLevelCode])

  // Canonicalize legacy UUID URLs (/exam/<uuid>) into clean /exam/:langCode/:levelCode when enrollment metadata matches
  const enrollmentsQuery = useQuery({
    queryKey: getLanguageEnrollmentsQueryKey(userId),
    queryFn: ({ signal }) => languageService.getUserEnrollments({ signal }),
    enabled: !isSlugRoute && Boolean(routeLevelId) && userId !== 'anonymous',
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (isSlugRoute || !routeLevelId) return
    const matchedEnrollment = (enrollmentsQuery.data ?? []).find(
      (enr) =>
        enr.current_level_id === routeLevelId || enr.current_level?.id === routeLevelId
    )
    const canonicalLang = matchedEnrollment?.language?.code?.trim().toLowerCase()
    const canonicalLevel = matchedEnrollment?.current_level?.code?.trim().toLowerCase()
    if (canonicalLang && canonicalLevel) {
      navigate(
        `/exam/${encodeURIComponent(canonicalLang)}/${encodeURIComponent(canonicalLevel)}`,
        { replace: true }
      )
    }
  }, [enrollmentsQuery.data, isSlugRoute, navigate, routeLevelId])

  if (
    isSlugRoute &&
    (languagesQuery.isLoading || (Boolean(matchedLanguage?.id) && languageDetailsQuery.isLoading))
  ) {
    return (
      <ExerciseSessionStatusView
        mode="loading"
        message="Menyiapkan soal ujian kesiapan level..."
      />
    )
  }

  const effectiveLevelId = isSlugRoute ? resolvedSlugLevelId : routeLevelId
  return <ReadinessExamContent key={effectiveLevelId ?? 'missing'} levelId={effectiveLevelId} />
}

