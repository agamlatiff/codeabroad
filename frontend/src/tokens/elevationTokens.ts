/**
 * [DOMAIN: ELEVATION, 3D DEPTH & STACKING]
 * Single Source of Truth untuk Sumbu Z: bayangan fisik 3D tombol Duolingo (tactile resting,
 * hover, pressed active state, glow), efek kaca frosted glass, dan urutan tumpukan z-index layer.
 *
 * NOTE:
 * - Warna bayangan merujuk ke colorTokens.ts
 * - Ukuran tombol & border radius berada di layoutTokens.ts
 */

export const SHADOW_TOKENS = {
  // 3D Push-Down Button Shadows (Resting State)
  tactile: {
    blue: '0 5px 0 0 #1D4ED8',
    cyan: '0 5px 0 0 #0284C7',
    dark: '0 5px 0 0 #020617',
    emerald: '0 5px 0 0 #047857',
    amber: '0 5px 0 0 #B45309',
    rose: '0 5px 0 0 #9F1239',
    white: '0 4px 0 0 #CBD5E1',
    subtle: '0 3px 0 0 rgba(0, 0, 0, 0.4)',
  },

  // 3D Push-Down Button Shadows (Hover State - Elevates slightly)
  tactileHover: {
    blue: '0 6px 0 0 #1D4ED8',
    cyan: '0 6px 0 0 #0284C7',
    dark: '0 6px 0 0 #020617',
    emerald: '0 6px 0 0 #047857',
    amber: '0 6px 0 0 #B45309',
    rose: '0 6px 0 0 #9F1239',
    white: '0 5px 0 0 #CBD5E1',
  },

  // Active Pressed State (Zero shadow, depressed physical element)
  tactileActive: 'none',

  // Atmospheric Glows (Hero Spotlight, Kodi Stage, Milestone Card)
  glow: {
    blue: '0 10px 30px -5px rgba(37, 99, 235, 0.35)',
    cyan: '0 10px 30px -5px rgba(56, 189, 248, 0.35)',
    streak: '0 10px 30px -5px rgba(251, 146, 60, 0.35)',
    xp: '0 10px 30px -5px rgba(245, 158, 11, 0.35)',
    card: '0 20px 45px -15px rgba(0, 0, 0, 0.75)',
  },
} as const

export const BUTTON_3D_TOKENS = {
  base: 'inline-flex items-center justify-center font-brand font-black tracking-wide uppercase rounded-2xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:translate-y-1 active:shadow-none',
  variants: {
    blue: 'bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white shadow-[0_4px_0_0_#1D4ED8] hover:shadow-[0_5px_0_0_#1D4ED8]',
    cyan: 'bg-[#0284C7] hover:bg-[#38BDF8] active:bg-[#0284C7] text-white shadow-[0_5px_0_0_#0369A1] hover:shadow-[0_6px_0_0_#0369A1]',
    dark: 'bg-[#0F172A] hover:bg-[#1E293B] active:bg-[#0F172A] text-white border border-white/10 shadow-[0_5px_0_0_#020617] hover:shadow-[0_6px_0_0_#020617]',
    emerald: 'bg-[#059669] hover:bg-[#10B981] active:bg-[#059669] text-white shadow-[0_5px_0_0_#047857] hover:shadow-[0_6px_0_0_#047857]',
    amber: 'bg-[#D97706] hover:bg-[#F59E0B] active:bg-[#D97706] text-white shadow-[0_5px_0_0_#B45309] hover:shadow-[0_6px_0_0_#B45309]',
    rose: 'bg-[#E11D48] hover:bg-[#F43F5E] active:bg-[#E11D48] text-white shadow-[0_5px_0_0_#BE123C] hover:shadow-[0_6px_0_0_#BE123C]',
    white: 'bg-white hover:bg-slate-50 active:bg-white text-slate-900 border border-slate-200 shadow-[0_4px_0_0_#CBD5E1] hover:shadow-[0_5px_0_0_#CBD5E1]',
    ghost: 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:translate-y-0 active:shadow-none shadow-none',
  },
  sizes: {
    sm: 'text-xs px-4 py-2 min-h-[38px] gap-1.5',
    md: 'text-sm px-6 py-3 min-h-[48px] gap-2',
    lg: 'text-base px-8 py-4 min-h-[56px] gap-2.5',
  },
} as const

export const BUTTON_TOKENS = {
  base: 'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none',
  variants: {
    primary:
      'bg-slate-950 text-white hover:bg-slate-800 border-2 border-slate-950 shadow-[0_4px_12px_rgba(15,23,42,0.15)] active:translate-y-0.5 active:shadow-sm',
    secondary:
      'bg-white text-slate-900 border-2 border-slate-900 shadow-[0_3px_0_0_#0F172A] hover:translate-y-0.5 hover:shadow-[0_1px_0_0_#0F172A] active:translate-y-1 active:shadow-none',
    outline:
      'bg-transparent text-slate-700 border-2 border-slate-200 hover:bg-slate-100 hover:text-slate-900',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100',
    danger:
      'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100',
  },
  sizes: {
    sm: 'text-xs px-3.5 py-2 sm:py-1.5 min-h-[40px] sm:min-h-[36px] gap-1.5',
    md: 'text-sm px-4.5 py-2.5 sm:px-5 sm:py-3 min-h-[44px] gap-2',
    lg: 'text-base px-5.5 py-3 sm:px-6 sm:py-3.5 min-h-[48px] gap-2.5',
  },
} as const

export const GLASS_TOKENS = {
  blurSubtle: 'blur(4px)',
  blurMedium: 'blur(12px)',
  blurDeep: 'blur(20px)',
  surfaceNav: 'rgba(255, 255, 255, 0.9)',
  surfaceModal: 'rgba(255, 255, 255, 0.98)',
  backdropDim: 'rgba(15, 23, 42, 0.45)',
} as const

export const Z_INDEX_TOKENS = {
  base: 0,
  card: 10,
  perforation: 15,
  spotlight: 20,
  stickyHeader: 30,
  dropdown: 40,
  modalBackdrop: 50,
  modal: 60,
  toast: 70,
} as const
