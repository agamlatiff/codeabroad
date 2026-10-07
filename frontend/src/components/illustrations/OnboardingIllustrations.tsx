import { useEffect, useRef, useState } from 'react'

// ── CODEABROAD CUSTOM BESPOKE ONBOARDING ILLUSTRATIONS ──
// Pure SVG React components on a standard 240x160 canvas.
// Styled to match CodeAbroad brand identity: Royal Indigo (#4F46E5 / #4338CA).

interface IllustrationProps {
  className?: string
}

// ─────────────────────────────────────────────────────────────
// 1. NATIONAL FLAGS (CRISP VECTOR FLAGS WITH SLEEK ELEVATION)
// ─────────────────────────────────────────────────────────────

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
        {/* Star helper dots in pentagon formation */}
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

// ─────────────────────────────────────────────────────────────
// 2. CAREER TRACK ILLUSTRATIONS
// ─────────────────────────────────────────────────────────────

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

// Mindset Track 1: Specialist Mindset (Deep Laser Focus)
export const SpecialistMindsetIllustration = ({ className = 'w-full h-full max-h-44 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 240 160" className={className} fill="none">
      <circle cx="120" cy="80" r="54" stroke="#EEF2FF" strokeWidth="8" />
      <circle cx="120" cy="80" r="42" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="120" cy="80" r="26" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2.5" />
      <circle cx="120" cy="80" r="12" fill="#4F46E5" />
      <line x1="120" y1="16" x2="120" y2="44" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="120" y1="116" x2="120" y2="144" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="80" x2="84" y2="80" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="156" y1="80" x2="184" y2="80" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M72 68 L60 80 L72 92" stroke="#4338CA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M168 68 L180 80 L168 92" stroke="#4338CA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
)

// Mindset Track 2: Generalist Mindset (Cross-Functional Ecosystem)
export const GeneralistMindsetIllustration = ({ className = 'w-full h-full max-h-44 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 240 160" className={className} fill="none">
      <ellipse cx="120" cy="80" rx="66" ry="24" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="4 4" transform="rotate(-20 120 80)" />
      <ellipse cx="120" cy="80" rx="66" ry="24" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="4 4" transform="rotate(40 120 80)" />
      <circle cx="120" cy="80" r="30" fill="#312E81" stroke="#4F46E5" strokeWidth="2.5" />
      <ellipse cx="120" cy="80" rx="14" ry="29" stroke="#818CF8" strokeWidth="1.5" />
      <line x1="91" y1="80" x2="149" y2="80" stroke="#818CF8" strokeWidth="1.5" />
      <circle cx="62" cy="52" r="10" fill="#4F46E5" />
      <circle cx="178" cy="58" r="10" fill="#10B981" />
      <circle cx="120" cy="132" r="10" fill="#F59E0B" />
      <line x1="71" y1="59" x2="98" y2="70" stroke="#818CF8" strokeWidth="2" />
      <line x1="169" y1="64" x2="143" y2="73" stroke="#818CF8" strokeWidth="2" />
      <line x1="120" y1="122" x2="120" y2="110" stroke="#818CF8" strokeWidth="2" />
    </svg>
  </div>
)

// ─────────────────────────────────────────────────────────────
// 3. READINESS LEVEL ILLUSTRATIONS (MAIN CARDS)
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// 4. LEVEL DETAIL BREAKDOWN ILLUSTRATIONS (WHEN SELECTED)
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// 5. OFFICIAL TECH LOGO SVGS (PURE VECTOR)
// ─────────────────────────────────────────────────────────────

// Go (Golang) Official Logo (Official Speed-streak GO Brandmark)
export const GoLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#00ADD8">
    <path d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047 0-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.082.082zm12.129-2.36c-.736.187-1.239.327-1.963.514-.176.046-.187.058-.34-.117-.174-.199-.303-.327-.548-.444-.737-.362-1.45-.257-2.115.175-.795.514-1.204 1.274-1.192 2.22.011.935.654 1.706 1.577 1.835.795.105 1.46-.175 1.987-.77.105-.13.198-.27.315-.434H10.47c-.245 0-.304-.152-.222-.35.152-.362.432-.97.596-1.274a.315.315 0 01.292-.187h4.253c-.023.316-.023.631-.07.947a4.983 4.983 0 01-.958 2.29c-.841 1.11-1.94 1.8-3.33 1.986-1.145.152-2.209-.07-3.143-.77-.865-.655-1.356-1.52-1.484-2.595-.152-1.274.222-2.419.993-3.424.83-1.086 1.928-1.776 3.272-2.02 1.098-.2 2.15-.07 3.096.571.62.41 1.063.97 1.356 1.648.07.105.023.164-.117.2m3.868 6.461c-1.064-.024-2.034-.328-2.852-1.029a3.665 3.665 0 01-1.262-2.255c-.21-1.32.152-2.489.947-3.529.853-1.122 1.881-1.706 3.272-1.95 1.192-.21 2.314-.095 3.33.595.923.63 1.496 1.484 1.648 2.605.198 1.578-.257 2.863-1.344 3.962-.771.783-1.718 1.273-2.805 1.495-.315.06-.63.07-.934.106zm2.78-4.72c-.011-.153-.011-.27-.034-.387-.21-1.157-1.274-1.81-2.384-1.554-1.087.245-1.788.935-2.045 2.033-.21.912.234 1.835 1.075 2.21.643.28 1.285.244 1.905-.07.923-.48 1.425-1.228 1.484-2.233z" />
  </svg>
)

// Java (Spring Boot) Official Coffee Cup Logo
export const JavaLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className={className}>
    <path fill="#0074BD" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"/>
    <path fill="#EA2D2E" d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"/>
    <path fill="#0074BD" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"/>
    <path fill="#EA2D2E" d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"/>
    <path fill="#0074BD" d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z"/>
  </svg>
)

// Node.js Official Isometric Hexagon Logo
export const NodeLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#5FA04E">
    <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z" />
  </svg>
)

// React Atom Logo
export const ReactLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="12" r="2.5" fill="#61DAFB" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(30 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(90 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(150 12 12)" />
  </svg>
)

// Vue.js Triangle Logo
export const VueLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path d="M2 3H6.5L12 12.5L17.5 3H22L12 20.5L2 3Z" fill="#41B883" />
    <path d="M6.5 3H10.5L12 5.8L13.5 3H17.5L12 12.5L6.5 3Z" fill="#35495E" />
  </svg>
)

