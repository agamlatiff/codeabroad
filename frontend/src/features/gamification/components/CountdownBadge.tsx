import { useEffect, useState } from 'react'
import { Clock } from '@phosphor-icons/react'
import { getWibMidnightCountdown, getWibMidnightRemainingMs } from '@/shared/utils/date'

interface CountdownBadgeProps {
  className?: string
}

const URGENT_THRESHOLD_MS = 2 * 60 * 60 * 1000

/**
 * Self-contained WIB midnight countdown pill isolating the 1-second timer tick
 * from parent quest/gamification views, shifting to a soft urgent rose tone under 2 hours.
 */
export const CountdownBadge = ({ className = '' }: CountdownBadgeProps) => {
  const [countdown, setCountdown] = useState(() => ({
    timeLeft: getWibMidnightCountdown(),
    isUrgent: getWibMidnightRemainingMs() < URGENT_THRESHOLD_MS,
  }))

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown({
        timeLeft: getWibMidnightCountdown(),
        isUrgent: getWibMidnightRemainingMs() < URGENT_THRESHOLD_MS,
      })
    }
    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <span
      title={
        countdown.isUrgent
          ? 'Kurang dari 2 jam sebelum misi harian direset pukul 00:00 WIB!'
          : 'Misi harian diperbarui otomatis setiap pukul 00:00 WIB'
      }
      className={`text-xs font-black px-3.5 py-1.5 rounded-2xl border-2 flex items-center gap-1.5 shadow-2xs self-start sm:self-auto transition-colors ${
        countdown.isUrgent
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : 'bg-[#FFFBEB] text-[#B45309] border-amber-200'
      } ${className}`.trim()}
    >
      {countdown.isUrgent ? (
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
      ) : null}
      <Clock weight="bold" className="w-3.5 h-3.5 shrink-0" />
      <span>Reset dalam: {countdown.timeLeft}</span>
    </span>
  )
}
