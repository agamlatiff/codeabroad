import { isAxiosError } from 'axios'
// import { API_BASE_URL } from '../../services/api'
import type { User } from '../../types/user'

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

/** Redirects the browser to the backend Google OAuth entrypoint (Temporarily disabled). */
// export const redirectToGoogleOAuth = () => {
//   window.location.href = `${API_BASE_URL}/auth/google`
// }
