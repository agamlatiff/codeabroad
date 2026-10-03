import type { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  error?: string | null
}

export const Input = ({
  label,
  icon,
  error,
  id,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={id}
          className={`w-full bg-white border-2 rounded-2xl py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-150 focus:outline-none ${
            icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error
              ? 'border-rose-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-100'
              : 'border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-900/5'
          } ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
