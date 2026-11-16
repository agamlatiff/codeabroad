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
