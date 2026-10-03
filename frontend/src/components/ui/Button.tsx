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
    'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variants = {
    // High-contrast solid black button inspired by Tuga's App
    primary:
      'bg-slate-950 text-white hover:bg-slate-800 border-2 border-slate-950 shadow-[0_4px_12px_rgba(15,23,42,0.15)] active:translate-y-0.5 active:shadow-sm',
    secondary:
      'bg-white text-slate-900 border-2 border-slate-900 shadow-[0_3px_0_0_#0F172A] hover:translate-y-0.5 hover:shadow-[0_1px_0_0_#0F172A] active:translate-y-1 active:shadow-none',
    outline:
      'bg-transparent text-slate-700 border-2 border-slate-200 hover:bg-slate-100 hover:text-slate-900',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100',
    danger:
      'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100',
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
