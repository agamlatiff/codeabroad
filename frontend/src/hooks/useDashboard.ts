import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import type { AvatarStyle } from '../utils/avatar'
import type { KodiPose } from '../components/ui/MascotCard'
import { getKodiPoseMessage } from '../static/dashboard'
import { formatTimezoneClock } from '../utils/date'

const AVATAR_STYLE_STORAGE_KEY = 'codeabroad_avatar_style'

/**
 * Headless controller hook managing state orchestration, profile synchronization,
 * live clocks, avatar styles, and mascot interactions for DashboardPage.
 */
export const useDashboard = () => {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuthStore()

  // 1. Profile Synchronization via TanStack Query
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  })

  // Synchronize fresh profile with client Zustand store
  useEffect(() => {
    if (profile) {
      updateUser(profile)
    }
  }, [profile, updateUser])

  // Active user data (prefers freshly queried profile over initial store)
  const activeUser = profile || user

  // Derived user display details
  const firstName = activeUser?.name?.split(' ')[0] || 'Developer'
  const destinationName = activeUser?.country?.name || 'Tokyo, Jepang'

  // 2. Live Dual Timezone Clocks (Tokyo JST & Jakarta WIB)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const tokyoTime = formatTimezoneClock(currentTime, 'Asia/Tokyo')
  const jakartaTime = formatTimezoneClock(currentTime, 'Asia/Jakarta')

  // 3. Avatar Style State & Persistence
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>(() => {
    return (localStorage.getItem(AVATAR_STYLE_STORAGE_KEY) as AvatarStyle) || 'adventurer'
  })

  const handleAvatarStyleChange = (style: AvatarStyle) => {
    setAvatarStyle(style)
    localStorage.setItem(AVATAR_STYLE_STORAGE_KEY, style)
  }

  // 4. Kodi Mascot Pose & Message State
  const [currentPose, setCurrentPose] = useState<KodiPose>('welcome')
  const kodiMessage = getKodiPoseMessage(currentPose, firstName, destinationName)

  // 5. Logout Action
  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch {
      // Gracefully clear client session if server unreachable
    } finally {
      logout()
      navigate('/login', { replace: true })
    }
  }

  return {
    // 1. Active User Profile Data
    profile: {
      user: activeUser,
      firstName,
      destinationName,
    },

    // 2. Live Clocks
    clock: {
      tokyoTime,
      jakartaTime,
    },

    // 3. Mascot Interactions
    mascot: {
      pose: currentPose,
      setPose: setCurrentPose,
      message: kodiMessage,
    },

    // 4. Avatar Customization
    avatar: {
      style: avatarStyle,
      setStyle: handleAvatarStyleChange,
    },

    // 5. Actions
    actions: {
      logout: handleLogout,
    },
  }
}
