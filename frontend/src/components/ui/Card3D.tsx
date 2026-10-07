import type { HTMLAttributes, ReactNode } from 'react'

export interface Card3DProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  glow?: boolean
  className?: string
}

/**
 * Card3D — Matte dark obsidian card container matching Duolingo Dark Taste.
 * Features rounded-3xl geometry, subtle border-white/10 highlight, and atmospheric depth.
 */
export const Card3D = ({
  children,
  glow = false,
  className = '',
  ...props
}: Card3DProps) => {
  return (
    <div
      className={`relative bg-[#111827] border-2 border-slate-800 hover:border-blue-500/40 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] transition-all duration-300 overflow-hidden ${className}`}
      {...props}
    >
      {glow && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      )}
      {children}
    </div>
  )
}
