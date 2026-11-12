/**
 * Pre-flight validation utilities and password strength helpers for client-side forms.
 */

export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_STRONG_LENGTH = 12
export const PASSWORD_MAX_LENGTH = 72

export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4

export interface PasswordStrengthInfo {
  score: PasswordStrengthScore
  label: string
  hint: string
  textColor: string
  barColor: string
}

export const PASSWORD_STRENGTH_STEPS = [1, 2, 3, 4] as const
export const PASSWORD_BAR_INACTIVE_CLASS = 'bg-slate-200'

const PASSWORD_STRENGTH_MAP: Record<PasswordStrengthScore, PasswordStrengthInfo> = {
  0: {
    score: 0,
    label: '',
    hint: '',
    textColor: '',
    barColor: PASSWORD_BAR_INACTIVE_CLASS,
  },
  1: {
    score: 1,
    label: 'Lemah',
    hint: `Gunakan minimal ${PASSWORD_MIN_LENGTH} karakter`,
    textColor: 'text-rose-500',
    barColor: 'bg-rose-500',
  },
  2: {
    score: 2,
    label: 'Cukup',
    hint: 'Tambahkan huruf besar & angka',
    textColor: 'text-amber-500',
    barColor: 'bg-amber-500',
  },
  3: {
    score: 3,
    label: 'Kuat',
    hint: 'Kombinasi kata sandi sudah bagus!',
    textColor: 'text-emerald-500',
    barColor: 'bg-emerald-500',
  },
  4: {
    score: 4,
    label: 'Sangat Kuat',
    hint: 'Kata sandi sangat aman & terlindungi 🛡️',
    textColor: 'text-blue-600',
    barColor: 'bg-blue-600',
  },
}

/**
 * Evaluates password strength score (0-4) and returns its visual metadata.
 */
export const evaluatePasswordStrength = (password: string): PasswordStrengthInfo => {
  if (!password) {
    return PASSWORD_STRENGTH_MAP[0]
  }

  let score = 0
  if (password.length >= PASSWORD_MIN_LENGTH) score += 1
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password) || password.length >= PASSWORD_STRONG_LENGTH) score += 1

  return PASSWORD_STRENGTH_MAP[score as PasswordStrengthScore]
}