// Svelte Official Logo
export const SvelteLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className={className}>
    <path d="M 110.43093,16.935847 C 98.552474,-0.076153 75.089104,-5.118154 58.130818,5.695846 l -29.793,19.000001 c -4.030441,2.529 -7.488786,5.871 -10.15468,9.814 -2.665895,3.943 -4.479469,8.399 -5.325138,13.083 a 25.478172,30.64 0 0 0 -0.572094,6.396 c 0.0183,5.831 1.446866,11.571 4.163485,16.729995 -2.546986,3.87201 -4.285721,8.22 -5.110602,12.78201 a 25.347621,30.483 0 0 0 0.345086,14.41199 c 1.072679,4.732998 3.078336,9.203998 5.900559,13.151998 11.877618,17.011 35.393374,22.053 52.299272,11.24 l 29.762238,-19.001 c 4.027946,-2.532 7.482126,-5.877998 10.141386,-9.824998 2.65841,-3.947 4.46282,-8.40699 5.29686,-13.093 0.3825,-2.107 0.57458,-4.244 0.5721,-6.386 -0.007,-5.81999 -1.41778,-11.550995 -4.11194,-16.708995 2.54616,-3.869 4.28489,-8.213 5.11143,-12.771 0.36921,-2.109 0.55713,-4.245 0.56212,-6.386 0.002,-7.595 -2.37152,-15 -6.78697,-21.178 z" fill="#ff3e00" />
    <path d="m 55.218941,112.66204 a 28.463375,34.23 0 0 1 -5.953776,0.76 c -3.820895,0.001 -7.585244,-0.925 -10.970416,-2.7 -3.384341,-1.774 -6.288887,-4.343 -8.464177,-7.487 -2.655917,-3.716 -4.082827,-8.171 -4.080332,-12.74 a 15.657767,18.83 0 0 1 0.332613,-3.833 15.424937,18.55 0 0 1 0.719276,-2.782 l 0.562116,-1.708 1.51921,1.156 c 3.528195,2.591 7.470493,4.564 11.658097,5.834 l 1.104275,0.333 -0.103941,1.104 v 0.573 c -0.0025,1.381 0.427408,2.73 1.228174,3.854 0.646933,0.958 1.51838,1.744 2.537839,2.288 a 8.2621121,9.936 0 0 0 3.311997,0.837 8.2513022,9.923 0 0 0 1.79029,-0.229 7.2717563,8.745 0 0 0 1.832699,-0.802 l 29.760566,-19.094 c 0.892236,-0.566 1.627311,-1.349 2.135377,-2.276 0.507236,-0.927 0.771662,-1.968 0.768337,-3.026 -0.0084,-1.381 -0.449027,-2.725 -1.259773,-3.844 -0.656912,-0.946 -1.533347,-1.718 -2.553637,-2.252 a 8.3128357,9.997 0 0 0 -3.307008,-0.81 8.246313,9.917 0 0 0 -1.79029,0.23 6.9383115,8.344 0 0 0 -1.821058,0.801 l -11.346268,7.25 a 24.375558,29.314 0 0 1 -6.04774,2.656 c -1.945787,0.502 -3.945624,0.758 -5.954608,0.76 -3.820063,0 -7.582749,-0.926 -10.967089,-2.698 -3.384341,-1.772 -6.289718,-4.338 -8.467502,-7.478 -2.652591,-3.718 -4.079502,-8.172 -4.080334,-12.74 0.0016,-1.285 0.113089,-2.567 0.332615,-3.833 0.509728,-2.816 1.597374,-5.495 3.196411,-7.867 1.598207,-2.373 3.67205,-4.387 6.089317,-5.914 l 29.792168,-18.99 c 1.869286,-1.19 3.908205,-2.09 6.04774,-2.667 1.945787,-0.499 3.945625,-0.75 5.953776,-0.75 3.82921,-0.01 7.603538,0.91 10.999519,2.681 3.395981,1.77 6.311338,4.34 8.497439,7.486 2.636787,3.727 4.045417,8.184 4.028777,12.75 a 15.748404,18.939 0 0 1 -0.33344,3.844 15.407475,18.529 0 0 1 -0.71845,2.781 l -0.56211,1.708 -1.519216,-1.114 c -3.525699,-2.595 -7.468833,-4.568 -11.658096,-5.834 l -1.104275,-0.343 0.103941,-1.105 v -0.572 c 0,-1.385 -0.429072,-2.735 -1.228174,-3.865 -0.65608,-0.945 -1.530022,-1.716 -2.549481,-2.25 a 8.3086779,9.992 0 0 0 -3.301186,-0.813 8.2213671,9.887 0 0 0 -1.768671,0.271 6.8185708,8.2 0 0 0 -1.831867,0.802 l -29.792165,18.99 a 5.8797701,7.071 0 0 0 -1.836857,1.79 4.7505482,5.713 0 0 0 -0.962914,2.377 5.0365955,6.057 0 0 0 -0.135541,1.104 c -8.31e-4,1.378 0.42824,2.722 1.228174,3.844 0.655248,0.945 1.530021,1.717 2.548649,2.25 a 8.2986996,9.98 0 0 0 3.301186,0.812 8.2471446,9.918 0 0 0 1.79029,-0.23 6.9433007,8.35 0 0 0 1.832699,-0.801 l 11.367057,-7.292 a 24.218399,29.125 0 0 1 6.04774,-2.656 28.52574,34.305 0 0 1 5.953776,-0.76 c 3.821727,0 7.586076,0.925 10.972078,2.697 3.386003,1.772 6.293877,4.339 8.473325,7.48 2.652591,3.717 4.079498,8.171 4.080338,12.74 0.003,1.299 -0.11226,2.596 -0.34343,3.874 -0.506403,2.817 -1.594046,5.497 -3.192254,7.87 -1.599037,2.372 -3.673715,4.385 -6.093476,5.911 l -29.739779,18.99 a 24.308205,29.233 0 0 1 -6.057719,2.667 z" fill="#ffffff" />
  </svg>
)

