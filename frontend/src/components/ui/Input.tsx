import { useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  isPassword?: boolean
  error?: string | null
  helperText?: string
  fullWidth?: boolean
}

export const Input = ({
  label,
  icon,
  isPassword = false,
  error,
  helperText,
  id,
  type = 'text',
  fullWidth = true,
  className = '',
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`${fullWidth ? 'w-full' : ''} space-y-1.5 text-left`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs sm:text-[13px] font-semibold text-slate-700 select-none tracking-normal font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {label}
        </label>
      )}

      {/* Input container with ergonomic touch target (min 44px) */}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors">
            {icon}
          </div>
        )}

        <input
          id={id}
          type={inputType}
          className={`w-full min-h-[44px] h-11 sm:h-11.5 bg-white border-2 rounded-2xl text-base sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 font-normal font-sans ${
            icon ? 'pl-10.5 pr-4' : 'px-3.5'
          } ${isPassword ? 'pr-11' : ''} ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15'
              : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15'
          } ${className}`}
          {...props}
        />

        {/* Password visibility toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1.5 outline-none focus:outline-none cursor-pointer"
            tabIndex={-1}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Error or helper feedback */}
      {error ? (
        <p className="text-xs text-rose-500 font-medium flex items-center gap-1.5 mt-1 animate-in fade-in duration-150">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] sm:text-xs text-slate-400 font-normal mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
