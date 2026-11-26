import { useEffect, useMemo, useState, type FC } from 'react'
import { CheckCircle, SpeakerHigh, Sparkle, X, XCircle } from '@phosphor-icons/react'
import type { KanaCharacterItem, KanaPracticeItem } from '@/features/curriculum/types/curriculum'
import { Button3D } from '@/shared/components/ui/Button3D'
import { extractApiErrorMessage } from '@/shared/services/api'
import { audioService } from '@/shared/services/audioService'
import { useAudioStore } from '@/shared/store/audioStore'
import { triggerHaptic } from '@/shared/utils/haptics'
import { playSound } from '@/shared/utils/sound'

export interface KanaRowDrillCardProps {
  rowLabel: string
  rowChars: KanaCharacterItem[]
  allScriptChars: KanaCharacterItem[]
  isSubmitting?: boolean
  onFinishDrill: (results: KanaPracticeItem[]) => Promise<void>
  onClose: () => void
}

interface DrillQuestion {
  target: KanaCharacterItem
  mode: 'pick-kana' | 'pick-romaji'
  options: KanaCharacterItem[]
}

const buildDeterministicOptions = (
  target: KanaCharacterItem,
  rowChars: KanaCharacterItem[],
  allScriptChars: KanaCharacterItem[],
  seedOffset: number
): KanaCharacterItem[] => {
  const pool = [...rowChars.filter((c) => c.character !== target.character)]
  for (const ch of allScriptChars) {
    if (pool.length >= 12) break
    if (ch.character !== target.character && !pool.some((p) => p.character === ch.character)) {
      pool.push(ch)
    }
  }

  const distractors: KanaCharacterItem[] = []
  for (let i = 0; i < pool.length && distractors.length < 3; i++) {
    const picked = pool[(i + seedOffset) % pool.length]
    if (!distractors.some((d) => d.character === picked.character)) {
      distractors.push(picked)
    }
  }

  const combined = [target, ...distractors]
  const rotated: KanaCharacterItem[] = []
  for (let i = 0; i < combined.length; i++) {
    rotated.push(combined[(i + seedOffset) % combined.length])
  }
  return rotated
}

/**
 * Interactive 5-character (row-sized) recognition & listening mini-quiz.
 * Saves mastery outcomes directly to PostgreSQL user_kana_progress.
 */
