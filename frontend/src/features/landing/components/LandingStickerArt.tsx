import { useId, type FC, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export type StickerArtKind =
  | 'book'
  | 'check-medal'
  | 'star-target'
  | 'headphones'
  | 'brush'
  | 'clock'
  | 'speech'
  | 'lightbulb'
  | 'sparkle-cards'
  | 'briefcase'
  | 'campus-cap'
  | 'train-ticket'
  | 'cafe-cup'
  | 'certificate'

export interface StickerArtProps {
  kind: StickerArtKind
  size?: number
  className?: string
}

function sanitizeSvgId(rawId: string): string {
  return rawId.replace(/[^a-zA-Z0-9_-]/g, '')
}

/**
 * LandingStickerIcon — ClassDojo-style chunky cel-shaded comic vector stickers
 * with bold #1E293B outlines, multi-stop gradients, specular highlights, and
 * white die-cut sticker contours.
 */
export const LandingStickerIcon: FC<StickerArtProps> = ({
  kind,
  size = 56,
  className = '',
}) => {
  const rawId = useId()
  const uid = sanitizeSvgId(rawId)

  const renderArtwork = () => {
    switch (kind) {
      case 'book': {
        const coverGrad = `${uid}-book-cover`
        const pageGrad = `${uid}-book-page`
        const ribbonGrad = `${uid}-book-ribbon`
        return (
          <>
            <defs>
              <linearGradient id={coverGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id={pageGrad} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="100%" stopColor="#FEF3C7" />
              </linearGradient>
              <linearGradient id={ribbonGrad} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FB7185" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
            </defs>

            <g transform="rotate(-4 32 32)">
              {/* White die-cut sticker rim */}
              <path
                d="M 9 18 C 9 15 12 13 15 13 L 32 16 L 49 13 C 52 13 55 15 55 18 L 55 47 C 55 50 52 52 49 52 L 45 51 L 45 58 L 41 55 L 37 58 L 37 50 L 32 51 L 15 52 C 12 52 9 50 9 47 Z"
                fill="#FFFFFF"
                stroke="#FFFFFF"
                strokeWidth="6"
                strokeLinejoin="round"
              />

              {/* Cobalt hardcover outer shell */}
              <rect
                x="9"
                y="14"
                width="46"
                height="37"
                rx="5"
                fill={`url(#${coverGrad})`}
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Left cream open page */}
              <path
                d="M 13 16 C 20 13 27 14 32 18 L 32 47 C 27 44 20 44 13 46 Z"
                fill={`url(#${pageGrad})`}
                stroke="#1E293B"
                strokeWidth="2.3"
                strokeLinejoin="round"
              />

              {/* Right cream open page */}
              <path
                d="M 51 16 C 44 13 37 14 32 18 L 32 47 C 37 44 44 44 51 46 Z"
                fill={`url(#${pageGrad})`}
                stroke="#1E293B"
                strokeWidth="2.3"
                strokeLinejoin="round"
              />

              {/* Page rule lines */}
              <path
                d="M 17 24 Q 23 22.5 28 24.5 M 17 31 Q 23 29.5 28 31.5 M 17 38 Q 23 36.5 28 38.5"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 36 24.5 Q 41 22.5 47 24 M 36 31.5 Q 41 29.5 47 31"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Coral ribbon bookmark draping cleanly */}
              <path
                d="M 38 38 L 45 38 L 45 57 L 41.5 53.5 L 38 57 Z"
                fill={`url(#${ribbonGrad})`}
                stroke="#1E293B"
                strokeWidth="2.3"
                strokeLinejoin="round"
              />

              {/* Specular shine & golden sparkle */}
              <path
                d="M 16 18 Q 22 16 27 18"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 14 7 L 15.6 10.4 L 19 12 L 15.6 13.6 L 14 17 L 12.4 13.6 L 9 12 L 12.4 10.4 Z"
                fill="#FACC15"
                stroke="#1E293B"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </g>
          </>
        )
      }

      case 'check-medal': {
        const badgeGrad = `${uid}-medal-grad`
        const coreGrad = `${uid}-medal-core`
        return (
          <>
            <defs>
              <linearGradient id={badgeGrad} x1="15%" y1="10%" x2="85%" y2="90%">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="55%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id={coreGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>

            {/* Scalloped seal silhouette */}
            <path
              d="M 32 7 L 38 11 L 45 9 L 48 16 L 55 18 L 54 25 L 58 32 L 54 39 L 55 46 L 48 48 L 45 55 L 38 53 L 32 57 L 26 53 L 19 55 L 16 48 L 9 46 L 10 39 L 6 32 L 10 25 L 9 18 L 16 16 L 19 9 L 26 11 Z"
              fill="#FFFFFF"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <path
              d="M 32 7 L 38 11 L 45 9 L 48 16 L 55 18 L 54 25 L 58 32 L 54 39 L 55 46 L 48 48 L 45 55 L 38 53 L 32 57 L 26 53 L 19 55 L 16 48 L 9 46 L 10 39 L 6 32 L 10 25 L 9 18 L 16 16 L 19 9 L 26 11 Z"
              fill={`url(#${badgeGrad})`}
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Inner emerald core ring */}
            <circle
              cx="32"
              cy="32"
              r="16.5"
              fill={`url(#${coreGrad})`}
              stroke="#ECFDF5"
              strokeWidth="2.4"
            />

            {/* Top glossy highlight arc */}
            <path
              d="M 21 23 A 13 13 0 0 1 40 20"
              stroke="#FFFFFF"
              strokeOpacity="0.48"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Chunky 3D white checkmark */}
            <path
              d="M 22.5 33.5 L 29 40 L 42 26"
              stroke="#064E3B"
              strokeOpacity="0.35"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(0, 1.8)"
            />
            <path
              d="M 22.5 33.5 L 29 40 L 42 26"
              stroke="#FFFFFF"
              strokeWidth="5.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Golden 4-point sparkle */}
            <path
              d="M 52 7 L 53.6 10.4 L 57 12 L 53.6 13.6 L 52 17 L 50.4 13.6 L 47 12 L 50.4 10.4 Z"
              fill="#FACC15"
              stroke="#1E293B"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </>
        )
      }

      case 'star-target': {
        const ringGrad = `${uid}-target-ring`
        const starGrad = `${uid}-target-star`
        return (
          <>
            <defs>
              <linearGradient id={ringGrad} x1="15%" y1="10%" x2="85%" y2="90%">
                <stop offset="0%" stopColor="#7DD3FC" />
                <stop offset="55%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id={starGrad} x1="20%" y1="10%" x2="85%" y2="90%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>

            {/* White sticker contour */}
            <circle
              cx="32"
              cy="32"
              r="24"
              fill="#FFFFFF"
              stroke="#FFFFFF"
              strokeWidth="6"
            />

            {/* Glossy sky-blue compass/target ring */}
            <circle
              cx="32"
              cy="32"
              r="24"
              fill={`url(#${ringGrad})`}
              stroke="#1E293B"
              strokeWidth="2.5"
            />
            <circle
              cx="32"
              cy="32"
              r="16.5"
              fill="#FFFFFF"
              stroke="#1E293B"
              strokeWidth="2.2"
            />

            {/* Compass tick accents */}
            <g stroke="#0369A1" strokeWidth="2.4" strokeLinecap="round">
              <line x1="32" y1="10" x2="32" y2="14" />
              <line x1="32" y1="50" x2="32" y2="54" />
              <line x1="10" y1="32" x2="14" y2="32" />
              <line x1="50" y1="32" x2="54" y2="32" />
            </g>

            {/* Plump golden-amber star */}
            <path
              d="M 32 14.5 L 36.8 24.4 L 47.8 26 L 39.8 33.7 L 41.7 44.6 L 32 39.4 L 22.3 44.6 L 24.2 33.7 L 16.2 26 L 27.2 24.4 Z"
              fill={`url(#${starGrad})`}
              stroke="#1E293B"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path
              d="M 27.5 26.5 L 31.8 18.5"
              stroke="#FFFFFF"
              strokeOpacity="0.65"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </>
        )
      }

      case 'headphones': {
        const bandGrad = `${uid}-hp-band`
        const cupGrad = `${uid}-hp-cup`
        return (
          <>
            <defs>
              <linearGradient id={bandGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id={cupGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
            </defs>

            {/* White sticker silhouette */}
            <path
              d="M 14 34 C 14 18 22 11 32 11 C 42 11 50 18 50 34 L 53 35 C 56 35 58 38 58 41 L 58 47 C 58 51 55 54 51 54 L 46 54 C 44 54 43 52 43 49 L 43 37 C 43 35 44 33 46 33 L 46 31 C 46 21 40 17 32 17 C 24 17 18 21 18 31 L 18 33 C 20 33 21 35 21 37 L 21 49 C 21 52 20 54 18 54 L 13 54 C 9 54 6 51 6 47 L 6 41 C 6 38 8 35 11 35 Z"
              fill="#FFFFFF"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinejoin="round"
            />

            {/* Soundwave arcs */}
            <path
              d="M 27 8.5 Q 32 5 37 8.5"
              stroke="#F59E0B"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M 23 5.5 Q 32 0.5 41 5.5"
              stroke="#38BDF8"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Thick arched cobalt headband */}
            <path
              d="M 14 35 C 14 18 22 12 32 12 C 42 12 50 18 50 35"
              fill="none"
              stroke="#1E293B"
              strokeWidth="9.5"
              strokeLinecap="round"
            />
            <path
              d="M 14 35 C 14 18 22 12 32 12 C 42 12 50 18 50 35"
              fill="none"
              stroke={`url(#${bandGrad})`}
              strokeWidth="4.8"
              strokeLinecap="round"
            />
            <path
              d="M 22 16 Q 32 11 41 15"
              stroke="#93C5FD"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Left & Right ear-cups */}
            <rect
              x="8"
              y="33"
              width="12"
              height="20"
              rx="6"
              fill={`url(#${cupGrad})`}
              stroke="#1E293B"
              strokeWidth="2.5"
            />
            <rect
              x="16"
              y="35"
              width="5"
              height="16"
              rx="2.5"
              fill="#1E293B"
            />
            <rect
              x="44"
              y="33"
              width="12"
              height="20"
              rx="6"
              fill={`url(#${cupGrad})`}
              stroke="#1E293B"
              strokeWidth="2.5"
            />
            <rect
              x="43"
              y="35"
              width="5"
              height="16"
              rx="2.5"
              fill="#1E293B"
            />

            {/* Specular ear-cup shine */}
            <path d="M 11.5 37 L 11.5 43" stroke="#FFFFFF" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
            <path d="M 52.5 37 L 52.5 43" stroke="#FFFFFF" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
          </>
        )
      }

      case 'brush': {
        const inkGrad = `${uid}-brush-ink`
        const woodGrad = `${uid}-brush-wood`
        const tipGrad = `${uid}-brush-tip`
        return (
          <>
            <defs>
              <linearGradient id={inkGrad} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB7185" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
              <linearGradient id={woodGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <linearGradient id={tipGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#0F766E" />
              </linearGradient>
            </defs>

            {/* White die-cut base */}
            <g stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" fill="#FFFFFF">
              <path d="M 10 47 C 19 37 29 53 40 46 C 47 42 52 45 55 48" fill="none" strokeWidth="11" />
              <path d="M 48 10 L 54 16 L 29 41 L 20 45 L 23 36 Z" />
            </g>

            {/* Swirling coral ink ribbon */}
            <path
              d="M 10 47 C 19 37 29 53 40 46 C 47 42 52 45 55 48"
              fill="none"
              stroke="#1E293B"
              strokeWidth="8.5"
              strokeLinecap="round"
            />
            <path
              d="M 10 47 C 19 37 29 53 40 46 C 47 42 52 45 55 48"
              fill="none"
              stroke={`url(#${inkGrad})`}
              strokeWidth="4.4"
              strokeLinecap="round"
            />

            {/* Wooden calligraphy handle */}
            <path
              d="M 48 10 C 51 8 55 12 53 15 L 34 34 L 29 29 Z"
              fill={`url(#${woodGrad})`}
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Metallic silver ferrule */}
            <path
              d="M 29 29 L 34 34 L 29 39 L 24 34 Z"
              fill="#E2E8F0"
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Lush emerald/teal bristle tip */}
            <path
              d="M 24 34 L 29 39 C 26 44 20 46 17 45 C 18 41 20 36 24 34 Z"
              fill={`url(#${tipGrad})`}
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M 38 20 L 47 12"
              stroke="#FEF3C7"
              strokeOpacity="0.65"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </>
        )
      }

      case 'clock': {
        const bezelGrad = `${uid}-clock-bezel`
        const bellGrad = `${uid}-clock-bell`
        return (
          <>
            <defs>
              <linearGradient id={bezelGrad} x1="15%" y1="10%" x2="85%" y2="90%">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="55%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id={bellGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* White die-cut base */}
            <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round">
              <circle cx="15" cy="17" r="7" />
              <circle cx="49" cy="17" r="7" />
              <circle cx="32" cy="35" r="20" />
              <line x1="18" y1="50" x2="14" y2="55" strokeLinecap="round" />
              <line x1="46" y1="50" x2="50" y2="55" strokeLinecap="round" />
            </g>

            {/* Bottom feet */}
            <line x1="19" y1="49" x2="14" y2="55" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
            <line x1="45" y1="49" x2="50" y2="55" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

            {/* Top hammer stem */}
            <line x1="32" y1="10" x2="32" y2="16" stroke="#1E293B" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="27" y1="10" x2="37" y2="10" stroke="#1E293B" strokeWidth="3.2" strokeLinecap="round" />

            {/* Twin amber bells */}
            <path
              d="M 10 21 C 9 14 16 10 22 14 L 13 24 Z"
              fill={`url(#${bellGrad})`}
              stroke="#1E293B"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path
              d="M 54 21 C 55 14 48 10 42 14 L 51 24 Z"
              fill={`url(#${bellGrad})`}
              stroke="#1E293B"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />

            {/* Plump mint-green bezel & white face */}
            <circle
              cx="32"
              cy="35"
              r="20"
              fill={`url(#${bezelGrad})`}
              stroke="#1E293B"
              strokeWidth="2.5"
            />
            <circle
              cx="32"
              cy="35"
              r="14.2"
              fill="#FFFFFF"
              stroke="#1E293B"
              strokeWidth="2.2"
            />

            {/* Hour ticks */}
            <g stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
              <line x1="32" y1="23.5" x2="32" y2="25.5" />
              <line x1="32" y1="44.5" x2="32" y2="46.5" />
              <line x1="20.5" y1="35" x2="22.5" y2="35" />
              <line x1="41.5" y1="35" x2="43.5" y2="35" />
            </g>

            {/* Clock hands & center pin */}
            <line x1="32" y1="35" x2="32" y2="26.5" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="32" y1="35" x2="39" y2="38.5" stroke="#F43F5E" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="32" cy="35" r="2.5" fill="#1E293B" />
          </>
        )
      }

      case 'speech': {
        const backGrad = `${uid}-speech-back`
        const frontGrad = `${uid}-speech-front`
        return (
          <>
            <defs>
              <linearGradient id={backGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7DD3FC" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id={frontGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#E0F2FE" />
              </linearGradient>
            </defs>

            {/* White sticker halo */}
            <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round">
              <rect x="24" y="10" width="32" height="24" rx="11" />
              <path d="M 10 21 H 38 C 43 21 47 25 47 30 V 39 C 47 44 43 48 38 48 H 22 L 13 55 L 15 48 H 14 C 9 48 7 44 7 39 V 30 C 7 25 9 21 10 21 Z" />
            </g>

            {/* Back sky-blue bubble */}
            <path
              d="M 24 20 C 24 14 29 10 35 10 H 46 C 52 10 56 14 56 20 V 27 C 56 32 52 36 47 36 L 49 42 L 42 36 H 35 C 29 36 24 32 24 27 Z"
              fill={`url(#${backGrad})`}
              stroke="#1E293B"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />

            {/* Front glossy ice-white speech bubble */}
            <path
              d="M 8 30 C 8 24 12 20 18 20 H 37 C 43 20 47 24 47 30 V 38 C 47 44 43 48 37 48 H 22 L 13 54 L 15 48 C 11 47 8 43 8 38 Z"
              fill={`url(#${frontGrad})`}
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Crisp vector audio waveform dots inside */}
            <rect x="17" y="31" width="4.5" height="6.5" rx="2.25" fill="#2563EB" />
            <rect x="25.2" y="27.5" width="4.5" height="13.5" rx="2.25" fill="#0EA5E9" />
            <rect x="33.5" y="30" width="4.5" height="8.5" rx="2.25" fill="#2563EB" />
          </>
        )
      }

      case 'lightbulb': {
        const bulbGrad = `${uid}-bulb-glow`
        const capGrad = `${uid}-bulb-cap`
        return (
          <>
            <defs>
              <linearGradient id={bulbGrad} x1="20%" y1="10%" x2="85%" y2="90%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="55%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <linearGradient id={capGrad} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>

            {/* White die-cut base */}
            <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
              <path d="M 32 16 C 22 16 16 23 16 31 C 16 37 20 41 23 44 L 24 52 C 24 55 27 57 32 57 C 37 57 40 55 40 52 L 41 44 C 44 41 48 37 48 31 C 48 23 42 16 32 16 Z" />
              <line x1="32" y1="7" x2="32" y2="11" />
              <line x1="14" y1="14" x2="17" y2="17" />
              <line x1="50" y1="14" x2="47" y2="17" />
              <line x1="9" y1="30" x2="13" y2="30" />
              <line x1="55" y1="30" x2="51" y2="30" />
            </g>

            {/* Sun-ray beams */}
            <g stroke="#F59E0B" strokeWidth="3" strokeLinecap="round">
              <line x1="32" y1="6.5" x2="32" y2="11" />
              <line x1="14" y1="13.5" x2="17.5" y2="17" />
              <line x1="50" y1="13.5" x2="46.5" y2="17" />
              <line x1="8.5" y1="29.5" x2="12.5" y2="29.5" />
              <line x1="55.5" y1="29.5" x2="51.5" y2="29.5" />
            </g>

            {/* Glowing warm yellow glass dome */}
            <path
              d="M 32 15.5 C 22.5 15.5 16.5 22.5 16.5 31 C 16.5 36.8 20.2 40.8 23.5 44.2 L 24.5 47.5 H 39.5 L 40.5 44.2 C 43.8 40.8 47.5 36.8 47.5 31 C 47.5 22.5 41.5 15.5 32 15.5 Z"
              fill={`url(#${bulbGrad})`}
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Glossy top-left shine & glowing filament */}
            <path
              d="M 22 25 Q 25 20 30 19.5"
              stroke="#FFFFFF"
              strokeOpacity="0.75"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M 28 45 L 28 36 C 28 33 36 33 36 36 L 36 45"
              fill="none"
              stroke="#B45309"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Slate ribbed screw cap */}
            <rect
              x="24"
              y="47"
              width="16"
              height="9"
              rx="4"
              fill={`url(#${capGrad})`}
              stroke="#1E293B"
              strokeWidth="2.4"
            />
            <line x1="25" y1="51.5" x2="39" y2="51.5" stroke="#1E293B" strokeWidth="1.8" />
          </>
        )
      }

      case 'sparkle-cards': {
        const amberGrad = `${uid}-cards-amber`
        const skyGrad = `${uid}-cards-sky`
        return (
          <>
            <defs>
              <linearGradient id={amberGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <linearGradient id={skyGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>

            {/* White sticker rim */}
            <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round">
              <rect x="11" y="16" width="27" height="35" rx="5" transform="rotate(-11 24 33)" />
              <rect x="25" y="15" width="27" height="35" rx="5" transform="rotate(8 38 32)" />
            </g>

            {/* Back amber flashcard */}
            <g transform="rotate(-11 24 33)">
              <rect
                x="11"
                y="16"
                width="27"
                height="35"
                rx="5"
                fill={`url(#${amberGrad})`}
                stroke="#1E293B"
                strokeWidth="2.4"
              />
              <line x1="16" y1="25" x2="32" y2="25" stroke="#FFFBEB" strokeWidth="2.4" strokeLinecap="round" />
            </g>

            {/* Front sky-white flashcard */}
            <g transform="rotate(8 38 32)">
              <rect
                x="25"
                y="15"
                width="27"
                height="35"
                rx="5"
                fill="#FFFFFF"
                stroke="#1E293B"
                strokeWidth="2.5"
              />
              <rect
                x="25.5"
                y="15.5"
                width="26"
                height="10"
                rx="4"
                fill={`url(#${skyGrad})`}
              />
              <line x1="31" y1="33" x2="46" y2="33" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="31" y1="39.5" x2="42" y2="39.5" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
            </g>

            {/* Glossy 4-point star sparkle crowning top-right */}
            <path
              d="M 51 6 L 53.2 10.8 L 58 13 L 53.2 15.2 L 51 20 L 48.8 15.2 L 44 13 L 48.8 10.8 Z"
              fill="#FACC15"
              stroke="#1E293B"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </>
        )
      }

      case 'briefcase': {
        const handleGrad = `${uid}-briefcase-handle`
        const bodyGrad = `${uid}-briefcase-body`
        const flapGrad = `${uid}-briefcase-flap`
        const brassGrad = `${uid}-briefcase-brass`
        return (
          <>
            <defs>
              <linearGradient id={handleGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
              <linearGradient id={bodyGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="55%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
              <linearGradient id={flapGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDBA74" />
                <stop offset="55%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
              <linearGradient id={brassGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            <g transform="rotate(-3 32 32)">
              {/* White die-cut sticker rim */}
              <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
                <path
                  d="M 23 19 V 14.5 C 23 11.5 25.5 10 29 10 H 35 C 38.5 10 41 11.5 41 14.5 V 19"
                  fill="none"
                  strokeWidth="12"
                />
                <rect x="9" y="18" width="46" height="34" rx="6" />
              </g>

              {/* Arched leather handle */}
              <path
                d="M 23 19 V 14.5 C 23 11.5 25.5 10 29 10 H 35 C 38.5 10 41 11.5 41 14.5 V 19"
                fill="none"
                stroke="#1E293B"
                strokeWidth="7.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 23 19 V 14.5 C 23 11.5 25.5 10 29 10 H 35 C 38.5 10 41 11.5 41 14.5 V 19"
                fill="none"
                stroke={`url(#${handleGrad})`}
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Structured leather briefcase body */}
              <rect
                x="9"
                y="18"
                width="46"
                height="34"
                rx="6"
                fill={`url(#${bodyGrad})`}
                stroke="#1E293B"
                strokeWidth="2.5"
              />

              {/* Lower perimeter stitched trim */}
              <path
                d="M 13.5 41 V 46 C 13.5 47.4 14.7 48.3 16.5 48.3 H 47.5 C 49.3 48.3 50.5 47.4 50.5 46 V 41"
                fill="none"
                stroke="#FED7AA"
                strokeOpacity="0.88"
                strokeWidth="1.7"
                strokeDasharray="3 3"
                strokeLinecap="round"
              />

              {/* Subtle drop shadow beneath front flap */}
              <path
                d="M 11 37.5 H 53"
                stroke="#7C2D12"
                strokeOpacity="0.38"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Upper leather fold-over flap */}
              <path
                d="M 9 23.5 C 9 20.2 11.8 18 15 18 H 49 C 52.2 18 55 20.2 55 23.5 V 31 C 55 34.4 52.2 36.5 48.5 36.5 H 15.5 C 11.8 36.5 9 34.4 9 31 Z"
                fill={`url(#${flapGrad})`}
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Flap contour stitched trim */}
              <path
                d="M 13.2 22.8 V 30.2 C 13.2 31.8 14.4 32.8 16.5 32.8 H 47.5 C 49.6 32.8 50.8 31.8 50.8 30.2 V 22.8"
                fill="none"
                stroke="#FFFBEB"
                strokeOpacity="0.88"
                strokeWidth="1.7"
                strokeDasharray="3 3"
                strokeLinecap="round"
              />

              {/* Specular gloss streak on flap */}
              <path
                d="M 14.5 21.5 H 27.5"
                stroke="#FFFFFF"
                strokeOpacity="0.62"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Metallic brass center clasp */}
              <rect
                x="26.5"
                y="30.5"
                width="11"
                height="11"
                rx="3.2"
                fill={`url(#${brassGrad})`}
                stroke="#1E293B"
                strokeWidth="2.4"
              />
              <rect
                x="29.8"
                y="34"
                width="4.4"
                height="4.2"
                rx="1.4"
                fill="#78350F"
              />
              <line
                x1="28.8"
                y1="32.7"
                x2="32.5"
                y2="32.7"
                stroke="#FEF9C3"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          </>
        )
      }

      case 'campus-cap': {
        const boardGrad = `${uid}-campus-board`
        const crownGrad = `${uid}-campus-crown`
        const tasselGrad = `${uid}-campus-tassel`
        const scrollGrad = `${uid}-campus-scroll`
        const ribbonGrad = `${uid}-campus-ribbon`
        return (
          <>
            <defs>
              <linearGradient id={boardGrad} x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="55%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
              <linearGradient id={crownGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E40AF" />
                <stop offset="55%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#172554" />
              </linearGradient>
              <linearGradient id={tasselGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id={scrollGrad} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="100%" stopColor="#FEF3C7" />
              </linearGradient>
              <linearGradient id={ribbonGrad} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FB7185" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
            </defs>

            {/* White die-cut sticker rim */}
            <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
              <path d="M 32 9.5 L 55.5 19.8 L 32 30.2 L 8.5 19.8 Z" />
              <path d="M 18 24.5 V 35.5 C 18 40 24.3 43.5 32 43.5 C 39.7 43.5 46 40 46 35.5 V 24.5 Z" />
              <path d="M 46.5 34.5 L 52.5 34.5 L 54 42 L 45 42 Z" />
              <rect x="12" y="43.5" width="35" height="11" rx="5.5" />
            </g>

            {/* Navy mortarboard skullcap */}
            <path
              d="M 18 24.5 V 35.5 C 18 40 24.3 43.5 32 43.5 C 39.7 43.5 46 40 46 35.5 V 24.5 Z"
              fill={`url(#${crownGrad})`}
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Royal-blue mortarboard top */}
            <path
              d="M 32 9.5 L 55.5 19.8 L 32 30.2 L 8.5 19.8 Z"
              fill={`url(#${boardGrad})`}
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Specular highlight on board edge */}
            <path
              d="M 14.5 19.2 L 31.5 12"
              stroke="#FFFFFF"
              strokeOpacity="0.65"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Gold tassel cord draping over rim */}
            <path
              d="M 32 19.8 Q 43 20.5 48.5 24 L 49.5 34"
              fill="none"
              stroke="#1E293B"
              strokeWidth="4.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 32 19.8 Q 43 20.5 48.5 24 L 49.5 34"
              fill="none"
              stroke="#FACC15"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Center mortarboard button & hanging gold tassel bell */}
            <ellipse
              cx="32"
              cy="19.8"
              rx="3.4"
              ry="2.2"
              fill="#FACC15"
              stroke="#1E293B"
              strokeWidth="1.9"
            />
            <path
              d="M 46.5 34.5 C 46.5 32.8 52.5 32.8 52.5 34.5 L 54 42 C 54 43.5 45 43.5 45 42 Z"
              fill={`url(#${tasselGrad})`}
              stroke="#1E293B"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* Rolled cream syllabus scroll */}
            <rect
              x="12"
              y="43.5"
              width="35"
              height="11"
              rx="5.5"
              fill={`url(#${scrollGrad})`}
              stroke="#1E293B"
              strokeWidth="2.4"
            />
            <ellipse
              cx="43.5"
              cy="49"
              rx="3.4"
              ry="5.5"
              fill="#FDE68A"
              stroke="#1E293B"
              strokeWidth="2.2"
            />
            <circle cx="43.5" cy="49" r="1.4" fill="#92400E" />
            <rect
              x="26.5"
              y="43"
              width="5"
              height="12"
              rx="1.8"
              fill={`url(#${ribbonGrad})`}
              stroke="#1E293B"
              strokeWidth="2"
            />
            <line
              x1="16"
              y1="46.6"
              x2="24"
              y2="46.6"
              stroke="#FFFFFF"
              strokeOpacity="0.85"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </>
        )
      }

      case 'train-ticket': {
        const ticketClip = `${uid}-ticket-clip`
        const bodyGrad = `${uid}-ticket-body`
        const headerGrad = `${uid}-ticket-header`
        const crimsonGrad = `${uid}-ticket-crimson`
        const ticketPath =
          'M 12 16 H 38.5 C 38.5 18 40 19.5 42 19.5 C 44 19.5 45.5 18 45.5 16 H 52 C 54.8 16 57 18.2 57 21 V 43 C 57 45.8 54.8 48 52 48 H 45.5 C 45.5 46 44 44.5 42 44.5 C 40 44.5 38.5 46 38.5 48 H 12 C 9.2 48 7 45.8 7 43 V 21 C 7 18.2 9.2 16 12 16 Z'
        return (
          <>
            <defs>
              <clipPath id={ticketClip}>
                <path d={ticketPath} />
              </clipPath>
              <linearGradient id={bodyGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F0F9FF" />
              </linearGradient>
              <linearGradient id={headerGrad} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id={crimsonGrad} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB7185" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
            </defs>

            <g transform="rotate(-6 32 32)">
              {/* White die-cut sticker rim */}
              <path
                d={ticketPath}
                fill="#FFFFFF"
                stroke="#FFFFFF"
                strokeWidth="6"
                strokeLinejoin="round"
              />

              {/* Clipped glossy ticket interior */}
              <g clipPath={`url(#${ticketClip})`}>
                <rect x="6" y="15" width="52" height="34" fill={`url(#${bodyGrad})`} />
                <rect x="6" y="15" width="52" height="11" fill={`url(#${headerGrad})`} />
                <rect x="6" y="26" width="52" height="3.8" fill={`url(#${crimsonGrad})`} />
                <line
                  x1="12"
                  y1="19.5"
                  x2="29"
                  y2="19.5"
                  stroke="#FFFFFF"
                  strokeOpacity="0.68"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
                <rect x="46.5" y="18.8" width="6.5" height="3.2" rx="1.6" fill="#E0F2FE" />
                <line
                  x1="42"
                  y1="22.5"
                  x2="42"
                  y2="42"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeDasharray="2.2 3.2"
                  strokeLinecap="round"
                />
              </g>

              {/* Bold comic outline */}
              <path
                d={ticketPath}
                fill="none"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Micro transit route nodes */}
              <line
                x1="15.5"
                y1="36.5"
                x2="35"
                y2="36.5"
                stroke="#0284C7"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="15.5" cy="36.5" r="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
              <circle cx="25.2" cy="36.5" r="1.8" fill="#E11D48" />
              <circle cx="35" cy="36.5" r="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />

              {/* Micro ticket code stripes */}
              <line
                x1="13"
                y1="42.8"
                x2="22"
                y2="42.8"
                stroke="#94A3B8"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <line
                x1="27"
                y1="42.8"
                x2="36"
                y2="42.8"
                stroke="#CBD5E1"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Stub express chevron */}
              <path
                d="M 47.5 34.5 L 51.5 38 L 47.5 41.5"
                fill="none"
                stroke="#0284C7"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </>
        )
      }

      case 'cafe-cup': {
        const lidGrad = `${uid}-cafe-lid`
        const cupGrad = `${uid}-cafe-cup`
        const sleeveGrad = `${uid}-cafe-sleeve`
        return (
          <>
            <defs>
              <linearGradient id={lidGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FEF3C7" />
              </linearGradient>
              <linearGradient id={cupGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="55%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id={sleeveGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="60%" stopColor="#FEF3C7" />
                <stop offset="100%" stopColor="#FDE68A" />
              </linearGradient>
            </defs>

            {/* White die-cut sticker rim */}
            <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
              <path d="M 25.5 14.5 C 23.5 11.5 27.5 9.5 25.5 6.5" fill="none" strokeWidth="7.5" />
              <path d="M 36.5 14.5 C 34.5 11.5 38.5 9.5 36.5 6.5" fill="none" strokeWidth="7.5" />
              <path d="M 20 19.5 C 20 17.5 22 16 24.5 16 H 39.5 C 42 16 44 17.5 44 19.5 L 45.5 22 H 18.5 Z" />
              <rect x="14" y="21.5" width="36" height="5.5" rx="2.75" />
              <path d="M 17 27 H 47 L 43 52.5 C 42.6 54.8 40.8 56 38.5 56 H 25.5 C 23.2 56 21.4 54.8 21 52.5 Z" />
            </g>

            {/* Rising geometric steam curls */}
            <path
              d="M 25.5 14.5 C 23.5 11.5 27.5 9.5 25.5 6.5"
              fill="none"
              stroke="#64748B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 36.5 14.5 C 34.5 11.5 38.5 9.5 36.5 6.5"
              fill="none"
              stroke="#64748B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Emerald tapered takeaway cup body */}
            <path
              d="M 17 27 H 47 L 43 52.5 C 42.6 54.8 40.8 56 38.5 56 H 25.5 C 23.2 56 21.4 54.8 21 52.5 Z"
              fill={`url(#${cupGrad})`}
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Cream foam cup sleeve */}
            <path
              d="M 17.6 33 H 46.4 L 44.4 46.5 H 19.6 Z"
              fill={`url(#${sleeveGrad})`}
              stroke="#1E293B"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />

            {/* Sleeve coffee emblem medallion */}
            <circle cx="32" cy="39.8" r="4.5" fill="#059669" stroke="#1E293B" strokeWidth="1.9" />
            <path
              d="M 32 36.8 Q 33.4 39.8 32 42.8"
              fill="none"
              stroke="#FEF3C7"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Warm porcelain lid dome & lip */}
            <path
              d="M 20 19.5 C 20 17.5 22 16 24.5 16 H 39.5 C 42 16 44 17.5 44 19.5 L 45.5 22 H 18.5 Z"
              fill={`url(#${lidGrad})`}
              stroke="#1E293B"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <rect
              x="14"
              y="21.5"
              width="36"
              height="5.5"
              rx="2.75"
              fill={`url(#${lidGrad})`}
              stroke="#1E293B"
              strokeWidth="2.5"
            />

            {/* Specular highlights on lid & emerald cup */}
            <line
              x1="23"
              y1="18.8"
              x2="31"
              y2="18.8"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <line
              x1="20.5"
              y1="29"
              x2="21"
              y2="31"
              stroke="#FFFFFF"
              strokeOpacity="0.55"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <line
              x1="22.8"
              y1="48.5"
              x2="23.4"
              y2="52.5"
              stroke="#FFFFFF"
              strokeOpacity="0.5"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </>
        )
      }

      case 'certificate': {
        const frameGrad = `${uid}-cert-frame`
        const creamGrad = `${uid}-cert-cream`
        const ribbonGrad = `${uid}-cert-ribbon`
        const sealGrad = `${uid}-cert-seal`
        return (
          <>
            <defs>
              <linearGradient id={frameGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7DD3FC" />
                <stop offset="55%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id={creamGrad} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="100%" stopColor="#FEF3C7" />
              </linearGradient>
              <linearGradient id={ribbonGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FB7185" />
                <stop offset="55%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#BE123C" />
              </linearGradient>
              <linearGradient id={sealGrad} x1="15%" y1="10%" x2="85%" y2="90%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="55%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            <g transform="rotate(-3 32 32)">
              {/* White die-cut sticker rim */}
              <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round">
                <rect x="9" y="12" width="46" height="34" rx="5" />
                <path d="M 38.5 42 L 35.5 56.5 L 40 53.5 L 43.5 57 L 44 42 Z" />
                <path d="M 44 42 L 44.5 57 L 48 53.5 L 52.5 56.5 L 49.5 42 Z" />
                <circle cx="44" cy="41" r="10.5" />
                <path d="M 11 5.5 L 12.6 8.9 L 16 10.5 L 12.6 12.1 L 11 15.5 L 9.4 12.1 L 6 10.5 L 9.4 8.9 Z" />
              </g>

              {/* Sky-blue certificate frame */}
              <rect
                x="9"
                y="12"
                width="46"
                height="34"
                rx="5"
                fill={`url(#${frameGrad})`}
                stroke="#1E293B"
                strokeWidth="2.5"
              />

              {/* Cream diploma sheet */}
              <rect
                x="13"
                y="16"
                width="38"
                height="26"
                rx="3"
                fill={`url(#${creamGrad})`}
                stroke="#1E293B"
                strokeWidth="2"
              />

              {/* Certificate header & lines */}
              <rect x="17" y="20" width="18" height="3.8" rx="1.9" fill="#0284C7" />
              <line
                x1="17"
                y1="28.5"
                x2="36"
                y2="28.5"
                stroke="#94A3B8"
                strokeWidth="2.3"
                strokeLinecap="round"
              />
              <line
                x1="17"
                y1="34"
                x2="30"
                y2="34"
                stroke="#94A3B8"
                strokeWidth="2.3"
                strokeLinecap="round"
              />

              {/* Gloss streak on sky-blue frame */}
              <line
                x1="13.5"
                y1="14"
                x2="25"
                y2="14"
                stroke="#FFFFFF"
                strokeOpacity="0.65"
                strokeWidth="1.9"
                strokeLinecap="round"
              />

              {/* Crimson ribbon tails */}
              <path
                d="M 38.5 42 L 35.5 56.5 L 40 53.5 L 43.5 57 L 44 42 Z"
                fill={`url(#${ribbonGrad})`}
                stroke="#1E293B"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path
                d="M 44 42 L 44.5 57 L 48 53.5 L 52.5 56.5 L 49.5 42 Z"
                fill={`url(#${ribbonGrad})`}
                stroke="#1E293B"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />

              {/* Scalloped gold & crimson wax seal */}
              <path
                d="M 54.5 41 L 52 44.3 L 51.4 48.4 L 47.3 49 L 44 51.5 L 40.7 49 L 36.6 48.4 L 36 44.3 L 33.5 41 L 36 37.7 L 36.6 33.6 L 40.7 33 L 44 30.5 L 47.3 33 L 51.4 33.6 L 52 37.7 Z"
                fill={`url(#${sealGrad})`}
                stroke="#1E293B"
                strokeWidth="2.3"
                strokeLinejoin="round"
              />
              <circle
                cx="44"
                cy="41"
                r="6"
                fill={`url(#${ribbonGrad})`}
                stroke="#FFFBEB"
                strokeWidth="1.6"
              />
              <path
                d="M 41.4 41.3 L 43.3 43.2 L 46.8 39.2"
                stroke="#FEF08A"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Top-left 4-point golden sparkle */}
              <path
                d="M 11 5.5 L 12.6 8.9 L 16 10.5 L 12.6 12.1 L 11 15.5 L 9.4 12.1 L 6 10.5 L 9.4 8.9 Z"
                fill="#FACC15"
                stroke="#1E293B"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </g>
          </>
        )
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible shrink-0 select-none drop-shadow-[0_3px_5px_rgba(15,23,42,0.16)] ${className}`.trim()}
      aria-hidden="true"
    >
      {renderArtwork()}
    </svg>
  )
}

export interface FloatingStickerCardProps {
  kind?: StickerArtKind
  customIcon?: ReactNode
  label: string
  sublabel?: string
  active?: boolean
  onClick?: () => void
  className?: string
  ariaLabel?: string
}

/**
 * FloatingStickerCard — ClassDojo-style white tactile squircle card where the
 * die-cut sticker artwork pops cleanly over the top border edge.
 */
export const FloatingStickerCard: FC<FloatingStickerCardProps> = ({
  kind,
  customIcon,
  label,
  sublabel,
  active = false,
  onClick,
  className = '',
  ariaLabel,
}) => {
  const shouldReduceMotion = Boolean(useReducedMotion())

  const stateClasses = active
    ? 'border-[#2563EB] ring-4 ring-blue-100 shadow-[0_12px_24px_-4px_rgba(37,99,235,0.24),0_4px_0_0_#BFDBFE]'
    : 'border-[#E2E8F0] shadow-[0_10px_22px_-6px_rgba(15,23,42,0.12),0_4px_0_0_#E2E8F0]'

  const baseClasses =
    `relative inline-flex flex-col items-center min-w-[128px] sm:min-w-[146px] rounded-[22px] bg-white border-2 px-3.5 sm:px-4 pt-8 pb-3 transition-colors ${stateClasses} ${className}`.trim()

  const artworkNode = customIcon ?? (
    <LandingStickerIcon kind={kind ?? 'star-target'} size={56} />
  )

  const innerContent = (
    <>
      <div className="-mt-11 mb-1.5 flex items-center justify-center rounded-2xl pointer-events-none">
        <span className="inline-flex items-center justify-center rounded-2xl bg-white/95 p-1 shadow-[0_4px_10px_rgba(15,23,42,0.08)]">
          {artworkNode}
        </span>
      </div>
      <span className="font-brand font-black text-[13px] sm:text-sm text-[#1E293B] leading-tight text-center">
        {label}
      </span>
      {sublabel ? (
        <span className="text-[11px] font-bold text-[#64748B] leading-tight text-center mt-0.5">
          {sublabel}
        </span>
      ) : null}
    </>
  )

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label={ariaLabel ?? (sublabel ? `${label} - ${sublabel}` : label)}
        whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.02 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
        className={`${baseClasses} cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2`.trim()}
      >
        {innerContent}
      </motion.button>
    )
  }

  return (
    <div
      aria-label={ariaLabel}
      className={baseClasses}
    >
      {innerContent}
    </div>
  )
}
