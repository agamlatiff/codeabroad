import { create } from 'zustand'
import type { User } from '../types/auth'


interface AuthState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    setAuth: (user: User, accessToken: string, refreshToken: string) => void
    setTokens: (accessToken: string, refreshToken: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => {
    const savedUser = localStorage.getItem('user')
    const savedRefreshToken = localStorage.getItem('refresh_token')

    return {
        user: savedUser ? JSON.parse(savedUser) : null,
        accessToken: null,
        refreshToken: savedRefreshToken,
        isAuthenticated: !!savedRefreshToken,

        setAuth: (user, accessToken, refreshToken) => {
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('refresh_token', refreshToken)
            set({
                user,
                accessToken,
                refreshToken,
                isAuthenticated: true,
            })
        },

        setTokens: (accessToken, refreshToken) => {
            localStorage.setItem('refresh_token', refreshToken)
            set({
                accessToken,
                refreshToken,
                isAuthenticated: true,
            })
        },

        logout: () => {
            localStorage.removeItem('user')
            localStorage.removeItem('refresh_token')
            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
            })
        },
    }
})