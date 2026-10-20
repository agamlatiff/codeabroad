import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NavRail } from '../components/layout/NavRail'
import { useAuthStore } from '../store/authStore'
import { useRoadmap } from '../hooks/useRoadmap'
import { Button3D } from '../components/ui/Button3D'
import { triggerHaptic } from '../utils/haptics'
import { audioEngine } from '../utils/audio'
import {
  CourseSwitcherModal,
  GameSidebarRail,
  GameTopBar,
} from '../components/game'
import {
  LockSimple,
  CaretDown,
  Sparkle,
  Lightning,
  Play,
  BookOpen,
  CaretUp,
  CheckFat,
  Trophy,
} from '@phosphor-icons/react'
import { UnitGuidebookModal } from '../components/game/UnitGuidebookModal'
import type { GuidebookContent } from '../components/game/UnitGuidebookModal'
import { TokyoLeaderboardModal } from '../components/game/TokyoLeaderboardModal'
import { authService } from '../services/authService'
import { questService } from '../services/questService'
import {
  CURRICULUM_TRACKS_MAP,
  TRACK_UNIT_THEMES,
  COMPREHENSIVE_GUIDEBOOK_DATA,
  type SequentialCurriculumUnit,
  type SequentialPartItem,
} from '../data/curriculumData'

export type { SequentialCurriculumUnit, SequentialPartItem }

