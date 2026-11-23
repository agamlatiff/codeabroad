import { useState, type FC } from 'react'
import {
  ArrowsClockwise,
  CheckCircle,
  Sparkle,
  Target,
  XCircle,
} from '@phosphor-icons/react'
import type { GrammarMiniQuizItem } from '@/features/curriculum/types/curriculum'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { triggerHaptic } from '@/shared/utils/haptics'

export interface GrammarMiniQuizCardProps {
  questions: GrammarMiniQuizItem[]
  isAlreadyUnderstood?: boolean
  nextReviewAt?: string | null
  isSubmitting?: boolean
  submitError?: string | null
  onSubmitResult: (correctCount: number, totalQuestions: number) => void
  onRetrySubmit?: (correctCount: number, totalQuestions: number) => void
}

function formatReviewHint(iso?: string | null): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Interactive 3-question comprehension check right inside GrammarDetailPage.
 * Passing 3/3 marks the grammar point as "Paham ✓" and schedules spaced-repetition review.
 */
export const GrammarMiniQuizCard: FC<GrammarMiniQuizCardProps> = ({
  questions,
  isAlreadyUnderstood = false,
  nextReviewAt,
  isSubmitting = false,
  submitError = null,
  onSubmitResult,
  onRetrySubmit,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [submittedThisRound, setSubmittedThisRound] = useState(false)

  if (!questions || questions.length === 0) {
    return null
  }

  const total = questions.length
  const answeredCount = Object.keys(selectedAnswers).length
  const allAnswered = answeredCount === total
  const correctCount = questions.reduce(
    (acc, q, idx) => (selectedAnswers[idx] === q.answer ? acc + 1 : acc),
    0
  )
  const passedThisRound = allAnswered && correctCount === total

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (qIdx in selectedAnswers) return
    const next = { ...selectedAnswers, [qIdx]: optIdx }
    const isRight = optIdx === questions[qIdx].answer
    triggerHaptic(isRight ? 'success' : 'error')
    setSelectedAnswers(next)

    if (Object.keys(next).length === total && !submittedThisRound) {
      const roundScore = questions.reduce(
        (acc, q, idx) => (next[idx] === q.answer ? acc + 1 : acc),
        0
      )
      setSubmittedThisRound(true)
      onSubmitResult(roundScore, total)
    }
  }

  const handleResetQuiz = () => {
    triggerHaptic('tap')
    setSelectedAnswers({})
    setSubmittedThisRound(false)
  }

  const reviewLabel = formatReviewHint(nextReviewAt)

  return (
    <section
      id="grammar-mini-quiz"
      className={`rounded-3xl border-2 p-6 sm:p-8 space-y-5 shadow-[0_6px_0_0_#E2E8F0] transition-colors ${
        (passedThisRound && !submitError) || isAlreadyUnderstood
          ? 'bg-gradient-to-br from-emerald-50/60 via-white to-white border-emerald-200/90'
          : 'bg-white border-slate-200/90'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-brand font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Target weight="fill" className="w-3.5 h-3.5" />
              Cek Pemahaman ({answeredCount}/{total})
            </span>
            {isAlreadyUnderstood && (
              <span className="inline-flex items-center gap-1 text-[11px] font-brand font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle weight="fill" className="w-3.5 h-3.5 text-emerald-600" />
                Paham ✓{reviewLabel ? ` • Review ${reviewLabel}` : ''}
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-brand font-black text-slate-900">
            Pastikan Kamu Benar-Benar Paham
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Jawab 3 pertanyaan singkat ini. Benar semua untuk menandai materi ini selesai & masuk jadwal review!
          </p>
        </div>
      </div>

      {/* Question list */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const picked = selectedAnswers[qIdx]
          const isAnswered = typeof picked === 'number'
          const isCorrect = isAnswered && picked === q.answer

          return (
            <div
              key={`quiz-q-${qIdx}`}
              className="rounded-2xl bg-slate-50/80 border-2 border-slate-200/80 p-4 sm:p-5 space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-black text-slate-600 shrink-0">
                  Q{qIdx + 1}
                </span>
                <p className="text-sm sm:text-base font-brand font-bold text-slate-900 leading-snug">
                  {q.question}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = picked === optIdx
                  const isActualAnswer = q.answer === optIdx

                  let btnClass =
                    'bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/40'
                  if (isAnswered) {
                    if (isActualAnswer) {
                      btnClass =
                        'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-200'
                    } else if (isSelected && !isActualAnswer) {
                      btnClass = 'bg-rose-50 border-rose-400 text-rose-900'
                    } else {
                      btnClass = 'bg-white/60 border-slate-200 text-slate-400'
                    }
                  }

                  return (
                    <button
                      key={`q${qIdx}-opt${optIdx}`}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`text-left px-3.5 py-2.5 rounded-xl border-2 font-brand font-bold text-xs sm:text-sm transition-all flex items-center justify-between gap-2 ${
                        isAnswered ? 'cursor-default' : 'cursor-pointer active:translate-y-0.5'
                      } ${btnClass}`}
                    >
                      <span className="break-words">{opt}</span>
                      {isAnswered && isActualAnswer && (
                        <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isActualAnswer && (
                        <XCircle weight="fill" className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              {isAnswered && (
                <div
                  className={`rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] font-medium leading-relaxed border ${
                    isCorrect
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50/90 border-amber-200 text-amber-950'
                  }`}
                >
                  <span className="font-brand font-black mr-1.5">
                    {isCorrect ? 'Benar!' : 'Kurang tepat:'}
                  </span>
                  {q.why}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary Banner after finishing all 3 questions */}
      {allAnswered && (
        <div
          className={`rounded-2xl border-2 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            submitError
              ? 'bg-rose-50/90 border-rose-300'
              : passedThisRound
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-amber-50/90 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <KodiCharacter
              emotion={submitError ? 'worried' : passedThisRound ? 'cheering' : 'curious'}
              size={60}
              interactive={false}
              className="shrink-0"
            />
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5 font-brand font-black text-sm sm:text-base text-slate-900">
                {submitError ? (
                  <span className="text-rose-800">
                    Hasil kuis belum tersimpan ({correctCount}/{total})
                  </span>
                ) : passedThisRound ? (
                  <>
                    <Sparkle weight="fill" className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Paham ✓ • Masuk Review SRS ({correctCount}/{total})</span>
                  </>
                ) : (
                  <span>
                    Skor kamu {correctCount}/{total} — baca lagi contohnya & coba ulangi!
                  </span>
                )}
              </div>
              <p className={`text-xs font-medium ${submitError ? 'text-rose-700 font-bold' : 'text-slate-600'}`}>
                {submitError
                  ? submitError
                  : isSubmitting
                    ? 'Menyimpan progres ke server...'
                    : passedThisRound
                      ? 'Mantap! Pola ini sudah ditandai selesai di daftar materi.'
                      : 'Jawab benar 3/3 untuk menandai materi ini sebagai Paham ✓.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {submitError && (
              <Button3D
                variant="rose"
                size="sm"
                disabled={isSubmitting}
                onClick={() => (onRetrySubmit ?? onSubmitResult)(correctCount, total)}
              >
                {isSubmitting ? 'Menyimpan...' : 'Coba Simpan Lagi'}
              </Button3D>
            )}
            <Button3D
              variant={submitError ? 'white' : passedThisRound ? 'white' : 'amber'}
              size="sm"
              icon={<ArrowsClockwise weight="bold" className="w-4 h-4" />}
              onClick={handleResetQuiz}
              className="shrink-0"
            >
              Ulangi Kuis
            </Button3D>
          </div>
        </div>
      )}
    </section>
  )
}
