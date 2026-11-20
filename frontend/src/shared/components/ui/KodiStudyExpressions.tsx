import type { FC } from 'react'
import type { KodiStudyEmotion } from '@/shared/tokens/mascotTokens'

/**
 * Shared Chiikawa-Neko silhouette (shadow, happy tail, rounded mochi body, and pink inner ears)
 * so all 10 study/grammar expressions stay visually cohesive without repeating base paths.
 */
const KodiMochiBaseBody: FC<{ tailClass?: string; bodyRotateDeg?: number }> = ({
  tailClass = 'k-tail-happy',
  bodyRotateDeg = 0,
}) => (
  <g transform={bodyRotateDeg ? `rotate(${bodyRotateDeg} 90 100)` : undefined}>
    <ellipse cx="90" cy="164" rx="44" ry="7" fill="rgba(15,23,42,0.12)" />
    <path
      d="M125,136 C153,140 163,116 149,96 C140,84 129,96 126,118 Z"
      fill="#FFFBEB"
      stroke="#0F172A"
      strokeWidth="3.5"
      className={tailClass}
    />
    <path
      d="M50,96 C42,66 48,52 42,36 C40,28 48,24 56,30 C64,36 70,46 78,48 C84,49 96,49 102,48 C110,46 116,36 124,30 C132,24 140,28 138,36 C132,52 138,66 130,96 C130,140 118,154 90,154 C62,154 50,140 50,96 Z"
      fill="#FFFFFF"
      stroke="#0F172A"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <polygon points="48,34 56,30 52,42" fill="#FECDD3" />
    <polygon points="132,34 124,30 128,42" fill="#FECDD3" />
  </g>
)

const KodiClassicFace: FC<{ eyeY?: number; mouthMode?: 'cat' | 'o' | 'smile' }> = ({
  eyeY = 86,
  mouthMode = 'cat',
}) => (
  <>
    <g className="k-blink-natural">
      <ellipse cx="72" cy={eyeY} rx="6.5" ry="8.5" fill="#0F172A" />
      <circle cx="70" cy={eyeY - 3} r="2.5" fill="#FFFFFF" />
      <circle cx="74" cy={eyeY + 3} r="1.2" fill="#FFFFFF" />
      <ellipse cx="108" cy={eyeY} rx="6.5" ry="8.5" fill="#0F172A" />
      <circle cx="106" cy={eyeY - 3} r="2.5" fill="#FFFFFF" />
      <circle cx="110" cy={eyeY + 3} r="1.2" fill="#FFFFFF" />
    </g>
    <ellipse cx="57" cy={eyeY + 9} rx="7.5" ry="4.5" fill="#FB7185" opacity="0.7" />
    <ellipse cx="123" cy={eyeY + 9} rx="7.5" ry="4.5" fill="#FB7185" opacity="0.7" />
    {mouthMode === 'o' ? (
      <circle cx="90" cy={eyeY + 12} r="3.5" fill="#FB7185" stroke="#0F172A" strokeWidth="2" />
    ) : mouthMode === 'smile' ? (
      <path
        d={`M82,${eyeY + 10} Q90,${eyeY + 18} 98,${eyeY + 10}`}
        stroke="#0F172A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    ) : (
      <>
        <polygon points={`88,${eyeY + 6} 92,${eyeY + 6} 90,${eyeY + 9}`} fill="#FB7185" />
        <path
          d={`M84,${eyeY + 10} Q87,${eyeY + 14} 90,${eyeY + 12} Q93,${eyeY + 14} 96,${eyeY + 10}`}
          stroke="#0F172A"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
      </>
    )}
  </>
)

/**
 * 10 expressive, friendly language-learning SVG poses for Kodi (Grammar cards & DidYouKnowCallout).
 * Designed inside the 180x180 SVG coordinate space matching KodiCharacter.tsx.
 */
