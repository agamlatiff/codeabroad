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

export const validateEmail = (email: string): string | null => {
  const trimmed = email.trim()
  if (!trimmed) {
    return 'Alamat email wajib diisi'
  }
  if (trimmed.length > 255) {
    return 'Alamat email maksimal 255 karakter'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'Format email tidak valid (contoh: nama@domain.com)'
  }
  return null
}

export const validatePassword = (password: string, isLogin = false): string | null => {
  if (!password) {
    return 'Kata sandi wajib diisi'
  }
  if (!isLogin) {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return `Kata sandi minimal ${PASSWORD_MIN_LENGTH} karakter`
    }
    if (password.length > PASSWORD_MAX_LENGTH) {
      return `Kata sandi maksimal ${PASSWORD_MAX_LENGTH} karakter`
    }
  }
  return null
}

export const validateName = (name: string): string | null => {
  const trimmed = name.trim()
  if (!trimmed) {
    return 'Nama lengkap wajib diisi'
  }
  if (trimmed.length < 2) {
    return 'Nama terlalu pendek (minimal 2 karakter)'
  }
  if (trimmed.length > 100) {
    return 'Nama terlalu panjang (maksimal 100 karakter)'
  }
  return null
}

export const validateUsername = (username: string): string | null => {
  const trimmed = username.trim()
  if (!trimmed) {
    return 'Username wajib diisi'
  }
  if (trimmed.length < 3) {
    return 'Username minimal 3 karakter'
  }
  if (trimmed.length > 30) {
    return 'Username maksimal 30 karakter'
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return 'Username hanya boleh huruf, angka, dan garis bawah (_)'
  }
  return null
}

export const validateLoginForm = (email: string, password: string): Record<string, string> => {
  const errors: Record<string, string> = {}
  const emailErr = validateEmail(email)
  if (emailErr) errors.email = emailErr

  const passErr = validatePassword(password, true)
  if (passErr) errors.password = passErr

  return errors
}

export const validateRegisterForm = (
  name: string,
  username: string,
  email: string,
  password: string
): Record<string, string> => {
  const errors: Record<string, string> = {}
  const nameErr = validateName(name)
  if (nameErr) errors.name = nameErr

  const userErr = validateUsername(username)
  if (userErr) errors.username = userErr

  const emailErr = validateEmail(email)
  if (emailErr) errors.email = emailErr

  const passErr = validatePassword(password, false)
  if (passErr) errors.password = passErr

  return errors
}
