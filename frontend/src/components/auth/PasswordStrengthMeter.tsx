import type { FC } from 'react'
import { useMemo } from 'react'

export interface PasswordStrengthMeterProps {
  password: string
}

export const PasswordStrengthMeter: FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { score, label, colorClass, hint } = useMemo(() => {
    if (!password) {
      return { score: 0, label: '', colorClass: '', hint: '' }
    }

    let currentScore = 0
    // Criteria 1: At least 8 characters
    if (password.length >= 8) currentScore += 1
    // Criteria 2: Both uppercase and lowercase
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) currentScore += 1
    // Criteria 3: Contains number
    if (/\d/.test(password)) currentScore += 1
    // Criteria 4: Special characters or length >= 12
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) currentScore += 1

    switch (currentScore) {
      case 1:
        return {
          score: 1,
          label: 'Lemah',
          colorClass: 'text-rose-500',
          hint: 'Gunakan minimal 8 karakter',
        }
      case 2:
        return {
          score: 2,
          label: 'Cukup',
          colorClass: 'text-amber-500',
          hint: 'Tambahkan huruf besar & angka',
        }
      case 3:
        return {
          score: 3,
          label: 'Kuat',
          colorClass: 'text-emerald-500',
          hint: 'Kombinasi kata sandi sudah bagus!',
        }
      case 4:
        return {
          score: 4,
          label: 'Sangat Kuat',
          colorClass: 'text-blue-600',
          hint: 'Kata sandi sangat aman & terlindungi 🛡️',
        }
      default:
        return {
          score: 0,
          label: '',
          colorClass: '',
          hint: '',
        }
    }
  }, [password])

  if (!password) return null

  return (
    <div className="mt-1.5 space-y-1 transition-all duration-200">
      {/* 4-Segment Progress Bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              score >= step
                ? score === 1
                  ? 'bg-rose-500'
                  : score === 2
                  ? 'bg-amber-500'
                  : score === 3
                  ? 'bg-emerald-500'
                  : 'bg-blue-600'
                : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Label & Dynamic Hint */}
      <div className="flex items-center justify-between text-[11px] leading-tight select-none">
        <span className={`font-semibold ${colorClass}`}>
          Kekuatan: {label}
        </span>
        <span className="text-slate-400 font-normal">{hint}</span>
      </div>
    </div>
  )
}
