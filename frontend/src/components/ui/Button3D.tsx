import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

export interface Button3DProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'blue' | 'cyan' | 'dark' | 'emerald' | 'amber' | 'rose' | 'white' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

/**
 * Button3D — Tactile 3D Duolingo-style push-down button.
 * Uses 90% Duolingo physics (thick bottom shadow depth that presses flat on click).
 */
export const Button3D = ({
  children,
  variant = 'blue',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: Button3DProps) => {
  const baseStyles =
    'inline-flex items-center justify-center font-black tracking-wide uppercase rounded-2xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:translate-y-1 active:shadow-none'

  const variants = {
    blue: 'bg-[#2563EB] hover:bg-[#3B82F6] active:bg-[#2563EB] text-white shadow-[0_5px_0_0_#1D4ED8] hover:shadow-[0_6px_0_0_#1D4ED8]',
    cyan: 'bg-[#0284C7] hover:bg-[#38BDF8] active:bg-[#0284C7] text-white shadow-[0_5px_0_0_#0369A1] hover:shadow-[0_6px_0_0_#0369A1]',
    dark: 'bg-[#0F172A] hover:bg-[#1E293B] active:bg-[#0F172A] text-white border border-white/10 shadow-[0_5px_0_0_#020617] hover:shadow-[0_6px_0_0_#020617]',
    emerald: 'bg-[#059669] hover:bg-[#10B981] active:bg-[#059669] text-white shadow-[0_5px_0_0_#047857] hover:shadow-[0_6px_0_0_#047857]',
    amber: 'bg-[#D97706] hover:bg-[#F59E0B] active:bg-[#D97706] text-white shadow-[0_5px_0_0_#B45309] hover:shadow-[0_6px_0_0_#B45309]',
    rose: 'bg-[#E11D48] hover:bg-[#F43F5E] active:bg-[#E11D48] text-white shadow-[0_5px_0_0_#BE123C] hover:shadow-[0_6px_0_0_#BE123C]',
    white: 'bg-white hover:bg-slate-50 active:bg-white text-slate-900 border border-slate-200 shadow-[0_4px_0_0_#CBD5E1] hover:shadow-[0_5px_0_0_#CBD5E1]',
    ghost: 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:translate-y-0 active:shadow-none shadow-none',
  }

  const sizes = {
    sm: 'text-xs px-4 py-2 min-h-[38px] gap-1.5',
    md: 'text-sm px-6 py-3 min-h-[48px] gap-2',
    lg: 'text-base px-8 py-4 min-h-[56px] gap-2.5',
  }

  const widthStyle = fullWidth ? 'w-full' : ''

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
