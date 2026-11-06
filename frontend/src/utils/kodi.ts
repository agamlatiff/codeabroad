import type { KodiPose } from '../components/ui/MascotCard'

/**
 * Returns dynamic speech bubble message for Kodi mascot.
 */
export const getKodiPoseMessage = (
  pose: KodiPose,
  firstName: string = 'Developer',
  destinationName: string = 'Tokyo, Jepang'
): string => {
  const messages: Record<KodiPose, string> = {
    welcome: `Konnichiwa, ${firstName}-san! Kodi siap mendampingi persiapan teknismu menuju karier global di ${destinationName}! 🎌`,
    coding: `Mode fokus AKTIF! Ayo selesaikan quest harian untuk mendongkrak skor interview teknismu... 💻`,
    celebrate: `Yatta! Paspor karier aktif, streak 1 hari bertambah, dan bonus +50 XP siap digunakan! 🎉`,
  }
  return messages[pose] || messages.welcome
}

