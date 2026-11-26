import { useEffect, useRef, useState, type FC } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Lightbulb,
  SpeakerHigh,
  Sparkle,
  Translate,
  Warning,
} from '@phosphor-icons/react'
import type {
  LessonIntroDeck,
  StudyBatchSegment,
} from '@/features/exercise/constants/lessonIntroCards'
import {
  ExerciseSessionHeader,
  type TimelineStepSegment,
} from '@/features/exercise/components/ExerciseSessionHeader'
import { useActiveSpeechLocale } from '@/features/exercise/hooks/useActiveSpeechLocale'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { audioService } from '@/shared/services/audioService'
import { useAudioStore } from '@/shared/store/audioStore'
import { triggerHaptic } from '@/shared/utils/haptics'

const SLOW_SPEECH_RATE = 0.58

type IntroSlideId = 'vocab' | 'grammar' | 'tips'

const SLIDE_TABS: Array<{ id: IntroSlideId; step: number; label: string }> = [
  { id: 'vocab', step: 1, label: 'Aksara & Kosakata' },
  { id: 'grammar', step: 2, label: 'Rumus & Pola' },
  { id: 'tips', step: 3, label: 'Jangan Tertukar!' },
]

export interface LessonIntroViewProps {
  lessonTitle: string
  xpReward: number
  deck: LessonIntroDeck
  batch?: StudyBatchSegment | null
  progressPercent?: number
  counterLabel?: string
  timelineSteps?: TimelineStepSegment[]
  onExit: () => void
  onStartQuiz: () => void
}

/**
 * Learn-Before-Quiz introduction & interleaved mini-batch view (Opsi A):
 * - In interleaved mode (`batch` provided), presents 2 focused cards before each 2-3 question block
 *   inside one unified progress bar.
 * - Automatically pronounces card 1 then card 2 sequentially when `autoPlayVoice` is enabled.
 */
