import type { User } from '@/shared/types/user'

export type AccessTier = 'guest' | 'free' | 'pro'

export type LevelAccessReason = 'ok' | 'login_required' | 'pro_required'

export interface LevelAccessResult {
  allowed: boolean
  reason: LevelAccessReason
  requiredTier: AccessTier
  normalizedLevel: string
}

/**
 * Returns whether the given user currently has an active Pro subscription.
 */
export function isUserPro(user: Pick<User, 'subscription_tier' | 'subscription_expires_at'> | null | undefined): boolean {
  if (!user || user.subscription_tier !== 'pro') return false
  if (user.subscription_expires_at) {
    const expires = new Date(user.subscription_expires_at)
    if (!Number.isNaN(expires.getTime()) && expires.getTime() < Date.now()) {
      return false
    }
  }
  return true
}

/**
 * Single Source of Truth for Merantalk level tiering:
 * - N5 (beginner) -> 'guest' (accessible without login)
 * - N4, N3        -> 'free'  (requires free logged-in account)
 * - N2, N1        -> 'pro'   (requires Merantalk Pro subscription)
 */
export function getRequiredTierForLevel(levelCode?: string | null): AccessTier {
  const code = (levelCode ?? '').trim().toUpperCase()
  switch (code) {
    case '':
    case 'ALL':
    case 'N5':
    case 'A1':
    case 'HSK1':
    case 'TOPIK1':
      return 'guest'
    case 'N4':
    case 'N3':
    case 'A2':
    case 'B1':
    case 'HSK2':
    case 'HSK3':
    case 'TOPIK2':
    case 'TOPIK3':
      return 'free'
    case 'N2':
    case 'N1':
    case 'B2':
    case 'C1':
    case 'C2':
    case 'HSK4':
    case 'HSK5':
    case 'HSK6':
    case 'TOPIK4':
    case 'TOPIK5':
    case 'TOPIK6':
      return 'pro'
    default:
      return 'free'
  }
}

export function checkLevelAccess(
  levelCode: string | null | undefined,
  opts: { isAuthenticated: boolean; isPro: boolean }
): LevelAccessResult {
  const normalizedLevel = (levelCode ?? 'N5').trim().toUpperCase() || 'N5'
  const requiredTier = getRequiredTierForLevel(normalizedLevel)

  if (requiredTier === 'guest') {
    return { allowed: true, reason: 'ok', requiredTier, normalizedLevel }
  }

  if (requiredTier === 'free') {
    if (!opts.isAuthenticated) {
      return { allowed: false, reason: 'login_required', requiredTier, normalizedLevel }
    }
    return { allowed: true, reason: 'ok', requiredTier, normalizedLevel }
  }

  // requiredTier === 'pro'
  if (!opts.isPro) {
    return { allowed: false, reason: 'pro_required', requiredTier, normalizedLevel }
  }
  return { allowed: true, reason: 'ok', requiredTier, normalizedLevel }
}
