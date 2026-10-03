import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'white' | 'pastel-mint' | 'pastel-sky' | 'doodle'
}

export const Card = ({
  children,
  variant = 'white',
  className = '',
  ...props
}: CardProps) => {
  const variantStyles = {
    white: 'bg-white border-2 border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
    'pastel-mint': 'bg-[#EDF7F2] border-2 border-[#D1EBDD]',
    'pastel-sky': 'bg-[#F0F7FF] border-2 border-[#D6E8FC]',
    doodle: 'bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A]',
  }[variant]

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 relative overflow-hidden transition-all duration-200 ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
