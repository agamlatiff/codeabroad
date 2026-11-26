import { useEffect, useState } from 'react'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'

/**
 * Sleek global top progress bar (#2563EB -> #38BDF8) that activates automatically
 * on any in-flight mutation or non-instant (>140ms) query fetch.
 */
export const GlobalTopProgressBar = () => {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  const isBusy = isMutating > 0 || isFetching > 0

  useEffect(() => {
    if (!isBusy) {
      if (!visible) return
      const hideTimer = window.setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 220)
      return () => window.clearTimeout(hideTimer)
    }

    const startDelay = isMutating > 0 ? 0 : 140
    let intervalId: number | undefined

    const showTimer = window.setTimeout(() => {
      setVisible(true)
      setProgress((prev) => (prev > 18 && prev < 90 ? prev : 24))
      intervalId = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 88) return prev
          const step = prev < 55 ? 12 : prev < 75 ? 5 : 2
          return Math.min(88, prev + step)
        })
      }, 260)
    }, startDelay)

    return () => {
      window.clearTimeout(showTimer)
      if (intervalId !== undefined) {
        window.clearInterval(intervalId)
      }
    }
  }, [isBusy, isMutating, visible])

  if (!visible) return null

  const displayProgress = !isBusy ? 100 : progress

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px] overflow-hidden bg-blue-100/50"
    >
      <div
        className="h-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#38BDF8] shadow-[0_0_8px_rgba(37,99,235,0.45)] transition-[width,opacity] duration-200 ease-out"
        style={{
          width: `${displayProgress}%`,
          opacity: displayProgress >= 100 ? 0 : 1,
        }}
      />
    </div>
  )
}
