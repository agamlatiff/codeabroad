/**
 * [DOMAIN: FORM CONTROLS]
 * Single Source of Truth untuk kontrol formulir input (FORM_TOKENS).
 *
 * NOTE:
 * - Ketinggian bayangan tombol berada di elevationTokens.ts
 */

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
    'w-full min-h-[44px] h-11 sm:h-11.5 bg-white border-2 rounded-2xl text-base sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 font-normal font-sans disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
  inputNormalStateClass:
    'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15',
  inputErrorStateClass:
    'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15',
  iconWrapperClass: 'absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-colors',
  passwordToggleClass:
    'absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition p-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
  errorMessageClass: 'text-xs text-rose-600 font-medium flex items-center gap-1.5 mt-1 animate-fadeIn',
  helperTextClass: 'text-[11px] sm:text-xs text-slate-500 font-normal mt-1',
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
