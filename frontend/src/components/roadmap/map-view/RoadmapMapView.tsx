import { useState, useMemo, useEffect } from 'react'
import type { FC } from 'react'
import {
  Check,
  LockSimple,
  Sparkle,
  BookOpen,
} from '@phosphor-icons/react'
import { triggerHaptic } from '../../../utils/haptics'
import type { Roadmap, Module, Chapter } from '../../../types/roadmap'
import type { QuestSummary } from '../../../types/quest'
import {
  TRACK_CURRICULA,
  type CurriculumPartNode,
  type CurriculumUnitData,
  type PathMapNode,
} from '../../../data/roadmapMapFallback'
import { RoadmapGuidebookModal, type GuidebookActiveUnit } from './RoadmapGuidebookModal'
import { RoadmapNodeDetailModal } from './RoadmapNodeDetailModal'
import { RoadmapPathNode } from './RoadmapPathNode'

export interface RoadmapMapViewProps {
  className?: string
  trackSlug?: string
  roadmap?: Roadmap | null
  currentPart?: number
  onStartQuest?: (route: string) => void
}

/**
 * RoadmapMapView
 * Interactive Duolingo 3D Serpentine Snake Path view themed after Tokyo Yamanote Line.
 * Features stepping stone nodes, tactile 3D buttons, cheatsheet guidebook, and Kodi mascot.
 */
