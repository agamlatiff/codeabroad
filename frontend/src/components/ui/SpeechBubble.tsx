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
  variant = 'light',
  className = '',
}) => {
  const variantStyles = {
    light: 'bg-white border-2 border-slate-200 text-slate-900 shadow-[0_3px_0_0_#CBD5E1]',
    dark: 'bg-[#162032] border border-white/10 text-white shadow-[0_6px_20px_rgba(0,0,0,0.3)]',
    blue: 'bg-blue-50 border-2 border-blue-200 text-blue-950 shadow-[0_3px_0_0_#BFDBFE]',
  }[variant]

  // Directional arrow tail
  const tailBaseClass = 'absolute w-0 h-0 pointer-events-none'

  const tailStyles = {
    bottom:
      '-bottom-2 left-1/2 -translate-x-1/2 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] ' +
      (variant === 'dark' ? 'border-t-[#162032]' : variant === 'blue' ? 'border-t-blue-200' : 'border-t-slate-200'),
    top:
      '-top-2 left-1/2 -translate-x-1/2 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] ' +
      (variant === 'dark' ? 'border-b-[#162032]' : variant === 'blue' ? 'border-b-blue-200' : 'border-b-slate-200'),
    left:
      '-left-2 top-1/2 -translate-y-1/2 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] ' +
      (variant === 'dark' ? 'border-r-[#162032]' : variant === 'blue' ? 'border-r-blue-200' : 'border-r-slate-200'),
    right:
      '-right-2 top-1/2 -translate-y-1/2 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] ' +
      (variant === 'dark' ? 'border-l-[#162032]' : variant === 'blue' ? 'border-l-blue-200' : 'border-l-slate-200'),
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
