import type { KeyboardEvent } from 'react'
import type { CurriculumExercise } from '@/features/curriculum/types/curriculum'
import type {
  ParsedExerciseContent,
  SubmitExerciseAnswerResponse,
} from '@/features/exercise/types/exercise'
import { SKILL_PILLAR_LABELS } from '@/features/exercise/utils/exerciseHelpers'
import { Button3D } from '@/shared/components/ui/Button3D'
import {
  ArrowCounterClockwise,
  Check,
  Lightbulb,
  Microphone,
  SpeakerHigh,
  Stop,
} from '@phosphor-icons/react'

interface ExercisePromptRendererProps {
  exercise: CurriculumExercise
  parsedContent: ParsedExerciseContent
  selectedTokenIndices: number[]
  selectedTokens: string[]
  selectedOptionValue: string
  textInput: string
  submittedResult: SubmitExerciseAnswerResponse | null
  showHint: boolean
  isSpeakingAudio: boolean
  isRecordingSpeech: boolean
  speechRecognitionSupported: boolean
  audioPlaybackError: string | null
  onAddToken: (index: number) => void
  onRemoveToken: (selectedPosition: number) => void
  onClearTokens: () => void
  onSelectOption: (value: string) => void
  onSetTextInput: (value: string) => void
  onConfirmSpokenSample?: () => void
  onPlayAudio: () => void
  onToggleRecording: () => void
  onToggleHint: () => void
  onEnterKey?: () => void
}

/**
 * Pure presentational renderer supporting all backend language exercise formats.
 */
