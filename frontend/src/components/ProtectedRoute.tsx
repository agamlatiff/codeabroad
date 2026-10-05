import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

// ProtectedRoute ensures the user is authenticated and has completed onboarding
export const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Gatekeeping: redirect to onboarding if profile setup is not yet completed
  if (user && !user.is_onboarded) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}

// OnboardingRoute allows only authenticated users who have NOT yet completed onboarding
export const OnboardingRoute = () => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If already onboarded, redirect forward to dashboard
  if (user && user.is_onboarded) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

// GuestRoute allows ONLY unauthenticated guests (redirects logged-in users away from /login & /register)
export const GuestRoute = () => {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated) {
    // If logged in but not onboarded yet, redirect to onboarding
    if (user && !user.is_onboarded) {
      return <Navigate to="/onboarding" replace />
    }
    // If logged in and already onboarded, redirect to dashboard
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

