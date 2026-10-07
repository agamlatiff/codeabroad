// Timeline 1: Sprint (Supersonic Jet & Afterburner Flames)
export const SprintPaceIllustration = ({ className = 'w-full h-full' }: { className?: string }) => (
  <svg viewBox="0 0 160 100" className={className} fill="none">
    <defs>
      <linearGradient id="sprintJetBody" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#EEF2FF" />
      </linearGradient>
      <linearGradient id="sprintPlumeGrad" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#EF4444" stopOpacity="0" />
        <stop offset="35%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#FEF08A" />
      </linearGradient>
    </defs>

    {/* Mach shockwave vapor ellipse */}
    <ellipse cx="60" cy="72" rx="35" ry="12" fill="#EEF2FF" opacity="0.8" />
    <ellipse cx="78" cy="68" rx="20" ry="7" fill="#C7D2FE" opacity="0.6" />

    {/* Speed thrust trails */}
    <line x1="12" y1="68" x2="36" y2="58" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 4" />
    <line x1="24" y1="80" x2="52" y2="68" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />

    {/* Dual Jet Afterburner Plumes */}
    <polygon points="50,60 14,76 34,54" fill="url(#sprintPlumeGrad)" />
    <polygon points="54,64 24,78 38,58" fill="#EF4444" />
    <polygon points="52,62 30,72 40,59" fill="#FEF08A" />

    {/* Supersonic Jet Fuselage Body */}
    <path
      d="M 122 24 C 105 32, 58 52, 44 60 L 58 68 C 78 60, 110 40, 122 24 Z"
      fill="url(#sprintJetBody)"
      stroke="#4F46E5"
      strokeWidth="2.2"
    />

    {/* Top Delta Wing */}
    <path d="M 80 44 L 62 24 L 74 27 L 92 40 Z" fill="#4338CA" stroke="#312E81" strokeWidth="1.2" />
    {/* Bottom Delta Wing */}
    <path d="M 70 54 L 50 75 L 60 78 L 80 58 Z" fill="#4F46E5" stroke="#312E81" strokeWidth="1.2" />

    {/* Cockpit Canopy */}
    <ellipse cx="102" cy="32" rx="8" ry="4" transform="rotate(-26 102 32)" fill="#818CF8" stroke="#312E81" strokeWidth="1.2" />
    <ellipse cx="103" cy="31" rx="4" ry="1.5" transform="rotate(-26 103 31)" fill="#FFFFFF" />

    {/* Supersonic Nose shock streaks */}
    <line x1="126" y1="21" x2="145" y2="13" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
    <line x1="118" y1="38" x2="136" y2="31" stroke="#C7D2FE" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" />
  </svg>
)

// Timeline 2: Ideal (Golden Ratio Precision Compass & Orbit)
export const IdealPaceIllustration = ({ className = 'w-full h-full' }: { className?: string }) => (
  <svg viewBox="0 0 160 100" className={className} fill="none">
    <defs>
      <radialGradient id="compassBgGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#EEF2FF" />
        <stop offset="100%" stopColor="#E0E7FF" />
      </radialGradient>
    </defs>

    {/* Celestial Orbit Ring */}
    <circle cx="80" cy="50" r="38" stroke="#C7D2FE" strokeWidth="1.5" strokeDasharray="4 3" />
    <circle cx="80" cy="50" r="32" fill="url(#compassBgGrad)" stroke="#4F46E5" strokeWidth="2.2" />
    <circle cx="80" cy="50" r="26" stroke="#818CF8" strokeWidth="1" strokeDasharray="2 2" />

    {/* Compass Cardinal Marks */}
    <line x1="80" y1="22" x2="80" y2="28" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="80" y1="72" x2="80" y2="78" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="52" y1="50" x2="58" y2="50" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="102" y1="50" x2="108" y2="50" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />

    {/* 3D Beveled North Needle (Ruby Red) */}
    <polygon points="80,26 87,46 80,43" fill="#EF4444" />
    <polygon points="80,26 73,46 80,43" fill="#DC2626" />
    {/* 3D Beveled South Needle (Deep Indigo) */}
    <polygon points="80,74 87,54 80,57" fill="#6366F1" />
    <polygon points="80,74 73,54 80,57" fill="#4338CA" />

    {/* Center Pivot Gem */}
    <circle cx="80" cy="50" r="5.5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="1.8" />
    <circle cx="80" cy="50" r="2" fill="#F59E0B" />

    {/* Golden Stars Orbiting */}
    <polygon points="122,26 124,31 129,31 125,34 127,39 122,36 117,39 119,34 115,31 120,31" fill="#F59E0B" />
    <circle cx="36" cy="70" r="2.5" fill="#818CF8" />
    <circle cx="132" cy="65" r="2" fill="#F59E0B" />
  </svg>
)

// Timeline 3: Santai (Coffee Mug by Cabin Airplane Window)
export const RelaxedPaceIllustration = ({ className = 'w-full h-full' }: { className?: string }) => (
  <svg viewBox="0 0 160 100" className={className} fill="none">
    <defs>
      <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="50%" stopColor="#FED7AA" />
        <stop offset="100%" stopColor="#E0E7FF" />
      </linearGradient>
    </defs>

    {/* Oval Cabin Airplane Window Bevel Frame */}
    <rect x="36" y="14" width="46" height="72" rx="23" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="3" />
    <rect x="42" y="20" width="34" height="60" rx="17" fill="url(#sunsetSky)" stroke="#94A3B8" strokeWidth="1.5" />

    {/* Sunset Cloud Layers in Window */}
    <ellipse cx="62" cy="56" rx="14" ry="7" fill="#FFFFFF" opacity="0.9" />
    <ellipse cx="50" cy="62" rx="10" ry="6" fill="#FEF08A" opacity="0.8" />
    <ellipse cx="68" cy="64" rx="12" ry="6" fill="#FDE68A" opacity="0.8" />
    <rect x="42" y="66" width="34" height="14" rx="3" fill="#FFFFFF" opacity="0.75" />

    {/* Foreground Table Tray */}
    <rect x="88" y="78" width="44" height="6" rx="3" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />

    {/* Ceramic Coffee Mug on Tray */}
    <rect x="92" y="48" width="30" height="30" rx="6" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2.2" />
    <path d="M 122 55 C 132 55, 134 67, 122 70" stroke="#4F46E5" strokeWidth="2.2" fill="none" />
    {/* Coffee liquid rim */}
    <ellipse cx="107" cy="52" rx="11" ry="3" fill="#4338CA" />

    {/* Rising Warm Steaming Curves */}
    <path d="M 100 42 Q 104 35 100 28 Q 96 21 100 14" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M 112 40 Q 116 33 112 26 Q 108 19 112 12" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)
