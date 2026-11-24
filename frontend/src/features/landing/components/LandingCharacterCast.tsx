import { useId, type FC } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export type CharacterMood = 'happy' | 'excited' | 'listening' | 'pointing' | 'thinking'

export interface CastCharacterProps {
  mood?: CharacterMood
  size?: number
  className?: string
  badgeText?: string
}

function sanitizeSvgId(rawId: string): string {
  return rawId.replace(/[^a-zA-Z0-9_-]/g, '')
}

/**
 * Shared crisp cel-shaded circular reward badge held by squad buddies.
 */
interface SquadBadgeProps {
  cx: number
  cy: number
  r?: number
  variant: 'lime' | 'sky-disc'
  text: string
  uid: string
}

const SquadHeldBadge: FC<SquadBadgeProps> = ({
  cx,
  cy,
  r = 18.5,
  variant,
  text,
  uid,
}) => {
  const gradId = `${uid}-badge-${variant}`
  const isPlusCross = variant === 'sky-disc' && text === '+'

  return (
    <g transform={`translate(${cx}, ${cy})`}>
      {variant === 'lime' ? (
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A3E635" />
            <stop offset="55%" stopColor="#84CC16" />
            <stop offset="100%" stopColor="#4D7C0F" />
          </linearGradient>
        </defs>
      ) : (
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F0F9FF" />
          </linearGradient>
        </defs>
      )}

      {/* White sticker halo */}
      <circle r={r + 3.2} fill="#FFFFFF" />

      {/* Outer dark comic border + gradient face */}
      <circle
        r={r}
        fill={`url(#${gradId})`}
        stroke="#1E293B"
        strokeWidth="3.2"
      />

      {/* Inner accent ring */}
      {variant === 'sky-disc' ? (
        <circle
          r={r - 4}
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="3"
        />
      ) : (
        <path
          d={`M ${-r * 0.56} ${-r * 0.34} A ${r * 0.65} ${r * 0.65} 0 0 1 ${r * 0.5} ${-r * 0.42}`}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.45"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      )}

      {/* Badge symbol / text */}
      {isPlusCross ? (
        <g fill="#0284C7" stroke="#0369A1" strokeWidth="0.6">
          <rect x="-8.5" y="-2.6" width="17" height="5.2" rx="2.6" />
          <rect x="-2.6" y="-8.5" width="5.2" height="17" rx="2.6" />
        </g>
      ) : (
        <text
          x="0"
          y="1"
          textAnchor="middle"
          dominantBaseline="central"
          fill={variant === 'lime' ? '#FFFFFF' : '#0284C7'}
          fontFamily="'Fredoka', 'Plus Jakarta Sans', system-ui, sans-serif"
          fontWeight="800"
          fontSize={text.length > 2 ? '11.5' : '14'}
          letterSpacing="-0.03em"
        >
          {text}
        </text>
      )}
    </g>
  )
}

/**
 * Shared curved vector soundwave arcs for 'listening' mood.
 */
const ListeningSoundWaves: FC<{ x: number; y: number; flip?: boolean }> = ({
  x,
  y,
  flip = false,
}) => (
  <g
    transform={`translate(${x}, ${y}) scale(${flip ? -1 : 1}, 1)`}
    fill="none"
    strokeLinecap="round"
  >
    <path
      d="M 4 -8 Q 11 0 4 8"
      stroke="#2563EB"
      strokeWidth="3"
    />
    <path
      d="M 11 -14 Q 20 0 11 14"
      stroke="#38BDF8"
      strokeWidth="2.8"
    />
  </g>
)

/**
 * Shared crisp 4-point vector sparkle cluster for 'excited' / 'pointing' moods.
 */
const ExcitedSparkles: FC<{
  leftX: number
  rightX: number
  topY: number
}> = ({ leftX, rightX, topY }) => (
  <g>
    <path
      d={`M ${leftX} ${topY - 9} L ${leftX + 2.6} ${topY - 2.6} L ${leftX + 9} ${topY} L ${leftX + 2.6} ${topY + 2.6} L ${leftX} ${topY + 9} L ${leftX - 2.6} ${topY + 2.6} L ${leftX - 9} ${topY} L ${leftX - 2.6} ${topY - 2.6} Z`}
      fill="#FACC15"
      stroke="#1E293B"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d={`M ${rightX} ${topY + 4 - 7} L ${rightX + 2} ${topY + 4 - 2} L ${rightX + 7} ${topY + 4} L ${rightX + 2} ${topY + 4 + 2} L ${rightX} ${topY + 4 + 7} L ${rightX - 2} ${topY + 4 + 2} L ${rightX - 7} ${topY + 4} L ${rightX - 2} ${topY + 4 - 2} Z`}
      fill="#38BDF8"
      stroke="#1E293B"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </g>
)

/**
 * Shared geometric vector '?' bubble for 'thinking' mood (zero Unicode glyph risk).
 */
const ThinkingQuestionBubble: FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx="-10" cy="14" r="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
    <circle cx="-5" cy="8" r="4.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
    <rect
      x="-2"
      y="-14"
      width="24"
      height="24"
      rx="12"
      fill="#FFFFFF"
      stroke="#1E293B"
      strokeWidth="2.4"
    />
    <path
      d="M 6.5 -5.5 C 6.5 -8.5 13.5 -8.5 13.5 -4.5 C 13.5 -2 10 -1.5 10 1.2"
      fill="none"
      stroke="#2563EB"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <circle cx="10" cy="4.8" r="1.6" fill="#2563EB" />
  </g>
)

/**
 * CoralBuddyCharacter — Playful coral-berry buddy with shaggy chestnut bangs,
 * rosy cheeks, joyful toothy smile, and lime-green '+1' badge.
 */
export const CoralBuddyCharacter: FC<CastCharacterProps> = ({
  mood = 'happy',
  size = 112,
  className = '',
  badgeText = '+1',
}) => {
  const rawId = useId()
  const uid = sanitizeSvgId(rawId)
  const height = Math.round(size * (164 / 156))

  const bodyGrad = `${uid}-coral-body`
  const hairGrad = `${uid}-coral-hair`
  const bodyClip = `${uid}-coral-clip`

  const irisShiftX = mood === 'thinking' ? 2 : mood === 'pointing' ? 2.5 : 0
  const irisShiftY = mood === 'thinking' ? -2 : 0

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 156 164"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible select-none shrink-0 ${className}`.trim()}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bodyGrad} x1="25%" y1="10%" x2="85%" y2="95%">
          <stop offset="0%" stopColor="#FF7B89" />
          <stop offset="52%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
        <linearGradient id={hairGrad} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#A16207" />
          <stop offset="45%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <clipPath id={bodyClip}>
          <path d="M 38 92 C 35 56 50 34 78 34 C 106 34 121 56 118 92 C 116 122 103 136 78 136 C 53 136 40 122 38 92 Z" />
        </clipPath>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="78" cy="150" rx="40" ry="7" fill="#0F172A" fillOpacity="0.11" />

      {/* Left arm (waves higher when excited or pointing) */}
      <path
        d={
          mood === 'excited'
            ? 'M 42 84 C 24 72 17 56 23 48 C 29 41 39 51 45 69 Z'
            : 'M 41 88 C 25 94 18 106 25 113 C 31 119 41 111 45 99 Z'
        }
        fill="#F43F5E"
        stroke="#1E293B"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />

      {/* Stubby legs & feet */}
      <path
        d="M 56 128 C 52 138 45 145 55 148 C 65 150 69 143 68 131 Z"
        fill="#BE123C"
        stroke="#1E293B"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path
        d="M 88 131 C 87 143 91 150 101 148 C 111 145 104 138 100 128 Z"
        fill="#BE123C"
        stroke="#1E293B"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />

      {/* Main coral-berry body */}
      <path
        d="M 38 92 C 35 56 50 34 78 34 C 106 34 121 56 118 92 C 116 122 103 136 78 136 C 53 136 40 122 38 92 Z"
        fill={`url(#${bodyGrad})`}
      />

      {/* Cel-shading crescent + belly + specular highlight */}
      <g clipPath={`url(#${bodyClip})`}>
        <ellipse cx="76" cy="112" rx="28" ry="20" fill="#FDA4AF" fillOpacity="0.34" />
        <path
          d="M 110 38 C 122 65 120 112 94 134 C 115 134 126 112 124 72 Z"
          fill="#9F1239"
          fillOpacity="0.28"
        />
        <path
          d="M 48 50 Q 60 40 76 42"
          stroke="#FFFFFF"
          strokeOpacity="0.45"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      {/* Main body outline */}
      <path
        d="M 38 92 C 35 56 50 34 78 34 C 106 34 121 56 118 92 C 116 122 103 136 78 136 C 53 136 40 122 38 92 Z"
        fill="none"
        stroke="#1E293B"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />

      {/* Listening headphones band & cup */}
      {mood === 'listening' && (
        <g>
          <path
            d="M 34 74 C 34 29 122 29 122 74"
            fill="none"
            stroke="#2563EB"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <path
            d="M 34 74 C 34 29 122 29 122 74"
            fill="none"
            stroke="#1E293B"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <rect
            x="24"
            y="62"
            width="13"
            height="24"
            rx="6.5"
            fill="#38BDF8"
            stroke="#1E293B"
            strokeWidth="3"
          />
          <rect
            x="119"
            y="62"
            width="13"
            height="24"
            rx="6.5"
            fill="#38BDF8"
            stroke="#1E293B"
            strokeWidth="3"
          />
          <ListeningSoundWaves x={135} y={70} />
        </g>
      )}

      {/* Shaggy chestnut-brown bangs & little cowlick tufts */}
      <g>
        <path
          d="M 65 36 C 60 22 68 15 74 25 C 79 13 89 16 86 29 C 95 21 102 28 94 38 C 108 38 119 48 119 64 C 113 58 107 55 101 58 C 97 50 90 50 85 57 C 80 48 72 48 68 57 C 61 50 53 52 48 60 C 42 57 38 61 36 67 C 35 49 47 37 65 36 Z"
          fill={`url(#${hairGrad})`}
          stroke="#1E293B"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <path
          d="M 55 43 Q 72 37 87 43"
          stroke="#B45309"
          strokeOpacity="0.6"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Expressive glossy eyes */}
      <g>
        {/* Left eye */}
        <ellipse
          cx="62"
          cy="76"
          rx="9.5"
          ry="11"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="3"
        />
        <circle cx={62 + irisShiftX} cy={76.5 + irisShiftY} r="5.6" fill="#0F172A" />
        <circle cx={60.2 + irisShiftX} cy={73.6 + irisShiftY} r="2.4" fill="#FFFFFF" />
        <circle cx={64.5 + irisShiftX} cy={79.2 + irisShiftY} r="1.1" fill="#FFFFFF" />

        {/* Right eye */}
        <ellipse
          cx="94"
          cy="76"
          rx="9.5"
          ry="11"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="3"
        />
        <circle cx={94 + irisShiftX} cy={76.5 + irisShiftY} r="5.6" fill="#0F172A" />
        <circle cx={92.2 + irisShiftX} cy={73.6 + irisShiftY} r="2.4" fill="#FFFFFF" />
        <circle cx={96.5 + irisShiftX} cy={79.2 + irisShiftY} r="1.1" fill="#FFFFFF" />

        {/* Subtle expressive brows */}
        {mood === 'thinking' ? (
          <>
            <path d="M 53 60 Q 62 56 69 61" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 86 63 Q 95 62 103 58" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
          </>
        ) : mood === 'excited' ? (
          <>
            <path d="M 53 59 Q 62 54 70 59" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 86 59 Q 94 54 103 59" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
          </>
        ) : null}
      </g>

      {/* Rosy cheeks */}
      <ellipse cx="47.5" cy="90" rx="6.2" ry="3.8" fill="#FB7185" fillOpacity="0.65" />
      <ellipse cx="108.5" cy="90" rx="6.2" ry="3.8" fill="#FB7185" fillOpacity="0.65" />

      {/* Mouth */}
      {mood === 'thinking' ? (
        <path
          d="M 69 101 Q 78 97 87 102"
          stroke="#1E293B"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      ) : (
        <g>
          <path
            d="M 56 95 Q 78 98 100 95 C 99 114 89 119 78 119 C 67 119 57 114 56 95 Z"
            fill="#881337"
            stroke="#1E293B"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Crisp white upper teeth band */}
          <path
            d="M 60 96.5 Q 78 98.8 96 96.5 L 94.5 102.5 Q 78 104 61.5 102.5 Z"
            fill="#FFFFFF"
          />
          {/* Playful tongue */}
          <path
            d="M 67 115 C 69 108 87 108 89 115 C 84 118 72 118 67 115 Z"
            fill="#FB7185"
          />
        </g>
      )}

      {/* Right arm gripping lime-green badge */}
      <path
        d="M 111 91 C 117 95 117 104 111 107"
        fill="#F43F5E"
        stroke="#1E293B"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <SquadHeldBadge
        cx={128}
        cy={97}
        r={18.5}
        variant="lime"
        text={badgeText}
        uid={uid}
      />

      {/* Coral gripping thumb */}
      <ellipse
        cx="111.5"
        cy="99"
        rx="5"
        ry="4"
        fill="#FF7B89"
        stroke="#1E293B"
        strokeWidth="2.8"
      />

      {/* Extra mood overlays */}
      {mood === 'excited' && <ExcitedSparkles leftX={24} rightX={132} topY={28} />}
      {mood === 'thinking' && <ThinkingQuestionBubble x={18} y={24} />}
    </svg>
  )
}

