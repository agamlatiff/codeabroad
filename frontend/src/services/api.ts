
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/authStore'
import type { ApiResponse, AuthResponse } from '../types/auth'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

export const api = axios.create({
    baseURL: API_BASE_URL,
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
            // Prevent infinite refresh loop on auth endpoints
            if (
                originalRequest.url?.includes('/auth/login') ||
                originalRequest.url?.includes('/auth/register') ||
                originalRequest.url?.includes('/auth/refresh')
            ) {
                return Promise.reject(error)
            }

            const { refreshToken, setTokens, logout } = useAuthStore.getState()

            if (!refreshToken) {
                logout()
                return Promise.reject(error)
            }

            // If another refresh call is already in progress, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                // Request a new token pair from backend
                const response = await axios.post<ApiResponse<AuthResponse>>(
                    `${API_BASE_URL}/auth/refresh`,
                    { refresh_token: refreshToken }
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
