import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import type { FC } from 'react'
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

export interface RoadmapNodeDetailModalProps {
  node: PathMapNode | null
  onClose: () => void
  onStartQuest?: (route: string) => void
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
            src={
              node.isChest || node.isTrophy
                ? doodleCelebrate
                : node.status === 'locked'
                ? doodleThinking
                : node.status === 'completed'
                ? doodleProud
                : doodleCoding
            }
            alt="Kodi Maskot"
            className="w-20 h-20 object-contain drop-shadow-md animate-bounce-subtle"
          />
        </div>

        <div className="flex items-center gap-3">
          {node.isChest ? (
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs">
              <Gift weight="fill" className="w-6 h-6" />
            </div>
          ) : node.isTrophy ? (
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center text-yellow-700 shadow-2xs">
              <Trophy weight="fill" className="w-6 h-6" />
            </div>
          ) : node.category === 'nihongo' ? (
            <div
              className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-brand font-black text-xl shadow-2xs ${
                node.status === 'completed'
                  ? 'bg-rose-100 border-rose-300 text-rose-700'
                  : node.status === 'active'
                  ? 'bg-rose-500 border-rose-600 text-white shadow-[0_3px_0_0_#9F1239]'
                  : 'bg-slate-100 border-slate-300 text-slate-500'
              }`}
            >
              <Translate weight="bold" className="w-6 h-6" />
            </div>
          ) : node.category === 'integration' ? (
            <div
              className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-brand font-black text-xl shadow-2xs ${
                node.status === 'completed'
                  ? 'bg-cyan-100 border-cyan-300 text-cyan-700'
                  : node.status === 'active'
                  ? 'bg-cyan-600 border-cyan-700 text-white shadow-[0_3px_0_0_#0E7490]'
                  : 'bg-slate-100 border-slate-300 text-slate-500'
              }`}
            >
              <ArrowsLeftRight weight="bold" className="w-6 h-6" />
            </div>
          ) : node.category === 'devops' ? (
            <div
              className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-brand font-black text-xl shadow-2xs ${
                node.status === 'completed'
                  ? 'bg-amber-100 border-amber-300 text-amber-700'
                  : node.status === 'active'
                  ? 'bg-amber-600 border-amber-700 text-white shadow-[0_3px_0_0_#B45309]'
                  : 'bg-slate-100 border-slate-300 text-slate-500'
              }`}
            >
              <Cpu weight="fill" className="w-6 h-6" />
            </div>
          ) : (
            <div
              className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-brand font-black text-xl shadow-2xs ${
                node.status === 'completed'
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                  : node.status === 'active'
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-slate-100 border-slate-300 text-slate-500'
              }`}
            >
              {node.status === 'completed' ? (
                <Check weight="bold" className="w-6 h-6 text-emerald-600" />
              ) : (
                node.number
              )}
            </div>
          )}

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
                  className={`text-[9px] font-brand font-black uppercase px-1.5 py-0.5 rounded ${
                    node.category === 'nihongo'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : node.category === 'integration'
                      ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                      : node.category === 'devops'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
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
                : node.category === 'nihongo'
                ? 'rose'
                : node.category === 'integration'
                ? 'cyan'
                : 'blue'
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
