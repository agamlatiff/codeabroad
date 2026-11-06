import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import type { FC, ReactNode } from 'react'
import {
  X,
  Gift,
  Trophy,
  Translate,
  ArrowsLeftRight,
  Cpu,
  Check,
  Lightning,
} from '@phosphor-icons/react'
import doodleCoding from '../../../assets/kodi/doodle-coding.png'
import doodleThinking from '../../../assets/kodi/doodle-thinking.png'
import doodleCelebrate from '../../../assets/kodi/doodle-celebrate.png'
import doodleProud from '../../../assets/kodi/doodle-proud.png'
import { Button3D } from '../../ui/Button3D'
import type { PathMapNode } from '../../../data/roadmapMapFallback'
import { resolveMapCategoryTokens } from '../../../tokens/roadmapTokens'

export interface RoadmapNodeDetailModalProps {
  node: PathMapNode | null
  onClose: () => void
  onStartQuest?: (route: string) => void
}

/**
 * Resolves Kodi mascot emotion asset based on node state and milestone type.
 */
const resolveMascotImage = (node: PathMapNode): string => {
  if (node.isChest || node.isTrophy) return doodleCelebrate
  if (node.status === 'locked') return doodleThinking
  if (node.status === 'completed') return doodleProud
  return doodleCoding
}

/**
 * Renders the leading icon for the modal node summary.
 */
const renderModalNodeIcon = (
  node: PathMapNode,
  modalIconBg: string
): ReactNode => {
  if (node.isChest) {
    return (
      <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs">
        <Gift weight="fill" className="w-6 h-6" />
      </div>
    )
  }
  if (node.isTrophy) {
    return (
      <div className="w-12 h-12 rounded-2xl bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center text-yellow-700 shadow-2xs">
        <Trophy weight="fill" className="w-6 h-6" />
      </div>
    )
  }
  if (node.category === 'nihongo') {
    return (
      <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-brand font-black text-xl shadow-2xs ${modalIconBg}`}>
        <Translate weight="bold" className="w-6 h-6" />
      </div>
    )
  }
  if (node.category === 'integration') {
    return (
      <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-brand font-black text-xl shadow-2xs ${modalIconBg}`}>
        <ArrowsLeftRight weight="bold" className="w-6 h-6" />
      </div>
    )
  }
  if (node.category === 'devops') {
    return (
      <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-brand font-black text-xl shadow-2xs ${modalIconBg}`}>
        <Cpu weight="fill" className="w-6 h-6" />
      </div>
    )
  }
  return (
    <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-brand font-black text-xl shadow-2xs ${modalIconBg}`}>
      {node.status === 'completed' ? (
        <Check weight="bold" className="w-6 h-6 text-emerald-600" />
      ) : (
        node.number
      )}
    </div>
  )
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
  const mascotSrc = resolveMascotImage(node)

  const modalIconBg =
    node.status === 'completed'
      ? catTokens.modalIconBgCompleted
      : node.status === 'active'
      ? catTokens.modalIconBgActive
      : 'bg-slate-100 border-slate-300 text-slate-500'

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

        {/* Mascot Character Expression */}
        <div className="flex items-center justify-center py-1">
          <img
            src={mascotSrc}
            alt="Kodi Maskot"
            className="w-20 h-20 object-contain drop-shadow-md animate-bounce-subtle"
          />
        </div>

        <div className="flex items-center gap-3">
          {renderModalNodeIcon(node, modalIconBg)}

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-400">
                {node.status === 'completed'
                  ? 'Selesai 100%'
                  : node.status === 'active'
                  ? 'Sedang Berjalan'
                  : 'Modul Terkunci'}
              </span>
              {node.badgeLabel && (
                <span
                  className={`text-[9px] font-brand font-black uppercase px-1.5 py-0.5 rounded ${catTokens.badgeClass}`}
                >
                  {node.badgeLabel}
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
            ? 'Materi ini masih terkunci. Selesaikan modul koding sebelumnya terlebih dahulu agar pemahaman teknismu berurutan dan solid.'
            : node.subtitle}
        </p>

        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-amber-700">
            <Lightning weight="fill" className="w-4 h-4 text-amber-500" />
            <span>+{node.xpReward} XP Reward</span>
          </span>
          {node.isChest && <span className="text-amber-600">+20 💎 Permata</span>}
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
                : catTokens.activeButtonVariant
            }
            size="md"
            fullWidth
            onClick={handleAction}
            className="text-xs py-2.5 shadow-[0_3px_0_0_#047857]"
          >
            {node.status === 'completed'
              ? 'KODING ULANG (LATIHAN)'
              : 'MULAI KODING SEKARANG (+50 XP)'}
          </Button3D>
        )}
      </div>
    </div>,
    document.body
  )
}
