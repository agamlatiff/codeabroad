import type { FC } from 'react'
import { KodiCharacter, type KodiEmotion } from '@/shared/components/ui/KodiCharacter'

export interface FlashcardHeroIllustrationProps {
  totalDue: number
  totalLearned: number
  className?: string
}

/**
 * Editorial floating vector flashcards + contextual Kodi mascot for the /flashcards hero banner.
 */
export const FlashcardHeroIllustration: FC<FlashcardHeroIllustrationProps> = ({
  totalDue,
  totalLearned,
  className = '',
}) => {
  const kodiEmotion: KodiEmotion =
    totalDue > 0 ? 'clock' : totalLearned > 0 ? 'cheering' : 'reading'

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-end w-[216px] h-[112px] select-none pointer-events-none ${className}`.trim()}
    >
      {/* Ambient Radial Aura */}
      <div className="absolute left-3 top-2 w-24 h-24 rounded-full bg-sky-300/25 blur-xl" />
      <div className="absolute right-2 bottom-1 w-24 h-24 rounded-full bg-amber-300/20 blur-xl" />

      {/* Fanned Floating Vector Cards Trio */}
      <svg
        viewBox="0 0 132 104"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[132px] h-[104px] shrink-0 -mr-5 drop-shadow-xs"
      >
        {/* Left Card: あ (Amber) */}
        <g transform="rotate(-14 34 62)">
          <rect
            x="16"
            y="22"
            width="42"
            height="56"
            rx="9"
            fill="#FFFBEB"
            stroke="#1E293B"
            strokeWidth="2.2"
          />
          <rect x="17" y="23" width="40" height="6" rx="3" fill="#F59E0B" />
          <text
            x="37"
            y="57"
            textAnchor="middle"
            fill="#B45309"
            fontSize="20"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            あ
          </text>
          <rect x="25" y="65" width="24" height="3.5" rx="1.75" fill="#FDE68A" />
        </g>

        {/* Center Card: 語 (Sky Blue) */}
        <g transform="rotate(-2 64 56)">
          <rect
            x="44"
            y="18"
            width="44"
            height="58"
            rx="9"
            fill="#F0F9FF"
            stroke="#1E293B"
            strokeWidth="2.2"
          />
          <rect x="45" y="19" width="42" height="6" rx="3" fill="#0EA5E9" />
          <text
            x="66"
            y="53"
            textAnchor="middle"
            fill="#0369A1"
            fontSize="20"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            語
          </text>
          <rect x="53" y="62" width="26" height="3.5" rx="1.75" fill="#BAE6FD" />
        </g>

        {/* Right Card: ★ (Emerald Mastery) */}
        <g transform="rotate(10 92 60)">
          <rect
            x="72"
            y="22"
            width="42"
            height="56"
            rx="9"
            fill="#ECFDF5"
            stroke="#1E293B"
            strokeWidth="2.2"
          />
          <rect x="73" y="23" width="40" height="6" rx="3" fill="#10B981" />
          <path
            d="M93 38L95.8 43.8L102.2 44.7L97.6 49.1L98.7 55.4L93 52.4L87.3 55.4L88.4 49.1L83.8 44.7L90.2 43.8Z"
            fill="#10B981"
            stroke="#065F46"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <rect x="81" y="63" width="24" height="3.5" rx="1.75" fill="#A7F3D0" />
        </g>

        {/* Floating Sparkles & Sakura Accent */}
        <path
          d="M17 14L18.4 17.4L21.8 18.8L18.4 20.2L17 23.6L15.6 20.2L12.2 18.8L15.6 17.4Z"
          fill="#FBBF24"
        />
        <path
          d="M108 10L109 12.6L111.6 13.6L109 14.6L108 17.2L107 14.6L104.4 13.6L107 12.6Z"
          fill="#38BDF8"
        />
        <ellipse
          cx="22"
          cy="86"
          rx="4.2"
          ry="2.5"
          transform="rotate(-24 22 86)"
          fill="#FDA4AF"
        />
      </svg>

      {/* Foreground Contextual Kodi Mascot */}
      <div className="relative z-10 drop-shadow-sm">
        <KodiCharacter emotion={kodiEmotion} size={92} />
      </div>
    </div>
  )
}
