import { useNavigate } from 'react-router-dom'
import type { FC } from 'react'
import {
  Check,
  LockSimple,
  Sparkle,
  Gift,
  Trophy,
  Translate,
  ArrowsLeftRight,
  Cpu,
} from '@phosphor-icons/react'
import doodleCoding from '../../../assets/kodi/doodle-coding.png'
import { Button3D } from '../../ui/Button3D'
import type { PathMapNode } from '../../../data/roadmapMapFallback'

export interface RoadmapPathNodeProps {
  node: PathMapNode
  coord: { x: number; y: number }
  onClick: (node: PathMapNode) => void
  onStartQuest?: (route: string) => void
}

export const RoadmapPathNode: FC<RoadmapPathNodeProps> = ({
  node,
  coord,
  onClick,
  onStartQuest,
}) => {
  const navigate = useNavigate()
  const leftPercent = (coord.x / 400) * 100
  const topPx = coord.y - 36 // Center the 72px disc

  const handleActiveButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const targetRoute =
      node.route && node.route !== '/courses'
        ? node.route
        : `/learn/${node.id}`

    if (onStartQuest) {
      onStartQuest(targetRoute)
    } else {
      navigate(targetRoute)
    }
  }

  return (
    <div
      className="absolute -translate-x-1/2 flex flex-col items-center group cursor-pointer"
      style={{
        left: `${leftPercent}%`,
        top: `${topPx}px`,
      }}
      onClick={() => onClick(node)}
    >
      {/* ── DUOLINGO FLOATING POPOVER CARD FOR ACTIVE LESSON ── */}
      {node.status === 'active' && !node.isChest && !node.isTrophy && (
        <div className="absolute -top-28 z-30 flex flex-col items-center select-none animate-bounce-subtle pointer-events-auto">
          <div
            className={`bg-white border-2 rounded-2xl p-3 shadow-md text-center max-w-[210px] space-y-1.5 relative ${
              node.category === 'nihongo'
                ? 'border-rose-400'
                : node.category === 'integration'
                ? 'border-cyan-400'
                : node.category === 'devops'
                ? 'border-amber-400'
                : 'border-blue-400'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span
                className={`text-[10px] font-brand font-black uppercase tracking-wider flex items-center justify-center gap-1 ${
                  node.category === 'nihongo'
                    ? 'text-rose-600'
                    : node.category === 'integration'
                    ? 'text-cyan-600'
                    : node.category === 'devops'
                    ? 'text-amber-600'
                    : 'text-blue-600'
                }`}
              >
                <Sparkle weight="fill" className="w-3 h-3" />
                <span>Sedang Berjalan</span>
              </span>
              {node.badgeLabel && (
                <span
                  className={`text-[9px] font-brand font-black uppercase px-1 py-0.2 rounded ${
                    node.category === 'nihongo'
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : node.category === 'integration'
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {node.badgeLabel}
                </span>
              )}
            </div>
            <h4 className="font-brand font-black text-xs text-slate-900 leading-snug">
              {node.title}
            </h4>
            <Button3D
              variant={
                node.category === 'nihongo'
                  ? 'rose'
                  : node.category === 'integration'
                  ? 'cyan'
                  : 'blue'
              }
              size="sm"
              fullWidth
              onClick={handleActiveButtonClick}
              className="text-[10px] py-1.5"
            >
              {node.category === 'nihongo'
                ? 'MULAI NIHONGO 🌸'
                : node.category === 'integration'
                ? 'HANDSHAKE FITUR 🔗'
                : 'LANJUTKAN KODING 💻'}
            </Button3D>

            {/* Downward Speech Bubble Triangle */}
            <div
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-r-2 border-b-2 rotate-45 ${
                node.category === 'nihongo'
                  ? 'border-rose-400'
                  : node.category === 'integration'
                  ? 'border-cyan-400'
                  : node.category === 'devops'
                  ? 'border-amber-400'
                  : 'border-blue-400'
              }`}
            />
          </div>
        </div>
      )}

      {/* ── KODI CHEERING COMPANION BESIDE ACTIVE LESSON ── */}
      {node.status === 'active' && (
        <div
          className={`absolute ${
            coord.x > 200 ? '-left-32 sm:-left-36' : '-right-32 sm:-right-36'
          } top-2 hidden md:flex flex-col items-center select-none z-20 pointer-events-none`}
        >
          <div className="relative flex flex-col items-center animate-bounce-subtle">
            <img
              src={doodleCoding}
              alt="Kodi Ngoding"
              className="w-16 h-16 object-contain drop-shadow-md transition-transform hover:-translate-y-1"
            />
            <div className="w-14 h-2.5 bg-slate-300/60 rounded-[50%] blur-2xs -mt-1" />
          </div>
        </div>
      )}

      {/* ── STEPPING STONE 3D DISC ── */}
      <div className="relative z-10">
        {node.isChest ? (
          /* 3D Milestone Chest Node */
          <div
            className={`w-18 h-18 rounded-2xl flex items-center justify-center transition-all shadow-[0_5px_0_0_#B45309] active:shadow-none active:translate-y-1 border-2 ${
              node.status === 'completed'
                ? 'bg-gradient-to-b from-amber-300 to-amber-500 border-amber-600 shadow-[0_5px_0_0_#92400E]'
                : node.status === 'active'
                ? 'bg-gradient-to-b from-amber-400 to-orange-500 border-amber-600 ring-4 ring-amber-200 animate-pulse'
                : 'bg-slate-100 border-slate-300 shadow-[0_4px_0_0_#CBD5E1]'
            }`}
            title={node.title}
          >
            <Gift
              weight="fill"
              className={`w-9 h-9 drop-shadow-xs ${
                node.status === 'locked' ? 'text-slate-400' : 'text-amber-950'
              }`}
            />
            {node.status === 'completed' && (
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
                <Check weight="bold" className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ) : node.isTrophy ? (
          /* 3D Milestone Trophy Node */
          <div
            className={`w-18 h-18 rounded-2xl flex items-center justify-center transition-all shadow-[0_5px_0_0_#CA8A04] active:shadow-none active:translate-y-1 border-2 ${
              node.status === 'completed'
                ? 'bg-gradient-to-b from-yellow-300 to-amber-500 border-yellow-600 shadow-[0_5px_0_0_#A16207]'
                : 'bg-slate-100 border-slate-300 shadow-[0_4px_0_0_#CBD5E1]'
            }`}
            title={node.title}
          >
            <Trophy
              weight="fill"
              className={`w-9 h-9 drop-shadow-xs ${
                node.status === 'completed' ? 'text-amber-950' : 'text-slate-400'
              }`}
            />
            {node.status === 'completed' && (
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
                <Check weight="bold" className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ) : node.status === 'completed' ? (
          /* 3D Completed Lesson Node */
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-full hover:brightness-105 active:translate-y-1 text-white font-brand font-black text-2xl active:shadow-none flex items-center justify-center transition-all group-hover:scale-105 ${
                node.category === 'nihongo'
                  ? 'bg-rose-500 shadow-[0_5px_0_0_#9F1239]'
                  : node.category === 'integration'
                  ? 'bg-cyan-600 shadow-[0_5px_0_0_#0E7490]'
                  : node.category === 'devops'
                  ? 'bg-amber-600 shadow-[0_5px_0_0_#B45309]'
                  : 'bg-emerald-500 shadow-[0_5px_0_0_#047857]'
              }`}
            >
              {node.category === 'nihongo' ? (
                <Translate weight="bold" className="w-7 h-7" />
              ) : node.category === 'integration' ? (
                <ArrowsLeftRight weight="bold" className="w-7 h-7" />
              ) : node.category === 'devops' ? (
                <Cpu weight="fill" className="w-7 h-7" />
              ) : (
                <span>{node.number}</span>
              )}
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
              <Check weight="bold" className="w-3.5 h-3.5 stroke-[2]" />
            </div>
          </div>
        ) : node.status === 'active' ? (
          /* 3D Active Lesson Node with Pulsing Ring */
          <div className="relative">
            <div
              className={`w-18 h-18 rounded-full hover:brightness-105 active:translate-y-1 text-white font-brand font-black text-3xl active:shadow-none flex items-center justify-center transition-all group-hover:scale-105 ${
                node.category === 'nihongo'
                  ? 'bg-rose-500 shadow-[0_6px_0_0_#BE123C] ring-8 ring-rose-100'
                  : node.category === 'integration'
                  ? 'bg-cyan-600 shadow-[0_6px_0_0_#0E7490] ring-8 ring-cyan-100'
                  : node.category === 'devops'
                  ? 'bg-amber-600 shadow-[0_6px_0_0_#B45309] ring-8 ring-amber-100'
                  : 'bg-blue-600 shadow-[0_6px_0_0_#1D4ED8] ring-8 ring-blue-100'
              }`}
            >
              {node.category === 'nihongo' ? (
                <Translate weight="bold" className="w-8 h-8" />
              ) : node.category === 'integration' ? (
                <ArrowsLeftRight weight="bold" className="w-8 h-8" />
              ) : node.category === 'devops' ? (
                <Cpu weight="fill" className="w-8 h-8" />
              ) : (
                <span>{node.number}</span>
              )}
            </div>
          </div>
        ) : (
          /* 3D Locked Lesson Node */
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-slate-100 hover:bg-slate-200 active:translate-y-1 text-slate-400 font-brand font-black text-2xl border-2 border-slate-200 shadow-[0_4px_0_0_#CBD5E1] active:shadow-none flex items-center justify-center transition-all">
              {node.category === 'nihongo' ? (
                <Translate weight="bold" className="w-7 h-7 text-slate-400" />
              ) : node.category === 'integration' ? (
                <ArrowsLeftRight weight="bold" className="w-7 h-7 text-slate-400" />
              ) : node.category === 'devops' ? (
                <Cpu weight="fill" className="w-7 h-7 text-slate-400" />
              ) : (
                <span>{node.number}</span>
              )}
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-slate-600 shadow-2xs">
              <LockSimple weight="bold" className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>

      {/* ── COLLISION-FREE PILLS & LABELS ── */}
      {node.isChest ? (
        <div className="mt-2.5 z-20 bg-amber-50 border border-amber-200/90 rounded-full px-3 py-0.5 text-center shadow-2xs">
          <span className="font-brand font-black text-[10px] text-amber-800">
            {node.status === 'completed' ? '🎁 Diklaim (+30 XP)' : '🎁 Peti Hadiah (+30 XP)'}
          </span>
        </div>
      ) : node.isTrophy ? (
        <div className="mt-2.5 z-20 bg-yellow-50 border border-yellow-200/90 rounded-full px-3 py-0.5 text-center shadow-2xs">
          <span className="font-brand font-black text-[10px] text-yellow-800">
            {node.status === 'completed' ? '🏆 Lulus (+50 XP)' : '🏆 Ujian Praktik (+50 XP)'}
          </span>
        </div>
      ) : node.status !== 'active' ? (
        <div className="mt-2 z-20 max-w-[170px] bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl px-2.5 py-1 text-center shadow-2xs group-hover:border-blue-400 transition-colors">
          {node.badgeLabel && (
            <span
              className={`text-[9px] font-brand font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md inline-block mb-0.5 ${
                node.category === 'nihongo'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {node.badgeLabel}
            </span>
          )}
          <h5 className="font-brand font-black text-[11px] text-slate-900 leading-snug line-clamp-2">
            {node.title}
          </h5>
          <span
            className={`text-[10px] font-bold block mt-0.5 ${
              node.status === 'completed' ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            {node.status === 'completed'
              ? `Selesai (+${node.xpReward} XP)`
              : 'Terkunci'}
          </span>
        </div>
      ) : null}
    </div>
  )
}
