/**
 * Utility functions for user avatar generation, safe URL validation, and style persistence.
 */

export type AvatarStyle = 'adventurer'

export const AVATAR_STYLE_STORAGE_KEY = 'merantalk_avatar_style'

export interface AvatarUser {
  avatar_url?: string | null
  username?: string
  name?: string
}

export const getSavedAvatarStyle = (): AvatarStyle => 'adventurer'

export const saveAvatarStyle = (style: AvatarStyle): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(AVATAR_STYLE_STORAGE_KEY, style)
  } catch {
    // Ignore storage access failures
  }
}

export const isSafeAvatarUrl = (url?: string | null): url is string => {
  if (!url) return false
  const trimmed = url.trim()
  if (!trimmed) return false
  if (trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return true
  }
  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(trimmed)) {
    return true
  }
  return false
}

export const getInitials = (name?: string, username?: string): string => {
  const source = (name || username || 'MT').trim()
  const parts = source.split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

export const getDeterministicGradient = (seed: string): string => {
  const gradients = [
    'from-blue-600 to-sky-400',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
    'from-sky-500 to-blue-600',
  ]

  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }

  return gradients[Math.abs(hash) % gradients.length]
}

const ADVENTURER_BG_COLORS = 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'

export const AVATAR_PRESET_SEEDS = [
  'akira', 'sakura', 'sora', 'kenji', 'hana',
  'ren', 'yuna', 'kai', 'mika', 'leo',
  'aria', 'noah', 'mei', 'riku', 'chloe',
  'lucas', 'nana', 'haru', 'felix', 'zara',
] as const

export const buildAdventurerAvatarUrl = (seed: string): string => {
  const cleanSeed = seed.trim().toLowerCase() || 'learner'
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanSeed)}&backgroundColor=${ADVENTURER_BG_COLORS}`
}

export const getAvatarUrl = (
  user?: AvatarUser | null,
  _style: AvatarStyle = 'adventurer'
): string => {
  void _style
  if (isSafeAvatarUrl(user?.avatar_url)) {
    return user.avatar_url.trim()
  }

  const seed = (user?.username || user?.name || 'learner').trim().toLowerCase()
  return buildAdventurerAvatarUrl(seed)
}