// Docker Whale Logo
export const DockerLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className={className}>
    <path fill="#2496ED" d="M110.4 55.1c.8-5.9-3.6-10.5-6.4-12.7-3.1 3.6-3.6 13.2 1.3 17.2-2.8 2.4-8.5 4.7-14.5 4.7H18.6c-.6 6.2.5 11.9 3 16.8l.8 1.5c.5.9 1.1 1.7 1.7 2.6 3 .2 5.7.3 8.2.2 4.9-.1 8.9-.7 12-1.7.5-.2.9.1 1.1.5.2.5-.1.9-.5 1.1-.4.1-.8.3-1.3.4-2.4.7-5 1.1-8.3 1.3h-.6c-1.3.1-2.7.1-4.2.1-1.6 0-3.1 0-4.9-.1 6 6.8 15.4 10.8 27.2 10.8 25 0 46.2-11.1 55.5-35.9 6.7.7 13.1-1 16-6.7-4.5-2.7-10.5-1.8-13.9-.1z"/>
    <path fill="#2496ED" d="M28.4 52.7h9.8v9.8h-9.8v-9.8zm11.2 0h9.8v9.8h-9.8v-9.8zm11.3 0h9.8v9.8h-9.8v-9.8zm11.3 0h9.8v9.8h-9.8v-9.8zm11.3 0h9.8v9.8h-9.8v-9.8z"/>
    <path fill="#2496ED" d="M39.6 41.5h9.8v9.8h-9.8v-9.8zm11.3 0h9.8v9.8h-9.8v-9.8zm11.3 0h9.8v9.8h-9.8v-9.8zm0-11.3h9.8v9.8h-9.8v-9.8z"/>
  </svg>
)

// Kubernetes (K8s) Official Heptagon Helm Logo
export const K8sLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className={className}>
    <path fill="#326ce5" d="M63.556 1.911a8.51 8.44 0 0 0-3.26.826L15.794 24a8.51 8.44 0 0 0-4.603 5.725L.214 77.484a8.51 8.44 0 0 0 1.154 6.47 8.51 8.44 0 0 0 .485.673l30.799 38.297a8.51 8.44 0 0 0 6.654 3.175l49.393-.011a8.51 8.44 0 0 0 6.654-3.17l30.79-38.303a8.51 8.44 0 0 0 1.644-7.14l-10.996-47.76a8.51 8.44 0 0 0-4.604-5.727L67.681 2.738a8.51 8.44 0 0 0-4.125-.827Zm.44 16.252c1.47 0 2.664 1.327 2.664 2.961 0 .232.014.544.006.758-.034.943-.24 1.662-.364 2.531-.224 1.858-.417 3.4-.3 4.832.105.717.522 1 .869 1.332a63.624 63.624 0 0 0 .062 1.19c8.468.751 16.335 4.625 22.112 10.682l1.011-.723c.343.021 1.1.124 1.618-.176 1.19-.802 2.276-1.915 3.59-3.25.601-.638 1.044-1.245 1.76-1.861.162-.14.409-.328.59-.473 1.278-1.018 3.057-.912 3.974.238.917 1.15.622 2.908-.655 3.928-.18.145-.416.346-.588.473-.758.56-1.456.846-2.212 1.29-1.593.984-2.913 1.8-3.961 2.784-.494.53-.457 1.03-.5 1.508-.148.136-.67.598-.946.848a34.478 34.478 0 0 1 4.99 11.537 34.398 34.398 0 0 1 .56 12.435l1.073.313c.194.274.592.94 1.15 1.156 1.372.431 2.914.59 4.776.785.875.073 1.628.03 2.555.205.222.042.545.13.773.182 1.57.379 2.578 1.822 2.254 3.244-.324 1.422-1.857 2.286-3.437 1.946l-.04-.006c-.016-.004-.033-.012-.05-.016-.221-.048-.497-.098-.69-.148-.91-.245-1.57-.61-2.388-.922-1.763-.632-3.224-1.16-4.647-1.366-.72-.058-1.09.287-1.49.551a39.835 39.835 0 0 0-1.139-.199c-2.552 8.02-7.985 14.966-15.353 19.317.127.306.342.958.443 1.074-.17.449-.421.88-.205 1.572.517 1.34 1.354 2.652 2.363 4.229.488.728.988 1.288 1.428 2.122.105.2.244.507.346.717.685 1.465.183 3.151-1.131 3.785-1.326.639-2.974-.037-3.684-1.51-.1-.208-.244-.485-.33-.683-.377-.864-.507-1.604-.773-2.44-.604-1.772-1.102-3.24-1.827-4.48-.406-.6-.903-.676-1.359-.824-.085-.146-.4-.724-.57-1.024a34.56 34.56 0 0 1-4.57 1.377 34.413 34.413 0 0 1-20.01-1.44l-.604 1.09c-.449.12-.882.244-1.148.561-.97 1.157-1.356 3.016-2.061 4.786-.265.836-.393 1.577-.77 2.441-.086.196-.229.468-.33.676v.008l-.006.006c-.71 1.468-2.352 2.139-3.675 1.502-1.315-.633-1.818-2.32-1.133-3.785.102-.211.236-.517.342-.717.44-.834.94-1.398 1.427-2.127 1.008-1.578 1.895-2.994 2.413-4.334.13-.446-.063-1.057-.237-1.508l.483-1.159c-7.09-4.2-12.688-10.897-15.36-19.181l-1.162.199c-.31-.174-.937-.586-1.531-.539-1.422.206-2.88.733-4.643 1.365-.82.314-1.48.672-2.39.916-.193.052-.47.105-.69.154-.017.004-.034.014-.05.018l-.04.004c-1.58.341-3.112-.523-3.437-1.945-.325-1.422.684-2.865 2.254-3.245l.039-.011.021-.006c.224-.052.51-.125.713-.164.927-.175 1.68-.132 2.555-.205 1.862-.195 3.405-.354 4.775-.785.434-.18.85-.775 1.145-1.155l1.115-.326c-1.25-8.655.864-17.15 5.434-24.027l-.852-.762c-.055-.333-.127-1.101-.537-1.537-1.047-.983-2.366-1.8-3.959-2.783-.756-.445-1.449-.733-2.209-1.293-.16-.12-.376-.3-.55-.444l-.042-.027c-1.278-1.019-1.571-2.778-.654-3.928.516-.647 1.304-.967 2.123-.94a3.168 3.168 0 0 1 1.854.702c.182.143.431.333.593.473.715.614 1.15 1.221 1.752 1.859 1.314 1.334 2.4 2.442 3.592 3.244.626.364 1.107.218 1.582.154.153.113.667.483.961.684a34.262 34.262 0 0 1 17.404-9.943 34.663 34.663 0 0 1 4.815-.74l.062-1.128c.355-.344.753-.837.866-1.377.116-1.43-.073-2.974-.297-4.832-.124-.869-.329-1.588-.364-2.53-.007-.194.004-.462.006-.684 0-.025-.006-.05-.006-.075 0-1.634 1.193-2.959 2.663-2.959z"/>
  </svg>
)