export const RoadmapMapView: FC<RoadmapMapViewProps> = ({
  className = '',
  trackSlug = 'golang',
  roadmap = null,
  currentPart,
  onStartQuest,
}) => {
  const [activeModalNode, setActiveModalNode] = useState<PathMapNode | null>(null)
  const [activeGuidebook, setActiveGuidebook] = useState<GuidebookActiveUnit | null>(null)
  const [questCompletionTick, setQuestCompletionTick] = useState(0)

  // Listen for real-time quest completions across the application
  useEffect(() => {
    const handler = () => setQuestCompletionTick((prev) => prev + 1)
    window.addEventListener('codeabroad_quest_completed', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('codeabroad_quest_completed', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  // Aggregated set of all completed quest IDs from backend and local storage
  const completedSet = useMemo(() => {
    const set = new Set<string>()
    // 1. From backend roadmap quests
    if (roadmap?.modules) {
      roadmap.modules.forEach((st: Module) => {
        (st.chapters || []).forEach((ch: Chapter) => {
          (ch.quests || []).forEach((q: QuestSummary) => {
            if (q.status === 'completed') {
              set.add(q.id)
              if (q.chip_label) set.add(q.chip_label)
            }
          })
        })
      })
    }
    // 2. From localStorage
    void questCompletionTick // trigger re-evaluation when storage tick updates
    try {
      const stored = JSON.parse(localStorage.getItem('codeabroad_completed_quests') || '[]')
      if (Array.isArray(stored)) {
        stored.forEach((id: string) => set.add(id))
      }
    } catch {
      /* ignore invalid storage format */
    }
    return set
  }, [roadmap, questCompletionTick])

  // Derive units from backend roadmap if available, with graceful fallback to TRACK_CURRICULA
  const units: CurriculumUnitData[] = useMemo(() => {
    if (roadmap?.modules && roadmap.modules.length > 0) {
      let globalPartCounter = 1

      // Preset theme palettes for stations
      const unitPalettes = [
        {
          gradient: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700',
          border: 'border-emerald-500/40',
        },
        {
          gradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700',
          border: 'border-blue-500/40',
        },
        {
          gradient: 'bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-800',
          border: 'border-purple-500/40',
        },
        {
          gradient: 'bg-gradient-to-r from-slate-700 via-slate-800 to-indigo-900',
          border: 'border-slate-500/40',
        },
      ]

      let hasFoundActiveQuest = false

      return roadmap.modules.map((st: Module, stIdx: number) => {
        const palette = unitPalettes[stIdx % unitPalettes.length]
        const stationQuests: CurriculumPartNode[] = []

        if (st.chapters && st.chapters.length > 0) {
          st.chapters.forEach((ch: Chapter) => {
            if (ch.quests && ch.quests.length > 0) {
              ch.quests.forEach((q: QuestSummary) => {
                const partNum = globalPartCounter++
                const isQuestCompleted = q.status === 'completed' || completedSet.has(q.id)
                let questStatus: 'completed' | 'active' | 'locked'
                if (isQuestCompleted) {
                  questStatus = 'completed'
                } else if (!hasFoundActiveQuest) {
                  questStatus = 'active'
                  hasFoundActiveQuest = true
                } else {
                  questStatus = 'locked'
                }

                stationQuests.push({
                  id: q.id,
                  number: partNum,
                  title: q.title,
                  subtitle: q.chip_label ? `${q.chip_label} • ${q.difficulty}` : q.difficulty,
                  status: questStatus,
                  route: `/learn/${q.id}`,
                  xpReward: q.xp_reward || 50,
                  category: (q.type as string) === 'nihongo' ? 'nihongo' : 'code',
                  badgeLabel: (q.type as string) === 'nihongo' ? '🌸 NIHONGO' : undefined,
                })
              })
            } else {
              const partNum = globalPartCounter++
              let chapterStatus: 'completed' | 'active' | 'locked'
              if (ch.is_completed) {
                chapterStatus = 'completed'
              } else if (!hasFoundActiveQuest) {
                chapterStatus = 'active'
                hasFoundActiveQuest = true
              } else {
                chapterStatus = 'locked'
              }

              stationQuests.push({
                id: ch.id,
                number: partNum,
                title: ch.title,
                subtitle: ch.description || 'Modul Pembelajaran',
                status: chapterStatus,
                route: `/learn/${ch.id}`,
                xpReward: 50,
                category: 'code',
              })
            }
          })
        }

        if (stationQuests.length === 0) {
          let stStatus: 'completed' | 'active' | 'locked'
          if (st.is_completed) {
            stStatus = 'completed'
          } else if (!hasFoundActiveQuest) {
            stStatus = 'active'
            hasFoundActiveQuest = true
          } else {
            stStatus = 'locked'
          }

          stationQuests.push({
            id: st.id,
            number: globalPartCounter++,
            title: st.title,
            subtitle: st.description || 'Pondasi Modul',
            status: stStatus,
            route: `/courses`,
            xpReward: 50,
            category: 'code',
          })
        }

        const isStationCompleted =
          st.is_completed || stationQuests.every((p) => p.status === 'completed')
        const isStationActive =
          !isStationCompleted && stationQuests.some((p) => p.status === 'active')

        return {
          id: st.id,
          unitNumber: st.module_number || stIdx + 1,
          tag: `UNIT ${st.module_number || stIdx + 1}`,
          title: st.title,
          description: st.description || '',
          statusBadge: isStationCompleted
            ? 'SELESAI (100%)'
            : isStationActive
            ? 'SEDANG BERJALAN'
            : 'TERKUNCI',
          badgeType: isStationCompleted
            ? 'completed'
            : isStationActive
            ? 'active'
            : 'locked',
          bannerGradient: palette.gradient,
          bannerBorder: palette.border,
          parts: stationQuests,
        }
      })
    }

    // Fallback to local structured curriculum with dynamic completion checking
    const fallbackConfig = TRACK_CURRICULA[trackSlug] || TRACK_CURRICULA['golang']
    let hasFoundActiveFallback = false

    return fallbackConfig.units.map((u) => {
      const parts = u.parts.map((p) => {
        const isCompleted =
          completedSet.has(p.id) ||
          completedSet.has(`part-${p.number}`) ||
          (typeof currentPart === 'number' && p.number < currentPart)

        let partStatus: 'completed' | 'active' | 'locked'
        if (isCompleted) {
          partStatus = 'completed'
        } else if (!hasFoundActiveFallback) {
          partStatus = 'active'
          hasFoundActiveFallback = true
        } else {
          partStatus = 'locked'
        }

        return {
          ...p,
          route: `/learn/${p.id}`,
          status: partStatus,
        }
      })

      const isCompleted = parts.length > 0 && parts.every((p) => p.status === 'completed')
      const isActive = !isCompleted && parts.some((p) => p.status === 'active')

      return {
        ...u,
        parts,
        statusBadge: isCompleted
          ? 'SELESAI (100%)'
          : isActive
          ? 'SEDANG BERJALAN'
          : 'TERKUNCI',
        badgeType: isCompleted
          ? ('completed' as const)
          : isActive
          ? ('active' as const)
          : ('locked' as const),
      }
    })
  }, [roadmap, trackSlug, currentPart, completedSet])

  const handleNodeClick = (node: PathMapNode) => {
    triggerHaptic('tap')
    setActiveModalNode(node)
  }

  const handleGuidebookClick = (unit: CurriculumUnitData) => {
    triggerHaptic('tap')
    setActiveGuidebook({
      unitTitle: unit.title,
      unitNumber: unit.unitNumber,
      tag: unit.tag,
    })
  }

  // ── GENERATOR JALUR SERPENTINE BEZIER MULUS ──
  const buildSvgPath = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return ''
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`

    let path = `M ${coords[0].x} ${coords[0].y}`
    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = coords[i]
      const p2 = coords[i + 1]
      const midY = (p1.y + p2.y) / 2
      path += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`
    }
    return path
  }

  return (
    <div className={`space-y-12 sm:space-y-16 select-none ${className}`}>
      {/* ── BUKU PANDUAN BAB MODAL (GUIDEBOOK CHEATSHEET) ── */}
      <RoadmapGuidebookModal
        activeGuidebook={activeGuidebook}
        trackSlug={trackSlug}
        onClose={() => setActiveGuidebook(null)}
      />

      {/* ── INTERACTIVE LESSON MODAL / POPOVER ── */}
      <RoadmapNodeDetailModal
        node={activeModalNode}
        onClose={() => setActiveModalNode(null)}
        onStartQuest={onStartQuest}
      />

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ── UNIFIED ADVENTURE GAME STAGE (PANGGUNG KANVAS UTAMA) ───── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-2xl mx-auto w-full bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-7 relative overflow-visible space-y-12 sm:space-y-16 bg-[radial-gradient(#E2E8F0_1.2px,transparent_1.2px)] [background-size:24px_24px]">
        {units.map((unit) => {
          // Buat daftar lengkap stepping stone (Part + Peti Emas + Trofi Ujian)
          const allNodes: PathMapNode[] = [
            ...unit.parts.map((p) => ({
              id: p.id,
              title: `Part ${p.number}: ${p.title}`,
              subtitle: p.subtitle,
              number: p.number,
              xpReward: p.xpReward,
              status: p.status,
              route: p.route,
              category: p.category,
              badgeLabel: p.badgeLabel,
            })),
          ]

          // Tambahkan Milestone Peti Emas & Trofi Ujian
          const isUnitCompleted = unit.parts.every((p) => p.status === 'completed')
          const isUnitActive = unit.parts.some((p) => p.status === 'active')

          // Node Milestone Peti Hadiah
          allNodes.push({
            id: `${unit.id}-chest`,
            title: `Peti Emas Hadiah ${unit.title.split(',')[0]}`,
            subtitle: 'Klaim bonus permata dan pelindung streak untuk penyelesaian modul unit.',
            xpReward: 30,
            status: isUnitCompleted ? 'completed' : isUnitActive ? 'active' : 'locked',
            route: '/dashboard',
            isChest: true,
          })

          // Node Milestone Trofi Ujian Praktik
          allNodes.push({
            id: `${unit.id}-trophy`,
            title: `Tantangan Praktik Unit ${unit.unitNumber}`,
            subtitle: 'Uji pemahaman koding secara komprehensif untuk membuka unit berikutnya.',
            xpReward: 50,
            status: isUnitCompleted ? 'completed' : 'locked',
            route: '/courses',
            isTrophy: true,
          })

          // Tentukan koordinat Serpentine S-Curve lega untuk setiap node
          // Pola ayunan 4 titik mulus: Kiri (135px) -> Tengah (200px) -> Kanan (265px) -> Tengah (200px)
          const xSequence = [135, 200, 265, 200]
          const VERTICAL_SPACING = 175 // Jarak lega 175px mencegah tabrakan kartu & disc
          const START_Y = 135 // Margin atas 135px memberi ruang bebas sempurna untuk popover aktif (-top-28)

          const coords = allNodes.map((_, idx) => {
            const y = START_Y + idx * VERTICAL_SPACING
            const x = xSequence[idx % 4]
            return { x, y }
          })

          const totalHeight = START_Y + allNodes.length * VERTICAL_SPACING + 70
          const svgPathString = buildSvgPath(coords)

          return (
            <section key={unit.id} className="space-y-4">
              {/* ── UNIT BANNER HEADER (COMPACT DUOLINGO CHECKPOINT ARCHWAY) ── */}
              <div
                className={`max-w-xl mx-auto w-full text-white rounded-2xl px-5 py-3.5 sm:px-6 sm:py-4 shadow-[0_4px_0_0_rgba(0,0,0,0.18)] relative overflow-hidden flex items-center justify-between gap-4 border ${unit.bannerBorder} ${unit.bannerGradient}`}
              >
                {/* Glossy Glass Reflection Highlight */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/5 to-transparent rounded-t-2xl pointer-events-none" />

                {/* Decorative Subtle Ambient Glow Bubble */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

                <div className="space-y-1 min-w-0 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-brand font-black text-xs uppercase tracking-wider text-white/90">
                      UNIT {unit.unitNumber}
                    </span>
                    <span className="text-white/40 text-xs">•</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-brand font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                      {isUnitCompleted ? (
                        <>
                          <Check weight="bold" className="w-3 h-3 text-emerald-200" />
                          <span>SELESAI</span>
                        </>
                      ) : isUnitActive ? (
                        <>
                          <Sparkle weight="fill" className="w-3 h-3 text-amber-300" />
                          <span>AKTIF</span>
                        </>
                      ) : (
                        <>
                          <LockSimple weight="bold" className="w-3 h-3 text-white/80" />
                          <span>TERKUNCI</span>
                        </>
                      )}
                    </span>
                  </div>
                  <h2 className="text-xs sm:text-sm md:text-base font-brand font-black tracking-tight text-white leading-snug line-clamp-2">
                    {unit.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => handleGuidebookClick(unit)}
                  className="shrink-0 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-brand font-black text-xs px-3.5 py-2 rounded-xl border border-white/30 flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs shadow-2xs relative z-10"
                >
                  <BookOpen weight="bold" className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline">BUKU PANDUAN</span>
                  <span className="sm:hidden">PANDUAN</span>
                </button>
              </div>

              {/* ── SERPENTINE SNAKE PATH (OPEN WORLD CANVAS) ── */}
              <div className="relative py-4 sm:py-6 overflow-visible">
                {/* Soft Ambient Spotlight Glow (Biome Aura) */}
                <div
                  className={`absolute top-6 left-1/2 -translate-x-1/2 w-80 sm:w-[440px] h-[450px] -z-10 pointer-events-none rounded-full blur-3xl opacity-30 ${
                    isUnitCompleted
                      ? 'bg-emerald-400'
                      : isUnitActive
                      ? 'bg-blue-400'
                      : 'bg-indigo-400'
                  }`}
                />

                {/* Decorative Ambient Code Stamps on Margins */}
                <div className="hidden lg:block absolute left-4 top-16 text-slate-300 font-mono font-black text-2xl select-none pointer-events-none opacity-60">
                  {'{ }'}
                </div>
                <div className="hidden lg:block absolute right-4 top-28 text-slate-400 font-mono font-bold text-[10px] select-none pointer-events-none bg-white/80 border border-slate-200/80 px-2 py-1 rounded-lg shadow-2xs backdrop-blur-xs">
                  func() : tokyo_prod
                </div>
                <div className="hidden lg:block absolute left-4 bottom-24 text-slate-400 font-mono font-bold text-[10px] select-none pointer-events-none bg-white/80 border border-slate-200/80 px-2 py-1 rounded-lg shadow-2xs backdrop-blur-xs">
                  := stack alloc
                </div>
                <div className="hidden lg:block absolute right-4 bottom-16 text-slate-300 font-brand font-black text-xl select-none pointer-events-none opacity-50">
                  ⚡ +50XP
                </div>

                <div
                  className="relative w-full max-w-lg mx-auto overflow-visible"
                  style={{ height: `${totalHeight}px` }}
                >
                  {/* ── CONTINUOUS SERPENTINE SVG TRACK ── */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox={`0 0 400 ${totalHeight}`}
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    {/* Outer Subtle Ambient Glow for Active Track */}
                    {isUnitActive && (
                      <path
                        d={svgPathString}
                        stroke="#93C5FD"
                        strokeWidth="20"
                        strokeLinecap="round"
                        opacity="0.35"
                      />
                    )}

                    {/* Thick Base Foundation Track */}
                    <path
                      d={svgPathString}
                      stroke="#E2E8F0"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Inner Active / Completed Dashed Line */}
                    <path
                      d={svgPathString}
                      stroke={
                        isUnitCompleted
                          ? '#10B981'
                          : isUnitActive
                          ? '#2563EB'
                          : '#94A3B8'
                      }
                      strokeWidth="4"
                      strokeDasharray="10 12"
                      strokeLinecap="round"
                      opacity={isUnitCompleted || isUnitActive ? '0.75' : '0.4'}
                    />
                  </svg>

                  {/* ── STEPPING STONE NODES ── */}
                  {allNodes.map((node, nIdx) => (
                    <RoadmapPathNode
                      key={node.id}
                      node={node}
                      coord={coords[nIdx]}
                      onClick={handleNodeClick}
                      onStartQuest={onStartQuest}
                    />
                  ))}
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
