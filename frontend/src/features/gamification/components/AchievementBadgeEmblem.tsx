import { useId, type FC } from 'react'

export interface AchievementBadgeEmblemProps {
  icon: string
  category?: string
  isEarned: boolean
  size?: number
  className?: string
}

interface BadgeThemePalette {
  top: string
  bottom: string
  rim: string
  symbol: string
}

const BADGE_VISUAL_THEMES: Record<string, BadgeThemePalette> = {
  flame: {
    top: '#FB923C',
    bottom: '#E11D48',
    rim: '#FED7AA',
    symbol: '#FFFBEB',
  },
  trophy: {
    top: '#FBBF24',
    bottom: '#D97706',
    rim: '#FEF08A',
    symbol: '#FFFFFF',
  },
  brain: {
    top: '#A78BFA',
    bottom: '#6D28D9',
    rim: '#DDD6FE',
    symbol: '#FFFFFF',
  },
  medal: {
    top: '#F43F5E',
    bottom: '#9F1239',
    rim: '#FDE047',
    symbol: '#FEF08A',
  },
  globe: {
    top: '#34D399',
    bottom: '#0F766E',
    rim: '#A7F3D0',
    symbol: '#FFFFFF',
  },
  sparkles: {
    top: '#38BDF8',
    bottom: '#2563EB',
    rim: '#BAE6FD',
    symbol: '#FFFFFF',
  },
}

const LOCKED_THEME: BadgeThemePalette = {
  top: '#F1F5F9',
  bottom: '#CBD5E1',
  rim: '#E2E8F0',
  symbol: '#64748B',
}

function resolveBadgeTheme(icon: string, category?: string): BadgeThemePalette {
  const key = (icon || '').toLowerCase()
  if (key in BADGE_VISUAL_THEMES) return BADGE_VISUAL_THEMES[key]
  if (category === 'streak') return BADGE_VISUAL_THEMES.flame
  if (category === 'srs') return BADGE_VISUAL_THEMES.brain
  if (category === 'mastery') return BADGE_VISUAL_THEMES.medal
  if (category === 'special') return BADGE_VISUAL_THEMES.globe
  return BADGE_VISUAL_THEMES.sparkles
}

/**
 * Collectible Japanese guild shield medallion SVG matching Kodi's crisp-ink vector direction.
 */
