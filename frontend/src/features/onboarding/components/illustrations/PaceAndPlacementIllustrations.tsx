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
      <svg viewBox="0 0 80 56" className="w-12 h-9 sm:w-16 sm:h-11 shrink-0" fill="none" aria-hidden="true">
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
      <svg viewBox="0 0 80 56" className="w-12 h-9 sm:w-16 sm:h-11 shrink-0" fill="none" aria-hidden="true">
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
      <svg viewBox="0 0 80 56" className="w-12 h-9 sm:w-16 sm:h-11 shrink-0" fill="none" aria-hidden="true">
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
    <svg viewBox="0 0 80 56" className="w-12 h-9 sm:w-16 sm:h-11 shrink-0" fill="none" aria-hidden="true">
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

/** Circular dial-style icon matching DailyPaceIllustration for each placement path. */
export const PlacementPathIllustration = ({ type, active }: PlacementIllustrationProps) => {
  const bgCircle = active ? '#DBEAFE' : '#F1F5F9'
  const arcColor = active ? '#2563EB' : '#94A3B8'
  const fgPrimary = active ? '#2563EB' : '#64748B'
  const fgSecondary = active ? '#93C5FD' : '#CBD5E1'

  if (type === 'zero_beginner') {
    // Ascending steps from the first character (あ) upward
    return (
      <svg viewBox="0 0 80 56" className="w-16 h-12 sm:w-24 sm:h-[68px] shrink-0" fill="none" aria-hidden="true">
        <circle cx="40" cy="28" r="22" fill={bgCircle} />
        <path d="M40 6 A22 22 0 0 1 62 28" stroke={arcColor} strokeWidth="4" strokeLinecap="round" />
        <rect x="27" y="34" width="8" height="8" rx="2" fill={fgSecondary} />
        <rect x="36" y="27" width="8" height="15" rx="2" fill={fgSecondary} />
        <rect x="45" y="20" width="8" height="22" rx="2" fill={fgPrimary} />
        <circle cx="49" cy="14" r="3" fill={active ? '#F59E0B' : '#CBD5E1'} />
      </svg>
    )
  }

  // Leap arc skipping basics, landing on a check
  return (
    <svg viewBox="0 0 80 56" className="w-16 h-12 sm:w-24 sm:h-[68px] shrink-0" fill="none" aria-hidden="true">
      <circle cx="40" cy="28" r="22" fill={bgCircle} />
      <path d="M40 6 A22 22 0 1 1 18 28" stroke={arcColor} strokeWidth="4" strokeLinecap="round" />
      <circle cx="30" cy="38" r="2.5" fill={fgSecondary} />
      <circle cx="38" cy="38" r="2.5" fill={fgSecondary} />
      <path d="M28 32 C32 18, 44 16, 50 26" stroke={fgPrimary} strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="33" r="7" fill={fgPrimary} />
      <path d="M47 33 L49.5 35.5 L53.5 31" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
