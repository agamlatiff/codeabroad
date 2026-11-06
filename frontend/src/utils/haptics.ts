import { HAPTIC_PATTERNS, type HapticType } from '../tokens/hapticTokens'

export type { HapticType }

/**
 * Triggers safe mobile/touch tactile haptic vibration patterns.
 * Silently falls back if hardware or browser does not support navigator.vibrate.
 */
export const triggerHaptic = (type: HapticType = 'tap') => {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      const pattern = HAPTIC_PATTERNS[type]
      navigator.vibrate(pattern as unknown as number | number[])
    } catch {
      // Gracefully ignored on unsupported hardware
    }
  }
}
