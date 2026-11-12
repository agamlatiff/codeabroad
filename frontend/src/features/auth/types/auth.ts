import type { User } from "@/features/user/types/user"

/**
 * AUTH DOMAIN CONTRACTS
 * Directly mirrors backend `backend/internal/domain/auth.go`.
 */

export interface LoginPayload {
  email: string
  password: string
  remember_me?: boolean
}

export interface RegisterPayload {
  name: string
  username: string
  email: string
  password: string
}

export interface RefreshTokenPayload {
  refresh_token: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
}
