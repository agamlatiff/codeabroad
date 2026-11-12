import { isAxiosError } from 'axios'
// import { API_BASE_URL } from "@/shared/services/api"
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
  return {
    status: err.response?.status,
    rawError: (serverMessage || '').toLowerCase(),
    isNetworkError: !err.response,
  }
}

/** Builds the rate-limit (HTTP 429) message for a given auth action. */
export const rateLimitMessage = (action: 'masuk' | 'pendaftaran') =>
  `Terlalu banyak percobaan ${action}. Demi keamanan, mohon tunggu 1 menit sebelum mencoba lagi.`

/** Resolves the post-auth landing route based on onboarding status. */
export const resolvePostAuthPath = (user: Pick<User, 'is_onboarded'>) =>
  user.is_onboarded ? '/roadmap' : '/onboarding'

/** Pure error resolver for login action without branching ladders. */
export const resolveLoginErrorMessage = (err: unknown): string => {
  const { status, rawError, isNetworkError } = parseAuthError(err)

  if (isNetworkError) return NETWORK_ERROR_MESSAGE
  if (status === 429) return rateLimitMessage('masuk')
  if (status === 413) return PAYLOAD_TOO_LARGE_MESSAGE
  if (status !== undefined && status >= 500) return SERVER_ERROR_MESSAGE
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

/** Pure error resolver for register action without branching ladders. */
export const resolveRegisterErrorMessage = (err: unknown): RegisterErrorResult => {
  const { status, rawError, isNetworkError } = parseAuthError(err)

  if (isNetworkError) return { type: 'general', message: NETWORK_ERROR_MESSAGE }
  if (status === 429) return { type: 'general', message: rateLimitMessage('pendaftaran') }
  if (status === 413) return { type: 'general', message: PAYLOAD_TOO_LARGE_MESSAGE }
  if (status !== undefined && status >= 500) return { type: 'general', message: SERVER_ERROR_MESSAGE }

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

/** Redirects the browser to the backend Google OAuth entrypoint (Temporarily disabled). */
// export const redirectToGoogleOAuth = () => {
//   window.location.href = `${API_BASE_URL}/auth/google`
// }
