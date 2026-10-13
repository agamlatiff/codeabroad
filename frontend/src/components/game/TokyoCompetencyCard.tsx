import { Briefcase, CheckCircle, CircleDashed } from '@phosphor-icons/react'
import doodleProud from '../../assets/kodi/doodle-proud.png'
import type { User } from '../../types/auth'

export interface TokyoCompetencyCardProps {
  user?: User | null
  readinessPercentage?: number
  className?: string
}

export const TokyoCompetencyCard = ({
  readinessPercentage = 68,
  className = '',
}: TokyoCompetencyCardProps) => {
  const competencies = [
    {
      title: 'Sintaks Dasar & Struktur Data Go',
      progress: 100,
      isDone: true,
      tag: 'DASAR',
    },
    {
      title: 'REST API & Gin Framework',
      progress: 75,
      isDone: false,
      tag: 'BACKEND',
    },
    {
      title: 'Goroutine, Channel & Concurrency',
      progress: 40,
      isDone: false,
      tag: 'LANJUTAN',
    },
    {
      title: 'Kosakata Teknis Kantor Jepang (Standup)',
      progress: 30,
      isDone: false,
      tag: 'KOMUNIKASI',
    },
  ]

  return (
    <div
      className={`bg-white border-2 border-slate-200/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm relative overflow-hidden ${className}`}
    >
      {/* ── CARD HEADER ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase weight="bold" className="w-4 h-4" />
          </div>
          <h4 className="font-brand font-black text-sm text-slate-900">
            Tolok Ukur Karier Tokyo
          </h4>
        </div>
        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-brand font-bold px-2.5 py-0.5 rounded-full">
          Target Visa Kerja
        </span>
      </div>

      {/* ── KODI PROUD MENTOR BANNER ── */}
      <div className="flex items-center gap-3 p-3 bg-blue-50/60 border border-blue-100 rounded-2xl">
        <img
          src={doodleProud}
          alt="Kodi Bangga"
          className="w-13 h-13 object-contain shrink-0"
        />
        <div className="space-y-0.5 min-w-0">
          <p className="font-brand font-black text-xs text-slate-900">
            {readinessPercentage}% Kesiapan Portofolio
          </p>
          <p className="text-[11px] text-slate-500 leading-snug">
            Kodi mendampingi kurasi portofolio menuju standar tech Tokyo!
          </p>
        </div>
      </div>

      {/* ── OVERALL READINESS METER ── */}
      <div className="space-y-1.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700">Kesiapan Sponsor Visa Tokyo</span>
          <span className="font-brand font-black text-blue-600 text-sm">
            {readinessPercentage}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${readinessPercentage}%` }}
          />
        </div>
      </div>

      {/* ── 4 COMPETENCY CRITERIA ITEMS ── */}
      <div className="space-y-2.5">
        {competencies.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {item.isDone ? (
                <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <CircleDashed weight="bold" className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span className="text-xs font-semibold text-slate-800 truncate">
                {item.title}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
              {item.progress}%
            </span>
          </div>
        ))}
      </div>

      {/* ── HIRING NOTE ── */}
      <p className="text-[10px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
        Diselaraskan dengan standar perekrutan software engineer di Tokyo (Mercari, LINE Yahoo, Rakuten).
      </p>
    </div>
  )
}
