import type { FC, ReactNode } from 'react'
import { Logo } from '../ui/Logo'
import doodleWelcome from '../../assets/kodi/doodle-welcome.png'
import { DoodleStar, DoodleCodeBracket, DoodleFire } from '../ui/DoodleIcons'

export interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export const AuthLayout: FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#FAFAF9] flex flex-col lg:flex-row overflow-x-hidden font-sans">
      {/* ── LEFT PANEL: BRAND HERO WITH KODI STUDIO STAGE ── */}
      <div className="lg:w-[48%] xl:w-[46%] bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#312E81] text-white p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden lg:[clip-path:polygon(0_0,100%_0,93%_100%,0%_100%)] shadow-2xl">
        {/* Top: CodeAbroad Logo */}
        <div className="flex items-center justify-between z-10">
          <Logo variant="white" size="md" />
        </div>

        {/* Center: Kodi Mascot on Studio Stage */}
        <div className="my-auto py-12 flex flex-col items-center justify-center relative z-10">
          <div className="relative flex items-center justify-center">
            
            {/* 1. Subtle Ambient Backlight */}
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-white/[0.12] blur-3xl absolute -z-0 pointer-events-none" />

            {/* 2. Circular Frosted Studio Stage */}
            <div className="w-72 lg:w-84 h-24 lg:h-28 bg-white/20 rounded-[50%] border border-white/35 backdrop-blur-md absolute -bottom-8 z-0 shadow-[0_20px_45px_rgba(0,0,0,0.25)]" />
            
            {/* Soft Contact Shadow with Synchronized Breathing Animation */}
            <div className="w-44 lg:w-52 h-7 bg-black/35 rounded-[50%] blur-sm absolute -bottom-3 z-0 animate-shadow origin-center" />

            {/* 3. Cohesive SVG Doodle Ornaments Orbiting Kodi */}
            {/* Star Doodle (Playfully hovering near top-right shoulder) */}
            <div className="absolute top-2 -right-2 lg:top-3 lg:-right-4 z-20 animate-float-slow transition-transform duration-300 hover:scale-125 rotate-12 select-none">
              <DoodleStar className="w-8 h-8 lg:w-10 lg:h-10 drop-shadow-lg opacity-95" />
            </div>

            {/* Fire / Streak Doodle (Hovering near top-left) */}
            <div className="absolute top-4 -left-2 lg:top-5 lg:-left-4 z-20 animate-float-slow [animation-delay:1.5s] transition-transform duration-300 hover:scale-125 -rotate-12 select-none">
              <DoodleFire className="w-7 h-7 lg:w-9 lg:h-9 drop-shadow-lg opacity-95" />
            </div>

            {/* Code Bracket { } Doodle (Resting near bottom-left stage edge) */}
            <div className="absolute bottom-8 -left-3 lg:bottom-10 lg:-left-5 z-20 transition-transform duration-300 hover:scale-125 rotate-6 select-none">
              <DoodleCodeBracket className="w-7 h-7 lg:w-8 lg:h-8 drop-shadow-md opacity-85" />
            </div>

            {/* Sparkle Accent (Hovering off the right arm) */}
            <div className="absolute bottom-16 -right-3 lg:bottom-20 lg:-right-5 z-20 text-white/90 text-xl lg:text-2xl select-none pointer-events-none animate-pulse">
              ✦
            </div>

            {/* Subtle Ambient Sparkle at the Top */}
            <div className="absolute -top-3 left-1/3 text-white/60 text-sm select-none pointer-events-none animate-pulse [animation-delay:1s]">
              ✧
            </div>

            {/* 4. Primary Mascot Character (Idle Floating Animation) */}
            <img
              src={doodleWelcome}
              alt="Kodi Mascot CodeAbroad"
              className="w-64 h-64 lg:w-72 lg:h-72 object-contain select-none drop-shadow-2xl relative z-10 animate-float transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Inspirational Tagline (Option 1) */}
          <div className="mt-12 lg:mt-14 text-center max-w-sm px-4">
            <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight leading-snug">
              Buka Peluang Karir Duniamu
            </h2>
            <p className="text-white/75 text-xs lg:text-sm font-normal mt-2 leading-relaxed">
              Persiapan coding interview global lebih terarah bersama Kodi.
            </p>
          </div>
        </div>

        {/* Bottom Spacer for Visual Balance */}
        <div className="hidden lg:block h-6" />
      </div>

      {/* ── RIGHT PANEL: CLEAN AUTH FORM ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-sm">
          {/* Form Header */}
          <div className="mb-7 text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-slate-500 mt-1.5 leading-relaxed font-normal">
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
