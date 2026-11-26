import type { FC, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeft,
  CheckCircle,
  GlobeHemisphereWest,
  Repeat,
  Sparkle,
  WarningCircle,
} from '@phosphor-icons/react'
import { Logo } from '@/shared/components/ui/Logo'
import { type KodiEmotion } from '@/shared/components/ui/KodiCharacter'
import {
  MeraPolyglotFigure,
  type MeraShowcaseMood,
} from '@/shared/components/ui/MeraShowcaseFigures'

export interface AuthLayoutProps {
  title: string
  subtitle?: string
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: string
  heroEmotion?: KodiEmotion
  speechBubble?: string
  error?: string | null
  children: ReactNode
  kodiEmotion?: KodiEmotion
  kodiSpeech?: string
  heroHighlight?: string
  heroDescription?: string
  mode?: 'login' | 'register'
  helperBanner?: string
}

function mapEmotionToMeraMood(emotion: KodiEmotion): MeraShowcaseMood {
  if (
    emotion === 'happy' ||
    emotion === 'celebrate' ||
    emotion === 'onFire' ||
    emotion === 'proud'
  ) {
    return 'excited'
  }
  if (emotion === 'thinking' || emotion === 'worried' || emotion === 'warning') {
    return 'thinking'
  }
  return 'happy'
}

