import type { ReactNode } from 'react'
import { Check, Lock, Star } from 'lucide-react'

export interface RoadmapNode3DProps {
  status: 'completed' | 'active' | 'locked'
  number?: number | string
  title?: string
  xp?: string | number
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  popoverText?: string
  className?: string
}

/**
 * RoadmapNode3D — Iconic circular Duolingo 3D learning node.
 * Features push-down tactile physics, active state beacon/popover,
 * completed golden/emerald badge, and locked state padlock.
 */
export const RoadmapNode3D = ({
  status = 'active',
  number,
  title,
  xp,
  icon,
  onClick,
  disabled = false,
  size = 'md',
  popoverText,
  className = '',
}: RoadmapNode3DProps) => {
  const isCompleted = status === 'completed'
  const isActive = status === 'active'
  const isLocked = status === 'locked'

  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 sm:w-18 sm:h-18 text-base',
    lg: 'w-20 h-20 sm:w-22 sm:h-22 text-xl',
  }[size]

  const statusStyles = {
    completed:
      'bg-[#059669] hover:bg-[#10B981] active:bg-[#059669] text-white shadow-[0_6px_0_0_#047857] hover:shadow-[0_7px_0_0_#047857] active:translate-y-1 active:shadow-none cursor-pointer',
    active:
      'bg-[#2563EB] hover:bg-[#3B82F6] active:bg-[#2563EB] text-white shadow-[0_6px_0_0_#1D4ED8] hover:shadow-[0_7px_0_0_#1D4ED8] ring-4 ring-blue-500/25 active:translate-y-1 active:shadow-none cursor-pointer',
    locked:
      'bg-slate-200 text-slate-400 border border-slate-300 shadow-[0_5px_0_0_#CBD5E1] cursor-not-allowed select-none opacity-85',
  }[status]

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Floating Action Popover for Active Node */}
      {isActive && (
        <div className="absolute -top-11 z-20 animate-bounce">
          <div className="relative bg-white text-blue-600 px-3 py-1 rounded-full border-2 border-blue-600 shadow-md font-black text-[11px] tracking-wide uppercase whitespace-nowrap">
            {popoverText || 'Mulai Quest'}
            {/* Popover Arrow Tail */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-blue-600 rotate-45" />
          </div>
        </div>
      )}

      {/* 3D Circular Push-Down Node */}
      <button
        type="button"
        disabled={isLocked || disabled}
        onClick={onClick}
        aria-label={title || `Tahap ${number || ''}`}
        className={`rounded-full flex items-center justify-center font-black transition-all duration-150 relative select-none ${sizeClasses} ${statusStyles}`}
      >
        {/* Top-Half Pill Gloss Highlight */}
        <div className="absolute inset-x-2 top-1 h-1/2 bg-white/20 rounded-t-full pointer-events-none" />

        {/* Inner Content / Icon */}
        <span className="relative z-10 flex items-center justify-center">
          {icon ? (
            icon
          ) : isCompleted ? (
            <Check className="w-7 h-7 stroke-[3.5]" />
          ) : isLocked ? (
            <Lock className="w-6 h-6 stroke-[2.5]" />
          ) : number !== undefined ? (
            <span>{number}</span>
          ) : (
            <Star className="w-6 h-6 fill-current stroke-[2]" />
          )}
        </span>
      </button>

      {/* Optional Metadata (Title / XP) */}
      {(title || xp) && (
        <div className="mt-2 text-center max-w-[140px]">
          {title && (
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {title}
            </h4>
          )}
          {xp && (
            <span className="text-[10px] font-mono font-bold text-slate-500">
              {typeof xp === 'number' ? `+${xp} XP` : xp}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
