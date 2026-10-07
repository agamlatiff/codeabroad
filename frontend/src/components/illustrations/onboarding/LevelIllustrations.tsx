import type { IllustrationProps } from '../types'

// Level 1: Mulai dari Nol (Beginner / Career Switcher Seedling)
export const BeginnerIllustration = ({ className = 'w-full h-full max-h-44 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 240 160" className={className} fill="none">
      {/* Platform Podium */}
      <rect x="85" y="112" width="70" height="24" rx="6" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" />
      <line x1="95" y1="124" x2="145" y2="124" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />

      {/* Sprouting Plant */}
      <path
        d="M120 112 C 120 70, 116 55, 120 40"
        stroke="#4F46E5"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Left Leaf */}
      <path
        d="M120 80 C 95 80, 85 62, 95 55 C 105 55, 115 68, 120 80 Z"
        fill="#818CF8"
        stroke="#4F46E5"
        strokeWidth="1.5"
      />
      {/* Right Leaf */}
      <path
        d="M120 65 C 145 65, 155 48, 145 40 C 135 40, 125 52, 120 65 Z"
        fill="#6366F1"
        stroke="#4338CA"
        strokeWidth="1.5"
      />

      {/* Sparkles of learning */}
      <circle cx="75" cy="50" r="3" fill="#F59E0B" />
      <circle cx="165" cy="70" r="2.5" fill="#10B981" />
      <circle cx="155" cy="35" r="3.5" fill="#4F46E5" />
    </svg>
  </div>
)

// Level 2: Sudah Berpengalaman (Experienced / High Velocity Rocket)
export const ExperiencedIllustration = ({ className = 'w-full h-full max-h-44 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 240 160" className={className} fill="none">
      {/* Launch cloud base */}
      <ellipse cx="120" cy="132" rx="45" ry="12" fill="#EEF2FF" />
      <ellipse cx="120" cy="128" rx="28" ry="8" fill="#C7D2FE" />

      {/* Rocket Body */}
      <path
        d="M120 32 C 105 50, 105 85, 105 105 L 135 105 C 135 85, 135 50, 120 32 Z"
        fill="#FFFFFF"
        stroke="#4F46E5"
        strokeWidth="2.5"
      />
      {/* Rocket Window */}
      <circle cx="120" cy="62" r="7" fill="#818CF8" stroke="#4F46E5" strokeWidth="2" />

      {/* Rocket Fins */}
      <path d="M105 88 L90 106 L105 105 Z" fill="#F43F5E" stroke="#E11D48" strokeWidth="1.5" />
      <path d="M135 88 L150 106 L135 105 Z" fill="#F43F5E" stroke="#E11D48" strokeWidth="1.5" />

      {/* Rocket Flame */}
      <path
        d="M112 105 Q 120 128 128 105 Z"
        fill="#F59E0B"
      />
      <path
        d="M115 105 Q 120 120 125 105 Z"
        fill="#EF4444"
      />

      {/* Velocity trails */}
      <line x1="75" y1="65" x2="75" y2="105" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
      <line x1="165" y1="55" x2="165" y2="95" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
    </svg>
  </div>
)

// Fundamental Path Breakdown (Curriculum Roadmap, Daily Quest, Language)
export const FundamentalGuideIllustration = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <rect x="6" y="8" width="52" height="48" rx="10" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" />
    <path d="M16 22 H40 M16 32 H48 M16 42 H34" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="46" cy="22" r="3" fill="#10B981" />
    <circle cx="42" cy="42" r="3" fill="#F59E0B" />
  </svg>
)

// Accelerated Path Breakdown (System Design, Mock Interview, Fast PR Visa)
export const AcceleratedSystemIllustration = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <rect x="6" y="8" width="52" height="48" rx="10" fill="#312E81" stroke="#4338CA" strokeWidth="2" />
    <polygon points="32,16 44,28 36,28 36,44 28,44 28,28 20,28" fill="#F43F5E" />
    <circle cx="48" cy="44" r="3" fill="#38BDF8" />
    <circle cx="16" cy="44" r="3" fill="#34D399" />
  </svg>
)
