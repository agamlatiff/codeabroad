import type { InputHTMLAttributes } from 'react'

export interface AuthCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const AuthCheckbox = ({ label, id, ...props }: AuthCheckboxProps) => (
  <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none">
    <input
      id={id}
      type="checkbox"
      className="w-4 h-4 rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
      {...props}
    />
    <span className="text-xs text-slate-600 font-medium">{label}</span>
  </label>
)
