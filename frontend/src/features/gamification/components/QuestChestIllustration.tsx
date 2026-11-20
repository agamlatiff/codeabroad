import { useId, type FC } from 'react'

export interface QuestChestIllustrationProps {
  tier: 1 | 2 | 3
  state: 'locked' | 'ready' | 'claimed'
  size?: number
  className?: string
}

interface ChestPalette {
  bodyLight: string
  bodyDark: string
  lidTop: string
  lidRim: string
  band: string
  clasp: string
  claspGem: string
  hasCrownCrest: boolean
}

const CHEST_PALETTES: Record<1 | 2 | 3, ChestPalette> = {
  1: {
    bodyLight: '#D97706',
    bodyDark: '#92400E',
    lidTop: '#F59E0B',
    lidRim: '#B45309',
    band: '#FCD34D',
    clasp: '#FEF3C7',
    claspGem: '#38BDF8',
    hasCrownCrest: false,
  },
  2: {
    bodyLight: '#CBD5E1',
    bodyDark: '#64748B',
    lidTop: '#E2E8F0',
    lidRim: '#94A3B8',
    band: '#F8FAFC',
    clasp: '#FFFFFF',
    claspGem: '#0EA5E9',
    hasCrownCrest: false,
  },
  3: {
    bodyLight: '#FBBF24',
    bodyDark: '#B45309',
    lidTop: '#FDE047',
    lidRim: '#D97706',
    band: '#FEF08A',
    clasp: '#FFFBEB',
    claspGem: '#F43F5E',
    hasCrownCrest: true,
  },
}

/**
 * Custom vector SVG treasure chest illustration in 3 metal tiers (Bronze, Silver, Gold)
 * and 3 distinct interactive states (locked, ready-to-claim sunburst, opened/claimed).
 */
