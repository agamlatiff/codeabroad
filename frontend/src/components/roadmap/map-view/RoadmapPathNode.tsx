import { useNavigate } from 'react-router-dom'
import type { FC } from 'react'
import {
  Check,
  LockSimple,
  Sparkle,
  Gift,
  Trophy,
  Translate,
} from '@phosphor-icons/react'
import doodleCoding from '../../../assets/kodi/doodle-coding.png'
import { Button3D } from '../../ui/Button3D'
import type { PathMapNode } from '../../../types/roadmap'
import {
  resolveMapCategoryTokens,
  MAP_GEOMETRY,
  MAP_MILESTONE_DISC_TOKENS,
  MAP_MILESTONE_PILL_TOKENS,
} from '../../../tokens/roadmapTokens'
import { renderNodeSymbol, renderActionIcon } from './RoadmapNodeIcon'

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
  const catTokens = resolveMapCategoryTokens(node.category)
  const leftPercent = (coord.x / MAP_GEOMETRY.viewboxWidth) * 100
  const topPx = coord.y - MAP_GEOMETRY.nodeDiscRadius

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
            className={`bg-white border-2 rounded-2xl p-3 shadow-md text-center max-w-[210px] space-y-1.5 relative ${catTokens.popoverBorder}`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span
                className={`text-[10px] font-brand font-black uppercase tracking-wider flex items-center justify-center gap-1 ${catTokens.popoverLabelColor}`}
              >
                <Sparkle weight="fill" className="w-3 h-3" />
                <span>Sedang Berjalan</span>
              </span>
              {node.badgeLabel && (
                <span
                  className={`text-[9px] font-brand font-black uppercase px-1.5 py-0.5 rounded inline-flex items-center gap-1 ${catTokens.badgeClass}`}
                >
                  {node.category === 'nihongo' && (
                    <Translate weight="bold" className="w-2.5 h-2.5" />
                  )}
                  <span>{node.badgeLabel}</span>
                </span>
              )}
            </div>
            <h4 className="font-brand font-black text-xs text-slate-900 leading-snug">
              {node.title}
            </h4>
            <Button3D
              variant={catTokens.activeButtonVariant}
              size="sm"
              fullWidth
              icon={renderActionIcon(node.category)}
              onClick={handleActiveButtonClick}
              className="text-[10px] py-1.5"
            >
              {catTokens.activeButtonText}
            </Button3D>

            {/* Downward Speech Bubble Triangle */}
            <div
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-r-2 border-b-2 rotate-45 ${catTokens.popoverBorder}`}
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
            className={`w-18 h-18 rounded-2xl flex items-center justify-center transition-all active:shadow-none active:translate-y-1 border-2 ${
              node.status === 'completed'
                ? MAP_MILESTONE_DISC_TOKENS.chest.completed
                : node.status === 'active'
                ? MAP_MILESTONE_DISC_TOKENS.chest.active
                : MAP_MILESTONE_DISC_TOKENS.chest.locked
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
            className={`w-18 h-18 rounded-2xl flex items-center justify-center transition-all active:shadow-none active:translate-y-1 border-2 ${
              node.status === 'completed'
                ? MAP_MILESTONE_DISC_TOKENS.trophy.completed
                : MAP_MILESTONE_DISC_TOKENS.trophy.locked
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
              className={`w-16 h-16 rounded-full hover:brightness-105 active:translate-y-1 text-white font-brand font-black text-2xl active:shadow-none flex items-center justify-center transition-all group-hover:scale-105 ${catTokens.discCompleted}`}
            >
              {renderNodeSymbol(node, 'w-7 h-7')}
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
              <Check weight="bold" className="w-3.5 h-3.5 stroke-[2]" />
            </div>
          </div>
        ) : node.status === 'active' ? (
          /* 3D Active Lesson Node with Pulsing Ring */
          <div className="relative">
            <div
              className={`w-18 h-18 rounded-full hover:brightness-105 active:translate-y-1 text-white font-brand font-black text-3xl active:shadow-none flex items-center justify-center transition-all group-hover:scale-105 ${catTokens.discActive}`}
            >
              {renderNodeSymbol(node, 'w-8 h-8')}
            </div>
          </div>
        ) : (
          /* 3D Locked Lesson Node */
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-full active:translate-y-1 text-slate-400 font-brand font-black text-2xl active:shadow-none flex items-center justify-center transition-all ${MAP_MILESTONE_DISC_TOKENS.lockedLesson}`}
            >
              {renderNodeSymbol(node, 'w-7 h-7 text-slate-400')}
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-slate-600 shadow-2xs">
              <LockSimple weight="bold" className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>

      {/* ── COLLISION-FREE PILLS & LABELS ── */}
      {node.isChest ? (
        <div
          className={`mt-2.5 z-20 rounded-full px-2.5 py-0.5 text-center shadow-2xs inline-flex items-center gap-1 ${MAP_MILESTONE_PILL_TOKENS.chest}`}
        >
          <Gift weight="fill" className="w-3 h-3 text-amber-700" />
          <span className="font-brand font-black text-[10px]">
            {node.status === 'completed' ? 'Diklaim (+30 XP)' : 'Peti Hadiah (+30 XP)'}
          </span>
        </div>
      ) : node.isTrophy ? (
        <div
          className={`mt-2.5 z-20 rounded-full px-2.5 py-0.5 text-center shadow-2xs inline-flex items-center gap-1 ${MAP_MILESTONE_PILL_TOKENS.trophy}`}
        >
          <Trophy weight="fill" className="w-3 h-3 text-yellow-700" />
          <span className="font-brand font-black text-[10px]">
            {node.status === 'completed' ? 'Lulus (+50 XP)' : 'Ujian Praktik (+50 XP)'}
          </span>
        </div>
      ) : node.status !== 'active' ? (
        <div className="mt-2 z-20 max-w-[170px] bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl px-2.5 py-1 text-center shadow-2xs group-hover:border-blue-400 transition-colors">
          {node.badgeLabel && (
            <span
              className={`text-[9px] font-brand font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md inline-flex items-center gap-1 mb-0.5 ${catTokens.badgeClass}`}
            >
              {node.category === 'nihongo' && (
                <Translate weight="bold" className="w-2.5 h-2.5" />
              )}
              <span>{node.badgeLabel}</span>
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
