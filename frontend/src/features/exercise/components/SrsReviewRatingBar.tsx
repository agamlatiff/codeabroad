import type { SubmitExerciseAnswerResponse } from '@/features/exercise/types/exercise'
import { Button3D } from '@/shared/components/ui/Button3D'
import { CheckCircle, XCircle } from '@phosphor-icons/react'

interface SrsRatingOption {
  quality: number
  label: string
  hint: string
  variant: 'rose' | 'amber' | 'blue' | 'emerald'
}

const SRS_RATING_OPTIONS: SrsRatingOption[] = [
  { quality: 1, label: 'Lupa', hint: 'Ulangi 1 hari', variant: 'rose' },
  { quality: 3, label: 'Sulit', hint: 'Masih ragu', variant: 'amber' },
  { quality: 4, label: 'Bagus', hint: 'Ingat lancar', variant: 'blue' },
  { quality: 5, label: 'Sangat Mudah', hint: 'Ingat cepat', variant: 'emerald' },
]

interface SrsReviewRatingBarProps {
  submittedResult: SubmitExerciseAnswerResponse
  resolvedCorrectAnswer: string
  isSubmittingRating: boolean
  ratingError: string | null
  onRateQuality: (quality: number) => void
}

/**
 * Sticky bottom verification + SuperMemo SM-2 recall quality rating bar.
 */
export const SrsReviewRatingBar = ({
  submittedResult,
  resolvedCorrectAnswer,
  isSubmittingRating,
  ratingError,
  onRateQuality,
}: SrsReviewRatingBarProps) => {
  const isCorrect = submittedResult.is_correct

  return (
    <footer
      className={`shrink-0 border-t-2 px-4 sm:px-6 py-4 transition-colors ${
        isCorrect
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-rose-50 border-rose-200'
      }`}
    >
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="flex items-start gap-3">
          {isCorrect ? (
            <CheckCircle
              weight="fill"
              className="w-7 h-7 shrink-0 text-emerald-600 mt-0.5"
            />
          ) : (
            <XCircle
              weight="fill"
              className="w-7 h-7 shrink-0 text-rose-600 mt-0.5"
            />
          )}

          <div className="space-y-1 min-w-0">
            <p
              className={`text-sm sm:text-base font-brand font-extrabold ${
                isCorrect ? 'text-emerald-900' : 'text-rose-900'
              }`}
            >
              {isCorrect
                ? 'Tepat! Nilai seberapa mudah kamu mengingatnya:'
                : 'Belum tepat. Catat koreksi lalu pilih tingkat kesulitan:'}
            </p>

            {!isCorrect && resolvedCorrectAnswer && (
              <p className="text-xs sm:text-sm font-bold text-rose-800">
                Jawaban benar:{' '}
                <span className="underline">{resolvedCorrectAnswer}</span>
              </p>
            )}

            {submittedResult.diagnostic_feedback && (
              <p className="text-xs sm:text-sm font-semibold text-rose-800">
                {submittedResult.diagnostic_feedback}
              </p>
            )}

            {submittedResult.explanation && (
              <p
                className={`text-xs leading-relaxed ${
                  isCorrect ? 'text-emerald-800' : 'text-rose-700'
                }`}
              >
                {submittedResult.explanation}
              </p>
            )}
          </div>
        </div>

        {ratingError && (
          <p className="text-xs font-bold text-rose-600">{ratingError}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SRS_RATING_OPTIONS.map((option) => (
            <Button3D
              key={option.quality}
              type="button"
              variant={option.variant}
              size="sm"
              fullWidth
              disabled={isSubmittingRating}
              onClick={() => onRateQuality(option.quality)}
            >
              <span className="flex flex-col leading-tight">
                <span>{option.label}</span>
                <span className="text-[10px] font-medium opacity-85">
                  {option.hint}
                </span>
              </span>
            </Button3D>
          ))}
        </div>
      </div>
    </footer>
  )
}

