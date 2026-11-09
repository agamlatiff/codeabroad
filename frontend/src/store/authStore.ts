import { create } from 'zustand'
import type { User } from '../types/user'

export const AUTH_STORAGE_KEY = 'codeabroad_auth_session'

export interface AuthSessionData {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  rememberMe: boolean
}

export interface AuthState extends AuthSessionData {
  isAuthenticated: boolean
  setAuth: (user: User, accessToken: string, refreshToken: string, rememberMe?: boolean) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  updateUser: (updatedFields: Partial<User>) => void
  logout: () => void
}

/**
 * Safe browser storage accessor protected against Private Mode / SecurityError exceptions.
 */
const getBrowserStorage = (type: 'local' | 'session'): Storage | null => {
  if (typeof window === 'undefined') return null
  try {
    const storage = type === 'local' ? window.localStorage : window.sessionStorage
    const probeKey = '__storage_probe__'
    storage.setItem(probeKey, '1')
    storage.removeItem(probeKey)
    return storage
  } catch {
    return null
  }
}

/**
 * Safely parses serialized session JSON.
 */
const safeParseSession = (raw: string | null): AuthSessionData | null => {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      return {
        user: parsed.user ?? null,
        accessToken: parsed.accessToken ?? null,
        refreshToken: parsed.refreshToken ?? null,
        rememberMe: Boolean(parsed.rememberMe),
      }
    }
    return null
  } catch {
    return null
  }
}

/**
 * Loads initial session with seamless backward compatibility migration for legacy keys.
 */
const loadInitialSession = (): AuthSessionData => {
  const local = getBrowserStorage('local')
  const session = getBrowserStorage('session')

  // 1. Check primary unified storage key
  const storedLocal = safeParseSession(local?.getItem(AUTH_STORAGE_KEY) ?? null)
  if (storedLocal?.refreshToken) {
    return { ...storedLocal, rememberMe: true }
  }

  const storedSession = safeParseSession(session?.getItem(AUTH_STORAGE_KEY) ?? null)
  if (storedSession?.refreshToken) {
    return { ...storedSession, rememberMe: false }
  }

  // 2. Backward compatibility migration from legacy separate keys ('user', 'access_token', 'refresh_token')
  const legacyRefreshToken = local?.getItem('refresh_token') || session?.getItem('refresh_token')
  if (legacyRefreshToken) {
    const isLocal = Boolean(local?.getItem('refresh_token'))
    const legacyAccessToken = (isLocal ? local : session)?.getItem('access_token') || null
    const legacyRawUser = (isLocal ? local : session)?.getItem('user') || null
    let legacyUser: User | null = null
    try {
      legacyUser = legacyRawUser ? JSON.parse(legacyRawUser) : null
    } catch {
      legacyUser = null
    }

    const migrated: AuthSessionData = {
      user: legacyUser,
      accessToken: legacyAccessToken,
      refreshToken: legacyRefreshToken,
      rememberMe: isLocal,
    }

    // Persist to unified storage and clean up legacy raw keys
    const targetStorage = isLocal ? local : session
    targetStorage?.setItem(AUTH_STORAGE_KEY, JSON.stringify(migrated))
    local?.removeItem('user')
    local?.removeItem('access_token')
    local?.removeItem('refresh_token')
    session?.removeItem('user')
    session?.removeItem('access_token')
    session?.removeItem('refresh_token')

    return migrated
  }

  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    rememberMe: false,
  }
}

const persistSession = (data: AuthSessionData | null, rememberMe: boolean) => {
  const local = getBrowserStorage('local')
  const session = getBrowserStorage('session')
  const primary = rememberMe ? local : session
  const secondary = rememberMe ? session : local

  if (data?.refreshToken) {
    primary?.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
    secondary?.removeItem(AUTH_STORAGE_KEY)
  } else {
    local?.removeItem(AUTH_STORAGE_KEY)
    session?.removeItem(AUTH_STORAGE_KEY)
  }
}

const initialSession = loadInitialSession()

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialSession.user,
  accessToken: initialSession.accessToken,
  refreshToken: initialSession.refreshToken,
  rememberMe: initialSession.rememberMe,
  isAuthenticated: Boolean(initialSession.refreshToken),

  setAuth: (user, accessToken, refreshToken, rememberMe = false) => {
    const sessionData: AuthSessionData = {
      user,
      accessToken,
      refreshToken,
      rememberMe,
    }
    persistSession(sessionData, rememberMe)
    set({
      ...sessionData,
      isAuthenticated: true,
    })
  },

  setTokens: (accessToken, refreshToken) => {
    const state = get()
    const sessionData: AuthSessionData = {
      user: state.user,
      accessToken,
      refreshToken,
      rememberMe: state.rememberMe,
    }
    persistSession(sessionData, state.rememberMe)
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
    })
  },

  updateUser: (updatedFields) => {
    const state = get()
    if (!state.user) return

    const newUser: User = {
      ...state.user,
      ...updatedFields,
      country: updatedFields.country !== undefined ? updatedFields.country : state.user.country,
      career_path: updatedFields.career_path !== undefined ? updatedFields.career_path : state.user.career_path,
    }

    const sessionData: AuthSessionData = {
      user: newUser,
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
      rememberMe: state.rememberMe,
    }
    persistSession(sessionData, state.rememberMe)
    set({ user: newUser })
  },

  logout: () => {
    persistSession(null, false)
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      rememberMe: false,
      isAuthenticated: false,
    })
  },
}))

// Cross-tab synchronization listener (auto logout / update on storage change)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === AUTH_STORAGE_KEY) {
      const parsed = safeParseSession(event.newValue)
      if (parsed?.refreshToken) {
        useAuthStore.setState({
          user: parsed.user,
          accessToken: parsed.accessToken,
          refreshToken: parsed.refreshToken,
          rememberMe: parsed.rememberMe,
          isAuthenticated: true,
        })
      } else {
        useAuthStore.setState({
          user: null,
          accessToken: null,
          refreshToken: null,
          rememberMe: false,
          isAuthenticated: false,
        })
      }
    }
  })
}
