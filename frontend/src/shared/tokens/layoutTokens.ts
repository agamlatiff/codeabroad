/**
 * [DOMAIN: LAYOUT GEOMETRY, CARDS & FORM CONTROLS]
 * Single Source of Truth untuk tata letak geometris: batas lebar maksimal kontainer,
 * responsive breakpoints (mobile/tablet/desktop), border radius kebulatan sudut (RADIUS_TOKENS),
 * style varian Card, dan kontrol formulir input (FORM_TOKENS).
 *
 * NOTE:
 * - Warna background/border formulir merujuk ke colorTokens.ts
 * - Ketinggian bayangan tombol berada di elevationTokens.ts
 */

export const LAYOUT_TOKENS = {
  maxWidth: {
    mobile: '420px',    // Focused mobile form / single-card view
    compact: '640px',   // Center stage hero (Step 4 Boarding Pass)
    standard: '1024px', // Tablet & standard dashboard
    wide: '1280px',     // Full panoramic flight theater
  },
  breakpoints: {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },
  minTouchTarget: '44px',
  buttonHeight: {
    sm: '38px',
    md: '48px',
    lg: '56px',
  },
} as const

export const RADIUS_TOKENS = {
  sm: '0.5rem',       // 8px - Badges, micro tags
  md: '0.75rem',      // 12px - Small inputs, avatar containers
  tile: '1rem',       // 16px - 2x2 metric stat tiles (rounded-2xl)
  button: '1rem',     // 16px - Chunky 3D buttons (rounded-2xl)
  card: '1.5rem',     // 24px - Hero containers & dark modal cards (rounded-3xl)
  largeCard: '2rem',  // 32px - Boarding pass main stage
  pill: '9999px',     // Full capsule buttons & status pills
} as const

export const CARD_TOKENS = {
  base: 'rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 relative overflow-hidden transition-all duration-200',
  variants: {
    white: 'bg-white border-2 border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
    'pastel-mint': 'bg-[#EDF7F2] border-2 border-[#D1EBDD]',
    'pastel-sky': 'bg-[#F0F7FF] border-2 border-[#D6E8FC]',
    doodle: 'bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A]',
  },
} as const

export const FORM_TOKENS = {
  inputBg: '#FFFFFF',
  inputBgHover: '#F8FAFC',
  borderResting: '#E2E8F0',
  borderHover: '#CBD5E1',
  focusRing: '0 0 0 4px rgba(37, 99, 235, 0.15)',
  errorRing: '0 0 0 4px rgba(244, 63, 94, 0.15)',
  placeholder: '#94A3B8',
  text: '#0F172A',
  disabledOpacity: 0.5,

  // Reusable class tokens for Input component
  labelClass: 'block text-xs sm:text-[13px] font-semibold text-slate-700 select-none tracking-normal font-sans',
  inputBaseClass:
    'w-full min-h-[44px] h-11 sm:h-11.5 bg-white border-2 rounded-2xl text-base sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 font-normal font-sans',
  inputNormalStateClass:
    'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15',
  inputErrorStateClass:
    'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15',
  iconWrapperClass: 'absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors',
  passwordToggleClass:
    'absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1 outline-none focus:outline-none cursor-pointer',
  errorMessageClass: 'text-xs text-rose-500 font-medium flex items-center gap-1.5 mt-1 animate-in fade-in duration-150',
  helperTextClass: 'text-[11px] sm:text-xs text-slate-400 font-normal mt-1',
} as const

export interface FormInputClassOptions {
  hasIcon?: boolean
  isPassword?: boolean
  hasError?: boolean
  className?: string
}

export const resolveFormInputClassName = ({
  hasIcon = false,
  isPassword = false,
  hasError = false,
  className = '',
}: FormInputClassOptions): string => {
  const paddingClass = `${hasIcon ? 'pl-10.5 pr-4' : 'px-3.5'} ${isPassword ? 'pr-11' : ''}`
  const stateClass = hasError ? FORM_TOKENS.inputErrorStateClass : FORM_TOKENS.inputNormalStateClass

  return `${FORM_TOKENS.inputBaseClass} ${paddingClass} ${stateClass} ${className}`.trim()
}
