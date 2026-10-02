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
        <label htmlFor={id} className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}

        <input
          id={id}
          className={`w-full bg-[#12131A] border rounded-2xl py-3 text-sm text-white placeholder-slate-600 transition-all duration-150 focus:outline-none focus:ring-2 ${
            icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error
              ? 'border-rose-500/50 focus:ring-rose-500/20'
              : 'border-white/10 focus:border-cyan-500/60 focus:ring-cyan-500/20'
          } ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
