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
 * Computes HH:MM:SS remaining until next midnight WIB (UTC+7).
 */
export const getWibMidnightCountdown = (): string => {
  const now = new Date()
  const wibNow = new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60 * 1000)
  const wibMidnight = new Date(wibNow)
  wibMidnight.setHours(24, 0, 0, 0)
  const diffMs = wibMidnight.getTime() - wibNow.getTime()

  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}
