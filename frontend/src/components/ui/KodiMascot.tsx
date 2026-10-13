import type { FC } from 'react'
import doodleCelebrate from '../../assets/kodi/doodle-celebrate.png'
import doodleCoding from '../../assets/kodi/doodle-coding.png'
import doodleWelcome from '../../assets/kodi/doodle-welcome.png'
import doodleThinking from '../../assets/kodi/doodle-thinking.png'
import doodleStreakWarning from '../../assets/kodi/doodle-streak-warning.png'
import doodleOnFire from '../../assets/kodi/doodle-on-fire.png'
import doodleCoffeeBreak from '../../assets/kodi/doodle-coffee-break.png'
import doodleProud from '../../assets/kodi/doodle-proud.png'
import { SpeechBubble } from './SpeechBubble'

export type KodiEmotion =
  | 'welcome'
  | 'celebrate'
  | 'coding'
  | 'proud'
  | 'thinking'
  | 'warning'
  | 'onFire'
  | 'coffee'

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
 * KodiMascot — The Living Companion of CodeAbroad.
 * Friendly, tech-savvy mascot with 8 distinct emotional states and speech bubbles.
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
    proud: doodleProud,
    thinking: doodleThinking,
    warning: doodleStreakWarning,
    onFire: doodleOnFire,
    coffee: doodleCoffeeBreak,
  }[emotion]

  // Aura glow color by emotion
  const auraColor = {
    welcome: 'bg-blue-500/15',
    celebrate: 'bg-emerald-500/20',
    coding: 'bg-blue-500/15',
    proud: 'bg-blue-500/20',
    thinking: 'bg-amber-500/15',
    warning: 'bg-orange-500/20',
    onFire: 'bg-red-500/25',
    coffee: 'bg-amber-500/15',
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
          <SpeechBubble direction="bottom" variant="light">
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
          <SpeechBubble direction="top" variant="light">
            {speechText}
          </SpeechBubble>
        </div>
      )}
    </div>
  )
}
