import type { FC, ReactNode } from 'react'

export type PageHeroTheme = 'blue' | 'sky' | 'amber' | 'violet' | 'emerald'

interface HeroThemeStyle {
  topStrip: string
  cardBg: string
  border: string
  iconBox: string
}

const HERO_THEME_STYLES: Record<PageHeroTheme, HeroThemeStyle> = {
  blue: {
    topStrip: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500',
    cardBg: 'bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40',
    border: 'border-slate-200/90',
    iconBox: 'bg-blue-50 border-blue-200 text-blue-600',
  },
  sky: {
    topStrip: 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500',
    cardBg: 'bg-gradient-to-br from-sky-50/65 via-white to-blue-50/40',
    border: 'border-slate-200/90',
    iconBox: 'bg-sky-50 border-sky-200 text-sky-600',
  },
  amber: {
    topStrip: 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500',
    cardBg: 'bg-gradient-to-br from-amber-50/75 via-white to-orange-50/40',
    border: 'border-amber-200/90',
    iconBox: 'bg-amber-50 border-amber-200 text-amber-600',
  },
  violet: {
    topStrip: 'bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500',
    cardBg: 'bg-gradient-to-br from-violet-50/60 via-white to-blue-50/40',
    border: 'border-slate-200/90',
    iconBox: 'bg-violet-50 border-violet-200 text-violet-600',
  },
  emerald: {
    topStrip: 'bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500',
    cardBg: 'bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40',
    border: 'border-slate-200/90',
    iconBox: 'bg-emerald-50 border-emerald-200 text-emerald-600',
  },
}

export interface PageHeroHeaderProps {
  theme?: PageHeroTheme
  icon?: ReactNode
  badges?: ReactNode
  title: string
  description?: string
  bottomSlot?: ReactNode
  rightSlot?: ReactNode
  className?: string
}

/**
 * Unified Clean Tactile Card Page Hero Header (SSOT across primary CodeAbroad pages).
 */
export const PageHeroHeader: FC<PageHeroHeaderProps> = ({
  theme = 'blue',
  icon,
  badges,
  title,
  description,
  bottomSlot,
  rightSlot,
  className = '',
}) => {
  const style = HERO_THEME_STYLES[theme]

  return (
    <section
      className={`rounded-3xl border-2 ${style.border} ${style.cardBg} shadow-[0_5px_0_0_#E2E8F0] overflow-hidden ${className}`}
    >
      <div className={`h-1.5 w-full ${style.topStrip}`} />

      <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          {icon && (
            <div
              className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl border-2 flex items-center justify-center shrink-0 shadow-2xs ${style.iconBox}`}
            >
              {icon}
            </div>
          )}

          <div className="space-y-2 min-w-0 flex-1">
            {badges && <div className="flex items-center flex-wrap gap-2">{badges}</div>}
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-brand font-black text-slate-900 tracking-tight leading-snug">
                {title}
              </h1>
              {description && (
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
                  {description}
                </p>
              )}
            </div>
            {bottomSlot && <div className="pt-1">{bottomSlot}</div>}
          </div>
        </div>

        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
    </section>
  )
}
