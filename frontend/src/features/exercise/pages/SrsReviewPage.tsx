import { useEffect, useState } from 'react'
import { useSrsReviewPage } from '@/features/exercise/hooks/useSrsReviewPage'
import { ExercisePromptRenderer } from '@/features/exercise/components/ExercisePromptRenderer'
import { ExerciseSessionHeader } from '@/features/exercise/components/ExerciseSessionHeader'
import { ExerciseSessionStatusView } from '@/features/exercise/components/ExerciseSessionStatusView'
import { LessonFeedbackFooter } from '@/features/exercise/components/LessonFeedbackFooter'
import { AccessibleModal } from '@/shared/components/ui/AccessibleModal'
import { Button3D } from '@/shared/components/ui/Button3D'
import { useAudioStore } from '@/shared/store/audioStore'
import { ArrowsClockwise, Brain } from '@phosphor-icons/react'

/**
 * Interactive cross-unit adaptive Mistake Review session (/review).
 */
export const SrsReviewPage = () => {
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false)
  const {
    initialCount,
    queueLength,
    currentIndex,
    currentExercise,
    parsedContent,
    isRetryItem,
    progressPercent,
    resolvedCorrectAnswer,
    selectedTokenIndices,
    selectedTokens,
    selectedOptionValue,
    textInput,
    submittedResult,
    submitError,
    showHint,
    isCompleted,
    reviewedCount,
    firstTryCorrectCount,
    isSpeakingAudio,
    isRecordingSpeech,
    speechRecognitionSupported,
    audioPlaybackError,
    canCheckAnswer,
    isLastExercise,
    isLoading,
    isError,
    isRetryingDue,
    loadErrorMessage,
    isChecking,
    isSyncingReview,
    refetchDue,
    handleAddToken,
    handleRemoveToken,
    handleClearTokens,
    handleSelectOption,
    handleSetTextInput,
    handlePlayAudio,
    handleToggleRecording,
    handleCheckAnswer,
    handleContinue,
    handleToggleHint,
    handleExitToCurriculum,
    handleEnterShortcut,
    navigateToFlashcards,
  } = useSrsReviewPage()

  const hasAutoPlayableQuestionAudio = Boolean(
    parsedContent?.audioUrl || parsedContent?.audioText || parsedContent?.displayText
  )

  useEffect(() => {
    if (
      isCompleted ||
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
    currentExercise,
    handlePlayAudio,
    hasAutoPlayableQuestionAudio,
    isCompleted,
    submittedResult,
  ])

  if (isLoading) {
    return (
      <ExerciseSessionStatusView
        mode="loading"
        message="Menyiapkan soal kesalahan yang perlu diulas..."
        onExit={handleExitToCurriculum}
      />
    )
  }

  if (isError) {
    return (
      <ExerciseSessionStatusView
        mode="status"
        emotion="worried"
        title="Gagal Memuat Ulasan Soal"
        message={loadErrorMessage ?? 'Terjadi kesalahan saat mengambil daftar ulasan soal.'}
        primaryLabel="Kembali ke Peta Belajar"
        onPrimary={handleExitToCurriculum}
        secondaryLabel="Coba Lagi"
        isSecondaryLoading={isRetryingDue}
        onSecondary={() => void refetchDue()}
      />
    )
  }

  if (isCompleted) {
    return (
      <ExerciseSessionStatusView
        mode="status"
        emotion="celebrate"
        title="Sesi Ulasan Kesalahan Tuntas!"
        message={`Kamu baru mengulas ${reviewedCount || initialCount} soal dengan ${firstTryCorrectCount} tepat langsung pada percobaan pertama. Jadwal ulasan berikutnya sudah diperbarui.`}
        primaryLabel="Kembali ke Peta Belajar"
        primaryVariant="emerald"
        onPrimary={handleExitToCurriculum}
        secondaryLabel="Lanjut ke Flashcard"
        onSecondary={navigateToFlashcards}
      />
    )
  }

  if (queueLength === 0 || !currentExercise || !parsedContent) {
    return (
      <ExerciseSessionStatusView
        mode="status"
        emotion="celebrate"
        title="Semua Soal Terkendali!"
        message="Saat ini belum ada soal salah yang perlu diulas. Terus lanjutkan pelajaran di peta belajar atau asah hafalan lewat Flashcard."
        primaryLabel="Kembali ke Peta Belajar"
        primaryVariant="blue"
        onPrimary={handleExitToCurriculum}
        secondaryLabel="Buka Flashcard"
        onSecondary={navigateToFlashcards}
      />
    )
  }

  const hasReviewProgress =
    !isCompleted && queueLength > 0 && (currentIndex > 0 || submittedResult !== null)

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#FAFAF9] text-slate-900 font-sans overflow-hidden">
      <ExerciseSessionHeader
        onExit={() => (hasReviewProgress ? setIsExitConfirmOpen(true) : handleExitToCurriculum())}
        exitAriaLabel="Keluar ke Peta Belajar"
        exitDisabled={isChecking || isSyncingReview}
        progressPercent={progressPercent}
        progressFillClass={isRetryItem ? 'bg-amber-500' : 'bg-blue-600'}
        counterLabel={`${Math.min(currentIndex + 1, queueLength)}/${queueLength}`}
        rightSlot={
          <div className="flex items-center gap-2 shrink-0">
            {isRetryItem ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-[11px] font-black text-amber-800">
                <ArrowsClockwise weight="bold" className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-black text-blue-700">
                <Brain weight="fill" className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Ulasan Soal</span>
                <span className="sm:hidden">Ulasan</span>
              </span>
            )}
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Latih Ulang Soal yang Pernah Salah
          </p>

          <ExercisePromptRenderer
            exercise={currentExercise}
            parsedContent={parsedContent}
            selectedTokenIndices={selectedTokenIndices}
            selectedTokens={selectedTokens}
            selectedOptionValue={selectedOptionValue}
            textInput={textInput}
            submittedResult={submittedResult}
            isSubmitting={isChecking}
            showHint={showHint}
            isCheckpoint={false}
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
        </div>
      </main>

      <LessonFeedbackFooter
        submittedResult={submittedResult}
        resolvedCorrectAnswer={resolvedCorrectAnswer}
        submitError={submitError}
        canCheckAnswer={canCheckAnswer}
        isChecking={isChecking}
        isCompleting={isSyncingReview}
        isLastExercise={isLastExercise}
        completeLabel="Selesaikan Ulasan"
        onCheckAnswer={() => void handleCheckAnswer()}
        onContinue={handleContinue}
      />

      <AccessibleModal
        isOpen={isExitConfirmOpen}
        onClose={() => setIsExitConfirmOpen(false)}
        ariaLabel="Konfirmasi Keluar dari Sesi Ulasan"
      >
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
          <div className="space-y-1.5">
            <h2 className="font-brand font-black text-lg text-slate-900">
              Jeda Sesi Ulasan?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sebanyak {reviewedCount} soal yang sudah diperiksa telah tersimpan ke jadwal ulasanmu.
              Sisa soal lainnya tetap tersimpan di daftar ulasanmu.
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
              Kembali ke Peta
            </Button3D>
            <Button3D
              type="button"
              variant="blue"
              size="md"
              fullWidth
              onClick={() => setIsExitConfirmOpen(false)}
            >
              Lanjut Ulasan
            </Button3D>
          </div>
        </div>
      </AccessibleModal>
    </div>
  )
}
export default SrsReviewPage
