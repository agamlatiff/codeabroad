import type { FC, ReactNode } from 'react'
import { MotionConfig, motion } from 'motion/react'
import { WarningCircle } from '@phosphor-icons/react'
import { Logo } from "@/shared/components/ui/Logo"
import { KodiCharacter, type KodiEmotion } from "@/shared/components/ui/KodiCharacter"

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
}) => {
  const resolvedEmotion = kodiEmotion ?? heroEmotion
  const resolvedSpeech = kodiSpeech ?? speechBubble
  const resolvedDescription = heroDescription ?? heroSubtitle

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen min-h-dvh lg:h-screen lg:h-dvh w-full bg-[#FAFAF9] flex flex-col lg:flex-row lg:overflow-hidden font-sans">
        {/* ── 1. DESKTOP ONLY (>= 1024px): COMPOSED STUDIO SPLIT-SCREEN ── */}
        <div className="hidden lg:flex lg:w-[48%] xl:w-[46%] h-full bg-gradient-to-br from-blue-600 via-blue-700 to-sky-800 text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden shrink-0 select-none border-r border-blue-800/30">
          {/* Top: Merantalk Logo */}
          <div className="flex items-center justify-between z-10">
            <Logo variant="white" size="md" />
          </div>

          {/* Center: Editorial Copy + Soft Studio Mascot Card */}
          <div className="my-auto py-4 z-10 max-w-md w-full space-y-7">
            <div className="text-left">
              <h2 className="text-3xl lg:text-[36px] font-extrabold text-white tracking-tight leading-[1.18] font-['Plus_Jakarta_Sans',sans-serif]">
                {heroTitle || 'Kuasai Bahasa Asing untuk Dunia'}
                {heroHighlight ? (
                  <>
                    {' '}
                    <span className="text-sky-200">{heroHighlight}</span>
                  </>
                ) : null}
              </h2>
              <p className="text-white/85 text-sm font-normal mt-3 leading-relaxed font-['Plus_Jakarta_Sans',sans-serif] max-w-sm">
                {resolvedDescription || 'Latihan bahasa terstruktur dari nol hingga siap kerja global bersama Mera.'}
              </p>
            </div>

            {/* Soft Calm Studio Showcase Card */}
            <div className="rounded-3xl bg-white/10 border border-white/20 px-6 py-6 flex flex-col items-center justify-center gap-4 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.4)]">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Mera Mascot Merantalk"
                  className="w-52 xl:w-60 h-52 xl:h-60 object-contain select-none"
                />
              ) : (
                <KodiCharacter emotion={resolvedEmotion} size={172} interactive />
              )}

              {resolvedSpeech && (
                <p className="px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white/95 text-xs font-semibold tracking-tight text-center leading-snug max-w-xs font-['Plus_Jakarta_Sans',sans-serif]">
                  {resolvedSpeech}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Spacer for Visual Balance */}
          <div className="h-2" />
        </div>

        {/* ── 2. MOBILE, TABLET & DESKTOP FORM CONTAINER ── */}
        <div className="flex-1 h-full flex flex-col justify-center items-center px-4 py-6 sm:px-8 md:py-10 lg:py-6 lg:px-10 xl:px-14 w-full bg-[#FAFAF9] lg:overflow-y-auto">
          {/* Compact Mobile / Tablet Merantalk Brand Header */}
          <div className="w-full max-w-sm md:max-w-md lg:hidden mb-5 flex items-center justify-between">
            <Logo variant="slate" size="sm" />
          </div>

          {/* Auth Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-sm md:max-w-md lg:max-w-sm bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm lg:bg-transparent lg:p-0 lg:border-none lg:shadow-none"
          >
            <div className="mb-3.5 sm:mb-4 lg:mb-3 text-left">
              <h1 className="text-2xl md:text-3xl lg:text-[26px] font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed font-normal font-['Plus_Jakarta_Sans',sans-serif]">
                  {subtitle}
                </p>
              )}
            </div>

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
    </MotionConfig>
  )
}