// Dual Logos for Fullstack and DevOps
export const ReactGolangLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-1.5 ${className}`}>
    <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center p-1">
      <ReactLogo className="w-full h-full" />
    </div>
    <span className="text-slate-400 font-extrabold text-xs">+</span>
    <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center p-1">
      <GoLogo className="w-full h-full" />
    </div>
  </div>
)

export const ReactNodeLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-1.5 ${className}`}>
    <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center p-1">
      <ReactLogo className="w-full h-full" />
    </div>
    <span className="text-slate-400 font-extrabold text-xs">+</span>
    <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center p-1">
      <NodeLogo className="w-full h-full" />
    </div>
  </div>
)

export const AWSLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg viewBox="0 0 100 65" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 'a' */}
    <path
      d="M27.5 35.5c-1.2 1.3-2.9 2-4.9 2-3.8 0-6.1-2.4-6.1-6.1 0-4.1 2.9-6.3 7.8-6.6l3.2-.2v-1.6c0-2.2-1.3-3.5-3.8-3.5-2.2 0-3.6.9-4.1 2.6l-3.9-1.2c1-3.2 3.8-4.9 8.2-4.9 5.2 0 7.8 2.8 7.8 7.2v14.1h-3.9l-.3-1.8zm-.3-5.7l-2.6.2c-2.9.2-4.3 1.3-4.3 3.3 0 1.9 1.3 3.1 3.3 3.1 2.3 0 3.6-1.4 3.6-3.8v-2.8z"
      fill="#232F3E"
    />
    {/* 'w' */}
    <path
      d="M51.8 16.5l-4.5 17-4.2-15.1h-4.2l-4.2 15.1-4.5-17h-4.4l6.5 22.4h4.4l4.2-14.7 4.2 14.7h4.4l6.5-22.4h-4.4z"
      fill="#232F3E"
    />
    {/* 's' */}
    <path
      d="M66.4 22.8c-1.3-.8-2.9-1.3-4.6-1.3-2.3 0-3.6.9-3.6 2.2 0 1.3 1.1 2 3.6 2.7l2.8.8c4.2 1.2 6.1 3.2 6.1 6.8 0 4.5-3.6 7.4-8.9 7.4-3.5 0-6.3-1.1-8-3l2.3-3.2c1.4 1.5 3.5 2.5 5.8 2.5 2.8 0 4.4-1.2 4.4-2.7 0-1.4-1.2-2.2-3.8-3l-2.8-.8c-4-1.2-5.7-3.2-5.7-6.5 0-4.3 3.4-6.9 8.3-6.9 3.2 0 5.6.9 7.2 2.3l-2.1 3.2z"
      fill="#232F3E"
    />
    {/* Arrow Smile */}
    <path
      d="M74.8 45.2c-15.5 10.8-38 12.2-55.8 4.2-.6-.3-.7-1-.1-1.4.6-.4 1.5-.2 2.1.1 16.6 7.5 37.6 6.3 52.3-3.6.8-.5 1.8.2 1.5.7z"
      fill="#FF9900"
    />
    {/* Arrowhead */}
    <path
      d="M78.6 42.4l-4.9-5.1c-.4-.4-1.1-.2-1.2.4l-.5 3.5-3.4-1.1c-.5-.2-1 .3-.8.8l2.6 6.5c.3.7 1.2.9 1.8.4l6.1-4.3c.5-.4.4-1.1-.1-1.2z"
      fill="#FF9900"
    />
  </svg>
)

export const GCPLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M62.9 31.5h.3l-.2-.2 10.9-10.9v-.2C64.7 12.1 52 9.3 40.2 12.8 28.5 16.3 19.4 25.6 16.2 37.5c.2-.1.4-.2.6-.2 4.1-2.7 8.9-4.2 14-4.2 1.7 0 3.4.2 5 .5.1-.1.2-.1.2-.1 7-7.7 18.9-8.7 27-.2h-.3z"
      fill="#EA4335"
    />
    <path
      d="M84.5 37.3c-1.8-6.6-5.5-12.7-10.8-17.3l-11.2 11.2c4.7 3.8 7.4 9.6 7.3 15.6v2c13.2 0 13.2 19.7 0 19.7H49.9v15.6h19.8c11.4.1 21.5-7.3 24.8-18 3.4-10.8-.8-22.5-10-28.8z"
      fill="#4285F4"
    />
    <path
      d="M30.3 68.5c-4.1 0-8.1-1.6-11-4.5-3.6-3.4-5.5-8.3-5.2-13.3.2-4.1 2.1-8 5.2-10.8-2 5.8-2 12.2.2 18 2.2 5.8 6.4 10.5 11.9 13.4l-1.1-2.8z"
      fill="#FBBC05"
    />
    <path
      d="M49.9 84.1v-15.6H30.3c-5.5 0-9.8-4.4-9.8-9.8 0-2.7 1.1-5.3 3.1-7.3-3.9-2.6-6.8-6.6-8-11.2-.8 3.9-1.3 7.8-.6 12.6 1.3 9.1 6.8 17 14.8 21.5 7 4 15.1 5.9 22.7 5.9v-2.3l-2.6 6.2z"
      fill="#34A853"
    />
  </svg>
)

export const TerraformLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="6.6,6.6 44,28.2 44,71.4 6.6,49.8" fill="#844FBA" />
    <polygon points="47,30 84.4,51.6 84.4,94.8 47,73.2" fill="#663EB4" />
    <polygon points="47,76.5 84.4,98.1 84.4,121.4 47,99.8" fill="#5C319E" />
    <polygon points="87.4,6.6 124.8,28.2 124.8,71.4 87.4,49.8" fill="#844FBA" />
  </svg>
)