/**
 * MintHeadbandCharacter — Energetic lime-mint buddy with top horn & floating dot,
 * sleek dark-navy martial headband with fluttering ribbon tails, wide happy mouth,
 * and crisp white circular disc with sky-blue ring.
 */
export const MintHeadbandCharacter: FC<CastCharacterProps> = ({
  mood = 'happy',
  size = 120,
  className = '',
  badgeText = '+',
}) => {
  const rawId = useId()
  const uid = sanitizeSvgId(rawId)
  const height = Math.round(size * (164 / 156))

  const bodyGrad = `${uid}-mint-body`
  const bandGrad = `${uid}-mint-band`
  const bodyClip = `${uid}-mint-clip`

  const irisShiftX = mood === 'thinking' ? -2 : mood === 'pointing' ? 2.5 : 0
  const irisShiftY = mood === 'thinking' ? -2 : 0

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 156 164"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible select-none shrink-0 ${className}`.trim()}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bodyGrad} x1="20%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#BEF264" />
          <stop offset="52%" stopColor="#84CC16" />
          <stop offset="100%" stopColor="#65A30D" />
        </linearGradient>
        <linearGradient id={bandGrad} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <clipPath id={bodyClip}>
          <path d="M 35 84 C 35 47 50 35 78 35 C 106 35 121 47 121 84 C 121 124 108 138 78 138 C 48 138 35 124 35 84 Z" />
        </clipPath>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="78" cy="151" rx="42" ry="7" fill="#0F172A" fillOpacity="0.12" />

      {/* Fluttering headband tails on left side */}
      <path
        d="M 36 53 C 21 46 11 50 6 58 C 14 59 24 61 36 59 Z"
        fill="#1E293B"
        stroke="#0F172A"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M 35 58 C 20 62 12 71 9 80 C 18 76 26 70 36 63 Z"
        fill="#334155"
        stroke="#0F172A"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* Left arm */}
      <path
        d={
          mood === 'excited'
            ? 'M 38 86 C 21 72 15 56 22 48 C 29 41 38 52 42 70 Z'
            : 'M 38 88 C 22 95 16 107 23 114 C 30 120 39 112 42 100 Z'
        }
        fill="#84CC16"
        stroke="#1E293B"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />

      {/* Stubby lime feet */}
      <ellipse
        cx="58"
        cy="141"
        rx="11"
        ry="7"
        fill="#4D7C0F"
        stroke="#1E293B"
        strokeWidth="3.4"
      />
      <ellipse
        cx="98"
        cy="141"
        rx="11"
        ry="7"
        fill="#4D7C0F"
        stroke="#1E293B"
        strokeWidth="3.4"
      />

      {/* Cute top ear-horn & floating dot */}
      <path
        d="M 73 36 C 71 21 85 21 83 36 Z"
        fill="#BEF264"
        stroke="#1E293B"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <circle
        cx="78"
        cy="12"
        r="5"
        fill="#BEF264"
        stroke="#1E293B"
        strokeWidth="2.8"
      />
      <circle cx="76.5" cy="10.5" r="1.4" fill="#FFFFFF" fillOpacity="0.7" />

      {/* Main vibrant lime-mint squared-blob body */}
      <path
        d="M 35 84 C 35 47 50 35 78 35 C 106 35 121 47 121 84 C 121 124 108 138 78 138 C 48 138 35 124 35 84 Z"
        fill={`url(#${bodyGrad})`}
      />

      {/* Cel-shading crescent + warm belly patch + specular gloss */}
      <g clipPath={`url(#${bodyClip})`}>
        <ellipse cx="77" cy="113" rx="28" ry="20" fill="#ECFCCB" fillOpacity="0.36" />
        <path
          d="M 111 40 C 122 68 120 116 94 136 C 115 136 127 115 124 72 Z"
          fill="#3F6212"
          fillOpacity="0.26"
        />
        <path
          d="M 46 47 Q 62 39 78 41"
          stroke="#FFFFFF"
          strokeOpacity="0.5"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>

      {/* Main body outline */}
      <path
        d="M 35 84 C 35 47 50 35 78 35 C 106 35 121 47 121 84 C 121 124 108 138 78 138 C 48 138 35 124 35 84 Z"
        fill="none"
        stroke="#1E293B"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />

      {/* Sleek dark-navy martial headband across forehead */}
      <g>
        <path
          d="M 35 55 Q 78 48 121 55 L 121 67 Q 78 60 35 67 Z"
          fill={`url(#${bandGrad})`}
          stroke="#0F172A"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Crisp sheen line along headband */}
        <path
          d="M 44 57 Q 78 52 112 57"
          stroke="#64748B"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Knot accent on left temple */}
        <circle
          cx="35"
          cy="58"
          r="5"
          fill="#334155"
          stroke="#0F172A"
          strokeWidth="2.8"
        />
      </g>

      {/* Listening headphones overlay */}
      {mood === 'listening' && (
        <g>
          <path
            d="M 31 76 C 31 28 125 28 125 76"
            fill="none"
            stroke="#2563EB"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <rect
            x="22"
            y="65"
            width="13"
            height="24"
            rx="6.5"
            fill="#38BDF8"
            stroke="#1E293B"
            strokeWidth="3"
          />
          <rect
            x="121"
            y="65"
            width="13"
            height="24"
            rx="6.5"
            fill="#38BDF8"
            stroke="#1E293B"
            strokeWidth="3"
          />
          <ListeningSoundWaves x={137} y={72} />
        </g>
      )}

      {/* Expressive glossy wide-set eyes */}
      <g>
        <circle
          cx="61"
          cy="80"
          r="10"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="3"
        />
        <circle cx={61 + irisShiftX} cy={80 + irisShiftY} r="5.6" fill="#0F172A" />
        <circle cx={59 + irisShiftX} cy={77.5 + irisShiftY} r="2.4" fill="#FFFFFF" />
        <circle cx={63.5 + irisShiftX} cy={82.8 + irisShiftY} r="1.1" fill="#FFFFFF" />

        <circle
          cx="95"
          cy="80"
          r="10"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="3"
        />
        <circle cx={95 + irisShiftX} cy={80 + irisShiftY} r="5.6" fill="#0F172A" />
        <circle cx={93 + irisShiftX} cy={77.5 + irisShiftY} r="2.4" fill="#FFFFFF" />
        <circle cx={97.5 + irisShiftX} cy={82.8 + irisShiftY} r="1.1" fill="#FFFFFF" />
      </g>

      {/* Soft rosy cheeks */}
      <ellipse cx="46" cy="92" rx="5.5" ry="3.4" fill="#FB7185" fillOpacity="0.45" />
      <ellipse cx="110" cy="92" rx="5.5" ry="3.4" fill="#FB7185" fillOpacity="0.45" />

      {/* Energetic wide open mouth with pink tongue */}
      {mood === 'thinking' ? (
        <ellipse
          cx="78"
          cy="104"
          rx="6"
          ry="4.5"
          fill="#881337"
          stroke="#1E293B"
          strokeWidth="2.8"
        />
      ) : (
        <g>
          <path
            d="M 55 96 Q 78 92 101 96 C 100 116 90 123 78 123 C 66 123 56 116 55 96 Z"
            fill="#881337"
            stroke="#1E293B"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Cute little upper corner teeth */}
          <path d="M 60 96 L 67 96.3 L 65 102 L 60.5 101 Z" fill="#FFFFFF" />
          <path d="M 96 96 L 89 96.3 L 91 102 L 95.5 101 Z" fill="#FFFFFF" />
          {/* Plump coral-pink tongue */}
          <path
            d="M 64 117 C 66 107 90 107 92 117 C 87 122 69 122 64 117 Z"
            fill="#FB7185"
          />
        </g>
      )}

      {/* Right arm & white circular disc with sky-blue ring */}
      <path
        d="M 114 93 C 120 97 120 106 114 109"
        fill="#84CC16"
        stroke="#1E293B"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <SquadHeldBadge
        cx={130}
        cy={99}
        r={19}
        variant="sky-disc"
        text={badgeText}
        uid={uid}
      />
      <ellipse
        cx="113"
        cy="101"
        rx="5"
        ry="4"
        fill="#BEF264"
        stroke="#1E293B"
        strokeWidth="2.8"
      />

      {/* Mood overlays */}
      {mood === 'excited' && <ExcitedSparkles leftX={22} rightX={134} topY={24} />}
      {mood === 'thinking' && <ThinkingQuestionBubble x={18} y={24} />}
    </svg>
  )
}

