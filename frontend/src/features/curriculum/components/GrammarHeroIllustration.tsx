import type { FC } from 'react'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'

export interface GrammarHeroIllustrationProps {
  levelLabel?: string
  className?: string
}

/**
 * Editorial illustration showing interconnected Japanese grammar syntax blocks (は / です / ます),
 * an open grammar notebook, and Kodi explaining patterns beside the blocks.
 */
export const GrammarHeroIllustration: FC<GrammarHeroIllustrationProps> = ({
  levelLabel = 'N5',
  className = '',
}) => {
  const displayLevel = (levelLabel || 'N5').slice(0, 5)

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-end w-[224px] h-[112px] select-none pointer-events-none ${className}`.trim()}
    >
      {/* Soft Ambient Glows */}
      <div className="absolute left-3 top-2 w-24 h-24 rounded-full bg-blue-300/25 blur-xl" />
      <div className="absolute right-2 bottom-1 w-24 h-24 rounded-full bg-amber-300/20 blur-xl" />

      {/* Grammar Syntax Blocks + Open Notebook SVG */}
      <svg
        viewBox="0 0 138 104"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[138px] h-[104px] shrink-0 -mr-5 drop-shadow-xs"
      >
        {/* Dotted Connector Line Linking Syntax Blocks */}
        <path
          d="M28 29C44 21 56 32 70 25C84 19 96 29 109 23"
          stroke="#64748B"
          strokeWidth="1.8"
          strokeDasharray="3.5 3.5"
          strokeLinecap="round"
        />

        {/* Syntax Block 1: Particle は (Amber) */}
        <g transform="rotate(-6 27 26)">
          <rect
            x="12"
            y="14"
            width="30"
            height="24"
            rx="7"
            fill="#FEF3C7"
            stroke="#1E293B"
            strokeWidth="2"
          />
          <rect x="13" y="15" width="28" height="4.5" rx="2" fill="#F59E0B" />
          <text
            x="27"
            y="32"
            textAnchor="middle"
            fill="#92400E"
            fontSize="12"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            は
          </text>
        </g>

        {/* Syntax Block 2: Sentence Copula です (Blue) */}
        <g transform="rotate(2 68 23)">
          <rect
            x="49"
            y="11"
            width="38"
            height="24"
            rx="7"
            fill="#EFF6FF"
            stroke="#1E293B"
            strokeWidth="2"
          />
          <rect x="50" y="12" width="36" height="4.5" rx="2" fill="#2563EB" />
          <text
            x="68"
            y="29"
            textAnchor="middle"
            fill="#1E40AF"
            fontSize="10.5"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            です
          </text>
        </g>

        {/* Syntax Block 3: Conjugation ます (Emerald) */}
        <g transform="rotate(-4 108 24)">
          <rect
            x="91"
            y="13"
            width="35"
            height="22"
            rx="7"
            fill="#ECFDF5"
            stroke="#1E293B"
            strokeWidth="2"
          />
          <rect x="92" y="14" width="33" height="4" rx="2" fill="#10B981" />
          <text
            x="108.5"
            y="30"
            textAnchor="middle"
            fill="#065F46"
            fontSize="10"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            ます
          </text>
        </g>

        {/* Open Japanese Grammar Textbook */}
        <rect
          x="18"
          y="48"
          width="96"
          height="46"
          rx="8"
          fill="#2563EB"
          stroke="#1E293B"
          strokeWidth="2.2"
        />
        {/* Left & Right Open Paper Pages */}
        <path
          d="M22 50H64V89C50 86.5 34 86.5 22 89V50Z"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M68 50H110V89C98 86.5 82 86.5 68 89V50Z"
          fill="#F8FAFC"
          stroke="#1E293B"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Crimson Ribbon Bookmark */}
        <path
          d="M52 49V69L56.5 65.5L61 69V49H52Z"
          fill="#F43F5E"
          stroke="#1E293B"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Notebook Ruled Lines & Japanese Bracket Motif */}
        <path
          d="M29 58H46M29 66H47M29 74H54M74 58H103M74 66H98"
          stroke="#CBD5E1"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Mini JLPT Tag on Right Page */}
        <rect x="74" y="72" width="28" height="11" rx="4" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
        <text
          x="88"
          y="80"
          textAnchor="middle"
          fill="#1D4ED8"
          fontSize="6.8"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {displayLevel}
        </text>

        {/* Corner Quotation Accents & Sparkles */}
        <path d="M12 64V58H18" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
        <path
          d="M84 41L85 43.2L87.2 44.2L85 45.2L84 47.4L83 45.2L80.8 44.2L83 43.2Z"
          fill="#FBBF24"
        />
        <path
          d="M14 42L15 44.2L17.2 45.2L15 46.2L14 48.4L13 46.2L10.8 45.2L13 44.2Z"
          fill="#38BDF8"
        />
      </svg>

      {/* Explaining Kodi Mascot */}
      <div className="relative z-10 drop-shadow-sm">
        <KodiCharacter emotion="explaining" size={92} />
      </div>
    </div>
  )
}
