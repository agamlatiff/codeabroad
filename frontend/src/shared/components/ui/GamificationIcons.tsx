import type { FC } from 'react'

export interface GamificationIconProps {
  className?: string
}

/**
 * Crisp multi-faceted cyan/sky gem vector icon (avoids OS emoji variance and SVG gradient ID collisions).
 */
export const GemIcon: FC<GamificationIconProps> = ({ className = 'w-4 h-4' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Diamond Silhouette */}
      <polygon points="7,3.5 17,3.5 22,9.5 12,21 2,9.5" fill="#0EA5E9" />
      {/* Crown Left & Right Facets */}
      <polygon points="7,3.5 9,9.5 2,9.5" fill="#7DD3FC" />
      <polygon points="17,3.5 22,9.5 15,9.5" fill="#38BDF8" />
      {/* Center Crown Table */}
      <polygon points="7,3.5 17,3.5 15,9.5 9,9.5" fill="#E0F2FE" />
      {/* Pavilion Bottom Facets */}
      <polygon points="2,9.5 9,9.5 12,21" fill="#0284C7" />
      <polygon points="9,9.5 15,9.5 12,21" fill="#38BDF8" />
      <polygon points="15,9.5 22,9.5 12,21" fill="#0369A1" />
      {/* Crisp Ink Outline & Facet Lines */}
      <polygon
        points="7,3.5 17,3.5 22,9.5 12,21 2,9.5"
        stroke="#075985"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 9.5H21.5M7 3.5L9 9.5L12 20.5M17 3.5L15 9.5L12 20.5"
        stroke="#075985"
        strokeWidth="1.15"
        strokeLinejoin="round"
        opacity="0.7"
      />
      {/* White Specular Glint */}
      <path
        d="M18.2 4.6L18.7 5.8L19.9 6.3L18.7 6.8L18.2 8L17.7 6.8L16.5 6.3L17.7 5.8Z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

/**
 * Tactile golden XP lightning bolt vector icon with crisp warm outline.
 */
export const XpBoltIcon: FC<GamificationIconProps> = ({ className = 'w-4 h-4' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Main Bolt Body */}
      <path d="M13.6 2.5L4.8 13.4H11.2L9.8 21.5L19.2 10.6H12.8L13.6 2.5Z" fill="#F59E0B" />
      {/* Bright Upper-Left Facet */}
      <path d="M13.6 2.5L4.8 13.4H11.2L12.8 10.6L13.6 2.5Z" fill="#FDE047" />
      {/* Crisp Ink Outline */}
      <path
        d="M13.6 2.5L4.8 13.4H11.2L9.8 21.5L19.2 10.6H12.8L13.6 2.5Z"
        stroke="#B45309"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Specular Highlight */}
      <path d="M11.6 6.2L7.7 11.3H9.6" stroke="#FEF9C3" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
