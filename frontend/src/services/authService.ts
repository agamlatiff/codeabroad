import { api } from './api'
import type { ApiResponse, AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth'

/**
 * Service managing authentication and user identity API interactions.
 */
export const authService = {
  /**
   * Submits user credentials to authenticate session.
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload)
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Gagal masuk. Silakan coba lagi.')
    }
    return response.data.data
  },

  /**
   * Submits new user profile details to register account.
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload)
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Pendaftaran gagal. Silakan coba lagi.')
    }
    return response.data.data
  },

  /**
   * Fetches latest user profile data from /users/me.
   */
  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/users/me')
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Gagal memuat profil pengguna.')
    }
    return response.data.data
  },

  /**
   * Terminates active session on the backend.
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch {
      // Gracefully ignore network errors during sign out
    }
  },
}
