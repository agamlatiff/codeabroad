import { useId, type FC } from 'react'

export interface MonthlyBadgeEmblemProps {
  monthShort: string
  progressPercent: number
  isUnlocked: boolean
  size?: number
  className?: string
}

/**
 * Custom SVG Japanese-inspired monthly medallion with circular progress ring,
 * crimson ribbon tails, sakura petals, and minimalist Kodi ear silhouette.
 */
export const MonthlyBadgeEmblem: FC<MonthlyBadgeEmblemProps> = ({
  monthShort,
  progressPercent,
  isUnlocked,
  size = 84,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '')
  const medalGradId = `monthly-medal-${uid}`
  const rimGradId = `monthly-rim-${uid}`

  const clampedProgress = Math.max(0, Math.min(100, progressPercent))
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference
  const normalizedMonth = (monthShort || 'BLN').slice(0, 3).toUpperCase()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 112 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={medalGradId} x1="26" y1="22" x2="86" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isUnlocked ? '#FEF08A' : '#FDE68A'} />
          <stop offset="55%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id={rimGradId} x1="20" y1="16" x2="92" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>

      {/* Outer Progress Ring Track */}
      <circle
        cx="56"
        cy="52"
        r={radius}
        stroke="#FDE68A"
        strokeWidth="5"
        opacity="0.7"
      />
      {/* Active Progress Ring Arc */}
      <circle
        cx="56"
        cy="52"
        r={radius}
        stroke={isUnlocked ? '#10B981' : '#F59E0B'}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 56 52)"
      />

      {/* Crimson Japanese Ribbon Tails Below Medallion */}
      <path
        d="M39 74L28 104L42 97L49 107L53 79"
        fill="#E11D48"
        stroke="#881337"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M73 74L84 104L70 97L63 107L59 79"
        fill="#BE123C"
        stroke="#881337"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Medallion Outer Golden Rim */}
      <circle
        cx="56"
        cy="52"
        r="37"
        fill={`url(#${rimGradId})`}
        stroke="#78350F"
        strokeWidth="2.4"
      />

      {/* Medallion Inner Disc */}
      <circle
        cx="56"
        cy="52"
        r="31"
        fill={`url(#${medalGradId})`}
        stroke="#92400E"
        strokeWidth="1.6"
      />

      {/* Diagonal Subtle Metallic Shine */}
      <path
        d="M36 31C42 26 51 23 59 23L33 57C30 48 31 38 36 31Z"
        fill="#FFFFFF"
        opacity="0.28"
      />

      {/* Flanking Sakura Petals */}
      <g fill="#FDA4AF" stroke="#BE123C" strokeWidth="1">
        <circle cx="29" cy="49" r="3" />
        <circle cx="83" cy="49" r="3" />
      </g>

      {/* Minimalist Kodi Cat-Ear Head Silhouette */}
      <path
        d="M41.5 52C41.5 44.8 44 41.2 44.5 34.5C45.3 33.4 47.4 34.2 50 37.8C51.9 37.2 53.9 37 56 37C58.1 37 60.1 37.2 62 37.8C64.6 34.2 66.7 33.4 67.5 34.5C68 41.2 70.5 44.8 70.5 52C70.5 58 64.5 61 56 61C47.5 61 41.5 58 41.5 52Z"
        fill="#FFFFFF"
        stroke="#78350F"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="51" cy="49" r="1.7" fill="#1E293B" />
      <circle cx="61" cy="49" r="1.7" fill="#1E293B" />
      <path d="M54.3 52.2C55.1 53.3 56.9 53.3 57.7 52.2" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />

      {/* Month Stamp Ribbon Banner */}
      <rect
        x="34"
        y="61"
        width="44"
        height="16"
        rx="8"
        fill={isUnlocked ? '#059669' : '#78350F'}
        stroke="#FFFFFF"
        strokeWidth="1.8"
      />
      <text
        x="56"
        y="72"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="10"
        fontWeight="900"
        letterSpacing="1.2"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {normalizedMonth}
      </text>

      {/* Top Crown Sparkle when Unlocked */}
      {isUnlocked && (
        <path
          d="M56 10L57.5 13.5L61 15L57.5 16.5L56 20L54.5 16.5L51 15L54.5 13.5Z"
          fill="#10B981"
          stroke="#FFFFFF"
          strokeWidth="1"
        />
      )}
    </svg>
  )
}
