import { useNavigate } from 'react-router-dom'
import { Clock, Sparkle } from '@phosphor-icons/react'
import { Button3D } from '../ui/Button3D'
import { SpeechBubble } from '../ui/SpeechBubble'
import doodleWelcome from '../../assets/kodi/doodle-welcome.png'
import type { User } from '../../types/auth'

export interface KodiStationHeroProps {
  user: User | null
  className?: string
  trackTitle?: string
  chapterTitle?: string
  unitTag?: string
  progressPercentage?: number
  timeEstimate?: string
  nextQuestRoute?: string
}

export const KodiStationHero = ({
  user,
  className = '',
  trackTitle = 'Sintaks Go & Gin REST API Engine',
  chapterTitle = 'Bab 4: Routing, JSON Binding & Middleware Controller',
  unitTag = 'Stasiun Shinjuku • Unit 3',
  progressPercentage = 62,
  timeEstimate = '15 Menit',
  nextQuestRoute = '/learn/station-3-jwt-middleware',
}: KodiStationHeroProps) => {
  const navigate = useNavigate()
  const firstName = user?.name ? user.name.split(' ')[0] : user?.username || 'Developer'

  return (
    <div
      className={`rounded-3xl bg-white border-2 border-slate-200/80 p-6 sm:p-7 shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 ${className}`}
    >
      {/* ── AMBIENT WARM HIGHLIGHT ── */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-50/50 rounded-full blur-2xl pointer-events-none -z-0" />

      {/* ── LEFT: KODI MASCOT & LEARNING OBJECTIVE ── */}
      <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full lg:w-auto">
        {/* Living Mascot on Soft Base */}
        <div className="relative flex flex-col items-center justify-center shrink-0 group">
          <div className="w-24 sm:w-28 h-6 bg-slate-200/60 rounded-[50%] absolute -bottom-1 z-0 blur-xs" />
          <img
            src={doodleWelcome}
            alt="Kodi Menyapa"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain relative z-10 drop-shadow-sm select-none transition-transform duration-300 group-hover:-translate-y-1.5 animate-float"
          />
        </div>

        {/* Comic Dialogue & Module Information */}
        <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
          {/* 100% Bahasa Indonesia Speech Bubble */}
          <div className="inline-block">
            <SpeechBubble direction="left" variant="light" className="border-2 border-slate-200 py-1.5 px-3.5 max-w-sm shadow-xs">
              <span className="text-xs font-bold text-slate-800">
                Halo, <strong className="text-blue-600 font-extrabold">{firstName}</strong>! Siap lanjutkan tantangan koding hari ini?
              </span>
            </SpeechBubble>
          </div>

          {/* Unit Tag & Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="bg-blue-50 text-blue-700 border border-blue-200 font-brand font-bold text-[11px] px-3 py-0.5 rounded-full flex items-center gap-1.5">
                <Sparkle weight="fill" className="w-3.5 h-3.5 text-blue-600" />
                <span>{unitTag}</span>
              </span>
              <span className="text-emerald-700 font-brand font-bold text-xs bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {progressPercentage}% Selesai
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-brand font-black text-slate-900 tracking-tight">
              {trackTitle}
            </h2>

            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 font-medium flex-wrap">
              <span>{chapterTitle}</span>
              <span className="flex items-center gap-1 text-amber-600 font-bold font-mono">
                <Clock weight="bold" className="w-3.5 h-3.5" />
                <span>Estimasi {timeEstimate}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: PRIMARY 3D CTA (PURE TEXT, NO UNICODE PLAY ARROW) ── */}
      <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-end gap-3 shrink-0 w-full sm:w-auto relative z-10">
        <Button3D
          variant="blue"
          size="lg"
          onClick={() => navigate(nextQuestRoute)}
          className="w-full sm:w-auto text-sm sm:text-base px-8 py-4 shadow-[0_4px_0_0_#1D4ED8]"
        >
          LANJUTKAN KODING
        </Button3D>
      </div>
    </div>
  )
}
