import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { CircleNotch } from '@phosphor-icons/react'
import { audioEngine } from '../../utils/audio'
import { BUTTON_3D_TOKENS } from '../../tokens/elevationTokens'

export interface Button3DProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_3D_TOKENS.variants
  size?: keyof typeof BUTTON_3D_TOKENS.sizes
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

/**
 * Button3D — Tactile 3D Duolingo-style push-down button.
 * Uses BUTTON_3D_TOKENS from elevationTokens.ts as Single Source of Truth.
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
  onClick,
  ...props
}: Button3DProps) => {
  const widthStyle = fullWidth ? 'w-full' : ''

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    audioEngine.playPop()
    onClick?.(e)
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${BUTTON_3D_TOKENS.base} ${BUTTON_3D_TOKENS.variants[variant]} ${BUTTON_3D_TOKENS.sizes[size]} ${widthStyle} ${className}`.trim()}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <CircleNotch weight="bold" className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
