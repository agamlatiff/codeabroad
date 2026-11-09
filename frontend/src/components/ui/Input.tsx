import { useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { Eye, EyeSlash, WarningCircle } from '@phosphor-icons/react'
import { FORM_TOKENS, resolveFormInputClassName } from '../../tokens/layoutTokens'

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
  const errorId = error && id ? `${id}-error` : undefined
  const toggleLabel = showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'

  return (
    <div className={`${fullWidth ? 'w-full' : ''} space-y-1.5 text-left`}>
      {label && (
        <label htmlFor={id} className={FORM_TOKENS.labelClass}>
          {label}
        </label>
      )}

      {/* Input container with ergonomic touch target (min 44px) */}
      <div className="relative flex items-center">
        {icon && <div className={FORM_TOKENS.iconWrapperClass}>{icon}</div>}

        <input
          id={id}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={resolveFormInputClassName({
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
            className={FORM_TOKENS.passwordToggleClass}
            tabIndex={-1}
            title={toggleLabel}
            aria-label={toggleLabel}
          >
            {showPassword ? <EyeSlash weight="bold" className="w-4 h-4" /> : <Eye weight="bold" className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Error or helper feedback */}
      {error ? (
        <p id={errorId} role="alert" className={FORM_TOKENS.errorMessageClass}>
          <WarningCircle weight="bold" className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className={FORM_TOKENS.helperTextClass}>{helperText}</p>
      ) : null}
    </div>
  )
}
