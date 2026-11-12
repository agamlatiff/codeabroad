import type { FC } from 'react'
import {
  Translate,
  Copy,
  Check,
  SpeakerHigh,
  ArrowsClockwise,
} from '@phosphor-icons/react'
import { useDailyLanguageCard } from "@/shared/hooks/layout/right-sidebar/useDailyLanguageCard"

export interface DailyLanguageCardProps {
  className?: string
  onReview?: () => void
}

/**
 * DailyLanguageCard (SSOT)
 * Pure declarative daily workplace vocabulary card in AppRightSidebar.
 * Adapts dynamically to the user's targeted career destination (Tokyo 🇯🇵, Berlin 🇩🇪, Singapore 🇸🇬, London 🇬🇧).
 * Powered 1:1 by useDailyLanguageCard.
 */
export const DailyLanguageCard: FC<DailyLanguageCardProps> = ({
  className = '',
  onReview,
}) => {
  const {
    languageMeta,
    isLoading,
    currentVocab,
    activeStepNumber,
    totalVocabsCount,
    copied,
    isPlayingAudio,
    handleNextVocab,
    handleCopy,
    handleSpeak,
  } = useDailyLanguageCard({ onReview })

  if (isLoading || !currentVocab) {
    return (
      <div id="daily-language-card" className={`space-y-2.5 select-none scroll-mt-20 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 animate-pulse" />
            <div className="space-y-1">
              <div className="w-24 h-3 bg-slate-200 rounded animate-pulse" />
              <div className="w-16 h-2 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-16 h-5 bg-slate-100 rounded-full animate-pulse" />
        </div>
        <div className="h-16 bg-rose-50/40 border border-rose-100 rounded-2xl animate-pulse" />
        <div className="h-12 bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
        <div className="h-8 bg-blue-50 border border-blue-100 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div id="daily-language-card" className={`space-y-2.5 select-none scroll-mt-20 ${className}`}>
      {/* ── CARD HEADER (DYNAMIC TO DESTINATION COUNTRY) ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 text-xs">
            {languageMeta.flagEmoji ? (
              <span className="text-sm leading-none">{languageMeta.flagEmoji}</span>
            ) : (
              <Translate weight="bold" className="w-4 h-4 text-rose-600" />
            )}
          </div>
          <div>
            <h4 className="font-brand font-black text-xs text-slate-900 leading-none">
              {languageMeta.languageTitle}
            </h4>
            <span className="text-[9px] text-slate-400 font-medium">
              {currentVocab.level}
            </span>
          </div>
        </div>

        {/* Rotate to Next Vocab Pill */}
        {totalVocabsCount > 1 && (
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
        )}
      </div>

      {/* ── VOCABULARY PILL ROW (CLEAN SEAMLESS ROW) ── */}
      <div className="flex items-center justify-between gap-2 p-2.5 bg-rose-50/50 border border-rose-200/70 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span className="font-brand font-black text-2xl text-slate-900 tracking-wider">
            {currentVocab.kanji}
          </span>
          {currentVocab.kana && (
            <span className="bg-white text-rose-800 border border-rose-200 font-brand font-black text-[10px] px-2 py-0.5 rounded-lg shadow-2xs">
              {currentVocab.kana}
              {currentVocab.romaji ? ` • ${currentVocab.romaji}` : ''}
            </span>
          )}
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
            title={`Dengarkan Pengucapan Asli (${languageMeta.ttsLangCode})`}
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
      {currentVocab.contoh && (
        <div className="flex items-start justify-between gap-2 p-2 bg-slate-50 border border-slate-200/60 rounded-xl">
          <div className="text-[10px] space-y-0.5 min-w-0">
            <p className="font-brand font-bold italic text-slate-800 leading-snug">
              "{currentVocab.contoh}"
            </p>
            {currentVocab.terjemahan && (
              <p className="text-slate-500 font-medium leading-snug">
                "{currentVocab.terjemahan}"
              </p>
            )}
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
      )}
    </div>
  )
}

