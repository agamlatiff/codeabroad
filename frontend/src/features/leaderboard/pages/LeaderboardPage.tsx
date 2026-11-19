import { AppLeftSidebar } from "@/shared/components/layout/left-sidebar/AppLeftSidebar"
import { AppTopBar } from "@/shared/components/layout/top-bar/AppTopBar"
import { PageHeroHeader } from "@/shared/components/ui/PageHeroHeader"
import {
  Trophy,
  Clock,
  Sparkle,
  ArrowUp,
  CaretDown,
  Medal,
} from '@phosphor-icons/react'
import type { LeagueDivision } from "@/features/leaderboard/types/leaderboard"
import { LEAGUE_DIVISIONS } from "@/features/leaderboard/constants/divisions"
import { useWeeklyLeaderboard } from "@/features/leaderboard/hooks/useWeeklyLeaderboard"
import { LeaderboardStandingsList } from "@/features/leaderboard/components/LeaderboardStandingsList"
import { triggerHaptic } from "@/shared/utils/haptics"
import { soundEngine } from "@/shared/utils/audio"
import { KodiCharacter } from "@/shared/components/ui/KodiCharacter"

export const LeaderboardPage = () => {
  const {
    leaderboard,
    activeDivision,
    currentDivisionConfig,
    isLoading,
    error,
    selectDivision,
    refetch,
  } = useWeeklyLeaderboard()

  const handleSelectDivision = (div: LeagueDivision) => {
    triggerHaptic('tap')
    soundEngine.playLevelUp()
    selectDivision(div)
  }

  const daysLabel =
    leaderboard?.days_remaining === 0
      ? 'Reset Hari Ini (23:59 WIB)'
      : `${leaderboard?.days_remaining ?? 5} Hari Tersisa`

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. COMPACT NAV RAIL ── */}
      <AppLeftSidebar />
      <div className="flex-1 min-w-0 pb-20 md:pb-12">
        <main className="flex-1 min-w-0 w-full px-4 sm:px-8 lg:px-10 py-6 space-y-6">
          <AppTopBar
            breadcrumbs={[
              { label: 'Beranda', to: '/curriculum' },
              { label: 'Papan Peringkat' },
              { label: currentDivisionConfig.name },
            ]}
          />

          {/* ── UNIFIED CLEAN TACTILE HERO HEADER ── */}
          <PageHeroHeader
            theme="violet"
            icon={<Trophy weight="fill" className="w-6 h-6" />}
            badges={
              <>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-brand font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                  <Trophy weight="fill" className="w-3.5 h-3.5 text-amber-600" />
                  <span>Liga Global Mingguan</span>
                </span>
                <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-brand font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Clock weight="bold" className="w-3 h-3 text-blue-600" />
                  <span>{daysLabel}</span>
                </span>
              </>
            }
            title="Papan Peringkat Liga Mingguan Global"
            description="Bersaing setiap minggu bersama pembelajar bahasa global lainnya di seluruh jalur bahasa. Capai Top 3 di akhir pekan untuk promosi ke divisi yang lebih tinggi!"
            rightSlot={
              <div className="flex items-center gap-3 shrink-0 bg-white border-2 border-violet-200/80 rounded-2xl p-3 shadow-2xs">
                <div className="shrink-0 flex items-center justify-center">
                  <KodiCharacter emotion="onFire" size={56} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-brand font-black text-violet-700 uppercase block">
                    Liga Musim #{leaderboard?.season_week ?? 1}
                  </span>
                  <span className="text-xs font-brand font-black text-slate-900">
                    {currentDivisionConfig.tier}
                  </span>
                </div>
              </div>
            }
          />

          {/* ── 4 GLOBAL LEAGUE DIVISION SELECTOR TABS ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LEAGUE_DIVISIONS.map((div) => {
              const isSelected = activeDivision === div.id
              return (
                <button
                  key={div.id}
                  type="button"
                  onClick={() => handleSelectDivision(div.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 shadow-[0_3px_0_0_#2563EB]'
                      : 'bg-white border-slate-200 hover:border-slate-300 active:translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-brand font-black text-xs sm:text-sm text-slate-900">
                      {div.name}
                    </span>
                    <Medal
                      weight="fill"
                      className={`w-5 h-5 shrink-0 drop-shadow-2xs ${div.iconColor}`}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md inline-block ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {div.xpRange}
                    </span>
                    <span className="text-[10px] font-brand font-bold text-slate-400">
                      {div.levelLabel}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* ── DIVISION RULES & PROMOTION / DEMOTION LEGEND ── */}
          <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-brand font-bold shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <ArrowUp weight="bold" className="w-4 h-4 text-emerald-600" />
              <span>Peringkat 1 – 3: Promosi ke Divisi Berikutnya</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
              <span>Peringkat 4 – 10: Bertahan di Divisi Saat Ini</span>
            </div>
            <div className="flex items-center gap-2 text-rose-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <CaretDown weight="bold" className="w-4 h-4 text-rose-500" />
              <span>Peringkat 11+: Degradasi ke Divisi Bawah</span>
            </div>
          </div>

          {/* ── WEEKLY SEASON PRIZE POOL BANNER ── */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-yellow-500/10 border-2 border-amber-300/80 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-brand font-black text-base shrink-0 shadow-xs">
                <Trophy weight="fill" className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-brand font-black text-amber-950 uppercase tracking-wider">
                    Pool Hadiah Musim #{leaderboard?.season_week ?? 1}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                    {daysLabel}
                  </span>
                </div>
                <p className="text-xs text-amber-800 font-medium">
                  Raih Top 3 setiap akhir minggu (23:59 WIB) untuk memenangkan Gems Hadiah dan promosi otomatis ke divisi berikutnya!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0 self-end sm:self-auto">
              <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl shadow-2xs">
                <span>🥇</span>
                <span>+100 💎</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-xl shadow-2xs">
                <span>🥈</span>
                <span>+50 💎</span>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl shadow-2xs">
                <span>🥉</span>
                <span>+25 💎</span>
              </div>
            </div>
          </div>

          {/* ── LEADERBOARD TABLE ROWS ── */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-4 sm:p-6 space-y-2.5 shadow-xs">
            <LeaderboardStandingsList
              leaderboard={leaderboard}
              divisionConfig={currentDivisionConfig}
              isLoading={isLoading}
              error={error}
              onRetry={() => void refetch()}
            />
          </div>

          {/* ── KODI CHEERING FOOTER ── */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 flex items-center gap-4 shadow-xs">
            <div className="shrink-0 flex items-center justify-center">
              <KodiCharacter emotion="celebrate" size={64} />
            </div>
            <div className="space-y-1">
              <h4 className="font-brand font-black text-xs text-slate-900 flex items-center gap-1">
                <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                <span>Tips Liga Mingguan dari Kodi!</span>
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Peringkat diperbarui secara otomatis setiap kali Anda menyelesaikan pelajaran kurikulum, latihan SRS, dan tantangan harian di bahasa apa pun. Konsistensi 15 menit sehari cukup untuk menembus Divisi Berlian Master!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