export const QuestChestIllustration: FC<QuestChestIllustrationProps> = ({
  tier,
  state,
  size = 48,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '')
  const glowId = `chest-glow-${uid}`
  const palette = CHEST_PALETTES[tier]

  const isLocked = state === 'locked'
  const isReady = state === 'ready'
  const isClaimed = state === 'claimed'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${isLocked ? 'opacity-80 saturate-75' : ''} ${className}`.trim()}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={glowId} x1="32" y1="8" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0" />
          <stop offset="55%" stopColor="#FDE047" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* Soft Ground Shadow */}
      <ellipse cx="32" cy="55.5" rx="18" ry="3.5" fill="#0F172A" opacity={isLocked ? '0.08' : '0.14'} />

      {/* Sunburst Aura & Sparkles when Ready */}
      {isReady && (
        <g>
          <circle cx="32" cy="31" r="22" fill="#FDE047" opacity="0.22" />
          <path
            d="M32 6V11M18 11L21 15M46 11L43 15M10 23H15M54 23H49"
            stroke="#F59E0B"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M14 14L15 16.5L17.5 17.5L15 18.5L14 21L13 18.5L10.5 17.5L13 16.5Z" fill="#FBBF24" />
          <path d="M51 12L52 14.2L54.2 15.2L52 16.2L51 18.4L50 16.2L47.8 15.2L50 14.2Z" fill="#F59E0B" />
        </g>
      )}

      {isClaimed ? (
        <g>
          {/* Radiant Light Emerging From Open Chest */}
          <path d="M16 32L10 10H54L48 32H16Z" fill={`url(#${glowId})`} />

          {/* Tilted-Back Open Lid */}
          <g transform="rotate(-22 14 28)">
            <path
              d="M14 16C14 11.5 18 9 22 9H42C46 9 50 11.5 50 16V27H14V16Z"
              fill={palette.lidTop}
              stroke="#1E293B"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <rect x="20" y="9" width="5.5" height="18" fill={palette.band} stroke="#1E293B" strokeWidth="1.6" />
            <rect x="38.5" y="9" width="5.5" height="18" fill={palette.band} stroke="#1E293B" strokeWidth="1.6" />
            <rect x="13" y="24" width="38" height="4" rx="1.5" fill={palette.lidRim} stroke="#1E293B" strokeWidth="1.8" />
          </g>

          {/* Dark Hollow Chest Interior Rim */}
          <path
            d="M14 29H50L48 35H16L14 29Z"
            fill="#451A03"
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Peeking Treasure Coins & Gem Inside */}
          <circle cx="24" cy="31.5" r="3" fill="#FDE047" stroke="#B45309" strokeWidth="1.2" />
          <circle cx="31" cy="30.5" r="3.2" fill="#FBBF24" stroke="#B45309" strokeWidth="1.2" />
          <circle cx="39" cy="31.5" r="3" fill="#FDE047" stroke="#B45309" strokeWidth="1.2" />
          <polygon points="34,26 38,30 34,34 30,30" fill="#38BDF8" stroke="#0369A1" strokeWidth="1.2" />

          {/* Front Base Box */}
          <path
            d="M14 32H50V49C50 51.2 48.2 53 46 53H18C15.8 53 14 51.2 14 49V32Z"
            fill={palette.bodyLight}
            stroke="#1E293B"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Lower Depth Panel */}
          <path d="M15 44H49V49C49 50.6 47.6 52 46 52H18C16.4 52 15 50.6 15 49V44Z" fill={palette.bodyDark} />
          {/* Metal Straps */}
          <rect x="20" y="32" width="5.5" height="21" fill={palette.band} stroke="#1E293B" strokeWidth="1.6" />
          <rect x="38.5" y="32" width="5.5" height="21" fill={palette.band} stroke="#1E293B" strokeWidth="1.6" />
          {/* Center Lock Plate */}
          <rect
            x="28"
            y="33.5"
            width="8"
            height="8.5"
            rx="2"
            fill={palette.clasp}
            stroke="#1E293B"
            strokeWidth="1.8"
          />
          <circle cx="32" cy="37.8" r="1.8" fill={palette.claspGem} />
        </g>
      ) : (
        /* Closed Chest (Locked or Ready) */
        <g transform={isReady ? 'rotate(-5 32 38)' : undefined}>
          {/* Gold Crown Crest on Tier 3 Lid */}
          {palette.hasCrownCrest && (
            <path
              d="M25 18L27.5 11.5L32 15.5L36.5 11.5L39 18H25Z"
              fill="#FEF08A"
              stroke="#1E293B"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          )}

          {/* Chest Base */}
          <path
            d="M13 33H51V49C51 51.5 49 53.5 46.5 53.5H17.5C15 53.5 13 51.5 13 49V33Z"
            fill={palette.bodyLight}
            stroke="#1E293B"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M14.2 44.5H49.8V49C49.8 50.8 48.3 52.3 46.5 52.3H17.5C15.7 52.3 14.2 50.8 14.2 49V44.5Z" fill={palette.bodyDark} />
          {/* Base Metal Straps */}
          <rect x="19.5" y="33" width="5.5" height="20.5" fill={palette.band} stroke="#1E293B" strokeWidth="1.6" />
          <rect x="39" y="33" width="5.5" height="20.5" fill={palette.band} stroke="#1E293B" strokeWidth="1.6" />

          {/* Arched Chest Lid */}
          <path
            d="M12 29C12 22.4 17.4 18 24 18H40C46.6 18 52 22.4 52 29V34H12V29Z"
            fill={palette.lidTop}
            stroke="#1E293B"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Lid Metal Straps */}
          <rect x="19.5" y="18" width="5.5" height="16" fill={palette.band} stroke="#1E293B" strokeWidth="1.6" />
          <rect x="39" y="18" width="5.5" height="16" fill={palette.band} stroke="#1E293B" strokeWidth="1.6" />
          {/* Horizontal Lid Rim */}
          <rect x="11.5" y="31" width="41" height="4.2" rx="1.6" fill={palette.lidRim} stroke="#1E293B" strokeWidth="1.8" />
          {/* Top Lid Shine Streak */}
          <path d="M18 22.5H28" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.65" />

          {/* Center Clasp Lock */}
          <rect
            x="27.5"
            y="29.5"
            width="9"
            height="10.5"
            rx="2.5"
            fill={palette.clasp}
            stroke="#1E293B"
            strokeWidth="2"
          />
          <circle cx="32" cy="34.8" r="2.2" fill={palette.claspGem} stroke="#1E293B" strokeWidth="1" />
        </g>
      )}

      {/* Corner State Badge: Padlock (locked) or Checkmark (claimed) */}
      {isLocked && (
        <g>
          <circle cx="50" cy="49" r="9.5" fill="#334155" stroke="#FFFFFF" strokeWidth="2" />
          <path
            d="M47.4 48.2V46.6C47.4 45.1 48.6 44 50 44C51.4 44 52.6 45.1 52.6 46.6V48.2"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <rect x="46.2" y="48.2" width="7.6" height="5.6" rx="1.4" fill="#FFFFFF" />
          <circle cx="50" cy="51" r="1" fill="#334155" />
        </g>
      )}

      {isClaimed && (
        <g>
          <circle cx="50" cy="49" r="9.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
          <path
            d="M46.2 49.2L48.8 51.8L54 46.4"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  )
}
