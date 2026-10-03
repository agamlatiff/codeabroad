import type { FC, ReactNode } from 'react'
import { Logo } from '../ui/Logo'
import doodleWelcome from '../../assets/kodi/doodle-welcome.png'

export interface AuthLayoutProps {
  title: string
  subtitle?: string
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: string
  speechBubble?: string
  children: ReactNode
}

export const AuthLayout: FC<AuthLayoutProps> = ({
  title,
  subtitle,
  heroTitle,
  heroSubtitle,
  heroImage,
  speechBubble,
  children,
}) => {
  return (
    <div className="min-h-screen min-h-dvh lg:h-screen lg:h-dvh w-full bg-[#FAFAF9] flex flex-col lg:flex-row lg:overflow-hidden font-sans">
      {/* ── 1. DESKTOP ONLY (>= 1024px): EXPANSIVE 50/50 SPLIT-SCREEN WITH 3D GLASS PODIUM ── */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[48%] h-full bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#312E81] text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden [clip-path:polygon(0_0,100%_0,85%_100%,0%_100%)] shadow-2xl shrink-0 select-none">
        {/* Top: CodeAbroad Logo */}
        <div className="flex items-center justify-between z-10">
          <Logo variant="white" size="md" />
        </div>

        {/* Upper/Middle: Headline & Subhead with Plus Jakarta Sans */}
        <div className="my-auto pt-4 pb-2 z-10 max-w-md">
          <div className="mb-8 text-left">
            <h2 className="text-3xl lg:text-[38px] font-extrabold text-white tracking-tight leading-[1.18] font-['Plus_Jakarta_Sans',sans-serif]">
              {heroTitle || 'Buka Peluang Karir Duniamu'}
            </h2>
            <p className="text-white/80 text-sm font-normal mt-3 leading-relaxed font-['Plus_Jakarta_Sans',sans-serif] max-w-sm">
              {heroSubtitle || 'Persiapan coding interview global lebih terarah bersama Kodi.'}
            </p>
          </div>

          {/* Bottom: Kodi Mascot on Stepped 3D Glass Podium */}
          <div className="flex flex-col items-center justify-center relative pt-4 pb-6">
            <div className="relative flex items-center justify-center group cursor-pointer">
              {/* Subtle Ambient Backlight */}
              <div className="w-80 xl:w-[420px] h-80 xl:h-[420px] rounded-full bg-white/[0.12] blur-3xl absolute -z-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-100" />

              {/* ── MANGA / COMIC SPEECH BUBBLE (DESKTOP) ── */}
              <div className="absolute -top-10 -right-8 z-30 select-none transition-all duration-300 ease-out group-hover:scale-105 group-hover:-rotate-2 group-hover:-translate-y-1">
                <div className="relative bg-white text-slate-900 px-4 py-2.5 rounded-[22px] border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0F172A] max-w-[220px] text-center">
                  <p className="text-[13px] font-bold tracking-tight leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
                    {speechBubble || 'Halo! Siap lanjut push code hari ini? 🚀'}
                  </p>
                  {/* Manga Tail pointing towards Kodi */}
                  <div className="absolute -bottom-2.5 left-6 w-3.5 h-3.5 bg-white border-b-2 border-l-2 border-slate-900 -rotate-45" />
                </div>
              </div>

              {/* ── STEPPED 3D GLASS PODIUM (3 TIERS) ── */}
              {/* Tier 1 (Base / Widest Step) */}
              <div className="w-92 xl:w-[400px] h-24 xl:h-26 bg-white/[0.08] rounded-[50%] border border-white/20 backdrop-blur-sm absolute -bottom-12 z-0 shadow-[0_25px_45px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-[1.01]" />

              {/* Tier 2 (Middle Step) */}
              <div className="w-82 xl:w-[350px] h-22 xl:h-24 bg-white/[0.16] rounded-[50%] border border-white/30 backdrop-blur-md absolute -bottom-8 z-0 shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-transform duration-500 group-hover:scale-[1.015]" />

              {/* Tier 3 (Crown Pedestal - Top Step) */}
              <div className="w-74 xl:w-[310px] h-20 xl:h-22 bg-white/[0.28] rounded-[50%] border-2 border-white/45 backdrop-blur-lg absolute -bottom-4 z-0 shadow-[inset_0_2px_8px_rgba(255,255,255,0.4),0_10px_25px_rgba(0,0,0,0.15)] transition-transform duration-500 group-hover:scale-[1.02]" />
              
              {/* Soft Contact Shadow on Top Pedestal */}
              <div className="w-52 xl:w-56 h-6 bg-black/40 rounded-[50%] blur-sm absolute -bottom-0.5 z-0 origin-center transition-all duration-300 group-hover:scale-90 group-hover:opacity-60" />

              {/* Primary Mascot Character (Confident Grounded Stance + Tactile Hover) */}
              <img
                src={heroImage || doodleWelcome}
                alt="Kodi Mascot CodeAbroad"
                className="w-72 xl:w-80 h-72 xl:h-80 object-contain select-none drop-shadow-2xl relative z-10 transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Spacer for Visual Balance */}
        <div className="h-4" />
      </div>

      {/* ── 2. MOBILE & TABLET ADAPTIVE CONTAINER (ERGONOMIC & COHESIVE) ── */}
      <div className="flex-1 h-full flex flex-col justify-center items-center px-4 py-6 sm:px-8 md:py-10 lg:py-4 lg:px-8 xl:py-6 xl:px-12 w-full lg:overflow-y-auto">
        {/* Mobile / Tablet Top Header: Logo + Kodi Companion Greeting */}
        <div className="w-full max-w-sm md:max-w-md lg:hidden mb-6">
          {/* Logo Bar */}
          <div className="flex items-center justify-between mb-4">
            <Logo variant="slate" size="sm" />
          </div>

          {/* Integrated Kodi Companion Card (Mobile & Tablet) */}
          <div className="relative bg-gradient-to-r from-indigo-50/90 via-white to-indigo-50/60 border border-indigo-100 rounded-2xl p-3 sm:p-3.5 shadow-sm flex items-center gap-3">
            <img
              src={heroImage || doodleWelcome}
              alt="Kodi Mascot"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0 drop-shadow-sm select-none"
            />
            <div className="flex-1 min-w-0 pl-1 pr-1">
              <div className="relative inline-block bg-white text-slate-800 text-[11px] sm:text-xs font-semibold px-3 py-2 rounded-2xl border border-indigo-100 shadow-sm leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
                {speechBubble || 'Halo! Siap lanjut push code hari ini? 🚀'}

                {/* Speech Bubble Arrow pointing left towards Kodi */}
                <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 bg-white border-l border-b border-indigo-100 rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Auth Form Container (Responsive: Ergonomic Flow on Mobile, Sleek Card on Tablet, Clean Split on Desktop) */}
        <div className="w-full max-w-sm md:max-w-md lg:max-w-sm md:bg-white md:p-8 md:rounded-3xl md:border md:border-slate-200/80 md:shadow-xl lg:bg-transparent lg:p-0 lg:border-none lg:shadow-none">
          {/* Form Header */}
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

          {children}
        </div>
      </div>
    </div>
  )
}
