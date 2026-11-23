import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle, ArrowLeft, ArrowRight, SpeakerHigh, Trash } from '@phosphor-icons/react'
import type { PlacementQuestionItem, PlacementQuestionOption } from '@/features/onboarding/types/onboarding'
import {
  SKILL_PILLAR_LABELS,
  shuffleDeterministically,
  shuffleTokensDeterministically,
} from '@/features/exercise/utils/exerciseHelpers'
import { triggerHaptic } from '@/shared/utils/haptics'
import { audioService } from '@/shared/services/audioService'
import { useAudioStore } from '@/shared/store/audioStore'
import { resolveSpeechLocale } from '@/shared/utils/speechLocale'
import { Button3D } from '@/shared/components/ui/Button3D'

const SLOW_SPEECH_RATE = 0.58

interface Step3PlacementTestProps {
  questions: PlacementQuestionItem[]
  languageCode?: string
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

const hydrateTokenIndicesFromAnswer = (tokens: string[], savedAnswer: string): number[] => {
  const trimmed = savedAnswer.trim()
  if (!trimmed || tokens.length === 0) return []
  const parts = trimmed.split(/\s+/)
  const used = new Set<number>()
  const indices: number[] = []
  for (const part of parts) {
    const idx = tokens.findIndex((t, i) => !used.has(i) && t === part)
    if (idx >= 0) {
      used.add(idx)
      indices.push(idx)
    }
  }
  return indices
}

export const Step3PlacementTest = ({
  questions,
  languageCode,
  isLoading,
  answers,
  onAnswerChange,
  onSubmit,
  isSubmitting,
}: Step3PlacementTestProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [selectedTokensByQuestion, setSelectedTokensByQuestion] = useState<Record<string, number[]>>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stopAllAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    audioService.stopSpeech()
    setIsPlayingAudio(false)
  }, [])

  const playQuestionAudio = useCallback(
    (mediaUrl?: string, text?: string, rate?: number, withHaptic = true) => {
      stopAllAudio()
      if (withHaptic) {
        triggerHaptic('tap')
      }
      setIsPlayingAudio(true)

      const fallbackSpeech = () => {
        if (!text) {
          setIsPlayingAudio(false)
          return
        }
        audioService.speakLanguage(
          text,
          resolveSpeechLocale(languageCode),
          () => setIsPlayingAudio(false),
          () => setIsPlayingAudio(false),
          rate
        )
      }

      if (mediaUrl) {
        const audio = new Audio(mediaUrl)
        audio.playbackRate = typeof rate === 'number' && rate > 0 ? rate : 1
        audioRef.current = audio
        audio.onended = () => setIsPlayingAudio(false)
        audio.onerror = () => fallbackSpeech()
        audio.play().catch(() => fallbackSpeech())
        return
      }

      fallbackSpeech()
    },
    [languageCode, stopAllAudio]
  )

  useEffect(() => {
    return () => {
      stopAllAudio()
    }
  }, [stopAllAudio])

  const safeIndex = Math.min(currentIndex, Math.max(0, questions.length - 1))
  const currentQuestion = questions[safeIndex]
  const currentQuestionId = currentQuestion?.id ?? ''
  const rawOptions = currentQuestion?.content?.options
  const rawTokens = currentQuestion?.content?.tokens

  const currentMediaUrl = currentQuestion?.media_url ?? undefined
  const currentAudioText =
    currentQuestion?.content?.audio_text ||
    currentQuestion?.content?.sentence ||
    currentQuestion?.content?.question ||
    currentQuestion?.prompt ||
    ''
  const hasAudioPrompt = Boolean(
    currentQuestion &&
      (currentMediaUrl ||
        currentQuestion.content?.audio_text ||
        currentQuestion.skill_pillar.toLowerCase() === 'listening')
  )

  // Auto-play audio for listening placement questions when autoPlayVoice is enabled
  useEffect(() => {
    if (isLoading || !currentQuestionId || !hasAudioPrompt) return
    const timer = window.setTimeout(() => {
      const { autoPlayVoice, audioMode } = useAudioStore.getState()
      if (!autoPlayVoice || audioMode === 'muted') return
      playQuestionAudio(currentMediaUrl, currentAudioText, undefined, false)
    }, 220)

    return () => {
      window.clearTimeout(timer)
      stopAllAudio()
    }
  }, [
    currentAudioText,
    currentMediaUrl,
    currentQuestionId,
    hasAudioPrompt,
    isLoading,
    playQuestionAudio,
    stopAllAudio,
  ])

  const options = useMemo(
    () =>
      currentQuestionId && Array.isArray(rawOptions)
        ? shuffleDeterministically(
            rawOptions,
            `${currentQuestionId}:placement-options`,
            (opt) => `${getOptionValue(opt)}\u0000${getOptionLabel(opt)}`
          )
        : [],
    [currentQuestionId, rawOptions]
  )

  const tokens = useMemo(
    () =>
      currentQuestionId && Array.isArray(rawTokens)
        ? shuffleTokensDeterministically(rawTokens, `${currentQuestionId}:placement-tokens`)
        : [],
    [currentQuestionId, rawTokens]
  )

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xs">
        <p className="text-sm font-semibold text-slate-600">Menyiapkan soal tes penempatan...</p>
      </div>
    )
  }

  if (questions.length === 0 || !currentQuestion) {
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

  const currentAnswer = answers[currentQuestion.id] ?? ''
  const isSentenceBuilder = currentQuestion.exercise_type === 'sentence_builder' && tokens.length > 0
  const selectedIndices =
    selectedTokensByQuestion[currentQuestion.id] ??
    hydrateTokenIndicesFromAnswer(tokens, currentAnswer)
  const answeredCount = questions.filter((q) => Boolean((answers[q.id] ?? '').trim())).length
  const progressPercent = Math.round(((safeIndex + 1) / questions.length) * 100)

  const handlePlayAudio = (rate?: number) => {
    if (isPlayingAudio && typeof rate !== 'number') {
      stopAllAudio()
      return
    }
    playQuestionAudio(currentMediaUrl, currentAudioText, rate, true)
  }

  const pillarMeta = SKILL_PILLAR_LABELS[currentQuestion.skill_pillar.toLowerCase()]

  const updateSelectedTokens = (nextIndices: number[]) => {
    setSelectedTokensByQuestion((prev) => ({
      ...prev,
      [currentQuestion.id]: nextIndices,
    }))
    const joined = nextIndices.map((idx) => tokens[idx] ?? '').filter(Boolean).join(' ')
    onAnswerChange(currentQuestion.id, joined)
  }

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
        <div className="flex items-center justify-between gap-2">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-[10px] font-extrabold uppercase tracking-wider">
            {pillarMeta?.label ?? currentQuestion.skill_pillar}
          </span>
          {hasAudioPrompt && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePlayAudio()}
                aria-label={isPlayingAudio ? 'Hentikan audio soal' : 'Putar audio soal'}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <SpeakerHigh weight="fill" className="w-4 h-4" />
                <span>{isPlayingAudio ? 'Memutar...' : 'Dengar Audio'}</span>
              </button>
              <button
                type="button"
                onClick={() => handlePlayAudio(SLOW_SPEECH_RATE)}
                aria-label="Putar audio soal pelan 0.6x"
                className="px-2.5 py-1.5 rounded-xl text-xs font-extrabold border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 transition-all cursor-pointer"
              >
                0.6x
              </button>
            </div>
          )}
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{currentQuestion.prompt}</h3>
        {(currentQuestion.content?.question || currentQuestion.content?.sentence) && (
          <p className="text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3">
            {currentQuestion.content.question || currentQuestion.content.sentence}
          </p>
        )}
      </div>

      {/* Options, Sentence Builder, or Text Input */}
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
      ) : isSentenceBuilder ? (
        <div className="space-y-3">
          <div className="min-h-14 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {selectedIndices.length > 0 ? (
                selectedIndices.map((tokenIdx, pos) => (
                  <button
                    key={`selected-${tokenIdx}-${pos}`}
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap')
                      updateSelectedTokens(selectedIndices.filter((_, i) => i !== pos))
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-300 text-blue-700 text-xs font-extrabold cursor-pointer hover:bg-blue-100"
                  >
                    {tokens[tokenIdx]}
                  </button>
                ))
              ) : (
                <span className="text-xs font-semibold text-slate-400">
                  Ketuk kata di bawah untuk menyusun kalimat...
                </span>
              )}
            </div>
            {selectedIndices.length > 0 && (
              <button
                type="button"
                onClick={() => updateSelectedTokens([])}
                aria-label="Hapus susunan kata"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <Trash weight="bold" className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {tokens.map((token, idx) => {
              const used = selectedIndices.includes(idx)
              return (
                <button
                  key={`token-${idx}-${token}`}
                  type="button"
                  disabled={used}
                  onClick={() => {
                    triggerHaptic('tap')
                    updateSelectedTokens([...selectedIndices, idx])
                  }}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                    used
                      ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer'
                  }`}
                >
                  {token}
                </button>
              )
            })}
          </div>
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
          onClick={() => {
            stopAllAudio()
            setCurrentIndex((prev) => Math.max(0, prev - 1))
          }}
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
              stopAllAudio()
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
            onClick={() => {
              stopAllAudio()
              onSubmit()
            }}
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
