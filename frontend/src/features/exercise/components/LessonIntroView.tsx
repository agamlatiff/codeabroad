import { useState, type FC } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Lightbulb,
  SpeakerHigh,
  Sparkle,
  Translate,
} from '@phosphor-icons/react'
import type { LessonIntroDeck } from '@/features/exercise/constants/lessonIntroCards'
import { ExerciseSessionHeader } from '@/features/exercise/components/ExerciseSessionHeader'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

const SLOW_SPEECH_RATE = 0.58

export interface LessonIntroViewProps {
  lessonTitle: string
  xpReward: number
  deck: LessonIntroDeck
  onExit: () => void
  onStartQuiz: () => void
}

/**
 * Learn-Before-Quiz introduction stage so zero-beginners recognize characters/phrases
 * with 2-speed audio and visual mnemonics before entering interactive questions.
 */
export const LessonIntroView: FC<LessonIntroViewProps> = ({
  lessonTitle,
  xpReward,
  deck,
  onExit,
  onStartQuiz,
}) => {
  const [playingKey, setPlayingKey] = useState<string | null>(null)

  const handlePlay = (key: string, text: string, rate?: number) => {
    triggerHaptic('tap')
    audioService.stopSpeech()
    setPlayingKey(key)
    const clear = () => setPlayingKey((prev) => (prev === key ? null : prev))
    if (typeof rate === 'number') {
      audioService.speakLanguage(text, 'ja-JP', clear, clear, rate)
    } else {
      audioService.speakJapanese(text, clear, clear)
    }
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#FAFAF9] text-slate-900 font-sans overflow-hidden">
      <ExerciseSessionHeader
        onExit={onExit}
        exitAriaLabel="Keluar ke Kurikulum"
        progressPercent={8}
        progressFillClass="bg-blue-500"
        counterLabel="Kenali Dulu"
        rightSlot={
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-700 shrink-0">
            <Sparkle weight="fill" className="w-4 h-4 text-amber-500" />+{xpReward} XP
          </span>
        }
      />

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto space-y-6 pb-6">
          {/* Header Banner with Kodi Studying */}
          <div className="bg-white rounded-3xl border-2 border-blue-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4">
            <KodiCharacter emotion="studying" size={76} interactive={false} className="shrink-0 mx-auto sm:mx-0" />
            <div className="space-y-1.5 min-w-0 text-center sm:text-left">
              <span className="inline-flex items-center gap-1 text-[10px] font-brand font-black uppercase tracking-wider text-blue-600">
                <Sparkle weight="fill" className="w-3 h-3" />
                {lessonTitle}
              </span>
              <h1 className="text-lg sm:text-xl font-brand font-black text-slate-900 leading-snug">
                {deck.headline}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                {deck.subtitle}
              </p>
            </div>
          </div>

          {/* Intro Character / Phrase Cards */}
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
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-tight">
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
                        onClick={() => handlePlay(slowKey, item.speakText, SLOW_SPEECH_RATE)}
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
        </div>
      </main>

      {/* Sticky Footer CTA */}
      <footer className="shrink-0 bg-white border-t-2 border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {deck.kanaLinkScript ? (
            <Link
              to={`/kana?script=${deck.kanaLinkScript}`}
              className="inline-flex items-center gap-1.5 text-xs font-brand font-black text-emerald-700 hover:text-emerald-800 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              <Translate weight="bold" className="w-4 h-4" />
              Buka Tabel Lengkap {deck.kanaLinkScript === 'hiragana' ? 'Hiragana' : 'Katakana'}
            </Link>
          ) : (
            <span className="text-xs font-medium text-slate-500">
              Sudah siap? Kita langsung uji pemahamanmu!
            </span>
          )}

          <Button3D
            variant="blue"
            size="lg"
            onClick={onStartQuiz}
            className="w-full sm:w-auto text-sm"
          >
            <span>Siap, Mulai Latihan</span>
            <ArrowRight weight="bold" className="w-4 h-4" />
          </Button3D>
        </div>
      </footer>
    </div>
  )
}
