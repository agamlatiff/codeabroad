import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from "@/features/auth/store/authStore"
import type { ApiResponse } from "@/shared/types/api"
import type { AuthResponse } from "@/features/auth/types/auth"
import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

/**
 * Standard request options for service methods (supports cancellation via AbortSignal).
 */
export interface RequestOptions {
    signal?: AbortSignal
}

/**
 * Unwraps data from standard Go API response envelope (response.go).
 * Throws a formatted Error with backend error message or provided fallback.
 */
export const unwrapApiResponse = <T>(
    response: AxiosResponse<ApiResponse<T>>,
    fallbackError: string = 'Terjadi kesalahan pada server'
): T => {
    if (response.data.success && response.data.data !== undefined) {
        return response.data.data
    }
    throw new Error(response.data.error || fallbackError)
}

/**
 * Extracts a human-readable backend error message from AxiosError or native Error instances.
 */
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

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000, // 15 seconds request timeout
    headers: {
        'Content-Type': 'application/json',
    },
})

// 1. Request Interceptor: Automatically attach Bearer Access Token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = useAuthStore.getState().accessToken
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// 2. Response Interceptor: Seamless Auto-Refresh Token Rotation on 401
let isRefreshing = false
let failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error)
        } else {
            promise.resolve()
        }
    })
    failedQueue = []
}

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // If 401 Unauthorized and request has not been retried yet
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            // Prevent infinite refresh loop on auth endpoints (including logout)
            if (
                originalRequest.url?.includes('/auth/login') ||
                originalRequest.url?.includes('/auth/register') ||
                originalRequest.url?.includes('/auth/refresh') ||
                originalRequest.url?.includes('/auth/logout')
            ) {
                return Promise.reject(error)
            }

            const { refreshToken, setTokens, logout } = useAuthStore.getState()

            if (!refreshToken) {
                logout()
                return Promise.reject(error)
            }

            // Mark original request as retried before queuing or executing refresh
            originalRequest._retry = true

            // If another refresh call is already in progress, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err))
            }

            isRefreshing = true

            try {
                // Request a new token pair from backend
                const response = await axios.post<ApiResponse<AuthResponse>>(
                    `${API_BASE_URL}/auth/refresh`,
                    { refresh_token: refreshToken },
                    { timeout: 10000 }
                )

                const data = response.data
                if (data.success && data.data) {
                    const { access_token, refresh_token } = data.data
                    setTokens(access_token, refresh_token)

                    processQueue(null)

                    // Re-attempt original request with the new access token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${access_token}`
                    }
                    return api(originalRequest)
                } else {
                    throw new Error('Refresh token rejected')
                }
            } catch (refreshErr) {
                processQueue(refreshErr)

                logout()
                window.location.href = '/login'
                return Promise.reject(refreshErr)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)