/**
 * SkyFluffyCharacter — Fluffy sky-cyan buddy with cloud-tufted contour,
 * iconic big glossy sapphire eye with lashes, joyful smile, and lime-green '+1' badge.
 */
export const SkyFluffyCharacter: FC<CastCharacterProps> = ({
  mood = 'happy',
  size = 112,
  className = '',
  badgeText = '+1',
}) => {
  const rawId = useId()
  const uid = sanitizeSvgId(rawId)
  const height = Math.round(size * (164 / 156))

  const bodyGrad = `${uid}-sky-body`
  const irisGrad = `${uid}-sky-iris`
  const bodyClip = `${uid}-sky-clip`

  const irisShiftX = mood === 'thinking' ? -3 : mood === 'pointing' ? 3 : 0
  const irisShiftY = mood === 'thinking' ? -3 : 0

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 156 164"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible select-none shrink-0 ${className}`.trim()}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bodyGrad} x1="20%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="48%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <radialGradient id={irisGrad} cx="42%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="55%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
        <clipPath id={bodyClip}>
          <path d="M 78 29 C 90 27 98 33 103 40 C 115 41 123 50 120 62 C 128 71 128 84 121 92 C 125 104 119 119 107 124 C 102 134 90 137 78 136 C 66 137 54 134 49 124 C 37 119 31 104 35 92 C 28 84 28 71 36 62 C 33 50 41 41 53 40 C 58 33 66 27 78 29 Z" />
        </clipPath>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="78" cy="150" rx="40" ry="7" fill="#0F172A" fillOpacity="0.11" />

      {/* Left fluffy arm */}
      <path
        d={
          mood === 'excited'
            ? 'M 38 86 C 21 73 16 58 23 50 C 29 44 39 54 43 71 Z'
            : 'M 38 89 C 22 96 17 107 24 114 C 31 120 40 112 43 100 Z'
        }
        fill="#38BDF8"
        stroke="#1E293B"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />

      {/* Dark cobalt feet */}
      <ellipse
        cx="59"
        cy="141"
        rx="11"
        ry="7"
        fill="#1E3A8A"
        stroke="#1E293B"
        strokeWidth="3.4"
      />
      <ellipse
        cx="97"
        cy="141"
        rx="11"
        ry="7"
        fill="#1E3A8A"
        stroke="#1E293B"
        strokeWidth="3.4"
      />

      {/* Fluffy sky-cyan body contour */}
      <path
        d="M 78 29 C 90 27 98 33 103 40 C 115 41 123 50 120 62 C 128 71 128 84 121 92 C 125 104 119 119 107 124 C 102 134 90 137 78 136 C 66 137 54 134 49 124 C 37 119 31 104 35 92 C 28 84 28 71 36 62 C 33 50 41 41 53 40 C 58 33 66 27 78 29 Z"
        fill={`url(#${bodyGrad})`}
      />

      {/* Cel-shading crescent + fluffy cloud belly + top-left sheen */}
      <g clipPath={`url(#${bodyClip})`}>
        <ellipse cx="77" cy="115" rx="28" ry="18" fill="#E0F2FE" fillOpacity="0.48" />
        <path
          d="M 110 38 C 125 66 123 112 96 136 C 118 135 130 112 128 68 Z"
          fill="#0369A1"
          fillOpacity="0.28"
        />
        <path
          d="M 53 42 Q 67 34 83 36"
          stroke="#FFFFFF"
          strokeOpacity="0.58"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>

      {/* Main fluffy body outline */}
      <path
        d="M 78 29 C 90 27 98 33 103 40 C 115 41 123 50 120 62 C 128 71 128 84 121 92 C 125 104 119 119 107 124 C 102 134 90 137 78 136 C 66 137 54 134 49 124 C 37 119 31 104 35 92 C 28 84 28 71 36 62 C 33 50 41 41 53 40 C 58 33 66 27 78 29 Z"
        fill="none"
        stroke="#1E293B"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />

      {/* Listening headphones */}
      {mood === 'listening' && (
        <g>
          <path
            d="M 29 74 C 29 24 127 24 127 74"
            fill="none"
            stroke="#2563EB"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <rect
            x="20"
            y="62"
            width="13"
            height="24"
            rx="6.5"
            fill="#1D4ED8"
            stroke="#1E293B"
            strokeWidth="3"
          />
          <rect
            x="123"
            y="62"
            width="13"
            height="24"
            rx="6.5"
            fill="#1D4ED8"
            stroke="#1E293B"
            strokeWidth="3"
          />
          <ListeningSoundWaves x={138} y={70} />
        </g>
      )}

      {/* Iconic big glossy sapphire eye with lashes & white catchlight */}
      <g>
        {/* Playful upper eyelashes */}
        <path d="M 60 49 L 55 42" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        <path d="M 78 46 L 78 38" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        <path d="M 96 49 L 101 42" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

        {/* Sclera */}
        <circle
          cx="78"
          cy="70"
          r="21"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="3.2"
        />
        {/* Layered sapphire iris */}
        <circle
          cx={78 + irisShiftX}
          cy={70 + irisShiftY}
          r="12.5"
          fill={`url(#${irisGrad})`}
        />
        {/* Deep pupil */}
        <circle cx={78 + irisShiftX} cy={70 + irisShiftY} r="6.4" fill="#0F172A" />
        {/* Primary & secondary catchlights */}
        <circle cx={72.5 + irisShiftX} cy={64 + irisShiftY} r="4.5" fill="#FFFFFF" />
        <circle cx={83.5 + irisShiftX} cy={75.5 + irisShiftY} r="2" fill="#FFFFFF" />
      </g>

      {/* Rosy cheeks */}
      <ellipse cx="46" cy="88" rx="6" ry="3.6" fill="#FB7185" fillOpacity="0.55" />
      <ellipse cx="110" cy="88" rx="6" ry="3.6" fill="#FB7185" fillOpacity="0.55" />

      {/* Joyful open smile with tiny teeth */}
      {mood === 'thinking' ? (
        <path
          d="M 69 102 Q 78 98 87 103"
          stroke="#1E293B"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      ) : (
        <g>
          <path
            d="M 55 96 Q 78 100 101 96 C 100 115 90 120 78 120 C 66 120 56 115 55 96 Z"
            fill="#881337"
            stroke="#1E293B"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <rect x="64" y="97.5" width="7" height="5" rx="2" fill="#FFFFFF" />
          <rect x="85" y="97.5" width="7" height="5" rx="2" fill="#FFFFFF" />
          <path
            d="M 67 115 C 69 108 87 108 89 115 C 84 119 72 119 67 115 Z"
            fill="#FB7185"
          />
        </g>
      )}

      {/* Right arm gripping lime-green badge */}
      <path
        d="M 111 91 C 117 95 117 104 111 107"
        fill="#38BDF8"
        stroke="#1E293B"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <SquadHeldBadge
        cx={128}
        cy={98}
        r={18.5}
        variant="lime"
        text={badgeText}
        uid={uid}
      />
      <ellipse
        cx="111.5"
        cy="100"
        rx="5"
        ry="4"
        fill="#BAE6FD"
        stroke="#1E293B"
        strokeWidth="2.8"
      />

      {/* Mood overlays */}
      {mood === 'excited' && <ExcitedSparkles leftX={22} rightX={134} topY={26} />}
      {mood === 'thinking' && <ThinkingQuestionBubble x={18} y={22} />}
    </svg>
  )
}

