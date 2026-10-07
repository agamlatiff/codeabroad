import type { IllustrationProps } from '../types'

// Track 1: Backend Specialist (Go / Microservices, High Concurrency, DB)
export const BackendIllustration = ({ className = 'w-full h-full max-h-44 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 240 160" className={className} fill="none">
      {/* Server Rack Stack */}
      <rect x="65" y="32" width="110" height="28" rx="6" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" />
      <circle cx="80" cy="46" r="3" fill="#10B981" />
      <circle cx="90" cy="46" r="3" fill="#6366F1" />
      <line x1="105" y1="46" x2="160" y2="46" stroke="#C7D2FE" strokeWidth="3" strokeLinecap="round" />

      <rect x="65" y="66" width="110" height="28" rx="6" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" />
      <circle cx="80" cy="80" r="3" fill="#10B981" />
      <circle cx="90" cy="80" r="3" fill="#6366F1" />
      <line x1="105" y1="80" x2="148" y2="80" stroke="#C7D2FE" strokeWidth="3" strokeLinecap="round" />

      <rect x="65" y="100" width="110" height="28" rx="6" fill="#312E81" stroke="#4338CA" strokeWidth="2" />
      <circle cx="80" cy="114" r="3" fill="#34D399" />
      <circle cx="90" cy="114" r="3" fill="#818CF8" />
      <line x1="105" y1="114" x2="155" y2="114" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" />

      {/* Floating Database / API Node Accent */}
      <g transform="translate(178, 62)">
        <rect width="36" height="36" rx="10" fill="#4F46E5" />
        <path d="M11 18 H25 M18 11 V25" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  </div>
)

// Track 2: Frontend Specialist (React, TypeScript, Modern UI Architecture)
export const FrontendIllustration = ({ className = 'w-full h-full max-h-44 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 240 160" className={className} fill="none">
      {/* Modern Window Frame */}
      <rect x="55" y="28" width="130" height="102" rx="8" fill="#F8FAFC" stroke="#4F46E5" strokeWidth="2" />
      <path d="M55 48 H185" stroke="#C7D2FE" strokeWidth="2" />
      <circle cx="68" cy="38" r="2.5" fill="#EF4444" />
      <circle cx="76" cy="38" r="2.5" fill="#F59E0B" />
      <circle cx="84" cy="38" r="2.5" fill="#10B981" />

      {/* UI Elements Inside */}
      <rect x="68" y="58" width="34" height="42" rx="4" fill="#4F46E5" />
      <rect x="110" y="58" width="65" height="16" rx="4" fill="#818CF8" />
      <rect x="110" y="80" width="45" height="10" rx="3" fill="#C7D2FE" />
      <rect x="68" y="108" width="107" height="12" rx="3" fill="#EEF2FF" />

      {/* React Atom Symbol Accent */}
      <g transform="translate(162, 94)">
        <ellipse cx="14" cy="14" rx="14" ry="5.5" stroke="#4F46E5" strokeWidth="1.5" transform="rotate(30 14 14)" />
        <ellipse cx="14" cy="14" rx="14" ry="5.5" stroke="#4F46E5" strokeWidth="1.5" transform="rotate(90 14 14)" />
        <ellipse cx="14" cy="14" rx="14" ry="5.5" stroke="#4F46E5" strokeWidth="1.5" transform="rotate(150 14 14)" />
        <circle cx="14" cy="14" r="2.5" fill="#4F46E5" />
      </g>
    </svg>
  </div>
)

// Track 3: Fullstack Engineer (Client to Cloud Bridge)
export const FullstackIllustration = ({ className = 'w-full h-full max-h-44 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 240 160" className={className} fill="none">
      {/* Left Browser Client */}
      <rect x="42" y="44" width="65" height="72" rx="6" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" />
      <line x1="42" y1="58" x2="107" y2="58" stroke="#C7D2FE" strokeWidth="1.5" />
      <circle cx="50" cy="51" r="2" fill="#EF4444" />
      <circle cx="56" cy="51" r="2" fill="#10B981" />
      <rect x="50" y="66" width="49" height="14" rx="2" fill="#818CF8" />
      <rect x="50" y="86" width="35" height="8" rx="2" fill="#C7D2FE" />

      {/* Right Server / Cloud */}
      <rect x="133" y="44" width="65" height="72" rx="6" fill="#312E81" stroke="#4338CA" strokeWidth="2" />
      <circle cx="145" cy="60" r="3" fill="#34D399" />
      <circle cx="155" cy="60" r="3" fill="#818CF8" />
      <line x1="165" y1="60" x2="188" y2="60" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="145" cy="80" r="3" fill="#34D399" />
      <circle cx="155" cy="80" r="3" fill="#818CF8" />
      <line x1="165" y1="80" x2="188" y2="80" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="145" cy="100" r="3" fill="#34D399" />
      <circle cx="155" cy="100" r="3" fill="#818CF8" />
      <line x1="165" y1="100" x2="188" y2="100" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />

      {/* Interactive Sync Arrows in Middle */}
      <path d="M111 72 H129 M125 68 L129 72 L125 76" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M129 88 H111 M115 84 L111 88 L115 92" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
)

// Track 4: DevOps & Cloud (Docker Containers, Kubernetes Helm & CI/CD Pipeline)
export const DevOpsIllustration = ({ className = 'w-full h-full max-h-44 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 240 160" className={className} fill="none">
      {/* Cloud Outline */}
      <path
        d="M85 92 C 75 92 65 82 65 72 C 65 62 75 52 86 52 C 90 40 102 32 118 32 C 136 32 148 42 152 56 C 162 56 172 65 172 75 C 172 85 162 92 152 92 Z"
        fill="#EEF2FF"
        stroke="#4F46E5"
        strokeWidth="2"
      />

      {/* Docker / Container Blocks Stack */}
      <g transform="translate(88, 100)">
        <rect x="0" y="16" width="18" height="16" rx="2" fill="#4F46E5" />
        <rect x="22" y="16" width="18" height="16" rx="2" fill="#4338CA" />
        <rect x="44" y="16" width="18" height="16" rx="2" fill="#312E81" />
        <rect x="11" y="-2" width="18" height="16" rx="2" fill="#6366F1" />
        <rect x="33" y="-2" width="18" height="16" rx="2" fill="#818CF8" />
      </g>

      {/* CI/CD Infinity Flow Accent */}
      <path
        d="M100 64 C 92 56, 82 56, 82 64 C 82 72, 92 72, 100 64 C 108 56, 118 56, 118 64 C 118 72, 108 72, 100 64 Z"
        stroke="#4F46E5"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
)

// Track 5: Product Engineer (Product Sense, Fullstack Delivery, Modern UX & Growth)
export const ProductEngineerIllustration = ({ className = 'w-full h-full max-h-44 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 240 160" className={className} fill="none">
      {/* Product Dashboard Canvas */}
      <rect x="52" y="32" width="136" height="96" rx="8" fill="#F8FAFC" stroke="#4F46E5" strokeWidth="2" />
      <path d="M52 50 H188" stroke="#C7D2FE" strokeWidth="1.5" />
      <circle cx="64" cy="41" r="2.5" fill="#EF4444" />
      <circle cx="72" cy="41" r="2.5" fill="#F59E0B" />
      <circle cx="80" cy="41" r="2.5" fill="#10B981" />

      {/* Feature UI Card & Growth Metrics */}
      <rect x="64" y="60" width="50" height="32" rx="4" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />
      <rect x="70" y="66" width="38" height="6" rx="2" fill="#4F46E5" />
      <rect x="70" y="76" width="26" height="4" rx="2" fill="#818CF8" />

      {/* Metrics Chart Bars */}
      <rect x="124" y="78" width="10" height="38" rx="2" fill="#C7D2FE" />
      <rect x="140" y="66" width="10" height="50" rx="2" fill="#818CF8" />
      <rect x="156" y="56" width="10" height="60" rx="2" fill="#4F46E5" />

      {/* Product Spark / Rocket Accent */}
      <g transform="translate(170, 22)">
        <circle cx="16" cy="16" r="16" fill="#4F46E5" />
        <path d="M12 20 L16 12 L20 20 Z" fill="#FFFFFF" />
      </g>
    </svg>
  </div>
)

// Track 6: Solutions Architect (Enterprise System Design, Cloud Integration & Blueprints)
export const SolutionsArchitectIllustration = ({ className = 'w-full h-full max-h-44 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 240 160" className={className} fill="none">
      {/* Central Architecture Hub */}
      <rect x="96" y="60" width="48" height="40" rx="8" fill="#312E81" stroke="#4F46E5" strokeWidth="2" />
      <circle cx="120" cy="80" r="8" fill="#818CF8" />
      <circle cx="120" cy="80" r="4" fill="#FFFFFF" />

      {/* Left Node: Web & Gateway */}
      <rect x="42" y="36" width="36" height="30" rx="6" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="1.5" />
      <line x1="78" y1="51" x2="96" y2="70" stroke="#818CF8" strokeWidth="2" strokeDasharray="3 3" />

      {/* Right Node: Microservices & Data */}
      <rect x="162" y="36" width="36" height="30" rx="6" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="1.5" />
      <line x1="144" y1="70" x2="162" y2="51" stroke="#818CF8" strokeWidth="2" strokeDasharray="3 3" />

      {/* Bottom Node: Cloud Storage / DB */}
      <rect x="102" y="116" width="36" height="24" rx="6" fill="#F8FAFC" stroke="#4F46E5" strokeWidth="1.5" />
      <line x1="120" y1="100" x2="120" y2="116" stroke="#4F46E5" strokeWidth="2" />

      {/* Blueprint Grid Lines */}
      <circle cx="50" cy="115" r="3" fill="#C7D2FE" />
      <circle cx="190" cy="115" r="3" fill="#C7D2FE" />
      <line x1="53" y1="115" x2="102" y2="128" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="2 2" />
      <line x1="187" y1="115" x2="138" y2="128" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  </div>
)