export const AuthLayout: FC<AuthLayoutProps> = ({
  title,
  subtitle,
  heroTitle,
  heroSubtitle,
  heroImage,
  heroEmotion = 'welcome',
  speechBubble,
  error,
  children,
  kodiEmotion,
  kodiSpeech,
  heroHighlight,
  heroDescription,
  mode,
  helperBanner,
}) => {
  const { pathname } = useLocation()
  const shouldReduceMotion = Boolean(useReducedMotion())
  const resolvedEmotion = kodiEmotion ?? heroEmotion
  const resolvedSpeech = kodiSpeech ?? speechBubble
  const resolvedDescription = heroDescription ?? heroSubtitle
  const activeMode: 'login' | 'register' = mode ?? (pathname === '/register' ? 'register' : 'login')
  const meraMood = mapEmotionToMeraMood(resolvedEmotion)
  const meraBadgeText = activeMode === 'register' ? '6+' : 'HI'

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen min-h-dvh lg:h-screen lg:h-dvh w-full bg-[#F8FAFC] lg:bg-white flex flex-col lg:flex-row lg:overflow-hidden font-sans">
        {/* ── 1. DESKTOP ONLY (>= 1024px): DEEP BLUE OPEN-STAGE PANEL ── */}
        <div className="hidden lg:flex lg:w-[48%] xl:w-[46%] h-full bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E3A8A] text-white p-8 xl:p-12 flex-col justify-between relative overflow-hidden shrink-0 select-none">
          {/* Subtle Static Ambient Depth Blooms */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-sky-400/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -right-20 w-80 h-80 rounded-full bg-indigo-950/35"
          />

          {/* Top Bar: White Mera Talk Logo + Subtle Context Pill */}
          <div className="flex items-center justify-between gap-3 z-10">
            <Logo variant="white" size="md" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3.5 py-1.5 text-xs font-brand font-bold text-blue-50">
              <GlobeHemisphereWest weight="fill" className="w-3.5 h-3.5 text-sky-200" />
              <span>Platform Bahasa Global</span>
            </span>
          </div>

          {/* Center: Editorial Copy + Open-Stage Cel-Shaded Mera (Zero Border Box) */}
          <div className="my-auto py-4 z-10 max-w-md w-full space-y-6">
            <div className="text-left">
              <h2 className="text-3xl xl:text-[38px] font-brand font-black text-white tracking-tight leading-[1.14]">
                {heroTitle || 'Kuasai Bahasa Asing untuk Dunia'}
                {heroHighlight ? (
                  <>
                    {' '}
                    <span className="text-sky-200">{heroHighlight}</span>
                  </>
                ) : null}
              </h2>
              <p className="text-blue-100/90 text-sm xl:text-[15px] font-normal mt-3 leading-relaxed max-w-sm">
                {resolvedDescription ||
                  'Latihan bahasa terstruktur dari nol hingga siap kerja global bersama Mera.'}
              </p>
            </div>

            {/* Open-Stage Mera + Crisp White Tactile Speech Bubble */}
            <div className="relative flex flex-col items-center justify-center pt-3 pb-1">
              {/* Soft circular radial glow behind Mera */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-2 w-56 h-56 rounded-full bg-sky-300/20 blur-2xl"
              />

              <div className="relative z-10 flex flex-col items-center">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt="Mera Mascot Merantalk"
                    className="w-48 xl:w-52 h-48 xl:h-52 object-contain select-none"
                  />
                ) : (
                  <MeraPolyglotFigure mood={meraMood} size={184} badgeText={meraBadgeText} />
                )}

                {resolvedSpeech && (
                  <div className="relative mt-4 bg-white text-[#1E293B] border-2 border-blue-200/80 rounded-2xl px-4 py-2.5 shadow-[0_6px_0_0_rgba(15,23,42,0.18)] text-xs font-brand font-bold text-center leading-snug max-w-xs">
                    <span
                      aria-hidden="true"
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-white border-l-2 border-t-2 border-blue-200/80"
                    />
                    <span className="relative z-10">{resolvedSpeech}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom: 3 Compact Highlight Pills */}
          <div className="flex flex-wrap items-center gap-2 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-brand font-bold text-blue-50">
              <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-300" />
              <span>Unit 1 Gratis</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-brand font-bold text-blue-50">
              <GlobeHemisphereWest weight="fill" className="w-3.5 h-3.5 text-sky-200" />
              <span>6 Jalur Bahasa</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-brand font-bold text-blue-50">
              <Repeat weight="bold" className="w-3.5 h-3.5 text-emerald-300" />
              <span>Ulasan SRS Otomatis</span>
            </span>
          </div>
        </div>

        {/* ── 2. MOBILE, TABLET & DESKTOP FORM COLUMN ── */}
        <div className="flex-1 h-full flex flex-col items-center px-4 py-5 sm:px-8 sm:py-8 lg:py-6 lg:px-10 xl:px-14 w-full bg-[#F8FAFC] lg:bg-white lg:overflow-y-auto">
          <div className="w-full max-w-sm md:max-w-md lg:max-w-[400px] my-auto">
            {/* Mobile / Tablet Brand Header + Back to Home */}
            <div className="flex lg:hidden items-center justify-between gap-3 mb-4">
              <Logo variant="blue" size="sm" />
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-brand font-bold text-slate-600 hover:text-[#2563EB] transition-colors rounded-full px-3 py-1.5 bg-white border border-slate-200/90 shadow-xs"
              >
                <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
                <span>Beranda</span>
              </Link>
            </div>

            {/* Desktop Back to Home Link */}
            <div className="hidden lg:flex items-center justify-end mb-4">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-brand font-bold text-slate-500 hover:text-[#2563EB] transition-colors"
              >
                <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>

            {/* Auth Form Card */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
              className="w-full bg-white p-5 sm:p-7 rounded-3xl border-2 border-slate-200/80 shadow-[0_8px_0_0_rgba(15,23,42,0.04)] lg:bg-transparent lg:p-0 lg:border-none lg:shadow-none"
            >
              {/* Mobile / Tablet Mini Mera Greeting Strip */}
              {resolvedSpeech && (
                <div className="lg:hidden mb-4 flex items-center gap-3 rounded-2xl bg-[#EFF6FF] border border-blue-200/80 px-3 py-2">
                  <MeraPolyglotFigure
                    mood={meraMood}
                    size={44}
                    badgeText={meraBadgeText}
                    className="shrink-0"
                  />
                  <p className="text-xs font-brand font-bold text-[#1E293B] leading-snug">
                    {resolvedSpeech}
                  </p>
                </div>
              )}

              {/* Tactile Masuk / Daftar Route Switcher */}
              <nav
                aria-label="Pilih halaman autentikasi"
                className="bg-slate-100 p-1 rounded-2xl border border-slate-200/80 grid grid-cols-2 gap-1 mb-4 sm:mb-5"
              >
                <Link
                  to="/login"
                  aria-current={activeMode === 'login' ? 'page' : undefined}
                  className={`text-center py-2 px-3 rounded-xl text-xs sm:text-sm font-brand font-black transition-all ${
                    activeMode === 'login'
                      ? 'bg-white text-[#2563EB] shadow-[0_2px_0_0_rgba(15,23,42,0.08)] border border-slate-200/70'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  aria-current={activeMode === 'register' ? 'page' : undefined}
                  className={`text-center py-2 px-3 rounded-xl text-xs sm:text-sm font-brand font-black transition-all ${
                    activeMode === 'register'
                      ? 'bg-white text-[#2563EB] shadow-[0_2px_0_0_rgba(15,23,42,0.08)] border border-slate-200/70'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Daftar Gratis
                </Link>
              </nav>

              <div className="mb-3.5 sm:mb-4 text-left">
                <h1 className="font-brand font-black text-2xl sm:text-[28px] text-[#1E293B] tracking-tight leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed font-normal">
                    {subtitle}
                  </p>
                )}
              </div>

              {helperBanner && (
                <div className="mb-3.5 rounded-xl bg-[#EFF6FF] border border-blue-200/80 px-3 py-2 text-[11px] sm:text-xs text-[#1E40AF] font-medium flex items-start gap-2 leading-snug">
                  <CheckCircle weight="fill" className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span>{helperBanner}</span>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="mb-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2"
                >
                  <WarningCircle weight="bold" className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}
