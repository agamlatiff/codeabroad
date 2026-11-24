import { useId, type FC } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export type MeraShowcaseMood = 'happy' | 'excited' | 'listening' | 'pointing' | 'thinking'

export interface MeraFigureProps {
  mood?: MeraShowcaseMood
  size?: number
  badgeText?: string
  className?: string
}

const MERA_BODY_PATH =
  'M50,96 C42,66 48,52 42,36 C40,28 48,24 56,30 C64,36 70,46 78,48 C84,49 96,49 102,48 C110,46 116,36 124,30 C132,24 140,28 138,36 C132,52 138,66 130,96 C130,140 118,154 90,154 C62,154 50,140 50,96 Z'

function sanitizeSvgId(rawId: string): string {
  return rawId.replace(/[^a-zA-Z0-9_-]/g, '')
}

/**
 * Shared studio SVG gradients & clipPath definitions scoped per component instance.
 */
const MeraStudioDefs: FC<{ uid: string }> = ({ uid }) => (
  <defs>
    <linearGradient id={`${uid}-body`} x1="20%" y1="4%" x2="85%" y2="96%">
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="56%" stopColor="#FFFDF9" />
      <stop offset="100%" stopColor="#F1F5F9" />
    </linearGradient>
    <linearGradient id={`${uid}-shade`} x1="15%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stopColor="#DBEAFE" stopOpacity="0.58" />
      <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.8" />
    </linearGradient>
    <linearGradient id={`${uid}-tail`} x1="15%" y1="10%" x2="85%" y2="90%">
      <stop offset="0%" stopColor="#FFFBEB" />
      <stop offset="100%" stopColor="#FDE68A" />
    </linearGradient>
    <linearGradient id={`${uid}-gold`} x1="12%" y1="8%" x2="88%" y2="92%">
      <stop offset="0%" stopColor="#FEF08A" />
      <stop offset="52%" stopColor="#FBBF24" />
      <stop offset="100%" stopColor="#D97706" />
    </linearGradient>
    <linearGradient id={`${uid}-green`} x1="10%" y1="8%" x2="90%" y2="92%">
      <stop offset="0%" stopColor="#4ADE80" />
      <stop offset="55%" stopColor="#10B981" />
      <stop offset="100%" stopColor="#047857" />
    </linearGradient>
    <linearGradient id={`${uid}-sky-disc`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="100%" stopColor="#EFF6FF" />
    </linearGradient>
    <linearGradient id={`${uid}-beret`} x1="18%" y1="10%" x2="86%" y2="92%">
      <stop offset="0%" stopColor="#34D399" />
      <stop offset="55%" stopColor="#10B981" />
      <stop offset="100%" stopColor="#059669" />
    </linearGradient>
    <linearGradient id={`${uid}-coral-beret`} x1="18%" y1="10%" x2="86%" y2="92%">
      <stop offset="0%" stopColor="#FDA4AF" />
      <stop offset="50%" stopColor="#FB7185" />
      <stop offset="100%" stopColor="#E11D48" />
    </linearGradient>
    <linearGradient id={`${uid}-scarf`} x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stopColor="#FB7185" />
      <stop offset="100%" stopColor="#E11D48" />
    </linearGradient>
    <linearGradient id={`${uid}-neckerchief`} x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stopColor="#38BDF8" />
      <stop offset="100%" stopColor="#0284C7" />
    </linearGradient>
    <clipPath id={`${uid}-body-clip`}>
      <path d={MERA_BODY_PATH} />
    </clipPath>
  </defs>
)

/**
 * Grounded cel-shaded white mochi-cat Mera base:
 * soft elliptical floor shadow, cream tail, pearl-cream body,
 * cool-blue/lavender lower-right crescent shade, top-left specular rim highlight,
 * crisp #0F172A contour, and pink inner ears.
 */
const MeraCelBody: FC<{
  uid: string
  tailDirection?: 'right' | 'left'
  tailPosition?: 'normal' | 'high'
  shadowRx?: number
  hideShadow?: boolean
}> = ({
  uid,
  tailDirection = 'right',
  tailPosition = 'normal',
  shadowRx = 44,
  hideShadow = false,
}) => {
  const tailPath =
    tailDirection === 'left'
      ? tailPosition === 'high'
        ? 'M54,118 C27,114 20,86 34,68 C42,58 51,72 53,96 Z'
        : 'M55,134 C27,136 20,110 34,90 C42,78 52,92 54,114 Z'
      : tailPosition === 'high'
      ? 'M126,118 C153,114 160,86 146,68 C138,58 129,72 127,96 Z'
      : 'M125,134 C153,136 160,110 146,90 C138,78 128,92 126,114 Z'

  return (
    <g>
      {!hideShadow && (
        <ellipse cx="90" cy="156" rx={shadowRx} ry="7" fill="#0F172A" fillOpacity="0.11" />
      )}

      {/* Cream-tipped mochi cat tail */}
      <path
        d={tailPath}
        fill={`url(#${uid}-tail)`}
        stroke="#0F172A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

    {/* Main pearl-cream body base */}
    <path d={MERA_BODY_PATH} fill={`url(#${uid}-body)`} />

    {/* Clipped cel-shading crescent + warm belly sheen + top-left specular rim */}
    <g clipPath={`url(#${uid}-body-clip)`}>
      <ellipse cx="86" cy="118" rx="28" ry="20" fill="#FFFBEB" fillOpacity="0.55" />
      <path
        d="M 123 44 C 134 76 131 132 92 153 C 122 154 140 128 139 74 Z"
        fill={`url(#${uid}-shade)`}
      />
      <path
        d="M 52 135 Q 90 151 128 135 Q 118 156 90 156 Q 62 156 52 135 Z"
        fill="#E0E7FF"
        fillOpacity="0.46"
      />
      <path
        d="M 55 54 Q 68 46 86 49"
        stroke="#FFFFFF"
        strokeOpacity="0.96"
        strokeWidth="5.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 52 72 Q 50 86 53 98"
        stroke="#FFFFFF"
        strokeOpacity="0.82"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
    </g>

    {/* Crisp outer cat body contour */}
    <path
      d={MERA_BODY_PATH}
      fill="none"
      stroke="#0F172A"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />

    {/* Pink inner ears */}
    <polygon points="48,34 56,30 52,42" fill="#FECDD3" />
    <polygon points="132,34 124,30 128,42" fill="#FECDD3" />
  </g>
  )
}

/**
 * Glossy multi-ring eyes, cheeks, pink cat nose, smile, and whiskers.
 */
const MeraStudioFace: FC<{
  mood: MeraShowcaseMood
  eyeY?: number
  starEyes?: boolean
  mouthVariant?: 'cat' | 'smile'
}> = ({ mood, eyeY = 86, starEyes = false, mouthVariant = 'cat' }) => {
  const isExcited = mood === 'excited'
  const isListening = mood === 'listening'
  const isThinking = mood === 'thinking'
  const isPointing = mood === 'pointing'

  const irisOffsetX = isThinking ? 1.8 : isPointing ? 1.6 : 0
  const irisOffsetY = isThinking ? -1.4 : 0

  return (
    <g>
      {/* Eyes */}
      {isExcited && !starEyes ? (
        <g>
          <path
            d={`M 63 ${eyeY + 2} Q 72 ${eyeY - 9} 81 ${eyeY + 2}`}
            stroke="#0F172A"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M 99 ${eyeY + 2} Q 108 ${eyeY - 9} 117 ${eyeY + 2}`}
            stroke="#0F172A"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ) : isListening ? (
        <g>
          <path
            d={`M 63 ${eyeY - 1} Q 72 ${eyeY + 6} 81 ${eyeY - 1}`}
            stroke="#0F172A"
            strokeWidth="3.4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M 99 ${eyeY - 1} Q 108 ${eyeY + 6} 117 ${eyeY - 1}`}
            stroke="#0F172A"
            strokeWidth="3.4"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ) : (
        <g>
          {/* Left glossy multi-ring eye */}
          <ellipse cx="72" cy={eyeY} rx="7" ry="9" fill="#0F172A" />
          <ellipse
            cx={72 + irisOffsetX}
            cy={eyeY + 1.8 + irisOffsetY}
            rx="4.6"
            ry="5"
            fill="#1E3A8A"
            fillOpacity="0.6"
          />
          <ellipse
            cx={72 + irisOffsetX}
            cy={eyeY + 2.8 + irisOffsetY}
            rx="3.1"
            ry="2.8"
            fill="#3B82F6"
            fillOpacity="0.42"
          />
          <circle
            cx={69.8 + irisOffsetX}
            cy={eyeY - 3 + irisOffsetY}
            r="2.6"
            fill="#FFFFFF"
          />
          {starEyes ? (
            <polygon
              points={`74,${eyeY + 1} 75.3,${eyeY + 3.2} 77.6,${eyeY + 3.2} 75.8,${eyeY + 4.6} 76.4,${eyeY + 6.9} 74,${eyeY + 5.5} 71.6,${eyeY + 6.9} 72.2,${eyeY + 4.6} 70.4,${eyeY + 3.2} 72.7,${eyeY + 3.2}`}
              fill="#FDE047"
            />
          ) : (
            <circle
              cx={74.1 + irisOffsetX}
              cy={eyeY + 2.8 + irisOffsetY}
              r="1.2"
              fill="#FFFFFF"
            />
          )}

          {/* Right glossy multi-ring eye */}
          <ellipse cx="108" cy={eyeY} rx="7" ry="9" fill="#0F172A" />
          <ellipse
            cx={108 + irisOffsetX}
            cy={eyeY + 1.8 + irisOffsetY}
            rx="4.6"
            ry="5"
            fill="#1E3A8A"
            fillOpacity="0.6"
          />
          <ellipse
            cx={108 + irisOffsetX}
            cy={eyeY + 2.8 + irisOffsetY}
            rx="3.1"
            ry="2.8"
            fill="#3B82F6"
            fillOpacity="0.42"
          />
          <circle
            cx={105.8 + irisOffsetX}
            cy={eyeY - 3 + irisOffsetY}
            r="2.6"
            fill="#FFFFFF"
          />
          {starEyes ? (
            <polygon
              points={`110,${eyeY + 1} 111.3,${eyeY + 3.2} 113.6,${eyeY + 3.2} 111.8,${eyeY + 4.6} 112.4,${eyeY + 6.9} 110,${eyeY + 5.5} 107.6,${eyeY + 6.9} 108.2,${eyeY + 4.6} 106.4,${eyeY + 3.2} 108.7,${eyeY + 3.2}`}
              fill="#FDE047"
            />
          ) : (
            <circle
              cx={110.1 + irisOffsetX}
              cy={eyeY + 2.8 + irisOffsetY}
              r="1.2"
              fill="#FFFFFF"
            />
          )}
        </g>
      )}

      {/* Subtle curious eyebrows when thinking */}
      {isThinking && (
        <g stroke="#0F172A" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d={`M 64 ${eyeY - 14} Q 72 ${eyeY - 17} 79 ${eyeY - 13}`} />
          <path d={`M 101 ${eyeY - 15} Q 109 ${eyeY - 20} 116 ${eyeY - 15}`} />
        </g>
      )}

      {/* Rosy coral cheeks */}
      <ellipse
        cx="57"
        cy={eyeY + 10}
        rx="7.6"
        ry="4.5"
        fill="#FB7185"
        fillOpacity={isExcited ? 0.82 : 0.7}
      />
      <ellipse
        cx="123"
        cy={eyeY + 10}
        rx="7.6"
        ry="4.5"
        fill="#FB7185"
        fillOpacity={isExcited ? 0.82 : 0.7}
      />

      {/* Pink triangle cat nose */}
      <polygon
        points={`88,${eyeY + 6} 92,${eyeY + 6} 90,${eyeY + 9}`}
        fill="#FB7185"
      />

      {/* Cat mouth */}
      {isExcited ? (
        <g>
          <path
            d={`M 81 ${eyeY + 10} Q 90 ${eyeY + 9} 99 ${eyeY + 10} C 98 ${eyeY + 22} 94 ${eyeY + 25} 90 ${eyeY + 25} C 86 ${eyeY + 25} 82 ${eyeY + 22} 81 ${eyeY + 10} Z`}
            fill="#991B1B"
            stroke="#0F172A"
            strokeWidth="2.3"
            strokeLinejoin="round"
          />
          <path
            d={`M 84.5 ${eyeY + 19} Q 90 ${eyeY + 15.5} 95.5 ${eyeY + 19} Q 90 ${eyeY + 24} 84.5 ${eyeY + 19} Z`}
            fill="#FB7185"
          />
        </g>
      ) : isThinking ? (
        <path
          d={`M 85 ${eyeY + 12} Q 90 ${eyeY + 9.5} 95 ${eyeY + 12.5}`}
          stroke="#0F172A"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
      ) : mouthVariant === 'smile' ? (
        <path
          d={`M 83 ${eyeY + 10} Q 90 ${eyeY + 17} 97 ${eyeY + 10}`}
          stroke="#0F172A"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path
          d={`M 84 ${eyeY + 10} Q 87 ${eyeY + 14} 90 ${eyeY + 11.8} Q 93 ${eyeY + 14} 96 ${eyeY + 10}`}
          stroke="#0F172A"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {/* Whiskers */}
      <g stroke="#0F172A" strokeWidth="2" strokeLinecap="round">
        <line x1="46" y1={eyeY + 5} x2="55" y2={eyeY + 6.5} />
        <line x1="46" y1={eyeY + 11.5} x2="55" y2={eyeY + 10.5} />
        <line x1="134" y1={eyeY + 5} x2="125" y2={eyeY + 6.5} />
        <line x1="134" y1={eyeY + 11.5} x2="125" y2={eyeY + 10.5} />
      </g>
    </g>
  )
}

/**
 * Cushioned cobalt studio headphones + crisp vector sound-wave arcs.
 */
const MeraStudioHeadphones: FC<{ waveSide?: 'both' | 'right' | 'left' | 'none' }> = ({
  waveSide = 'both',
}) => (
  <g>
    {/* Cobalt arched headband */}
    <path
      d="M 41 82 C 41 25 139 25 139 82"
      fill="none"
      stroke="#0F172A"
      strokeWidth="9.5"
      strokeLinecap="round"
    />
    <path
      d="M 41 82 C 41 25 139 25 139 82"
      fill="none"
      stroke="#2563EB"
      strokeWidth="5.8"
      strokeLinecap="round"
    />
    <path
      d="M 55 44 Q 90 29 125 44"
      fill="none"
      stroke="#60A5FA"
      strokeOpacity="0.7"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Left ear cup */}
    <rect
      x="34"
      y="70"
      width="14"
      height="28"
      rx="7"
      fill="#3B82F6"
      stroke="#0F172A"
      strokeWidth="2.6"
    />
    <rect x="37" y="75" width="4" height="14" rx="2" fill="#93C5FD" fillOpacity="0.75" />

    {/* Right ear cup */}
    <rect
      x="132"
      y="70"
      width="14"
      height="28"
      rx="7"
      fill="#3B82F6"
      stroke="#0F172A"
      strokeWidth="2.6"
    />
    <rect x="139" y="75" width="4" height="14" rx="2" fill="#93C5FD" fillOpacity="0.75" />

    {/* Curved vector sound-wave arcs */}
    {(waveSide === 'right' || waveSide === 'both') && (
      <g transform="translate(150, 84)" fill="none" strokeLinecap="round">
        <path d="M 2 -8 Q 9 0 2 8" stroke="#2563EB" strokeWidth="2.8" />
        <path d="M 8 -14 Q 17 0 8 14" stroke="#38BDF8" strokeWidth="2.6" />
      </g>
    )}
    {(waveSide === 'left' || waveSide === 'both') && (
      <g transform="translate(30, 84) scale(-1, 1)" fill="none" strokeLinecap="round">
        <path d="M 2 -8 Q 9 0 2 8" stroke="#2563EB" strokeWidth="2.8" />
        <path d="M 8 -14 Q 17 0 8 14" stroke="#38BDF8" strokeWidth="2.6" />
      </g>
    )}
  </g>
)

/**
 * Geometric 4-point star sparkles & rose confetti arcs for 'excited' mood (zero emoji).
 */
const MeraExcitedSparkles: FC<{ leftX?: number; rightX?: number; topY?: number }> = ({
  leftX = 24,
  rightX = 156,
  topY = 26,
}) => (
  <g>
    <path
      d={`M ${leftX} ${topY - 9} L ${leftX + 2.5} ${topY - 2.5} L ${leftX + 9} ${topY} L ${leftX + 2.5} ${topY + 2.5} L ${leftX} ${topY + 9} L ${leftX - 2.5} ${topY + 2.5} L ${leftX - 9} ${topY} L ${leftX - 2.5} ${topY - 2.5} Z`}
      fill="#FACC15"
      stroke="#0F172A"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d={`M ${rightX} ${topY + 3 - 7.5} L ${rightX + 2.1} ${topY + 3 - 2.1} L ${rightX + 7.5} ${topY + 3} L ${rightX + 2.1} ${topY + 3 + 2.1} L ${rightX} ${topY + 3 + 7.5} L ${rightX - 2.1} ${topY + 3 + 2.1} L ${rightX - 7.5} ${topY + 3} L ${rightX - 2.1} ${topY + 3 - 2.1} Z`}
      fill="#38BDF8"
      stroke="#0F172A"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d={`M ${leftX + 14} ${topY - 14} Q ${leftX + 21} ${topY - 20} ${leftX + 26} ${topY - 12}`}
      fill="none"
      stroke="#FB7185"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <path
      d={`M ${rightX - 22} ${topY - 14} Q ${rightX - 15} ${topY - 20} ${rightX - 10} ${topY - 12}`}
      fill="none"
      stroke="#38BDF8"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
  </g>
)

/**
 * Geometric vector '?' thought badge for 'thinking' mood (zero Unicode emoji).
 */
const MeraThinkingBubble: FC<{ x?: number; y?: number }> = ({ x = 22, y = 22 }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx="24" cy="22" r="2.8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
    <circle cx="19" cy="15" r="4.2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
    <rect
      x="-6"
      y="-10"
      width="24"
      height="24"
      rx="12"
      fill="#FFFFFF"
      stroke="#0F172A"
      strokeWidth="2.4"
    />
    <path
      d="M 2.5 -1.5 C 2.5 -4.5 9.5 -4.5 9.5 -0.5 C 9.5 2 6 2.5 6 5.2"
      fill="none"
      stroke="#2563EB"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="6" cy="8.8" r="1.6" fill="#2563EB" />
  </g>
)

/**
 * Overhead golden vector lightbulb with warm breakthrough rays.
 */
const MeraAhaLightbulb: FC = () => (
  <g transform="translate(76, 4)">
    <line x1="14" y1="-5" x2="14" y2="-1" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="-2" y1="6" x2="2" y2="8.5" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="30" y1="6" x2="26" y2="8.5" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="2" y1="-1" x2="5.5" y2="2.5" stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="26" y1="-1" x2="22.5" y2="2.5" stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="14" cy="13" r="11" fill="#FEF08A" stroke="#D97706" strokeWidth="2.4" />
    <path
      d="M 10 11 Q 14 16 18 11"
      fill="none"
      stroke="#D97706"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect x="10" y="23" width="8" height="5.5" rx="2" fill="#94A3B8" stroke="#0F172A" strokeWidth="1.8" />
  </g>
)

/**
 * Shared cel-shaded circular badge disc held cleanly in Mera's paw.
 */
const MeraHeldBadge: FC<{
  cx: number
  cy: number
  r?: number
  variant: 'green' | 'sky-disc' | 'amber-star'
  text?: string
  uid: string
}> = ({ cx, cy, r = 18.5, variant, text = '+1', uid }) => {
  const fillUrl =
    variant === 'green'
      ? `url(#${uid}-green)`
      : variant === 'amber-star'
      ? `url(#${uid}-gold)`
      : `url(#${uid}-sky-disc)`

  const isPlusVector = variant === 'sky-disc' && text === '+'

  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <circle r={r + 3} fill="#FFFFFF" />
      <circle r={r} fill={fillUrl} stroke="#0F172A" strokeWidth="3" />

      {variant === 'sky-disc' ? (
        <circle r={r - 4} fill="none" stroke="#0EA5E9" strokeWidth="2.8" />
      ) : (
        <path
          d={`M ${-r * 0.55} ${-r * 0.35} A ${r * 0.65} ${r * 0.65} 0 0 1 ${r * 0.48} ${-r * 0.42}`}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.48"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      )}

      {variant === 'amber-star' ? (
        <polygon
          points="0,-9.5 2.7,-3.2 9.5,-2.6 4.2,1.9 5.9,8.5 0,4.9 -5.9,8.5 -4.2,1.9 -9.5,-2.6 -2.7,-3.2"
          fill="#FFFFFF"
          stroke="#B45309"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      ) : isPlusVector ? (
        <g fill="#0284C7" stroke="#0369A1" strokeWidth="0.6">
          <rect x="-8" y="-2.5" width="16" height="5" rx="2.5" />
          <rect x="-2.5" y="-8" width="5" height="16" rx="2.5" />
        </g>
      ) : (
        <text
          x="0"
          y="0.5"
          textAnchor="middle"
          dominantBaseline="central"
          fill={variant === 'green' ? '#FFFFFF' : '#0284C7'}
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
 * Left Trio Member: White Mera with sky-blue explorer neckerchief & green '+20' badge.
 */
const MeraTrioLeft: FC<{ mood: MeraShowcaseMood }> = ({ mood }) => {
  const rawId = useId()
  const uid = sanitizeSvgId(rawId)
  const isThinking = mood === 'thinking'

  return (
    <svg
      viewBox="0 0 180 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto overflow-visible select-none"
      aria-hidden="true"
    >
      <MeraStudioDefs uid={uid} />

      <g transform={isThinking ? 'rotate(4 90 152)' : undefined}>
        <MeraCelBody uid={uid} tailDirection="left" tailPosition="high" hideShadow />

        {/* Sky-blue explorer neckerchief */}
        <path
          d="M 54 106 Q 90 120 126 106 L 124 117 Q 90 130 56 117 Z"
          fill={`url(#${uid}-neckerchief)`}
          stroke="#0F172A"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <polygon
          points="83,119 97,119 102,135 90,141 78,135"
          fill="#0EA5E9"
          stroke="#0F172A"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <circle cx="90" cy="119" r="5" fill="#38BDF8" stroke="#0F172A" strokeWidth="2.4" />

        <MeraStudioFace mood={mood} eyeY={84} />

        {/* Green +20 badge held in left paw */}
        <MeraHeldBadge cx={32} cy={122} r={19} variant="green" text="+20" uid={uid} />
        <ellipse cx="48" cy="122" rx="7" ry="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
      </g>

      {isThinking && <MeraThinkingBubble x={14} y={24} />}
    </svg>
  )
}

/**
 * Center Trio Member: Tall prominent white Mera with royal-blue headband, golden star medallion & center badge.
 */
const MeraTrioCenter: FC<{ mood: MeraShowcaseMood; centerBadge: string }> = ({
  mood,
  centerBadge,
}) => {
  const rawId = useId()
  const uid = sanitizeSvgId(rawId)
  const isThinking = mood === 'thinking'

  return (
    <svg
      viewBox="0 0 180 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto overflow-visible select-none"
      aria-hidden="true"
    >
      <MeraStudioDefs uid={uid} />

      <g transform={isThinking ? 'rotate(-3 90 152)' : undefined}>
        <MeraCelBody uid={uid} tailDirection="right" hideShadow />

        {/* Trailing royal-blue headband ribbons on left */}
        <path
          d="M 48 54 C 31 46 21 51 17 58 C 26 60 36 61 48 59 Z"
          fill="#1D4ED8"
          stroke="#0F172A"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M 47 59 C 32 64 24 72 22 79 C 31 75 40 69 48 64 Z"
          fill="#2563EB"
          stroke="#0F172A"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Royal-blue headband across forehead */}
        <path
          d="M 50 55 Q 90 45 130 55 L 130 66 Q 90 56 50 66 Z"
          fill="#2563EB"
          stroke="#0F172A"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          d="M 60 55.5 Q 90 49 120 55.5"
          stroke="#93C5FD"
          strokeOpacity="0.65"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Golden star medallion on headband */}
        <circle cx="90" cy="56" r="8.5" fill={`url(#${uid}-gold)`} stroke="#0F172A" strokeWidth="2.2" />
        <polygon
          points="90,50 91.6,53.8 95.6,54.1 92.5,56.7 93.4,60.6 90,58.5 86.6,60.6 87.5,56.7 84.4,54.1 88.4,53.8"
          fill="#FFFFFF"
        />

        {mood === 'listening' && <MeraStudioHeadphones waveSide="none" />}

        <MeraStudioFace mood={mood} eyeY={85} mouthVariant={mood === 'pointing' ? 'smile' : 'cat'} />

        {/* Sky-ringed white disc badge held cleanly in right paw */}
        <MeraHeldBadge cx={140} cy={122} r={19.5} variant="sky-disc" text={centerBadge} uid={uid} />
        <ellipse cx="122" cy="122" rx="7" ry="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
      </g>

      {mood === 'excited' && <MeraExcitedSparkles leftX={22} rightX={158} topY={24} />}
    </svg>
  )
}

/**
 * Right Trio Member: White Mera with coral artist beret (or cobalt headphones when listening) & amber star medallion.
 */
const MeraTrioRight: FC<{ mood: MeraShowcaseMood }> = ({ mood }) => {
  const rawId = useId()
  const uid = sanitizeSvgId(rawId)
  const isListening = mood === 'listening'
  const isThinking = mood === 'thinking'

  return (
    <svg
      viewBox="0 0 180 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto overflow-visible select-none"
      aria-hidden="true"
    >
      <MeraStudioDefs uid={uid} />

      <g transform={isThinking ? 'rotate(-4 90 152)' : undefined}>
        <MeraCelBody uid={uid} tailDirection="right" tailPosition="high" hideShadow />

        {/* Coral artist beret OR cushioned cobalt headphones when listening */}
        {isListening ? (
          <MeraStudioHeadphones waveSide="right" />
        ) : (
          <g transform="rotate(6 90 38)">
            <path
              d="M 57 45 C 54 29 74 22 92 22 C 110 22 128 30 124 46 C 108 49 72 49 57 45 Z"
              fill={`url(#${uid}-coral-beret)`}
              stroke="#0F172A"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            <line x1="92" y1="16" x2="92" y2="22" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
            <path
              d="M 68 32 Q 86 25 104 29"
              stroke="#FFE4E6"
              strokeOpacity="0.65"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        )}

        <MeraStudioFace mood={mood} eyeY={85} />

        {/* Amber circular star medallion held in right paw */}
        <MeraHeldBadge cx={146} cy={122} r={19} variant="amber-star" uid={uid} />
        <ellipse cx="128" cy="122" rx="7" ry="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
      </g>

      {isThinking && <MeraThinkingBubble x={142} y={24} />}
    </svg>
  )
}

/**
 * Hero Squad Composition — Three grounded cel-shaded Mera companions standing shoulder-to-shoulder
 * on a shared soft elliptical floor shadow, reacting smoothly across moods with zero idle bobbing.
 */
export const MeraTrioSquad: FC<{
  activeMood?: MeraShowcaseMood
  centerBadge?: string
  className?: string
}> = ({ activeMood = 'happy', centerBadge = '+1', className = '' }) => {
  const shouldReduceMotion = Boolean(useReducedMotion())
  const isExcited = activeMood === 'excited'

  return (
    <div
      className={`w-[290px] sm:w-[340px] flex items-end justify-center relative select-none ${className}`.trim()}
      aria-hidden="true"
    >
      {/* Shared wide soft elliptical floor shadow */}
      <div className="absolute inset-x-4 bottom-0.5 h-4 rounded-full bg-[#0F172A]/10 blur-[2px] pointer-events-none" />

      {/* Left Mera */}
      <motion.div
        className="relative z-10 w-[98px] sm:w-[114px] -mr-5 origin-bottom"
        animate={shouldReduceMotion ? undefined : { scale: isExcited ? 1.03 : 1 }}
        transition={
          shouldReduceMotion ? undefined : { type: 'spring', stiffness: 320, damping: 22 }
        }
      >
        <MeraTrioLeft mood={activeMood} />
      </motion.div>

      {/* Center Mera (taller & forward) */}
      <motion.div
        className="relative z-20 w-[118px] sm:w-[138px] origin-bottom"
        animate={shouldReduceMotion ? undefined : { scale: isExcited ? 1.05 : 1 }}
        transition={
          shouldReduceMotion ? undefined : { type: 'spring', stiffness: 340, damping: 22 }
        }
      >
        <MeraTrioCenter mood={activeMood} centerBadge={centerBadge} />
      </motion.div>

      {/* Right Mera */}
      <motion.div
        className="relative z-10 w-[98px] sm:w-[114px] -ml-5 origin-bottom"
        animate={shouldReduceMotion ? undefined : { scale: isExcited ? 1.03 : 1 }}
        transition={
          shouldReduceMotion ? undefined : { type: 'spring', stiffness: 320, damping: 22 }
        }
      >
        <MeraTrioRight mood={activeMood} />
      </motion.div>
    </div>
  )
}

/**
 * MeraSenseiFigure — Cel-shaded Mera mentor wearing a sky-blue sensei headband,
 * smart round cobalt glasses with glass shine, neat collar bow, and a warm-wood
 * golden-star pointer wand angled cleanly toward the upper-right.
 */
export const MeraSenseiFigure: FC<MeraFigureProps> = ({
  mood = 'pointing',
  size = 196,
  badgeText,
  className = '',
}) => {
  const rawId = useId()
  const uid = sanitizeSvgId(rawId)
  const shouldReduceMotion = Boolean(useReducedMotion())
  const height = Math.round(size * (172 / 180))
  const isExcited = mood === 'excited'

  return (
    <motion.div
      className={`inline-flex items-end justify-center select-none shrink-0 origin-bottom ${className}`.trim()}
      animate={shouldReduceMotion ? undefined : { scale: isExcited ? 1.03 : 1 }}
      transition={
        shouldReduceMotion ? undefined : { type: 'spring', stiffness: 320, damping: 22 }
      }
      aria-hidden="true"
    >
      <svg
        width={size}
        height={height}
        viewBox="0 0 180 172"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible select-none shrink-0"
      >
        <MeraStudioDefs uid={uid} />

        <MeraCelBody uid={uid} tailDirection="right" shadowRx={46} />

        {/* Sky-blue sensei headband with trailing side ribbons */}
        <path
          d="M 48 54 C 30 46 20 51 16 58 C 25 60 36 61 48 59 Z"
          fill="#0284C7"
          stroke="#0F172A"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M 47 59 C 31 64 23 72 21 79 C 30 75 39 69 48 64 Z"
          fill="#0EA5E9"
          stroke="#0F172A"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M 50 55 Q 90 45 130 55 L 130 65 Q 90 55 50 65 Z"
          fill="#0EA5E9"
          stroke="#0F172A"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          d="M 60 55.5 Q 90 49 120 55.5"
          stroke="#BAE6FD"
          strokeOpacity="0.8"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Cushioned cobalt headphones when listening */}
        {mood === 'listening' && <MeraStudioHeadphones waveSide="both" />}

        {/* Face behind glasses */}
        <MeraStudioFace mood={mood} eyeY={85} mouthVariant="smile" />

        {/* Smart round cobalt glasses with subtle glass shine */}
        <g>
          <circle
            cx="72"
            cy="85"
            r="13.5"
            fill="#E0F2FE"
            fillOpacity="0.24"
            stroke="#1D4ED8"
            strokeWidth="3"
          />
          <circle
            cx="108"
            cy="85"
            r="13.5"
            fill="#E0F2FE"
            fillOpacity="0.24"
            stroke="#1D4ED8"
            strokeWidth="3"
          />
          <path
            d="M 85.5 84 Q 90 80.5 94.5 84"
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line x1="51" y1="82" x2="58.5" y2="83" stroke="#1D4ED8" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="121.5" y1="83" x2="129" y2="82" stroke="#1D4ED8" strokeWidth="2.8" strokeLinecap="round" />
          {/* Subtle glass shine */}
          <line x1="63" y1="79" x2="68" y2="74" stroke="#FFFFFF" strokeOpacity="0.72" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="65" y1="83" x2="72" y2="76" stroke="#FFFFFF" strokeOpacity="0.52" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="99" y1="79" x2="104" y2="74" stroke="#FFFFFF" strokeOpacity="0.72" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="101" y1="83" x2="108" y2="76" stroke="#FFFFFF" strokeOpacity="0.52" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        {/* Neat collar bow tie */}
        <g>
          <polygon
            points="78,109 90,115 78,121"
            fill="#2563EB"
            stroke="#0F172A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <polygon
            points="102,109 90,115 102,121"
            fill="#2563EB"
            stroke="#0F172A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle cx="90" cy="115" r="3.8" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
        </g>

        {/* Optional crisp lapel/board tag if badgeText provided */}
        {badgeText ? (
          <g transform="translate(24, 108)">
            <rect
              x="0"
              y="0"
              width="42"
              height="26"
              rx="7"
              fill="#EFF6FF"
              stroke="#2563EB"
              strokeWidth="2.4"
            />
            <text
              x="21"
              y="13.5"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#1E40AF"
              fontFamily="'Fredoka', 'Plus Jakarta Sans', system-ui, sans-serif"
              fontWeight="800"
              fontSize={badgeText.length > 3 ? '10' : '12'}
            >
              {badgeText}
            </text>
          </g>
        ) : null}

        {/* Left resting paw */}
        <ellipse cx="64" cy="126" rx="7.5" ry="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />

        {/* Slim warm-wood pointer wand with golden star & coral tip angled upper-right */}
        <g>
          <line
            x1="128"
            y1="118"
            x2="167"
            y2="46"
            stroke="#0F172A"
            strokeWidth="6.2"
            strokeLinecap="round"
          />
          <line
            x1="128"
            y1="118"
            x2="167"
            y2="46"
            stroke="#D97706"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <line
            x1="133"
            y1="109"
            x2="163"
            y2="53"
            stroke="#FBBF24"
            strokeOpacity="0.65"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Golden star + coral center gem tip */}
          <polygon
            points="168,34 171.2,41.2 179,41.8 173,46.9 174.9,54.5 168,50.4 161.1,54.5 163,46.9 157,41.8 164.8,41.2"
            fill="#FACC15"
            stroke="#0F172A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="168" cy="45" r="2.8" fill="#FB7185" />
        </g>

        {/* Raised right paw gripping pointer wand */}
        <g transform="translate(122, 102) rotate(-20 10 10)">
          <ellipse cx="10" cy="10" rx="7.5" ry="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.6" />
          <circle cx="10" cy="8" r="3.6" fill="#FECDD3" />
        </g>

        {isExcited && <MeraExcitedSparkles leftX={24} rightX={152} topY={22} />}
        {mood === 'thinking' && <MeraThinkingBubble x={20} y={24} />}
      </svg>
    </motion.div>
  )
}

/**
 * MeraPolyglotFigure — Cel-shaded Mera linguist wearing an emerald artist beret
 * and cozy coral-rose scarf, holding a sleek calligraphy pen and tilted script card.
 */
export const MeraPolyglotFigure: FC<MeraFigureProps> = ({
  mood = 'happy',
  size = 176,
  badgeText = 'JA',
  className = '',
}) => {
  const rawId = useId()
  const uid = sanitizeSvgId(rawId)
  const shouldReduceMotion = Boolean(useReducedMotion())
  const height = Math.round(size * (172 / 180))
  const isExcited = mood === 'excited'

  return (
    <motion.div
      className={`inline-flex items-end justify-center select-none shrink-0 origin-bottom ${className}`.trim()}
      animate={shouldReduceMotion ? undefined : { scale: isExcited ? 1.03 : 1 }}
      transition={
        shouldReduceMotion ? undefined : { type: 'spring', stiffness: 320, damping: 22 }
      }
      aria-hidden="true"
    >
      <svg
        width={size}
        height={height}
        viewBox="0 0 180 172"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible select-none shrink-0"
      >
        <MeraStudioDefs uid={uid} />

        <MeraCelBody uid={uid} tailDirection="right" shadowRx={44} />

        {/* Emerald artist beret perched neatly between ears */}
        <g transform="rotate(-7 90 38)">
          <path
            d="M 55 45 C 52 29 72 21 92 21 C 112 21 128 30 124 46 C 108 50 70 50 55 45 Z"
            fill={`url(#${uid}-beret)`}
            stroke="#0F172A"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <line x1="92" y1="15" x2="92" y2="21" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
          <path
            d="M 67 31 Q 85 24 103 28"
            stroke="#A7F3D0"
            strokeOpacity="0.72"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </g>

        {/* Cushioned cobalt headphones when listening */}
        {mood === 'listening' && <MeraStudioHeadphones waveSide="both" />}

        <MeraStudioFace mood={mood} eyeY={84} />

        {/* Cozy coral-rose scarf around neck */}
        <g>
          <path
            d="M 96 113 L 112 113 L 116 142 Q 106 146 98 142 Z"
            fill="#F43F5E"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line x1="101" y1="136" x2="112" y2="136" stroke="#FFE4E6" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M 52 104 Q 90 119 128 104 L 126 117 Q 90 130 54 117 Z"
            fill={`url(#${uid}-scarf)`}
            stroke="#0F172A"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <path
            d="M 64 111 Q 90 118 116 111"
            stroke="#FDA4AF"
            strokeOpacity="0.65"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>

        {/* Tilted cream script card in left paw */}
        <g transform="translate(26, 108) rotate(-7)">
          <rect
            x="0"
            y="0"
            width="46"
            height="34"
            rx="6"
            fill="#FFFBEB"
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          <rect x="4" y="4" width="38" height="4" rx="2" fill="#10B981" fillOpacity="0.25" />
          <text
            x="23"
            y="20.5"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#047857"
            fontFamily="'Fredoka', 'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="800"
            fontSize={badgeText.length > 3 ? '12' : '15'}
          >
            {badgeText}
          </text>
        </g>
        <ellipse cx="64" cy="127" rx="7.5" ry="6.2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />

        {/* Sleek calligraphy fountain pen in right paw */}
        <g transform="translate(126, 92) rotate(22)">
          <rect
            x="0"
            y="0"
            width="7"
            height="28"
            rx="2.5"
            fill="#1E293B"
            stroke="#0F172A"
            strokeWidth="2"
          />
          <rect x="0" y="24" width="7" height="4" rx="1" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="0.5,28 6.5,28 3.5,39" fill="#0F172A" />
          <circle cx="3.5" cy="33" r="1" fill="#38BDF8" />
        </g>
        <ellipse cx="122" cy="124" rx="7.5" ry="6.2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />

        {isExcited && <MeraExcitedSparkles leftX={24} rightX={156} topY={24} />}
        {mood === 'thinking' && <MeraThinkingBubble x={20} y={24} />}
      </svg>
    </motion.div>
  )
}

/**
 * MeraTimekeeperFigure — Cel-shaded Mera wearing a neat violet/amber bow tie,
 * holding a gleaming golden pocket watch and miniature flashcard deck corner.
 */
export const MeraTimekeeperFigure: FC<MeraFigureProps> = ({
  mood = 'happy',
  size = 176,
  badgeText = '1/5',
  className = '',
}) => {
  const rawId = useId()
  const uid = sanitizeSvgId(rawId)
  const shouldReduceMotion = Boolean(useReducedMotion())
  const height = Math.round(size * (172 / 180))
  const isExcited = mood === 'excited'

  return (
    <motion.div
      className={`inline-flex items-end justify-center select-none shrink-0 origin-bottom ${className}`.trim()}
      animate={shouldReduceMotion ? undefined : { scale: isExcited ? 1.03 : 1 }}
      transition={
        shouldReduceMotion ? undefined : { type: 'spring', stiffness: 320, damping: 22 }
      }
      aria-hidden="true"
    >
      <svg
        width={size}
        height={height}
        viewBox="0 0 180 172"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible select-none shrink-0"
      >
        <MeraStudioDefs uid={uid} />

        {/* Overhead golden lightbulb & rays when excited */}
        {isExcited && <MeraAhaLightbulb />}

        <MeraCelBody uid={uid} tailDirection="right" shadowRx={44} />

        {/* Cushioned cobalt headphones when listening */}
        {mood === 'listening' && <MeraStudioHeadphones waveSide="both" />}

        {/* Star-catchlight eyes when excited, studio face otherwise */}
        <MeraStudioFace
          mood={mood}
          eyeY={83}
          starEyes={isExcited}
          mouthVariant={isExcited ? 'smile' : 'cat'}
        />

        {/* Neat violet & amber bow tie */}
        <g>
          <polygon
            points="76,105 90,111 76,117"
            fill="#8B5CF6"
            stroke="#0F172A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <polygon
            points="104,105 90,111 104,117"
            fill="#7C3AED"
            stroke="#0F172A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle cx="90" cy="111" r="4" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />
        </g>

        {/* Miniature deck card corner showing badgeText (left paw) */}
        <g transform="translate(30, 114) rotate(-6)">
          <rect
            x="4"
            y="-4"
            width="42"
            height="32"
            rx="6"
            fill="#DBEAFE"
            stroke="#0F172A"
            strokeWidth="2.2"
          />
          <rect
            x="0"
            y="0"
            width="42"
            height="32"
            rx="6"
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          <rect x="0" y="0" width="42" height="8" rx="4" fill="#2563EB" />
          <text
            x="21"
            y="21"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#0F172A"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="800"
            fontSize={badgeText.length > 4 ? '10' : '12'}
          >
            {badgeText}
          </text>
        </g>
        <ellipse cx="64" cy="130" rx="7.5" ry="6.2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />

        {/* Gleaming cel-shaded golden pocket watch (right paw) */}
        <g transform="translate(106, 106)">
          {/* Top winding crown & loop */}
          <circle cx="20" cy="1.5" r="3.8" fill="none" stroke="#D97706" strokeWidth="2.2" />
          <rect x="17" y="3.5" width="6" height="4.5" rx="1.5" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.8" />
          {/* Golden casing */}
          <circle cx="20" cy="24" r="18.5" fill={`url(#${uid}-gold)`} stroke="#0F172A" strokeWidth="2.8" />
          {/* Dial face */}
          <circle cx="20" cy="24" r="13.5" fill="#FFFFFF" stroke="#B45309" strokeWidth="1.4" />
          {/* Ticks */}
          <line x1="20" y1="12.5" x2="20" y2="14.5" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="20" y1="33.5" x2="20" y2="35.5" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="8.5" y1="24" x2="10.5" y2="24" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="29.5" y1="24" x2="31.5" y2="24" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" />
          {/* Clock hands */}
          <line x1="20" y1="24" x2="20" y2="16" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="20" y1="24" x2="27" y2="24" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="20" cy="24" r="2.1" fill="#0F172A" />
          {/* Rim gloss */}
          <path
            d="M 10 15 A 14 14 0 0 1 25 11"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.65"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
        <ellipse cx="112" cy="130" rx="7.5" ry="6.2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />

        {isExcited && <MeraExcitedSparkles leftX={22} rightX={158} topY={28} />}
        {mood === 'thinking' && <MeraThinkingBubble x={20} y={24} />}
      </svg>
    </motion.div>
  )
}