// Helper component that selects appropriate Tech SVG by slug
export const TechIcon = ({ slug, className = 'w-6 h-6' }: { slug: string; className?: string }) => {
  switch (slug) {
    case 'golang':
      return <GoLogo className={className} />
    case 'java':
      return <JavaLogo className={className} />
    case 'node':
      return <NodeLogo className={className} />
    case 'react':
      return <ReactLogo className={className} />
    case 'react_golang':
      return <ReactGolangLogo className={className} />
    case 'react_node':
      return <ReactNodeLogo className={className} />
    case 'vue':
      return <VueLogo className={className} />
    case 'svelte':
      return <SvelteLogo className={className} />
    case 'devops_aws':
    case 'devops_cloud':
    case 'aws':
      return <AWSLogo className={className} />
    case 'devops_gcp':
    case 'gcp':
      return <GCPLogo className={className} />
    case 'devops_terraform':
    case 'terraform':
      return <TerraformLogo className={className} />
    default:
      return <GoLogo className={className} />
  }
}

// ─────────────────────────────────────────────────────────────
// 5. VISUAL FLIGHT ROADMAP GRAPHIC (JAKARTA ➔ DESTINATION)
// ─────────────────────────────────────────────────────────────
interface FlightRoadmapGraphicProps {
  timeline?: '6_months' | '1_year' | 'exploring'
  countryCode?: string
  className?: string
  isLanding?: boolean
}

