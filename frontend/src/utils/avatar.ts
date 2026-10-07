/**
 * Utility functions for user avatar generation and deterministic styling.
 * CodeAbroad gamified developer avatar system inspired by Duolingo & GitHub.
 */

export type AvatarStyle = 'adventurer' | 'bottts' | 'lorelei'

export interface AvatarUser {
  avatar_url?: string | null
  username?: string
  name?: string
}

/**
 * Returns initials from a given full name or username (e.g. "Budi Pratama" -> "BP").
 */
export const getInitials = (name?: string, username?: string): string => {
  const source = (name || username || 'CA').trim()
  const parts = source.split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

/**
 * Generates a deterministic pastel gradient class based on a seed string.
 */
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

  const index = Math.abs(hash) % gradients.length
  return gradients[index]
}

/**
 * Generates a deterministic avatar URL.
 * If user.avatar_url is already present, it returns it directly.
 * Otherwise, generates an illustrated developer/tech character via DiceBear SVG.
 */
export const getAvatarUrl = (
  user?: AvatarUser | null,
  style: AvatarStyle = 'adventurer'
): string => {
  if (user?.avatar_url && user.avatar_url.trim().length > 0) {
    return user.avatar_url
  }

  const seed = (user?.username || user?.name || 'coder').trim().toLowerCase()
  const encodedSeed = encodeURIComponent(seed)

  // Curated soft background colors matching CodeAbroad pastel palette
  const bgColors = 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'

  switch (style) {
    case 'bottts':
      // Retro tech coding robot with LED display and antenna
      return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodedSeed}&backgroundColor=e0e7ff,dbeafe,fef3c7,f3e8ff`
    case 'lorelei':
      // Modern anime-style developer illustration
      return `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodedSeed}&backgroundColor=${bgColors}`
    case 'adventurer':
    default:
      // Expressive young developer characters (glasses, hoodies, smiles)
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodedSeed}&backgroundColor=${bgColors}`
  }
}
