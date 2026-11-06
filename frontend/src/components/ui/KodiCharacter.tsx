import { useState, type FC, type MouseEvent } from 'react'
import { triggerHaptic } from '../../utils/haptics'
import { playSound } from '../../utils/sound'

export type KodiEmotion =
  | 'welcome'
  | 'happy'
  | 'coding'
  | 'celebrate'
  | 'thinking'
  | 'worried'
  | 'warning'
  | 'onFire'
  | 'proud'

export interface KodiCharacterProps {
  emotion?: KodiEmotion
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  showSpeechBubble?: boolean
  speechText?: string
  interactive?: boolean
  onClick?: () => void
  className?: string
}

/**
 * KodiCharacter — The Living Master Mascot of CodeAbroad ("Kodi-chan" / Chiikawa Neko).
 * 100% Vector SVG, zero raster dependency. Features theatrical Duolingo-grade cartoon acting:
 * - Natural double-blinking eyes with transform-box precision
 * - Expressive cat tail participating in all 6 emotional states
 * - Extreme body deformations (fountain tears, brain overheat steam, trophy leap, super saiyan flames, speedrun typing)
 */
export const KodiCharacter: FC<KodiCharacterProps> = ({
  emotion = 'welcome',
  size = 'md',
  showSpeechBubble = false,
  speechText,
  interactive = true,
  onClick,
  className = '',
}) => {
  const [isJumping, setIsJumping] = useState(false)

  const sizePixel =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 64
      : size === 'md'
      ? 110
      : size === 'lg'
      ? 160
      : 220

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    triggerHaptic('tap')
    playSound('node_tap')

    setIsJumping(true)
    setTimeout(() => setIsJumping(false), 600)

    if (onClick) {
      onClick()
    }
  }

  // Normalize emotion aliases
  const normalizedEmotion: 'welcome' | 'coding' | 'celebrate' | 'thinking' | 'worried' | 'onFire' =
    emotion === 'happy'
      ? 'welcome'
      : emotion === 'warning'
      ? 'worried'
      : emotion === 'proud'
      ? 'onFire'
      : emotion

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      onClick={interactive ? handleClick : undefined}
      title="Kodi (Chiikawa Neko) — CodeAbroad Companion"
    >
      {/* ── 1. OPTIONAL SPEECH BUBBLE ── */}
      {showSpeechBubble && speechText && (
        <div className="mb-2 z-30 animate-bounce-subtle pointer-events-none">
          <div className="relative bg-white border-2 border-slate-200/90 text-slate-800 px-3 py-1.5 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.08)] text-[11px] font-brand font-black tracking-tight max-w-[200px] text-center">
            <span>{speechText}</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-slate-200/90 rotate-45" />
          </div>
        </div>
      )}

      {/* ── 2. SVG VECTOR MASTER MODEL ── */}
      <div
        style={{ width: `${sizePixel}px`, height: `${sizePixel * 1.1}px` }}
        className={`relative flex items-center justify-center transition-transform duration-300 ${
          isJumping
            ? 'animate-bounce'
            : interactive
            ? 'group-hover:scale-105 group-active:scale-95'
            : ''
        }`}
      >
        <svg
          viewBox="0 0 180 180"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <style>{`
            /* Natural double-blink */
            @keyframes kodi-double-blink {
              0%, 78%, 100% { transform: scaleY(1); }
              82% { transform: scaleY(0.08); }
              86% { transform: scaleY(1); }
              90% { transform: scaleY(0.08); }
              94% { transform: scaleY(1); }
            }
            /* Laser blink */
            @keyframes kodi-laser-blink {
              0%, 82%, 100% { transform: scaleY(1); }
              88% { transform: scaleY(0.12); }
              92% { transform: scaleY(1); }
            }
            /* Tearful squeeze blink */
            @keyframes kodi-squeeze-blink {
              0%, 75%, 100% { transform: scaleY(1); }
              80%, 85% { transform: scaleY(0.15) scaleX(1.1); }
              90% { transform: scaleY(1); }
            }
            /* Tail animations */
            @keyframes kodi-tail-happy {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(18deg); }
            }
            @keyframes kodi-tail-panic {
              0%, 100% { transform: scaleY(1) rotate(0deg); }
              50% { transform: scaleY(0.92) rotate(-8deg); }
            }
            @keyframes kodi-tail-fire {
              0%, 100% { transform: scale(1) rotate(0deg); }
              50% { transform: scale(1.06) rotate(6deg); }
            }
            /* Emotional acting animations */
            @keyframes kodi-panic-shiver {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              20% { transform: translate(-2px, 1px) rotate(-1.5deg); }
              40% { transform: translate(2px, -1px) rotate(1.5deg); }
              60% { transform: translate(-1.5px, -1px) rotate(-1deg); }
              80% { transform: translate(1.5px, 1px) rotate(1deg); }
            }
            @keyframes kodi-tear-left {
              0% { opacity: 0; transform: scale(0.3) translate(0, 0); }
              50% { opacity: 1; transform: scale(1.1) translate(-12px, 14px); }
              100% { opacity: 0; transform: scale(1.4) translate(-22px, 32px); }
            }
            @keyframes kodi-tear-right {
              0% { opacity: 0; transform: scale(0.3) translate(0, 0); }
              50% { opacity: 1; transform: scale(1.1) translate(12px, 14px); }
              100% { opacity: 0; transform: scale(1.4) translate(22px, 32px); }
            }
            @keyframes kodi-steam-puff {
              0% { opacity: 0; transform: translateY(0) scale(0.5); }
              50% { opacity: 0.8; transform: translateY(-8px) scale(1.1); }
              100% { opacity: 0; transform: translateY(-16px) scale(1.4); }
            }
            @keyframes kodi-spiral-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes kodi-victory-bounce {
              0%, 100% { transform: translateY(0) scale(1); }
              40% { transform: translateY(-14px) scale(1.06) rotate(-2deg); }
              50% { transform: translateY(-12px) scale(1.04) rotate(2deg); }
            }
            @keyframes kodi-flame-roar {
              0%, 100% { transform: scale(1) translateY(0); filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.6)); }
              50% { transform: scale(1.09) translateY(-3px); filter: drop-shadow(0 0 16px rgba(239, 68, 68, 0.9)); }
            }
            @keyframes kodi-hyper-type-l {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-6px) rotate(-15deg); }
            }
            @keyframes kodi-hyper-type-r {
              0%, 100% { transform: translateY(-6px) rotate(15deg); }
              50% { transform: translateY(0) rotate(0deg); }
            }
            @keyframes kodi-gentle-float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
            }

            .k-blink-natural {
              transform-box: fill-box;
              transform-origin: center center;
              animation: kodi-double-blink 3.8s ease-in-out infinite;
            }
            .k-blink-laser {
              transform-box: fill-box;
              transform-origin: center center;
              animation: kodi-laser-blink 3.2s ease-in-out infinite;
            }
            .k-blink-squeeze {
              transform-box: fill-box;
              transform-origin: center center;
              animation: kodi-squeeze-blink 2.8s ease-in-out infinite;
            }
            .k-tail-happy {
              animation: kodi-tail-happy 2.2s ease-in-out infinite;
              transform-origin: 125px 145px;
            }
            .k-tail-panic {
              animation: kodi-tail-panic 0.25s ease-in-out infinite;
              transform-origin: 122px 145px;
            }
            .k-tail-fire {
              animation: kodi-tail-fire 1.2s ease-in-out infinite;
              transform-origin: 125px 135px;
            }
            .k-floaty { animation: kodi-gentle-float 3.2s ease-in-out infinite; }
            .k-panic { animation: kodi-panic-shiver 0.18s infinite; }
            .k-tear-l { animation: kodi-tear-left 0.8s cubic-bezier(0.2, 0.8, 0.3, 1) infinite; }
            .k-tear-r { animation: kodi-tear-right 0.8s cubic-bezier(0.2, 0.8, 0.3, 1) infinite 0.15s; }
            .k-steam { animation: kodi-steam-puff 1.2s ease-out infinite; }
            .k-spiral { animation: kodi-spiral-spin 4s linear infinite; transform-origin: center center; }
            .k-jump { animation: kodi-victory-bounce 1.5s ease-in-out infinite; }
            .k-fire { animation: kodi-flame-roar 0.9s ease-in-out infinite; transform-origin: 90px 140px; }
            .k-type-l { animation: kodi-hyper-type-l 0.14s infinite; transform-origin: 65px 125px; }
            .k-type-r { animation: kodi-hyper-type-r 0.14s infinite; transform-origin: 115px 125px; }
          `}</style>

          {/* ══════════════════════════════════════════════════════════════════
              EMOTION 1: WELCOME / IDLE (COMPANION NODE ROADMAP)
          ══════════════════════════════════════════════════════════════════ */}
          {normalizedEmotion === 'welcome' && (
            <g className="k-floaty">
              <ellipse cx="90" cy="164" rx="44" ry="7" fill="rgba(15,23,42,0.12)" />
              {/* Swishing Tail */}
              <path
                d="M125,138 C152,142 162,118 148,98 C140,86 130,98 126,118 Z"
                fill="#FFFBEB"
                stroke="#0F172A"
                strokeWidth="3.5"
                className="k-tail-happy"
              />
              {/* Seamless Mochi Cat Body */}
              <path
                d="M50,96 C42,66 48,52 42,36 C40,28 48,24 56,30 C64,36 70,46 78,48 C84,49 96,49 102,48 C110,46 116,36 124,30 C132,24 140,28 138,36 C132,52 138,66 130,96 C130,140 118,154 90,154 C62,154 50,140 50,96 Z"
                fill="#FFFFFF"
                stroke="#0F172A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Pink Ears */}
              <polygon points="48,34 56,30 52,42" fill="#FECDD3" />
              <polygon points="132,34 124,30 128,42" fill="#FECDD3" />
              {/* Living Blinking Eyes */}
              <g className="k-blink-natural">
                <ellipse cx="72" cy="88" rx="6.5" ry="9" fill="#0F172A" />
                <circle cx="70" cy="85" r="2.5" fill="#FFFFFF" />
                <circle cx="74" cy="92" r="1.2" fill="#FFFFFF" />
                <ellipse cx="108" cy="88" rx="6.5" ry="9" fill="#0F172A" />
                <circle cx="106" cy="85" r="2.5" fill="#FFFFFF" />
                <circle cx="110" cy="92" r="1.2" fill="#FFFFFF" />
              </g>
              {/* Cheeks & Cat Mouth */}
              <ellipse cx="58" cy="98" rx="8" ry="5" fill="#FB7185" opacity="0.7" />
              <ellipse cx="122" cy="98" rx="8" ry="5" fill="#FB7185" opacity="0.7" />
              <polygon points="88,94 92,94 90,97" fill="#FB7185" />
              <path
                d="M84,98 Q87,102 90,100 Q93,102 96,98"
                stroke="#0F172A"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Whiskers */}
              <line x1="48" y1="94" x2="56" y2="95" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              <line x1="48" y1="100" x2="56" y2="99" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              <line x1="132" y1="94" x2="124" y2="95" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              <line x1="132" y1="100" x2="124" y2="99" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              {/* Waving Paw with Pink Nikukyu */}
              <g transform="translate(122, 70) rotate(-20 10 10)">
                <ellipse cx="10" cy="10" rx="7" ry="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
                <circle cx="10" cy="8" r="4" fill="#FECDD3" />
              </g>
            </g>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              EMOTION 2: CELEBRATE (AIRBORNE LEAP & GOLDEN TROPHY)
          ══════════════════════════════════════════════════════════════════ */}
          {normalizedEmotion === 'celebrate' && (
            <g className="k-jump">
              <ellipse cx="90" cy="168" rx="28" ry="5" fill="rgba(15,23,42,0.18)" />
              {/* Joyful High Tail */}
              <path
                d="M120,118 C155,112 172,72 152,48 C140,34 126,52 128,80 Z"
                fill="#FFFBEB"
                stroke="#0F172A"
                strokeWidth="3.5"
                className="k-tail-happy"
              />
              <circle cx="152" cy="48" r="4" fill="#FBBF24" />
              {/* Confetti & Stars */}
              <polygon points="25,30 28,38 36,38 30,43 32,51 25,46 18,51 20,43 14,38 22,38" fill="#FBBF24" />
              <polygon points="155,35 158,43 166,43 160,48 162,56 155,51 148,56 150,48 144,43 152,43" fill="#FBBF24" />
              <circle cx="48" cy="20" r="3.5" fill="#38BDF8" />
              <rect x="36" y="55" width="8" height="5" fill="#10B981" transform="rotate(30 40 57)" />
              {/* Airborne Body */}
              <path
                d="M50,90 C42,60 48,46 42,30 C40,22 48,18 56,24 C64,30 70,40 78,42 C84,43 96,43 102,42 C110,40 116,30 124,24 C132,18 140,22 138,30 C132,46 138,60 130,90 C130,132 118,144 90,144 C62,144 50,132 50,90 Z"
                fill="#FFFFFF"
                stroke="#0F172A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Joy Eyes (^ ^) */}
              <g className="k-blink-natural">
                <path d="M62,78 Q72,66 82,78" stroke="#0F172A" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                <path d="M98,78 Q108,66 118,78" stroke="#0F172A" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                <circle cx="58" cy="84" r="2.5" fill="#38BDF8" />
                <circle cx="122" cy="84" r="2.5" fill="#38BDF8" />
              </g>
              {/* Laughing Mouth with Tongue */}
              <path d="M78,88 Q90,114 102,88 Z" fill="#991B1B" stroke="#0F172A" strokeWidth="2.5" />
              <path d="M82,98 Q90,108 98,98" fill="#F87171" />
              <ellipse cx="56" cy="88" rx="8" ry="5.5" fill="#FB7185" opacity="0.8" />
              <ellipse cx="124" cy="88" rx="8" ry="5.5" fill="#FB7185" opacity="0.8" />
              {/* Left Arm Pumping Up */}
              <ellipse cx="38" cy="70" rx="7" ry="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" transform="rotate(-40 38 70)" />
              {/* Right Arm Holding GIANT GOLDEN TROPHY */}
              <g transform="translate(118, 55)">
                <path d="M8,12 L28,12 L24,30 Q18,36 18,40 L24,45 L12,45 L18,40 Q18,36 12,30 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.8" />
                <path d="M8,16 C0,16 0,26 8,26" stroke="#D97706" strokeWidth="2" fill="none" />
                <path d="M28,16 C36,16 36,26 28,26" stroke="#D97706" strokeWidth="2" fill="none" />
                <circle cx="18" cy="22" r="3" fill="#DC2626" />
              </g>
              {/* Kicking Feet */}
              <ellipse cx="64" cy="144" rx="8" ry="11" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" transform="rotate(25 64 144)" />
              <ellipse cx="116" cy="144" rx="8" ry="11" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" transform="rotate(-25 116 144)" />
            </g>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              EMOTION 3: CODING (SPEEDRUN HACKER WITH AFTERIMAGE PAWS)
          ══════════════════════════════════════════════════════════════════ */}
          {normalizedEmotion === 'coding' && (
            <g className="k-floaty">
              <ellipse cx="90" cy="164" rx="44" ry="7" fill="rgba(15,23,42,0.12)" />
              {/* Rhythmic Tap Tail */}
              <path
                d="M125,134 C155,142 165,115 150,95 C140,82 128,95 126,118 Z"
                fill="#FFFBEB"
                stroke="#0F172A"
                strokeWidth="3.5"
                className="k-tail-happy"
              />
              {/* Body */}
              <path
                d="M50,96 C42,66 48,52 42,36 C40,28 48,24 56,30 C64,36 70,46 78,48 C84,49 96,49 102,48 C110,46 116,36 124,30 C132,24 140,28 138,36 C132,52 138,66 130,96 C130,136 118,150 90,150 C62,150 50,136 50,96 Z"
                fill="#FFFFFF"
                stroke="#0F172A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Matrix Glasses with Blinking Code */}
              <g className="k-blink-natural">
                <rect x="52" y="74" width="76" height="20" rx="5" fill="#0F172A" stroke="#0284C7" strokeWidth="2" />
                <text x="58" y="87" fontSize="8" fontFamily="monospace" fill="#22C55E" fontWeight="bold">101010101</text>
                <text x="58" y="93" fontSize="5" fontFamily="monospace" fill="#38BDF8">deploy:ok</text>
              </g>
              <path d="M84,103 Q90,107 96,103" stroke="#0F172A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              {/* Steaming Coffee Cup */}
              <rect x="36" y="128" width="12" height="14" rx="2" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.8" />
              <path d="M42,125 Q44,121 42,118" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
              {/* Laptop Glowing Cyan */}
              <polygon points="56,128 124,128 132,142 48,142" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <rect x="62" y="108" width="56" height="24" rx="3" fill="#0F172A" stroke="#0F172A" strokeWidth="2" />
              <rect x="65" y="110" width="50" height="18" rx="2" fill="#0284C7" />
              <text x="73" y="123" fontSize="9" fontFamily="monospace" fill="#FFFFFF" fontWeight="black">&lt;/dev&gt;</text>
              {/* AFTERIMAGE TYPING PAWS */}
              <ellipse cx="66" cy="126" rx="6" ry="5" fill="#BAE6FD" opacity="0.6" />
              <ellipse cx="114" cy="126" rx="6" ry="5" fill="#BAE6FD" opacity="0.6" />
              <ellipse cx="68" cy="130" rx="7" ry="5.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" className="k-type-l" />
              <ellipse cx="112" cy="130" rx="7" ry="5.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" className="k-type-r" />
            </g>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              EMOTION 4: THINKING (BRAIN OVERHEAT & SPIRAL EYES)
          ══════════════════════════════════════════════════════════════════ */}
          {normalizedEmotion === 'thinking' && (
            <g className="k-floaty">
              <ellipse cx="90" cy="164" rx="44" ry="7" fill="rgba(15,23,42,0.12)" />
              {/* Question Mark Tail */}
              <path
                d="M125,130 C156,125 168,90 148,70 C138,58 126,72 130,94 Z"
                fill="#FFFBEB"
                stroke="#0F172A"
                strokeWidth="3.5"
                className="k-tail-happy"
              />
              <circle cx="152" cy="74" r="3" fill="#8B5CF6" />
              {/* Steam Puffing from Ears */}
              <g className="k-steam">
                <path d="M38,32 C30,26 26,18 34,12 C42,8 44,18 38,24 Z" fill="#94A3B8" opacity="0.6" />
                <path d="M142,32 C150,26 154,18 146,12 C138,8 136,18 142,24 Z" fill="#94A3B8" opacity="0.6" />
              </g>
              {/* Thought Cloud */}
              <g transform="translate(60, 8)">
                <rect x="0" y="0" width="60" height="22" rx="11" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
                <text x="7" y="15" fontSize="9" fontFamily="monospace" fontWeight="black" fill="#DC2626">syntax error?</text>
                <circle cx="30" cy="27" r="2.5" fill="#EF4444" />
              </g>
              {/* Tilted Body with Hands on Head */}
              <g transform="rotate(-6 90 100)">
                <path
                  d="M50,96 C42,66 48,52 42,36 C40,28 48,24 56,30 C64,36 70,46 78,48 C84,49 96,49 102,48 C110,46 116,36 124,30 C132,24 140,28 138,36 C132,52 138,66 130,96 C130,140 118,154 90,154 C62,154 50,140 50,96 Z"
                  fill="#FFFFFF"
                  stroke="#0F172A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <polygon points="48,34 56,30 52,42" fill="#FECDD3" />
                <polygon points="132,34 124,30 128,42" fill="#FECDD3" />
                {/* Spiral Eyes with Blink */}
                <g className="k-blink-natural">
                  <g transform="translate(70, 88)">
                    <circle cx="0" cy="0" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                    <path d="M0,0 Q-4,-5 0,-7 Q6,-6 6,0 Q5,6 0,6 Q-6,5 -6,-2 Q-5,-6 -1,-5" stroke="#7C3AED" strokeWidth="2.5" fill="none" className="k-spiral" />
                  </g>
                  <g transform="translate(110, 88)">
                    <circle cx="0" cy="0" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                    <path d="M0,0 Q-4,-5 0,-7 Q6,-6 6,0 Q5,6 0,6 Q-6,5 -6,-2 Q-5,-6 -1,-5" stroke="#7C3AED" strokeWidth="2.5" fill="none" className="k-spiral" />
                  </g>
                </g>
                {/* Tongue Derp */}
                <path d="M84,104 Q88,98 92,104 Q96,110 100,104" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M96,105 C98,112 104,112 102,105 Z" fill="#FB7185" stroke="#0F172A" strokeWidth="1.5" />
                {/* Paws on Head */}
                <ellipse cx="44" cy="62" rx="8" ry="11" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" transform="rotate(35 44 62)" />
                <ellipse cx="136" cy="62" rx="8" ry="11" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" transform="rotate(-35 136 62)" />
              </g>
            </g>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              EMOTION 5: WORRIED (STREAK WARNING FOUNTAIN TEARS)
          ══════════════════════════════════════════════════════════════════ */}
          {normalizedEmotion === 'worried' && (
            <g className="k-panic">
              <ellipse cx="90" cy="162" rx="55" ry="12" fill="#38BDF8" opacity="0.35" />
              <ellipse cx="90" cy="162" rx="38" ry="7" fill="#0284C7" opacity="0.25" />
              {/* Tucked Trembling Tail */}
              <path
                d="M124,136 C144,140 156,155 146,166 C138,172 128,162 124,148 Z"
                fill="#FFFBEB"
                stroke="#0F172A"
                strokeWidth="3.5"
                className="k-tail-panic"
              />
              {/* Body */}
              <path
                d="M52,105 C42,80 48,64 42,46 C40,38 48,34 56,40 C64,46 68,54 78,56 C84,57 96,57 102,56 C112,54 116,46 124,40 C132,34 140,38 138,46 C132,64 138,80 128,105 C126,144 116,154 90,154 C64,154 54,144 52,105 Z"
                fill="#FFFFFF"
                stroke="#0F172A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <polygon points="46,42 54,38 52,48" fill="#FECDD3" />
              <polygon points="134,42 126,38 128,48" fill="#FECDD3" />
              {/* Watery Squeeze Blink Eyes */}
              <g className="k-blink-squeeze">
                <ellipse cx="68" cy="92" rx="10" ry="12" fill="#0F172A" />
                <circle cx="65" cy="88" r="4.5" fill="#FFFFFF" />
                <circle cx="71" cy="98" r="2.5" fill="#38BDF8" />
                <circle cx="68" cy="85" r="1.5" fill="#FFFFFF" />
                <ellipse cx="112" cy="92" rx="10" ry="12" fill="#0F172A" />
                <circle cx="109" cy="88" r="4.5" fill="#FFFFFF" />
                <circle cx="115" cy="98" r="2.5" fill="#38BDF8" />
                <circle cx="112" cy="85" r="1.5" fill="#FFFFFF" />
              </g>
              {/* Fountain Waterfall Tears */}
              <path d="M58,94 C45,90 35,100 28,118 C26,122 32,120 34,116 C38,104 46,98 56,96 Z" fill="#38BDF8" className="k-tear-l" />
              <circle cx="26" cy="120" r="4" fill="#38BDF8" className="k-tear-l" />
              <path d="M122,94 C135,90 145,100 152,118 C154,122 148,120 146,116 C142,104 134,98 124,96 Z" fill="#38BDF8" className="k-tear-r" />
              <circle cx="154" cy="120" r="4" fill="#38BDF8" className="k-tear-r" />
              {/* Trembling Open Mouth */}
              <path d="M76,104 Q90,100 104,104 Q90,122 76,104 Z" fill="#DC2626" stroke="#0F172A" strokeWidth="2.5" />
              <path d="M82,110 Q90,116 98,110" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Clutching Alarm Clock */}
              <circle cx="90" cy="136" r="13" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
              <path d="M80,125 L75,120" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M100,125 L105,120" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
              <text x="83" y="141" fontSize="11" fontWeight="black" fill="#DC2626">!</text>
              <circle cx="75" cy="136" r="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
              <circle cx="105" cy="136" r="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            </g>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              EMOTION 6: ON FIRE (SUPER SAIYAN BLAZING AURA & LASER EYES)
          ══════════════════════════════════════════════════════════════════ */}
          {normalizedEmotion === 'onFire' && (
            <g className="k-fire">
              {/* Roaring Flames Backdrop */}
              <path d="M90,10 C125,45 155,75 145,130 C135,165 45,165 35,130 C25,75 55,45 90,10 Z" fill="#EF4444" opacity="0.35" />
              <path d="M90,25 C118,55 140,80 132,125 C122,155 58,155 48,125 C40,80 62,55 90,25 Z" fill="#F97316" opacity="0.6" />
              <path d="M90,45 C108,68 122,88 116,120 C108,145 72,145 64,120 C58,88 72,68 90,45 Z" fill="#FBBF24" opacity="0.85" />
              {/* Spiky Flame Tail */}
              <g className="k-tail-fire">
                <path d="M125,126 C155,116 168,82 152,60 C140,46 130,66 130,90 Z" fill="#FFFBEB" stroke="#0F172A" strokeWidth="3.5" />
                <circle cx="152" cy="60" r="7" fill="#F97316" />
                <circle cx="152" cy="60" r="4" fill="#FBBF24" />
              </g>
              {/* Red Headband Flapping */}
              <rect x="50" y="52" width="80" height="9" rx="2" fill="#DC2626" />
              <path d="M128,54 Q148,46 158,56 Q145,64 128,62" fill="#DC2626" />
              <circle cx="90" cy="56.5" r="3" fill="#FFFFFF" />
              {/* Crouched Action Body */}
              <path
                d="M50,96 C42,66 48,52 42,36 C40,28 48,24 56,30 C64,36 70,46 78,48 C84,49 96,49 102,48 C110,46 116,36 124,30 C132,24 140,28 138,36 C132,52 138,66 130,96 C130,140 118,154 90,154 C62,154 50,140 50,96 Z"
                fill="#FFFFFF"
                stroke="#0F172A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <line x1="58" y1="74" x2="78" y2="82" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="122" y1="74" x2="102" y2="82" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
              {/* Laser Eyes with Fierce Blink */}
              <g className="k-blink-laser">
                <ellipse cx="72" cy="88" rx="7" ry="9" fill="#0F172A" />
                <ellipse cx="72" cy="88" rx="5" ry="7" fill="#DC2626" />
                <ellipse cx="72" cy="88" rx="3" ry="4" fill="#FBBF24" />
                <ellipse cx="108" cy="88" rx="7" ry="9" fill="#0F172A" />
                <ellipse cx="108" cy="88" rx="5" ry="7" fill="#DC2626" />
                <ellipse cx="108" cy="88" rx="3" ry="4" fill="#FBBF24" />
              </g>
              {/* Fierce Smirk with Sharp Fang */}
              <path d="M82,98 Q90,105 98,96" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <polygon points="86,99 90,99 88,104" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
              {/* Clenched Fists */}
              <circle cx="56" cy="126" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
              <circle cx="124" cy="126" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}
