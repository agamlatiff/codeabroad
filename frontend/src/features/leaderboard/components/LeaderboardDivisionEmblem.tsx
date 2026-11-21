import type { FC } from 'react'
import type { LeagueDivision } from '@/features/leaderboard/types/leaderboard'

export interface LeaderboardDivisionEmblemProps {
  division: LeagueDivision
  size?: 'sm' | 'md' | 'lg'
  shimmer?: boolean
  className?: string
}

const SIZE_CLASSES = {
  sm: 'w-7 h-7',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
} as const

export const LeaderboardDivisionEmblem: FC<LeaderboardDivisionEmblemProps> = ({
  division,
  size = 'md',
  shimmer = false,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-xl ${
        SIZE_CLASSES[size]
      } ${shimmer ? 'lb-shimmer-sweep' : ''} ${className}`}
      aria-hidden="true"
    >
      {division === 'bronze' && (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-xs">
          <path
            d="M32 6L52 14V31C52 44.2 43.2 53.6 32 58C20.8 53.6 12 44.2 12 31V14L32 6Z"
            fill="#D97706"
            stroke="#78350F"
            strokeWidth="3"
          />
          <path
            d="M32 11L47 17V31C47 41.2 40.3 48.6 32 52.2C23.7 48.6 17 41.2 17 31V17L32 11Z"
            fill="#F59E0B"
          />
          <path
            d="M32 20L35.2 26.8L42.5 27.8L37.1 32.9L38.5 40.2L32 36.7L25.5 40.2L26.9 32.9L21.5 27.8L28.8 26.8L32 20Z"
            fill="#FEF3C7"
            stroke="#92400E"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {division === 'silver' && (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-xs">
          {/* Wing accents */}
          <path d="M12 20L4 15L8 28L14 27Z" fill="#A5B4FC" stroke="#475569" strokeWidth="2" />
          <path d="M52 20L60 15L56 28L50 27Z" fill="#A5B4FC" stroke="#475569" strokeWidth="2" />
          {/* Metallic shield */}
          <path
            d="M32 7L51 15V31C51 43.8 42.5 52.8 32 57C21.5 52.8 13 43.8 13 31V15L32 7Z"
            fill="#94A3B8"
            stroke="#334155"
            strokeWidth="2.8"
          />
          <path
            d="M32 12L46 18V31C46 40.6 39.6 47.6 32 51.2V12Z"
            fill="#CBD5E1"
          />
          <path
            d="M32 12L18 18V31C18 40.6 24.4 47.6 32 51.2V12Z"
            fill="#E2E8F0"
          />
          {/* Double chevrons */}
          <path
            d="M24 27L32 20L40 27"
            stroke="#4338CA"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 36L32 29L40 36"
            stroke="#4F46E5"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {division === 'gold' && (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-xs">
          {/* Laurel wreath hints */}
          <path
            d="M11 38C6 31 7 21 13 16M53 38C58 31 57 21 51 16"
            stroke="#D97706"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Tournament crest */}
          <path
            d="M32 8L52 16V32C52 44.5 43.5 53.5 32 58C20.5 53.5 12 44.5 12 32V16L32 8Z"
            fill="#F59E0B"
            stroke="#92400E"
            strokeWidth="2.8"
          />
          <path
            d="M32 13L47 19.5V32C47 41.5 40.5 48.5 32 52.2C23.5 48.5 17 41.5 17 32V19.5L32 13Z"
            fill="#FDE047"
          />
          {/* Embedded crown */}
          <path
            d="M22 36L20 24L27 29L32 21L37 29L44 24L42 36H22Z"
            fill="#FFFFFF"
            stroke="#B45309"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect x="22" y="38" width="20" height="4" rx="2" fill="#B45309" />
        </svg>
      )}

      {division === 'diamond' && (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-xs">
          {/* Hexagonal crystal frame */}
          <path
            d="M32 5L55 18.5V45.5L32 59L9 45.5V18.5L32 5Z"
            fill="#06B6D4"
            stroke="#164E63"
            strokeWidth="2.8"
          />
          <path d="M32 10L50 20.5V43.5L32 54V10Z" fill="#22D3EE" />
          <path d="M32 10L14 20.5V43.5L32 54V10Z" fill="#67E8F9" />
          {/* Inner prism */}
          <path d="M21 26L32 16L43 26L32 47L21 26Z" fill="#EDE9FE" stroke="#6D28D9" strokeWidth="2" />
          <path d="M21 26H43L32 47L21 26Z" fill="#C4B5FD" opacity="0.7" />
          {/* Corner glint */}
          <path d="M51 11L53 15L57 17L53 19L51 23L49 19L45 17L49 15L51 11Z" fill="#FEF08A" />
        </svg>
      )}
    </div>
  )
}

export const LeaderboardGemIcon: FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M7 4H17L21 9L12 20L3 9L7 4Z"
      fill="#38BDF8"
      stroke="#0284C7"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M7 4L12 9L17 4" fill="#BAE6FD" />
    <path d="M3 9H21L12 20L3 9Z" fill="#0EA5E9" opacity="0.4" />
  </svg>
)

export const LeaderboardRankMedalIcon: FC<{ rank: 1 | 2 | 3; className?: string }> = ({
  rank,
  className = 'w-4 h-4',
}) => {
  const palette =
    rank === 1
      ? { fill: '#FACC15', inner: '#FEF08A', stroke: '#B45309' }
      : rank === 2
      ? { fill: '#CBD5E1', inner: '#F1F5F9', stroke: '#475569' }
      : { fill: '#D97706', inner: '#FDE68A', stroke: '#78350F' }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 3H16L14.5 9H9.5L8 3Z" fill="#3B82F6" />
      <circle cx="12" cy="14" r="7" fill={palette.fill} stroke={palette.stroke} strokeWidth="1.6" />
      <circle cx="12" cy="14" r="4.2" fill={palette.inner} />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="7"
        fontWeight="900"
        fill={palette.stroke}
      >
        {rank}
      </text>
    </svg>
  )
}
