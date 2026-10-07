/**
 * Pre-flight validation utilities for client-side forms.
 */

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
    if (password.length < 8) {
      return 'Kata sandi minimal 8 karakter'
    }
    if (password.length > 72) {
      return 'Kata sandi maksimal 72 karakter'
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