/**
 * SunnyMentorCharacter — Large sunny-gold mentor character with chestnut hair bun,
 * coral-amber botanical flower clip, teal cheek studs, expressive glossy eye,
 * cheerful fang-smile, and pointer wand angled cleanly toward upper-right.
 */
export const SunnyMentorCharacter: FC<CastCharacterProps> = ({
  mood = 'pointing',
  size = 172,
  className = '',
  badgeText,
}) => {
  const rawId = useId()
  const uid = sanitizeSvgId(rawId)
  const height = Math.round(size * (194 / 212))

  const bodyGrad = `${uid}-sunny-body`
  const bunGrad = `${uid}-sunny-bun`
  const irisGrad = `${uid}-sunny-iris`
  const bodyClip = `${uid}-sunny-clip`

  const irisShiftX = mood === 'thinking' ? -3 : mood === 'pointing' ? 2.5 : 0
  const irisShiftY = mood === 'thinking' ? -3 : 0

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 212 194"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible select-none shrink-0 ${className}`.trim()}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bodyGrad} x1="20%" y1="5%" x2="85%" y2="95%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="46%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
        <linearGradient id={bunGrad} x1="20%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#A16207" />
          <stop offset="55%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <radialGradient id={irisGrad} cx="42%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
        <clipPath id={bodyClip}>
          <path d="M 38 110 C 36 68 54 44 88 44 C 122 44 140 68 138 110 C 136 146 120 162 88 162 C 56 162 40 146 38 110 Z" />
        </clipPath>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="89" cy="179" rx="50" ry="8" fill="#0F172A" fillOpacity="0.11" />

      {/* Left arm (cheers up when excited, rests warmly otherwise) */}
      <path
        d={
          mood === 'excited'
            ? 'M 42 104 C 22 86 17 65 26 57 C 34 50 44 63 48 84 Z'
            : 'M 41 108 C 23 116 17 130 25 137 C 32 144 43 135 46 121 Z'
        }
        fill="#FACC15"
        stroke="#1E293B"
        strokeWidth="3.8"
        strokeLinejoin="round"
      />

      {/* Stubby sunny-amber feet */}
      <ellipse
        cx="69"
        cy="168"
        rx="14"
        ry="8.5"
        fill="#CA8A04"
        stroke="#1E293B"
        strokeWidth="3.6"
      />
      <ellipse
        cx="109"
        cy="168"
        rx="14"
        ry="8.5"
        fill="#CA8A04"
        stroke="#1E293B"
        strokeWidth="3.6"
      />

      {/* Listening headphone band (placed neatly behind hair bun) */}
      {mood === 'listening' && (
        <path
          d="M 30 92 C 30 30 146 30 146 92"
          fill="none"
          stroke="#2563EB"
          strokeWidth="8"
          strokeLinecap="round"
        />
      )}

      {/* Chestnut-brown top hair bun */}
      <g>
        <path
          d="M 65 48 C 58 31 68 15 88 15 C 108 15 118 31 111 48 Z"
          fill={`url(#${bunGrad})`}
          stroke="#1E293B"
          strokeWidth="3.6"
          strokeLinejoin="round"
        />
        <path
          d="M 74 34 Q 88 24 102 33"
          fill="none"
          stroke="#B45309"
          strokeOpacity="0.65"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Main sunny-gold mentor body */}
      <path
        d="M 38 110 C 36 68 54 44 88 44 C 122 44 140 68 138 110 C 136 146 120 162 88 162 C 56 162 40 146 38 110 Z"
        fill={`url(#${bodyGrad})`}
      />

      {/* Cel-shaded belly patch, side shadow, top specular sheen */}
      <g clipPath={`url(#${bodyClip})`}>
        <ellipse cx="86" cy="136" rx="34" ry="22" fill="#FEF9C3" fillOpacity="0.48" />
        <path
          d="M 124 48 C 141 80 138 134 108 160 C 133 158 145 130 142 84 Z"
          fill="#CA8A04"
          fillOpacity="0.28"
        />
        <path
          d="M 52 60 Q 67 49 85 51"
          stroke="#FFFFFF"
          strokeOpacity="0.6"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      {/* Main body outline */}
      <path
        d="M 38 110 C 36 68 54 44 88 44 C 122 44 140 68 138 110 C 136 146 120 162 88 162 C 56 162 40 146 38 110 Z"
        fill="none"
        stroke="#1E293B"
        strokeWidth="3.8"
        strokeLinejoin="round"
      />

      {/* Bright coral-amber botanical flower clip tucked beside bun */}
      <g transform="translate(111, 41)">
        <circle cx="0" cy="-7" r="5.5" fill="#FB7185" stroke="#1E293B" strokeWidth="2.2" />
        <circle cx="7" cy="-2" r="5.5" fill="#F97316" stroke="#1E293B" strokeWidth="2.2" />
        <circle cx="4.5" cy="6" r="5.5" fill="#FB7185" stroke="#1E293B" strokeWidth="2.2" />
        <circle cx="-4.5" cy="6" r="5.5" fill="#F97316" stroke="#1E293B" strokeWidth="2.2" />
        <circle cx="-7" cy="-2" r="5.5" fill="#FB7185" stroke="#1E293B" strokeWidth="2.2" />
        <circle cx="0" cy="0" r="4.2" fill="#FDE047" stroke="#1E293B" strokeWidth="2" />
      </g>

      {/* Round teal cheek/ear stud accents */}
      <g>
        <circle
          cx="43"
          cy="94"
          r="7.5"
          fill="#2DD4BF"
          stroke="#1E293B"
          strokeWidth="3"
        />
        <circle cx="40.5" cy="91.5" r="2" fill="#FFFFFF" fillOpacity="0.65" />

        <circle
          cx="133"
          cy="94"
          r="7.5"
          fill="#2DD4BF"
          stroke="#1E293B"
          strokeWidth="3"
        />
        <circle cx="130.5" cy="91.5" r="2" fill="#FFFFFF" fillOpacity="0.65" />
      </g>

      {/* Listening headphone ear cups & soundwave arcs */}
      {mood === 'listening' && (
        <g>
          <rect
            x="24"
            y="78"
            width="15"
            height="30"
            rx="7.5"
            fill="#2563EB"
            stroke="#1E293B"
            strokeWidth="3.2"
          />
          <rect
            x="137"
            y="78"
            width="15"
            height="30"
            rx="7.5"
            fill="#2563EB"
            stroke="#1E293B"
            strokeWidth="3.2"
          />
          <ListeningSoundWaves x={12} y={92} flip />
          <ListeningSoundWaves x={156} y={92} />
        </g>
      )}

      {/* Expressive brow & big glossy layered eye with eyelashes */}
      <g>
        {/* Expressive eyebrow */}
        <path
          d={
            mood === 'thinking'
              ? 'M 68 58 Q 88 51 106 60'
              : 'M 70 57 Q 88 50 106 57'
          }
          stroke="#1E293B"
          strokeWidth="3.4"
          strokeLinecap="round"
        />

        {/* Upper eyelashes */}
        <path d="M 67 68 L 60 60" stroke="#1E293B" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 88 63 L 88 54" stroke="#1E293B" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 109 68 L 116 60" stroke="#1E293B" strokeWidth="3.2" strokeLinecap="round" />

        {/* Sclera */}
        <circle
          cx="88"
          cy="87"
          r="23.5"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="3.4"
        />
        {/* Layered iris */}
        <circle
          cx={88 + irisShiftX}
          cy={87 + irisShiftY}
          r="14"
          fill={`url(#${irisGrad})`}
        />
        {/* Pupil */}
        <circle cx={88 + irisShiftX} cy={87 + irisShiftY} r="7" fill="#0F172A" />
        {/* Crisp white catchlights */}
        <circle cx={81 + irisShiftX} cy={80 + irisShiftY} r="5.2" fill="#FFFFFF" />
        <circle cx={94.5 + irisShiftX} cy={93.5 + irisShiftY} r="2.3" fill="#FFFFFF" />
      </g>

      {/* Warm rosy cheeks */}
      <ellipse cx="56" cy="109" rx="7" ry="4" fill="#FB7185" fillOpacity="0.45" />
      <ellipse cx="120" cy="109" rx="7" ry="4" fill="#FB7185" fillOpacity="0.45" />

      {/* Cheerful open fang-smile */}
      {mood === 'thinking' ? (
        <path
          d="M 76 125 Q 88 120 100 126"
          stroke="#1E293B"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      ) : (
        <g>
          <path
            d="M 63 117 Q 88 121 113 117 C 111 138 100 144 88 144 C 76 144 65 138 63 117 Z"
            fill="#881337"
            stroke="#1E293B"
            strokeWidth="3.4"
            strokeLinejoin="round"
          />
          {/* Cute little white fang teeth */}
          <path d="M 69 118 L 77 119 L 73 126 Z" fill="#FFFFFF" />
          <path d="M 107 118 L 99 119 L 103 126 Z" fill="#FFFFFF" />
          {/* Warm pink tongue */}
          <path
            d="M 74 139 C 76 130 100 130 102 139 C 96 143 80 143 74 139 Z"
            fill="#FB7185"
          />
        </g>
      )}

      {/* Raised right arm holding slim warm-brown pointer wand angled cleanly upper-right */}
      <g>
        {/* Slim warm-brown pointer shaft */}
        <line
          x1="143"
          y1="112"
          x2="195"
          y2="41"
          stroke="#1E293B"
          strokeWidth="9.5"
          strokeLinecap="round"
        />
        <line
          x1="143"
          y1="112"
          x2="195"
          y2="41"
          stroke="#92400E"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Glossy coral-pink pointer tip */}
        <circle
          cx="196"
          cy="39"
          r="7.2"
          fill="#F43F5E"
          stroke="#1E293B"
          strokeWidth="2.8"
        />
        <circle cx="194" cy="36.8" r="2" fill="#FFFFFF" fillOpacity="0.7" />

        {/* Gleam ticks near wand tip when pointing */}
        {(mood === 'pointing' || mood === 'excited') && (
          <g stroke="#F59E0B" strokeWidth="2.6" strokeLinecap="round">
            <line x1="196" y1="22" x2="196" y2="27" />
            <line x1="208" y1="30" x2="204" y2="33" />
            <line x1="210" y1="45" x2="205" y2="43" />
          </g>
        )}

        {/* Sunny right arm reaching cleanly to hold the wand handle */}
        <path
          d="M 131 114 C 141 117 151 112 153 103 C 154 96 146 93 139 98 L 130 104 Z"
          fill="#FACC15"
          stroke="#1E293B"
          strokeWidth="3.6"
          strokeLinejoin="round"
        />
      </g>

      {/* Optional mini badge when explicitly supplied */}
      {badgeText ? (
        <SquadHeldBadge
          cx={28}
          cy={125}
          r={16}
          variant="lime"
          text={badgeText}
          uid={uid}
        />
      ) : null}

      {/* Mood overlays */}
      {mood === 'excited' && <ExcitedSparkles leftX={24} rightX={152} topY={32} />}
      {mood === 'thinking' && <ThinkingQuestionBubble x={18} y={32} />}
    </svg>
  )
}

