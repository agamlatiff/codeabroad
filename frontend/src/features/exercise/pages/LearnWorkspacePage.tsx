import { useLearnWorkspace } from '@/features/exercise/hooks/useLearnWorkspace'
import { ExercisePromptRenderer } from '@/features/exercise/components/ExercisePromptRenderer'
import { LessonFeedbackFooter } from '@/features/exercise/components/LessonFeedbackFooter'
import { LessonGrammarDrawer } from '@/features/exercise/components/LessonGrammarDrawer'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
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
    handleToggleHint,
    handleExitToCurriculum,
    handleEnterShortcut,
  } = useLearnWorkspace()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-6 gap-4 font-sans">
        <KodiCharacter emotion="thinking" size="md" interactive={false} />
        <p className="text-sm font-bold text-slate-600">
          Menyiapkan materi pelajaran...
        </p>
      </div>
    )
  }

  if (isError || !lesson) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm text-center space-y-4">
          <KodiCharacter emotion="worried" size="md" interactive={false} />
          <div className="space-y-1.5">
            <h1 className="text-xl font-brand font-extrabold text-slate-900">
              Pelajaran Tidak Dapat Dibuka
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {lessonErrorMessage ||
                'Pelajaran tidak ditemukan atau masih terkunci.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button3D
              type="button"
              variant="blue"
              size="md"
              fullWidth
              onClick={handleExitToCurriculum}
            >
              Kembali ke Kurikulum
            </Button3D>
            <Button3D
              type="button"
              variant="white"
              size="md"
              fullWidth
              onClick={() => void refetchLesson()}
            >
              Coba Lagi
            </Button3D>
          </div>
        </div>
      </div>
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

          {currentExercise && parsedContent ? (
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
          ) : (
            <div className="p-8 rounded-3xl bg-white border-2 border-slate-200 text-center space-y-3">
              <KodiCharacter emotion="happy" size="md" interactive={false} />
              <p className="text-base font-bold text-slate-700">
                Belum ada soal latihan di pelajaran ini. Kamu dapat langsung
                menyelesaikannya.
              </p>
            </div>
          )}
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
        hasExercises={exercises.length > 0}
        onCheckAnswer={() => void handleCheckAnswer()}
        onContinue={handleContinue}
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