export const AchievementBadgeEmblem: FC<AchievementBadgeEmblemProps> = ({
  icon,
  category,
  isEarned,
  size = 58,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '')
  const bgGradId = `ach-bg-${uid}`
  const theme = isEarned ? resolveBadgeTheme(icon, category) : LOCKED_THEME
  const strokeColor = isEarned ? '#1E293B' : '#475569'
  const iconKind = (icon || '').toLowerCase()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${!isEarned ? 'opacity-85' : ''} ${className}`.trim()}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bgGradId} x1="16" y1="8" x2="48" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={theme.top} />
          <stop offset="100%" stopColor={theme.bottom} />
        </linearGradient>
      </defs>

      {/* Soft Shadow Ellipse */}
      <ellipse cx="32" cy="58.5" rx="15" ry="2.8" fill="#0F172A" opacity={isEarned ? '0.14' : '0.08'} />

      {/* Outer Guild Shield */}
      <path
        d="M32 6L52 13V30.5C52 43.2 43.2 51.8 32 57.5C20.8 51.8 12 43.2 12 30.5V13L32 6Z"
        fill={theme.rim}
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Inner Vibrant Shield Field */}
      <path
        d="M32 10.2L47.8 15.8V30.2C47.8 40.8 40.6 47.9 32 52.8C23.4 47.9 16.2 40.8 16.2 30.2V15.8L32 10.2Z"
        fill={`url(#${bgGradId})`}
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Diagonal Gloss Sheen (Earned Only) */}
      {isEarned && (
        <path
          d="M17.5 16.5L32 11.4L40 14.2L17.5 34.5V16.5Z"
          fill="#FFFFFF"
          opacity="0.22"
        />
      )}

      {/* Center Emblem Symbol */}
      {iconKind === 'flame' ? (
        <path
          d="M33.2 19C35.8 22.8 40.4 25.6 40.4 31.8C40.4 36.8 36.6 40.6 32 40.6C27.4 40.6 23.8 37.1 23.8 32.3C23.8 29.1 25.4 26.6 27 25C27.2 27.6 28.5 29.1 29.8 29.5C29.4 25.8 31 22 33.2 19Z"
          fill={theme.symbol}
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ) : iconKind === 'trophy' ? (
        <g>
          <path
            d="M24 20.5H40V27.2C40 31.6 36.4 34.8 32 34.8C27.6 34.8 24 31.6 24 27.2V20.5Z"
            fill={theme.symbol}
            stroke={strokeColor}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M24 22.5H20.8C20.8 26.5 22.2 28.8 24.4 29.4M40 22.5H43.2C43.2 26.5 41.8 28.8 39.6 29.4"
            stroke={theme.symbol}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M32 34.8V39.2M26.5 39.5H37.5" stroke={theme.symbol} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      ) : iconKind === 'brain' ? (
        <g>
          <path
            d="M27.5 21C24.2 21 21.8 23.5 21.8 26.6C21.8 27.6 22.1 28.5 22.6 29.3C21.8 30.3 21.4 31.5 21.4 32.8C21.4 36 24 38.6 27.2 38.6H30.8V23.4C30.8 22 29.4 21 27.5 21Z"
            fill={theme.symbol}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <path
            d="M36.5 21C39.8 21 42.2 23.5 42.2 26.6C42.2 27.6 41.9 28.5 41.4 29.3C42.2 30.3 42.6 31.5 42.6 32.8C42.6 36 40 38.6 36.8 38.6H33.2V23.4C33.2 22 34.6 21 36.5 21Z"
            fill={theme.symbol}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <path d="M26 27.5H28.5M35.5 27.5H38M26 32.8H28.5M35.5 32.8H38" stroke={strokeColor} strokeWidth="1.4" strokeLinecap="round" />
        </g>
      ) : iconKind === 'medal' ? (
        <path
          d="M32 19L35.4 26L43.2 27.1L37.5 32.5L38.9 40.2L32 36.5L25.1 40.2L26.5 32.5L20.8 27.1L28.6 26L32 19Z"
          fill={theme.symbol}
          stroke={strokeColor}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      ) : iconKind === 'globe' ? (
        <g>
          <circle cx="32" cy="30" r="10.5" fill={theme.symbol} stroke={strokeColor} strokeWidth="1.6" />
          <ellipse cx="32" cy="30" rx="5.2" ry="10.5" stroke={strokeColor} strokeWidth="1.4" />
          <path d="M22 30H42M24 25.5H40M24 34.5H40" stroke={strokeColor} strokeWidth="1.3" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <path
            d="M32 18.5L34.7 26.3L42.5 29L34.7 31.7L32 39.5L29.3 31.7L21.5 29L29.3 26.3L32 18.5Z"
            fill={theme.symbol}
            stroke={strokeColor}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M41.5 19.5L42.4 21.6L44.5 22.5L42.4 23.4L41.5 25.5L40.6 23.4L38.5 22.5L40.6 21.6Z" fill={theme.symbol} />
        </g>
      )}

      {/* Top-Right Accent Sparkle or Status Corner Badge */}
      {isEarned ? (
        <g>
          <path d="M51 8L52.2 10.8L55 12L52.2 13.2L51 16L49.8 13.2L47 12L49.8 10.8Z" fill="#FBBF24" />
          <circle cx="50" cy="49" r="9.2" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
          <path
            d="M46.3 49.2L48.9 51.8L53.8 46.6"
            stroke="#FFFFFF"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ) : (
        <g>
          <circle cx="50" cy="49" r="9.2" fill="#334155" stroke="#FFFFFF" strokeWidth="2" />
          <path
            d="M47.4 48.2V46.6C47.4 45.1 48.6 44 50 44C51.4 44 52.6 45.1 52.6 46.6V48.2"
            stroke="#FFFFFF"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <rect x="46.3" y="48.2" width="7.4" height="5.4" rx="1.4" fill="#FFFFFF" />
          <circle cx="50" cy="50.9" r="0.9" fill="#334155" />
        </g>
      )}
    </svg>
  )
}
