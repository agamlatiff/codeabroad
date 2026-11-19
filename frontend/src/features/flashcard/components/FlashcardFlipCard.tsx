import type { FC, MouseEvent } from 'react'
import { SpeakerHigh, ArrowsClockwise } from '@phosphor-icons/react'
import type { FlashcardCard } from '@/features/flashcard/types/flashcard'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

export interface FlashcardFlipCardProps {
  card: FlashcardCard
  isFlipped: boolean
  onToggleFlip: () => void
}

/**
 * Interactive 3D flip flashcard (Front: vocab/visual/audio -> Back: meaning/reading/example sentence).
 */
export const FlashcardFlipCard: FC<FlashcardFlipCardProps> = ({
  card,
  isFlipped,
  onToggleFlip,
}) => {
  const handleSpeak = (e: MouseEvent<HTMLButtonElement>, text: string) => {
    e.stopPropagation()
    triggerHaptic('tap')
    audioService.speakJapanese(text)
  }

  return (
    <div
      className="w-full max-w-lg mx-auto cursor-pointer select-none"
      style={{ perspective: '1200px' }}
      onClick={() => {
        triggerHaptic('tap')
        onToggleFlip()
      }}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? 'Balik ke sisi depan kartu' : 'Balik untuk melihat arti kartu'}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          triggerHaptic('tap')
          onToggleFlip()
        }
      }}
    >
      <div
        className="relative w-full min-h-[340px] sm:min-h-[370px] transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── FRONT FACE ── */}
        <div
          className="absolute inset-0 bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_0_#E2E8F0] flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center justify-between gap-2">
            {card.part_of_speech ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-brand font-black text-[11px] uppercase tracking-wider">
                {card.part_of_speech}
              </span>
            ) : (
              <span />
            )}

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

          <div className="flex flex-col items-center justify-center text-center my-auto py-6 px-2">
            <h2 className="text-3xl sm:text-5xl font-brand font-black text-slate-900 tracking-tight leading-snug">
              {card.front_text}
            </h2>
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
              Arti Kosakata
            </span>

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

          <div className="flex flex-col items-center text-center space-y-2.5 my-auto py-4">
            <p className="text-sm font-bold text-slate-400">
              {card.front_text}
            </p>
            <p className="text-sm font-mono font-bold text-blue-600">
              {card.reading}
            </p>
            <h3 className="text-3xl sm:text-4xl font-brand font-black text-slate-900 leading-snug">
              {card.back_meaning}
            </h3>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-brand font-bold text-slate-400">
            <ArrowsClockwise weight="bold" className="w-3.5 h-3.5" />
            <span>Pilih seberapa mudah kamu mengingatnya di bawah</span>
          </div>
        </div>
      </div>
    </div>
  )
}
