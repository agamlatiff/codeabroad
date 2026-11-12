import { api, unwrapApiResponse, type RequestOptions } from "@/shared/services/api"
import type { ApiResponse } from "@/shared/types/api"
import type {
  AuthResponse,
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
   * Terminates active session on the backend.
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        console.warn('[authService.logout] Gagal mencabut sesi di server:', err)
      }
    }
  },
}
