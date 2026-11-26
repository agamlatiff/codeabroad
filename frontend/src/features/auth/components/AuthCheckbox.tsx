import type { InputHTMLAttributes } from 'react'

export interface AuthCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const AuthCheckbox = ({ label, id, ...props }: AuthCheckboxProps) => (
  <label
    htmlFor={id}
    className="flex items-center gap-2 cursor-pointer select-none has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed"
  >
    <input
      id={id}
      type="checkbox"
      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
      {...props}
    />
    <span className="text-xs text-slate-600 font-medium">{label}</span>
  </label>
)
