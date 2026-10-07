import type { HTMLAttributes, ReactNode } from 'react'

export interface Card3DProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  glow?: boolean
  variant?: 'white' | 'slate' | 'blue'
  className?: string
}

/**
 * Card3D — Tactile Clean Light Mode card container with Duolingo 3D depth physics.
 * Features rounded-3xl geometry, crisp 2px border, and solid bottom bevel shadow.
 */
export const Card3D = ({
  children,
  glow = false,
  variant = 'white',
  className = '',
  ...props
}: Card3DProps) => {
  const variantStyles = {
    white: 'bg-white border-2 border-slate-200/90 hover:border-slate-300 text-slate-900 shadow-[0_4px_0_0_#E2E8F0] hover:shadow-[0_5px_0_0_#CBD5E1]',
    slate: 'bg-slate-50 border-2 border-slate-200 text-slate-900 shadow-[0_4px_0_0_#E2E8F0]',
    blue: 'bg-blue-50/60 border-2 border-blue-600/80 text-slate-900 shadow-[0_4px_0_0_#BFDBFE]',
  }[variant]

  return (
    <div
      className={`relative rounded-3xl transition-all duration-200 overflow-hidden ${variantStyles} ${className}`}
      {...props}
    >
      {glow && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      )}
      {children}
    </div>
  )
}
