import { create } from 'zustand'
import type { User } from '../types/user'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, accessToken: string, refreshToken: string, rememberMe?: boolean) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  updateUser: (updatedFields: Partial<User>) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  // Check localStorage (Remember Me) first, then fallback to sessionStorage
  const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  const savedRefreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token')
  const savedAccessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')

  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    accessToken: savedAccessToken || null,
    refreshToken: savedRefreshToken || null,
    isAuthenticated: Boolean(savedRefreshToken),

    setAuth: (user, accessToken, refreshToken, rememberMe = false) => {
      const primaryStorage = rememberMe ? localStorage : sessionStorage
      const secondaryStorage = rememberMe ? sessionStorage : localStorage

      primaryStorage.setItem('user', JSON.stringify(user))
      primaryStorage.setItem('access_token', accessToken)
      primaryStorage.setItem('refresh_token', refreshToken)

      secondaryStorage.removeItem('user')
      secondaryStorage.removeItem('access_token')
      secondaryStorage.removeItem('refresh_token')

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      })
    },

    setTokens: (accessToken, refreshToken) => {
      if (localStorage.getItem('refresh_token')) {
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)
      } else if (sessionStorage.getItem('refresh_token')) {
        sessionStorage.setItem('access_token', accessToken)
        sessionStorage.setItem('refresh_token', refreshToken)
      }

      set({
        accessToken,
        refreshToken,
        isAuthenticated: true,
      })
    },

    updateUser: (updatedFields) => {
      set((state) => {
        if (!state.user) return state
        // Deep-preserve nested relation objects (country, career_path) if incoming payload does not supply them
        const newUser: User = {
          ...state.user,
          ...updatedFields,
          country: updatedFields.country !== undefined ? updatedFields.country : state.user.country,
          career_path: updatedFields.career_path !== undefined ? updatedFields.career_path : state.user.career_path,
        }

        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(newUser))
        } else if (sessionStorage.getItem('user')) {
          sessionStorage.setItem('user', JSON.stringify(newUser))
        }
        return { user: newUser }
      })
    },

    logout: () => {
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      })
    },
  }
})
