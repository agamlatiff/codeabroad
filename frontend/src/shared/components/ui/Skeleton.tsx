import type { HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'pill' | 'circle'
}

const VARIANT_CLASSES: Record<NonNullable<SkeletonProps['variant']>, string> = {
  rect: 'rounded-2xl',
  pill: 'rounded-full',
  circle: 'rounded-full',
}

/**
 * Tactile skeleton placeholder aligned with Merantalk's surface palette.
 */
export const Skeleton = ({
  variant = 'rect',
  className = '',
  ...props
}: SkeletonProps) => (
  <div
    aria-hidden="true"
    className={`bg-slate-200/80 animate-pulse ${VARIANT_CLASSES[variant]} ${className}`.trim()}
    {...props}
  />
)
