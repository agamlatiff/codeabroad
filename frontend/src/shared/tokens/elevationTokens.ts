/**
 * [DOMAIN: ELEVATION & 3D TACTILE BUTTONS]
 * Single Source of Truth untuk bayangan fisik 3D tombol (Button3D).
 */

export const BUTTON_3D_TOKENS = {
  base: 'inline-flex items-center justify-center font-brand font-black tracking-wide uppercase rounded-2xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none enabled:active:translate-y-1 enabled:active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2',
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
    xs: 'text-[10px] px-2.5 py-1 min-h-[28px] rounded-xl gap-1',
    sm: 'text-xs px-4 py-2 min-h-[38px] gap-1.5',
    md: 'text-sm px-6 py-3 min-h-[48px] gap-2',
    lg: 'text-base px-8 py-4 min-h-[56px] gap-2.5',
  },
} as const
