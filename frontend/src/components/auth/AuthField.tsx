import { useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { Eye, EyeSlash, WarningCircle } from '@phosphor-icons/react'
import { getAuthInputClassName } from '../../hooks/auth/authHelpers'

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
  const errorId = error && id ? `${id}-error` : undefined
  const toggleLabel = showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'

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
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={getAuthInputClassName({
            hasIcon: Boolean(icon),
            isPassword,
            hasError: Boolean(error),
            className,
          })}
          {...props}
        />

        {/* Password visibility toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1 outline-none focus:outline-none cursor-pointer"
            tabIndex={-1}
            title={toggleLabel}
            aria-label={toggleLabel}
          >
            {showPassword ? <EyeSlash weight="bold" className="w-4 h-4" /> : <Eye weight="bold" className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-rose-500 font-medium flex items-center gap-1.5 mt-1 animate-in fade-in duration-150"
        >
          <WarningCircle weight="bold" className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
