import { ExamResultSummary } from '@/features/exercise/components/ExamResultSummary'
import { ExercisePromptRenderer } from '@/features/exercise/components/ExercisePromptRenderer'
import { ExerciseSessionStatusView } from '@/features/exercise/components/ExerciseSessionStatusView'
import { useReadinessExamPage } from '@/features/exercise/hooks/useReadinessExamPage'
import { Button3D } from '@/shared/components/ui/Button3D'
import { ArrowLeft, ArrowRight, Certificate, X } from '@phosphor-icons/react'

/**
 * Interactive 4-pillar Readiness Exam page (/exam/:levelId).
 */
export const ReadinessExamPage = () => {
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
    handleSubmitExam,
    handleRetryExam,
    handleBackToCurriculum,
  } = useReadinessExamPage()

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
      {/* Top Exam Bar */}
      <header className="shrink-0 bg-white border-b-2 border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBackToCurriculum}
          aria-label="Keluar dari Ujian"
          className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X weight="bold" className="w-6 h-6" />
        </button>

        <div className="flex-1 max-w-2xl flex items-center gap-3">
          <div className="flex-1 h-4 rounded-full bg-slate-200 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{ width: `${Math.max(6, progressPercent)}%` }}
            />
          </div>
          <span className="text-xs font-extrabold text-slate-500 tabular-nums shrink-0">
            {answeredCount}/{questions.length} terjawab
          </span>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-800 shrink-0">
          <Certificate weight="fill" className="w-4 h-4 text-amber-600" />
          Ujian Kesiapan
        </span>
      </header>

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
                  onClick={() => handleJumpToQuestion(idx)}
                  className={`min-w-[36px] h-9 px-2.5 rounded-xl text-xs font-extrabold border-2 transition-all cursor-pointer ${
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
                  disabled={!allAnswered}
                  loading={isSubmitting}
                  onClick={() => void handleSubmitExam()}
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
    </div>
  )
}

