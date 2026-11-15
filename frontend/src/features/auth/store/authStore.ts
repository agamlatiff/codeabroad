import { create } from 'zustand'
import type { User } from "@/features/user/types/user"

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
 * Safe browser storage accessor evaluated once at module initialization
 * and protected against Private Mode / SecurityError exceptions.
 */
const probeBrowserStorage = (type: 'local' | 'session'): Storage | null => {
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

const cachedLocalStorage = probeBrowserStorage('local')
const cachedSessionStorage = probeBrowserStorage('session')

const hasActiveTokenAndUser = (
  data: Pick<AuthSessionData, 'accessToken' | 'refreshToken' | 'user'> | null | undefined
): boolean => Boolean(data?.user && (data.refreshToken || data.accessToken))

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
 * Loads initial session from browser storage (localStorage or sessionStorage based on rememberMe).
 */
const loadInitialSession = (): AuthSessionData => {
  // 1. Check persistent localStorage session (rememberMe: true)
  const storedLocal = safeParseSession(cachedLocalStorage?.getItem(AUTH_STORAGE_KEY) ?? null)
  if (hasActiveTokenAndUser(storedLocal) && storedLocal) {
    return { ...storedLocal, rememberMe: true }
  }

  // 2. Check transient sessionStorage session (rememberMe: false)
  const storedSession = safeParseSession(cachedSessionStorage?.getItem(AUTH_STORAGE_KEY) ?? null)
  if (hasActiveTokenAndUser(storedSession) && storedSession) {
    return { ...storedSession, rememberMe: false }
  }

  // 3. Fallback unauthenticated default
  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    rememberMe: false,
  }
}

const persistSession = (data: AuthSessionData | null, rememberMe: boolean) => {
  const primary = rememberMe ? cachedLocalStorage : cachedSessionStorage
  const secondary = rememberMe ? cachedSessionStorage : cachedLocalStorage

  if (hasActiveTokenAndUser(data) && data) {
    primary?.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
    secondary?.removeItem(AUTH_STORAGE_KEY)
  } else {
    cachedLocalStorage?.removeItem(AUTH_STORAGE_KEY)
    cachedSessionStorage?.removeItem(AUTH_STORAGE_KEY)
  }
}

const initialSession = loadInitialSession()

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialSession.user,
  accessToken: initialSession.accessToken,
  refreshToken: initialSession.refreshToken,
  rememberMe: initialSession.rememberMe,
  isAuthenticated: hasActiveTokenAndUser(initialSession),

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
      isAuthenticated: hasActiveTokenAndUser(sessionData),
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
      isAuthenticated: hasActiveTokenAndUser(sessionData),
    })
  },

  updateUser: (updatedFields) => {
    const state = get()
    if (!state.user) return

    const newUser: User = {
      ...state.user,
      ...updatedFields,
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

// Cross-tab synchronization listener (auto logout / update on localStorage change)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== AUTH_STORAGE_KEY || event.storageArea !== cachedLocalStorage) {
      return
    }

    const parsed = safeParseSession(event.newValue)
    if (hasActiveTokenAndUser(parsed) && parsed) {
      useAuthStore.setState({
        user: parsed.user,
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
        rememberMe: parsed.rememberMe,
        isAuthenticated: true,
      })
      return
    }

    // Preserve active tab session if it is backed by sessionStorage (rememberMe: false)
    const tabSession = safeParseSession(cachedSessionStorage?.getItem(AUTH_STORAGE_KEY) ?? null)
    if (hasActiveTokenAndUser(tabSession)) {
      return
    }

    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      rememberMe: false,
      isAuthenticated: false,
    })
  })
}