export const FlightRoadmapGraphic = ({
  countryCode = 'JP',
  className = 'w-full h-auto',
  isLanding = false,
}: FlightRoadmapGraphicProps) => {
  const isJapan = countryCode.toUpperCase() === 'JP'
  const isGermany = countryCode.toUpperCase() === 'DE'
  const destAirport = isJapan ? 'NRT' : isGermany ? 'BER' : 'SIN'
  const destCity = isJapan ? 'Tokyo' : isGermany ? 'Berlin' : 'Singapore'
  const destCountry = isJapan ? 'Japan' : isGermany ? 'Germany' : 'Singapore'

  const flightPathD = 'M 95 160 C 180 50, 240 160, 360 85 C 460 20, 580 55, 705 145'

  const pathRef = useRef<SVGPathElement | null>(null)
  const planeRef = useRef<SVGGElement | null>(null)
  const activeTrailRef = useRef<SVGPathElement | null>(null)
  const [hasLanded, setHasLanded] = useState(false)
  // Track last transform string so React reconciliation does not snap the plane back
  const lastTransformRef = useRef<string>('translate(95, 160) rotate(-52)')

  // Seamless Path-Following Flight Engine
  useEffect(() => {
    const path = pathRef.current
    const plane = planeRef.current
    if (!path || !plane) return

    const totalLength = path.getTotalLength()

    if (activeTrailRef.current) {
      activeTrailRef.current.style.strokeDasharray = `${totalLength}`
    }

    const setPlaneAtDistance = (dist: number) => {
      const p = path.getPointAtLength(dist)
      // Centered difference avoids tangent collapse and flat snapping at dist = 0 or dist = totalLength
      const delta = 1.5
      const pBefore = path.getPointAtLength(Math.max(0, dist - delta))
      const pAfter = path.getPointAtLength(Math.min(totalLength, dist + delta))
      const angle = Math.atan2(pAfter.y - pBefore.y, pAfter.x - pBefore.x) * (180 / Math.PI)
      
      const transformStr = `translate(${p.x}, ${p.y}) rotate(${angle})`
      lastTransformRef.current = transformStr
      plane.setAttribute('transform', transformStr)

      if (activeTrailRef.current) {
        activeTrailRef.current.style.strokeDashoffset = `${totalLength - dist}`
      }
    }

    // While not landing: plane remains 100% grounded at Jakarta runway (dist = 0)
    if (!isLanding) {
      setHasLanded(false)
      setPlaneAtDistance(0)
      return
    }

    // While isLanding is active: cinematic 1.45s smooth S-curve flight with easeInOutCubic
    let animId: number
    const duration = 1450
    const startTime = performance.now()

    const animateFlight = (now: number) => {
      const elapsed = now - startTime
      const rawProgress = Math.min(elapsed / duration, 1)

      // Cinematic easeInOutCubic easing
      const ease =
        rawProgress < 0.5
          ? 4 * rawProgress * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2

      const currentDist = ease * totalLength
      setPlaneAtDistance(currentDist)

      if (rawProgress < 1) {
        animId = requestAnimationFrame(animateFlight)
      } else {
        setHasLanded(true)
      }
    }

    animId = requestAnimationFrame(animateFlight)
    return () => cancelAnimationFrame(animId)
  }, [isLanding])

  return (
    <div className="w-full flex items-center justify-center select-none overflow-hidden py-1">
      <svg viewBox="0 0 820 230" className={className} fill="none">
        <defs>
          {/* Sky Atmospheric Gradient */}
          <linearGradient id="scenicSkyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.7" />
            <stop offset="35%" stopColor="#F8FAFC" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#EEF2FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FAF5FF" stopOpacity="0.75" />
          </linearGradient>

          {/* Flight Path Active Ribbon */}
          <linearGradient id="scenicFlightGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="45%" stopColor="#6366F1" />
            <stop offset="80%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>

          {/* Monas Golden Flame Radial */}
          <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="monasGoldFlame" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="45%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>

          {/* Wisma 46 Blue Glass Tower */}
          <linearGradient id="wismaGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* Mt Fuji Twilight Gradient */}
          <linearGradient id="fujiTwilightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0E7FF" />
            <stop offset="60%" stopColor="#C7D2FE" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>

          {/* Airplane Jet Contrail */}
          <linearGradient id="contrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.5" />
          </linearGradient>

          {/* Airplane Elevation Drop Shadow */}
          <filter id="planeShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3.5" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* ── SKY ATMOSPHERE BACKDROP ── */}
        <rect x="15" y="15" width="790" height="180" rx="20" fill="url(#scenicSkyGrad)" />

        {/* ── BASELINE HORIZON LINE ── */}
        <line x1="25" y1="195" x2="795" y2="195" stroke="#E2E8F0" strokeWidth="1.5" />

        {/* ══════════════════════════════════════════════════════════════
            SISI KIRI: JAKARTA (WARM GOLDEN SUNSET & SUDIRMAN SKYLINE)
            ══════════════════════════════════════════════════════════════ */}
        <g id="jakarta-landmarks">
          {/* Warm Jakarta Sunset Ambient Halo */}
          <circle cx="85" cy="115" r="55" fill="url(#flameGlow)" opacity="0.35" />

          {/* Sudirman High-Rise Tower 1 (Latar Kiri) */}
          <rect x="25" y="130" width="24" height="65" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="31" y1="140" x2="43" y2="140" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="31" y1="152" x2="43" y2="152" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="31" y1="164" x2="43" y2="164" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="31" y1="176" x2="43" y2="176" stroke="#E2E8F0" strokeWidth="1" />

          {/* Sudirman Modern High-Rise Tower 2 */}
          <rect x="42" y="112" width="22" height="83" rx="2" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
          <line x1="48" y1="124" x2="58" y2="124" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="48" y1="138" x2="58" y2="138" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="48" y1="152" x2="58" y2="152" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="48" y1="166" x2="58" y2="166" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="48" y1="180" x2="58" y2="180" stroke="#CBD5E1" strokeWidth="1" />

          {/* Wisma 46 (BNI City) - Ikon Sailboat Sudirman */}
          <path d="M 125 195 V 98 C 125 98, 140 82, 158 78 V 195 Z" fill="url(#wismaGlassGrad)" opacity="0.85" />
          <path d="M 125 195 V 98 C 125 98, 140 82, 158 78 V 195 Z" fill="none" stroke="#0284C7" strokeWidth="1.2" />
          {/* Glass Louver Lines */}
          <line x1="132" y1="110" x2="150" y2="106" stroke="#BAE6FD" strokeWidth="1" opacity="0.8" />
          <line x1="132" y1="125" x2="152" y2="121" stroke="#BAE6FD" strokeWidth="1" opacity="0.8" />
          <line x1="132" y1="140" x2="152" y2="136" stroke="#BAE6FD" strokeWidth="1" opacity="0.8" />
          <line x1="132" y1="155" x2="152" y2="151" stroke="#BAE6FD" strokeWidth="1" opacity="0.8" />
          <line x1="132" y1="170" x2="152" y2="166" stroke="#BAE6FD" strokeWidth="1" opacity="0.8" />

          {/* MONUMEN NASIONAL (MONAS) */}
          {/* Base Plinth */}
          <rect x="64" y="185" width="42" height="10" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
          {/* Cawan Megah Monas */}
          <path d="M 58 185 L 70 162 H 100 L 112 185 Z" fill="#F8FAFC" stroke="#475569" strokeWidth="1.5" />
          <rect x="72" y="160" width="26" height="3" fill="#CBD5E1" />
          {/* Obelisk Tubuh Menara */}
          <path d="M 80 160 L 82.5 75 H 87.5 L 90 160 Z" fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
          <line x1="85" y1="75" x2="85" y2="160" stroke="#94A3B8" strokeWidth="1" />
          {/* Pelataran Puncak (Viewing Platform) */}
          <rect x="80" y="71" width="10" height="4" rx="1" fill="#E2E8F0" stroke="#475569" strokeWidth="1" />
          {/* Lidah Api Emas Kemerdekaan */}
          <path d="M 83 71 C 79 58, 83 50, 85 40 C 87 49, 91 58, 87 71 Z" fill="url(#monasGoldFlame)" stroke="#D97706" strokeWidth="1" />

          {/* Jakarta Departure Beacon Node */}
          <circle cx="95" cy="160" r="5" fill="#4F46E5" />
          <circle cx="95" cy="160" r="10" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.75" />

          {/* Typography Label */}
          <text x="95" y="210" fill="#0F172A" fontSize="12" fontWeight="800" textAnchor="middle" letterSpacing="0.05em">
            CGK
          </text>
          <text x="95" y="222" fill="#64748B" fontSize="9.5" fontWeight="600" textAnchor="middle">
            Jakarta, ID
          </text>
        </g>

        {/* ══════════════════════════════════════════════════════════════
            SISI KANAN: DESTINASI (TOKYO / BERLIN / SINGAPORE)
            ══════════════════════════════════════════════════════════════ */}
        <g id="destination-landmarks">
          {isJapan && (
            <>
              {/* GUNUNG FUJI - Twilight Japanese Silhouette */}
              <path
                d="M 590 195 C 640 192, 675 82, 690 72 C 705 82, 740 192, 790 195 Z"
                fill="url(#fujiTwilightGrad)"
                stroke="#A5B4FC"
                strokeWidth="1.2"
              />
              {/* Tudung Salju Ikonik Fuji (Snowcap Summit) */}
              <path
                d="M 672 98 C 680 84, 686 76, 690 76 C 694 76, 700 84, 708 98 L 700 108 L 690 102 L 680 108 Z"
                fill="#FFFFFF"
                stroke="#818CF8"
                strokeWidth="1.2"
              />

              {/* Shinjuku Modern Glass Towers */}
              <rect x="735" y="125" width="26" height="70" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="741" y1="138" x2="755" y2="138" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="741" y1="152" x2="755" y2="152" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="741" y1="166" x2="755" y2="166" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="741" y1="180" x2="755" y2="180" stroke="#CBD5E1" strokeWidth="1" />

              {/* TOKYO TOWER CRIMSON AUTENTIK (Red Lattice & Observation Decks) */}
              {/* Kaki Melengkung Parabolik */}
              <path d="M 625 195 C 631 170, 638 138, 641 112 H 651 C 654 138, 661 170, 667 195" fill="none" stroke="#EF4444" strokeWidth="2.2" />
              <path d="M 631 195 Q 646 168 661 195" stroke="#EF4444" strokeWidth="1.5" fill="none" />
              {/* Struktur Kisi-Kisi Diagonal */}
              <line x1="629" y1="175" x2="663" y2="175" stroke="#EF4444" strokeWidth="1.2" />
              <line x1="629" y1="175" x2="659" y2="152" stroke="#EF4444" strokeWidth="1" />
              <line x1="663" y1="175" x2="633" y2="152" stroke="#EF4444" strokeWidth="1" />
              <line x1="634" y1="152" x2="658" y2="152" stroke="#FFFFFF" strokeWidth="2" />
              <line x1="636" y1="132" x2="656" y2="132" stroke="#EF4444" strokeWidth="1.2" />
              {/* Main Observatory (Dek Observasi Bawah) */}
              <rect x="637" y="108" width="18" height="8" rx="1.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
              <line x1="639" y1="112" x2="653" y2="112" stroke="#F8FAFC" strokeWidth="1" />
              {/* Batang Menara Atas & Band Putih */}
              <path d="M 642 108 L 644 64 H 648 L 650 108 Z" fill="#EF4444" />
              <rect x="643.5" y="78" width="5" height="12" fill="#FFFFFF" />
              {/* Top Deck Pod */}
              <rect x="643.5" y="60" width="5" height="4" rx="1" fill="#1E293B" />
              {/* Antena Spire & Red Beacon Light */}
              <line x1="646" y1="60" x2="646" y2="38" stroke="#EF4444" strokeWidth="1.8" />
              <circle cx="646" cy="38" r="2.5" fill="#EF4444" />
              <circle cx="646" cy="38" r="6" stroke="#EF4444" strokeWidth="1" opacity="0.4" />
            </>
          )}

          {isGermany && (
            <>
              {/* Berlin TV Tower & Brandenburg Gate */}
              <line x1="620" y1="195" x2="620" y2="45" stroke="#94A3B8" strokeWidth="1.8" />
              <circle cx="620" cy="85" r="9" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
              <rect x="650" y="155" width="75" height="40" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="662" y1="160" x2="662" y2="195" stroke="#94A3B8" strokeWidth="2" />
              <line x1="675" y1="160" x2="675" y2="195" stroke="#94A3B8" strokeWidth="2" />
              <line x1="688" y1="160" x2="688" y2="195" stroke="#94A3B8" strokeWidth="2" />
              <line x1="701" y1="160" x2="701" y2="195" stroke="#94A3B8" strokeWidth="2" />
              <line x1="714" y1="160" x2="714" y2="195" stroke="#94A3B8" strokeWidth="2" />
            </>
          )}

          {!isJapan && !isGermany && (
            <>
              {/* Singapore Marina Bay Sands */}
              <rect x="640" y="130" width="16" height="65" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="664" y="125" width="16" height="70" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="688" y="130" width="16" height="65" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
              <path d="M 632 125 C 660 115, 700 115, 725 125 Z" fill="#1E293B" />
            </>
          )}

          {/* Destination Touchdown Beacon Node */}
          <circle cx="705" cy="145" r="5" fill="#0F172A" />
          <circle
            cx="705"
            cy="145"
            r={hasLanded ? 18 : 10}
            stroke="#4F46E5"
            strokeWidth={hasLanded ? 2.5 : 1.5}
            strokeDasharray={hasLanded ? 'none' : '3 2'}
            className="transition-all duration-700"
            opacity={hasLanded ? 0.95 : 0.65}
          />

          {/* Typography Label */}
          <text x="705" y="210" fill="#0F172A" fontSize="12" fontWeight="800" textAnchor="middle" letterSpacing="0.05em">
            {destAirport}
          </text>
          <text x="705" y="222" fill="#64748B" fontSize="9.5" fontWeight="600" textAnchor="middle">
            {destCity}, {destCountry === 'Japan' ? 'JP' : destCountry === 'Germany' ? 'DE' : 'SG'}
          </text>
        </g>

        {/* ══════════════════════════════════════════════════════════════
            SCENIC S-CURVE FLIGHT CORRIDOR (RUTE BERKELOK PANJANG)
            ══════════════════════════════════════════════════════════════ */}
        {/* Soft Ambient Airway Guidance Ribbon */}
        <path
          d={flightPathD}
          stroke="#EEF2FF"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Active Trajectory Dashed Path */}
        <path
          ref={pathRef}
          d={flightPathD}
          stroke="url(#scenicFlightGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="6 6"
        />

        {/* Real-time Glowing Flight Progress Trail */}
        <path
          ref={activeTrailRef}
          d={flightPathD}
          stroke="#4F46E5"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          style={{ transition: 'none' }}
        />

        {/* ── INTERMEDIATE SCENIC WAYPOINT MARKERS ── */}
        <g transform="translate(260, 115)">
          <circle cx="0" cy="0" r="3.5" fill="#818CF8" />
          <circle cx="0" cy="0" r="7" stroke="#C7D2FE" strokeWidth="1" strokeDasharray="2 2" />
        </g>
        <g transform="translate(480, 42)">
          <circle cx="0" cy="0" r="3.5" fill="#818CF8" />
          <circle cx="0" cy="0" r="7" stroke="#C7D2FE" strokeWidth="1" strokeDasharray="2 2" />
        </g>

        {/* ══════════════════════════════════════════════════════════════
            AIRLINER VECTOR: LIQUID-SMOOTH S-CURVE FLIGHT ENGINE
            ══════════════════════════════════════════════════════════════ */}
        <g
          ref={planeRef}
          filter="url(#planeShadow)"
          transform={lastTransformRef.current}
        >
          {/* Aerodynamic Contrail Stream behind Tail */}
          <line x1="-42" y1="0" x2="-18" y2="0" stroke="url(#contrailGrad)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Left Wing & Jet Engine */}
          <path d="M 2 -2 L -8 -17 L -4 -17 L 6 -2 Z" fill="#4338CA" />
          <rect x="-3" y="-12" width="8" height="3" rx="1.5" fill="#312E81" />

          {/* Right Wing & Jet Engine */}
          <path d="M 2 2 L -8 17 L -4 17 L 6 2 Z" fill="#4338CA" />
          <rect x="-3" y="9" width="8" height="3" rx="1.5" fill="#312E81" />

          {/* Horizontal Tail Stabilizers */}
          <path d="M -15 -1 L -21 -8 L -18 -8 L -12 -1 Z" fill="#4F46E5" />
          <path d="M -15 1 L -21 8 L -18 8 L -12 1 Z" fill="#4F46E5" />

          {/* Main Fuselage Body (Aligned centered along y = 0) */}
          <path
            d="M 18 0 C 14 -3, 2 -3.2, -16 -2 C -20 -1.5, -22 -0.8, -23 0 C -22 0.8, -20 1.5, -16 2 C 2 3.2, 14 3, 18 0 Z"
            fill="#FFFFFF"
            stroke="#4F46E5"
            strokeWidth="1.5"
          />

          {/* Cockpit Windshield Visor */}
          <path d="M 11 -1.5 Q 13 0 11 1.5 L 9 1 Q 11 0 9 -1 Z" fill="#1E1B4B" />

          {/* Center Airline Stripe Accent */}
          <line x1="-14" y1="0" x2="8" y2="0" stroke="#4F46E5" strokeWidth="1.2" />

          {/* Navigation Radar Pulse Ring */}
          <circle cx="0" cy="0" r="14" stroke="#6366F1" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
        </g>
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 6. BESPOKE HUD VISUAL SCENE TILES (STEP 3B - RICH EDITION)
// ─────────────────────────────────────────────────────────────

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

