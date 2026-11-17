import { useEffect, useState } from 'react'
import { Clock } from '@phosphor-icons/react'
import { getWibMidnightCountdown } from '@/shared/utils/date'

interface CountdownBadgeProps {
  className?: string
}

/**
 * Self-contained WIB midnight countdown pill isolating the 1-second timer tick
 * from parent quest/gamification views.
 */
export const CountdownBadge = ({ className = '' }: CountdownBadgeProps) => {
  const [timeLeft, setTimeLeft] = useState<string>(() => getWibMidnightCountdown())

  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(getWibMidnightCountdown())
    }
    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <span
      className={`bg-[#FFFBEB] text-[#B45309] text-xs font-black px-3.5 py-1.5 rounded-2xl border-2 border-amber-200 flex items-center gap-1.5 shadow-2xs self-start sm:self-auto ${className}`.trim()}
    >
      <Clock weight="bold" className="w-3.5 h-3.5" />
      <span>Reset dalam: {timeLeft}</span>
    </span>
  )
}
