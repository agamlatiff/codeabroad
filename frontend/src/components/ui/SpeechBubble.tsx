import type { FC, ReactNode } from 'react'

export interface SpeechBubbleProps {
  children: ReactNode
  direction?: 'bottom' | 'left' | 'right' | 'top'
  variant?: 'dark' | 'light' | 'blue'
  className?: string
}

/**
 * SpeechBubble — Iconic Duolingo comic speech bubble.
 * Includes sharp directional tail pointing to the mascot / character.
 */
export const SpeechBubble: FC<SpeechBubbleProps> = ({
  children,
  direction = 'bottom',
  variant = 'dark',
  className = '',
}) => {
  const variantStyles = {
    dark: 'bg-[#162032] border border-white/10 text-white shadow-[0_6px_20px_rgba(0,0,0,0.3)]',
    light: 'bg-white border-2 border-slate-900 text-slate-900 shadow-[4px_4px_0px_0px_#0F172A]',
    blue: 'bg-blue-950/90 border border-blue-500/30 text-blue-100 shadow-[0_6px_20px_rgba(37,99,235,0.2)]',
  }[variant]

  // Directional arrow tail
  const tailBaseClass = 'absolute w-0 h-0 pointer-events-none'

  const tailStyles = {
    bottom:
      '-bottom-2 left-1/2 -translate-x-1/2 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] ' +
      (variant === 'dark' ? 'border-t-[#162032]' : variant === 'blue' ? 'border-t-blue-950' : 'border-t-slate-900'),
    top:
      '-top-2 left-1/2 -translate-x-1/2 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] ' +
      (variant === 'dark' ? 'border-b-[#162032]' : variant === 'blue' ? 'border-b-blue-950' : 'border-b-slate-900'),
    left:
      '-left-2 top-1/2 -translate-y-1/2 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] ' +
      (variant === 'dark' ? 'border-r-[#162032]' : variant === 'blue' ? 'border-r-blue-950' : 'border-r-slate-900'),
    right:
      '-right-2 top-1/2 -translate-y-1/2 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] ' +
      (variant === 'dark' ? 'border-l-[#162032]' : variant === 'blue' ? 'border-l-blue-950' : 'border-l-slate-900'),
  }[direction]

  return (
    <div
      className={`relative rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold select-none transition-all ${variantStyles} ${className}`}
    >
      {children}
      <div className={`${tailBaseClass} ${tailStyles}`} />
    </div>
  )
}
