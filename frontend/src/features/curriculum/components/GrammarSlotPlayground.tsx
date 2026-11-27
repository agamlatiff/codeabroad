import { useState, type FC } from 'react'
import { MagicWand, Plus, SpeakerHigh } from '@phosphor-icons/react'
import type {
  GrammarExampleBreakdown,
  GrammarRole,
} from '@/features/curriculum/types/curriculum'
import { getGrammarRoleStyle } from '@/features/curriculum/constants/grammarStyles'
import {
  GRAMMAR_SLOT_PRESETS,
  type GrammarSlotPreset,
} from '@/features/curriculum/constants/grammarSlotPresets'
import { triggerHaptic } from '@/shared/utils/haptics'

const SLOW_SPEECH_RATE = 0.58

export interface GrammarSlotPlaygroundProps {
  pointId: string
  pointCode: string
  breakdowns?: GrammarExampleBreakdown[]
  showRomaji: boolean
  playingExampleKey: string | null
  onPlayAudio: (key: string, text: string, rate?: number) => void
}

interface BuiltTile {
  jp: string
  reading: string
  label: string
  role: GrammarRole
}

const CuratedSlotBuilder: FC<{
  pointId: string
  preset: GrammarSlotPreset
  showRomaji: boolean
  playingExampleKey: string | null
  onPlayAudio: (key: string, text: string, rate?: number) => void
}> = ({ pointId, preset, showRomaji, playingExampleKey, onPlayAudio }) => {
  const [slot1Idx, setSlot1Idx] = useState(0)
  const [slot2Idx, setSlot2Idx] = useState(0)

  const opt1 = preset.slot1Options[slot1Idx] ?? preset.slot1Options[0]
  const opt2 = preset.slot2Options[slot2Idx] ?? preset.slot2Options[0]

  const tiles: BuiltTile[] = [
    { jp: opt1.jp, reading: opt1.reading, label: opt1.meaning, role: preset.slot1Role },
    ...(preset.middleFixed ? [preset.middleFixed] : []),
    { jp: opt2.jp, reading: opt2.reading, label: opt2.meaning, role: preset.slot2Role },
    ...(preset.endingFixed ? [preset.endingFixed] : []),
  ]

  const fullJapanese = tiles.map((t) => t.jp).join('')
  const fullRomaji = tiles.map((t) => t.reading).join(' ')
  const fullTranslation = preset.buildTranslation(opt1, opt2)

  const normalKey = `${pointId}-builder-normal`
  const slowKey = `${pointId}-builder-slow`
  const isPlayingNormal = playingExampleKey === normalKey
  const isPlayingSlow = playingExampleKey === slowKey

  return (
    <section className="bg-white border-2 border-blue-200/90 rounded-3xl p-5 sm:p-7 space-y-5 shadow-[0_6px_0_0_#DBEAFE]">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-brand font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
            <MagicWand weight="fill" className="w-3.5 h-3.5" />
            <span>Coba Rakit Sendiri</span>
          </span>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {preset.promptHint}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onPlayAudio(normalKey, fullJapanese)}
            aria-label={`Dengarkan kalimat rakitan: ${fullJapanese}`}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl border-2 font-brand font-black text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
              isPlayingNormal
                ? 'bg-blue-600 border-blue-700 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 border-blue-700 text-white shadow-[0_3px_0_0_#1D4ED8]'
            }`}
          >
            <SpeakerHigh weight="fill" className="w-4 h-4" />
            <span>Dengar Kalimatmu</span>
          </button>
          <button
            type="button"
            onClick={() => onPlayAudio(slowKey, fullJapanese, SLOW_SPEECH_RATE)}
            aria-label={`Dengarkan pelan kalimat rakitan: ${fullJapanese}`}
            className={`min-h-[40px] px-3 py-2 rounded-xl border-2 font-brand font-black text-xs inline-flex items-center gap-1 transition-all cursor-pointer active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
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

      {/* Live Assembled Sentence Stage */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-50/70 via-white to-slate-50 border-2 border-slate-200/90 p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {tiles.map((tile, idx) => {
            const style = getGrammarRoleStyle(tile.role)
            const tileKey = `${pointId}-builder-tile-${idx}`
            return (
              <div key={`${tile.jp}-${idx}`} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPlayAudio(tileKey, tile.jp)}
                  aria-label={`Dengar kata ${tile.jp} (${tile.label})`}
                  className={`rounded-2xl border-2 px-3.5 py-2 text-center shadow-2xs transition-transform active:scale-95 hover:brightness-98 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${style.block}`}
                >
                  <div className="font-brand font-black text-base sm:text-lg leading-tight">
                    {tile.jp}
                  </div>
                  {showRomaji && (
                    <div className={`text-[11px] font-bold leading-tight mt-0.5 ${style.label}`}>
                      {tile.reading}
                    </div>
                  )}
                  <div className="text-[11px] font-semibold text-slate-600 leading-tight mt-0.5 border-t border-black/10 pt-0.5">
                    {tile.label}
                  </div>
                </button>
                {idx < tiles.length - 1 && (
                  <Plus weight="bold" className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                )}
              </div>
            )
          })}
        </div>

        <div className="pt-2.5 border-t border-slate-200/80 space-y-0.5">
          {showRomaji && (
            <p className="text-xs sm:text-sm font-mono font-bold text-blue-700">
              {fullRomaji}
            </p>
          )}
          <p className="text-sm sm:text-base font-brand font-black text-slate-900">
            &ldquo;{fullTranslation}&rdquo;
          </p>
        </div>
      </div>

      {/* Interactive Slot Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <span className="text-xs font-brand font-black text-slate-700 block">
            {preset.slot1Label}
          </span>
          <div role="group" aria-label={preset.slot1Label} className="flex flex-wrap gap-2">
            {preset.slot1Options.map((option, idx) => {
              const isSelected = slot1Idx === idx
              return (
                <button
                  key={option.jp}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    triggerHaptic('tap')
                    setSlot1Idx(idx)
                  }}
                  className={`min-h-[42px] px-3 py-1.5 rounded-xl border-2 text-left transition-all cursor-pointer active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    isSelected
                      ? 'bg-blue-600 border-blue-700 text-white shadow-[0_2px_0_0_#1D4ED8]'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-blue-50/40'
                  }`}
                >
                  <span className="font-brand font-black text-xs sm:text-sm block leading-tight">
                    {option.meaning}
                  </span>
                  <span
                    className={`text-[11px] font-medium block leading-tight ${
                      isSelected ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {option.jp}{showRomaji ? ` (${option.reading})` : ''}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-brand font-black text-slate-700 block">
            {preset.slot2Label}
          </span>
          <div role="group" aria-label={preset.slot2Label} className="flex flex-wrap gap-2">
            {preset.slot2Options.map((option, idx) => {
              const isSelected = slot2Idx === idx
              return (
                <button
                  key={option.jp}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    triggerHaptic('tap')
                    setSlot2Idx(idx)
                  }}
                  className={`min-h-[42px] px-3 py-1.5 rounded-xl border-2 text-left transition-all cursor-pointer active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-700 text-white shadow-[0_2px_0_0_#047857]'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/40'
                  }`}
                >
                  <span className="font-brand font-black text-xs sm:text-sm block leading-tight">
                    {option.meaning}
                  </span>
                  <span
                    className={`text-[11px] font-medium block leading-tight ${
                      isSelected ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    {option.jp}{showRomaji ? ` (${option.reading})` : ''}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Interactive beginner sentence playground:
 * - For flagship N5 grammar patterns, renders a live mix-and-match Slot Builder.
 * - For all other patterns with word breakdowns, renders an interactive tap-to-hear Sentence Explorer.
 */
export const GrammarSlotPlayground: FC<GrammarSlotPlaygroundProps> = ({
  pointId,
  pointCode,
  breakdowns,
  showRomaji,
  playingExampleKey,
  onPlayAudio,
}) => {
  const [selectedBreakdownIdx, setSelectedBreakdownIdx] = useState(0)
  const preset = GRAMMAR_SLOT_PRESETS[pointCode.toUpperCase()]

  if (preset) {
    return (
      <CuratedSlotBuilder
        pointId={pointId}
        preset={preset}
        showRomaji={showRomaji}
        playingExampleKey={playingExampleKey}
        onPlayAudio={onPlayAudio}
      />
    )
  }

  if (!breakdowns || breakdowns.length === 0) return null

  const activeIndex = Math.min(selectedBreakdownIdx, breakdowns.length - 1)
  const activeBreakdown = breakdowns[activeIndex]
  const spacedTokens = activeBreakdown.tokens.map((t) => t.jp).join(' ')
  const ttsText = /[\u3040-\u30ff\u4e00-\u9faf]/.test(spacedTokens)
    ? activeBreakdown.tokens.map((t) => t.jp).join('')
    : spacedTokens
  const normalKey = `${pointId}-explorer-${activeIndex}-normal`
  const slowKey = `${pointId}-explorer-${activeIndex}-slow`
  const isPlayingNormal = playingExampleKey === normalKey
  const isPlayingSlow = playingExampleKey === slowKey

  return (
    <section className="bg-white border-2 border-blue-200/90 rounded-3xl p-5 sm:p-7 space-y-4 shadow-[0_6px_0_0_#DBEAFE]">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-brand font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
            <MagicWand weight="fill" className="w-3.5 h-3.5" />
            <span>Bedah &amp; Dengar Tiap Potongan Kata</span>
          </span>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Ketuk tiap balok kata untuk mendengar bunyinya satu per satu, atau pilih variasi kalimat di bawah.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onPlayAudio(normalKey, ttsText)}
            aria-label={`Putar kalimat penuh: ${ttsText}`}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl border-2 font-brand font-black text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
              isPlayingNormal
                ? 'bg-blue-600 border-blue-700 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 border-blue-700 text-white shadow-[0_3px_0_0_#1D4ED8]'
            }`}
          >
            <SpeakerHigh weight="fill" className="w-4 h-4" />
            <span>Dengar Penuh</span>
          </button>
          <button
            type="button"
            onClick={() => onPlayAudio(slowKey, ttsText, SLOW_SPEECH_RATE)}
            aria-label={`Putar pelan kalimat: ${ttsText}`}
            className={`min-h-[40px] px-3 py-2 rounded-xl border-2 font-brand font-black text-xs inline-flex items-center gap-1 transition-all cursor-pointer active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
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

      {breakdowns.length > 1 && (
        <div role="group" aria-label="Pilih contoh kalimat" className="flex flex-wrap gap-2">
          {breakdowns.map((_, idx) => {
            const isSelected = activeIndex === idx
            return (
              <button
                key={`pick-${idx}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  triggerHaptic('tap')
                  setSelectedBreakdownIdx(idx)
                }}
                className={`px-3 py-1.5 rounded-xl border-2 text-xs font-brand font-black transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  isSelected
                    ? 'bg-blue-600 border-blue-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-white'
                }`}
              >
                Kalimat {idx + 1}
              </button>
            )
          })}
        </div>
      )}

      <div className="rounded-2xl bg-slate-50/80 border-2 border-slate-200/80 p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap gap-2">
          {activeBreakdown.tokens.map((tok, tIdx) => {
            const style = getGrammarRoleStyle(tok.role)
            return (
              <button
                key={`${tok.jp}-${tIdx}`}
                type="button"
                onClick={() => onPlayAudio(`${pointId}-exp-tok-${activeIndex}-${tIdx}`, tok.jp)}
                aria-label={`Dengar kata ${tok.jp}${tok.meaning ? `: ${tok.meaning}` : ''}`}
                className={`rounded-2xl border-2 px-3.5 py-2 text-center shadow-2xs min-w-[64px] transition-transform active:scale-95 hover:brightness-98 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${style.block}`}
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
              </button>
            )
          })}
        </div>

        <div className="pt-2 border-t border-slate-200/80">
          <p className="text-sm sm:text-base font-brand font-black text-slate-900">
            &ldquo;{activeBreakdown.translation}&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}
