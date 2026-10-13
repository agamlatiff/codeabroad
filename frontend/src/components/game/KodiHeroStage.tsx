import { useNavigate } from 'react-router-dom'
import { RotateCcw, Clock, Sparkles } from 'lucide-react'
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
  nextQuestRoute?: string
}

export const KodiHeroStage = ({
  user,
  className = '',
  trackTitle = 'Sintaks Go & Gin REST API Engine',
  chapterTitle = 'Bab 4: Routing, JSON Binding & Middleware Controller',
  unitTag = 'UNIT 4 • SHIBUYA ENGINE',
  progressPercentage = 62,
  timeEstimate = '15 Menit',
  nextQuestRoute = '/learn/station-3-jwt-middleware',
}: KodiHeroStageProps) => {
  const navigate = useNavigate()
  const firstName = user?.name ? user.name.split(' ')[0] : user?.username || 'Developer'

  return (
    <div
      className={`rounded-3xl bg-[#101827] border border-[#27364D] p-6 sm:p-7 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 ${className}`}
    >
      {/* ── BACKGROUND AMBIENT NIGHT GLOW ── */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none -z-0" />

      {/* ── LEFT: KODI COMPANION & LEARNING OBJECTIVE COMMAND ── */}
      <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full lg:w-auto">
        {/* Subtle Kodi Mascot on Atmospheric Stepped Base */}
        <div className="relative flex flex-col items-center justify-center shrink-0 group">
          {/* Night glass glow ring */}
          <div className="w-24 sm:w-28 h-8 bg-blue-500/15 rounded-[50%] absolute -bottom-2 z-0 blur-[2px] transition-transform group-hover:scale-105" />
          <div className="w-20 sm:w-24 h-6 bg-cyan-500/20 rounded-[50%] absolute -bottom-1 z-0 blur-xs" />

          {/* Kodi Character */}
          <img
            src={doodleCoding}
            alt="Kodi Coding in Tokyo"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain relative z-10 drop-shadow-md select-none transition-transform duration-300 group-hover:-translate-y-1"
          />
        </div>

        {/* Narrative, Greeting & Module Information */}
        <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
          {/* Subtle manga dialogue from Kodi */}
          <div className="inline-block">
            <SpeechBubble direction="left" variant="dark" className="border border-[#27364D] py-1.5 px-3.5 max-w-sm">
              <span className="text-xs font-semibold text-[#F1F5F9]">
                Konnichiwa, <strong className="text-[#38BDF8]">{firstName}-san</strong>! 🎌 Siap tuntaskan bab ini untuk amankan sponsor visa Tokyo?
              </span>
            </SpeechBubble>
          </div>

          {/* Station Tag & Real Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="bg-[#172236] text-[#38BDF8] border border-[#27364D] font-mono font-bold text-[11px] px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#38BDF8]" />
                <span>{unitTag}</span>
              </span>
              <span className="text-[#10B981] font-mono font-bold text-xs bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                {progressPercentage}% SELESAI
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-[#F1F5F9] tracking-tight">
              {trackTitle}
            </h2>

            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-[#94A3B8] font-medium flex-wrap">
              <span>{chapterTitle}</span>
              <span className="flex items-center gap-1 text-[#F5B942] font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimasi {timeEstimate}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: DOMINANT "CONTINUE LEARNING" ACTION (PRIMARY VISUAL WEIGHT) ── */}
      <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-end gap-3 shrink-0 w-full sm:w-auto relative z-10">
        <Button3D
          variant="blue"
          size="lg"
          onClick={() => navigate(nextQuestRoute)}
          className="w-full sm:w-auto text-xs sm:text-sm px-8 py-3.5 glow-primary shadow-[0_4px_16px_rgba(59,130,246,0.35)]"
        >
          <span>LANJUTKAN KODING ▶</span>
        </Button3D>

        <button
          type="button"
          onClick={() => navigate('/courses')}
          className="text-xs font-semibold text-[#94A3B8] hover:text-[#38BDF8] hover:underline flex items-center gap-1.5 cursor-pointer py-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Review Silabus & Materi Lalu</span>
        </button>
      </div>
    </div>
  )
}
