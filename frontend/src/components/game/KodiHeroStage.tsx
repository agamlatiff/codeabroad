import { useNavigate } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { Button3D } from '../ui/Button3D'
import { SpeechBubble } from '../ui/SpeechBubble'
import doodleCoding from '../../assets/kodi/doodle-coding.png'
import type { User } from '../../types/auth'

export interface KodiHeroStageProps {
  user: User | null
  className?: string
  trackTitle?: string
  chapterTitle?: string
  unitTag?: string
  progressPercentage?: number
  timeEstimate?: string
}

export const KodiHeroStage = ({
  user,
  className = '',
  trackTitle = 'Sintaks Go & Gin REST API Engine',
  chapterTitle = 'Bab 4: Routing, JSON Binding & Middleware Controller',
  unitTag = 'UNIT 4 • SHIBUYA ENGINE',
  progressPercentage = 62,
  timeEstimate = '15 Menit',
}: KodiHeroStageProps) => {
  const navigate = useNavigate()
  const firstName = user?.name ? user.name.split(' ')[0] : user?.username || 'Agam'

  return (
    <div className={`rounded-3xl bg-gradient-to-br from-[#EFF6FF] via-white to-sky-50/70 border-2 border-[#BFDBFE] p-6 sm:p-7 shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 ${className}`}>
      {/* ── BACKGROUND AMBIENT GLOW ── */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* ── LEFT: KODI COMPANION WITH 3D GLASS PODIUM & SPEECH BUBBLE ── */}
      <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full lg:w-auto">
        {/* Kodi Mascot on Glass Base */}
        <div className="relative flex flex-col items-center justify-center shrink-0 group">
          {/* Subtle Stepped Glass Base */}
          <div className="w-28 sm:w-32 h-10 bg-blue-200/50 rounded-[50%] absolute -bottom-3 z-0 blur-[1px] shadow-sm transition-transform group-hover:scale-105" />
          <div className="w-24 sm:w-28 h-8 bg-blue-300/40 rounded-[50%] absolute -bottom-2 z-0" />

          {/* Kodi Character */}
          <img
            src={doodleCoding}
            alt="Kodi Coding in Tokyo"
            className="w-28 h-28 sm:w-32 sm:h-32 object-contain relative z-10 drop-shadow-md select-none transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-105"
          />
        </div>

        {/* Narrative & Manga Speech Bubble */}
        <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
          {/* Manga Speech Bubble from Kodi */}
          <div className="inline-block">
            <SpeechBubble direction="left" variant="light" className="shadow-xs py-2 px-3.5 max-w-sm">
              <span className="text-xs font-bold text-slate-800">
                Konnichiwa, <strong className="text-[#2563EB]">{firstName}-san</strong>! 🎌 Siap tuntaskan bab ini untuk amankan sponsor visa Tokyo? 🚀
              </span>
            </SpeechBubble>
          </div>

          {/* Unit Tag & Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="bg-[#DBEAFE] text-[#065F46] font-black text-[11px] px-2.5 py-0.5 rounded-md">
                {unitTag}
              </span>
              <span className="text-[#047857] font-bold text-xs">
                {progressPercentage}% Selesai (25/40 Sesi)
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight">
              {trackTitle}
            </h2>

            <p className="text-xs text-slate-600 font-medium">
              {chapterTitle} • Estimasi {timeEstimate}
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: PRIMARY 3D DUOLINGO CTA ── */}
      <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-end gap-2.5 shrink-0 w-full sm:w-auto relative z-10">
        <Button3D
          variant="blue"
          size="lg"
          onClick={() => navigate('/learn/station-3-jwt-middleware')}
          className="w-full sm:w-auto text-xs sm:text-sm px-7 py-3.5 shadow-[0_5px_0_0_#1D4ED8]"
        >
          <span>LANJUTKAN KODING ▶</span>
        </Button3D>

        <button
          type="button"
          onClick={() => navigate('/courses')}
          className="text-xs font-bold text-[#059669] hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer py-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Review Materi Lalu</span>
        </button>
      </div>
    </div>
  )
}
