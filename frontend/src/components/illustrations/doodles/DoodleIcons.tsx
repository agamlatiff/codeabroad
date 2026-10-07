import type { SVGProps } from 'react'

// Authentic 2D Japanese Tech Doodle Vector Icons (Monoline Ink + Flat Pastel Aesthetic)

export const DoodleFire = ({ className = 'w-6 h-6', ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    {/* Fire Body */}
    <path
      d="M24 4C24 4 28 12 36 18C42 22.5 44 28 42 34C40 40 33 44 24 44C15 44 8 40 6 34C4 28 6 22.5 12 18C20 12 24 4 24 4Z"
      fill="#FB923C"
      stroke="#0F172A"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Inner Flame */}
    <path
      d="M24 16C24 16 27 21 31 25C34 28 34 32 32 36C30 40 26 41 24 41C22 41 18 40 16 36C14 32 14 28 17 25C21 21 24 16 24 16Z"
      fill="#FDE047"
      stroke="#0F172A"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Cute Eyes */}
    <circle cx="20" cy="28" r="2.5" fill="#0F172A" />
    <circle cx="28" cy="28" r="2.5" fill="#0F172A" />
    {/* Eye Catchlights */}
    <circle cx="21" cy="27" r="0.8" fill="white" />
    <circle cx="29" cy="27" r="0.8" fill="white" />
    {/* Rosy Blushing Cheeks */}
    <ellipse cx="16" cy="31" rx="2" ry="1.2" fill="#F43F5E" opacity="0.7" />
    <ellipse cx="32" cy="31" rx="2" ry="1.2" fill="#F43F5E" opacity="0.7" />
    {/* Sweet Smile */}
    <path d="M22 32C23 33.5 25 33.5 26 32" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const DoodleStar = ({ className = 'w-6 h-6', ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    {/* Hand-drawn Star */}
    <path
      d="M24 5L29 17L42 18L32 27L35 40L24 33L13 40L16 27L6 18L19 17L24 5Z"
      fill="#FACC15"
      stroke="#0F172A"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Cute Eyes */}
    <circle cx="21" cy="22" r="2" fill="#0F172A" />
    <circle cx="27" cy="22" r="2" fill="#0F172A" />
    <circle cx="21.5" cy="21.5" r="0.6" fill="white" />
    <circle cx="27.5" cy="21.5" r="0.6" fill="white" />
    {/* Pink Blush */}
    <circle cx="18" cy="25" r="1.5" fill="#FB7185" />
    <circle cx="30" cy="25" r="1.5" fill="#FB7185" />
    {/* Smile */}
    <path d="M23 25C23.5 26 24.5 26 25 25" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const DoodleMatcha = ({ className = 'w-6 h-6', ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    {/* Steam with code brackets */}
    <path d="M18 10C17 7 19 5 21 4" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M28 10C27 7 29 5 31 4" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" />
    {/* Cup */}
    <path
      d="M10 14H36V28C36 34 31 38 23 38C15 38 10 34 10 28V14Z"
      fill="#4ADE80"
      stroke="#0F172A"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Handle */}
    <path
      d="M36 18C41 18 43 21 43 25C43 29 40 31 36 31"
      stroke="#0F172A"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Saucer */}
    <path d="M6 42H40" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
    {/* Cute Face */}
    <circle cx="19" cy="24" r="2" fill="#0F172A" />
    <circle cx="27" cy="24" r="2" fill="#0F172A" />
    <ellipse cx="16" cy="27" rx="1.5" ry="1" fill="#F43F5E" opacity="0.6" />
    <ellipse cx="30" cy="27" rx="1.5" ry="1" fill="#F43F5E" opacity="0.6" />
    <path d="M21 27C22 28.5 24 28.5 25 27" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const DoodleHanko = ({ text = '合格', className = 'w-10 h-10', ...props }: { text?: string } & SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    {/* Traditional Japanese Hanko Red Ink Stamp */}
    <circle cx="26" cy="26" r="22" stroke="#EF4444" strokeWidth="3" strokeDasharray="3 1" fill="#FEF2F2" />
    <circle cx="26" cy="26" r="19" stroke="#EF4444" strokeWidth="1.5" fill="none" />
    <text
      x="26"
      y="32"
      fill="#DC2626"
      fontSize="14"
      fontFamily="sans-serif"
      fontWeight="900"
      textAnchor="middle"
      letterSpacing="1"
    >
      {text}
    </text>
  </svg>
)

export const DoodleBug = ({ className = 'w-6 h-6', ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    {/* Antennae */}
    <path d="M18 10C16 6 12 6 10 8" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M30 10C32 6 36 6 38 8" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
    {/* Legs */}
    <path d="M10 20L4 18" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M38 20L44 18" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M8 28L3 29" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M40 28L45 29" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 36L5 39" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M38 36L43 39" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
    {/* Body */}
    <ellipse cx="24" cy="28" rx="14" ry="15" fill="#38BDF8" stroke="#0F172A" strokeWidth="3" />
    <path d="M24 13V43" stroke="#0F172A" strokeWidth="2.5" />
    {/* Head */}
    <path d="M16 14C16 9.5 19.5 6 24 6C28.5 6 32 9.5 32 14H16Z" fill="#0F172A" />
    {/* Spiral / Dizzy Eyes */}
    <circle cx="19" cy="22" r="3" fill="white" stroke="#0F172A" strokeWidth="1.5" />
    <circle cx="29" cy="22" r="3" fill="white" stroke="#0F172A" strokeWidth="1.5" />
    <circle cx="19" cy="22" r="1.2" fill="#0F172A" />
    <circle cx="29" cy="22" r="1.2" fill="#0F172A" />
  </svg>
)

export const DoodleCodeBracket = ({ className = 'w-6 h-6', ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <rect x="6" y="6" width="36" height="36" rx="12" fill="#A78BFA" stroke="#0F172A" strokeWidth="3" />
    <text
      x="24"
      y="31"
      fill="#0F172A"
      fontSize="22"
      fontFamily="monospace"
      fontWeight="900"
      textAnchor="middle"
    >
      {'{ }'}
    </text>
  </svg>
)
