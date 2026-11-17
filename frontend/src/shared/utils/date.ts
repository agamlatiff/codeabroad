/**
 * Calculates a dynamic landing date from the current date in Indonesian locale (e.g. "April 2027").
 */
export const getTargetLandingDate = (months: number): string => {
  const target = new Date()
  target.setMonth(target.getMonth() + months)
  return target.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

/**
 * Formats a live date instance into a 2-digit digital clock string in a specific timezone.
 */
export const formatTimezoneClock = (date: Date, timeZone: string): string => {
  return date.toLocaleTimeString('id-ID', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Returns the YYYY-MM-DD calendar date key in WIB (Asia/Jakarta, UTC+7),
 * matching the backend daily quest/chest boundary calculation.
 */
export const getWibDateKey = (date: Date = new Date()): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Computes HH:MM:SS remaining until next midnight WIB (UTC+7) using pure epoch math (no DST drift).
 */
export const getWibMidnightCountdown = (): string => {
  const wibEpochMs = Date.now() + WIB_OFFSET_MS
  const diffMs = Math.max(0, DAY_MS - (wibEpochMs % DAY_MS))

  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}
