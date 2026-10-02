import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variants = {
    // Tactile Japanese Pop Button with physical press feedback
    primary:
      'bg-cyan-400 text-slate-950 font-bold border-2 border-slate-950 shadow-[0_4px_0_0_#020617] hover:shadow-[0_2px_0_0_#020617] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]',
    secondary:
      'bg-[#191C2B] text-cyan-400 font-semibold border-2 border-slate-800 shadow-[0_3px_0_0_#0B0D14] hover:border-cyan-500/40 hover:translate-y-[1px] active:shadow-none active:translate-y-[3px]',
    outline:
      'bg-transparent text-slate-300 border-2 border-slate-700 hover:bg-white/5 hover:text-white',
    ghost:
      'bg-transparent text-slate-400 hover:text-white hover:bg-white/5',
    danger:
      'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20',
  }

  const sizes = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-3 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
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
