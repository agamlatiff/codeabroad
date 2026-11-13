import type { SubmitExerciseAnswerResponse } from '@/features/exercise/types/exercise'
import { Button3D } from '@/shared/components/ui/Button3D'
import { CheckCircle, Sparkle, XCircle } from '@phosphor-icons/react'

interface LessonFeedbackFooterProps {
  submittedResult: SubmitExerciseAnswerResponse | null
  resolvedCorrectAnswer?: string
  submitError: string | null
  canCheckAnswer: boolean
  isChecking: boolean
  isCompleting: boolean
  isLastExercise: boolean
  hasExercises: boolean
  onCheckAnswer: () => void
  onContinue: () => void
}

/**
 * Duolingo-style sticky bottom verification & diagnostic feedback footer.
 */
export const LessonFeedbackFooter = ({
  submittedResult,
  resolvedCorrectAnswer,
  submitError,
  canCheckAnswer,
  isChecking,
  isCompleting,
  isLastExercise,
  hasExercises,
  onCheckAnswer,
  onContinue,
}: LessonFeedbackFooterProps) => {
  const isCorrect = submittedResult?.is_correct === true
  const isIncorrect = submittedResult?.is_correct === false
  const displayedCorrectAnswer =
    resolvedCorrectAnswer || submittedResult?.correct_answer || ''

  const containerStyle = isCorrect
    ? 'bg-emerald-50 border-emerald-200'
    : isIncorrect
      ? 'bg-rose-50 border-rose-200'
      : 'bg-white border-slate-200'

  return (
    <footer className={`shrink-0 border-t-2 px-4 sm:px-6 py-4 transition-colors ${containerStyle}`}>
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          {submitError && (
            <p className="text-sm font-bold text-rose-600">{submitError}</p>
          )}

          {submittedResult && (
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle
                  weight="fill"
                  className="w-8 h-8 shrink-0 text-emerald-600 mt-0.5"
                />
              ) : (
                <XCircle
                  weight="fill"
                  className="w-8 h-8 shrink-0 text-rose-600 mt-0.5"
                />
              )}

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={`text-base font-brand font-extrabold ${
                      isCorrect ? 'text-emerald-900' : 'text-rose-900'
                    }`}
                  >
                    {isCorrect ? 'Hebat! Jawaban Tepat' : 'Kurang Tepat, Periksa Penjelasan'}
                  </p>

                  {isCorrect && submittedResult.xp_earned > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 text-xs font-black">
                      <Sparkle weight="fill" className="w-3.5 h-3.5" />+
                      {submittedResult.xp_earned + submittedResult.streak_bonus} XP
                    </span>
                  )}
                </div>

                {isIncorrect && displayedCorrectAnswer && (
                  <p className="text-sm font-bold text-rose-800">
                    Jawaban benar:{' '}
                    <span className="underline">{displayedCorrectAnswer}</span>
                  </p>
                )}

                {submittedResult.diagnostic_feedback && (
                  <p className="text-sm font-semibold text-rose-800">
                    {submittedResult.diagnostic_feedback}
                  </p>
                )}

                {submittedResult.explanation && (
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isCorrect ? 'text-emerald-800' : 'text-rose-700'
                    }`}
                  >
                    {submittedResult.explanation}
                  </p>
                )}
              </div>
            </div>
          )}

          {!submittedResult && !submitError && (
            <p className="text-xs sm:text-sm font-semibold text-slate-400">
              {hasExercises
                ? 'Pilih atau susun jawabanmu lalu tekan Periksa.'
                : 'Siap menyelesaikan pelajaran ini.'}
            </p>
          )}
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          {!hasExercises ? (
            <Button3D
              type="button"
              variant="emerald"
              size="md"
              fullWidth
              loading={isCompleting}
              onClick={onContinue}
            >
              Selesaikan Pelajaran
            </Button3D>
          ) : submittedResult === null ? (
            <Button3D
              type="button"
              variant="blue"
              size="md"
              fullWidth
              disabled={!canCheckAnswer}
              loading={isChecking}
              onClick={onCheckAnswer}
            >
              Periksa Jawaban
            </Button3D>
          ) : (
            <Button3D
              type="button"
              variant={isCorrect ? 'emerald' : 'rose'}
              size="md"
              fullWidth
              loading={isCompleting}
              onClick={onContinue}
            >
              {isLastExercise ? 'Selesaikan Pelajaran' : 'Lanjutkan'}
            </Button3D>
          )}
        </div>
      </div>
    </footer>
  )
}

