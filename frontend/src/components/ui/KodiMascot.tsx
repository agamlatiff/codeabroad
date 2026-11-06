import type { FC } from 'react'
import { KodiCharacter, type KodiEmotion } from './KodiCharacter'

export type { KodiEmotion }

export interface KodiMascotProps {
  emotion?: KodiEmotion
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  speechText?: string
  speechDirection?: 'bottom' | 'top' | 'left' | 'right'
  animate?: boolean
  glow?: boolean
  className?: string
  interactive?: boolean
  onClick?: () => void
}

/**
 * KodiMascot — Living Mascot Wrapper for CodeAbroad.
 * Seamlessly powered by the vector SVG KodiCharacter (Chiikawa Neko Golden Master).
 */
export const KodiMascot: FC<KodiMascotProps> = ({
  emotion = 'welcome',
  size = 'md',
  speechText,
  interactive = true,
  onClick,
  className = '',
}) => {
  return (
    <KodiCharacter
      emotion={emotion}
      size={size}
      showSpeechBubble={Boolean(speechText)}
      speechText={speechText}
      interactive={interactive}
      onClick={onClick}
      className={className}
    />
  )
}
