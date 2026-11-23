import type { FC } from 'react'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'

export interface AlphabetFoundationIllustrationProps {
  className?: string
}

/**
 * Rich editorial mascot + 3-script illustration for the Curriculum Alphabet Foundation banner:
 * Fanned 3D Japanese script tiles (あ / ア / 漢), calligraphy brush, sakura & Kodi writing.
 */
export const AlphabetFoundationIllustration: FC<AlphabetFoundationIllustrationProps> = ({
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-end w-[216px] h-[88px] select-none pointer-events-none ${className}`.trim()}
    >
      <div className="absolute left-2 top-1 w-24 h-20 rounded-full bg-emerald-300/25 blur-xl" />
      <div className="absolute right-2 bottom-1 w-20 h-20 rounded-full bg-amber-300/20 blur-xl" />

      <svg
        viewBox="0 0 138 78"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[138px] h-[78px] shrink-0 -mr-4 drop-shadow-xs"
      >
        {/* Brush Ink Swirl Backdrop */}
        <path
          d="M12 52C38 40 72 46 124 30"
          stroke="#10B981"
          strokeWidth="5.5"
          strokeOpacity="0.18"
          strokeLinecap="round"
        />

        {/* Tile 1: Hiragana あ (Emerald) */}
        <g transform="rotate(-10 34 38)">
          <rect
            x="16"
            y="14"
            width="36"
            height="44"
            rx="9"
            fill="#ECFDF5"
            stroke="#059669"
            strokeWidth="2.2"
          />
          <rect x="17.5" y="15.5" width="33" height="5.5" rx="2.75" fill="#10B981" />
          <text
            x="34"
            y="44"
            textAnchor="middle"
            fill="#065F46"
            fontSize="19"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            あ
          </text>
          <rect x="25" y="50" width="18" height="2.8" rx="1.4" fill="#A7F3D0" />
        </g>

        {/* Tile 2: Katakana ア (Sky Blue) */}
        <g transform="rotate(-1 69 34)">
          <rect
            x="50"
            y="9"
            width="38"
            height="46"
            rx="9"
            fill="#F0F9FF"
            stroke="#0284C7"
            strokeWidth="2.2"
          />
          <rect x="51.5" y="10.5" width="35" height="5.5" rx="2.75" fill="#0EA5E9" />
          <text
            x="69"
            y="40"
            textAnchor="middle"
            fill="#0369A1"
            fontSize="19"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            ア
          </text>
          <rect x="59" y="46" width="20" height="2.8" rx="1.4" fill="#BAE6FD" />
        </g>

        {/* Tile 3: Kanji 漢 (Amber) */}
        <g transform="rotate(9 104 38)">
          <rect
            x="85"
            y="14"
            width="37"
            height="44"
            rx="9"
            fill="#FFFBEB"
            stroke="#D97706"
            strokeWidth="2.2"
          />
          <rect x="86.5" y="15.5" width="34" height="5.5" rx="2.75" fill="#F59E0B" />
          <text
            x="103.5"
            y="44"
            textAnchor="middle"
            fill="#92400E"
            fontSize="18"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            漢
          </text>
          <rect x="94" y="50" width="19" height="2.8" rx="1.4" fill="#FDE68A" />
        </g>

        {/* Miniature Calligraphy Brush */}
        <g transform="rotate(-16 32 64)">
          <rect
            x="12"
            y="61.5"
            width="34"
            height="5"
            rx="2.5"
            fill="#92400E"
            stroke="#1E293B"
            strokeWidth="1.4"
          />
          <rect
            x="40"
            y="61.5"
            width="5.5"
            height="5"
            rx="1"
            fill="#E2E8F0"
            stroke="#1E293B"
            strokeWidth="1.2"
          />
          <path d="M45.5 61.8L53 64L45.5 66.2Z" fill="#0F172A" />
        </g>

        {/* Sakura Petal & Sparkles */}
        <ellipse
          cx="124"
          cy="58"
          rx="4.2"
          ry="2.5"
          transform="rotate(-24 124 58)"
          fill="#FDA4AF"
        />
        <path
          d="M18 8L19.2 10.8L22 12L19.2 13.2L18 16L16.8 13.2L14 12L16.8 10.8Z"
          fill="#FBBF24"
        />
        <path
          d="M123 7L124 9.2L126.2 10.2L124 11.2L123 13.4L122 11.2L119.8 10.2L122 9.2Z"
          fill="#10B981"
        />
      </svg>

      {/* Foreground Mascot Kodi Writing */}
      <div className="relative z-10 drop-shadow-sm">
        <KodiCharacter emotion="writing" size={78} />
      </div>
    </div>
  )
}

export interface UnitBannerIllustrationProps {
  unitNumber: number
  className?: string
}

/**
 * Thematic multi-element Japanese landmark illustration for sticky Unit Banner headers:
 * - Unit 1: Torii gate, blooming Sakura tree, rising sun & あ scroll
 * - Unit 2: Yatai street-food Chochin lantern stall, Matcha cup & sakura
 * - Unit 3: Shinkansen train on viaduct, Tokyo Tower & station clock
 * - Unit 4+: Mount Fuji snow peak, crimson Pagoda & golden Ema plaque
 */
export const UnitBannerIllustration: FC<UnitBannerIllustrationProps> = ({
  unitNumber,
  className = '',
}) => {
  const themeVariant = ((Math.max(1, unitNumber) - 1) % 4) + 1

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center w-[144px] h-[78px] select-none pointer-events-none overflow-hidden ${className}`.trim()}
    >
      {themeVariant === 1 && (
        <svg viewBox="0 0 144 78" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Rising Sun + Soft Japanese Clouds */}
          <circle cx="92" cy="24" r="15" fill="#FDE68A" fillOpacity="0.9" />
          <circle cx="92" cy="24" r="21" fill="#FDE68A" fillOpacity="0.2" />
          <path
            d="M12 22C12 19 15 17 18 17C19 14.5 22.5 14 25 15.5C27 14 31 15 31.5 18C34 18.5 35 22 32.5 23.5H15C13 23.5 12 22.8 12 22Z"
            fill="#FFFFFF"
            fillOpacity="0.82"
          />
          <path
            d="M112 16C112 14 114 12.5 116.5 12.5C117.5 10.5 120 10.2 122 11.4C123.5 10.2 126.5 11 127 13.2C128.8 13.6 129.5 16 127.8 17H114C112.6 17 112 16.5 112 16Z"
            fill="#FFFFFF"
            fillOpacity="0.72"
          />
          {/* Blooming Sakura Tree Left */}
          <path d="M23 64C23 54 25 48 28 42" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="22" cy="40" r="10" fill="#FDA4AF" />
          <circle cx="31" cy="37" r="9" fill="#FECDD3" />
          <circle cx="27" cy="45" r="7.5" fill="#FB7185" fillOpacity="0.65" />
          {/* Crimson Torii Gate */}
          <path
            d="M46 27C65 31 85 31 104 27L106 23C85 26.5 65 26.5 44 23L46 27Z"
            fill="#EF4444"
            stroke="#1E293B"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <rect x="50" y="32" width="50" height="4.5" rx="2" fill="#DC2626" stroke="#1E293B" strokeWidth="1.5" />
          <rect x="56" y="28" width="6.5" height="36" rx="2" fill="#EF4444" stroke="#1E293B" strokeWidth="1.6" />
          <rect x="87.5" y="28" width="6.5" height="36" rx="2" fill="#EF4444" stroke="#1E293B" strokeWidth="1.6" />
          <rect x="72" y="28" width="6" height="5" fill="#B91C1C" stroke="#1E293B" strokeWidth="1.2" />
          {/* Mini あ Scroll Plaque */}
          <rect x="110" y="42" width="24" height="24" rx="7" fill="#FFFBEB" stroke="#1E293B" strokeWidth="1.7" />
          <text
            x="122"
            y="59"
            textAnchor="middle"
            fill="#065F46"
            fontSize="13.5"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            あ
          </text>
        </svg>
      )}

      {themeVariant === 2 && (
        <svg viewBox="0 0 144 78" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="42" cy="38" r="22" fill="#FCD34D" fillOpacity="0.24" />
          {/* Yatai Awning + Noren */}
          <path d="M12 18H82L78 28H16L12 18Z" fill="#2563EB" stroke="#1E293B" strokeWidth="1.6" />
          <rect x="20" y="28" width="14" height="12" rx="2" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.4" />
          <rect x="37" y="28" width="14" height="12" rx="2" fill="#DBEAFE" stroke="#1E293B" strokeWidth="1.4" />
          <rect x="54" y="28" width="14" height="12" rx="2" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.4" />
          {/* Chochin Paper Lantern */}
          <line x1="88" y1="8" x2="88" y2="16" stroke="#F8FAFC" strokeWidth="2" />
          <rect x="81" y="15" width="14" height="3.5" rx="1.5" fill="#1E293B" />
          <ellipse cx="88" cy="35" rx="12" ry="16" fill="#FB7185" stroke="#1E293B" strokeWidth="1.7" />
          <rect x="81" y="50" width="14" height="3.5" rx="1.5" fill="#1E293B" />
          <text
            x="88"
            y="39"
            textAnchor="middle"
            fill="#FFFBEB"
            fontSize="11.5"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            茶
          </text>
          {/* Steaming Matcha Cup */}
          <path d="M106 46H132V52C132 59 126 64 119 64C112 64 106 59 106 52V46Z" fill="#ECFDF5" stroke="#1E293B" strokeWidth="1.7" />
          <ellipse cx="119" cy="46" rx="13" ry="3.5" fill="#34D399" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M132 49C137 49 137 56 132 56" stroke="#1E293B" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M114 39C113 35 116 33 115 29M123 38C122 34 125 32 124 28" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.85" />
        </svg>
      )}

      {themeVariant === 3 && (
        <svg viewBox="0 0 144 78" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Tokyo Skyline Silhouette */}
          <rect x="14" y="24" width="12" height="36" rx="1.5" fill="#FFFFFF" fillOpacity="0.22" />
          <rect x="30" y="16" width="14" height="44" rx="1.5" fill="#FFFFFF" fillOpacity="0.28" />
          <path d="M62 54L67 16H71L76 54H62Z" fill="#FB7185" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="69" y1="9" x2="69" y2="16" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          {/* Station Clock Badge */}
          <circle cx="112" cy="22" r="11" fill="#FFFBEB" stroke="#1E293B" strokeWidth="1.6" />
          <path d="M112 16V22L116 24.5" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
          {/* Shinkansen Bullet Train */}
          <path d="M12 47H96C112 47 126 54 129 63H12V47Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M12 56H124" stroke="#2563EB" strokeWidth="3.5" />
          <path d="M100 49L114 53.5H100V49Z" fill="#0F172A" />
          <rect x="22" y="50" width="10" height="4" rx="1.2" fill="#38BDF8" />
          <rect x="37" y="50" width="10" height="4" rx="1.2" fill="#38BDF8" />
          <rect x="52" y="50" width="10" height="4" rx="1.2" fill="#38BDF8" />
          <rect x="67" y="50" width="10" height="4" rx="1.2" fill="#38BDF8" />
          <rect x="82" y="50" width="10" height="4" rx="1.2" fill="#38BDF8" />
        </svg>
      )}

      {themeVariant === 4 && (
        <svg viewBox="0 0 144 78" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Golden Sun Aura */}
          <circle cx="96" cy="22" r="12" fill="#FDE047" fillOpacity="0.9" />
          {/* Mount Fuji */}
          <path d="M14 66L48 20H64L98 66H14Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M48 20H64L72.5 32L64 28.5L56 34L48.5 28.5L39.5 32L48 20Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.4" strokeLinejoin="round" />
          {/* Crimson Pagoda Silhouette */}
          <path d="M102 36L116 28L130 36H102ZM104 46L116 39L128 46H104Z" fill="#EF4444" stroke="#1E293B" strokeWidth="1.4" strokeLinejoin="round" />
          <rect x="108" y="46" width="16" height="18" fill="#FEF3C7" stroke="#1E293B" strokeWidth="1.5" />
          {/* Soft Clouds */}
          <rect x="12" y="48" width="24" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.82" />
        </svg>
      )}
    </div>
  )
}

