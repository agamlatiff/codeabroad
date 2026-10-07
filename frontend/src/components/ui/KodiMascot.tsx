import type { FC } from 'react'
import doodleCelebrate from '../../assets/kodi/doodle-celebrate.png'
import doodleCoding from '../../assets/kodi/doodle-coding.png'
import doodleWelcome from '../../assets/kodi/doodle-welcome.png'
import { SpeechBubble } from './SpeechBubble'

export type KodiEmotion = 'welcome' | 'celebrate' | 'coding' | 'proud'

export interface KodiMascotProps {
  emotion?: KodiEmotion
  size?: 'sm' | 'md' | 'lg' | 'xl'
  speechText?: string
  speechDirection?: 'bottom' | 'top' | 'left' | 'right'
  animate?: boolean
  glow?: boolean
  className?: string
}

/**
 * KodiMascot — The 10% Soul of CodeAbroad.
 * Friendly, tech-savvy companion with emotion switching, speech bubbles, and aura glows.
 */
export const KodiMascot: FC<KodiMascotProps> = ({
  emotion = 'welcome',
  size = 'md',
  speechText,
  speechDirection = 'bottom',
  animate = true,
  glow = true,
  className = '',
}) => {
  // Map emotion to visual asset
  const imageSrc = {
    welcome: doodleWelcome,
    celebrate: doodleCelebrate,
    coding: doodleCoding,
    proud: doodleCelebrate, // Proud posture uses graduation/celebration asset
  }[emotion]

  // Aura glow color by emotion
  const auraColor = {
    welcome: 'bg-blue-500/20',
    celebrate: 'bg-emerald-500/25',
    coding: 'bg-indigo-500/20',
    proud: 'bg-amber-500/25',
  }[emotion]

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-36 sm:h-36',
    xl: 'w-40 h-40 sm:w-48 sm:h-48',
  }[size]

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Optional Speech Bubble above mascot */}
      {speechText && speechDirection === 'bottom' && (
        <div className="mb-2 z-20">
          <SpeechBubble direction="bottom" variant="dark">
            {speechText}
          </SpeechBubble>
        </div>
      )}

      {/* Mascot Image with Atmospheric Aura */}
      <div className={`relative ${sizeClasses} flex items-center justify-center select-none`}>
        {glow && (
          <div
            className={`absolute inset-0 ${auraColor} rounded-full blur-2xl transform scale-110 pointer-events-none`}
          />
        )}
        <img
          src={imageSrc}
          alt={`Kodi ${emotion}`}
          className={`w-full h-full object-contain relative z-10 drop-shadow-md transition-transform duration-300 hover:scale-105 ${
            animate ? 'animate-float' : ''
          }`}
        />
      </div>

      {/* Optional Speech Bubble below mascot */}
      {speechText && speechDirection === 'top' && (
        <div className="mt-2 z-20">
          <SpeechBubble direction="top" variant="dark">
            {speechText}
          </SpeechBubble>
        </div>
      )}
    </div>
  )
}
