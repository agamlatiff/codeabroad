import { create } from 'zustand'
import { z } from 'zod'
import type { User } from "@/shared/types/user"
import { registerAuthInterceptorBridge } from "@/shared/services/api"
import { registerSessionResetHandler } from "@/shared/services/sessionCleanup"

export const AUTH_STORAGE_KEY = 'codeabroad_auth_session'

const persistedUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().min(1),
  name: z.string(),
  username: z.string(),
  created_at: z.string().optional().default(''),
  updated_at: z.string().optional(),
  bio: z.string().nullable().optional(),
  is_onboarded: z.boolean().optional().default(false),
  daily_goal_minutes: z.number().optional(),
  has_seen_roadmap_tour: z.boolean().optional(),
  preferred_roadmap_view: z.enum(['map', 'syllabus']).nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  xp: z.number().optional().default(0),
  current_level: z.number().optional().default(1),
  streak: z.number().optional().default(0),
  gems: z.number().nullable().optional(),
  last_active_at: z.string().nullable().optional(),
})

const persistedSessionSchema = z.object({
  user: persistedUserSchema.nullable(),
  accessToken: z.string().min(1).nullable(),
  refreshToken: z.string().min(1).nullable(),
  rememberMe: z.boolean(),
})

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
 * Safely parses serialized session JSON with strict Zod schema validation.
 */
const safeParseSession = (raw: string | null): AuthSessionData | null => {
  if (!raw) return null
  try {
    const json = JSON.parse(raw)
    const result = persistedSessionSchema.safeParse(json)
    if (!result.success) {
      return null
    }
    return {
      user: result.data.user,
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      rememberMe: result.data.rememberMe,
    }
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

    const hasDiff = (Object.keys(updatedFields) as Array<keyof User>).some(
      (key) => state.user![key] !== updatedFields[key]
    )
    if (!hasDiff) return

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

registerAuthInterceptorBridge({
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  setTokens: (accessToken, refreshToken) => useAuthStore.getState().setTokens(accessToken, refreshToken),
  updateUser: (updatedFields) => useAuthStore.getState().updateUser(updatedFields),
  clearSession: () => useAuthStore.getState().logout(),
})

registerSessionResetHandler(() => {
  useAuthStore.getState().logout()
})

// Cross-tab synchronization listener (auto logout / update on localStorage change or full clear)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.storageArea !== cachedLocalStorage) {
      return
    }
    if (event.key === null) {
      const tabSession = safeParseSession(cachedSessionStorage?.getItem(AUTH_STORAGE_KEY) ?? null)
      if (!hasActiveTokenAndUser(tabSession)) {
        useAuthStore.getState().logout()
      }
      return
    }
    if (event.key !== AUTH_STORAGE_KEY) {
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
