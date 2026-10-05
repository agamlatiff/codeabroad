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

// Java Official Coffee Cup Logo
export const JavaLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    {/* Upper Red/Orange Steam Plumes */}
    <path
      d="M13.2 4.2C13.2 4.2 14.8 5.6 13.5 7.4C12.4 8.9 13.8 10 13.8 10C11.5 8.6 11.2 7 12.1 5.8C13 4.6 13.2 4.2 13.2 4.2Z"
      fill="#EA2D2E"
    />
    <path
      d="M16.5 5.5C16.5 5.5 18.2 7.1 16.6 9C15.2 10.7 16.9 12 16.9 12C14.2 10.3 14 8.3 15.1 6.9C16.2 5.5 16.5 5.5 16.5 5.5Z"
      fill="#E76F00"
    />
    <path
      d="M10.2 6.8C10.2 6.8 11.6 8 10.5 9.4C9.5 10.7 10.7 11.7 10.7 11.7C8.8 10.4 8.5 9 9.3 8C10 7 10.2 6.8 10.2 6.8Z"
      fill="#EA2D2E"
    />
    {/* Blue Coffee Cup Body */}
    <path
      d="M6 13.5C6 13.5 7.5 17 12 17C16.5 17 18 13.5 18 13.5H6Z"
      fill="#0074BD"
    />
    <path
      d="M17.5 14.2C18.8 14.2 19.8 14.8 19.8 15.5C19.8 16.2 18.8 16.8 17.5 16.8"
      stroke="#0074BD"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    {/* Saucer Base */}
    <path
      d="M4.5 18.5C7.5 20.2 16.5 20.2 19.5 18.5"
      stroke="#0074BD"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

// Node.js Official Isometric Hexagon Logo
export const NodeLogo = ({ className = 'w-16 h-16' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#5FA04E">
    <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z" />
  </svg>
)

// React Atom Logo
export const ReactLogo = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="12" r="2.5" fill="#61DAFB" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(30 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(90 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(150 12 12)" />
  </svg>
)

// Vue.js Triangle Logo
export const VueLogo = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path d="M2 3H6.5L12 12.5L17.5 3H22L12 20.5L2 3Z" fill="#41B883" />
    <path d="M6.5 3H10.5L12 5.8L13.5 3H17.5L12 12.5L6.5 3Z" fill="#35495E" />
  </svg>
)

// Svelte Fiery Logo
export const SvelteLogo = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path
      d="M17.5 4.5C15.5 3 12.5 3.5 10.5 5.5L7.5 8.5C5.5 10.5 5.5 13.5 7.5 15.5L10 18C12 20 15 20.5 17 19C19 17.5 19 14.5 17 12.5L15 10.5C13.5 9 13.5 7 15 5.5L17.5 4.5Z"
      fill="#FF3E00"
    />
  </svg>
)

// Docker Whale Logo
export const DockerLogo = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect x="6" y="9" width="3" height="2.5" rx="0.5" fill="#2496ED" />
    <rect x="10" y="9" width="3" height="2.5" rx="0.5" fill="#2496ED" />
    <rect x="14" y="9" width="3" height="2.5" rx="0.5" fill="#2496ED" />
    <rect x="10" y="6" width="3" height="2.5" rx="0.5" fill="#2496ED" />
    <rect x="14" y="6" width="3" height="2.5" rx="0.5" fill="#2496ED" />
    <path
      d="M2 13C2.5 13 4 12.5 5.5 13C8 14 10 14 13 13.5C17 13 19 14.5 21 13.5C21.5 13 22 13 22.5 13.5C22 17 18 19 12 19C6 19 2.5 16 2 13Z"
      fill="#2496ED"
    />
    <circle cx="19" cy="15" r="0.8" fill="#FFFFFF" />
  </svg>
)

// Kubernetes (K8s) Helm Wheel Logo
export const K8sLogo = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="12" r="9" stroke="#326CE5" strokeWidth="2" fill="#326CE5" fillOpacity="0.1" />
    <circle cx="12" cy="12" r="3.5" fill="#326CE5" />
    <line x1="12" y1="3" x2="12" y2="8.5" stroke="#326CE5" strokeWidth="2" />
    <line x1="12" y1="15.5" x2="12" y2="21" stroke="#326CE5" strokeWidth="2" />
    <line x1="4" y1="8" x2="9" y2="10.5" stroke="#326CE5" strokeWidth="2" />
    <line x1="15" y1="13.5" x2="20" y2="16" stroke="#326CE5" strokeWidth="2" />
    <line x1="4" y1="16" x2="9" y2="13.5" stroke="#326CE5" strokeWidth="2" />
    <line x1="15" y1="10.5" x2="20" y2="8" stroke="#326CE5" strokeWidth="2" />
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
    case 'react_golang':
    case 'react_node':
      return <ReactLogo className={className} />
    case 'vue':
      return <VueLogo className={className} />
    case 'svelte':
      return <SvelteLogo className={className} />
    case 'devops_cloud':
      return <K8sLogo className={className} />
    default:
      return <GoLogo className={className} />
  }
}
