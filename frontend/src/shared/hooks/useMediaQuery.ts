import { useSyncExternalStore } from 'react'

/**
 * Subscribes to window.matchMedia updates via useSyncExternalStore so responsive
 * desktop vs mobile UI renders strictly one active branch without effect setState.
 */
export const useMediaQuery = (query: string): boolean => {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return () => undefined
      }
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onStoreChange)
      return () => mql.removeEventListener('change', onStoreChange)
    },
    () => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return true
      }
      return window.matchMedia(query).matches
    },
    () => true
  )
}
