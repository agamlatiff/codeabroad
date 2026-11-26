import { useId, type FC } from 'react'
import { Link } from 'react-router-dom'

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'blue' | 'slate' | 'white' | 'emerald'
  showText?: boolean
  linkTo?: string | null
  className?: string
}

const BUBBLE_PATH =
  'M 20 5 H 44 C 53 5 59 11 59 20 V 38 C 59 47 53 53 44 53 H 24 C 19.5 53 14.5 58.2 10.8 59.5 C 9.2 60 8.2 58.8 9.0 57.2 C 10.4 54.4 11.4 51.8 11.4 49.4 C 7.2 46.6 5 42.6 5 37.5 V 20 C 5 11 11 5 20 5 Z'

const MERA_HEAD_PATH =
  'M 15 31 C 14.5 24 15.2 17 17.5 13.5 C 19.2 11 22.8 12.2 26 16.5 C 28 19.2 30 20 32 20 C 34 20 36 19.2 38 16.5 C 41.2 12.2 44.8 11 46.5 13.5 C 48.8 17 49.5 24 49 31 C 49.5 40.5 42.5 46.5 32 46.5 C 21.5 46.5 14.5 40.5 15 31 Z'

export const Logo: FC<LogoProps> = ({
  size = 'md',
  variant = 'slate',
  showText = true,
  linkTo = '/',
  className = '',
}) => {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '')

  // Brand color mappings synchronizing Mera Talk Badge and wordmark colors
  const colors = {
    blue: {
      text: 'text-[#2563EB]',
      gradStart: '#3B82F6',
      gradMid: '#2563EB',
      gradEnd: '#1D4ED8',
      outerStroke: undefined,
    },
    slate: {
      text: 'text-slate-900',
      gradStart: '#1E293B',
      gradMid: '#0F172A',
      gradEnd: '#0F172A',
      outerStroke: undefined,
    },
    emerald: {
      text: 'text-emerald-600',
      gradStart: '#34D399',
      gradMid: '#10B981',
      gradEnd: '#059669',
      outerStroke: undefined,
    },
    white: {
      text: 'text-white',
      gradStart: '#3B82F6',
      gradMid: '#2563EB',
      gradEnd: '#1D4ED8',
      outerStroke: '#FFFFFF',
    },
  }

  const sizes = {
    sm: {
      icon: 'w-8 h-8',
      text: 'text-xl',
      gap: 'gap-2',
    },
    md: {
      icon: 'w-10 h-10',
      text: 'text-2xl',
      gap: 'gap-2.5',
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-4xl',
      gap: 'gap-3',
    },
  }

  const activeColor = colors[variant]
  const activeSize = sizes[size]
  const gradId = `${uid}-badge-bg`
  const clipId = `${uid}-head-clip`

  const content = (
    <div className={`inline-flex items-center ${activeSize.gap} select-none group ${className}`}>
      {/* Mera Talk Badge Mark */}
      <div
        className={`${activeSize.icon} shrink-0 transition-transform duration-200 group-hover:-rotate-3`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradId} x1="12%" y1="6%" x2="88%" y2="94%">
              <stop offset="0%" stopColor={activeColor.gradStart} />
              <stop offset="52%" stopColor={activeColor.gradMid} />
              <stop offset="100%" stopColor={activeColor.gradEnd} />
            </linearGradient>
            <clipPath id={clipId}>
              <path d={MERA_HEAD_PATH} />
            </clipPath>
          </defs>

          {/* Rounded-squircle speech-bubble badge */}
          <path
            d={BUBBLE_PATH}
            fill={`url(#${gradId})`}
            stroke={activeColor.outerStroke}
            strokeWidth={activeColor.outerStroke ? 3 : undefined}
            strokeLinejoin="round"
          />

          {/* Subtle top specular arc */}
          <path
            d="M 16 11 Q 32 7 48 11"
            stroke="#FFFFFF"
            strokeOpacity="0.22"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Authentic white Mera mochi-cat head */}
          <path d={MERA_HEAD_PATH} fill="#FFFFFF" />

          {/* Subtle bottom crescent sheen inside Mera head */}
          <g clipPath={`url(#${clipId})`}>
            <path
              d="M 14 38.5 Q 32 44.8 50 38.5 Q 46 48 32 48 Q 18 48 14 38.5 Z"
              fill="#E2E8F0"
            />
          </g>

          {/* Soft pink inner ears */}
          <path
            d="M 18.2 21.2 C 17.8 18.2 18.4 15.6 19.8 14.6 C 21.0 14.2 22.6 15.8 23.8 18.6 Z"
            fill="#FDA4AF"
          />
          <path
            d="M 45.8 21.2 C 46.2 18.2 45.6 15.6 44.2 14.6 C 43.0 14.2 41.4 15.8 40.2 18.6 Z"
            fill="#FDA4AF"
          />

          {/* Expressive eyes with catchlights */}
          <circle cx="24.5" cy="30.5" r="3.4" fill="#0F172A" />
          <circle cx="25.6" cy="29.3" r="1.25" fill="#FFFFFF" />

          <circle cx="39.5" cy="30.5" r="3.4" fill="#0F172A" />
          <circle cx="40.6" cy="29.3" r="1.25" fill="#FFFFFF" />

          {/* Rosy coral blush */}
          <ellipse cx="19.8" cy="35" rx="3.1" ry="1.75" fill="#FB7185" fillOpacity="0.72" />
          <ellipse cx="44.2" cy="35" rx="3.1" ry="1.75" fill="#FB7185" fillOpacity="0.72" />

          {/* Signature Mera w-smile */}
          <path
            d="M 28.2 35.4 Q 30.1 38.2 32 36 Q 33.9 38.2 35.8 35.4"
            stroke="#0F172A"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Wordmark (Lowercase, Fredoka Rounded Font) */}
      {showText && (
        <span
          className={`font-brand ${activeSize.text} font-bold tracking-tight lowercase ${activeColor.text} transition-colors`}
        >
          merantalk
        </span>
      )}
    </div>
  )

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="inline-block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 select-none"
      >
        {content}
      </Link>
    )
  }

  return content
}
