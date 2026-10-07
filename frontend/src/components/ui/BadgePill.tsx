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
    xp: 'bg-amber-50 border-amber-200 text-amber-800',
    streak: 'bg-orange-50 border-orange-200 text-orange-800',
    verified: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    cyan: 'bg-sky-50 border-sky-200 text-sky-800',
    neutral: 'bg-slate-100 border-slate-200 text-slate-700',
    error: 'bg-rose-50 border-rose-200 text-rose-700',
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
