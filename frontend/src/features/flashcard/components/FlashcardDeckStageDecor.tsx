import type { FC } from 'react'

export interface FlashcardDeckStageDecorProps {
  iconName: string
  accentColor: string
}

const DECOR_COLOR_CLASSES: Record<string, string> = {
  emerald: 'text-emerald-600',
  blue: 'text-blue-600',
  amber: 'text-amber-600',
  violet: 'text-violet-600',
  cyan: 'text-cyan-600',
  rose: 'text-rose-600',
}

/**
 * Low-opacity thematic corner silhouettes giving each flashcard deck stage distinct topic identity.
 */
export const FlashcardDeckStageDecor: FC<FlashcardDeckStageDecorProps> = ({
  iconName,
  accentColor,
}) => {
  const colorClass = DECOR_COLOR_CLASSES[accentColor] ?? DECOR_COLOR_CLASSES.blue

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.14] ${colorClass}`}
    >
      {iconName === 'hand-waving' ? (
        <>
          {/* Japanese Folding Fan (Sensu) Bottom-Left */}
          <svg viewBox="0 0 80 80" fill="none" className="absolute -left-2 -bottom-2 w-20 h-20">
            <path
              d="M12 68C12 38 30 18 62 16L68 48C48 50 32 58 24 72L12 68Z"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="currentColor"
              fillOpacity="0.18"
            />
            <path d="M18 66L58 26M20 68L64 36M16 64L42 20" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          {/* Floating Sakura Petals Top-Right */}
          <svg viewBox="0 0 64 64" fill="currentColor" className="absolute right-2 top-2 w-14 h-14">
            <circle cx="44" cy="14" r="4" />
            <circle cx="51" cy="19" r="3.5" />
            <circle cx="46" cy="25" r="3.5" />
            <circle cx="39" cy="20" r="3.8" />
            <ellipse cx="22" cy="12" rx="4.5" ry="2.5" transform="rotate(-30 22 12)" />
          </svg>
        </>
      ) : iconName === 'clock' ? (
        <>
          {/* Crescent Moon & Stars Bottom-Left */}
          <svg viewBox="0 0 80 80" fill="none" className="absolute left-2 bottom-2 w-16 h-16">
            <path
              d="M36 16C24 18 16 28 16 40C16 53 27 64 40 64C48 64 55 60 59 53C46 54 36 44 36 31C36 25 38 20 42 16H36Z"
              fill="currentColor"
              fillOpacity="0.22"
              stroke="currentColor"
              strokeWidth="2.4"
            />
            <circle cx="54" cy="24" r="3" fill="currentColor" />
          </svg>
          {/* Minimal Clock Arc Top-Right */}
          <svg viewBox="0 0 64 64" fill="none" className="absolute right-1 top-1 w-14 h-14">
            <circle cx="42" cy="22" r="14" stroke="currentColor" strokeWidth="2.4" strokeDasharray="4 4" />
            <path d="M42 14V22L48 25" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </>
      ) : iconName === 'bowl-food' ? (
        <>
          {/* Steaming Bowl Silhouette Bottom-Left */}
          <svg viewBox="0 0 80 80" fill="none" className="absolute left-1.5 bottom-1 w-18 h-18">
            <path
              d="M14 44H62C60 58 50 66 38 66C26 66 16 58 14 44Z"
              fill="currentColor"
              fillOpacity="0.22"
              stroke="currentColor"
              strokeWidth="2.4"
            />
            <path d="M26 66H50M26 24C24 29 29 31 27 36M38 20C36 26 41 28 39 34M50 24C48 29 53 31 51 36" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          {/* Cute Onigiri Top-Right */}
          <svg viewBox="0 0 64 64" fill="none" className="absolute right-2 top-2 w-12 h-12">
            <path
              d="M32 14L48 44H16L32 14Z"
              fill="currentColor"
              fillOpacity="0.18"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <rect x="25" y="34" width="14" height="10" rx="2" fill="currentColor" />
          </svg>
        </>
      ) : iconName === 'person-simple-run' ? (
        <>
          {/* Dynamic Speed Ribbons */}
          <svg viewBox="0 0 80 80" fill="none" className="absolute left-1 bottom-2 w-18 h-16">
            <path d="M8 28H46M14 42H58M10 56H40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <svg viewBox="0 0 64 64" fill="none" className="absolute right-2 top-2 w-12 h-12">
            <path d="M20 18L30 28L20 38M34 18L44 28L34 38" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </>
      ) : iconName === 'train' ? (
        <>
          {/* Japanese Torii Gate Silhouette Bottom-Left */}
          <svg viewBox="0 0 80 80" fill="none" className="absolute left-1.5 bottom-1 w-18 h-18">
            <path
              d="M12 24H64M18 34H58M24 24V68M52 24V68"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path d="M10 21C22 25 54 25 66 21" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          {/* Sleek Track Lines Top-Right */}
          <svg viewBox="0 0 64 64" fill="none" className="absolute right-2 top-2 w-14 h-12">
            <path d="M12 20H50C54 20 56 26 48 28H16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M22 36H52" stroke="currentColor" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
          </svg>
        </>
      ) : iconName === 'sparkle' ? (
        <>
          {/* Faceted Crystal Stars */}
          <svg viewBox="0 0 64 64" fill="currentColor" className="absolute left-2 bottom-2 w-14 h-14">
            <path d="M24 12L28 24L40 28L28 32L24 44L20 32L8 28L20 24Z" fillOpacity="0.35" />
            <circle cx="48" cy="46" r="4" />
          </svg>
          <svg viewBox="0 0 64 64" fill="currentColor" className="absolute right-2 top-2 w-12 h-12">
            <path d="M36 10L39 19L48 22L39 25L36 34L33 25L24 22L33 19Z" />
          </svg>
        </>
      ) : (
        <>
          {/* Layered Origami Cards Accent */}
          <svg viewBox="0 0 80 80" fill="none" className="absolute left-2 bottom-2 w-16 h-16">
            <rect x="14" y="22" width="28" height="38" rx="6" transform="rotate(-12 28 41)" stroke="currentColor" strokeWidth="2.4" fill="currentColor" fillOpacity="0.14" />
            <rect x="26" y="24" width="28" height="38" rx="6" transform="rotate(6 40 43)" stroke="currentColor" strokeWidth="2.4" />
          </svg>
          <svg viewBox="0 0 64 64" fill="currentColor" className="absolute right-2 top-2 w-10 h-10">
            <circle cx="40" cy="18" r="5" fillOpacity="0.45" />
            <circle cx="24" cy="14" r="3" />
          </svg>
        </>
      )}
    </div>
  )
}
