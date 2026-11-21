import type { FC } from 'react'
import { KodiCharacter, type KodiEmotion } from '@/shared/components/ui/KodiCharacter'
import type { KanaScriptType } from '@/features/curriculum/types/curriculum'

export interface KanaHeroIllustrationProps {
  activeScript?: KanaScriptType
  className?: string
}

/**
 * Editorial Japanese calligraphy & 3-script illustration (Hiragana あ, Katakana ア, Kanji 漢)
 * paired with Kodi for the Aksara Jepang hero banner.
 */
export const KanaHeroIllustration: FC<KanaHeroIllustrationProps> = ({
  activeScript = 'hiragana',
  className = '',
}) => {
  const kodiEmotion: KodiEmotion =
    activeScript === 'hiragana'
      ? 'writing'
      : activeScript === 'katakana'
        ? 'reading'
        : 'idea'

  const isHiragana = activeScript === 'hiragana'
  const isKatakana = activeScript === 'katakana'
  const isKanji = activeScript === 'kanji'

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-end w-[232px] h-[112px] select-none pointer-events-none ${className}`.trim()}
    >
      {/* Ambient Radial Glows */}
      <div className="absolute left-2 top-2 w-24 h-24 rounded-full bg-emerald-300/25 blur-xl" />
      <div className="absolute right-4 bottom-1 w-24 h-24 rounded-full bg-sky-300/20 blur-xl" />

      {/* 3-Script Tactile Tiles + Japanese Brush & Hanko Stamp SVG */}
      <svg
        viewBox="0 0 144 104"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[144px] h-[104px] shrink-0 -mr-5 drop-shadow-xs"
      >
        {/* Washi Paper Brush Ribbon Backdrop */}
        <path
          d="M10 68C32 54 68 58 104 42C116 37 128 38 134 44"
          stroke="#10B981"
          strokeWidth="6"
          strokeOpacity="0.16"
          strokeLinecap="round"
        />
        <path
          d="M16 78C46 66 78 72 114 56"
          stroke="#0EA5E9"
          strokeWidth="4"
          strokeOpacity="0.14"
          strokeLinecap="round"
        />

        {/* Tile 1 (Left): Hiragana あ (Emerald) */}
        <g transform={isHiragana ? 'translate(0 -3) rotate(-9 30 56)' : 'rotate(-9 30 56)'}>
          <rect
            x="10"
            y="24"
            width="40"
            height="50"
            rx="10"
            fill={isHiragana ? '#ECFDF5' : '#FFFFFF'}
            stroke={isHiragana ? '#059669' : '#1E293B'}
            strokeWidth={isHiragana ? '2.5' : '2'}
          />
          <rect
            x="11.5"
            y="25.5"
            width="37"
            height="6"
            rx="3"
            fill={isHiragana ? '#10B981' : '#34D399'}
          />
          <text
            x="30"
            y="58"
            textAnchor="middle"
            fill="#065F46"
            fontSize="21"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            あ
          </text>
          <rect x="20" y="65" width="20" height="3" rx="1.5" fill="#A7F3D0" />
        </g>

        {/* Tile 2 (Center): Katakana ア (Sky Blue) */}
        <g transform={isKatakana ? 'translate(0 -4) rotate(1 66 44)' : 'rotate(1 66 44)'}>
          <rect
            x="45"
            y="14"
            width="42"
            height="52"
            rx="10"
            fill={isKatakana ? '#F0F9FF' : '#FFFFFF'}
            stroke={isKatakana ? '#0284C7' : '#1E293B'}
            strokeWidth={isKatakana ? '2.5' : '2'}
          />
          <rect
            x="46.5"
            y="15.5"
            width="39"
            height="6"
            rx="3"
            fill={isKatakana ? '#0EA5E9' : '#38BDF8'}
          />
          <text
            x="66"
            y="49"
            textAnchor="middle"
            fill="#0369A1"
            fontSize="21"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            ア
          </text>
          <rect x="55" y="57" width="22" height="3" rx="1.5" fill="#BAE6FD" />
        </g>

        {/* Tile 3 (Right): Kanji 漢 (Amber Gold) */}
        <g transform={isKanji ? 'translate(0 -3) rotate(10 100 54)' : 'rotate(10 100 54)'}>
          <rect
            x="80"
            y="23"
            width="42"
            height="52"
            rx="10"
            fill={isKanji ? '#FFFBEB' : '#FFFFFF'}
            stroke={isKanji ? '#D97706' : '#1E293B'}
            strokeWidth={isKanji ? '2.5' : '2'}
          />
          <rect
            x="81.5"
            y="24.5"
            width="39"
            height="6"
            rx="3"
            fill={isKanji ? '#F59E0B' : '#FBBF24'}
          />
          <text
            x="101"
            y="57"
            textAnchor="middle"
            fill="#92400E"
            fontSize="20"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            漢
          </text>
          <rect x="90" y="65" width="22" height="3" rx="1.5" fill="#FDE68A" />
        </g>

        {/* Traditional Red Hanko Seal Stamp */}
        <g transform="rotate(-8 106 83)">
          <rect
            x="96"
            y="74"
            width="19"
            height="19"
            rx="4"
            fill="#FFF1F2"
            stroke="#E11D48"
            strokeWidth="1.8"
          />
          <text
            x="105.5"
            y="87.5"
            textAnchor="middle"
            fill="#E11D48"
            fontSize="11"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            和
          </text>
        </g>

        {/* Calligraphy Brush (Fude) Accent at Bottom Left */}
        <g transform="rotate(-24 44 88)">
          <rect
            x="22"
            y="85"
            width="44"
            height="6.5"
            rx="3.2"
            fill="#92400E"
            stroke="#1E293B"
            strokeWidth="1.6"
          />
          <rect x="57" y="85" width="7" height="6.5" rx="1" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.5" />
          <path
            d="M64 85.2L73.5 88.2L64 91.2Z"
            fill="#0F172A"
            stroke="#0F172A"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </g>

        {/* Sparkles & Sakura Accent */}
        <path
          d="M18 12L19.4 15.2L22.6 16.6L19.4 18L18 21.2L16.6 18L13.4 16.6L16.6 15.2Z"
          fill="#FBBF24"
        />
        <path
          d="M116 11L117 13.4L119.4 14.4L117 15.4L116 17.8L115 15.4L112.6 14.4L115 13.4Z"
          fill="#10B981"
        />
        <ellipse
          cx="126"
          cy="76"
          rx="4.2"
          ry="2.4"
          transform="rotate(-26 126 76)"
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
