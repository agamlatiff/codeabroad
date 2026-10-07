import type { FC } from 'react'
import { Link } from 'react-router-dom'

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'blue' | 'slate' | 'white' | 'emerald'
  showText?: boolean
  linkTo?: string | null
  className?: string
}

export const Logo: FC<LogoProps> = ({
  size = 'md',
  variant = 'slate',
  showText = true,
  linkTo = '/',
  className = '',
}) => {
  // Brand color mappings synchronizing mascot and wordmark colors
  const colors = {
    // Official Electric Tech Blue
    blue: {
      text: 'text-blue-600',
      fill: '#2563EB',
      accent: '#1D4ED8',
    },
    // Monochrome slate
    slate: {
      text: 'text-slate-900',
      fill: '#0F172A',
      accent: '#334155',
    },
    // Modern tech emerald
    emerald: {
      text: 'text-emerald-500',
      fill: '#10B981',
      accent: '#059669',
    },
    // White for dark mode or dark backgrounds
    white: {
      text: 'text-white',
      fill: '#FFFFFF',
      accent: '#E2E8F0',
    },
  }

  // Size configurations with snug gap matching Duolingo style
  const sizes = {
    sm: {
      icon: 'w-7 h-7',
      text: 'text-xl',
      gap: 'gap-1',
    },
    md: {
      icon: 'w-9 h-9',
      text: 'text-2xl',
      gap: 'gap-1.5',
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-4xl',
      gap: 'gap-2',
    },
  }

  const activeColor = colors[variant]
  const activeSize = sizes[size]

  const content = (
    <div className={`inline-flex items-center ${activeSize.gap} select-none ${className}`}>
      {/* Duolingo-style Kodi Mascot Head Mark */}
      <div className={`${activeSize.icon} shrink-0 transition-transform duration-200 hover:rotate-6`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Left Ear */}
          <path
            d="M20 42C16 28 26 14 38 18L44 32"
            fill={activeColor.fill}
          />
          <path
            d="M25 36C22 28 28 20 35 22L39 30"
            fill={activeColor.accent}
          />

          {/* Right Ear */}
          <path
            d="M80 42C84 28 74 14 62 18L56 32"
            fill={activeColor.fill}
          />
          <path
            d="M75 36C78 28 72 20 65 22L61 30"
            fill={activeColor.accent}
          />

          {/* Main Head (Friendly Rounded Duolingo Shape) */}
          <ellipse
            cx="50"
            cy="54"
            rx="38"
            ry="34"
            fill={activeColor.fill}
          />

          {/* Developer Tech Headphone Accent */}
          <path
            d="M34 26C42 20 58 20 66 26"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Big Expressive Eye Left */}
          <circle cx="37" cy="50" r="7" fill="white" />
          <circle cx="38" cy="50" r="4" fill="#0F172A" />
          <circle cx="40" cy="48" r="1.5" fill="white" />

          {/* Big Expressive Eye Right */}
          <circle cx="63" cy="50" r="7" fill="white" />
          <circle cx="62" cy="50" r="4" fill="#0F172A" />
          <circle cx="64" cy="48" r="1.5" fill="white" />

          {/* Snout & Smile */}
          <ellipse cx="50" cy="58" rx="3.5" ry="2.5" fill="#0F172A" />
          <path
            d="M44 63C47 67 53 67 56 63"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Blush Cheeks */}
          <ellipse cx="28" cy="58" rx="4" ry="2" fill="white" opacity="0.4" />
          <ellipse cx="72" cy="58" rx="4" ry="2" fill="white" opacity="0.4" />
        </svg>
      </div>

      {/* Brand Wordmark (Lowercase, Fredoka Rounded Font) */}
      {showText && (
        <span
          className={`font-brand ${activeSize.text} font-bold tracking-tight lowercase ${activeColor.text} transition-colors`}
        >
          codeabroad
        </span>
      )}
    </div>
  )

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="inline-block outline-none focus:outline-none focus:ring-0 focus-visible:outline-none active:outline-none border-none select-none"
      >
        {content}
      </Link>
    )
  }

  return content
}
