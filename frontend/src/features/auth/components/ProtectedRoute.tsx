import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from "@/features/auth/store/authStore"

// ProtectedRoute ensures the user is authenticated and has completed onboarding
export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => Boolean(state.isAuthenticated && state.refreshToken && state.user))
  const user = useAuthStore((state) => state.user)

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // Gatekeeping: redirect to onboarding if profile setup is not yet completed
  if (!user.is_onboarded) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}

// OnboardingRoute allows only authenticated users who have NOT yet completed onboarding
export const OnboardingRoute = () => {
  const isAuthenticated = useAuthStore((state) => Boolean(state.isAuthenticated && state.refreshToken && state.user))
  const user = useAuthStore((state) => state.user)

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // If already onboarded, redirect forward to curriculum
  if (user.is_onboarded) {
    return <Navigate to="/curriculum" replace />
  }

  return <Outlet />
}

// GuestRoute allows ONLY unauthenticated guests (redirects logged-in users away from /login & /register)
export const GuestRoute = () => {
  const isAuthenticated = useAuthStore((state) => Boolean(state.isAuthenticated && state.refreshToken && state.user))
  const user = useAuthStore((state) => state.user)

  if (isAuthenticated && user) {
    // If logged in but not onboarded yet, redirect to onboarding
    if (!user.is_onboarded) {
      return <Navigate to="/onboarding" replace />
    }
    // If logged in and already onboarded, redirect to curriculum
    return <Navigate to="/curriculum" replace />
  }

  return <Outlet />
}

