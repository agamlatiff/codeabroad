import type { FC } from 'react'

export interface ProgressBar3DProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'blue' | 'cyan' | 'xp' | 'streak' | 'emerald'
  showLabel?: boolean
  label?: string
  className?: string
}

/**
 * ProgressBar3D — Iconic chunky Duolingo-style progress bar.
 * Features rounded-full geometry, deep recessed track, and glass/gloss highlight shine.
 */
export const ProgressBar3D: FC<ProgressBar3DProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'blue',
  showLabel = false,
  label,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  }[size]

  const variantStyles = {
    blue: 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]',
    cyan: 'bg-cyan-500 shadow-[0_0_12px_rgba(56,189,248,0.4)]',
    xp: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    streak: 'bg-orange-500 shadow-[0_0_12px_rgba(251,146,60,0.4)]',
    emerald: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]',
  }[variant]

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-bold mb-1.5 px-0.5">
          <span className="text-slate-500">{label || 'Progress'}</span>
          <span className="font-mono text-slate-900 font-extrabold">
            {value} / {max}
          </span>
        </div>
      )}

      {/* Recessed Track Container (Light Mode) */}
      <div
        className={`w-full ${sizeStyles} bg-slate-200 rounded-full p-[2px] border border-slate-300/60 shadow-inner relative overflow-hidden`}
      >
        {/* Animated Fill Bar */}
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden ${variantStyles}`}
          style={{ width: `${percentage}%` }}
        >
          {/* Iconic Duolingo Top-Half Pill Gloss Shine */}
          <div className="absolute inset-x-0 top-0 h-1/2 gloss-shine rounded-t-full pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
