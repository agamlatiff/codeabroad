import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { CircleNotch } from '@phosphor-icons/react'
import { BUTTON_TOKENS } from "@/shared/tokens/elevationTokens"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_TOKENS.variants
  size?: keyof typeof BUTTON_TOKENS.sizes
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
  const widthStyle = fullWidth ? 'w-full' : ''

  return (
    <button
      disabled={disabled || loading}
      className={`${BUTTON_TOKENS.base} ${BUTTON_TOKENS.variants[variant]} ${BUTTON_TOKENS.sizes[size]} ${widthStyle} ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <CircleNotch className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
