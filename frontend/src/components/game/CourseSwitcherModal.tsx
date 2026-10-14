import {
  Check,
  CaretRight,
  Sparkle,
  X,
} from '@phosphor-icons/react'
import doodleCoding from '../../assets/kodi/doodle-coding.png'
import { triggerHaptic } from '../../utils/haptics'
import {
  GolangLogo,
  ReactLogo,
  DockerLogo,
  FundamentalLogo,
  TechNihongoLogo,
} from '../ui/BrandLogos'

export interface CareerTrackItem {
  id: string
  slug: string
  title: string
  subtitle: string
  category: 'coding' | 'language'
  iconType: 'fundamental' | 'golang' | 'frontend' | 'devops' | 'nihongo'
  badgeLabel: string
  badgeVariant: 'active' | 'available' | 'featured'
  progressPercent: number
  partsCompleted: number
  totalParts: number
}

export interface CourseSwitcherModalProps {
  isOpen: boolean
  onClose: () => void
  currentTrack: string
  onSelectTrack: (trackSlug: string) => void
  trackProgressMap?: Record<string, { completed: number; total: number }>
}

export const CAREER_TRACKS: CareerTrackItem[] = [
  {
    id: 'track-frontend',
    slug: 'frontend',
    title: 'Frontend Engineer (React & TS)',
    subtitle: 'Dasar IT, Komponen UI, Integrasi REST API & Bahasa Jepang Kerja Tokyo',
    category: 'coding',
    iconType: 'frontend',
    badgeLabel: 'Populer',
    badgeVariant: 'featured',
    progressPercent: 0,
    partsCompleted: 0,
    totalParts: 10,
  },
  {
    id: 'track-golang',
    slug: 'golang',
    title: 'Backend Engineer (Golang)',
    subtitle: 'Dasar IT, Arsitektur Server, REST API Gin, Database & Bahasa Jepang Kerja Tokyo',
    category: 'coding',
    iconType: 'golang',
    badgeLabel: 'Sedang Aktif',
    badgeVariant: 'active',
    progressPercent: 0,
    partsCompleted: 0,
    totalParts: 11,
  },
  {
    id: 'track-devops',
    slug: 'devops',
    title: 'DevOps & Cloud Engineer',
    subtitle: 'Dasar IT, Linux Systemd, Container Docker, CI/CD & Bahasa Jepang Kerja Tokyo',
    category: 'coding',
    iconType: 'devops',
    badgeLabel: 'Tersedia',
    badgeVariant: 'available',
    progressPercent: 0,
    partsCompleted: 0,
    totalParts: 10,
  },
]

export const CourseSwitcherModal = ({
  isOpen,
  onClose,
  currentTrack,
  onSelectTrack,
  trackProgressMap,
}: CourseSwitcherModalProps) => {
  if (!isOpen) return null

  const handleSelect = (track: CareerTrackItem) => {
    triggerHaptic('success')
    onSelectTrack(track.slug)
    onClose()
  }

  const renderBrandIcon = (type: CareerTrackItem['iconType']) => {
    switch (type) {
      case 'fundamental':
        return <FundamentalLogo className="w-6 h-6" />
      case 'golang':
        return <GolangLogo className="w-7 h-5" />
      case 'frontend':
        return <ReactLogo className="w-6 h-6" />
      case 'devops':
        return <DockerLogo className="w-6 h-6" />
      case 'nihongo':
        return <TechNihongoLogo className="w-6 h-6" />
    }
  }

  const renderTrackCard = (track: CareerTrackItem) => {
    const isCurrent = track.slug === currentTrack
    const stats = trackProgressMap?.[track.slug]
    const completed = stats ? stats.completed : track.partsCompleted
    const total = stats ? stats.total : track.totalParts
    const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : track.progressPercent

    return (
      <div
        key={track.id}
        onClick={() => handleSelect(track)}
        className={`group relative rounded-2xl p-4 border-2 transition-all cursor-pointer ${
          isCurrent
            ? 'bg-blue-50/70 border-blue-500 shadow-xs'
            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Official Brand Logo Frame */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                isCurrent
                  ? 'bg-white border-blue-300 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 group-hover:bg-white'
              }`}
            >
              {renderBrandIcon(track.iconType)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-brand font-black text-sm text-slate-900 truncate">
                  {track.title}
                </h4>
                {isCurrent ? (
                  <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 font-brand font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check weight="bold" className="w-3 h-3" />
                    <span>Aktif</span>
                  </span>
                ) : track.badgeVariant === 'featured' ? (
                  <span className="bg-rose-100 border border-rose-200 text-rose-700 font-brand font-black text-[10px] px-2 py-0.5 rounded-full">
                    {track.badgeLabel}
                  </span>
                ) : track.badgeVariant === 'available' ? (
                  <span className="bg-slate-100 text-slate-700 font-brand font-bold text-[10px] px-2 py-0.5 rounded-full">
                    {track.badgeLabel}
                  </span>
                ) : null}
              </div>

              <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">
                {track.subtitle}
              </p>

              {/* Progress Bar */}
              <div className="mt-2.5 flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isCurrent ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-600 shrink-0">
                  {completed}/{total} Modul ({percent}%)
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 pt-1 text-slate-400 group-hover:text-slate-700 transition-colors">
            <CaretRight weight="bold" className="w-4 h-4" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in select-none">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl border-2 border-slate-200/90 shadow-xl overflow-hidden mt-8 sm:mt-0 animate-pop">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Sparkle weight="fill" className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-brand font-black text-base text-slate-900">
                Pilih Program Karier Tokyo
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pilih peran spesialisasi Anda. Sudah All-in-One (Dasar IT, Koding & Bahasa Jepang Kerja).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Unified Career Programs List */}
        <div className="p-4 sm:p-5 space-y-3 max-h-[65vh] overflow-y-auto">
          {CAREER_TRACKS.map(renderTrackCard)}
        </div>

        {/* Kodi Motivational Footer Tip */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-600 font-medium">
          <img
            src={doodleCoding}
            alt="Kodi Companion"
            className="w-9 h-9 object-contain shrink-0"
          />
          <p>
            <span className="font-bold text-slate-900">Tips Kodi:</span> Setiap program sudah mencakup Dasar Komputer, Koding & Bahasa Jepang kerja sampai siap kerja di Tokyo!
          </p>
        </div>
      </div>
    </div>
  )
}
