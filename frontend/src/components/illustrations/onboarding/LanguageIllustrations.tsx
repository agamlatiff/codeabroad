// Language Option 1: Level 0 Beginner (Japanese Hiragana Kana Card & Fresh Sprout)
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

// Language Option 2: Basic Level (Tokyo Conversation Dialog Bubbles)
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

// Language Option 3: Conversational Work Ready (Shibuya Tech ID Lanyard & Gold Badge)
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

// Language Option 4: Business Fluent (Tokyo Executive Skyline & Crystal Platinum Seal N1/N2)
export const LanguageBusinessIllustration = ({ className = 'w-full h-full' }: { className?: string }) => (
  <svg viewBox="0 0 160 100" className={className} fill="none">
    <defs>
      <linearGradient id="bizSealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A5B4FC" />
        <stop offset="50%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4338CA" />
      </linearGradient>
    </defs>

    {/* Modern Tokyo Tower Silhouette in Sunset Violet */}
    <path d="M 40 85 L 50 25 L 56 25 L 66 85 Z" fill="#EEF2FF" />
    <polygon points="53,16 50,25 56,25" fill="#C7D2FE" />
    <line x1="53" y1="12" x2="53" y2="16" stroke="#818CF8" strokeWidth="2" />
    <rect x="44" y="55" width="18" height="6" rx="2" fill="#C7D2FE" />

    {/* Executive Briefcase / Business Dossier */}
    <rect x="76" y="38" width="56" height="42" rx="7" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2.2" />
    <path d="M 94 38 L 94 32 C 94 29, 114 29, 114 32 L 114 38" stroke="#4F46E5" strokeWidth="2" fill="none" />
    <line x1="76" y1="56" x2="132" y2="56" stroke="#E0E7FF" strokeWidth="1.5" />
    <rect x="100" y="53" width="8" height="6" rx="1.5" fill="#F59E0B" />

    {/* Platinum Star Laurels / N1-N2 Badge */}
    <circle cx="120" cy="32" r="14" fill="url(#bizSealGrad)" stroke="#FFFFFF" strokeWidth="2" />
    <text x="120" y="36" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">
      N1/N2
    </text>

    {/* Sparkles */}
    <polygon points="32,28 34,32 38,32 35,34 36,38 32,35 28,38 29,34 26,32 30,32" fill="#F59E0B" />
    <circle cx="72" cy="22" r="2.5" fill="#818CF8" />
  </svg>
)
