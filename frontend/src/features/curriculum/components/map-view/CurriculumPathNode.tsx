import { useNavigate } from 'react-router-dom'
import { memo, type FC, type KeyboardEvent, type MouseEvent } from 'react'
import {
  Check,
  LockSimple,
  Sparkle,
  Gift,
  Trophy,
  Translate,
} from '@phosphor-icons/react'
import { KodiCharacter } from "@/shared/components/ui/KodiCharacter"
import { Button3D } from "@/shared/components/ui/Button3D"
import type { PathMapNode } from "@/features/curriculum/types/curriculum"
import { playSound } from "@/shared/utils/sound"
import {
  resolveMapCategoryTokens,
  MAP_GEOMETRY,
  MAP_MILESTONE_DISC_TOKENS,
  MAP_MILESTONE_PILL_TOKENS,
} from "@/features/curriculum/tokens/curriculumTokens"
import { renderNodeSymbol, renderActionIcon } from './CurriculumNodeIcon'

export interface CurriculumPathNodeProps {
  node: PathMapNode
  coord: { x: number; y: number }
  onClick: (node: PathMapNode) => void
  onStartLesson?: (route: string) => void
}

export const CurriculumPathNode: FC<CurriculumPathNodeProps> = memo(({
  node,
  coord,
  onClick,
  onStartLesson,
}) => {
  const navigate = useNavigate()
  const catTokens = resolveMapCategoryTokens(node.category)
  const leftPercent = (coord.x / MAP_GEOMETRY.viewboxWidth) * 100
  const topPx = coord.y - MAP_GEOMETRY.nodeDiscRadius

  const handleActiveButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const targetRoute = node.route || `/learn/${node.id}`

    if (onStartLesson) {
      onStartLesson(targetRoute)
    } else {
      navigate(targetRoute)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(node)
    }
  }

  return (
    <div
      className="absolute -translate-x-1/2 flex flex-col items-center group"
      style={{
        left: `${leftPercent}%`,
        top: `${topPx}px`,
      }}
      onMouseEnter={() => playSound('node_hover')}
    >
      {/* ── DUOLINGO FLOATING POPOVER CARD FOR ACTIVE LESSON ── */}
      {node.status === 'active' && !node.isChest && !node.isTrophy && (
        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center select-none animate-bounce-subtle pointer-events-auto">
          <div
            className={`bg-white border-2 rounded-2xl p-4 shadow-lg text-center w-[288px] sm:w-[304px] space-y-2.5 relative ${catTokens.popoverBorder}`}
          >
            {/* Upward Speech Bubble Triangle */}
            <div
              className={`absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-l-2 border-t-2 rotate-45 ${catTokens.popoverBorder}`}
            />

            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-[11px] font-brand font-black uppercase tracking-wider inline-flex items-center gap-1 whitespace-nowrap ${catTokens.popoverLabelColor}`}
              >
                <Sparkle weight="fill" className="w-3.5 h-3.5 shrink-0" />
                <span>Sedang Dipelajari</span>
              </span>
              {(node.totalExercises ?? 0) > 0 ? (
                <span
                  className={`text-[11px] font-brand font-black px-2.5 py-0.5 rounded-md tabular-nums whitespace-nowrap shrink-0 ${catTokens.badgeClass}`}
                >
                  {node.completedExercises ?? 0}/{node.totalExercises} Soal
                </span>
              ) : node.badgeLabel ? (
                <span
                  className={`text-[10px] font-brand font-black uppercase px-2 py-0.5 rounded inline-flex items-center gap-1 whitespace-nowrap shrink-0 ${catTokens.badgeClass}`}
                >
                  {node.category === 'language' && (
                    <Translate weight="bold" className="w-3 h-3" />
                  )}
                  <span>{node.badgeLabel}</span>
                </span>
              ) : null}
            </div>
            <h4 className="font-brand font-black text-sm text-slate-900 leading-snug">
              {node.title}
            </h4>
            <Button3D
              variant={catTokens.activeButtonVariant}
              size="md"
              fullWidth
              icon={renderActionIcon(node.category)}
              onClick={handleActiveButtonClick}
              className="text-xs py-2.5 whitespace-nowrap"
            >
              {catTokens.activeButtonText}
            </Button3D>
          </div>
        </div>
      )}

      {/* ── LIVING KODI COMPANION BESIDE ACTIVE LESSON ── */}
      {node.status === 'active' && !node.isChest && !node.isTrophy && (
        <div
          className={`absolute ${
            coord.x > 200 ? '-left-40 sm:-left-44' : '-right-40 sm:-right-44'
          } -top-5 hidden md:flex flex-col items-center select-none z-20`}
        >
          <KodiCharacter
            emotion="studying"
            size={96}
            interactive
            showSpeechBubble
            speechText="Ayo lanjut!"
          />
        </div>
      )}

      {/* ── STEPPING STONE 3D DISC ── */}
      <div
        role="button"
        tabIndex={0}
        data-tour={
          node.status === 'active' && !node.isChest && !node.isTrophy
            ? 'active-lesson-node'
            : undefined
        }
        aria-label={`${node.title} (${node.status === 'completed' ? 'selesai' : node.status === 'active' ? 'aktif' : 'terkunci'})`}
        onClick={() => onClick(node)}
        onKeyDown={handleKeyDown}
        className="relative z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/50 rounded-3xl"
      >
        {node.isChest ? (
          <div
            className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all active:shadow-none active:translate-y-1 border-2 ${
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
              className={`w-11 h-11 drop-shadow-xs ${
                node.status === 'locked' ? 'text-slate-400' : 'text-amber-950'
              }`}
            />
            {node.status === 'completed' && (
              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
                <Check weight="bold" className="w-4 h-4" />
              </div>
            )}
          </div>
        ) : node.isTrophy ? (
          <div
            className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all active:shadow-none active:translate-y-1 border-2 ${
              node.status === 'completed'
                ? MAP_MILESTONE_DISC_TOKENS.trophy.completed
                : MAP_MILESTONE_DISC_TOKENS.trophy.locked
            }`}
            title={node.title}
          >
            <Trophy
              weight="fill"
              className={`w-11 h-11 drop-shadow-xs ${
                node.status === 'completed' ? 'text-amber-950' : 'text-slate-400'
              }`}
            />
            {node.status === 'completed' && (
              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
                <Check weight="bold" className="w-4 h-4" />
              </div>
            )}
          </div>
        ) : node.status === 'completed' ? (
          <div className="relative">
            <div
              className={`w-[84px] h-[84px] rounded-full hover:brightness-105 active:translate-y-1 text-white font-brand font-black text-3xl active:shadow-none flex items-center justify-center transition-all group-hover:scale-105 ${catTokens.discCompleted}`}
            >
              {renderNodeSymbol(node, 'w-10 h-10')}
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
              <Check weight="bold" className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
        ) : node.status === 'active' ? (
          <div className="relative">
            <div
              className={`w-24 h-24 rounded-full hover:brightness-105 active:translate-y-1 text-white font-brand font-black text-4xl active:shadow-none flex items-center justify-center transition-all group-hover:scale-105 ${catTokens.discActive}`}
            >
              {renderNodeSymbol(node, 'w-11 h-11')}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div
              className={`w-[84px] h-[84px] rounded-full active:translate-y-1 text-slate-400 font-brand font-black text-3xl active:shadow-none flex items-center justify-center transition-all ${MAP_MILESTONE_DISC_TOKENS.lockedLesson}`}
            >
              {renderNodeSymbol(node, 'w-10 h-10 text-slate-400')}
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-slate-600 shadow-2xs">
              <LockSimple weight="bold" className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* ── COLLISION-FREE PILLS & LABELS ── */}
      {node.isTrophy ? (
        <div
          className={`mt-3 z-20 rounded-full px-3.5 py-1 text-center shadow-2xs inline-flex items-center gap-1.5 ${MAP_MILESTONE_PILL_TOKENS.trophy}`}
        >
          <Trophy weight="fill" className="w-3.5 h-3.5 text-yellow-700" />
          <span className="font-brand font-black text-xs">
            {node.status === 'completed'
              ? `Lulus (+${node.xpReward} XP)`
              : `Ujian Unit (+${node.xpReward} XP)`}
          </span>
        </div>
      ) : node.status !== 'active' ? (
        <div className="mt-3 z-20 max-w-[205px] bg-white/95 backdrop-blur-xs border-2 border-slate-200/90 rounded-2xl px-4 py-2 text-center shadow-2xs group-hover:border-blue-400 transition-colors">
          <h5 className="font-brand font-black text-[13px] sm:text-sm text-slate-900 leading-tight line-clamp-2">
            {node.shortTitle || node.title}
          </h5>
          <span
            className={`text-[11px] sm:text-xs font-bold block mt-0.5 tabular-nums ${
              node.status === 'completed' ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            {(node.totalExercises ?? 0) > 0
              ? node.status === 'completed'
                ? `${node.completedExercises ?? node.totalExercises}/${node.totalExercises} • Selesai`
                : `${node.completedExercises ?? 0}/${node.totalExercises}`
              : node.status === 'completed'
                ? `Selesai (+${node.xpReward} XP)`
                : 'Terkunci'}
          </span>
        </div>
      ) : null}
    </div>
  )
})

