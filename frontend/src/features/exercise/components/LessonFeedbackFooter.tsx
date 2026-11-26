import type { SubmitExerciseAnswerResponse } from '@/features/exercise/types/exercise'
import type { LessonIntroItem } from '@/features/exercise/constants/lessonIntroCards'
import { useActiveSpeechLocale } from '@/features/exercise/hooks/useActiveSpeechLocale'
import { Button3D } from '@/shared/components/ui/Button3D'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'
import {
  ArrowCounterClockwise,
  CheckCircle,
  Lightbulb,
  SpeakerHigh,
  Sparkle,
  XCircle,
} from '@phosphor-icons/react'

const JAPANESE_CHAR_REGEX = /[\u3040-\u30ff\u4e00-\u9faf]/

interface LessonFeedbackFooterProps {
  submittedResult: SubmitExerciseAnswerResponse | null
  resolvedCorrectAnswer?: string
  answerStudyItem?: LessonIntroItem | null
  submitError: string | null
  canCheckAnswer: boolean
  isChecking: boolean
  isCompleting: boolean
  isLastExercise: boolean
  canRetryLesson?: boolean
  onCheckAnswer: () => void
  onContinue: () => void
  onRetryLesson?: () => void
}

/**
 * Duolingo-style sticky bottom verification & diagnostic feedback footer.
 */
export const LessonFeedbackFooter = ({
  submittedResult,
  resolvedCorrectAnswer,
  answerStudyItem,
  submitError,
  canCheckAnswer,
  isChecking,
  isCompleting,
  isLastExercise,
  canRetryLesson = false,
  onCheckAnswer,
  onContinue,
  onRetryLesson,
}: LessonFeedbackFooterProps) => {
  const speechLocale = useActiveSpeechLocale()
  const isCorrect = submittedResult?.is_correct === true
  const isIncorrect = submittedResult?.is_correct === false
  const displayedCorrectAnswer =
    resolvedCorrectAnswer || submittedResult?.correct_answer || ''
  const speakCandidate =
    answerStudyItem?.speakText ||
    (JAPANESE_CHAR_REGEX.test(displayedCorrectAnswer) ? displayedCorrectAnswer : '')

  const handlePlayAnswerAudio = (rate?: number) => {
    if (!speakCandidate) return
    triggerHaptic('tap')
    audioService.stopSpeech()
    audioService.speakLanguage(speakCandidate, speechLocale, undefined, undefined, rate)
  }

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
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-rose-800">
                      Jawaban benar:{' '}
                      <span className="underline">{displayedCorrectAnswer}</span>
                    </p>
                    {speakCandidate && (
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handlePlayAnswerAudio()}
                          aria-label="Dengarkan pelafalan jawaban benar"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-rose-100 border border-rose-200 text-xs font-brand font-black text-rose-700 transition-colors cursor-pointer"
                        >
                          <SpeakerHigh weight="fill" className="w-3.5 h-3.5" />
                          Dengarkan
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePlayAnswerAudio(0.58)}
                          aria-label="Putar pelafalan jawaban benar pelan"
                          className="px-2 py-1 rounded-lg bg-white hover:bg-rose-100 border border-rose-200 text-[11px] font-brand font-black text-rose-600 transition-colors cursor-pointer"
                        >
                          0.6x
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {isIncorrect && answerStudyItem && (
                  <div className="mt-1 rounded-xl bg-white/90 border border-rose-200/90 px-3 py-2 flex items-start gap-2 text-xs text-rose-900">
                    <Lightbulb
                      weight="fill"
                      className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"
                    />
                    <p className="leading-relaxed font-medium">
                      <span className="font-black text-slate-900">
                        {answerStudyItem.symbol}
                      </span>{' '}
                      <span className="font-mono font-bold text-blue-700">
                        ({answerStudyItem.reading})
                      </span>
                      {' — '}
                      {answerStudyItem.mnemonic}
                    </p>
                  </div>
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
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              Pilih atau susun jawabanmu lalu tekan Periksa.
            </p>
          )}
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          {canRetryLesson && onRetryLesson ? (
            <Button3D
              type="button"
              variant="blue"
              size="md"
              fullWidth
              onClick={onRetryLesson}
              icon={<ArrowCounterClockwise weight="bold" className="w-4 h-4" />}
            >
              Ulangi Pelajaran
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

