import type { ComponentType } from 'react'
import type { IllustrationProps } from "@/features/onboarding/types/onboarding"

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

// United Kingdom Flag
export const UKFlagIllustration = ({ className = 'w-full h-full max-h-40 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 200 130" className={className} fill="none">
      <defs>
        <clipPath id="uk-flag-clip">
          <rect x="6" y="6" width="188" height="118" rx="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#uk-flag-clip)">
        <rect x="6" y="6" width="188" height="118" fill="#012169" />
        <path d="M6 6L194 124M194 6L6 124" stroke="#FFFFFF" strokeWidth="22" />
        <path d="M6 6L194 124M194 6L6 124" stroke="#C8102E" strokeWidth="10" />
        <path d="M100 6V124M6 65H194" stroke="#FFFFFF" strokeWidth="32" />
        <path d="M100 6V124M6 65H194" stroke="#C8102E" strokeWidth="18" />
      </g>
      <rect x="6" y="6" width="188" height="118" rx="12" fill="none" stroke="#E2E8F0" strokeWidth="2" />
    </svg>
  </div>
)

// United States Flag
export const USFlagIllustration = ({ className = 'w-full h-full max-h-40 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 200 130" className={className} fill="none">
      <defs>
        <clipPath id="us-flag-clip">
          <rect x="6" y="6" width="188" height="118" rx="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#us-flag-clip)">
        <rect x="6" y="6" width="188" height="118" fill="#FFFFFF" />
        <rect x="6" y="6" width="188" height="17" fill="#B22234" />
        <rect x="6" y="40" width="188" height="17" fill="#B22234" />
        <rect x="6" y="74" width="188" height="17" fill="#B22234" />
        <rect x="6" y="107" width="188" height="17" fill="#B22234" />
        <rect x="6" y="6" width="84" height="68" fill="#3C3B6E" />
        <circle cx="24" cy="24" r="3" fill="#FFFFFF" />
        <circle cx="48" cy="24" r="3" fill="#FFFFFF" />
        <circle cx="72" cy="24" r="3" fill="#FFFFFF" />
        <circle cx="36" cy="40" r="3" fill="#FFFFFF" />
        <circle cx="60" cy="40" r="3" fill="#FFFFFF" />
        <circle cx="24" cy="56" r="3" fill="#FFFFFF" />
        <circle cx="48" cy="56" r="3" fill="#FFFFFF" />
        <circle cx="72" cy="56" r="3" fill="#FFFFFF" />
      </g>
      <rect x="6" y="6" width="188" height="118" rx="12" fill="none" stroke="#E2E8F0" strokeWidth="2" />
    </svg>
  </div>
)

// China Flag
export const ChinaFlagIllustration = ({ className = 'w-full h-full max-h-40 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 200 130" className={className} fill="none">
      <rect x="6" y="6" width="188" height="118" rx="12" fill="#DE2910" stroke="#E2E8F0" strokeWidth="2" />
      <circle cx="40" cy="36" r="12" fill="#FFDE00" />
      <circle cx="64" cy="22" r="4" fill="#FFDE00" />
      <circle cx="71" cy="34" r="4" fill="#FFDE00" />
      <circle cx="67" cy="48" r="4" fill="#FFDE00" />
      <circle cx="56" cy="56" r="4" fill="#FFDE00" />
    </svg>
  </div>
)

// France Flag
export const FranceFlagIllustration = ({ className = 'w-full h-full max-h-40 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 200 130" className={className} fill="none">
      <defs>
        <clipPath id="fr-flag-clip">
          <rect x="6" y="6" width="188" height="118" rx="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#fr-flag-clip)">
        <rect x="6" y="6" width="63" height="118" fill="#002395" />
        <rect x="69" y="6" width="62" height="118" fill="#FFFFFF" />
        <rect x="131" y="6" width="63" height="118" fill="#ED2939" />
      </g>
      <rect x="6" y="6" width="188" height="118" rx="12" fill="none" stroke="#E2E8F0" strokeWidth="2" />
    </svg>
  </div>
)


const FLAG_BY_CODE: Record<string, ComponentType<IllustrationProps>> = {
  ja: JapanFlagIllustration,
  de: GermanyFlagIllustration,
  en: UKFlagIllustration,
  'en-gb': UKFlagIllustration,
  'en-us': USFlagIllustration,
  zh: ChinaFlagIllustration,
  fr: FranceFlagIllustration,
}

export const LanguageFlagIllustration = ({
  code,
  className,
}: IllustrationProps & { code?: string }) => {
  const normalized = code?.toLowerCase() ?? ''
  const FlagComponent =
    FLAG_BY_CODE[normalized] ??
    (normalized.startsWith('en') ? UKFlagIllustration : JapanFlagIllustration)
  return <FlagComponent className={className} />
}
