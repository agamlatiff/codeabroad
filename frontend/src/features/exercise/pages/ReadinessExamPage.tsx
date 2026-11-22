import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ExamResultSummary } from '@/features/exercise/components/ExamResultSummary'
import { ExercisePromptRenderer } from '@/features/exercise/components/ExercisePromptRenderer'
import { ExerciseSessionHeader } from '@/features/exercise/components/ExerciseSessionHeader'
import { ExerciseSessionStatusView } from '@/features/exercise/components/ExerciseSessionStatusView'
import { useReadinessExamPage } from '@/features/exercise/hooks/useReadinessExamPage'
import { AccessibleModal } from '@/shared/components/ui/AccessibleModal'
import { Button3D } from '@/shared/components/ui/Button3D'
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
      />
    )
  }

  if (isAlreadyPassed) {
    return (
      <ExerciseSessionStatusView
        mode="status"
        emotion="celebrate"
        title="Ujian Kesiapan Sudah Lulus"
        message="Kamu sudah lulus evaluasi kesiapan untuk unit ini dan akses ke tingkat berikutnya sudah terbuka."
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
        message="Soal evaluasi kesiapan untuk level ini belum tersedia."
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
          <div className="flex flex-wrap items-center gap-1.5">
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
                  className={`min-w-[44px] min-h-[44px] px-2.5 rounded-xl text-xs font-extrabold border-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
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
        onClose={closeSubmitConfirm}
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
 * Interactive Readiness Exam page (/exam/:levelId), keyed per levelId to reset session state cleanly.
 */
export const ReadinessExamPage = () => {
  const { levelId } = useParams<{ levelId: string }>()
  return <ReadinessExamContent key={levelId ?? 'missing'} levelId={levelId} />
}

