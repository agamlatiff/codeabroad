import type { IllustrationProps } from '../types'

// Japan Flag (White field with Vermilion crimson sun disc)
export const JapanFlagIllustration = ({ className = 'w-full h-full max-h-40 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 200 130" className={className} fill="none">
      {/* Flag Canvas Frame with subtle drop shadow and border */}
      <rect
        x="6"
        y="6"
        width="188"
        height="118"
        rx="12"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="2"
      />
      {/* Japan Sun Disc */}
      <circle cx="100" cy="65" r="38" fill="#BC002D" />
    </svg>
  </div>
)

// Singapore Flag (Red & white bicolor with crescent moon and 5 stars)
export const SingaporeFlagIllustration = ({ className = 'w-full h-full max-h-40 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 200 130" className={className} fill="none">
      <defs>
        <clipPath id="sg-flag-clip">
          <rect x="6" y="6" width="188" height="118" rx="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#sg-flag-clip)">
        {/* Top Red Half */}
        <rect x="6" y="6" width="188" height="59" fill="#ED2939" />
        {/* Bottom White Half */}
        <rect x="6" y="65" width="188" height="59" fill="#FFFFFF" />

        {/* Crescent Moon */}
        <circle cx="48" cy="35" r="18" fill="#FFFFFF" />
        <circle cx="54" cy="35" r="17" fill="#ED2939" />

        {/* 5 Five-pointed Stars */}
        <circle cx="58" cy="26" r="2.2" fill="#FFFFFF" />
        <circle cx="67" cy="30" r="2.2" fill="#FFFFFF" />
        <circle cx="65" cy="40" r="2.2" fill="#FFFFFF" />
        <circle cx="53" cy="42" r="2.2" fill="#FFFFFF" />
        <circle cx="50" cy="32" r="2.2" fill="#FFFFFF" />
      </g>
      {/* Border Outline */}
      <rect
        x="6"
        y="6"
        width="188"
        height="118"
        rx="12"
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="2"
      />
    </svg>
  </div>
)

// Germany Flag (Black, Red, Gold Tricolor)
export const GermanyFlagIllustration = ({ className = 'w-full h-full max-h-40 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 200 130" className={className} fill="none">
      <defs>
        <clipPath id="de-flag-clip">
          <rect x="6" y="6" width="188" height="118" rx="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#de-flag-clip)">
        {/* Black Top Band */}
        <rect x="6" y="6" width="188" height="39.3" fill="#18181B" />
        {/* Red Middle Band */}
        <rect x="6" y="45.3" width="188" height="39.3" fill="#DC2626" />
        {/* Gold Bottom Band */}
        <rect x="6" y="84.6" width="188" height="39.4" fill="#FBBF24" />
      </g>
      {/* Border Outline */}
      <rect
        x="6"
        y="6"
        width="188"
        height="118"
        rx="12"
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="2"
      />
    </svg>
  </div>
)

// Aliases for compatibility
export const JapanIllustration = JapanFlagIllustration
export const SingaporeIllustration = SingaporeFlagIllustration
export const GermanyIllustration = GermanyFlagIllustration
export const TokyoIllustration = JapanFlagIllustration
export const GlobalIllustration = SingaporeFlagIllustration
