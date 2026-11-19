import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLearnWorkspace } from '@/features/exercise/hooks/useLearnWorkspace'
import { ExercisePromptRenderer } from '@/features/exercise/components/ExercisePromptRenderer'
import { ExerciseSessionHeader } from '@/features/exercise/components/ExerciseSessionHeader'
import { ExerciseSessionStatusView } from '@/features/exercise/components/ExerciseSessionStatusView'
import { LessonFeedbackFooter } from '@/features/exercise/components/LessonFeedbackFooter'
import { LessonGrammarDrawer } from '@/features/exercise/components/LessonGrammarDrawer'
import { LessonIntroView } from '@/features/exercise/components/LessonIntroView'
import { getLessonIntroDeck } from '@/features/exercise/constants/lessonIntroCards'
import { BookOpen, Sparkle, Translate } from '@phosphor-icons/react'

const LearnWorkspaceContent = ({ lessonId }: { lessonId?: string }) => {
  const [isIntroOpen, setIsIntroOpen] = useState<boolean | null>(null)
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
    handlePlayAudio,
    handleToggleRecording,
    handleCheckAnswer,
    handleContinue,
    handleRetryLesson,
    handleToggleHint,
    handleExitToCurriculum,
    handleEnterShortcut,
  } = useLearnWorkspace(lessonId)

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

  const introDeck = getLessonIntroDeck(lesson.slug)
  const showingIntro = Boolean(introDeck) && (isIntroOpen ?? currentIndex === 0)

  if (introDeck && showingIntro) {
    return (
      <LessonIntroView
        lessonTitle={lesson.title}
        xpReward={lesson.xp_reward}
        deck={introDeck}
        onExit={handleExitToCurriculum}
        onStartQuiz={() => setIsIntroOpen(false)}
      />
    )
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#FAFAF9] text-slate-900 font-sans overflow-hidden">
      <ExerciseSessionHeader
        onExit={handleExitToCurriculum}
        exitAriaLabel="Keluar ke Kurikulum"
        progressPercent={progressPercent}
        progressFillClass="bg-emerald-500"
        counterLabel={
          exercises.length > 0
            ? `${Math.min(currentIndex + 1, exercises.length)}/${exercises.length}`
            : '0/0'
        }
        rightSlot={
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-700">
              <Sparkle weight="fill" className="w-4 h-4 text-amber-500" />
              +{lesson.xp_reward} XP
            </span>

            {introDeck && (
              <button
                type="button"
                onClick={() => setIsIntroOpen(true)}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-extrabold text-emerald-700 transition-colors cursor-pointer"
              >
                <Translate weight="bold" className="w-4 h-4" />
                <span className="hidden sm:inline">Kenali Huruf</span>
              </button>
            )}

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
        }
      />

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

/**
 * Interactive language lesson player (/learn/:id), keyed per route param to reset state cleanly.
 */
export const LearnWorkspacePage = () => {
  const { id } = useParams<{ id: string }>()
  return <LearnWorkspaceContent key={id ?? 'missing'} lessonId={id} />
}
