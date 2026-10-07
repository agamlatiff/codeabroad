import type { ReactNode } from 'react'

export interface MetricTileProps {
  label: string
  value: ReactNode
  subtitle?: string
  icon?: ReactNode
  variant?: 'default' | 'blue' | 'cyan' | 'emerald' | 'amber' | 'streak' | 'rose'
  surface?: 'dark' | 'light'
  className?: string
}

/**
 * MetricTile — Gamified 2x2 clean stat tile inspired by Duolingo milestone screens.
 * Replaces generic bullet cards with clean, scannable metric blocks.
 */
export const MetricTile = ({
  label,
  value,
  subtitle,
  icon,
  variant = 'default',
  surface = 'light',
  className = '',
}: MetricTileProps) => {
  const isLight = surface === 'light'

  const valueColorStyles = isLight
    ? {
        default: 'text-slate-900',
        blue: 'text-blue-600',
        cyan: 'text-cyan-700',
        emerald: 'text-emerald-700',
        amber: 'text-amber-700',
        streak: 'text-orange-600',
        rose: 'text-rose-600',
      }[variant]
    : {
        default: 'text-white',
        blue: 'text-blue-400',
        cyan: 'text-cyan-400',
        emerald: 'text-emerald-400',
        amber: 'text-amber-400',
        streak: 'text-orange-400',
        rose: 'text-rose-400',
      }[variant]

  const containerStyles = isLight
    ? 'bg-slate-50/90 border border-slate-200/80 hover:border-slate-300'
    : 'bg-[#162032] border border-slate-800/90 hover:border-slate-700/80'

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between ${containerStyles} ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[10px] font-mono font-bold uppercase tracking-wider truncate ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          {label}
        </span>
        {icon && <span className={`${isLight ? 'text-slate-500' : 'text-slate-400'} shrink-0`}>{icon}</span>}
      </div>

      <div className="mt-1.5">
        <div className={`text-sm sm:text-base font-extrabold truncate ${valueColorStyles}`}>
          {value}
        </div>
        {subtitle && (
          <span
            className={`text-[11px] font-medium block truncate mt-0.5 ${
              isLight ? 'text-slate-500' : 'text-slate-500'
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
