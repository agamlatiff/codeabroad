import type { ReactNode } from 'react'

export interface BadgePillProps {
  children: ReactNode
  icon?: ReactNode
  variant?: 'xp' | 'streak' | 'verified' | 'blue' | 'cyan' | 'neutral' | 'error'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * BadgePill — Gamified pill badge for XP, status, verification, and tags.
 */
export const BadgePill = ({
  children,
  icon,
  variant = 'blue',
  size = 'md',
  className = '',
}: BadgePillProps) => {
  const variantStyles = {
    xp: 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-inner',
    streak: 'bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-inner',
    verified: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-inner',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-300 shadow-inner',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-inner',
    neutral: 'bg-slate-800 border-slate-700 text-slate-300',
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-inner',
  }[variant]

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm',
  }[size]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-black tracking-wide uppercase select-none ${sizeStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}
