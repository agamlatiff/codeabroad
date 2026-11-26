import type { FC } from 'react'
import { Quotes, SpeakerHigh } from '@phosphor-icons/react'
import type {
  GrammarExample,
  GrammarExampleBreakdown,
} from '@/features/curriculum/types/curriculum'
import { getGrammarRoleStyle } from '@/features/curriculum/constants/grammarStyles'

const LEVEL_TAGS = ['Mudah', 'Menengah', 'Lengkap']

export interface GrammarWordBreakdownSectionProps {
  pointId: string
  breakdowns?: GrammarExampleBreakdown[]
  fallbackExamples?: GrammarExample[]
  showRomaji: boolean
  playingExampleKey: string | null
  onPlayAudio: (key: string, japaneseText: string, rate?: number) => void
}

const SLOW_SPEECH_RATE = 0.58

/**
 * Displays 3 progressive Japanese sentences broken down into word-by-word color tiles
 * matching the formula colors, with Hepburn reading, Indonesian word meaning, and 2-speed audio.
 */
export const GrammarWordBreakdownSection: FC<GrammarWordBreakdownSectionProps> = ({
  pointId,
  breakdowns,
  fallbackExamples = [],
  showRomaji,
  playingExampleKey,
  onPlayAudio,
}) => {
  const hasBreakdowns = Array.isArray(breakdowns) && breakdowns.length > 0

  if (!hasBreakdowns && fallbackExamples.length === 0) {
    return null
  }

  return (
    <section className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-[0_6px_0_0_#E2E8F0]">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="space-y-0.5">
          <h2 className="inline-flex items-center gap-2 text-sm sm:text-base font-brand font-black text-slate-900">
            <Quotes weight="fill" className="w-4 h-4 text-blue-600" />
            <span>
              {hasBreakdowns
                ? `Contoh Dipecah Per Kata (${breakdowns.length})`
                : `Contoh Kalimat Nyata (${fallbackExamples.length})`}
            </span>
          </h2>
          {hasBreakdowns && (
            <p className="text-xs text-slate-500 font-medium">
              Warna tiap kotak mengikuti peran kata pada rumus di atas.
            </p>
          )}
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Dengarkan kecepatan normal atau 0.6x
        </span>
      </div>

      <div className="space-y-4">
        {hasBreakdowns
          ? breakdowns.map((bd, idx) => {
              const fullJp = bd.tokens.map((t) => t.jp).join(' ')
              const ttsJp = bd.tokens.map((t) => t.jp).join('')
              const normalKey = `${pointId}-bd-${idx}-normal`
              const slowKey = `${pointId}-bd-${idx}-slow`
              const isPlayingNormal = playingExampleKey === normalKey
              const isPlayingSlow = playingExampleKey === slowKey
              const tierLabel = LEVEL_TAGS[idx] ?? `Contoh ${idx + 1}`

              return (
                <div
                  key={`${pointId}-bd-${idx}`}
                  className="rounded-2xl bg-slate-50/75 border-2 border-slate-200/80 p-4 sm:p-5 space-y-3.5"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-black text-slate-600 shadow-2xs">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {tierLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onPlayAudio(normalKey, ttsJp)}
                        aria-label={`Putar audio kecepatan normal: ${fullJp}`}
                        className={`h-9 px-3 rounded-xl border-2 font-brand font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 shadow-2xs ${
                          isPlayingNormal
                            ? 'bg-blue-600 border-blue-700 text-white animate-pulse'
                            : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                        }`}
                      >
                        <SpeakerHigh weight="fill" className="w-3.5 h-3.5" />
                        <span>Normal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onPlayAudio(slowKey, ttsJp, SLOW_SPEECH_RATE)}
                        aria-label={`Putar audio kecepatan pelan: ${fullJp}`}
                        className={`h-9 px-2.5 rounded-xl border-2 font-brand font-black text-xs flex items-center gap-1 transition-all cursor-pointer active:translate-y-0.5 shadow-2xs ${
                          isPlayingSlow
                            ? 'bg-blue-600 border-blue-700 text-white animate-pulse'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <SpeakerHigh weight="bold" className="w-3.5 h-3.5 text-blue-600" />
                        <span>0.6x</span>
                      </button>
                    </div>
                  </div>

                  {/* Word-by-word tiles */}
                  <div className="flex flex-wrap gap-2">
                    {bd.tokens.map((tok, tIdx) => {
                      const style = getGrammarRoleStyle(tok.role)
                      return (
                        <div
                          key={`${tok.jp}-${tIdx}`}
                          className={`rounded-xl border px-3 py-2 text-center shadow-2xs min-w-[60px] ${style.block}`}
                        >
                          <div className="font-brand font-black text-base sm:text-lg leading-tight">
                            {tok.jp}
                          </div>
                          {showRomaji && tok.reading && (
                            <div className={`text-[11px] font-bold leading-tight mt-0.5 ${style.label}`}>
                              {tok.reading}
                            </div>
                          )}
                          {tok.meaning && (
                            <div className="text-[11px] font-medium text-slate-600 leading-tight mt-0.5 border-t border-black/10 pt-0.5">
                              {tok.meaning}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Complete Indonesian translation */}
                  <div className="pt-2 border-t border-slate-200/80 flex items-baseline gap-2">
                    <span className="text-[11px] font-brand font-black uppercase tracking-wider text-slate-500 shrink-0">
                      Arti:
                    </span>
                    <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                      “{bd.translation}”
                    </p>
                  </div>
                </div>
              )
            })
          : fallbackExamples.map((ex, idx) => {
              const normalKey = `${pointId}-${idx}-normal`
              const slowKey = `${pointId}-${idx}-slow`
              const isPlayingNormal = playingExampleKey === normalKey
              const isPlayingSlow = playingExampleKey === slowKey

              return (
                <div
                  key={`${pointId}-${idx}`}
                  className="rounded-2xl bg-slate-50/90 hover:bg-slate-50 border-2 border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <span className="mt-0.5 px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-black text-slate-500 shrink-0 shadow-2xs">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 space-y-1 flex-1">
                      <p className="font-brand font-black text-base sm:text-lg text-slate-900 break-words leading-snug">
                        {ex.jp}
                      </p>
                      {showRomaji && ex.reading && (
                        <p className="text-xs sm:text-sm font-bold text-blue-600 break-words">
                          {ex.reading}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                        {ex.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onPlayAudio(normalKey, ex.jp)}
                      aria-label={`Putar audio kecepatan normal: ${ex.jp}`}
                      className={`h-10 px-3.5 rounded-xl border-2 font-brand font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 shadow-2xs ${
                        isPlayingNormal
                          ? 'bg-blue-600 border-blue-700 text-white animate-pulse'
                          : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                      }`}
                    >
                      <SpeakerHigh weight="fill" className="w-4 h-4" />
                      <span>Normal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onPlayAudio(slowKey, ex.jp, SLOW_SPEECH_RATE)}
                      aria-label={`Putar audio kecepatan pelan: ${ex.jp}`}
                      className={`h-10 px-3 rounded-xl border-2 font-brand font-black text-xs flex items-center gap-1 transition-all cursor-pointer active:translate-y-0.5 shadow-2xs ${
                        isPlayingSlow
                          ? 'bg-blue-600 border-blue-700 text-white animate-pulse'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <SpeakerHigh weight="bold" className="w-3.5 h-3.5 text-blue-600" />
                      <span>0.6x</span>
                    </button>
                  </div>
                </div>
              )
            })}
      </div>
    </section>
  )
}
