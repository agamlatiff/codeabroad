import { useNavigate } from 'react-router-dom'
import { CaretUp } from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { triggerHaptic } from '@/shared/utils/haptics'
import type { DivisionConfig, NextDivisionProgress } from '@/features/leaderboard/constants/divisions'
import type { WeeklyLeaderboardResponse } from '@/features/leaderboard/types/leaderboard'
import { LeaderboardEntryRow } from './LeaderboardEntryRow'
import { LeaderboardTopPodium } from './LeaderboardTopPodium'
import { LeaderboardFewCompetitorsCard } from './LeaderboardIllustrations'

interface LeaderboardStandingsListProps {
  leaderboard: WeeklyLeaderboardResponse | null
  divisionConfig: DivisionConfig
  nextDivisionProgress?: NextDivisionProgress | null
  isLoading: boolean
  error: string | null
  compact?: boolean
  onRetry: () => void
  onNavigateBeforeCurriculum?: () => void
}

/**
 * Shared standings list (loading, error, empty state, Top-3 podium, inline Top-3 prize divider,
 * competitor rows, few-competitors encouragement card, and current-user footer).
 */
export const LeaderboardStandingsList = ({
  leaderboard,
  divisionConfig,
  nextDivisionProgress,
  isLoading,
  error,
  compact = false,
  onRetry,
  onNavigateBeforeCurriculum,
}: LeaderboardStandingsListProps) => {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className={`${compact ? 'py-12' : 'py-16'} text-center space-y-3`}>
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-brand font-bold text-slate-400">
          Memuat klasemen {divisionConfig.name}...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`${compact ? 'py-10 px-4' : 'py-12 px-6'} text-center space-y-3 bg-rose-50/70 rounded-3xl border-2 border-rose-200`}
      >
        <p className="text-xs sm:text-sm font-brand font-bold text-rose-700">{error}</p>
        <Button3D
          variant="blue"
          size="sm"
          onClick={onRetry}
          className="text-xs px-5 py-2 mx-auto"
        >
          Coba Lagi
        </Button3D>
      </div>
    )
  }

  if (!leaderboard?.entries || leaderboard.entries.length === 0) {
    return (
      <div
        className={`${compact ? 'py-10 px-4' : 'py-14 px-6'} text-center space-y-4 bg-slate-50/60 rounded-2xl border-2 border-dashed border-slate-200`}
      >
        <div className="flex items-center justify-center mx-auto">
          <KodiCharacter emotion="thinking" size={compact ? 92 : 104} />
        </div>
        <div className={`space-y-1.5 ${compact ? 'max-w-sm' : 'max-w-md'} mx-auto`}>
          <h3 className="font-brand font-black text-sm sm:text-base text-slate-900">
            Belum Ada Peserta di {divisionConfig.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Capai Total XP ({divisionConfig.xpRange}) untuk masuk {divisionConfig.name}, lalu raih Top 3 mingguan untuk memperebutkan hadiah +100 Gems!
          </p>
        </div>
        <Button3D
          variant="blue"
          size={compact ? 'sm' : 'md'}
          onClick={() => {
            triggerHaptic('tap')
            onNavigateBeforeCurriculum?.()
            navigate('/curriculum')
          }}
          className="text-xs sm:text-sm px-6 py-2.5 mx-auto"
        >
          Mulai Belajar Sekarang
        </Button3D>
      </div>
    )
  }

  const entries = leaderboard.entries
  const showPodium = entries.length >= 3
  const topThree = showPodium ? entries.slice(0, 3) : []
  const remainingEntries = showPodium ? entries.slice(3) : entries

  return (
    <div className="space-y-2.5">
      {showPodium && <LeaderboardTopPodium topThree={topThree} />}

      {showPodium && remainingEntries.length > 0 && (
        <div className="flex items-center gap-3 py-1.5">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-emerald-400 rounded-full" />
          <span className="inline-flex items-center gap-1 text-[10px] font-brand font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0">
            <CaretUp weight="fill" className="w-3 h-3 text-emerald-600" />
            <span>Zona Hadiah Top 3 • Gems Mingguan</span>
          </span>
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-emerald-300 to-emerald-400 rounded-full" />
        </div>
      )}

      {remainingEntries.map((entry, idx) => (
        <LeaderboardEntryRow
          key={entry.user_id ? `${entry.user_id}-${entry.rank}` : `${entry.username}-${entry.rank}-${idx}`}
          entry={entry}
          compact={compact}
          index={idx}
        />
      ))}

      {entries.length < 3 && (
        <LeaderboardFewCompetitorsCard
          divisionConfig={divisionConfig}
          competitorCount={entries.length}
          nextDivisionProgress={nextDivisionProgress}
        />
      )}

      {leaderboard.user_rank && !entries.some((e) => e.is_current_user) && (
        <div className="pt-2 border-t border-dashed border-slate-200 space-y-1.5">
          <span className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-400 px-1">
            Posisimu Saat Ini ({divisionConfig.name})
          </span>
          <LeaderboardEntryRow entry={leaderboard.user_rank} compact={compact} />
        </div>
      )}
    </div>
  )
}
