import type { FC } from 'react'
import {
  Translate,
  Copy,
  Check,
  SpeakerHigh,
  ArrowsClockwise,
  BookOpen,
  CheckCircle,
  Sparkle,
  Lightning,
} from '@phosphor-icons/react'
import { Button3D } from '../../ui/Button3D'
import { triggerHaptic } from '../../../utils/haptics'
import { useNihongoCard } from '../../../hooks/layout/right-sidebar/useNihongoCard'

export interface NihongoCardProps {
  className?: string
  isReviewed?: boolean
  isClaimed?: boolean
  onReview?: () => void
  onClaim?: (e?: React.MouseEvent) => void
}

/**
 * NihongoCard (SSOT)
 * Pure declarative daily Tokyo IT vocabulary review card in AppRightSidebar.
 * Powered 1:1 by useNihongoCard.
 */
export const NihongoCard: FC<NihongoCardProps> = ({
  className = '',
  isReviewed = false,
  isClaimed = false,
  onReview,
  onClaim,
}) => {
  const {
    currentVocab,
    activeStepNumber,
    totalVocabsCount,
    copied,
    isPlayingAudio,
    handleNextVocab,
    handleCopy,
    handleSpeak,
  } = useNihongoCard({ onReview })

  return (
    <div id="tech-nihongo-card" className={`space-y-2.5 select-none scroll-mt-20 ${className}`}>
      {/* ── CARD HEADER ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <Translate weight="bold" className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <h4 className="font-brand font-black text-xs text-slate-900 leading-none">
              Bahasa Jepang Tokyo
            </h4>
            <span className="text-[9px] text-slate-400 font-medium">
              {currentVocab.level}
            </span>
          </div>
        </div>

        {/* Rotate to Next Vocab Pill */}
        <button
          type="button"
          onClick={handleNextVocab}
          className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-brand font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs transition-all cursor-pointer active:scale-95"
          title="Lihat kosakata berikutnya"
        >
          <ArrowsClockwise weight="bold" className="w-2.5 h-2.5 text-slate-500" />
          <span>
            GANTI ({activeStepNumber}/{totalVocabsCount})
          </span>
        </button>
      </div>

      {/* ── VOCABULARY PILL ROW (CLEAN SEAMLESS ROW) ── */}
      <div className="flex items-center justify-between gap-2 p-2.5 bg-rose-50/50 border border-rose-200/70 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span className="font-brand font-black text-2xl text-slate-900 tracking-wider">
            {currentVocab.kanji}
          </span>
          <span className="bg-white text-rose-800 border border-rose-200 font-brand font-black text-[10px] px-2 py-0.5 rounded-lg shadow-2xs">
            {currentVocab.kana}
            {currentVocab.romaji ? ` • ${currentVocab.romaji}` : ''}
          </span>
          <span className="inline-flex items-center gap-1 bg-white text-blue-700 border border-blue-200 font-brand font-black text-[10px] px-2 py-0.5 rounded-md shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            <span>{currentVocab.arti}</span>
          </span>
        </div>

        {/* Audio Pronunciation & Copy Button */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handleSpeak()}
            className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:translate-y-0.5 ${
              isPlayingAudio
                ? 'bg-rose-500 border-rose-600 text-white scale-105'
                : 'bg-white border-slate-200 hover:border-rose-400 text-slate-700 hover:text-rose-600'
            }`}
            title="Dengarkan Pengucapan Asli (ja-JP)"
          >
            <SpeakerHigh
              weight="fill"
              className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`}
            />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="w-7 h-7 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 shadow-2xs active:translate-y-0.5 flex items-center justify-center transition-all cursor-pointer"
            title="Salin Kosakata"
          >
            {copied ? (
              <Check weight="bold" className="w-3.5 h-3.5 text-emerald-600 stroke-[2]" />
            ) : (
              <Copy weight="bold" className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ── CONVERSATION DIALOGUE ── */}
      <div className="flex items-start justify-between gap-2 p-2 bg-slate-50 border border-slate-200/60 rounded-xl">
        <div className="text-[10px] space-y-0.5 min-w-0">
          <p className="font-brand font-bold italic text-slate-800 leading-snug">
            "{currentVocab.contoh}"
          </p>
          <p className="text-slate-500 font-medium leading-snug">
            "{currentVocab.terjemahan}"
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleSpeak(currentVocab.contoh)}
          className="shrink-0 p-1.5 rounded-lg bg-white border border-slate-200 hover:border-rose-400 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer shadow-2xs active:translate-y-0.5"
          title="Dengarkan Contoh Kalimat Percakapan"
        >
          <SpeakerHigh weight="bold" className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── INTERACTIVE TASK ACTION ── */}
      <div className="pt-1.5 pb-0.5 space-y-1.5">
        {isClaimed ? (
          <div className="flex items-center justify-between p-2 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-emerald-800 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[10px] font-brand font-black">
                Misi Selesai (+30 XP) ✓
              </span>
            </div>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded">
              BESOK KOSAKATA BARU
            </span>
          </div>
        ) : isReviewed ? (
          <div className="space-y-1.5 animate-pop">
            <div className="flex items-center justify-between p-1.5 bg-amber-50/90 border border-amber-200 rounded-xl text-amber-900 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <Sparkle weight="fill" className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-[10px] font-brand font-black">
                  Kosakata Telah Dipelajari!
                </span>
              </div>
              <span className="text-[9px] font-bold text-amber-800 bg-amber-200/90 px-1.5 py-0.5 rounded">
                SIAP KLAIM
              </span>
            </div>
            <Button3D
              variant="amber"
              size="sm"
              onClick={(e) => {
                triggerHaptic('success')
                onClaim?.(e)
              }}
              className="w-full text-[11px] font-brand font-black flex items-center justify-center gap-1.5 py-2 shadow-[0_2.5px_0_0_#B45309]"
            >
              <Lightning weight="fill" className="w-3.5 h-3.5 text-amber-950" />
              <span>KLAIM +30 XP SEKARANG ⚡</span>
            </Button3D>
          </div>
        ) : (
          <Button3D
            variant="blue"
            size="sm"
            onClick={() => {
              handleSpeak()
              onReview?.()
            }}
            className="w-full text-[11px] font-brand font-black flex items-center justify-center gap-2 py-2 shadow-[0_2.5px_0_0_#1D4ED8]"
          >
            <BookOpen weight="bold" className="w-3.5 h-3.5 text-white" />
            <span>PELAJARI KOSAKATA (+30 XP) 🎧</span>
          </Button3D>
        )}
      </div>
    </div>
  )
}