export const LessonIntroView: FC<LessonIntroViewProps> = ({
  lessonTitle,
  xpReward,
  deck,
  batch,
  progressPercent,
  counterLabel,
  timelineSteps,
  onExit,
  onStartQuiz,
}) => {
  const [playingKey, setPlayingKey] = useState<string | null>(null)
  const [activeSlide, setActiveSlide] = useState<IntroSlideId>(
    deck.items.length > 0 ? 'vocab' : 'grammar'
  )
  const manualInteractedRef = useRef(false)
  const speechLocale = useActiveSpeechLocale()

  const handlePlay = (key: string, text: string, rate?: number) => {
    manualInteractedRef.current = true
    triggerHaptic('tap')
    audioService.stopSpeech()
    setPlayingKey(key)
    const clear = () => setPlayingKey((prev) => (prev === key ? null : prev))
    audioService.speakLanguage(text, speechLocale, clear, clear, rate)
  }

  const displayedItems = batch ? batch.items : deck.items
  const batchNumber = batch?.batchNumber ?? 1
  const leadSpeakText = displayedItems[0]?.speakText ?? ''
  const secondSpeakText = displayedItems[1]?.speakText ?? ''

  // Auto-play card 1 then card 2 sequentially when a study batch opens
  useEffect(() => {
    manualInteractedRef.current = false
    if (!leadSpeakText) return

    let cancelled = false
    let followUpTimer: number | null = null
    const firstKey = batch ? `batch-${batchNumber}-normal-0` : 'normal-0'
    const secondKey = batch ? `batch-${batchNumber}-normal-1` : 'normal-1'

    const startTimer = window.setTimeout(() => {
      if (cancelled || manualInteractedRef.current) return
      const { autoPlayVoice, audioMode } = useAudioStore.getState()
      if (!autoPlayVoice || audioMode === 'muted') return

      audioService.stopSpeech()
      setPlayingKey(firstKey)

      const finishFirst = () => {
        setPlayingKey((prev) => (prev === firstKey ? null : prev))
        if (cancelled || manualInteractedRef.current || !secondSpeakText || !batch) {
          return
        }
        followUpTimer = window.setTimeout(() => {
          if (cancelled || manualInteractedRef.current) return
          const latest = useAudioStore.getState()
          if (!latest.autoPlayVoice || latest.audioMode === 'muted') return
          setPlayingKey(secondKey)
          const clearSecond = () =>
            setPlayingKey((prev) => (prev === secondKey ? null : prev))
          audioService.speakLanguage(secondSpeakText, speechLocale, clearSecond, clearSecond)
        }, 650)
      }

      audioService.speakLanguage(leadSpeakText, speechLocale, finishFirst, finishFirst)
    }, 220)

    return () => {
      cancelled = true
      window.clearTimeout(startTimer)
      if (followUpTimer !== null) {
        window.clearTimeout(followUpTimer)
      }
      audioService.stopSpeech()
    }
  }, [batch, batchNumber, leadSpeakText, secondSpeakText, speechLocale])

  // Interleaved mini-batch mode (Opsi A)
  if (batch) {
    const resolvedProgress = typeof progressPercent === 'number' ? progressPercent : 10
    const resolvedCounter =
      counterLabel || `Materi ${batch.batchNumber}/${batch.totalBatches}`

    return (
      <div className="min-h-screen h-screen flex flex-col bg-[#FAFAF9] text-slate-900 font-sans overflow-hidden">
        <ExerciseSessionHeader
          onExit={() => {
            audioService.stopSpeech()
            onExit()
          }}
          exitAriaLabel="Keluar ke Kurikulum"
          progressPercent={resolvedProgress}
          progressFillClass="bg-blue-500"
          counterLabel={resolvedCounter}
          timelineSteps={timelineSteps}
          rightSlot={
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-700 shrink-0">
              <Sparkle weight="fill" className="w-4 h-4 text-amber-500" />+{xpReward} XP
            </span>
          }
        />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-7">
          <div className="max-w-3xl mx-auto space-y-5 pb-6">
            {/* Compact Batch Header */}
            <div className="bg-white rounded-3xl border-2 border-blue-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4">
              <KodiCharacter
                emotion="studying"
                size={68}
                interactive={false}
                className="shrink-0 mx-auto sm:mx-0"
              />
              <div className="space-y-1.5 min-w-0 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-brand font-black uppercase tracking-wider text-blue-700">
                    <Sparkle weight="fill" className="w-3 h-3" />
                    Tahap Materi {batch.batchNumber}/{batch.totalBatches}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 truncate">
                    {lessonTitle}
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-brand font-black text-slate-900 leading-snug">
                  {batch.batchNumber === 1
                    ? 'Kenali Dulu Sebelum Latihan'
                    : 'Materi Baru Untuk Soal Berikutnya'}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                  {displayedItems.length > 0
                    ? 'Dengarkan pelafalannya (Normal atau 0.6x) lalu langsung praktik pada beberapa soal berikutnya.'
                    : 'Pahami pola kalimat kunci berikut sebelum langsung mengerjakan soal latihan.'}
                </p>
              </div>
            </div>

            {/* 2-Card Focused Study Grid */}
            {displayedItems.length > 0 && (
              <div
                className={`grid grid-cols-1 ${
                  displayedItems.length > 1 ? 'sm:grid-cols-2' : ''
                } gap-4`}
              >
                {displayedItems.map((item, idx) => {
                  const normalKey = `batch-${batchNumber}-normal-${idx}`
                  const slowKey = `batch-${batchNumber}-slow-${idx}`

                  return (
                    <div
                      key={`${item.symbol}-${idx}`}
                      className={`bg-white rounded-3xl border-2 p-4 sm:p-5 shadow-[0_3px_0_0_rgba(15,23,42,0.05)] space-y-3 transition-all ${
                        playingKey === normalKey || playingKey === slowKey
                          ? 'border-blue-400 ring-2 ring-blue-100'
                          : 'border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-tight break-words">
                            {item.symbol}
                          </span>
                          <span className="inline-block px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-brand font-black text-blue-700">
                            {item.reading}
                          </span>
                          <p className="text-xs font-bold text-slate-700 pt-0.5">
                            {item.meaning}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handlePlay(normalKey, item.speakText)}
                            aria-label={`Putar suara ${item.symbol}`}
                            className={`min-h-[38px] px-2.5 rounded-xl border-2 text-[11px] font-brand font-black inline-flex items-center gap-1 transition-colors cursor-pointer ${
                              playingKey === normalKey
                                ? 'bg-blue-600 border-blue-700 text-white'
                                : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                            }`}
                          >
                            <SpeakerHigh weight="fill" className="w-3.5 h-3.5" />
                            Normal
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handlePlay(slowKey, item.speakText, SLOW_SPEECH_RATE)
                            }
                            aria-label={`Putar pelan ${item.symbol}`}
                            className={`min-h-[38px] px-2 rounded-xl border-2 text-[11px] font-brand font-black transition-colors cursor-pointer ${
                              playingKey === slowKey
                                ? 'bg-blue-600 border-blue-700 text-white'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                            }`}
                          >
                            0.6x
                          </button>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-amber-50/75 border border-amber-200/80 px-3 py-2 flex items-start gap-2">
                        <Lightbulb
                          weight="fill"
                          className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5"
                        />
                        <p className="text-[11px] font-medium text-amber-950 leading-relaxed">
                          {item.mnemonic}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Compact Grammar Formula Card (shown cleanly on first batch when lesson links grammar) */}
            {batch.grammarSummary && (
              <div className="bg-white rounded-3xl border-2 border-blue-200/90 p-5 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-brand font-black text-blue-700">
                    <BookOpen weight="bold" className="w-3.5 h-3.5" />
                    Rumus Pola • {batch.grammarSummary.title}
                  </span>
                  <Link
                    to={`/grammar/${batch.grammarSummary.code}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Detail Lengkap →
                  </Link>
                </div>

                <div className="rounded-2xl bg-slate-900 text-white px-4 py-3 space-y-0.5">
                  <p className="text-sm sm:text-base font-black tracking-wide">
                    {batch.grammarSummary.formula}
                  </p>
                  {batch.grammarSummary.formulaReading && (
                    <p className="text-xs font-semibold text-slate-300">
                      Cara baca: {batch.grammarSummary.formulaReading}
                    </p>
                  )}
                </div>

                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  {batch.grammarSummary.explanation}
                </p>
              </div>
            )}

            {/* Contrastive Warning Tip on Final Batch */}
            {batch.contrastiveTip && (
              <div className="bg-amber-50/90 rounded-2xl border-2 border-amber-300/90 px-4 py-3 flex items-start gap-2.5">
                <Warning weight="fill" className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-amber-950 leading-relaxed">
                  <span className="font-black">Catatan Penting: </span>
                  {batch.contrastiveTip}
                </p>
              </div>
            )}
          </div>
        </main>

        <footer className="shrink-0 bg-white border-t-2 border-slate-200 px-4 sm:px-6 py-4">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              {deck.kanaLinkScript ? (
                <Link
                  to={`/kana/${deck.kanaLinkScript}`}
                  className="inline-flex items-center gap-1.5 text-xs font-brand font-black text-emerald-700 hover:text-emerald-800 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  <Translate weight="bold" className="w-4 h-4" />
                  Tabel{' '}
                  {deck.kanaLinkScript === 'katakana'
                    ? 'Katakana'
                    : deck.kanaLinkScript === 'kanji'
                      ? 'Kanji'
                      : 'Hiragana'}
                </Link>
              ) : (
                <span className="text-xs font-semibold text-slate-500">
                  {resolvedCounter}
                </span>
              )}
            </div>

            <Button3D
              variant="emerald"
              size="lg"
              onClick={() => {
                triggerHaptic('tap')
                audioService.stopSpeech()
                onStartQuiz()
              }}
              className="w-full sm:w-auto text-sm"
            >
              <span>Lanjut ke Soal Latihan</span>
              <ArrowRight weight="bold" className="w-4 h-4" />
            </Button3D>
          </div>
        </footer>
      </div>
    )
  }

  // Fallback legacy 3-slide layout when invoked without a batch segment
  const currentSlideIndex = SLIDE_TABS.findIndex((t) => t.id === activeSlide)
  const headerProgressPercent =
    typeof progressPercent === 'number'
      ? progressPercent
      : activeSlide === 'vocab'
        ? 10
        : activeSlide === 'grammar'
          ? 20
          : 30

  const handlePrevSlide = () => {
    triggerHaptic('tap')
    if (currentSlideIndex > 0) {
      setActiveSlide(SLIDE_TABS[currentSlideIndex - 1].id)
    }
  }

  const handleNextSlide = () => {
    triggerHaptic('tap')
    if (currentSlideIndex < SLIDE_TABS.length - 1) {
      setActiveSlide(SLIDE_TABS[currentSlideIndex + 1].id)
    } else {
      onStartQuiz()
    }
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#FAFAF9] text-slate-900 font-sans overflow-hidden">
      <ExerciseSessionHeader
        onExit={() => {
          audioService.stopSpeech()
          onExit()
        }}
        exitAriaLabel="Keluar ke Kurikulum"
        progressPercent={headerProgressPercent}
        progressFillClass="bg-blue-500"
        counterLabel={counterLabel || `Materi ${currentSlideIndex + 1}/3`}
        rightSlot={
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-700 shrink-0">
            <Sparkle weight="fill" className="w-4 h-4 text-amber-500" />+{xpReward} XP
          </span>
        }
      />

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-7">
        <div className="max-w-3xl mx-auto space-y-5 pb-6">
          <div className="bg-white rounded-3xl border-2 border-blue-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4">
            <KodiCharacter
              emotion="studying"
              size={72}
              interactive={false}
              className="shrink-0 mx-auto sm:mx-0"
            />
            <div className="space-y-1.5 min-w-0 text-center sm:text-left">
              <span className="inline-flex items-center gap-1 text-[10px] font-brand font-black uppercase tracking-wider text-blue-600">
                <Sparkle weight="fill" className="w-3 h-3" />
                Pahami Materi Dulu • {lessonTitle}
              </span>
              <h1 className="text-lg sm:text-xl font-brand font-black text-slate-900 leading-snug">
                {deck.headline}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                {deck.subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-200/70 border border-slate-200">
            {SLIDE_TABS.map((tab) => {
              const isSelected = activeSlide === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    triggerHaptic('tap')
                    setActiveSlide(tab.id)
                  }}
                  className={`min-h-[42px] px-2.5 py-2 rounded-xl text-xs font-brand font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-blue-700 shadow-xs border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-300/80 text-slate-700'
                    }`}
                  >
                    {tab.step}
                  </span>
                  <span className="truncate">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {activeSlide === 'vocab' && (
            <div className="space-y-4">
              {deck.items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {deck.items.map((item, idx) => {
                    const normalKey = `normal-${idx}`
                    const slowKey = `slow-${idx}`

                    return (
                      <div
                        key={`${item.symbol}-${idx}`}
                        className="bg-white rounded-3xl border-2 border-slate-200/90 p-4 sm:p-5 shadow-[0_3px_0_0_rgba(15,23,42,0.05)] space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 space-y-1">
                            <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-tight break-words">
                              {item.symbol}
                            </span>
                            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-brand font-black text-blue-700">
                              {item.reading}
                            </span>
                            <p className="text-xs font-bold text-slate-700 pt-0.5">
                              {item.meaning}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handlePlay(normalKey, item.speakText)}
                              aria-label={`Putar suara ${item.symbol}`}
                              className={`min-h-[38px] px-2.5 rounded-xl border-2 text-[11px] font-brand font-black inline-flex items-center gap-1 transition-colors cursor-pointer ${
                                playingKey === normalKey
                                  ? 'bg-blue-600 border-blue-700 text-white'
                                  : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                              }`}
                            >
                              <SpeakerHigh weight="fill" className="w-3.5 h-3.5" />
                              Normal
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handlePlay(slowKey, item.speakText, SLOW_SPEECH_RATE)
                              }
                              aria-label={`Putar pelan ${item.symbol}`}
                              className={`min-h-[38px] px-2 rounded-xl border-2 text-[11px] font-brand font-black transition-colors cursor-pointer ${
                                playingKey === slowKey
                                  ? 'bg-blue-600 border-blue-700 text-white'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                              }`}
                            >
                              0.6x
                            </button>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-amber-50/75 border border-amber-200/80 px-3 py-2 flex items-start gap-2">
                          <Lightbulb weight="fill" className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-[11px] font-medium text-amber-950 leading-relaxed">
                            {item.mnemonic}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-800">
                    Fokus sesi ini berpusat pada penerapan pola tata bahasa.
                  </p>
                  <p className="text-xs text-slate-500">
                    Klik tab <strong>2. Rumus &amp; Pola</strong> untuk mempelajari strukturnya.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeSlide === 'grammar' && (
            <div className="bg-white rounded-3xl border-2 border-blue-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              {deck.grammarSummary ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-brand font-black text-blue-700">
                      <BookOpen weight="bold" className="w-3.5 h-3.5" />
                      {deck.grammarSummary.code}
                    </span>
                    <Link
                      to={`/grammar/${deck.grammarSummary.code}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Buka Detail Lengkap →
                    </Link>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-base sm:text-lg font-brand font-black text-slate-900">
                      {deck.grammarSummary.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                      {deck.grammarSummary.explanation}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-900 text-white p-4 space-y-1">
                    <p className="text-[10px] font-brand font-black uppercase tracking-wider text-emerald-300">
                      Rumus Pola Kalimat
                    </p>
                    <p className="text-base sm:text-lg font-black tracking-wide">
                      {deck.grammarSummary.formula}
                    </p>
                    {deck.grammarSummary.formulaReading && (
                      <p className="text-xs font-semibold text-slate-300">
                        Cara baca: {deck.grammarSummary.formulaReading}
                      </p>
                    )}
                  </div>

                  {deck.grammarSummary.examples && deck.grammarSummary.examples.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      <p className="text-[11px] font-brand font-black uppercase tracking-wider text-slate-500">
                        Contoh Penggunaan Nyata
                      </p>
                      <div className="space-y-2">
                        {deck.grammarSummary.examples.map((ex, idx) => {
                          const exKey = `gp-ex-${idx}`
                          return (
                            <div
                              key={`${ex.jp}-${idx}`}
                              className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 flex items-center justify-between gap-3"
                            >
                              <div className="space-y-0.5 min-w-0">
                                <p className="text-sm sm:text-base font-black text-slate-900">
                                  {ex.jp}
                                </p>
                                <p className="text-xs font-bold text-blue-700">{ex.reading}</p>
                                <p className="text-xs font-medium text-slate-600">{ex.id}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handlePlay(exKey, ex.jp)}
                                aria-label={`Putar contoh ${ex.jp}`}
                                className={`min-h-[38px] px-3 rounded-xl border-2 text-xs font-brand font-black inline-flex items-center gap-1 shrink-0 transition-colors cursor-pointer ${
                                  playingKey === exKey
                                    ? 'bg-blue-600 border-blue-700 text-white'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                                }`}
                              >
                                <SpeakerHigh weight="fill" className="w-3.5 h-3.5" />
                                Putar
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-2 text-center py-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Translate weight="bold" className="w-6 h-6" />
                  </div>
                  <h2 className="text-base font-brand font-black text-slate-900">
                    Fokus Pengenalan Bunyi &amp; Aksara Dasar
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Pada tahap ini belum ada rumus tata bahasa yang rumit — pastikan kamu hafal bentuk dan suara setiap karakter di Slide 1 terlebih dahulu.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeSlide === 'tips' && (
            <div className="space-y-4">
              <div className="bg-amber-50/90 rounded-3xl border-2 border-amber-300 p-5 sm:p-6 space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2 text-amber-900">
                  <Warning weight="fill" className="w-5 h-5 text-amber-600 shrink-0" />
                  <h2 className="text-base font-brand font-black">
                    Jangan Tertukar! (Catatan Kontras Kunci)
                  </h2>
                </div>
                <p className="text-xs sm:text-sm font-medium text-amber-950 leading-relaxed">
                  {deck.contrastiveTip ||
                    'Perhatikan detail garis huruf kembar dan peran partikel sebelum memilih jawaban pada kuis.'}
                </p>
              </div>

              <div className="bg-white rounded-3xl border-2 border-emerald-200/90 p-5 sm:p-6 space-y-3 shadow-xs">
                <p className="text-xs font-brand font-black uppercase tracking-wider text-emerald-700">
                  Ringkasan Persiapan Sesi Kuis
                </p>
                <ul className="space-y-2 text-xs sm:text-sm font-medium text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Sudah mendengarkan pelafalan Normal &amp; 0.6x huruf/kata kunci</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Memahami pola kalimat &amp; posisi partikel di Slide 2</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Jika nanti keliru saat kuis, soal akan muncul lagi untuk dilatih ulang di akhir sesi!</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="shrink-0 bg-white border-t-2 border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            {currentSlideIndex > 0 ? (
              <button
                type="button"
                onClick={handlePrevSlide}
                className="inline-flex items-center gap-1.5 text-xs font-brand font-black text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft weight="bold" className="w-4 h-4" />
                Sebelumnya
              </button>
            ) : deck.kanaLinkScript ? (
              <Link
                to={`/kana/${deck.kanaLinkScript}`}
                className="inline-flex items-center gap-1.5 text-xs font-brand font-black text-emerald-700 hover:text-emerald-800 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                <Translate weight="bold" className="w-4 h-4" />
                Tabel {deck.kanaLinkScript === 'katakana' ? 'Katakana' : deck.kanaLinkScript === 'kanji' ? 'Kanji' : 'Hiragana'}
              </Link>
            ) : (
              <span className="text-xs font-medium text-slate-500">
                Langkah {currentSlideIndex + 1} dari 3
              </span>
            )}

            <button
              type="button"
              onClick={onStartQuiz}
              className="text-xs font-bold text-slate-500 hover:text-blue-700 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              Langsung Kuis →
            </button>
          </div>

          <Button3D
            variant={currentSlideIndex === SLIDE_TABS.length - 1 ? 'emerald' : 'blue'}
            size="lg"
            onClick={handleNextSlide}
            className="w-full sm:w-auto text-sm"
          >
            <span>
              {currentSlideIndex === SLIDE_TABS.length - 1
                ? 'Aku Sudah Paham, Mulai Latihan'
                : 'Lanjut Slide Berikutnya'}
            </span>
            <ArrowRight weight="bold" className="w-4 h-4" />
          </Button3D>
        </div>
      </footer>
    </div>
  )
}