export const KodiStudyExpressionSvg: FC<{ emotion: KodiStudyEmotion }> = ({ emotion }) => {
  switch (emotion) {
    /* 1. CURIOUS: Pondering paw on chin + floating warm question badge ("Tahukah Kamu?") */
    case 'curious':
      return (
        <g className="k-floaty">
          <KodiMochiBaseBody bodyRotateDeg={4} />
          {/* Floating Amber Question Bubble */}
          <g transform="translate(120, 12)">
            <circle cx="16" cy="16" r="14" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5" />
            <text x="11" y="22" fontSize="17" fontWeight="900" fill="#B45309">?</text>
            <circle cx="3" cy="30" r="2.8" fill="#F59E0B" />
          </g>
          {/* Curious Side-Glance Eyes */}
          <g className="k-blink-natural">
            <ellipse cx="73" cy="84" rx="6.5" ry="8.5" fill="#0F172A" />
            <circle cx="75" cy="81" r="2.5" fill="#FFFFFF" />
            <ellipse cx="109" cy="84" rx="6.5" ry="8.5" fill="#0F172A" />
            <circle cx="111" cy="81" r="2.5" fill="#FFFFFF" />
          </g>
          <path d="M64,70 Q72,67 79,71" stroke="#0F172A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M101,69 Q110,64 117,69" stroke="#0F172A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <ellipse cx="57" cy="94" rx="7.5" ry="4.5" fill="#FB7185" opacity="0.68" />
          <ellipse cx="123" cy="94" rx="7.5" ry="4.5" fill="#FB7185" opacity="0.68" />
          {/* Thoughtful wavy mouth */}
          <path d="M84,99 Q90,96 96,100" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Left paw raised thoughtfully under chin */}
          <ellipse cx="74" cy="116" rx="8" ry="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" transform="rotate(-18 74 116)" />
          <circle cx="74" cy="114" r="3.5" fill="#FECDD3" />
          <ellipse cx="118" cy="126" rx="7" ry="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
        </g>
      )

    /* 2. READING: Round glasses reading an open book + warm ocha tea cup */
    case 'reading':
      return (
        <g className="k-floaty">
          <KodiMochiBaseBody />
          <KodiClassicFace eyeY={82} mouthMode="cat" />
          {/* Cute Round Reading Glasses */}
          <circle cx="72" cy="82" r="12" fill="rgba(255,255,255,0.22)" stroke="#1D4ED8" strokeWidth="2.5" />
          <circle cx="108" cy="82" r="12" fill="rgba(255,255,255,0.22)" stroke="#1D4ED8" strokeWidth="2.5" />
          <line x1="84" y1="82" x2="96" y2="82" stroke="#1D4ED8" strokeWidth="2.5" />
          {/* Open Textbook */}
          <g transform="translate(50, 110)">
            <path d="M0,4 Q20,0 40,6 Q60,0 80,4 L80,34 Q60,30 40,35 Q20,30 0,34 Z" fill="#0EA5E9" stroke="#0F172A" strokeWidth="2.4" />
            <path d="M5,6 Q22,3 38,8 L38,31 Q22,27 5,30 Z" fill="#FFFDF7" stroke="#0F172A" strokeWidth="1.4" />
            <path d="M42,8 Q58,3 75,6 L75,30 Q58,27 42,31 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.4" />
            <line x1="10" y1="15" x2="32" y2="15" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            <line x1="10" y1="22" x2="29" y2="22" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            <text x="48" y="23" fontSize="11" fontWeight="900" fill="#0284C7">文法</text>
          </g>
          {/* Green Ocha Tea Cup on Left */}
          <g transform="translate(26, 126)">
            <rect x="0" y="6" width="16" height="16" rx="4" fill="#86EFAC" stroke="#0F172A" strokeWidth="2" />
            <path d="M5,2 Q7,-3 5,-6" stroke="#94A3B8" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M11,2 Q13,-3 11,-6" stroke="#94A3B8" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </g>
          <ellipse cx="52" cy="126" rx="7" ry="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <ellipse cx="128" cy="126" rx="7" ry="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
        </g>
      )

    /* 3. IDEA: Glowing lightbulb above head + starry "Aha!" expression */
    case 'idea':
      return (
        <g className="k-floaty">
          {/* Glowing Lightbulb */}
          <g transform="translate(76, 6)">
            <circle cx="14" cy="14" r="12" fill="#FEF08A" stroke="#EAB308" strokeWidth="2.5" />
            <rect x="10" y="25" width="8" height="6" rx="2" fill="#94A3B8" stroke="#0F172A" strokeWidth="1.8" />
            <line x1="14" y1="-4" x2="14" y2="0" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="-2" y1="10" x2="2" y2="12" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="30" y1="10" x2="26" y2="12" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
          </g>
          <KodiMochiBaseBody />
          {/* Big Sparkling Eyes */}
          <g className="k-blink-natural">
            <ellipse cx="72" cy="86" rx="7.5" ry="9.5" fill="#0F172A" />
            <circle cx="69.5" cy="82" r="3" fill="#FFFFFF" />
            <polygon points="75,89 76.5,91 79,91 77,92.5 77.5,95 75,93.5 72.5,95 73,92.5 71,91 73.5,91" fill="#FDE047" />
            <ellipse cx="108" cy="86" rx="7.5" ry="9.5" fill="#0F172A" />
            <circle cx="105.5" cy="82" r="3" fill="#FFFFFF" />
            <polygon points="111,89 112.5,91 115,91 113,92.5 113.5,95 111,93.5 108.5,95 109,92.5 107,91 109.5,91" fill="#FDE047" />
          </g>
          <ellipse cx="57" cy="96" rx="7.5" ry="4.5" fill="#FB7185" opacity="0.72" />
          <ellipse cx="123" cy="96" rx="7.5" ry="4.5" fill="#FB7185" opacity="0.72" />
          <circle cx="90" cy="99" r="4" fill="#FB7185" stroke="#0F172A" strokeWidth="2" />
          {/* Raised "Aha!" Finger/Paw */}
          <ellipse cx="132" cy="74" rx="7.5" ry="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" transform="rotate(14 132 74)" />
          <circle cx="132" cy="71" r="3.5" fill="#FECDD3" />
          <ellipse cx="54" cy="120" rx="8" ry="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
        </g>
      )

    /* 4. POLITE: Neat bow tie, folded ojigi paws & drifting sakura petals (Keigo/Sopan) */
    case 'polite':
      return (
        <g className="k-floaty">
          {/* Drifting Sakura Petals */}
          <path d="M32,46 Q38,38 42,46 Q36,52 32,46 Z" fill="#F9A8D4" />
          <path d="M142,38 Q149,30 152,39 Q145,45 142,38 Z" fill="#F472B6" />
          <path d="M148,74 Q155,68 156,77 Q149,81 148,74 Z" fill="#FBCFE8" />
          <KodiMochiBaseBody />
          {/* Warm Polite Smiling Eyes (^ ^) */}
          <g className="k-blink-natural">
            <path d="M63,86 Q72,77 81,86" stroke="#0F172A" strokeWidth="3.6" fill="none" strokeLinecap="round" />
            <path d="M99,86 Q108,77 117,86" stroke="#0F172A" strokeWidth="3.6" fill="none" strokeLinecap="round" />
          </g>
          <ellipse cx="57" cy="95" rx="7.5" ry="4.5" fill="#FB7185" opacity="0.72" />
          <ellipse cx="123" cy="95" rx="7.5" ry="4.5" fill="#FB7185" opacity="0.72" />
          <path d="M84,96 Q87,100 90,98 Q93,100 96,96" stroke="#0F172A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          {/* Neat Violet Bow Tie */}
          <polygon points="78,108 90,114 78,120" fill="#8B5CF6" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="102,108 90,114 102,120" fill="#8B5CF6" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="90" cy="114" r="3.5" fill="#C4B5FD" stroke="#0F172A" strokeWidth="1.8" />
          {/* Politely Folded Paws in Front */}
          <ellipse cx="82" cy="130" rx="9" ry="7" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" transform="rotate(-12 82 130)" />
          <ellipse cx="98" cy="130" rx="9" ry="7" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" transform="rotate(12 98 130)" />
        </g>
      )

    /* 5. EXPLAINING: Kodi Sensei with pointer wand & mini particle board */
    case 'explaining':
      return (
        <g className="k-floaty">
          <KodiMochiBaseBody />
          {/* Sensei Ribbon Headband */}
          <path d="M53,58 Q90,48 127,58" stroke="#0EA5E9" strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <KodiClassicFace eyeY={84} mouthMode="smile" />
          {/* Pointer Wand in Right Paw */}
          <line x1="126" y1="120" x2="154" y2="70" stroke="#0F172A" strokeWidth="3.2" strokeLinecap="round" />
          <polygon points="154,60 157,67 164,67 158,72 160,79 154,75 148,79 150,72 144,67 151,67" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          {/* Mini Pattern Note Board in Left Paw */}
          <g transform="translate(26, 98)">
            <rect x="0" y="0" width="44" height="30" rx="7" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.2" />
            <text x="6" y="19" fontSize="11" fontWeight="900" fill="#1E40AF">は・が</text>
          </g>
          <ellipse cx="70" cy="122" rx="7.5" ry="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <ellipse cx="126" cy="122" rx="7.5" ry="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
        </g>
      )

    /* 6. LISTENING: Headphones + musical sound notes (Audio / Pelafalan) */
    case 'listening':
      return (
        <g className="k-floaty">
          {/* Headphone Band Behind/Over Head */}
          <path d="M40,86 C40,30 140,30 140,86" stroke="#2563EB" strokeWidth="7" fill="none" strokeLinecap="round" />
          <KodiMochiBaseBody />
          {/* Cushioned Ear Cups */}
          <rect x="34" y="72" width="14" height="28" rx="6" fill="#3B82F6" stroke="#0F172A" strokeWidth="2.4" />
          <rect x="132" y="72" width="14" height="28" rx="6" fill="#3B82F6" stroke="#0F172A" strokeWidth="2.4" />
          {/* Blissful Closed Listening Eyes */}
          <path d="M64,84 Q72,90 80,84" stroke="#0F172A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M100,84 Q108,90 116,84" stroke="#0F172A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <ellipse cx="60" cy="95" rx="7.5" ry="4.5" fill="#FB7185" opacity="0.72" />
          <ellipse cx="120" cy="95" rx="7.5" ry="4.5" fill="#FB7185" opacity="0.72" />
          <path d="M84,97 Q90,104 96,97" stroke="#0F172A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          {/* Musical Notes Floating */}
          <text x="20" y="54" fontSize="18" fontWeight="900" fill="#F43F5E">♪</text>
          <text x="148" y="48" fontSize="16" fontWeight="900" fill="#3B82F6">♫</text>
          <ellipse cx="62" cy="126" rx="7.5" ry="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <ellipse cx="118" cy="126" rx="7.5" ry="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
        </g>
      )

    /* 7. WRITING: Artist beret + calligraphy brush (fude) + washi card "の" */
    case 'writing':
      return (
        <g className="k-floaty">
          <KodiMochiBaseBody />
          {/* Cute Emerald Writer Beret */}
          <ellipse cx="90" cy="44" rx="34" ry="12" fill="#10B981" stroke="#0F172A" strokeWidth="2.5" transform="rotate(-8 90 44)" />
          <line x1="90" y1="28" x2="90" y2="34" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
          <KodiClassicFace eyeY={84} mouthMode="cat" />
          {/* Washi Card */}
          <g transform="translate(46, 110) rotate(-4)">
            <rect x="0" y="0" width="44" height="32" rx="4" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2" />
            <text x="15" y="22" fontSize="16" fontWeight="900" fill="#047857">の</text>
          </g>
          {/* Calligraphy Brush Fude */}
          <g transform="translate(114, 96) rotate(24)">
            <rect x="0" y="0" width="6" height="28" rx="2" fill="#92400E" stroke="#0F172A" strokeWidth="1.8" />
            <path d="M0,28 Q3,39 6,28 Z" fill="#0F172A" />
          </g>
          <ellipse cx="64" cy="128" rx="7" ry="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <ellipse cx="122" cy="124" rx="7" ry="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
        </g>
      )

    /* 8. CHATTING: Warm waving pose + Japanese greeting bubble */
    case 'chatting':
      return (
        <g className="k-floaty">
          {/* Greeting Bubble */}
          <g transform="translate(114, 14)">
            <rect x="0" y="0" width="54" height="24" rx="12" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.2" />
            <text x="11" y="16" fontSize="10" fontWeight="900" fill="#0369A1">こんにちは</text>
          </g>
          <KodiMochiBaseBody />
          <KodiClassicFace eyeY={86} mouthMode="smile" />
          {/* Waving Paw */}
          <g transform="translate(124, 76) rotate(-25 10 10)">
            <ellipse cx="10" cy="10" rx="8" ry="11" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="10" cy="8" r="4" fill="#FECDD3" />
          </g>
          <ellipse cx="56" cy="124" rx="8" ry="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
        </g>
      )

    /* 9. CLOCK: Cheerful pose holding pocket clock + Today tag (Tense & Waktu) */
    case 'clock':
      return (
        <g className="k-floaty">
          <KodiMochiBaseBody />
          <KodiClassicFace eyeY={82} mouthMode="o" />
          {/* Golden Pocket Clock Held in Front */}
          <g transform="translate(70, 108)">
            <circle cx="20" cy="20" r="18" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
            <circle cx="20" cy="20" r="13" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="20" y1="20" x2="20" y2="11" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="20" y1="20" x2="27" y2="20" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="20" cy="20" r="2" fill="#0F172A" />
          </g>
          <ellipse cx="64" cy="128" rx="7.5" ry="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <ellipse cx="116" cy="128" rx="7.5" ry="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
        </g>
      )

    /* 10. CHEERING: Waving Japanese uchiwa fan with golden star (Motivation) */
    case 'cheering':
    default:
      return (
        <g className="k-floaty">
          <polygon points="30,36 33,43 40,43 34,47 36,54 30,50 24,54 26,47 20,43 27,43" fill="#FBBF24" />
          <circle cx="144" cy="30" r="3.5" fill="#38BDF8" />
          <KodiMochiBaseBody />
          <g className="k-blink-natural">
            <path d="M62,84 Q72,74 82,84" stroke="#0F172A" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M98,84 Q108,74 118,84" stroke="#0F172A" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
          <ellipse cx="56" cy="94" rx="7.5" ry="4.5" fill="#FB7185" opacity="0.75" />
          <ellipse cx="124" cy="94" rx="7.5" ry="4.5" fill="#FB7185" opacity="0.75" />
          <path d="M82,95 Q90,105 98,95" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Traditional Japanese Uchiwa Fan in Right Paw */}
          <g transform="translate(124, 62) rotate(18)">
            <rect x="13" y="34" width="4" height="16" rx="2" fill="#92400E" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="15" cy="18" r="18" fill="#F97316" stroke="#0F172A" strokeWidth="2.4" />
            <circle cx="15" cy="18" r="13" fill="#FFF7ED" />
            <polygon points="15,9 17.5,14.5 23.5,14.5 18.5,18 20.5,24 15,20.5 9.5,24 11.5,18 6.5,14.5 12.5,14.5" fill="#F59E0B" />
          </g>
          <ellipse cx="54" cy="122" rx="8" ry="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <ellipse cx="128" cy="116" rx="7.5" ry="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
        </g>
      )
  }
}
