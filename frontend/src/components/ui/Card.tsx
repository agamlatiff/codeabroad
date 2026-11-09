import type { HTMLAttributes, ReactNode } from 'react'
import { CARD_TOKENS } from '../../tokens/layoutTokens'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: keyof typeof CARD_TOKENS.variants
}

export const Card = ({
  children,
  variant = 'white',
  className = '',
  ...props
}: CardProps) => {
  return (
    <div
      className={`${CARD_TOKENS.base} ${CARD_TOKENS.variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}
