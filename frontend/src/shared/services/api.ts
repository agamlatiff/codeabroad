import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import type { User } from '@/shared/types/user'
import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

interface RefreshSessionPayload {
  user?: User | null
  access_token: string
  refresh_token: string
}

export interface AuthInterceptorBridge {
  getAccessToken: () => string | null
  getRefreshToken: () => string | null
  setTokens: (accessToken: string, refreshToken: string) => void
  updateUser: (updatedFields: Partial<User>) => void
  clearSession: () => void
}

let authBridge: AuthInterceptorBridge | null = null

/**
 * Registers auth state bridge from authStore during initialization,
 * preventing shared/services/api from importing features/auth directly.
 */
export const registerAuthInterceptorBridge = (bridge: AuthInterceptorBridge): void => {
  authBridge = bridge
}

export interface RequestOptions {
  signal?: AbortSignal
}

export const unwrapApiResponse = <T>(
  response: AxiosResponse<ApiResponse<T>>,
  fallbackError: string = 'Terjadi kesalahan pada server'
): T => {
  if (response.data.success && response.data.data !== undefined) {
    return response.data.data
  }
  throw new Error(response.data.error || fallbackError)
}

export const extractApiErrorMessage = (
  error: unknown,
  fallback: string = 'Terjadi kesalahan pada server'
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: unknown; message?: unknown } | undefined
    if (typeof data?.error === 'string' && data.error.trim().length > 0) {
      return data.error
    }
    if (typeof data?.message === 'string' && data.message.trim().length > 0) {
      return data.message
    }
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }
  return fallback
}

export const sanitizeAxiosErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 'network'
    const method = (error.config?.method ?? 'GET').toUpperCase()
    const path = (error.config?.url ?? '').split('?')[0]
    return `[${method} ${path}] status=${status}`
  }
  return error instanceof Error ? error.message : 'Unknown error'
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = authBridge?.getAccessToken() ?? null
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

const isAuthBypassPath = (rawUrl?: string): boolean => {
  if (!rawUrl) return false
  const cleanPath = rawUrl.split('?')[0].split('#')[0].replace(/\/+$/, '')
  return (
    cleanPath.endsWith('/auth/login') ||
    cleanPath.endsWith('/auth/register') ||
    cleanPath.endsWith('/auth/google') ||
    cleanPath.endsWith('/auth/refresh') ||
    cleanPath.endsWith('/auth/logout') ||
    cleanPath.endsWith('/auth/logout-all')
  )
}

let inFlightRefreshPromise: Promise<string | null> | null = null

const performLockedTokenRefresh = async (initiatingRefreshToken: string): Promise<string | null> => {
  if (!authBridge) {
    throw new Error('Auth bridge not initialized')
  }

  // Re-read current refresh token inside lock; another tab or queued caller may have rotated it already.
  const latestRefreshToken = authBridge.getRefreshToken()
  const latestAccessToken = authBridge.getAccessToken()
  if (latestRefreshToken && latestRefreshToken !== initiatingRefreshToken && latestAccessToken) {
    return latestAccessToken
  }
  if (!latestRefreshToken) {
    return null
  }

  const response = await axios.post<ApiResponse<RefreshSessionPayload>>(
    `${API_BASE_URL}/auth/refresh`,
    { refresh_token: latestRefreshToken },
    { timeout: 10000 }
  )

  const data = response.data
  if (!data.success || !data.data) {
    throw new Error('Refresh token rejected')
  }

  const { access_token, refresh_token, user } = data.data
  authBridge.setTokens(access_token, refresh_token)
  if (user) {
    authBridge.updateUser(user)
  }
  return access_token
}

const coordinateRefresh = (initiatingRefreshToken: string): Promise<string | null> => {
  if (inFlightRefreshPromise) {
    return inFlightRefreshPromise
  }

  const run = async () => {
    try {
      const locks = typeof navigator !== 'undefined' ? navigator.locks : undefined
      if (locks && typeof locks.request === 'function') {
        return await locks.request('merantalk_auth_refresh', () =>
          performLockedTokenRefresh(initiatingRefreshToken)
        )
      }
      return await performLockedTokenRefresh(initiatingRefreshToken)
    } finally {
      inFlightRefreshPromise = null
    }
  }

  inFlightRefreshPromise = run()
  return inFlightRefreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthBypassPath(originalRequest.url)
    ) {
      const initiatingRefreshToken = authBridge?.getRefreshToken() ?? null
      if (!initiatingRefreshToken) {
        authBridge?.clearSession()
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        const nextAccessToken = await coordinateRefresh(initiatingRefreshToken)
        if (!nextAccessToken) {
          throw new Error('Refresh token rejected')
        }
        if (originalRequest.signal?.aborted) {
          return Promise.reject(error)
        }
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`
        }
        return api(originalRequest)
      } catch (refreshErr) {
        const latestRefreshToken = authBridge?.getRefreshToken()
        const latestAccessToken = authBridge?.getAccessToken()
        if (
          latestRefreshToken &&
          latestRefreshToken !== initiatingRefreshToken &&
          latestAccessToken
        ) {
          if (originalRequest.signal?.aborted) {
            return Promise.reject(error)
          }
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${latestAccessToken}`
          }
          return api(originalRequest)
        }

        const status = axios.isAxiosError(refreshErr) ? refreshErr.response?.status : undefined
        const isExplicitAuthRejection =
          status === 401 ||
          status === 403 ||
          (refreshErr instanceof Error && refreshErr.message === 'Refresh token rejected')

        if (isExplicitAuthRejection) {
          authBridge?.clearSession()
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(refreshErr)
      }
    }

    return Promise.reject(error)
  }
)
