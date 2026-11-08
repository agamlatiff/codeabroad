import { useState, useEffect } from 'react'
import { useLogout } from './auth/useLogout'
import { useUser } from './user/useUser'
import type { AvatarStyle } from '../utils/avatar'
import type { KodiPose } from '../components/ui/MascotCard'
import { getKodiPoseMessage } from '../utils/kodi'
import { formatTimezoneClock } from '../utils/date'

const AVATAR_STYLE_STORAGE_KEY = 'codeabroad_avatar_style'

/**
 * Headless controller hook managing state orchestration, profile synchronization,
 * live clocks, avatar styles, and mascot interactions for DashboardPage.
 */
export const useDashboard = () => {
  const handleLogout = useLogout()
  const { user: activeUser, refetch: refetchProfile } = useUser()

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
      refetchProfile,
    },
  }
}
