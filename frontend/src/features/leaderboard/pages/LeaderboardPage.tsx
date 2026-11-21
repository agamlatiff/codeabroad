import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowUpRight,
  Clock,
  Sparkle,
  Trophy,
  UsersThree,
} from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
import { AppTopBar } from '@/shared/components/layout/top-bar/AppTopBar'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { triggerHaptic } from '@/shared/utils/haptics'
import { playSound } from '@/shared/utils/sound'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { LeagueDivision } from '@/features/leaderboard/types/leaderboard'
import {
  LEAGUE_DIVISIONS,
  getNextDivisionProgress,
} from '@/features/leaderboard/constants/divisions'
import { useWeeklyLeaderboard } from '@/features/leaderboard/hooks/useWeeklyLeaderboard'
import { LeaderboardStandingsList } from '@/features/leaderboard/components/LeaderboardStandingsList'
import {
  LeaderboardDivisionEmblem,
  LeaderboardGemIcon,
  LeaderboardRankMedalIcon,
} from '@/features/leaderboard/components/LeaderboardDivisionEmblem'
import { LeaderboardHeroScenery } from '@/features/leaderboard/components/LeaderboardIllustrations'

const VALID_LEAGUE_DIVISIONS: ReadonlySet<LeagueDivision> = new Set([
  'bronze',
  'silver',
  'gold',
  'diamond',
])

