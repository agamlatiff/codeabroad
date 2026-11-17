import type { QueryClient } from '@tanstack/react-query'
import { SOUND_STORAGE_KEYS } from '@/shared/tokens/soundTokens'

const PRESERVED_LOCAL_KEYS = new Set<string>([
  'codeabroad_audio_storage',
  'codeabroad_avatar_style',
  ...Object.values(SOUND_STORAGE_KEYS),
])

type CleanupCallback = () => void
const cleanupCallbacks = new Set<CleanupCallback>()

/**
 * Allows feature stores (e.g., authStore, onboardingStore, curriculumStore) to register
 * reset handlers executed on sign-out without introducing shared -> features imports.
 */
export const registerSessionResetHandler = (fn: CleanupCallback): (() => void) => {
  cleanupCallbacks.add(fn)
  return () => {
    cleanupCallbacks.delete(fn)
  }
}

/**
 * Clears all client auth tokens, feature Zustand stores, TanStack Query caches,
 * and user-specific storage while preserving benign non-PII UI/audio preferences.
 */
export const clearClientSession = (queryClient?: QueryClient | null): void => {
  cleanupCallbacks.forEach((fn) => {
    try {
      fn()
    } catch {
      // Best-effort client cleanup
    }
  })

  if (queryClient) {
    queryClient.clear()
  }

  if (typeof window !== 'undefined') {
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i)
        if (key && key.startsWith('codeabroad') && !PRESERVED_LOCAL_KEYS.has(key)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((key) => window.localStorage.removeItem(key))
      window.sessionStorage.clear()
    } catch {
      // Ignore private browsing / restricted storage exceptions
    }
  }
}