/**
 * CharacterTrioSquad — Playful shoulder-to-shoulder trio composition with soft
 * ground shadow, idle motion choreography, and synchronized mood responses.
 */
export const CharacterTrioSquad: FC<{
  activeMood?: CharacterMood
  centerBadge?: string
  className?: string
}> = ({ activeMood = 'happy', centerBadge = '+1', className = '' }) => {
  const shouldReduceMotion = Boolean(useReducedMotion())
  const isExcited = activeMood === 'excited'

  return (
    <div
      className={`relative inline-flex items-end justify-center select-none ${className}`.trim()}
      aria-hidden="true"
    >
      {/* Shared soft elliptical ground shadow */}
      <div
        className="absolute inset-x-4 bottom-0.5 h-4 rounded-full bg-[#0F172A]/10 blur-[2px] pointer-events-none"
      />

      {/* Left buddy: Coral */}
      <motion.div
        className="relative z-10 -mr-4 sm:-mr-5 origin-bottom -rotate-3"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: isExcited ? [0, -7, 0] : [0, -4, 0],
                scale: isExcited ? 1.04 : 1,
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                y: {
                  duration: isExcited ? 1.4 : 2.8,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                  delay: 0,
                },
                scale: { type: 'spring', stiffness: 320, damping: 20 },
              }
        }
      >
        <CoralBuddyCharacter mood={activeMood} size={98} badgeText="+1" />
      </motion.div>

      {/* Center buddy: Mint Headband (prominent, front) */}
      <motion.div
        className="relative z-20 origin-bottom"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: isExcited ? [0, -9, 0] : [0, -5, 0],
                scale: isExcited ? 1.06 : 1,
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                y: {
                  duration: isExcited ? 1.35 : 2.6,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                  delay: 0.35,
                },
                scale: { type: 'spring', stiffness: 340, damping: 20 },
              }
        }
      >
        <MintHeadbandCharacter
          mood={activeMood}
          size={120}
          badgeText={centerBadge}
        />
      </motion.div>

      {/* Right buddy: Sky Fluffy */}
      <motion.div
        className="relative z-10 -ml-4 sm:-ml-5 origin-bottom rotate-3"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: isExcited ? [0, -7, 0] : [0, -4, 0],
                scale: isExcited ? 1.04 : 1,
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                y: {
                  duration: isExcited ? 1.4 : 2.9,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                  delay: 0.7,
                },
                scale: { type: 'spring', stiffness: 320, damping: 20 },
              }
        }
      >
        <SkyFluffyCharacter mood={activeMood} size={98} badgeText="+1" />
      </motion.div>
    </div>
  )
}
