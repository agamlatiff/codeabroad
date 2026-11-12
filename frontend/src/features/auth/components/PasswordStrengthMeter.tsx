import type { FC } from 'react'
import { useMemo } from 'react'
import {
  evaluatePasswordStrength,
  PASSWORD_BAR_INACTIVE_CLASS,
  PASSWORD_STRENGTH_STEPS,
} from "@/shared/utils/validation"

export interface PasswordStrengthMeterProps {
  password: string
}

export const PasswordStrengthMeter: FC<PasswordStrengthMeterProps> = ({ password }) => {
  const strength = useMemo(() => evaluatePasswordStrength(password), [password])

  if (!password) return null

  return (
    <div className="mt-1.5 space-y-1 transition-all duration-200">
      {/* 4-Segment Progress Bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1 w-full">
        {PASSWORD_STRENGTH_STEPS.map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              strength.score >= step ? strength.barColor : PASSWORD_BAR_INACTIVE_CLASS
            }`}
          />
        ))}
      </div>

      {/* Label & Dynamic Hint */}
      <div className="flex items-center justify-between text-[11px] leading-tight select-none">
        <span className={`font-semibold ${strength.textColor}`}>
          Kekuatan: {strength.label}
        </span>
        <span className="text-slate-400 font-normal">{strength.hint}</span>
      </div>
    </div>
  )
}
