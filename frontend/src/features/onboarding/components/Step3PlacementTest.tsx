import { useState } from 'react'
import { CheckCircle, ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import type { PlacementQuestionItem, PlacementQuestionOption } from '@/features/onboarding/types/onboarding'
import { triggerHaptic } from '@/shared/utils/haptics'
import { Button3D } from '@/shared/components/ui/Button3D'

interface Step3PlacementTestProps {
  questions: PlacementQuestionItem[]
  isLoading: boolean
  answers: Record<string, string>
  onAnswerChange: (exerciseId: string, answer: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}

const getOptionValue = (opt: string | PlacementQuestionOption): string => {
  if (typeof opt === 'string') return opt
  return opt.id || opt.text || opt.label || ''
}

const getOptionLabel = (opt: string | PlacementQuestionOption): string => {
  if (typeof opt === 'string') return opt
  return opt.text || opt.label || opt.id || ''
}

export const Step3PlacementTest = ({
  questions,
  isLoading,
  answers,
  onAnswerChange,
  onSubmit,
  isSubmitting,
}: Step3PlacementTestProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xs">
        <p className="text-sm font-semibold text-slate-600">Menyiapkan soal tes penempatan...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xs space-y-4">
        <p className="text-sm font-semibold text-slate-700">
          Soal tes penempatan belum tersedia untuk bahasa ini. Kamu dapat langsung memulai dari level awal.
        </p>
        <Button3D variant="blue" size="md" onClick={onSubmit} disabled={isSubmitting}>
          Lanjutkan &amp; Terbitkan Tiket
        </Button3D>
      </div>
    )
  }

  const safeIndex = Math.min(currentIndex, questions.length - 1)
  const currentQuestion = questions[safeIndex]
  const currentAnswer = answers[currentQuestion.id] ?? ''
  const options = currentQuestion.content?.options ?? []
  const answeredCount = questions.filter((q) => Boolean((answers[q.id] ?? '').trim())).length
  const progressPercent = Math.round(((safeIndex + 1) / questions.length) * 100)

  return (
    <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>
            Soal {safeIndex + 1} dari {questions.length}
          </span>
          <span>
            Terjawab {answeredCount}/{questions.length}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2563EB] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Prompt */}
      <div className="space-y-2">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-[10px] font-extrabold uppercase tracking-wider">
          {currentQuestion.skill_pillar}
        </span>
        <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{currentQuestion.prompt}</h3>
        {(currentQuestion.content?.question || currentQuestion.content?.sentence) && (
          <p className="text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3">
            {currentQuestion.content.question || currentQuestion.content.sentence}
          </p>
        )}
      </div>

      {/* Options or Text Input */}
      {options.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt, idx) => {
            const val = getOptionValue(opt)
            const label = getOptionLabel(opt)
            const isSelected = currentAnswer === val
            return (
              <button
                key={`${currentQuestion.id}-${idx}-${val}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  triggerHaptic('tap')
                  onAnswerChange(currentQuestion.id, val)
                }}
                className={`rounded-2xl px-4 py-3.5 text-left text-sm font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-blue-50 border-2 border-[#2563EB] text-[#2563EB]'
                    : 'bg-white border border-slate-200 text-slate-800 hover:border-blue-300'
                }`}
              >
                <span>{label}</span>
                {isSelected && <CheckCircle weight="fill" className="w-4 h-4 text-[#2563EB] shrink-0" />}
              </button>
            )
          })}
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => onAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="Ketik jawabanmu di sini..."
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563EB]"
          />
        </div>
      )}

      {/* Navigation between placement questions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={safeIndex === 0}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
          <span>Soal Sebelumnya</span>
        </button>

        {safeIndex < questions.length - 1 ? (
          <Button3D
            variant="blue"
            size="sm"
            onClick={() => {
              triggerHaptic('tap')
              setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
            }}
            icon={<ArrowRight weight="bold" className="w-3.5 h-3.5" />}
          >
            Soal Berikutnya
          </Button3D>
        ) : (
          <Button3D
            variant="blue"
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting}
            icon={<ArrowRight weight="bold" className="w-3.5 h-3.5" />}
          >
            {isSubmitting ? 'Menilai Jawaban...' : 'Selesai & Terbitkan Tiket'}
          </Button3D>
        )}
      </div>
    </div>
  )
}
