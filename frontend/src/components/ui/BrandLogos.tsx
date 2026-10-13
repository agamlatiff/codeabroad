import {
  GoLogo,
  ReactLogo as OnboardingReactLogo,
  DockerLogo as OnboardingDockerLogo,
} from '../illustrations/onboarding/TechIcons'

// Re-export authentic official brand logos from onboarding
export const GolangLogo = GoLogo
export const ReactLogo = OnboardingReactLogo
export const DockerLogo = OnboardingDockerLogo

export const FundamentalLogo = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Clean Developer Terminal Badge */}
    <rect width="24" height="24" rx="6" fill="#4F46E5" />
    <path d="M7 8L11 12L7 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 16H17" stroke="#C7D2FE" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)

export const TechNihongoLogo = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Japanese Torii Gate Vector */}
    <rect width="24" height="24" rx="6" fill="#FEE2E2" />
    {/* Upper lintel */}
    <path d="M3 6.5C8 5.8 16 5.8 21 6.5" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
    {/* Lower lintel */}
    <path d="M5 9H19" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" />
    {/* Central plaque */}
    <rect x="11" y="6.5" width="2" height="2.5" fill="#DC2626" />
    {/* Pillars */}
    <path d="M7 9V19M17 9V19" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
