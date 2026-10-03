import { useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: ReactNode
  isPassword?: boolean
  error?: string | null
}

export const AuthField = ({
  label,
  icon,
  isPassword = false,
  error,
  id,
  type = 'text',
  className = '',
  ...props
}: AuthFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="w-full space-y-1.5 text-left">
      {/* Clean external label */}
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-slate-700 select-none tracking-normal"
      >
        {label}
      </label>

      {/* Input container with icon padding and focus ring */}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          id={id}
          type={inputType}
          className={`w-full h-11 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 font-normal ${
            icon ? 'pl-10' : 'pl-3.5'
          } ${isPassword ? 'pr-11' : 'pr-3.5'} ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
              : 'border-slate-200 hover:border-slate-300 focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10'
          } ${className}`}
          {...props}
        />

        {/* Password visibility toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1 outline-none focus:outline-none"
            tabIndex={-1}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  )
}
