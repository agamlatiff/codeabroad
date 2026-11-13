import { useLearnWorkspace } from '@/features/exercise/hooks/useLearnWorkspace'
import { ExercisePromptRenderer } from '@/features/exercise/components/ExercisePromptRenderer'
import { ExerciseSessionStatusView } from '@/features/exercise/components/ExerciseSessionStatusView'
import { LessonFeedbackFooter } from '@/features/exercise/components/LessonFeedbackFooter'
import { LessonGrammarDrawer } from '@/features/exercise/components/LessonGrammarDrawer'
import { BookOpen, Sparkle, X } from '@phosphor-icons/react'

/**
 * Interactive language lesson player (/learn/:id), purely declarative UI driven by useLearnWorkspace.
 */
export const LearnWorkspacePage = () => {
  const {
    lesson,
    exercises,
    currentExercise,
    parsedContent,
    currentIndex,
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
    isSpeakingAudio,
    isRecordingSpeech,
    speechRecognitionSupported,
    audioPlaybackError,
    canCheckAnswer,
    isLastExercise,
    isLoading,
    isError,
    lessonErrorMessage,
    isChecking,
    isCompleting,
    refetchLesson,
    handleAddToken,
    handleRemoveToken,
    handleClearTokens,
    handleSelectOption,
    handleSetTextInput,
    handleConfirmSpokenSample,
    handlePlayAudio,
    handleToggleRecording,
    handleCheckAnswer,
    handleContinue,
    handleRetryLesson,
    handleToggleHint,
    handleExitToCurriculum,
    handleEnterShortcut,
  } = useLearnWorkspace()

  if (isLoading) {
    return (
      <ExerciseSessionStatusView
        mode="loading"
        message="Menyiapkan materi pelajaran..."
      />
    )
  }

  if (isError || !lesson) {
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

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#FAFAF9] text-slate-900 font-sans overflow-hidden">
      {/* Top Progress & Lesson Controls */}
      <header className="shrink-0 bg-white border-b-2 border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleExitToCurriculum}
          aria-label="Keluar ke Kurikulum"
          className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X weight="bold" className="w-6 h-6" />
        </button>

        {/* Step Progress Bar */}
        <div className="flex-1 max-w-2xl flex items-center gap-3">
          <div className="flex-1 h-4 rounded-full bg-slate-200 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${Math.max(6, progressPercent)}%` }}
            />
          </div>
          <span className="text-xs font-extrabold text-slate-500 tabular-nums shrink-0">
            {exercises.length > 0
              ? `${Math.min(currentIndex + 1, exercises.length)}/${exercises.length}`
              : '0/0'}
          </span>
        </div>

        {/* Lesson XP Reward & Grammar Reference Button */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-700">
            <Sparkle weight="fill" className="w-4 h-4 text-amber-500" />
            +{lesson.xp_reward} XP
          </span>

          {lesson.grammar_points.length > 0 && (
            <button
              type="button"
              onClick={() => setIsGrammarDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-extrabold text-blue-700 transition-colors cursor-pointer"
            >
              <BookOpen weight="bold" className="w-4 h-4" />
              <span className="hidden sm:inline">Tata Bahasa</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Interactive Exercise Stage */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {lesson.title}
          </p>

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
        </div>
      </main>

      {/* Sticky Bottom Verification & Feedback Footer */}
      <LessonFeedbackFooter
        submittedResult={submittedResult}
        resolvedCorrectAnswer={resolvedCorrectAnswer}
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

      {/* Grammar Reference Drawer */}
      <LessonGrammarDrawer
        isOpen={isGrammarDrawerOpen}
        grammarPoints={lesson.grammar_points}
        onClose={() => setIsGrammarDrawerOpen(false)}
      />
    </div>
  )
}
