import { isAxiosError } from 'axios'
import type { User } from "@/features/user/types/user"

/**
 * Shared pure helpers for auth custom hooks (login, register, logout).
 */

export interface AuthApiErrorPayload {
  error?: string
  message?: string
  code?: string
}

export interface ParsedAuthError {
  status?: number
  rawError: string
  code?: string
  isNetworkError: boolean
}

export const NETWORK_ERROR_MESSAGE = 'Tidak dapat terhubung. Periksa koneksi internet kamu dan coba lagi ya.'
export const PAYLOAD_TOO_LARGE_MESSAGE = 'Data yang dikirim terlalu besar. Mohon periksa kembali formulir kamu.'
export const SERVER_ERROR_MESSAGE = 'Terjadi kendala pada sistem kami. Silakan coba beberapa saat lagi.'

/** Normalizes an unknown mutation error into a predictable shape. */
export const parseAuthError = (err: unknown): ParsedAuthError => {
  if (!isAxiosError<AuthApiErrorPayload>(err)) {
    return { rawError: '', isNetworkError: true }
  }
  const serverMessage = err.response?.data?.error || err.response?.data?.message
  const serverCode = err.response?.data?.code
  return {
    status: err.response?.status,
    rawError: (serverMessage || '').toLowerCase(),
    code: serverCode ? serverCode.toUpperCase() : undefined,
    isNetworkError: !err.response,
  }
}

/** Builds the rate-limit (HTTP 429) message for a given auth action. */
export const rateLimitMessage = (action: 'masuk' | 'pendaftaran') =>
  `Terlalu banyak percobaan ${action}. Demi keamanan, mohon tunggu 1 menit sebelum mencoba lagi.`

/** Resolves the post-auth landing route based on onboarding status. */
export const resolvePostAuthPath = (user: Pick<User, 'is_onboarded'>) =>
  user.is_onboarded ? '/curriculum' : '/onboarding'

/**
 * O(1) Hash Map lookup dictionary for login error codes.
 */
export const LOGIN_ERROR_MAP: Record<string, string> = {
  INVALID_CREDENTIALS: 'Email atau kata sandi yang kamu masukkan salah. Silakan coba lagi.',
  USER_NOT_FOUND: 'Akun dengan email ini tidak ditemukan.',
  UNAUTHORIZED: 'Email atau kata sandi yang kamu masukkan salah. Silakan coba lagi.',
}

/** Pure error resolver for login action using O(1) lookup dictionary. */
export const resolveLoginErrorMessage = (err: unknown): string => {
  const { status, code, rawError, isNetworkError } = parseAuthError(err)

  if (isNetworkError) return NETWORK_ERROR_MESSAGE
  if (status === 429) return rateLimitMessage('masuk')
  if (status === 413) return PAYLOAD_TOO_LARGE_MESSAGE
  if (status !== undefined && status >= 500) return SERVER_ERROR_MESSAGE

  // 1. O(1) Machine-to-machine dictionary lookup
  if (code && LOGIN_ERROR_MAP[code]) {
    return LOGIN_ERROR_MAP[code]
  }

  // 2. Fallback heuristic for generic network or proxy messages
  if (
    status === 401 ||
    rawError.includes('unauthorized') ||
    rawError.includes('invalid') ||
    rawError.includes('password') ||
    rawError.includes('credential')
  ) {
    return 'Email atau kata sandi yang kamu masukkan salah. Silakan coba lagi.'
  }

  return 'Gagal masuk. Periksa kembali email dan kata sandi kamu.'
}

export type RegisterErrorResult =
  | { type: 'field'; field: 'email' | 'username' | 'password'; message: string }
  | { type: 'general'; message: string }

/**
 * O(1) Hash Map lookup dictionary for registration error codes.
 */
export const REGISTER_ERROR_MAP: Record<string, RegisterErrorResult> = {
  EMAIL_ALREADY_EXISTS: {
    type: 'field',
    field: 'email',
    message: 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.',
  },
  USERNAME_TAKEN: {
    type: 'field',
    field: 'username',
    message: 'Username ini sudah digunakan. Coba username yang lain.',
  },
  INVALID_USERNAME: {
    type: 'field',
    field: 'username',
    message: 'Username hanya boleh huruf, angka, garis bawah (_), dan strip (-).',
  },
}

/** Pure error resolver for register action using O(1) lookup dictionary. */
export const resolveRegisterErrorMessage = (err: unknown): RegisterErrorResult => {
  const { status, code, rawError, isNetworkError } = parseAuthError(err)

  if (isNetworkError) return { type: 'general', message: NETWORK_ERROR_MESSAGE }
  if (status === 429) return { type: 'general', message: rateLimitMessage('pendaftaran') }
  if (status === 413) return { type: 'general', message: PAYLOAD_TOO_LARGE_MESSAGE }
  if (status !== undefined && status >= 500) return { type: 'general', message: SERVER_ERROR_MESSAGE }

  // 1. O(1) Machine-to-machine dictionary lookup
  if (code && REGISTER_ERROR_MAP[code]) {
    return REGISTER_ERROR_MAP[code]
  }

  // 2. Fallback heuristic for unmapped or proxy errors
  if (rawError.includes('email') && (rawError.includes('already') || rawError.includes('exists') || rawError.includes('registered'))) {
    return { type: 'field', field: 'email', message: 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.' }
  }
  if (rawError.includes('username') && (rawError.includes('taken') || rawError.includes('already') || rawError.includes('exists'))) {
    return { type: 'field', field: 'username', message: 'Username ini sudah digunakan. Coba username yang lain.' }
  }
  if (rawError.includes('username') && (rawError.includes('invalid') || rawError.includes('only contain'))) {
    return { type: 'field', field: 'username', message: 'Username hanya boleh huruf, angka, garis bawah (_), dan strip (-).' }
  }
  if (rawError.includes('password')) {
    return { type: 'field', field: 'password', message: 'Kata sandi minimal 8 karakter.' }
  }
  if (status === 409) {
    return { type: 'general', message: 'Data akun sudah terdaftar. Silakan periksa kembali email atau username kamu.' }
  }

  return { type: 'general', message: 'Pendaftaran gagal. Periksa kembali kelengkapan formulir kamu.' }
}
