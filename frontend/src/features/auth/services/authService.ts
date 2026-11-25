import { api, unwrapApiResponse, sanitizeAxiosErrorMessage, type RequestOptions } from "@/shared/services/api"
import type { ApiResponse } from "@/shared/types/api"
import type {
  AuthResponse,
  GoogleAuthPayload,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types/auth"

/**
 * Service managing authentication and user session API interactions.
 * Directly corresponds to backend Auth Service (`/api/v1/auth/*`).
 */
export const authService = {
  /**
   * Submits user credentials to authenticate session.
   */
  async login(payload: LoginPayload, options?: RequestOptions): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload, {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal masuk. Silakan coba lagi.')
  },

  /**
   * Submits new user profile details to register account.
   */
  async register(payload: RegisterPayload, options?: RequestOptions): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload, {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Pendaftaran gagal. Silakan coba lagi.')
  },

  /**
   * Exchanges a Google OAuth 2.0 authorization code for Merantalk session tokens.
   */
  async googleAuth(payload: GoogleAuthPayload, options?: RequestOptions): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/google', payload, {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal masuk dengan Google. Silakan coba lagi.')
  },

  /**
   * Terminates active session on the backend.
   */
  async logout(refreshToken?: string | null): Promise<void> {
    try {
      await api.post('/auth/logout', refreshToken ? { refresh_token: refreshToken } : undefined)
    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        console.warn('[authService.logout] Gagal mencabut sesi di server:', sanitizeAxiosErrorMessage(err))
      }
    }
  },

  /**
   * Terminates all active device sessions for this user on the backend.
   */
  async logoutAll(): Promise<void> {
    try {
      await api.post('/auth/logout-all')
    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        console.warn('[authService.logoutAll] Gagal mencabut semua sesi di server:', sanitizeAxiosErrorMessage(err))
      }
    }
  },
}