export const LeaderboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawDivisionParam = searchParams.get('division')?.trim().toLowerCase() ?? ''
  const urlDivision = useMemo(
    () =>
      VALID_LEAGUE_DIVISIONS.has(rawDivisionParam as LeagueDivision)
        ? (rawDivisionParam as LeagueDivision)
        : undefined,
    [rawDivisionParam]
  )

  const user = useAuthStore((s) => s.user)
  const nextDivisionProgress = useMemo(
    () => getNextDivisionProgress(user?.xp ?? 0),
    [user?.xp]
  )

  const {
    leaderboard,
    activeDivision,
    currentDivisionConfig,
    isLoading,
    error,
    selectDivision,
    refetch,
  } = useWeeklyLeaderboard({ initialDivision: urlDivision })

  useEffect(() => {
    if (isLoading || !activeDivision) return
    if (rawDivisionParam !== activeDivision) {
      setSearchParams({ division: activeDivision }, { replace: true })
    }
  }, [activeDivision, isLoading, rawDivisionParam, setSearchParams])

  const handleSelectDivision = (div: LeagueDivision) => {
    triggerHaptic('tap')
    playSound('node_tap')
    selectDivision(div)
    setSearchParams({ division: div }, { replace: true })
  }

  const userActualDivision: LeagueDivision =
    leaderboard?.user_division ?? nextDivisionProgress.currentDivision.id

  const gapToNextRank = useMemo(() => {
    const entries = leaderboard?.entries ?? []
    const currentIndex = entries.findIndex((e) => e.is_current_user)
    if (currentIndex <= 0) return null
    const selfEntry = entries[currentIndex]
    const targetEntry = entries[currentIndex - 1]
    const xpDiff = Math.max(1, targetEntry.weekly_xp - selfEntry.weekly_xp + 1)
    return {
      targetRank: targetEntry.rank,
      xpNeeded: xpDiff,
    }
  }, [leaderboard?.entries])

  const daysLabel =
    leaderboard?.days_remaining === 0
      ? 'Reset Hari Ini (23:59 WIB)'
      : `${leaderboard?.days_remaining ?? 5} Hari Tersisa (Minggu 23:59 WIB)`

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. COMPACT NAV RAIL ── */}
      <AppLeftSidebar />
      <div className="flex-1 min-w-0 pb-20 md:pb-12">
        <main className="flex-1 min-w-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
          <AppTopBar
            breadcrumbs={[
              { label: 'Beranda', to: '/curriculum' },
              { label: 'Papan Peringkat' },
              { label: currentDivisionConfig.name },
            ]}
          />

          {/* ── DYNAMIC DIVISION HERO HEADER + INTEGRATED PRIZE STRIP & XP PROGRESS ── */}
          <section
            className={`relative rounded-3xl border-2 ${currentDivisionConfig.heroBorder} ${currentDivisionConfig.heroGradient} shadow-[0_4px_0_0_#E2E8F0] overflow-hidden`}
          >
            <div className={`h-1.5 w-full ${currentDivisionConfig.topStrip}`} />

            {/* Borderless Ambient Scenery Illustration */}
            <div
              aria-hidden="true"
              className="absolute right-0 bottom-0 w-64 sm:w-80 h-36 opacity-55 pointer-events-none z-0"
            >
              <LeaderboardHeroScenery division={activeDivision} />
            </div>

            <div className="relative z-10 p-4 sm:p-5 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Badges + Title + Option A Rule + Compact Prize Strip */}
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span
                      className={`border text-[10px] font-brand font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${currentDivisionConfig.accentBadgeClass}`}
                    >
                      <Trophy weight="fill" className="w-3.5 h-3.5" />
                      <span>Liga Global Mingguan • Musim #{leaderboard?.season_week ?? 1}</span>
                    </span>
                    <span className="bg-white/90 text-slate-700 border border-slate-200 text-[10px] font-brand font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Clock weight="bold" className="w-3 h-3 text-blue-600" />
                      <span>{daysLabel}</span>
                    </span>
                  </div>

                  <div>
                    <h1 className="text-lg sm:text-xl font-brand font-black text-slate-900 tracking-tight leading-snug">
                      {currentDivisionConfig.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed font-medium mt-0.5">
                      Naik divisi dari Total XP belajar, lalu kejar <strong className="text-slate-800">Top 3 mingguan</strong> di divisimu untuk memenangkan hadiah Gems!
                    </p>
                  </div>

                  {/* Compact Integrated Prize Strip (Zero Unicode Emojis) */}
                  <div className="flex items-center flex-wrap gap-2 pt-0.5">
                    <span className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-500">
                      Hadiah Top 3:
                    </span>
                    {[
                      { rank: 1 as const, gems: 100 },
                      { rank: 2 as const, gems: 50 },
                      { rank: 3 as const, gems: 25 },
                    ].map(({ rank, gems }) => (
                      <span
                        key={rank}
                        className="inline-flex items-center gap-1 bg-white/95 border border-slate-200/90 text-slate-800 text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl shadow-2xs"
                      >
                        <LeaderboardRankMedalIcon rank={rank} className="w-3.5 h-3.5" />
                        <LeaderboardGemIcon className="w-3.5 h-3.5" />
                        <span>+{gems}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Division Shield Crest + Localized Tier Label */}
                <div className="flex items-center gap-3 shrink-0 bg-white/90 backdrop-blur-xs border-2 border-white rounded-2xl px-3.5 py-2.5 shadow-xs self-start lg:self-center">
                  <LeaderboardDivisionEmblem division={activeDivision} size="lg" shimmer />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-500 block">
                      {currentDivisionConfig.levelLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-brand font-black text-slate-900 block">
                      {currentDivisionConfig.name}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-600 block">
                      {currentDivisionConfig.xpRange}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Division Progress Strip */}
              <div className="bg-white/85 backdrop-blur-xs border border-slate-200/80 rounded-2xl px-3.5 py-2.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-[11px] font-brand font-bold">
                  <span className="text-slate-700 inline-flex items-center gap-1.5">
                    <ArrowUpRight weight="bold" className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      {nextDivisionProgress.isMaxDivision
                        ? `Divisi Tertinggi Tercapai (${nextDivisionProgress.currentDivision.name})`
                        : `Progres Total XP menuju ${nextDivisionProgress.nextDivisionName}`}
                    </span>
                  </span>
                  <span className="font-mono font-bold text-slate-800 tabular-nums shrink-0">
                    {nextDivisionProgress.targetXP !== null
                      ? `${nextDivisionProgress.currentXP.toLocaleString('id-ID')} / ${nextDivisionProgress.targetXP.toLocaleString('id-ID')} XP • Butuh +${nextDivisionProgress.remainingXP.toLocaleString('id-ID')} XP lagi`
                      : `${nextDivisionProgress.currentXP.toLocaleString('id-ID')} XP • Master`}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full lb-bar-grow ${nextDivisionProgress.currentDivision.progressFillClass}`}
                    style={{ width: `${nextDivisionProgress.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── 4 GLOBAL LEAGUE DIVISION SELECTOR TABS ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LEAGUE_DIVISIONS.map((div) => {
              const isSelected = activeDivision === div.id
              const isUserDivision = userActualDivision === div.id

              return (
                <button
                  key={div.id}
                  type="button"
                  onClick={() => handleSelectDivision(div.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 relative ${
                    isSelected
                      ? div.activeTabClass
                      : 'bg-white border-slate-200 hover:border-slate-300 active:translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-brand font-black text-xs sm:text-sm text-slate-900 block truncate">
                        {div.name}
                      </span>
                      {isUserDivision && (
                        <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-brand font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Divisimu
                        </span>
                      )}
                    </div>
                    <LeaderboardDivisionEmblem
                      division={div.id}
                      size="sm"
                      shimmer={isSelected}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md inline-block ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700'
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

          {/* ── LEADERBOARD STANDINGS CARD (PROMOTED ABOVE THE FOLD) ── */}
          <section className="bg-white border-2 border-slate-200/90 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UsersThree weight="fill" className="w-4 h-4 text-blue-600" />
                <h2 className="font-brand font-black text-xs sm:text-sm text-slate-900">
                  Klasemen {currentDivisionConfig.name}
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {leaderboard?.total_competitors ?? leaderboard?.entries?.length ?? 0} Peserta
                </span>
              </div>

              {gapToNextRank ? (
                <span className="text-[11px] font-brand font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full self-start sm:self-auto">
                  Butuh +{gapToNextRank.xpNeeded.toLocaleString('id-ID')} XP minggu ini untuk menyalip #{gapToNextRank.targetRank}
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-500">
                  Diurutkan dari perolehan XP Minggu Ini
                </span>
              )}
            </div>

            <LeaderboardStandingsList
              leaderboard={leaderboard}
              divisionConfig={currentDivisionConfig}
              nextDivisionProgress={nextDivisionProgress}
              isLoading={isLoading}
              error={error}
              onRetry={() => void refetch()}
            />
          </section>

          {/* ── COMPACT MERA CHEERING TIP FOOTER ── */}
          <div className="bg-white border-2 border-slate-200/90 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xs">
            <div className="shrink-0 flex items-center justify-center">
              <KodiCharacter emotion="celebrate" size={44} />
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              <strong className="font-brand font-black text-slate-900 inline-flex items-center gap-1 mr-1">
                <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                <span>Tips Mera:</span>
              </strong>
              Peringkat minggu ini terisi otomatis dari pelajaran kurikulum &amp; Flashcard. Konsisten 15 menit sehari cukup untuk menembus Liga Berlian!
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
