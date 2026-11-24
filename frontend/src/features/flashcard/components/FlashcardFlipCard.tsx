import type { FC, MouseEvent } from 'react'
import { MotionConfig, motion } from 'motion/react'
import { SpeakerHigh, ArrowsClockwise } from '@phosphor-icons/react'
import type { FlashcardCard } from '@/features/flashcard/types/flashcard'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

const SLOW_SPEECH_RATE = 0.58

export interface FlashcardFlipCardProps {
  card: FlashcardCard
  isFlipped: boolean
  speechLocale?: string
  onToggleFlip: () => void
}

/**
 * Interactive 3D flip flashcard (Front: vocab or single-glyph character guide -> Back: meaning/reading/2-speed audio).
 */
export const FlashcardFlipCard: FC<FlashcardFlipCardProps> = ({
  card,
  isFlipped,
  speechLocale = 'ja-JP',
  onToggleFlip,
}) => {
  const isCharacterCard = card.part_of_speech.toLowerCase().includes('huruf')

  const handleSpeak = (e: MouseEvent<HTMLButtonElement>, text: string, rate?: number) => {
    e.stopPropagation()
    triggerHaptic('tap')
    audioService.speakLanguage(text, speechLocale, undefined, undefined, rate)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="w-full max-w-lg mx-auto cursor-pointer select-none"
        style={{ perspective: '1200px' }}
        onClick={() => {
          triggerHaptic('tap')
          audioService.playCardFlip()
          onToggleFlip()
        }}
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? 'Balik ke sisi depan kartu' : 'Balik untuk melihat arti kartu'}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            triggerHaptic('tap')
            audioService.playCardFlip()
            onToggleFlip()
          }
        }}
      >
        <motion.div
          className="relative w-full min-h-[340px] sm:min-h-[370px]"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.9 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
        {/* ── FRONT FACE ── */}
        <div
          className="absolute inset-0 bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_0_#E2E8F0] flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center justify-between gap-2">
            {card.part_of_speech ? (
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full border font-brand font-black text-[11px] uppercase tracking-wider ${
                  isCharacterCard
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                {card.part_of_speech}
              </span>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => handleSpeak(e, card.front_text, SLOW_SPEECH_RATE)}
                className="h-10 px-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 flex items-center justify-center font-brand font-black text-[11px] transition-colors cursor-pointer"
                title="Putar suara pelan 0.6x"
                aria-label="Putar pelafalan pelan"
              >
                0.6x
              </button>
              <button
                type="button"
                onClick={(e) => handleSpeak(e, card.front_text)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Dengarkan pelafalan"
                aria-label="Dengarkan pelafalan kata"
              >
                <SpeakerHigh weight="bold" className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center my-auto py-4 px-2">
            {isCharacterCard ? (
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/70 flex items-center justify-center shadow-inner">
                <div aria-hidden="true" className="absolute inset-x-4 top-1/2 border-t border-dashed border-slate-200/90" />
                <div aria-hidden="true" className="absolute inset-y-4 left-1/2 border-l border-dashed border-slate-200/90" />
                <h2 className="relative z-10 text-6xl sm:text-7xl font-brand font-black text-slate-900 leading-none select-none">
                  {card.front_text}
                </h2>
              </div>
            ) : (
              <h2 className="text-3xl sm:text-5xl font-brand font-black text-slate-900 tracking-tight leading-snug">
                {card.front_text}
              </h2>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-brand font-bold text-slate-400">
            <ArrowsClockwise weight="bold" className="w-3.5 h-3.5" />
            <span>Ketuk kartu atau tekan Spasi untuk balik</span>
          </div>
        </div>

        {/* ── BACK FACE ── */}
        <div
          className="absolute inset-0 bg-white border-2 border-blue-200 rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_0_#DBEAFE] flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-brand font-black text-[11px] uppercase tracking-wider">
              {isCharacterCard ? 'Bacaan & Arti Huruf' : 'Arti Kosakata'}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => handleSpeak(e, card.front_text, SLOW_SPEECH_RATE)}
                className="h-10 px-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center font-brand font-black text-[11px] transition-colors cursor-pointer"
                title="Putar suara pelan 0.6x"
                aria-label="Putar pelafalan pelan"
              >
                0.6x
              </button>
              <button
                type="button"
                onClick={(e) => handleSpeak(e, card.front_text)}
                className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Dengarkan pelafalan"
                aria-label="Dengarkan pelafalan"
              >
                <SpeakerHigh weight="bold" className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-2.5 my-auto py-4">
            <p className={`${isCharacterCard ? 'text-2xl font-black text-slate-700' : 'text-sm font-bold text-slate-400'}`}>
              {card.front_text}
            </p>
            <p className="text-sm sm:text-base font-mono font-bold text-blue-600 px-3 py-1 rounded-xl bg-blue-50/80 border border-blue-100">
              {card.reading}
            </p>
            <h3 className="text-2xl sm:text-3xl font-brand font-black text-slate-900 leading-snug">
              {card.back_meaning}
            </h3>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-brand font-bold text-slate-400">
            <ArrowsClockwise weight="bold" className="w-3.5 h-3.5" />
            <span>Pilih seberapa mudah kamu mengingatnya di bawah</span>
          </div>
        </div>
        </motion.div>
      </div>
    </MotionConfig>
  )
}
