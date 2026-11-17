import type { DailyGoalMinutes, InitialPlacementType } from '@/features/onboarding/store/onboardingStore'

interface PaceIllustrationProps {
  minutes: DailyGoalMinutes
  active: boolean
}

/** Flat-vector SVG dial + metaphor for each daily study commitment tier. */
export const DailyPaceIllustration = ({ minutes, active }: PaceIllustrationProps) => {
  const bgCircle = active ? '#DBEAFE' : '#F1F5F9'
  const arcColor = active ? '#2563EB' : '#94A3B8'
  const fgPrimary = active ? '#2563EB' : '#64748B'
  const fgSecondary = active ? '#60A5FA' : '#94A3B8'

  if (minutes === 5) {
    return (
      <svg viewBox="0 0 80 56" className="w-16 h-11 shrink-0" fill="none" aria-hidden="true">
        <circle cx="40" cy="28" r="22" fill={bgCircle} />
        <path d="M40 6 A22 22 0 0 1 62 28" stroke={arcColor} strokeWidth="4" strokeLinecap="round" />
        <rect x="28" y="24" width="20" height="15" rx="4" fill={fgPrimary} />
        <path d="M48 27h3a3 3 0 0 1 0 6h-3" stroke={fgPrimary} strokeWidth="2.5" strokeLinecap="round" />
        <path
          d="M34 19c0-2 2-2 2-4M41 19c0-2 2-2 2-4"
          stroke={fgSecondary}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (minutes === 15) {
    return (
      <svg viewBox="0 0 80 56" className="w-16 h-11 shrink-0" fill="none" aria-hidden="true">
        <circle cx="40" cy="28" r="22" fill={bgCircle} />
        <path d="M40 6 A22 22 0 0 1 40 50" stroke={arcColor} strokeWidth="4" strokeLinecap="round" />
        <circle cx="40" cy="28" r="9" fill={fgPrimary} />
        <circle cx="40" cy="28" r="4" fill="#FFFFFF" />
        <circle cx="57" cy="14" r="3" fill={active ? '#F59E0B' : '#CBD5E1'} />
      </svg>
    )
  }

  if (minutes === 30) {
    return (
      <svg viewBox="0 0 80 56" className="w-16 h-11 shrink-0" fill="none" aria-hidden="true">
        <circle cx="40" cy="28" r="22" fill={bgCircle} />
        <path d="M40 6 A22 22 0 1 1 18 28" stroke={arcColor} strokeWidth="4" strokeLinecap="round" />
        <path
          d="M41 16c4 5 7 9 7 14a8 8 0 1 1-16 0c0-3 2-6 4-8 0 3 2 4 3 4-1-4 0-7 2-10z"
          fill={active ? '#F97316' : '#64748B'}
        />
        <circle cx="40" cy="33" r="3" fill="#FEF3C7" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 80 56" className="w-16 h-11 shrink-0" fill="none" aria-hidden="true">
      <circle cx="40" cy="28" r="22" fill={bgCircle} stroke={arcColor} strokeWidth="4" />
      <path d="M40 13c5 4 7 10 7 16l-7 5-7-5c0-6 2-12 7-16z" fill={fgPrimary} />
      <circle cx="40" cy="24" r="2.5" fill="#FFFFFF" />
      <path d="M33 27l-4 4 4 1M47 27l4 4-4 1" fill={fgSecondary} />
      <path d="M37 35l3 6 3-6" fill={active ? '#F97316' : '#94A3B8'} />
    </svg>
  )
}

interface PlacementIllustrationProps {
  type: InitialPlacementType
  active: boolean
}

/** Full-width flat-vector banner scene illustrating starting from zero vs. placement shortcut. */
export const PlacementPathIllustration = ({ type, active }: PlacementIllustrationProps) => {
  const gradId = `placement-bg-${type}-${active ? 'active' : 'idle'}`
  const bgStart = active ? '#EFF6FF' : '#F8FAFC'
  const bgEnd = active ? '#DBEAFE' : '#E2E8F0'
  const primary = active ? '#2563EB' : '#64748B'
  const secondary = active ? '#93C5FD' : '#CBD5E1'
  const surface = '#FFFFFF'

  if (type === 'zero_beginner') {
    return (
      <svg viewBox="0 0 280 112" className="w-full h-28" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="280" y2="112" gradientUnits="userSpaceOnUse">
            <stop stopColor={bgStart} />
            <stop offset="1" stopColor={bgEnd} />
          </linearGradient>
        </defs>
        <rect width="280" height="112" rx="16" fill={`url(#${gradId})`} />
        {/* Soft layered hills */}
        <path
          d="M0 86 Q72 64 146 82 T280 74 V96 C280 104.8 272.8 112 264 112 H16 C7.2 112 0 104.8 0 96 Z"
          fill={secondary}
          opacity="0.45"
        />
        {/* Smooth ascending stepping stones */}
        <path
          d="M54 78 C96 78, 108 56, 140 56 C172 56, 184 36, 218 36"
          stroke={primary}
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Step 1: Character foundation card */}
        <rect x="34" y="54" width="38" height="38" rx="10" fill={surface} stroke={primary} strokeWidth="2.5" />
        <text x="53" y="79" textAnchor="middle" fontSize="16" fontWeight="800" fill={primary}>
          あ
        </text>
        {/* Step 2: Mid milestone */}
        <circle cx="140" cy="56" r="10" fill={surface} stroke={primary} strokeWidth="3" />
        <circle cx="140" cy="56" r="4" fill={primary} />
        {/* Step 3: Unit 1 Destination Flag */}
        <rect x="200" y="18" width="44" height="34" rx="10" fill={primary} />
        <text x="222" y="39" textAnchor="middle" fontSize="12" fontWeight="800" fill={surface}>
          Unit 1
        </text>
        <circle cx="242" cy="20" r="5" fill={active ? '#F59E0B' : '#94A3B8'} />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 280 112" className="w-full h-28" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="280" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor={bgStart} />
          <stop offset="1" stopColor={bgEnd} />
        </linearGradient>
      </defs>
      <rect width="280" height="112" rx="16" fill={`url(#${gradId})`} />
      {/* Skipped beginner cards */}
      <rect x="36" y="64" width="34" height="26" rx="7" fill={surface} opacity="0.85" />
      <rect x="82" y="64" width="34" height="26" rx="7" fill={surface} opacity="0.85" />
      <rect x="128" y="64" width="34" height="26" rx="7" fill={surface} opacity="0.85" />
      <line x1="46" y1="77" x2="60" y2="77" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
      <line x1="92" y1="77" x2="106" y2="77" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
      <line x1="138" y1="77" x2="152" y2="77" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
      {/* Smooth express arc leaping over beginner units */}
      <path
        d="M52 58 C92 12, 164 12, 212 42"
        stroke={primary}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M203 33 L215 43 L201 47"
        stroke={primary}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Unlocked advanced node */}
      <circle cx="226" cy="70" r="18" fill={primary} />
      <path
        d="M219 70 L224 75 L234 65"
        stroke={surface}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Floating 80%+ pill */}
      <rect x="114" y="14" width="52" height="22" rx="11" fill={active ? '#F59E0B' : '#94A3B8'} />
      <text x="140" y="28.5" textAnchor="middle" fontSize="11" fontWeight="800" fill={surface}>
        80%+
      </text>
    </svg>
  )
}
