import { ExercisePromptRenderer } from '@/features/exercise/components/ExercisePromptRenderer'
import { ExerciseSessionStatusView } from '@/features/exercise/components/ExerciseSessionStatusView'
import { SrsReviewRatingBar } from '@/features/exercise/components/SrsReviewRatingBar'
import { useSrsReviewPage } from '@/features/exercise/hooks/useSrsReviewPage'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { Brain, CheckCircle, X } from '@phosphor-icons/react'

/**
 * Interactive Spaced Repetition System (SM-2) review session page (/review).
 */
export const SrsReviewPage = () => {
  const {
    items,
    totalDue,
    currentIndex,
    reviewedCount,
    progressPercent,
    currentReviewItem,
    currentExercise,
    parsedContent,
    selectedTokenIndices,
    selectedTokens,
    selectedOptionValue,
    textInput,
    submittedResult,
    resolvedCorrectAnswer,
    actionError,
    showHint,
    isSpeakingAudio,
    isRecordingSpeech,
    speechRecognitionSupported,
    audioPlaybackError,
    canCheckAnswer,
    isLoading,
    isError,
    queueErrorMessage,
    isChecking,
    isSubmittingRating,
    isSessionFinished,
    hasMoreReviewsAfterBatch,
    refetchQueue,
    handleAddToken,
    handleRemoveToken,
    handleClearTokens,
    handleSelectOption,
    handleSetTextInput,
    handleConfirmSpokenSample,
    handlePlayAudio,
    handleToggleRecording,
    handleToggleHint,
    handleCheckAnswer,
    handleRateQuality,
    handleEnterShortcut,
    handleRestartQueue,
    handleBackToCurriculum,
  } = useSrsReviewPage()

  if (isLoading) {
    return (
      <ExerciseSessionStatusView
        mode="loading"
        message="Memuat antrean ulasan memori (SRS)..."
      />
    )
  }

  if (isError) {
    return (
      <ExerciseSessionStatusView
        mode="status"
        emotion="worried"
        title="Gagal Memuat Ulasan SRS"
        message={queueErrorMessage ?? 'Terjadi kesalahan saat memuat antrean ulasan SRS.'}
        primaryLabel="Kembali ke Kurikulum"
        onPrimary={handleBackToCurriculum}
        secondaryLabel="Coba Lagi"
        onSecondary={() => void refetchQueue()}
      />
    )
  }

  if (items.length === 0 || isSessionFinished) {
    const completedAll = isSessionFinished && reviewedCount > 0
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-md text-center space-y-5">
          <div className="flex justify-center">
            <KodiCharacter emotion="celebrate" size="lg" interactive={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <CheckCircle weight="fill" className="w-4 h-4" />
            {completedAll ? 'Sesi Ulasan Selesai' : 'Antrean Kosong'}
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-brand font-extrabold text-slate-900">
              {completedAll
                ? `${reviewedCount} Kartu Berhasil Diulas!`
                : 'Semua Materi Sudah Segar!'}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {completedAll
                ? 'Jadwal pengulangan SM-2 kamu telah diperbarui untuk memperkuat ingatan jangka panjang.'
                : 'Saat ini belum ada kartu latihan yang jatuh tempo untuk diulas kembali.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button3D
              type="button"
              variant="emerald"
              size="md"
              fullWidth
              onClick={handleBackToCurriculum}
            >
              Lanjut Belajar Kurikulum
            </Button3D>
            {completedAll && hasMoreReviewsAfterBatch && (
              <Button3D
                type="button"
                variant="white"
                size="md"
                fullWidth
                onClick={() => void handleRestartQueue()}
              >
                Ulas Batch Berikutnya
              </Button3D>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#FAFAF9] text-slate-900 font-sans overflow-hidden">
      {/* Top SRS Session Progress */}
      <header className="shrink-0 bg-white border-b-2 border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBackToCurriculum}
          aria-label="Kembali ke Kurikulum"
          className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X weight="bold" className="w-6 h-6" />
        </button>

        <div className="flex-1 max-w-2xl flex items-center gap-3">
          <div className="flex-1 h-4 rounded-full bg-slate-200 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${Math.max(6, progressPercent)}%` }}
            />
          </div>
          <span className="text-xs font-extrabold text-slate-500 tabular-nums shrink-0">
            {currentIndex + 1}/{items.length}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-extrabold text-blue-700">
            <Brain weight="fill" className="w-4 h-4 text-blue-600" />
            {totalDue} Jatuh Tempo
          </span>
        </div>
      </header>

      {/* Active Flashcard / Exercise Stage */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {currentReviewItem && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-500">
              <span>Ulasan Pengingat Memori (SM-2)</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[11px] text-slate-600">
                Rep {currentReviewItem.repetition_count} • Interval{' '}
                {currentReviewItem.interval_days}h • Ease{' '}
                {currentReviewItem.ease_factor.toFixed(2)}
              </span>
            </div>
          )}

          {currentExercise && parsedContent && (
            <ExercisePromptRenderer
              exercise={currentExercise}
              parsedContent={parsedContent}
              selectedTokenIndices={selectedTokenIndices}
              selectedTokens={selectedTokens}
              selectedOptionValue={selectedOptionValue}
              textInput={textInput}
              submittedResult={submittedResult}
              showHint={showHint}
              isSpeakingAudio={isSpeakingAudio}
              isRecordingSpeech={isRecordingSpeech}
              speechRecognitionSupported={speechRecognitionSupported}
              audioPlaybackError={audioPlaybackError}
              onAddToken={handleAddToken}
              onRemoveToken={handleRemoveToken}
              onClearTokens={handleClearTokens}
              onSelectOption={handleSelectOption}
              onSetTextInput={handleSetTextInput}
              onConfirmSpokenSample={handleConfirmSpokenSample}
              onPlayAudio={handlePlayAudio}
              onToggleRecording={handleToggleRecording}
              onToggleHint={handleToggleHint}
              onEnterKey={handleEnterShortcut}
            />
          )}
        </div>
      </main>

      {/* Bottom Action or SM-2 Rating Footer */}
      {submittedResult ? (
        <SrsReviewRatingBar
          submittedResult={submittedResult}
          resolvedCorrectAnswer={resolvedCorrectAnswer}
          isSubmittingRating={isSubmittingRating}
          ratingError={actionError}
          onRateQuality={(quality) => void handleRateQuality(quality)}
        />
      ) : (
        <footer className="shrink-0 border-t-2 border-slate-200 bg-white px-4 sm:px-6 py-4">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              {actionError ? (
                <p className="text-sm font-bold text-rose-600">{actionError}</p>
              ) : (
                <p className="text-xs sm:text-sm font-semibold text-slate-400">
                  Jawab terlebih dahulu sebelum menilai tingkat kesulitan memori.
                </p>
              )}
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              <Button3D
                type="button"
                variant="blue"
                size="md"
                fullWidth
                disabled={!canCheckAnswer}
                loading={isChecking}
                onClick={() => void handleCheckAnswer()}
              >
                Periksa Jawaban
              </Button3D>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

