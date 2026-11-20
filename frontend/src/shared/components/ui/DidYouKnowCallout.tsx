import { useId, type FC, type ReactNode } from 'react'
import { Lightbulb } from '@phosphor-icons/react'
import { KodiCharacter, type KodiEmotion } from '@/shared/components/ui/KodiCharacter'

export type DidYouKnowTone = 'amber' | 'blue' | 'emerald' | 'violet'

interface ToneStyle {
  container: string
  topStrip: string
  dotColor: string
  badge: string
  exampleBox: string
}

const TONE_STYLES: Record<DidYouKnowTone, ToneStyle> = {
  amber: {
    container: 'bg-gradient-to-br from-amber-50/90 via-[#FFFDF7] to-orange-50/50 border-amber-200/90',
    topStrip: 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400',
    dotColor: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    exampleBox: 'bg-white/90 border-amber-200/80 text-amber-950',
  },
  blue: {
    container: 'bg-gradient-to-br from-blue-50/90 via-white to-sky-50/60 border-blue-200/90',
    topStrip: 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500',
    dotColor: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    exampleBox: 'bg-white/90 border-blue-200/80 text-blue-950',
  },
  emerald: {
    container: 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60 border-emerald-200/90',
    topStrip: 'bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500',
    dotColor: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    exampleBox: 'bg-white/90 border-emerald-200/80 text-emerald-950',
  },
  violet: {
    container: 'bg-gradient-to-br from-violet-50/90 via-white to-purple-50/60 border-violet-200/90',
    topStrip: 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500',
    dotColor: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-800 border-violet-200',
    exampleBox: 'bg-white/90 border-violet-200/80 text-violet-950',
  },
}

export interface DidYouKnowCalloutProps {
  badge?: string
  title: string
  description: ReactNode
  example?: string
  tone?: DidYouKnowTone
  emotion?: KodiEmotion
  kodiSize?: number
  className?: string
}

/**
 * Reusable beginner-friendly "Tahukah Kamu?" callout card featuring Kodi mascot.
 * Explains unfamiliar linguistics/Japanese terms in plain everyday Indonesian.
 */
export const DidYouKnowCallout: FC<DidYouKnowCalloutProps> = ({
  badge = 'Tahukah Kamu?',
  title,
  description,
  example,
  tone = 'amber',
  emotion = 'curious',
  kodiSize = 78,
  className = '',
}) => {
  const styles = TONE_STYLES[tone]
  const dotPatternId = `did-you-know-dots-${useId().replace(/:/g, '')}`

  return (
    <aside
      aria-label={badge}
      className={`relative rounded-3xl border-2 shadow-[0_4px_0_0_rgba(15,23,42,0.05)] overflow-hidden ${styles.container} ${className}`.trim()}
    >
      {/* Top Tone Accent Strip */}
      <div className={`h-1 w-full ${styles.topStrip}`} />

      {/* Subtle Corner Dot-Grid Texture */}
      <svg
        className={`absolute right-0 top-0 w-44 h-full opacity-[0.06] pointer-events-none ${styles.dotColor}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id={dotPatternId} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.3" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${dotPatternId})`} />
      </svg>

      <div className="relative z-10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="shrink-0 flex justify-center sm:justify-start">
          <KodiCharacter emotion={emotion} size={kodiSize} interactive={false} />
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-brand font-black uppercase tracking-wider ${styles.badge}`}
            >
              <Lightbulb weight="fill" className="w-3 h-3" />
              <span>{badge}</span>
            </span>
          </div>

          <h3 className="font-brand font-black text-sm sm:text-[15px] text-slate-900 leading-snug">
            {title}
          </h3>

          <div className="text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed">
            {description}
          </div>

          {example && (
            <div
              className={`rounded-xl border px-3 py-1.5 text-[11px] sm:text-xs font-bold leading-snug ${styles.exampleBox}`}
            >
              {example}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
