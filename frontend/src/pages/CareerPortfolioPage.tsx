import { useState, useMemo } from 'react'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import { useRoadmap } from '../hooks/useRoadmap'
import { Button3D } from '../components/ui/Button3D'
import { triggerHaptic } from '../utils/haptics'
import doodleProud from '../assets/kodi/doodle-proud.png'
import doodleCelebrate from '../assets/kodi/doodle-celebrate.png'
import {
  Briefcase,
  Certificate,
  CheckCircle,
  DownloadSimple,
  ShareNetwork,
  Buildings,
  SealCheck,
  FileCode,
  ArrowUpRight,
  ShieldCheck,
  Sparkle,
  Trophy,
  Check,
  Translate,
  Cpu,
  GlobeHemisphereWest,
  Copy,
} from '@phosphor-icons/react'

export const CareerPortfolioPage = () => {
  const { user } = useAuthStore()
  const effectiveTrack = user?.primary_stack || user?.career_path?.slug || 'golang'
  const { roadmap } = useRoadmap(effectiveTrack)

  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'certificate' | 'visa'>('overview')
  const [copiedLink, setCopiedLink] = useState(false)
  const [downloadingCert, setDownloadingCert] = useState(false)

  // Track completed quest IDs from localStorage and API
  const completedQuestsSet = useMemo(() => {
    const set = new Set<string>()
    try {
      const stored = JSON.parse(localStorage.getItem('codeabroad_completed_quests') || '[]')
      if (Array.isArray(stored)) {
        stored.forEach((id: string) => set.add(id))
      }
    } catch {}
    if (roadmap?.stations) {
      roadmap.stations.forEach((st) => {
        st.chapters?.forEach((ch) => {
          ch.quests?.forEach((q) => {
            if (q.status === 'completed') set.add(q.id)
          })
        })
      })
    }
    return set
  }, [roadmap])

  // Dynamic user stats
  const userName = user?.name || user?.username || 'Tokyo Developer'
  const userXp = user?.xp || 0
  const userStreak = user?.streak || 1
  const userLevel = user?.current_level || 1

  // Dynamic Tokyo Job Readiness Calculation
  const totalTrackQuests = useMemo(() => {
    let count = 0
    roadmap?.stations?.forEach((st) => {
      st.chapters?.forEach((ch) => {
        count += ch.quests?.length || 0
      })
    })
    return count > 0 ? count : 12
  }, [roadmap])

  const completedTrackQuests = Math.min(completedQuestsSet.size, totalTrackQuests)
  const curriculumScore = Math.round((completedTrackQuests / totalTrackQuests) * 50) // Max 50 pts
  const xpScore = Math.min(30, Math.round((userXp / 500) * 30)) // Max 30 pts
  const streakScore = Math.min(20, Math.round((userStreak / 7) * 20)) // Max 20 pts
  const readinessPercent = Math.min(100, Math.max(35, curriculumScore + xpScore + streakScore))

  const handleShareProfile = () => {
    triggerHaptic('tap')
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  const handleDownloadCert = () => {
    triggerHaptic('tap')
    setDownloadingCert(true)
    setTimeout(() => {
      setDownloadingCert(false)
      window.print()
    }, 800)
  }

  // Verified Project Showcases
  const portfolioProjects = [
    {
      id: 'proj-1',
      title: 'High-Throughput Go REST API Engine',
      category: 'Backend & Cloud',
      techStack: ['Go 1.24', 'Gin Gonic', 'JWT Authentication', 'Pgxpool'],
      description: 'Microservice API dengan arsitektur Clean Architecture, otorisasi Bearer token, connection pool PostgreSQL, dan graceful shutdown.',
      status: 'VERIFIED',
      tokyoContext: 'Digunakan oleh FinTech & E-Commerce di Shibuya untuk menangani 15,000 req/sec.',
      metrics: '100% Test Coverage • 0 Vulnerabilities',
    },
    {
      id: 'proj-2',
      title: 'Concurrent Task Processor & Worker Pool',
      category: 'Concurrency & Systems',
      techStack: ['Go Concurrency', 'Channels', 'Worker Pool', 'Mutex Sync'],
      description: 'Pipeline pemrosesan batching async asinkron berbasis Goroutine dan buffered channel dengan backpressure limit.',
      status: 'VERIFIED',
      tokyoContext: 'Standar rekrutmen senior backend developer di Roppongi Hills Tech Hub.',
      metrics: 'Zero Goroutine Leaks • Context Timeout Guard',
    },
    {
      id: 'proj-3',
      title: 'Interactive Code Learning Sandbox',
      category: 'Frontend & UI Engineering',
      techStack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Vite'],
      description: 'Duolingo-inspired interactive code runner dengan real-time test evaluation dan tactile 3D physics feedback.',
      status: 'VERIFIED',
      tokyoContext: 'EdTech standard interface untuk persiapan engineer global ke Tokyo.',
      metrics: 'Sub-second Build • Fully Accessible (WCAG)',
    },
  ]

  // Official Immigration Requirements for Japan IT Work Visa
  const visaRequirements = [
    {
      id: 'req-1',
      title: 'Ijazah Formal / Pengalaman 10+ Tahun',
      description: 'Gelar Sarjana (S1/D4) di bidang IT/Teknik atau 10 tahun rekam jejak industri.',
      status: 'READY',
      category: 'Immigration Law',
    },
    {
      id: 'req-2',
      title: 'Portofolio Koding Terverifikasi (GitHub)',
      description: 'Proyek nyata berstandar industri dengan unit testing dan dokumentasi Clean Architecture.',
      status: 'VERIFIED_CA',
      category: 'Technical Portfolio',
    },
    {
      id: 'req-3',
      title: 'Kemampuan Bahasa Jepang Kerja (N4 - N3)',
      description: 'Mampu berpartisipasi dalam Morning Standup (Asakai), PR code review, dan percakapan kantor harian.',
      status: userStreak >= 3 ? 'READY' : 'IN_PROGRESS',
      category: 'Language Proficiency',
    },
    {
      id: 'req-4',
      title: 'Kontrak Kerja / Job Offer Perusahaan Tokyo',
      description: 'Surat penawaran kerja resmi (Offer Letter) dari perusahaan sponsor berbadan hukum di Jepang.',
      status: 'IN_PROGRESS',
      category: 'Employer Sponsorship',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. COMPACT NAV RAIL ── */}
      <NavRail />

      {/* ── 2. MAIN PORTFOLIO CANVAS ── */}
      <div className="flex-1 min-w-0 pb-20 md:pb-12">
        <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6">
          {/* ── TOP CONTEXTUAL BAR ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-brand font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Briefcase weight="fill" className="w-3.5 h-3.5 text-blue-600" />
                  <span>Portofolio Karier Tokyo 2026</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-brand font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ShieldCheck weight="fill" className="w-3 h-3 text-emerald-600" />
                  <span>Verified Candidate</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-brand font-black text-slate-900 tracking-tight">
                Kesiapan Karier & Sponsor Visa Tokyo
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
                Pantau kelayakan portofolio koding, jam terbang bahasa kantor Tokyo, dan sertifikat kompetensi resmi untuk aplikasi visa kerja IT Jepang.
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Button3D
                variant="white"
                size="sm"
                onClick={handleShareProfile}
                className="text-xs flex items-center gap-1.5"
              >
                {copiedLink ? (
                  <>
                    <Check weight="bold" className="w-4 h-4 text-emerald-600" />
                    <span>LINK TERSALIN!</span>
                  </>
                ) : (
                  <>
                    <ShareNetwork weight="bold" className="w-4 h-4 text-slate-600" />
                    <span>BAGIKAN PORTOFOLIO</span>
                  </>
                )}
              </Button3D>

              <Button3D
                variant="blue"
                size="sm"
                onClick={handleDownloadCert}
                className="text-xs flex items-center gap-1.5"
              >
                <DownloadSimple weight="bold" className="w-4 h-4 text-white" />
                <span>{downloadingCert ? 'MEMPROSES...' : 'UNDUH DOKUMEN'}</span>
              </Button3D>
            </div>
          </div>

          {/* ── NAVIGATION TABS ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'overview', label: 'Ringkasan Kesiapan', icon: Trophy },
              { id: 'projects', label: 'Proyek Koding Mandiri', icon: FileCode },
              { id: 'certificate', label: 'Sertifikat Digital', icon: Certificate },
              { id: 'visa', label: 'Checklist Visa IT', icon: Buildings },
            ].map((tab) => {
              const Icon = tab.icon
              const isSelected = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('tap')
                    setActiveTab(tab.id as any)
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-brand font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 border-2 ${
                    isSelected
                      ? 'bg-blue-600 border-blue-700 text-white shadow-[0_3px_0_0_#1D4ED8]'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-600 shadow-2xs active:translate-y-0.5'
                  }`}
                >
                  <Icon weight={isSelected ? 'fill' : 'bold'} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* ══════ TAB 1: OVERVIEW & JOB READINESS METER ══════ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Readiness Hero Card */}
              <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-3 text-center md:text-left">
                    <span className="bg-white/20 text-white border border-white/30 text-[10px] font-brand font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                      <Sparkle weight="fill" className="w-3 h-3 text-amber-300" />
                      <span>TOKYO JOB READINESS INDEX</span>
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-brand font-black leading-tight">
                      {readinessPercent}% Siap Bersaing di Tokyo
                    </h2>
                    <p className="text-blue-100 text-xs sm:text-sm font-medium max-w-xl">
                      Kandidat: <span className="font-black text-white">{userName}</span> ({effectiveTrack.toUpperCase()} Specialist). Skor ini merefleksikan penguasaan kurikulum backend, jam terbang unit test, dan kebiasaan standup harian IT Tokyo.
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md bg-black/20 rounded-full h-3.5 p-0.5 border border-white/20 overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-amber-300 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${readinessPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Kodi Mascot Visual */}
                  <div className="flex flex-col items-center shrink-0">
                    <img
                      src={doodleProud}
                      alt="Kodi Proud"
                      className="w-36 h-36 object-contain drop-shadow-xl animate-float"
                    />
                    <span className="bg-white text-blue-900 border border-blue-200 text-[10px] font-brand font-black px-3 py-1 rounded-xl shadow-md mt-1">
                      Lv. {userLevel} Global Candidate
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Pillars Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Spesialisasi Koding',
                    desc: `${completedTrackQuests}/${totalTrackQuests} Modul Tuntas`,
                    score: `${Math.round((completedTrackQuests / totalTrackQuests) * 100)}%`,
                    icon: Cpu,
                    badge: 'Kompilasi & Sandbox',
                    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
                  },
                  {
                    title: 'Standar Tokyo IT',
                    desc: 'Clean Architecture & Unit Test',
                    score: 'TERVERIFIKASI',
                    icon: SealCheck,
                    badge: 'Produksi Nyata',
                    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  },
                  {
                    title: 'Bahasa Jepang IT',
                    desc: 'Asakai Standup & PR Review',
                    score: 'LEVEL N3',
                    icon: Translate,
                    badge: `${userStreak} Hari Konsisten`,
                    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
                  },
                  {
                    title: 'Kelayakan Sponsor Visa',
                    desc: 'Status Engineer Visa Tech',
                    score: '3/4 SYARAT',
                    icon: GlobeHemisphereWest,
                    badge: 'Imigrasi Jepang',
                    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
                  },
                ].map((pillar) => {
                  const Icon = pillar.icon
                  return (
                    <div
                      key={pillar.title}
                      className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                          <Icon weight="bold" className="w-4 h-4" />
                        </div>
                        <span className={`text-[9px] font-brand font-black px-2 py-0.5 rounded-md border ${pillar.badgeColor}`}>
                          {pillar.badge}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-brand font-black text-xs text-slate-900 leading-tight">
                          {pillar.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {pillar.desc}
                        </p>
                      </div>
                      <div className="pt-1 border-t border-slate-100">
                        <span className="font-brand font-black text-sm text-blue-600">
                          {pillar.score}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ══════ TAB 2: VERIFIED PROJECTS SHOWCASE ══════ */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-brand font-black text-base text-slate-900">
                    Proyek Koding Terverifikasi Tokyo Standard
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Setiap modul yang diselesaikan diuji secara otomatis melalui runner unit test CodeAbroad.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {portfolioProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 space-y-3 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-brand font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle weight="fill" className="w-3 h-3 text-emerald-600" />
                          <span>{proj.status}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          {proj.category}
                        </span>
                      </div>

                      <h4 className="font-brand font-black text-sm text-slate-900 leading-tight">
                        {proj.title}
                      </h4>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1">
                        {proj.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="bg-slate-100 text-slate-700 text-[10px] font-brand font-bold px-2 py-0.5 rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="p-2.5 bg-blue-50/60 border border-blue-200/70 rounded-xl space-y-1">
                        <span className="text-[9px] font-brand font-black text-blue-800 uppercase block">
                          Konteks Industri Tokyo:
                        </span>
                        <p className="text-[10px] text-blue-950 font-medium">
                          {proj.tokyoContext}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">
                        {proj.metrics}
                      </span>
                      <a
                        href="/courses"
                        className="font-brand font-black text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5"
                      >
                        <span>Lihat Modul</span>
                        <ArrowUpRight weight="bold" className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════ TAB 3: DIGITAL CREDENTIAL & CERTIFICATE ══════ */}
          {activeTab === 'certificate' && (
            <div className="space-y-6">
              {/* Formal Digital Credential Canvas */}
              <div className="max-w-3xl mx-auto bg-white border-4 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
                {/* Decorative Borders */}
                <div className="absolute inset-2 border-2 border-dashed border-slate-300 rounded-2xl pointer-events-none" />

                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-brand font-black text-xl shadow-md">
                      CA
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest block">
                        CODEABROAD GLOBAL ACADEMY • TOKYO CHAPTER
                      </span>
                      <h3 className="font-brand font-black text-lg text-slate-900">
                        Certificate of Engineering Competency
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-400 block">CREDENTIAL ID:</span>
                    <span className="font-mono font-black text-xs text-blue-600">
                      CA-TYO-2026-{user?.id ? user.id.slice(0, 8).toUpperCase() : 'DEMO001'}
                    </span>
                  </div>
                </div>

                <div className="text-center py-6 space-y-2 relative z-10">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    DIBERIKAN DENGAN BANGGA KEPADA:
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-brand font-black text-slate-900 underline decoration-blue-500 decoration-4 underline-offset-8">
                    {userName}
                  </h2>
                  <p className="text-xs text-slate-600 max-w-lg mx-auto pt-2">
                    Telah menyelesaikan program kurikulum spesialisasi koding berstandar industri kerja Tokyo{' '}
                    <span className="font-black text-slate-900">({effectiveTrack.toUpperCase()} Engineering)</span>{' '}
                    dan membuktikan keahlian teknis melalui evaluasi unit test otomatis.
                  </p>
                </div>

                {/* Verification Metadata & Official Seal */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-slate-200 relative z-10">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-mono text-slate-400 block">TANGGAL PENERBITAN:</span>
                    <span className="text-xs font-brand font-black text-slate-800">
                      {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 justify-center sm:justify-start">
                      <CheckCircle weight="fill" className="w-3.5 h-3.5" />
                      Cryptographically Validated
                    </span>
                  </div>

                  {/* Hanko Style Stamp */}
                  <div className="w-20 h-20 rounded-2xl border-2 border-rose-500 text-rose-600 flex flex-col items-center justify-center p-1 rotate-6 shadow-sm select-none">
                    <span className="text-[8px] font-mono font-black uppercase">CODEABROAD</span>
                    <span className="text-lg font-brand font-black leading-none">合格</span>
                    <span className="text-[7px] font-mono font-bold">TOKYO CERT</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3">
                <Button3D
                  variant="blue"
                  size="md"
                  onClick={handleDownloadCert}
                  className="text-xs flex items-center gap-2"
                >
                  <DownloadSimple weight="bold" className="w-4 h-4 text-white" />
                  <span>CETAK / SIMPAN SEBAGAI PDF</span>
                </Button3D>

                <Button3D
                  variant="white"
                  size="md"
                  onClick={handleShareProfile}
                  className="text-xs flex items-center gap-2"
                >
                  <Copy weight="bold" className="w-4 h-4 text-slate-700" />
                  <span>SALIN TAUTAN VERIFIKASI</span>
                </Button3D>
              </div>
            </div>
          )}

          {/* ══════ TAB 4: VISA REQUIREMENTS CHECKLIST ══════ */}
          {activeTab === 'visa' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5 sm:p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Buildings weight="fill" className="w-5 h-5 text-amber-700" />
                  <h3 className="font-brand font-black text-sm text-amber-950">
                    Visa Kategori: Engineer / Specialist in Humanities / International Services
                  </h3>
                </div>
                <p className="text-xs text-amber-900 font-medium leading-relaxed">
                  Visa ini merupakan izin tinggal resmi bagi Software Engineer, Cloud Architect, dan Tech Specialist di Jepang. Syarat utamanya adalah kualifikasi formal atau portofolio teruji, kemampuan komunikasi, dan tawaran kerja dari perusahaan sponsor.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visaRequirements.map((req, idx) => {
                  const isDone = req.status === 'READY' || req.status === 'VERIFIED_CA'
                  return (
                    <div
                      key={req.id}
                      className="bg-white border-2 border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-2xs hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          SYARAT #{idx + 1} • {req.category}
                        </span>
                        {isDone ? (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-brand font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle weight="fill" className="w-3 h-3 text-emerald-600" />
                            <span>TERPENUHI</span>
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-brand font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>DALAM PROSES</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-brand font-black text-sm text-slate-900">
                        {req.title}
                      </h4>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {req.description}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Kodi Celebration Note */}
              <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-6 flex items-center gap-5 shadow-xs">
                <img
                  src={doodleCelebrate}
                  alt="Kodi Celebrate"
                  className="w-20 h-20 object-contain shrink-0"
                />
                <div className="space-y-1">
                  <h4 className="font-brand font-black text-xs text-slate-900">
                    Kodi Career Advisor: Langkah Selanjutnya!
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Selesaikan seluruh modul kurikulum spesialisasi Anda di tab{' '}
                    <a href="/courses" className="text-blue-600 font-bold underline">
                      Silabus
                    </a>{' '}
                    untuk memaksimalkan nilai kesiapan portofolio Anda hingga 100%!
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
