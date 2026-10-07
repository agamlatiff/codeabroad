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