// Language 1: Mulai Nol (Japanese Hiragana Kana Card & Fresh Sprout)
export const LanguageZeroIllustration = ({ className = 'w-full h-full' }: { className?: string }) => (
  <svg viewBox="0 0 160 100" className={className} fill="none">
    <defs>
      <linearGradient id="sproutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>

    {/* Wooden Easel / Desk Podium */}
    <rect x="30" y="80" width="100" height="8" rx="4" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />

    {/* Japanese Washi Flashcard with Shadow */}
    <rect x="42" y="22" width="48" height="58" rx="8" fill="#F8FAFC" />
    <rect x="40" y="20" width="48" height="58" rx="8" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2.4" />
    {/* Authentic Bold Brush Hiragana 'A' (あ) */}
    <text x="64" y="58" fill="#0F172A" fontSize="34" fontWeight="bold" fontFamily="'Hiragino Sans', 'Noto Sans JP', sans-serif" textAnchor="middle">
      あ
    </text>

    {/* Sprouting Plant Stem */}
    <path d="M 108 80 Q 106 58 114 46" stroke="#059669" strokeWidth="3.2" strokeLinecap="round" />
    {/* Left Vibrant Leaf */}
    <path d="M 110 54 C 98 44, 94 36, 88 36 C 88 46, 96 54, 110 54 Z" fill="url(#sproutGrad)" stroke="#047857" strokeWidth="1.2" />
    {/* Right Vibrant Leaf */}
    <path d="M 112 50 C 124 40, 128 32, 134 32 C 134 42, 126 50, 112 50 Z" fill="#10B981" stroke="#047857" strokeWidth="1.2" />

    {/* Floating Sakura Petal */}
    <path d="M 32 36 C 32 30, 38 28, 42 32 C 40 38, 32 40, 32 36 Z" fill="#FDA4AF" />
    {/* Learning Sparkle Stars */}
    <circle cx="120" cy="22" r="3" fill="#F59E0B" />
    <circle cx="36" cy="62" r="2.5" fill="#818CF8" />
  </svg>
)

