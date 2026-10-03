import { useState, useMemo } from 'react'
import type { FC } from 'react'
import {
  getAvatarUrl,
  getInitials,
  getDeterministicGradient,
  type AvatarStyle,
  type AvatarUser,
} from '../../utils/avatar'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface UserAvatarProps {
  user?: AvatarUser | null
  size?: AvatarSize
  style?: AvatarStyle
  showBadge?: boolean
  badgeColor?: 'online' | 'streak'
  className?: string
}

const sizeClasses: Record<AvatarSize, { container: string; text: string; badge: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-[9px]', badge: 'w-2 h-2 -bottom-0.5 -right-0.5' },
  sm: { container: 'w-8 h-8', text: 'text-xs', badge: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5' },
  md: { container: 'w-10 h-10', text: 'text-sm', badge: 'w-3 h-3 bottom-0 right-0' },
  lg: { container: 'w-12 h-12', text: 'text-base', badge: 'w-3.5 h-3.5 bottom-0 right-0' },
  xl: { container: 'w-16 h-16', text: 'text-xl', badge: 'w-4 h-4 bottom-0.5 right-0.5' },
  '2xl': { container: 'w-20 h-20', text: 'text-2xl', badge: 'w-5 h-5 bottom-1 right-1' },
}

export const UserAvatar: FC<UserAvatarProps> = ({
  user,
  size = 'md',
  style = 'adventurer',
  showBadge = false,
  badgeColor = 'online',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false)

  const avatarUrl = useMemo(() => {
    return getAvatarUrl(user, style)
  }, [user, style])

  const initials = useMemo(() => {
    return getInitials(user?.name, user?.username)
  }, [user?.name, user?.username])

  const gradientClass = useMemo(() => {
    const seed = user?.username || user?.name || 'coder'
    return getDeterministicGradient(seed)
  }, [user?.username, user?.name])

  const { container: containerSize, text: textSize, badge: badgeSize } = sizeClasses[size]

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none shadow-sm transition-transform duration-200 hover:scale-105 ${containerSize} ${className}`}
      title={user?.name || user?.username || 'User Profile'}
    >
      {/* 1. Primary Avatar Image (Illustrated Developer / Custom Photo) */}
      {!imageError ? (
        <img
          src={avatarUrl}
          alt={user?.name || user?.username || 'Avatar'}
          onError={() => setImageError(true)}
          className="w-full h-full rounded-full object-cover bg-slate-100 border border-slate-200/80 shadow-inner"
          loading="lazy"
        />
      ) : (
        /* 2. Fallback: Deterministic Colorful Initials Pill if Image Fails */
        <div
          className={`w-full h-full rounded-full bg-gradient-to-tr ${gradientClass} text-white font-extrabold flex items-center justify-center border-2 border-white shadow-sm ${textSize}`}
        >
          {initials}
        </div>
      )}

      {/* 3. Optional Gamified Badge (Online Status or Streak Flame) */}
      {showBadge && (
        <span
          className={`absolute rounded-full ring-2 ring-white flex items-center justify-center ${badgeSize} ${
            badgeColor === 'streak'
              ? 'bg-amber-500 text-[8px]'
              : 'bg-emerald-500'
          }`}
        >
          {badgeColor === 'streak' && '🔥'}
        </span>
      )}
    </div>
  )
}
