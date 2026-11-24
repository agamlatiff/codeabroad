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
  if (!trimmed || /[\\\r\n]/.test(trimmed) || trimmed.startsWith('//')) {
    return false
  }
  if (trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return true
  }
  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(trimmed)) {
    return true
  }
  return false
}

export const getInitials = (name?: string, username?: string): string => {
  const source = name?.trim() || username?.trim() || 'MT'
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

export interface AvatarColorPreset {
  id: string
  url: string
  label: string
  gradient: string
  ring: string
}

export const AVATAR_PRESET_PREFIX = '/avatar/preset/'

export const AVATAR_COLOR_PRESETS: readonly AvatarColorPreset[] = [
  {
    id: 'blue',
    url: `${AVATAR_PRESET_PREFIX}blue`,
    label: 'Biru Laut',
    gradient: 'from-blue-600 to-sky-400',
    ring: 'ring-blue-500',
  },
  {
    id: 'emerald',
    url: `${AVATAR_PRESET_PREFIX}emerald`,
    label: 'Zamrud',
    gradient: 'from-emerald-600 to-teal-400',
    ring: 'ring-emerald-500',
  },
  {
    id: 'amber',
    url: `${AVATAR_PRESET_PREFIX}amber`,
    label: 'Kuning Amber',
    gradient: 'from-amber-500 to-orange-400',
    ring: 'ring-amber-500',
  },
  {
    id: 'rose',
    url: `${AVATAR_PRESET_PREFIX}rose`,
    label: 'Mawar',
    gradient: 'from-rose-500 to-pink-400',
    ring: 'ring-rose-500',
  },
  {
    id: 'violet',
    url: `${AVATAR_PRESET_PREFIX}violet`,
    label: 'Violet',
    gradient: 'from-violet-600 to-purple-400',
    ring: 'ring-violet-500',
  },
  {
    id: 'cyan',
    url: `${AVATAR_PRESET_PREFIX}cyan`,
    label: 'Sian',
    gradient: 'from-cyan-600 to-sky-400',
    ring: 'ring-cyan-500',
  },
  {
    id: 'indigo',
    url: `${AVATAR_PRESET_PREFIX}indigo`,
    label: 'Indigo',
    gradient: 'from-indigo-600 to-blue-400',
    ring: 'ring-indigo-500',
  },
  {
    id: 'slate',
    url: `${AVATAR_PRESET_PREFIX}slate`,
    label: 'Grafit',
    gradient: 'from-slate-700 to-slate-500',
    ring: 'ring-slate-600',
  },
] as const

export const isPresetAvatarUrl = (url?: string | null): boolean => {
  if (!url) return false
  return url.trim().startsWith(AVATAR_PRESET_PREFIX)
}

export const getAvatarPresetGradient = (avatarUrl?: string | null): string | null => {
  if (!avatarUrl) return null
  const trimmed = avatarUrl.trim()
  if (!trimmed.startsWith(AVATAR_PRESET_PREFIX)) return null
  const presetId = trimmed.slice(AVATAR_PRESET_PREFIX.length)
  const matched = AVATAR_COLOR_PRESETS.find((preset) => preset.id === presetId || preset.url === trimmed)
  return matched?.gradient ?? null
}

export const getDefaultAvatarPresetUrl = (seed: string): string => {
  const cleanSeed = seed.trim() || 'learner'
  let hash = 0
  for (let i = 0; i < cleanSeed.length; i++) {
    hash = cleanSeed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLOR_PRESETS[Math.abs(hash) % AVATAR_COLOR_PRESETS.length].url
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

  return ''
}