export const RoadmapPage = () => {
  const navigate = useNavigate()
  const { track: routeTrack } = useParams<{ track?: string }>()
  const { user } = useAuthStore()

  // Track state management
  const [activeTrack, setActiveTrack] = useState(() => {
    return routeTrack || user?.primary_stack || user?.career_path?.slug || 'golang'
  })
  const [isCourseSwitcherOpen, setIsCourseSwitcherOpen] = useState(false)

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [guidebookModalUnit, setGuidebookModalUnit] = useState<GuidebookContent | null>(null)
  const [collapsedUnitIds, setCollapsedUnitIds] = useState<Set<string>>(new Set())

  const toggleUnitCollapse = (unitId: string) => {
    triggerHaptic('tap')
    setCollapsedUnitIds((prev) => {
      const next = new Set(prev)
      if (next.has(unitId)) {
        next.delete(unitId)
      } else {
        next.add(unitId)
      }
      return next
    })
  }

  const handleOpenGuidebook = (unit: SequentialCurriculumUnit) => {
    triggerHaptic('tap')
    audioEngine.playPop()

    const fallbackGuidebook: GuidebookContent = {
      unitNumber: unit.unitNumber,
      unitTag: unit.tag,
      title: unit.title,
      summary: unit.description,
      codeSnippetTitle: `Contoh Sintaks & Best Practice: Unit 0${unit.unitNumber}`,
      codeSnippet: `// Contoh implementasi untuk ${unit.title}\n// CodeAbroad Tokyo Curriculum - Unit 0${unit.unitNumber}`,
      codeExplanation:
        'Pahami pola penulisan kode di atas dan pastikan Anda menguji kode secara menyeluruh sebelum mengirim Pull Request.',
      nihongoTerms: [
        { term: '設計書 (Sekkeisho)', reading: 'せっけいしょ', meaning: 'Dokumen Spesifikasi Desain' },
        { term: '開発 (Kaihatsu)', reading: 'かいはつ', meaning: 'Software Development' },
        { term: 'テスト (Tesuto)', reading: 'てすと', meaning: 'Unit Testing & Quality Assurance' },
      ],
      tokyoIndustryTip:
        'Di industri rekrutmen Tokyo, pemahaman konseptual yang kokoh dinilai sama tingginya dengan kecepatan mengetik kode.',
      firstPartRoute: unit.parts[0]?.route,
    }

    setGuidebookModalUnit(COMPREHENSIVE_GUIDEBOOK_DATA[unit.id] || fallbackGuidebook)
  }


  // Completed quests persistence set (clean SSOT starting from user's real progress)
  const [completedQuestsSet, setCompletedQuestsSet] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('codeabroad_completed_quests')
      return stored ? new Set(JSON.parse(stored)) : new Set<string>()
    } catch {
      return new Set<string>()
    }
  })

  // Micro-feedback state for locked node clicks
  const [lockedNotification, setLockedNotification] = useState<string | null>(null)

  // Sync track when route parameter changes
  useEffect(() => {
    if (routeTrack && routeTrack !== activeTrack) {
      setActiveTrack(routeTrack)
    }
  }, [routeTrack, activeTrack])

  const { isLoading } = useRoadmap(activeTrack)

  // Fetch real user completed quests from backend API
  useEffect(() => {
    let isMounted = true
    questService
      .listQuests()
      .then((quests) => {
        if (!isMounted || !quests || quests.length === 0) return
        setCompletedQuestsSet((prev) => {
          const next = new Set(prev)
          quests.forEach((q) => {
            if (q.user_status === 'completed') {
              next.add(q.id)
            }
          })
          return next
        })
      })
      .catch(() => {
        // Gracefully continue with local storage
      })
    return () => {
      isMounted = false
    }
  }, [])

  // Listen for quest completion events
  useEffect(() => {
    const handleQuestCompleted = () => {
      try {
        const stored = localStorage.getItem('codeabroad_completed_quests')
        if (stored) {
          setCompletedQuestsSet(new Set(JSON.parse(stored)))
        }
      } catch (e) {
        console.error('Failed to sync completed quests in Roadmap:', e)
      }
    }
    window.addEventListener('codeabroad_quest_completed', handleQuestCompleted)
    return () => {
      window.removeEventListener('codeabroad_quest_completed', handleQuestCompleted)
    }
  }, [])


  // Dynamic Sequential Units for Active Track
  const units: SequentialCurriculumUnit[] = useMemo(() => {
    return (
      CURRICULUM_TRACKS_MAP[activeTrack] ||
      (activeTrack === 'backend' && CURRICULUM_TRACKS_MAP['golang']) ||
      (activeTrack === 'react' && CURRICULUM_TRACKS_MAP['frontend']) ||
      (activeTrack === 'devops_aws' && CURRICULUM_TRACKS_MAP['devops']) ||
      CURRICULUM_TRACKS_MAP['golang']
    )
  }, [activeTrack])

  // Compute metrics across all parts of current active track
  const allParts = useMemo(() => units.flatMap((u) => u.parts), [units])
  const totalPartsCount = allParts.length
  const completedPartsCount = allParts.filter((p) => completedQuestsSet.has(p.id)).length
  const curriculumProgressPercent = Math.min(
    100,
    Math.round((completedPartsCount / totalPartsCount) * 100)
  )

  // First active part (next unlocked part in active track)
  const nextActivePart = useMemo(() => {
    return allParts.find((p) => !completedQuestsSet.has(p.id)) || allParts[0]
  }, [allParts, completedQuestsSet])

  // Multi-track progress map for CourseSwitcherModal
  const trackProgressMap = useMemo(() => {
    const progressMap: Record<string, { completed: number; total: number }> = {}
    Object.entries(CURRICULUM_TRACKS_MAP).forEach(([trackSlug, trackUnits]) => {
      const parts = trackUnits.flatMap((u) => u.parts)
      const completed = parts.filter((p) => completedQuestsSet.has(p.id)).length
      progressMap[trackSlug] = {
        completed,
        total: parts.length > 0 ? parts.length : 10,
      }
    })
    return progressMap
  }, [completedQuestsSet])

  // Handle track switch from CourseSwitcherModal
  const handleSelectTrack = async (trackSlug: string) => {
    triggerHaptic('success')
    setActiveTrack(trackSlug)
    setIsCourseSwitcherOpen(false)
    navigate(`/roadmap/${trackSlug}`)
    useAuthStore.getState().updateUser({ primary_stack: trackSlug })
    try {
      await authService.updateProfile({ primary_stack: trackSlug })
    } catch {
      // Gracefully continue with local state
    }
  }

  // Micro-interaction handler for locked curriculum nodes
  const handleLockedNodeClick = (partTitle: string) => {
    triggerHaptic('tap')
    audioEngine.playPop()
    setLockedNotification(`Selesaikan modul sebelumnya untuk membuka: "${partTitle}" 🔒`)
    setTimeout(() => {
      setLockedNotification((curr) => (curr?.includes(partTitle) ? null : curr))
    }, 3200)
  }


  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-blue-600/20">
      {/* ── 1. LEFT NAV RAIL (SSOT) ── */}
      <NavRail />

      {/* ── 2. MAIN APP CANVAS (CENTER STAGE + RIGHT SIDEBAR) ── */}
      <div className="flex-1 min-w-0 flex flex-col xl:flex-row pb-20 md:pb-8 xl:pb-0">
        {/* ══════ CENTER CONTENT STAGE ══════ */}
        <main className="flex-1 min-w-0 px-3.5 sm:px-8 py-5 sm:py-6 pb-12 space-y-6">
          {/* ── 1. CLEAN CONTEXTUAL TOP BAR (SSOT - GameTopBar) ── */}
          <GameTopBar
            activeTrack={activeTrack}
            onOpenCourseSwitcher={() => setIsCourseSwitcherOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenMobileSidebar={() => setIsMobileDrawerOpen(true)}
            completedCount={completedPartsCount}
            totalCount={totalPartsCount}
            progressPercent={curriculumProgressPercent}
            unitLabel="Modul"
          />

          {/* ── 2. DIRECT SEQUENTIAL TECHNICAL UNIT CARDS (IMMERSIVE UNIT STAGE) ── */}
          <div className="space-y-6 pt-1">
            {isLoading && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs font-semibold animate-pulse">
                Memuat silabus kurikulum spesialisasi...
              </div>
            )}

            {units.map((unit) => {
              const unitParts = unit.parts
              const unitCompletedCount = unitParts.filter((p) => completedQuestsSet.has(p.id)).length
              const isUnitCompleted = unitCompletedCount === unitParts.length
              const isUnitActive = !isUnitCompleted && unitParts.some((p) => p.id === nextActivePart?.id)
              const unitPercent =
                unitParts.length > 0 ? Math.round((unitCompletedCount / unitParts.length) * 100) : 0
              const trackThemes =
                TRACK_UNIT_THEMES[activeTrack] ||
                (activeTrack === 'backend' && TRACK_UNIT_THEMES['golang']) ||
                (activeTrack === 'react' && TRACK_UNIT_THEMES['frontend']) ||
                (activeTrack === 'devops_aws' && TRACK_UNIT_THEMES['devops']) ||
                TRACK_UNIT_THEMES['golang']
              const theme = trackThemes[unit.unitNumber] || trackThemes[1]

              return (
                <div
                  key={unit.id}
                  className={`bg-white rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-2xs ${
                    isUnitCompleted
                      ? 'border-emerald-300 ring-4 ring-emerald-500/10'
                      : isUnitActive
                      ? 'border-blue-500 ring-4 ring-blue-500/15'
                      : 'border-slate-200/90'
                  }`}
                >
                  {/* ── DUOLINGO 3D UNIT BANNER HEADER ── */}
                  <div
                    className={`p-4 sm:p-6 transition-all ${
                      isUnitCompleted
                        ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white border-b-[5px] border-emerald-900'
                        : isUnitActive
                        ? `${theme.gradientBg} text-white ${theme.border3D}`
                        : 'bg-slate-100 text-slate-800 border-b-[4px] border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-mono font-bold text-[10px] px-2.5 py-1 rounded-lg ${
                              isUnitCompleted
                                ? 'bg-emerald-500/30 border border-emerald-300/30 text-white'
                                : isUnitActive
                                ? theme.tagBg
                                : 'bg-slate-200 border border-slate-300 text-slate-700'
                            }`}
                          >
                            {unit.tag}
                          </span>

                          {isUnitCompleted ? (
                            <span className="bg-white/20 text-white font-brand font-black text-[10px] px-2.5 py-0.5 rounded-lg flex items-center gap-1 border border-white/25">
                              <CheckFat weight="fill" className="w-3 h-3 text-emerald-200" />
                              <span>LULUS SEMUA SESI</span>
                            </span>
                          ) : isUnitActive ? (
                            <span className="bg-white/20 text-white font-brand font-black text-[10px] px-2.5 py-0.5 rounded-lg flex items-center gap-1 border border-white/25">
                              <Sparkle weight="fill" className="w-3 h-3 text-amber-300" />
                              <span>SEDANG AKTIF</span>
                            </span>
                          ) : (
                            <span className="bg-slate-200/90 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1 border border-slate-300">
                              <LockSimple weight="bold" className="w-3 h-3" />
                              <span>TERKUNCI</span>
                            </span>
                          )}
                        </div>

                        <h3
                          className={`font-brand font-black text-lg sm:text-xl tracking-tight leading-snug ${
                            isUnitCompleted || isUnitActive ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {unit.title}
                        </h3>
                        <p
                          className={`text-xs leading-relaxed max-w-2xl font-medium ${
                            isUnitCompleted || isUnitActive ? 'text-white/80' : 'text-slate-600'
                          }`}
                        >
                          {unit.description}
                        </p>
                      </div>

                      {/* Action Buttons Row: Guidebook & Collapse toggle together! */}
                      <div className="flex items-center gap-2 self-stretch sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenGuidebook(unit)}
                          className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl text-xs font-brand font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-2xs ${
                            isUnitCompleted || isUnitActive
                              ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25 active:translate-y-0.5'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 active:translate-y-0.5'
                          }`}
                          title="Buka ringkasan teori, sintaks kode, dan kosakata unit"
                        >
                          <BookOpen weight="bold" className="w-4 h-4 shrink-0" />
                          <span>Buku Panduan Unit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleUnitCollapse(unit.id)}
                          className={`p-2 rounded-xl text-xs transition-all flex items-center justify-center cursor-pointer shrink-0 shadow-2xs ${
                            isUnitCompleted || isUnitActive
                              ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25 active:scale-95'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 active:scale-95'
                          }`}
                          title={collapsedUnitIds.has(unit.id) ? 'Buka Sesi Unit' : 'Lipat Sesi Unit'}
                        >
                          {collapsedUnitIds.has(unit.id) ? (
                            <CaretDown weight="bold" className="w-4 h-4" />
                          ) : (
                            <CaretUp weight="bold" className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* 3D Segmented Progress Bar */}
                    <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between gap-3">
                      <div className="flex-1 max-w-md">
                        <div
                          className={`h-2.5 sm:h-3 rounded-full overflow-hidden p-0.5 border ${
                            isUnitCompleted || isUnitActive
                              ? 'bg-black/25 border-white/20'
                              : 'bg-slate-200 border-slate-300'
                          }`}
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-500 shadow-xs ${
                              isUnitCompleted
                                ? 'bg-emerald-300'
                                : isUnitActive
                                ? 'bg-white'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${unitPercent}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className={`text-xs font-brand font-black shrink-0 whitespace-nowrap ${
                          isUnitCompleted || isUnitActive ? 'text-white' : 'text-slate-600'
                        }`}
                      >
                        {unitCompletedCount}/{unitParts.length} Sesi ({unitPercent}%)
                      </span>
                    </div>
                  </div>

                  {/* ── SEQUENTIAL PART BREAKDOWN (COLLAPSIBLE - Subtask 33.3) ── */}
                  {!collapsedUnitIds.has(unit.id) && (
                    <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-3 bg-white">
                      {unitParts.map((part) => {
                        const isCompleted = completedQuestsSet.has(part.id)
                        const isNextActive = part.id === nextActivePart?.id
                        const isUnlocked = isCompleted || isNextActive

                        return (
                          <div
                            key={part.id}
                            className={`p-3.5 sm:p-4.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 transition-all duration-200 ${
                              isCompleted
                                ? 'bg-white border-2 border-slate-200/90 border-b-[4px] border-b-slate-300 hover:border-b-[5px] hover:-translate-y-0.5'
                                : isNextActive
                                ? 'bg-blue-50/50 border-2 border-blue-500 border-b-[5px] border-b-blue-600 ring-4 ring-blue-500/10 shadow-sm hover:border-b-[6px] hover:-translate-y-0.5'
                                : 'bg-slate-50/70 border-2 border-slate-200/70 border-b-[3px] border-b-slate-200 opacity-60'
                            } ${
                              part.category === 'nihongo' && !isCompleted && !isNextActive
                                ? 'bg-rose-50/40 border-rose-200/60'
                                : ''
                            }`}
                          >
                          {/* Left: 3D Tactile Token Cube + Details */}
                          <div className="flex items-start sm:items-center gap-3 min-w-0">
                            {/* 3D Tactile Token Cube */}
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                                isCompleted
                                  ? 'bg-emerald-500 border-2 border-emerald-300 text-white shadow-[0_3px_0_0_#047857] sm:shadow-[0_3.5px_0_0_#047857]'
                                  : isNextActive
                                  ? 'bg-blue-600 border-2 border-blue-400 text-white shadow-[0_3px_0_0_#1D4ED8] sm:shadow-[0_3.5px_0_0_#1D4ED8] animate-pulse'
                                  : 'bg-slate-100 border-2 border-slate-200 text-slate-400'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckFat weight="fill" className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-xs" />
                              ) : isNextActive ? (
                                <span className="font-brand font-black text-sm sm:text-lg text-white">
                                  {part.globalPartNumber}
                                </span>
                              ) : (
                                <LockSimple weight="bold" className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                              )}
                            </div>

                            <div className="space-y-0.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                    part.category === 'nihongo'
                                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  {part.chipLabel}
                                </span>

                                {isNextActive && (
                                  <span className="bg-blue-100 text-blue-700 border border-blue-200 font-brand font-black text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                                    <Sparkle weight="fill" className="w-3 h-3 text-blue-600" />
                                    <span>MODUL AKTIF</span>
                                  </span>
                                )}
                              </div>

                              <h4
                                className={`text-xs sm:text-base font-brand font-bold tracking-tight leading-snug line-clamp-2 ${
                                  isNextActive ? 'text-blue-950 font-black' : 'text-slate-900'
                                }`}
                              >
                                Part {part.globalPartNumber}: {part.title}
                              </h4>

                              <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                {part.subtitle} • {part.difficulty} • ⏱️ Estimasi {part.estimatedMinutes} Menit
                              </p>
                            </div>
                          </div>

                          {/* Right: XP Chip & Tactile Action */}
                          <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <span className="bg-amber-50 text-amber-900 border border-amber-300 font-brand font-black text-[11px] sm:text-xs px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1">
                              <Lightning weight="fill" className="w-3.5 h-3.5 text-amber-600" />
                              <span>+{part.xpReward} XP</span>
                            </span>

                            {isCompleted ? (
                              <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 font-brand font-black text-xs flex items-center gap-1.5 shadow-[0_2px_0_0_#A7F3D0]">
                                <CheckFat weight="fill" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                                <span>SELESAI</span>
                              </div>
                            ) : isUnlocked ? (
                              <Button3D
                                variant="blue"
                                size="sm"
                                onClick={() => {
                                  triggerHaptic('success')
                                  navigate(part.route)
                                }}
                                className="text-xs px-4 sm:px-5 py-2 sm:py-2.5 shadow-[0_3px_0_0_#1D4ED8] sm:shadow-[0_3.5px_0_0_#1D4ED8] font-brand font-black"
                              >
                                <div className="flex items-center gap-1.5">
                                  <Play weight="fill" className="w-3.5 h-3.5" />
                                  <span>MULAI KODING</span>
                                </div>
                              </Button3D>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleLockedNodeClick(part.title)}
                                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 border-2 border-slate-200 text-slate-400 hover:text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                title="Modul ini masih terkunci. Klik untuk informasi."
                              >
                                <LockSimple weight="bold" className="w-3.5 h-3.5" />
                                <span>Terkunci</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  )}

                  {/* Unit Milestone Trophy Badge (Subtask 33.4) */}
                  {isUnitCompleted && (
                    <div className="p-3.5 sm:p-4 bg-emerald-50/90 border-t-2 border-emerald-200/90 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <Trophy weight="fill" className="w-4 h-4 text-amber-200" />
                        </div>
                        <div>
                          <span className="font-brand font-black text-emerald-950 block">
                            Unit 0{unit.unitNumber} Lulus 100%!
                          </span>
                          <span className="text-[11px] text-emerald-700 font-medium">
                            Seluruh sesi Unit 0{unit.unitNumber} tuntas (+{unit.totalXp} XP total terkumpul).
                          </span>
                        </div>
                      </div>
                      <span className="bg-emerald-600 text-white font-brand font-black text-[10px] px-2.5 py-1 rounded-xl shadow-xs">
                        TERVERIFIKASI ✓
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </main>

        {/* ══════ RIGHT SIDEBAR RAIL (SSOT - Subtask 34.4) ══════ */}
        <GameSidebarRail
          activeTrack={activeTrack}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
        />
      </div>

      {/* ── 3. DUOLINGO-STYLE COURSE SWITCHER MODAL ── */}
      <CourseSwitcherModal
        isOpen={isCourseSwitcherOpen}
        onClose={() => setIsCourseSwitcherOpen(false)}
        currentTrack={activeTrack}
        onSelectTrack={handleSelectTrack}
        trackProgressMap={trackProgressMap}
      />


      {/* ── TOKYO LEADERBOARD MODAL (Subtask 33.2) ── */}
      <TokyoLeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* ── UNIT GUIDEBOOK MODAL (Subtask 33.1) ── */}
      <UnitGuidebookModal
        isOpen={guidebookModalUnit !== null}
        content={guidebookModalUnit}
        onClose={() => setGuidebookModalUnit(null)}
        onStartUnit={() => {
          if (guidebookModalUnit?.firstPartRoute) {
            navigate(guidebookModalUnit.firstPartRoute)
          }
        }}
      />

      {/* ── 4. MICRO-INTERACTION TOAST (LOCKED NODE FEEDBACK) ── */}
      {lockedNotification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <LockSimple weight="bold" className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold">{lockedNotification}</span>
        </div>
      )}
    </div>
  )
}
