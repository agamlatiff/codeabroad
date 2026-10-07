import type { HTMLAttributes } from 'react'

export interface Skeleton3DProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'circle' | 'button' | 'metric'
  className?: string
}

/**
 * Skeleton3D — Tactile Clean Light Mode loading placeholder block.
 * Features rounded geometry and gentle pulse animation matching Duolingo polish.
 */
export const Skeleton3D = ({
  variant = 'text',
  className = '',
  ...props
}: Skeleton3DProps) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-lg',
    card: 'h-36 w-full rounded-3xl border-2 border-slate-200/60 shadow-[0_4px_0_0_#E2E8F0]',
    circle: 'w-12 h-12 rounded-full',
    button: 'h-12 w-32 rounded-2xl shadow-[0_4px_0_0_#CBD5E1]',
    metric: 'h-24 w-full rounded-2xl border-2 border-slate-200/60',
  }[variant]

  return (
    <div
      className={`bg-slate-200/80 animate-pulse ${variantStyles} ${className}`}
      {...props}
    />
  )
}
