import { Crown, Flame, Star } from '@phosphor-icons/react'
import type { LeaderboardEntry } from "@/features/leaderboard/types/leaderboard"

export interface LeaderboardEntryRowProps {
  entry: LeaderboardEntry
  compact?: boolean
}

export const LeaderboardEntryRow = ({ entry, compact = false }: LeaderboardEntryRowProps) => {
  const isTop3 = entry.rank <= 3
  const isDemotion = entry.rank > 10
  const isUser = entry.is_current_user

  return (
    <div
      className={`flex items-center justify-between rounded-2xl border-2 transition-all ${
        compact ? 'p-3 sm:p-3.5' : 'p-3.5 sm:p-4'
      } ${
        isUser
          ? 'bg-blue-50/90 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
          : isTop3
          ? 'bg-white border-emerald-200/90 shadow-2xs hover:border-emerald-300'
          : isDemotion
          ? 'bg-white border-rose-200/80 shadow-2xs'
          : 'bg-white border-slate-200/80 shadow-2xs hover:border-slate-300'
      }`}
    >
      {/* Left: Rank & User Profile */}
      <div className={`flex items-center min-w-0 ${compact ? 'gap-3' : 'gap-3 sm:gap-4'}`}>
        <div
          className={`rounded-xl flex items-center justify-center font-brand font-black shrink-0 ${
            compact ? 'w-7 h-7 sm:w-8 sm:h-8 text-xs' : 'w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm'
          } ${
            entry.rank === 1
              ? 'bg-amber-400 text-amber-950 shadow-xs'
              : entry.rank === 2
              ? 'bg-slate-300 text-slate-900 shadow-xs'
              : entry.rank === 3
              ? 'bg-amber-700 text-amber-100 shadow-xs'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {entry.rank === 1 ? (
            <Crown weight="fill" className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-amber-950`} />
          ) : (
            `#${entry.rank}`
          )}
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <span
              className={`font-brand font-black text-xs sm:text-sm truncate ${
                isUser ? 'text-blue-900' : 'text-slate-900'
              }`}
            >
              {entry.name}
            </span>
            {isUser && (
              <span className="bg-blue-600 text-white text-[9px] font-brand font-black px-2 py-0.5 rounded-md shrink-0">
                ANDA
              </span>
            )}
            {isTop3 && (
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-brand font-bold px-2 py-0.5 rounded-md hidden sm:inline-block shrink-0">
                {compact ? 'Zona Promosi' : 'Zona Promosi 🏆'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono font-bold">
            <span>Lv. {entry.current_level}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-amber-600">
              <Flame weight="fill" className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-amber-500`} />
              <span>{compact ? `${entry.streak}d streak` : `${entry.streak} hari streak`}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: XP Score & Reward Badge */}
      <div className="text-right shrink-0 flex flex-col items-end gap-1">
        <div
          className={`flex items-center justify-end font-brand font-black text-slate-900 ${
            compact ? 'gap-1 text-sm' : 'gap-1.5 text-sm sm:text-base'
          }`}
        >
          <Star weight="fill" className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-amber-400`} />
          <span>{entry.weekly_xp}</span>
          <span className="text-[10px] font-mono text-slate-400">XP</span>
        </div>
        {isTop3 && (
          <span
            className={`text-[10px] font-mono font-bold rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 ${
              compact ? 'px-1.5 py-0.5' : 'px-2 py-0.5'
            }`}
          >
            💎 +{entry.rank === 1 ? '100' : entry.rank === 2 ? '50' : '25'}
            {!compact && ' Gems'}
          </span>
        )}
      </div>
    </div>
  )
}