export interface UnitTrailheadBannerGraphicProps {
  unitNumber: number
  totalXp: number
}

/**
 * Illustrated trailhead ribbon sitting cleanly above the first lesson node of each unit
 * with Japanese cloud motifs, chapter emblem, and total unit XP crest.
 */
export const UnitTrailheadBannerGraphic: FC<UnitTrailheadBannerGraphicProps> = ({
  unitNumber,
  totalXp,
}) => {
  const unitLabels = [
    'Gerbang Dasar • Fokus Kosakata & Bunyi',
    'Kehidupan Sehari-hari • Latihan Konteks',
    'Navigasi Kota • Pola Kalimat Aktif',
    'Ekspresi Lanjut • Target Ujian Unit',
  ]
  const subtitle = unitLabels[(Math.max(1, unitNumber) - 1) % unitLabels.length]

  return (
    <div
      aria-hidden="true"
      className="max-w-2xl mx-auto px-2 pb-1 flex items-center justify-between gap-3 select-none pointer-events-none"
    >
      <div className="inline-flex items-center gap-2.5 bg-white/95 border-2 border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-[0_2px_0_0_#E2E8F0]">
        <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 shrink-0">
          <circle cx="16" cy="16" r="14" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
          <path
            d="M8 19C12 13 20 13 24 19"
            stroke="#2563EB"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="16" cy="11.5" r="3" fill="#F43F5E" />
          <circle cx="11" cy="21" r="2" fill="#10B981" />
          <circle cx="21" cy="21" r="2" fill="#F59E0B" />
        </svg>
        <span className="text-[11px] sm:text-xs font-brand font-extrabold text-slate-600">
          {subtitle}
        </span>
      </div>

      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200/90 rounded-2xl px-3 py-1.5 shadow-[0_2px_0_0_#FDE68A] shrink-0">
        <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5 shrink-0">
          <circle cx="12" cy="12" r="10" fill="#FBBF24" stroke="#B45309" strokeWidth="1.6" />
          <path
            d="M13 6L8.5 13H12L11 18L15.5 11H12L13 6Z"
            fill="#FFFFFF"
            stroke="#92400E"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-brand font-black text-xs text-amber-900 tabular-nums whitespace-nowrap">
          +{totalXp} XP Unit
        </span>
      </div>
    </div>
  )
}

export interface UnitCanvasAmbientBackdropProps {
  unitNumber: number
  totalHeight: number
}

/**
 * Seamless ambient Japanese garden & sky motifs spanning behind the serpentine path
 * (subtle drifting sakura petals, kasumi mist bands, and hill contours) so the map canvas
 * feels alive instead of flat white without competing with stepping stone nodes.
 */
export const UnitCanvasAmbientBackdrop: FC<UnitCanvasAmbientBackdropProps> = ({
  unitNumber,
  totalHeight,
}) => {
  const paletteVariant = ((Math.max(1, unitNumber) - 1) % 3) as 0 | 1 | 2
  const mistFill =
    paletteVariant === 0 ? '#E0F2FE' : paletteVariant === 1 ? '#FCE7F3' : '#ECFDF5'
  const hillFill =
    paletteVariant === 0 ? '#F0FDF4' : paletteVariant === 1 ? '#FEF3C7' : '#EFF6FF'
  const petalFill =
    paletteVariant === 0 ? '#FDA4AF' : paletteVariant === 1 ? '#FCA5A5' : '#93C5FD'

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 640 ${Math.max(360, totalHeight)}`}
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 opacity-75"
    >
      {/* Gentle rolling silhouette band */}
      <path
        d={`M0 ${Math.round(totalHeight * 0.72)} Q180 ${Math.round(totalHeight * 0.56)} 340 ${Math.round(totalHeight * 0.68)} T640 ${Math.round(totalHeight * 0.62)} L640 ${totalHeight} L0 ${totalHeight} Z`}
        fill={hillFill}
        fillOpacity="0.48"
      />
      {/* Soft Kasumi mist bands */}
      <rect x="28" y="42" width="142" height="16" rx="8" fill={mistFill} fillOpacity="0.42" />
      <rect x="52" y="54" width="96" height="12" rx="6" fill={mistFill} fillOpacity="0.34" />
      <rect
        x="456"
        y={Math.max(96, Math.round(totalHeight * 0.44))}
        width="156"
        height="18"
        rx="9"
        fill={mistFill}
        fillOpacity="0.4"
      />
      <rect
        x="492"
        y={Math.max(110, Math.round(totalHeight * 0.44) + 14)}
        width="104"
        height="12"
        rx="6"
        fill={mistFill}
        fillOpacity="0.3"
      />
      {/* Drifting botanical petals & wind arcs */}
      <ellipse cx="118" cy="112" rx="5.5" ry="2.8" transform="rotate(-24 118 112)" fill={petalFill} fillOpacity="0.55" />
      <ellipse cx="524" cy="76" rx="4.5" ry="2.5" transform="rotate(22 524 76)" fill={petalFill} fillOpacity="0.5" />
      <ellipse
        cx="164"
        cy={Math.max(160, Math.round(totalHeight * 0.64))}
        rx="5"
        ry="2.6"
        transform="rotate(14 164 160)"
        fill={petalFill}
        fillOpacity="0.48"
      />
      <ellipse
        cx="468"
        cy={Math.max(210, Math.round(totalHeight * 0.82))}
        rx="5"
        ry="2.5"
        transform="rotate(-18 468 210)"
        fill={petalFill}
        fillOpacity="0.45"
      />
      <path
        d={`M48 ${Math.max(120, Math.round(totalHeight * 0.36))} Q96 ${Math.max(106, Math.round(totalHeight * 0.36) - 14)} 148 ${Math.max(120, Math.round(totalHeight * 0.36))}`}
        stroke="#CBD5E1"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        strokeOpacity="0.45"
      />
      <path
        d={`M490 ${Math.max(180, Math.round(totalHeight * 0.72))} Q536 ${Math.max(166, Math.round(totalHeight * 0.72) - 14)} 588 ${Math.max(180, Math.round(totalHeight * 0.72))}`}
        stroke="#CBD5E1"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        strokeOpacity="0.45"
      />
    </svg>
  )
}

export interface UnitSerpentineLandmarkIslandProps {
  sceneIndex: number
  side: 'left' | 'right'
  topPx: number
}

/**
 * Seamless, borderless Japanese garden/nature scenery illustration placed softly
 * in the open background pockets beside off-center stepping stones (no card border,
 * no badge pill, and distinct motifs from the Unit Banner header icons).
 */
export const UnitSerpentineLandmarkIsland: FC<UnitSerpentineLandmarkIslandProps> = ({
  sceneIndex,
  side,
  topPx,
}) => {
  const variant = ((sceneIndex % 6) + 6) % 6

  return (
    <div
      aria-hidden="true"
      style={{ top: `${Math.max(4, topPx - 64)}px` }}
      className={`hidden md:flex items-center justify-center absolute ${
        side === 'left' ? 'left-0 sm:left-2' : 'right-0 sm:right-2'
      } w-[184px] lg:w-[222px] select-none pointer-events-none z-0 opacity-90`}
    >
      <svg
        viewBox="0 0 184 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-[112px] lg:h-[128px]"
      >
        {/* Soft borderless ambient halo blends right into dotted background */}
        <ellipse cx="92" cy="96" rx="74" ry="20" fill="#E2E8F0" fillOpacity="0.32" />

        {/* Variant 0: Blooming Sakura Tree + Garden Moss Mound + Falling Petals */}
        {variant === 0 && (
          <>
            <ellipse cx="92" cy="98" rx="66" ry="13" fill="#DCFCE7" fillOpacity="0.72" />
            <path d="M54 96C54 78 60 66 72 52M64 74C76 68 86 64 96 54" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
            <circle cx="58" cy="48" r="22" fill="#FBCFE8" fillOpacity="0.88" />
            <circle cx="84" cy="40" r="20" fill="#FDA4AF" fillOpacity="0.82" />
            <circle cx="106" cy="50" r="17" fill="#FECDD3" fillOpacity="0.9" />
            <circle cx="42" cy="58" r="14" fill="#FECDD3" fillOpacity="0.85" />
            {/* Soft Moss Stepping Stones */}
            <ellipse cx="128" cy="94" rx="14" ry="6" fill="#CBD5E1" fillOpacity="0.75" />
            <ellipse cx="148" cy="102" rx="10" ry="4.5" fill="#94A3B8" fillOpacity="0.45" />
            {/* Drifting Sakura Petals */}
            <ellipse cx="132" cy="44" rx="4.5" ry="2.4" transform="rotate(-24 132 44)" fill="#FB7185" fillOpacity="0.75" />
            <ellipse cx="146" cy="64" rx="4" ry="2.2" transform="rotate(18 146 64)" fill="#FDA4AF" fillOpacity="0.85" />
            <ellipse cx="116" cy="76" rx="4.2" ry="2.2" transform="rotate(-12 116 76)" fill="#FB7185" fillOpacity="0.65" />
          </>
        )}

        {/* Variant 1: Ishi-dōrō Stone Garden Lantern & Swaying Bamboo */}
        {variant === 1 && (
          <>
            <ellipse cx="92" cy="100" rx="64" ry="12" fill="#ECFDF5" fillOpacity="0.75" />
            {/* Bamboo Stalks */}
            <rect x="40" y="24" width="8" height="72" rx="3" fill="#6EE7B7" fillOpacity="0.85" />
            <rect x="54" y="16" width="9" height="80" rx="3" fill="#34D399" fillOpacity="0.8" />
            <path d="M40 44H48M40 66H48M54 36H63M54 60H63" stroke="#059669" strokeWidth="1.8" strokeOpacity="0.6" />
            <ellipse cx="32" cy="36" rx="11" ry="4" transform="rotate(-25 32 36)" fill="#34D399" fillOpacity="0.65" />
            <ellipse cx="70" cy="28" rx="11" ry="4" transform="rotate(20 70 28)" fill="#6EE7B7" fillOpacity="0.7" />
            {/* Traditional Stone Lantern */}
            <rect x="108" y="88" width="22" height="9" rx="3" fill="#94A3B8" fillOpacity="0.7" />
            <rect x="114" y="64" width="10" height="24" rx="2" fill="#CBD5E1" fillOpacity="0.85" />
            <rect x="106" y="48" width="26" height="16" rx="3" fill="#E2E8F0" />
            <rect x="114" y="52" width="10" height="9" rx="1.5" fill="#FDE047" />
            <path d="M98 48L119 32L140 48H98Z" fill="#94A3B8" />
            <circle cx="119" cy="29" r="3.5" fill="#94A3B8" />
          </>
        )}

        {/* Variant 2: Tranquil Koi Pond, Lily Pads & Swimming Koi */}
        {variant === 2 && (
          <>
            <ellipse cx="92" cy="84" rx="70" ry="26" fill="#BAE6FD" fillOpacity="0.58" />
            <ellipse cx="92" cy="84" rx="58" ry="20" fill="#7DD3FC" fillOpacity="0.42" />
            {/* Lotus Lily Pads & Flower */}
            <circle cx="52" cy="80" r="12" fill="#4ADE80" fillOpacity="0.72" />
            <circle cx="132" cy="88" r="11" fill="#34D399" fillOpacity="0.7" />
            <path d="M52 72C49 65 55 63 52 60C58 63 60 68 55 72Z" fill="#FDA4AF" />
            {/* Swimming Koi */}
            <path d="M74 78C86 72 98 74 106 80C98 86 86 88 74 82Z" fill="#FB923C" fillOpacity="0.92" />
            <path d="M74 80L64 74L66 80L64 86L74 80Z" fill="#F97316" fillOpacity="0.85" />
            <circle cx="99" cy="79" r="1.5" fill="#1E293B" />
            {/* Soft Water Ripples */}
            <ellipse cx="94" cy="96" rx="22" ry="4" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.72" />
          </>
        )}

        {/* Variant 3: Autumn Momiji Maple Tree & Layered Soft Hills */}
        {variant === 3 && (
          <>
            <path d="M24 100C48 76 132 76 160 100H24Z" fill="#FEF3C7" fillOpacity="0.75" />
            <path d="M92 98C92 80 88 66 76 54M92 78C104 70 112 64 118 54" stroke="#78350F" strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="74" cy="48" r="20" fill="#FB7185" fillOpacity="0.85" />
            <circle cx="102" cy="44" r="18" fill="#F97316" fillOpacity="0.8" />
            <circle cx="120" cy="56" r="15" fill="#FBBF24" fillOpacity="0.85" />
            <circle cx="56" cy="60" r="13" fill="#F87171" fillOpacity="0.82" />
            {/* Falling Momiji Leaves */}
            <circle cx="140" cy="42" r="3" fill="#EF4444" fillOpacity="0.7" />
            <circle cx="44" cy="84" r="2.8" fill="#F59E0B" fillOpacity="0.75" />
            <circle cx="134" cy="78" r="3.2" fill="#FB7185" fillOpacity="0.72" />
          </>
        )}

        {/* Variant 4: Zen Shishi-odoshi Bamboo Fountain & Garden Rocks */}
        {variant === 4 && (
          <>
            <ellipse cx="92" cy="98" rx="64" ry="13" fill="#E0F2FE" fillOpacity="0.72" />
            <ellipse cx="64" cy="90" rx="24" ry="12" fill="#94A3B8" fillOpacity="0.55" />
            <ellipse cx="126" cy="92" rx="18" ry="10" fill="#64748B" fillOpacity="0.45" />
            {/* Bamboo Spout & Tilt Pipe */}
            <rect x="64" y="42" width="10" height="48" rx="3" fill="#10B981" fillOpacity="0.8" />
            <rect x="64" y="40" width="38" height="9" rx="4" fill="#34D399" fillOpacity="0.88" />
            <rect x="96" y="46" width="10" height="44" rx="3" fill="#059669" fillOpacity="0.82" />
            <rect x="78" y="64" width="46" height="9" rx="4" transform="rotate(-18 98 68)" fill="#6EE7B7" fillOpacity="0.92" />
            {/* Flowing Water Stream */}
            <path d="M100 49C102 60 100 72 94 84" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.78" />
          </>
        )}

        {/* Variant 5: Sculpted Bonsai Pine, Garden Bench & Kasumi Clouds */}
        {variant === 5 && (
          <>
            <ellipse cx="92" cy="100" rx="66" ry="12" fill="#DCFCE7" fillOpacity="0.68" />
            <rect x="26" y="24" width="66" height="12" rx="6" fill="#E0F2FE" fillOpacity="0.55" />
            {/* Bonsai Tree */}
            <path d="M58 96C62 80 54 68 68 54C74 48 84 46 92 42" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="92" cy="40" rx="24" ry="11" fill="#10B981" fillOpacity="0.85" />
            <ellipse cx="60" cy="54" rx="17" ry="9" fill="#34D399" fillOpacity="0.82" />
            <ellipse cx="106" cy="56" rx="16" ry="8" fill="#059669" fillOpacity="0.75" />
            {/* Minimal Wooden Garden Bench */}
            <rect x="108" y="82" width="46" height="6" rx="2" fill="#D97706" fillOpacity="0.85" />
            <rect x="114" y="88" width="4" height="10" rx="1" fill="#78350F" fillOpacity="0.75" />
            <rect x="144" y="88" width="4" height="10" rx="1" fill="#78350F" fillOpacity="0.75" />
          </>
        )}
      </svg>
    </div>
  )
}