export const KanaRowDrillCard: FC<KanaRowDrillCardProps> = ({
  rowLabel,
  rowChars,
  allScriptChars,
  isSubmitting = false,
  onFinishDrill,
  onClose,
}) => {
  const questions: DrillQuestion[] = useMemo(
    () =>
      rowChars.map((target, idx) => ({
        target,
        mode: idx % 2 === 0 ? 'pick-kana' : 'pick-romaji',
        options: buildDeterministicOptions(target, rowChars, allScriptChars, idx + 1),
      })),
    [rowChars, allScriptChars]
  )

  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [answers, setAnswers] = useState<KanaPracticeItem[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const currentQuestion = questions[questionIndex]
  const correctCount = answers.filter((a) => a.is_correct).length
  const currentTargetChar = currentQuestion?.target.character ?? ''
  const currentMode = currentQuestion?.mode

  // Ensure speech synthesis stops when leaving or unmounting the drill card in any mode
  useEffect(() => {
    return () => {
      audioService.stopSpeech()
    }
  }, [])

  // Auto-play pronunciation ONLY on listening prompts (pick-kana); never spoil reading prompts (pick-romaji)
  useEffect(() => {
    if (isCompleted || !currentTargetChar || currentMode !== 'pick-kana') return
    const timer = window.setTimeout(() => {
      const { autoPlayVoice, audioMode } = useAudioStore.getState()
      if (!autoPlayVoice || audioMode === 'muted') return
      audioService.stopSpeech()
      audioService.speakJapanese(currentTargetChar)
    }, 180)

    return () => {
      window.clearTimeout(timer)
      audioService.stopSpeech()
    }
  }, [currentMode, currentTargetChar, isCompleted, questionIndex])

  const handleSelectOption = (option: KanaCharacterItem) => {
    if (!currentQuestion || selectedChoice !== null) return

    const value =
      currentQuestion.mode === 'pick-kana' ? option.character : option.romaji
    const isCorrect = option.character === currentQuestion.target.character

    setSelectedChoice(value)
    triggerHaptic(isCorrect ? 'success' : 'error')
    playSound(isCorrect ? 'gem_collect' : 'node_locked')
    audioService.speakJapanese(currentQuestion.target.character)

    setAnswers((prev) => [
      ...prev,
      { character: currentQuestion.target.character, is_correct: isCorrect },
    ])
  }

  const handleNext = async () => {
    setSaveError(null)
    if (questionIndex + 1 < questions.length) {
      const nextIdx = questionIndex + 1
      setQuestionIndex(nextIdx)
      setSelectedChoice(null)
      return
    }
    try {
      await onFinishDrill(answers)
      setIsCompleted(true)
    } catch (err) {
      setSaveError(
        extractApiErrorMessage(err, 'Gagal menyimpan hasil latihan. Coba lagi ya.')
      )
    }
  }

  const handleRestart = () => {
    setQuestionIndex(0)
    setSelectedChoice(null)
    setAnswers([])
    setIsCompleted(false)
    setSaveError(null)
  }

  if (!currentQuestion) {
    return null
  }

  if (isCompleted) {
    return (
      <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-brand font-black uppercase tracking-wider">
            <Sparkle weight="fill" className="w-3.5 h-3.5" />
            Latihan Baris Selesai
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup latihan baris"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center space-y-2 py-2">
          <p className="text-4xl font-brand font-black text-emerald-600 tabular-nums">
            {correctCount}/{questions.length} Benar
          </p>
          <p className="text-sm font-medium text-slate-600">
            Progres penguasaan huruf di baris <span className="font-bold text-slate-900">{rowLabel}</span> sudah tersimpan.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {answers.map((ans, idx) => (
            <span
              key={`${ans.character}-${idx}`}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-base font-black ${
                ans.is_correct
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              {ans.character}
              {ans.is_correct ? (
                <CheckCircle weight="fill" className="w-4 h-4" />
              ) : (
                <XCircle weight="fill" className="w-4 h-4" />
              )}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <Button3D
            variant="blue"
            size="sm"
            fullWidth
            onClick={handleRestart}
            className="text-xs"
          >
            Ulangi {rowLabel}
          </Button3D>
          <Button3D
            variant="emerald"
            size="sm"
            fullWidth
            onClick={onClose}
            className="text-xs"
          >
            Kembali ke Tabel
          </Button3D>
        </div>
      </div>
    )
  }

  const isPickKana = currentQuestion.mode === 'pick-kana'
  const correctValue = isPickKana
    ? currentQuestion.target.character
    : currentQuestion.target.romaji

  return (
    <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-sm p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-brand font-black uppercase tracking-wider text-blue-600 block">
            Kuis Cepat • {rowLabel}
          </span>
          <h3 className="font-brand font-black text-sm text-slate-900">
            Soal {questionIndex + 1} dari {questions.length}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Keluar Kuis
        </button>
      </div>

      {/* Prompt Card */}
      <div className="rounded-2xl bg-blue-50/70 border border-blue-200/80 p-5 text-center space-y-3">
        <p className="text-xs font-bold text-slate-600">
          {isPickKana
            ? 'Pilih huruf Jepang yang tepat untuk bunyi:'
            : 'Huruf di bawah ini dibaca sebagai:'}
        </p>

        <div className="flex items-center justify-center gap-3">
          <span
            className={`font-brand font-black text-slate-900 tracking-wide ${
              isPickKana && currentQuestion.target.romaji.length > 6
                ? 'text-xl sm:text-2xl leading-snug'
                : 'text-4xl sm:text-5xl'
            }`}
          >
            {isPickKana
              ? `"${currentQuestion.target.romaji.toUpperCase()}"`
              : currentQuestion.target.character}
          </span>
          {(isPickKana || selectedChoice !== null) && (
            <button
              type="button"
              onClick={() => audioService.speakJapanese(currentQuestion.target.character)}
              aria-label="Putar bunyi huruf"
              className="w-11 h-11 rounded-2xl bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
            >
              <SpeakerHigh weight="fill" className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 2x2 Multiple Choice Options */}
      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.options.map((opt) => {
          const optValue = isPickKana ? opt.character : opt.romaji
          const isPicked = selectedChoice === optValue
          const isTarget = optValue === correctValue

          let cardClass =
            'bg-white border-slate-200 text-slate-900 hover:border-blue-400 hover:bg-blue-50/40'
          if (selectedChoice !== null) {
            if (isTarget) {
              cardClass = 'bg-emerald-50 border-emerald-500 text-emerald-800'
            } else if (isPicked) {
              cardClass = 'bg-rose-50 border-rose-400 text-rose-800'
            } else {
              cardClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-75'
            }
          }

          return (
            <button
              key={`${opt.id}-${optValue}`}
              type="button"
              disabled={selectedChoice !== null}
              onClick={() => handleSelectOption(opt)}
              className={`min-h-[64px] rounded-2xl border-2 px-4 py-3 font-brand font-black transition-all shadow-[0_3px_0_0_rgba(15,23,42,0.06)] cursor-pointer disabled:cursor-default ${cardClass}`}
            >
              <span
                className={
                  isPickKana
                    ? 'text-2xl'
                    : optValue.length > 6
                      ? 'text-xs sm:text-sm leading-snug block'
                      : 'text-lg uppercase tracking-wider'
                }
              >
                {optValue}
              </span>
            </button>
          )
        })}
      </div>

      {/* Answer Explanation + Continue */}
      {selectedChoice !== null && (
        <div className="space-y-3 pt-1">
          <div
            className={`rounded-2xl p-3 border text-xs font-medium leading-relaxed ${
              selectedChoice === correctValue
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <span className="font-black">
              {currentQuestion.target.character} ({currentQuestion.target.romaji}):
            </span>{' '}
            {currentQuestion.target.mnemonic}
          </div>

          {saveError && (
            <div
              role="alert"
              className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700"
            >
              {saveError}
            </div>
          )}

          <Button3D
            variant="blue"
            size="md"
            fullWidth
            disabled={isSubmitting}
            onClick={() => void handleNext()}
            className="text-xs"
          >
            {questionIndex + 1 < questions.length
              ? 'Lanjut ke Huruf Berikutnya →'
              : isSubmitting
                ? 'Menyimpan Progres...'
                : saveError
                  ? 'Coba Simpan Ulang'
                  : 'Lihat Hasil Baris'}
          </Button3D>
        </div>
      )}
    </div>
  )
}