export const ExercisePromptRenderer = ({
  exercise,
  parsedContent,
  selectedTokenIndices,
  selectedTokens,
  selectedOptionValue,
  textInput,
  submittedResult,
  showHint,
  isSpeakingAudio,
  isRecordingSpeech,
  speechRecognitionSupported,
  audioPlaybackError,
  onAddToken,
  onRemoveToken,
  onClearTokens,
  onSelectOption,
  onSetTextInput,
  onConfirmSpokenSample,
  onPlayAudio,
  onToggleRecording,
  onToggleHint,
  onEnterKey,
}: ExercisePromptRendererProps) => {
  const exerciseType = exercise.exercise_type
  const pillarMeta = SKILL_PILLAR_LABELS[exercise.skill_pillar] ?? {
    label: exercise.skill_pillar,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  }
  const isLocked = submittedResult !== null
  const selectedChoiceLabel = parsedContent.choiceOptions.find(
    (opt) => opt.id === selectedOptionValue
  )?.text
  const blankPreviewValue =
    selectedChoiceLabel ?? (selectedOptionValue || textInput.trim())

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLocked && onEnterKey) {
      event.preventDefault()
      onEnterKey()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Metadata & Prompt */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${pillarMeta.badgeClass}`}
          >
            {pillarMeta.label}
          </span>

          {parsedContent.hint && (
            <button
              type="button"
              onClick={onToggleHint}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
            >
              <Lightbulb weight="fill" className="w-4 h-4 text-amber-500" />
              {showHint ? 'Sembunyikan Petunjuk' : 'Petunjuk'}
            </button>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-brand font-extrabold text-slate-900 leading-snug whitespace-pre-line">
          {exercise.prompt}
        </h1>

        {showHint && parsedContent.hint && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-sm text-amber-900 font-medium">
            <span className="font-extrabold">Petunjuk: </span>
            {parsedContent.hint}
          </div>
        )}
      </div>

      {/* Optional Passage / Context Card */}
      {parsedContent.passage && (
        <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 text-sm sm:text-base text-slate-700 leading-relaxed shadow-sm">
          {parsedContent.passage}
        </div>
      )}

      {/* Optional Sentence Template with Visual Blank */}
      {parsedContent.sentenceTemplate && (
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-2 shadow-sm">
          <p className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
            {parsedContent.sentenceTemplate.replaceAll(
              '[blank]',
              blankPreviewValue ? ` 「${blankPreviewValue}」 ` : ' ______ '
            )}
          </p>
          {parsedContent.translation && (
            <p className="text-sm text-slate-500 font-medium">
              Artinya: “{parsedContent.translation}”
            </p>
          )}
        </div>
      )}

      {/* Optional Audio Player (Listening & Speaking) */}
      {(exerciseType === 'listening_choice' ||
        exerciseType === 'speaking_repeat' ||
        exerciseType === 'dialogue_roleplay' ||
        Boolean(parsedContent.audioText)) && (
        <div className="p-5 rounded-2xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Button3D
              type="button"
              variant="blue"
              size="md"
              onClick={onPlayAudio}
              icon={
                <SpeakerHigh
                  weight="fill"
                  className={`w-5 h-5 ${isSpeakingAudio ? 'animate-pulse' : ''}`}
                />
              }
            >
              {isSpeakingAudio ? 'Memutar Audio...' : 'Putar Audio Penutur'}
            </Button3D>

            {parsedContent.romaji && (
              <p className="text-sm font-mono text-blue-800 bg-white/80 px-3 py-2 rounded-xl border border-blue-100">
                {parsedContent.romaji}
              </p>
            )}
          </div>

          {parsedContent.displayText && (
            <p className="text-2xl font-extrabold text-slate-900 tracking-wide">
              {parsedContent.displayText}
            </p>
          )}

          {parsedContent.audioText && exerciseType !== 'listening_choice' && (
            <p className="text-base font-bold text-slate-800">
              {parsedContent.audioText}
            </p>
          )}

          {parsedContent.phoneticBreakdown.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {parsedContent.phoneticBreakdown.map((syllable, idx) => (
                <span
                  key={`${syllable}-${idx}`}
                  className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-xs font-mono font-bold text-blue-700"
                >
                  {syllable}
                </span>
              ))}
            </div>
          )}

          {audioPlaybackError && (
            <p className="text-xs font-semibold text-amber-700">
              {audioPlaybackError}
            </p>
          )}
        </div>
      )}

      {/* Furigana Helper Chips */}
      {parsedContent.furigana.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {parsedContent.furigana.map((item, idx) => (
            <span
              key={`${item.kanji}-${idx}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700"
            >
              <span className="text-slate-900">{item.kanji}</span>
              <span className="text-slate-400">({item.kana})</span>
            </span>
          ))}
        </div>
      )}

      {/* MODE 1: SENTENCE BUILDER */}
      {exerciseType === 'sentence_builder' && (
        <div className="space-y-5">
          {parsedContent.targetTranslation && (
            <p className="text-sm font-semibold text-slate-500">
              Target arti: “{parsedContent.targetTranslation}”
            </p>
          )}

          {/* Sentence Construction Tray */}
          <div className="min-h-[84px] p-4 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex flex-wrap items-center gap-2">
            {selectedTokens.length === 0 ? (
              <span className="text-sm text-slate-400 font-medium">
                Ketuk balok kata di bawah untuk menyusun kalimat berurutan...
              </span>
            ) : (
              selectedTokens.map((token, posIdx) => (
                <button
                  key={`${token}-${posIdx}`}
                  type="button"
                  disabled={isLocked}
                  onClick={() => onRemoveToken(posIdx)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-50 border-2 border-blue-300 shadow-[0_3px_0_0_#93C5FD] text-slate-900 font-bold text-base hover:bg-blue-100 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-75 disabled:cursor-default"
                >
                  {token}
                </button>
              ))
            )}
          </div>

          {selectedTokens.length > 0 && !isLocked && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClearTokens}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-3 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <ArrowCounterClockwise className="w-4 h-4" />
                Ulangi Susunan
              </button>
            </div>
          )}

          {/* Available Token Bank */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            {parsedContent.tokens.map((token, tokenIndex) => {
              const isUsed = selectedTokenIndices.includes(tokenIndex)
              return (
                <button
                  key={`${token}-${tokenIndex}`}
                  type="button"
                  disabled={isUsed || isLocked}
                  onClick={() => onAddToken(tokenIndex)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl border-2 font-bold text-base transition-all ${
                    isUsed
                      ? 'bg-slate-100 border-slate-200 text-transparent shadow-none cursor-default select-none'
                      : 'bg-white border-slate-200 shadow-[0_3px_0_0_#CBD5E1] text-slate-900 hover:bg-slate-50 active:translate-y-0.5 active:shadow-none cursor-pointer'
                  }`}
                >
                  {token}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* MODE 2: SPEAKING REPEAT */}
      {exerciseType === 'speaking_repeat' && (
        <div className="space-y-4 p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {speechRecognitionSupported && (
              <Button3D
                type="button"
                variant={isRecordingSpeech ? 'rose' : 'white'}
                size="md"
                disabled={isLocked}
                onClick={onToggleRecording}
                icon={
                  isRecordingSpeech ? (
                    <Stop weight="fill" className="w-4 h-4" />
                  ) : (
                    <Microphone weight="fill" className="w-4 h-4 text-blue-600" />
                  )
                }
              >
                {isRecordingSpeech ? 'Hentikan Rekam' : 'Rekam Suara'}
              </Button3D>
            )}

            {onConfirmSpokenSample && parsedContent.displayText && (
              <Button3D
                type="button"
                variant="emerald"
                size="md"
                disabled={isLocked}
                onClick={onConfirmSpokenSample}
                icon={<Check weight="bold" className="w-4 h-4" />}
              >
                Saya Sudah Mengucapkan
              </Button3D>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={`speaking-transcript-${exercise.id}`}
              className="block text-xs font-extrabold uppercase tracking-wider text-slate-500"
            >
              Transkrip Pelafalan Anda
            </label>
            <input
              id={`speaking-transcript-${exercise.id}`}
              type="text"
              disabled={isLocked}
              value={textInput}
              onChange={(e) => onSetTextInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={
                parsedContent.displayText || 'Ketik atau rekam pelafalan kalimat...'
              }
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-900"
            />
          </div>
        </div>
      )}

      {/* MODE 3: CHOICE OPTIONS (fill_blank, listening_choice, multiple_choice, etc.) */}
      {exerciseType !== 'sentence_builder' &&
        exerciseType !== 'speaking_repeat' &&
        parsedContent.choiceOptions.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {parsedContent.choiceOptions.map((opt, idx) => {
              const isSelected = selectedOptionValue === opt.id
              return (
                <button
                  key={`${opt.id}-${idx}`}
                  type="button"
                  disabled={isLocked}
                  onClick={() => onSelectOption(opt.id)}
                  className={`w-full min-h-[56px] px-5 py-3.5 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 shadow-[0_3px_0_0_#3B82F6] text-blue-950'
                      : 'bg-white border-slate-200 shadow-[0_3px_0_0_#E2E8F0] hover:bg-slate-50 text-slate-800'
                  } ${isLocked ? 'cursor-default' : 'cursor-pointer active:translate-y-0.5 active:shadow-none'}`}
                >
                  <span
                    className={`w-8 h-8 shrink-0 rounded-lg border-2 flex items-center justify-center text-xs font-black ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-bold text-base leading-snug">
                    {opt.text}
                  </span>
                </button>
              )
            })}
          </div>
        )}

      {/* MODE 4: FREE TEXT FALLBACK (when an exercise has neither tokens nor choice options) */}
      {exerciseType !== 'sentence_builder' &&
        exerciseType !== 'speaking_repeat' &&
        parsedContent.choiceOptions.length === 0 && (
          <div className="space-y-2">
            <label
              htmlFor={`free-answer-${exercise.id}`}
              className="block text-xs font-extrabold uppercase tracking-wider text-slate-500"
            >
              Jawaban Anda
            </label>
            <input
              id={`free-answer-${exercise.id}`}
              type="text"
              disabled={isLocked}
              value={textInput}
              onChange={(e) => onSetTextInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Ketik jawaban Anda di sini..."
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-900"
            />
          </div>
        )}
    </div>
  )
}

