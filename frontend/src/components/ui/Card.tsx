import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  glow?: 'cyan' | 'emerald' | 'none'
}

export const Card = ({
  children,
  glow = 'none',
  className = '',
  ...props
}: CardProps) => {
  const glowClass = {
    cyan: 'glow-cyan',
    emerald: 'glow-emerald',
    none: '',
  }[glow]

  return (
    <div
      className={`glass-panel rounded-3xl p-6 relative overflow-hidden transition-all duration-200 ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
