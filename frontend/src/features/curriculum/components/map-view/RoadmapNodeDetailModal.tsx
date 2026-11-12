import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import type { FC } from 'react'
import {
  X,
  Translate,
  Lightning,
  Diamond,
} from '@phosphor-icons/react'
import { Button3D } from "@/shared/components/ui/Button3D"
import { KodiCharacter, type KodiEmotion } from "@/shared/components/ui/KodiCharacter"
import type { PathMapNode } from "@/features/curriculum/types/roadmap"
import {
  resolveMapCategoryTokens,
  MAP_MODAL_TOKENS,
  MAP_MILESTONE_REWARDS,
} from "@/features/curriculum/tokens/roadmapTokens"
import { RoadmapModalNodeIcon } from './RoadmapNodeIcon'

export interface RoadmapNodeDetailModalProps {
  node: PathMapNode | null
  onClose: () => void
  onStartQuest?: (route: string) => void
}

/**
 * Resolves modular Kodi mascot emotion based on node state and milestone type.
 */
const resolveMascotEmotion = (node: PathMapNode): KodiEmotion => {
  if (node.isChest || node.isTrophy) return 'celebrate'
  if (node.status === 'locked') return 'thinking'
  if (node.status === 'completed') return 'happy'
  return 'coding'
}

export const RoadmapNodeDetailModal: FC<RoadmapNodeDetailModalProps> = ({
  node,
  onClose,
  onStartQuest,
}) => {
  const navigate = useNavigate()

  if (!node || typeof document === 'undefined') {
    return null
  }

  const catTokens = resolveMapCategoryTokens(node.category)
  const mascotEmotion = resolveMascotEmotion(node)

  const modalIconBg =
    node.status === 'completed'
      ? catTokens.modalIconBgCompleted
      : node.status === 'active'
      ? catTokens.modalIconBgActive
      : catTokens.modalIconBgLocked

  const handleAction = () => {
    onClose()
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

  return createPortal(
    <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl animate-pop relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer transition-colors"
        >
          <X weight="bold" className="w-4 h-4" />
        </button>

        {/* Living Mascot Character Expression */}
        <div className="flex items-center justify-center py-0.5">
          <KodiCharacter
            emotion={mascotEmotion}
            size={90}
            interactive
          />
        </div>

        <div className="flex items-center gap-3">
          <RoadmapModalNodeIcon node={node} modalIconBg={modalIconBg} />

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-400">
                {MAP_MODAL_TOKENS.statusBadge[node.status]}
              </span>
              {node.badgeLabel && (
                <span
                  className={`text-[9px] font-brand font-black uppercase px-1.5 py-0.5 rounded inline-flex items-center gap-1 ${catTokens.badgeClass}`}
                >
                  {node.category === 'language' && (
                    <Translate weight="bold" className="w-2.5 h-2.5" />
                  )}
                  <span>{node.badgeLabel}</span>
                </span>
              )}
            </div>
            <h3 className="font-brand font-black text-base text-slate-900 leading-tight mt-0.5">
              {node.title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          {node.status === 'locked'
            ? MAP_MODAL_TOKENS.lockedDescription
            : node.subtitle}
        </p>

        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-amber-700">
            <Lightning weight="fill" className="w-4 h-4 text-amber-500" />
            <span>+{node.xpReward} XP Reward</span>
          </span>
          {(node.isChest || (node.gemsReward && node.gemsReward > 0)) && (
            <span className="flex items-center gap-1 text-cyan-700 font-brand font-black">
              <Diamond weight="fill" className="w-3.5 h-3.5 text-cyan-500" />
              <span>+{node.gemsReward ?? MAP_MILESTONE_REWARDS.chestGems} Permata</span>
            </span>
          )}
        </div>

        {node.status === 'locked' ? (
          <Button3D
            variant="white"
            size="md"
            fullWidth
            onClick={onClose}
            className="text-xs py-2.5 opacity-80"
          >
            MENGERTI, TUTUP
          </Button3D>
        ) : (
          <Button3D
            variant={
              node.status === 'completed'
                ? 'emerald'
                : node.isChest || node.isTrophy
                ? 'amber'
                : catTokens.activeButtonVariant
            }
            size="md"
            fullWidth
            onClick={handleAction}
            className="text-xs py-2.5 shadow-[0_3px_0_0_#047857]"
          >
            {node.isChest
              ? node.status === 'completed'
                ? 'PETI SUDAH DIBUKA'
                : 'KLAIM PETI HADIAH'
              : node.isTrophy
              ? node.status === 'completed'
                ? 'ULANGI TANTANGAN PRAKTIK'
                : 'IKUTI TANTANGAN PRAKTIK'
              : node.status === 'completed'
              ? 'KODING ULANG (LATIHAN)'
              : `MULAI KODING SEKARANG (+${node.xpReward} XP)`}
          </Button3D>
        )}
      </div>
    </div>,
    document.body
  )
}
