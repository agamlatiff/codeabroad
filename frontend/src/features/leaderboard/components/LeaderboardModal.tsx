import { useState } from 'react'
import {
  Trophy,
  CaretDown,
  Clock,
  Sparkle,
  X,
  ArrowUp,
  Medal,
} from '@phosphor-icons/react'
import type { LeagueDivision } from "@/features/leaderboard/types/leaderboard"
import { LEAGUE_DIVISIONS } from "@/features/leaderboard/constants/divisions"
import { useWeeklyLeaderboard } from "@/features/leaderboard/hooks/useWeeklyLeaderboard"
import { LeaderboardStandingsList } from "@/features/leaderboard/components/LeaderboardStandingsList"
import { AccessibleModal } from "@/shared/components/ui/AccessibleModal"
import { triggerHaptic } from "@/shared/utils/haptics"
import { audioEngine } from "@/shared/utils/audio"
import { KodiCharacter } from "@/shared/components/ui/KodiCharacter"

export interface LeaderboardModalProps {
  isOpen: boolean
  onClose: () => void
  initialDivision?: LeagueDivision
}

export const LeaderboardModal = ({
  isOpen,
  onClose,
  initialDivision,
}: LeaderboardModalProps) => {
  const {
    leaderboard,
    activeDivision,
    currentDivisionConfig,
    isLoading,
    error,
    selectDivision,
    resetDivision,
    refetch,
  } = useWeeklyLeaderboard({ enabled: isOpen, initialDivision })

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const [prevInitialDivision, setPrevInitialDivision] = useState(initialDivision)

  if (isOpen !== prevIsOpen || initialDivision !== prevInitialDivision) {
    setPrevIsOpen(isOpen)
    setPrevInitialDivision(initialDivision)
    if (isOpen) {
      resetDivision(initialDivision)
    }
  }

  const handleSelectDivision = (div: LeagueDivision) => {
    triggerHaptic('tap')
    audioEngine.playPop()
    selectDivision(div)
  }

  const daysLabel =
    leaderboard?.days_remaining === 0
      ? 'Reset Hari Ini (23:59 WIB)'
      : `${leaderboard?.days_remaining ?? 5} Hari Tersisa`

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Papan Peringkat Liga Mingguan Global"
      backdropClassName="bg-slate-900/60 backdrop-blur-xs"
    >
      {/* Main Modal Card */}
      <div className="relative w-full max-w-2xl bg-white border-2 border-slate-200/90 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* ── 1. MODAL HEADER ── */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-brand font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Trophy weight="fill" className="w-3.5 h-3.5 text-amber-600" />
                <span>Liga Global Mingguan</span>
              </span>
              <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-brand font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock weight="bold" className="w-3 h-3 text-blue-600" />
                <span>{daysLabel}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-brand font-black text-slate-900 tracking-tight">
              Papan Peringkat Mingguan
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Kumpulkan XP dari seluruh bahasa target &amp; latihan SRS untuk promosi ke divisi berikutnya!
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-2xl border-2 border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
            aria-label="Tutup papan peringkat"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {/* ── 2. 4 GLOBAL LEAGUE SELECTOR TABS ── */}
        <div className="px-4 sm:px-5 pt-4 pb-2 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {LEAGUE_DIVISIONS.map((div) => {
            const isSelected = activeDivision === div.id
            return (
              <button
                key={div.id}
                type="button"
                onClick={() => handleSelectDivision(div.id)}
                className={`flex-1 min-w-[130px] p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 shadow-[0_3px_0_0_#2563EB]'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600 active:translate-y-0.5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Medal
                    weight="fill"
                    className={`w-4 h-4 shrink-0 drop-shadow-2xs ${div.iconColor}`}
                  />
                  <span className="font-brand font-black text-xs text-slate-900">
                    {div.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {div.xpRange}
                  </span>
                  <span className="text-[9px] font-brand font-bold text-slate-400">
                    {div.levelLabel}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── 3. PROMOTION ZONE RULES BANNER ── */}
        <div className="px-5 py-2.5 bg-slate-50/80 border-b border-slate-200/60 flex items-center justify-between text-[11px] font-brand font-bold">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <ArrowUp weight="bold" className="w-3.5 h-3.5 text-emerald-600" />
            <span>Top 3: Promosi ke Divisi Berikutnya</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-600">
            <CaretDown weight="bold" className="w-3.5 h-3.5 text-rose-500" />
            <span>Bawah: Degradasi Divisi</span>
          </div>
        </div>

        {/* ── 3.5. WEEKLY PRIZE POOL BANNER ── */}
        <div className="mx-4 sm:mx-6 my-2.5 p-3 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-yellow-500/10 border border-amber-300/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-brand font-black text-xs shrink-0 shadow-2xs">
              <Trophy weight="fill" className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-brand font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <span>Hadiah Musim Minggu #{leaderboard?.season_week ?? 1}</span>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded-md font-mono">
                  {daysLabel}
                </span>
              </div>
              <div className="text-[10px] text-amber-800 font-medium">
                Selesai Minggu 23:59 WIB • Top 3 otomatis dapat bonus Gems Hadiah &amp; promosi divisi!
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold shrink-0 self-end sm:self-auto">
            <span className="bg-amber-100 border border-amber-300 text-amber-900 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
              🥇 +100 💎
            </span>
            <span className="bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
              🥈 +50 💎
            </span>
            <span className="bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
              🥉 +25 💎
            </span>
          </div>
        </div>

        {/* ── 4. LEADERBOARD COMPETITOR LIST ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 bg-[#FAFAF9]">
          <LeaderboardStandingsList
            leaderboard={leaderboard}
            divisionConfig={currentDivisionConfig}
            isLoading={isLoading}
            error={error}
            compact
            onRetry={() => void refetch()}
            onNavigateBeforeCurriculum={onClose}
          />
        </div>

        {/* ── 5. KODI CHEERING FOOTER BANNER ── */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <div className="shrink-0 flex items-center justify-center">
            <KodiCharacter emotion="celebrate" size={54} />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-brand font-black text-xs text-slate-900 flex items-center gap-1">
              <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-500" />
              <span>Semangat Belajar, Penjelajah Bahasa!</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Selesaikan pelajaran bahasa harian dan latihan SRS untuk naik ke puncak Divisi Berlian Master!
            </p>
          </div>
        </div>
      </div>
    </AccessibleModal>
  )
}
