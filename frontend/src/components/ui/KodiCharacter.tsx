import { useState, type FC, type MouseEvent } from 'react'
import { triggerHaptic } from '../../utils/haptics'
import { playSound } from '../../utils/sound'

export type KodiEmotion =
  | 'happy'
  | 'coding'
  | 'celebrate'
  | 'thinking'
  | 'worried'
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
 * KodiCharacter — The Living Master Mascot of CodeAbroad.
 * Fully modular, 100% vector SVG red panda with interactive emotional expressions,
 * automatic eye-blink, gentle idle breathing bob, and 3D volumetric shading.
 */
export const KodiCharacter: FC<KodiCharacterProps> = ({
  emotion = 'coding',
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

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      onClick={interactive ? handleClick : undefined}
    >
      {/* ── 1. OPTIONAL LIVING SPEECH BUBBLE ── */}
      {showSpeechBubble && speechText && (
        <div className="mb-2 z-30 animate-bounce-subtle pointer-events-none">
          <div className="relative bg-white border-2 border-slate-200/90 text-slate-800 px-3 py-1.5 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.08)] text-[11px] font-brand font-black tracking-tight max-w-[200px] text-center">
            <span>{speechText}</span>
            {/* Triangle pointer */}
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
          viewBox="0 0 200 220"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* 3D Volumetric Gradients for Fur and Chubby Cheeks */}
            <radialGradient id="kodi-head-grad" cx="45%" cy="38%" r="60%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="60%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#C2410C" />
            </radialGradient>

            <linearGradient id="kodi-belly-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>

            <radialGradient id="kodi-ear-inner" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFF1F2" />
              <stop offset="100%" stopColor="#FECDD3" />
            </radialGradient>

            <radialGradient id="kodi-ground-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(15, 23, 42, 0.28)" />
              <stop offset="65%" stopColor="rgba(15, 23, 42, 0.08)" />
              <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
            </radialGradient>

            <linearGradient id="kodi-laptop-screen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
          </defs>

          <style>{`
            @keyframes kodi-breathe {
              0%, 100% { transform: translateY(0px) scale(1, 1); }
              50% { transform: translateY(-3px) scale(1.015, 0.985); }
            }
            @keyframes kodi-blink {
              0%, 88%, 100% { transform: scaleY(1); }
              93% { transform: scaleY(0.08); }
            }
            @keyframes kodi-tail-sway {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(8deg); }
            }
            .kodi-breathing-body {
              animation: kodi-breathe 3.4s ease-in-out infinite;
              transform-origin: 100px 190px;
            }
            .kodi-eye-blink {
              animation: kodi-blink 3.8s ease-in-out infinite;
              transform-origin: 100px 105px;
            }
            .kodi-tail {
              animation: kodi-tail-sway 4s ease-in-out infinite;
              transform-origin: 135px 165px;
            }
          `}</style>

          {/* ── GROUND SHADOW (3D DEPTH) ── */}
          <ellipse
            cx="100"
            cy="204"
            rx="56"
            ry="11"
            fill="url(#kodi-ground-shadow)"
          />

          <g className="kodi-breathing-body">
            {/* ── BUSHY STRIPED TAIL (BEHIND) ── */}
            <g className="kodi-tail">
              <path
                d="M135,160 Q178,175 186,145 Q190,122 168,118 Q146,115 130,145 Z"
                fill="#EA580C"
              />
              {/* Cream Stripes */}
              <path
                d="M152,126 Q162,130 158,142"
                stroke="#FEF3C7"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M168,132 Q176,140 170,154"
                stroke="#FEF3C7"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Dark Tip */}
              <path
                d="M180,132 Q187,136 182,148 Q176,145 178,134 Z"
                fill="#9A3412"
              />
            </g>

            {/* ── CHUBBY TORSO & BELLY ── */}
            <path
              d="M66,128 C64,98 136,98 134,128 C134,172 144,194 100,194 C56,194 66,172 66,128 Z"
              fill="url(#kodi-head-grad)"
            />

            {/* Cream Tummy Patch */}
            <path
              d="M78,136 C76,115 124,115 122,136 C122,168 130,188 100,188 C70,188 78,168 78,136 Z"
              fill="url(#kodi-belly-grad)"
            />

            {/* Paws / Feet */}
            <ellipse cx="80" cy="195" rx="13" ry="8" fill="#9A3412" />
            <ellipse cx="120" cy="195" rx="13" ry="8" fill="#9A3412" />

            {/* ── EARS (LEFT & RIGHT) ── */}
            {/* Left Ear */}
            <g>
              <path
                d="M52,86 Q38,34 76,52 Z"
                fill="#C2410C"
              />
              <path
                d="M55,80 Q45,44 72,56 Z"
                fill="url(#kodi-ear-inner)"
              />
              {/* Fluffy white tufts */}
              <circle cx="58" cy="74" r="5" fill="#FFFBEB" />
              <circle cx="64" cy="70" r="4.5" fill="#FFFBEB" />
            </g>

            {/* Right Ear */}
            <g>
              <path
                d="M148,86 Q162,34 124,52 Z"
                fill="#C2410C"
              />
              <path
                d="M145,80 Q155,44 128,56 Z"
                fill="url(#kodi-ear-inner)"
              />
              {/* Fluffy white tufts */}
              <circle cx="142" cy="74" r="5" fill="#FFFBEB" />
              <circle cx="136" cy="70" r="4.5" fill="#FFFBEB" />
            </g>

            {/* ── ROUND VOLUMETRIC CHUBBY HEAD ── */}
            <path
              d="M44,106 C34,64 166,64 156,106 C156,140 136,152 100,152 C64,152 44,140 44,106 Z"
              fill="url(#kodi-head-grad)"
            />

            {/* White Cheek Tufts (Red Panda Iconic Markings) */}
            <path
              d="M46,108 Q34,124 54,132 Q66,136 74,130 Z"
              fill="#FFFBEB"
            />
            <path
              d="M154,108 Q166,124 146,132 Q134,136 126,130 Z"
              fill="#FFFBEB"
            />

            {/* White Brow Spots */}
            <ellipse cx="74" cy="80" rx="5.5" ry="3.5" fill="#FFFBEB" />
            <ellipse cx="126" cy="80" rx="5.5" ry="3.5" fill="#FFFBEB" />

            {/* Sweet Peach Blushing Cheeks */}
            <ellipse cx="64" cy="122" rx="7" ry="4.5" fill="#FB7185" opacity="0.45" />
            <ellipse cx="136" cy="122" rx="7" ry="4.5" fill="#FB7185" opacity="0.45" />

            {/* ── WHITE MUZZLE OVAL ── */}
            <ellipse
              cx="100"
              cy="123"
              rx="24"
              ry="16"
              fill="url(#kodi-belly-grad)"
            />

            {/* Cute Black Button Nose */}
            <path
              d="M94,116 C94,112 106,112 106,116 C106,120 100,123 100,123 C100,123 94,120 94,116 Z"
              fill="#0F172A"
            />
            {/* Specular White Dot on Nose Tip */}
            <circle cx="98" cy="115" r="1.5" fill="#FFFFFF" />

            {/* ── MODULAR MOUTH (BASED ON EMOTION) ── */}
            {emotion === 'celebrate' ? (
              // Open cheerful cheering mouth (Yatta!)
              <g>
                <path
                  d="M92,124 Q100,138 108,124 Z"
                  fill="#881337"
                />
                <path
                  d="M94,128 Q100,136 106,128"
                  fill="#F43F5E"
                />
              </g>
            ) : emotion === 'thinking' ? (
              // Cute curious tilted mouth
              <path
                d="M95,127 Q101,123 107,126"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : emotion === 'worried' ? (
              // Quivering gentle frown
              <path
                d="M94,128 Q100,123 106,128"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Happy / Coding confident cat smile (:3)
              <path
                d="M92,124 Q96,129 100,125 Q104,129 108,124"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* ── MODULAR EYES (BASED ON EMOTION) ── */}
            {emotion === 'happy' || emotion === 'proud' ? (
              // Joyful smiling crescent eyes (^ _ ^)
              <g>
                <path
                  d="M68,102 Q80,90 92,102"
                  stroke="#0F172A"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M108,102 Q120,90 132,102"
                  stroke="#0F172A"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ) : emotion === 'celebrate' ? (
              // Sparkly star eyes
              <g>
                <g transform="translate(80, 98) scale(0.9)">
                  <path
                    d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z"
                    fill="#F59E0B"
                  />
                  <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
                </g>
                <g transform="translate(120, 98) scale(0.9)">
                  <path
                    d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z"
                    fill="#F59E0B"
                  />
                  <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
                </g>
              </g>
            ) : emotion === 'thinking' ? (
              // Eyes glancing up-right with curious expression
              <g className="kodi-eye-blink">
                {/* Left Eye */}
                <ellipse cx="80" cy="98" rx="8" ry="11" fill="#0F172A" />
                <circle cx="83" cy="94" r="3.5" fill="#FFFFFF" />
                <circle cx="78" cy="103" r="1.8" fill="#FFFFFF" />
                {/* Right Eye */}
                <ellipse cx="120" cy="98" rx="8" ry="11" fill="#0F172A" />
                <circle cx="123" cy="94" r="3.5" fill="#FFFFFF" />
                <circle cx="118" cy="103" r="1.8" fill="#FFFFFF" />
              </g>
            ) : (
              // Standard Glossy Anime / Duolingo Eyes with Automatic Blink
              <g className="kodi-eye-blink">
                {/* Left Eye */}
                <ellipse cx="80" cy="99" rx="8" ry="11" fill="#0F172A" />
                <circle cx="77" cy="95" r="3.5" fill="#FFFFFF" />
                <circle cx="83" cy="103" r="1.8" fill="#FFFFFF" />

                {/* Right Eye */}
                <ellipse cx="120" cy="99" rx="8" ry="11" fill="#0F172A" />
                <circle cx="117" cy="95" r="3.5" fill="#FFFFFF" />
                <circle cx="123" cy="103" r="1.8" fill="#FFFFFF" />
              </g>
            )}

            {/* ── MODULAR HANDS & PROPS ── */}
            {emotion === 'coding' ? (
              // Paws holding a sleek glowing laptop with terminal prompt (>_)
              <g>
                {/* Laptop Body */}
                <rect
                  x="72"
                  y="142"
                  width="56"
                  height="34"
                  rx="5"
                  fill="#1E293B"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                {/* Screen */}
                <rect
                  x="76"
                  y="146"
                  width="48"
                  height="26"
                  rx="3"
                  fill="url(#kodi-laptop-screen)"
                />
                {/* CodeAbroad Terminal Prompt on screen */}
                <text
                  x="80"
                  y="160"
                  fontSize="8"
                  fontFamily="monospace"
                  fill="#38BDF8"
                  fontWeight="bold"
                >
                  &gt;_ Go
                </text>
                {/* Keyboard edge */}
                <path
                  d="M66,176 L134,176 L128,184 L72,184 Z"
                  fill="#0F172A"
                />
                {/* Cute dark paws resting on laptop edges */}
                <ellipse cx="68" cy="162" rx="7" ry="5.5" fill="#9A3412" />
                <ellipse cx="132" cy="162" rx="7" ry="5.5" fill="#9A3412" />
              </g>
            ) : emotion === 'celebrate' ? (
              // Both arms raised triumphantly in the air (\o/)
              <g>
                <path
                  d="M52,130 Q36,104 42,94 Q50,92 58,114 Z"
                  fill="#C2410C"
                />
                <circle cx="43" cy="96" r="6" fill="#9A3412" />

                <path
                  d="M148,130 Q164,104 158,94 Q150,92 142,114 Z"
                  fill="#C2410C"
                />
                <circle cx="157" cy="96" r="6" fill="#9A3412" />
              </g>
            ) : emotion === 'thinking' ? (
              // One paw tapping chin pensively
              <g>
                <path
                  d="M52,135 Q44,155 58,162 Z"
                  fill="#C2410C"
                />
                {/* Hand on chin */}
                <path
                  d="M148,135 Q140,140 120,132"
                  stroke="#C2410C"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="118" cy="132" r="5.5" fill="#9A3412" />
              </g>
            ) : (
              // Friendly Wave: Left paw waving hello
              <g>
                <path
                  d="M52,135 Q38,115 44,105 Q52,104 58,124 Z"
                  fill="#C2410C"
                />
                <circle cx="45" cy="107" r="6" fill="#9A3412" />

                {/* Right hand resting on hip */}
                <ellipse cx="140" cy="148" rx="6.5" ry="5" fill="#9A3412" />
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  )
}
