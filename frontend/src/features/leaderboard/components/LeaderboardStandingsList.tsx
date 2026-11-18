import { useNavigate } from 'react-router-dom'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { triggerHaptic } from '@/shared/utils/haptics'
import type { DivisionConfig } from '@/features/leaderboard/constants/divisions'
import type { WeeklyLeaderboardResponse } from '@/features/leaderboard/types/leaderboard'
import { LeaderboardEntryRow } from './LeaderboardEntryRow'

interface LeaderboardStandingsListProps {
  leaderboard: WeeklyLeaderboardResponse | null
  divisionConfig: DivisionConfig
  isLoading: boolean
  error: string | null
  compact?: boolean
  onRetry: () => void
  onNavigateBeforeCurriculum?: () => void
}

/**
 * Shared standings list (loading, error, empty state, competitor rows, current-user footer)
 * used by LeaderboardPage.
 */
export const LeaderboardStandingsList = ({
  leaderboard,
  divisionConfig,
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
        className={`${compact ? 'py-10 px-4' : 'py-16 px-6'} text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-200`}
      >
        <div className="flex items-center justify-center mx-auto">
          <KodiCharacter emotion="thinking" size={compact ? 96 : 110} />
        </div>
        <div className={`space-y-1.5 ${compact ? 'max-w-sm' : 'max-w-md'} mx-auto`}>
          <h3 className="font-brand font-black text-sm sm:text-base text-slate-900">
            Belum Ada Peserta di {divisionConfig.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Musim #{leaderboard?.season_week ?? 1} baru dimulai! Kumpulkan XP ({divisionConfig.xpRange}) dari pelajaran kurikulum dan latihan SRS untuk merebut Peringkat #1 dan hadiah 100 Gems!
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

  return (
    <>
      {leaderboard.entries.map((entry, idx) => (
        <LeaderboardEntryRow
          key={entry.user_id ? `${entry.user_id}-${entry.rank}` : `${entry.username}-${entry.rank}-${idx}`}
          entry={entry}
          compact={compact}
        />
      ))}
      {leaderboard.user_rank && !leaderboard.entries.some((e) => e.is_current_user) && (
        <div className="pt-2 border-t border-dashed border-slate-200 space-y-1.5">
          <span className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-400 px-1">
            Posisi Anda Saat Ini
          </span>
          <LeaderboardEntryRow entry={leaderboard.user_rank} compact={compact} />
        </div>
      )}
    </>
  )
}
