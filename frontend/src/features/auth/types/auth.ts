import { z } from 'zod'
import type { User } from "@/features/user/types/user"

/**
 * AUTH DOMAIN CONTRACTS & ZOD SCHEMAS
 * Directly mirrors backend `backend/internal/app/auth/domain.go`.
 */

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Alamat email wajib diisi')
    .max(255, 'Alamat email maksimal 255 karakter')
    .email('Format email tidak valid (contoh: nama@domain.com)'),
  password: z
    .string()
    .min(1, 'Kata sandi wajib diisi')
    .max(72, 'Kata sandi maksimal 72 karakter'),
  remember_me: z.boolean().optional(),
})

export type LoginPayload = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama lengkap wajib diisi')
    .min(2, 'Nama terlalu pendek (minimal 2 karakter)')
    .max(100, 'Nama terlalu panjang (maksimal 100 karakter)'),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Username wajib diisi')
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username hanya boleh huruf, angka, garis bawah (_), dan strip (-)'),
  email: z
    .string()
    .trim()
    .min(1, 'Alamat email wajib diisi')
    .max(255, 'Alamat email maksimal 255 karakter')
    .email('Format email tidak valid (contoh: nama@domain.com)'),
  password: z
    .string()
    .min(1, 'Kata sandi wajib diisi')
    .min(8, 'Kata sandi minimal 8 karakter')
    .max(72, 'Kata sandi maksimal 72 karakter'),
})

export type RegisterPayload = z.infer<typeof registerSchema>

export interface RefreshTokenPayload {
  refresh_token: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
}
