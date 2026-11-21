import { useEffect, useState, type FC } from 'react'
import { Crown, Flame } from '@phosphor-icons/react'
import { UserAvatar } from '@/shared/components/layout/left-sidebar/UserAvatar'
import type { LeaderboardEntry } from '@/features/leaderboard/types/leaderboard'
import { LeaderboardGemIcon, LeaderboardRankMedalIcon } from './LeaderboardDivisionEmblem'

export interface LeaderboardTopPodiumProps {
  topThree: LeaderboardEntry[]
}

const PRIZE_BY_RANK: Record<number, number> = {
  1: 100,
  2: 50,
  3: 25,
}

const AnimatedWeeklyXP: FC<{ target: number }> = ({ target }) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const [displayValue, setDisplayValue] = useState<number>(() =>
    prefersReducedMotion ? target : 0
  )

  useEffect(() => {
    if (prefersReducedMotion || target <= 0) {
      const id = window.requestAnimationFrame(() => setDisplayValue(target))
      return () => window.cancelAnimationFrame(id)
    }

    let rafId = 0
    const duration = 550
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(target * eased))
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick)
      }
    }

    rafId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(rafId)
  }, [prefersReducedMotion, target])

  return <>{displayValue.toLocaleString('id-ID')}</>
}

interface PodiumSlotConfig {
  entry: LeaderboardEntry
  rank: 1 | 2 | 3
  motionClass: string
  orderClass: string
  cardStyle: string
  heightClass: string
}

export const LeaderboardTopPodium: FC<LeaderboardTopPodiumProps> = ({ topThree }) => {
  if (topThree.length < 3) return null

  const first = topThree[0]
  const second = topThree[1]
  const third = topThree[2]

  const slots: PodiumSlotConfig[] = [
    {
      entry: second,
      rank: 2,
      motionClass: 'lb-podium-2',
      orderClass: 'order-2 sm:order-1',
      cardStyle:
        'bg-gradient-to-b from-slate-50 via-white to-slate-50/70 border-slate-300 shadow-[0_3px_0_0_#CBD5E1]',
      heightClass: 'sm:min-h-[196px]',
    },
    {
      entry: first,
      rank: 1,
      motionClass: 'lb-podium-1 lb-shimmer-sweep',
      orderClass: 'order-1 sm:order-2',
      cardStyle:
        'bg-gradient-to-b from-amber-50 via-white to-yellow-50/70 border-amber-400 shadow-[0_5px_0_0_#F59E0B]',
      heightClass: 'sm:min-h-[224px]',
    },
    {
      entry: third,
      rank: 3,
      motionClass: 'lb-podium-3',
      orderClass: 'order-3',
      cardStyle:
        'bg-gradient-to-b from-orange-50/70 via-white to-amber-50/50 border-amber-300/90 shadow-[0_3px_0_0_#D97706]',
      heightClass: 'sm:min-h-[184px]',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pb-2">
      {slots.map(({ entry, rank, motionClass, orderClass, cardStyle, heightClass }) => {
        const isFirst = rank === 1
        const prize = PRIZE_BY_RANK[rank] ?? 25

        return (
          <div
            key={entry.user_id || `${entry.username}-${rank}`}
            className={`relative overflow-hidden rounded-3xl border-2 p-4 flex flex-col items-center justify-between text-center gap-2.5 ${cardStyle} ${heightClass} ${orderClass} ${motionClass} ${
              entry.is_current_user ? 'ring-2 ring-blue-500/40' : ''
            }`}
          >
            {/* Top rank indicator */}
            <div className="flex flex-col items-center gap-1.5 w-full">
              {isFirst && (
                <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center lb-crown-bob">
                  <Crown weight="fill" className="w-4 h-4 text-amber-600" />
                </div>
              )}

              <div className="relative">
                <UserAvatar
                  user={{
                    name: entry.name,
                    username: entry.username,
                    avatar_url: entry.avatar_url,
                  }}
                  size={isFirst ? 'lg' : 'md'}
                />
                <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-xs border border-slate-200">
                  <LeaderboardRankMedalIcon rank={rank} className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Name + self badge */}
            <div className="min-w-0 w-full space-y-0.5">
              <div className="flex items-center justify-center gap-1.5">
                <span className="font-brand font-black text-xs sm:text-sm text-slate-900 truncate max-w-[140px]">
                  {entry.name}
                </span>
                {entry.is_current_user && (
                  <span className="bg-blue-600 text-white text-[9px] font-brand font-black px-1.5 py-0.5 rounded-md shrink-0">
                    ANDA
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] font-mono font-bold text-slate-400">
                <span>Lv. {entry.current_level}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-0.5 text-amber-600">
                  <Flame weight="fill" className="w-3 h-3 text-amber-500" />
                  <span>{entry.streak}h</span>
                </span>
              </div>
            </div>

            {/* Weekly XP + Gems Prize */}
            <div className="w-full pt-2 border-t border-slate-200/70 flex flex-col items-center gap-1">
              <div className="flex items-baseline gap-1">
                <span className="font-brand font-black text-base text-slate-900 tabular-nums">
                  <AnimatedWeeklyXP target={entry.weekly_xp} /> XP
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Minggu ini</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                <LeaderboardGemIcon className="w-3 h-3" />
                <span>+{prize} Gems</span>
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