// Language 2: Dasar (Tokyo Conversation Dialog Bubbles)
export const LanguageBasicIllustration = ({ className = 'w-full h-full' }: { className?: string }) => (
  <svg viewBox="0 0 160 100" className={className} fill="none">
    {/* Background Conversation Dot Rings */}
    <circle cx="48" cy="46" r="3" fill="#C7D2FE" />
    <circle cx="118" cy="68" r="3" fill="#818CF8" />

    {/* Primary Japanese Speech Bubble */}
    <rect x="24" y="16" width="70" height="40" rx="12" fill="#4F46E5" />
    <polygon points="46,56 52,66 60,56" fill="#4F46E5" />
    <text x="59" y="42" fill="#FFFFFF" fontSize="15" fontWeight="bold" fontFamily="'Noto Sans JP', sans-serif" textAnchor="middle">
      こんにちは！
    </text>

    {/* Technical Reply Card (Bilingual / API Chat) */}
    <rect x="68" y="44" width="68" height="38" rx="10" fill="#FFFFFF" stroke="#818CF8" strokeWidth="2" />
    <polygon points="112,44 116,36 122,44" fill="#FFFFFF" stroke="#818CF8" strokeWidth="1.5" />
    {/* Terminal Code / Conversation Response */}
    <circle cx="80" cy="63" r="3.5" fill="#10B981" />
    <text x="104" y="67" fill="#312E81" fontSize="13" fontWeight="bold" textAnchor="middle">
      OK / 会話
    </text>

    {/* Soundwave Accents */}
    <path d="M 142 34 C 147 40, 147 52, 142 58" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 148 28 C 155 37, 155 55, 148 64" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// Language 3: Lancar (Shibuya Tech ID Lanyard & Gold Badge)
export const LanguageFluentIllustration = ({ className = 'w-full h-full' }: { className?: string }) => (
  <svg viewBox="0 0 160 100" className={className} fill="none">
    <defs>
      <linearGradient id="goldMedal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="45%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>

    {/* Tokyo Skyline Silhouette in Soft Background */}
    <rect x="22" y="40" width="16" height="48" rx="2" fill="#EEF2FF" />
    <rect x="42" y="28" width="18" height="60" rx="2" fill="#EEF2FF" />
    <rect x="108" y="34" width="20" height="54" rx="2" fill="#EEF2FF" />
    <rect x="132" y="46" width="14" height="42" rx="2" fill="#EEF2FF" />

    {/* Lanyard Ribbon Strap */}
    <path d="M 64 6 L 80 28 L 96 6" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
    <rect x="74" y="26" width="12" height="6" rx="2" fill="#94A3B8" />

    {/* Tech Employee Credential ID Card */}
    <rect x="54" y="30" width="52" height="60" rx="7" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2.4" />
    {/* Photo Placeholder */}
    <rect x="62" y="38" width="36" height="20" rx="4" fill="#EEF2FF" />
    <circle cx="80" cy="46" r="5" fill="#818CF8" />
    <path d="M 72 56 C 72 52, 76 50, 80 50 C 84 50, 88 52, 88 56 Z" fill="#818CF8" />
    {/* ID Barcode / Details */}
    <line x1="62" y1="64" x2="98" y2="64" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="62" y1="71" x2="88" y2="71" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

    {/* Radiant 3D Gold Medal (JLPT N3+ PASS) */}
    <circle cx="112" cy="42" r="15" fill="url(#goldMedal)" stroke="#B45309" strokeWidth="1.5" />
    <circle cx="112" cy="42" r="12" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 2" />
    <text x="112" y="47" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
      N3+
    </text>
    {/* Verified Green Ribbon Badge */}
    <circle cx="112" cy="62" r="5" fill="#10B981" />
    <path d="M 110 62 L 111.5 63.5 L 114.5 60.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

